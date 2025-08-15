<h1 class="text-gray-800 text-3xl font-bold mb-4">New Proposal</h1>
<form method="POST" class="space-y-4">
    <div>
        <label for="date_time">Date Time</label>
        <input
            id="date_time"
            name="date_time"
            required
            class="w-full"
            type="datetime-local"
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
            class="w-full"
        />
    </div>
    
    <div>
        <label for="ntrp_min">Minimum NTRP Rating</label>
        <input
            id="ntrp_min"
            name="ntrp_min"
            type="text"
            class="w-full"
        />
    </div>
    <div>
        <label for="ntrp_max">Maximum NTRP Rating</label>
        <input
            id="ntrp_max"
            name="ntrp_max"
            type="text"
            class="w-full"
        />
    </div>
    <div>
        <label for="notes">Notes</label>
        <input
            id="notes"
            name="notes"
            type="text"
            class="w-full"
        />
    </div>
    <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold w-full"
        >Submit
    </button>
</form>
