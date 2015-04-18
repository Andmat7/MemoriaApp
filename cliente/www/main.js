var wholeSelRectEl_g = null;
var startSelEl_g, endSelEl_g;
var workingDirEntry_g;
var sWorkingDir_g = ".MemoriAPP/";
var Book_g = ePub(
	"ddhh/",
	{	style: 'img { width: 100px;}',	spreads: false	}
);

var alertDebug = 0;

function viewBook(){
	menu.setMainPage('book.html', {closeMenu: true, callback: starting})
}
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
	Book_g.renderTo('area');
	// declaracion de handle de comienzo de seleccion
	startSelEl_g = document.createElement("div");
	startSelEl_g.id = "startSelection";
	startSelEl_g.innerHTML = "&nbsp;^&nbsp;";
	$(document).on('touch', '#startSelection', beginHandleMove);
	$(document).on('touchmove', '#startSelection', handleMove);
	$(document).on('release', '#startSelection', handleRelease);
	
	//declaracion de handle de final de seleccion
	endSelEl_g = document.createElement("div");
	endSelEl_g.id = "endSelection";
	endSelEl_g.innerHTML = "&nbsp;^&nbsp;";
	$(document).on('touch', '#endSelection', beginHandleMove);
	$(document).on('touchmove', '#endSelection', handleMove);
	$(document).on('release', '#endSelection', handleRelease);
	
	
	ons.createPopover('popover.html').then(function(){
		sharePopover.on("postshow", function(e){
			$(".popover-mask")[0].style.zIndex = -1;
		});
	});
	
	$(document).on('hold', '#area', function(e) {
		startSelect_g = 1;
		e.preventDefault();
		var xSelectStart = e.originalEvent.gesture.center.clientX;
		var ySelectStart = e.originalEvent.gesture.center.clientY;
		wordSelectionFromPoint(xSelectStart, ySelectStart);    
	});
	
	$(document).on('release', '#area', function(e) {
		if ( startSelect_g === 0){
			handleMoving_g = 0;
			sharePopover.hide();
		}
	});
};

//** Inicialización para manejo del sistema de archivos en phonegap
/*$( document ).ready(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
});
function onDeviceReady() {
	var audioDirEntry = cordova.file.externalRootDirectory;
	window.resolveLocalFileSystemURL(
		audioDirEntry, 
		function(dirEntry){
			if (alertDebug == 1) {
				alert(dirEntry.toURL());
			}
			dirEntry.getDirectory(
				"Android/",
				{create: true},
				function(dirEntry){
					if (alertDebug == 1) {
						alert(dirEntry.toURL());
					}
					dirEntry.getDirectory(
						"data/",
						{create: true},
						function(dirEntry){
							if (alertDebug == 1) {
								alert(dirEntry.toURL());
							}
							dirEntry.getDirectory(
								sWorkingDir_g,
								{create: true},
								function(dirEntry){
									if (alertDebug == 1) 
										alert(dirEntry.toURL());
									workingDirEntry_g = dirEntry;
									dirEntry.getDirectory(
										"rec/",
										{create: true},
										function(dirEntry){
											if (alertDebug == 1) 
												alert(dirEntry.toURL());
											recDirEntryPath = dirEntry.toURL();
										},
										onError
									);
									
								},
								onError
							);
						},
						
						onError
					);
					
				},
				onError
			);
		},
		onError
	);
	
}*/

function onError(e){
	alert(e);
	console.log(e);
}

//***********  DESACTIVADO DEL SWIPE Y SELECCION *******************
var event_global ;
var range_g;
var startSelect_g = 0;
var selectionString_g;


