import type { Actions, PageServerLoadEvent } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { userRepository } from '$lib/server/users/user-repository';

export const load = async (event: PageServerLoadEvent) => { 
    if (event.locals.session === null && event.locals.user === null) {
		return redirect(302, "/login");
	}
    const currentUser = event.locals.user;
    return { user: currentUser };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const user = locals.user;
        if (!user) throw redirect(302, '/login');
        const form = await request.formData();
        const first_name = form.get('first_name') as string;
        const last_name = form.get('last_name') as string;
        // Optionally handle location update here
        try {
            await userRepository.update(user.user_id, {
                first_name,
                last_name
            });
            return { success: true, user: { ...user, first_name, last_name } };
        } catch (e) {
            return fail(400, { error: 'Failed to update profile.' });
        }
    }
};
