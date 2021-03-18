//dom.js
window.device = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? "mob" : "pc";
Es = {
	j:[	'canvas','sta','#infbox',
		'#cvsbox','#cvs',
		'#menubox','#darker',
		'#utbuttons','#utslides',
		'#optbeforestart','#optafterstart'
	],
}
for(i=Es.j.length-1;i>=0;i--){
	ele=Es.j[i];
	if(ele[0]==='#'){
		Es[ele.replace('#','').replace(/\-/,'_')] = document.querySelector(ele);
	}else{
		Es[ele.replace('.','').replace(/\-/,'_')] = document.querySelectorAll(ele);
	}
};
//按钮
for(i=Es.sta.length-1;i>=0;i--){
	let ele = Es.sta[i];
	Es['sta_'+ele.innerHTML] = ele;
	switch(ele.innerHTML){
	 case 'viewmode':
			ele.innerHTML='视觉: normal';
			break;
	 case 'pause':
			ele.innerHTML='暂停';
			break;
	};
};
var Ucer = {
	o_o:(o)=>{},
	anykeydown:false,
	mousedown:false,
	touching:false,
	x:0,
	y:0,
	o : false,//用户选定的一种粒子，在onload中自动被设置为ut.o[0]
	copidO:null,
	creatObj:function(){
		if(!this.o)return;
		this.copidO = {};
		for(thekey in this.o){
			this.copidO[thekey] = this.o[thekey];
		};
		this.copidO.x=this.x;
		this.copidO.y=this.y;
		this.copidO.inf=undefined;
		return this.copidO;
	}
};
var Df = {
	format:()=>{
		ptk.o=[];
		ptk.predo();
	},
	start:()=>{
		if(ptk.alreadyStart)return;
		try{
			ha_ha_gowrong;
			Es.cvsbox.requestFullscreen();
		}catch(Err){
			ptk.hunger = true;
		}
		ptk.T0 = new Date()*1;
		setInterval(()=>{inr();inr()},ptk.interval_inr);
		setInterval(sinr,ptk.interval_sinr);
		ptk.paused=false;
		ptk.paused1=false;
		Es.optbeforestart.style.display='none';
		Es.optafterstart.style.display='inline';
		ptk.alreadyStart = true;
	},
	showmenu:()=>{
		/*
		if(ptk.deleted && ptk.o.length>1000){
			//整理
			var ptk_o=ptk.o,arr = [],i=0;
			Df.format();
			while(i<ptk_o.length){
				var o=ptk_o[i];
				if(!o){
					i++;
					continue;
				};
				arr.push(o);
				ptk.M[o.x][o.y] = o;
				i++;
			}
			ptk.deleted=0;
			ptk.o = arr;
			console.log(`已整理`)
		};
		*/
		Es.menubox.style.left=0;
		Es.menubox.style.transitionDuration='0ms';
		ptk.paused1 = true;
	},
	hidemenu:()=>{
		Es.menubox.style.left='calc(100vw + 15px)';
		Es.menubox.style.transitionDuration='200ms';
		ptk.paused1 = false;
	},
	togglePause:()=>{
		ptk.paused = !ptk.paused;
	},
	toggleViewmode:()=>{
		ptk.viewmode = ptk.viewmode==='normal' ? 'thermal' :
		               ptk.viewmode==='thermal'? 'state' :
		               ptk.viewmode==='state'  ? 'normal' : 'normal';
		Es.sta_viewmode.innerHTML='视觉: '+ptk.viewmode;
		event.cancelBubble=true;
		event.stopPropagation();
	},
	pause:()=>{
		///ptk.paused1=true;
		Es.sta_pause.innerHTML='继续';
	},
	play:()=>{
		///ptk.paused1=false;
		Es.sta_pause.innerHTML='暂停';
	},
	useO:(o)=>{
		Ucer.o=o;
	},
	I_touchstart:function(ele){
		ele.x0 = event.touches[0].clientX;
		ele.w = document.body.offsetWidth;
		ele.v0 = eval(ele.I.varText)
	},
	I_touchmove:function(ele){
		ele.x1 = event.touches[0].clientX;
		ele.dtx = ele.v0 + (ele.x1 - ele.x0)/ele.w*(ele.I.max-ele.I.min);
		if(ele.dtx<0 || ele.dtx>ele.I.max)return;
		//console.log(ele.dtx)
		eval(ele.I.varText +'='+ ele.dtx)
		ele.c.clearRect(0,0,100,1)
		ele.c.fillRect(0,0,eval(ele.I.varText)/(ele.I.max-ele.I.min)*100,1)
		ele.valu.innerHTML=Math.round(ele.dtx);
	},
	T_c:(x,n,m)=>{
		var R=0,G=0,B=0,len=m-n,Mid=(n+m)/2;
		x=Math.sqrt((1.01*len*len)-Math.pow(x-m,2)) + n;
		R = x<Mid ? 0:510/len*(x-Mid);
		G = x<Mid ? 510/len*x : 510-510/len*x;
		B = x<Mid ? 255-510/len*x:0;
		/*pjw
		R = x<255 ? 0 : 
		    x<2755? 255/2500/2500*Math.pow(x - 255,2) : 
				  255;
		G = x<255 ? x*x/255 : 
		    x<2755? 255/2500/2500*Math.pow(x-2755,2) : 
				  253;
		B = x<255 ? 255-x*x/255 : 
		    x<2755? 0 :
				  250;
		*/
		R=Math.floor(R);
		G=Math.floor(G);
		B=Math.floor(B);
		return `rgb(${R},${G},${B})`;
	},

}
window.onload=()=>{
	i=0;
	Es.utbuttons.innerHTML=``;
	while(i<ut.o.length){
		var o = ut.o[i];
		var decol=o.col[0];
		if(o.col[0].length===4){
			var
			R=parseInt('0x'+decol[1]),
			G=parseInt('0x'+decol[2]),
			B=parseInt('0x'+decol[3]);
			R=R<8?255:0;G=G<8?255:0;B=B<8?255:0;
		}else{
			var
			R=parseInt('0x'+decol.slice(1,2)),
			G=parseInt('0x'+decol.slice(3,4)),
			B=parseInt('0x'+decol.slice(5,6));
			R=R<128?255:0;G=G<128?255:0;B=B<128?255:0;
		}
		decol=`rgb(${R},${G},${B})`;
		Es.utbuttons.innerHTML+=
`<btn onclick="event.cancelBubble=true;
Df.useO(ut.o[${i}]);//Df.hidemenu();
Es.infbox.innerHTML='${o.inf}'" style="background:${o.col[0]};color:${decol}">${o.name}</btn>`
		ut[o.name] =o;
		i++;
	}
	Df.useO(ut.o[0]);
	
	i=0;
	Es.utslides.innerHTML =``;
	while(i<ut.I.length){
		var I = ut.I[i];
		Es.utslides.innerHTML += 
`<slide utid="${i}" ontouchstart="Df.I_touchstart(this)" ontouchmove="Df.I_touchmove(this)">
	<dv>${I.name}</dv>
	<dv>${eval(I.varText)}</dv>
	<canvas>slide</canvas>
</slide>`
		i++;
	}

	//绘制要用到的canvas图像
	Es.canvas = document.getElementsByTagName('canvas');
	for(i=Es.canvas.length-1;i>=0;i--){
		let ele = Es.canvas[i]
		switch(ele.innerHTML){
		 case 'cvs':
			window.cvs=Es.cvs
			window.c=cvs.getContext('2d');
			break;
		 case 'hidemenu':
			ele.width=100;ele.height=100;
			let cc0=ele.getContext('2d');
			cc0.lineWidth=6;cc0.strokeStyle='#fff';cc0.beginPath();
			cc0.moveTo(40,40);cc0.lineTo(60,60);cc0.moveTo(60,40);
			cc0.lineTo(40,60);cc0.stroke();delete cc0;
			break;
		 case 'slide':
			ele.innerHTML='';
			ele.width = 100;
			ele.height=1;
			var dady = ele.parentNode;
			dady.c = ele.getContext('2d');
			dady.I = ut.I[dady.getAttribute('utid')];
			dady.c.fillStyle = dady.I.col;
			dady.c.fillRect(0,0,eval(dady.I.varText)/(dady.I.max-dady.I.min)*100,1)
			dady.valu = dady.children[1];
			break;
		}
	}
}
