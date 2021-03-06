((function (factory) {

    // backbone way to define root element
    var root = (typeof self === 'object' && self.self === self && self) ||
        (typeof global === 'object' && global.global === global && global);

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'jquery', 'backbone'], factory);
    } else {
        factory(root._, (root.jQuery || root.Zepto || root.ender || root.$), root.Backbone);
    }

})(function (_, $, Backbone) {
    // use DeepModel if exist, Model otherwise
    var Model = Backbone.DeepModel || Backbone.Model;

    // can register own directives - open to extend
    Backbone.Directives = {};

    // on model change, put model value into html
    Backbone.Directives['data-content'] = function ($item, attributeValue, view, model) {
        var callbackModel = function (model, value) {
            $item.html(value);
        };
        callbackModel(model, model.get(attributeValue));
        model.on('change:' + attributeValue, callbackModel);
    };

    // on model change, use toggle to set visibility
    Backbone.Directives['data-visible'] = function ($item, attributeValue, view, model) {
        var callbackModel = function (model, value) {
            $item.toggle(!!value);
        };
        callbackModel(model, model.get(attributeValue));
        model.on('change:' + attributeValue, callbackModel);
    };

    Backbone.Directives['data-change'] = function ($item, attributeValue, view, model) {
        // update view on model change
        var callbackModel = function (model, value) {
            var tagName = $item.prop('tagName');
            if ($item.attr('type') === 'checkbox') {
                $item.prop('checked', !!value);
            } else if ($item.attr('type') === 'radio') {
                if (value === $item.val()) {
                    $item.prop('checked', true);
                }
            } else if (tagName === 'INPUT' || tagName === 'SELECT') {
                $item.val(value);
            }
        };
        model.on('change:' + attributeValue, callbackModel);

        // update model on view change
        var callbackView = function () {
            if ($item.attr('type') === 'checkbox') {
                model.set(attributeValue, $item.prop('checked'));
            } else {
                model.set(attributeValue, $item.val());
            }
        };
        $item.on('change input blur', callbackView);

        // set initial
        callbackView();
    };

    // update class based on model
    Backbone.Directives['data-class'] = function ($item, attributeValue, view, model) {
        var json = {};
        try {
            json = JSON.parse(attributeValue);
        } catch (exception) {
            if (console && console.warn) {
                console.warn("Backbone-simple-directive JSON parse error: " + exception.toString());
            }
            return false;
        }
        _.each(json, function (value, key) {
            $item.toggleClass(key, !!model.get(value));
            model.on('change:' + value.toString(), function (model, value) {
                $item.toggleClass(key, !!value);
            });
        });
    };

    // setup view.$ui.[attributeValue] as jQuery wrapper element
    Backbone.Directives['data-ui'] = function ($item, attributeValue, view, model) {
        view.$ui = view.$ui || {};
        view.$ui[attributeValue] = $item;
    };

    // set up view
    Backbone.View.prototype.setupDirective = function () {
        // model must have own name
        if (!_.isString(this.modelName)) {
            if (console && console.warn) {
                console.warn("Backbone-simple-directive error: modelName is required for directiveView");
            }
            return false;
        }

        // set up model if not exist
        this.$model = this.$model || (new Model());

        // search not bounded filters
        // checking for data('model-bound') allows multiple call with one binding
        var $elements = _.filter(this.$('[data-model]').toArray(), function (item) {
            return $(item).attr('data-model') === this.modelName && $(item).data('model-bound') !== true;
        }.bind(this));

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
                func($(item), $(item).attr(name), this, this.$model);
            }.bind(this));
        }.bind(this));

        return true;
    };

    // return directive object
    return Backbone.Directives;
}));