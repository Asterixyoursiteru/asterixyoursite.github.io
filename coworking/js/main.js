$(function(){
	var sideToMove;
	var originalPosition,
		deltaX,
		deltaY,
		newDrag,
		xMax,
		newPosition,
		activeWidth;
	var OFFSETTOBLOCKCHANGE = 300;
	var nextItem; //====
	var leftActive;

	// animation of items
	var cssArr = [];
	var calcNextItem = function(i, a, reverse){
		var dragProcent = (activeWidth - leftActive) * 100 / activeWidth;
		var css = reverse ? 1 - (i * dragProcent / 100) : i * dragProcent / 100;
		cssArr[a] = css;
		return css;
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

			$(this).html('top: ' + newPosition.top + ' left: ' + newPosition.left);
			// if >300px to both direction - revert false
			if(Math.abs(newPosition.left) > OFFSETTOBLOCKCHANGE){
				$(this).draggable( "option", "revert", false);
			}

			nextItem = $('.next_item');
			leftActive = Math.abs(parseInt($(this).css('left')));
			activeWidth = $(this).outerWidth();
			sideToMove = newPosition.left > 0 ? 'right' : 'left';
			switch(sideToMove){
				case 'right':
					console.log('right');
					break;
				case 'left':
					nextItem.attr('style','transform: perspective(500px) translateX(' + calcNextItem(-2, 0) + '%) scale(' + calcNextItem(0.1, 1, true) + ') rotateY(' + calcNextItem(-20, 2) + 'deg); opacity: ' + calcNextItem(0.33, 3, true));
					break;
			}

		},
		stop: function(event, ui){
			nextItem = $('.next_item');
			// Continue animate ACTIVE if drag and drop on > 300px

  			console.log(cssArr)
			if(Math.abs(ui.position.left) > OFFSETTOBLOCKCHANGE){
				switch(sideToMove){
					case 'right':
						$(this).animate({left: $(this).outerWidth() + 'px'},500);
						break;
					case 'left':
						nextItem.addClass('toActive').attr('style','');
						$(this).animate({left: '-' + $(this).outerWidth() + 'px'},500, function(){
							nextItem.removeClass('next_item toActive').addClass('active').next().addClass('next_item');
						});
						// var translateX = $(this).css('translateX');
						// var rotateY = $(this).css('rotateY');
						// var scale = $(this).css('scale');
						// var opacity = $(this).css('opacity');
						// nextItem.attr('style','transform: perspective(500px)' + 
						// 			+ 'translateX('	+ calcNextItem(cssArr[0], 0) + '%)' + 
						// 			+' scale(' + calcNextItem(cssArr[1], 1, true) +
						// 			+ ') rotateY(' + calcNextItem(cssArr[2], 2) + 'deg); opacity: ' + calcNextItem(cssArr[3], 3, true));
						// nextItem.animate({opacity:'1', transform:'translateX(0%)'});
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