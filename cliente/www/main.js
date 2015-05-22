var urlServer_g = "http://apportaalapaz.centrodememoriahistorica.gov.co/MemoriaApp/servidor/";
// var urlServer_g = "http://localhost/MemoriApp/servidor/";
var DBSize_g = 200000;//bytes
var wholeSelRectEl_g = null;
var startSelEl_g, endSelEl_g;
var workingDirEntry_g;
var sWorkingDir_g = ".MemoriAPP/";
var epubDirEntryPath_g;
var tempDirEntry_g;
var event_global ;
var range_g;
var startSelect_g = 0;
var selectionString_g;
var Book_g;
var firstRun_g = true;
var bookTitle_g = "";
var bookURL_g = "";
var downloadEpubUrl_g = "";
var epubId_g = 0;
var alertDebug = 0;
var handleMoving_g = 0;
var color_background="";
var bookElement_g;
var bookFavoritesElement_g;
var coleccion_g = 1;
var library_g = false;
var favorites_g = false;
var searchString_g = "";
var lastPage_g = 0;
var currentChapter_id="";

//constantes para saber desde que pagina se abre el epub
var PAGE_COLLECCION = 1;
var PAGE_LIBRARY    = 2;
var PAGE_FAVORITES  = 3;

function backButtonHandler_f(  ){
// 	event.preventDefault();
// 	event.stopPropagation();
	switch( lastPage_g ){
		case PAGE_COLLECCION:
			viewColeccion_f(coleccion_g);
			break;
		case PAGE_LIBRARY:
			viewLibrary();
			break;
		case PAGE_FAVORITES:
			viewFavorites();
			break;
		default:
			viewMain_f();
	}
	return false;
}

function getnumbers() {
	var oLibros = JSON.parse( window.localStorage.getItem("libros") );
	$("#number_library").html(_.size(oLibros));
	var oLibros = JSON.parse( window.localStorage.getItem("favoritos") );
	$("#number_favorites").html(_.size(oLibros));
}
function resetPage_f(){
	document.removeEventListener("touchmove",preventDefaultScroll_f);
	if( typeof( sharePopover )   != "undefined" ) sharePopover.hide();
	if( typeof( meaningPopover ) != "undefined" ) meaningPopover.hide();
}
function viewMain_f(){
	viewColeccion_f( 1 ); 
}
function viewColeccion_f( coleccion ){
// 	getnumbers();
	lastPage_g = PAGE_COLLECCION;
	coleccion_g = coleccion;
	menu.setMainPage('main.html', {closeMenu: true});
	resetPage_f();
}
function viewLibrary(){
	lastPage_g = PAGE_LIBRARY;
	getnumbers();
	library_g = true;
	menu.setMainPage('main.html', {closeMenu: true});
	resetPage_f();
}
function viewFavorites(){
	lastPage_g = PAGE_FAVORITES;
	getnumbers();
	favorites_g = true;
	menu.setMainPage('main.html', {closeMenu: true});
	resetPage_f();
}
function viewabout_f(){
	menu.setMainPage('about.html', {closeMenu: true});
	resetPage_f();
}

function viewBook_f( element ){
	downloadEpubUrl_g      = urlServer_g + "uploads/epub/"  + element.getAttribute("epub");
	bookElement_g          = element;
	bookFavoritesElement_g = element;
	epubId_g               = element.getAttribute("epubId");
	bookTitle_g            = element.getAttribute("title");
	bookURL_g              = element.getAttribute("bookURL");
	menu.setMainPage('epub_viewer.html', {closeMenu: true, callback: starting});
	document.addEventListener("touchmove",preventDefaultScroll_f);
}

function viewBookmark_f(){
	menu.setMainPage('bookmark.html', {closeMenu: true, callback: function(){
		var db = window.openDatabase("memoriappDB", "1.0", "fragmentos", DBSize_g);
		db.transaction(listFragmentosDB_f, onError_f);
	}});
	resetPage_f();
}
/* This code prevents users from dragging the page (IOS fix) */
var preventDefaultScroll_f = function(event) {
	event.preventDefault();
	window.scroll(0,0);
	return false;
};
function starting(){
	rangy.init();
	carousel.on('overscroll',	function(event){
		if (handleMoving_g === 0 && startSelect_g === 0) {
			if (event.direction == "right"){
				nextPage();
			}
			if (event.direction == "left"){
				prevPage();
			}
		}
	});
	if (firstRun_g){ //evitar amarrar el mismo evento varias veces
		firstRun_g = false;
		// declaracion de handle de comienzo de seleccion
		startSelEl_g = document.createElement("img");
		startSelEl_g.id = "startSelection";
		startSelEl_g.src = "img/select_handle_left.png";
// 		startSelEl_g = document.createElement("div");
// 		startSelEl_g.id = "startSelection";
// 		startSelEl_g.innerHTML = "&nbsp;^&nbsp;";
		$(document).on('touch', '#startSelection', beginHandleMove);
		$(document).on('touchmove', '#startSelection', handleMove);
		$(document).on('release', '#startSelection', handleRelease);
		//declaracion de handle de final de seleccion
		endSelEl_g = document.createElement("img");
		endSelEl_g.id = "endSelection";
		endSelEl_g.src = "img/select_handle_right.png";
// 		endSelEl_g = document.createElement("div");
// 		endSelEl_g.id = "endSelection";
// 		endSelEl_g.innerHTML = "&nbsp;^&nbsp;";
		$(document).on('touch', '#endSelection', beginHandleMove);
		$(document).on('touchmove', '#endSelection', handleMove);
		$(document).on('release', '#endSelection', handleRelease);	
		//***************************************
		//** POPOVERs
		//***************************************
		//popover para redes sociales
		ons.createPopover('share-popover.html').then(function(){
			sharePopover.on("postshow", function(e){
				var pop = $('#share-popover')[0];
				var mask = pop.children[0];
				mask.style.zIndex = -1;
			});
		});
		ons.createPopover('meaning-popover.html').then(function(){
			meaningPopover.on("preshow", function(e){
				var pop  = $('#meaning-popover')[0];
				var mask = pop.children[0];
				mask.style.zIndex = -1;
			});
		});
		ons.createDialog( 'Dialog_copiado.html' );
		ons.createDialog( 'Dialog_descargando.html' );
			
		//***********  DESACTIVADO DEL SWIPE Y SELECCION *******************
		$(document).on('hold', '#area', function(e) {
			startSelect_g = 1;
			e.preventDefault();
			var xSelectStart = e.originalEvent.gesture.center.clientX;
			var ySelectStart = e.originalEvent.gesture.center.clientY;
			console.log("hold area");
			wordSelectionFromPoint(xSelectStart, ySelectStart);
		});
		$(document).on('release', '#area', function(e) {
			if ( startSelect_g === 0 ){
				if (color_background!="") {
					paint_bookmarks();
				};
				handleMoving_g = 0;
 				sharePopover.hide();
				meaningPopover.hide();
				
 				
				console.log('hide');
			}else{
				console.log('no hide');
			}
		});
		ons.orientation.on('change', function( e ){
			setTimeout(alignEPUBRotation_f, 1000);
		});
	}
	//verificar si el EPUB se ha bajado antes
	var oLibros = JSON.parse( window.localStorage.getItem( "libros" ) );
	if( oLibros !== null ){
		var oLibro = oLibros[ epubId_g ];
		if( oLibro !== undefined ){
			modalEpub.show();
			openEPUB_f( workingDirEntry_g.toURL() + "epub/" + oLibro.id + ".epub" );
		}else{
			downloadEPUB_f(epubId_g, downloadEpubUrl_g);
		}
	}else{
		downloadEPUB_f(epubId_g, downloadEpubUrl_g);
	}
	console.log("starting complete");
// 	openEPUB_f (cordova.file.applicationDirectory+"www/VIOLACIONES DE DDHH.epub");
}
//*******************************************
//** Descarga y lectura de EPUBs
//*******************************************
function alignEPUBRotation_f (){
	var isPortrait = ons.orientation.isPortrait();
	var iframe = $('iframe')[0];
	var area = $('#area')[0];
	if (isPortrait){
		if (document.body.clientWidth > document.body.clientHeight){
			iframe.style.width = document.body.clientHeight* 1.0 + "px";
			iframe.style.height = area.clientWidth*          1.0 + "px";
		}else{                                             
			iframe.style.width =  document.body.clientWidth* 1.0 + "px";
			iframe.style.height = area.clientHeight*         1.0 + "px";
		}
	}else{
		if (document.body.clientWidth > document.body.clientHeight){
			iframe.style.width = document.body.clientWidth*  1.0 + "px";
			iframe.style.height = area.clientHeight*         1.0 + "px";
		}else{                                             
			iframe.style.width = document.body.clientHeight* 1.0 + "px";
			iframe.style.height = area.clientWidth*          1.0 + "px";
		}
	}
	removeSelectionIndicators();
}

