'use strict'
var fn = 160;/////
var crimpt = {
	M : maps[0],
	I_inr:false,
	I_draw:false,
	inr_maxInt : 1E3/ 64,	// 1E3 / minFPS
	inr_minInt : 1E3/ 800,	// 1e3 / maxFPS
	draw_FPS : 36,
	c : undefined,//2D context of canvas
	amountOfT : 5,
/////
	reso : [16*fn,fn*16*outerHeight/outerWidth],
	playerKey : [],
	key : {
		sU : 38,
		sD : 40,
		sL : 37,
		sR : 39,
		U : 87,	//W
		D : 83,	//S
		L : 65,	//A
		R : 68,	//D
		zoomIn : 187,	//+
		zoomOut : 189	//- //69=E,81=Q
	}
}
for(var i=0;i<200;i++){crimpt.playerKey[i]=0}

var inr = ()=>{
	var 
		C = crimpt,
		M = C.M;
	if(M.paused)return;
	M.Ts.push(new Date()*1);
	while(M.Ts.length > C.amountOfT){
		M.Ts.shift();
	}
	var T = (M.Ts[M.Ts.length-1] - M.Ts[0]) / M.Ts.length; // /C.amountOfT
	T = Math.min(T,C.inr_maxInt);
	T = Math.max(T,C.inr_minInt);
	window.fps = 1e3/T; ////
	T /= 1e3;
	////
	////----MOTION----\\\\
	///M.minSightRange = 3 + Math.sin(new Date()/400)*2;
	///zoom in and zoom out
	//M.minSightRange *= Math.pow(T,(C.playerKey[C.key.zoomIn]-C.playerKey[C.key.zoomOut])*M.zoomK)
	M.minSightRange *= (1-T*(C.playerKey[C.key.zoomIn]-C.playerKey[C.key.zoomOut])*M.zoomK)
	//sight-rect
	if(M.freeSight){//usually
	}else{//follow some unit
		var u = M.unit[M.sightFollows];
		M.sV = [(u.P[0] - M.sP[0]) *M.sK,(u.P[1] - M.sP[1]) *M.sK]
		M.sP = [M.sP[0] + M.sV[0]*T,M.sP[1] + M.sV[1]*T]
		//M.sV = M.unit[M.sightFollows].P;
	}
	//unit
	for(var i=M.unit.length-1;i>=0;i--){
		var u = M.unit[i];
		//avoid perfect situation of position
		u.P[0]+=(Math.random()-0.5)*1e-5;
		u.P[1]+=(Math.random()-0.5)*1e-5;
		//HP recover
		if(u.HP < u.maxHP)u.HP += T*u.HPk*u.maxHP
		else u.HP = u.maxHP;
		if(u.byPlayer){ //pass Playerial Intelligence
			if(u.running)u.vmax = u.walkingSpeed*2
			else u.vmax = u.walkingSpeed;
			var
				pX = C.playerKey[C.key.R]-C.playerKey[C.key.L],
				pY = C.playerKey[C.key.D]-C.playerKey[C.key.U];
			if(pX||pY)u.free = 0;
			u.a = [pX,pY]; // !ATTENTION! don't set pX|pY of bots,directly set their u.a=[1,0] to control them!
			var n = Math.sqrt(u.a[0]*u.a[0] + u.a[1]*u.a[1]);
			if(n){u.a = [u.a[0]/n * u.absA,u.a[1]/n * u.absA]};
			//direction
			var 
				e = C.c.ele, //canvas ele
				p = Math.min(e.width,e.height) / M.minSightRange / 2, //px per m
				[x0,y0] = [...u.P] //unit's coordinate in whole map
			if(e.width>e.height){var h = M.minSightRange * 2,w = e.width/e.height * h}
			else{var w = M.minSightRange * 2,h = e.height/e.width * w};
			M.cursor[2] = (M.cursor[0]-0.5) * w + M.sP[0];
			M.cursor[3] = (M.cursor[1]-0.5) * h + M.sP[1]; //cursor's coordinate in whole map
			////if(M.$[x_-x_%1] && M.$[x_-x_%1][y_-y_%1])M.$[x_-x_%1][y_-y_%1][0]=1  // creat map
			u.d = -Math.atan((M.cursor[3]-y0)/(M.cursor[2]-x0)) + (M.cursor[2]<x0 ? 3.1415926535:0)
		}else{ // make Artificial Intelligence #AI
			// #aims
			var j = 0;
			aimProcessor:
			while(j<u.aims.length){
				var A = u.aims[j];
				//handle this aim: test if it's already achived,if not,solve it
				switch(A.name){
				 case 'go':
					var 
						x_ = Math.floor(A.P[0]),
						y_ = Math.floor(A.P[1]);
						m = M._[x_][y_];
					if((Math.abs(A.P[0]-u.P[0])< 2e-3 && 2e-3 >Math.abs(A.P[1]-u.P[1])) || M.$[x_][y_][0]){
						if(!A.final){
							u.a = [0,0];
							u.v = [0,0];
						}else A.final(M,u);
						u.aims.shift();
						continue;
					};
					if(m === false){ //hasn't apply
						worker.postMessage(`pathPlan${x_}^${y_}`);
						console.log(`worker.postMessage`)
						M._[x_][y_] = 0;
						break aimProcessor;
					}else if(m === 0){ //applyed but hasn't got the result
						break aimProcessor;
					}else{ //calculated
						var 
							r = M._[x_][y_],
							x0 = Math.floor(u.P[0]),
							y0 = Math.floor(u.P[1]),
							n = r[x0][y0],
							xp=0,yp=0;
						// there's no wall. && the _ there  is less than min(n)
						if(M.$[x0][y0-1] && !M.$[x0][y0-1][0] && r[x0][y0-1] < n){//N
							n = r[x0][y0-1];
							[xp,yp] = [0,-1]
						}
						if(r[x0+1]     && !M.$[x0+1][y0][0] && r[x0+1][y0] < n){//E
							n = r[x0+1][y0];
							[xp,yp] = [+1,0]
						}
						if(r[x0][y0+1] && !M.$[x0][y0+1][0] && r[x0][y0+1] < n){//S
							n = r[x0][y0+1];
							[xp,yp] = [0,+1]
						}
						if(r[x0-1]     && !M.$[x0-1][y0][0] && r[x0-1][y0] < n){//W
							n = r[x0-1][y0];
							[xp,yp] = [-1,0]
						}
						if(r[x0-1] && M.$[x0-1][y0-1] && !M.$[x0-1][y0-1][0] && !(M.$[x0-1][y0][0] && M.$[x0][y0-1][0]) && r[x0-1][y0-1] < n){//WN
							n = r[x0-1][y0-1];
							[xp,yp] = [-1,-1]
						}
						if(r[x0+1] && M.$[x0+1][y0-1] && !M.$[x0+1][y0-1][0] && !(M.$[x0+1][y0][0] && M.$[x0][y0-1][0]) && r[x0+1][y0-1] < n){//EN
							n = r[x0+1][y0-1];
							[xp,yp] = [1,-1]
						}
						if(r[x0+1] && M.$[x0+1][y0+1] && !M.$[x0+1][y0+1][0] && !(M.$[x0+1][y0][0] && M.$[x0][y0+1][0]) && r[x0+1][y0+1] < n){//ES
							n = r[x0+1][y0+1];
							[xp,yp] = [1,1]
						}
						if(r[x0-1] && M.$[x0-1][y0+1] && !M.$[x0-1][y0+1][0] && !(M.$[x0-1][y0][0] && M.$[x0][y0+1][0]) && r[x0-1][y0+1] < n){//WS
							n = r[x0-1][y0+1];
							[xp,yp] = [-1,1]
						}
						if(n===0){
							u.aims.unshift({
							name : '_go',
							P : [...A.P],
						});
						}else u.aims.unshift({
							name : '_go',
							P : [x0+xp+0.5,y0+yp+0.5],
						});
						break aimProcessor;
					};
					break;
				 case '_go':
					var 
						x_ = Math.floor(A.P[0]),
						y_ = Math.floor(A.P[1]);
					if((Math.abs(A.P[0]-u.P[0])< 4e-3 && 4e-3 >Math.abs(A.P[1]-u.P[1])) || M.$[x_][y_][0]){
						u.aims.shift();
						u.a = [0,0];
						//u.v = [0,0];
						continue;
					}
					u.a = [A.P[0]-u.P[0],A.P[1]-u.P[1]];
					var $d =u.absA / Math.sqrt(u.a[0]*u.a[0]+u.a[1]*u.a[1]);
					u.a = [u.a[0]*$d,u.a[1]*$d];
					break;
				}
				break;//usually only handle the first one.
				j++;
			}
		}
		//move\\
		//friction. u.free==true means it has friction.
		if(u.free)u.a = [u.a[0]- u.v[0]*u.absA*0.4,u.a[1]- u.v[1]*u.absA*0.4];
		//v = v0 + a * t
		u.v = [u.v[0]+u.a[0]*T,u.v[1]+u.a[1]*T];
		//speed limited
		var n = Math.sqrt(u.v[0]*u.v[0] + u.v[1]*u.v[1]);
		if(n>u.vmax){u.v = [u.v[0]/n * u.vmax,u.v[1]/n * u.vmax]};
		//x = x0 + v * t
		u.P = [u.P[0]+u.v[0]*T,u.P[1]+u.v[1]*T]
		u.free = 1
		//collide the border
		if(u.P[0] < u.r){
			u.v[0] *= M.collideK;u.P[0] = u.r
		}else if(u.P[0] > M.w-u.r){
			u.v[0]*=M.collideK;u.P[0] = M.w-u.r
		}
		if(u.P[1] < u.r){
			u.v[1] *= M.collideK;u.P[1] = u.r
		}else if(u.P[1] > M.h-u.r){
			u.v[1]*=M.collideK;u.P[1] = M.h-u.r
		}
		var j = M.unit.length-1;
		while(j>i){
			var 
				u1 = M.unit[j],
				x12 = u1.P[0] - u.P[0],
				y12 = u1.P[1] - u.P[1],
				$d = Math.sqrt(x12*x12+y12*y12);
			if($d < u.r+u1.r){ //collide other units
				var $v = (u.r+u1.r-$d)/$d/2;
				u.P = [ u.P[0]- $v*x12, u.P[1]- $v*y12];
				u1.P= [u1.P[0]+ $v*x12,u1.P[1]+ $v*y12];
			}
			j--
		}
		//collide walls
		var 
			x0 = Math.floor(u.P[0]),
			y0 = Math.floor(u.P[1]),
			x_ = u.P[0] % 1,
			y_ = u.P[1] % 1
		if(x0>0 && M.$[x0-1][y0][0] && x_<u.r){//west
			u.v[0]*=M.collideK;u.P[0] = x0 + u.r;
		}
		if(x0<M.w-1 && M.$[x0+1][y0][0] && 1-x_<u.r){//east
			u.v[0]*=M.collideK;u.P[0] = x0 - u.r +1;
		}
		if(y0>0 && M.$[x0][y0-1][0] && y_<u.r){//north
			u.v[1]*=M.collideK;u.P[1] = y0 + u.r;
		}
		if(y0<M.h-1 && M.$[x0][y0+1][0] && 1-y_<u.r){//south
			u.v[1]*=M.collideK;u.P[1] = y0 - u.r +1;
		}
		var n=[];
		if(x0>0    &&y0>0     && M.$[x0-1][y0-1][0])n.push([0,0]); //west-north
		if(x0<M.w-1&&y0>0     && M.$[x0+1][y0-1][0])n.push([1,0]); //east-north
		if(x0>0    &&y0<M.h-1 && M.$[x0-1][y0+1][0])n.push([0,1]); //west-south
		if(x0<M.w-1&&y0<M.h-1 && M.$[x0+1][y0+1][0])n.push([1,1]); //east-south
		if(M.$[x0][y0][0]){
			n.push([0.4,0.4,1]);n.push([0.6,0.4,1]);n.push([0.4,0.6,1]);n.push([0.6,0.6,1])
		}
		var j=n.length-1;
		while(j>=0){
			var 
				m = n[j],
				x12 = x_ - m[0],
				y12 = y_ - m[1],
				$d = Math.sqrt(x12*x12+y12*y12);
			if($d < u.r)u.P = [x0+m[0] +x12/$d*u.r,y0+m[1] +y12/$d* (u.r+ (m[2]?1:0))];
			j--;
		}
	}
	//i=1e7;while(i-->0){};////
	//bullets
	var i = 0;
	while(i<M.bullet.length){
		var b = M.bullet[i];
		bullettypes:
		switch(b.type){
		 case 0: //normal bullet
			break;
		 case 1: //rpg
			if(b.stop){
				//explore and make damage
				if(b.range){
					var j=M.unit.length-1;
					while(j>=0){
						var 
							u = M.unit[j],
							x12 = b.P[0]-u.P[0], y12 = b.P[1]-u.P[1],
							$d = Math.sqrt(x12*x12+y12*y12);
						if($d < b.range){//hurt
							u.HP -= -b.power/b.range*$d + b.power;
						};
						j--;
					}
					M.effect.push({ ////new effect()
						type : 'explode',
						P : [...b.P],
						life : 160, // msecond
						T0:false, T1:false, r:0,
						range : b.range,
					})
				}else{
					b.target.HP -= b.power;
				}
				//delete this bullet
				M.bullet.splice(i,1)
				continue;
				break bullettypes;
			}
			//hasn't stopped
			b.P = [b.P[0]+T*b.v[0],b.P[1]+T*b.v[1]];
			//test collide
			if(b.P[0]<=0 || b.P[1]<=0 || b.P[0]>=M.w || b.P[1]>=M.h || (M.$[Math.floor(b.P[0])][Math.floor(b.P[1])][0])){
				b.stop = true;
				break bullettypes;
			}
			var j = M.unit.length-1;
			atunit:
			while(j>=0){
				var 
					u = M.unit[j],
					x12 = b.P[0]-u.P[0],
					y12 = b.P[1]-u.P[1];
				if(x12*x12+y12*y12<=u.r*u.r){ //boom
					b.stop = true;
					b.target = u;
					break bullettypes;
				}
				j--;
			}
			break;
		}
		i++;
	}
}
var draw = ()=>{// #draw
	[Es.a.width,Es.a.height] = [...crimpt.reso];
	/*if(new Date()*1%2000<=20){
		crimpt.M.bullet.push({
				type : 1, //(0:normal | 1:rpg)normal : doesn't takes time to move; rpg : has its speed
				P : [3.2,0.6], //position
				v : [20,0], //speed
				col : '#800', //fillStyle
				r : 0.1, //how big it is
				range : 3, //if range != false, it will explode
				power : 200, //damage
				stop : false, //
				target : false, //false|(unit)
		})
	}*/
	var 
		C = crimpt,
		M = C.M,
		c = crimpt.c,
		e = c.ele,
		p = Math.min(e.width,e.height) / M.minSightRange / 2;
	c.clearRect(0,0,e.width,e.height); ///I donot know why it doesn't work
	//e.width = e.width; ///clear the canvas
	//draw map
	if(e.width>e.height){
		var h = M.minSightRange * 2,
		w = e.width/e.height * h
	}else{
		var w = M.minSightRange * 2,
		h = e.height/e.width * w
	}
	var P = [Math.floor(M.sP[0]-w/2),Math.floor(M.sP[1]-h/2)];
	for(var i=P[0];i<P[0]+w+1;i++){
		for(var j=P[1];j<P[1]+h+1;j++){
			if(!M.$[i] || !M.$[i][j])continue;
			var b = M.$[i][j];
			c.beginPath();
			if(!b[1]) c.fillStyle = b[0] ? M.wallColor : M.floorColor
			else c.fillStyle = b[1];
			c.fillRect(p*(i-M.sP[0])+e.width/2,p*(j-M.sP[1])+e.height/2,p,p)
		}
	}
	//draw units
	var i=M.unit.length-1;
	while(i>=0){
		var 
			u = M.unit[i],
			P = [p*(u.P[0]-M.sP[0]) +e.width/2,p*(u.P[1]-M.sP[1]) +e.height/2];
		c.beginPath();
		c.moveTo(...P);
		c.arc(...P,u.r*p,-u.d+0.36,-u.d-0.36);
		c.fillStyle = u.col;
		c.fill();
		i--
	};
	//draw bullets
	var i = M.bullet.length-1;
	while(i>=0){
		var 
			b = M.bullet[i],
			P = [p*(b.P[0]-M.sP[0]) +e.width/2,p*(b.P[1]-M.sP[1]) +e.height/2];
		c.beginPath()
		c.arc(...P,b.r*p,0,7)
		c.fillStyle = b.col;
		c.fill();
		i--
	}
	//draw effects
	var i = 0,len = M.effect.length;
	while(i<len){
		var 
			b = M.effect[i],
			P = [p*(b.P[0]-M.sP[0]) +e.width/2,p*(b.P[1]-M.sP[1]) +e.height/2];
		if(!b.T0){
			b.T0 = new Date()*1;
			b.T1 = b.T0 + b.life;
		}else{
			b.r = b.range/b.life*((new Date()*1)-b.T0) //calc current r
			if(b.r>=b.range){ //delete this effect object
				M.effect.splice(i,1)
				len = M.effect.length; //reset length
				continue;
			}
		}
		c.beginPath();
		c.arc(...P,b.r*p,0,7);
		c.lineWidth = p*0.3;
		c.strokeStyle = 'rgba(255,0,0,0.4)';
		c.stroke();
		i++;
	}
	////draw cursor
	c.beginPath();
	c.arc(M.cursor[0]*e.width,M.cursor[1]*e.height,p* 0.16,0,7)
	c.strokeStyle = '#f0f';
	c.lineWidth = p*0.02;
	c.stroke()
}
var readMap = (m)=>{
	//set a map object as current map
	crimpt.M = m;
	m.Ts = [0];
	m.sV = [0,0];
	m.freeSight = false;
	m.sightFollows = m.playerIndex;
	m.status = 'ready';
	// fill the space.
	if(m.$.length<m.w){
		var i = m.$.length;
		while(i<m.w){
			m.$[i] = [];
			i++;
		}
	}
	var i=0;
	while(i<m.$.length){
		if(m.$[i].length<m.h){
			var j=m.$[i].length;
			while(j<m.h){
				m.$[i][j] = [0]
				j++;
			}
		}
		i++
	}//filled
	m._ = [];
	var i=0;
	while(i<m.$.length){
		m._[i] = [];
		var j = 0;
		while(j<m.$[i].length){
			m._[i][j] = false; //false:hasn't calc & hasn't apply | 0:applyed but hasn't get result |Array:calc*ed
			j++;
		}
		i++
	}
	worker.postMessage('setMap--'+JSON.stringify(m.$)) //tell worker the map
}
var start = ()=>{
	//start running
	//handle the canvas
	[Es.a.width,Es.a.height] = [...crimpt.reso];
	Es.a.style.background = crimpt.M.background;
	crimpt.c = Es.a.c;
	if(crimpt.I_inr)clearInterval(crimpt.I_inr);
	if(crimpt.I_draw)clearInterval(crimpt.I_draw);
	crimpt.I_inr = setInterval(inr,0);
	crimpt.I_draw = setInterval(draw,1E3/crimpt.draw_FPS);
	crimpt.M.status='running';
}

