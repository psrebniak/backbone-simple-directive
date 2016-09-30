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

        describe('Initialize', function () {
            it('it return true when modelName is set', function () {
                var Test = Backbone.View.extend({
                    modelName: 'someString',
                    initialize: function() {
                        var status = this.setupDirective();
                        expect(status).toEqual(true);
                    }
                });
                (new Test()).remove();
            });
            it('it return false when modelName is not a string', function () {
                var Test = Backbone.View.extend({
                    modelName: {},
                    initialize: function() {
                        var status = this.setupDirective();
                        expect(status).toEqual(false);
                    }
                });
                (new Test()).remove();
            });
            it('it setup model if not exist', function () {
                var Test = Backbone.View.extend({
                    modelName: "someString",
                    initialize: function() {
                        this.setupDirective();
                    }
                });
                var test = new Test();
                expect(test.$model instanceof Backbone.Model).toEqual(true);
                test.remove();
            });
            it('it preserves model if not exist', function () {
                var Test = Backbone.View.extend({
                    modelName: "someString",
                    $model: new Backbone.Model({
                        testCase: 'exist'
                    })
                });
                var test = new Test();
                expect(test.$model && test.$model.get('testCase')).toEqual('exist');
                test.remove();
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
            view1.stopListening();
            view2.stopListening();
            view1.remove();
            view2.remove();
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
                view1.remove();
            });
            it('should reflect initial model state when state is true', function () {
                $('body').empty().append(Templates.initial);
                $html = $(Templates['data-visible']).appendTo('#content');
                var view1 = new MyView({
                    modelName: 'm1',
                    $model: new Backbone.Model({visible: true})
                });
                expect(view1.$ui.$item.css('display')).toEqual('block');
                view1.remove();
            });
            it('should reflect initial model state when state is not set', function () {
                $('body').empty().append(Templates.initial);
                $html = $(Templates['data-visible']).appendTo('#content');
                var view1 = new MyView({
                    modelName: 'm1'
                });
                expect(view1.$ui.$item.css('display')).toEqual('none');
                view1.remove();
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

                view1.remove();
            });
        });

        describe('data-content directive', function () {
            it('should have empty content is model is empty', function () {
                $('body').empty().append(Templates.initial);
                $html = $(Templates['data-content']).appendTo('#content');

                var view1 = new MyView({modelName: 'm1'});
                expect(view1.$ui.$item.get(0).innerHTML).toEqual('');

                view1.remove();
            });

            it('should have content is model is NOT empty', function () {
                $('body').empty().append(Templates.initial);
                $html = $(Templates['data-content']).appendTo('#content');

                var view1 = new MyView({
                    modelName: 'm1',
                    $model: new Backbone.Model({content: 'My Content'})
                });
                expect(view1.$ui.$item.get(0).innerHTML).toEqual('My Content');

                view1.remove();
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

                view1.remove();
            });
        });

        describe('data-change directive on checkboxes', function () {
            $('body').empty().append(Templates.initial);
            $html = $(Templates['data-change-checkbox']).appendTo('#content');
            var view1 = new MyView({modelName: 'm1'});

            it('input should have correct initial value', function () {
                expect(view1.$model.get('F1')).toEqual(true);
                expect(view1.$model.get('F2')).toEqual(false);
                expect(view1.$model.get('F3')).toEqual(false);
            });

            it('view should update after model change', function () {
                view1.$model.set({
                    F1: false,
                    F2: true,
                    F3: false
                });
                expect(view1.$ui.$F1.prop('checked')).toEqual(false);
                expect(view1.$ui.$F2.prop('checked')).toEqual(true);
                expect(view1.$ui.$F3.prop('checked')).toEqual(false);
            });
            view1.remove();
        });

        describe('data-change directive on radio', function () {
            $('body').empty().append(Templates.initial);
            $html = $(Templates['data-change-radio']).appendTo('#content');
            var view1 = new MyView({modelName: 'm1'});

            it('input should have correct initial value', function () {
                expect(view1.$model.get('radio')).toEqual("second");
                expect(view1.$ui.$R1.prop('checked')).toEqual(false);
                expect(view1.$ui.$R2.prop('checked')).toEqual(true);
            });

            it('view should update after model change', function () {
                view1.$model.set('radio', 'first');
                expect(view1.$ui.$R1.prop('checked')).toEqual(true);
            });

            view1.remove();
        });

        describe('data-change directive on select', function () {
            $('body').empty().append(Templates.initial);
            $html = $(Templates['data-change-select']).appendTo('#content');
            var view1 = new MyView({modelName: 'm1'});

            it('select should have correct initial value', function () {
                expect(view1.$model.get('select')).toEqual("1");
            });

            it('view should update after model change', function () {
                view1.$model.set('select', '2');
                expect(view1.$ui.$S.val()).toEqual('2');
            });

            view1.remove();
        });


        describe('data-change directive on text input', function () {
            $('body').empty().append(Templates.initial);
            $html = $(Templates['data-change-text']).appendTo('#content');
            var view1 = new MyView({modelName: 'm1'});

            it('input should have correct initial value', function () {
                expect(view1.$model.get('text')).toEqual("example");
            });

            it('view should update after model change', function () {
                view1.$model.set('text', 'It works!');
                expect(view1.$ui.$text.val()).toEqual("It works!");
            });
            view1.remove();
        });

        describe('data-class directive', function () {
            $('body').empty().append(Templates.initial);
            $html = $(Templates['data-class']).appendTo('#content');
            var view1 = new MyView({
                modelName: 'm1',
                $model: new Backbone.Model({
                    hasBg: true,
                    hasColor: null
                })
            });

            it('element should have correct initial value', function () {
                expect(view1.$ui.$div.hasClass('bg')).toEqual(true);
                expect(view1.$ui.$div.hasClass('c')).toEqual(false);
            });

            it('view should update after model change', function () {
                view1.$model.set({
                    hasBg: false,
                    hasColor: true
                });
                expect(view1.$ui.$div.hasClass('bg')).toEqual(false);
                expect(view1.$ui.$div.hasClass('c')).toEqual(true);
            });
            view1.remove();
        });
    });