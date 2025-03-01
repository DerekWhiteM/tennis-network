import type { Actions } from "@sveltejs/kit";
import { userService } from "#src/lib/server/users/user-service.js";
import { userRepository } from "#src/lib/server/users/user-repository.js";

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
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

        return {
            email: "test",
            message: "test",
        };
    },
};
