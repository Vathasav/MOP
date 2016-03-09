
/**
 * draw rounded rectangles to show chosen user stories and debt items
 * @param data
 * @param cost
 * @param duration
 */
function drawBar(data, cost, duration){

	var width = 280;
	var height = 400;
	var margin = 70;

	//separate requirements and debt items
	var separatedData = separateDebtItems(data);
	var userStories = separatedData[0];
	var debtItems = separatedData[1];


//	draw usere stories
	d3.select("#graphArea2")
	.append("div")
	.attr("class","chart")
	.selectAll("div.line")
	.data(userStories)
	.enter()
	.append("div")
	.attr("class","line");

	d3.selectAll("div.line")
	.append("div")
	.attr("class","bar")
	.style("width", function(d){ return 2000/20 + "px"})
	.text(function (d){ return d});

	// draw debt items
	d3.select("#graphArea3")
	.append("div")
	.attr("class","chart")
	.selectAll("div.items")
	.data(debtItems)
	.enter()
	.append("div")
	.attr("class","items");

	d3.selectAll("div.items")
	.append("div")
	.attr("class","roundedrect")
	.style("width", function(d){ return 2000/20 + "px"})
	.text(function (d){ return d});



	d3.select("#STV")
	.text("STV : "+cost);

	d3.select("#FIV")
	.text("FIV : "+duration);


}

function separateDebtItems(data){
	var userStories = [];
	var debtItems = [];

	data.forEach(function (f){

		if(f.startsWith('Req'))
			userStories.push(f);
		else {
			debtItems.push(f);
		}

	});

	return [userStories, debtItems];

}

function drawBar2(data){

	//width and height

	var w = 200;
	var height = 300;

	var svg = d3.select("body").append("svg").attr("width",w).attr("height",height);


	svg.selectAll("rect")
	.data(data)
	.enter()
	.append("rect")
	.attr("x",0)
	.attr("y",0)
	.attr("width", 20)
	.attr("height", 100);



}

/**
 * draw the actual graph with circles and axis
 * @param solutionsForEachGeneration
 * @param $scope
 */

