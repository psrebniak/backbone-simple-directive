#!/bin/bash

npm install
rm -rf build
mkdir build

# set defaults
cp node_modules/underscore/underscore.js build/_.js
cp node_modules/backbone/backbone.js build/backbone.js
cp node_modules/jquery/dist/jquery.js build/jquery.js

if [[ -n "$UNDERSCORE" ]]
then
	npm install underscore@"$UNDERSCORE"
	cp node_modules/underscore/underscore.js build/_.js
	echo "Use underscore@$UNDERSCORE"
fi

if [[ -n "$BACKBONE" ]]
then
	npm install backbone@"$BACKBONE"
	cp node_modules/backbone/backbone.js build/backbone.js
	echo "Use backbone@$BACKBONE"
fi

if [[ -n "$LODASH" ]]
then
	npm install lodash@"$LODASH"
	if [[ "$LODASH" < "3.0" ]]
	then
	    cp node_modules/lodash/index.js build/_.js
    else
        cp node_modules/lodash/lodash.js build/_.js
    fi
	echo "Use lodash@$LODASH"
fi

if [[ -n "$JQUERY" ]]
then
	npm install jquery@"$JQUERY"
	cp node_modules/jquery/dist/jquery.js build/jquery.js
	echo "Use jquery@$JQUERY"
fi
