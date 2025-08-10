import { redirect } from "@sveltejs/kit";
import { userRepository } from "$lib/server/users/user-repository";
import type { PageServerLoadEvent } from "./$types";

export async function load(event: PageServerLoadEvent) {
	if (event.locals.session === null && event.locals.user === null) {
		return redirect(302, "/login");
	}

	const currentUser = event.locals.user;
	const currentUserId = currentUser.user_id;

	const url = new URL(event.request.url);
	let lat: string | number | null = url.searchParams.get('lat');
	let lng: string | number | null = url.searchParams.get('lng');

	// If coordinates are provided, use them
	if (lat && lng) {
		lat = parseFloat(lat);
		lng = parseFloat(lng);
	} 
	
	// If coordinates are not provided, use the current user's location
	else {
		const coordinates = await userRepository.getCoordinatesById(currentUserId);
		if (!coordinates) {
			throw "Failed to extract coordinates from user location";
		}
		lat = coordinates.latitude;
		lng = coordinates.longitude;
	}

	const nearbyUsers = await userRepository.findWithinRadius(lat, lng, 10);

	return {
		user: currentUser,
		nearbyUsers: nearbyUsers.filter(user => user.user_id !== currentUserId)
	};
}