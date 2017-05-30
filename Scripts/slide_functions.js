// Starting Variables
var svgHeight = 700;
var svgWidth = 1200;
var svgMargin = 50;
var rows = 30 ; 
var columns = 40 ;
var dim_square = 20 ;
var margin_square = 1; 

var colors = {"yellow_c":"#F2D647",
				"white_c":"#095C7E",
				"black_c":"#a52969",
				"asian_c":"#43B67A",
				"latino_c":"#D05555",
				"others_c":"#7CC5C2",
				"noownership":"#404040"}

// SVG for making California Map
var map_svg = d3.select("body")
				.append("svg")
				.attr("id","map_svg")
				.attr("width",100)
				.attr("height",100)

// SVG for main visualization
var mainSvg =  d3.select("body")
				.append("svg")
				.attr("id","mainSvg")
				.attr("width",svgWidth)
				.attr("height",svgHeight);

// SVG for main visualization
var pictureSvg =  d3.select("body")
				.append("svg")
				.attr("id","pictureSvg")
				.attr("width",svgWidth)
				.attr("height",svgHeight);


// SLIDE 1 - DOWN : CALIFORNIA MAP 
var mercator = d3.geoMercator() 
				.rotate([0,0,0])
				.fitExtent([[0,0],[100,100]],california);

var path = d3.geoPath()               
		  	 .projection(mercator); 

var californiaMapfunction= function() {
	var californiaMap = map_svg.append("svg")
						.attr("class","california_map")
						.attr("opacity",1.0)
						.selectAll("path")
						.data(california.features)
						.enter()
						.append("path")
						.attr("fill",colors.yellow_c)
						.attr("d",path);

	return californiaMap;
}


// SLIDE 2 - DOWN (PART1) : CALIFORNIA SQAURE
var main_box_dim = {"width":800,"height":600};

var californiaBox = [{"x":0,"y":svgHeight-main_box_dim.height},
					 {"x":main_box_dim.width,"y":svgHeight-main_box_dim.height},
					 {"x":main_box_dim.width,"y":svgHeight},
					 {"x":0,"y":svgHeight},
					 {"x":0,"y":svgHeight-main_box_dim.height}]

var lineFunction = d3.line()
                        .x(function(d) { return d.x; })
                        .y(function(d) { return d.y; });

						
var main_box = mainSvg.append("svg")
						.attr("class","main_box")
						.attr("opacity",0.0)
						.append("path")
						.attr("fill",colors.yellow_c)
						.attr("d",lineFunction(californiaBox));

// SLIDE 2 (PART2) - SEPERATING POPULATION ACCORDING TO ETHINICITY

// Making squares for population slots.
var square_dimension = function(number)
{
	var square_root = Math.sqrt(number);
	var closest_full_number = Math.ceil(square_root);
	return closest_full_number;
}

// INITIAL VARIABLES
var population_squares = [];
var year_2000 = ethnicPopulation[0];

var whitePop_2000 = {"percent":year_2000.White,"start":0,"end":year_2000.White*12-1,"square":square_dimension(year_2000.White*12),"total":year_2000.White*12};
var blackPop_2000 = {"percent":year_2000.Black,"start":whitePop_2000.end+1,"end":whitePop_2000.end+(year_2000.Black*12),"square":square_dimension(year_2000.Black*12),"total":year_2000.Black*12};
var latinoPop_2000 = {"percent":year_2000.Latino,"start":blackPop_2000.end+1,"end":blackPop_2000.end+(year_2000.Latino*12),"square":square_dimension(year_2000.Latino*12),"total":year_2000.Latino*12};
var asianPop_2000 = {"percent":year_2000.Asian,"start":latinoPop_2000.end+1,"end":latinoPop_2000.end+(year_2000.Asian*12),"square":square_dimension(year_2000.Asian*12),"total":year_2000.Asian*12};
var othersPop_2000 = {"percent":year_2000.Other,"start":asianPop_2000.end+1,"end":asianPop_2000.end+(year_2000.Other*12),"square":square_dimension(year_2000.Other*12),"total":year_2000.Other*12};

