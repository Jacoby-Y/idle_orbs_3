export const exp = (pow=1)=> (10 ** pow)
export const round = (num, pow=1)=> Math.round(num * exp(pow))/exp(pow);
export const floor = (num, pow=1)=> Math.floor(num * exp(pow))/exp(pow);
export const ceil = (num, pow=1)=> Math.ceil(num * exp(pow))/exp(pow);
export const toExp = (num, place)=>{
  let pow = Math.floor(Math.log10(num));
	place = 10**place;
  return (Math.floor(num/(10**pow)*place)/place + `e${pow}`);
}
export const sci = (num, place=1)=> num >= 1000 ? toExp(num, place).replace("+", "") : round(num);
export const fixBigNum = (num, place)=>{
  const l = Math.floor(Math.log10(num));
  return Math.round(num / ((10**l)/(10**place)))*((10**l)/(10**place));
}
export const formatSeconds = (secs, short=true)=>{
  let neg = secs < 0;
  if (neg) secs = Math.abs(secs);
  if (secs < 60) return `${neg ? '-' : ''}${round(secs, 0)}${short ? "s" : " Seconds"}`;
  secs /= 60;
  if (secs < 60) return `${neg ? '-' : ''}${ceil(secs)}${short ? "m" : " Minutes"}`;
  secs /= 60;
  if (secs < 60) return `${neg ? '-' : ''}${ceil(secs)}${short ? "h" : " Hours"}`;
  secs /= 24;
  if (secs < 24) return `${neg ? '-' : ''}${ceil(secs)}${short ? "d" : " Days"}`;
  secs /= 365;
  return `${neg ? '-' : ''}${ceil(secs)}${short ? "y" : " Years"}`;
}
export const runNTimes = (n, callback)=>{
  for (let i = 0; i < n; i++) {
    callback()
  }
  // Array.from(Array(n)).forEach(callback);
}
export const floorRound = (num, place)=>{
  const pow = (Math.pow(10, place));
  return Math.floor(num * pow) / pow;
}
const num_shorts = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'O', 'N', 'D', 'UD', 'DD', 'TD', 'QuD', 'QiD', 'SxD', 'SpD', 'OD', 'ND', 'V', 'UV', 'DV', 'TV', 'QaV', 'QiV', 'SxV', 'SpV', 'OV', 'NV', 'T', 'UT', 'DT', 'TT', 'QaT', 'QiT', 'SxT', 'SpT', 'OT', 'NT'];
export const fNum = (num, round_to=1, i=0, past_thresh=false)=>{
    const div = num / 1000;
    const thresh = (i >= num_shorts.length);
    if (div < 1 || thresh) { 
      if (thresh) return (floorRound(num, round_to) + num_shorts[num_shorts.length-1]);
      else return (i == 0) ? (floorRound(num, round_to)) : (floorRound(num, round_to) + num_shorts[i]);
    }
    return fNum(div, round_to, i+1, thresh);
}

/** c: cash | x: starting about | m: increase */
export const multComp = (c, x, m)=>{
  // c = x * (m^n);
  // c/x = m^n
  // log(c/x)/log(m) = n
  const pow = Math.floor(Math.log(c/x)/Math.log(m));
  const total = Math.floor(x * (m ** pow))

  return {
    pow, 
    total,
  }
}
/** c: starting cost | i: increments | x: increase */
export const addComp = (c, i, x)=>{
  // 50 * 5 + 10 * m;
  const m = (i-1)/2 * i;
  return c * i + x * m;
}
// console.log(addComp(50, 6, 10));

let run_n_save = null;
export const runN = (func=()=>{}, n)=>{
  if (run_n_save == func) return;
  run_n_save = func;
  for (let i = 0; i < n; i++) func();
  run_n_save = null;
}

export const spendCashAdd = (cash, cost, incr)=>{
  let i = 0;
  if (incr == 0) {
    i = Math.floor(cash/cost);
    cash -= i*cost;
  } else {
    for ([]; cost <= cash; (cost += incr, i++)) {
      cash -= cost;
    }
  }
  return {
    cash,
    cost,
    i,
  }
}
export const spendCashMult = (cash, cost, incr)=>{
  let i = 0;
  if (incr == 0) {
    i = Math.floor(cash/cost);
    cash -= i*cost;
  } else {
    for ([]; cash > cost; (cost *= incr, i++)) {
      cash -= cost;
      console.log(cash);
    }
  }
  return {
    cash,
    cost,
    i,
  }
}

export const distance1 = (x1,y1, x2,y2)=>{
  return Math.sqrt((x2-x1) * (x2-x1) + (y2-y1) * (y2-y1));
}
export const distance2 = (pos1, pos2)=>{
  return Math.sqrt((pos2.x-pos1.x) * (pos2.x-pos1.x) + (pos2.y-pos1.y) * (pos2.y-pos1.y));
}

export const fixAng = (ang) => (ang + Math.PI) % (Math.PI * 2);
export const abs = Math.abs;
export const numDiff = (num1, num2)=>{
  num1 = abs(num1); num2 = abs(num2);
  const max = Math.max(num1, num2);
  const min = Math.min(num1, num2);
  return max - min;
}

export const randInt = (min=0, max=10)=> Math.floor(Math.random() * ((max+1) - min) + min);
export const randFloat = (min=0, max=Math.PI)=> Math.random() * ((max+1) - min) + min;

export const toTitle = (str)=>{
  if (!str) return;
  /** @type String[] */
  const spl = str.split(" ");
  for (let i = 0; i < spl.length; i++) {
    spl[i] = spl[i][0].toUpperCase() + spl[i].slice(1);
  }
  return spl.join(" ");
}

export const nullish = vari => vari == undefined || vari == null
export const falsy = vari => !vari
export const truthy = vari => !!vari

export const isFunc = vari => typeof vari == "function";

export const clamp = (min, num, max) => {
  if (num < min) return min;
  if (num > max) return max;
  return num;
}
export const roundOfMax = (num1, num2) => Math.round(Math.max(num1, num2));