//TODO 绘制各区域场强
// TODO 弹性伸缩杆的长度限制，超出后损毁
// TODO bug

var DEBUGMODE = 0;
function db_checkNumber(...args) {
	if (DEBUGMODE < 3) return;
	for (let a of args) {
		if (Array.isArray(a)) {
			db_checkNumber(...a);
		} else {
			if (
				typeof a === "undefined" ||
				a === null ||
				(typeof a === "number" && !isFinite(a))
			) {
				debugger;
				throw new Error("Invalid number: " + a);
			}
		}
	}
}

var Vectorjs = {
	// 两点距离
	distance: (x, y) => {
		let s = 0;
		for (let i = 0; i < x.length; i++) s += Math.pow(x[i] - y[i], 2);
		return Math.sqrt(s);
	},
	//对应元素相乘
	nmul: (x, y) => {
		let res = [];
		for (let i = 0; i < x.length; i++) res[i] = x[i] * y[i];
		return res;
	},
	// 数乘向量
	dmul: (d, x) => {
		let res = [];
		for (let i = 0; i < x.length; i++) {
			res[i] = d * x[i];
		}
		return;
	},
	// 求向量的模
	mod: (x) => {
		let s = 0;
		for (let i of x) s += i * i;
		return Math.sqrt(s);
	},
	// 计算向量的方向向量（单位向量）
	toUnit: function (x) {
		let m = this.mod(x),
			res = [];
		for (let i = 0; i < x.length; i++) res[i] = m ? x[i] / m : 0;
		return res;
	},
	// a 在 b 方向上的分量
	"|>": function (a, b) {
		let tp = (a[0] * b[0] + a[1] * b[1]) / (b[0] * b[0] + b[1] * b[1]);
		return [tp * b[0], tp * b[1]];
	},
	// a 在 与 b 垂直方向上的分量
	"|-": function (a, b) {
		let tp = (a[0] * b[1] - a[1] * b[0]) / (b[0] * b[0] + b[1] * b[1]);
		return [tp * b[1], -tp * b[0]];
	},
};

class LignetWorld {
	consts = {
		PI: 3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664, // 圆周率
		E: 2.71828182845904523536028747135266249775724709369995957496696762772407663035354759457138217852516, //自然常数
		G: 6.674259e-11, // 引力常量 m^3 * kg * s^{-2}
		c: 299792458.0, //光速 m * s^{-1}
		c2: 89875517873681764.0, // 光速的平方 c^2
	};

	maxVelocity = 299792458 * 0.5; // 允许达到的最大速度

	size = [0, 0]; // 世界大小

	objectsCount = 0; // 对象数量
	objectsList = []; // 对象数组
	objectVacancies = []; // 数组中的空位，有时会删除对象数组的中间元素，所以会留下空位

	relations = {}; // 连接 2 个物体的关系

	// 渲染选项
	renderOptions = {
		nameVisible: false, // 物体名称 可见性
		idVisible: false, // 物体 ID 可见性
		fVisible: false, // 物体所受合力 可见性
	};

	// 强度仅与位置有关的场
	// 这里使用函数来表示场的情况，参数是世界中的绝对坐标，返回值是场强（可能是向量或数值）
	x_fields = {
		gravity: (x) => [0, 0], // 重力场
		electric: (x) => [0, 0], // 电场
		magnetic: (x) => 0, // 磁场, 垂直屏幕向外为正
		force: (x) => [0, 0], // 力场，对所有物体施加相同的力（虚拟概念）
	};

	// 物体在世界中任意位置移动时的摩擦系数(v^1)
	fc = 0.0;

	// 流体阻力系数(v^2)
	frc = 0.0;

	/**
	 * 构造函数
	 */
	constructor() {}