for ( var c =0 ; c<columns ;c++)
{
	for ( var r = 0 ; r<rows ; r++)
	{
		var index = r+c*rows;
		var id_final = "square_" +index;

		var population_type;
		var relative_eindex;
		switch(true){
			case (index>=whitePop_2000.start && index<=whitePop_2000.end) :
					population_type = "white";
					relative_eindex = index-whitePop_2000.start;
					break;
			case (index>=blackPop_2000.start && index<=blackPop_2000.end) :
					population_type ="black";
					relative_eindex = index-blackPop_2000.start;
					break;
			case (index>=latinoPop_2000.start && index<=latinoPop_2000.end) :
					population_type ="latino";
					relative_eindex = index-latinoPop_2000.start;
					break;
			case (index>=asianPop_2000.start && index<=asianPop_2000.end) :
					population_type="asian";
					relative_eindex = index-asianPop_2000.start;
					break;
			case (index>=othersPop_2000.start && index<=othersPop_2000.end) :
					population_type="other"
					relative_eindex = index-othersPop_2000.start;
					break;
				}

		population_squares.push({"id":id_final,
								 "row":r, 
								 "index":index,
								 "relative_eindex":relative_eindex,
								 "column":c,
								 "population_type":population_type});
	}
}

// SEPERATION HERE
var make_squares = function(delay,duration){

d3.selectAll(".main_box")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("opacity",0.0);

$(".population_squares").remove();	

var square = mainSvg.append("svg")
					.attr("class","population_squares")

square.selectAll("rect")
	.data(population_squares)
	.enter()
	.append("rect")
	.attr("class","population_square")
	.attr("id",function(d,i){return(d.id)})
	.attr("y",function(d,i){return (svgHeight-(d.row*dim_square)-margin_square-dim_square)})
	.attr("x",function(d,i){return ((d.column*dim_square)+margin_square)})
	.attr("width",dim_square-margin_square)
	.attr("height",dim_square-margin_square)
	.attr("fill",colors.yellow_c)
	.attr("opacity",0.0)
	.transition()
	.delay(delay)
	.duration(duration)
	.attr("opacity",1.0)

return square;
}
					
// SLIDE 1 -> SLIDE 2(PART1)
var slide1_DownTransition = function(delay,duration) {
				d3.selectAll(".california_map")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("opacity",0.0);

				d3.selectAll(".main_box")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("opacity",1.0);
}

// SLIDE 2(ALL) -> SLIDE 1
var slide1_UpTransition = function(delay,duration) {
				d3.selectAll(".california_map")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("opacity",1.0);

				d3.selectAll(".main_box")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("opacity",0.0);

				d3.selectAll(".population_square")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("opacity",0.0);
				
}

// SLIDE 3 -> SLIDE 2 
var put_square_back= function(delay,duration)
{
	d3.selectAll(".population_square")
					.transition()
					.delay(delay)
					.duration(duration)
				    .attr("y",function(d,i){return (svgHeight-(d.row*dim_square)-margin_square-dim_square)})
	                .attr("x",function(d,i){return ((d.column*dim_square)+margin_square)})
	                .attr("width",dim_square-margin_square)
	                .attr("height",dim_square-margin_square);

}

var color_back_yellow = function(delay,duration)
{
	d3.selectAll(".population_square")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("fill",colors.yellow_c);
}	

// SLIDE 3 (PART1): Coloring the squares

var arranged_colored_squares_2000 = function(delay,duration){

	var pop_squares= d3.selectAll(".population_square")
						.transition()
						.delay(delay)
						.duration(duration)
						.attr("fill",function(d){
							var color_index;
							switch(true){
								case (d.population_type=="white") :
									color_index = colors.white_c;
									break;
								case (d.population_type=="black") :
									color_index = colors.black_c;
									break;
								case (d.population_type=="latino") :
									color_index = colors.latino_c;
									break;
								case (d.population_type=="asian") :
									color_index = colors.asian_c;
									break;
								case (d.population_type=="other") :
									color_index = colors.others_c;
									break;
									}
							return color_index;
						});

}


// SLIDE 3(PART2) : REARRANGE SQUARES ACCORDING TO COLOR . JUST USE THIS TO TRANISITON TO SLIDE 3 FROM ANYWHERE.
var m_between_squares= 10;
var new_dim_square = 15;
var starting_points = {"white":0,
						"black":(whitePop_2000.square)*new_dim_square+m_between_squares,
						"latino":(whitePop_2000.square+blackPop_2000.square)*new_dim_square+(2*m_between_squares),
						"asian":(latinoPop_2000.square+whitePop_2000.square+blackPop_2000.square)*new_dim_square+(3*m_between_squares),
						"others":(asianPop_2000.square+latinoPop_2000.square+whitePop_2000.square+blackPop_2000.square)*new_dim_square+(4*m_between_squares)}


