var DEBUGMODE = 3; // 0, 1, 2, 3, 4

{
	Math.seed = 3469;
	Math.rdmix = function (a, b, c) {
		// https://gist.github.com/badboy/6267743#robert-jenkins-96-bit-mix-function
		a = a - b;
		a = a - c;
		a = a ^ (c >>> 13);
		b = b - c;
		b = b - a;
		b = b ^ (a << 8);
		c = c - a;
		c = c - b;
		c = c ^ (b >>> 13);
		a = a - b;
		a = a - c;
		a = a ^ (c >>> 12);
		b = b - c;
		b = b - a;
		b = b ^ (a << 16);
		c = c - a;
		c = c - b;
		c = c ^ (b >>> 5);
		a = a - b;
		a = a - c;
		a = a ^ (c >>> 3);
		b = b - c;
		b = b - a;
		b = b ^ (a << 10);
		c = c - a;
		c = c - b;
		c = c ^ (b >>> 15);
		return c;
	};
	/**
	 * 随机数生成器
	 * @param r0 范围端点 0
	 * @param r1 范围端点 1
	 */
	Math.seedRandom = function (r0 = 1, r1 = 0) {
		max = Math.max(r0, r1);
		min = Math.min(r0, r1);
		let sd = Math.seed++;
		let a = Math.rdmix(sd, 235.632502, -32.5216) % 65536;
		let b = Math.rdmix(324152353, sd, -435.2139) % 65536;
		a = a < 0 ? -a : a;
		b = b < 0 ? -b : b;
		let c = a * 32768 + b;
		return (c / 2147483648) * (max - min) + min;
	};

	// if (DEBUGMODE >= 3)
	// 	for (let i = 0; i < 16; i++)
	// 		console.warn("Random:", Math.seedRandom(-10, 10));
}
(() => {
	const WorldHeight = 3.2, // 世界高度
		WorldWidth = 1.7; // 世界宽度
	const RESOLUTION = 600; // 1m对应多少像素

	const cvs = document.querySelector("#testcvs"); // 获取画布元素

	window.lw = new LignetWorld(); // 创建世界实例

	// 设置世界属性
	{
		lw.setWorldSize([WorldWidth, WorldHeight]);
		{
			// 设置重力场

			let aclx = null,
				acly = null,
				aclz = null;
			window.ondevicemotion = (e) => {
				aclx = -e.accelerationIncludingGravity.x;
				acly = -e.accelerationIncludingGravity.y;
				aclz = e.accelerationIncludingGravity.z;
			};

			lw.x_fields.gravity = (x) => [
				Math.cos(Date.now() * 4e-4) * 9.8,
				Math.sin(Date.now() * 4e-4) * 9.8,
			];
			lw.x_fields.gravity = (x) => [0, -9.8];
			lw.x_fields.gravity = (x) => {
				if (aclx == null) {
					return [0, -9.8];
				} else {
					return [aclx, acly];
				}
			};
		}

		lw.frc = 0; // 流体阻力系数
		lw.fc = 0.02;
		lw.renderOptions.fVisible = false; // 物体所受合力 可见性
	}

	if (!true) {
		// 随机放置一些粒子
		for (let i = 0; i < 3; i++) {
			let p = new Particle(); // 创建粒子实例
			{
				p.radius = Math.seedRandom(0.02, 0.03); // 粒子半径
				p.mo = Math.pow(p.radius, 3); //	静止质量
				p.frc = 0; //流体阻力系数
				p.fc = 1; // 摩擦系数
				p.cvc = 0.9; // 碰撞系数
				if (!!true) {
					let MaxCharge = 2e-4;
					p.charge = Math.seedRandom(-MaxCharge, MaxCharge); // 所带电荷量;
					p.style.stroke =
						p.charge > 0
							? `rgb(${Math.floor(
									128 + (128 * p.charge) / MaxCharge
							  )}, 64,64)`
							: `rgb(64,64, ${Math.floor(
									128 - (128 * p.charge) / MaxCharge
							  )})`;
				}
				p.v = [Math.seedRandom(-1, 1), Math.seedRandom(-1, 1)]; // 初始速度
			}

			// 加入元素
			lw.appendObject(p, [
				Math.seedRandom(WorldWidth),
				Math.seedRandom(WorldHeight),
			]);
		}

		if (!true) {
			// 创建粒子间关系
			for (let obj of lw.objectsList) {
				for (let j = obj.id + 1; j < lw.objectsList.length; j++) {
					let nobj = lw.objectsList[j];
					let rlt = new TelescopicElasticRod();
					lw.appendRelation(rlt, obj, nobj);
				}
			}
		}
	}
	if (true) {
		for (let i = 0; i < 0; i++) {
			let p = new Particle(); // 创建粒子实例
			{
				p.radius = 0.03;
				p.mo = 0.03;
				p.frc = 1;
				p.fc = 1;
				p.cvc = 0.9;
				p.charge = 0;
				p.v = [0, 0];
			}
			// 加入元素
			lw.appendObject(p, [
				Math.seedRandom(WorldWidth),
				Math.seedRandom(WorldHeight),
			]);
		}

		// onpointerdown

		window.addEventListener("click", function (e) {
			let style = window.getComputedStyle(cvs);
			// 屏幕坐标
			let x = e.offsetX / style.width.slice(0, -2);
			let y = 1 - e.offsetY / style.height.slice(0, -2);
			// 世界坐标
			x *= WorldWidth;
			y *= WorldHeight;

			// 创建粒子
			let p = new Particle();
			{
				p.radius = 0.03;
				p.mo = 0.03;
				p.frc = 1;
				p.fc = 1;
				p.cvc = 0.9;
				p.charge = 0;
				p.v = [0, 0];
			}
			lw.appendObject(p, [x, y]);
			// 创建关系
			const maxDist = 0.5;
			for (let np of lw.objectsList) {
				if (np == p) continue;
				let dist = Vectorjs.distance(p.x, np.x);
				if (p.radius + np.radius < dist && dist < maxDist) {
					let rlt = new TelescopicElasticRod();
					rlt.length = dist;
					rlt.minLength = dist * 0.7;
					rlt.maxLength = dist / 0.7;
					rlt.strength = 40;
					lw.appendRelation(rlt, p, np);
				}
			}
		});
	}

	var t0 = Date.now() / 1e3;
	window.PFPS = 0;
	var FrameTime = 0;
	setInterval(() => {
		let t1 = Date.now() / 1e3;
		let dt = t1 - t0;
		PFPS = 1 / dt;
		FrameTime = dt;
		t0 = t1;
		dt = Math.min(dt, 1 / 200);
		lw.update_physic(dt);
	}, 1e3 / 200);

	setInterval(() => {
		lw.render(cvs, [0, 0], [WorldWidth, WorldHeight], RESOLUTION);
	}, 1e3 / 50);
})();
