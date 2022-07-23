<script>
	import { fNum } from "../lib/funcs.js";
	import { orbs, cash, plat, prestige } from "../store.js";
	import OrbM from "../lib/orbs.js";

	const doPrestige = ()=>{
		Object.values($orbs).forEach(orb => orb.amount = 0);
		$orbs.basic.amount = 1;
		
		OrbM.forEach((orb)=>{
			if (orb.destroy != undefined) {
				orb.destroy = true;
			}
		});
		
		$prestige.plats += $plat.index;
		$plat.index = 0;
		$plat.beat_bonus = 0;
		$cash = 0;
		
		[orbs, plat, cash].forEach(wr => wr.update(v => v));
	}

</script>

<button class:afford={$cash >= 100000} on:click={doPrestige}>
	<b>Orb value +{fNum($prestige.bonus_perc*100)}%</b>
	<b>Restart the game with orb bonuses<br>Bonus per platform beat (+{$plat.index}%)</b>
	<b>${fNum($prestige.cost)}</b>
</button>

<style>
	button {
		width: 100%;
		margin-bottom: 1rem;
		transition-duration: 0.3s;
		display: grid;
		grid-template-columns: 1fr max-content 1fr;
		align-items: center;
		line-height: 1.7rem;
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