import { proposalRepository } from '#src/lib/server/proposals/proposal-repository.js';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, locals }) => {
    if (!locals.user) redirect(307, '/login');
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) redirect(307, '/login');

        const form = await request.formData();
        const dateTime = form.get('date_time') as string;
        const latitude = form.get('latitude') as unknown as number;
        const longitude = form.get('longitude') as unknown as number;
        const notes = form.get('notes') as string;
        const ntrpMin = form.get('ntrp_min') as unknown as number;
        const ntrpMax = form.get('ntrp_max') as unknown as number;

        if (!(dateTime && latitude && longitude)) {
            return {
                error: "Missing required fields",
            };
        }

        try {
            await proposalRepository.create({
                user_id: locals.user.user_id,
                date_time: dateTime,
                location: { latitude, longitude },
                notes,
                ntrp_min: ntrpMin,
                ntrp_max: ntrpMax,
            });
        } catch (error) {
            return {
                error: 'Failed to create proposal',
            };
        }

        redirect(302, '/proposals');
    }
};
