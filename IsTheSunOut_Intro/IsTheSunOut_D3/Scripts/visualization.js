// Function to go back on the selection page
function go_back()
{
	location.href="../index.html?click=1";
}

// Initial Visualization Setup
var main_viz_dim = window.innerHeight;

var current_url = window.location.href;

var parameter_string = current_url.split("?")[1];
var year_string = parameter_string.split("&")[0];
var dew_string = parameter_string.split("&")[1];

var year_f = parseInt(year_string.split("=")[1]);
var dew_f = parseInt(dew_string.split("=")[1]);

// Parameters

var years = [data_2006,data_2007,data_2008,data_2009,data_2010,data_2011,data_2012,data_2013];

var dewey_categories = ["Others","Generalities","Philosophy","Religion","Social Sciences","Languages","Science","Technology","Arts","Literature","Geography and History","All Books"]

// Formatting Data
var formatted_years = [];
for (var y=0; y<years.length ;y++)
{
	var format_year = format_data(years[y]);
	formatted_years.push(format_year);
}

// Parameter for every year, every dewey
var formatted_years_parameters = [];
for (var y=0; y<years.length ;y++)
{
	var parameter_year_data = [];
	for (var a=0; a<12; a++)
	{
		var c_domain = d3.extent(formatted_years[y],function(d){return d.Checkouts[a]});
		parameter_year_data.push(c_domain);
	}
	formatted_years_parameters.push(parameter_year_data);
}

// Avg Prep/Temp for every dewey, every year
var years_parameters_temp_prep = [];
for (var y=0; y<years.length ;y++)
{
	var parameter_year_data = [];
	var temp = 0 ; 
	var prep = 0 ;
	var len = formatted_years[y].length
	for (var a=0; a<len; a++)
	{
		temp = temp + formatted_years[y][a].temp;
		prep = prep + formatted_years[y][a].prep;
	}
	var avg_temp = temp/len;
	var avg_prep = prep/len;

	years_parameters_temp_prep.push({"temp":avg_temp,"prep":avg_prep});
}

// Finding max and min avg prep and temp to give background colors
var max_avg_prep = 0; 
var max_avg_temp = 0;
for ( var a = 0 ; a<years_parameters_temp_prep.length ;a++)
{
	if(max_avg_temp < years_parameters_temp_prep[a].temp)
		max_avg_temp = years_parameters_temp_prep[a].temp;
	if(max_avg_prep < years_parameters_temp_prep[a].prep)
		max_avg_prep = years_parameters_temp_prep[a].prep;
}
var min_avg_prep = max_avg_prep;
var min_avg_temp = max_avg_temp;

for ( var a = 0 ; a<years_parameters_temp_prep.length ;a++)
{
	if(min_avg_temp > years_parameters_temp_prep[a].temp)
		min_avg_temp = years_parameters_temp_prep[a].temp;
	if(min_avg_prep > years_parameters_temp_prep[a].prep)
		min_avg_prep = years_parameters_temp_prep[a].prep;
}

var avg_temp_scale = d3.scaleLinear()
						.domain([min_avg_temp,max_avg_temp])
						.range([0.3,0.8]);

var avg_prep_scale = d3.scaleLinear()
						.domain([min_avg_prep,max_avg_prep])
						.range([0.3,0.8]);						
// Overall max and min 
var max_max_checkouts =0;
for (var a= 0 ; a<formatted_years_parameters.length ;a++)
{
	for (var b = 0 ; b<formatted_years_parameters[a].length;b++)
	{
		if(max_max_checkouts<formatted_years_parameters[a][b][1])
		{max_max_checkouts = formatted_years_parameters[a][b][1];}
	}		
}

var min_max_checkouts = max_max_checkouts;
for ( var a= 0 ; a<formatted_years_parameters.length ;a++)
{
	for ( var b = 0 ; b<formatted_years_parameters[a].length;b++)
	{
		if(min_max_checkouts>formatted_years_parameters[a][b][1])
		{min_max_checkouts = formatted_years_parameters[a][b][1];}
	}		
}
 
var outer_radius_scale = d3.scaleLinear()
						.domain([min_max_checkouts,max_max_checkouts])
						.range([0.17,0.31]);

var dew = dew_f; //0-11 ( 0-null, 11- allofthem). Which dewey category 
var year = year_f; //0-7 . Which Year

var left_pos = 0 ; 
var left_over_space = window.innerWidth - main_viz_dim ; 

if(left_over_space>0)
{
	left_pos = left_over_space/2;
}

every_year_viz(dew,year,'mainVisualization',0,left_pos,main_viz_dim,formatted_years[year]);

// Visualization

