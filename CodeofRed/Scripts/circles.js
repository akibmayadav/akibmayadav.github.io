function main_visualization(start_year,end_year,war_data,art_data)
{
// Main Canvas for the visualization

var count = end_year-start_year;

var mainVisualizationDim = 500; 

var big_increment = 8;

// Boundary
			var tooltip = d3.select("body").append("div")
    					 .attr("class", "tooltip")
   						 .style("opacity", 0);

			var circles = d3.select('#Year_Circles')
						     .selectAll("circle")
						     .data(war_data);
								
						circles.enter()
								.append("circle");

						circles.attr("cx",mainVisualizationDim/2)
								.attr("cy",mainVisualizationDim/2)
								.attr("id",function(d,i){return d.year})
								.attr("r",function(d,i){
									var radius = 0 ;
									var increment = mainVisualizationDim/(2*count);
									radius = increment*(i+1);
									return radius;

								})
								.attr("fill","none")
								.attr("stroke-width",0.01)
								.attr("opacity",0.5)
								.attr("stroke","black");

				circles.exit().remove("circle")

// War Fill

				var circles_fill = d3.select("#War_Fillers")
									.selectAll("circle")
								    .data(war_data);
								
					circles_fill.enter()
								.append("circle")
								
					circles_fill.attr("cx",mainVisualizationDim/2)
								.attr("cy",mainVisualizationDim/2)
								.attr("id",function(d,i){return d.year+"_filler"})
								.attr("r",function(d,i){
									var radius = 0 ;
									var increment = mainVisualizationDim/(2*count);
									radius = increment*i + (increment/2);
									return radius;

								})
								.attr("fill","none")
								.attr("stroke-width",function(d,i){
									var increment = mainVisualizationDim/(2*count);
									return increment;

								})
								.attr("opacity",function(d,i){
									return d.wars/5

								})
								.attr("stroke","#b2332a");

				circles_fill.exit().remove('circle')

// Art Dots 

				// g for every artist 
				var art_dots = d3.select("#Art_Dots")
									.selectAll("g")
									.data(art_data);
									

				var art_dots_1 = art_dots.enter()
								    .append("g")
									.attr("id",function(d,i){
										return(d.key)})
									.attr("transform",function(d,i){
										var rot = i*360/art_data.length;
										var tran = "translate("+mainVisualizationDim/2+","+mainVisualizationDim/2+")";
										var final = "rotate(" + rot + ")" ;
										return tran+final;
									});	

				// Internal Points
				var small_circle_radius = 0.3;
				var big_circle_radius = 0.6;
				// circles for every active year, every artist
				var art_dots_2 = art_dots_1.selectAll("circle")
												.data(function(d,i){
													var circle_data = [];
													// console.log(d.values);
													for ( var c = 0; c < d.values.length ;c++)
													{
														var year = d.values[c].key ;
														if ( year>= start_year && year<end_year)
														{
															circle_data.push(d.values[c])
														}
													}
													return circle_data})
												.enter()
												.append("circle")
												.attr("id",function(d,i){
													return d.key})
												.attr("transform",function(d,i){
													var year = parseInt(d.key);
													var x = 0; 
													var y = 0;
													var ind = year-start_year;
													var radius = 0 ;
													var increment = mainVisualizationDim/(2*count);
													radius = increment*ind + (increment/2);	
													var final = "translate(" + radius +"," +y +")" ;
													return final;
												})					
												.attr("cx",function(d,i){
													var increment = mainVisualizationDim/(2*count);
													return 0;
												})
												.attr("cy",function(d,i){
													var increment = mainVisualizationDim/(2*count);
													return 0;
												})
												.attr("r",function(d,i){
													var increment = mainVisualizationDim/(2*count);
													return increment/4;
												})
												.attr("fill","black")
												.on("mouseover",mouseover_function)
												.on("mouseout",mouseout_function)
												.attr("opacity",function(d,i){
													var num = d.values.length;
													return num/7;
												});



			function mouseover_function(d)
			{
				tooltip.transition()
         			.duration(100)
         			.style("opacity", .9);

				var artist_name_line = "<span id='ArtistName'>"+d.values[0].artist_name + " ( "+d.key+" ) " +"</span>";
				var l = d.values.length;
				var arts = "\n";
				for ( var a = 0 ; a<l;a++) {
					arts = arts + d.values[a].art_name + "<br>";
				}

				tooltip.html(artist_name_line+"<br>"+arts)
         		.style("left", (d3.event.pageX) + "px")
         		.style("top", (d3.event.pageY - 28) + "px");
			}

			function mouseout_function(d)
			{
				tooltip.transition()
         			.duration(100)
         			.style("opacity", 0);
			}

}