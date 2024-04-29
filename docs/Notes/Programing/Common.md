# Common

## 获取毫秒时间戳

### Javascript / Typescript

```js
Date.now()
```

### Python

```py
int(time.time()*1000)
```


## MD5

```py
import hashlib
def md5(sou):
	return hashlib.md5(bytes(sou, encoding='utf8')).hexdigest()
```

### Javascript

```js
const MD5 = strData => {
	function md5cycle(x, k) {
		var a = x[0],
			b = x[1],
			c = x[2],
			d = x[3];
		a = ff(a, b, c, d, k[0], 7, -680876936);
		d = ff(d, a, b, c, k[1], 12, -389564586);
		c = ff(c, d, a, b, k[2], 17, 606105819);
		b = ff(b, c, d, a, k[3], 22, -1044525330);
		a = ff(a, b, c, d, k[4], 7, -176418897);
		d = ff(d, a, b, c, k[5], 12, 1200080426);
		c = ff(c, d, a, b, k[6], 17, -1473231341);
		b = ff(b, c, d, a, k[7], 22, -45705983);
		a = ff(a, b, c, d, k[8], 7, 1770035416);
		d = ff(d, a, b, c, k[9], 12, -1958414417);
		c = ff(c, d, a, b, k[10], 17, -42063);
		b = ff(b, c, d, a, k[11], 22, -1990404162);
		a = ff(a, b, c, d, k[12], 7, 1804603682);
		d = ff(d, a, b, c, k[13], 12, -40341101);
		c = ff(c, d, a, b, k[14], 17, -1502002290);
		b = ff(b, c, d, a, k[15], 22, 1236535329);
		a = gg(a, b, c, d, k[1], 5, -165796510);
		d = gg(d, a, b, c, k[6], 9, -1069501632);
		c = gg(c, d, a, b, k[11], 14, 643717713);
		b = gg(b, c, d, a, k[0], 20, -373897302);
		a = gg(a, b, c, d, k[5], 5, -701558691);
		d = gg(d, a, b, c, k[10], 9, 38016083);
		c = gg(c, d, a, b, k[15], 14, -660478335);
		b = gg(b, c, d, a, k[4], 20, -405537848);
		a = gg(a, b, c, d, k[9], 5, 568446438);
		d = gg(d, a, b, c, k[14], 9, -1019803690);
		c = gg(c, d, a, b, k[3], 14, -187363961);
		b = gg(b, c, d, a, k[8], 20, 1163531501);
		a = gg(a, b, c, d, k[13], 5, -1444681467);
		d = gg(d, a, b, c, k[2], 9, -51403784);
		c = gg(c, d, a, b, k[7], 14, 1735328473);
		b = gg(b, c, d, a, k[12], 20, -1926607734);
		a = hh(a, b, c, d, k[5], 4, -378558);
		d = hh(d, a, b, c, k[8], 11, -2022574463);
		c = hh(c, d, a, b, k[11], 16, 1839030562);
		b = hh(b, c, d, a, k[14], 23, -35309556);
		a = hh(a, b, c, d, k[1], 4, -1530992060);
		d = hh(d, a, b, c, k[4], 11, 1272893353);
		c = hh(c, d, a, b, k[7], 16, -155497632);
		b = hh(b, c, d, a, k[10], 23, -1094730640);
		a = hh(a, b, c, d, k[13], 4, 681279174);
		d = hh(d, a, b, c, k[0], 11, -358537222);
		c = hh(c, d, a, b, k[3], 16, -722521979);
		b = hh(b, c, d, a, k[6], 23, 76029189);
		a = hh(a, b, c, d, k[9], 4, -640364487);
		d = hh(d, a, b, c, k[12], 11, -421815835);
		c = hh(c, d, a, b, k[15], 16, 530742520);
		b = hh(b, c, d, a, k[2], 23, -995338651);
		a = ii(a, b, c, d, k[0], 6, -198630844);
		d = ii(d, a, b, c, k[7], 10, 1126891415);
		c = ii(c, d, a, b, k[14], 15, -1416354905);
		b = ii(b, c, d, a, k[5], 21, -57434055);
		a = ii(a, b, c, d, k[12], 6, 1700485571);
		d = ii(d, a, b, c, k[3], 10, -1894986606);
		c = ii(c, d, a, b, k[10], 15, -1051523);
		b = ii(b, c, d, a, k[1], 21, -2054922799);
		a = ii(a, b, c, d, k[8], 6, 1873313359);
		d = ii(d, a, b, c, k[15], 10, -30611744);
		c = ii(c, d, a, b, k[6], 15, -1560198380);
		b = ii(b, c, d, a, k[13], 21, 1309151649);
		a = ii(a, b, c, d, k[4], 6, -145523070);
		d = ii(d, a, b, c, k[11], 10, -1120210379);
		c = ii(c, d, a, b, k[2], 15, 718787259);
		b = ii(b, c, d, a, k[9], 21, -343485551);
		x[0] = add32(a, x[0]);
		x[1] = add32(b, x[1]);
		x[2] = add32(c, x[2]);
		x[3] = add32(d, x[3]);
	}
	function cmn(q, a, b, x, s, t) {
		a = add32(add32(a, q), add32(x, t));
		return add32((a << s) | (a >>> (32 - s)), b);
	}
	function ff(a, b, c, d, x, s, t) {
		return cmn((b & c) | (~b & d), a, b, x, s, t);
	}
	function gg(a, b, c, d, x, s, t) {
		return cmn((b & d) | (c & ~d), a, b, x, s, t);
	}
	function hh(a, b, c, d, x, s, t) {
		return cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function ii(a, b, c, d, x, s, t) {
		return cmn(c ^ (b | ~d), a, b, x, s, t);
	}
	function md51(s) {
		txt = '';
		var n = s.length,
			state = [1732584193, -271733879, -1732584194, 271733878],
			i;
		for (i = 64; i <= s.length; i += 64) {
			md5cycle(state, md5blk(s.substring(i - 64, i)));
		}
		s = s.substring(i - 64);
		var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
		tail[i >> 2] |= 0x80 << (i % 4 << 3);
		if (i > 55) {
			md5cycle(state, tail);
			for (i = 0; i < 16; i++) tail[i] = 0;
		}
		tail[14] = n * 8;
		md5cycle(state, tail);
		return state;
	}
	function md5blk(s) {
		var md5blks = [],
			i;
		for (i = 0; i < 64; i += 4) {
			md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
		}
		return md5blks;
	}
	var hex_chr = '0123456789abcdef'.split('');
	function rhex(n) {
		var s = '',
			j = 0;
		for (; j < 4; j++) s += hex_chr[(n >> (j * 8 + 4)) & 0x0f] + hex_chr[(n >> (j * 8)) & 0x0f];
		return s;
	}
	function hex(x) {
		for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]);
		return x.join('');
	}
	function md5(s) {
		return hex(md51(s));
	}
	function add32(a, b) {
		return (a + b) & 0xffffffff;
	}
	if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
		function add32(x, y) {
			var lsw = (x & 0xffff) + (y & 0xffff),
				msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xffff);
		}
	}
	function md0(sou, w = 8) {
		sou = md5(sou + '');
		n = Math.floor(sou.length / w);
		temp = [];
		for (var i = 0; i < sou.length; i++) {
			temp.push(sou[i].charCodeAt());
		}
		sou = temp;
		i = 0;
		while (i < n) {
			j = 0;
			while (j < w) {
				sou[j] += sou[i * w + j];
				j++;
			}
			i++;
		}
		sou = sou.slice(0, w);
		for (var i = 0; i < sou.length; i++) {
			sou[i] = sou[i] % 10;
		}
		return sou.join('');
	}
	return md5(strData);
};
```
### Typescript
```ts
const MD5 = (strData: string) => {
	function md5cycle(x: number[], k: number[]): void {
		let a = x[0],
			b = x[1],
			c = x[2],
			d = x[3];
		a = ff(a, b, c, d, k[0], 7, -680876936);
		d = ff(d, a, b, c, k[1], 12, -389564586);
		c = ff(c, d, a, b, k[2], 17, 606105819);
		b = ff(b, c, d, a, k[3], 22, -1044525330);
		a = ff(a, b, c, d, k[4], 7, -176418897);
		d = ff(d, a, b, c, k[5], 12, 1200080426);
		c = ff(c, d, a, b, k[6], 17, -1473231341);
		b = ff(b, c, d, a, k[7], 22, -45705983);
		a = ff(a, b, c, d, k[8], 7, 1770035416);
		d = ff(d, a, b, c, k[9], 12, -1958414417);
		c = ff(c, d, a, b, k[10], 17, -42063);
		b = ff(b, c, d, a, k[11], 22, -1990404162);
		a = ff(a, b, c, d, k[12], 7, 1804603682);
		d = ff(d, a, b, c, k[13], 12, -40341101);
		c = ff(c, d, a, b, k[14], 17, -1502002290);
		b = ff(b, c, d, a, k[15], 22, 1236535329);
		a = gg(a, b, c, d, k[1], 5, -165796510);
		d = gg(d, a, b, c, k[6], 9, -1069501632);
		c = gg(c, d, a, b, k[11], 14, 643717713);
		b = gg(b, c, d, a, k[0], 20, -373897302);
		a = gg(a, b, c, d, k[5], 5, -701558691);
		d = gg(d, a, b, c, k[10], 9, 38016083);
		c = gg(c, d, a, b, k[15], 14, -660478335);
		b = gg(b, c, d, a, k[4], 20, -405537848);
		a = gg(a, b, c, d, k[9], 5, 568446438);
		d = gg(d, a, b, c, k[14], 9, -1019803690);
		c = gg(c, d, a, b, k[3], 14, -187363961);
		b = gg(b, c, d, a, k[8], 20, 1163531501);
		a = gg(a, b, c, d, k[13], 5, -1444681467);
		d = gg(d, a, b, c, k[2], 9, -51403784);
		c = gg(c, d, a, b, k[7], 14, 1735328473);
		b = gg(b, c, d, a, k[12], 20, -1926607734);
		a = hh(a, b, c, d, k[5], 4, -378558);
		d = hh(d, a, b, c, k[8], 11, -2022574463);
		c = hh(c, d, a, b, k[11], 16, 1839030562);
		b = hh(b, c, d, a, k[14], 23, -35309556);
		a = hh(a, b, c, d, k[1], 4, -1530992060);
		d = hh(d, a, b, c, k[4], 11, 1272893353);
		c = hh(c, d, a, b, k[7], 16, -155497632);
		b = hh(b, c, d, a, k[10], 23, -1094730640);
		a = hh(a, b, c, d, k[13], 4, 681279174);
		d = hh(d, a, b, c, k[0], 11, -358537222);
		c = hh(c, d, a, b, k[3], 16, -722521979);
		b = hh(b, c, d, a, k[6], 23, 76029189);
		a = hh(a, b, c, d, k[9], 4, -640364487);
		d = hh(d, a, b, c, k[12], 11, -421815835);
		c = hh(c, d, a, b, k[15], 16, 530742520);
		b = hh(b, c, d, a, k[2], 23, -995338651);
		a = ii(a, b, c, d, k[0], 6, -198630844);
		d = ii(d, a, b, c, k[7], 10, 1126891415);
		c = ii(c, d, a, b, k[14], 15, -1416354905);
		b = ii(b, c, d, a, k[5], 21, -57434055);
		a = ii(a, b, c, d, k[12], 6, 1700485571);
		d = ii(d, a, b, c, k[3], 10, -1894986606);
		c = ii(c, d, a, b, k[10], 15, -1051523);
		b = ii(b, c, d, a, k[1], 21, -2054922799);
		a = ii(a, b, c, d, k[8], 6, 1873313359);
		d = ii(d, a, b, c, k[15], 10, -30611744);
		c = ii(c, d, a, b, k[6], 15, -1560198380);
		b = ii(b, c, d, a, k[13], 21, 1309151649);
		a = ii(a, b, c, d, k[4], 6, -145523070);
		d = ii(d, a, b, c, k[11], 10, -1120210379);
		c = ii(c, d, a, b, k[2], 15, 718787259);
		b = ii(b, c, d, a, k[9], 21, -343485551);
		x[0] = add32(a, x[0]);
		x[1] = add32(b, x[1]);
		x[2] = add32(c, x[2]);
		x[3] = add32(d, x[3]);
	}
	function cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
		a = add32(add32(a, q), add32(x, t));
		return add32((a << s) | (a >>> (32 - s)), b);
	}
	function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
		return cmn((b & c) | (~b & d), a, b, x, s, t);
	}
	function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
		return cmn((b & d) | (c & ~d), a, b, x, s, t);
	}
	function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
		return cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
		return cmn(c ^ (b | ~d), a, b, x, s, t);
	}
	function md51(s: string): number[] {
		const n = s.length;
		const state = [1732584193, -271733879, -1732584194, 271733878];
		let i: number;
		for (i = 64; i <= s.length; i += 64) {
			md5cycle(state, md5blk(s.substring(i - 64, i)));
		}
		s = s.substring(i - 64);
		const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
		tail[i >> 2] |= 0x80 << (i % 4 << 3);
		if (i > 55) {
			md5cycle(state, tail);
			for (i = 0; i < 16; i++) tail[i] = 0;
		}
		tail[14] = n * 8;
		md5cycle(state, tail);
		return state;
	}
	function md5blk(s: string): number[] {
		const md5blks = [];
		for (let i = 0; i < 64; i += 4) {
			md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
		}
		return md5blks;
	}
	const hex_chr = '0123456789abcdef'.split('');
	function rhex(n: number): string {
		let s = '';
		for (let j = 0; j < 4; j++) {
			s += hex_chr[(n >> (j * 8 + 4)) & 0x0f] + hex_chr[(n >> (j * 8)) & 0x0f];
		}
		return s;
	}
	function hex(x: number[]) {
		return x.map(rhex).join('');
	}
	function md5(s: string) {
		return hex(md51(s));
	}
	let add32 = function (a: number, b: number): number {
		return (a + b) & 0xffffffff;
	};
	if (md5('hello') !== '5d41402abc4b2a76b9719d911017c592') {
		add32 = function (x, y) {
			const lsw = (x & 0xffff) + (y & 0xffff);
			const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xffff);
		};
	}
	return md5(strData);
};

export default MD5;

```



