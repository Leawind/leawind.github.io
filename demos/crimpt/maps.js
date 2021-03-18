//maps
var maps=[
	{
		paused : false,
		w : 16*4, //width
		h : 9*4, //height
		status : 'base', // base|ready|running
		background : '#000022',
		floorColor : '#222',
		wallColor : '#360',
		collideK: -0.5,
		$ : [ //map's each block
			[[1],[0],[0],[0],[0],[1],[0],[0],[0],],
			[[0],[0],[0],[0],[0],[0],[0],[0],[0],],
			[[1],[0],[0],[1],[0],[1],[1],[0],[0],],
			[[0],[0],[1],[1],[0],[0],[0],[1],[0],],
			[[0],[1],[0],[0],[1],[0],[0],[1],[0],],
			[[0],[1],[0],[0],[0],[0],[0],[1],[0],],
			[[0],[1],[0],[1],[0],[0],[0],[1],[0],],
			[[0],[0],[0],[0],[0],[1],[0],[0],[0],],
			[[0],[0],[0],[0],[1],[1],[0],[1],[0],],
			[[0],[1],[0],[0],[0],[0],[0],[1],[0],],
			[[0],[1],[0],[0],[0],[0],[0],[1],[0],],
			[[0],[1],[1],[1],[0],[1],[1],[1],[0],],
			[[0],[0],[0],[1],[0],[0],[0],[0],[0],],
			[[0],[0],[0],[1],[0],[0],[0],[1],[0],],
			[[0],[0],[0],[1],[0],[1],[0],[0],[0],],
			[[0],[0],[0],[0],[0],[1],[0],[1],[1],],
		], //[isWall,color('#'),]
		//[hasWall]
		lastChangeTimeOfSheet : 0,
		unit : [ //all the units (lives)
			{
				byPlayer : true,
				P : [7.5,4.5],
				d : 0,
				v : [0,0],
				vmax : 2,
				walkingSpeed : 2,
				running : false,
				absA : 20,
				a : [0,0],//directly controled by you
				mu : 10,//mu, f = mu m g
				col : '#59c',
				r : 0.32,
				//Health Point
				HP : 100,
				maxHP : 100, //
				HPk : 1/6, //health recover speed				free:1, //0:under controling
				aims : [], //only for AI, aims is a list that he wanna do
			},
			{
				byPlayer : false,
				P : [0.5,1.5],d : 0,v : [0,0],vmax : 2,walkingSpeed:2,running:1,
				absA : 20,a : [0,0],mu : 10,
				col : '#55c',r : 0.32,HP : 100,maxHP : 100,HPk : 1.3, free:1,
				aims : [
					{
						name : 'go',
						P : [24.5,17.2],
					}
				],
			},
		],
		bullet : [ //all the bullets, including bullet,rpg...
			{ //rpg
				type : 1, //(0:normal | 1:rpg)normal : doesn't takes time to move; rpg : has its speed
				P : [3.2,0.6], //position
				v : [20,0], //speed
				col : '#800', //fillStyle
				r : 0.1, //how big it is
				range : 3, //if range != false, it will explode
				power : 200, //damage
				stop : false, //
				target : false, //false|(unit)
			},
		],
		effect : [],//visual effects,including explode,blood
		minSightRange : 5	,
		zoomK : 1.5,
		playerIndex : 0, //the index of the player-unit in array unit
		sP : [0.5,1.5],//[-10,-10], //the center of sight-rect
		sK : 7, //sight-rect's moving speed
		cursor : [0.5,0.5,2,3], //
		//sightFollows : 0, //0|1|2|3|4|...
		//freeSight //
		//sV : [0,0] //the moving speed of sight-rect
		//Ts : [] //
		//_ : [] //auto route
	}
];