/**
 * jQuery.imgLoadCatch.js v0.1.3
 * https://github.com/TevinLi/imgloadcatch
 *
 * Copyright 2015, Tevin Li
 * Released under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

;
(function ($, window, document) {

    'use strict';

    var Catch, init = false;

    Catch = (function () {
        return function (opt) {
            this.config = {
                total: 0,
                count: 0,
                countIMG: 0,
                queImg: [],
                queBg: [],
                state: [true, true],
                disTag: ['br', 'hr', 'script', 'code', 'del', 'embed', 'frame', 'frameset', 'iframe', 'link',
                    'style', 'object', 'pre', 'video', 'wbr', 'xmp']
            };
            this.options = $.extend({
                deep: 'img',
                export: true,
                start: function () {
                },
                step: function () {
                },
                imgTag: function () {
                },
                finish: function () {
                }
            }, opt || {});
            this.init();
        };
    })();

    Catch.prototype.init = function () {
        var that = this;
        this.options.start();
        var nodes = document.body.getElementsByTagName('*');
        if (this.options.deep == 'img') {
            for (var i = 0, len1 = nodes.length; i < len1; i++) {
                if (nodes[i].tagName.toLowerCase() == 'img') {
                    this.config.state[0] = false;
                    this.config.queImg.push(nodes[i]);
                    this.config.total++;
                }
            }
            this.listenIMG();
        } else if (this.options.deep == 'all') {
            for (var j = 0, len2 = nodes.length; j < len2; j++) {
                if (this.isDisTag(nodes[j].tagName)) {
                    continue;
                } else if (nodes[j].tagName.toLowerCase() == 'input' && (nodes[j].type == 'radio' || nodes[j].type == 'checkbox')) {
                    continue;
                }
                if (nodes[j].tagName.toLowerCase() == 'img') {
                    this.config.state[0] = false;
                    this.config.queImg.push(nodes[j]);
                    this.config.total++;
                } else {
                    var bgImg = this.getBackgroundImage(nodes[j]);
                    if (bgImg != 'none') {
                        this.config.state[1] = false;
                        var temp = new Image();
                        temp.src = bgImg.match(/\([^\)]+\)/g)[0].replace(/\(|\)/g, '');
                        this.config.queBg.push(temp);
                        this.config.total++;
                    }
                }
            }
            this.listenIMG();
            this.listenBg();
        }
    };

    Catch.prototype.listenIMG = function () {
        var that = this;
        for (var i = 0; i < this.config.queImg.length; i++) {
            this.imgLoad(this.config.queImg[i], function () {
                that.config.count++;
                that.config.countIMG++;
                var percent = parseInt(that.config.count / that.config.total * 100);
                that.options.step(percent, that.config.total, that.config.count);
                if (that.config.countIMG == that.config.queImg.length) {
                    that.options.imgTag();
                    that.config.state[0] = true;
                    that.end();
                }
            });
        }
    };

    Catch.prototype.listenBg = function () {
        var that = this;
        for (var i = 0; i < this.config.queBg.length; i++) {
            this.imgLoad(this.config.queBg[i], function () {
                that.config.count++;
                var percent = parseInt(that.config.count / that.config.total * 100);
                that.options.step(percent, that.config.total, that.config.count);
                if (that.config.count == that.config.total) {
                    that.config.state[1] = true;
                    that.end();
                }
            });
        }
    };

    Catch.prototype.end = function () {
        var that = this;
        if (this.options.deep == 'img') {
            if (this.config.state[0]) {
                setTimeout(function () {
                    that.options.finish();
                }, 100);
            }
        } else if (this.options.deep == 'all') {
            if (this.config.state[0] && this.config.state[1]) {
                this.config.queBg = [];
                setTimeout(function () {
                    that.options.finish();
                }, 100);
            }
        }
    };

    Catch.prototype.imgLoad = function (img, callback) {
        if (img.complete) {
            callback();
        } else {
            img.onload = function () {
                callback();
                img.onload = null;
            };
        }
    };

    Catch.prototype.isDisTag = function (tagName) {
        var tag = tagName.toLowerCase();
        var re = false;
        for (var i = 0; i < this.config.disTag.length; i++) {
            if (tag == this.config.disTag[i]) {
                re = true;
                break;
            }
        }
        return re;
    };

    Catch.prototype.getBackgroundImage = function (node) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(node, null).backgroundImage;
        } else {
            return node.currentStyle.backgroundImage;
        }
    };

    $.extend($, {
        imgLoadCatch: function (opt) {
            if (!init) {
                init = true;
                new Catch(opt);
            }
        }
    });

})($, window, document);