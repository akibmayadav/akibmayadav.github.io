
$('#Slide2').css({top:1.35*window.innerHeight});
$('#Slide3').css({top:2.35*window.innerHeight});
$('#Slide4').css({top:3.35*window.innerHeight});
$('#Slide5').css({top:4.35*window.innerHeight});
$('#Slide6').css({top:5.35*window.innerHeight});
$('#Slide7').css({top:6.35*window.innerHeight});
$('#Slide8').css({top:7.35*window.innerHeight});
$('#Slide9').css({top:8.35*window.innerHeight});

californiaMapfunction();

var waypoint_1 = new Waypoint({
  element: document.getElementById('Slide1'),
  handler: function(direction) {
    if(direction == "down")
    {
      slide1_DownTransition(0,500);
      make_squares(0,500);

    }
    else 
    {
      slide1_UpTransition(0,500);
    }
    
  }
});

var waypoint_2 = new Waypoint({
  element: document.getElementById('Slide2'),
  handler: function(direction) {
    if(direction == "down")
    {

      arranged_colored_squares_2000(0,500);
      text_for_slide3_appear(500,500);
      segregation_based_on_ethnicity(500,500);

    }
    else 
    {
      put_square_back(0,500);
      text_for_slide3_disappear(0,500);
      color_back_yellow(500,500);
    }
    
  }
});

var waypoint_3 = new Waypoint({
  element: document.getElementById('Slide3'),
  handler: function(direction) {
    if(direction == "down")
    {
      houseownership_markers(0,500);
      text_for_slide3_disappear(0,500);
      text_for_slide4_appear(0,500);

    }
    else 
    {
      arranged_colored_squares_2000(0,500);
      text_for_slide3_appear(0,500);
      text_for_slide4_disappear(0,500);
    }
    
  }
});

var waypoint_4 = new Waypoint({
  element: document.getElementById('Slide4'),
  handler: function(direction) {
    if(direction == "down")
    {
      houseownership_segregation(0,500);
      text_for_slide4_disappear(0,500);
      text_for_slide5_appear(0,500);

    }
    else 
    {
      segregation_based_on_ethnicity(0,500);
      houseownership_markers(500,500);
      text_for_slide4_appear(0,500);
      text_for_slide5_disappear(0,500);
    }
    
  }
});

var waypoint_5 = new Waypoint({
  element: document.getElementById('Slide5'),
  handler: function(direction) {
    if(direction == "down")
    {
    	text_for_slide5_disappear(0,500);
    	slide6_down(0,1000);
    }
    else 
    {
    	text_for_slide5_appear(0,500);
    	slide6_up(0,1000);
    }
    
  }
});

var waypoint_5 = new Waypoint({
  element: document.getElementById('Slide6'),
  handler: function(direction) {
    if(direction == "down")
    {
    	slide6image_go(0,1000);
    	slide7image_come(0,1000);
    }
    else 
    {
    	slide6image_come(0,1000);
    	slide7image_go(0,1000);
    }
    
  }
});

var waypoint_5 = new Waypoint({
  element: document.getElementById('Slide7'),
  handler: function(direction) {
    if(direction == "down")
    {
    	slide7image_go(0,1000);
    	slide8image_come(0,1000);
    }
    else 
    {
    	slide7image_come(0,1000);
    	slide8image_go(0,1000);
    }
    
  }
});

