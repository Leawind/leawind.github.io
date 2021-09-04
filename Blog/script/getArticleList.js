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
	}
})()

function showArticle(ele){
	// console.log(ele);
	let tr = new TextReader(ele.getAttribute("src"), (tr)=>{
		let articleBody = document.getElementById("article-body");
		// console.log(tr);
		// console.log(tr.content);
		let t = tr.content;
		let converter = new showdown.Converter();
		t = converter.makeHtml(t)
		articleBody.innerHTML = t;
	});

}