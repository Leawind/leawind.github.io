class Random {
	seed;
	mean;
	stdDev;
	/**
	 * @param {number} [seed=Date.now()] random seed
	 * @param {number} [mean=0] default mean for normal distribution
	 * @param {number} [stdDev=1] default std dev for notmal distribution
	 */
	constructor(seed = Date.now(), mean = 0, stdDev = 1) {
		if (typeof seed !== "number") throw new TypeError(`Expected number, got ${typeof seed}`);
		if (typeof mean !== "number") throw new TypeError(`Expected number, got ${typeof mean}`);
		if (typeof stdDev !== "number") throw new TypeError(`Expected number, got ${typeof stdDev}`);
		this.seed = seed;
		this.mean = mean;
		this.stdDev = stdDev;
	}

	/**
	 * 获取一个均匀分布随机数
	 */
	next() {
		const a = 9301, b = 49297, m = 233280;
		this.seed = (this.seed * a + b) % m;
		return this.seed / m;
	}

	/**
	 * 获取一个正态分布的随机数
	 */
	nextNormal(mean = this.mean, stdDev = this.stdDev) {
		var u = 1 - this.next(); // 生成一个0到1之间的随机数，用于保证u不为0
		var v = 1 - this.next(); // 生成一个0到1之间的随机数，用于保证v不为0
		var z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
		return z * stdDev + mean; // 将z转换为具有给定均值和标准差的正态分布随机数
	}

	/**
	 * 获取若干均匀分布的随机数
	 * @param {number} count 数量
	 */
	some(count) {
		let arr = [];
		for (let i = 0; i < count; i++)
			arr[i] = this.next();
		return arr;
	}
	/**
	 * 获取若干正态分布的随机数
	 * @param {number} count 数量
	 */
	someNormal(count) {
		let arr = [];
		for (let i = 0; i < count; i++)
			arr[i] = this.nextNormal();
		return arr;
	}


	/**
	 * function        cost(ns)
	 * Math.random()   0.01750
	 * next()          0.02040
	 * nextNormal()    0.08880
	 */
	nsrd = Math.random;
	static benchmark() {
		console.log("Starting random module's benchmark");

		console.log(bm('next'));
		console.log(bm('nextNormal'));
		console.log(bm('nsrd'));

		function bm(funcName) {
			const t0 = Date.now();
			const rd = new Random();
			let tp = null;
			for (let i = 0; i < 1e6; i++) {
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
				tp = rd[funcName]();
			}
			let t1 = Date.now();
			let cost = t1 - t0;
			cost /= 1e6 * 40;
			return (cost * 1e3).toFixed(6);
		}
	}
}

export { Random };