	/** 设置世界大小
	 * @param {number} size 世界大小，单位是 m
	 */
	setWorldSize(size) {
		this.size = size;
	}
	/**
	 * 添加物体
	 * @param obj 物体对象
	 * @param x 物体坐标
	 */
	appendObject(obj, x) {
		if (obj instanceof LignetObject) {
			obj.world = this;
			this.objectsCount++;
			let index = this.objectVacancies.length
				? this.objectVacancies.pop()
				: this.objectsList.length;
			this.objectsList[index] = obj;
			obj.id = index;
			obj.x[0] = x[0];
			obj.x[1] = x[1];
		}
	}
	/**
	 * 移除物体
	 * @param obj 物体对象
	 */
	removeObject(obj) {
		if (obj instanceof LignetObject) {
			this.objectsCount--;
			if (obj.id in this.objectsList && this.objectsList[obj.id] == obj) {
				delete this.objectsList[obj.id];
				this.objectVacancies.push(obj.id);
				obj.id = null;
			}
		}
	}

	/**
	 * 在俩物体之间添加关系
	 *
	 * @param rlt 关系
	 * @param obj0 物体0
	 * @param obj1 物体1
	 */
	appendRelation(rlt, obj0, obj1) {
		if (rlt instanceof LignetRelation) {
			rlt.world = this;
			this.relations[rlt.symbol] = rlt;
			rlt.object0 = obj0;
			rlt.object1 = obj1;
		}
	}

	/**
	 * 删除关系
	 * @param rlt 关系对象
	 */
	removeRelation(rlt) {
		if (rlt instanceof LignetRelation) {
			delete this.relations[rlt.symbol];
		}
	}

	// 物理更新帧数统计值
	physicFrameCounter = 0;

