define([], function() {
    var t = {};

    t['initial'] = '<div id="content"></div>';
    t['data-ui'] = '<div data-model="m1" data-ui="$item">1st</div><div data-model="m2" data-ui="$item">2nd</div>';
    t['data-visible'] = '<div data-model="m1" data-visible="visible" data-ui="$item"></div>';
    t['data-content'] = '<div data-model="m1" data-content="content" data-ui="$item"></div>';

    return t;
});