$(function(){
	$('.top_block').draggable({ revert: true, delay: 200, distance: 20, axis: 'x,y'});
	$('.top_block').draggable({
		start: function(event, ui){
			// console.log(ui.position.left)
			var directionX = "",
				directionY = "",
			    oldx = 0,
			    oldy = 0,
			    dir = "";

        	$.mousedirection();
			$(this).bind('mousedirection',function(e){
				$(this).html(e.direction);
				// console.log(e.pageX)
				// console.log(e.pageY)
				// console.log(oldx)
				// console.log(oldy)

		        // if (e.pageX < oldx) {
		        //     directionX = "x"
		        // } else if (e.pageX > oldx) {
		        //     directionX = "x"
		        // }
		        // if (e.pageY < oldy) {
		        //     directionY = "y"
		        // } else if (e.pageY > oldy) {
		        //     directionY = "y"
		        // }
		        
		        // oldx = e.pageX;
		        // oldy = e.pageY;

		        // dir = (Math.abs(e.pageX) - Math.abs(oldx) > Math.abs(e.pageY) - Math.abs(oldy)) ? "x" : "y";
		        // console.log(directionX);
		        // console.log(directionY);


			})
		},
		stop: function(){
			console.log('stop')
			$(this).unbind('mousedirection');
		}
	})
})