function downloadEPUB_f(id, URI){
	modalDownload.show();
	var ft = new FileTransfer();
	//   if (alertDebug == 1) alert ("begining download");
	ft.download(
		URI,
		workingDirEntry_g.toURL() + "epub/" + id + ".epub",
		function (entry) {//success download
			console.log("download complete: " + entry.fullPath);
			saveEPUBinStorage_f( id );
			modalEpub.show();
			modalDownload.hide();
			openEPUB_f (workingDirEntry_g.toURL() + "epub/" + id + ".epub");
		},
		function(error) {//error download
			// 		switch(error.code){
			// 		  default:
			console.log('Error downloading file ' + ': ' + error.code);
			console.log("download error source " + error.source);
			console.log("download error target " + error.target);
			console.log("download error code" + error.code);
			// 		}
			// 		  onError_f(error);
		},
		false,
		{ headers: {"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="} }
	);
}	

function openEPUB_f( epubFile ){
	var tempdir;
	if ( device.platform == "Android" ){
		tempdir = workingDirEntry_g.toURL() + "tempepub/" ;
	}else{
		tempdir = epubDirEntryPath_g + "tempepub/" ;
	}
	window.resolveLocalFileSystemURL(
		tempdir,
		function(dirEntry){
			dirEntry.removeRecursively(
				function(){//success remove
					unzip_f(epubFile, tempdir);
				},
				function(){//fail remove
					unzip_f(epubFile, tempdir);
				}
			);
		},
		function(){//fail resolveLocalFileSystemURL
			unzip_f(epubFile, tempdir);
		}
	);
}

