import type { Actions, PageServerLoadEvent } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { userRepository } from '$lib/server/users/user-repository';

export const load = async (event: PageServerLoadEvent) => { 
    if (event.locals.session === null && event.locals.user === null) {
		return redirect(302, "/login");
	}
    const currentUser = event.locals.user;
    let location;
    if (currentUser) {
        const coords = await userRepository.getCoordinatesById(currentUser.user_id);
        if (coords) {
            location = { latitude: coords.latitude, longitude: coords.longitude };
        }
    }
    return { user: { ...currentUser, location } };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const user = locals.user;
        if (!user) throw redirect(302, '/login');
        const form = await request.formData();
        const first_name = form.get('first_name') as string;
        const last_name = form.get('last_name') as string;
        const latitude = form.get('latitude')?.toString();
        const longitude = form.get('longitude')?.toString();
        let location = undefined;
        if (latitude && longitude && latitude !== '' && longitude !== '') {
            const latNum = Number(latitude);
            const lonNum = Number(longitude);
            if (!isNaN(latNum) && !isNaN(lonNum)) {
                location = { latitude: latNum, longitude: lonNum };
            }
        } else if ((latitude === '' || !latitude) && (longitude === '' || !longitude)) {
            location = null;
        }
        try {
            await userRepository.update(user.user_id, {
                first_name,
                last_name,
                location
            });
            return { success: true, user: { ...user, first_name, last_name, location } };
        } catch (e) {
            return fail(400, { error: 'Failed to update profile.' });
        }
    }
};
