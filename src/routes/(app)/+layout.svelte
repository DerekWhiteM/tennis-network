<script lang="ts">
    import Navbar from "#src/componenets/Navbar.svelte";
    import "../../app.css";
    let { children } = $props();
</script>

<Navbar />
<main class="max-w-xl mx-auto p-8 font-sans">
    {@render children()}
</main>
