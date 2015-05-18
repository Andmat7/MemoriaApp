(function(){
	var module = angular.module('app', ['onsen']);
	module.controller('BookController', function($scope,$http,$timeout) {
		$scope.node = {};
		var book;
		book = { title : bookTitle_g };
		$scope.node = {	book : book };
		$scope.$apply();
		
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
			Dialog_book_save.show();
			saveEPUBinFavorites_f();
			setTimeout('Dialog_book_save.hide()', 2000);
		};
},function(){} );
	
	module.controller("MainController", function($scope,$http,$timeout) {

		$scope.showLibrary=function() {
			var books = JSON.parse( window.localStorage.getItem("libros") );
			$scope.node = {	books : books };
		};

		$scope.node = {};
 		Modal.show();
		var url;
		if (library_g) {
			var oFavs = JSON.parse( window.localStorage.getItem("favoritos") );
			if( oFavs === null) {
				 oFavs = {};
			}
			
			var books_alm = JSON.parse( window.localStorage.getItem("libros") );
			if( books_alm === null) {
				 books_alm = {};
			}
			var star_img;
			

			for (var key in books_alm) {
				star_img = ( oFavs[key]   === undefined )? "img/estrella.png" : "img/estrella2.png";
				books_alm[key].star_img=star_img;
			}
			$scope.node.books=books_alm;


			library_g=false;
			Modal.hide();

		}else{
			if (favorites_g) {
				var oLibros = JSON.parse( window.localStorage.getItem("libros") );
					if( oLibros === null) {
						oLibros = {};
					}
				var books_fav = JSON.parse( window.localStorage.getItem("favoritos") );
				var trash;
				for (var key in books_fav) {
					trash = ( oLibros[key] === undefined )? "hidden" : "visible";
					books_fav[key].trash=trash;
				}

				$scope.node.books=books_fav;
				favorites_g=false;
				Modal.hide();

			}else{
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
						 var oLibros = JSON.parse( window.localStorage.getItem("libros") );
						 if( oLibros === null) {
							 oLibros = {};
						 }
						 var oFavs = JSON.parse( window.localStorage.getItem("favoritos") );
						 if( oFavs === null) {
							 oFavs = {};
						 }
						 var trash;
						 var star_img;
						 aResponse.forEach(function(element) {
							 i++;
							 trash    = ( oLibros[element.id] === undefined )? "hidden" : "visible";
							 star_img = ( oFavs[element.id]   === undefined )? "img/estrella.png" : "img/estrella2.png";
							 
							 books.push({
								 description : element.description, 
								 title       : element.title,
								 img         : element.img,
								 id          : "book" + i,
								 epub        : element.epub,
								 epubId      : element.id,
								 bookURL     : element.url,
								 trash       : trash,
								 star_img    : star_img
							 });
						 });
						 $scope.node = {	books : books };
						 $scope.$apply();
						 Modal.hide();
					 },
					 error: function(e, text){
						 alert(text);
						 Modal.hide();
					 }
				});
			}
			ons.createDialog('dialog-share.html').then(function(dialog) {
				$scope.dialog = dialog;
			});
			$scope.share=function(title, URL) {
				bookTitle_g =  title;
				bookURL_g   = URL;
				Dialogfavorites.show();
			};
		}
		
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
		
		$scope.node = {

		};

		$scope.node.book_size=_.size(oLibros);
		var oLibros = JSON.parse( window.localStorage.getItem("libros") );
		$("#number_library").html(_.size(oLibros));
		var oLibros = JSON.parse( window.localStorage.getItem("favoritos") );
		$("#number_favorites").html(_.size(oLibros));
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
				$scope.node.coleccion = coleccion;
				$scope.$apply();
			},
			error: function(e, text){
				console.log(text);
			}
		});
	});
	
})();
