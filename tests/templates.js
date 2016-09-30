define([], function() {
    var t = {};

    t['initial'] = '<div id="content"></div>';
    t['data-ui'] = '<div data-model="m1" data-ui="$item">1st</div><div data-model="m2" data-ui="$item">2nd</div>';
    t['data-visible'] = '<div data-model="m1" data-visible="visible" data-ui="$item"></div>';
    t['data-content'] = '<div data-model="m1" data-content="content" data-ui="$item"></div>';
    t['data-change-checkbox'] = '<input checked="checked" type="checkbox" data-model="m1" data-change="F1" data-ui="$F1"><input type="checkbox" data-model="m1" data-change="F2" data-ui="$F2"><input type="checkbox" data-model="m1" data-change="F3" data-ui="$F3">';
    t['data-change-radio'] = '<input type="radio" name="m" data-model="m1" data-change="radio" value="first" data-ui="$R1"><input type="radio" name="m" data-model="m1" data-change="radio" value="second" checked="checked" data-ui="$R2">';
    t['data-change-text'] = '<input type="text" data-model="m1" data-change="text" data-ui="$text" value="example">';
    t['data-change-select'] = '<select data-model="m1" data-change="select" data-ui="$S"><option value="1" selected="selected"></option><option value="2"></option></select>';
    t['data-bad-class'] = '<div data-model="m1" data-class=\'qwertyuiop\'></div>';
    t['data-class'] = '<div class="c" data-model="m1" data-ui="$div" data-class=\'{"bg": "hasBg", "c": "hasColor"}\'></div>';

    return t;
});