(function(){
	var module = angular.module('app', ['onsen']);
	module.controller('BookController', function($scope, $window) {
		ons.createPopover('popoverbook.html').then(function(popover) {
			$scope.popoverbook = popover;
		});
		ons.createDialog('dialog-share.html').then(function(dialog) {
      		$scope.dialog = dialog;
    	});
		$scope.show = function(e) {
			$scope.popoverbook.show(e);
		};
		ons.createDialog('dialog-share.html').then(function(dialog) {
			$scope.dialogfavorites = dialog;
		});
		ons.createDialog('Dialog_book_save.html').then(function(dialog) {
			$scope.Dialog_book_save = dialog;
		
		});
		ons.createDialog('Dialog_fragment_save.html').then(function(dialog) {
			$scope.Dialog_fragment_save = dialog;
		});		
		
	}).controller("PopoverbookController", function($scope, $window) {
		
		$scope.share=function() {
			Popoverbook.hide();
			Dialogfavorites.show()
			setTimeout('modal.hide()', 2000);
			
		};
		$scope.addfavorites=function() {
			Popoverbook.hide();
			Dialog_book_save.show()
			setTimeout('Dialog_book_save.hide()', 2000);
		};
},function(){} );
	
	module.controller("MainController", function($scope,$http,$timeout) {
		$scope.node = {};
 		Modal.show();
		var url;
		if( searchString_g === "" ){
			url = urlServer_g+"index.php/books/lista/" + coleccion_g;
		}else{
			url = urlServer_g+"index.php/books/search/" + searchString_g;
			searchString_g = "";
		}
		$.ajax({
			url: url,
			dataType: "jsonp",
			success: function (aResponse) {
				var i=-1;
				var books = [];
				aResponse.forEach(function(element) {
					i++;
					books.push({
						description : element.description, 
						title       : element.title,
						img         : element.img,
						id          : "book" + i,
						epub        : element.epub,
						epubId      : element.id,
						bookURL     : element.url,
					});
				});
				$scope.node = {	books : books };
				$scope.$apply();
				Modal.hide();
			},
			error: function(e, text){
				console.log(text);
			}
		});
		$scope.showinputsearch=function() {
			if ($scope.inputcontrol === ''||$scope.inputcontrol===undefined)
			{
				$scope.inputcontrol='open';
				$scope.titulomemoria='hide';
				$scope.center_toolbar='hide';
				$scope.right_toolbar='large';
			}else{
				$scope.inputcontrol='';
				$scope.titulomemoria='';
				$scope.center_toolbar='';
				$scope.right_toolbar='';
			}   
		};
		$scope.showdescripcion=function(book) {
			if(book.toggled===undefined){
				book.toggled=false;       
			}
			book.toggled = !book.toggled;
		};
	});

	module.controller("MenuController", function($scope,$http,$timeout) {
		$scope.node = {};
		$.ajax({
			url: urlServer_g+"index.php/books/categorias/",
			dataType: "jsonp",
			success: function (aResponse) {
				var i=-1;
				var coleccion = [0,0,0,0,0,0,0,0,0,0];
				aResponse.forEach(function(element) {
					coleccion[ element.category ] = element['COUNT(*)'];
					i++;
				});
				$scope.node = {	coleccion : coleccion };
				$scope.$apply();
			},
			error: function(e, text){
				console.log(text);
			}
		});
	});
	
})();
