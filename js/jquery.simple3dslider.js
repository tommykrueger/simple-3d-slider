/*
 * Test
 */

(function($){

	$.fn.simple3DSlider = function(options) {
		
		var options = $.extend({}, $.fn.simple3DSlider.defaultOptions, options || {});
		
		return this.each(function() {
			
			var elem = $(this);
			
			//make local copy of the settings
			var $options = jQuery.extend(true, {}, options);
			
			var s3ds = new Simple3DSlider($options, elem);
			s3ds._init();			
	    });
	};
	
	// process plugin settings and set defaults
	$.fn.simple3DSlider.defaultOptions = {
		current: 2,
		autoSlide: true,
		speed: 2000,
		transitionSpeed: 350,		
		
		prevItem: '#prev',
		nextItem: '#next',
		
		beforeClass: 'before',
		activeClass: 'active',
		afterClass: 'after'
	};
	
	/**
	 * ColorPicker class definition
	 */
	function Simple3DSlider(options, elem)
	{ 
		this.$options = options;
		this.$elem = elem;
		this.$children = this.$elem.children();
		this.currentIdx = this.$options.current;
		
		return this;
	}
	
	/**
	 * Prototype Class
	 */
	Simple3DSlider.prototype =
	{
		_init: function () {
	
			if(this.$elem.children().length <= 1){
				console.log('starting Auto sliding');
				return false;
			}
			
			var $this = this;
		
			this._setItemClasses();
			
			this.$children.click(this._click);
			
			var $elemWidthHalf = this.$elem.width() / 2;
			
			var $elemItemWidthHalf = this.$children.width() / 2;
			
			var offsetX = $elemWidthHalf - $elemItemWidthHalf;
			
			// move the active item to the center
			$('li.active').css({
				'left': offsetX
			});
			var currentIdx = this.currentIdx;
			
			this.$children.eq(this.currentIdx).nextAll().each(function(){
				var idx = $('li.after').index($(this)) + 1;
				$(this).css({
					'left': offsetX + 150 * idx
				});
			});
			
			this.$children.eq(this.currentIdx).prevAll().each(function(){
				var idx = $('li.before').index($(this)) + 1;
				$(this).css({
					'left': offsetX + 150 * (idx - currentIdx - 1) 
				});
			});
			
			this.$elem.append('<div id="currentTitle"></div>');
			this._setCurrentTitle();
			
			
			this.$children.click(function(e){ 
				//console.log($this);
				//e.preventDefault();
				$thisEl = $(this);
				$this._clickItem(e, $thisEl, $this); 
				});
			
			$(this.$options.prevItem).click(function(e){
				e.preventDefault();
				e.stopPropagation();
				
				console.log($this.currentIdx);
				
				$this.$children.eq($this.currentIdx).removeClass('active').addClass('before');
				$this.$children.eq($this.currentIdx).prev().removeClass('after').addClass('active');
				
			});
			
			
			// start the slider
			this._start();
			
		},
		
		_setItemClasses: function(){
			console.log('setting items classes');
			
			// set the current element to active
			this.$children.removeClass('active');
			this.$children.removeClass('after');
			this.$children.removeClass('before');
			
			this.$children.eq(this.currentIdx).addClass(this.$options.activeClass);
			this.$children.eq(this.currentIdx).prevAll().addClass(this.$options.beforeClass);
			this.$children.eq(this.currentIdx).nextAll().addClass(this.$options.afterClass);
		},
		
		_setCurrentTitle: function(){
			var $this = this;
			var speed = this.$options.transitionSpeed / 2;
			
			$('#currentTitle').fadeOut(speed, function(){
				$('#currentTitle').html($this.$children.eq($this.currentIdx).find('span').html()).fadeIn(speed);
			});
		},
		
		_start: function(){
			
			if(this.$options.autoSlide){
				//this._startAutoSlide();
				//console.log('starting Auto sliding');
			}
		},		
		
		/**
		 * 
		 * @param eventObject e - the event handler object
		 * @param object $thisEl - the this context of the clicked element
		 * @param object $this - the this context of the sldier object
		 * @returns
		 */
		_clickItem: function(e, $thisEl, $this){
			
			
			//check if the clicked item is left or right from the current element
			var clickedIdx = $('li').index($thisEl);
			//console.log(clickedIdx);
			//console.log($this.currentIdx);
			
			if(clickedIdx == $this.currentIdx)
				return false;
			else if(clickedIdx < $this.currentIdx){
				e.preventDefault();
				// move the list elements to the right
				console.log('moving elements to the left');
				$this._moveItems('left', clickedIdx);
				
				console.log($thisEl.find('img'));
				//$thisEl.animate({'bottom': '20px'}, $this.$options.transitionSpeed);
				//$thisEl.find('img').animate({'width': '200px'}, $this.$options.transitionSpeed);
			}
			else {
				// move the list elements to the left
				e.preventDefault();
				console.log('moving elements to the right');
				$this._moveItems('right', clickedIdx);
			}
			
			$this.currentIdx = clickedIdx;
			$this._setItemClasses();
			$this._setCurrentTitle();
		},

		_moveItems: function(direction, clickedIdx){
			var $this = this;
			
			// calculate the pixels to shift left
			var offsetX = (this.currentIdx - clickedIdx);
			
			offsetX = offsetX * 150;
			
			console.log(offsetX);
			
			this.$children.each(function(){
				$(this).stop().animate({'left': '+=' + offsetX}, $this.$options.transitionSpeed);
			});
		},
		
		nextItem: function(){
			
		},
		
		prevItem: function(){
			
		}
	};

})(jQuery);