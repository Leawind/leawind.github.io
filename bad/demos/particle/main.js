'use strict'
//try{
var ptk = {
	w:640,
	h:360,
	G:[0.5,0.5],
	o:[],
	M:null,
	drawType:1,//0|1
	hunger:false,//是否不支持全屏
	rslt:2.5,
	alreadyStart:false,
	viewmode:'normal',//normal|thermal|state,正常，热成像，状态
	thermalViewRange:0,
	thermalViewRange0:0,//热成像的温度下限
	thermalViewRange1:2000,//热成像的温度上限
	interval_inr:20,//inr() interval
	interval_sinr:1E3/25,//inr() interval
	envirTemp:302,
	rate:{//各类型在每一帧中被跳过检测的概率(除了最后一个)
		f:1,//固定
		s:0.5,//粉末固体
		l:0.3,//液体
		sl:0,//临时被变成液体的固体(与液体概率相同)概率为1-(1-sl)*(1-l)
		g:0.7,//气体
		temp:0.84,//计算温度
		envirT:0.006,//环境温度变化：每次计算温度时向环境温度靠近温度差的这么多倍
	},

	predo:function(){
		this.M=[];
		i=0;
		while(i<this.w){
			this.M[i]=[];
			j=0;
			while(j<this.h){
				this.M[i][j]=false;
				j++;
			}
			i++;
		}
	},
	deleted:0,//处理性能问题
	delete:function(n){
		if(n===null)return;
		if(typeof n==='number'){
			if(this.o[n]===null)return;
			this.M[this.o[n].x][this.o[n].y] = false;
			this.o[n] = null;
		}else{
			this.M[n.x][n.y] = false;
			this.o[n.id] = null;
		};
		this.deleted++;
	},
	//it looks like addO but in fact it's setO
	addO:function(type){
		let o = {
			type:'s',
			x:0,y:0,
			col:'#fff',
			m:1,//质量(密度)
			T:300,//温度
			lim_boil:9999,
			lim_melt:0,
			seq:0,
			_s:false,
			_g:false,
			_l:false,
		}
		if(typeof type==='object'){
			for(i in type){
				o[i] = type[i]
			}
		}else{
			alert(`The first argument should be an object!!!`)
		}
		if(Array.isArray(o.col)){
			if(o.col[1]){
				o.col = o.col[1+Math.floor((o.col.length-1)*Math.random())];
			}else{
				o.col=o.col[0]
			}
		}
		o.x=Math.floor(o.x);
		o.y=Math.floor(o.y);
		if(!this.M[o.x])//左右超界
			return;
		else if(o.y<0 || o.y>ptk.h-1)//上下超界
			return;
		if(this.M[o.x][o.y]){//该位置已经有其他粒子
			var o_p = this.M[o.x][o.y];
			if(o.type ==='eat'){
				ptk.delete(o_p);
			}
			if(o_p.seq<=o.seq){
				ptk.delete(o_p);
			}else{
				return;
			}
		}else{
			if(o.type==='eat')return;
		}
		this.M[o.x][o.y]=o;
		o.id=this.o.length;
		this.o.push(o)
	},
	setO:function(){

	},
	paused:true,
	paused1:true,
	T0:0,T1:0,ts:[0,0,0],T:0,FPSmin:40,timeScale:1,
}
var inr = function(){
	'use strick';
	var P=ptk,M=ptk.map;
	////*
	P.T1=new Date()*1;
	P.ts.unshift((P.T1-P.T0)/1E3)
	P.ts.pop();
	P.T = (P.ts[0]+P.ts[ 1]+P.ts[2])/3 *P.timeScale;
	P.T0 = P.T1;
	if(P.T>1/P.FPSmin)P.T-1/P.FPSmin;
	////*/
	
	if(Ucer.touching){
		var
		 x=Ucer.x,
		 y=Ucer.y;
		//ptk.addO(Ucer.creatObj());//mid
		Ucer.y--;
		ptk.addO(Ucer.creatObj());//U
		Ucer.x++;
		ptk.addO(Ucer.creatObj());//RU
		Ucer.y++;
		ptk.addO(Ucer.creatObj());//R
		Ucer.y++;
		ptk.addO(Ucer.creatObj());//RD
		Ucer.x--;
		ptk.addO(Ucer.creatObj());//D
		Ucer.x--;
		ptk.addO(Ucer.creatObj());//LD
		Ucer.y--;
		ptk.addO(Ucer.creatObj());//L
		Ucer.y--;
		ptk.addO(Ucer.creatObj());//LU
		Ucer.x=x;Ucer.y=y;
	}
	if(P.paused || P.paused1)return;
	//遍历所有粒子
	i=P.o.length;
	while(i-- >0){
		var o = P.o[i];
		if(!o)continue;
		var rx=o.x,ry=o.y,rT=o.T;
		o.T = Math.min(o.T,5000);//温度上限
		if(o.T < o.lim_melt){//物态变化
			if(o._s){
				let _s=o._s;
				P.delete(o);
				ut[_s].x = rx;
				ut[_s].y = ry;
				let ut_T = ut[_s].T;
				ut[_s].T = rT;
				P.addO(ut[_s]);
				ut[_s].T = ut_T;
				///continue;
			};
			//console.log(o.type,
		}else if(o.T > o.lim_boil){
			if(o._g){
				let _g=o._g;
				P.delete(o);
				ut[_g].x = rx;
				ut[_g].y = ry;
				let ut_T = ut[_g].T;
				ut[_g].T = rT;
				P.addO(ut[_g]);
				ut[_g].T = ut_T;
				///continue;
			}
			//console.log
		}else if(o._l){//lim_melt <= o.T <= o.lim_boil
			let _l=o._l
			P.delete(o);
			ut[_l].x = rx;
			ut[_l].y = ry;
			let ut_T = ut[_l].T;
			ut[_l].T = rT;
			P.addO(ut[_l])
			ut[_l].T = ut_T;
			///continue;
			//console.log
		}
		
		o = P.M[rx][ry];
		if(Math.random()>P.rate.temp){//热传递
			//环境散热
			o.T += (ptk.envirTemp-o.T)*ptk.rate.envirT;
			/*if(P.M[rx][ry-1]){//up
				var o_0 = P.M[rx][ry-1];
				o_0.T = (o_0.T+o.T)/2;
				o.T=o_0.T;
			}*/
			if(P.M[rx][ry+1]){//down
				var o_2 = P.M[rx][ry+1];
				o_2.T = (o_2.T+o.T)/2;
				o.T=o_2.T;
			}/*
			if(P.M[rx-1] && P.M[rx-1][ry]){//left
				var o_3 = P.M[rx-1][ry];
				o_3.T = (o_3.T+o.T)/2;
				o.T=o_3.T;
			}*/
			if(P.M[rx+1]&&P.M[rx+1][ry]){//right
				var o_1 = P.M[rx+1][ry];
				o_1.T = (o_1.T+o.T)/2;
				o.T=o_1.T;
			}
		}
		switch(o.type){
		 case 'f':if(Math.random()<P.rate.f)break;
			break;
		 case 'l':if(Math.random()<P.rate.l)break;
		 case 'sl':if(Math.random()<P.rate.sl)break;
			var o_2 = P.M[rx][ry+1]
			if(ry < P.h-1 && !o_2){
				//未达下边界且下方为空
				P.M[o.x][o.y] = false;
				o.y++;
				break;
			}else if(ry<P.h-1 && o_2.m<o.m && (o_2.type==='l' || o_2.type==='g' || o_2.type==='g')){
				//当下方有 密度更小的 粒子l 或 粒子g 时发生交换(或 s)
				o.y++;
				o_2.y--;
				P.M[o_2.x][o_2.y] = o_2;
				break;
			}
			var x=false;
			//要进行水平运动计算的条件：
			//碰到下边界|下面粒子密度更大或相等|下面粒子是 f 或 s
			if(o.y===P.h-1 || o_2.m>=o.m){
				x=true;
			}
			if(x){//水平运动
				var xl =0,xr = 0;//分别判断左右两方向是否可移动
				if(o.x!==0){
					var o_3 = P.M[rx-1][o.y]
					if(!(o_3.type==='f' || o_3.type==='s' ||o_3.m>=o.m)){
						//未达左边界 且(左边是f|s 或 左边密度不更小)不成立=>可向左移动
						xl = o_3?-1 :-2;
					}
				}
				if(o.x!==P.w-1){
					var o_1 = P.M[rx+1][o.y]
					if(!(o_1.type==='f' || o_1.type==='s' ||o_1.m>=o.m)){
						//未达右边界且 (右边是f或s 或 右边密度不更小)不成立=>可向右移动
						xr = o_1? 1 : 2;
					}
				}
				x = xl + xr;
				switch(x*x){
				 case 1:// 0,1|-1,0|-1,2|-2,1
					if(xl*xr===0){// 0,1|-1,0
						let 
							n = xl+xr,
							o_5 = P.M[o.x+n][o.y]
						o_5.x -= n;
						o.x += n;
						P.M[o_5.x][o_5.y] = o_5;
					}else{// -1,2|-2,1
						let n=xl+xr;
						P.M[o.x][o.y] = false;
						o.x += n;
					}
					break
				 case 0:// 0,0|-1,1|-2,2
					if(xl===0){// 0,0
						break;
					}else if(xl===-1){// -1,1
						var n = (Math.random()>0.5)*2-1;
						let o_5 = P.M[o.x+n][o.y];
						o_5.x -= n;
						o.x += n;
						P.M[o_5.x][o_5.y] = o_5;
					}else{// -2,2
						P.M[o.x][o.y] = false;
						o.x += 2*(Math.random()>0.5)-1;
					}
					break
				 case 4:// 0,2|-2,0
					P.M[o.x][o.y]=false
					o.x+=x/2
					break;
				}
			}
			if(o.type=='sl'){
				o.type='s'
			}
			break;
		 case 's':if(Math.random()<P.rate.s)break;
			//不下移的条件：下面是边界 或 下面的粒子是s|f
			if(ry < P.h-1){//没到下边界
				var o_2 = P.M[o.x][o.y+1];
				if(!o_2){//o_2= false --下移
					P.M[o.x][o.y] = false
					o.y++;
				}else if(o_2.type!=='f' && o_2.type!=='s'){//下方不是s或f或界, --交换
				/*when it is l,up to m*/
					if(o_2.type==='l' && o_2.m>o.m){
						break;/////
					}	
					o_2.y--;
					o.y++;
					P.M[o_2.x][o_2.y] = o_2;
				}else{//这个就复杂了...(o_2是 s|f)
					//可向右 移动或交换位置 的条件：
					// o_1,o_12 都属于 l|s|false
					var xl=0,xr=0;
					if(o.x!==0 && o.x!==P.w-1){//o_1,o_12,o_2,o_23,o_3都不是边界
						var 
						 o_1 = P.M[o.x+1][o.y],
						 o_12= P.M[o.x+1][o.y+1],
						 o_23= P.M[o.x-1][o.y+1],
						 o_3 = P.M[o.x-1][o.y];
						//根据上面判断 xl,xr的值
						if(o_23 && (o_23.type==='s'||o_23.type==='f') || (o_3 && (o_3.type==='s'||o_3.type==='s'))){//o_23 is s|f  OR  o_3 is s|f
							xl = 0;
						}else{//both o_23 and o_3 are avaliable
							o.type = 'sl';
						}
						if(o_12 && (o_12.type==='s'||o_12.type==='f') || (o_1 && (o_1.type==='s'||o_1.type==='s'))){//o_23 is s|f  OR  o_3 is s|f
							xr = 0;
						}else{//both o_23 and o_3 are avaliable
							o.type = 'sl';
						}
					}
				}
			}//else: do nothing
			break;	
		 case 'g':if(Math.random()<P.rate.g)break;
			var o_0 = P.M[rx][ry-1]
			if(ry > 0 && !o_0){
				//未达上边界且上方为空
				P.M[o.x][o.y] = false;
				o.y--;
				break;
			}else if(ry>0 && o_0.m<o.m && (o_0.type==='l'||o_0.type==='g')){
				//当上方有 密度更小的 粒子l 或 粒子g 时发生交换
				o.y--;
				o_0.y++;
				P.M[o_0.x][o_0.y] = o_0;
				break;
			}
			var x=false;
			//要进行水平运动计算的条件：
			//碰到上边界|上面面粒子密度更大或相等|上面面粒子是 f 或 s(不用考虑上面是 g 时)
			if(o.y===0 || o_0.m>=o.m || o_0.type==='s'){
				x=true;
			}
			if(x){//水平运动
				var xl =0,xr = 0;//分别判断左右两方向是否可移动
				if(o.x!==0){
					var o_3 = P.M[rx-1][o.y]
					if(!(o_3.type==='f' || o_3.type==='s' ||o_3.m>=o.m)){
						//未达左边界 且(左边是f|s 或 左边密度不更小)不成立=>可向左移动
						xl = o_3?-1 :-2;
					}
				}
				if(o.x!==P.w-1){
					var o_1 = P.M[rx+1][o.y]
					if(!(o_1.type==='f' || o_1.type==='s' ||o_1.m>=o.m)){
						//未达右边界且 (右边是f或s 或 右边密度不更小)不成立=>可向右移动
						xr = o_1? 1 : 2;
					}
				}
				x = xl + xr;
				switch(x*x){
				 case 1:// 0,1|-1,0|-1,2|-2,1
					if(xl*xr===0){// 0,1|-1,0
						let 
							n = xl+xr,
							o_5 = P.M[o.x+n][o.y]
						o_5.x -= n;
						o.x += n;
						P.M[o_5.x][o_5.y] = o_5;
					}else{// -1,2|-2,1
						let n=xl+xr;
						P.M[o.x][o.y] = false;
						o.x += n;
					}
					break
				 case 0:// 0,0|-1,1|-2,2
					if(xl===0){// 0,0
						break;
					}else if(xl===-1){// -1,1
						n = (Math.random()>0.5)*2-1;
						let o_5 = P.M[o.x+n][o.y];
						o_5.x -= n;
						o.x += n;
						P.M[o_5.x][o_5.y] = o_5;
					}else{// -2,2
						P.M[o.x][o.y] = false;
						o.x += 2*(Math.random()>0.5)-1;
					}
					break
				 case 4:// 0,2|-2,0
					P.M[o.x][o.y]=false
					o.x+=x/2
					break;
				}
			};
			break;
		}
		P.M[o.x][o.y] = o;
		Ucer.o_o('inr o',o);
	}
	Ucer.o_o('inr -1');
	return true;
};


