[![npm version](https://badge.fury.io/js/backbone-simple-directive.svg)](https://badge.fury.io/js/backbone-simple-directive)
[![Build Status](https://travis-ci.org/psrebniak/backbone-simple-directive.svg?branch=master)](https://travis-ci.org/psrebniak/backbone-simple-directive)
[![Code Climate](https://codeclimate.com/github/psrebniak/backbone-simple-directive/badges/gpa.svg)](https://codeclimate.com/github/psrebniak/backbone-simple-directive)
[![Test Coverage](https://codeclimate.com/github/psrebniak/backbone-simple-directive/badges/coverage.svg)](https://codeclimate.com/github/psrebniak/backbone-simple-directive/coverage)

# backbone-simple-directive
This project provide simple version of directives for Backbone. 

## Directives

* `data-visible` - on model change, set element visibility
* `data-content` - on model change, set element content
* `data-change` - two way binding - update view when model changed, update model when view changed
* `data-class` - toggle class when model change. Param should be valid JSON with flatten object, where key is class and value is model value to listen on.
* `data-ui` - set element in view as `this.$ui[attributeValue]`. 


## Install

Use as AMD module or include `backbone-simple-directive.js` after Backbone and Underscore. 

For listening nested attributes with path syntax, e.g. `user.type` use package `backbone-deep-model`. 

### Required
* Underscore >= 1.7 / Lodash >= 3
* Backbone >= 1.2
* jQuery (support for 1.x, 2.x, 3.x)

### Recommended package (should be loaded before)
* backbone-deep-model

## Usage

DOM: 
```
<div data-model="myScope" data-ui="$example"></div>
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
	    
	    this.$ui.$example.append('example content');
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
Backbone.Directives['data-my-content'] = function ($item, attributeValue, view, model) {
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