// ********************** EPUB NAVIGATION ***********************

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
		{x: 0 , force3D:true ,onStart:function(){ Book_g.prevPage(); } }
	);
	
}
// Arreglo de problema del tamaño de la pagina en IOS ?
function epubNextPage(){
	Book_g.nextPage().then(
		function (){
			var iframe = $('iframe');
			iframe[0].style.width = document.body.clientWidth*0.8 + "px";
		}
	);
}
// *****************************************************************
// ******* FUNCIONES DE PRUEBA PARA SELECCION (BASURA ?) ***********
// ****************************************************************
/*
 * ****************** SELECCIONAR CON COORDENADAS *********************	      
 f u*nction createSelectionFromPoint(startX, startY, endX, endY) {
 var iframe = document.getElementsByTagName('iframe')[0];
 startX -= iframe.offsetLeft;
 startY -= iframe.offsetTop;
 endX -= iframe.offsetLeft;
 endY -= iframe.offsetTop;
 
 var doc = iframe.contentDocument || iframe.contentWindow.document;
 
 var start, end, range_g = null;
 if (typeof doc.caretPositionFromPoint != "undefined") {
	 start = doc.caretPositionFromPoint(startX, startY);
	 end = doc.caretPositionFromPoint(endX, endY);
	 range_g = doc.createRange();
	 range_g.setStart(start.offsetNode, start.offset);
	 range_g.setEnd(end.offsetNode, end.offset);
	 } else if (typeof doc.caretRangeFromPoint != "undefined") {
		 start = doc.caretRangeFromPoint(startX, startY);
		 end = doc.caretRangeFromPoint(endX, endY);
		 range_g = doc.createRange();
		 range_g.setStart(start.startContainer, start.startOffset);
		 range_g.setEnd(end.startContainer, end.startOffset);
		 }
		 if (range_g !== null && typeof iframe.contentWindow.getSelection != "undefined") {
			 var sel = iframe.contentWindow.getSelection();
			 sel.removeAllRanges();
			 sel.addRange(range_g);
			 } else if (typeof doc.body.createTextRange != "undefined") {
				 range_g = doc.body.createTextRange();
				 range_g.moveToPoint(startX, startY);
				 var endRange = range_g.duplicate();
				 endRange.moveToPoint(endX, endY);
				 range_g.setEndPoint("EndToEnd", endRange);
				 range_g.select();
				 }
				 }
				 var el;
				 function ipadSelection(){
				 var iframe = document.getElementsByTagName('iframe')[0];
				 var doc = iframe.contentDocument || iframe.contentWindow.document;
				 var win = iframe.contentWindow;
				 //seleccionar el primer tag p
				 var p = doc.getElementsByTagName("p");
				 el = p[0];
				 console.log (el);
				 
				 var sel = win.getSelection();
				 // create a range_g:  
				 // https://developer.mozilla.org/en-US/docs/Web/API/document.createRange
				 var range_g = doc.createRange();
				 // use firstChild as range_g expects a textNode, not an elementNode
				 range_g.setStart(el.firstChild, 0);
				 range_g.setEnd(el.firstChild, el.innerHTML.length);
				 //    sel.removeAllRanges();
				 sel.addRange(range_g);
				 
				 }
				 
				 function setEndSelectionFromPoint( endX, endY) {
				 var iframe = document.getElementsByTagName('iframe')[0];
				 endX -= iframe.offsetLeft;
				 endY -= iframe.offsetTop;
				 var doc = iframe.contentDocument || iframe.contentWindow.document;
				 
				 var end;
				 if (typeof doc.caretPositionFromPoint != "undefined") {
					 end = doc.caretPositionFromPoint(endX, endY);
					 range_g.setEnd(end.offsetNode, end.offset);
					 }
					 if (range_g !== null && typeof iframe.contentWindow.getSelection != "undefined") {
						 var sel = iframe.contentWindow.getSelection();
						 sel.removeAllRanges();
						 sel.addRange(range_g);
						 } else if (typeof doc.body.createTextRange != "undefined") {
							 var endRange = range_g.duplicate();
							 endRange.moveToPoint(endX, endY);
							 range_g.setEndPoint("EndToEnd", endRange);
							 range_g.select();
							 }
							 
							 }*/
// *****************************************************************
// *****************************************************************
// *****************************************************************

function wordSelectionFromPoint(startX, startY) {
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
}

