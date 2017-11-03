$(function(){
	var sideToMoveX;
	var originalPosition,
		deltaX,
		deltaY,
		newDrag,
		xMax,
		newPosition,
		activeWidth;
	var OFFSETTOBLOCKCHANGE = 300,
		NOBLOCKONSIDESPEED = 10;
	var nextItem = $('.next_item'),
		prevItem = $('.prev_item');
	var nextAjaxItem = $('.next_inner_item');
	var prevAjaxItem = $('.prev_inner_item');
	var leftActive;

	var thisInnerItem,
		nextInnerItem,
		prevInnerItem,
		speedOfActive;
	var attr;

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
		checkItemOnContinue(item);
		if(item.hasClass('prev_item')){
			item.find('.active_inner').attr('style','');
			item.removeClass('prev_item toActive').addClass('active_drag').draggable(draggableOptions).prev().addClass('prev_item');
			item.next().attr('style','').removeClass('active_drag').draggable("destroy").addClass('next_item').next().attr('style','').removeClass('next_item');
		}else if(item.hasClass('next_item')){
			item.find('.active_inner').attr('style','');
			item.removeClass('next_item toActive').addClass('active_drag').draggable(draggableOptions).next().addClass('next_item');
			item.prev().attr('style','').removeClass('active_drag').draggable("destroy").addClass('prev_item').prev().attr('style','').removeClass('prev_item');
		}else{
			$('.block.active_drag').next().removeClass('next_item');
			$('.block.active_drag').draggable("destroy").removeClass('active_drag').prev().removeClass('prev_item');
			item.next().addClass('next_item');
			item.draggable(draggableOptions).addClass('active_drag').prev().addClass('prev_item');
		}
	}
	var checkItemOnContinue = function(item){
		if(!item.prev().length){
			$('.top_gallery_arrow_left').fadeOut(100);
		}else{
			$('.top_gallery_arrow_left').fadeIn(100);	
		}
		if(!item.next().length){
			$('.top_gallery_arrow_right').fadeOut(100);
		}else{
			$('.top_gallery_arrow_right').fadeIn(100);	
		}
	}
	checkItemOnContinue($('.active_drag'));
	var updateAxisYGallery = function(item){
		if(item.hasClass('prev_inner_item')){
			var parent = item.parents('.block');
			parent.animate({top: '0px'},500);
			thisInnerItem.animate({top: '0px'},500);
			prevInnerItem.animate({top: '0px'},500, function(){
				thisInnerItem.removeClass('active_inner').addClass('next_inner_item').next().removeClass('next_inner_item');
				prevInnerItem.removeClass('prev_inner_item').addClass('active_inner').prev().addClass('prev_inner_item');
				parent.draggable( "option", "revert", true);
				thisInnerItem.attr('style','');
				prevInnerItem.attr('style','');
			});
		}else if(item.hasClass('next_inner_item')){
			var parent = item.parents('.block');
			parent.animate({top: '0px'},500);
			thisInnerItem.animate({top: '0px'},500);
			nextInnerItem.animate({top: '0px'},500, function(){
				thisInnerItem.removeClass('active_inner').addClass('prev_inner_item').prev().removeClass('prev_inner_item');
				nextInnerItem.removeClass('next_inner_item').addClass('active_inner').next().addClass('next_inner_item');
				parent.draggable( "option", "revert", true);
				thisInnerItem.attr('style','');
				nextInnerItem.attr('style','');
			});
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
			{
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
			}
			// =======set axis end================================================================

			// if >300px to both direction - revert false
			if(Math.abs(newPosition.left) > OFFSETTOBLOCKCHANGE){
				$(this).draggable( "option", "revert", false);
			}
			if(Math.abs(newPosition.top) > OFFSETTOBLOCKCHANGE){
				$(this).draggable( "option", "revert", false);
			}

			// ANIMATE WHILE DRAGGING
			nextItem = $('.next_item');
			prevItem = $('.prev_item');
			leftActive = Math.abs(parseInt($(this).css('left')));
			activeWidth = $(this).outerWidth();
			sideToMoveX = (newPosition.left > 0) ? 'right' : (newPosition.left < 0) ? 'left' : false;
			switch(sideToMoveX){
				// IF MOVE BLOCK TO RIGHT SIDE
				case 'right':
					if(!prevItem.length){
						ui.position.left /= NOBLOCKONSIDESPEED;
					}else{
						prevItem.attr('style', 'left: ' + calcPrevItem() + 'px').find('.active_inner').css('display','block');
					}
					break;
				// IF MOVE BLOCK TO left SIDE
				case 'left':
					if(!nextItem.length){
						ui.position.left /= NOBLOCKONSIDESPEED;
					}else{
						nextItem.attr('style','transform: perspective(500px) translateX(' + calcNextItem(-2, 0) + '%) scale(' + calcNextItem(0.1, 1, true) + ') rotateY(' + calcNextItem(-20, 2) + 'deg); opacity: ' + calcNextItem(0.33, 3, true)).find('.active_inner').css('display','block');;
					}
					break;
			}
			sideToMoveY = (newPosition.top > 0) ? 'bottom' : (newPosition.top < 0) ? 'top' : false;
			switch(sideToMoveY){
				// IF MOVE BLOCK TO BOTTOM SIDE
				case 'bottom':
					thisInnerItem = $(this).find('.active_inner');
					prevInnerItem = thisInnerItem.prev('.prev_inner_item');
					if(!prevInnerItem.length){
						ui.position.top /= NOBLOCKONSIDESPEED;
					}else{
						speedOfActive = ui.position.top / 2 * -1;
						thisInnerItem.css({top: speedOfActive});
						prevInnerItem.css({zIndex: '5'});
					}
					break;
				// IF MOVE BLOCK TO TOP SIDE
				case 'top':
					thisInnerItem = $(this).find('.active_inner');
					nextInnerItem = thisInnerItem.next('.next_inner_item');
					attr = nextInnerItem.attr('data-to-load');
					if(!nextInnerItem.length){
						ui.position.top /= NOBLOCKONSIDESPEED;
					}else if(typeof attr !== typeof undefined && attr !== false){
						speedOfActive = ui.position.top / 2 * -1;
						thisInnerItem.css({top: speedOfActive});
						var ajaxloader = $('#ajaxloader');
						var offsetAjaxloader = thisInnerItem.height() - parseInt(thisInnerItem.css('top'))*2 + $('.top_nav').height();
						var heightAjaxloader = thisInnerItem.height() + $('.top_nav').height() - offsetAjaxloader;
						ajaxloader.css({visibility: 'visible', opacity: '1', top: offsetAjaxloader, height: heightAjaxloader})
						nextInnerItem.css({zIndex: '5'});
					}else{
						speedOfActive = ui.position.top / 2 * -1;
						thisInnerItem.css({top: speedOfActive});
						nextInnerItem.css({zIndex: '5'});
					}
					break;
			}
		},
		stop: function(event, ui){
			// Continue animate ACTIVE if drag and drop on > 300px
			nextItem = $('.next_item');
			prevItem = $('.prev_item');
			// checkItemOnContinue(prevItem.prev());
			if(Math.abs(ui.position.left) > OFFSETTOBLOCKCHANGE){
				console.log('1');
				switch(sideToMoveX){
					case 'right':
						prevItem.addClass('toActive').attr('style','');
						$(this).animate({left: $(this).outerWidth() + 'px'},500, function(){
							// nextItem.attr('style','');
							updateGalleryClasses(prevItem);
							// $(this).attr('style','');
						});
						break;
					case 'left':
						nextItem.addClass('toActive').attr('style','');
						$(this).animate({left: '-' + $(this).outerWidth() + 'px'},500, function(){
							// prevItem.attr('style','');
							updateGalleryClasses(nextItem);
							// $(this).attr('style','');
						});
						break;
				}
				$(this).draggable( "option", "revert", true);
			}else if(Math.abs(ui.position.top) > OFFSETTOBLOCKCHANGE){
				console.log('2');
				switch(sideToMoveY){
					// IF MOVE BLOCK TO BOTTOM SIDE
					case 'bottom':
						updateAxisYGallery(prevInnerItem);
						break;
					// IF MOVE BLOCK TO TOP SIDE
					case 'top':
						if(typeof attr !== typeof undefined && attr !== false){
							nextInnerItem.load('ajax/1.html', function(){
								$('#ajaxloader').fadeOut(function(){
									$('#ajaxloader').attr('style','');
								});
								$(this).removeAttr('data-to-load');
							});
						}
						updateAxisYGallery(nextInnerItem);
						break;
				}
			}else if(Math.abs(ui.position.left) <= OFFSETTOBLOCKCHANGE && Math.abs(ui.position.left) !== 0){
				console.log('3');
				$(this).animate({left: '0px'},500, function(){
					$(this).attr('style','');
					nextItem.attr('style','').find('.active_inner').attr('style','');
					prevItem.attr('style','').find('.active_inner').attr('style','');
				});
			}else if(Math.abs(ui.position.top) <= OFFSETTOBLOCKCHANGE && Math.abs(ui.position.top) !== 0){
				console.log('4');
				if(typeof attr !== typeof undefined && attr !== false){
					nextInnerItem.load('ajax/1.html', function(){
						$('#ajaxloader').animate({top: '100%'},function(){
							$('#ajaxloader').attr('style','');
						});
						$(this).removeAttr('data-to-load');
					});
				}
				thisInnerItem.animate({top: '0px'},500, function(){
					thisInnerItem.attr('style','').next().attr('style','');
					thisInnerItem.prev().attr('style','');
				});
				thisInnerItem = $(this).find('.active_inner');
				$(this).animate({top: '0px'},500, function(){
					$(this).attr('style','');
				});
				$(this).draggable( "option", "revert", true);
			}
		}
	}
	$('.active_drag').draggable(draggableOptions);

	// GALLERY ARROWS CONTROLL
	$('.top_gallery_arrow_right').click(function(){
		$('.block.next_item').addClass('toActive');
		$('.block.active_drag').animate({left: '-' + $('.block.active_drag').outerWidth() + 'px'},500 ,function(){
			updateGalleryClasses($('.block.next_item'));
		})
	})
	$('.top_gallery_arrow_left').click(function(){
		$('.block.prev_item').addClass('toActive');
		$('.block.active_drag').animate({left: + $('.block.active_drag').outerWidth() + 'px'},500 ,function(){
			updateGalleryClasses($('.block.prev_item'));
		})
	})

	// TOP NAV AVIMATION
	$('.top_nav ul a').click(function(e){
		e.preventDefault();
		var href = $(this).attr('href');
		// $(href).css({'left':'100%','display':'block'}).addClass('toActiveForce');
		// $('.block.active_drag').animate({left: '-' + $('.block.active_drag').outerWidth() + 'px'},500 ,function(){
			updateGalleryClasses($(href));
		// })
	})
})