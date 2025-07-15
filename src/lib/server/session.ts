import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import knex from "./knex";
import type { RequestEvent } from "@sveltejs/kit";
import type { Session, UserDTO } from "./types";

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const session_id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const rows = await knex
        .select(
            "sessions.session_id",
            "sessions.user_id",
            "sessions.expires_at",
            "users.first_name",
            "users.last_name",
            "users.email",
            "users.type",
            "users.created_at")
        .from("sessions")
        .join("users", "users.user_id", "=", "sessions.user_id")
        .where("session_id", session_id);
    const row = rows[0];

    if (!row) {
        return { session: null, user: null };
    }

    const session: Session = {
        session_id: row.session_id,
        user_id: row.user_id,
        expires_at: row.expires_at,
    }

    const user: UserDTO = {
        user_id: row.user_id,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        type: row.type,
        created_at: row.created_at,
    }

    if (Date.now() >= session.expires_at.getTime()) {
        await knex.table("sessions").del().where("session_id", session.session_id);
        return { session: null, user: null };
    }

    if (Date.now() >= session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await knex.table("sessions").where("session_id", session.session_id).update("expires_at", Math.floor(session.expires_at.getTime() / 1000));
    }

    return { session, user };
}

export async function invalidateSession(session_id: string) {
    await knex.table("sessions").del().where("session_id", session_id);
}

export async function invalidateUserSessions(user_id: number) {
    await knex.table("sessions").del().where("user_id", user_id);
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
    event.cookies.set("session", token, {
        httpOnly: true,
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
        expires: expiresAt
    });
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
    event.cookies.set("session", "", {
        httpOnly: true,
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
        maxAge: 0
    });
}

export function generateSessionToken(): string {
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
    return token;
}

export async function createSession(token: string, user_id: number): Promise<Session> {
    const session_id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
        session_id,
        user_id,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    };
    await knex.table("sessions").insert(session);
    return session;
}

type SessionValidationResult = { session: Session; user: UserDTO } | { session: null; user: null };
