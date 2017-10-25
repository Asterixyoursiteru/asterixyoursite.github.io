$(function(){
	var sideToMove;
	var originalPosition,
		deltaX,
		deltaY,
		newDrag,
		xMax,
		newPosition,
		activeWidth;
	var OFFSETTOBLOCKCHANGE = 300,
		NOBLOCKONSIDESPEED = 10;
	var nextItem,
		prevItem;
	var leftActive;

	// animation of items
	var calcNextItem = function(i, a, reverse){
		var dragProcent = (activeWidth - leftActive) * 100 / activeWidth;
		var css = reverse ? 1 - (i * dragProcent / 100) : i * dragProcent / 100;
		return css;
	}
	var calcPrevItem = function(){
		var left = -activeWidth + leftActive;
		return left;
	}

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
			originalPosition = ui.helper.data('draggableXY.originalPosition');
			deltaX = Math.abs(originalPosition.left - ui.position.left);
			deltaY = Math.abs(originalPosition.top - ui.position.top);

			newDrag = false || ui.helper.data('draggableXY.newDrag');
			ui.helper.data('draggableXY.newDrag', false);

			xMax = newDrag ? Math.max(deltaX, deltaY) === deltaX : ui.helper.data('draggableXY.xMax');
			ui.helper.data('draggableXY.xMax', xMax);

			newPosition = ui.position;
			if(xMax) {
			  newPosition.top = originalPosition.top;
			}
			if(!xMax){
			  newPosition.left = originalPosition.left;
			}
			// =======set axis end================================================================

			$(this).find('span').html('top: ' + newPosition.top + ' left: ' + newPosition.left);
			// if >300px to both direction - revert false
			if(Math.abs(newPosition.left) > OFFSETTOBLOCKCHANGE){
				$(this).draggable( "option", "revert", false);
			}

			nextItem = $('.next_item');
			prevItem = $('.prev_item');
			leftActive = Math.abs(parseInt($(this).css('left')));
			activeWidth = $(this).outerWidth();
			sideToMove = newPosition.left > 0 ? 'right' : 'left';
			switch(sideToMove){
				case 'right':
					if(!prevItem.length){
						ui.position.left /= NOBLOCKONSIDESPEED;
					}else{
						prevItem.attr('style', 'left: ' + calcPrevItem() + 'px')
					}
					break;
				case 'left':
					if(!nextItem.length){
						ui.position.left /= NOBLOCKONSIDESPEED;
					}else{
						nextItem.attr('style','transform: perspective(500px) translateX(' + calcNextItem(-2, 0) + '%) scale(' + calcNextItem(0.1, 1, true) + ') rotateY(' + calcNextItem(-20, 2) + 'deg); opacity: ' + calcNextItem(0.33, 3, true));
					}
					break;
			}

		},
		stop: function(event, ui){
			nextItem = $('.next_item');
			// Continue animate ACTIVE if drag and drop on > 300px
			if(Math.abs(ui.position.left) > OFFSETTOBLOCKCHANGE){
				switch(sideToMove){
					case 'right':
						prevItem.addClass('toActive').attr('style','');
						$(this).animate({left: $(this).outerWidth() + 'px'},500, function(){
							prevItem.removeClass('prev_item toActive').addClass('active').prev().addClass('prev_item')
							prevItem.next().removeClass('active').addClass('next_item').next().removeClass('next_item');
						});
						break;
					case 'left':
						nextItem.addClass('toActive').attr('style','');
						$(this).animate({left: '-' + $(this).outerWidth() + 'px'},500, function(){
							nextItem.removeClass('next_item toActive').addClass('active').next().addClass('next_item');
							nextItem.prev().removeClass('active').addClass('prev_item').prev().removeClass('prev_item');
						});
						break;
				}
				$(this).draggable( "option", "revert", true);
			}
			if(Math.abs(ui.position.left) < OFFSETTOBLOCKCHANGE){
				$(this).animate({left: '0px'});
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