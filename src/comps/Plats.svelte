<script>
	import { fNum } from "../lib/funcs";
	import { cash, plat } from "../store";

</script>

<button class:afford={$cash >= $plat.beat_bonus_cost} on:click={()=> $plat.upgr_beat_bonus()}>
	<b>+{Math.round($plat.beat_bonus*10)*10}%</b>
	<b>Platform Beat Award (+10%)</b>
	<b>${fNum($plat.beat_bonus_cost)}</b>
</button>

<style>
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