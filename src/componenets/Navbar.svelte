<script>
    import { goto } from "$app/navigation";

    export let title = "Title";
</script>

<header
    class="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b-2 border-gray-200"
>
    <h1
        class="text-gray-800 text-2xl md:text-3xl font-bold mb-4 md:mb-0 text-center md:text-left"
    >
        {title}
    </h1>
    <div class="flex gap-2 items-center">
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
