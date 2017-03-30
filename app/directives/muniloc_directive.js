/***************************  Functions ***************************/
function vehicle_data_parser(vehicle_input,vehicle_old_input)
                    {
                    if (vehicle_input)
                        { 
                        var old_present = false; 
                        var vehicle_old=[];

                        if(vehicle_old_input)
                            {
                            old_present=true;
                            var vehicle_older = vehicle_old_input.querySelectorAll("vehicle");
                            for ( var o_c = 0 ;o_c<vehicle_older.length;o_c++)
                            {
                                var attr = {};
                                attr.id = vehicle_older[o_c].getAttribute('id');
                                var lat = vehicle_older[o_c].getAttribute('lat');
                                var lon = vehicle_older[o_c].getAttribute('lon');
                                attr.x = projection([lon,lat])[0];
                                attr.y = projection([lon,lat])[1];
                                vehicle_old.push(attr);
                            }
                            };

                        var vehicle = vehicle_input.querySelectorAll("vehicle");
                        if(vehicle.length)
                        {
                            var out = {};
                            out.routetag = vehicle[0].getAttribute('routeTag');
                            out.parseddata = [];
                            for ( var v_c =0 ;v_c<vehicle.length ;v_c++)
                            {
                                var attr = {};
                                attr.id = vehicle[v_c].getAttribute('id');
                                var lat = vehicle[v_c].getAttribute('lat');
                                var lon = vehicle[v_c].getAttribute('lon');
                                var index = old_present ? vehicle_old.findIndex(x=>x.id==attr.id) : -1;
                                attr.x = projection([lon,lat])[0];
                                attr.y = projection([lon,lat])[1];
                                attr.old_x = old_present ? vehicle_old[index].x : attr.x;
                                attr.old_y = old_present ? vehicle_old[index].y : attr.y;
                                attr.heading = vehicle[v_c].getAttribute('heading');
                                out.parseddata.push(attr);        
                            }
                            return(out);
                        }
                        else
                        {
                            return(0);
                        }
                        }
                    else 
                        {
                        return(0);    
                        }
                    }

/***************************  Functions ***************************/

/***************************  Directive muniLocation Starts ***************************/
sfmuniapp.directive('muniLocation',function(){
	
 	return{
    		restrict :'E',
    		scope:
    		{
    			projection : '=',
    			vehicledata : '=',
                mapsvg :'='
    		},
    		link:function(scope,element,attrs)
    		{

    			scope.$watchGroup(['projection','vehicledata','mapsvg'],function(newData,oldData){

                    var projection = newData[0];
    				var vehicle_old = oldData[1];
                    var vehicle_current = newData[1];

                    if(vehicle_current)
                    {
                    var vehicle_update = false;
                    var current_state = vehicle_current.querySelectorAll('vehicle');
                    var parsed_current_data = vehicle_data_parser(vehicle_current,vehicle_old);
                    var map_svg = newData[2];

                    $("#vehicle_locations").remove();
                    var vehicle_locations = map_svg.append("g")
                                            .attr("id","vehicle_locations")
                    if(parsed_current_data)
                    {
                    vehicle_locations.selectAll("circle")
                                        .data(parsed_current_data.parseddata)
                                        .enter()
                                        .append("circle")
                                        .attr("id",function(d){return d.id})
                                        .attr('cx',function(d){return d.old_x})
                                        .attr('cy',function(d){return d.old_y})
                                        .attr('r',5)
                                        .on("mouseover",function(d){
                                            show_id(d);
                                        })
                                        .on("mouseout",function(){
                                            remove_id();
                                        })
                                        .transition()
                                        .duration(15000)
                                        .ease(d3.easeLinear)
                                        .attr("cx",function(d){return d.x})
                                        .attr("cy",function(d){return d.y})
                    }


                     function show_id(d)
                     {
                        vehicle_locations.append("text")
                                        .text(parsed_current_data.routetag+"-"+d.id)
                                        .attr("id","id_text")
                                        .attr("x",d.x)
                                        .attr("y",d.y);
                     } 
                     function remove_id()
                     {
                        $('#id_text').remove();
                     } 
                     }                 
                    

    			})
    		}
    	}
    });

/***************************  Directive muniLocation Ends ***************************/
