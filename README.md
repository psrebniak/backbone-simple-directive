
[![npm version](https://badge.fury.io/js/backbone-simple-directive.svg)](https://badge.fury.io/js/backbone-simple-directive)

# backbone-simple-directive
This project provide simple version of directives for Backbone. 

## Directives

* `data-visible` - on model change, set element visibility
* `data-content` - on model change, set element content
* `data-change` - two way binding - update view when model changed, update model when view changed
* `data-class` - toggle class when model change. Param should be valid JSON with flatten object, where key is class and value is model value to listen on. 


## Install

Just include `backbone-simple-directive.js` or `backbone-simple-directive.min.js` after Backbone and Underscore. 
It is recommended (not required) to use package `backbone-deep-model` for listening nested attributes with path syntax, e.g. `user.type`. 

### Required
* Underscore/Lodash
* Backbone
* jQuery

### Recommended package (should be loaded before)
* backbone-deep-model

## Usage

DOM: 
```
<span data-model="myScope" data-visible="numberOfFilters">
  Selected filters:
  <span data-model="myScope" data-content="numberOfFilters"></span>
</span>
<br/>
<label>
  <input type="checkbox" data-model="myScope" data-change="filters.S">
  S
</label>
<br/>
<label>
  <input type="checkbox" data-model="myScope" data-change="filters.M">
  M
</label>
<br/>
<label>
  <input type="checkbox" data-model="myScope" data-change="filters.L">
  L
</label>
```

Javascript: 
```
var myView = Backbone.View.extend({
	modelName: 'myScope',
	initialize: function() {
	  	// setup $model if not exist, bind directives
	  	// if Backbone.DeepModel is not found, use Backbone.Model
	  	this.setupDirective();

	    // update how many filters are checked
	    this.$model.on('change:filters', function(model, value) {
	    	model.set('numberOfFilters', _.filter(value, function(item) {
	      	return item;
	      }).length);
	    });
	}
});

new myView({
	el: 'body'
});

```
JsFiddle: http://jsfiddle.net/sn3n04qx/2/

## Demo

JsFiddle: http://jsfiddle.net/5f63xznx/10/

## Writing own directives: 

Just add new key into `Backbone.Directives` e.g.

```
/**
 * on model change, put model value into html
 *
 * @param $item - jQuery wrapped DOM element
 * @param attributeValue - attribute value
 * @param model - Backbone.DeepModel or Backbone.Model instance
 */
Backbone.Directives['data-my-content'] = function ($item, attributeValue, model) {
	// what to do
    var callback = function (model, value) {
        $item.html(value);
    };
    // call to set initial state
    callback(model, model.get(attributeValue));
    // and listen on model change
    model.on('change:' + attributeValue, callback);
};
```

Use new directive:
```
<div data-model="myModelName" data-my-content="myModelField"></div>

```