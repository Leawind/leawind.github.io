import { Tensor } from '../leab/Tensor.mjs';


const jsplot = {
	figure(ctx, rect) {
		return new Figure(ctx, rect);
	}
};

class Figure {
	context = null;
	rect = [0.1, 0.1, 0.8, 0.8];
	elements = [];

	//TODO
	title = '';
	xlabel = '';
	ylabel = '';

	#background = '#0000';

	get canvas() {
		return this.context ? this.context.canvas : null;
	}

	/**
	 * @param {CanvasRenderingContext2D} context 
	 * @param {number[4]} [rect=[0.1, 0.1, 0.8, 0.8]] 
	 */
	constructor(context, rect = [0.1, 0.1, 0.8, 0.8]) {
		if (!context) {
			let cvs = document.createElement('canvas');
			[cvs.width, cvs.height] = [1024, 1024];
			document.body.appendChild(cvs);
			context = cvs.getContext('2d');
		}


		this.context = context;
		this.rect = rect;
	}

	/**
	 * 绘制散点或线条
	 */
	plot(...args) {
		let e = new Plot(...args);
		this.elements.push(e);
		return e;
	}
	/**
	 * 绘制位图
	 * RGB, RGBA, BGR, BGRA, G, GA
	 */
	img(tensor, mode = 'RGB', x, y, w, h) {
		let e = new Img(tensor, mode, x, y, w, h);
		this.elements.push(e);
		return e;
	}

	figure2canvas([x, y, w = 0, h = 0]) {
		let [fx, fy, fw, fh] = this.rect;
		x = fx + x * fw;
		y = fy + y * fh;
		y = 1 - y;
		return [
			x * this.context.canvas.width,
			y * this.context.canvas.height,
			w * fw * this.context.canvas.width,
			h * fh * this.context.canvas.height
		];
	}

	/**
	 * 更新画布
	 */
	update() {
		let [width, height] = [this.context.canvas.width, this.context.canvas.height];

		// 清空画布
		this.context.clearRect(0, 0, width, height);
		// 绘制坐标系背景
		this.context.fillStyle = this.#background;
		this.context.fillRect(this.figure2canvas(this.rect));
		// 绘制坐标系边框
		this.context.strokeStyle = '#000';
		this.context.lineWidth = 1;
		this.context.strokeRect(this.figure2canvas(this.rect));

		let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
		for (let p of this.elements) {
			xmin = Math.min(xmin, p.xmin);
			xmax = Math.max(xmax, p.xmax);
			ymin = Math.min(ymin, p.ymin);
			ymax = Math.max(ymax, p.ymax);
		}

		for (let p of this.elements)
			p.render(this, [xmin, xmax, ymin, ymax]);

		this.plots = [];
		return this;
	}

	/**
	 * 设置背景
	 */
	background(v) {
		this.#background = v;
		return this;
	}

	/**
	 * 设置画布分辨率
	 */
	setResolution(w, h) {
		this.canvas.width = w;
		this.canvas.height = h;
		return this;
	}
	/**
	 * 获取分辨率
	 */
	getResolution() {
		return [this.canvas.width, this.canvas.height];
	}
}


// interface
class FigureElement {
	#figure = null;
	constructor() {
	}
	render(...args) {
		console.error(`Unimplemented method!`);
	}
}

class Plot extends FigureElement {
	x = [];
	y = [];
	xmin; xmax;
	ymin; ymax;

	#drawDot = true;
	#drawLine = true;

	#color = '#000';	// 颜色
	#alpha = 1.0;	// 不透明度
	#weight = 1;	// 线的宽度
	#dotSize = 2;	// 点的直径
	/**
	 * @param {Tensor} x 
	 * @param {Tensor} y 
	 */
	constructor(x, y) {
		super();
		if (x.length !== y.length)
			throw new Error(`Length of x, y not match: ${x.length} != ${y.length}`);

		this.x = x;
		this.y = y;

		this.xmin = x.minScalar;
		this.xmax = x.maxScalar;

		this.ymin = y.minScalar;
		this.ymax = y.maxScalar;
	}
	render(figure, [xmin, xmax, ymin, ymax]) {
		let ctx = figure.context;
		let [dx, dy, w, h] = figure.rect;

		globalThis.ctx = ctx;
		// console.log(dx, dy, w, h);
		ctx.lineWidth = this.#weight;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.strokeStyle = this.#color;
		ctx.fillStyle = this.#color;
		ctx.globalAlpha = this.#alpha;

		let points = [];
		for (let i = 0; i < this.x.length; i++) {
			let x = this.x.data[i],
				y = this.y.data[i];
			x = (x - xmin) / (xmax - xmin);
			y = 1 - (y - ymin) / (ymax - ymin);
			x = dx + x * w;
			y = dy + y * h;
			x *= ctx.canvas.width;
			y *= ctx.canvas.height;
			points.push([x, y]);
		}

		if (this.#drawDot) {
			for (let i = 0; i < this.x.length; i++) {
				let [x, y] = points[i];
				ctx.beginPath();
				ctx.arc(x, y, this.#dotSize / 2, 0, 6.283185307179586);
				ctx.fill();
			}
		}

		if (this.#drawLine) {
			ctx.beginPath();
			for (let i = 0; i < this.x.length; i++)
				ctx.lineTo(...points[i]);
			ctx.stroke();
		}

		return this;
	};
	color(col) {
		this.#color = col;
		return this;
	}
	weight(w) {
		this.#weight = w;
		return this;
	}
	dotSize(v) {
		this.#dotSize = v;
		return this;
	}
	alpha(a) {
		this.#alpha = a;
		return this;
	}
	style(s) {
		this.#drawDot = s.includes('.');
		this.#drawLine = s.includes('-');
		return this;
	}
};

class Img extends FigureElement {
	constructor(tensor, mode = 'RGB', x, y, w, h) {
		super();
		mode = mode.toUpperCase();

	}
	render(figure) {

	}
}




export { jsplot };