screen.ldw=[0,0]
var sinr=function(){
	if(1/ptk.T<=ptk.FPSmin && Math.random()<0.6)return;
	//console.log(1/ptk.T)
	var P=ptk;
	if(ptk.hunger){
		//调整canvas的宽高
		screen.ldw.unshift(screen.height/screen.width);
		screen.ldw.pop();
		screen.erect=!!(screen.ldw[0]>1);
		if(screen.ldw[0] > ptk.h/ptk.w){
			cvs.style.width='100vw';
			cvs.style.height='auto';
			cvs.style.left=0;
			cvs.style.top =`calc(50vh - ${50*ptk.h/ptk.w}vw)`;
		}else{
			cvs.style.width='auto';
			cvs.style.height='100vh';
			cvs.style.left=`calc(50vw - ${50*ptk.w/ptk.h}vh)`;
			cvs.style.top=0;
		}
	}
	if(cvs.height!==ptk.h*P.rslt || cvs.width!==ptk.w*P.rslt){
		cvs.width =ptk.w*P.rslt;
		cvs.height=ptk.h*P.rslt;
	}
	//遍历所有粒子
	i=0;
	c.clearRect(0,0,2000,2000);switch(ptk.viewmode){
	 case 'normal':
		while(i<P.o.length){
			var o = P.o[i];
			if(!o){i++;continue}
			var rx=o.x,ry=o.y;
			c.fillStyle = o.col;
			if(P.drawType===0){
				c.fillRect(rx,ry,1,1);
			}else{
				c.fillRect(
					rx/P.w*cvs.width,
					ry/P.h*cvs.height,
					cvs.width/P.w,
					cvs.height/P.h
				)
			}
			c.fillStyle='#000';
			i++;
		};
		break;
	 case 'thermal':
		///P.thermalViewRange0=P.o[0].T;
		///P.thermalViewRange1=P.o[P.o.length-1].T;
		P.thermalViewRange = P.thermalViewRange1 - P.thermalViewRange0;
		while(i<P.o.length){
			var o = P.o[i];
			if(!o){i++;continue};
			var rx=o.x,ry=o.y;
			///P.thermalViewRange0 = Math.min(o.T,P.thermalViewRange0);
			///P.thermalViewRange1 = Math.max(o.T,P.thermalViewRange1);
			c.fillStyle = Df.T_c(o.T,P.thermalViewRange0,P.thermalViewRange1);
			//`rgb(${R},${G},${B})`;
			if(P.drawType===0){c.fillRect(rx,ry,1,1);
			}else{c.fillRect(rx/P.w*cvs.width,ry/P.h*cvs.height,cvs.width/P.w,cvs.height/P.h)}
			i++;
		};
		break;
	 case 'state':
		while(i<P.o.length){
			var o = P.o[i];
			if(!o){i++;continue};
			var rx=o.x,ry=o.y;
			c.fillStyle = o.type==='l'? '#33f':
					  o.type==='f'? '#666':
					  o.type==='g'? '#fff':
					  o.type==='s'? '#aa2':
					  o.type==='sl'?'#ff3':'#f00';
			if(P.drawType===0){c.fillRect(rx,ry,1,1);
			}else{c.fillRect(rx/P.w*cvs.width,ry/P.h*cvs.height,cvs.width/P.w,cvs.height/P.h)}
			i++;
		}
		break;
	}

	if(ptk.paused||ptk.paused1)return;
	Ucer.o_o('sinr -1');
	return true;
}


//}catch(err){alert("main.js\n"+err.message)}