	/**
	 * 物理更新
	 * @param dt 上一帧经过的时间
	 */
	update_physic(dt = 0) {
		this.physicFrameCounter++;
		for (let obj of this.objectsList) {
			db_checkNumber(obj.v);
			let v2 = Math.pow(obj.v[0], 2) + Math.pow(obj.v[1], 2); // 速度平方
			let mv = Math.sqrt(v2); // 速度大小
			let _uv = Vectorjs.toUnit(obj.v); // 速度的单位向量

			// 限制速度
			if (mv >= this.maxVelocity) {
				mv = this.maxVelocity;
				obj.v[0] = mv * _uv[0];
				obj.v[1] = mv * _uv[1];
				v2 = mv * mv; // 速度平方
			}

			// 根据广义相对论计算动质量
			// 不必担心速度为 infinity 导致 _m = NaN 的情况，因为上面已经对速度作出了限制
			db_checkNumber(obj._m);
			obj._m = (obj.mo * this.consts.c) / Math.sqrt(this.consts.c2 - v2);

			// 计算合力
			obj._F[0] += obj.fields._gravity[0] * obj._m;
			obj._F[1] += obj.fields._gravity[1] * obj._m;
			obj._F[0] += obj.fields._electric[0] * obj.charge;
			obj._F[1] += obj.fields._electric[1] * obj.charge;
			db_checkNumber(obj._F);

			// magnet/

			obj._F[0] -= obj.frc * this.frc * v2 * _uv[0];
			obj._F[1] -= obj.frc * this.frc * v2 * _uv[1];
			db_checkNumber(obj._F);

			obj._F[0] -= obj.fc * this.fc * mv * _uv[0];
			obj._F[1] -= obj.fc * this.fc * mv * _uv[1];
			db_checkNumber(obj._F);

			// 计算冲量
			obj._I = [0, 0];
			obj._I[0] = obj._F[0] * dt;
			obj._I[1] = obj._F[1] * dt;
			db_checkNumber(obj._I);

			{
				// 被监视的属性
				obj.monitored._F[0] = obj._F[0];
				obj.monitored._F[1] = obj._F[1];
			}
			obj._F = [0, 0];

			// 计算速度
			obj.v[0] += obj._I[0] / obj._m;
			obj.v[1] += obj._I[1] / obj._m;
			db_checkNumber(obj.v);

			// 计算坐标
			obj.x[0] += obj.v[0] * dt; //+ Math.random() * 2e-10 - 1e-10;
			obj.x[1] += obj.v[1] * dt; //+ Math.random() * 2e-10 - 1e-10;
			db_checkNumber(obj.x);

			// 计算该点物理场
			let tpf;
			obj.fields._gravity = [0, 0];
			obj.fields._electric = [0, 0];
			obj.fields._magnetic = 0;

			tpf = this.x_fields.gravity(obj.x);
			obj.fields._gravity[0] += tpf[0];
			obj.fields._gravity[1] += tpf[1];
			db_checkNumber(obj.fields._gravity);

			tpf = this.x_fields.electric(obj.x);
			obj.fields._electric[0] += tpf[0];
			obj.fields._electric[1] += tpf[1];
			db_checkNumber(obj.fields._electric);

			// TODO magnet
			tpf = this.x_fields.magnetic(obj.x);

			/// 碰撞检测
			// 遍历其他物体
			for (let nobj of this.objectsList) {
				if (!nobj || nobj == obj) continue; //如果为空或就是自身则跳过

				let _d = [nobj.x[0] - obj.x[0], nobj.x[1] - obj.x[1]], // P1 P2
					ud = Vectorjs.toUnit(_d), // d 的单位向量
					dist = Vectorjs.mod(_d), // 距离
					dist2 = Math.pow(dist, 2); // 距离平方
				db_checkNumber(_d, ud, dist, dist2);
				// 物理场
				if (dist2 > 1e-22) {
					tpf = (this.consts.G * nobj._m) / dist2;
					obj.fields._gravity[0] += tpf * ud[0];
					obj.fields._gravity[1] += tpf * ud[1];

					tpf = nobj.charge / dist2;
					obj.fields._electric[0] -= tpf * ud[0];
					obj.fields._electric[1] -= tpf * ud[1];

					// magnet
					db_checkNumber(
						obj.fields._gravity,
						obj.fields._electric,
						obj.fields._magnetic
					);
				}

				// 碰撞
				if (nobj.id > obj.id && obj.contactCheck(nobj))
					obj.collide(nobj);
			}

			const maxc = 1;
			for (let j = 0; j < maxc; j++) {
				let cc = 0; // 统计碰撞次数
				// 世界边界
				if (obj.x[0] < obj.radius) {
					cc++;
					obj.x[0] = obj.radius;
					obj.v[0] *= -obj.cvc;
					obj._F[0] = 0;
				} else if (obj.x[0] > this.size[0] - obj.radius) {
					cc++;
					obj.x[0] = this.size[0] - obj.radius;
					obj.v[0] *= -obj.cvc;
					obj._F[0] = 0;
				}
				if (obj.x[1] < obj.radius) {
					cc++;
					obj.x[1] = obj.radius;
					obj.v[1] *= -obj.cvc;
					obj._F[1] = 0;
				} else if (obj.x[1] > this.size[1] - obj.radius) {
					cc++;
					obj.x[1] = this.size[1] - obj.radius;
					obj.v[1] *= -obj.cvc;
					obj._F[1] = 0;
				}
				// 再一次碰撞检测
				for (let nobj of this.objectsList) {
					if (nobj.id > obj.id && obj.contactCheck(nobj)) cc++;
				}
				if (cc < 10) break;
			}
			db_checkNumber(v2, mv, _uv);
			db_checkNumber(obj._m, obj._F, obj._I, obj.v, obj.x);
			db_checkNumber(
				obj.fields._gravity,
				obj.fields._electric,
				obj.fields._magnetic
			);
		}

		for (let sb of Object.getOwnPropertySymbols(this.relations)) {
			let rlt = this.relations[sb];
			rlt.update(dt);
		}
	}

