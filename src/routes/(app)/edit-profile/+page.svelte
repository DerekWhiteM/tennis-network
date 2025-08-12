<script lang="ts">
    import type { PageProps } from "./$types";
    let { data, form }: PageProps = $props();

    let first_name = $state(
        form?.user?.first_name ?? data.user?.first_name ?? "",
    );
    let last_name = $state(form?.user?.last_name ?? data.user?.last_name ?? "");
    let latitude = $state(
        form?.user?.location?.latitude ?? data.user?.location?.latitude ?? "",
    );
    let longitude = $state(
        form?.user?.location?.longitude ?? data.user?.location?.longitude ?? "",
    );

    function getLocation() {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                latitude = position.coords.latitude.toString();
                longitude = position.coords.longitude.toString();
            },
            (error) => {
                alert("Unable to retrieve your location.");
            },
        );
    }

    function clearLocation() {
        latitude = "";
        longitude = "";
    }
</script>

<h1 class="text-gray-800 text-3xl font-bold mb-4">My Profile</h1>
<form method="POST" class="space-y-4">
    <div>
        <label for="first_name">First Name</label>
        <input
            id="first_name"
            name="first_name"
            bind:value={first_name}
            required
            class="w-full"
        />
    </div>
    <div>
        <label for="last_name">Last Name</label>
        <input
            id="last_name"
            name="last_name"
            bind:value={last_name}
            required
            class="w-full"
        />
    </div>
    <div>
        <label for="latitude">Latitude</label>
        <input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            min="-90"
            max="90"
            bind:value={latitude}
            class="w-full"
        />
    </div>
    <div>
        <label for="longitude">Longitude</label>
        <input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            min="-180"
            max="180"
            bind:value={longitude}
            class="w-full"
        />
    </div>
    <div class="flex gap-2">
        <button
            type="button"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 w-full cursor-pointer"
            onclick={getLocation}
        >
            Use current location
        </button>
        <button
            type="button"
            class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 w-full cursor-pointer"
            onclick={clearLocation}
        >
            Clear location
        </button>
    </div>
    <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold w-full"
        >Save Changes</button
    >
    {#if form?.success}
        <div
            class="text-green-700 bg-green-50 border border-green-200 rounded p-2 mt-2 text-center"
        >
            Profile updated successfully!
        </div>
    {/if}
    {#if form?.error}
        <div
            class="text-red-700 bg-red-50 border border-red-200 rounded p-2 mt-2 text-center"
        >
            {form.error}
        </div>
    {/if}
</form>
