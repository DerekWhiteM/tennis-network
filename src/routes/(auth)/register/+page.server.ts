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

        // Handle optional location
        const latitude = formData.get("latitude")?.toString();
        const longitude = formData.get("longitude")?.toString();
        let location = undefined;
        if (latitude && longitude && latitude !== '' && longitude !== '') {
            const latNum = Number(latitude);
            const lonNum = Number(longitude);
            if (!isNaN(latNum) && !isNaN(lonNum)) {
                // Pass as string for now; userService/userRepository will convert to knex.raw
                location = { latitude: latNum, longitude: lonNum };
            }
        }
        try {
            await userService.register({
                first_name: firstName,
                last_name: lastName,
                email: emailAddress,
                password: password,
                confirm_password: confirmPassword,
                type: "standard",
                location
            });
        } catch (e: any) {
            return fail(400, { message: "Registration failed." });
        }

        return redirect(303, "/login");
    }
};
