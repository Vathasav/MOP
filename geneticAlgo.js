//"use strict";
var geneticAlgorithm = (function geneticAlgorithm() {



    /*	var populationSize = 10;
	var generationSize = 10;
	var chromosomeLength = 10;*/

    var Chromosome = function() {

        this.cost = 0;
        this.structure = [];
        this.satisfaction = 0;
        this.shortTermValue = 0;
        this.futureInvestmentValue = 0;

    }
    ;

    var Gene = function() {

        this.cost = 0;
        this.satisfaction = 0;
        this.value = 0;
        this.name = "";
        this.type = "";
        this.principal = 0;
        this.futureCost = 0;
        this.dependencies = {};

    }
    ;

    Gene.prototype.Random = function() {
        this.value = getRandomIntInclusive(0, 1);
        // this.cost = getRandomIntInclusive(5,10);
        //this.satisfaction = getRandomIntInclusive(20,30);
    }
    ;

    Chromosome.prototype.AddGene = function(size, variable, debtItems) {



        // create chromsoome with given length and data
        var ind = 0;
        var debtIndex = 0;
        while (size--) {

            var individualgene = new Gene();
            individualgene.Random();

            if(ind < variable.length){
              individualgene.cost = Number(variable[ind].cost);
              individualgene.name = variable[ind].name;
              individualgene.satisfaction = Number(variable[ind].satisfaction);
              individualgene.type = "f";

              if(!(variable[ind].dependencies === undefined))
                individualgene.dependencies = variable[ind].dependencies.split(",");

            }else{
              individualgene.type = "d";
              individualgene.name = debtItems[debtIndex].debtItemName;
              individualgene.principal = Number(debtItems[debtIndex].principal);
              individualgene.futureCost = Number(debtItems[debtIndex].futureCost);
              debtIndex++;
            }

            this.structure.push(individualgene);
            ind++;

        }

    }
    ;

    // calculate fitness of chromosome

    Chromosome.prototype.Fitness = function() {

      var totalSTV = 0;

      var totalFIV = 0;

      var totalCost = 0;

      var assocArray = [];

      //collect all the debt items to an associative Array
      this.structure.forEach(function (f){
        if(f.type === "d"){
            assocArray[f.name] = f;
        }

      });


      for (var i in this.structure) {

          var gene = this.structure[i];

          if (gene.value) {

              if(gene.type == "f"){
                totalSTV = totalSTV + gene.satisfaction;

                  if(gene.dependencies.length > 0){
                          var debtCost = 0;
                          gene.dependencies.forEach(function (f){

                            if(assocArray[f].value === 0){
                                debtCost = debtCost + assocArray[f].futureCost * (0.5);
                            }

                          });

                          totalCost = totalCost + gene.cost + debtCost ;

                  }else{
                    totalCost = totalCost + gene.cost;
                  }

              }
              else if (gene.type == "d"){
                totalFIV = totalFIV + gene.futureCost;
                totalCost = totalCost + gene.principal;
              }
          }


      }

      this.shortTermValue = totalSTV;
      this.futureInvestmentValue = totalFIV;

      // temporary fix
      this.cost = totalSTV;
      this.satisfaction = totalFIV;


      if (totalCost > 350){

        this.shortTermValue = 0;
        this.futureInvestmentValue = 0;

        this.cost = 0;
        this.satisfaction = 0;
      }


        /*    var fitness = 0;
    for(var i in this.structure){

        var gene = this.structure[i];

        if(gene.value)
            fitness = fitness + 5*(gene.satisfaction)-4*(gene.cost);

    }

   this.cost = fitness;




        var totalSatisfaction = 0;

        var totalCost = 0;
        for (var i in this.structure) {

            var gene = this.structure[i];

            if (gene.value) {
                totalCost = totalCost + gene.cost;
                totalSatisfaction = totalSatisfaction + gene.satisfaction;

            }


        }

        this.cost = totalCost;
        this.satisfaction = totalSatisfaction; */
    };


    Chromosome.prototype.Mutate = function() {

        var index = getRandomIntInclusive(0, this.structure.length - 1);

        var gene = this.structure[index];

        if (gene.value === 0)
            gene.value = 1;
        else
            gene.value = 0;

    }
    ;

    function Crossover(parent1,parent2){

      var crossoverpoint = Math.round(parent1.structure.length / 2) - 1;


      var child1 = Object.create(parent1);
      child1.cost = 0;
      child1.satisfaction = 0;
      child1.shortTermValue = 0;
      child1.futureInvestmentValue = 0;

      var child2 = Object.create(parent2);
      child2.cost = 0;
      child2.satisfaction = 0;
      child2.shortTermValue = 0;
      child2.futureInvestmentValue = 0;

      child1.structure = parent1.structure.slice(0, crossoverpoint).concat(parent2.structure.slice(crossoverpoint, parent2.structure.length));

      child2.structure = parent2.structure.slice(0, crossoverpoint).concat(parent1.structure.slice(crossoverpoint, parent1.structure.length));

      child1.Fitness();
      child2.Fitness();

      checkChromosome(child1);
      checkChromosome(child2);




      printCromosome(child1);

      printCromosome(child2);

      return [child1, child2];

    }

  /*  Chromosome.prototype.Crossover = function(chromosome) {

        var crossoverpoint = Math.round(this.structure.length / 2) - 1;

        printCromosome(this);

        //print the argument

        printCromosome(chromosome);

        var child1 = Object.create(chromosome);
        child1.cost = 0;
        child1.satisfaction = 0;
        child1.shortTermValue = 0;
        child1.futureInvestmentValue = 0;

        var child2 = Object.create(chromosome);
        child2.cost = 0;
        child2.satisfaction = 0;
        child2.shortTermValue = 0;
        child2.futureInvestmentValue = 0;

        child1.structure = this.structure.slice(0, crossoverpoint).concat(chromosome.structure.slice(crossoverpoint, chromosome.structure.length));

        child2.structure = chromosome.structure.slice(0, crossoverpoint).concat(this.structure.slice(crossoverpoint, chromosome.structure.length));

        child1.Fitness();
        child2.Fitness();

        checkChromosome(child1);
        checkChromosome(child2);


        printCromosome(child1);

        printCromosome(child2);

        return [child1, child2];


    }
    ;*/

    function getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function getStructure(chromosome) {

        if (chromosome instanceof Chromosome) {

            var suffix = "userstory";
            var index = 0;
            var sol = [];
            //var cost = 0;
            //var satisfaction = 0;

            chromosome.structure.forEach(function(f) {
                index++;

                if (f.value == 1) {
                    sol.push(f.name);
                    //cost = cost + f.cost;
                    //satisfaction = satisfaction + f.satisfaction;
                }

            });

            return [sol, (chromosome.cost), chromosome.satisfaction];
        }

    }

    function printCromosome(chromosome) {

        console.log("Enter >----------------------------------<");

        if (chromosome instanceof Chromosome) {
            var struct = "";
            chromosome.structure.forEach(function(f) {
                struct = struct + (f.value)
            });

            console.log(struct);
        }
        else if (chromosome instanceof Array) {

            chromosome.forEach(function(f) {

                if (f instanceof Chromosome)
                    console.log(f.cost + "," + f.satisfaction);
            });
        }

        console.log("Exit >----------------------------------<");

    }

    //console.log(getRandomIntInclusive(0,1));

    // create a set of population



    var Population = function(size, chromosomeLength, variables, debtItems) {

        this.members = [];



        while (size--) {
            var chromosome = new Chromosome();
            chromosome.AddGene(chromosomeLength, variables, debtItems);

            this.members.push(chromosome);

        }

    }
    ;

    // sort in ascending order
    Population.prototype.Sort = function() {
        this.members.sort(function(a, b) {
            return a.cost - b.cost;
        });


    }
    ;

    // sort according to Non-dominated individuals
    Population.prototype.NonDominatedSort = function(populationSize) {

        var selectedIndividuals = [];
        var lastGeneration = false;

        if(arguments.length > 1)
            lastGeneration = true;

        do{


          var assocArray = [];
          var removeElementsIndex = [];
          var remainingElements = [];
          // remove duplicate individuals
          var index = 0;
          this.members.forEach(function (f){
            if(assocArray.length > 0 && assocArray[f.cost] === f.satisfaction){
              //duplicate member
              removeElementsIndex.push(index);
              index++;
            }else{
              assocArray[f.cost] = f.satisfaction;
              remainingElements.push(f);
              index++;
            }

          });

        this.members = remainingElements;



        this.members.sort(function(a, b) {
            if (a.satisfaction > b.satisfaction)
                return -1;
            else if (a.satisfaction == b.satisfaction){
                    if(a.cost > b.cost)
                        return -1;
                    else
                        return 1;
            }
            else if(a.satisfaction < b.satisfaction)
              return 1;

        });

        printCromosome(this.members);

        // initialize for every iteration
        var remainingIndividuals = [];

//        console.log(this.members);


        //select individuals



        for (var i = 0; i < this.members.length; i++) {

            var highCost = this.members[i].cost;
            var bestSatisfaction = this.members[i].satisfaction;
            var toInclude = true;


            for (var j = 0; j < this.members.length; j++) {

              if( j !== i){

                if ((this.members[j].cost >= highCost && this.members[j].satisfaction >= bestSatisfaction) ) {


                    toInclude = false;
                    break;

                }

              }

            }

            if (toInclude){
                selectedIndividuals.push(this.members[i]);
               }
               else{
                   remainingIndividuals.push(this.members[i]);
               }


        }

        this.members.splice(0,this.members.length);
        Array.prototype.push.apply(this.members, remainingIndividuals);


        printCromosome(selectedIndividuals);

        if(lastGeneration == true )
             return selectedIndividuals;

        }while (selectedIndividuals.length < populationSize && remainingIndividuals.length != 0);


    return selectedIndividuals;

    };


    Population.prototype.ReadyInitialPopulation = function() {

        for (var i = 0; i < this.members.length; i++) {

            this.members[i].Fitness();

        }

        this.Sort();

    }
    ;

    var cumulativeFitness = function() {
        this.low = 0;
        this.high = 0;
    }
    ;

    // use binary search to find the slice
    function getIndex(chosenSlice, totalFitness) {



        var collectFitnesses = [];

        if (totalFitness instanceof Array) {

            totalFitness.forEach(function(f) {

                collectFitnesses.push(f);

            });
        }

        /*		// binary search
		var low = 0;
		var high = totalFitness.length - 1;
		while(low <= high){

				var pivot = Math.floor((high + low)/2);
			 	var middle = totalFitness[pivot];

				if(chosenSlice > middle)
					low = middle + 1;
				else if (chosenSlice < middle)
				 high = middle - 1;
				else
				 //found the element


		}*/


        var pivot = Math.floor((totalFitness.length - 1) / 2);

        if (totalFitness[pivot].high < chosenSlice) {
            // look in greater half

            for (var k = pivot + 1; k < totalFitness.length; k++) {

                if (chosenSlice >= totalFitness[k].low && chosenSlice < totalFitness[k].high) {
                    return k;
                }

            }


        } else {
            // look in smaller half

            for (var k = 0; k <= pivot; k++) {

                if (chosenSlice >= totalFitness[k].low && chosenSlice < totalFitness[k].high) {
                    return k;
                }

            }

        }


    }

    function checkChromosome(chromosome){

      var cost = 0;
      chromosome.structure.forEach(function (f){
                if(f.value)
                    cost = cost + f.futureCost;

      });

      if(cost != chromosome.satisfaction){
        console.log("<------------------possible error------------------>");
        console.log("possible error"+chromosome.cost);
        console.log("possible error"+chromosome.cost);
        console.log("possible error"+chromosome.cost);
        console.log("<------------------possible error------------------End>");
      }




    }

    Population.prototype.Evolve = function(generationNumber, populationSize) {



      while (generationNumber--) {

            var mutate = false;

            var individualsToCrossover = [];

            var keepOldChromosomes = [];

            for (var i = 0; i < this.members.length; i++) {


                var chromosome = this.members[i];

                var oldChromosome = Object.create(this.members[i]);
                oldChromosome.structure = chromosome.structure;
                oldChromosome.cost = chromosome.cost;
                oldChromosome.satisfaction = chromosome.satisfaction;

                var oldFitness = oldChromosome.cost;

                var probability = getRandomIntInclusive(1, 100);

                // mutation probability 70%, crossover probability 30%
                if (probability > 30){
                    mutate = true;
                }else{
                   individualsToCrossover.push(chromosome);
                   mutate = false;
                }


                if (mutate) {

                    chromosome.Mutate();





                chromosome.Fitness();

                //var newfitness = chromosome.cost;

                var newCost = chromosome.cost;
                var newSatisfaction = chromosome.satisfaction;

                // check if the mutated chromosome is better or not

                //if(oldFitness > newfitness){
                //    keepOldChromosomes.push(oldChromosome);
                //}

                if (newCost > oldChromosome.cost && newSatisfaction < oldChromosome.satisfaction) {
                    keepOldChromosomes.push(oldChromosome);
                }

            }




            }

            // perform crossover between individuals
            // add them to the total population

            var index = 0;

            var childChromosomes = [];

            while (index < individualsToCrossover.length){

              var parent1 = individualsToCrossover[index];

              var parent2 = individualsToCrossover[index++];

              var children = Crossover(parent1,parent2);

              // calculate fitness of children
              children[0].Fitness();
              children[1].Fitness();

              childChromosomes.push(children[0]);
              childChromosomes.push(children[1]);


            }

            // reevaluate fitnesses
            childChromosomes.forEach(function (f){
              f.Fitness();
            });

            Array.prototype.push.apply(this.members, childChromosomes);


            Array.prototype.push.apply(this.members, keepOldChromosomes);

            console.log("-------------before selection------------\n\n");

            printCromosome(this.members);

        //    this.members.sort();

            // if lastGeneration pass lastgeneration
            var nonDominatedSolutions = [];

            if(generationNumber == 0){
                nonDominatedSolutions = this.NonDominatedSort(populationSize, 0);
            }
            else{
                nonDominatedSolutions = this.NonDominatedSort(populationSize);
            }


            this.members = nonDominatedSolutions;



            /**Roulette wheel selection
   *
    var newGenerationPopulation = [];

    while(newGenerationPopulation.length < populationSize){


    var totalFitness = [];

     var cumF = new cumulativeFitness();
     cumF.low = 0;
     cumF.high = this.members[0].cost;
     totalFitness.push(cumF);



    for(var k = 1; k < this.members.length; k++){

     var cumF = new cumulativeFitness();
     cumF.low = totalFitness[k-1].high;
     cumF.high = cumF.low + this.members[k].cost;

     totalFitness.push(cumF);


    }

    console.log(totalFitness);

    var chosenSlice = Math.random()*(totalFitness[totalFitness.length-1].high);

    var index = getIndex(chosenSlice,totalFitness);

    newGenerationPopulation.push(this.members[index]);

    console.log(chosenSlice);

    }

    // apply selection

    console.log(newGenerationPopulation.length);

    this.members = newGenerationPopulation; */

            //apply Elitist selection

            var elementsToRemove = this.members.length - populationSize;

            //this.members.splice(0, elementsToRemove);

            this.members.splice((populationSize -1), elementsToRemove);

            console.log("-------------After selection------------\n\n");

            printCromosome(this.members);



        }

        console.log("After evolution");

        var solutions = [];


        for (var j = 0; j < this.members.length; j++) {




            console.log(this.members[j].cost);
            var solutionData = new Object();

            solutionData.cost = -this.members[j].cost;
            solutionData.totalSatisfaction = this.members[j].satisfaction;

            var arr = getStructure(this.members[j]);
            solutionData.struct = arr[0];

            solutionData.costData = arr[1];
            solutionData.satisfaction = arr[2];




            solutions.push(solutionData);



        }

        printCromosome(this.members);

        return solutions;

    }
    ;

    function init(populationSize, generationSize, variables, debtItems) {

        //set GA settings

        var chromosomeSize = variables.length + debtItems.length;

        //initialize population and start the algorithm

        var pop = new Population(populationSize,chromosomeSize,variables, debtItems);
        pop.ReadyInitialPopulation();

        return pop.Evolve(generationSize, populationSize);




    }

    return {
        init: init
    };



})();