var cons = {
	$ : false,
	line : 3, //line amount
	maxLine : 16, //max amount of lines
	history : [''],
	index : 0,
	maxHis : 2000,
	mainObj : crimpt,
	open : function(){
		Es.a.style.filter = 'blur(1.6vmin)';
		Es.conspage.style.display = 'block';
		Es.conspage.style.filter = 'blur(0)';
		Es.conspage.style.background = 'rgba(0,0,0,0.4)';
		this.$ = true;
		Es.inpute.focus();
		crimpt.M.paused = true;
	},
	close : function(){
		Es.a.style.filter = 'none';
		Es.conspage.style.filter = 'blur(1.6vmin)';
		Es.conspage.style.background = 'rgba(0,0,0,0)';
		setTimeout(()=>{
			Es.conspage.style.display = 'none';
		}, 100);
		this.$ = false;
		crimpt.M.paused = false;
	},
	run : function(){
		Es.cons.innerHTML += `<dv>${Es.inpute.value}</dv>`;
		var arg = Es.inpute.value.slice(1);
		this.index = this.history.length;
		this.history[this.index-1] = arg;
		this.history.push('')
		while(JSON.stringify(this.history).length>this.maxHis){
			this.history.shift()
		};
		Es.inpute.value='>';
		arg = arg.split(/\s/)
		this._f = arg[0];
		arg.shift();
		if(this._f.toLowerCase() in this.func){
			try{
				this.func[this._f.toLowerCase()](...arg)
			}catch(ERROR){
				this.log('[ERROR]'+ERROR.message)
			}
		}else{
			var va = this._f.split('.'),i=1,vari;
			vari = crimpt[va[0]];
			try{
				while(i<va.length){
					vari = vari[va[i]];
					i++;
				}
				if(vari===undefined)absolutelynosuchvariableasabsolutelynosuchvariableasabsolutelynosuchvariableas
				cons.log(vari)
			}catch(ERROR){
				if(this._f!=='') this.log(`[错误]并没有 ${this._f} 这个指令或变量哦\n [ERROR]No such command or variable as ${this._f}`);
			}
		}
		if(Es.cons.children.length>this.maxLine){
			///delete the previous lines
		}
	},
	log : function(...txt){
		Es.cons.innerHTML += `<dv>\`${txt}</dv>`;
	},
	func : {
		cls : ()=>{
			Es.cons.innerHTML=''
		},
		reload : (va)=>{
			location.reload(va);
		},
		version : ()=>{
			cons.log(`crimpt v1.0.07\n Aut\hor:LYL\n E-mail: leawind@yeah.net\n Copyright © 2020 LEAWIND No rights reserved`)
		},
		"版本" : function(){this.version()},
		setblock : (x,y,txt)=>{
				crimpt.M.$[x][y] = JSON.parse(txt);
		},
		wow : ()=>{
			cons.log(`Don't be surprised.`)
		},
		setobj : (va)=>{
			va = va.split('.');
			var i=0,vari = window;
			while(i<va.length-1){
				vari = vari[va[i]];
				i++;
			};
			cons.mainObj = vari;
		},
		cd : ()=>{
			cons.log(JSON.stringify(crimpt))
		},
		"_<" : ()=>{
			cons.log(`Happy mode: ON`)
			setTimeout(()=>{
				cons.log(`(〃'▽'〃)`)
			}, 1500);
		},
		set : (va,value,typ='str')=>{
			if(va===undefined){
				cons.log(`set函数是需要参数的 大兄弟！\n This command needs parameters Bro!\n set(variable, value)`);return
			}
			typ = typ.toLowerCase();
			value = 
				typ==='num'? value*1:
				typ==='obj'? JSON.parse(value):
				typ==='boo'? !!value:
				typ==='str'? value+'': value;
			va = va.split('.');
			var i=0;
			var vari = cons.mainObj;
			while(i<va.length-1){
				vari = vari[va[i]];
				i++;
			}
			vari[va[i]] = value;
		},
		do : (va,...arg)=>{
			va = va.split('.');
			var i=0;
			var vari = cons.mainObj;
			while(i<va.length-1){
				vari = vari[va[i]];
				i++;
			}
			if(va.length===1){
				vari[va[0]](...arg)
			}else vari[va[i]](...arg);
		},
		help : ()=>{
			cons.log(`You don't need help`)
		},
		exit : ()=>{
			cons.log(`为什么不试试 Alt + F4 或者 Ctrl + W 呢`)
		},
		realhelp : ()=>{
			cons.log(`
The One True Help:
CLS  clear the screen
`)
		},
	}
}
////-----Events-----\\\\
onkeydown = ()=>{
	console.log(event.keyCode)
	switch(event.keyCode){
	 case 16: //shift
		var i = crimpt.M.unit[crimpt.M.playerIndex]
		i.running = !i.running;
		break;
		///--cons--\\\
	 case 192: //`~
		if(!cons.$){
			cons.open();
			return;
		}else{
			cons.close();
		}
		break;
	 case 13: //Enter
		if(cons.$){
			cons.run()
			return;
		}
		return false
		break;
	 case 9: //Tab
		return false;
	 case 38: //up
		if(cons.$ && cons.index > 0){
			cons.index --;
			Es.inpute.value = '>'+ cons.history[cons.index];
		}
		return false;
	 case 40: //down
		if(cons.$ && cons.index < cons.history.length-1){
			cons.index ++;
			Es.inpute.value = '>'+ cons.history[cons.index];
		}
		return false;
	}
	if(!cons.$)crimpt.playerKey[event.keyCode] = 1;
}
onkeyup = ()=>{
	crimpt.playerKey[event.keyCode] = 0;
}
onmousemove = ()=>{
	var 
		pX = event.screenX/screen.width,
		pY = event.screenY/screen.height;
	crimpt.M.cursor =[pX,pY]
	//crimpt.M.unit[crimpt.M.playerIndex].d = -Math.atan(pY/pX) +3.1415926//+ (pX>0? 0 : 3.141592653589793238);
}
Es.inpute.oninput = function(){
	this.value = this.value.replace('`','')
	if(this.value[0]!=='>')this.value='>'+this.value;
}
oncontextmenu=()=>{return false};//no context menu when click the right mouse button


//--------------------just for now (test)--------------------\\
readMap(maps[0])
start()
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                