	/** 将世界渲染到画布上
	 * @param cvs {CanvasElement} 画布元素
	 * @param P0 视野左下角的世界坐标
	 * @param P1 视野右上角的世界坐标
	 * @param reso 世界中的 1m 代表多少像素
	 */
	render(cvs, P0, P1, reso) {
		if (!("ctx" in cvs)) cvs.ctx = cvs.getContext("2d");
		if (!("gl" in cvs)) cvs.gl = cvs.getContext("webgl");
		let c = cvs.ctx;
		// 设置画布的像素
		cvs.width = (P1[0] - P0[0]) * reso;
		cvs.height = (P1[1] - P0[1]) * reso;
		// 遍历世界中的物体
		for (let obj of this.objectsList) {
			if (obj && obj.visible) {
				obj.render(cvs.ctx, P0, P1, reso);
			}
		}
		// 遍历关系
		for (let sb of Object.getOwnPropertySymbols(this.relations)) {
			let rlt = this.relations[sb];
			if (rlt && rlt.visible) {
				rlt.render(cvs.ctx, P0, P1, reso);
			}
		}
	}
}

// 以下划线开头的属性表示在运行过程中被赋值的中间变量
class LignetObject {
	// 独一无二的 id，在加入世界时被赋予
	id = null;
	// 所在的世界
	world = null;
	// 名称
	name = null;
	// 可见性
	visible = true;

	// 被监控的属性，在物理帧中修改，在物理帧完成之后仍可读取
	monitored = {
		_F: [0, 0], // 所受合外力
	};

	/**
	 * 与另一个物体间的重叠检测
	 * 如果发生重叠，则立即把它们拉开，并且将连线方向上的合力分量置 0
	 * 并返回是否重叠
	 *
	 * @param obj 另一个物体对象
	 * @return {boolean} 是否发生重叠
	 */
	contactCheck(obj) {
		throw new Error("You forgot to overwrite this method!!!");
	}

	/**
	 * 与另一个物体的碰撞，在已经确认发生碰撞（重叠）的时候调用此方法来改变其速度
	 *
	 * @param obj 另一个物体对象
	 */
	collide(obj) {
		throw new Error("You forgot to overwrite this method!!!");
	}

	/**
	 *  渲染函数
	 * @param ctx 画布的 context2D 对象
	 * @param P0 可视区域的左下角世界坐标
	 * @param P1 可视区域的右上角世界坐标
	 * @param s 世界中的 1m 代表多少像素
	 */
	render(ctx, P0, P1, s) {
		throw new Error("You forgot to overwrite this method!!!");
	}

	// 最大半径
	radiusMax = 0;

	/// 物理属性

	// 静止质量
	mo = 1;

	// _动质量
	_m = 1;

	// 电荷量 (C 库仑)
	charge = 0.0;

	// 摩擦系数(速度^1)
	fc = 0.0;

	// 流体阻力系数(速度^2)
	frc = 0.0;

	// _该点等效物理场
	fields = {
		_gravity: [0, 0],
		_electric: [0, 0],
		_magnetic: 0,
	};

	// 所受合力
	_F = [0, 0];

	/// 时空属性

	// 锁定位置
	do_lock_x = false;
	// 重心位置矢量
	x = [0, 0];
	// 速度
	v = [0, 0];
	// 冲量
	_I = [0, 0];

	constructor(name = null) {
		this.name = name;
	}
}

class Particle extends LignetObject {
	radius = 0.2;

	// 碰撞系数(碰撞后保留的动能比例)
	cvc = 0.85;

	// 样式
	style = {
		fill: false, //"#ffff00",
		stroke: "#44f",
		strokeWidth: 4,
	};

