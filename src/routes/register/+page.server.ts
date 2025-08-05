import { fail, redirect, type Actions } from "@sveltejs/kit";
import { userService } from "$lib/server/users/user-service";

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const firstName = formData.get("first_name")?.toString().trim();
        const lastName = formData.get("last_name")?.toString().trim();
        const emailAddress = formData.get("email")?.toString().trim();
        const password = formData.get("password")?.toString();
        const confirmPassword = formData.get("confirm_password")?.toString();

        if (!firstName || !lastName || !emailAddress || !password || !confirmPassword) {
            return fail(400, { message: "All fields are required." });
        }

        if (password !== confirmPassword) {
            return fail(400, { message: "Passwords do not match." });
        }

        try {
            await userService.register({
                first_name: firstName,
                last_name: lastName,
                email: emailAddress,
                password: password,
                confirm_password: confirmPassword,
                type: "standard",
            });
        } catch (e: any) {
            return fail(400, { message: "Registration failed." });
        }

        return redirect(303, "/login");
    }
};
