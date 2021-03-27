/* common.js 定义了一些常用函数
 * print(...arg)	相当于console.log
 * range(...arg)	相当于 python 里的 range
 * ord(char)	获取字符编码
 * chr(int) 	将字符编码转换为字符
 * map(func, iter)迭代, 同 py
 * list(str)	将字符串拆分为数组, 同 py
 * int(x)		同 py
 * sum(x)		求和
 * len(x)		同 py
 * zip(...arg)	同 py
 * reversed(iter)	倒序 数组或字符串
 * 
 * (0).minus(x)	减法	/x可为数组
 * 
 * ''.join(iter)	同 py
 * ''.strip()	同 py
 * ''.format(...arg)	字符串格式化 {}
 * ''.rjust(n, c)	在字符串左侧用 字符 c 填充，直到长度达到 n
 * ''.ljust(n, c)	在字符串右侧用 字符 c 填充，直到长度达到 n
 * ''.reverse()	倒序, 返回新字符串
 * ''._(a, b)	取值或截取, 可以使用负数
 * ''.rsplit(str, n)	从右侧开始分割, n是最大数量
 * ''.count(s)	统计子串 s 的个数
 * ''.ex(a, b)	交换 a, b 两处字符
 * 
 * [].ex(a, b)	交换 a, b 两处元素, 会改变原数组
 * [].add(x)	对应元素相加, 返回新数组
 * [].mul(x)	对应元素相乘
 * [].pow(x)	每个元素的 x|x[i] 次方
 * [].copy()	浅复制数组
 * [].copyj()	通过 json 深复制数组
 * [].repeat(t)	重复指定次数
 * []._(a, b)	取值或截取, 可以使用负数
 * []._pop = 原 pop 方法
 * [].pop(i=-1)	删除指定下标元素并返回它,同时改变原数组
 * [].count(val)	对某值进行计数
 * [].counts([v1,v2,...])	对一组值进行计数
 * [].removeAll(x)	删除所有指定元素，不改变原数组
//  * [].sort(reverse=false)	对数组排序
//  * [].shuffle()	打乱自己
 * 

 * Math 中新增的方法
 * Math.sh(x)
 * Math.ch(x)
 * Math.th(x)
 * Math.arsh(x)
 * Math.arch(x)
 * Math.arth(x)

 * NJ 中的这些方法可以直接用于数组
 * NJ.sum(a,b,...)	将所有数组中的所有值相加
 * NJ.abs(x)	取绝对值
 * NJ.round(x, b)	四舍五入到小数点后 b 位
 * NJ.sqrt(x)	开根号
 * NJ.sin(x)
 * NJ.cos(x)
 * NJ.tan(x)
 * NJ.csc(x)
 * NJ.sec(x)
 * NJ.cot(x)
 * NJ.sh(x)
 * NJ.ch(x)
 * NJ.th(x)
 * NJ.arsh(x)
 * NJ.arch(x)
 * NJ.arth(x)
 * NJ.lg(x)
 * NJ.ln(x)
 * 
 * NJ.log(x, y)
 * // 参数都只能是数组:
 * NJ.pow(x, y)	x ^ y
 * NJ.add(x, y)	x + y
 * NJ.sub(x, y)	x - y
 * NJ.mul(x, y)	x · y	对应元素相乘
 * 
 * NJ.min(...x)	会忽略掉 NaN
 * NJ.max(...x)	会忽略掉 NaN

 * 
 * random.random()	Math.random()
 * random.choice(arr)	随机选取元素
 * random.choices(a, k=1)	随机选取元素，选 k 次，返回列表
 * random.randint(a=0, b=1)	随机整数，a <= res < b
 * random.sample(a, k=1)	随机选取 k 个元素，下标不重复
 * random.shuffle(x)	打乱数组顺序，返回新数组，保持原数组不变

 * JSON.dumps()	= stringify()
 * JSON.loads()	= parse()
 */

// 把内置函数保留下来
String.prototype._split_ = String.prototype.split;
Array.prototype._pop = Array.prototype.pop;
Number.prototype.sub = function(x){
	if(Array.isArray(x)){
		let res = [];
		for(let i=0;i<x.length;i++){
			res[i] = this - x[i];
		}
		return res;
	}else return this - x;
}

