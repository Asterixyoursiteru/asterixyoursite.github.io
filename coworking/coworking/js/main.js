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
	var updateGalleryClasses = function(item){
		if(item.hasClass('prev_item')){
			item.removeClass('prev_item toActive').addClass('active_drag').draggable(draggableOptions).prev().addClass('prev_item')
			item.next().removeClass('active_drag').draggable("destroy").addClass('next_item').next().removeClass('next_item');
		}
		if(item.hasClass('next_item')){
			item.removeClass('next_item toActive').addClass('active_drag').draggable(draggableOptions).next().addClass('next_item');
			item.prev().removeClass('active_drag').draggable("destroy") .addClass('prev_item').prev().removeClass('prev_item');
		}

	}
	var draggableOptions = { 
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

			// ANIMATE WHILE DRAGGING
			nextItem = $('.next_item');
			prevItem = $('.prev_item');
			leftActive = Math.abs(parseInt($(this).css('left')));
			activeWidth = $(this).outerWidth();
			sideToMove = newPosition.left > 0 ? 'right' : 'left';
			switch(sideToMove){
				// IF MOVE BLOCK TO RIGHT SIDE
				case 'right':
					if(!prevItem.length){
						ui.position.left /= NOBLOCKONSIDESPEED;
					}else{
						prevItem.attr('style', 'left: ' + calcPrevItem() + 'px')
					}
					break;
				// IF MOVE BLOCK TO left SIDE
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
			// Continue animate ACTIVE if drag and drop on > 300px
			nextItem = $('.next_item');
			if(Math.abs(ui.position.left) > OFFSETTOBLOCKCHANGE){
				switch(sideToMove){
					case 'right':
						prevItem.addClass('toActive').attr('style','');
						$(this).animate({left: $(this).outerWidth() + 'px'},500, function(){
							updateGalleryClasses(prevItem);
						});
						break;
					case 'left':
						nextItem.addClass('toActive').attr('style','');
						$(this).animate({left: '-' + $(this).outerWidth() + 'px'},500, function(){
							updateGalleryClasses(nextItem);
						});
						break;
				}
				$(this).draggable( "option", "revert", true);
			}else{
				$(this).animate({left: '0px'});
				$(this).draggable( "option", "revert", true);
			}
		}
	}
	$('.active_drag').draggable(draggableOptions);

	// GALLERY ARROWS CONTROLL
	$('.top_gallery_arrow_right').click(function(){
		$('.top_block.next_item').addClass('toActive');
		$('.top_block.active_drag').animate({left: '-' + $('.top_block.active_drag').outerWidth() + 'px'}, function(){
			updateGalleryClasses($('.top_block.next_item'));
		})
	})
	$('.top_gallery_arrow_left').click(function(){
		$('.top_block.prev_item').addClass('toActive');
		$('.top_block.active_drag').animate({right: + $('.top_block.active_drag').outerWidth() + 'px'}, function(){
			updateGalleryClasses($('.top_block.prev_item'));
		})
	})
})