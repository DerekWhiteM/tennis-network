import { redirect } from "@sveltejs/kit";
import { userRepository } from "$lib/server/users/user-repository";
import type { PageServerLoadEvent } from "./$types";

export async function load(event: PageServerLoadEvent) {
	if (event.locals.session === null && event.locals.user === null) {
		return redirect(302, "/login");
	}
}