<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import Navbar from '#src/componenets/Navbar.svelte';
    
    export let data; // SvelteKit injects the `load` function's return value here
    
    let locationStatus = 'checking'; // 'checking', 'granted', 'denied', 'unavailable'
    let userLocation = null;
    
    onMount(() => {
        // Check if we already have location parameters
        const lat = $page.url.searchParams.get('lat');
        const lng = $page.url.searchParams.get('lng');
       
        if (lat && lng) {
            locationStatus = 'granted';
            userLocation = { lat: parseFloat(lat), lng: parseFloat(lng) };
        }
        else if (data.user.location) {
            const { latitude, longitude } = data.user.location;
            userLocation = { lat: latitude, lng: longitude };
            locationStatus = 'granted';
        }
        else {
            requestLocation();
        }
    });
    
    async function requestLocation() {
        if (!navigator.geolocation) {
            locationStatus = 'unavailable';
            return;
        }
        
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                });
            });
            
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            locationStatus = 'granted';
            
            // Reload the page with location parameters to fetch nearby users
            const url = new URL(window.location.href);
            url.searchParams.set('lat', userLocation.lat.toString());
            url.searchParams.set('lng', userLocation.lng.toString());
            goto(url.toString());
            
        } catch (error) {
            console.error('Error getting location:', error);
            locationStatus = 'denied';
        }
    }
    
    /**
     * @param {number} meters
     */
    function formatDistance(meters) {
        const miles = meters / 1609.34;
        return miles < 1 ? `${(miles * 5280).toFixed(0)} ft` : `${miles.toFixed(1)} mi`;
    }
</script>

<div class="max-w-6xl mx-auto p-8 font-sans">

    <Navbar title={"Players"} />
    
    <main>
        <section>
            {#if locationStatus === 'checking'}
                <div class="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                    <p class="text-gray-700">🌍 Getting your location...</p>
                </div>
            {:else if locationStatus === 'denied'}
                <div class="text-center p-8 bg-red-50 rounded-lg border border-red-200 text-red-800">
                    <p class="mb-4">📍 Location access denied. Please enable location services to find nearby players.</p>
                    <button on:click={requestLocation} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200">
                        Try Again
                    </button>
                </div>
            {:else if locationStatus === 'unavailable'}
                <div class="text-center p-8 bg-red-50 rounded-lg border border-red-200 text-red-800">
                    <p>📍 Location services are not available in your browser.</p>
                </div>
            {:else if locationStatus === 'granted'}
                {#if data.nearbyUsers && data.nearbyUsers.length > 0}
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {#each data.nearbyUsers as user}
                            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                                <div class="mb-4">
                                    <h3 class="text-gray-800 text-xl font-semibold mb-2">{user.first_name} {user.last_name}</h3>
                                    <p class="text-emerald-600 font-medium text-sm mb-4">📍 {formatDistance(user.distance_meters)} away</p>
                                </div>
                                <div>
                                    <button class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium w-full transition-colors duration-200">
                                        Connect
                                    </button>
                                </div>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                        <p class="text-gray-700 mb-2">🎾 No tennis players found within 10 miles of your location.</p>
                        <p class="text-gray-500 text-sm">Be the first in your area or check back later!</p>
                    </div>
                {/if}
            {/if}
        </section>
    </main>
</div>
