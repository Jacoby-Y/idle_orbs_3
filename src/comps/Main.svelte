<script>
	import Orbs from "./Orbs.svelte";
	import Plats from "./Plats.svelte";
	import Prestige from "./Prestige.svelte";
	import Settings from "./Settings.svelte";
	import Debug from "./Debug.svelte";

	const comps = [
		[Orbs, "Orbs"],
		[Plats, "Platforms"],
		[Prestige, "Prestige"],
		[Settings, "Settings"],
		[Debug, "Debug"],
	];
	let index = 0;
</script>

<main>
	<nav>
		{#each comps as comp, i}
			{#if comp[1] == "Debug"} <hr> {/if}
			<button on:click={()=>void(index = i)}>{comp[1]}</button>
		{/each}
	</nav>
	<div id="title-comp">
		<h2 id="title">{comps[index][1]}</h2>
		<div id="comp-wrapper">
			<svelte:component this={comps[index][0]} />
		</div>
	</div>
</main>

<style>
	main {
		display: grid;
		grid-template-columns: max-content 1fr;
	}
	nav {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		text-align: center;
		border-right: 2px solid #00ad79;
	}
	nav button {
		padding: 1rem 2rem;
		border-bottom-width: 3px;
	}

	#title-comp {
		display: grid;
		grid-template-rows: max-content 1fr;
	}
	#comp-wrapper {
		position: relative;
		border-top: 2px solid #00ad79;
		padding: 1rem;
	}
	#title {
		text-align: center;
		color: #00d696;
		padding: 1rem;
	}

	hr {
		border: none;
		border-top: 2px solid #00704f;
	}
</style>