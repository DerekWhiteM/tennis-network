import knex from "./knex";
import type { Session, User } from "./types";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { RequestEvent } from "@sveltejs/kit";

type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };

export async function validateSessionToken(token: string) {
	const session_id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const rows = await knex.table("sessions").select("session_id", "user_id", "created_at").where("session_id", session_id);
	const session = rows[0] as Session;

	if (row === null) {
		return { session: null, user: null };
	}

	if (Date.now() >= session.expires_at.getTime()) {
		db.execute("DELETE FROM session WHERE id = ?", [session.id]);
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		db.execute("UPDATE session SET expires_at = ? WHERE session.id = ?", [
			Math.floor(session.expiresAt.getTime() / 1000),
			session.id
		]);
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