function unzip_f(epubFile, destDir){
	zip.unzip(
		epubFile,
		destDir, 
		function ( ret ){//zip callback
			if (ret === 0){
				Book_g = ePub(
					destDir,
					{	style: 'img { width: 100px;}',	spreads: false	}
				);
				Book_g.renderTo('area').then(function (){
					var iframe = $("iframe")[0];
					var cssLink = document.createElement("link");
					cssLink.href = cordova.file.applicationDirectory+"www/styles/epub_image.css"; 
					cssLink.rel = "stylesheet"; 
					cssLink.type = "text/css";
					iframe.contentDocument.body.appendChild(cssLink);
					modalEpub.hide();
//*************************************
//*************************************
//* DESCOMENTAR
//*************************************
//*************************************					
					alignEPUBRotation_f();
				});
			}else{
				alert("Error al abrir el EPUB.");
			}
		},
		null //progress callback
	);
}
//***********************************************
//** Inicialización para manejo del sistema de archivos en phonegap
//**********************************************
$( document ).ready(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
});
function onDeviceReady() {
//	window.plugins.insomnia.keepAwake();
	
// 	var db = window.openDatabase("memoriappDB", "1.0", "citas", DBSize);
	
	//db.transaction(eraseAllPeliculasDB, onError_f);
	
	ons.disableDeviceBackButtonHandler();
	document.addEventListener("backbutton", backButtonHandler_f, false);
	yepnope({
    	test : window.device.platform === 'iOS' && parseFloat(window.device.version) === 7.0,
    	yep  : 'styles/ios7.css',         
  	});
	
	// back button
	// CREAR ESTRUCTURA DE DIRECTORIOS
	var epubDirEntry;
	if (device.platform == "Android"){
		epubDirEntry = cordova.file.externalRootDirectory;
		window.resolveLocalFileSystemURL(
			epubDirEntry,
			function(dirEntry){
				if (alertDebug == 1){
					alert(dirEntry.toURL());
				}
				dirEntry.getDirectory(
					"Android/",
					{create: true},
					function(dirEntry){
						if (alertDebug == 1){
							alert(dirEntry.toURL());	  
						}
						dirEntry.getDirectory(
							"data/",
							{create: true},
							function(dirEntry){
								if (alertDebug == 1){
									alert(dirEntry.toURL());
								}
								dirEntry.getDirectory(
									sWorkingDir_g,
									{create: true},
									function(dirEntry){
										if (alertDebug == 1){
											alert(dirEntry.toURL());
										}
										workingDirEntry_g = dirEntry;
										dirEntry.getDirectory(
											"epub/",
											{create: true},
											function(dirEntry){
												if (alertDebug == 1){
													alert(dirEntry.toURL());
												}
												epubDirEntryPath_g = dirEntry.toURL();
											},
											onError_f
										);
									},
									onError_f
								);
							},
							onError_f
						);
					},
					onError_f
				);
			},
			onError_f
		);
	}else{
// 		window.plugin.statusbarOverlay.hide();
		epubDirEntry = cordova.file.dataDirectory ;
		window.resolveLocalFileSystemURL(
			epubDirEntry, 
			function(dirEntry){
				dirEntry.getDirectory(
					sWorkingDir_g,
					{create: true},
					function(dirEntry){
						window.resolveLocalFileSystemURL(
							epubDirEntry+sWorkingDir_g, 
							function(dirEntry){
								if (alertDebug == 1) 
									alert(dirEntry.toURL());
								workingDirEntry_g = dirEntry;
								dirEntry.getDirectory(
									"epub/",
									{create: true},
									function(dirEntry){
										if (alertDebug == 1) 
											alert(dirEntry.toURL());
										epubDirEntryPath_g = cordova.file.documentsDirectory+"/";
									},
									onError_f
								);
							},
							onError_f);
					},
					onError_f
				);
			},
			onError_f
		);
// 		window.resolveLocalFileSystemURL(
// 			workingDirEntry_g.toURL() + "tempepub",
// 			function(dirEntry){
// 				dirEntry.removeRecursively;
// 				window.resolveLocalFileSystemURL(
// 					dirEntry.toURL(),
// 					function(dirEntry){
// 						zip.unzip(
// 							epubFile,
// 							workingDirEntry_g.toURL() + "tempepub", 
// 							function ( fail ){//zip callback
// 								if (!fail){
// 									Book_g = ePub(
// 										workingDirEntry_g.toURL() + "tempepub/",
// 																{	style: 'img { width: 100px;}',	spreads: false	}
// 									);
// 									Book_g.renderTo('area');
// 								}else{
// 									alert("Error al abrir el EPUB.");
// 								}
// 							},
// 							null //progress callback
// 						);
// 						tempDirEntry_g = dirEntry;
// 					},
// 					onError_f
// 				);
// 				
// 			},
// 			onError_f
// 		);
		//borrar y crear de nuevo el folder temporal
// 		window.resolveLocalFileSystemURL(
// 			cordova.file.tempDirectory,
// 			function(dirEntry){
// 				tempDirEntry_g.removeRecursively;
// 				window.resolveLocalFileSystemURL(
// 					cordova.file.tempDirectory,
// 					function(dirEntry){
// 						tempDirEntry_g = dirEntry;
// 					},
// 					onError_f
// 				);
// 				
// 			},
// 			onError_f
// 		);
	}
	console.log("onDeviceReady complete");
	
}

function onError_f(e){
	alert(e);
	console.log(e);
}

// ********************** 
// ** EPUB NAVIGATION 
// ***********************
function nextPage(){
	var ePage = document.getElementsByTagName("iframe")[0];
	var winWidth = $(window).width();
	TweenMax.fromTo(
		ePage, 
		0.3,
		{x: winWidth , force3D:true},
		{x: 0, force3D:true, onStart:function(){ epubNextPage(); } } 
	);
}
function prevPage(){
	var ePage = document.getElementsByTagName("iframe")[0];
	var winWidth = $(window).width();
	TweenMax.fromTo(
		ePage, 
		0.3, 
		{x: -winWidth , force3D:true}, 
		{x: 0 , force3D:true ,onStart:function(){ epubPrevPage(); } }
	);
	
}
function epubNextPage(){
	Book_g.nextPage().then(
		function (){
			var iframe = $('iframe')[0];
			var cssLink = document.createElement("link");
			cssLink.href = cordova.file.applicationDirectory+"www/styles/epub_image.css"; 
			cssLink.rel = "stylesheet"; 
			cssLink.type = "text/css"; 
			iframe.contentDocument.body.appendChild(cssLink);
			//detecta un capitulo nuevo y carga resaltados guardados
			if (currentChapter_id!==Book_g.currentChapter.id) {
			
				load_rects_chapter(epubId_g,Book_g.currentChapter.id );
				currentChapter_id=Book_g.currentChapter.id;
			};
			
		}
	);
}
function epubPrevPage(){
	Book_g.prevPage().then(
		function (){
			var iframe = $('iframe')[0];
			var cssLink = document.createElement("link");
			cssLink.href = cordova.file.applicationDirectory+"www/styles/epub_image.css"; 
			cssLink.rel = "stylesheet"; 
			cssLink.type = "text/css"; 
			iframe.contentDocument.body.appendChild(cssLink);
			//detecta un capitulo nuevo
			if (currentChapter_id!==Book_g.currentChapter.id) {

				load_rects_chapter(epubId_g,Book_g.currentChapter.id );
				currentChapter_id=Book_g.currentChapter.id;
			};
		}
	);
}

//********************************
//*********** RANGY *****************
//******************************
function wordSelectionFromPoint(startX, startY) {
	console.log('wordSelectionFromPoint');
	var iframe = document.getElementsByTagName('iframe')[0];
	var iframePos = getPosition(iframe);
	startX -= iframePos.x;
	startY -= iframePos.y;
	
	var doc = iframe.contentDocument || iframe.contentWindow.document;
	
	var text;
	var start, end;
	if (typeof doc.caretPositionFromPoint != "undefined") {
		start = doc.caretPositionFromPoint(startX, startY);
		end = doc.caretPositionFromPoint(startX, startY);
		range_g = doc.createRange();
		range_g.setStart(start.offsetNode, start.offset);
		range_g.setEnd(end.offsetNode, end.offset);
	} else if (typeof doc.caretRangeFromPoint != "undefined") {
		start = doc.caretRangeFromPoint(startX, startY);
		range_g = doc.createRange();
		range_g.setStart(start.startContainer, start.startOffset);
		range_g.setEnd(start.startContainer, start.startOffset);
	}
	// buscar inicio de palabra
	var i = 0;
	for (i = 0; i< 100 && range_g.startOffset >0; i++){
		text = range_g.toString();
		if (text.charAt(0) == " "){
			range_g.setStart(range_g.startContainer, range_g.startOffset +1 );
			break;
		}else{
			range_g.setStart(range_g.startContainer, range_g.startOffset -1 );
		}
	}
	// buscar final de palabra
	for (i = 0; i< 100; i++){
		text = range_g.toString();
		if (text.charAt(text.length -1) == " " ){
			range_g.setEnd(range_g.endContainer, range_g.endOffset -1 );
			break;
		}else if (range_g.endContainer.length  == range_g.endOffset ){
			range_g.setEnd(range_g.endContainer, range_g.endOffset );
			break;
		}else{
			range_g.setEnd(range_g.endContainer, range_g.endOffset +1 );
		}
	}
	// seleccionar el rango
	selectRange(startX,startY,0,0,iframe,doc);
	meaningPopover.show('.wholeSelection');
	
}
//coordenadas del elemento con respecto al documento (absolutas)
function getPosition(element) {
	var xPosition = 0;
	var yPosition = 0;
	
	while(element) {
		xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
		yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
		element = element.offsetParent;
	}
	return { x: xPosition, y: yPosition };
}

