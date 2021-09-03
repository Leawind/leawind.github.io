setInterval(()=>{
	// let hpw = screen.height / screen.width;
	let hpw = innerHeight / innerWidth;
	if(hpw < 1){
		window.device = "pc";
		document.body.className = "dv-pc";
	}else{
		window.device = "mb";
		document.body.className = "dv-mb";
	}
}, 50);