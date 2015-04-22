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


module.controller("HelloController", function($scope,$http) {
  $scope.node = {};
    // $http.get('http://localhost/servidor/index.php/books/lista').success(function(data) {
    //   $scope.node.books = data;
    // });
        $scope.node = {
                books :[
              {description:'Este informe no es una narrativa sobre un pasado remoto, sino sobre una realidad anclada en nuestro presente. Es un relato que se aparta explícitamente, por convicción y por mandato legal, de la idea de una memoria oficial del conflicto armado. Lejos de pretender erigirse en un corpus de verdades cerradas, quiere ser elemento de reflexión para un debate social y político abierto.', title:'Bojayá. La guerra sin límites',img:'lib/onsen/css/memoria/imgs/bojayamagen1.png'},
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
            console.log(1)
            

            if(book.toggled===undefined){
                book.toggled=false;
                
            }

            book.toggled = !book.toggled;
            console.log(2)
           
        };
        
        

 });
})();