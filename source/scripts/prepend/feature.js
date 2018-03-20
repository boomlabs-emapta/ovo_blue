var bLazy = new Blazy({
	breakpoints: [{
    	width: 640, 
    	src: 'data-src-md'
    },{
    	width: 480,
    	src: 'data-src-sm'
	}], 
	success: function(element){
	    setTimeout(function() {
			// We want to remove the loader gif now.
			// First we find the parent container
			// then we remove the "loading" class which holds the loader image
			var parent = element.parentNode;
			parent.className = parent.className.replace(/\bloading\b/,'');
	    }, 200);
    }
});


var sliderObj = {
	init : function(element,direction,settings,skip) {
		var obj = {
			element : element,
			direction : direction,
			settings : settings,
			swiper : this.setSwiper(element,direction,settings)
		};
		
		if(direction == "vertical" && !skip) {
			this.verticalSliders.push(obj);
		} 
		return obj.swiper;
	},	
	verticalSliders: [],
	resizeTimeout : 0,
	resizeSmall : window.innerWidth <= 820 ? false : true,
	resetSwiper : function(slider,direction) {
		if(slider.swiper) {
			slider.swiper.destroy(true, true);
		}
		slider.swiper = this.setSwiper(slider.element,direction,slider.settings);
		console.log("DESKTOP",slider);
	},
	setSwiper : function(element,direction,customSettings) {
		if(element) {
			var customSettings = customSettings || {};
			var settings = Object.assign({
				slidesPerView: 'auto',
				centeredSlides: false,
				slideToClickedSlide: false,
				loop: false,
				simulateTouch: true,
				spaceBetween: 0,
				direction: direction ? direction : "horizontal",
				on: {
					transitionEnd: function () {
						bLazy.revalidate();
					}
				}
			}, customSettings);
		
			var obj = new Swiper(element,settings);
			return obj;
		}
		return 0;
	},
	resizeThrottler : function() {
		// ignore resize events as long as an actualResizeHandler execution is in the queue
		var $this = sliderObj;
		if ( !$this.resizeTimeout ) {
			$this.resizeTimeout = setTimeout(function() {
				$this.resizeTimeout = null;
				$this.sliderResizeHandler();
	
				// The actualResizeHandler will execute at a rate of 15fps
			}, 66);
		}
	},
	sliderResizeHandler: function() {
		var $this = this;
		console.log("actualResizeHandler",$this.verticalSliders);
	    for(var i=0; i<$this.verticalSliders.length; i++) {
		    var dir = (window.innerWidth <= 820) ? "horizontal" : "vertical";
		    if(dir != $this.swiperdirection) {
			    if(dir == "horizontal") {
				    $this.swiperdirection = "horizontal";
			    	if($this.verticalSliders[i]) {
				    	$this.resetSwiper($this.verticalSliders[i],"horizontal");
						console.log("SMALL",$this.verticalSliders[i].swiper);
					}
				} else if (dir == "vertical") { 
			    	$this.swiperdirection = "vertical";
					if($this.verticalSliders[i]) {
						$this.resetSwiper($this.verticalSliders[i],"vertical");
						console.log("DESKTOP",$this.verticalSliders[i].swiper);
					}
			    }
			}
		}
	}
}
window.addEventListener("resize", sliderObj.resizeThrottler, false);