function removeSelectionIndicators() {
	console.log('removeSelectionIndicators');
	
	$(document).off('touch', '#area', removeSelectionIndicators);
	if (wholeSelRectEl_g !== null) {
		wholeSelRectEl_g.parentNode.removeChild(wholeSelRectEl_g);
		startSelEl_g.parentNode.removeChild(startSelEl_g);
		endSelEl_g.parentNode.removeChild(endSelEl_g);
		wholeSelRectEl_g = null;
		startSelect_g = 0;
	}

	console.log(startSelect_g);
}
//Mostrar todos los indicadores de la seleccion (sombreado y handles)
function showSelectionPosition() {
	console.log('showSelectionPosition');
	// carousel1 es el elemento del DOM que va contener los indicadores de seleccion
	var carousel1 = $("#carousel-1")[0];
	var iframe = $("iframe")[0];
	var iframePos = getPosition(iframe);
	var iframeX = iframe.parentNode.offsetLeft;
	var iframeY = iframe.parentNode.offsetTop;
	var selRects = rangy.getSelection(iframe).getRangeAt(0).nativeRange.getClientRects();
	
	rangy_Andres=rangy.getSelection(iframe).getRangeAt(0);
	//console.log(rangy.serializeRange(rangy_Andres,null,iframe));
	removeSelectionIndicators();
	
	showSelectionRects(selRects, carousel1);
	
	// Draw elements at the start and end of the selection
	//   var startPos = rangy.getSelection(iframe).getStartDocumentPos();
	var startPos = { 
		x : $(".wholeSelection")[0].offsetLeft,
		y : $(".wholeSelection")[0].offsetTop+ $(".wholeSelection")[0].offsetHeight,
	};
	carousel1.appendChild(startSelEl_g);
	startSelEl_g.style.left = startPos.x - ((startSelEl_g.offsetWidth*3)/4) + "px";
	//   startSelEl_g.style.left = startPos.x+iframeX - (startSelEl_g.offsetWidth/2) + "px";
	//   startSelEl_g.style.top = startPos.y+iframeY - startSelEl_g.offsetHeight + "px";
	startSelEl_g.style.top = startPos.y - 3 + "px";
	var endPos = rangy.getSelection(iframe).getEndDocumentPos();
	carousel1.appendChild(endSelEl_g);
	endSelEl_g.style.left = (endPos.x+iframeX ) - (endSelEl_g.offsetWidth/4) + "px";
	endSelEl_g.style.top = (endPos.y+iframeY ) - 3 + "px";
	
// 	sharePopover.show('.wholeSelection');
	$(document).on('touch', '#area', removeSelectionIndicators);
}
//Sombreado de texto seleccionado (solucion para problema IOS)
function showSelectionRects(selRects, element){
	console.log('showSelectionRects')
	var iframe = $("iframe")[0];
	var iframePos = getPosition(iframe);
	var iframeX = iframe.parentNode.offsetLeft;
	var iframeY = iframe.parentNode.offsetTop;
	var i = 0;
	var rect;
	wholeSelRectEl_g = document.createElement("div");
	wholeSelRectEl_g.id = "wholeselection";
	for ( i = 0; i< selRects.length; i++){
		rect = document.createElement("div");
		rect.className = "wholeSelection "+color_background;
		rect.style.left = selRects[i].left+iframeX + "px";
		rect.style.top =  selRects[i].top+iframeY + "px";
		rect.style.width = selRects[i].width + "px";
		rect.style.height = selRects[i].height + "px";
		wholeSelRectEl_g.appendChild(rect);
	}
	element.appendChild(wholeSelRectEl_g);
}

function beginHandleMove(e){

	handleMoving_g = 1;
}

function handleMove(e) { 
	event_global = e;   // solo para debug
	
	var iframePos;
	e.preventDefault();
	if (handleMoving_g == 1){
		var iframe = $("iframe")[0];
		iframePos = getPosition(iframe);
		if (e.target.id == "startSelection"){
			e.target.style.left = ( e.originalEvent.targetTouches[0].clientX - ((e.target.offsetWidth)/4))  + "px";
			e.target.style.top = ( e.originalEvent.targetTouches[0].clientY - (e.target.offsetHeight * 1.5)) + "px";
		}else{
			e.target.style.left = ( e.originalEvent.targetTouches[0].clientX - ((e.target.offsetWidth * 3)/4))  + "px";
			e.target.style.top = ( e.originalEvent.targetTouches[0].clientY - (e.target.offsetHeight * 1.5))  + "px";
		}
	}
	return false;

}

function handleRelease(e) { 

	var iframe = document.getElementsByTagName('iframe')[0];
	var endX = endSelEl_g.offsetLeft - iframe.offsetLeft + (endSelEl_g.offsetWidth/4);
	var endY = endSelEl_g.offsetTop - iframe.offsetTop -iframe.parentNode.offsetTop-2;
	var startX = startSelEl_g.offsetLeft - iframe.offsetLeft + ((startSelEl_g.offsetWidth*3)/4);
	var startY = startSelEl_g.offsetTop - iframe.offsetTop -iframe.parentNode.offsetTop -2;//   + (startSelEl_g.offsetHeight) ;
	
	//   endX -= iframe.offsetLeft;
	//   endY -= iframe.offsetTop;
	var doc = iframe.contentDocument || iframe.contentWindow.document;
	
	var start, end;
	if (typeof doc.caretPositionFromPoint != "undefined") {
		start = doc.caretPositionFromPoint(startX, startY);
		end = doc.caretPositionFromPoint(endX, endY);
		range_g.setStart(start.offsetNode, start.offset);
		range_g.setEnd(end.offsetNode, end.offset);
	} else if (typeof doc.caretRangeFromPoint != "undefined") {
		start = doc.caretRangeFromPoint(startX, startY);
		end = doc.caretRangeFromPoint(endX, endY);
		range_g.setStart(start.startContainer, start.startOffset);
		range_g.setEnd(end.startContainer, end.startOffset);
	}
	selectRange(startX,startY,endX,endY,iframe,doc);
	meaningPopover.hide();
	sharePopover.show('.wholeSelection');
}

