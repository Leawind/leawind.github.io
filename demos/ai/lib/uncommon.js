class Uwin {
	// style of big box
	static style0 = `
display: block;
position: fixed;
left: 0;
top: 0;
box-shadow: 1px 1px 15px -5px #000;
background: #55d;
border: 0.5px solid #55d;
transition-duration: 0;
transition:transform 50ms;
font-family: consolas;
font-weight: 900;
overflow: hidden;
`
	//style of X
	static style_x = `
display: block;
background: none;
width: 30px;
height: 30px;
position: absolute;
top: 0;
right: 0;
transition-duration: 150ms;
`
	// style of body
	static style_bd = `
display: block;
width: 100%;
height: calc(100% - 30px);
background: #fff;
position: absolute;
bottom: 0;
left: 0;
`
	static style_tt = `
color: #fff;
font-size: 16px;
line-height: 30px;
height: 30px;
max-width: calc(50% - 30px);
overflow: hidden;
position: absolute;
top: 0;
left: 10px;
cursor: default
`
	static minW = 100;
	static minH = 50;
	constructor(w = 100, h = 100, sty = '') {
		w = NJ.max(w, Uwin.minW);
		h = NJ.max(h, Uwin.minH);

		let mele = document.createElement('div')
		mele.setAttribute('style', `${Uwin.style0};width:${w}px;height:${h + 30}px;${sty}`)
		document.body.appendChild(mele)
		mele.onmousedown = function () {
			this.downTime = new Date()*1;
			if ('touches' in event) {
				this.x0 = event.touches[0].clientX
				this.y0 = event.touches[0].clientY
			} else {
				this.x0 = event.clientX;
				this.y0 = event.clientY;
			}
			this.px0 = this.style.left.slice(0, -2) * 1;
			this.py0 = this.style.top.slice(0, -2) * 1;
			this.grabing = true;
			this.style.zIndex = (new Date() * 1 + '').slice(4)
		}
		mele.onmousemove = function () {
			let
				x1 = event.clientX,
				y1 = event.clientY;

			if ('touches' in event) {
				x1 = event.touches[0].clientX
				y1 = event.touches[0].clientY
			} else {
				x1 = event.clientX;
				y1 = event.clientY;
			}
			if (this.grabing) {
				let
					dx = x1 - this.x0,
					dy = y1 - this.y0;
				// dx *= 0.2;
				// dy *= 0.2;
				this.style.left = this.px0 + dx + 'px';
				this.style.top = this.py0 + dy + 'px';
			} else {

			}
			event.preventDefault();
		}
		mele.onmouseup = function () {
			this.grabing = false;
			if (this.style.top.slice(0, -2) * 1 < 0 && 0) {
				this.style.top = '0px'
			}
			let s = this.style.transform;
			if(s=='') s='scale(1)';
			s = s.replace(/[^0-9\.]/g, '');
			switch(event.button){
				case 1:
					this.style.transform = 'scale(1)';
					break;
				case 0:
					if(new Date()*1 - this.downTime > 80)return
					this.style.transform = `scale(${s*1.2})`;
					break;
				case 2:
					if(new Date()*1 - this.downTime > 360)return
					this.style.transform = `scale(${s*0.833})`;
					break;
			}
		}
		mele.oncontextmenu = function(){
			event.preventDefault()
		}
		mele.ontouchstart = mele.onmousedown;
		mele.ontouchmove = mele.onmousemove;
		mele.ontouchend = mele.onmouseup;

		let ele_title = document.createElement('div');
		ele_title.innerHTML = 'Untitled window';
		ele_title.setAttribute('style', Uwin.style_tt);
		mele.appendChild(ele_title);
		this.ele_title = ele_title;

		let X = document.createElement('canvas');
		X.c = X.getContext('2d');
		X.style = Uwin.style_x;
		X.width = 40;
		X.height = 40;
		X.c.beginPath()
		X.c.strokeStyle = '#fff';
		X.c.moveTo(15, 15);
		X.c.lineTo(25, 25);
		X.c.stroke();
		X.c.moveTo(25, 15);
		X.c.lineTo(15, 25);
		X.c.stroke();
		X.onclick = function () {
			// this.parentElement.style.display = 'none';
			this.parentElement.remove();
		}
		X.onmouseover = function () {
			this.style.background = '#f33'
		}
		X.onmouseleave = function () {
			this.style.background = 'none'
		}
		mele.appendChild(X)

		let bd = document.createElement('div')
		bd.setAttribute('style', `${Uwin.style_bd};height:${h}px;`)
		mele.appendChild(bd)
		this.mele = mele;
		this.body = bd;
		bd.onmousedown = function () {
			this.parentElement.style.zIndex = (new Date() * 1 + '').slice(4);
			// event.stopPropagation();
		}
	}
	move(dx = 0, dy = 0) {
		let
			x = this.mele.style.left.slice(0, -2) * 1 + dx,
			y = this.mele.style.top.slice(0, -2) * 1 + dy;
		y = NJ.max(0, y);
		this.mele.style.left = x + 'px';
		this.mele.style.top = y + 'px';
	}
	resize(w, h) {
		w = NJ.max(w, Uwin.minW);
		h = NJ.max(h, Uwin.minH);
		this.mele.style.width = w + 'px';
		this.mele.style.height = h + 30 + 'px';
		this.body.style.height = h + 'px'
	}
	title(txt) {
		this.ele_title.innerHTML = txt;
	}
}