var segregation_based_on_ethnicity = function(delay,duration)
{
  var segregate = d3.selectAll(".population_square")
						.transition()
						.delay(delay)
						.duration(duration)
						.attr("x",function(d){
							var starting_point ;
							var square_value;
							switch(true){

								case (d.population_type=="white") :
									starting_point = starting_points.white;
									square_value = whitePop_2000.square;
									break;
								case (d.population_type=="black") :
									starting_point = starting_points.black;
									square_value = blackPop_2000.square;
									break;
								case (d.population_type=="latino") :
									starting_point = starting_points.latino;
									square_value = latinoPop_2000.square;
									break;
								case (d.population_type=="asian") :
									starting_point = starting_points.asian;
									square_value = asianPop_2000.square;
									break;
								case (d.population_type=="other") :
									starting_point = starting_points.others;
									square_value = othersPop_2000.square;
									break;
									}

							var col = Math.floor(d.relative_eindex/square_value);
							var return_value = starting_point+(new_dim_square*col)+1*margin_square;

							return(return_value);
						})
						.attr("y",function(d){
							var square_value;
							switch(true){

								case (d.population_type=="white") :
									square_value = whitePop_2000.square;
									break;
								case (d.population_type=="black") :
									square_value = blackPop_2000.square;
									break;
								case (d.population_type=="latino") :
									square_value = latinoPop_2000.square;
									break;
								case (d.population_type=="asian") :
									square_value = asianPop_2000.square;
									break;
								case (d.population_type=="other") :
									square_value = othersPop_2000.square;
									break;
									}

							var row = d.relative_eindex%square_value;							
							var return_value =svgHeight-(new_dim_square*row)+1*margin_square-new_dim_square;

							return(return_value);
						})
						.attr("height",new_dim_square-margin_square)
						.attr("width",new_dim_square-margin_square);

}


//SLIDE 4: COLOR THE HOUSE OWNERSHIP
var number_of_gray_houses = {
	"white" : Math.floor(whitePop_2000.total *(1- house_ownership.white)),
	"black" : Math.floor(blackPop_2000.total * (1- house_ownership.black)),
	"asian" :Math.floor(asianPop_2000.total * (1- house_ownership.asian)),
	"latino" : Math.floor(latinoPop_2000.total * (1-house_ownership.latino)),
	"other" : Math.floor(othersPop_2000.total * (1-house_ownership.other))
}

var total_gray_houses = number_of_gray_houses.white+
						number_of_gray_houses.black+
						number_of_gray_houses.latino+
						number_of_gray_houses.asian+
						number_of_gray_houses.other;

var total_normal_houses = (rows*columns) - total_gray_houses;

var houseownership_markers = function(delay,duration) {

	var houseownership = d3.selectAll(".population_square")
						.transition()
						.delay(delay)
						.duration(duration)
						.attr("fill",function(d){
							var is_this_gray;
							if (d.population_type=="white") {
								if (d.relative_eindex<number_of_gray_houses.white) 
									is_this_gray= colors.noownership;
								else 
									is_this_gray = colors.white_c;
							}
							else if (d.population_type=="black" ) {	
								if (d.relative_eindex<number_of_gray_houses.black)
									is_this_gray= colors.noownership;
								else 
									is_this_gray = colors.black_c;
							}
							else if (d.population_type=="latino") {
								if (d.relative_eindex<number_of_gray_houses.latino) 
									is_this_gray= colors.noownership;
								else 
									is_this_gray = colors.latino_c;
							}
							else if (d.population_type=="asian" ){
								if (d.relative_eindex<number_of_gray_houses.asian)
									is_this_gray= colors.noownership;
								else
									is_this_gray = colors.asian_c;
							}
							else if (d.population_type=="other"){
								if (d.relative_eindex<number_of_gray_houses.other)
									is_this_gray = colors.noownership
								else 
									is_this_gray= colors.others_c;
							} 
							return is_this_gray;
						})
				
}


// SLIDE 5: SEPERATE THE GRAY FROM THE COLORED

