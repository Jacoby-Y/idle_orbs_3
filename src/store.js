import { get, writable } from "svelte/store";
import { roundOfMax } from "./lib/funcs.js";

const w = (val)=>{
	const write = writable(val);
	Object.defineProperty(write, "$", {
		get() {
			console.log("hi");
		}
	});
	return write;
}

//#region | Engine Stuff
export const size = { w: 0, h: 0 };
export const tps = 45; 

export const time = writable(0);
const timer = setInterval(() => {
	time.update(v => (v+1)%tps)
}, 1000/tps);
//#endregion

//#region | Cash
let deci = 0;
export const cash = writable(0);
cash.subscribe((v)=>{
	if (v < 0) { cash.set(0); return; }
	if (Math.floor(v) == v) return;
	deci += v - Math.floor(v);
	if (deci >= 1) {
		v += Math.floor(deci);
		deci -= Math.floor(deci);
		cash.set(Math.floor(v));
	} else {
		cash.set(Math.floor(v));
	}
});
//#endregion

//#region | Platform Stuff
export const plat = writable({
	h: 300,
	hp: 50,
	maxhp: 50,
	index: 0,
	beat_perc: 0.5,
	beat_bonus: 0,
	beat_bonus_base_cost: 250,
	get beat_bonus_cost() { return roundOfMax(this.beat_bonus_base_cost, this.beat_bonus_base_cost * (Math.round(this.beat_bonus*10) * 1.2)) },
	setHp() {
		this.hp = roundOfMax(50, 50*(1.2 ** this.index));
		this.maxhp = this.hp;
	},
	color(offset=0) { return plat_colors[(this.index+offset) % plat_colors.length] },
	dmg(dmg=1) {
		// cash.update(v => v + dmg * (1 + this.index ** 1.2));
		cash.update(v => v + dmg * (1 + get(prestige).bonus_perc));
		if (dmg >= this.hp) {
			this.index++;
			cash.update(c => c + this.maxhp * (this.beat_perc + this.beat_bonus + 1));
			this.setHp();
		} else {
			this.hp -= dmg;
		}
		plat.update(v => v);
	},
	upgr_beat_bonus() {
		if (get(cash) < this.beat_bonus_cost) return;
		cash.update(c => c - this.beat_bonus_cost);
		this.beat_bonus = Math.round((this.beat_bonus + 0.1)*10)/10;
		plat.update(v => v);
	},
})
const plat_colors = [
	"#aaaaff",
	"#aadeff",
	"#aaffd7",
	"#b9ffaa",
	"#fffcaa",
	"#ffcdaa",
	"#ffaaad",
	"#ffaade",
	"#ebaaff",
	// "#b9aaff",
	// "#ffffff"
]
//#endregion

//#region | Orb Stuff
export const buyOrb = (orb=get(orbs).basic)=>{
	if (get(cash) < orb.cost) return;
	cash.update(v => v-orb.cost);
	orb.amount++;
	orbs.update(v => v);
}



const buildOrb = (amount, base_cost, cost_mult, dmg=1)=> ({
	amount, 
	base_cost, 
	cost_mult, 
	dmg,
	get cost() { return roundOfMax(this.base_cost, this.base_cost * (this.amount ** this.cost_mult)) }
});

// export const basic_orb = writable(buildOrb(1, 10, 1.2, 1));
// export const glass_orb = writable(buildOrb(0, 50, 1.2, 1));
// export const fire_orb = writable(buildOrb(0, 200, 1.2, 1));

export let orbs = writable({
	basic: buildOrb(1, 10,  1.2, 1),
	glass: buildOrb(0, 50,  1.2, 1),
	fire:  buildOrb(0, 200, 1.2, 1),
});
//#endregion

//#region | Prestige
export const prestige = writable({
	cost: 100000,
	plats: 0,
	bonus_per_plat: 0.01,
	get bonus_perc() { return this.plats * this.bonus_per_plat; }
});
//#endregion

//#region | Click Speedup
export const click_speedup = writable({
	cost: 500,
	time: 3000,
	upgr() {
		if (get(cash) < this.cost) return;
		cash.update(v => v-this.cost);
		this.time -= 250;
		this.cost = Math.round(this.cost * 1.5);
		click_speedup.update(v => v);
	},
	get maxed() { return this.time <= 500; },
	get max_tick() { return Math.round(this.time / 1000 * tps) },
	get time_sec() { return `${Math.round(this.time/10)/100}s` },
});
//#endregion

//#region | Render Mode
export const render_mode = writable("Circle");
export const RenderModes = {
	Circle: "Circle",
	Square: "Square",
	Sand: "Sand",
	Wireframe: "Wireframe",
	None: "None",
}
//#endregion

// window.test = {
// 	 get x() { return 10; },
// 	 y: 15,
// }
// ——————————————————————————————————————————
// Object.getOwnPropertyDescriptor(test, "x")
// => { get: x(), set: undefined }
// ——————————————————————————————————————————
// Object.getOwnPropertyDescriptor(test, "y")
// => { value: 15, writable: true }