class Plt {
	constructor() {
		this.cvs = null;
		this.c = null;
		this.offset = [0.05, 0.05, 0.05, 0.05];
		this.axisDrawed = false;
		this.webDrawed = false;
		this.gf = [];	// 需要绘制的图像们
	}
	bind(ele) {
		this.cvs = ele;
		ele.style.imageRendering = 'pixelated';
		ele.style.background = '#fff'
		ele.c = ele.getContext('2d');
		this.c = ele.c;
	}
	resize(w, h) {
		if (this.ele === null) {
			console.error('Error: Plt.resize, this.ele = null');
			return;
		}
		this.cvs.width = w;
		this.cvs.height = h;
	}
	clear() {
		this.cvs.width = this.cvs.width;
		this.axisDrawed = false;
		this.webDrawed = false;
	}

	m_scatter(x, y, a = {}) {	// 散点图 (离散静态函数)
		let b = {
			col: '#000',
			s: 2,
		}
		for (let k in a) { b[k] = a[k] };
		this.gf.push({
			mode: '.',
			x: x,
			y: y,
			col: b.col,
			s: b.s,
		})
	}
	m_line(x, y, a = {}) {	// 折线图
		let b = {
			mode: 'w',
			x: x,
			y: y,
			col: '#000',
			s: 2,
		}
		for (let k in a) { b[k] = a[k] };
		this.gf.push(b)
	}
	m_bar(x, y, a = {}) {	// 竖直 条形图
		let b = {
			mode: '|',
			col: '#000',
			s: 2,
			x: x,
			y: y,
			showValue: true,
		}
		for (let k in a) { b[k] = a[k] };
		this.gf.push(b)
	}
	setFontSize(n) {
		this.c.fontSize = int(n);
		this.c.font = this.c.fontSize + 'px consolas';
	}
	show(sarg = {}) {
		let arg = {
			xlim: false,
			ylim: false,
			scale: 1,
		}
		for (let k in sarg) arg[k] = sarg[k];
		let xlim = arg.xlim, ylim = arg.ylim;
		/* 把数组 this.gf 中的图像绘制出来 */
		// 先确定 x,y 区间
		if (!(xlim || ylim)) {
			let a = this.gf[0];
			xlim = [NJ.min(...a.x), NJ.max(...a.x)]
			ylim = [NJ.min(...a.y), NJ.max(...a.y)]
			for (let h = 1; h < this.gf.length; h++) {
				a = this.gf[h];
				xlim[0] = NJ.min(xlim[0], ...a.x)
				xlim[1] = NJ.max(xlim[1], ...a.x)
				ylim[0] = NJ.min(ylim[0], ...a.y)
				ylim[1] = NJ.max(ylim[1], ...a.y)
			}
		}
		let	// 图像区域宽高
			vw = xlim[1] - xlim[0],
			vh = ylim[1] - ylim[0];
		let c = this.c;
		let
			A = [this.offset[3] * this.cvs.width, this.offset[0] * this.cvs.height],
			B = [(1 - this.offset[1]) * this.cvs.width, A[1]],
			C = [B[0], (1 - this.offset[2]) * this.cvs.height],
			D = [A[0], C[1]],
			pw = B[0] - A[0],	// 图像区域宽度像素数
			ph = D[1] - A[1];

		// // 画坐标轴
		// // axis
		// c.lineWidth = 1;
		// c.strokeStyle = '#000';
		// c.beginPath();
		// c.moveTo(...A)
		// c.lineTo(...B)
		// c.lineTo(...C)
		// c.lineTo(...D)
		// c.closePath()
		// c.stroke()
		// // 在轴边标上值
		// /// 端点
		// c.textAlign = 'center';
		// c.fillText(NJ.round(xlim[0], 2), D[0], D[1]+c.fontSize)
		// c.fillText(NJ.round(xlim[1], 2), C[0], C[1]+c.fontSize)
		// c.textAlign = 'right';
		// c.fillText(NJ.round(ylim[0], 2), D[0]-4, D[1]+2)
		// c.fillText(NJ.round(ylim[1], 2), D[0]-4, A[1]+2)

		let
			cw = Math.trunc(Math.log10(vw)) - arg.scale,
			ch = Math.trunc(Math.log10(vh)) - arg.scale;
		cw = Math.pow(10, cw)	// 横轴上每俩刻度间的距离
		ch = Math.pow(10, ch)
		cw = cw / (xlim[1] - xlim[0]) * (B[0] - A[0])	// 横轴上每俩刻度间像素数
		ch = ch / (ylim[1] - ylim[0]) * (D[1] - A[1])	// 纵轴上每俩刻度间像素数

		/// 刻度
		c.strokeStyle = 'rgba(0,0,0,0.5)';
		c.lineWidth = 2;
		c.textAlign = 'center';
		c.fillStyle = '#00f'
		for (let i = D[0]; i < C[0]; i += cw) {	// 横轴
			c.beginPath()
			c.moveTo(i, A[1])
			c.lineTo(i, D[1])
			c.stroke()
			c.fillText(NJ.round((i - A[0]) * vw / pw + xlim[0], 2), i, D[1] + c.fontSize)
		}
		c.textAlign = 'right'
		for (let i = A[1]; i < D[1]; i += ch) {	// 纵轴
			c.beginPath()
			c.moveTo(A[0], i)
			c.lineTo(B[0], i)
			c.stroke()
			c.fillText(NJ.round((D[1] - i) * vh / ph + ylim[0], 2), A[0] - 0.2 * c.fontSize, i)
		}
		// 画图像
		for (let h = 0; h < this.gf.length; h++) {
			let a = this.gf[h];
			if (a.mode === '.') {	// 散点图
				c.fillStyle = a.col;
				for (let i = 0; i < a.x.length; i++) {
					let x = a.x[i], y = a.y[i];
					x = (x - xlim[0]) / (xlim[1] - xlim[0]) * (1 - this.offset[1] - this.offset[3]) * this.cvs.width + this.offset[3] * this.cvs.width;
					y = (ylim[1] - y) / (ylim[1] - ylim[0]) * (1 - this.offset[0] - this.offset[2]) * this.cvs.height + this.offset[0] * this.cvs.height;
					c.beginPath();
					c.arc(x, y, a.s / 2, 0, 6.29);
					c.fill();
				}
			} else if (a.mode === 'w') {	// 折线图
				c.strokeStyle = a.col;
				c.lineWidth = a.s;
				c.beginPath();
				for (let i = 0; i < a.x.length; i++) {
					let x = a.x[i], y = a.y[i];
					x = (x - xlim[0]) / (xlim[1] - xlim[0]) * (1 - this.offset[1] - this.offset[3]) * this.cvs.width + this.offset[3] * this.cvs.width;
					y = (ylim[1] - y) / (ylim[1] - ylim[0]) * (1 - this.offset[0] - this.offset[2]) * this.cvs.height + this.offset[0] * this.cvs.height;
					if (!(isNaN(x) || isNaN(y))) c.lineTo(x, y);
				}
				c.stroke();
			} else if (a.mode === '|') {	// 柱形图
				c.fillStyle = a.col;
				c.textAlign = 'center';
				let wid = (a.x[1] - a.x[0]) * pw / vw * a.s;
				for (let i = 0; i < a.x.length; i++) {
					let x = a.x[i], y = a.y[i];
					x = (x - xlim[0]) / (xlim[1] - xlim[0]) * (1 - this.offset[1] - this.offset[3]) * this.cvs.width + this.offset[3] * this.cvs.width;
					y = (ylim[1] - y) / (ylim[1] - ylim[0]) * (1 - this.offset[0] - this.offset[2]) * this.cvs.height + this.offset[0] * this.cvs.height;
					c.fillRect(x - wid / 2, y, wid, C[1] - y);
					if (a.showValue) {
						c.fillText(NJ.round(a.y[i], 2), x, y - 3);
						c.fillText(NJ.round(a.x[i], 2), x, C[1] + c.fontSize * 1.7)
					}
				}
			}
		}
	}

}