function draw(solutionsForEachGeneration,$scope){
	"use strict";

	var data = solutionsForEachGeneration[20];

	var previousGenerationNumber = 20;

	var dataRough = {"stories":["userstory1","userstory2","userstory5"]};

	var margin = 80,
	width = 600,
	height = 550;

	d3.select("#graphArea").select("svg").remove();


	var svg = d3.select("#graphArea")
	.append("svg")
	.attr("width",width)
	.attr("height",height);

	// find the x-axis maximum and minimum values
	var x_extent = d3.extent(data, function(d){return d.duration});

	//create scale for x-axis, which generates values within x-extent
	// range in pixels and domain corresponds to data values

	var x_scale = d3.scale.linear()
	.range([margin, width-margin])
	.domain(x_extent);

	// find the y-axis maximum and minimum values
	var y_extent = d3.extent(data, function(d){return d.cost});

	//create scale for y-axis, which generates values within y-extent
	// range in pixels and domain corresponds to data values

	var y_scale = d3.scale.linear()
	.range([height-margin, margin])
	.domain(y_extent);

	//create x-axis
	var x_axis = d3.svg.axis().scale(x_scale);

	//append x-axis to svg

	d3.select("svg")
	.append("g")
	.attr("class", "x axis")
	.attr("transform","translate(0,"+ (height-margin)+")")
	.call(x_axis);

	//create y-axis
	var y_axis = d3.svg.axis().scale(y_scale).orient("left");

	//append y-axis to svg

	d3.select("svg")
	.append("g")
	.attr("class", "y axis")
	.attr("transform","translate("+ margin+",0)")
	.call(y_axis);

	// add x-axis label

	d3.select(".x.axis")
	.append("text")
	.text("Future investment value")
	.attr("x",(width/2) -margin)
	.attr("y", margin/1.5)
	.classed("graphStyle",true);


	d3.select(".y.axis")
	.append("text")
	.text("Short term value")
	.attr("transform", "rotate (-90, -45, 0) translate(-400)")
	.classed("graphStyle",true);;

	drawCirc(data);

	/*	// create lines between the circles


	var line = d3.svg.line()
		.x(function(d){return x_scale(d.duration)})
		.y(function(d){return y_scale(d.cost)});

	d3.select("svg")
		.append("path")
		.attr("d",line(data))
		.attr("class","cost_data");

	/*d3.selectAll("circle")
		.on("mouseover",function(d){
			d3.select(this)
				.append("text")
				.text("{"+d.duration+","+d.cost+"}")});*/


	function drawCirc(newData){   



		// enter update and exit states of d3 joins
		var circle =  svg.selectAll("circle")
		.data(newData);

		circle.enter().append("circle");

		x_scale.domain(d3.extent(newData, function(d){return d.duration}));
		y_scale.domain(d3.extent(newData, function(d){return d.cost}));

//		circle.attr("cx", function (d) { return x_scale(d.duration); })
//		.attr("cy", function (d) {return y_scale(d.cost); })
//		.attr("r", 10)
//		.style("fill", "red");


		//update transition	 
		circle.transition()  // Transition from old to new
		.duration(1000)  // Length of animation
		.each("start", function() {  // Start animation
			d3.select(this)  // 'this' means the current element
			.style("fill", "red")  // Change color
			.attr("r", 10);  // Change size
		})
		//  .delay(function(d, i) {
		//      return i / newData.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
		//  })
		//.ease("linear")  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
		.attr("cx", function(d) {
			return x_scale(d.duration);  // Circle's X
		})
		.attr("cy", function(d) {
			return y_scale(d.cost);  // Circle's Y
		})
		.each("end", function() {  // End animation
			d3.select(this)  // 'this' means the current element
			.transition()
			.duration(500)
			.style("fill", "RoyalBlue")  // Change color
			.attr("r", 10);  // Change radius
		});

		//update scales

		x_axis = d3.svg.axis().scale(x_scale);
		y_axis = d3.svg.axis().scale(y_scale).orient("left");

		//update X Axis
		d3.select(".x.axis")
		.transition()
		.duration(1000)
		.call(x_axis);

		//update Y axis
		d3.select(".y.axis")
		.transition()
		.duration(1000)
		.call(y_axis);


		//remove already existing elements
		circle.exit().remove();

		d3.selectAll("circle")
		.on("mouseover", function(d){
			d3.select(this)
			.transition()
			.attr("r",20);

			console.log(d.cost);

			// remove existing solutions before re-drawing
			//d3.selectAll("div.line").remove();
			d3.select("#graphArea2").selectAll("div.line").remove();
			d3.select("#graphArea3").selectAll("div.items").remove();

			drawBar(d.stories, d.cost, d.duration);
		})
		.on("mouseout", function(d){
			d3.select(this)
			.transition()
			.attr("r",10);
		});

	}


	// add functionality for slider
	d3.select("input[type=range]").on("change", function() {


		var generationNumber = this.value;

		var oldData = solutionsForEachGeneration[previousGenerationNumber];
		var newData = solutionsForEachGeneration[generationNumber];
		//var newDataToScale = solutionsForEachGeneration[generationNumber];

		drawCirc(newData);


		/*
		 x_axis = d3.svg.axis().scale(x_scale);
		 y_axis = d3.svg.axis().scale(y_scale).orient("left");

		 //update X Axis
			d3.select(".x.axis")
				.transition()
				.duration(1000)
				.call(x_axis);

		//update Y axis
			d3.select(".y.axis")
			.transition()
			.duration(1000)
			.call(y_axis);

			previousGenerationNumber = generationNumber;*/

	});

}


//d3.selectAll("circle")
//.on("mouseover", function(d){
//d3.select(this)
//.transition()
//.attr("r",20);

//console.log(d.cost);

////remove existing solutions before re-drawing
////d3.selectAll("div.line").remove();
//d3.select("#graphArea2").selectAll("div.line").remove();
//d3.select("#graphArea3").selectAll("div.items").remove();
//drawBar(d.stories, d.cost, d.duration);



////remove existing lines


///*		d3.selectAll("div.line")
//.data(d.stories)
//.enter()
//.append("div")
//.attr("class","line");

//d3.selectAll("div.line")
//.append("div")
//.attr("class","bar")
//.style("width", function(d){ return 2000/100 + "px"})
//.text(function (d){ return d});
//*/

//})
//.on("mouseout", function(d){
//d3.select(this)
//.transition()
//.attr("r",10);
//});

/*d3.selectAll("circle")
		 .on("mousein.tooltip", function(d){
		 d3.select(this)
		 .append("text")
		 .text("d.cost")
		 .attr("x", x_scale(d.duration)+10)
		 .attr("y", y_scale(d.cost)-10);
		 });*/


/*	function updateData(){

			var data =  {

                                "duration":60,
								"cost":7260,
								"stories":["userstory1","userstory3","userstory4","userstory5"]
                            };

			x_extent = d3.extent(data, function(d){return d.duration});
			y_extent = d3.extent(data, function(d){return d.cost});

			x_scale.domain(x_extent);
			y_scale.domain(y_extent);

			x_axis = d3.svg.axis().scale(x_scale);
			y_axis = d3.svg.axis().scale(y_scale).orient("left");


			var svg = d3.select("#graphArea").transition();

			svg.selectAll("circle").attr("r",10);


			svg.select(".x.axis").call(x_axis);
			svg.select(".y.axis").call(y_axis);







		} */

//updateData();


