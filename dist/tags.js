/**
 * Tags.js
 * -------
 * User interface to input tags
 *
 * @version 0.1.0 (2014-09-28)
 * @author mach3 <http://github.com/mach3>
 * @license MIT
 */
(function($){

	/**
	 * Tags
	 * ----
	 * @class UI to input tag
	 */
	var Tags = function(){
		this.init.apply(this, arguments);
	};

	(function(){
		var api = Tags.prototype;

		api.el = null;

		api.nodeInput = null;
		api.nodeTags = null;
		api.nodeHidden = null;
		api.nodeSuggest = null;

		api.tags = [];
		api.suggesting = false;

		api.defaults = {
			delimiter: ",",
			nodeTagsContainer: null,
			tags: null,
			suggests: null,
			suggestsLimit: 5,
			classList: "js-tags-list",
			classLabel: "js-tags-label",
			classRemove: "js-tags-button-remove",
			classSuggest: "js-tags-suggest",
			classSuggestItem: "js-tags-suggest-item"
		};

		/**
		 * Constructor
		 * @param {HTMLInputElement} el
		 * @param {Object} options
		 */
		api.init = function(el, options){
			this.el = el;
			this.nodeInput = $(el);

			this.options = {};
			this.config(this.defaults).config(options);

			this.initView();
			this.initEvents();
		};

		/**
		 * Configure options
		 * @param {Object} options
		 */
		api.config = function(options){
			$.extend(true, this.options, options);
			return this;
		};

		/**
		 * Initialize view
		 */
		api.initView = function(){
			var o, my;

			o = this.options;
			my = this;

			// render nodeTags
			this.nodeTags = $("<ul>").addClass(o.classList);
			if(o.nodeTagsContainer){
				o.nodeTagsContainer.append(this.nodeTags);
			} else {
				this.nodeTags.insertAfter(this.nodeInput);
			}

			// render nodeHidden
			this.nodeHidden = $("<input>", {
				type: "hidden",
				name: this.nodeInput.attr("name")
			})
			.insertBefore(this.nodeInput);

			// render nodeSuggest
			this.nodeSuggest = $("<div>")
			.addClass(o.classSuggest)
			.css("position", "absolute")
			.hide()
			.insertAfter(this.nodeInput);

			// default tags are specified ?
			if(o.tags){
				if($.type(o.tags) !== "array"){
					o.tags = o.tags.split(o.delimiter);
				}
				$.each(o.tags, function(i, name){
					my.add(name);
				});
			}

			// reset input
			this.nodeInput.attr({
				name: "",
				autocomplete: "off"
			});
		};

		/**
		 * Initialize events
		 */
		api.initEvents = function(){
			var my, o, handlers;

			my = this;
			o = this.options;

			handlers = [
				"onClickRemove",
				"onKeyDown",
				"onBlur",
				"onClickSuggest",
				"onHoverSuggest"
			];

			$.each(handlers, function(i, name){
				my[name] = $.proxy(my[name], my);
			});

			this.nodeTags.on("click", "." + o.classRemove, this.onClickRemove);
			this.nodeInput.on("keydown", this.onKeyDown);
			this.nodeSuggest.on("click", "." + o.classSuggestItem, this.onClickSuggest);
			this.nodeSuggest.on("mouseover", "." + o.classSuggestItem, this.onHoverSuggest);
			this.nodeInput.on("blur", this.onBlur);
		};

		/**
		 * Add a tag
		 * @param {String} name
		 */
		api.add = function(name){
			var o = this.options;

			name = $.trim(name);

			if(! name || $.inArray(name, this.tags) >= 0){
				return;
			}

			this.tags.push(name);
			this.nodeHidden.val(this.tags.join(o.delimiter))
			$("<li>").append(
				$("<span>")
				.addClass(o.classLabel)
				.text(name),
				$("<button>")
				.addClass(o.classRemove)
				.html("&times;")
			)
			.data("value", name)
			.appendTo(this.nodeTags);
		};

		/**
		 * Remove a tag
		 * @param {String} name
		 */
		api.remove = function(name){
			var o = this.options;

			name = $.trim(name);
			this.tags = $.grep(this.tags, function(value){
				return value !== name;
			});
			this.nodeHidden.val(this.tags.join(o.delimiter));
			this.nodeTags.find("li").filter(function(){
				return $(this).data("value") === name;
			}).remove();
		};

		/**
		 * Show or hide suggest
		 * @param {Boolean} show
		 */
		api.suggest = function(show){
			var o, value, list, my, pattern;

			show = (show === void 0) ? true : false;
			o = this.options;
			value = this.nodeInput.val();
			my = this;
			
			pattern = new RegExp(value.split("").join(".*"), "i");
			list = $.grep(o.suggests, function(name){
				return pattern.test(name);
			});

			if(! show || value === "" || ! list.length){
				this.suggesting = false;
				this.nodeSuggest.hide();
				return;
			}

			this.suggesting = true;
			list.slice(0, o.suggestLimit);
			this.nodeSuggest.html("");
			$.each(list, function(i, name){
				$("<div>").addClass(o.classSuggestItem)
				.data("value", name)
				.text(name)
				.appendTo(my.nodeSuggest);
			});
			this.nodeSuggest.show();
		},

		/**
		 * Toggle the selection of suggest
		 * - If next is `true`, selection is moved to the next item
		 * - If `false`, moved to previous one
		 * @param {Boolean} next
		 */
		api.toggleSuggest = function(next){
			var o, items, index;

			next = (next === void 0) ? true : next;
			o = this.options;
			items = this.nodeSuggest.find("." + o.classSuggestItem);
			index = (function(){
				var selected = items.filter(".selected");
				if(! selected.length){
					return -1;
				}
				return selected.prevAll().length;
			}());

			index += (next) ? 1 : -1;
			index = index % items.length;

			items.removeClass("selected")
			.eq(index).addClass("selected");
		};

		/**
		 * Unselect suggests
		 */
		api.cleanSuggest = function(){
			this.nodeSuggest
			.find("." + this.options.classSuggestItem)
			.removeClass("selected");
		};

		/**
		 * Add new tag from selected item in suggests
		 */
		api.selectSuggest = function(){
			var o, selected;

			o = this.options;
			selected = this.nodeSuggest.find("." + o.classSuggestItem + ".selected");

			if(selected.length){
				this.add(selected.data("value"));
				this.nodeInput.val("");
			}

			this.suggest(false);

			return !! selected.length;
		};

		/**
		 * Handler: keydown on input
		 * @param {Event} e
		 */
		api.onKeyDown = function(e){
			var my = this;


			switch(e.which){
				case 38: // up
					if(this.suggesting){
						return this.toggleSuggest(false);
					}
				case 40: // down
					if(this.suggesting){
						return this.toggleSuggest(true);
					}
				case 9: // tab
					if(this.suggesting){
						e.preventDefault();
						return this.toggleSuggest(! e.shiftKey);
					}
				case 13: // enter
					e.preventDefault();
					if(this.suggesting){
						if(this.selectSuggest()){
							return;
						}
					}
					this.add(this.nodeInput.val());
					this.nodeInput.val("");
					this.suggest(false);
					return;
				case 16: // shift
					return;
				case 27: // esc
					return my.suggest(false);
				default:
					setTimeout(function(){
						my.suggest();
					}, 10)
				break;
			}
		};

		/**
		 * Handler: click remove button
		 * @param {Event} e
		 */
		api.onClickRemove = function(e){
			var node = $(e.currentTarget).closest("li");
			this.remove(node.data("value"));
		};

		/**
		 * Handler: blur from input
		 * @param {Event} e
		 */
		api.onBlur = function(e){
			var my = this;
			setTimeout(function(){
				my.suggest(false);
			}, 100);
		};

		/**
		 * Handler: click suggest item
		 * @param {Event} e
		 */
		api.onClickSuggest = function(e){
			this.add($(e.currentTarget).data("value"));
			this.nodeInput.val("");
		};

		/**
		 * Handler: mouseover on suggest item
		 * @param {Event} e
		 */
		api.onHoverSuggest = function(e){
			this.cleanSuggest();
		};

	}());


	/**
	 * Export
	 */
	$.fn.tags = function(options){
		this.each(function(){
			if(! this._tagsInstance){
				this._tagsInstance = new Tags(this, options);
			}
		});
	};

}(jQuery));