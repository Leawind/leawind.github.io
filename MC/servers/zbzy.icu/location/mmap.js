"use strict";
window.oncontextmenu = e=>e.preventDefault();	// 关闭鼠标右键菜单

function Mmap(){
	this.cvs = null;	// 画布元素
	this.cstyle = null;	// 画布元素的动态样式对象
	this.ls = [];	// 位置列表
	this.grid = [];	// 网格线列表
	this.dim = 0;	// 当前显示的维度
	// 当前视野中心点坐标
	this.pos = [
		[0, 0],
		[0, 0],
		[0, 0]
	];
	// 一个方块显示为多少像素
	this.scale = 4;
	this.targetScale = 3;
	this.targetScaleTime = 0;
	// 选项
	this.ops = {
		showBlockLine: false,	// 显示方块边界
		showChunkLine: false,	// 显示区块边界
		showGrid: true,	// 显示网格
		gridFontSize: 16,	// 网格刻度文本大小
		dimsBackground: ["#040", "#400", "#004"],	// 各维度背景颜色
		tagSize: 20,	// 标签点大小
		showName: true,	// 显示标签名
		fontScale: 1,	// 标签文本缩放
		changeScaleSpeed: 1.4,	// 每次调整缩放的尺度
		// scaleChangeTime: 1000,	// 切换缩放花的时间(ms)
		scaleK : 0.08,
	}

	this.bindCanvas = function(cvs){
		this.cvs = cvs;
		this.ctx = cvs.getContext('2d');
		// 获得动态样式对象
		this.cstyle = cvs.computedStyleMap();
		// 注册事件
		//TODO
		cvs.addEventListener("wheel", this.eventsHandler.wheel.bind(this));
		cvs.addEventListener("mousedown", this.eventsHandler.mousedown.bind(this));
		cvs.addEventListener("mousemove", this.eventsHandler.mousemove.bind(this));
		cvs.addEventListener("mouseup", this.eventsHandler.mouseup.bind(this));
		cvs.addEventListener("touchstart", this.eventsHandler.touchstart.bind(this));

	}
	this.setLocations = function(obj){
		this.ls = obj;
	}
	this.setDim = function(d){
		this.dim = d;
		// 设置背景
		this.cvs.style.background = this.ops.dimsBackground[this.dim];
	}
	this.setPos = function(x, y){
		this.pos[this.dim] = [x, y];
	}
	this._setScale = function(s){
		this.scale = s;
	}
	this.setTargetScale = function(s){
		this.targetScale = s;
		// this.targetScaleTime = new Date()*1 + this.ops.scaleChangeTime;
	}
	this.FPS = 0;
	this.t0 = new Date()*1;
	this.loop = function(){
		let i;

		let t1 = new Date()*1;
		let T = t1 - this.t0;
		T = Math.min(T, 100);
		this.t0 = t1;
		this.FPS = 1E3/T;

		let s = this.scale;	// 像素每方块
		let dim = this.dim;	// 维度
		let cmr = this.pos[dim];	// 当前视野中心的世界坐标	[x, z]
		let c = this.ctx;	// 画布上下文
		let pw = this.cstyle.get('width').value;	// 作为画布宽度
		let ph = this.cstyle.get('height').value;	// 作为画布高度

		// 设置画布尺寸，顺便清空画布
		this.cvs.width = pw;
		this.cvs.height = ph;
		// 设置背景
		this.cvs.style.background = this.ops.dimsBackground[this.dim];
		// 计算左上角对应的世界坐标
		let P0 = [
			cmr[0] - pw/2/s,
			cmr[1] - ph/2/s
		];
		// 计算右下角对应的世界坐标
		let P1 = [
			cmr[0] + pw/2/s,
			cmr[1] + ph/2/s
		];
		// 生成网格线
		if(this.ops.showBlockLine && pw*0.25>P1[0]-P0[0]){
			for(i=Math.floor(P0[0]);i<P1[0];i++){
				this.grid.push({
					color: "rgba(10,10,255,0.4)",
					p0: [i, P0[1]],
					p1: [i, P1[1]]
				})
			}
			for(i=Math.floor(P0[1]);i<P1[1];i++){
				this.grid.push({
					color: "rgba(255,10,10,0.4)",
					p0: [P0[0], i],
					p1: [P1[0], i]
				})
			}
		}else if(this.ops.showChunkLine && pw*4>P1[0]-P0[0]){
			for(i=P0[0]-P0[0]%16;i<P1[0];i+=16){
				this.grid.push({
					color: "rgba(10,10,255,0.8)",
					p0: [i, P0[1]],
					p1: [i, P1[1]]
				})
			}
			for(i=P0[1]-P0[1]%16;i<P1[1];i+=16){
				this.grid.push({
					color: "rgba(255,10,10,0.8)",
					p0: [P0[0], i],
					p1: [P1[0], i]
				})
			}
		}
		if(this.ops.showGrid){
			let step=2;
			c.font = `${this.ops.gridFontSize}px consolas`;
			step = Math.max(step, c.measureText("30000000 ").width / s);

			// step = Math.pow(10, 1+Math.floor(Math.log10(step)))
			step = Math.pow(2, 1+Math.floor(Math.log(step)/Math.log(2)));
			// if(step>10) step = step-step%10;
			// else step = Math.floor(step);

			for(i=P0[0]-P0[0]%step;i<P1[0];i+=step){
				this.grid.push({
					color: "rgba(85,85,255,0.7)",
					p0: [i, P0[1]],
					p1: [i, P1[1]],
					showScale: 0
				})
			}
			for(i=P0[1]-P0[1]%step;i<P1[1];i+=step){
				this.grid.push({
					color: "rgba(255,85,85,0.7)",
					p0: [P0[0], i],
					p1: [P1[0], i],
					showScale: 1,
				})
			}
		}
		// 遍历所有网格线
		for(let i=0;i<this.grid.length;i++){
			let l = this.grid[i];
			let p0 = [
				(l.p0[0] - cmr[0]) * s + pw/2,
				(l.p0[1] - cmr[1]) * s + ph/2
			]
			let p1 = [
				(l.p1[0] - cmr[0]) * s + pw/2,
				(l.p1[1] - cmr[1]) * s + ph/2
			]
			c.beginPath();
			c.moveTo(...p0);
			c.lineTo(...p1);
			c.strokeStyle = l.color;
			c.lineWidth=1;
			c.stroke();
			if("showScale" in l){
				c.font = `${this.ops.gridFontSize}px consolas`;
				c.fillStyle = 'rgba(255,255,255,0.5)';
				c.fillText(l.p0[l.showScale], p0[0], p0[1]+this.ops.gridFontSize)
			}
		}
		this.grid = [];

		
		// 遍历所有位置
		for(i=0;i<this.ls.length;i++){
			let l = this.ls[i];
			// 如果不是这个维度，直接跳过
			if(l.dim != dim) continue;
			// 获取坐标
			let x = l.pos[0];
			let y = l.pos.length === 2 ? null : l.pos[1];
			let z = l.pos[l.pos.length-1];

			// 判断是否在视野内
			if(x>P0[0] && x<P1[0] && z>P0[1] && z<P1[1] || 1){
				// console.log(l);
				let _hs = this.ops.tagSize/2;
				let _v = [
					(x - cmr[0]) * s + pw/2-_hs,
					(z - cmr[1]) * s + ph/2-_hs
				];
				c.fillStyle = '#fff';
				c.fillRect(_v[0], _v[1], _hs*2, _hs*2);
				c.font = `${_hs*2.5*this.ops.fontScale}px consolas`;
				c.textAlign = 'center';
				c.fillStyle = '#fff';
				if(this.ops.showName) c.fillText(l.name, _v[0], _v[1]-_hs/2);
			}
		}

		// scale 变化 (t1:当前时间 this.targetScaleTime:目标时间 this.targetScale:目标值 this.scale:当前值 T:帧时间)
		this.scale += (this.targetScale-this.scale)* this.ops.scaleK * T;

		// 


	}
	this.start = function(){
		let func = this.loop.bind(this);
		setInterval(func, 0);
	}
	this._ev = {};
	this.eventsHandler = {
		wheel: function(e){
			e.preventDefault();
			if(e.deltaY<0){
				this.setTargetScale(this.scale*this.ops.changeScaleSpeed);
			}else{
				this.setTargetScale(this.scale/this.ops.changeScaleSpeed);
			};
		},
		mousedown: function(e){
			if(e.button===0){
				this._ev.holding = true;
				this._ev.downX = e.offsetX;
				this._ev.downY = e.offsetY;
				this._ev.downPX = this.pos[this.dim][0];
				this._ev.downPY = this.pos[this.dim][1];
				this._ev.downTime = e.timeStamp;
			}
		},
		mousemove: function(e){
			if(this._ev.holding){
				// console.log(e);
				let dx = (e.offsetX - this._ev.downX) / this.scale;
				let dy = (e.offsetY - this._ev.downY) / this.scale;
				// console.log(dx, dy);
				this.setPos(
						this._ev.downPX - dx,
						this._ev.downPY - dy
				);
			}
		},
		mouseup: function(e){
			if(e.button===0){
				this._ev.holding = false;
			}
		},
		touchstart: function(e){
			e.preventDefault();
		},
		_point: function(e){

		},
		_doublepoint: function(e){

		}
	}
}