function Mmap(){
	this.cvs = null;	// 画布元素
	this.cstyle = null;	// 画布元素的动态样式对象
	this.ls = [];	// 位置列表
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
		dimsBackground: ["#040", "#400", "#004"],	// 各维度背景颜色
		tagSize: 40,	// 标签大小
		showName: true,	// 显示标签名
		fontScale: 1,	// 标签文本缩放
		changeScaleSpeed: 1.2,	// 每次调整缩放的尺度
		scaleChangeTime: 1000,	// 切换缩放花的时间(ms)
	}

	this.bindCanvas = function(ele){
		this.cvs = ele;
		this.ctx = ele.getContext('2d');
		// 获得动态样式对象
		this.cstyle = ele.computedStyleMap();
		// 注册事件
		//TODO
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
		this.targetScaleTime = new Date()*1 + this.ops.scaleChangeTime;
	}
	this.FPS = 0;
	this.t0 = 0;
	this.loop = function(){
		let i;

		t1 = new Date()*1;
		T = t1 - this.t0;
		T = Math.max(T, 100);
		this.t0 = t1;
		this.FPS = 1E3/T;

		let s = this.scale;	// 一个方块多少像素
		let dim = this.dim;	// 维度
		let cmr = this.pos[dim];	// 当前视野中心的世界坐标	[x, z]
		let c = this.ctx;	// 画布上下文
		let pw = this.cstyle.get('width').value;	// 作为画布宽度
		let ph = this.cstyle.get('height').value;	// 作为画布高度
		
		// 设置画布尺寸，顺便清空画布
		this.cvs.width = pw;
		this.cvs.height = ph;
		[pw/2, ph/2]	// 画布中心点的画布坐标
		
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

		// 遍历所有位置
		for(let i=0;i<this.ls.length;i++){
			l = this.ls[i];
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
				c.fillRect(_v[0], _v[1], _hs, _hs);
				c.font = `${_hs*2.5*this.ops.fontScale}px consola`;
				c.textAlign = 'center';
				if(this.ops.showName) c.fillText(l.name, _v[0], _v[1]-_hs/2);
			}
		}

		// scale 变化 (t1:当前时间 this.targetScaleTime:目标时间 this.targetScale:目标值 this.scale:当前值 T:帧时间)
		this.scale += (this.targetScale-this.scale)/20

		// 


	}
	this.start = function(){
		func = this.loop.bind(this);
		setInterval(func, 0);
	}

}