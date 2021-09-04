window._TextReaderEs = []

class TextReader{
	path = null;
	ele = null;
	loaded = false;
	ord = null;
	content = null;
	whenLoaded = null;
	constructor(path, whenLoaded){
		this.ord = window._TextReaderEs.length;
		this.whenLoaded = whenLoaded;
		this.path = path;
		let ele = document.createElement("iframe");
		ele.setAttribute("importance", "high");
		ele.title="" + this.ord;
		ele.src = path;
		ele.style.display = "none";
		document.body.appendChild(ele);
		
		ele.onload = function(){
			this.loaded = true;
			let obj = window._TextReaderEs[this.getAttribute("title")*1];
			obj.content = this.contentWindow.document.body.innerText;
			if(obj.whenLoaded) obj.whenLoaded(obj);
			obj.ele.remove();
		}
		window._TextReaderEs[this.ord] = this;
		this.ele = ele;
	}
}