

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
             	loadDataIntoModel($scope.variables, fileData , $scope.debtItems);
            });

		});

	};


	console.log(fileData);

});

// service for loading file data asynchronously
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

// route the requests to appropriate views and controllers
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

// load data from file into the model
function loadDataIntoModel(data, fileContent, debtData){


		fileContent.forEach(function(f){
			var arrayOfString = f.split(" ");
			if (arrayOfString[0] !== "")
				data.push({name:arrayOfString[0],cost:arrayOfString[1],satisfaction:arrayOfString[2]});

				if(arrayOfString.length > 3)
				debtData.push({debtItemName:arrayOfString[3],principal:arrayOfString[4],futureCost:arrayOfString[5]});
	});

}
