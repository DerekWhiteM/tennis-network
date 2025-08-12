<script>
    import { goto } from "$app/navigation";
</script>

<header
    class="flex items-center border-b-2 border-gray-200"
>
    <div class="max-w-xl flex justify-between gap-2 m-auto px-8 py-4">
        <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200" 
            on:click={() => goto("/")}
            type="button">
            Dashboard
        </button>
        <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200" 
            on:click={() => goto("/players")}
            type="button">
            Players
        </button>
        <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200" 
            on:click={() => goto("/proposals")}
            type="button">
            Proposals
        </button>
        <button
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
            on:click={() => goto("/edit-profile")}
            type="button"
        >
            My Profile
        </button>
        <form method="POST" action="/logout">
            <button
                type="submit"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
                Logout
            </button>
        </form>
    </div>
</header>