var square_for_ownership = square_dimension (total_normal_houses);
var square_for_no_ownership = square_dimension (total_gray_houses);

var houseownership_segregation = function(delay,duration){
	var relative_gray_id =0 ,relative_color_id=0;
	var gray_start = square_for_ownership*new_dim_square+m_between_squares+20; 

	var houseownership_s = d3.selectAll(".population_square")
						.transition()
						.delay(delay)
						.duration(duration)
						.attr("x",function(d){
							var is_this_gray;
							var col;
							var x_return;
							if (d.population_type=="white" && d.relative_eindex<number_of_gray_houses.white) 
									is_this_gray= true;
							else if (d.population_type=="black" && d.relative_eindex<number_of_gray_houses.black)
									is_this_gray= true;
							else if (d.population_type=="latino" && d.relative_eindex<number_of_gray_houses.latino) 
									is_this_gray= true;
							else if (d.population_type=="asian" && d.relative_eindex<number_of_gray_houses.asian)
									is_this_gray= true;
							else if (d.population_type=="other" && d.relative_eindex<number_of_gray_houses.other)
									is_this_gray = true;
							if (is_this_gray)
							{
								col = Math.floor(relative_gray_id/square_for_no_ownership);
								x_return = gray_start+(new_dim_square*col)+1*margin_square;
								relative_gray_id = relative_gray_id+1;
							}
							else
							{
								col = Math.floor(relative_color_id/square_for_ownership);
								x_return = (new_dim_square*col)+1*margin_square;
								relative_color_id = relative_color_id+1;
							}
							return (x_return)
						})
						.attr("y",function(d){
							var is_this_gray;
							var row;
							var y_return;
							if (d.population_type=="white" && d.relative_eindex<number_of_gray_houses.white) 
									is_this_gray= true;
							else if (d.population_type=="black" && d.relative_eindex<number_of_gray_houses.black)
									is_this_gray= true;
							else if (d.population_type=="latino" && d.relative_eindex<number_of_gray_houses.latino) 
									is_this_gray= true;
							else if (d.population_type=="asian" && d.relative_eindex<number_of_gray_houses.asian)
									is_this_gray= true;
							else if (d.population_type=="other" && d.relative_eindex<number_of_gray_houses.other)
									is_this_gray = true;
							if (is_this_gray)
							{
								row = relative_gray_id%square_for_no_ownership;
								y_return = svgHeight-(new_dim_square*row)+1*margin_square-new_dim_square;
								relative_gray_id = relative_gray_id+1;
							}
							else
							{
								row = relative_color_id%square_for_ownership;
								y_return = svgHeight-(new_dim_square*row)+1*margin_square-new_dim_square;
								relative_color_id = relative_color_id+1;
							}
							return( y_return);
						})
}

// SLIDE 6 : PICTURES OF ALL AND DISSAPEAR MAIN SVG

var slide6_down = function(delay,duration){
	d3.selectAll(".population_square")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("opacity",0.0);
	slide6image_come(delay,duration);
}

var slide6_up = function(delay,duration){
	d3.selectAll(".population_square")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("opacity",1.0);
	slide6image_go(delay,duration)
}

var slide6image_go = function(delay,duration){

	d3.selectAll(".slide6_images")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("opacity",0.0);

}

var slide6image_come = function(delay,duration){
	
	d3.selectAll(".slide6_images")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("opacity",1.0);
}

var slide7image_go = function(delay,duration){

	d3.selectAll(".slide7_images")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("opacity",0.0);

}

var slide7image_come = function(delay,duration){
	
	d3.selectAll(".slide7_images")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("opacity",1.0);
}


var slide8image_go = function(delay,duration){

	d3.selectAll(".slide8_images")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("opacity",0.0);

}

var slide8image_come = function(delay,duration){
	
	d3.selectAll(".slide8_images")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("opacity",1.0);
}


// Appending Pictures in pictures svg. 
var append_picture_slide6 = function(link,x,y,width,height,classes){
mainSvg.append("image")
		.attr("class",classes)
		.attr("xlink:href",link)
		.attr("x",x)
		.attr("y",y)
		.attr("width",width)
		.attr("height",height)
		.attr("opacity",0.0);
}

