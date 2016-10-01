#!/bin/bash

npm install
mkdir build

# set defaults
cp node_modules/underscore/underscore.js build/_.js
cp node_modules/backbone/backbone.js build/backbone.js
cp node_modules/jquery/dist/jquery.js build/jquery.js

if [[ -n "$UNDERSCORE" ]]
then
	npm install underscore@"$UNDERSCORE"
	cp node_modules/underscore/underscore.js build/_.js
fi

if [[ -n "$BACKBONE" ]]
then
	npm install backbone@"$BACKBONE"
	cp node_modules/backbone/backbone.js build/backbone.js
fi

if [[ -n "$LODASH" ]]
then
	npm install lodash@"$LODASH"
	cp node_modules/lodash/lodash.js build/_.js
fi

if [[ -n "$JQUERY" ]]
then
	npm install jquery@"$JQUERY"
	cp node_modules/jquery/dist/jquery.js build/jquery.js
fi

if [[ -n "$ZEPTO" ]]
then
	npm install zepto@"$ZEPTO"
	cp node_modules/zepto/dist/zepto.js build/jquery.js
fi