function selectRange(startX,startY,endX,endY,iframe,doc){
	console.log('selectRange');
	var sel;
	if (range_g !== null && typeof iframe.contentWindow.getSelection != "undefined") {
		sel = iframe.contentWindow.getSelection();
		sel.removeAllRanges();
		sel.addRange(range_g);
		console.log('selectRangea');
		//     sel.removeAllRanges();
	}else if(typeof doc.body.createTextRange != "undefined") {
		var endRange = range_g.duplicate();
		sel = iframe.contentWindow.getSelection();
		range_g.moveToPoint(startX, startY);    
		endRange.moveToPoint(endX, endY);
		range_g.setEndPoint("EndToEnd", endRange);
		range_g.select();
		console.log('selectRangeb');
	}
	selectionString_g = iframe.contentWindow.getSelection().toString();
	console.log(selectionString_g);
	
	removeSelectionIndicators();
	showSelectionPosition();
	sel.removeAllRanges();
	//   selectionString_g = iframe.contentWindow.getSelection().toString();
}

//************************
//** REDES SOCIALES  
//************************
function shareFacebook() {
	if ( device.platform == "Android" ){ //FacebookConnectPlugin
		facebookConnectPlugin.login(
			[ "email" ],
			function( response ) {//success
				showDialogFacebookConnect_f(); 
			},
			function ( response ) {//error
				console.log( JSON.stringify( response ) );
			}
		);
	}else{ //SocialSharing Plugin
		// Beware: passing a base64 file as 'data:' is not supported on Android 2.x: https://code.google.com/p/android/issues/detail?id=7901#c43
		// Hint: when sharing a base64 encoded file on Android you can set the filename by passing it as the subject (second param)
		window.plugins.socialsharing.shareViaFacebook(
			'"'+selectionString_g+'"\n ―― ' + bookTitle_g + '\n ' + bookURL_g, //probar html tags si necesario
			null /* img */, 
			null /*url*/, 
			function() {//success
 				console.log( 'share ok' );	  
			}, 
			function( errormsg ){//error
				console.log( errormsg );
			}
		);
	}
	//   showDialog();
}

function shareTwitter() {
	//************************************
	//** GENERAR IMAGEN CON TEXTO PARA COMPARTIR
	//************************************
// 	var canvas = document.createElement("canvas");
// 	canvas.style.width = "300px";
// 	canvas.style.height = "1000px";
// 	var URI = drawText_f ( canvas, '"'+selectionString_g+'"\n ―― ' + bookTitle_g, "12px serif", 10, 25, 280);
	
	// Beware: passing a base64 file as 'data:' is not supported on Android 2.x: https://code.google.com/p/android/issues/detail?id=7901#c43
	// Hint: when sharing a base64 encoded file on Android you can set the filename by passing it as the subject (second param)
	var footText = ". Tomado de libro vía #MemoriApp del @CentroMemoriaH";
	// Recortar texto para el tweet 140 - 22(url) = 118
	var maxLength = 118 - footText.length - 6; //tilde?
	var text = '"'+selectionString_g.substring(0,maxLength)+'" '+ footText ;
	
	window.plugins.socialsharing.shareViaTwitter(
		text, /*texto*/
		null,/* img */
		bookURL_g, /*url*/
		function() {//success
			console.log('share ok');
		}, 
		function( errormsg ){ //error
			console.log(errormsg);
		}
	);
}

function shareWhatsapp() {
	window.plugins.socialsharing.shareViaWhatsApp(
		'"'+selectionString_g+'"\n ―― ' + bookTitle_g + '\n ' + bookURL_g, /*texto*/
		null,/* img */
		null, /*url*/
		function() {//success
			console.log('share ok');
		}, 
		function( errormsg ){ //error
			console.log(errormsg);
		}
	);
}

function shareEmail() {
	window.plugins.socialsharing.shareViaEmail(
		'"'+selectionString_g+'"\n ―― ' + bookTitle_g + '\n ' + bookURL_g, /*texto*/
		null,/* img */
		null, /*url*/
		function() {//success
			console.log('share ok');
		}, 
		function( errormsg ){ //error
			console.log(errormsg);
		}
	);
}

function share() {//pruebas
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	//   var ctx = document.getElementById('canvas').getContext('2d');
	ctx.font = "48px serif";
	ctx.fillText(selectionString_g, 10, 50);
	var URI = canvas.toDataURL();
	//   console.log(temp);
	//   window.plugins.socialsharing.share(null, null, 'https://www.google.nl/images/srpr/logo4w.png', null)">image only</button>
	// Beware: passing a base64 file as 'data:' is not supported on Android 2.x: https://code.google.com/p/android/issues/detail?id=7901#c43
	// Hint: when sharing a base64 encoded file on Android you can set the filename by passing it as the subject (second param)
	//   window.plugins.socialsharing.share(null, 'Android filename', URI , "http://www.google.com");
	window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(
		'Message via Facebook',
		URI /* img */,
		"html://www.google.com/" /* url */,
		'Paste it dude!',
		function() {
			console.log('share ok');
		},
		function(errormsg){
			alert(errormsg);
		}
	);
	
	//   window.plugins.socialsharing.shareViaTwitter('Message and link via Facebook', URI /* img */, null /*url*/, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
	//  window.plugins.socialsharing.shareViaFacebook('Message via Facebook', null /* img */, null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
}

function showDialogFacebookConnect_f() {
	
	facebookConnectPlugin.showDialog(
		{
			method:      "feed",
			name:        '"'+selectionString_g+'"',
			link:        bookURL_g,
			description: "―― " + bookTitle_g,
			// 		  picture: workingDirEntry_g.toURL() + "asd.png",
			//     caption: selectionString_g
		}, 
		function (response) { 
			console.log(JSON.stringify(response)) ;
		},
		function (response) { 
			console.log(JSON.stringify(response));
		}
	);
	
}

