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
//  		Modal.show();
		var url;

		if (library_g) {
			$scope.node.title="Mi Librería";

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
				star_img  = ( oFavs[key] === undefined )? "img/estrella.png" : "img/estrella2.png";
				books_alm[key].star_img  = star_img;
				books_alm[key].buttonTxt = "ABRIR";
			}
			$scope.node.books=books_alm;
			$scope.node.seccion_vacia=(_.size(books_alm)==0);
			// alert(_.size(books_alm));
			$scope.node.text="Aún no tienes libros agregados a tu librería,visita nuestras colecciones o busca palabras clave en la lupa.";
			library_g=false;
			Modal.hide();

		}else{
			if (favorites_g) {
				$scope.node.title="Mis favoritos";
				var oLibros = JSON.parse( window.localStorage.getItem("libros") );
					if( oLibros === null) {
						oLibros = {};
					}
				var books_fav = JSON.parse( window.localStorage.getItem("favoritos") );
				var trash, buttonTxt;
				for (var key in books_fav) {
					trash     = ( oLibros[key] === undefined )? "hidden" : "visible";
					buttonTxt = ( oLibros[key] === undefined )? "DESCARGAR" : "ABRIR";
					books_fav[key].trash     = trash;
					books_fav[key].buttonTxt = buttonTxt;
				}

				$scope.node.books=books_fav;
				favorites_g=false;
				$scope.node.seccion_vacia=(_.size(books_fav)==0);
				// alert(_.size(books_alm));
				$scope.node.text="Aún no tienes libros agregados a favoritos";
				
				Modal.hide();

			}else{
				if( searchString_g === "" ){
					url = urlServer_g+"index.php/books/lista/" + coleccion_g;
					switch(coleccion_g) {
					    case 1:
					        $scope.node.title="Informe General ¡Basta Ya!";
					        break;
					    case 2:
					        $scope.node.title="Informes de investigación";
					        break;
					    case 3:
					        $scope.node.title="Herramientas metodológicas y pedagógicas";
					        break;
					    case 4:
					        $scope.node.title="Iniciativas de memoria";
					        break;
					    case 5:
					        $scope.node.title="Acuerdos de la Verdad";
					        break;
					    case 6:
					        $scope.node.title="Diálogos de la memoria";
					        break;
					    case 7:
					        $scope.node.title="Cartillas";
					        break;
					    case 8:
					        $scope.node.title="Revistas";
					        break;
					    case 9:
					        $scope.node.title="Resúmenes";
					        break;

	
					}

				}else{
					$scope.node.title="Búsqueda de tags";
					
					url = urlServer_g+"index.php/books/search/" + searchString_g;
					
				}
			
				$.ajax({
					url: url,
					 dataType: "jsonp",
					 timeout: 13000,
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
							 trash     = ( oLibros[element.id] === undefined )? "hidden" : "visible";
							 star_img  = ( oFavs[element.id]   === undefined )? "img/estrella.png" : "img/estrella2.png";
							 buttonTxt = ( oLibros[element.id] === undefined )? "DESCARGAR" : "ABRIR";
							 books.push({
								 description : element.description, 
								 title       : element.title,
								 img         : element.img,
								 id          : "book" + i,
								 epub        : element.epub,
								 epubId      : element.id,
								 bookURL     : element.url,
								 trash       : trash,
								 buttonTxt   : buttonTxt,
								 star_img    : star_img
							 });
						 });

						 $scope.node.books = books;
						 
						 if( searchString_g === "" ){
						 	if (_.size(books)==0) {
						 		$scope.node.text="No se encontraron libros en esta sección";
						 		$scope.node.seccion_vacia=true;

						 	}


						 }else{
						 	$scope.node.search=true;
						 	$scope.node.seccion_vacia=true;
						 	if (_.size(books)==0) {
						 		$scope.node.text="No se encontraron resultados de la palabra \""+searchString_g+"\".";

						 	}else{
						 		$scope.node.text="Resultados de la palabra \""+searchString_g+"\".";

						 	}
						 	
							
						 	
						 	searchString_g = "";

						 }
						 
						 $scope.$apply();
						 Modal.hide();
					 },
					 error: function(e, text){
						 alert("Error en la conección: "+text);
						 Modal.hide();
					 }
				});
			}
			ons.createDialog('dialog-share.html').then(function(dialog) {
				$scope.dialog = dialog;
			});
			$scope.share=function(title, URL) {
				console.log("share");
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
				getnumbers();
			},
			error: function(e, text){
				console.log(text);
			}
		});
	});
	
})();
