var Dataset = {
	
	//网站
	Sites: [
		// 格式: "[名称]地址"
		{
			"Translate": [
				"[Google Translate](translate)https://translate.google.com",
				"[Baidu Translate](translate)https://translate.baidu.com"
			]
		},
		{
			"MC": [
				"[Minecraft](MC)https://www.minecraft.net/en-us/",
				"[MC Wiki](MC)https://minecraft.fandom.com/wiki/Minecraft",
				"[MC Wiki bilibili](MC)https://wiki.biligame.com/mc/Minecraft_Wiki",
				"[网易我的世界](MC)https://mc.163.com/",
			]
		},
		{
			"Search": [
				"[Google](SearchEngine)https://www.google.com",
				"[Bing](SearchEngine)https://www.bing.com",
				"[百度](SearchEngine)https://www.baidu.com"
			]
		},
		{
			"Bicycle": [
				"[Shimano](Bike)https://bike.shimano.com/en-US/home.html",
				"[Giant-ZH](Bike)https://giant.com.cn/",
				"[Giant-US](Bike)https://www.giant-bicycles.com/us",
				"[Merida](Bike)https://www.merida-bikes.com/en",
				"[Merada-ZH](Bike)http://www.merida.cn/",
				"[Specialized](Bike)https://specialized.com.cn/?lang=zh",
				"[Santa Cruz](Bike|MTB)https://www.santacruzbicycles.com/en-US"
			]
		},
		"[leawind.github.io]https://leawind.github.io",
		"[Google Earth](Map)https://earth.google.com/web",
		"[行者](Sports)https://imxingzhe.com/",
		"[index.baidu](data)https://index.baidu.com/",
		"[Python Package](Python)http://pypi.doubanio.com/simple/",
		"[Python](IT|Python)https://www.python.org/downloads/",
		"[Java](IT|Java)https://www.oracle.com/java/technologies/oracle-java-archive-downloads.html",
		"[Github](IT)https://github.com/",
		"[B站]bilibili.com/",
		"[知乎]https://www.zhihu.com/",
		"[FaceBook](B)https://www.facebook.com/",
		"[youtube](B)https://www.youtube.com/",
		"[Twitter](B)https://twitter.com/?lang=en",
		"[Instagram](B)https://www.instagram.com/"
	],

	// 地图
	// 因为 可以直接在http头里放坐标参数，所以单独拿出来
	Maps: [
		{
			name: "百度地图",
			url: "https://map.baidu.com/@12917488.502162639,3315495.348015713,21z"
		},
		{
			name: "Google Earth",
			// 经度,纬度,地面海拔高度a,摄像机高度d,35y,朝向h,视线与竖直方向夹角t,0r
			url: "https://earth.google.com/web/@28.68646709,116.02688068,22.3486148a,147.83625471d,35y,0h,0t,0r",
		},
		{
			name: "Google Maps",
			url: "https://www.google.com/maps/@28.6864721,116.0268739,16z/",
		}
	],

	// 搜索引擎
	searchEngine: [
		// url中的{$}表示关键词位置
		{
			name: "MC Wiki",
			url: "https://minecraft.fandom.com/wiki/Special:Search?search={$}&fulltext=Search"
		},
		{
			name: "index.baidu.com",
			url: "https://index.baidu.com/v2/main/index.html#/trend/linux?words={$}"
		},
		{
			name: "Google",
			url: "https://www.google.com/search?q={$}&sourceid=chrome&ie=UTF-8"
		},
		{
			name: "Bing",
			url: "https://www.bing.com/search?q={$}"
		},
		{
			name: "Baidu",
			url: "https://www.baidu.com/s?wd={$}"
		},
		{
			name: "WikiPedia",
			url: "https://zh.wikipedia.org/w/index.php?search={$}"
		},
		{
			name: "Youtube",
			url: "https://www.youtube.com/results?search_query={$}"
		},
		{
			name: "BiliBili",
			url: "https://search.bilibili.com/all?keyword={$}"
		},
		{
			name: "知乎",
			url: "https://www.zhihu.com/search?type=content&q={$}"
		}
	]
}