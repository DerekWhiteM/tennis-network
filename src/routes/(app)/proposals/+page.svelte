<script>
    import { goto } from "$app/navigation";
</script>

<h2 class="text-gray-700 text-xl md:text-2xl font-semibold w-full text-center">
    Manage proposals
</h2>
<button
    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
    on:click={() => goto("/proposals/new")}
    type="button">Create a proposal</button
>
