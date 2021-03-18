'use strict';
/*

 */
class Fam{
	constructor(ele, width=300, height=200){
		this.inv = -1
		this.ele = ele
		this.cs = ele.getElementsByTagName('canvas')
		this.c0 = this.cs[0].getContext('2d')
		this.c1 = this.cs[1].getContext('2d')
		this.width = width
		this.height = height
		this.c0.canvas.width = width
		this.c0.canvas.height = height
		this.c1.canvas.width = width
		this.c1.canvas.height = height
		this.id = -1
		this.col0 = 0.5	//background brightness
		this.col1 = 0.5	//content brightness
		
		var
			imgData = this.c0.createImageData(width,height),
			iData = imgData.data
		for(var i=0,ien=iData.length;i<ien;i+=4){
			var col = (Math.random()<this.col0)*255
			iData[i] = col
			iData[i+1] = col
			iData[i+2] = col
			iData[i+3] = 255
		}
		this.c0.putImageData(imgData, 0, 0)
	}
	static T0 = 0
	static T1
	static FPS = 0
	static running = []	//the running fams
	static inr(){
		Fam.T1 = new Date()*1
		Fam.FPS = 1000/(Fam.T1-Fam.T0)
		Fam.T0 = Fam.T1
		for(var i=0,len=Fam.running.length;i<len;i++){
			var
			 self = Fam.running[i],
			 imgData = self.c0.getImageData(0,0,self.width,self.height),
			 iData = imgData.data,
			 leng = self.width*self.height*4;
			iData[leng-4] = iData[0]
			iData[leng-3] = iData[1]
			iData[leng-2] = iData[2]
			iData[leng-1] = iData[3]
			for(var j=0,jen=iData.length;j<jen-4;j+=4){
				iData[j] = iData[j+4]
				iData[j+1] = iData[j+5]
				iData[j+2] = iData[j+6]
				iData[j+3] = iData[j+7]
			}
			self.c0.putImageData(imgData, 0, 0)
		}
	}
	start(){
		if(this.id===-1){
			this.inv = window.setInterval(Fam.inr, 0)
			this.id = Fam.running.length
			Fam.running.push(this)
		}
	}
	stop(){
		if(this.id>-1){
			window.clearInterval(this.inv)
			this.inv = -1
			Fam.running.splice(this.id, 1)
			this.id = -1
		}
	}
	autoDraw(){
		var c = this.c1
		var txt = c.canvas.innerHTML
		c.fillStye = 'rgba(0, 0, 0, 1)'
		c.fillRect(0,0,100,100)
		c.font = '20px Consolas'
		c.textAlign = 'left'
		c.fillText('hello', 100, 100)
	}
	hideContent(){
		var imgData = this.c1.getImageData(0,0,this.width,this.height)
		var iData = imgData.data
		for(var i=0,len=iData.length;i<len;i+=4){
			if(iData[i+3]>0){
				var col = (Math.random()<this.col1)*255
				iData[i] = col
				iData[i+1] = col
				iData[i+2] = col
				iData[i+3] = 255
			}
		}
		this.c1.putImageData(imgData, 0, 0)
	}
}