var drawText_f = function (canvas, textString, font, x, y, maxWidth){
	var canvasTemp = document.createElement("canvas");
	canvasTemp.width = canvas.width;
	canvasTemp.height = canvas.height;
	var contextTemp = canvasTemp.getContext("2d");
	contextTemp.font = font;
	var x1 = x;
	var y1 = y;
	var j = 0;
	var i = 0;
	var wordEnd = 0;
	var textMetric;
	var substringText ="";
	var textLines;
	// textLines solo se usa para evitar bucles infinitos
	for (j = 0, textLines = 0; i < textString.length && textLines < 30; j = i, textLines++){
		for (i = j; i < textString.length; i++){
			textMetric = contextTemp.measureText(textString.substring(j, i)); // TextMetrics object
			if (textMetric.width > maxWidth){
				i = wordEnd;
				break;
			}
			if (textString.charAt(i) == " " || textString.charAt(i) == "\n"){
				wordEnd = i;
			}
			if (textString.charAt(i) == "\n"){
				i++;
				break;
			}
		}
		substringText = textString.substring(j, i);
		contextTemp.fillText(substringText, x1, y1);
		y1 += 12;
	}
	canvas.height = y1;
	var context = canvas.getContext("2d");
	context.fillStyle= "#ffffff"; // sets color
	context.fillRect(0,0,canvas.width,canvas.height);
	context.drawImage(canvasTemp, 0,0);
	
	var URI = canvas.toDataURL();
	return URI;
};
//**********************************
//** Compartir libro
//**********************************
function shareBookOnWhatsapp() {
	window.plugins.socialsharing.shareViaWhatsApp(
		bookTitle_g + '\n ' + bookURL_g, //probar html tags si necesario
		null /* img */,
		null /*url*/,
		function() {//success
			console.log( 'share ok' );	  
		}, 
		function( errormsg ){//error
			console.log( "error: " + errormsg );
		}
	);
}

function shareBookOnEmail() {
	window.plugins.socialsharing.shareViaEmail(
		bookTitle_g + '\n ' + bookURL_g, //probar html tags si necesario
		null /* img */,
		null /*url*/,
		function() {//success
			console.log( 'share ok' );	  
		}, 
		function( errormsg ){//error
			console.log( "error: " + errormsg );
		}
	);
}

function shareBookOnFacebook() {
	if ( device.platform == "Android" ){ //FacebookConnectPlugin
		facebookConnectPlugin.login(
			[ "email" ],
			function( response ) {//success
				showDialogBookOnFacebookConnect_f(); 
			},
			function ( response ) {//error
				console.log( JSON.stringify( response ) );
			}
		);
	}else{ //SocialSharing Plugin
		window.plugins.socialsharing.shareViaFacebook(
			 bookTitle_g + '\n ' + bookURL_g, //probar html tags si necesario
			null /* img */, 
			null /*url*/, 
			function() {//success
 				console.log( 'share ok' );	  
			}, 
			function( errormsg ){//error
				console.log( errormsg );
			}
		);
	}
}

function shareBookOnTwitter() {
	var footText = ". Libro del @CentroMemoriaH vía #MemoriApp.";
	// Recortar texto para el tweet 140 - 22(url) = 118
	var maxLength = 118 - footText.length - 6; //tilde?
	var text = '"'+bookTitle_g.substring(0,maxLength)+'" '+ footText ;
	window.plugins.socialsharing.shareViaTwitter(
		text,       /*texto*/
		null,       /* img */
		bookURL_g,  /*url*/
		function() {//success
			console.log('share ok');
		}, 
		function( errormsg ){ //error
			console.log(errormsg);
		}
	);
}

function showDialogBookOnFacebookConnect_f() {
	
	facebookConnectPlugin.showDialog(
		{
			method:      "feed",
			link:        bookURL_g,
			description: bookTitle_g,
			// 		  picture: workingDirEntry_g.toURL() + "asd.png",
			//     caption: selectionString_g
		}, 
		function (response) { 
			console.log(JSON.stringify(response)) ;
		},
		function (response) { 
			console.log(JSON.stringify(response));
		}
	);
	
}
//**********************************
//** Guardado de fragmentos y libros
//**********************************
function saveFragment_f(){
	var db = window.openDatabase("memoriappDB", "1.0", "fragmentos", DBSize_g);
	db.transaction(saveFragmentDB_f, onError_f, function(){ //success
	});
	Dialog_fragment_save.show();
	setTimeout('Dialog_fragment_save.hide()', 2000);
	
}

function saveFragmentDB_f(tx) {
	createTableFragmentDB_f(tx);
	var date = new Date();
	//getMonth: el mes es un numero entre 0-11
	var sDate = date.getDate()+"/" + (parseInt(date.getMonth())+1) + "/"+date.getFullYear();
	tx.executeSql("INSERT INTO fragmentos (Libro, Fragmento, Fecha) VALUES ('"+bookTitle_g+"','"+selectionString_g+"','"+ sDate +"')");
}
//******************************************
//** Despliegue de fragmentos
//******************************************
function viewBookmark_f(){
	menu.setMainPage('bookmark.html', {closeMenu: true, callback: function(){
		var db = window.openDatabase("memoriappDB", "1.0", "fragmentos", DBSize_g);
		db.transaction(listFragmentosDB_f, onError_f);
	}});
}
function createTableFragmentDB_f(tx){
	tx.executeSql('CREATE TABLE IF NOT EXISTS fragmentos (id integer primary key, Libro, Fragmento, Fecha)');
}

