import draw from "./draw.js";
import { plat, size, tps, orbs, render_mode, RenderModes } from "../store.js";
import { distance1, randFloat, randInt, runNTimes, isFunc } from "./funcs.js";
import { get } from "svelte/store";
import OrbImage from "../assets/orb.png";

/*
	Mods
	————————
	+ onTick(parent, orb, tick: int) # upon every tick
	+ onBounce(parent, orb) # upon bouncing off anything
	+ onDamage(parent, orb) # upon hitting platform
	+ physics(parent, orb) # replace physics update

	- temp_orbs: bool # orbs are temporary (orbs have delete property)
*/

// TODO
// | 

const OrbM = (()=>{
	const orb_speed = 12;
	const draw_max = 500;
	const dropping_tick = tps*3;

	const defOrb = (orb=get(orbs).basic, color, mods=({}))=>({ 
		list: [],
		color,
		max: draw_max,
		over: 0,
		new() {
			if (this.list.length >= this.max) {
				this.over++;
				return;
			} else if (this.over > 0) {
				this.over = 0;
			}
			const ang = randFloat(0, Math.PI*2);
			const apply = mods.apply ?? ({});
			const new_orb = {
				x: randInt(0, size.w),
				y: randInt(0, size.h-get(plat).h), 
				vx: Math.cos(ang) * orb_speed,
				vy: Math.cos(ang) * orb_speed,
				last_bounce: 0,
				get dmg() { return orb.dmg; },
				...apply,
			};
			this.list.push(new_orb);
			return new_orb;
		},
		...mods,
	});

	const basic = defOrb(get(orbs).basic, "#ffffaa");
	const glass = defOrb(get(orbs).glass, "#ddddddaa", ({
		onBounce(parent, orb, tick) {
			if (randInt(0,5) != 0) return;
			
			// runNTimes(100, ()=>{
				runNTimes(randInt(1,5), ()=>{
				const new_orb = shard.new();
				if (new_orb == undefined) return;
				new_orb.x = orb.x;
				new_orb.y = orb.y;
				const ang = randFloat(0, Math.PI*2);
				new_orb.vx = Math.cos(ang)*20;
				new_orb.vy = Math.sin(ang)*20;
			});
		}
	}));
	const shard = defOrb(get(orbs).glass, "#ddddddaa", ({ 
		radius: 5,
		temp_orbs: true,
		apply: { destroy: false, },
		onDamage(parent, orb) {
			orb.destroy = true;
		},
		onTick(parent, orb, tick) {
			orb.y += 0.1;
		},
	}));

	const fire = defOrb(get(orbs).fire, "#ffaaaa", ({
		apply: { spawn: randInt(tps/2, tps*2) },
		onTick(parent, orb, tick) {
			if (orb.spawn > 0) {
				orb.spawn--;
				return;
			}
			orb.spawn = randInt(tps/2, tps*2);
			const new_wisp = wisp.new();
			if (new_wisp == undefined) return;
			new_wisp.x = orb.x;
			new_wisp.y = orb.y;
			new_wisp.vx = 0;
			new_wisp.vy = 1;
		}
	}));
	const wisp = defOrb(get(orbs).fire, "#ffaaaa", ({
		radius: 5,
		temp_orbs: true,
		apply: { destroy: false, },
		onDamage(parent, orb) {
			orb.destroy = true;
		},
	}));

	const orbBounce = (parent, orb, xy="x", mult=1, loc=10)=>{
		orb[`v${xy}`] = Math.abs(orb[`v${xy}`]) * mult;
		orb[xy] = loc;
		if (isFunc(parent.onBounce)) parent.onBounce(parent, orb);

		if (xy == "y" && Math.abs(orb.vx) > 10) {
			orb.vy *= Math.random()/2 + 1;
		}
		if (xy == "x" && Math.abs(orb.vy) > 5) {
			orb.vx *= Math.random()/3 + 1;
		}
	}

	const physics = (parent, orb)=>{
		orb.x += orb.vx;
		orb.y += orb.vy;

		orb.last_bounce++;

		if (orb.x-10 < 0) orbBounce(parent, orb, "x", 1, 10);
		if (orb.y-10 < 0) orbBounce(parent, orb, "y", 1, 10);
		if (orb.x+10 > size.w) orbBounce(parent, orb, "x", -1, size.w-10);
		const plat_top = size.h-get(plat).h;
		if (orb.y+10 > plat_top) {
			orb.last_bounce = 0;
			orbBounce(parent, orb, "y", -1, plat_top-10);
			orb.vy += 1;

		get(plat).dmg(orb.dmg);
			if (isFunc(parent.onDamage)) parent.onDamage(parent, orb);
		}

		if (orb.last_bounce > dropping_tick) {
			orb.vy += (orb.last_bounce - dropping_tick)/100;
		}
		const dist = distance1(orb.x, orb.y, orb.x+orb.vx, orb.y+orb.vy);
		if (dist > orb_speed*10) {
			orb.vx *= 0.5;
			orb.vy *= 0.5;
		} else if (dist > orb_speed*5) {
			orb.vx *= 0.8;
			orb.vy *= 0.8;
		} else if (dist > orb_speed) {
			orb.vx *= 0.99;
			orb.vy *= 0.99;
		} else if (dist < 1) {
			orb.vx = 1;
			orb.vy = 1;
		} else {
			orb.vx *= 1.05;
			orb.vy *= 1.05;
		}
	}

	const updateOrbs = (parent, tick)=>{
		for (let i = parent.list.length-1; i >= 0; i--) {
			const orb = parent.list[i];

			if (orb == undefined) {
				parent.list.splice(i, 1);
				continue;
			} else if (parent.temp_orbs === true && orb.destroy === true) {
				if (parent.over > 0) parent.over--;
				else parent.list.splice(i, 1);
			}

			const size = parent.radius ?? 10;
			switch (get(render_mode)) {
				case RenderModes.Circle:
					draw.circle(orb.x, orb.y, size, parent.color);
					break;
				case RenderModes.Square:
					draw.rect(orb.x-size, orb.y-size, size*2, size*2, parent.color);
					break;
				case RenderModes.Sand:
					draw.rect(orb.x-2, orb.y-2, 4, 4, parent.color);
					break;
				case RenderModes.Wireframe:
					draw.circle(orb.x, orb.y, size, parent.color, false, 1);
					break;
			}

			if (isFunc(parent.onTick)) parent.onTick(parent, orb, tick);
			physics(parent, orb);
		}
	}

	return {
		basic,
		glass,
		shard,
		fire,
		wisp,

		get allOrbs() { return basic.list.concat([]); },
		updateAll(tick) {
			updateOrbs(basic, tick);
			updateOrbs(glass, tick);
			updateOrbs(shard, tick);
			updateOrbs(fire, tick);
			updateOrbs(wisp, tick);

			draw.rect(10, size.h-get(plat).h, size.w-20, 100, get(plat).color());

			{
				const perc = (1-get(plat).hp/get(plat).maxhp);
				const width = (size.w-20);
				draw.rect(width/2-(width/2*perc)+10, size.h-get(plat).h+(40), width*perc, 20, "#212121");
			}

			draw.rect(10, size.h-get(plat).h+105, size.w-20, 100, get(plat).color(1));
			draw.rect(10, size.h-get(plat).h+210, size.w-20, 100, get(plat).color(2));
		},
		setAmount(type, num) {
			const orb = this[type];
			const list = orb.list;
			if (num < list.length) {
				orb.over = 0;
				list.length = num;
			} 
			else if (num > list.length && num <= orb.max) {
				// list.length = num;
				const diff = num - list.length;
				for (let i = 0; i < diff; i++) {
					orb.new();
				}
			} else if (num > orb.max) {
				const diff = num - list.length;
				for (let i = 0; list.length < orb.max; i++) {
					orb.new();
				}
				orb.over = num - orb.max
			}
		},
		forEach(func=(orb)=>{}) {
			for (let i = 0; i < basic.list.length; i++) if (basic.list[i] != undefined) func(basic.list[i]);
			for (let i = 0; i < glass.list.length; i++) if (glass.list[i] != undefined) func(glass.list[i]);
			for (let i = 0; i < shard.list.length; i++) if (shard.list[i] != undefined) func(shard.list[i]);
			for (let i = 0; i < fire.list.length; i++)  if (fire.list[i] != undefined)  func(fire.list[i]);
			for (let i = 0; i < wisp.list.length; i++)  if (wisp.list[i] != undefined)  func(wisp.list[i]);
		}
	}
})();

export default OrbM;