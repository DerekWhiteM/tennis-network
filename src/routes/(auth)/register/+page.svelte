<script lang="ts">
	import type { ActionData } from "./$types";
	export let form: ActionData;

	function getLocation() {
		if (!navigator.geolocation) {
			alert("Geolocation is not supported by your browser.");
			return;
		}
		navigator.geolocation.getCurrentPosition((position) => {
			const latInput = document.getElementById('form-register.latitude') as HTMLInputElement;
			const lonInput = document.getElementById('form-register.longitude') as HTMLInputElement;
			if (latInput && lonInput) {
				latInput.value = position.coords.latitude.toString();
				lonInput.value = position.coords.longitude.toString();
			}
		}, (error) => {
			alert("Unable to retrieve your location.");
		});
	}
</script>

<div class="max-w-6xl mx-auto p-8 font-sans">
	<div class="max-w-sm m-auto">
		<h1 class="text-gray-800 text-3xl font-bold mb-4">Register</h1>
		<form method="post" class="space-y-4">
            <div>
				<label for="form-register.first_name">First Name</label>
				<input
					class="w-full"
					type="text"
					id="form-register.first_name"
					name="first_name"
					autocomplete="email"
					required
					value={(form as any)?.first_name ?? ""}
				/>
			</div>
            <div>
				<label for="form-register.last_name">Last Name</label>
				<input
					class="w-full"
					type="text"
					id="form-register.last_name"
					name="last_name"
					autocomplete="email"
					required
					value={(form as any)?.last_name ?? ""}
				/>
			</div>
			<div>
				<label for="form-register.email">Email Address</label>
				<input
					class="w-full"
					type="email"
					id="form-register.email"
					name="email"
					autocomplete="email"
					required
					value={(form as any)?.email ?? ""}
				/>
			</div>
			<div>
				<label for="form-register.password">Password</label>
				<input
					class="w-full"
					type="password"
					id="form-register.password"
					name="password"
					autocomplete="new-password"
					required
				/>
			</div>
			<div>
				<label for="form-register.confirm_password">Confirm Password</label>
				<input
					class="w-full"
					type="password"
					id="form-register.confirm_password"
					name="confirm_password"
					autocomplete="new-password"
					required
				/>
			</div>
			<div>
				<label for="form-register.latitude">Latitude</label>
				<input
					class="w-full"
					type="number"
					step="any"
					id="form-register.latitude"
					name="latitude"
					value={(form as any)?.latitude ?? ""}
					min="-90" max="90"
				/>
			</div>
			<div>
				<label for="form-register.longitude">Longitude</label>
				<input
					class="w-full"
					type="number"
					step="any"
					id="form-register.longitude"
					name="longitude"
					value={(form as any)?.longitude ?? ""}
					min="-180" max="180"
				/>
			</div>
			<button
				type="button"
				class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 w-full cursor-pointer mb-2"
				on:click={getLocation}
			>Use my current location</button>
			<button
				class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 w-full cursor-pointer"
			>Register</button>
			<div class="flex space-x-2">
                <p>Already have an account?</p>
				<a href="/login" class="text-blue-500 hover:underline"
					>Sign in</a
				>
			</div>
			<p>{(form as any)?.message ?? ""}</p>
		</form>
	</div>
</div>