// SLIDE 8
append_picture_slide6("Images/Overall_Ownership/2000.gif",0,svgHeight-200,400,190,"slide8_images");
append_picture_slide6("Images/Overall_Ownership/2010.gif",420,svgHeight-200,400,190,"slide8_images");
append_picture_slide6("Images/Overall_Ownership/2020.gif",0,svgHeight-420,400,190,"slide8_images");
append_picture_slide6("Images/Overall_Ownership/2030.gif",420,svgHeight-420,400,190,"slide8_images");
append_picture_slide6("Images/Overall_Ownership/2040.gif",0,svgHeight-640,400,190,"slide8_images");

// SLIDE 7
append_picture_slide6("Images/Population_Distribution/2000.gif",0,svgHeight-200,400,190,"slide7_images");
append_picture_slide6("Images/Population_Distribution/2010.gif",420,svgHeight-200,400,190,"slide7_images");
append_picture_slide6("Images/Population_Distribution/2020.gif",0,svgHeight-420,400,190,"slide7_images");
append_picture_slide6("Images/Population_Distribution/2030.gif",420,svgHeight-420,400,190,"slide7_images");
append_picture_slide6("Images/Population_Distribution/2040.gif",0,svgHeight-640,400,190,"slide7_images");

// SLIDE 6
append_picture_slide6("Images/Ethnic_Ownership/2000.gif",0,svgHeight-200,400,190,"slide6_images");
append_picture_slide6("Images/Ethnic_Ownership/2010.gif",420,svgHeight-200,400,190,"slide6_images");
append_picture_slide6("Images/Ethnic_Ownership/2020.gif",0,svgHeight-420,400,190,"slide6_images");
append_picture_slide6("Images/Ethnic_Ownership/2030.gif",420,svgHeight-420,400,190,"slide6_images");
append_picture_slide6("Images/Ethnic_Ownership/2040.gif",0,svgHeight-640,400,190,"slide6_images");
// PUTTING TEXT IN SVG 

var text_for_slide3 = function()
{
	//WHITE
	mainSvg.append("text")
			.attr("class","slide3_text")
			.text(whitePop_2000.percent+"%")
			.attr("x",whitePop_2000.square*new_dim_square/2)
			.attr("y",svgHeight-(whitePop_2000.square*new_dim_square)-10)
			.attr("font-family","sans-serif")
			.attr("text-anchor","middle")
			.attr("font-size","25px")
			.attr("fill",colors.white_c)
			.attr("fill-opacity",0.0);

	//BLACK
	mainSvg.append("text")
			.attr("class","slide3_text")
			.text(blackPop_2000.percent+"%")
			.attr("x",starting_points.black+(blackPop_2000.square*new_dim_square/2))
			.attr("y",svgHeight-(blackPop_2000.square*new_dim_square)-10)
			.attr("font-family","sans-serif")
			.attr("text-anchor","middle")
			.attr("font-size","25px")
			.attr("fill",colors.black_c)
			.attr("fill-opacity",0.0);

	//ASIAN
	mainSvg.append("text")
			.attr("class","slide3_text")
			.text(asianPop_2000.percent+"%")
			.attr("x",starting_points.asian+(asianPop_2000.square*new_dim_square/2))
			.attr("y",svgHeight-(asianPop_2000.square*new_dim_square)-10)
			.attr("font-family","sans-serif")
			.attr("text-anchor","middle")
			.attr("font-size","25px")
			.attr("fill",colors.asian_c)
			.attr("fill-opacity",0.0);

	//LATINO
	mainSvg.append("text")
			.attr("class","slide3_text")
			.text(latinoPop_2000.percent+"%")
			.attr("x",starting_points.latino+(latinoPop_2000.square*new_dim_square/2))
			.attr("y",svgHeight-(latinoPop_2000.square*new_dim_square)-10)
			.attr("font-family","sans-serif")
			.attr("text-anchor","middle")
			.attr("font-size","25px")
			.attr("fill",colors.latino_c)
			.attr("fill-opacity",0.0);

	//OTHERS
	mainSvg.append("text")
			.attr("class","slide3_text")
			.text(othersPop_2000.percent+"%")
			.attr("x",starting_points.others+(othersPop_2000.square*new_dim_square/2))
			.attr("y",svgHeight-(othersPop_2000.square*new_dim_square)-10)
			.attr("font-family","sans-serif")
			.attr("text-anchor","middle")
			.attr("font-size","25px")
			.attr("fill",colors.others_c)
			.attr("fill-opacity",0.0);
}
text_for_slide3();

