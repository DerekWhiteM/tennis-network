// src/routes/api/logout/+server.js
import { invalidateUserSessions } from '#src/lib/server/session.js';
import { redirect } from '@sveltejs/kit';

export async function POST({ cookies, locals }) {

    // Clear the session cookie
    cookies.delete('session', { path: '/' });

    // Invalidate the server session
    await invalidateUserSessions(locals.user.user_id);

    // Clear locals
    locals.user = null;
    locals.session = null;

    // Redirect to login page
    throw redirect(303, '/login');
}