// get element
var cvs = document.getElementById("lmap-cv");

var m = new Mmap();
m.bindCanvas(cvs);
m.setLocations(locations);
m.setDim(0);
m.setTargetScale(12);
m.setPos(260, 100)
m.start();

m.ops.tagSize = 6;
m.ops.fontScale = 2;
m.ops.changeScaleSpeed = 1.5;
m.ops.showChunkLine = false;
m.ops.showBlockLine = false;
m.ops.showGrid = true;
m.ops.gridFontSize = 14;
m.ops.scaleK = 0.02;