<script>
	import { fNum, toTitle } from "../lib/funcs.js";
	import { buyOrb, cash, orbs, click_speedup } from "../store.js";

</script>

<button class:afford={$cash >= $click_speedup.cost} on:click={()=> $click_speedup.upgr()}>
	<b>{$click_speedup.time_sec}</b>
	<b>Click-to-Speedup Time (-0.25s)</b>
	<b>${fNum($click_speedup.cost)}</b>
</button>


<hr>

{#each Object.entries($orbs) as [key, orb]}
	<button class:afford={$cash >= orb.cost} on:click={()=> buyOrb(orb)}>
		<b>{orb.amount}</b>
		<b>{toTitle(key.replaceAll("_", " "))}</b>
		<b>${fNum(orb.cost)}</b>
	</button>
{/each}

<!-- <button class:afford={$cash >= $basic_orb.cost} on:click={()=> buyOrb(basic_orb)}>
	<b>{$basic_orb.amount}</b>
	<b>Basic Orb</b>
	<b>${fNum($basic_orb.cost)}</b>
</button>
<button class:afford={$cash >= $glass_orb.cost} on:click={()=> buyOrb(glass_orb)}>
	<b>{$glass_orb.amount}</b>
	<b>Glass Orb</b>
	<b>${fNum($glass_orb.cost)}</b>
</button>
<button class:afford={$cash >= $fire_orb.cost} on:click={()=> buyOrb(fire_orb)}>
	<b>{$fire_orb.amount}</b>
	<b>Fire Orb</b>
	<b>${fNum($fire_orb.cost)}</b>
</button> -->
<style>
	hr {
		margin-bottom: 1rem;
		border: none;
		border-top: 2px solid #00704f;
		width: calc(100% + 2rem);
		position: relative;
		left: -1rem;
	}
	button {
		width: 100%;
		margin-bottom: 1rem;
		transition-duration: 0.3s;
		display: grid;
		grid-template-columns: 1fr max-content 1fr;
	}
	button:not(.afford) {
		border: 1px solid #b39277;
		color: #b39277;
	}
	button:not(.afford):hover {
		background-color: #b39277;
		color: #333;
	}
	button b:first-of-type {
		text-align: left;
	}
	button b:last-of-type {
		text-align: right;
	}
</style>