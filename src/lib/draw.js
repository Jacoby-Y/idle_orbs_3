/** @type {CanvasRenderingContext2D} */
let ctx;

export default {
	set ctx(val){ ctx = val; },
	get ctx(){ return ctx; },
	circle(x,y, r, color, fill=true, line_width=1, arc=[0, Math.PI*2], counterclockwise=false) {
		ctx.beginPath();
		ctx.arc(x, y, r, arc[0], arc[1], counterclockwise);
		if (fill) {
			ctx.fillStyle = color;
			ctx.fill();
		}
		else { 
			ctx.lineWidth = line_width; 
			ctx.strokeStyle = color; 
			ctx.stroke(); 
		}
	},
	rect(x,y,w,h, color, fill=true, line_width=1) {
		if (fill) {
			ctx.fillStyle = color;
			ctx.fillRect(x,y,w,h);
		} else {
			ctx.strokeStyle = color;
			ctx.lineWidth = line_width;
			ctx.strokeRect(x,y,w,h);
		}
	},
	line1(x1, y1, x2, y2, color, width) {
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	},
	lineAtAngle(x,y, ang, len, color, line_width=1) {
		ctx.strokeStyle = color;
		ctx.lineWidth = line_width;
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x+Math.cos(ang)*len, y+Math.sin(ang)*len);
		ctx.stroke();
	},
	clear(x,y,w,h) {
		ctx.clearRect(x,y,w,h);
	},
	transform(x=0, y=0, rot=0) {
		ctx.translate(x,y);
		ctx.rotate(rot);
	},
	resetTransform() { ctx.setTransform(1, 0, 0, 1, 0, 0); },
	image(image, x, y) {
		ctx.drawImage(image, x, y);
	},
};