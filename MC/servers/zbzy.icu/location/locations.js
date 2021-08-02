
var locations = [
	/*
	{
		dim: 0,	//维度: 0主世界 1下界 2末地
		name: "示例",
		pos: [x, y, z]	// y 可省略
		type: "tag"	// 类型
	},
	*/
	{
		dim: 0,
		type: "area",
		name: "主城",
		pos: [300, 120],
	},
	{
		dim: 0,
		type: "player_home",
		name: "LEAWIND 家",
		pos: [3122, -501]
	},
	{
		dim: 0,
		type: "player_home",
		name: "Black_Mai 家",
		pos: [2200, -283]
	},
	{
		dim: 0,
		type: "player_home",
		name: "cosine 家",
		pos: [130, 119]
	},
	{
		dim: 0,
		type: "building",
		name: "pvp 场地",
		pos: [162, 209]
	},
	{
		dim: 0,
		type: "spawner",
		name: "蜘蛛刷怪笼",
		pos: [3290, 21, -458]
	},
	{
		dim: 0,
		type: "spawner",
		name: "僵尸刷怪笼",
		pos: [3367, 12, -657]
	},
	{
		dim: 0,
		type: "spawner",
		name: "小白刷怪笼",
		pos: [3290, 14, -255]
	},
	{
		dim: 0,
		type: "villige",
		name: "村庄_针叶林",
		pos: [3616, -884]
	},
	{
		dim: 0,
		type: "villige",
		name: "村庄_沙漠",
		pos: [3844, -283]
	},
	{
		dim: 0,
		type: "villige",
		name: "村庄_沙滩",
		pos: [4986, 67, 1117]
	},
	{
		dim: 0,
		type: "villige",
		name: "村庄_针叶林",
		pos: [6824, 71, 2683]
	},
	{
		dim: 0,
		type: "villige",
		name: "村庄_针叶林",
		pos: [2620, -5297]
	},
	{
		dim: 0,
		type: "villige",
		name: "村庄_针叶林",
		pos: [3616, -884]
	},
	{
		dim: 0,
		type: "biome",
		name: "粘土山",
		pos: [5908, 93],
		inf: `地狱坐标: [739 -529]`
	},
	{
		dim: 1,
		type: "spawner",
		name: "烈焰人刷怪笼",
		pos: [-897, 128, -210]
	},
	{
		dim: 0,
		type: "nether_portal", // 下界传送门
		name: "通往基岩上层",
		pos: [3196, 102, -604]
	},
	{
		dim: 2,
		type: "struct",
		name: "末地城1",
		pos: [1932, 60, 11007]
	},
	{
		dim: 2,
		type: "struct",
		name: "末地城2",
		pos: [1678, 59, 1891]
	},
	{
		dim: 2,
		type: "struct",
		name: "末地城3",
		pos: [1310, 61, 420]
	},
	{
		dim: 1,
		type: "biome",
		name: "灵魂沙峡谷",
		pos: [-600, 200]
	},
	{
		dim: 0,
		type: "struct",
		name: "海底神殿",
		pos: [1150, 1150]
	},
	{
		dim: 0,
		type: "struct",
		name: "海底神殿",
		pos: [1700, 1150]
	},
	{
		dim: 1,
		type: "nether_portal",
		name: "家附近",
		pos: [392, 130 ,-82]
	},
	{
		dim: 1,
		type: "nether_portal",
		name: "通往主城",
		pos: [38, 130, 15]
	},
	{
		dim: 1,
		type: "nether_portal",
		name: "通往末地传送门",
		pos: [-222, 130, 210]
	},
	{
		dim: 0,
		type: "biome",
		name: "蘑菇岛",
		pos: [-339, 1875]
	},
	{
		dim: 0,
		type: "struct",
		name: "林地府邸(已渡劫)",
		pos: [13373, 78, 12996]
	}
	
]