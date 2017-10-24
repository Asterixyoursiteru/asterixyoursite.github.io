$(function(){
	var sideToMove;
	var OFFSETTOBLOCKCHANGE = 300;
	$('.top_block').draggable({ 
		revert: true, 
		delay: 0, 
		distance: 0,
		dynamic: false,
		start: function (event, ui) {
			ui.helper.data('draggableXY.originalPosition', ui.position || {top: 0, left: 0});
			ui.helper.data('draggableXY.newDrag', true);
		},
		drag: function (event, ui) {
			//set only two axis
			var originalPosition = ui.helper.data('draggableXY.originalPosition');
			var deltaX = Math.abs(originalPosition.left - ui.position.left);
			var deltaY = Math.abs(originalPosition.top - ui.position.top);

			var newDrag = false || ui.helper.data('draggableXY.newDrag');
			ui.helper.data('draggableXY.newDrag', false);

			var xMax = newDrag ? Math.max(deltaX, deltaY) === deltaX : ui.helper.data('draggableXY.xMax');
			ui.helper.data('draggableXY.xMax', xMax);

			var newPosition = ui.position;
			if(xMax) {
			  newPosition.top = originalPosition.top;
			}
			if(!xMax){
			  newPosition.left = originalPosition.left;
			}
			$(this).html('top: ' + newPosition.top + ' left: ' + newPosition.left);
			// =======set axis end

			// Continue animate if drag and drop on > 300px
			if(Math.abs(newPosition.left) > OFFSETTOBLOCKCHANGE){
			// sideToMove = newPosition.left > 0 ? true : false;
				// var blockWidth = $(this).width();
				$(this).draggable( "option", "revert", false);
				// switch(sideToMove){
				// 	case true:
				// 		$(this).animate({left:blockWidth+'px'});
				// 		break;
				// 	case false:
				// 		$(this).animate({left:'-'+blockWidth+'px'});
				// 		break;
				// }
			}
		},
		stop: function(event, ui){
			if(ui.position.left > OFFSETTOBLOCKCHANGE){
				$(this).animate({left: $(this).outerWidth() + 'px'});
				$(this).draggable( "option", "revert", true);
			}else if(ui.position.left < -OFFSETTOBLOCKCHANGE){
				$(this).animate({left: '-' + $(this).outerWidth() + 'px'});
				$(this).draggable( "option", "revert", true);
			}

		}
	})
	// $('.top_block').draggable({
	// 	start: function(event, ui){
 //        	$.mousedirection();
	// 		$(this).bind('mousedirection',function(e){
	// 			$(this).html(e.direction);
	// 			if(e.direction == "x"){
	// 				$(".top_block").draggable( "option", "axis", "x" );
	// 			}else{
	// 				$(".top_block").draggable( "option", "axis", "y" );
	// 			}
	// 			$(this).unbind('mousedirection');
	// 		})
	// 	},
	// 	stop: function(){
	// 		$(this).unbind('mousedirection');
	// 	}
	//})
})