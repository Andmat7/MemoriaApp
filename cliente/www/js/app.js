var module = angular.module('app', ['onsen'])
.controller("HelloController", function($scope) {
        $scope.node = {
                books :[
              {description:'Este informe no es una narrativa sobre un pasado remoto, sino sobre una realidad anclada en nuestro presente. Es un relato que se aparta explícitamente, por convicción y por mandato legal, de la idea de una memoria oficial del conflicto armado. Lejos de pretender erigirse en un corpus de verdades cerradas, quiere ser elemento de reflexión para un debate social y político abierto..', title:'Bojayá. La guerra sin límites',img:'lib/onsen/css/memoria/imgs/bojayamagen1.png'},
              {description:'Este informe no es una narrativa sobre un pasado remoto, sino sobre una realidad anclada en nuestro presente. Es un relato que se aparta explícitamente, por convicción y por mandato legal, de la idea de una memoria oficial del conflicto armado. Lejos de pretender erigirse en un corpus de verdades cerradas, quiere ser elemento de reflexión para un debate social y político abierto..', title:'Bojayá. La guerra sin límites',img:'lib/onsen/css/memoria/imgs/bojayamagen1.png'}
            ]};
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
            console.log(book);

            if(book.toggled===undefined){
                book.toggled=true;                 
            }

            book.toggled = !book.toggled;
           
        };
        
        

 },function(){} );