String.prototype.join = function(arg){
	if(typeof arg==='string'){
		return list(arg).join(this);
	}else
		return arg.join(this);
}
String.prototype.strip = function(){
	return this.replace(/^\s*|\s*$/g, '');
}
String.prototype.format = function(...arg){
	let ids = "{}"
	let txt = this, lt='';
	let i=0, j=0;
	let res = '';
	while(i<txt.length){
		let c = txt[i];
		if(lt.length < ids.length){
			lt += c;
		}else{
			lt = lt.slice(1) + c;
		}
		if(lt === ids){
			res = res.slice(0, 1-ids.length);
			res += arg[j]===undefined? '':arg[j];
			j++;
		}else{
			res += c;
		}
		i++;
	}
	return res
}
String.prototype.rjust = function(n, c=' '){
	let res = this;
	while(res.length < n){
		res = c + res;
	}
	return res;
}
String.prototype.ljust = function(n, c=' '){
	let res = this;
	while(res.length < n){
		res += c;
	}
	return res;
}
String.prototype.reversed = function(){
	let res = '', i = this.length;
	while(i-->0){
		res += this[i];
	}
	return res;
}
String.prototype._ = function(a, b=false){
	if(!b){
		return a < 0 ? 
			this[(this.length + (a % this.length)) %  this.length] :
			this[a % this.length];
	}else return this.slice(a, b);
}
String.prototype.split = function(str=' ', lim=-1){
	// TODO
	let res = this._split_(str);
	if(lim === -1 || lim > res.length){
		return res;
	}else{
		return res.slice(0, lim).concat(res.slice(lim).join(str))
	}
}
String.prototype.rsplit = function(str=' ', lim=-1){
	// TODO
	let res = this.reverse().split(str, lim);
	return map(reversed, res.reverse());
}
String.prototype.count = function(s){
	let n=0;
	for(let i=0;i<this.length;i++){
		if(s === this.slice(i, i+s.length)) n++;
	}
	return n;
}
String.prototype.ex = function(a, b){
	let res = list(this + '');
	res[a] = this[b];
	res[b] = this[a];
	return res.join('');
}

Array.prototype.ex = function(a, b){
	let temp = this[a];
	this[a] = this[b];
	this[b] = temp;
	return this;
}
Array.prototype.add = function(x){
	let res = [];
	if(Array.isArray(x)){
		for(let i=0;i<this.length;i++){
			res[i] = this[i] + x[i];
		}
	}else{
		for(let i=0;i<this.length;i++){
			res[i] = this[i] + x;
		}
	}
	return res;
}
Array.prototype.mul = function(x){
	let res = [];
	if(Array.isArray(x)){
		for(let i=0;i<this.length;i++){
			res[i] = this[i] * x[i];
		}
	}else{
		for(let i=0;i<this.length;i++){
			res[i] = this[i] * x;
		}
	}
	return res;
}
Array.prototype.pow = function(x){
	let res = [];
	if(Array.isArray(x)){
		for(let i=0;i<this.length;i++){
			res[i] = Math._pow(this[i], x[i]);
		}
	}else{
		for(let i=0;i<this.length;i++){
			res[i] = Math._pow(this[i], x);
		}
	}
	return res;
}
Array.prototype.copy = function(){
	let res = [];
	for(let i=0, len=this.length;i<len;i++){
		res[i] = this[i];
	}
	return res;
}
Array.prototype.copyj = function(){
	let res = JSON.stringify(this)
	res = JSON.parse(res)
	return res
}
Array.prototype.repeat = function(t){
	let l1 = this.length, i = l1;
	t = l1*t;
	while(i < t){
		this[i] = this[i%l1];
		i++;
	}
	return this;
}
Array.prototype._ = function(a, b){
	if(!b){
		return a < 0 ? 
			this[(this.length + (a % this.length)) %  this.length] :
			this[a % this.length];
	}else return this.slice(a, b);
}
Array.prototype.pop = function(i=-1){
	res = this.splice(i, 1)
	return res[0]
}
Array.prototype.count = function(val){
	let n = 0;
	for(let i=0;i<this.length;i++){
		if(this[i] === val){
			n++;
		}
	}
	return n;
}
Array.prototype.counts = function(vs){
	let n = [], i = vs.length;
	while(i-- > 0){
		n.push(0);
	}
	for(let i=0;i<this.length;i++){
		for(let j=0;j<vs.length;j++){
			if(this[i] === vs[j]){
				n[j] ++
			}
		}
	}
	return n;
}
Array.prototype.removeAll = function(x){
	let res = [];
	if(isNaN(x)){
		for(let i=0;i<this.length;i++){
			if(!isNaN(this[i]))res.push(this[i]);
		}
	}else{
		for(let i=0;i<this.length;i++){
			if(this[i] !== x)res.push(this[i])
		}
	}
	return res;
}

//Math extension

