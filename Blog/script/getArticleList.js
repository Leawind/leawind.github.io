window.ArticleList = [];
window.ArticleList.done = false;

function loadArticles(t){
	let listBox = document.getElementById("article-list");
	let inner = '';
	for(let i=0;i<t.length;i++){
		let path = t[i];
		let fileName = path.replace(/(.*\/)|(\.((md)|(html?))\.txt)/g, '');
		inner += `<div class="article-item" src="${path}" onclick="showArticle(this);">${fileName}</div>`;
	}
	listBox.innerHTML = inner;
}

(function(){
	let ele = document.getElementById("iframe-mdlist");
	ele.onload = function(){
		ArticleList.done = true;
		t = ele.contentWindow.document.body.innerText.replace(/\n+/g, '\n').replace(/(^\s*)|(\s*$)/g, '');
		t = t.split('\n');
		ArticleList = t;
		window.loadArticles(t);
		// this.remove();
	}
})()

function showArticle(ele){
	// console.log(ele);
	let tr = new TextReader(ele.getAttribute("src"), (tr)=>{
		let articleBody = document.getElementById("article-body");
		// console.log(tr);
		// console.log(tr.content);
		let t = tr.content;
		if(1){
			let converter = new showdown.Converter({tables:true,});
			t = converter.makeHtml(t)
		}else{
			let mdl = new MDL();
			t = mdl.convert(t);
		}
		articleBody.innerHTML = `<div class="markdown">${t}</div>`;
	});

}