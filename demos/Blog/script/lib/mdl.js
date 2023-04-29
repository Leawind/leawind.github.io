"use strict";
/*



*/

class MDL{
	constructor(){

	}
	S = {
		codeblock: `
display: block;
line-height: 1.6em;
border: solid 1px #000;
padding: 1em;
margin: 1em 0;
width: fit-content;
max-width: 100%;
overflow: auto;
font-family: consolas;
`,
		codeInline: `
display: inline-block;
line-height: 1.6em;
padding: 0 0.7em;
font-family: consolas;
`
	}
	C = {
		Heads: (t)=>{
			// console.log(t);
			let text, leng, ind, m;
			while(1){
				m = t.match(this.RG.h1);
				if(!m) break;
				text = m[0];
				leng = text.length;
				ind = m.index;
				text = `<h1>${m[0].replace(/.*#[\s]/, '')}</h1>`;
				t = t.slice(0, ind) + text + t.slice(ind+leng);
			}
			while(1){m = t.match(this.RG.h2);if(!m) break;text = m[0];leng = text.length;ind = m.index;text = `<h2>${m[0].replace(/.*#+[\s]/, '')}</h2>`;t = t.slice(0, ind) + text + t.slice(ind+leng);}
			while(1){m = t.match(this.RG.h3);if(!m) break;text = m[0];leng = text.length;ind = m.index;text = `<h3>${m[0].replace(/.*#+[\s]/, '')}</h3>`;t = t.slice(0, ind) + text + t.slice(ind+leng);}
			while(1){m = t.match(this.RG.h4);if(!m) break;text = m[0];leng = text.length;ind = m.index;text = `<h4>${m[0].replace(/.*#+[\s]/, '')}</h4>`;t = t.slice(0, ind) + text + t.slice(ind+leng);}
			while(1){m = t.match(this.RG.h5);if(!m) break;text = m[0];leng = text.length;ind = m.index;text = `<h5>${m[0].replace(/.*#+[\s]/, '')}</h5>`;t = t.slice(0, ind) + text + t.slice(ind+leng);}
			while(1){m = t.match(this.RG.h6);if(!m) break;text = m[0];leng = text.length;ind = m.index;text = `<h6>${m[0].replace(/.*#+[\s]/, '')}</h6>`;t = t.slice(0, ind) + text + t.slice(ind+leng);}

			return t;
		},
		List: (t)=>{
			let text, leng, ind, m;
			while(1){
				m = t.match(this.RG.li_0);
				if(!m) break;
				text = m[0];
				leng = text.length;
				ind = m.index;
				text = `<li>${m[0].replace(/.*\*[\s]/, '')}</li>`;
				t = t.slice(0, ind) + text + t.slice(ind+leng);
			}
			while(1){
				m = t.match(this.RG.li_1);
				if(!m) break;
				text = m[0];
				leng = text.length;
				ind = m.index;
				text = `<li>${m[0].replace(/.*\+[\s]/, '')}</li>`;
				t = t.slice(0, ind) + text + t.slice(ind+leng);
			}
			return t;
		}
	}
	RG = {
		h1: /(?<=(\n|^))[\s]*[ \t]*# .*/,
		h2: /(?<=(\n|^))[\s]*[ \t]*## .*/,
		h3: /(?<=(\n|^))[\s]*[ \t]*### .*/,
		h4: /(?<=(\n|^))[\s]*[ \t]*#### .*/,
		h5: /(?<=(\n|^))[\s]*[ \t]*##### .*/,
		h6: /(?<=(\n|^))[\s]*[ \t]*###### .*/,
		li_0: /(?<=(\n|^))[\s]*[ \t]*\* .*/,
		li_1: /(?<=(\n|^))[\s]*[ \t]*\+ .*/,
	}
	_convert_no_t(t){
		t = this.C.Heads(t);
		t = this.C.List(t);
		t = t.replace(/\n/g, "<br>");
		// console.log(t);
		return t;
	}
	_convert_no_ttt(t){
		let r = '';
		t = t.split("`");
		for(let i=0;i<t.length;i++){
			let s = t[i];
			if(i%2){
				r += `<code><pre style="${this.S.codeInline}">${this._string_to_entity_fake(s)}</pre></code>`;
			}else{
			// console.log(t);
				r += this._convert_no_t(s);
			}
		}
		return r;
	}
	_string_to_entity_fake(str){
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;')
	}
	convert(t){
		let r = '';
		t = t.split("```");
		for(let i=0;i<t.length;i++){
			let s = t[i];
			if(i%2){
				r += `<code><pre style="${this.S.codeblock}">${this._string_to_entity_fake(s)}</pre></code>`;
			}else{
				r += this._convert_no_ttt(s);
			}
		}
		return r;
	}
}