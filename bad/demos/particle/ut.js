/*
window.Ucer:{
	anykeydown,	//if user is pressing any keyboard button
	mousedown,	//if user is pressing mouse button
	x,y,	//mouse coord
	o:{}	//
	o_o(when)
		posible situations of arguments:
		"inr o" , o	//run at each obj_loop's foot in inr()
		"inr -1" 	//run at each inr's foot
		"sinr -1"	//run at each sinr's foot
}
window.Df:{
	toggle('ptk.paused') //toggle boolean var
	start() //start calculating
	showmenu()
	hidemenu()
	pause()
	play()
}
window.ut.o:[
	{
		name:'water',	//display name
		inf:'Water(l)',	//infermation
		col:['#22f','#55f'], //display color in menubox,posible colors in cvs

		T:300,//Temp
		type:'l',	//l|s|f|g
	},
]
*/

try{
//final
ptk.w=42
ptk.h=80
ptk.G=[0.5,0.9]
ptk.rslt=6
cvs.width=ptk.w;
cvs.height=ptk.h;

ptk.predo()

/* ele.requestFullscreen();*/
//-----Android-----
//////


if(device==='mob'){
	cvs.ontouchstart=()=>{
		Ucer.touching=true;
		cvs.w = document.body.offsetWidth;
		cvs.h = document.body.offsetHeight;
		cvs.evt_touch(event);
		event.cancelBubble=true;
		event.stopPropagation();
	}
	cvs.evt_touch=(event)=>{
		//计算Ucer.x & Ucer.y
		Ucer.x = event.touches[0].clientX;
		Ucer.y = event.touches[0].clientY;
		if (screen.ldw[0] > ptk.h / ptk.w) {
			Ucer.x = Math.floor(Ucer.x / cvs.w * ptk.w);
			Ucer.y = Math.floor((Ucer.y - (cvs.h - cvs.w / ptk.w * ptk.h) / 2) * ptk.w / cvs.w);
		} else if (screen.ldw[0] === ptk.h / ptk.w) {
			Ucer.x = Math.floor(Ucer.x / cvs.w * ptk.w);
			Ucer.y = Math.floor(Ucer.y / cvs.h * ptk.h);
		} else {
			Ucer.x = Math.floor((Ucer.x - (cvs.w - cvs.h / ptk.h * ptk.w) / 2) * ptk.h / cvs.h);
			Ucer.y = Math.floor(Ucer.y / cvs.h * ptk.h);
		};
		event.cancelBubble=true;
		event.stopPropagation();
	}
	//cvs.ontouchmove=cvs.evt_touch;
	cvs.ontouchend=()=>{
		Ucer.touching=false;
		event.cancelBubble=true;
		event.stopPropagation();
	}
	cvs.addEventListener('touchstart',cvs.ontouchstart,{passive:true,})
	cvs.addEventListener('touchmove',cvs.evt_touch,{passive:true,})
	//cvs.addEventListener('touchmove',cvs.evt_touch,{passive:true,})
}
//-----PC-----
if(device==='pc'){
	cvs.onmousedown=()=>{
		Ucer.touching = true;
	}
	cvs.onmousemove=()=>{
		
	}
	cvs.onmouseup=()=>{
		Ucer.touching = false;
	}
}
document.body.evt_keydown=()=>{
	switch(event.keyCode){
	 case 69://E
		if(Es.menubox.style.left!='0px')Df.showmenu();
		break;
	 case 70://F
		Df.start();
		break;
	 case 81://Q
		Df.togglePause();
		break;
	 case 82://R
		location.reload(true);
	 case 86://V
		Df.toggleViewmode();
		//ptk.viewmode = ptk.viewmode==='normal'? 'thermal':'normal';
		break;
	 case 0:
		break;
	}
}
document.body.addEventListener('keydown',document.body.evt_keydown,{passive:true})
document.body.onkeyup=()=>{
	switch(event.keyCode){
	 case 69://E
		Df.hidemenu();
		break;
	 case 0:
		break;
	}
}

Ucer.o_o = (where,o)=>{
	switch(where){
	 case 'inr o'://在inr中处理每个P.o末尾
		if(
			(o.name && o.name==='fire' && Math.random()<0.16) ||
			(o.y===0)
		){
			ptk.delete(o);
		}
		break;
	 case 'inr -1':
		break;
	 case 'sinr -1':
		break;
	}
};

var ut={
	I:[//滑动条slide
		{
			name:'环境温度',
			min:0,
			max:1000,
			varText:'ptk.envirTemp',
			col:'#55c',
		},
		{
			name:'火焰温度',
			min:0,
			max:2000,
			varText:'ut.fire.T',
			col:'#c44',
		},
	],
	o:[//按钮
/*
		{
			name:'H20',//必须符合标识符的规则
			inf:'H2O is water',//any text
			m:1000,//密度，在物质分层时根据这个属性
			type:'l',// f|s|l|g
			col:['#243','#423','#fef',"#324",...etc],//颜色值，第一个代表在菜单中对应按钮的颜色
			T:300,//初始温度 //物态变化前后保持不变
			lim_melt:273,//熔点
			lim_boil:373,//沸点
			_s:'ice'//凝固后变成的粒子的name属性（对方的type不一定要是 s，f 也行）
			_g:'steam'//气化后变成的粒子的name属性
			(_l):'H2O'//液化或融化后变成的粒子的name属性，显然它本身就是液体，所以可以不指定该属性
		//_g,_s,_l 属性设置为false时将不会切换粒子
			seq:100,////画笔顺序，在使用画笔时seq值大的会覆盖seq值小的，如果相等也覆盖（暂未实现）
				//f:1024, s:512, l:256, g:128,
		}
*/
		//----------------
		{
			name:'eraser',
			inf:'Need introduction?_?',
			type:'eat',
			col:['#111'],
		},
		{
			name:'glass',
			inf:'Glass',
			m:2500,
			type:'f',
			col:['#ccc','#ccc'],
			T: 300,
			lim_melt:1100,
			lim_boil:2500,
			_l:'SiO2_l',
			_g:false,
			seq:1024,
		},
		{
			name:'sand',
			inf:'Not sand,It is SiO2',
			m:2200,
			type:'s',
			col:['#af2','#aaff22','#aaf444'],
			T: 300,
			lim_melt:1200,
			lim_boil:2500,
			_l:'SiO2_l',
			_g:false,
			seq:512,
		},
		{
			name:'SiO2_l',
			inf:'liquid SiO2',
			m:1500,
			type:'l',
			col:['#bbb','#bbb','#bbb'],
			T:1400,
			lim_melt:1000,
			lim_boil:2500,
			_s:'glass',
			_g:false,
			seq:256,
		},
		//------------------
		{
			name:'rock',
			inf:'You know,rock',
			m:3000,
			type:'f',
			col:['#777','#666','#555','#888'],
			T: 300,
			lim_melt:1200,
			lim_boil:9999,
			_l:'magma',
			seq:1024,
		},
		{
			name:'magma',
			inf:'Hooooot',
			m:2500,
			type:'l',
			col:['#ff7500','#ff8a00','#ff7500','#ff7500','#c47822'],
			T: 1700,
			lim_melt:1200,
			lim_boil:9999,
			_s:'rock',
			_g:false,
			seq:256,
		},
		//-------------------
		{
			name:'ice',
			inf:'Ice',
			m:909,
			type:'f',
			col:['#9898ff','#99f','#aaf'],
			T:150,
			lim_melt:273,
			lim_boil:373,
			_l:'water',
			_g:'steam',
			seq:512,
		},
		{
			name:'water',
			inf:'H2O(l)',
			m:1000,
			type:'l',
			col:['#22f','#00f','#00f','#4749ff'],
			T: 300,
			lim_melt:273,
			lim_boil:373,
			_g:'steam',
			_s:'ice',
			seq:256,
		},
		{
			name:'steam',
			inf:'steam, vapor of water',
			m:0.6,
			type:'g',
			col:['#ddf','#ddf','#ccf'],
			T:470,
			lim_melt:273,
			lim_boil:373,
			_s:'ice',
			_l:'water',
			seq:128,
		},
		//--------------------
		/*
		{
			name:'N2_s',
			inf:'real • 固氮',
			m:1,
			type:'s',
			col:['#338','#338'],
			T: 30,
			lim_melt:63,
			_l:'N2_l',
			_g:'N2_g',
		},
		{
			name:'N2_l',
			inf:'液氮',
			m:1,
			type:'l',
			col:['#338','#338'],
			T: 70,
			lim_melt:63,
			lim_boil:77,
			_s:'N2_s',
			_g:'N2',
		},
		{
			name:'N2',
			inf:'氮气',
			m:1.25,
			type:'g',
			col:['#338','#338'],
			T: 300,
			lim_boil:77,
			_s:'N2_s',
			_l:'N2_l',
		},*/
		{
			name:'fire',
			inf:'fire',
			m:0,
			type:'g',
			col:['#a22','#ff0','#b40','#c40'],
			T:1000,
			lim_boil:0,
			_l:false,
		},
		/*{
			name:'He',
			inf:'lazy He',
			m:1,
			type:'g',
			col:['#88f','#88f','#99f'],
			T: 300,
			lim_melt:0,ee
			lim_boil:0,
			_l:false,
			_s:false,
		},*/
		//----------------------------
		/*
		{
			name:'oil',
			inf:'Cooking oil',
			m:800,
			type:'l',
			col:['#ff2','#dd2','#dd3'],
			T: 300,
			_s:false,
			_l:false,
		},
		*/
	],
}
}catch(err){alert("ut.js\n"+err.message)}