	// 重叠检测
	contactCheck(obj) {
		if (!obj || obj == this) return false;

		let _d = [obj.x[0] - this.x[0], obj.x[1] - this.x[1]], // P1 P2
			dist = Vectorjs.mod(_d); // 距离
		if (obj instanceof Particle) {
			if (dist < this.radius + obj.radius) {
				let $0 = (this.radius + obj.radius - dist) / dist / 2,
					$m1 = this._m / (this._m + obj._m), // 二者质量占比
					$m2 = 1 - $m1;
				let extraAway = 1.002;
				this.x[0] -= _d[0] * $0 * $m2 * extraAway;
				this.x[1] -= _d[1] * $0 * $m2 * extraAway;
				obj.x[0] += _d[0] * $0 * $m1 * extraAway;
				obj.x[1] += _d[1] * $0 * $m1 * extraAway;

				// 将二者连线方向上的合力分量置 0
				this._F = Vectorjs["|>"](this._F, _d);
				obj._F = Vectorjs["|>"](obj._F, _d);
				return true;
			}
		}
		return false;
	}

	// 碰撞
	collide(obj) {
		let _d = [obj.x[0] - this.x[0], obj.x[1] - this.x[1]], // P1 P2
			dist = Vectorjs.mod(_d), // 距离
			dist2 = Math.pow(dist, 2); // 距离平方
		db_checkNumber(_d, dist, dist2);
		// 计算碰撞后速度
		let cvc = Math.sqrt(this.cvc * obj.cvc),
			m1 = 2 / (this._m + obj._m),
			m2 = (this._m - obj._m) / (this._m + obj._m);

		db_checkNumber(cvc, m1, m2);

		let _hA = (this.v[0] * _d[1] - _d[0] * this.v[1]) / dist2;
		_hA = [_hA * _d[1], -_hA * _d[0]];
		let _hB = (obj.v[0] * _d[1] - _d[0] * obj.v[1]) / dist2;
		_hB = [_hB * _d[1], -_hB * _d[0]];
		db_checkNumber(_hA, _hB);

		let _yA = (this.v[0] * _d[0] + this.v[1] * _d[1]) / dist2;
		_yA = [_yA * _d[0], _yA * _d[1]];
		let _yB = (obj.v[0] * _d[0] + obj.v[1] * _d[1]) / dist2;
		_yB = [_yB * _d[0], _yB * _d[1]];
		db_checkNumber(_yA, _yB);

		let _rV = [_yB[0] - _yA[0], _yB[1] - _yA[1]]; // obj 相对于 this 的速度

		let _ya = [
				(obj._m * m1 * _yB[0] + m2 * _yA[0]) * cvc,
				(obj._m * m1 * _yB[1] + m2 * _yA[1]) * cvc,
			],
			_yb = [
				(this._m * m1 * _yA[0] - m2 * _yB[0]) * cvc,
				(this._m * m1 * _yA[1] - m2 * _yB[1]) * cvc,
			];
		db_checkNumber(_ya, _yb);

		let $1 = [_hA[0] + _ya[0], _hA[1] + _ya[1]],
			$2 = [_hB[0] + _yb[0], _hB[1] + _yb[1]];
		db_checkNumber($1, $2);

		this.v = $1;
		obj.v = $2;
	}

	// 渲染
	render(c, P0, P1, s) {
		let x = (this.x[0] - P0[0]) * s,
			y = (P1[1] - this.x[1]) * s, // 粒子的屏幕坐标
			r = this.radius * s;
		if (this.style.fill || this.style.stroke) {
			c.beginPath();
			c.arc(x, y, r - this.style.strokeWidth / 2, 0, 2 * Math.PI);
			if (this.style.stroke) {
				c.strokeStyle = this.style.stroke;
				c.lineWidth = this.style.strokeWidth;
				c.stroke();
			}
			if (this.style.fill) {
				c.fillStyle = this.style.fill;
				c.fill();
			}
		}

		if (this.world.renderOptions.fVisible) {
			c.beginPath();
			c.moveTo(x, y);
			c.lineTo(
				x +
					this.monitored._F[0] *
						this.world.renderOptions.fVisible *
						s,
				y + this.monitored._F[1] * this.world.renderOptions.fVisible * s
			);
			c.lineWidth = 1;
			c.strokeStyle = "#fff";
			c.stroke();
		}
	}

