<script>
    export let data; // SvelteKit injects the `load` function's return value here

    /**
     * @param {number} meters
     */
    function formatDistance(meters) {
        const miles = meters / 1609.34;
        return miles < 1
            ? `${(miles * 5280).toFixed(0)} ft`
            : `${miles.toFixed(1)} mi`;
    }
</script>

{#if data.nearbyUsers && data.nearbyUsers.length > 0}
    <div class="flex flex-col m-auto">
        {#each data.nearbyUsers as user}
            <div
                class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
                <div class="mb-4">
                    <h3 class="text-gray-800 text-xl font-semibold mb-2">
                        {user.first_name}
                        {user.last_name}
                    </h3>
                    <p class="text-emerald-600 font-medium text-sm mb-4">
                        📍 {formatDistance(user.distance_meters)} away
                    </p>
                </div>
                <div>
                    <button
                        class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium w-full transition-colors duration-200"
                    >
                        Connect
                    </button>
                </div>
            </div>
        {/each}
    </div>
{:else}
    <div class="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <p class="text-gray-700 mb-2">
            {#if data.message === "Missing location"}
                Add a location to your profile to see players near you
            {:else}
                🎾 No tennis players found within 10 miles of your location.
            {/if}
        </p>
    </div>
{/if}
