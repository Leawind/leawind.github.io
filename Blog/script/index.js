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
	MIN_BAR_WIDTH: 20,
	MAX_BAR_WIDTH: 90,
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


}