Math.sh = x => (Math.pow(Math.E, x) - Math.pow(Math.E, -x)) / 2;
Math.ch = x => (Math.pow(Math.E, x) + Math.pow(Math.E, -x)) / 2;
Math.th = x => Math.abs(x) < 19 ? (Math.pow(Math.E, x) - Math.pow(Math.E, -x)) / (Math.pow(Math.E, x)+Math.pow(Math.E, -x)) : (x>0)*2-1;
Math.arsh = x => Math.log(x + Math.sqrt(x*x+1));
Math.arch = x => Math.log(x + Math.sqrt(x*x-1));
Math.arth = x => Math.log((1+x)/(1-x))/2;
// NJ
window.NJ = {}
NJ.sum = function(...arg){
	let n=0;
	for(let i=0;i<arg.length;i++){
		for(let j=0;j<arg[i].length;j++){
			n += arg[i][j];
		}
	}
	return n;
}
NJ.abs = function (x) {
	if (Array.isArray(x)) {
		let res = [];
		for (let i = 0; i < x.length;i++) {
			res[i] = Math.abs(x[i])
		}
		return res;
	} else return Math.abs(x);
}
NJ.round = function(x, b){
	b = Math.pow(10, b);
	if(Array.isArray(x)){
		let res = []
		for(let i=0;i<x.length;i++){
			res[i] = Math.round(x[i] * b) / b;
		}
		return res;
	}else return Math.round(x * b) / b;
}
NJ.sqrt = function (x) {
	if (Array.isArray(x)) {
		let res = []; for (let i = 0; i < x.length; i++) {
			res[i] = Math.sqrt(x[i])
		}
		return res;
	} else return Math.sqrt(x);
}
NJ.sin = function (x) {
	if (Array.isArray(x)) {
		let res = []; for (let i = 0; i < x.length; i++) {
			res[i] = Math.sin(x[i])
		}; return res;
	} else return Math.sin(x)
}
NJ.cos = function (x) {
	if (Array.isArray(x)) {
		let res = []; for (let i = 0; i < x.length;
			i++) { res[i] = Math.cos(x[i]) }; return res;
	} else return Math.cos(x)
}
NJ.tan = function (x) {
	if (Array.isArray(x)) {
		let res = []; for (let i = 0; i < x.length; i++) {
			res[i] = Math.tan(x[i])
		};
		return res;
	} else return Math.tan(x)
}
NJ.csc = function (x) {
	if (Array.isArray(x)) {
		let res = [];
		for (let i = 0; i < x.length; i++) {
			res[i] = 1 / Math.sin(x[i])
		}
		return res;
	} else return 1 / Math.sin(x);
}
NJ.sec = function (x) {
	if (Array.isArray(x)) {
		let res = []; for (let i = 0; i < x.length;i++) {
			res[i] = 1 / Math.cos(x[i])
		};
		return res;
	} else return 1 / Math.cos(x);
}
NJ.cot = function (x) {
	if (Array.isArray(x)) {
		let res = []; for (let i = 0; i < x.length;i++) {
			res[i] = 1 / Math.tan(x[i]) 
		}; 
	return res;
	} else return 1 / Math.tan(x);
}
NJ.sh = function (x) {
	if (Array.isArray(x)) {
		let res = []; for (let i = 0; i < x.length;i++) {
			res[i] = Math.sh(x[i]);
		} 
		return res;
	} else return Math.sh(x)
}
NJ.ch = function (x) {
	if (Array.isArray(x)) {
		let res = []; for (let i = 0; i < x.length;i++) {
			res[i] = Math.ch(x[i]);
		 } 
		return res;
	} else return Math.ch(x)
}
NJ.th = function (x) {
	if (Array.isArray(x)) {
		let res = []; for (let i = 0; i < x.length;i++) {
			res[i] = Math.th(x[i]); 
		}; 	
	return res;
	} else return Math.th(x);
}
NJ.arsh = function (x) {
	if (Array.isArray(x)) {
		let res = []; for (let i = 0; i < x.length;i++) {
			res[i] = Math.arsh(x[i])
		 } 
		return res;
	} else return Math.arsh(x);
}
NJ.arch = function (x) {
	if (Array.isArray(x)) {
		let res = []; for (let i = 0; i < x.length;i++) {
			res[i] = Math.arch(x[i])
		 } 
		return res;
	} else return Math.arch(x);
}
NJ.arth = function (x) {
	if (Array.isArray(x)) {
		let res = []; for (let i = 0; i < x.length;i++) {
			res[i] = Math.arth(x[i])
		 } 
		return res;
	} else return Math.arth(x);
}
NJ.lg = function(x){
	if(Array.isArray(x)){
		let res = [];
		for(let i=0;i<x.length;i++){
			res[i] = Math.log10(x[i])
		}
		return res;
	}else return Math.log10(x)
}
NJ.ln = function(x){
	if(Array.isArray(x)){
		let res = [];
		for(let i=0;i<x.length;i++){
			res[i] = Math.log(x[i])
		}
		return res;
	}else return Math.log(x)
}
NJ.log = function(x, y){
	if (Array.isArray(x)) {
		let res = []; for (let i = 0; i < x.length;i++) {
			res[i] = Math.log(y[i]) / Math.log(x[i]);
		}
		return res;
	} else return Math.log(y) / Math.log(x);
}
NJ.pow = function(x, y){
	let res = [];
	for (let i = 0; i < x.length; i++) {
		res[i] = Math.pow(x[i], y[i])
	}
	return res;
}
NJ.add = function(x, y){
	let res = [];
	for (let i = 0; i < x.length; i++) {
		res[i] = x[i] + y[i];
	}
	return res;
}
NJ.sub = function(x, y){
	let res = [];
	for (let i = 0; i < x.length; i++) {
		res[i] = x[i] - y[i];
	}
	return res;
}
NJ.mul = function(x, y){
	let res = [];
	for (let i = 0; i < x.length; i++) {
		res[i] = x[i] * y[i];
	}
	return res;
}
NJ.min = function(...x){
	return Math.min(...x.removeAll(NaN))
}
NJ.max = function(...x){
	return Math.max(...x.removeAll(NaN));
}