//********************************
//*********** RANGY *****************
//******************************

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
	$(document).off('touch', '#area', removeSelectionIndicators);
	if (wholeSelRectEl_g !== null) {
		wholeSelRectEl_g.parentNode.removeChild(wholeSelRectEl_g);
		startSelEl_g.parentNode.removeChild(startSelEl_g);
		endSelEl_g.parentNode.removeChild(endSelEl_g);
		wholeSelRectEl_g = null;
		startSelect_g = 0;
	}
}
//Mostrar todos los indicadores de la seleccion (sombreado y handles)
function showSelectionPosition() {
	// carousel1 es el elemento del DOM que va contener los indicadores de seleccion
	var carousel1 = $("#carousel-1")[0];
	var iframe = $("iframe")[0];
	var iframePos = getPosition(iframe);
	var iframeX = iframe.offsetLeft;
	var iframeY = iframe.offsetTop;
	var selRects = rangy.getSelection(iframe).getRangeAt(0).nativeRange.getClientRects();
	
	removeSelectionIndicators();
	
	showSelectionRects(selRects, carousel1);
	
	// Draw elements at the start and end of the selection
	//   var startPos = rangy.getSelection(iframe).getStartDocumentPos();
	var startPos = { 
		x : $(".wholeSelection")[0].offsetLeft,
		y : $(".wholeSelection")[0].offsetTop+ $(".wholeSelection")[0].offsetHeight,
	};
	carousel1.appendChild(startSelEl_g);
	startSelEl_g.style.left = startPos.x - (startSelEl_g.offsetWidth/2) + "px";
	//   startSelEl_g.style.left = startPos.x+iframeX - (startSelEl_g.offsetWidth/2) + "px";
	//   startSelEl_g.style.top = startPos.y+iframeY - startSelEl_g.offsetHeight + "px";
	startSelEl_g.style.top = startPos.y+ "px";
	
	var endPos = rangy.getSelection(iframe).getEndDocumentPos();
	console.log(endPos);
	console.log(startPos);
	
	carousel1.appendChild(endSelEl_g);
	endSelEl_g.style.left = (endPos.x+iframeX )- (endSelEl_g.offsetWidth/2) + "px";
	endSelEl_g.style.top = (endPos.y+iframeY )  + "px";
	
	sharePopover.show('.wholeSelection');
	$(document).on('touch', '#area', removeSelectionIndicators);
}

//Sombreado de texto seleccionado (solucion para problema IOS)
function showSelectionRects(selRects, element){
	var iframe = $("iframe")[0];
	var iframePos = getPosition(iframe);
	var iframeX = iframe.offsetLeft;
	var iframeY = iframe.offsetTop;
	var i = 0;
	var rect;
	wholeSelRectEl_g = document.createElement("div");
	wholeSelRectEl_g.id = "wholeselection";
	
	for ( i = 0; i< selRects.length; i++){
		rect = document.createElement("div");
		rect.className = "wholeSelection";
		rect.style.left = selRects[i].left+iframeX + "px";
		rect.style.top =  selRects[i].top+iframeY + "px";
		rect.style.width = selRects[i].width + "px";
		rect.style.height = selRects[i].height + "px";
		wholeSelRectEl_g.appendChild(rect);
	}
	element.appendChild(wholeSelRectEl_g);
}
var handleMoving_g = 0;
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
			e.target.style.left = ( e.originalEvent.targetTouches[0].clientX - (e.target.offsetWidth/2))  + "px";
			e.target.style.top = ( e.originalEvent.targetTouches[0].clientY - (e.target.offsetHeight*2)) + "px";
		}else{
			e.target.style.left = ( e.originalEvent.targetTouches[0].clientX - (e.target.offsetWidth/2))  + "px";
			e.target.style.top = ( e.originalEvent.targetTouches[0].clientY - (e.target.offsetHeight*2))  + "px";
		}
	}
	return false;
}

function handleRelease(e) { 
	
	var iframe = document.getElementsByTagName('iframe')[0];
	var endX = endSelEl_g.offsetLeft - iframe.offsetLeft + (endSelEl_g.offsetWidth/2);
	var endY = endSelEl_g.offsetTop - iframe.offsetTop -2;
	var startX = startSelEl_g.offsetLeft - iframe.offsetLeft + (startSelEl_g.offsetWidth/2);
	var startY = startSelEl_g.offsetTop - iframe.offsetTop -2;//   + (startSelEl_g.offsetHeight) ;
	
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
}

function selectRange(startX,startY,endX,endY,iframe,doc){
	var sel;
	if (range_g !== null && typeof iframe.contentWindow.getSelection != "undefined") {
		sel = iframe.contentWindow.getSelection();
		sel.removeAllRanges();
		sel.addRange(range_g);
		//     sel.removeAllRanges();
		
	} else if (typeof doc.body.createTextRange != "undefined") {
		var endRange = range_g.duplicate();
		sel = iframe.contentWindow.getSelection();
		range_g.moveToPoint(startX, startY);    
		endRange.moveToPoint(endX, endY);
		range_g.setEndPoint("EndToEnd", endRange);
		range_g.select();
	}
	selectionString_g = iframe.contentWindow.getSelection().toString();
	
	removeSelectionIndicators();
	showSelectionPosition();
	sel.removeAllRanges();
	//   selectionString_g = iframe.contentWindow.getSelection().toString();
}

