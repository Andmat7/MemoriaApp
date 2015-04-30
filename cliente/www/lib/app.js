(function(){
	var module = angular.module('app', ['onsen']);
	module.controller('BookController', function($scope, $window) {
		ons.createPopover('popoverbook.html').then(function(popover) {
			$scope.popoverbook = popover;
		});
		
		$scope.show = function(e) {
			$scope.popoverbook.show(e);
		};
	ons.createDialog('dialogfavorites.html').then(function(dialog) {
			$scope.dialogfavorites = dialogfavorites;
		});
		
		
	}).controller("PopoverbookController", function($scope, $window) {
		
		$scope.share=function() {
			
			Popoverbook.hide();
			naviDialog.show()
			setTimeout('modal.hide()', 2000);
			
		};
		$scope.addfavorites=function() {
			
			Popoverbook.hide();
			dialogfavorites.show()
			setTimeout('modal.hide()', 2000);
			
		};
		
		
		
		
	},function(){} );
	
	
	module.controller("MainController", function($scope,$http,$timeout) {
		ons.ready(function() {
			// Actually myNavigator object sits in the root scope
			
			
		});
		$scope.node = {};
		// $http.get('http://localhost/servidor/index.php/books/lista').success(function(data) {
		//   $scope.node.books = data;
		// });
		//    setTimeout('Modal.hide()', 2000);x  
 		Modal.show();
		$.ajax({
			url: urlServer_g+"index.php/books/lista/",
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
						epub        : element.epub
					});
				});
				$scope.node = {	books : books };

			},
			error: function(e, text){
				console.log(text);
			}
		});
		$timeout(function(){
			Modal.hide();
// 			$route.reload();
		},2000);
			// 		$timeout(function() {
// 			$scope.node = {
// 				books :[
// 				{description:'Este informe no es una narrativa sobre un pasado remoto, sino sobre una realidad anclada en nuestro presente. Es un relato que se aparta explícitamente, por convicción y por mandato legal, de la idea de una memoria oficial del conflicto armado. Lejos de pretender erigirse en un corpus de verdades cerradas, quiere ser elemento de reflexión para un debate social y político abierto..', title:'Archivos de graves violaciones a los DDHH. Infracciones al DIH, Memoria Historica y conflicto Armado. Elementos para una Política Pública',img:'img/HUELLA INVISIBLE.jpg', id: "book0"},
// 				{description:'Este informe no es una narrativa sobre un pasado remoto, sino sobre una realidad anclada en nuestro presente. Es un relato que se aparta explícitamente, por convicción y por mandato legal, de la idea de una memoria oficial del conflicto armado. Lejos de pretender erigirse en un corpus de verdades cerradas, quiere ser elemento de reflexión para un debate social y político abierto.', title:'El Placer. mujeres, coca y guerra en el Bajo Putumayo',img:'lib/onsen/css/memoria/imgs/bojayamagen1.png', id: "book1"},
// 				{description:'Este informe no es una narrativa sobre un pasado remoto, sino sobre una realidad anclada en nuestro presente. Es un relato que se aparta explícitamente, por convicción y por mandato legal, de la idea de una memoria oficial del conflicto armado. Lejos de pretender erigirse en un corpus de verdades cerradas, quiere ser elemento de reflexión para un debate social y político abierto.', title:'Aportes teóricos y metodológicos para la valoración de los daños causados por la violencia',img:'img/RECORDAR Y NARRAR2.jpg', id: "book2"},
// 				]};
// 				Modal.hide();
// 				// alert('asdfasd');
// 				
// 				
// 		}, 2000);
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
})();