JSON.dumps = JSON.stringify;
JSON.loads = JSON.parse;

window.random = {};
random.random = Math.random;
random.choice = function(arr){
	return arr[Math.floor(Math.random()*arr.length)];
}
random.choices = function(a, k=1){
	// while(wts.length < a.length) wts.push(0);
	// TODO
	let res = []
	while(res.length < k){
		res.push(a[Math.floor(Math.random()*a.length)]);
	}
	return res;
}
random.randint = function(a=0, b=1){
	return a + Math.floor(Math.random()*(b-a))
}
random.sample = function(a, k=1){
	let res = [];
	let b = [...a];
	k = Math.min(k, a.length);
	while(res.length<k){
		res.push(b.pop(Math.floor(Math.random()*b.length)))
	}
	return res;
}
random.shuffle = function(x, algo=1){
	// TODO
	switch(algo){
	 case 0:
		let y = []
		let z = []
		while(z.length<x.length) z.push(z.length);
		let i = 0;
		while(i<x.length){
			ri = Math.floor(Math.random()*z.length)
			y[z[ri]] = x[i]
			z.pop(ri)
			i++;
		}
		return y;
	 case 1:
		for(let i=0;i<x.length;i++){
			let ri = Math.floor(Math.random()*x.length);
			let temp = x[ri]
			x[ri] = x[i]
			x[i] = temp;
		}
		return x;
	}
}


window.print = function(...arg){
	console.log(...arg);
}
window.range = function(...arg){
	let i = 0, end = 1, res = [], step = 1;
	switch(arg.length){
		case 1:
			end = arg[0];
			while(i < end){
				res.push(i);
				i++;
			}
			break;
		case 2:
			i = arg[0];
			end = arg[1];
			print(i,end)
			if(i>end){
				while(i>end){
					res.push(i);
					i -= 1;
				}
			}else{
				while(i < end){
					res.push(i);
					i += 1;
				}
			}
			break;
		case 3:
			i = arg[0];
			end = arg[1];
			step = arg[2];
			if(i<end !== step>0){
				console.error('Error [range]', arg);
				return;
			}
			if(i<end){
				while(i < end){
					res.push(i);
					i += step;
				}
			}else{
				while(i > end){
					res.push(i);
					i += step;
				}
			}
			break;
	}
	return res;
}
window.ord = x=> (x+'').charCodeAt(0);
window.chr = String.fromCharCode;

window.map = function(func, iter){
	let res;
	res = [];
	for(let i=0;i<iter.length;i++){
		res[i] = func(iter[i]);
	}
	return res;
}
window.list = x=>{
	if(Array.isArray(x))
		return x;
	else if(typeof x == 'string'){
		let res = [];
		for(let i=0;i<x.length;i++){
			res.push(x[i]);
		}
		return res;
	}else return list(x+'');
}
window.int = Math.trunc; // x=>~~x
window.sum = function(arg){
	let i=-1, n=0;
	while(++i<arg.length) n += arg[i];
	return n;
}
window.len = x=>x.length;
window.zip = function(...arg){
	let 
		lengs = map(len, arg),
		leng = Math.min(...lengs),
		res = [];
	for(let i=0;i<leng;i++){
		res.push([]);
		for(let j=0;j<arg.length;j++){
			res[i].push(arg[j][i]);
		}
	}
	return res;
}
// window.reversed = x => x.reverse();

