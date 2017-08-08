// Position the write up div 
var margin_int = 40;
var main_viz_dim = window.innerHeight-(2*margin_int);

var brush_x = 0;
var brush_y = 0;
var brush_width = 600;
var brush_height = 5;

var left_brush_pos = (window.innerWidth-brush_width)/2;

brush_year_selector(brush_x,brush_y,brush_width,brush_height);

// Function to make the brush selector 
function brush_year_selector(x_pos,y_pos,width,height)
{

var margin = {top: 5, right: 20, bottom: 15, left: 20};
var f_width = width + margin.right + margin.left ;
var f_height = height + margin.top + margin.bottom ;

$('#writeup').css("top",main_viz_dim+margin_int+10);
$('#writeup').css("left",left_brush_pos-margin.left);


var start_date = new Date(1900,0); 
var end_date = new Date(2020,0);

var x = d3.scaleTime()
    .domain([start_date, end_date])
    .rangeRound([0,width]);

var view = "0 0 "+f_width+" " +f_height;

// Main SVG
var svg = d3.select("#writeup").append("svg")
    .attr("width", f_width)
    .attr("height", f_height)
    .attr("xmlns","http://www.w3.org/2000/svg")
    .attr("viewBox",view)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// AXIS - For Selection Reference
svg.append("g")
    .attr("class", "axis axis--grid")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
        .ticks(d3.timeYear)
        .tickSize(-height)
        .tickFormat(function() { return null; }))
  .selectAll(".tick")
    .classed("tick--minor", function(d) { return d.getHours(); });

// AXIS - For marking years
svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
        .tickSize(-height)
        .tickPadding(0))
    .attr("text-anchor", null)
    .selectAll("text")
    .attr("x", -10)
    .attr("y", 4)
    .attr("fill","#b2332a")
    .attr("font-size",8)

// Appending the brush
svg.append("g")
    .attr("class", "brush")
    .call(d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("end", brushended));

function brushended() {
  if (!d3.event.sourceEvent) return; // Only transition after input.
  if (!d3.event.selection) return; // Ignore empty selections.
  var d0 = d3.event.selection.map(x.invert),
      d1 = d0.map(d3.timeYear.round);

  s_year = d1[0].getFullYear();
  e_year = d1[1].getFullYear();

  var string_year = s_year + " - " + e_year;
  var year_write = document.getElementById("year_wr")
  year_write.innerHTML = string_year;

  year_selector(s_year,e_year,i_ind) 
  year_selector(s_year,e_year,i_ind) 

  d3.select(this).transition().call(d3.event.target.move, d1.map(x));
}
}

function country_index (x,y,height,width)
{

  var margin = {top: 5, right: 20, bottom: 15, left: 20};
  var country_name = document.getElementById("country")
  // country_name.innerHTML = "Yes this works"

}

country_index(0,0,0,0);
