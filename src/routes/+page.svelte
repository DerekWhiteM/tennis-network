<script>
    export let data; // SvelteKit injects the `load` function's return value here
</script>

<h1>Welcome to SvelteKit, {data.user.first_name}!</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<form method="POST" action="/logout">
    <button type="submit">Logout</button>
</form>
