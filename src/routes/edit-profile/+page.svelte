<script lang="ts">
    import type { PageProps } from "./$types";

    let { data, form }: PageProps = $props();

    let first_name = $state(form?.user?.first_name ?? data.user?.first_name ?? "");
    let last_name = $state(form?.user?.last_name ?? data.user?.last_name ?? "");
</script>

<div class="max-w-6xl mx-auto p-8 font-sans">
    <div class="max-w-sm m-auto">
        <h1 class="text-gray-800 text-3xl font-bold mb-4">Edit Profile</h1>
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
    </div>
</div>