function listFragmentosDB_f(tx){
	createTableFragmentDB_f(tx);
	tx.executeSql('SELECT * FROM fragmentos', [],function(tx, results){//success
		var div = document.getElementById("fragment_list");
		var container = document.getElementById("container_fragmentos");
		div.removeChild(container);
		container = document.createElement("div");
		container.id = "container_fragmentos";
		$("#number_fragmentos").html(results.rows.length);
		
		for (var i=0; i<results.rows.length; i++){			
			var id = results.rows.item(i).id;
			var libro = results.rows.item(i).Libro;
			var date = results.rows.item(i).Fecha;
			var fragmento = results.rows.item(i).Fragmento;
			var item = document.createElement("div");
			item.id = "fragmento_"+id;
// 			var ons_list = document.createElement("ons-list");
// 			ons_list.modifier="inset";
// 			ons_list.class="card-bookmark";
// 			ons_list.style="margin-top: 10px";
// 			var ons_list_item1 = document.createElement("ons-list_item");
// 			ons_list_item1.class="to-wrapper smallfont";
// 			ons_list_item1.innerHTML = 'Agregado el '+ dateToString_f(date);
// 			var p = document.createElement("p");
// 			p.innerHTML = fragmento;
// 			var ons_list_item2 = document.createElement("ons-list_item");
// 			ons_list_item2.class="to-wrapper smallfont";
// 			ons_list_item2.innerHTML = 'Tomado de libro '+ libro;
// 			var ons_icon = document.createElement("ons-icon");
// 			ons_icon.icon="ion-trash-a";
// 			ons_icon.class="trash";
// 			ons_icon.style="float:right";
// 			ons_list_item2.appendChild(ons_icon);
// 			
// 			ons_list.appendChild(ons_list_item1);
// 			ons_list.appendChild(p);
// 			ons_list.appendChild(ons_list_item2);
// 			item.appendChild(ons_list);
			
			item.innerHTML = 
			'<ons-list class="card-bookmark list ons-list-inner list--inset" style="margin-top: 10px">'+
			'<ons-list-item class="to-wrapper smallfont  list__item ons-list-item-inner">'+
			'Agregado el '+ dateToString_f(date) +
			'</ons-list-item>'+
			'<P>'+ fragmento +'</P>'+
			'<ons-list-item class="to-wrapper smallfont  list__item ons-list-item-inner">'+
			'Tomado de libro '+ libro +
			'<span onclick="deleteFragmento_f('+ id +');">'+
			'&nbsp;&nbsp;&nbsp;<ons-icon icon="ion-trash-a" style="float:right" class="trash ons-icon ons-icon--ion ion-trash-a fa-lg""></ons-icon>'+
			'</span>'+
			'</ons-list-item>'+
			'</ons-list>';
			container.appendChild(item);
		}
		div.appendChild(container);
	}, onError_f);
}

var dateToString_f = function (date){
	var splitDate = date.split("/");
	return splitDate[0] + " de " + monthToString_f(splitDate[1]) + " de " + splitDate[2];
};

var monthToString_f = function (nMonth){
	switch(parseInt(nMonth)){
		case 1:
			return "Enero";
		case 2:
			return "Febrero";
		case 3:
			return "Marzo";
		case 4:
			return "Abril";
		case 5:
			return "Mayo";
		case 6:
			return "Junio";
		case 7:
			return "Julio";
		case 8:
			return "Agosto";
		case 9:
			return "Septiembre";
		case 10:
			return "Octubre";
		case 11:
			return "Noviembre";
		case 12:
			return "Diciembre";
		default:
			return "-1";
	}
};
var idFragmentoDB_g;
function deleteFragmento_f(idFragmento){
	ons.notification.confirm({
		  message: '¿Esta seguro que desea eliminar el fragmento favorito?',
		  // or messageHTML: '<div>Message in HTML</div>',
		  title: 'Eliminar fragmento',
		  buttonLabels: ['Aceptar', 'Cancelar'],
		  animation: 'default', // or 'none'
		  primaryButtonIndex: 1,
		  cancelable: true,
		  callback: function(index) {
		  	switch(index) {
		  		case 0:
		  			idFragmentoDB_g = idFragmento;
		  			var db = window.openDatabase("memoriappDB", "1.0", "fragmentos", DBSize_g);
					db.transaction(
						deleteFragmentoDB_f,
						onError_f, 
						function(){ //success
							console.log("borrado");
							var item = document.getElementById("fragmento_"+idFragmento);
							var container = document.getElementById("container_fragmentos");
							container.removeChild(item);
						}
					);
		            ons.notification.alert({
		              message: 'Fragmento eliminado'
		            });
            		break;

          		case 1:
		       
		            break;
        	}
		  }
	});
	
	
}

function deleteFragmentoDB_f(tx) {
	createTableFragmentDB_f(tx);
	tx.executeSql("DELETE FROM fragmentos WHERE id='"+idFragmentoDB_g+"'");
}
//******************************************
//** Guardado de Favoritos
//******************************************
function addBookFavorites( element ){
	var img = element.childNodes[0];
	console.log( img.src );
	if ( img.getAttribute( "src" ) == "img/estrella.png" ){
		// agregar a favoritos
		bookFavoritesElement_g  = element;
		saveEPUBinFavorites_f();
		ons.notification.alert({
			title       : 'Mensaje',
			message     : 'El libro se ha agregado a favoritos',
			buttonLabel : 'Aceptar',
		});
		getnumbers();
		img.src = "img/estrella2.png";
	}else{
		//borrar de favoritos
		ons.notification.confirm({
			title       : '¡Alerta!',
			message     : '¿Está seguro que desea eliminar el libro de sus favoritos?',
			buttonLabels: ['Si', 'No'],
			callback: function(idx) {
				switch(idx) {
					case 0://si
						var oLibros = JSON.parse( window.localStorage.getItem("favoritos") );
						var epubId      = element.getAttribute("epubId");
						if( oLibros === null) {
							oLibros = {};
						}
						oLibros[ epubId ] =  undefined ;
						window.localStorage.setItem("favoritos", JSON.stringify( oLibros ));
						img.src = "img/estrella.png";
						getnumbers();
						break;
					case 1://no
						break;
				}
			}
		});
		

	}

}

function saveEPUBinFavorites_f(){
	var oLibros = JSON.parse( window.localStorage.getItem("favoritos") );
	if( oLibros === null) {	
		oLibros = {};
	}
	var oLibro = {
		description : bookFavoritesElement_g.getAttribute("description"), 
		title       : bookFavoritesElement_g.getAttribute("title"),
		img         : bookFavoritesElement_g.getAttribute("img"),
		epub        : bookFavoritesElement_g.getAttribute("epub"),
		id          : bookFavoritesElement_g.getAttribute("epubId"),
		epubId      : bookFavoritesElement_g.getAttribute("epubId"),
		star_img    :"img/estrella2.png",
	};
	oLibros[ bookFavoritesElement_g.getAttribute("epubId") ] =  oLibro ;
	window.localStorage.setItem("favoritos", JSON.stringify( oLibros ));
}

//******************************************
//** Guardado de EPUBs
//******************************************
function saveEPUBinStorage_f( id ){
	var oLibros = JSON.parse( window.localStorage.getItem("libros") );
	if( oLibros === null) {
		oLibros = {};
	}
	var oLibro = {
		description : bookElement_g.getAttribute("description"), 
		title       : bookElement_g.getAttribute("title"),
		img         : bookElement_g.getAttribute("img"),
		epub        : bookElement_g.getAttribute("epub"),
		id          : bookElement_g.getAttribute("epubId"),
		epubId      : bookElement_g.getAttribute("epubId"),
		trash       :'visible',
	};
	oLibros[ id ] =  oLibro ;
	window.localStorage.setItem("libros", JSON.stringify( oLibros ));
	getnumbers();
}

