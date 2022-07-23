<script>
	import { get } from "svelte/store";
	import { isFunc } from "../lib/funcs.js";
	import { cash, orbs } from "../store.js";

	const build_ch = (name, vari, prop="", onSet=()=>{})=> ({name, vari, prop, onSet})
	const changeables = [
		build_ch("cash", cash),
	];
	Object.entries(get(orbs)).forEach(([key, orb])=>{
		changeables.push(build_ch(key, orb, "amount", ()=>{orbs.update(v=>v)}))
	})
	const change = (num, set, ch)=>{
		if (ch.vari.subscribe != undefined) {
			if (ch.prop == "") {
				if (set == "+") ch.vari.update(v => v + num);
				else if (set == "-") ch.vari.update(v => Math.max(0, v - num));
				else if (set == "=") ch.vari.set(num);
			} else {
				if (set == "+") ch.vari.update(v => (v[ch.prop] += num, v));
				else if (set == "-") ch.vari.update(v => (Math.max(0, v[ch.prop] -= num), v));
				else if (set == "=") ch.vari.update(v => (v[ch.prop] = num, v));
			}
		} else {
			if (ch.prop == "") {
				if (set == "+") ch.vari += num;
				else if (set == "-") ch.vari = Math.max(0, ch.vari - num);
				else if (set == "=") ch.vari = num;
			} else {
				if (set == "+") ch.vari[ch.prop] += num;
				else if (set == "-") ch.vari[ch.prop] = Math.max(0, ch.vari[ch.prop]-num);
				else if (set == "=") ch.vari[ch.prop] = num;
			}
		}
		if (isFunc(ch.onSet)) ch.onSet();
	}
</script>

{#each changeables as ch}
	<div>
		<b>{ch.name}:</b>
		<button on:click={()=> change(10 , "-", ch)}> -10 </button>
		<button on:click={()=> change(1  , "-", ch)}> -1 </button>
		<button on:click={()=> change(0  , "=", ch)}> =0 </button>
		<button on:click={()=> change(1  , "+", ch)}> +1 </button>
		<button on:click={()=> change(10 , "+", ch)}> +10 </button>
		<button on:click={()=> change(100, "+", ch)}> +100 </button>
	</div>
{/each}

<style>
	div {
		background-color: inherit;
		color: #00d696;
		border: 1px solid #00d696;
		font-size: 1.2rem;
		width: 100%;
		font-weight: bold;
		display: grid;
		grid-template-columns: 1fr repeat(7, max-content);
		align-items: center;
		justify-items: center;
		text-align: center;
		margin-bottom: 1rem;
	}
	div button {
		border: none;
		border-left: inherit;
	}
</style>