## 后缀名 <=> MIME类型

```json
{
	".323": "text/h323",
	".3gp": "video/3gpp",
	".aab": "application/x-authoware-bin",
	".aam": "application/x-authoware-map",
	".aas": "application/x-authoware-seg",
	".acx": "application/internet-property-stream",
	".ai": "application/postscript",
	".aif": "audio/x-aiff",
	".aifc": "audio/x-aiff",
	".aiff": "audio/x-aiff",
	".als": "audio/X-Alpha5",
	".amc": "application/x-mpeg",
	".ani": "application/octet-stream",
	".apk": "application/vnd.android.package-archive",
	".asc": "text/plain",
	".asd": "application/astound",
	".asf": "video/x-ms-asf",
	".asn": "application/astound",
	".asp": "application/x-asap",
	".asr": "video/x-ms-asf",
	".asx": "video/x-ms-asf",
	".au": "audio/basic",
	".avb": "application/octet-stream",
	".avi": "video/x-msvideo",
	".awb": "audio/amr-wb",
	".axs": "application/olescript",
	".bas": "text/plain",
	".bcpio": "application/x-bcpio",
	".bin ": "application/octet-stream",
	".bld": "application/bld",
	".bld2": "application/bld2",
	".bmp": "image/bmp",
	".bpk": "application/octet-stream",
	".bz2": "application/x-bzip2",
	".c": "text/plain",
	".cal": "image/x-cals",
	".cat": "application/vnd.ms-pkiseccat",
	".ccn": "application/x-cnc",
	".cco": "application/x-cocoa",
	".cdf": "application/x-cdf",
	".cer": "application/x-x509-ca-cert",
	".cgi": "magnus-internal/cgi",
	".chat": "application/x-chat",
	".class": "application/octet-stream",
	".clp": "application/x-msclip",
	".cmx": "image/x-cmx",
	".co": "application/x-cult3d-object",
	".cod": "image/cis-cod",
	".conf": "text/plain",
	".cpio": "application/x-cpio",
	".cpp": "text/plain",
	".cpt": "application/mac-compactpro",
	".crd": "application/x-mscardfile",
	".crl": "application/pkix-crl",
	".crt": "application/x-x509-ca-cert",
	".csh": "application/x-csh",
	".csm": "chemical/x-csml",
	".csml": "chemical/x-csml",
	".css": "text/css",
	".cur": "application/octet-stream",
	".dcm": "x-lml/x-evm",
	".dcr": "application/x-director",
	".dcx": "image/x-dcx",
	".der": "application/x-x509-ca-cert",
	".dhtml": "text/html",
	".dir": "application/x-director",
	".dll": "application/x-msdownload",
	".dmg": "application/octet-stream",
	".dms": "application/octet-stream",
	".doc": "application/msword",
	".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	".dot": "application/msword",
	".dvi": "application/x-dvi",
	".dwf": "drawing/x-dwf",
	".dwg": "application/x-autocad",
	".dxf": "application/x-autocad",
	".dxr": "application/x-director",
	".ebk": "application/x-expandedbook",
	".emb": "chemical/x-embl-dl-nucleotide",
	".embl": "chemical/x-embl-dl-nucleotide",
	".eps": "application/postscript",
	".epub": "application/epub+zip",
	".eri": "image/x-eri",
	".es": "audio/echospeech",
	".esl": "audio/echospeech",
	".etc": "application/x-earthtime",
	".etx": "text/x-setext",
	".evm": "x-lml/x-evm",
	".evy": "application/envoy",
	".exe": "application/octet-stream",
	".fh4": "image/x-freehand",
	".fh5": "image/x-freehand",
	".fhc": "image/x-freehand",
	".fif": "application/fractals",
	".flr": "x-world/x-vrml",
	".flv": "flv-application/octet-stream",
	".fm": "application/x-maker",
	".fpx": "image/x-fpx",
	".fvi": "video/isivideo",
	".gau": "chemical/x-gaussian-input",
	".gca": "application/x-gca-compressed",
	".gdb": "x-lml/x-gdb",
	".gif": "image/gif",
	".gps": "application/x-gps",
	".gtar": "application/x-gtar",
	".gz": "application/x-gzip",
	".h": "text/plain",
	".hdf": "application/x-hdf",
	".hdm": "text/x-hdml",
	".hdml": "text/x-hdml",
	".hlp": "application/winhlp",
	".hqx": "application/mac-binhex40",
	".hta": "application/hta",
	".htc": "text/x-component",
	".htm": "text/html",
	".html": "text/html",
	".hts": "text/html",
	".htt": "text/webviewhtml",
	".ice": "x-conference/x-cooltalk",
	".ico": "image/x-icon",
	".ief": "image/ief",
	".ifm": "image/gif",
	".ifs": "image/ifs",
	".iii": "application/x-iphone",
	".imy": "audio/melody",
	".ins": "application/x-internet-signup",
	".ips": "application/x-ipscript",
	".ipx": "application/x-ipix",
	".isp": "application/x-internet-signup",
	".it": "audio/x-mod",
	".itz": "audio/x-mod",
	".ivr": "i-world/i-vrml",
	".j2k": "image/j2k",
	".jad": "text/vnd.sun.j2me.app-descriptor",
	".jam": "application/x-jam",
	".jar": "application/java-archive",
	".java": "text/plain",
	".jfif": "image/pipeg",
	".jnlp": "application/x-java-jnlp-file",
	".jpe": "image/jpeg",
	".jpeg": "image/jpeg",
	".jpg": "image/jpeg",
	".jpz": "image/jpeg",
	".js": "application/x-javascript",
	".jwc": "application/jwc",
	".kjx": "application/x-kjx",
	".lak": "x-lml/x-lak",
	".latex": "application/x-latex",
	".lcc": "application/fastman",
	".lcl": "application/x-digitalloca",
	".lcr": "application/x-digitalloca",
	".lgh": "application/lgh",
	".lha": "application/octet-stream",
	".lml": "x-lml/x-lml",
	".lmlpack": "x-lml/x-lmlpack",
	".log": "text/plain",
	".lsf": "video/x-la-asf",
	".lsx": "video/x-la-asf",
	".lzh": "application/octet-stream",
	".m13": "application/x-msmediaview",
	".m14": "application/x-msmediaview",
	".m15": "audio/x-mod",
	".m3u": "audio/x-mpegurl",
	".m3url": "audio/x-mpegurl",
	".m4a": "audio/mp4a-latm",
	".m4b": "audio/mp4a-latm",
	".m4p": "audio/mp4a-latm",
	".m4u": "video/vnd.mpegurl",
	".m4v": "video/x-m4v",
	".ma1": "audio/ma1",
	".ma2": "audio/ma2",
	".ma3": "audio/ma3",
	".ma5": "audio/ma5",
	".man": "application/x-troff-man",
	".map": "magnus-internal/imagemap",
	".mbd": "application/mbedlet",
	".mct": "application/x-mascot",
	".mdb": "application/x-msaccess",
	".mdz": "audio/x-mod",
	".me": "application/x-troff-me",
	".mel": "text/x-vmel",
	".mht": "message/rfc822",
	".mhtml": "message/rfc822",
	".mi": "application/x-mif",
	".mid": "audio/mid",
	".midi": "audio/midi",
	".mif": "application/x-mif",
	".mil": "image/x-cals",
	".mio": "audio/x-mio",
	".mmf": "application/x-skt-lbs",
	".mng": "video/x-mng",
	".mny": "application/x-msmoney",
	".moc": "application/x-mocha",
	".mocha": "application/x-mocha",
	".mod": "audio/x-mod",
	".mof": "application/x-yumekara",
	".mol": "chemical/x-mdl-molfile",
	".mop": "chemical/x-mopac-input",
	".mov": "video/quicktime",
	".movie": "video/x-sgi-movie",
	".mp2": "video/mpeg",
	".mp3": "audio/mpeg",
	".mp4": "video/mp4",
	".mpa": "video/mpeg",
	".mpc": "application/vnd.mpohun.certificate",
	".mpe": "video/mpeg",
	".mpeg": "video/mpeg",
	".mpg": "video/mpeg",
	".mpg4": "video/mp4",
	".mpga": "audio/mpeg",
	".mpn": "application/vnd.mophun.application",
	".mpp": "application/vnd.ms-project",
	".mps": "application/x-mapserver",
	".mpv2": "video/mpeg",
	".mrl": "text/x-mrml",
	".mrm": "application/x-mrm",
	".ms": "application/x-troff-ms",
	".msg": "application/vnd.ms-outlook",
	".mts": "application/metastream",
	".mtx": "application/metastream",
	".mtz": "application/metastream",
	".mvb": "application/x-msmediaview",
	".mzv": "application/metastream",
	".nar": "application/zip",
	".nbmp": "image/nbmp",
	".nc": "application/x-netcdf",
	".ndb": "x-lml/x-ndb",
	".ndwn": "application/ndwn",
	".nif": "application/x-nif",
	".nmz": "application/x-scream",
	".nokia-op-logo": "image/vnd.nok-oplogo-color",
	".npx": "application/x-netfpx",
	".nsnd": "audio/nsnd",
	".nva": "application/x-neva1",
	".nws": "message/rfc822",
	".oda": "application/oda",
	".ogg": "audio/ogg",
	".oom": "application/x-AtlasMate-Plugin",
	".p10": "application/pkcs10",
	".p12": "application/x-pkcs12",
	".p7b": "application/x-pkcs7-certificates",
	".p7c": "application/x-pkcs7-mime",
	".p7m": "application/x-pkcs7-mime",
	".p7r": "application/x-pkcs7-certreqresp",
	".p7s": "application/x-pkcs7-signature",
	".pac": "audio/x-pac",
	".pae": "audio/x-epac",
	".pan": "application/x-pan",
	".pbm": "image/x-portable-bitmap",
	".pcx": "image/x-pcx",
	".pda": "image/x-pda",
	".pdb": "chemical/x-pdb",
	".pdf": "application/pdf",
	".pfr": "application/font-tdpfr",
	".pfx": "application/x-pkcs12",
	".pgm": "image/x-portable-graymap",
	".pict": "image/x-pict",
	".pko": "application/ynd.ms-pkipko",
	".pm": "application/x-perl",
	".pma": "application/x-perfmon",
	".pmc": "application/x-perfmon",
	".pmd": "application/x-pmd",
	".pml": "application/x-perfmon",
	".pmr": "application/x-perfmon",
	".pmw": "application/x-perfmon",
	".png": "image/png",
	".pnm": "image/x-portable-anymap",
	".pnz": "image/png",
	".pot,": "application/vnd.ms-powerpoint",
	".ppm": "image/x-portable-pixmap",
	".pps": "application/vnd.ms-powerpoint",
	".ppt": "application/vnd.ms-powerpoint",
	".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	".pqf": "application/x-cprplayer",
	".pqi": "application/cprplayer",
	".prc": "application/x-prc",
	".prf": "application/pics-rules",
	".prop": "text/plain",
	".proxy": "application/x-ns-proxy-autoconfig",
	".ps": "application/postscript",
	".ptlk": "application/listenup",
	".pub": "application/x-mspublisher",
	".pvx": "video/x-pv-pvx",
	".qcp": "audio/vnd.qcelp",
	".qt": "video/quicktime",
	".qti": "image/x-quicktime",
	".qtif": "image/x-quicktime",
	".r3t": "text/vnd.rn-realtext3d",
	".ra": "audio/x-pn-realaudio",
	".ram": "audio/x-pn-realaudio",
	".rar": "application/octet-stream",
	".ras": "image/x-cmu-raster",
	".rc": "text/plain",
	".rdf": "application/rdf+xml",
	".rf": "image/vnd.rn-realflash",
	".rgb": "image/x-rgb",
	".rlf": "application/x-richlink",
	".rm": "audio/x-pn-realaudio",
	".rmf": "audio/x-rmf",
	".rmi": "audio/mid",
	".rmm": "audio/x-pn-realaudio",
	".rmvb": "audio/x-pn-realaudio",
	".rnx": "application/vnd.rn-realplayer",
	".roff": "application/x-troff",
	".rp": "image/vnd.rn-realpix",
	".rpm": "audio/x-pn-realaudio-plugin",
	".rt": "text/vnd.rn-realtext",
	".rte": "x-lml/x-gps",
	".rtf": "application/rtf",
	".rtg": "application/metastream",
	".rtx": "text/richtext",
	".rv": "video/vnd.rn-realvideo",
	".rwc": "application/x-rogerwilco",
	".s3m": "audio/x-mod",
	".s3z": "audio/x-mod",
	".sca": "application/x-supercard",
	".scd": "application/x-msschedule",
	".sct": "text/scriptlet",
	".sdf": "application/e-score",
	".sea": "application/x-stuffit",
	".setpay": "application/set-payment-initiation",
	".setreg": "application/set-registration-initiation",
	".sgm": "text/x-sgml",
	".sgml": "text/x-sgml",
	".sh": "application/x-sh",
	".shar": "application/x-shar",
	".shtml": "magnus-internal/parsed-html",
	".shw": "application/presentations",
	".si6": "image/si6",
	".si7": "image/vnd.stiwap.sis",
	".si9": "image/vnd.lgtwap.sis",
	".sis": "application/vnd.symbian.install",
	".sit": "application/x-stuffit",
	".skd": "application/x-Koan",
	".skm": "application/x-Koan",
	".skp": "application/x-Koan",
	".skt": "application/x-Koan",
	".slc": "application/x-salsa",
	".smd": "audio/x-smd",
	".smi": "application/smil",
	".smil": "application/smil",
	".smp": "application/studiom",
	".smz": "audio/x-smd",
	".snd": "audio/basic",
	".spc": "application/x-pkcs7-certificates",
	".spl": "application/futuresplash",
	".spr": "application/x-sprite",
	".sprite": "application/x-sprite",
	".sdp": "application/sdp",
	".spt": "application/x-spt",
	".src": "application/x-wais-source",
	".sst": "application/vnd.ms-pkicertstore",
	".stk": "application/hyperstudio",
	".stl": "application/vnd.ms-pkistl",
	".stm": "text/html",
	".sv4cpio": "application/x-sv4cpio",
	".sv4crc": "application/x-sv4crc",
	".svf": "image/vnd",
	".svg": "image/svg+xml",
	".svh": "image/svh",
	".svr": "x-world/x-svr",
	".swf": "application/x-shockwave-flash",
	".swfl": "application/x-shockwave-flash",
	".t": "application/x-troff",
	".tad": "application/octet-stream",
	".talk": "text/x-speech",
	".tar": "application/x-tar",
	".taz": "application/x-tar",
	".tbp": "application/x-timbuktu",
	".tbt": "application/x-timbuktu",
	".tcl": "application/x-tcl",
	".tex": "application/x-tex",
	".texi": "application/x-texinfo",
	".texinfo": "application/x-texinfo",
	".tgz": "application/x-compressed",
	".thm": "application/vnd.eri.thm",
	".tif": "image/tiff",
	".tiff": "image/tiff",
	".tki": "application/x-tkined",
	".tkined": "application/x-tkined",
	".toc": "application/toc",
	".toy": "image/toy",
	".tr": "application/x-troff",
	".trk": "x-lml/x-gps",
	".trm": "application/x-msterminal",
	".tsi": "audio/tsplayer",
	".tsp": "application/dsptype",
	".tsv": "text/tab-separated-values",
	".ttf": "application/octet-stream",
	".ttz": "application/t-time",
	".txt": "text/plain",
	".uls": "text/iuls",
	".ult": "audio/x-mod",
	".ustar": "application/x-ustar",
	".uu": "application/x-uuencode",
	".uue": "application/x-uuencode",
	".vcd": "application/x-cdlink",
	".vcf": "text/x-vcard",
	".vdo": "video/vdo",
	".vib": "audio/vib",
	".viv": "video/vivo",
	".vivo": "video/vivo",
	".vmd": "application/vocaltec-media-desc",
	".vmf": "application/vocaltec-media-file",
	".vmi": "application/x-dreamcast-vms-info",
	".vms": "application/x-dreamcast-vms",
	".vox": "audio/voxware",
	".vqe": "audio/x-twinvq-plugin",
	".vqf": "audio/x-twinvq",
	".vql": "audio/x-twinvq",
	".vre": "x-world/x-vream",
	".vrml": "x-world/x-vrml",
	".vrt": "x-world/x-vrt",
	".vrw": "x-world/x-vream",
	".vts": "workbook/formulaone",
	".wav": "audio/x-wav",
	".wax": "audio/x-ms-wax",
	".wbmp": "image/vnd.wap.wbmp",
	".wcm": "application/vnd.ms-works",
	".wdb": "application/vnd.ms-works",
	".web": "application/vnd.xara",
	".wi": "image/wavelet",
	".wis": "application/x-InstallShield",
	".wks": "application/vnd.ms-works",
	".wm": "video/x-ms-wm",
	".wma": "audio/x-ms-wma",
	".wmd": "application/x-ms-wmd",
	".wmf": "application/x-msmetafile",
	".wml": "text/vnd.wap.wml",
	".wmlc": "application/vnd.wap.wmlc",
	".wmls": "text/vnd.wap.wmlscript",
	".wmlsc": "application/vnd.wap.wmlscriptc",
	".wmlscript": "text/vnd.wap.wmlscript",
	".wmv": "audio/x-ms-wmv",
	".wmx": "video/x-ms-wmx",
	".wmz": "application/x-ms-wmz",
	".wpng": "image/x-up-wpng",
	".wps": "application/vnd.ms-works",
	".wpt": "x-lml/x-gps",
	".wri": "application/x-mswrite",
	".wrl": "x-world/x-vrml",
	".wrz": "x-world/x-vrml",
	".ws": "text/vnd.wap.wmlscript",
	".wsc": "application/vnd.wap.wmlscriptc",
	".wv": "video/wavelet",
	".wvx": "video/x-ms-wvx",
	".wxl": "application/x-wxl",
	".x-gzip": "application/x-gzip",
	".xaf": "x-world/x-vrml",
	".xar": "application/vnd.xara",
	".xbm": "image/x-xbitmap",
	".xdm": "application/x-xdma",
	".xdma": "application/x-xdma",
	".xdw": "application/vnd.fujixerox.docuworks",
	".xht": "application/xhtml+xml",
	".xhtm": "application/xhtml+xml",
	".xhtml": "application/xhtml+xml",
	".xla": "application/vnd.ms-excel",
	".xlc": "application/vnd.ms-excel",
	".xll": "application/x-excel",
	".xlm": "application/vnd.ms-excel",
	".xls": "application/vnd.ms-excel",
	".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	".xlt": "application/vnd.ms-excel",
	".xlw": "application/vnd.ms-excel",
	".xm": "audio/x-mod",
	".xml": "application/xml",
	".xmz": "audio/x-mod",
	".xof": "x-world/x-vrml",
	".xpi": "application/x-xpinstall",
	".xpm": "image/x-xpixmap",
	".xsit": "text/xml",
	".xsl": "text/xml",
	".xul": "text/xul",
	".xwd": "image/x-xwindowdump",
	".xyz": "chemical/x-pdb",
	".yz1": "application/x-yz1",
	".z": "application/x-compress",
	".zac": "application/x-zaurus-zac",
	".zip": "application/zip",
	".json": "application/json"
}

```

