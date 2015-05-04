function put_marks (rangeSerialize) {
	var iframe = $("iframe")[0];
	var rangestore=rangy.deserializeRange(rangeSerialize,null,iframe.contentWindow.document )
 	var selRects = rangestore.nativeRange.getClientRects()
	
	showSelectionRectstomarks(selRects, iframe.contentWindow.document.body);
}





function showSelectionRectstomarks(selRects, element){
	console.log('showSelectionRectstomarks')
	var iframe = $("iframe")[0];
	var iframePos = getPosition(iframe);
	console.log(iframePos);
	var iframeX = 0;
	var iframeY = 0;
	var i = 0;
	var rect;

	var wholeSelRectEl_g = document.createElement("div");
	wholeSelRectEl_g.id = "wholeselection2";
	for ( i = 0; i< selRects.length; i++){
		rect = document.createElement("div");
		rect.className = "wholeSelection2";
		rect.style.left = selRects[i].left+iframeX + "px";
		rect.style.top =  selRects[i].top+iframeY + "px";
		rect.style.width = selRects[i].width + "px";
		rect.style.height = selRects[i].height + "px";
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

// Book_g.goto("epubcfi(/6/6[Contenido.xhtml]");

// put_marks("0/3/3:0,0/3/3:9");
// put_marks("0/37/3:27,0/43/3:74");
// put_marks("0/57/3:36,0/57/3:166");
//renderer:chapterDisplayed
