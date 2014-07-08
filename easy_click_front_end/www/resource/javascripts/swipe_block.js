; (function ($, window, document, undefined) {

	Plugin = function(base, elements, options) {
		this.base = base;
		this.elements = elements;
		this.options = options;
		this.position = 0;
		this.offset = 0;
		this._offset = 0;
		this.slide_block = {};
	};

	Plugin.prototype = {
		default_option: {
			sub_width: 300
		},
		init: function () {
			var base = this.base;
			this.options = typeof this.options !== 'undefined' ? this.options : this.default_option;
			var options = this.options;
			base.width(this.elements.length*options.sub_width);
			this.offset = parseInt(this.options.sub_width*1.5-window.outerWidth/2);
			this._offset = parseInt((window.outerWidth-this.options.sub_width)/2);
			$.each(this.elements, function(key, element){
				var _color;
				key%2 ? _color="#A9D0F5" : _color="#BCF5A9";
				$("<div>"+
					"<p>"+element.index+"<p>"+
				"</div>").addClass("swipe_sub_block").css({"background-color":_color, "width": options.sub_width}).appendTo(base);
			});
			this.slide_block = $("<div></div>").addClass("swipe_slide_block").width(options.sub_width).appendTo(base);
			return this;
		},
		next: function (speed) {
			speed = typeof speed !== 'undefined' ? speed : 500;
			if (this.position < this.elements.length-1) {
				if (this.position == 0) {
					this.base.animate({left: "-="+this.offset}, speed);
					this.slide_block.animate({left: "+="+(this.offset+this._offset)},speed*1.5);
				} else if (this.position == this.elements.length-2) {
					this.base.animate({left: "-="+this.offset}, speed);
					this.slide_block.animate({left: "+="+(this.offset+this._offset)},speed*1.5);
				} else {
					this.base.animate({left: "-="+this.options.sub_width}, speed);
					this.slide_block.animate({left: "+="+this.options.sub_width},speed*1.5);
				}
				this.position++;
			}
			return this;
		},
		prev: function (speed) {
			speed = typeof speed !== 'undefined' ? speed : 500;
			if (this.position > 0) {
				if (this.position == 1) {
					this.base.animate({left: 0}, speed);
					this.slide_block.animate({left: 0},speed*1.5);
				} else if (this.position == this.elements.length-1) {
					this.base.animate({left: "+="+this.offset}, speed);
					this.slide_block.animate({left: "-="+(this.offset+this._offset)},speed*1.5);
				} else {
					this.base.animate({left: "+="+this.options.sub_width}, speed);
					this.slide_block.animate({left: "-="+this.options.sub_width},speed*1.5);
				}
				this.position--;
			}
			return this;
		},
		getValue: function () {
			return this.elements[this.position].value;
		}
	}

	$.fn.swipe_block = function (elements, options) {
		return (new Plugin(this, elements, options).init());
	};

})(jQuery, window, document);