//********** REDES SOCIALES  *********
function shareFacebook() {
	if ( device.platform == "Android" ){ //FacebookConnectPlugin
		//   if (!window.cordova) {
		//     var appId = prompt("Enter FB Application ID", "");
		//     facebookConnectPlugin.browserInit(appId);
		//   }
		facebookConnectPlugin.login(
			[ "email" ],
			function( response ) {
				showDialogFacebookConnect(); 
				alert( JSON.stringify( response ) );
			},
			function ( response ) {
				alert( JSON.stringify( response ) );
			}
		);
	}else{ //SocialSharing Plugin
		// Beware: passing a base64 file as 'data:' is not supported on Android 2.x: https://code.google.com/p/android/issues/detail?id=7901#c43
		// Hint: when sharing a base64 encoded file on Android you can set the filename by passing it as the subject (second param)
		window.plugins.socialsharing.shareViaFacebook(
			'"'+selectionString_g+'"\n ―― Nombre del libro. \n http://example.com/', //probar html tags si necesario
			null /* img */, 
			null /*url*/, 
			function() {
				alert( 'share ok' );	  
			}, 
			function( errormsg ){
				alert( errormsg );
			}
		);
	}
	//   showDialog();
}

function shareTwitter() {
	var canvas = document.createElement("canvas");
	canvas.style.width = "300px";
	canvas.style.height = "1000px";
	
	var URI = drawText ( canvas, '"'+selectionString_g+'"\n ―― Nombre del libro.', "12px serif", 10, 25, 280);
	
	//   console.log(temp);
	//   window.plugins.socialsharing.share(null, null, 'https://www.google.nl/images/srpr/logo4w.png', null)">image only</button>
	// Beware: passing a base64 file as 'data:' is not supported on Android 2.x: https://code.google.com/p/android/issues/detail?id=7901#c43
	// Hint: when sharing a base64 encoded file on Android you can set the filename by passing it as the subject (second param)
	//  window.plugins.socialsharing.share(null, 'Android filename', URI , null);
	
	window.plugins.socialsharing.shareViaTwitter('', URI /* img */, "http://www.google.com" /*url*/, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
	//  window.plugins.socialsharing.shareViaFacebook('Message via Facebook', null /* img */, null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
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

function showDialogFacebookConnect () {
	
	facebookConnectPlugin.showDialog(
		{ method: "feed",
			name: '"'+selectionString_g+'"',
			link: "http://example.com",
			description: "―― Nombre del libro.",
			// 		  picture: workingDirEntry_g.toURL() + "asd.png",
			//     caption: selectionString_g
		}, 
		function (response) { 
			alert(JSON.stringify(response)) ;
		},
		function (response) { 
			alert(JSON.stringify(response)) 
		}
	);
	
}

function downloadURI(URI){
	var ft = new FileTransfer();
	//   if (alertDebug == 1) alert ("begining download");
	ft.download(
		URI,
		workingDirEntry_g.toURL()+"asd.png",
							function (entry) {//success download
								console.log("download complete: " + entry.fullPath);
								facebookConnectPlugin.showDialog(
									{ method: "feed" ,
										name: '"'+selectionString_g+'"',
										link: "http://example.com",
										caption: "Such caption, very feed.",
										// 		  picture: workingDirEntry_g.toURL() + "asd.png",
										// 		  description: selectionString_g
									}, 
									function (response) {
										alert(JSON.stringify(response)); 
									},
									function (response) {
										alert(JSON.stringify(response));
									}
								);
							},
						 function(error) {//error download
							 // 		switch(error.code){
							 // 		  default:
							 console.log('Error downloading file ' + ': ' + error.code);
							 console.log("download error source " + error.source);
							 console.log("download error target " + error.target);
							 console.log("download error code" + error.code);
							 // 		}
							 // 		  onError(error);
						 },
						 false,
						 { headers: {"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="} }
	);
}	

var drawText = function (canvas, textString, font, x, y, maxWidth){
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