var text_for_slide3_appear = function(delay,duration)
{
	d3.selectAll(".slide3_text")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("fill-opacity",1.0);
}

var text_for_slide3_disappear = function(delay,duration)
{
	d3.selectAll(".slide3_text")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("fill-opacity",0.0);
}

var text_for_slide4= function()
{
	//WHITE
	mainSvg.append("text")
			.attr("class","slide4_text")
			.text(((1-house_ownership.white)*100)+"%")
			.attr("x",0)
			.attr("y",svgHeight-(whitePop_2000.square*new_dim_square)-10)
			.attr("font-family","sans-serif")
			.attr("text-anchor","start")
			.attr("font-size","25px")
			.attr("fill",colors.noownership)
			.attr("fill-opacity",0.0);

	//BLACK
	mainSvg.append("text")
			.attr("class","slide4_text")
			.text(((1-house_ownership.black)*100)+"%")
			.attr("x",starting_points.black)
			.attr("y",svgHeight-(blackPop_2000.square*new_dim_square)-10)
			.attr("font-family","sans-serif")
			.attr("text-anchor","start")
			.attr("font-size","25px")
			.attr("fill",colors.noownership)
			.attr("fill-opacity",0.0);

	//ASIAN
	mainSvg.append("text")
			.attr("class","slide4_text")
			.text(43+"%")
			.attr("x",starting_points.asian)
			.attr("y",svgHeight-(asianPop_2000.square*new_dim_square)-10)
			.attr("font-family","sans-serif")
			.attr("text-anchor","start")
			.attr("font-size","25px")
			.attr("fill",colors.noownership)
			.attr("fill-opacity",0.0);

	//LATINO
	mainSvg.append("text")
			.attr("class","slide4_text")
			.text(57+"%")
			.attr("x",starting_points.latino)
			.attr("y",svgHeight-(latinoPop_2000.square*new_dim_square)-10)
			.attr("font-family","sans-serif")
			.attr("text-anchor","start")
			.attr("font-size","25px")
			.attr("fill",colors.noownership)
			.attr("fill-opacity",0.0);

	//OTHERS
	mainSvg.append("text")
			.attr("class","slide4_text")
			.text(((1-house_ownership.other)*100)+"%")
			.attr("x",starting_points.others)
			.attr("y",svgHeight-(othersPop_2000.square*new_dim_square)-10)
			.attr("font-family","sans-serif")
			.attr("text-anchor","start")
			.attr("font-size","25px")
			.attr("fill",colors.noownership)
			.attr("fill-opacity",0.0);
}

text_for_slide4();

var text_for_slide4_appear = function(delay,duration)
{
	d3.selectAll(".slide4_text")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("fill-opacity",1.0);
}

var text_for_slide4_disappear = function(delay,duration)
{
	d3.selectAll(".slide4_text")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("fill-opacity",0.0);
}

var text_for_slide5= function()
{
	//HOUSE
	mainSvg.append("text")
			.attr("class","slide5_text")
			.text((ownership_rate[0].own)+"%")
			.attr("x",0)
			.attr("y",svgHeight-(square_for_ownership*new_dim_square)-10)
			.attr("font-family","sans-serif")
			.attr("text-anchor","start")
			.attr("font-size","40px")
			.attr("fill",colors.yellow_c)
			.attr("fill-opacity",0.0);

	//NOHOUSE
	mainSvg.append("text")
			.attr("class","slide5_text")
			.text((100-ownership_rate[0].own)+"%")
			.attr("x",(square_for_ownership*new_dim_square)+30)
			.attr("y",svgHeight-(square_for_no_ownership*new_dim_square)-10)
			.attr("font-family","sans-serif")
			.attr("text-anchor","start")
			.attr("font-size","40px")
			.attr("fill",colors.noownership)
			.attr("fill-opacity",0.0);

}

text_for_slide5();

var text_for_slide5_appear = function(delay,duration)
{
	d3.selectAll(".slide5_text")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("fill-opacity",1.0);
}

var text_for_slide5_disappear = function(delay,duration)
{
	d3.selectAll(".slide5_text")
					.transition()
					.delay(delay)
					.duration(duration)
					.attr("fill-opacity",0.0);
}