function removeConfirmDialog_f( element ){
	ons.notification.confirm({
		title: '¡Advertencia!',
		message: '¿Está seguro que desea eliminar el libro? También se perderán los marcadores.',
		buttonLabels: ['Si', 'No'],
		callback: function(idx) {
			switch(idx) {
				case 0://si
					deleteEPUB_f( element );
					break;
				case 1://no
					break;
			}
		}
	});
}

function deleteEPUB_f( element ){
	var id = element.getAttribute("epubId");
	window.resolveLocalFileSystemURL(
		workingDirEntry_g.toURL() + "epub/" + id + ".epub",
		function(fileEntry){
			fileEntry.remove(
				function(){//success remove
					removeEPUBfromLocalStorage_f( id );
				},
				function(){//fail remove
					console.log("fail remove");
					removeEPUBfromLocalStorage_f( id );
				}
			);
		},
		function(){//fail resolveLocalFileSystemURL
			console.log("fail resolve filesystem");
			removeEPUBfromLocalStorage_f( id );
		}
	);
}

function removeEPUBfromLocalStorage_f( id ){
	var oLibros = JSON.parse( window.localStorage.getItem("libros") );
	if( oLibros === null) {
		oLibros = {};
	}
	oLibros[ id ] =  undefined ;
	window.localStorage.setItem("libros", JSON.stringify( oLibros ));
	getnumbers();
	backButtonHandler_f();
}
//******************************************
//** POPOVER DEL DICCIONARIO
//******************************************
function showMeaning_f(){
	searchDicMemoriApp_f();
}

function searchDicMemoriApp_f(){
	meaningPopover.hide();
	// 	removeSelectionIndicators();
	var URL = urlServer_g + "index.php/dictionary/buscar/" + selectionString_g.toLowerCase().trim();
	$.ajax({
		url: URL,
		dataType: "jsonp",
		success: function (aResponse) {
			console.log("success");
			var div = createDicPopover_f();
			console.log(aResponse);
			var content;
			if ( aResponse[0] !== undefined ){
				content = aResponse[0].definicion;
			}else{
				searchWiktionary_f( div );
				return;
			}
			var textLines = content.split("\n");
			var sMeaning = "";
			var i=0;
			textLines.every(function(line) {
					i++;
					sMeaning += "<br/>" + line;
				return (i < 3); //break if i not < 3
			});
			div.innerHTML = selectionString_g + ":<br/>" + sMeaning;
			console.log(sMeaning);
		},
		error: function(e, text){
			console.log(text);
			var div = createDicPopover_f();
			searchWiktionary_f( div );
		}
	});
}
	
function searchWiktionary_f( div ){
	meaningPopover.hide();
	// 	removeSelectionIndicators();
	var URL = "http://es.wiktionary.org/w/api.php?action=query&titles=" + selectionString_g.toLowerCase().trim() + "&prop=revisions&rvprop=content&format=json";
	$.ajax({
		url: URL,
		dataType: "jsonp",
		success: function (aResponse) {
			console.log("success");

			console.log(aResponse);
			var pages = aResponse.query.pages;
			var page  = getElement( pages );
			var content;
			if ( page.missing === undefined ){
				content = page.revisions[0]["*"];
			}else{
				div.innerHTML = selectionString_g + ":<br/>No encontrado";
				return;
			}
			var textLines = content.split("\n");
			var sMeaning = "";
			var i=0;
			textLines.every(function(line) {
				if( line.substr(0,1) == ";" && !isNaN( parseInt( line.substr(1,1) ) ) ){
					i++;
					sMeaning += "<br/>" + line.substr(1);
				}
				return (i < 3); //break if i not < 3
			});
			sMeaning = wikiFormat_f(sMeaning.substr(5));
			div.innerHTML = selectionString_g + ":<br/>" + sMeaning;
			console.log(sMeaning);
		},
		error: function(e, text){
			console.log(text);
		}
	});
}

function createDicPopover_f(){
	//crear overlay que contiene el popover del diccionario
	var maskOverlay = document.createElement("div");
	document.body.appendChild(maskOverlay);
	maskOverlay.id = "diccionario_overlay"
	maskOverlay.style.position  = "absolute";
	maskOverlay.style.top       = "0px";
	maskOverlay.style.left      = "0px";
	maskOverlay.style.width     = "100%";
	maskOverlay.style.height    = "100%";
	$(document).on('click', '#diccionario_overlay', function(e) {
		hideMeaning_f();
	});
	//crear popover donde se muestra el significado
	var div = document.createElement("div");
	div.style.position  = "absolute";
	maskOverlay.appendChild(div);
	div.style.bottom    = "0px";
	div.style.left      = "0px";
	div.style.width     = "100%";
	div.style.top       = "70%";
// 	div.style.padding   = "10px";
	div.style.backgroundColor = "#DDDDDD";
	var p = document.createElement("div");
	div.appendChild(p);
	p.style.margin = "10px";
	
	return p;
}

function hideMeaning_f(){
	var div = document.getElementById("diccionario_overlay");
	var parent = div.parentNode;
	parent.removeChild(div);
}

function getElement( data ){
	if( typeof(data) != "undefined" ){
		for (var prop in data){
			return data[prop];
		}
	}
}

function wikiFormat_f( str ){
	var result = str;
	var aMatch = result.match(/(\[{2}[^\[]+\|[^\[]+\]{2})/g);
	var word = "";
	if (aMatch !== null){
		aMatch.forEach(function( match ){
			word = match.match(/([^\|]*(?=\]\]))/)[0];
			match = match.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
			result = result.replace(RegExp(match,"g"), word);
		});
	}
	result = result.replace(/([\[\]\{\}]|ucf\|)/g,"");
	return result;
}

//*******************************************
//** Busqueda de tags
//*******************************************
function search_f( element ){
	searchString_g = element.value;
	menu.setMainPage('main.html', {closeMenu: true});
	document.removeEventListener("touchmove",preventDefaultScroll_f);
}
//***********************************
//** Portapapeles
//***********************************
function copiar_f(){
	window.plugins.clipboard.copy(
		selectionString_g,
		function(){ //success
			Dialog_copiado.show();
			setTimeout('Dialog_copiado.hide()', 2000);
		},
		function(){ //error
			console.log("error al copiar.");
		}
	);
}