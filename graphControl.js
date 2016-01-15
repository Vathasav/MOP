function drawBar(data, cost, duration){

		var width = 280;
		var height = 400;
		var margin = 70;




	d3.select("#graphArea2")
		.append("div")
			.attr("class","chart")
		.selectAll("div.line")
		.data(data)
		.enter()
		.append("div")
			.attr("class","line");

	d3.selectAll("div.line")
		.append("div")
			.attr("class","bar")
			.style("width", function(d){ return 2000/20 + "px"})
			.text(function (d){ return d});

	d3.select("#STV")
			.text("STV : "+cost);

	d3.select("#FIV")
					.text("FIV : "+duration);


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

		/*
			.attr("class","line");

	svg.selectAll("rect.line")
		.append("div")
			.attr("class","bar")
			.style("width", function(d){ return 2000/100 + "px"})
			.text(function (d){ return d});




*/

	}



    function draw(data,$scope){
    "use strict";

	var dataRough = {"stories":["userstory1","userstory2","userstory5"]};




<<<<<<< HEAD
	var margin = 55,
=======
	var margin = 80,
>>>>>>> master
		width = 600,
		height = 550;

	 d3.select("#graphArea").select("svg").remove();

    d3.select("#graphArea")
		.append("svg")
			.attr("width",width)
			.attr("height",height)
		.selectAll("circle")
		.data(data)
		.enter()
		.append("circle");

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


	d3.selectAll("circle")
			.attr("cx",function(d){return x_scale(d.duration)})
			.attr("cy",function(d){return y_scale(d.cost)});

	d3.selectAll("circle")
			.attr("r",10);

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
<<<<<<< HEAD
			.attr("y", margin/1.5);


	d3.select(".y.axis")
		.append("text")
			.text("Short term value")
			.attr("transform", "rotate (-90, -43, 0) translate(-200)");
=======
			.attr("y", margin/1.5)
			.classed("graphStyle",true);


			d3.select(".y.axis")
							.append("text")
								.text("Short term value")
								.attr("transform", "rotate (-90, -45, 0) translate(-400)")
								.classed("graphStyle",true);;

/*			d3.select(".y.axis")
				.append("text")
					.text("Short term value")
					.attr("transform", "rotate (-90, -35, 0) translate(-200)")
					.attr("dy","5em");

*/

>>>>>>> master


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

	//drawBar("");



	d3.selectAll("circle")
		.on("mouseover", function(d){
			 d3.select(this)
			 .transition()
			 .attr("r",20);

			 console.log(d.cost);

	    //d3.selectAll("div.line").remove();
	    d3.select("#graphArea2").selectAll("div.line").remove();
			drawBar(d.stories, d.cost, d.duration);



		//remove existing lines


/*		d3.selectAll("div.line")
		.data(d.stories)
		.enter()
		.append("div")
			.attr("class","line");

d3.selectAll("div.line")
		.append("div")
			.attr("class","bar")
			.style("width", function(d){ return 2000/100 + "px"})
			.text(function (d){ return d});
*/

			 })
			 .on("mouseout", function(d){
			 d3.select(this)
			 .transition()
			 .attr("r",10);
			 });

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

	//	updateData();


    }
