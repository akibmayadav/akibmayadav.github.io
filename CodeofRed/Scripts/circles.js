function main_visualization(start_year,end_year,war_data,art_data)
{
// Main Canvas for the visualization

var count = 2017-1900;

var mainVisualizationDim = 500; 

var start_index = index(start_year);
var end_index = index(end_year);
var big_increment = 8;

// Boundary
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
									var small_increment = (mainVisualizationDim/2 - big_increment*10)/(count-10);
									//Loop1
									if(i <= start_index)
										radius = small_increment*i;
									//Loop2
									else if (i > start_index && i<end_index)
										radius = (small_increment*start_index)+big_increment*(i-start_index);
									//Loop3
									else
										radius = (small_increment*start_index)+(big_increment*(end_index-start_index))+small_increment*(i-end_index);
									return radius

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
									var small_increment = (mainVisualizationDim/2 - big_increment*10)/(count-10) ;
									//Loop1
									if(i < start_index)
										radius = small_increment*i + (small_increment/2);
									//Loop2
									else if (i >= start_index && i<end_index)
										radius = (small_increment*start_index)+big_increment*(i-start_index) + (big_increment/2);
									//Loop3
									else
										radius = (small_increment*start_index)+(big_increment*(end_index-start_index))+small_increment*(i-end_index) + (small_increment/2);
									return radius

								})
								.attr("fill","none")
								.attr("stroke-width",function(d,i){
									var width = 0 ;
									var small_increment = (mainVisualizationDim/2 - big_increment*10)/(count-10);
									//Loop1
									if(i < start_index)
										width = small_increment;
									//Loop2
									else if (i >= start_index && i<end_index)
										width = big_increment;
									//Loop3
									else
										width = small_increment;
									return width;

								})
								.attr("opacity",function(d,i){
									return d.wars/5;
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
													return d.values})
												.enter()
												.append("circle")
												.attr("id",function(d,i){
													return d.key})
												.attr("transform",function(d,i){
													var year = parseInt(d.key);
													var x = 0; 
													var y = 0;
													var ind = index(year);
													var small_increment = (mainVisualizationDim/2 - big_increment*10)/(count-10);
													//Loop1
													if(year < start_year)
													x = small_increment*ind; 
													//Loop2
													else if (year >= start_year && year<end_year)
													x = (small_increment*start_index)+big_increment*(ind-start_index);
													//Loop3
													else
													x = (small_increment*start_index)+(big_increment*(end_index-start_index))+small_increment*(ind-end_index);
													
													var final = "translate(" + x +"," +y +")" ;
													return final;
												})					
												.attr("cx",function(d,i){
													var year_i = index(parseInt(d.key));
													var radius = 0 ;
													var small_increment = (mainVisualizationDim/2 - big_increment*10)/(count-10);
													//Loop1
													if(year_i < start_index)
													radius = small_increment
													//Loop2
													else if (year_i >= start_index && year_i<end_index)
													radius = big_increment;
													//Loop3
													else
													radius = small_increment;
													return radius/4;
												})
												.attr("cy",function(d,i){
													var year_i = index(parseInt(d.key));
													var radius = 0 ;
													var small_increment = (mainVisualizationDim/2 - big_increment*10)/(count-10);
													//Loop1
													if(year_i < start_index)
													radius = small_increment
													//Loop2
													else if (year_i >= start_index && year_i<end_index)
													radius = big_increment;
													//Loop3
													else
													radius = small_increment;
													return radius/4;
												})
												.attr("r",function(d,i){
													var year_i = index(parseInt(d.key));
													var radius = 0 ;
													var small_increment = (mainVisualizationDim/2 - big_increment*10)/(count-10);
													//Loop1
													if(year_i < start_index)
													radius = small_increment
													//Loop2
													else if (year_i >= start_index && year_i<end_index)
													radius = big_increment;
													//Loop3
													else
													radius = small_increment;
													return radius/4;
												})
												.attr("fill","black")
												.attr("opacity",function(d,i){
													var num = d.values.length;
													return num/7;
												});
									
function index(year){ return year-1900;}

}