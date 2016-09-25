(function ($, _, Backbone) {
	// use DeepModel if exist, Model otherways
    var Model = Backbone.DeepModel || Backbone.Model;

    // can register own directives - open to extend
    Backbone.Directives = {};

    // on model change, put model value into html
    Backbone.Directives['data-content'] = function ($item, attributeValue, model) {
        var callback = function (model, value) {
            $item.html(value);
        };
        callback(model, model.get(attributeValue));
        model.on('change:' + attributeValue, callback);
    };

    // on model change, use toggle to set visibility
    Backbone.Directives['data-visible'] = function ($item, attributeValue, model) {
        var callback = function (model, value) {
            $item.toggle(!!value);
        };
        callback(model, model.get(attributeValue));
        model.on('change:' + attributeValue, callback);
    };

	Backbone.Directives['data-change'] = function($item, attributeValue, model) {
    // update view on model change
      var callbackModel = function(model, value) {
      	var tagName = $item.prop('tagName');
		if ($item.attr('type') === 'checkbox') {
          $item.prop('checked', !!value);
        } else if ($item.attr('type') === 'radio') {
          if (value == $item.val()) {
          	$item.prop('checked', true);
          }
        } else if (tagName === 'INPUT' || tagName === 'SELECT') {
          $item.val(value);
        }
      };
      model.on('change:' + attributeValue, callbackModel);
      
      // update model on view change
      var callbackView = function() {
      	if ($item.attr('type') === 'checkbox') {
        	model.set(attributeValue, $item.prop('checked'));
        } else {
        	model.set(attributeValue, $item.val());
        }
      }
      $item.on('change input blur', callbackView);
      
      // set initial
      callbackView();
    };
    
  	// update class based on model
    Backbone.Directives['data-class'] = function ($item, attributeValue, model) {
        var json = {};
        try {
        	json = JSON.parse(attributeValue);
        } catch(exception) {
        	throw ("Backbone-simple-directive JSON parse error: " + exception.toString());
        }
        _.each(json, function(value, key) {
        	model.on('change:' + value.toString(), function(model, value) {
          	$item.toggleClass(key, !!value);
          });
        });
    };

    // set up view
    Backbone.View.prototype.setupDirective = function () {

        // model must have own name
        if (!_.isString(this.modelName)) {
            throw "Backbone-simple-directive error: modelName is required for directiveView";
            return false;
        }

        // set up model if not exist
        this.$model = this.$model || (new Model());

        // search not bounded filters
        // checking for data('model-bound') allows multiple call with one binding
        var $elements = _.filter(this.$('[data-model]').toArray(), function (item) {
            return $(item).attr('data-model') === this.modelName && $(item).data('model-bound') !== true;
        }, this);

        // for each found element
        _.each($elements, function (item) {
        	// set current element 
            $(item).data('model-bound', true);

            // for each directive
            _.each(Backbone.Directives, function (func, name) {

                // check we need this directive
                if (!$(item).attr(name) || !_.isFunction(func)) {
                    return;
                }
                // apply that
                func($(item), $(item).attr(name), this.$model);
            }, this);
        }, this);
    }
})($ || jQuery, _, Backbone);
