"use strict";

var numjs = {
	OUTER_VALUE: 0,	// 获取矩阵范围外的元素时的取值
	mat: null,	// 定义矩阵
	add: null,	// 矩阵的对应元素相加//TODO
	sub: null,	// 矩阵的对应元素相减//TODO
	dotmul: null,	// 矩阵点乘//TODO
	tr: null,	// 矩阵转置//TODO
	conv2d: null, // 2d卷积(卷积核, 被卷积的矩阵, 步长, )//TODO
	ones: null,	// 全 1 矩阵(x, y)
	zeros: null,	// 全 0 矩阵(x, y)
	rand: null,	// 随机矩阵(x, y)

};

numjs.ones = function(x, y){
	let m=[], i=0,j;
	for(;i<y;i++){
		m[i] = [];
		for(j=0;j<x;j++) m[i][j] = 1;
	}
	return new numjs.Mat(m);
}
numjs.zeros = function(x, y){
	let m=[], i=0,j;
	for(;i<y;i++){
		m[i] = [];
		for(j=0;j<x;j++) m[i][j] = 0;
	}
	return new numjs.Mat(m);
}
numjs.rand = function(x, y){
	let m=[], i=0,j;
	for(;i<y;i++){
		m[i] = [];
		for(j=0;j<x;j++) m[i][j] = Math.random();
	}
	return new numjs.Mat(m);
}

numjs.Mat = function(iter=0){
	if(!(this instanceof numjs.Mat)) throw '[Error] Expected "new" before constructor numjs.Mat!';
	this.type = '<numjs matrix>';
	this.m = null;
	if(Array.isArray(iter)){
		if(Array.isArray(iter[0])){
			this.m = [];
			for(let i=0;i<iter.length;i++){
				this.m.push(iter[i].slice(0));
			}
		}else{
			this.m = [Array.from(iter)];
		}
	}else{
		this.m = [[iter*1]];
	}
	this.c = this.m[0].length;	// 列数
	this.r = this.m.length;	// 行数
	this.outer = numjs.OUTER_VALUE;

	this.toString = function(){
		let i, j;
		let t = `numjs matrix: ${this.c}x${this.r}\n`;
		for(i=0;i<this.r;i++){
			t += '\t';
			for(j=0;j<this.c;j++){
				t += `\t${this.m[i][j]},`;
			}
			t += '\n';
		}
		t += '\n';
		return t;
	}
	// 读取元素
	this.get = function(x, y){
		if(x<0 || y<0 || x>=this.c || y>=this.r){
			return 0;
		}else
			return this.m[y][x];
	}
	// 修改元素
	this.set = function(x, y, v){
		if(x<0 || y<0 || x>=this.c || y>=this.r){
			return false;
		}else
			this.m[y][x] = v;
			return true;
	}
	// 大小
	this.size = function(){
		return [this.c, this.r];
	}
	// 返回转置后的矩阵, 自身不变
	this.T = function(){
		let m = [];
		for(let i=0;i<this.c;i++){
			m[i] = [];
			for(let j=0;j<this.r;j++){
				m[i][j] = this.m[j][i];
			}
		}
		return new numjs.Mat(m);
	}
	// 用函数器遍历元素, 改变自身
	this.map = function(func){
		let i,j;
		for(i=0;i<this.r;i++){
			for(j=0;j<this.c;j++){
				this.m[i][j] = func(this.m[i][j], j, i);
			}
		}
		return this;
	}
	// 复制自身
	this.copy = function(){
		return new numjs.Mat(this.m);
	}
	// 矩阵加法, 改变自身
	this.add = function(m){
		if(this.c!==m.c || this.r!==m.r) throw '[Error] Mat size not match';
		let i,j;
		for(i=0;i<this.r;i++){
			for(j=0;j<this.c;j++){
				this.m[i][j] += m.m[i][j];
			}
		}
		return this;
	}
	// 矩阵减法, 改变自身
	this.sub = function(m){
		if(this.c!==m.c || this.r!==m.r) throw '[Error] Mat size not match';
		let i,j;
		for(i=0;i<this.r;i++){
			for(j=0;j<this.c;j++){
				this.m[i][j] -= m.m[i][j];
			}
		}
		return this;
	}
	// 点乘, 返回结果, 不改变自身
	this.dotmul = function(m){
		if(this.c!==m.c || this.r!==m.r) throw '[Error] Mat size not match';
		let i,j, s=0, t;
		for(i=0;i<this.r;i++){
			for(j=0;j<this.c;j++){
				t = this.m[i][j] * m.m[i][j];
				s += isNaN(t) ? 0 : t;
			}
		}
		return s;
	}
	// 求各元素的和
	this.sum = function(){
		let i,j, s=0;
		for(i=0;i<this.r;i++){
			for(j=0;j<this.c;j++){
				s += this.m[i][j];
			}
		}
		return s;
	}
	// 求均值
	this.avg = function(){
		return this.sum() / this.c / this.r;
	}
	// 显示为图像
	this.show = function(tt="Image from a Matrix"){
		var cvs = document.createElement("canvas");
		cvs.width = this.c;
		cvs.height = this.r;
		var ctx = cvs.getContext('2d');
		var idt = ctx.createImageData(this.c, this.r);
		var dt = idt.data;
		let i, j, f;
		for(i=0;i<this.c;i++){
			for(j=0;j<this.r;j++){
				f = (j*this.c + i) * 4;
				dt[f] = this.m[j][i];
				dt[f+1] = this.m[j][i];
				dt[f+2] = this.m[j][i];
				dt[f+3] = 255;
			}
		}
		ctx.putImageData(idt, 0, 0);

		var w = new Uwin(this.c, this.r);
		w.title(tt);
		w.body.style.overflow = 'auto';
		w.body.appendChild(cvs)
	}
}

// 二维卷积
numjs.conv2d = function(k, sm, step=1){
	let a = k.c, i,j, si=-1;
	let res = [];
	for(i=0;i<=sm.r-a;i+=step){
		res.push([]);
		si++;
		for(j=0;j<=sm.c-a;j+=step){
			// 计算点乘 k .* sm[i:i+a, j:j+a]
			let x, y, s=0, t;
			for(x=0;x<a;x++){
				for(y=0;y<a;y++){
					t = k.m[x][y] * sm.m[i+x][j+y];
					s += isNaN(t) ? 0 : t;
				}
			}
			res[si].push(s);
		}
	}
	return new numjs.Mat(res);
}

// 从img元素读取图像数据(矩阵)
// ele:	img 元素
// mode:	模式, (L:灰度图, 得到一个矩阵|RGB:彩图, 得到一个包含3个矩阵的数组)
numjs.imread = function(ele, mode='L'){
	if(!ele.complete){
		console.warn(ele, "ele not completed!");
	}
	var cvs = document.createElement('canvas');	// 创建一个canvas元素
	cvs.width = ele.width;
	cvs.height = ele.height;
	var ctx = cvs.getContext('2d');	// 获取2d上下文
	cvs.remove();	// 用完即弃
	ctx.drawImage(ele, 0, 0);	// 绘制图像
	var dt = ctx.getImageData(0, 0, cvs.width, cvs.height).data;	// 获取图像数据
	let i, j;
	if(mode==='L'){	// 灰度图
		var m=[];
		for(i=0;i<cvs.height;i++){
			m[i] = [];
			for(j=0;j<cvs.width;j++){
				let f = (i*cvs.width + j)*4;
				m[i][j] = (dt[f] + dt[f+1] + dt[f+2])/3 * dt[f+3]/256;
			}
		}
	}else{	// RGB彩色图

	}
	return new numjs.Mat(m);
}