function every_year_viz(which_dewey,which_year,id,top,left,dim,data_year) {


$("#"+id).css("width",dim);
$("#"+id).css("height",dim);
$("#"+id).css("left",left);
$("#"+id).css("top",top); 

var prep_opacity = avg_prep_scale(years_parameters_temp_prep[year].prep);
$("body").css("background-color","rgba(125, 198, 232, "+prep_opacity+")"); 
// $("#"+id).css("background-color","rgba(125, 198, 232, "+prep_opacity+")"); 

var mainVisualizationCanvas = d3.select("#"+id).append("svg")
     .attr("id","main")
     .attr("xmlns","http://www.w3.org/2000/svg")
     .attr("viewBox","0 0 500 500")
     .attr("class", "mainsvg")
     .append("g")
     .attr("transform","translate("+250+","+250+")");

function arc(startAngle,endAngle,innerRadius,outerRadius)
{
	var arci = d3.arc()
				.innerRadius(innerRadius)
				.outerRadius(outerRadius)
				.startAngle(startAngle)
				.endAngle(endAngle)

	return arci;
}

var max_checkouts = formatted_years_parameters[year][dew][1];
var index = outer_radius_scale(max_checkouts); // maximum = 0.35, min = 0.17
var prep_inner_r = 0.1*dim;
var prep_outer_r = index*dim; // has to be made variable

var temp_inner_r = prep_outer_r;
var temp_outer_r = (index+0.008)*dim; // dependent 

mainVisualizationCanvas.append("g")
						.attr("id","background_for_viz")
						.append("circle")
						.attr("r",temp_outer_r)
						.attr("fill","white")

var total_arcs = data_year.length;

var p_domain = d3.extent(data_year,function(d){return(d.prep)});
var t_domain = d3.extent(data_year,function(d){return(d.temp)});
var d_domain = d3.extent(data_year,function(d){return(new Date(d.Date))});

var start_date = d_domain[0];
var end_date = d_domain[1];

var prep_scale = d3.scaleLinear()
					.domain(p_domain)
					.range([0,1]);

var temp_scale = d3.scaleLinear()
					.domain(t_domain)
					.range([0,1]);

var date_scale = d3.scaleLinear()
					.domain(d_domain)
					.range([0,2*Math.PI])

// Precipitation
mainVisualizationCanvas.append("g")
				.attr("id","Precipitation")
				.selectAll("path")
				.data(data_year)
				.enter()
				.append("path")
				.attr("id",function(d,i){return i+"_day_prep_"+d.Date})
				.attr("d",function(d,i){
					var startAngle = date_scale(new Date(d.Date))
					var endAngle = 2*Math.PI/total_arcs + startAngle;
					var prep_arc = arc(startAngle,endAngle,prep_inner_r,prep_outer_r);
					return prep_arc();
				})
				.attr("fill",function(d,i){
					var alpha = "rgba(125, 198, 232, "+ prep_scale(d.prep) +")";
					return alpha;
				})
				.attr("stroke",function(d,i){
					var day = new Date(d.Date).getDay();
					var color = "#7dc6e8";
					if(day == 0) color = "black";
					return color;})
				.attr("stroke-width", function(d,i){
					var day = new Date(d.Date).getDay();
					var width = 0.3;
					if(day == 0) width = 1.5;
					return width;})
				.attr("stroke-opacity",function(d,i){
					var day = new Date(d.Date).getDay();
					var opacity = 0.1;
					if(day == 0) opacity = 0.15;
					return opacity;
				})
				.on("mouseover",function(d){
					d3.select(this).attr("fill","rgba(0,0,0,1.0)");
					$("#date_tool").text(d.Date+" | "+d.Checkouts[dew])
					$("#temp_prep_tool").text(d.prep+" in | "+d.temp+ "\u00b0F" )
				})
				.on("mouseleave",function(d){
					var alpha = "rgba(125, 198, 232, "+ prep_scale(d.prep) +")";
					d3.select(this).attr("fill",alpha);
				})
// Temperature
mainVisualizationCanvas.append("g")
				.attr("id","Temperature")
				.selectAll("path")
				.data(data_year)
				.enter()
				.append("path")
				.attr("id",function(d,i){return i+"_day_temp_"+d.Date})
				.attr("d",function(d,i){
					var startAngle = date_scale(new Date(d.Date))
					var endAngle = 2*Math.PI/total_arcs + startAngle;
					var temp_arc = arc(startAngle,endAngle,temp_inner_r,temp_outer_r);
					return temp_arc();
				})
				.attr("fill",function(d,i){
					var alpha = "rgba(252, 136, 78, "+ temp_scale(d.temp) +")";
					return alpha;
				})
				.attr("stroke","#fc884e")
				.attr("stroke-width", 0.2)
				.attr("stroke-opacity",0.1)

// Month Labels
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

mainVisualizationCanvas.append("g")
				.attr("id","Paths")
				.selectAll("path")
				.data(months)
				.enter()
				.append("path")
				.attr("id",function(d,i){return i+"path"})
				.attr("d",function(d,i){
					var year = new Date(data_year[0].Date).getFullYear();
					var date = new Date(year,i,1);
					var startAngle = date_scale(date)
					var endAngle = 35*Math.PI/total_arcs + startAngle;
					var temp_arc = arc(startAngle,endAngle,temp_outer_r*1.01,temp_outer_r*1.01);
					return temp_arc();
				})
				.attr("stroke","#fc884e")
				.attr("stroke-width", 0.2)
				.attr("stroke-opacity",0.1)

mainVisualizationCanvas.append("g")
				.attr("id","Month_Labels")
				.selectAll("text")
				.data(months)
				.enter()
				.append("text")
				.append("textPath")
				.attr("xlink:href", function(d,i){
					var id = "#"+i+"path";
					return id;  })
				.attr("id","label")
				.attr("text-anchor","start")
				.attr("fill","#404040")
				.text(function(d,i){return d;})
				.attr("stroke","#404040")
				.attr("opacity",0.7)
				.attr("stroke-width", 0.2)

//Checkouts
dewey_checkout(which_dewey,"#d85147")

function dewey_checkout(dewey,color)
{

	var checkouts_inner_r = 0.58*prep_outer_r;
	var checkouts_outer_r = 0.98*prep_outer_r;

	var c_domain = d3.extent(data_year,function(d){return d.Checkouts[dewey]});
	var checkout_scale = d3.scaleLinear()
					.domain(c_domain)
					.range([checkouts_inner_r,checkouts_outer_r]);

	var min_rad = checkout_scale(c_domain[0]);
	var max_rad = checkout_scale(c_domain[1]);

	var lineData =[];

	for (var a = 0 ; a <total_arcs ;a++)
	{
		var date = new Date(data_year[a].Date);
		var angle = date_scale(date);
		var radius  = checkout_scale(data_year[a].Checkouts[dewey]);
		var final = {"angle":angle,"radius":radius};
		var day = date.getDay();
		lineData.push(final);
	}

	var lineFunction = d3.lineRadial()
		.curve(d3.curveCardinal)
  		.angle(function(d) { return d.angle; })
  		.radius(function(d) { return d.radius; })


	mainVisualizationCanvas.append("g")
						.attr("id","dewey"+dewey+"checkouts")
						.append("path")
						.attr("d",lineFunction(lineData))
						.attr("stroke","#fc884e")
						.attr("stroke-width",0.3)
						.attr("opacity",0.8)
						.attr("fill","#404040")

	var checkout_boundary = mainVisualizationCanvas.append("g")
						.attr("id","checkout_boundary");

	checkout_boundary.append("circle")
						.attr("r",min_rad)
						.attr("stroke","#fc884e")
						.attr("stroke-width",3.0)
						.attr("opacity",0.3)
						.attr("fill","none")

	checkout_boundary.append("circle")
						.attr("r",max_rad)
						.attr("stroke","#fc884e")
						.attr("stroke-width",3.0)
						.attr("opacity",0.3)
						.attr("fill","none")

	// inner temperature ( orange ) circle
	var inner_circle = mainVisualizationCanvas.append("g")
						.attr("id","rand")
			
			inner_circle.append("circle")
						.attr("r",prep_inner_r)
						.attr("stroke","#fc884e")
						.attr("stroke-width",0.1)
						.attr("fill","white")

			inner_circle.append("circle")
						.attr("r",prep_inner_r)
						.attr("stroke","#fc884e")
						.attr("stroke-width",0.1)
						.attr("opacity",avg_temp_scale(years_parameters_temp_prep[year].temp))
						.attr("fill","rgb(252, 136, 78)")
					
			inner_circle.append("text")		
						.attr("id","year_te")	
						.attr("text-anchor","middle")	
						.text(start_date.getFullYear())

			inner_circle.append("text")		
						.attr("id","dewey_te")	
						.attr("text-anchor","middle")	
						.text(dewey_categories[dew])
						.attr("y",20)

			inner_circle.append("text")		
						.attr("id","date_tool")	
						.attr("text-anchor","middle")	
						.text(" ") // Updated on 247
						.attr("y",35)

			inner_circle.append("text")		
						.attr("id","temp_prep_tool")	
						.attr("text-anchor","middle")	
						.text(" ") // Updated on 245
						.attr("y",-30)

			inner_circle.append("line")	
						.attr("stroke-width",1)	
						.attr("stroke","black")
						.attr("x1",-prep_inner_r*0.5)
						.attr("y1",5)
						.attr("x2",+prep_inner_r*0.5)
						.attr("y2",5)						
}

}


function format_data(raw_data)
{
var checkouts_array = [];

for ( var a = 0 ; a <raw_data.length ;a++)
{
	var date = raw_data[a].date;
	var checkouts = [raw_data[a].nul,raw_data[a].one,raw_data[a].two,raw_data[a].three,raw_data[a].four,raw_data[a].five,raw_data[a].six,raw_data[a].seven,raw_data[a].eight,raw_data[a].nine,raw_data[a].ten,raw_data[a].allofthem]
	var temp = raw_data[a].temp;
	var prep = raw_data[a].prep;
	checkouts_array.push({"Date":date,"Checkouts":checkouts,"temp":temp,"prep":prep})
}

return checkouts_array

}