	constructor() {
		super();
		this.radiusMax = this.radius;
	}
}

/**
 * 连接俩物体的关系，可以决定物体间的相互作用力
 */
class LignetRelation {
	// 所在的世界
	world;
	// ID
	symbol = null;
	// 连接的俩物品
	object0;
	object1;
	// 构造函数
	constructor() {
		this.symbol = Symbol(); // 创建独一无二的ID
	}
	// 摧毁关系
	destroy() {
		this.world.removeRelation(this);
	}
	// 物理更新
	update(dt) {
		throw new Error("You forgot to overwrite this method!!!");
	}

	// 是否可见
	visible = true;
	// 渲染
	render(ctx, P0, P1, s) {
		throw new Error("You forgot to overwrite this method!!!");
	}
}

/**
 * 伸缩弹性杆
 */
class TelescopicElasticRod extends LignetRelation {
	// 自然长度 m
	length = 0.2;

	// 最短长度，小于它时损毁
	minLength = 0;
	// 最大长度，大于它时损毁
	maxLength = 0.4;

	// 弹力(零点导数)
	strength = 5;

	// 阻尼系数 s/m
	damping = 1e-9;

	// 弹力与长度的关系, 正代表拉力，负代表推力
	resilience(x) {
		// E=2.7182818
		// Slider(y, 0.2, 20, 0.01)
		// Slider(a, 0.1, 2, 0.01)
		// Slider(dxy, 0.1, 2, 0.01)
		// b = dxy / a
		// c = a*b*y
		// Plot((x>y) a * (E^(b*(x-y)) - 1), colors=blue)
		// Plot((x<=y) * c * ln(x/y), colors=red)
		const a = this.length;
		const b = this.strength / a;
		const c = a * b * this.length; // 确保平滑

		let r =
			x > this.length
				? a * (Math.exp(b * (x - this.length)) - 1)
				: c * Math.log(x / this.length);
		r = Math.min(r, 10);
		r = Math.max(r, -10);
		return r;
	}
	//
	update(dt) {
		//
		let o0 = this.object0,
			o1 = this.object1;

		let _d = [o1.x[0] - o0.x[0], o1.x[1] - o0.x[1]],
			dist = Vectorjs.mod(_d);

		if (dist < this.minLength || this.maxLength < dist) this.destroy();

		let _i = [_d[0] / dist, _d[1] / dist]; // 单位向量
		db_checkNumber(_d, dist, _i);

		// 长度限制

		let rv = [o1.v[0] - o0.v[0], o1.v[1] - o0.v[1]]; // 相对速度
		let rvy = Vectorjs["|>"](rv, _i);
		let vy2 = rvy[0] * rvy[0] + rvy[1] * rvy[1];
		let vy = Math.sqrt(vy2);

		db_checkNumber(rv, rvy, vy2, vy);

		let force = this.resilience(dist);
		let _F = [
			//
			_i[0] * force * Math.pow(1 / 1, vy),
			_i[1] * force * Math.pow(1 / 1, vy),
		];
		db_checkNumber(force, _F);

		// TODO
		o0._F[0] += _F[0];
		o0._F[1] += _F[1];
		o1._F[0] -= _F[0];
		o1._F[1] -= _F[1];
	}
	render(c, P0, P1, s) {
		c.beginPath();
		c.moveTo(
			(this.object0.x[0] - P0[0]) * s,
			(P1[1] - this.object0.x[1]) * s
		);
		c.lineTo(
			(this.object1.x[0] - P0[0]) * s,
			(P1[1] - this.object1.x[1]) * s
		);
		c.lineWidth = 2;
		c.strokeStyle = `rgba(255,255,255,0.25)`;
		c.stroke();
	}
}
