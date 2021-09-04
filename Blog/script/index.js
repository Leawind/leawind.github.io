"use strict";
function cssVar(arg){
	let ele = document.getElementById("css-variables");

	if(typeof arg === String){
		return con.cssVar[arg];
	}else{
		for(let key in arg){
			con.cssVar[key] = arg[key];
		}
		let t = JSON.stringify(con.cssVar, 0, 2)
			.replace(/"/g, '')
			.replace(/,/g, ';')
		ele.innerHTML = ":root" + t
	}

}

function closeBar(){
	if(window.device==="pc"){
		cssVar("--bar-left", '-'+cssVar("--pc-bar-width"));
	}else if(window.device==="mb"){
		cssVar("--bar-top", "-100vh");
	}
}
function openBar(){
	if(window.device==="pc"){
		cssVar("--bar-left", '0');
	}else if(window.device==="mb"){
		cssVar("--bar-top","0");
	}

}
function dragBarStart(e, isTouching=false){
	//TODO
	e.preventDefault();
	con.isDragingBar = true;
	if(e.type=="mousedown"){
		con.dragStartAt = {
			bar_width: con.cssVar["--pc-bar-width"].slice(0, -2)*1,
			clientX: e.clientX,
			clientY: e.clientY,
		}
	}else{
		con.dragStartAt = {
			bar_width: con.cssVar["--pc-bar-width"].slice(0, -2)*1,
			clientX: e.touches[0].clientX,
			clientY: e.touches[0].clientY,
		}
	}
}





window.con = {
	cssVar: {
		"--font-color": "#fff",
		"--text-background": "#333",
		"--hover-font-color": "#88f",
		"--hover-background": "#222",
		"--bar-line-color": "#888",
		"--pc-bar-width": "20vw",
		/* Do not need to change:*/
		"--bar-left": "0",
		"--bar-top": "0",
	},
	isDragingBar: false,
	MIN_BAR_WIDTH: 5,
	MAX_BAR_WIDTH: 90,
	dragStartAt: {
		bar_width: 0,
		clientX:0, clientY:0,
	},
	pointPos: {
		x: 0, y: 0,
		screenX: 0, screenY: 0,
		pageX: 0, pageY: 0,
		offsetX: 0, offsetY: 0,
		layerX: 0, layerY: 0,
		movementX: 0, movementY: 0,
	}

}

var staticSync = function(){
	cssVar(con.cssVar);
}
setInterval(staticSync, 0);

// Events

window.onmousemove = function(e){
	for(let key in con.pointPos){
		con.pointPos[key] = e[key];
	}
	// console.log(con.pointPos);
	if(con.isDragingBar){
		let v = (e.clientX-con.dragStartAt.clientX)/document.body.clientWidth*100 + con.dragStartAt.bar_width
		if(v<con.MIN_BAR_WIDTH) v = con.MIN_BAR_WIDTH;
		if(v>con.MAX_BAR_WIDTH) v = con.MAX_BAR_WIDTH;
		con.cssVar["--pc-bar-width"] = v +'vw';
		e.preventDefault()
	}
}
window.ontouchmove = function(e){
	//TODO
	let te = e.touches[0];
	for(let key in con.pointPos){
		let v = te[key];
		if(v!==undefined) con.pointPos[key] = v;
	}
	if(con.isDragingBar){
		// console.log(con.pointPos);
		let v = (te.clientX-con.dragStartAt.clientX)/document.body.clientWidth*100 + con.dragStartAt.bar_width
		if(v<con.MIN_BAR_WIDTH) v = con.MIN_BAR_WIDTH;
		if(v>con.MAX_BAR_WIDTH) v = con.MAX_BAR_WIDTH;
		con.cssVar["--pc-bar-width"] = v +'vw';
	}
}
window.onmouseup = function(e){
	con.isDragingBar = false;
}
window.ontouchend = function(e){
	con.isDragingBar = false;
}