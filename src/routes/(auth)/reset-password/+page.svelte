<script lang="ts">
	import { enhance } from "$app/forms";
    import type { PageProps } from "../../$types";
    let { form }: PageProps = $props();
</script>

<div class="max-w-6xl mx-auto p-8 font-sans">
	<div class="max-w-sm m-auto">
		<h1 class="text-gray-800 text-3xl font-bold mb-4">Reset password</h1>
		<form method="post" use:enhance class="space-y-4">
			<div>
				<label for="form-reset-password.email">Email</label>
				<input
					class="w-full"
					type="email"
					id="form-reset-password.email"
					name="email"
					autocomplete="username"
					required
				/>
			</div>
			<button
				class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 w-full"
				>Reset password</button
			>
			<p>{(form as any)?.message ?? ""}</p>
		</form>
	</div>
</div>
