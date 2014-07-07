; (function ($, window, document, undefined) {

	Plugin = function(base, elements) {
		this.base = base;
		this.elements = elements;
	};

	Plugin.prototype = {
		init: function () {
			var base = this.base;
			base.width(this.elements.length*18*16+12);
			$.each(this.elements, function(key, element){
				base.append("<div class='swipe_sub_block'>"+element+"</div>");
			});
			return this;
		},
		next: function () {
			var base = this.base;
			base.animate({left: "-=18em"}, 500, function() {});
		},
		prev: function () {
			var base = this.base;
			base.animate({left: "+=18em"}, 500, function() {});
		}
	}

	$.fn.swipe_block = function (elements) {
		return (new Plugin(this, elements).init());
	};

})(jQuery, window, document);
