// get element
var cvs = document.getElementById("lmap-cv");

var m = new Mmap();
m.bindCanvas(cvs);
m.setLocations(locations);
m.setDim(0);
m._setScale(3);
m.setPos(300, 130)
m.start();