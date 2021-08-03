function print(...arg){
	let t = '\n';
	for(let i=0;i<arg.length;i++)
		// t += Array.isArray(arg[i]) ? `[${arg[i]}]` :JSON.stringify(arg[i], 0, ' ')+' ';
		t += JSON.stringify(arg[i], 0, ' ')+' ';
	let ele =  document.getElementById('log');
	ele.innerHTML = t + ele.innerHTML;
}
// get element
var cvs = document.getElementById("lmap-cv");
var m = new Mmap();
m.bindCanvas(cvs);
m.setLocations(locations);
m.setDim(0);
m.setTargetScale(3);
m.setTargetPos(244, 139)
m.start();

m.ops.tagSize = 6;
m.ops.fontScale = 3;
m.ops.changeScaleSpeed = 1.5;
m.ops.showChunkLine = false;
m.ops.showBlockLine = false;
m.ops.showGrid = true;
m.ops.gridFontSize = 14;
m.ops.scaleK = 0.02;