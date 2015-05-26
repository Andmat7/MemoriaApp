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
	//console.log('showSelectionRectstomarks');
	var iframe = $("iframe")[0];
	var iframePos = getPosition(iframe);
	var iframeX = -20;;
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
	element.appendChild(wholeSelRectEl_g);
	
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

function save_bookmark_epub () {
	var bookmarks_epub = JSON.parse(localStorage.getItem('bookmarks_epub'));
	bookmarks_epub=bookmarks_epub||{};
	if ($('#bookmark_epub').css("color")=="rgb(252, 33, 81)") {
		$('#bookmark_epub').css("color","rgb(245, 222, 179)");
		if (typeof bookmarks_epub[epubId_g] != 'undefined'){
			delete bookmarks_epub[epubId_g];	
		}
		


	}else{
		$('#bookmark_epub').css("color","#fc2151");
		var CFI=Book_g.getCurrentLocationCfi();

		var percentaje=Book_g.renderer.currentRenderedPage()/Book_g.renderer.pagesInCurrentChapter();
		bookmarks_epub[epubId_g]={chapter:Book_g.currentChapter.id,percentaje:percentaje,CFI:CFI};

	}
	
	localStorage.setItem('bookmarks_epub', JSON.stringify(bookmarks_epub));
}
 function goto_bookmark_epub () {
 	var bookmarks_epub = JSON.parse(localStorage.getItem('bookmarks_epub'));
 	bookmarks_epub=bookmarks_epub||{};

	if (typeof bookmarks_epub[epubId_g] != 'undefined'){

		var totalpages=Book_g.renderer.pagesInCurrentChapter();
		var current_page=parseInt(bookmarks_epub[epubId_g].percentaje*totalpages);
		Book_g.renderer.page(current_page);
		Book_g.goto(bookmarks_epub[epubId_g].CFI).then(
			function  () {
					var totalpages=Book_g.renderer.pagesInCurrentChapter();
					var current_page=parseInt(bookmarks_epub[epubId_g].percentaje*totalpages);
					Book_g.renderer.page(current_page);
					setTimeout(

						function  () {
							var iframe = $("iframe")[0];
							var cssLink = document.createElement("link");
							cssLink.href = cordova.file.applicationDirectory+"www/styles/epub_image.css"; 
							cssLink.rel = "stylesheet"; 
							cssLink.type = "text/css";
							iframe.contentDocument.body.appendChild(cssLink);
							modalEpub.hide();
							Popoverbook.hide();	
							


						}
					, 500)
			}
		
		);
			
	}else{
		ons.notification.alert({
			title       : 'Mensaje',
			message     : 'Aun no hay ningún bookmark',
			buttonLabel : 'Aceptar',
		});
		Popoverbook.hide();
	}

 }

function pageChanged(cfi){
	var current_cfi=EPUBJS.EpubCFI.prototype.parse(cfi)

	$('#bookmark_epub').css("color","rgb(245, 222, 179)");
	var bookmarks_epub = JSON.parse(localStorage.getItem('bookmarks_epub'));
	var bookmarks_epub=bookmarks_epub||{};
	if (typeof Book_g.currentChapter != 'undefined') {
		 save_last_page (epubId_g,Book_g.currentChapter.id,cfi) 

	};
	if (typeof bookmarks_epub[epubId_g] != 'undefined'&& typeof Book_g.currentChapter != 'undefined'){
		
		var chapter=bookmarks_epub[epubId_g].chapter;

		
		var current_chapter=current_cfi.spineId;

		
		if (current_chapter==chapter) {
			
			var current_page=Book_g.renderer.currentRenderedPage()
			console.log("current_page");
			console.log(current_page);
			var totalpages=Book_g.renderer.pagesInCurrentChapter();
			if (current_page==parseInt(bookmarks_epub[epubId_g].percentaje*totalpages)) {

				$('#bookmark_epub').css("color","#fc2151");
			};
			 

		};

	}

}

function save_last_page (epubid,chapter,cfi) {
	var epubs_lastpage = JSON.parse(localStorage.getItem('epubs_lastpage'));
	epubs_lastpage=epubs_lastpage||{};
	var percentaje=Book_g.renderer.currentRenderedPage()/Book_g.renderer.pagesInCurrentChapter();
	epubs_lastpage[epubid]={chapter:chapter,percentaje:percentaje,CFI:cfi};

	localStorage.setItem('epubs_lastpage', JSON.stringify(epubs_lastpage));

}
function load_last_visited_page () {


	var epubs_lastpage = JSON.parse(localStorage.getItem('epubs_lastpage'));
	epubs_lastpage=epubs_lastpage||{};
	var cfi_del_fragmento;
	var percentaje;
	
	if (load_fragmento_g) {
		load_fragmento_g=false; 
		cfi_del_fragmento=cfi_fragmento_g;
	}else{
		if (typeof epubs_lastpage[epubId_g] != 'undefined') {
			cfi_del_fragmento=epubs_lastpage[epubId_g].CFI;
			percentaje=epubs_lastpage[epubId_g].percentaje;

		};
	
	}
	if (typeof epubs_lastpage[epubId_g] != 'undefined') {
		
		Book_g.goto(cfi_del_fragmento).then(
			function  () {
				var totalpages=Book_g.renderer.pagesInCurrentChapter();
				var current_page=parseInt(percentaje*totalpages);
				Book_g.renderer.page(current_page);
				setTimeout(
					function () {
						var iframe = $("iframe")[0];
						var cssLink = document.createElement("link");
						cssLink.href = cordova.file.applicationDirectory+"www/styles/epub_image.css"; 
						cssLink.rel = "stylesheet"; 
						cssLink.type = "text/css";
						iframe.contentDocument.body.appendChild(cssLink);
						modalEpub.hide();				
					}
				, 500)
			}

			);	
	}else{

				var iframe = $("iframe")[0];
				var cssLink = document.createElement("link");
				cssLink.href = cordova.file.applicationDirectory+"www/styles/epub_image.css"; 
				cssLink.rel = "stylesheet"; 
				cssLink.type = "text/css";
				iframe.contentDocument.body.appendChild(cssLink);
				modalEpub.hide();

	}
	//resolve(1);
}

function load_epub_bookmark (element, cfi) {
	var titulo = element.getAttribute("title");
	var percentaje =element.getAttribute("percentaje");
	ons.notification.confirm({
		title: 'Mensaje',
		message: '¿Desea ir a este libro: '+titulo,
		buttonLabels: ['Si', 'No'],
		callback: function(idx) {
			switch(idx) {
				case 0://si

					load_fragmento_g=true;
					cfi_fragmento_g=cfi,
					percentaje_fragmento_g=percentaje;
					viewBook_f(element);
					break;
				case 1://no
					break;
			}
		}
	});
}
// Book_g.goto("epubcfi(/6/6[Contenido.xhtml]");


