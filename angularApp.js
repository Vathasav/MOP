

var gaApp = angular.module("gaApp",["ui.router"]);

//factory for storing inuput variables
	gaApp.factory("variablesFactory",function(){

	var factory = {};

	var variables = [];

	var debtItems = [];

	factory.getVariables = function(){
					return variables;
	}

	factory.getDebtItems = function(){
					return debtItems;
	}

	return factory;

});

//controller for reading file data and running the algorithm
gaApp.controller("inputhandler",function($scope,variablesFactory,FileInputService,$q){

	  /*var populationSize = $scope.populationSize;
    var generationSize = $scope.generationSize;
    var chromosomeSize = $scope.chromosomeSize;
    var solutionCost = $scope.solutionCost;

		*/
    $scope.variables = variablesFactory.getVariables();

		$scope.debtItems = variablesFactory.getDebtItems();

		$scope.addNewDebtItem = function (){

				variablesFactory.getDebtItems().push({debtItemName:'', principal:'', futureCost:''});
		}

		$scope.addVariable = function(variables){

				variablesFactory.getVariables().push({name:'', cost:'', satisfaction:''});

		}

    console.log("call the algorithm");
    console.log($scope.populationSize);

	  //function to start algorithm
 		$scope.startAlgo = function(){

		 		$scope.variables = variablesFactory.getVariables();

	 			// start the algorithm

	 			var lastGenerationData = geneticAlgorithm.init($scope.populationSize, $scope.generationSize,$scope.variables.length,$scope.variables);

				var dataSentToGraph = [];

				lastGenerationData.forEach(function(f){
						var newObject = new Object();


						// changed for pareto
						newObject.cost = f.costData;
						newObject.duration = f.satisfaction;

						//newObject.cost = f.cost;
						//newObject.duration = f.totalSatisfaction;
						newObject.stories = f.struct;

						dataSentToGraph.push(newObject);

				});

	  //	data.push({"duration":0,"cost":0,"stories":[]});

				console.log(dataSentToGraph);

				$scope.results = dataSentToGraph;

				draw($scope.results);
  }

	$scope.drawGraph = function (){
					draw($scope.results);
	}

	//read data from file

	var fileData = "";
	$scope.onFileUpload = function(element){
		$scope.$apply(function(scope){
			 	var file = element.files[0];
             	FileInputService.readFileAsync(file).then(function (fileInputContent) {
             	fileData = fileInputContent;
             	loadDataIntoModel($scope.variables, fileData);
            });

		});

	};


	console.log(fileData);

});

gaApp.service('FileInputService', function ($q) {

    this.readFileAsync = function (file) {
        var deferred = $q.defer(),
        fileReader = new FileReader(),
        fileName = file.name,
        fileType = file.type,
        fileSize = file.size;
        lastModified = file.lastModified;
        lastModifiedDate = file.lastModifiedDate;
        fileReader.readAsText(file);

        /*Reference: Other options*/
        //fileReader.readAsDataURL(file);
        //fileReader.readAsBinaryString(file);
        //fileReader.readAsArrayBuffer(file);

        fileReader.onload = function (e) {

						console.log(this.result);

						// By lines
						var lines = this.result.split('\n');
			      deferred.resolve(lines);
        };
        return deferred.promise;
    };
});


gaApp.config(function($stateProvider, $urlRouterProvider){


	$stateProvider
		.state('home', {
				url: '/home',
				templateUrl: "home.html",
				controller: 'inputhandler'
		})
		.state('about', {
				url: '/about',
				templateUrl: "about.html",
				controller: 'inputhandler'
		})
		.state('tool', {
				url: '/tool',
				templateUrl: "tool.html",
				controller: 'inputhandler'
		})
			.state('tool.input', {
					url: "/input",
					templateUrl: "tool.input.html",
					controller: 'inputhandler'
			})
			.state('tool.results', {
					url: "/results",
					templateUrl: "tool.results.html",
					controller: 'inputhandler'
			})

		.state('contact', {
				url: "/contact",
				templateUrl: "contact.html"
		})

		// For any unmatched url, send to /route1
		$urlRouterProvider.otherwise("/home")

});


/*gaApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/Home', {
	templateUrl: 'home.html',
	controller: 'inputhandler'
      }).
      when('/About', {
	templateUrl: 'about.html',
	controller: 'inputhandler'
      }).
      when('/Tool', {
	templateUrl: 'tool.html',
	controller: 'inputhandler'
      }).
			when('/Tool/Input', {
	templateUrl: 'tool.html',
	controller: 'inputhandler'
			}).
			when('/Tool/Results', {
	templateUrl: 'tool.html',
	controller: 'inputhandler'
			}).
      otherwise({
	redirectTo: '/Home'
      });
}]);*/

function loadDataIntoModel(data, fileContent){


		fileContent.forEach(function(f){
			var arrayOfString = f.split(" ");
			if (arrayOfString[0] !== "")
				data.push({name:arrayOfString[0],cost:arrayOfString[1],satisfaction:arrayOfString[2]});
	});

}

	       /*         var data2 = [
                            {
								"duration":25,
								"cost":7400,
								"stories":["userstory1","userstory2","userstory3","userstory4","userstory5"]
                            },
                            {

                                "duration":40,
								"cost":5300,
								"stories":["userstory1","userstory2","userstory3"]
                            },
                            {

                                "duration":60,
								"cost":7260,
								"stories":["userstory1","userstory3","userstory4","userstory5"]
                            }
                        ];


   var sort = function(values){

        var low = 0;
        var high = values.length-1;

         function quicksort(low, high)       {

         	if(low >= high)
         	    return;


         	var i = low
         	var j = high;

          var pivot = Math.round(low + (high-low)/2);
           var middle = values[pivot];

         while (i <= j){

              while(values[i] < middle)
                   i++;

              while(values[j] > middle)
                 j--;

             if(i <= j){

             var temp = values[i];
             values[i]=values[j];
             values[j]=temp;

             i++;
             j--;


}
}

      if (low < j)
         quicksort(low,j);
      if( i < high)
         quicksort(i,high);






}
quicksort(low,high);

console.log(values);


 return values;

}


*/
