<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ActionData } from "./$types";
	export let form: ActionData;
</script>

<div class="max-w-6xl mx-auto p-8 font-sans">
	<div class="max-w-sm m-auto">
		<h1 class="text-gray-800 text-3xl font-bold mb-4">Sign in</h1>
		<form method="post" use:enhance class="space-y-4">
			<div>
				<label for="form-login.email">Email</label>
				<input
					class="w-full"
					type="email"
					id="form-login.email"
					name="email"
					autocomplete="username"
					required
					value={(form as any)?.email ?? ""}
				/>
			</div>
			<div>
				<label for="form-login.password">Password</label>
				<input
					class="w-full"
					type="password"
					id="form-login.password"
					name="password"
					autocomplete="current-password"
					required
				/>
			</div>
			<button
				class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 w-full cursor-pointer"
				>Sign in</button
			>
			<div class="flex justify-between">
				<a href="/register" class="text-blue-500 hover:underline"
					>Create an account</a
				>
				<a href="/reset-password" class="text-blue-500 hover:underline"
					>Reset password</a
				>
			</div>
			<p>{(form as any)?.message ?? ""}</p>
		</form>
	</div>
</div>
