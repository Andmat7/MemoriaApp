function put_marks (rangeSerialize,color) {
	var iframe = $("iframe")[0];
	var rangestore=rangy.deserializeRange(rangeSerialize,null,iframe.contentWindow.document )
 	var selRects = rangestore.nativeRange.getClientRects()
	
	showSelectionRectstomarks(selRects, iframe.contentWindow.document.body,color);
}


function save_bookmark (epubid,chapter,rangeSerialize,color) {
	var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
	bookmarks=bookmarks||{};
	bookmarks[epubid]=bookmarks[epubid]||{};
	bookmarks[epubid][chapter]=bookmarks[epubid][chapter]||{};
	bookmarks[epubid][chapter][rangeSerialize]={color:color};
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function load_rects_chapter (epubid,chapter) {
	console.log('load_rects_chapter');

	var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
	if (bookmarks) {
		if (typeof bookmarks[epubid] != 'undefined'){
			if (typeof bookmarks[epubid][chapter] != 'undefined'){
				var chaptermarks=bookmarks[epubid][chapter];
				var chapterPos= Book_g.renderer.chapterPos;
				Book_g.renderer.page(1);
				for (var rangeSerialize in chaptermarks) {
				   if (chaptermarks.hasOwnProperty(rangeSerialize)) {
				       var obj = chaptermarks[rangeSerialize];
				       put_marks(rangeSerialize,obj.color);
				    }
				}
				Book_g.renderer.page(chapterPos);
			}else{
				return false;
			}
		}else{
			return false;
		}

	}else{
		return false;
	}
}

function showSelectionRectstomarks(selRects, element,color){
	console.log('showSelectionRectstomarks');
	var iframe = $("iframe")[0];
	var iframePos = getPosition(iframe);
	console.log(iframePos);
	var iframeX = -10;
	var iframeY = 0;
	var i = 0;
	var rect;
	var wholeSelRectEl_g=iframe.contentWindow.document.getElementById("wholeselection2");
	if (!wholeSelRectEl_g) {
		wholeSelRectEl_g = document.createElement("div");
		wholeSelRectEl_g.zIndex = "-1000";
		wholeSelRectEl_g.id = "wholeselection2";

	};
	
	for ( i = 0; i< selRects.length; i++){
		rect = document.createElement("div");
		rect.className = "wholeSelection2 "+color;
		rect.style.left = selRects[i].left+iframeX + "px";
		rect.style.top =  selRects[i].top+iframeY + "px";
		rect.style.width = selRects[i].width + "px";
		rect.style.height = selRects[i].height + "px";
		rect.style.zIndex = "-1000";
		wholeSelRectEl_g.appendChild(rect);
	}
	var prueba=element.appendChild(wholeSelRectEl_g);
	console.log(prueba)
}

//cambia los posibles colores de la seleccion para 
//
function change_background (classcolor) {

	$(".wholeSelection").attr('class', 'wholeSelection '+classcolor);
	color_background=classcolor;
}
function paint_bookmarks(){
	var chapterPos=Book_g.renderer.chapterPos;
	//Book_g.renderer.page(1);
	var rangeSerialize=rangy.serializeRange(rangy_Andres,true);
	save_bookmark(epubId_g,Book_g.currentChapter.id,rangeSerialize,color_background);
	remove_bookmarks ();
	load_rects_chapter(epubId_g,Book_g.currentChapter.id );
	color_background="";
}
function remove_bookmarks () {
	var iframe = $("iframe")[0];
	var elem=iframe.contentWindow.document.getElementById("wholeselection2");
	if (elem) {
		elem.parentNode.removeChild(elem);	
	};
	
}


// Book_g.goto("epubcfi(/6/6[Contenido.xhtml]");


