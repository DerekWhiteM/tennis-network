import { redirect } from "@sveltejs/kit";
import { userService } from "#src/lib/server/users/user-service.js";
import { userRepository } from "#src/lib/server/users/user-repository.js";
import type { Actions, PageServerLoadEvent, RequestEvent } from "./$types";
import { createSession, generateSessionToken, setSessionTokenCookie } from "#src/lib/server/session.js";

export function load(event: PageServerLoadEvent) {
	if (event.locals.session !== null && event.locals.user !== null) {
		return redirect(302, "/");
	}
	return {};
}

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const formData = await event.request.formData();
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Verify password
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw "User not found";
        }

        if (!(await userService.verifyPassword(password, user.password_hash))) {
            throw "Incorrect password";
        }

        // Create session
        const sessionToken = generateSessionToken();
	    const session = await createSession(sessionToken, user.user_id);
	    setSessionTokenCookie(event, sessionToken, session.expires_at);

        return redirect(302, "/");
    },
};
