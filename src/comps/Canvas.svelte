<script>
	import draw from "../lib/draw.js";
	import { orbs, cash, size, time, tps, plat, click_speedup } from "../store.js";
	import { onMount } from "svelte/internal";
	import OrbM from "../lib/orbs.js";
	import { clamp, fNum, isFunc, randInt } from "../lib/funcs.js";
	import { get } from "svelte/store";

	//#region | Orb Stuff
	// basic_orb.subscribe(({ amount }) => OrbM.setAmount("basic", amount) );
	// glass_orb.subscribe(({ amount }) => OrbM.setAmount("glass", amount) );
	// fire_orb.subscribe(({ amount }) => OrbM.setAmount("fire", amount) );
	orbs.subscribe(obj => {
		Object.entries(obj).forEach(([key, val])=>{
			OrbM.setAmount(key, val.amount);
		});
	});
	//#endregion

	//#region | Canvas Stuff
	/** @type {HTMLElement} */
	let main;
	/** @type {HTMLCanvasElement} */
	let canvas;
	/** @type {CanvasRenderingContext2D} */
	let ctx;
	let w, h;
	//#endregion

	//#region | Main Loop
	let click_ticks = 0;
	let fps = 0;
	const smooth_fps = (()=>{
		let index = 0;
		let max = 100;
		let list = Array.from(Array(max)).fill(0);
		return (fps)=>{
			list[index] = fps;
			index = (index + 1) % max;
			return Math.round(list.reduce((p, c) => p+c, 0) / max);
		}
	})();

	let pause = false;
	const main_loop = (tick)=>{
		if (pause) return;

		// if (tick % 3 != 0) 
		draw.rect(0, 0, size.w, size.h, "#333")
		if (click_ticks > 0) {
			// draw.circle(w-50, 50, 25, "#00ad79", false, 4, [Math.PI*2 * (click_ticks/($click_speedup.max_tick)) + (Math.PI*2 * .75), Math.PI*2 * .75]);
			const perc = clamp(0, click_ticks / $click_speedup.max_tick, 0.99);
			draw.circle(w-50, 50, 25, "#00ad79", false, 4, [0, Math.PI*2*perc]);
			click_ticks--;
		}

		let f_start = Date.now();
		OrbM.updateAll(tick);
		const frame_time = Date.now() - f_start;
		fps = (1000/tps) / frame_time * tps;
	}
	//#endregion
	
	//#region | Mount
	/** @type {HTMLElement}*/
	let click_hint;
	onMount(()=>{
		w = size.w = canvas.width = main.clientWidth;
		h = size.h = canvas.height = main.clientHeight;

		// draw.ctx = ctx = enableWebGLCanvas( canvas );
		draw.ctx = ctx = canvas.getContext("2d", { alpha: false });
		
		OrbM.forEach((orb)=>{
			orb.x = randInt(0, size.w);
			orb.y = randInt(0, size.h - get(plat).h);
		});

		time.subscribe(v => {
			main_loop(v);
		});

		canvas.onclick = ()=>{
			click_hint.style.display = "none";
			if (click_ticks > 0) return;
			click_ticks = $click_speedup.max_tick;
			OrbM.forEach(orb => {
				orb.vx *= 3;
				orb.vy *= 3;
			})
		}
	});
	//#endregion

	//#region | Events
	const key_events = {};
	window.onkeydown = ({ key })=>{
		if (isFunc(key_events[key])) key_events[key]();
	}
	key_events[" "] = ()=> pause = !pause;
	
	key_events["q"] = ()=> console.log(OrbM.basic);
	key_events["w"] = ()=> console.log(OrbM.glass);
	key_events["e"] = ()=> console.log(OrbM.shard);
	key_events["c"] = ()=> $cash += 1000;
	key_events["0"] = ()=> console.log(OrbM);
	key_events["o"] = ()=> console.log($orbs);
	key_events["u"] = ()=> orbs.update(v => v);
	key_events["."] = ()=> { OrbM.setAmount("basic", 0); OrbM.setAmount("glass", 500); }
	//#endregion

</script>

<main bind:this={main}>
	<h3 id="cash-txt">Cash: {fNum($cash)}
		<!-- <br>FPS: {smooth_fps(fps)} -->
	</h3>
	<img bind:this={click_hint} id="click-hint" src="./src/assets/cursor.svg" alt="Click Here">
	<h3 id="plat-index" style="bottom: {$plat.h}px;">{$plat.index + 1}</h3>
	<canvas bind:this={canvas} class:pointer={click_ticks <= 0}></canvas>
</main>

<style>
	main {
		border-left: 2px solid #00ad79;
		position: relative;
	}
	canvas {
		width: 100%;
		height: 100%;
	}
	#cash-txt {
		position: absolute;
		top: 0;
		left: 0;
		color: white;
		background-color: #333333aa;
		padding: 1rem 1.2rem;
	}
	.pointer {
		cursor: pointer;
	}

	#click-hint {
		position: absolute;
		width: 4rem;
		height: 4rem;
		left: 50%;
		top: 30%;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}

	#plat-index {
		position: absolute;
		transform: translate(0, 80%);
		font-size: 1.5rem;
		padding: 1rem 1.2rem;
	}
</style>