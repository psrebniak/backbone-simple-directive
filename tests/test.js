define(
    ['underscore', 'jquery', 'backbone', 'backbone-simple-directive', 'tests/templates'],
    function (_, $, Backbone, Directives, Templates) {

        var MyView = Backbone.View.extend({
            el: '#content',
            initialize: function (options) {
                if (options.modelName) {
                    this.modelName = options.modelName;
                }
                if (options.$model) {
                    this.$model = options.$model;
                }
                this.setupDirective();
            }
        });

        describe('AMD support', function () {
            it('return Directives object', function () {
                expect(typeof Directives).toEqual('object');
            });
            it('inject Directives object into Backbone', function () {
                expect(typeof Directives).toEqual('object');
            });
            it('Backbone.Directives is equal to returned object', function () {
                expect(Directives).toEqual(Backbone.Directives);
            });
            it('inject setupDirective function into Backbone.View', function () {
                expect(typeof Backbone.View.prototype.setupDirective).toEqual('function');
            });
        });

        describe('data-ui directive', function () {
            $('body').empty().append(Templates.initial);
            $html = $(Templates['data-ui']).appendTo('#content');

            var view1 = new MyView({modelName: 'm1'});
            var view2 = new MyView({modelName: 'm2'});

            it('views should have bound correct $ui elements', function () {
                expect(view1.$ui.$item.get(0).innerHTML).toEqual('1st');
                expect(view2.$ui.$item.get(0).innerHTML).toEqual('2nd');
            });
        });

        describe('data-visible directive', function () {
            it('should reflect initial model state when state is false', function () {
                $('body').empty().append(Templates.initial);
                $html = $(Templates['data-visible']).appendTo('#content');
                var view1 = new MyView({
                    modelName: 'm1',
                    $model: new Backbone.Model({visible: false})
                });
                expect(view1.$ui.$item.css('display')).toEqual('none');
            });
            it('should reflect initial model state when state is true', function () {
                $('body').empty().append(Templates.initial);
                $html = $(Templates['data-visible']).appendTo('#content');
                var view1 = new MyView({
                    modelName: 'm1',
                    $model: new Backbone.Model({visible: true})
                });
                expect(view1.$ui.$item.css('display')).toEqual('block');
            });
            it('should reflect initial model state when state is not set', function () {
                $('body').empty().append(Templates.initial);
                $html = $(Templates['data-visible']).appendTo('#content');
                var view1 = new MyView({
                    modelName: 'm1'
                });
                expect(view1.$ui.$item.css('display')).toEqual('none');
            });

            it('should adopt to model change', function () {
                $('body').empty().append(Templates.initial);
                $html = $(Templates['data-visible']).appendTo('#content');
                var view1 = new MyView({
                    modelName: 'm1'
                });
                expect(view1.$ui.$item.css('display')).toEqual('none');
                view1.$model.set('visible', true);
                expect(view1.$ui.$item.css('display')).toEqual('block');
                view1.$model.set('visible', false);
                expect(view1.$ui.$item.css('display')).toEqual('none');
            });
        });

        describe('data-content directive', function () {
            it('should have empty content is model is empty', function () {
                $('body').empty().append(Templates.initial);
                $html = $(Templates['data-content']).appendTo('#content');

                var view1 = new MyView({modelName: 'm1'});
                expect(view1.$ui.$item.get(0).innerHTML).toEqual('');
            });

            it('should have content is model is NOT empty', function () {
                $('body').empty().append(Templates.initial);
                $html = $(Templates['data-content']).appendTo('#content');

                var view1 = new MyView({
                    modelName: 'm1',
                    $model: new Backbone.Model({content: 'My Content'})
                });
                expect(view1.$ui.$item.get(0).innerHTML).toEqual('My Content');
            });

            it('view should adopt to model changes', function () {
                $('body').empty().append(Templates.initial);
                $html = $(Templates['data-content']).appendTo('#content');
                var view1 = new MyView({modelName: 'm1'});

                expect(view1.$ui.$item.get(0).innerHTML).toEqual('');
                view1.$model.set('content', 'My Great Content');
                expect(view1.$ui.$item.get(0).innerHTML).toEqual('My Great Content');
                view1.$model.set('content', false);
                expect(view1.$ui.$item.get(0).innerHTML).toEqual('');
            });
        });
    });