/*!
 * oCanvas v2.4.0
 * http://ocanvas.org/
 *
 * Copyright 2011-2013, Johannes Koggdal
 * Licensed under the MIT license
 * http://ocanvas.org/license
 *
 * Including Xccessors by Eli Grey
 * Including easing equations by Robert Penner
 */
(function (a, b, c) {
    var d = {
        canvasList: [],
        modules: {},
        inits: {},
        plugins: {},
        core: function (a) {
            this.isCore = !0, this.id = d.canvasList.push(this) - 1, this.lastObjectID = 0, this.children = [], this.domEventHandlers = [];
            for (var c in d.modules) typeof d.modules[c] == "function" ? this[c] = d.modules[c]() : this[c] = Object.create(d.modules[c]);
            this.settings = {
                fps: 30,
                background: "transparent",
                clearEachFrame: !0,
                drawEachFrame: !0,
                disableScrolling: !1,
                plugins: []
            }, d.extend(this.settings, a), this.originalSettings = d.extend({}, this.settings);
            if (this.settings.canvas.nodeName && this.settings.canvas.nodeName.toLowerCase() === "canvas") this.canvasElement = this.settings.canvas;
            else if (typeof this.settings.canvas == "string") this.canvasElement = b.querySelector(this.settings.canvas);
            else return !1;
            this.canvas = this.canvasElement.getContext("2d");
            var e = this.canvasElement.width,
                f = this.canvasElement.height;
            Object.defineProperty(this, "width", {
                enumerable: !0,
                configurable: !0,
                set: function (a) {
                    e = isNaN(parseFloat(a)) ? e : parseFloat(a), this.canvasElement.width = e, this.background.set(this.settings.background), this.redraw()
                },
                get: function () {
                    return e
                }
            }), Object.defineProperty(this, "height", {
                enumerable: !0,
                configurable: !0,
                set: function (a) {
                    f = isNaN(parseFloat(a)) ? f : parseFloat(a), this.canvasElement.height = f, this.background.set(this.settings.background), this.redraw()
                },
                get: function () {
                    return f
                }
            });
            for (var c in d.modules) {
                if (this[c].wrapper === !0)
                    for (var g in this[c]) typeof this[c][g] == "object" && typeof this[c][g].setCore == "function" ? this[c][g] = this[c][g].setCore(this) : typeof this[c][g].setCore == "function" && this[c][g].setCore(this), this[c].core = this;
                this[c].core = this
            }
            for (var h in d.inits)
                if (typeof d.inits[h] == "string" && typeof this[h][d.inits[h]] == "function") this[h][d.inits[h]]();
                else if (d.inits[h] === "object")
                for (var i in d.inits[h]) typeof this[h][d.inits[h][i]] == "function" && this[h][d.inits[h][i]]();
            var j = this.settings.plugins;
            if (j.length > 0)
                for (var k = 0, l = j.length; k < l; k++) typeof d.plugins[j[k]] == "function" && d.plugins[j[k]].call(this)
        },
        registerModule: function (a, b, e) {
            if (~a.indexOf(".")) {
                var f = a.split(".");
                d.modules[f[0]][f[1]] = b, e !== c && (d.inits[f[0]] || (d.inits[f[0]] = {}), d.inits[f[0]][f[1]] = e)
            } else d.modules[a] = b, e !== c && (d.inits[a] = e)
        },
        registerPlugin: function (a, b) {
            d.plugins[a] = b
        },
        create: function (a) {
            return new d.core(a)
        },
        domReady: function (a) {
            a = a || function () {}, this.domReadyHandlers.push(a);
            if (this.isDomReadyListening) return !1;
            if (this.isDomReady) {
                d.triggerDomReadyHandlers();
                return !0
            }
            var c = function (a) {
                if (b.readyState === "complete" || a && a.type === "DOMContentLoaded") d.isDomReadyListening = !1, d.isDomReady = !0, d.triggerDomReadyHandlers(), b.removeEventListener("readystatechange", c, !1), b.removeEventListener("DOMContentLoaded", c, !1)
            };
            if (c()) return !0;
            if (!this.isDomReadyListening) {
                d.isDomReadyListening = !0, b.addEventListener("readystatechange", c, !1), b.addEventListener("DOMContentLoaded", c, !1);
                return !1
            }
        },
        isDomReady: !1,
        isDomReadyListening: !1,
        domReadyHandlers: [],
        triggerDomReadyHandlers: function () {
            var a, b, c, d;
            a = this.domReadyHandlers;
            for (b = 0, c = a.length; b < c; b++) d = a[b], d && (delete a[b], d())
        }
    };
    d.core.prototype = {
        addChild: function (a, b) {
            a.add(b);
            return this
        },
        removeChild: function (a) {
            a.remove();
            return this
        },
        clear: function (a) {
            this.draw.clear(a);
            return this
        },
        redraw: function () {
            this.draw.redraw();
            return this
        },
        bind: function (a, b) {
            this.events.bind(this.canvasElement, a.split(" "), b);
            return this
        },
        unbind: function (a, b) {
            this.events.unbind(this.canvasElement, a.split(" "), b);
            return this
        },
        trigger: function (a) {
            this.events.triggerHandlers(this.canvasElement, a.split(" "));
            return this
        },
        reset: function () {
            var a = this.children;
            for (var b = 0, c = a.length; b < c; b++) a[b].remove(), b--, c--;
            a.length = 0, this.lastObjectID = 0;
            var e = this.canvasElement.events;
            for (var f in e) e[f] instanceof Array && this.unbind(f, e[f]);
            this.settings = d.extend({}, this.originalSettings)
        },
        destroy: function () {
            this.reset();
            for (var a = 0, b = this.domEventHandlers.length; a < b; a++) d.removeDOMEventHandler(this, a);
            this.domEventHandlers.length = 0, d.canvasList[this.id] = null
        }
    }, a.oCanvas = d, d.domReady(), d.extend = function () {
        var a = Array.prototype.slice.call(arguments),
            b = a[a.length - 1],
            c = a.splice(0, 1)[0],
            e = a.splice(0, 1)[0],
            f, g = [],
            h;
        b.exclude && JSON.stringify(b) === JSON.stringify({
            exclude: b.exclude
        }) && (g = b.exclude);
        if (e !== b || g.length === 0)
            for (f in e) {
                if (~g.indexOf(f)) continue;
                h = Object.getOwnPropertyDescriptor(e, f), h.get || h.set ? Object.defineProperty(c, f, h) : c[f] = e[f]
            }
        return a.length > 0 ? d.extend.apply(this, [c].concat(a)) : c
    }, d.addDOMEventHandler = function (a, b, c, d, e) {
        a.domEventHandlers.push({
            obj: b,
            event: c,
            handler: d,
            useCapture: !!e
        }), b.addEventListener(c, d, e)
    }, d.removeDOMEventHandler = function (a, b) {
        var c = a.domEventHandlers[b];
        c.obj.removeEventListener(c.event, c.handler, c.useCapture)
    }, d.isNumber = function (a) {
        return !isNaN(parseFloat(a)) && isFinite(a)
    }, typeof Object.create != "function" && (Object.create = function (a) {
        function b() {}
        b.prototype = a;
        return new b
    }),
    function () {
        var b = 0,
            c = ["ms", "moz", "webkit", "o"];
        for (var d = 0; d < c.length && !a.requestAnimationFrame; ++d) a.requestAnimationFrame = a[c[d] + "RequestAnimationFrame"], a.cancelAnimationFrame = a[c[d] + "CancelAnimationFrame"] || a[c[d] + "CancelRequestAnimationFrame"];
        a.requestAnimationFrame || (a.requestAnimationFrame = function (c, d) {
            var e = (new Date).getTime(),
                f = Math.max(0, 16 - (e - b)),
                g = a.setTimeout(function () {
                    c(e + f)
                }, f);
            b = e + f;
            return g
        }), a.cancelAnimationFrame || (a.cancelAnimationFrame = function (a) {
            clearTimeout(a)
        })
    }(), a.log = function () {
        log.history = log.history || [], log.history.push(arguments);
        if (this.console) {
            var a, b = Array.prototype.slice.call(arguments),
                c = b.length;
            for (a = 0; a < c; a++) console.log(b[a])
        }
    };
    var e = function () {
        var a = {
            init: function () {
                var a = this;
                this.core.setLoop = function (b) {
                    a.userLoop = b;
                    return a
                }
            },
            currentFrame: 1,
            timeline: 0,
            running: !1,
            set fps(a) {
                this.core.settings.fps = a, this.running && this.start()
            },
            get fps() {
                return this.core.settings.fps
            },
            loop: function () {
                !this.running || setTimeout(function () {
                    a.timeline = requestAnimationFrame(a.loopBound);
                    var b = a.core;
                    typeof a.userLoop == "function" && (b.settings.clearEachFrame === !0 && b.draw.clear(), a.userLoop.call(b, b.canvas), b.settings.drawEachFrame === !0 && b.draw.redraw(), a.currentFrame++)
                }, 1e3 / a.fps)
            },
            loopBound: function () {
                a.loop()
            },
            start: function () {
                cancelAnimationFrame(a.timeline), a.running = !0, a.loop();
                return this
            },
            stop: function () {
                this.running = !1, cancelAnimationFrame(a.timeline);
                return this
            }
        };
        return a
    };
    d.registerModule("timeline", e, "init");
    var f = function () {
        return {
            keysDown: {},
            keyPressTimers: {},
            modifiedKeys: [],
            init: function () {
                var a = this;
                d.addDOMEventHandler(this.core, b, "keydown", function (b) {
                    a.docHandler(b)
                }, !1), d.addDOMEventHandler(this.core, b, "keyup", function (b) {
                    a.docHandler(b)
                }, !1), d.addDOMEventHandler(this.core, b, "keypress", function (b) {
                    a.preventDefault(b)
                }, !1)
            },
            docHandler: function (a) {
                var b, c, d, e;
                c = this.core.events, d = this.core.canvasElement;
                if (!!c.enabled) {
                    if (this.core.pointer && this.core.pointer.canvasFocused !== !0) return;
                    b = this.getKeyCode(a), this.preventDefault(a);
                    if (a.type === "keydown" && this.keysDown[b] === !0) return;
                    a.type === "keydown" ? this.keysDown[b] = !0 : a.type === "keyup" && delete this.keysDown[b], e = c.fixEventObject(a, "keyboard"), c.lastKeyboardEventObject = e, c.triggerHandlers(d, [a.type]), a.type === "keydown" && (this.keyPressTimers[b] = setInterval(function () {
                        c.triggerHandlers(d, ["keypress"], e)
                    }, 1e3 / this.core.settings.fps));
                    if (a.type === "keyup")
                        if (!this.anyKeysDown())
                            for (b in this.keyPressTimers) clearInterval(this.keyPressTimers[b]);
                        else clearInterval(this.keyPressTimers[b])
                }
            },
            preventDefault: function (a) {
                if (this.core.mouse && this.core.mouse.canvasFocused === !0 || !this.core.mouse) {
                    var b = this.getKeyCode(a);~
                    this.modifiedKeys.indexOf(b) && a.preventDefault()
                }
            },
            addPreventDefaultFor: function (a) {
                a = typeof a == "number" ? [a] : a instanceof Array ? a : [];
                for (var b = 0; b < a.length; b++) this.modifiedKeys.push(a[b])
            },
            removePreventDefaultFor: function (a) {
                a = typeof a == "number" ? [a] : a instanceof Array ? a : [];
                var b, c;
                for (b = 0; b < a.length; b++) c = this.modifiedKeys.indexOf(a[b]), ~c && this.modifiedKeys.splice(c, 1)
            },
            getKeyCode: function (a) {
                return a.keyCode === 0 ? a.which : a.keyCode
            },
            numKeysDown: function () {
                var a, b, c;
                a = 0, b = this.keysDown;
                for (c in b) b[c] === !0 && a++;
                return a
            },
            anyKeysDown: function () {
                return this.numKeysDown() > 0
            },
            getKeysDown: function () {
                var a, b, c;
                a = this.keysDown, b = [];
                for (c in a) a[c] === !0 && b.push(parseInt(c, 10));
                return b
            },
            ARROW_UP: 38,
            ARROW_DOWN: 40,
            ARROW_LEFT: 37,
            ARROW_RIGHT: 39,
            SPACE: 32,
            ENTER: 13,
            ESC: 27
        }
    };
    d.registerModule("keyboard", f, "init");
    var g = function () {
        return {
            x: 0,
            y: 0,
            buttonState: "up",
            canvasFocused: !1,
            canvasHovered: !1,
            cursorValue: "default",
            init: function () {
                this.core.events.addEventTypes("mouse", {
                    move: "mousemove",
                    enter: "mouseenter",
                    leave: "mouseleave",
                    down: "mousedown",
                    up: "mouseup",
                    singleClick: "click",
                    doubleClick: "dblclick"
                }), this.types = {
                    mousemove: "move",
                    mousedown: "down",
                    mouseup: "up",
                    dblclick: "doubleClick"
                }, this.core.pointer = this, (!this.core.touch || !this.core.touch.isTouch) && this.bindHandlers()
            },
            bindHandlers: function () {
                var c, e, f, g;
                c = this, e = this.core, f = e.canvasElement;
                for (g in this.types) d.addDOMEventHandler(e, f, g, function (a) {
                    c.canvasHandler(a)
                }, !1), g === "mousemove" && (g = "mouseover"), d.addDOMEventHandler(e, b, g, function (a) {
                    c.docHandler(a)
                // }, !1), a.parent !== a && d.addDOMEventHandler(e, a.parent.document, g, function (a) {
                    // c.docHandler(a)
                }, !1)
            },
            canvasHandler: function (a, b) {
                var d, e, f, g;
                d = this.core.events, e = this.onCanvas(a);
                if (a.type === "mouseup" && !e && !this.canvasUpEventTriggered) d.triggerPointerEvent(this.types.mouseup, d.frontObject, "mouse", a), d.triggerPointerEvent(this.types.mouseup, this.core.canvasElement, "mouse", a), this.canvasUpEventTriggered = !0;
                else {
                    if (!b && !e) return;
                    f = b && a.type === "mouseover" ? "mousemove" : a.type, b || (this.canvasHovered = !0), f === "mousedown" && (this.canvasUpEventTriggered = !1, this.canvasFocused = !0, this.buttonState = "down"), f === "mouseup" && (this.buttonState = "up"), g = b || !e ? c : d.getFrontObject("mouse"), b && d.frontObject ? (d.triggerChain(d.getParentChain(d.frontObject, !0, !0), ["mouseleave"]), d.frontObject = null) : b ? d.triggerHandlers(this.core.canvasElement, ["mouseleave"]) : d.triggerPointerEvent(this.types[f], g, "mouse", a)
                }
            },
            docHandler: function (a) {
                var b = this.onCanvas(a);
                b || (this.core.canvasElement.events.hasEntered ? a.type === "mouseover" && this.canvasHandler(a, !0) : (a.type === "mouseup" && this.buttonState === "down" && this.canvasHandler(a, !0), a.type === "mousedown" && (this.canvasFocused = !1)))
            },
            getPos: function (b) {
                var c = this.core.canvasElement,
                    d = c.getBoundingClientRect(),
                    e = c.width / c.clientWidth,
                    f = c.height / c.clientHeight,
                    g = b.pageX - a.pageXOffset,
                    h = b.pageY - a.pageYOffset,
                    i = e * (g - Math.round(d.left)),
                    j = f * (h - Math.round(d.top));
                return {
                    x: i,
                    y: j
                }
            },
            updatePos: function (a) {
                var b = this.getPos(a);
                this.x = b.x, this.y = b.y
            },
            onCanvas: function (a) {
                a = a || this.core.events.lastPointerEventObject && this.core.events.lastPointerEventObject.originalEvent;
                var b = a ? this.getPos(a) : {
                    x: this.x,
                    y: this.y
                };
                if (b.x >= 0 && b.x <= this.core.width && b.y >= 0 && b.y <= this.core.height) {
                    this.canvasHovered = !0, this.updatePos(a);
                    return !0
                }
                this.canvasHovered = !1;
                return !1
            },
            cancel: function () {
                this.core.events.lastDownObject = null
            },
            hide: function () {
                this.core.canvasElement.style.cursor = "none"
            },
            show: function () {
                this.core.canvasElement.style.cursor = this.cursorValue
            },
            cursor: function (a) {
                if (~a.indexOf("url(")) {
                    var b = /url\((.*?)\)(\s(.*?)\s(.*?)|)($|,.*?$)/.exec(a),
                        c = b[5] ? b[5] : "";
                    a = "url(" + b[1] + ") " + (b[3] ? b[3] : 0) + " " + (b[4] ? b[4] : 0) + (c !== "" ? c : ", default")
                }
                this.core.canvasElement.style.cursor = a, this.cursorValue = a
            }
        }
    };
    d.registerModule("mouse", g, "init");
    var h = function () {
        return {
            x: 0,
            y: 0,
            touchState: "up",
            canvasFocused: !1,
            canvasHovered: !1,
            isTouch: "ontouchstart" in a || "createTouch" in b,
            dblTapInterval: 500,
            init: function () {
                var a, b;
                a = this.core, b = a.canvasElement, a.events.addEventTypes("touch", {
                    move: "touchmove",
                    enter: "touchenter",
                    leave: "touchleave",
                    down: "touchstart",
                    up: "touchend",
                    singleClick: "tap",
                    doubleClick: "dbltap"
                }), this.types = {
                    touchmove: "move",
                    touchstart: "down",
                    touchend: "up"
                }, this.isTouch && (a.pointer = this, b.style.WebkitUserSelect = "none", b.style.WebkitTouchCallout = "none", b.style.WebkitTapHighlightColor = "rgba(0,0,0,0)"), this.bindHandlers()
            },
            bindHandlers: function () {
                var c, e, f, g;
                c = this, e = this.core, f = e.canvasElement;
                for (g in this.types) d.addDOMEventHandler(e, f, g, function (a) {
                    c.canvasHandler(a)
                }, !1), d.addDOMEventHandler(e, b, g, function (a) {
                    c.docHandler(a)
                // }, !1), a.parent !== a && d.addDOMEventHandler(e, a.parent.document, g, function (a) {
                    // c.docHandler(a)
                }, !1);
                this.core.settings.disableScrolling && d.addDOMEventHandler(e, f, "touchmove", function (a) {
                    a.preventDefault()
                }, !1)
            },
            canvasHandler: function (a, b) {
                var d, e, f, g, h, i;
                d = this.core.events, e = this.onCanvas(a);
                if (a.type === "touchend" && !e && !this.canvasUpEventTriggered) d.triggerPointerEvent(this.types.touchend, d.frontObject, "touch", a), d.triggerPointerEvent(this.types.touchend, this.core.canvasElement, "touch", a), this.canvasUpEventTriggered = !0;
                else {
                    if (!b && !e) return;
                    b || (this.canvasHovered = !0), a.type === "touchstart" && (this.canvasUpEventTriggered = !1, this.canvasFocused = !0, this.touchState = "down"), a.type === "touchend" && (this.touchState = "up"), f = b || !e ? c : d.getFrontObject("touch"), b && d.frontObject ? (d.triggerChain(d.getParentChain(d.frontObject, !0, !0), ["touchleave"]), d.frontObject = null) : b ? d.triggerHandlers(this.core.canvasElement, ["touchleave"]) : d.triggerPointerEvent(this.types[a.type], f, "touch", a), a.type === "touchstart" && (g = (new Date).getTime(), !this.dblTapStart || g - this.dblTapStart.timestamp > this.dblTapInterval ? this.dblTapStart = {
                        timestamp: g,
                        obj: f,
                        count: 1
                    } : this.dblTapStart.count++), a.type === "touchend" && this.dblTapStart.count === 2 && (g = (new Date).getTime(), h = f === this.dblTapStart.obj, i = g - this.dblTapStart.timestamp, h && i < this.dblTapInterval && d.triggerPointerEvent("doubleClick", f, "touch", a), delete this.dblTapStart)
                }
            },
            docHandler: function (a) {
                var b = this.onCanvas(a);
                b || (this.core.canvasElement.events.hasEntered ? a.type === "touchmove" && this.canvasHandler(a, !0) : (a.type === "touchend" && this.touchState === "down" && this.canvasHandler(a, !0), a.type === "touchstart" && (this.canvasFocused = !1)))
            },
            getPos: function (b) {
                var d, e, f = b.changedTouches;
                if (f !== c && f.length > 0) {
                    b = f[0];
                    var g = this.core.canvasElement,
                        h = g.getBoundingClientRect(),
                        i = g.width / g.clientWidth,
                        j = g.height / g.clientHeight,
                        k = b.pageX - a.pageXOffset,
                        l = b.pageY - a.pageYOffset;
                    d = i * (k - Math.round(h.left)), e = j * (l - Math.round(h.top))
                } else d = this.x, e = this.y;
                return {
                    x: d,
                    y: e
                }
            },
            updatePos: function (a) {
                var b = this.getPos(a);
                this.x = b.x, this.y = b.y
            },
            onCanvas: function (a) {
                a = a || this.core.events.lastPointerEventObject && this.core.events.lastPointerEventObject.originalEvent;
                var b = a ? this.getPos(a) : {
                    x: this.x,
                    y: this.y
                };
                if (b.x >= 0 && b.x <= this.core.width && b.y >= 0 && b.y <= this.core.height) {
                    this.canvasHovered = !0, this.updatePos(a);
                    return !0
                }
                this.canvasHovered = !1;
                return !1
            },
            cancel: function () {
                this.core.events.lastDownObject = null
            }
        }
    };
    d.registerModule("touch", h, "init");
    var i = function () {
        return {
            transformPointerPosition: function (a, b, c, d, e) {
                d = d || 0, e = e || this.core.pointer;
                if (typeof a == "object") {
                    var f = a.parent,
                        g = [],
                        h = {
                            x: 0,
                            y: 0
                        },
                        i, j, k, l, m;
                    g.push(a);
                    while (f && f !== this.core) g.push(f), f = f.parent;
                    g.reverse(), i = e;
                    for (k = 0, l = g.length; k < l; k++) j = g[k], h = this.transformPointerPosition(j.rotation, j.abs_x, j.abs_y, 0, i), i = h;
                    d !== 0 && (m = a.getOrigin(), h = this.transformPointerPosition(d * -1, b - m.x, c - m.y, 0, i));
                    return {
                        x: h.x,
                        y: h.y
                    }
                }
                var n = a,
                    o = e.x >= b && e.y <= c,
                    p = e.x >= b && e.y >= c,
                    q = e.x <= b && e.y >= c,
                    r = e.x <= b && e.y <= c,
                    s = Math.sqrt(Math.pow(e.x - b, 2) + Math.pow(e.y - c, 2)),
                    n = (n / 360 - Math.floor(n / 360)) * 360 - d,
                    t, u, v, w = s === 0 ? 0 : Math.abs(e.y - c) / s;
                if (o || q) t = (180 - n - Math.asin(w) * 180 / Math.PI) * Math.PI / 180, u = b + Math.cos(t) * s * (o ? -1 : 1), v = c + Math.sin(t) * s * (o ? -1 : 1);
                else if (r || p) t = (Math.asin(w) * 180 / Math.PI - n) * Math.PI / 180, u = b + Math.cos(t) * s * (r ? -1 : 1), v = c + Math.sin(t) * s * (r ? -1 : 1);
                return {
                    x: u,
                    y: v
                }
            },
            isPointerInside: function (a, b) {
                var c = a.getOrigin();
                if (a.type === "line") {
                    var d = Math.abs(a._.end_x - a.abs_x),
                        e = Math.abs(a._.end_y - a.abs_y),
                        f = Math.sqrt(d * d + e * e),
                        g = a.start,
                        h = a.end,
                        i = g.x < h.x && g.y < h.y || g.x > h.x && g.y > h.y ? -1 : 1,
                        j = Math.asin(e / f) * (180 / Math.PI) * i,
                        k = this.transformPointerPosition(a, a.abs_x, a.abs_y, j, b);
                    return k.x > a.abs_x - f - c.x && k.x < a.abs_x + f - c.x && k.y > a.abs_y - a.strokeWidth / 2 - c.y && k.y < a.abs_y + a.strokeWidth / 2 - c.y
                }
                if (a.type === "text") {
                    var k = this.transformPointerPosition(a, a.abs_x, a.abs_y, 0, b),
                        l = a.strokeWidth / 2,
                        m = a._.lines,
                        n = m.length,
                        o = a.size * a.lineHeight,
                        p = a.align,
                        q = this.core.canvasElement.dir === "rtl",
                        r, s, t, u, v, w, x, y;
                    r = {
                        top: a.size * .05,
                        hanging: a.size * -0.12,
                        middle: a.size * -0.47,
                        alphabetic: a.size * -0.78,
                        ideographic: a.size * -0.83,
                        bottom: a.size * -1
                    };
                    for (s = 0; s < n; s++) {
                        t = {
                            start: q ? a.width - m[s].width : 0,
                            left: 0,
                            center: (a.width - m[s].width) / 2,
                            end: q ? 0 : a.width - m[s].width,
                            right: a.width - m[s].width
                        }, u = a.abs_x + t[p], v = u + m[s].width, w = a.abs_y + o * s + r[a.baseline], x = w + o + (n > 0 && s < n - 1 ? 1 : 0), y = k.x > u - c.x - l && k.x < v - c.x + l && k.y > w - c.y - l && k.y < x - c.y + l;
                        if (y) return !0
                    }
                    return !1
                }
                if (a.shapeType === "rectangular") {
                    var k = this.transformPointerPosition(a, a.abs_x, a.abs_y, 0, b),
                        l = a.strokePosition === "outside" ? a.strokeWidth : a.strokePosition === "center" ? a.strokeWidth / 2 : 0;
                    return k.x > a.abs_x - c.x - l && k.x < a.abs_x + a.width - c.x + l && k.y > a.abs_y - c.y - l && k.y < a.abs_y + a.height - c.y + l
                }
                if (a.type === "ellipse" && a.radius_x === a.radius_y) {
                    var k = this.transformPointerPosition(a, a.abs_x, a.abs_y, 0, b),
                        f = Math.sqrt(Math.pow(k.x - a.abs_x + c.x, 2) + Math.pow(k.y - a.abs_y + c.y, 2));
                    return f < a.radius_x + a.strokeWidth / 2
                }
                if (a.type === "ellipse") {
                    var k = this.transformPointerPosition(a, a.abs_x, a.abs_y, 0, b),
                        z = a.radius_x + a.strokeWidth / 2,
                        A = a.radius_y + a.strokeWidth / 2;
                    k.x -= a.abs_x + c.x, k.y -= a.abs_y + c.y;
                    return k.x * k.x / (z * z) + k.y * k.y / (A * A) < 1
                }
                if (a.type === "polygon") {
                    var k = this.transformPointerPosition(a, a.abs_x, a.abs_y, 0, b),
                        B = a.radius + a.strokeWidth / 2,
                        C = a.sides,
                        D = C - 1,
                        E = !1,
                        s, F, G;
                    for (s = 0; s < C; s++) F = {
                        x: a.abs_x - c.x + B * Math.cos(s * 2 * Math.PI / C),
                        y: a.abs_y - c.y + B * Math.sin(s * 2 * Math.PI / C)
                    }, G = {
                        x: a.abs_x - c.x + B * Math.cos(D * 2 * Math.PI / C),
                        y: a.abs_y - c.y + B * Math.sin(D * 2 * Math.PI / C)
                    }, (F.y < k.y && G.y >= k.y || G.y < k.y && F.y >= k.y) && F.x + (k.y - F.y) / (G.y - F.y) * (G.x - F.x) < k.x && (E = !E), D = s;
                    return E
                }
                if (a.type === "arc") {
                    var H = a.end - a.start,
                        I = a.direction === "clockwise" ? (H < 0 ? 360 : 0) + (H % 360 ? H % 360 : H > 0 ? 360 : 0) : Math.abs(H),
                        J = a.direction === "clockwise" ? a.start * -1 : a.end * -1,
                        k = this.transformPointerPosition(a, a.abs_x, a.abs_y, J, b),
                        f = Math.sqrt(Math.pow(k.x - a.abs_x + c.x, 2) + Math.pow(k.y - a.abs_y + c.y, 2)),
                        B = a.radius,
                        K = {},
                        L = {},
                        z, M, N, j;
                    if (a.strokeWidth === 0 && f > B || a.strokeWidth > 0 && f > B + a.strokeWidth / 2) return !1;
                    if (B === a.strokeWidth / 2 || a.pieSection) {
                        var O = a.pieSection ? a.radius : O;
                        if (I > 180) {
                            var P, Q, R, S;
                            P = Math.abs(a.abs_x - c.x - k.x), Q = Math.abs(a.abs_y - c.y - k.y), R = Math.sqrt(P * P + Q * Q), S = Math.acos(P / R) * 180 / Math.PI;
                            return k.y >= a.abs_y - c.y && f <= O ? !0 : k.y < a.abs_y - c.y && k.x < a.abs_x - c.x && S <= I - 180 ? !0 : !1
                        }
                        if (I === 180) return k.y >= a.abs_y - c.y && f <= O ? !0 : !1;
                        if (I < 180) {
                            J = 90 - I / 2 - (a.direction === "clockwise" ? a.start : a.end), k = this.transformPointerPosition(a, a.abs_x, a.abs_y, J, b);
                            var T, P, Q, R, S;
                            B *= 2, T = Math.cos(I / 2 * Math.PI / 180) * B, P = Math.abs(a.abs_x - c.x - k.x), Q = Math.abs(a.abs_y - c.y - k.y), R = Math.sqrt(P * P + Q * Q), S = Math.asin(P / R) * 180 / Math.PI;
                            return k.y >= a.abs_y - c.y + T ? !0 : k.y >= a.abs_y - c.y && S <= I / 2 ? !0 : !1
                        }
                    } else {
                        if (I > 180) {
                            z = (360 - I) / 2, M = Math.cos(z * Math.PI / 180) * B, K.x = a.abs_x - c.x + Math.cos(z * Math.PI / 180) * M, K.y = a.abs_y - c.y - Math.sin(z * Math.PI / 180) * M, N = 180 - 2 * z, L.x = a.abs_x - c.x - Math.cos(N * Math.PI / 180) * B, L.y = a.abs_y - c.y - Math.sin(N * Math.PI / 180) * B;
                            var U = 90 - (90 - N) - (90 - z);
                            if (k.y < K.y && k.x < K.x) j = z - Math.acos(Math.abs(k.y - K.y) / Math.sqrt(Math.pow(k.x - K.x, 2) + Math.pow(k.y - K.y, 2))) * 180 / Math.PI;
                            else if (k.y > K.y && k.x >= K.x) j = U - Math.acos(Math.abs(k.x - K.x) / Math.sqrt(Math.pow(k.x - K.x, 2) + Math.pow(k.y - K.y, 2))) * 180 / Math.PI;
                            else {
                                if (k.y < a.abs_y - c.y && k.x >= K.x) return !1;
                                j = -1e6
                            } if ((a.fill === "" || a.fill === "transparent") && a.strokeWidth > 0 && f < B - a.strokeWidth / 2) return !1;
                            return j <= 0 && k.x >= L.x && k.y > K.y && k.y < a.abs_y - c.y ? !0 : j <= 0 && k.y <= a.abs_y - c.y && f <= B ? !0 : (a.strokeWidth === 0 && f <= B || a.strokeWidth > 0 && f <= B + a.strokeWidth / 2) && (k.x <= L.x && k.y <= a.abs_y - c.y || k.y >= a.abs_y - c.y) ? !0 : !1
                        }
                        if (I === 180) return k.y >= a.abs_y - c.y && (a.strokeWidth === 0 && f <= B || a.strokeWidth > 0 && f <= B + a.strokeWidth / 2) ? !0 : !1;
                        if (I < 180) {
                            J = 90 - I / 2 - (a.direction === "clockwise" ? a.start : a.end), k = this.transformPointerPosition(a, a.abs_x, a.abs_y, J, b);
                            var V, T;
                            V = a.fill === "" ? B - a.strokeWidth / 2 : B, T = Math.cos(I / 2 * Math.PI / 180) * V;
                            return a.fill === "" && a.strokeWidth > 0 ? k.y >= a.abs_y - c.y + T && f >= B - a.strokeWidth / 2 && f <= B + a.strokeWidth / 2 ? !0 : !1 : k.y >= a.abs_y - c.y + T ? a.strokeWidth > 0 ? f <= B + a.strokeWidth / 2 ? !0 : !1 : !0 : !1
                        }
                    }
                } else if (a.shapeType === "radial") {
                    var B = a.radius ? a.radius : 0;
                    if (B > 0) {
                        var k = this.transformPointerPosition(a, a.abs_x, a.abs_y, 0, b),
                            c = a.getOrigin(),
                            f = Math.sqrt(Math.pow(k.x - a.abs_x + c.x, 2) + Math.pow(k.y - a.abs_y + c.y, 2));
                        return f < B
                    }
                }
            }
        }
    };
    d.registerModule("tools", i);
    var j = function () {
        return {
            enabled: !0,
            eventTypes: {},
            init: function () {
                this.core.canvasElement.events = {}
            },
            addEventTypes: function (a, b) {
                this.eventTypes[a] = this.eventTypes[a] || [];
                var c = this.eventTypes[a];
                for (var d in b) c[d] = c[d] || [], c[d].push(b[d])
            },
            bind: function (a, b, c) {
                for (var d = 0; d < b.length; d++) a.events[b[d]] = a.events[b[d]] || [], a.events[b[d]].push(c)
            },
            unbind: function (a, b, d) {
                var e, f, g;
                for (e = 0; e < b.length; e++) {
                    f = a.events[b[e]];
                    if (f === c) continue;
                    d === c ? delete a.events[b[e]] : (g = f.indexOf(d), ~g && f.splice(g, 1))
                }
            },
            findFrontObject: function (a, b) {
                var c, d, e;
                if (a.length === 0) return !1;
                for (c = a.length; c--;) {
                    d = a[c], e = this.findFrontObject(d.children, b);
                    if (e !== !1) break;
                    if (d.pointerEvents && d.isPointerInside(b)) {
                        e = d;
                        break
                    }
                }
                return e
            },
            getFrontObject: function (a) {
                return this.findFrontObject(this.core.children, this.core[a]) || c
            },
            triggerPointerEvent: function (a, b, c, d) {
                if (!!this.enabled) {
                    var e, f, g, h, i, j, k, l, m, n, o;
                    e = this.core.canvasElement, f = this.eventTypes[c], g = f.enter, h = f.leave, i = f[a], j = f.singleClick, this.lastPointerEventObject = this.fixEventObject(d, c);
                    if (b) {
                        if (b !== this.frontObject) {
                            if (this.frontObject) {
                                k = this.getParentChain(b);
                                if (!~k.indexOf(this.frontObject)) {
                                    this.triggerHandlers(this.frontObject, h), k = this.getParentChain(this.frontObject);
                                    if (!~k.indexOf(b)) this.triggerChain(k, h);
                                    else {
                                        l = [];
                                        for (n = 0, o = k.length; n < o; n++) {
                                            if (k[n] === b) break;
                                            l.push(k[n])
                                        }
                                        this.triggerChain(l, h)
                                    }
                                }
                            }
                            this.frontObject = b, (b.parent || e).events.hasEntered || (k = this.findNonEnteredParentChain(b), this.triggerChain(k, g)), b.events.hasEntered || this.triggerHandlers(b, g)
                        }
                    } else this.frontObject ? (l = this.getParentChain(this.frontObject, !1, !0), this.triggerChain(l, h), this.frontObject = null) : e.events.hasEntered || this.triggerHandlers(e, g), b = this.core.canvasElement;
                    a === "down" && (this.lastDownObject = b), l = this.getParentChain(b, !0, !0), this.triggerChain(l, i), a === "up" && (b === this.lastDownObject ? this.triggerChain(l, j) : (m = this.getSharedParent(b, this.lastDownObject), m && (l = this.getParentChain(m, !0, !0), this.triggerChain(l, j))), this.lastDownObject = null)
                }
            },
            getSharedParent: function (a, b) {
                var d, e, f;
                d = this.getParentChain(a, !0, !0), e = this.core.canvasElement, f = b;
                while (f) {
                    if (~d.indexOf(f)) break;
                    f = f.parent || (f !== e ? e : c)
                }
                return f
            },
            findNonEnteredParentChain: function (a) {
                var b, c, d;
                b = [], c = this.core.canvasElement, d = a.parent;
                while (d) {
                    if (d.events.hasEntered) break;
                    b.push(d), d = d.parent
                }!d && !c.events.hasEntered && b.push(c);
                return b.reverse()
            },
            getParentChain: function (a, b, c) {
                var d, e;
                d = [], c && d.push(a), e = a.parent;
                while (e) d.push(e), e = e.parent;
                b && a !== this.core.canvasElement && d.push(this.core.canvasElement);
                return d
            },
            triggerChain: function (a, b) {
                var c, d, e;
                for (c = 0, d = a.length; c < d; c++) {
                    e = this.triggerHandlers(a[c], b);
                    if (!e) break
                }
            },
            triggerHandlers: function (a, b, c) {
                var d, e, f, g, h, i, j;
                for (d = 0; d < b.length; d++) {
                    e = a.events[b[d]], f = !!~b[d].indexOf("enter"), g = !!~b[d].indexOf("leave"), j = c || (~b[d].indexOf("key") ? this.lastKeyboardEventObject : this.lastPointerEventObject), j.type = b[d], j.bubbles = f || g ? !1 : !0, f && !a.events.hasEntered ? a.events.hasEntered = !0 : g && a.events.hasEntered && (a.events.hasEntered = !1);
                    if (e) {
                        h = e.length;
                        for (i = 0; i < h; i++) typeof e[i] == "function" && e[i].call(a, j);
                        if (j.stoppingPropagation) {
                            j.stoppingPropagation = !1;
                            return !1
                        }
                    }
                }
                return !0
            },
            fixEventObject: function (a, b) {
                var d = "altKey ctrlKey metaKey shiftKey button charCode keyCode clientX clientY pageX pageY screenX screenY detail eventPhase isChar touches targetTouches changedTouches scale rotation".split(" "),
                    e = d.length,
                    f, g, h, i;
                f = {
                    originalEvent: a,
                    timeStamp: (new Date).getTime(),
                    which: a.which === 0 ? a.keyCode : a.which,
                    preventDefault: function () {
                        a.preventDefault()
                    },
                    stopPropagation: function () {
                        this.bubbles && (this.stoppingPropagation = !0), a.stopPropagation()
                    }
                };
                for (g = 0; g < e; g++) h = d[g], a[h] !== c && (f[h] = a[h]);~
                "mouse touch".indexOf(b) && (f.x = this.core[b].x, f.y = this.core[b].y), b === "mouse" && (i = {
                    0: 1,
                    2: 2,
                    1: 3,
                    "default": 0
                }, f.which = i[f.button] || i["default"]), b === "touch" && (f.which = 0);
                return f
            }
        }
    };
    d.registerModule("events", j, "init");
    var k = function () {
        return {
            objects: [],
            translation: {
                x: 0,
                y: 0
            },
            changeZorder: function (a, b, d) {
                var e = a.children,
                    f = e[b],
                    g = e[d],
                    h, i, j, k;
                if (f !== c) {
                    if (b === d) return;
                    d > e.length - 1 && (d = e.length - 1), d < 0 && (d = 0), d > b ? (h = e.slice(0, b), j = e.slice(d + 1, e.length), i = e.slice(b, d + 1), i.shift(), i.push(f)) : (h = e.slice(0, d), j = e.slice(b + 1, e.length), i = e.slice(d, b + 1), i.pop(), i.unshift(f)), a.children = h.concat(i).concat(j)
                }
            },
            clear: function (a) {
                this.core.canvas.clearRect(0, 0, this.core.width, this.core.height), a !== !1 && this.core.background.redraw(), this.isCleared = !0;
                return this
            },
            redraw: function (a) {
                a = a || !1, (this.core.settings.clearEachFrame || a) && this.clear(), this.isCleared = !1, this.drawObjects(this.core.children);
                return this
            },
            drawObjects: function (a) {
                var b = this.core.canvas,
                    d, e, f, g, h, i, j, k, l, m, n, o, p, q;
                for (d = 0, e = a.length; d < e; d++) {
                    f = a[d];
                    if (f !== c && typeof f.draw == "function") {
                        typeof f.update == "function" && f.update(), b.save(), j = [], j.push(f), o = f.parent;
                        while (o && o !== this.core) j.push(o), o = o.parent;
                        j.reverse(), k = 0, l = 0, q = 1;
                        for (m = 0, n = j.length; m < n; m++) g = j[m], b.translate(g.abs_x - k, g.abs_y - l), g.rotation !== 0 && b.rotate(g.rotation * Math.PI / 180), (g.scalingX !== 1 || g.scalingY !== 1) && b.scale(g.scalingX, g.scalingY), q *= g.opacity, k = g.abs_x, l = g.abs_y;
                        this.translation = {
                            x: k,
                            y: l
                        }, h = f.abs_x, i = f.abs_y, f._.abs_x = 0, f._.abs_y = 0, b.globalAlpha = isNaN(parseFloat(q)) ? 1 : parseFloat(q), b.globalCompositeOperation = f.composition, p = f.shadow, p.blur > 0 && (b.shadowOffsetX = p.offsetX, b.shadowOffsetY = p.offsetY, b.shadowBlur = p.blur, b.shadowColor = p.color), b.lineCap = f.cap, b.lineJoin = f.join, b.miterLimit = f.miterLimit, f.draw(), f.drawn = !0, f._.abs_x = h, f._.abs_y = i, b.lineCap = "butt", b.lineJoin = "miter", b.miterLimit = 10, b.restore(), this.translation = {
                            x: 0,
                            y: 0
                        }, f.children.length > 0 && this.drawObjects(f.children)
                    }
                }
            }
        }
    };
    d.registerModule("draw", k);
    var l = function () {
        return {
            bg: "",
            value: "",
            type: "transparent",
            loaded: !1,
            init: function () {
                this.set(this.core.settings.background)
            },
            set: function (a) {
                var b = this;
                typeof a != "string" && (a = ""), this.value = a, ~a.indexOf("gradient") ? this.type = "gradient" : ~a.indexOf("image") ? this.type = "image" : this.core.style && this.core.style.isColor(a) ? this.type = "color" : this.type = "transparent";
                if (this.type === "color") this.bg = a, this.core.timeline && !this.core.timeline.running && this.core.draw.redraw(!0), this.loaded = !0;
                else if (this.type === "gradient") this.bg = this.core.style ? this.core.style.getGradient(a, 0, 0, this.core.width, this.core.height) : "", this.core.timeline && !this.core.timeline.running && this.core.draw.redraw(!0), this.loaded = !0;
                else if (this.type === "image") {
                    var c = /image\((.*?)(,(\s|)(repeat|repeat-x|repeat-y|no-repeat)|)\)/.exec(a),
                        d = c[1],
                        e = c[4] || "repeat",
                        f = new Image;
                    f.src = d, f.onload = function () {
                        b.bg = b.core.canvas.createPattern(this, e), b.loaded = !0, b.core.timeline && !b.core.timeline.running && b.core.redraw(!0)
                    }
                } else this.redraw(!0), this.loaded = !0;
                return this
            },
            redraw: function () {
                var a = this.core;
                this.type !== "transparent" && (a.canvas.fillStyle = this.bg, a.canvas.fillRect(0, 0, a.width, a.height))
            }
        }
    };
    d.registerModule("background", l, "init");
    var m = function () {
        return {
            current: "none",
            scenes: {},
            create: function (a, b) {
                this.scenes[a] = Object.create(this.scenesBase()), this.scenes[a].name = a, b.call(this.scenes[a]);
                return this.scenes[a]
            },
            scenesBase: function () {
                return {
                    name: "",
                    objects: [],
                    loaded: !1,
                    add: function (a) {
                        this.objects.push(a), this.loaded && a.add();
                        return this
                    },
                    remove: function (a) {
                        var b = this.objects.indexOf(a);~
                        b && (this.objects.splice(b, 1), this.loaded && a.remove());
                        return this
                    },
                    load: function () {
                        if (!this.loaded) {
                            var a = this.objects,
                                b, d = a.length;
                            for (b = 0; b < d; b++) a[b] !== c && a[b].add();
                            this.loaded = !0;
                            return this
                        }
                    },
                    unload: function () {
                        var a = this.objects,
                            b, d = a.length;
                        for (b = 0; b < d; b++) a[b] !== c && a[b].remove();
                        this.loaded = !1;
                        return this
                    }
                }
            },
            load: function (a, b) {
                b === !0 && this.current !== "none" && this.unload(this.current), this.current = a, this.scenes[a].load();
                return this
            },
            unload: function (a) {
                this.current = "none", this.scenes[a].unload();
                return this
            }
        }
    };
    d.registerModule("scenes", m);
    var n = function () {
        return {
            getStroke: function (a, b) {
                b = b === "string" ? "string" : "object";
                if (typeof a == "object" && b === "string") {
                    var d = a;
                    a = typeof d.pos == "string" ? d.pos : "center", a += " " + (typeof d.width == "number" ? d.width + "px" : "1px"), a += " " + (typeof d.color == "string" ? d.color : "#000000")
                }
                var e = a.split(" "),
                    f, g;
                for (var h = 0, i = e.length; h < i; h++)!f && e[h].indexOf("(") > -1 && (f = h), e[h].indexOf(")") > -1 && (g = h);
                var j = g ? e.splice(f, g - f + 1) : c;
                j && e.push(j.join(" "));
                var k = ["outside", "center", "inside"],
                    l = "",
                    h, m = e.length,
                    n, o, j, p;
                if (m >= 3)
                    if (!~k.indexOf(e[0])) {
                        p = isNaN(parseInt(e[0]));
                        for (h = p ? 0 : 1; h < m; h++) l += e[h] + (h === m - 1 ? " " : "");
                        p ? e = [1, l] : e = [e[0], l], m = 2
                    } else {
                        if (m > 3) {
                            for (h = 2; h < m; h++) l += e[h] + (h === m - 1 ? " " : "");
                            e = [e[0], e[1], l]
                        }
                        e = {
                            pos: e[0],
                            width: parseInt(e[1]),
                            color: e[2]
                        }
                    }
                m === 2 && (e = {
                    pos: "center",
                    width: parseInt(e[0]),
                    color: e[1]
                }), e.length && (e = {
                    pos: "center",
                    width: 0,
                    color: ""
                });
                if (b === "string") return e.pos + " " + e.width + "px " + e.color;
                if (b === "object") return e
            },
            getGradient: function (a, b, c, d, e) {
                return~ a.indexOf("linear") ? this.getLinearGradient(a, b, c, d, e) : ~a.indexOf("radial") ? this.getRadialGradient(a, b, c, d, e) : "transparent"
            },
            getLinearGradient: function (a, b, c, d, e) {
                var f, g, h, i = [],
                    j, k, l, m, n, o, p = ["top", "bottom", "left", "right"],
                    q, r, s = [],
                    t, u;
                g = /\((.*)\)/.exec(a)[1];
                while (q = /((hsl|hsla|rgb|rgba)\(.*?\))/.exec(g)) r = s.push(q[1]) - 1, g = g.substring(0, q.index) + "###" + r + "###" + g.substring(q.index + q[1].length, g.length);
                g = g.split(","), h = g[0].split(" "), (~p.indexOf(h[0]) || ~h[0].indexOf("deg")) && i.push(h[0]), h.length > 1 && ~p.indexOf(h[1]) && i.push(h[1]), i.length === 0 ? i.push("top") : k = 1;
                if (i.length === 1) {
                    if (i[0] === "top") l = b + d / 2, m = c, n = b + d / 2, o = c + e;
                    else if (i[0] === "right") l = b + d, m = c + e / 2, n = b, o = c + e / 2;
                    else if (i[0] === "bottom") l = b + d / 2, m = c + e, n = b + d / 2, o = c;
                    else if (i[0] === "left") l = b, m = c + e / 2, n = b + d, o = c + e / 2;
                    else if (~i[0].indexOf("deg")) {
                        var v, w, x, y, z, A, B, C, D = Math.PI,
                            E = b + d / 2,
                            F = c + e / 2;
                        v = parseFloat(i) % 360 * D / 180, w = v, v >= 0 && v < D / 2 ? (A = b + d, B = c) : v >= D / 2 && v < D ? (C = F, F = E, B = b, A = C, E = c) : v >= D && v < D * 1.5 ? (C = F, A = E, E = b, F = c + e, B = C) : v >= D * 1.5 && v < D * 2 && (C = F, F = b + d, B = E, A = c + e, E = C), v = v % (D / 2), x = Math.atan(Math.abs(F - B) / Math.abs(A - E)), y = Math.sqrt(Math.pow(F - B, 2) + Math.pow(E - A, 2)), z = y * Math.cos(x - v), w >= 0 && w < D / 2 ? (n = E + z * Math.cos(v), o = F - z * Math.sin(v), l = E * 2 - n, m = F * 2 - o) : w >= D / 2 && w < D ? (n = F - z * Math.cos(D / 2 - v), o = A - z * Math.sin(D / 2 - v), l = F * 2 - n, m = A * 2 - o) : w >= D && w < D * 1.5 ? (n = A + z * Math.cos(D - v), o = B + z * Math.sin(D - v), l = A * 2 - n, m = B * 2 - o) : w >= D * 1.5 && w < D * 2 && (n = B - z * Math.cos(D * 1.5 - v), o = E - z * Math.sin(D * 1.5 - v), l = B * 2 - n, m = E * 2 - o)
                    }
                } else~ i.indexOf("top") && ~i.indexOf("left") ? (l = b, m = c, n = b + d, o = c + e) : ~i.indexOf("top") && ~i.indexOf("right") ? (l = b + d, m = c, n = b, o = c + e) : ~i.indexOf("bottom") && ~i.indexOf("left") ? (l = b, m = c + e, n = b + d, o = c) : ~i.indexOf("bottom") && ~i.indexOf("right") && (l = b + d, m = c + e, n = b, o = c);
                f = this.core.canvas.createLinearGradient(l, m, n, o), t = this.getColorStops(f, g.slice(k), s);
                for (u = 0; u < t.length; u++) f.addColorStop(t[u].pos / 100, t[u].color);
                return f
            },
            getRadialGradient: function (a, b, d, e, f) {
                var g, h = ["left", "center", "right"],
                    i = ["top", "center", "bottom"],
                    j = {
                        left: b,
                        center: b + e / 2,
                        right: b + e
                    },
                    k = {
                        top: d,
                        center: d + f / 2,
                        bottom: d + f
                    },
                    l = ["closest-side", "closest-corner", "farthest-side", "farthest-corner", "contain", "cover"],
                    m, n, o, p, q, r = [],
                    s, t, u, v = 0,
                    w = [{
                        x: c,
                        y: c,
                        r: 0
                    }, {
                        x: c,
                        y: c,
                        r: c
                    }],
                    x, y, z, A, B = !1;
                m = /\((.*)\)/.exec(a)[1];
                while (p = /((hsl|hsla|rgb|rgba)\(.*?\))/.exec(m)) q = r.push(p[1]) - 1, m = m.substring(0, p.index) + "###" + q + "###" + m.substring(p.index + p[1].length, m.length);
                m = m.split(/\s*,\s*/), o = m.length;
                for (n = 0; n < 2; n++)
                    if (~m[n].indexOf(" ")) {
                        u = m[n].split(" ");
                        if (u[0] === "center") w[n].x = u[0], w[n].y = u[1], v = n + 1;
                        else if (~h.indexOf(u[0])) w[n].x = u[0], v = n + 1, ~i.indexOf(u[1]) && (w[n].y = u[1]);
                        else if (~i.indexOf(u[0])) w[n].y = u[0], v = n + 1, ~h.indexOf(u[1]) && (w[n].x = u[1]);
                        else if (!isNaN(parseFloat(u[0]))) {
                            w[n].x = u[0], v = n + 1;
                            if (~i.indexOf(u[1]) || !isNaN(parseFloat(u[1]))) w[n].y = u[1]
                        }
                        w[n].x || (w[n].x = "center"), w[n].y || (w[n].y = "center")
                    } else~ h.indexOf(m[n]) ? (w[n].x = m[n], v = n + 1) : ~i.indexOf(m[n]) ? (w[n].y = m[n], v = n + 1) : n === 1 ? w[n].x = w[0].x : w[n].x = "center", n === 1 ? w[n].y = w[0].y : w[n].y = "center";~
                l.indexOf(m[v]) && (A = m[v], B = !0), /\d+(%|px)\s/.test(m[v]) && (A = parseFloat(m[v]), B = !0, isNaN(A) && (A = 0)), A === c && (A = "cover");
                for (n = 0; n < 2; n++) {
                    w[n].abs_x = j[w[n].x], w[n].abs_y = k[w[n].y];
                    for (x = 0; x < 2; x++) y = "abs_" + (x === 0 ? "x" : "y"), w[n][y] === c && (w[n][y] = parseFloat(w[n][y === "abs_x" ? "x" : "y"]), isNaN(w[n][y]) && (w[n][y] = y === "abs_x" ? j.center - b : k.center - d), ~w[n][y === "abs_x" ? "x" : "y"].indexOf("%") && (w[n][y] = w[n][y] / 100 * (y === "abs_x" ? e : f)), w[n][y] += y === "abs_x" ? b : d)
                }~
                l.indexOf(A) && (A === "closest-side" || A === "contain" ? A = Math.min(Math.abs(w[1].abs_y - d), Math.abs(d + f - w[1].abs_y), Math.abs(w[1].abs_x - b), Math.abs(b + e - w[1].abs_y)) : A === "closest-corner" ? A = Math.min(Math.sqrt(Math.pow(w[1].abs_x - b, 2) + Math.pow(w[1].abs_y - d, 2)), Math.sqrt(Math.pow(b + e - w[1].abs_x, 2) + Math.pow(w[1].abs_y - d, 2)), Math.sqrt(Math.pow(b + e - w[1].abs_x, 2) + Math.pow(d + f - w[1].abs_y, 2)), Math.sqrt(Math.pow(w[1].abs_x - b, 2) + Math.pow(d + f - w[1].abs_y, 2))) : A === "farthest-corner" || A === "cover" ? A = Math.max(Math.sqrt(Math.pow(w[1].abs_x - b, 2) + Math.pow(w[1].abs_y - d, 2)), Math.sqrt(Math.pow(b + e - w[1].abs_x, 2) + Math.pow(w[1].abs_y - d, 2)), Math.sqrt(Math.pow(b + e - w[1].abs_x, 2) + Math.pow(d + f - w[1].abs_y, 2)), Math.sqrt(Math.pow(w[1].abs_x - b, 2) + Math.pow(d + f - w[1].abs_y, 2))) : A === "farthest-side" ? A = Math.max(Math.abs(w[1].abs_y - d), Math.abs(d + f - w[1].abs_y), Math.abs(w[1].abs_x - b), Math.abs(b + e - w[1].abs_y)) : A = 0), ~m[v].indexOf("%") && (~m[v].indexOf(" ") ? z = m[v].split(" ")[1] === "height" ? f : e : z = e, A = A / 100 * z), w[1].r = A, g = this.core.canvas.createRadialGradient(w[0].abs_x, w[0].abs_y, w[0].r, w[1].abs_x, w[1].abs_y, w[1].r), s = this.getColorStops(g, m.slice(v + (B ? 1 : 0)), r);
                for (t = 0; t < s.length; t++) g.addColorStop(s[t].pos / 100, s[t].color);
                return g
            },
            getColorStops: function (a, b, d) {
                var e, f = b.length,
                    g, h, i, j, k = [];
                for (e = 0; e < f; e++) {
                    g = b[e].trim();
                    if (j >= 100) break;~
                    g.indexOf(" ") ? (h = g.split(" "), i = h[0], j = h[1], ~j.indexOf("px") ? j = parseFloat(j) / Math.sqrt(Math.pow(eX - sX, 2) + Math.pow(eY - sY, 2)) * 100 : j = parseFloat(j)) : (i = g, j === c ? j = 0 : (j = j || 0, j = j + (100 - j) / (f - e))), ~i.indexOf("###") && (i = d[/###(\d+)###/.exec(i)[1]]), k.push({
                        pos: j,
                        color: i
                    })
                }
                return k
            },
            getFont: function (a, b) {
                b = b === "string" ? "string" : "object";
                if (typeof a == "object" && b === "string") {
                    var d = a;
                    a = typeof d.style == "string" ? d.style : "normal", a += " " + (typeof d.variant == "string" ? d.variant : "normal"), a += " " + (typeof d.weight == "string" ? d.weight : "normal"), a += " " + (typeof d.size == "number" ? ~~(d.size * 10 + .5) / 10 + "px" : "16px"), a += "/" + (typeof d.lineHeight == "number" ? ~~(d.lineHeight * 10 + .5) / 10 : typeof d.lineHeight == "string" ? d.lineHeight.indexOf("px") > -1 ? d.lineHeight : 1 : 1), a += " " + (typeof d.family == "string" ? d.family : "sans-serif")
                }
                if (a.length > 0) {
                    var e = a.split(" "),
                        f = e.length,
                        g, a, h, i, j = "",
                        k = ["normal", "italic", "oblique"],
                        l = ["normal", "small-caps"],
                        m = ["normal", "bold", "bolder", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
                        n = {};
                    for (g = 0; g < f; g++) {
                        a = e[g];
                        if (~k.indexOf(a) && !n.style) n.style = a;
                        else if (~l.indexOf(a) && !n.variant) n.variant = a;
                        else if (~m.indexOf(a) && !n.weight) n.weight = a;
                        else if (~a.indexOf("/") && !n.size && !n.lineHeight) h = a.split("/"), isNaN(parseInt(h[0])) || (n.size = parseInt(h[0])), isNaN(parseFloat(h[1])) || (n.lineHeight = parseFloat(h[1]), n.lineHeightUnit = h[1].indexOf("px") > -1 ? "px" : "relative");
                        else if (!n.size && /\d+[a-z]{2}(?!\/)/.test(a)) isNaN(parseInt(a)) || (n.size = parseInt(a));
                        else if (isNaN(parseInt(a)) && !n.family) {
                            j = "";
                            for (i = g; i < f; i++) j += e[i] + (i === f - 1 ? "" : " ");
                            n.family = j
                        }
                    }
                }
                e = n || {}, e.style = e.style ? e.style : "normal", e.variant = e.variant ? e.variant : "normal", e.weight = e.weight ? e.weight : "normal", e.size = e.size !== c ? e.size : 16, e.lineHeight = e.lineHeight !== c ? e.lineHeight : 1, e.lineHeightUnit = e.lineHeightUnit !== c ? e.lineHeightUnit : "relative", e.family = e.family ? e.family : "sans-serif";
                if (b === "string") return e.style + " " + e.variant + " " + e.weight + " " + e.size + "px/" + e.lineHeight + (e.lineHeightUnit === "px" ? "px" : "") + " " + e.family;
                if (b === "object") return e
            },
            getShadow: function (a, b) {
                var c = {},
                    d;
                if (typeof a == "object") c.offsetX = isNaN(parseFloat(a.offsetX)) ? 0 : parseFloat(a.offsetX), c.offsetY = isNaN(parseFloat(a.offsetY)) ? 0 : parseFloat(a.offsetY), c.blur = isNaN(parseFloat(a.blur)) ? 0 : parseFloat(a.blur), c.color = this.isColor(a.color) ? a.color : "#000";
                else if (typeof a == "string") {
                    var d = /^(.*?)\s(.*?)\s(.*?)\s(.*?)$/.exec(a);
                    c.offsetX = isNaN(parseFloat(d[1])) ? 0 : parseFloat(d[1]), c.offsetY = isNaN(parseFloat(d[2])) ? 0 : parseFloat(d[2]), c.blur = isNaN(parseFloat(d[3])) ? 0 : parseFloat(d[3]), c.color = this.isColor(d[4]) ? d[4] : "#000"
                }
                return b === "string" ? c.offsetX + "px " + c.offsetY + "px " + c.blur + "px " + c.color : c
            },
            isColor: function (a) {
                return typeof a != "string" || a[0] !== "#" && a.substr(0, 4) !== "rgb(" && a.substr(0, 5) !== "rgba(" && a.substr(0, 4) !== "hsl(" && a.substr(0, 5) !== "hsla(" ? !1 : !0
            }
        }
    };
    d.registerModule("style", n), a.logs = [];
    var o = function () {
        var a = {
            durations: {
                "short": 500,
                normal: 1e3,
                "long": 2e3
            },
            defaults: {
                duration: "normal",
                easing: "ease-in-out"
            },
            animate: function (a, b) {
                var c = this.parseArguments(b),
                    d = c.properties,
                    e = c.options,
                    f = this.queues.create(a, e.queue),
                    g = {
                        obj: a,
                        properties: d,
                        startValues: {},
                        diffValues: {},
                        options: {
                            queue: f,
                            duration: e.duration,
                            easing: e.easing,
                            callback: e.callback
                        }
                    };
                f.add(g), f.run()
            },
            parseArguments: function (a) {
                a = Array.prototype.slice.call(a), a[1] = a[1] || {};
                var b;
                typeof a[1] == "object" ? (props = a[0], b = d.extend({
                    duration: this.defaults.duration,
                    easing: this.defaults.easing,
                    queue: "default",
                    callback: function () {}
                }, a[1]), b.easing = this.parseEasingOption(b.easing), b.duration = this.parseDurationOption(b.duration)) : (props = a.shift(), b = this.getAnimateArguments(a));
                return {
                    properties: props,
                    options: b
                }
            },
            parseEasingOption: function (a) {
                if (typeof a == "string") return~ a.indexOf("cubic-bezier") ? this.getCustomCubicBezier(a) || this.easing[this.defaults.easing] : this.easing[a] || this.easing[this.defaults.easing];
                if (typeof a != "function") return this.easing[this.defaults.easing]
            },
            parseDurationOption: function (b) {
                var c = a.durations;
                if (typeof b == "string") return c[b] || c[a.defaults.duration];
                return b
            },
            runAnimation: function (a, b) {
                var c, d, e, f;
                c = a.obj, e = a.options, a.advanceCallback = b, this.mainTimer.add(a);
                var d = this.parseProperties(a.properties, c);
                a.properties = d.properties, a.startValues = d.startValues, a.diffValues = d.diffValues, a.startTime = (new Date).getTime()
            },
            parseProperties: function (a, b) {
                var c = {},
                    e = {};
                for (var f in a)
                    if (d.isNumber(a[f])) c[f] = b[f] || 0, e[f] = a[f] - (b[f] || 0);
                    else if (typeof a[f] == "object") {
                    var g = this.parseProperties(a[f], b[f]);
                    c[f] = g.startValues, e[f] = g.diffValues
                } else delete a[f];
                return {
                    properties: a,
                    startValues: c,
                    diffValues: e
                }
            },
            tick: function (a) {
                var b, c, d, e, f, g;
                b = (new Date).getTime() - a.startTime, c = b / a.options.duration;
                if (c > 1) {
                    this.setEndValues(a);
                    return !1
                }
                a.options.easing.length === 1 ? d = a.options.easing.call(this.easing, c) : d = a.options.easing.call(this.easing, b, 0, 1, a.options.duration), e = a.startValues, f = a.diffValues;
                for (g in f) this.setObjectProperty(a.obj, g, e[g], f[g], d);
                return !0
            },
            setObjectProperty: function (a, b, c, e, f) {
                if (d.isNumber(c)) a[b] = c + e * f;
                else
                    for (var g in c) this.setObjectProperty(a[b], g, c[g], e[g], f)
            },
            setEndValues: function (a) {
                var b = a.obj,
                    c = a.startValues,
                    d = a.diffValues;
                for (var e in a.properties) this.setObjectProperty(b, e, c[e], d[e], 1);
                this.core.timeline.running || this.core.draw.redraw(!0)
            },
            getAnimateArguments: function (a) {
                var b, d, e, f;
                typeof a[0] == "number" ? b = a[0] : typeof a[0] == "string" ? a[0] in this.durations ? b = this.durations[a[0]] : a[0] in this.easing && (d = this.easing[a[0]]) : typeof a[0] == "boolean" ? e = a[0] : typeof a[0] == "function" && typeof a[1] == "function" && (d = a[0], f = a[1]), typeof a[1] == "string" ? d = this.easing[a[1]] : typeof a[1] == "function" && (a[2] !== c ? d = a[1] : f = a[1]), a[2] !== c && (typeof a[2] == "function" ? f = a[2] : e = !!a[2]), a[3] !== c && (f = a[3]), d || (d = typeof a[0] == "string" ? a[0] : "", d = ~d.indexOf("cubic-bezier") ? d : c, d || (d = typeof a[1] == "string" ? a[1] : "", d = ~d.indexOf("cubic-bezier") ? d : c), d && (d = this.getCustomCubicBezier(d))), b = b || this.durations[this.defaults.duration], d = d || this.easing[this.defaults.easing], e = e !== c ? e : !1, f = f || function () {};
                return {
                    duration: b,
                    easing: d,
                    queue: e ? c : "default",
                    callback: f
                }
            },
            getCustomCubicBezier: function (a) {
                var b, c, d, e, f;
                b = a.match(/cubic-bezier\(\s*(.*?),\s*(.*?),\s*(.*?),\s*(.*?)\)/);
                if (!!b) {
                    c = isNaN(parseFloat(b[1])) ? 0 : parseFloat(b[1]), d = isNaN(parseFloat(b[2])) ? 0 : parseFloat(b[2]), e = isNaN(parseFloat(b[3])) ? 1 : parseFloat(b[3]), f = isNaN(parseFloat(b[4])) ? 1 : parseFloat(b[4]);
                    return function (a) {
                        return this.cubicBezier(c, d, e, f, a)
                    }
                }
            },
            stop: function (a) {
                for (var b in a.animationQueues) a.animationQueues[b].clear(!1)
            },
            finish: function (a) {
                for (var b in a.animationQueues) a.animationQueues[b].clear(!0)
            },
            delay: function (a, b, c) {
                var d = a.animationQueues[c && c.queue || "default"];
                d && d.add({
                    type: "delay",
                    duration: b || 0
                })
            },
            mainTimer: {
                animations: [],
                add: function (a) {
                    this.animations.push(a), this.animations.length === 1 && this.start()
                },
                remove: function (a) {
                    this.animations.splice(this.animations.indexOf(a), 1), this.animations.length === 0 && this.stop()
                },
                start: function () {
                    this.tick()
                },
                stop: function () {
                    cancelAnimationFrame(this.timer)
                },
                tick: function () {
                    var b = this;
                    setTimeout(function () {
                        b.timer = requestAnimationFrame(function () {
                            b.tick()
                        });
                        var c = b.animations,
                            d;
                        for (var e = 0, f = c.length; e < f; e++) d = c[e], d.cancelled || a.tick(d) || (a.mainTimer.remove(d), e--, f--, d.advanceCallback(), d.options.callback.call(d.obj));
                        a.core.timeline.running || a.core.draw.redraw(!0)
                    }, 1e3 / a.core.settings.fps)
                }
            },
            queues: {
                create: function (b, d) {
                    d === c && (d = Math.round((new Date).getTime() * Math.random()) + ""), b.animationQueues[d] || (b.animationQueues[d] = {
                        name: d,
                        list: [],
                        isRunning: !1,
                        add: function (a) {
                            this.list.push(a)
                        },
                        remove: function (a) {
                            if (a) {
                                var b = this.list.indexOf(a);~
                                b && this.list.splice(b, 1)
                            } else this.list.shift()
                        },
                        run: function () {
                            if (!this.isRunning && this.list.length > 0) {
                                this.isRunning = !0;
                                var b = this.list[0],
                                    c = this;
                                b.type === "delay" ? setTimeout(function () {
                                    c.advance()
                                }, b.duration) : a.runAnimation(b, function () {
                                    c.advance()
                                })
                            }
                        },
                        advance: function () {
                            this.list.shift(), this.isRunning = !1, this.run()
                        },
                        clear: function (b) {
                            if (this.isRunning) {
                                var c = this.list[0];
                                cancelAnimationFrame(c.timer), c.cancelled = !0, b && (a.setEndValues(c), c.options.callback.call(c.obj)), this.isRunning = !1, a.mainTimer.remove(c)
                            }
                            this.list.length = 0
                        }
                    });
                    return this.get(b, d)
                },
                get: function (a, b) {
                    return a.animationQueues[b]
                }
            },
            easing: {
                "ease-in": function (a) {
                    return this.cubicBezier(.42, 0, 1, 1, a)
                },
                "ease-out": function (a) {
                    return this.cubicBezier(0, 0, .58, 1, a)
                },
                "ease-in-out": function (a) {
                    return this.cubicBezier(.42, 0, .58, 1, a)
                },
                linear: function (a) {
                    return a
                },
                "ease-in-quad": function (a, b, c, d) {
                    return c * (a /= d) * a + b
                },
                "ease-out-quad": function (a, b, c, d) {
                    return -c * (a /= d) * (a - 2) + b
                },
                "ease-in-out-quad": function (a, b, c, d) {
                    if ((a /= d / 2) < 1) return c / 2 * a * a + b;
                    return -c / 2 * (--a * (a - 2) - 1) + b
                },
                "ease-in-cubic": function (a, b, c, d) {
                    return c * (a /= d) * a * a + b
                },
                "ease-out-cubic": function (a, b, c, d) {
                    return c * ((a = a / d - 1) * a * a + 1) + b
                },
                "ease-in-out-cubic": function (a, b, c, d) {
                    if ((a /= d / 2) < 1) return c / 2 * a * a * a + b;
                    return c / 2 * ((a -= 2) * a * a + 2) + b
                },
                "ease-in-quart": function (a, b, c, d) {
                    return c * (a /= d) * a * a * a + b
                },
                "ease-out-quart": function (a, b, c, d) {
                    return -c * ((a = a / d - 1) * a * a * a - 1) + b
                },
                "ease-in-out-quart": function (a, b, c, d) {
                    if ((a /= d / 2) < 1) return c / 2 * a * a * a * a + b;
                    return -c / 2 * ((a -= 2) * a * a * a - 2) + b
                },
                "ease-in-quint": function (a, b, c, d) {
                    return c * (a /= d) * a * a * a * a + b
                },
                "ease-out-quint": function (a, b, c, d) {
                    return c * ((a = a / d - 1) * a * a * a * a + 1) + b
                },
                "ease-in-out-quint": function (a, b, c, d) {
                    if ((a /= d / 2) < 1) return c / 2 * a * a * a * a * a + b;
                    return c / 2 * ((a -= 2) * a * a * a * a + 2) + b
                },
                "ease-in-sine": function (a, b, c, d) {
                    return -c * Math.cos(a / d * (Math.PI / 2)) + c + b
                },
                "ease-out-sine": function (a, b, c, d) {
                    return c * Math.sin(a / d * (Math.PI / 2)) + b
                },
                "ease-in-out-sine": function (a, b, c, d) {
                    return -c / 2 * (Math.cos(Math.PI * a / d) - 1) + b
                },
                "ease-in-expo": function (a, b, c, d) {
                    return a == 0 ? b : c * Math.pow(2, 10 * (a / d - 1)) + b
                },
                "ease-out-expo": function (a, b, c, d) {
                    return a == d ? b + c : c * (-Math.pow(2, -10 * a / d) + 1) + b
                },
                "ease-in-out-expo": function (a, b, c, d) {
                    if (a == 0) return b;
                    if (a == d) return b + c;
                    if ((a /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (a - 1)) + b;
                    return c / 2 * (-Math.pow(2, -10 * --a) + 2) + b
                },
                "ease-in-circ": function (a, b, c, d) {
                    return -c * (Math.sqrt(1 - (a /= d) * a) - 1) + b
                },
                "ease-out-circ": function (a, b, c, d) {
                    return c * Math.sqrt(1 - (a = a / d - 1) * a) + b
                },
                "ease-in-out-circ": function (a, b, c, d) {
                    if ((a /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - a * a) - 1) + b;
                    return c / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + b
                },
                "ease-in-elastic": function (a, b, c, d, e, f) {
                    e = e || 0;
                    if (a == 0) return b;
                    if ((a /= d) == 1) return b + c;
                    f || (f = d * .3);
                    if (e < Math.abs(c)) {
                        e = c;
                        var g = f / 4
                    } else var g = f / (2 * Math.PI) * Math.asin(c / e);
                    return -(e * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - g) * 2 * Math.PI / f)) + b
                },
                "ease-out-elastic": function (a, b, c, d, e, f) {
                    e = e || 0;
                    if (a == 0) return b;
                    if ((a /= d) == 1) return b + c;
                    f || (f = d * .3);
                    if (e < Math.abs(c)) {
                        e = c;
                        var g = f / 4
                    } else var g = f / (2 * Math.PI) * Math.asin(c / e);
                    return e * Math.pow(2, -10 * a) * Math.sin((a * d - g) * 2 * Math.PI / f) + c + b
                },
                "ease-in-out-elastic": function (a, b, c, d, e, f) {
                    e = e || 0;
                    if (a == 0) return b;
                    if ((a /= d / 2) == 2) return b + c;
                    f || (f = d * .3 * 1.5);
                    if (e < Math.abs(c)) {
                        e = c;
                        var g = f / 4
                    } else var g = f / (2 * Math.PI) * Math.asin(c / e); if (a < 1) return -0.5 * e * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - g) * 2 * Math.PI / f) + b;
                    return e * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * d - g) * 2 * Math.PI / f) * .5 + c + b
                },
                "ease-in-back": function (a, b, d, e, f) {
                    f == c && (f = 1.70158);
                    return d * (a /= e) * a * ((f + 1) * a - f) + b
                },
                "ease-out-back": function (a, b, d, e, f) {
                    f == c && (f = 1.70158);
                    return d * ((a = a / e - 1) * a * ((f + 1) * a + f) + 1) + b
                },
                "ease-in-out-back": function (a, b, d, e, f) {
                    f == c && (f = 1.70158);
                    if ((a /= e / 2) < 1) return d / 2 * a * a * (((f *= 1.525) + 1) * a - f) + b;
                    return d / 2 * ((a -= 2) * a * (((f *= 1.525) + 1) * a + f) + 2) + b
                },
                "ease-in-bounce": function (a, b, c, d) {
                    return c - this["ease-out-bounce"](d - a, 0, c, d) + b
                },
                "ease-out-bounce": function (a, b, c, d) {
                    return (a /= d) < 1 / 2.75 ? c * 7.5625 * a * a + b : a < 2 / 2.75 ? c * (7.5625 * (a -= 1.5 / 2.75) * a + .75) + b : a < 2.5 / 2.75 ? c * (7.5625 * (a -= 2.25 / 2.75) * a + .9375) + b : c * (7.5625 * (a -= 2.625 / 2.75) * a + .984375) + b
                },
                "ease-in-out-bounce": function (a, b, c, d) {
                    if (a < d / 2) return this["ease-in-bounce"](a * 2, 0, c, d) * .5 + b;
                    return this["ease-in-out-bounce"](a * 2 - d, 0, c, d) * .5 + c * .5 + b
                },
                cubicBezier: function (a, b, c, d, e) {
                    var f = 0,
                        g = 0,
                        h = 1,
                        i = 1,
                        j = h - 3 * c + 3 * a - f,
                        k = 3 * c - 6 * a + 3 * f,
                        l = 3 * a - 3 * f,
                        m = f,
                        n = i - 3 * d + 3 * b - g,
                        o = 3 * d - 6 * b + 3 * g,
                        p = 3 * b - 3 * g,
                        q = g,
                        r = e,
                        s = 5,
                        t, u, v, w;
                    for (t = 0; t < s; t++) v = j * r * r * r + k * r * r + l * r + m, u = 1 / (3 * j * r * r + 2 * k * r + l), r -= (v - e) * u, r = r > 1 ? 1 : r < 0 ? 0 : r;
                    w = Math.abs(n * r * r * r + o * r * r + p * r * q);
                    return w
                }
            }
        };
        return a
    };
    d.registerModule("animation", o);
    var p = function () {
            var a = function (a, b, c, d, e) {
                var f = e.style.getStroke(a.stroke);
                f[b] = c, a.stroke = e.style.getStroke(f, "string")
            };
            return {
                id: 0,
                shapeType: "rectangular",
                type: "",
                origin: {
                    x: 0,
                    y: 0
                },
                events: {},
                children: [],
                added: !1,
                opacity: 1,
                rotation: 0,
                composition: "source-over",
                scalingX: 1,
                scalingY: 1,
                pointerEvents: !0,
                animationQueues: {},
                _: {
                    x: 0,
                    y: 0,
                    abs_x: 0,
                    abs_y: 0,
                    rotation: 0,
                    width: 0,
                    height: 0,
                    drawn: !1,
                    stroke: "",
                    strokeColor: "",
                    strokeWidth: 0,
                    strokePosition: "center",
                    cap: "butt",
                    join: "miter",
                    miterLimit: 10,
                    fill: "",
                    shadow: {
                        offsetX: 0,
                        offsetY: 0,
                        blur: 0,
                        color: "transparent"
                    }
                },
                set strokeColor(b) {
                    a(this, "color", b, "strokeColor", this.core)
                },
                set strokeWidth(b) {
                    a(this, "width", b, "strokeWidth", this.core)
                },
                set strokePosition(b) {
                    a(this, "pos", b, "strokePosition", this.core)
                },
                set stroke(a) {
                    typeof a != "string" && (a = this.core.style.getStroke(a, "string"));
                    var b = this.core.style.getStroke(a);
                    if (~b.color.indexOf("image(")) {
                        var c = /image\((.*?)(,(\s|)(repeat|repeat-x|repeat-y|no-repeat)|)\)/.exec(b.color),
                            d = c[1],
                            e = c[4] || "repeat",
                            f = new Image,
                            g = this;
                        f.src = d, this._.strokepattern_loading = !0, this._.strokepattern_redraw = !1, f.onload = function () {
                            g._.strokeColor = g.core.canvas.createPattern(this, e), g._.strokepattern_loading = !1, g._.strokepattern_redraw && (g._.strokepattern_redraw = !1, g.redraw())
                        }
                    } else this._.strokeColor = b.color;
                    this._.strokeWidth = b.width, this._.strokePosition = b.pos, this._.stroke = a
                },
                set cap(a) {
                    var b = ["butt", "round", "square"];
                    this._.cap = ~b.indexOf(a) ? a : "butt"
                },
                set join(a) {
                    var b = ["round", "bevel", "miter"];
                    this._.join = ~b.indexOf(a) ? a : "miter"
                },
                set miterLimit(a) {
                    this._.miterLimit = isNaN(parseFloat(a)) ? 10 : parseFloat(a)
                },
                get stroke() {
                    return this._.stroke
                },
                get strokeColor() {
                    if (this._.strokepattern_loading) {
                        this._.strokepattern_redraw = !0;
                        return ""
                    }
                    if (~(this._.strokeColor + "").indexOf("CanvasPattern")) return this._.strokeColor;
                    if (!~this._.strokeColor.indexOf("gradient")) return this._.strokeColor;
                    var a = this.getOrigin();
                    if (this.shapeType === "rectangular") {
                        var b = this.strokePosition === "outside" ? this.strokeWidth : this.strokePosition === "center" ? this.strokeWidth / 2 : 0;
                        return this.core.style.getGradient(this._.strokeColor, this.abs_x - a.x - b, this.abs_y - a.y - b, this.width + b * 2, this.height + b * 2)
                    }
                    if (this.shapeType === "radial") {
                        var c = this.radius + this.strokeWidth / 2;
                        a.x += this.radius, a.y += this.radius;
                        return this.core.style.getGradient(this._.strokeColor, this.abs_x - a.x - this.radius, this.abs_y - a.y - this.radius, c * 2, c * 2)
                    }
                },
                get strokeWidth() {
                    return this._.strokeWidth
                },
                get strokePosition() {
                    return this._.strokePosition
                },
                get cap() {
                    return this._.cap
                },
                get join() {
                    return this._.join
                },
                get miterLimit() {
                    return this._.miterLimit
                },
                set fill(a) {
                    if (~a.indexOf("image(")) {
                        var b = /image\((.*?)(,(\s|)(repeat|repeat-x|repeat-y|no-repeat)|)\)/.exec(a),
                            c = b[1],
                            d = b[4] || "repeat",
                            e = new Image,
                            f = this;
                        e.src = c, this._.pattern_loading = !0, this._.pattern_redraw = !1, e.onload = function () {
                            f._.fill = f.core.canvas.createPattern(this, d), f._.pattern_loading = !1, f._.pattern_redraw && (f._.pattern_redraw = !1, f.redraw())
                        }
                    } else this._.fill = a
                },
                get fill() {
                    if (this._.pattern_loading) {
                        this._.pattern_redraw = !0;
                        return ""
                    }
                    if (~(this._.fill + "").indexOf("CanvasPattern")) return this._.fill;
                    if (!~this._.fill.indexOf("gradient")) return this._.fill;
                    var a = this.getOrigin();
                    if (this.shapeType === "rectangular") return this.core.style.getGradient(this._.fill, this.abs_x - a.x, this.abs_y - a.y, this.width, this.height);
                    if (this.shapeType === "radial") return this.core.style.getGradient(this._.fill, this.abs_x - a.x - this.radius, this.abs_y - a.y - this.radius, this.radius * 2, this.radius * 2)
                },
                set shadow(a) {
                    typeof a != "string" && (a = this.core.style.getShadow(a, "string"));
                    var b = this.core.style.getShadow(a);
                    this._.shadow = b
                },
                set shadowOffsetX(a) {
                    isNaN(parseFloat(a)) || (this._.shadow.offsetX = parseFloat(a))
                },
                set shadowOffsetY(a) {
                    isNaN(parseFloat(a)) || (this._.shadow.offsetY = parseFloat(a))
                },
                set shadowBlur(a) {
                    isNaN(parseFloat(a)) || (this._.shadow.blur = parseFloat(a))
                },
                set shadowColor(a) {
                    this.core.style.isColor(a) && (this._.shadow.color = a)
                },
                get shadow() {
                    return this._.shadow
                },
                get shadowOffsetX() {
                    return this._.shadow.offsetX
                },
                get shadowOffsetY() {
                    return this._.shadow.offsetY
                },
                get shadowBlur() {
                    return this._.shadow.blur
                },
                get shadowColor() {
                    return this._.shadow.color
                },
                set x(a) {
                    this._.x = a, this._.abs_x = a + (this.parent !== c && this.parent !== this.core ? this.parent.abs_x : 0);
                    var b = this.children,
                        d = b.length,
                        e;
                    for (e = 0; e < d; e++) b[e]._.abs_x = this.abs_x + b[e].x, b[e].x += 0
                },
                set y(a) {
                    this._.y = a, this._.abs_y = a + (this.parent !== c && this.parent !== this.core ? this.parent.abs_y : 0);
                    var b = this.children,
                        d = b.length,
                        e;
                    for (e = 0; e < d; e++) b[e]._.abs_y = this.abs_y - b[e].y, b[e].y += 0
                },
                get x() {
                    return this._.x
                },
                get y() {
                    return this._.y
                },
                set abs_x(a) {
                    return
                },
                set abs_y(a) {
                    return
                },
                get abs_x() {
                    return this._.abs_x
                },
                get abs_y() {
                    return this._.abs_y
                },
                set width(a) {
                    this._.width = a
                },
                get width() {
                    return this._.width
                },
                set height(a) {
                    this._.height = a
                },
                get height() {
                    return this._.height
                },
                set zIndex(a) {
                    !this.parent || (a === "front" && (a = this.parent.children.length - 1), a === "back" && (a = 0), this.core.draw.changeZorder(this.parent, this.zIndex, a))
                },
                get zIndex() {
                    return this.parent && this.parent.children.indexOf(this)
                },
                get drawn() {
                    return this.core.draw.isCleared ? !1 : this._.drawn
                },
                set drawn(a) {
                    this._.drawn = !!a
                },
                bind: function (a, b) {
                    this.core.events.bind(this, a.split(" "), b);
                    return this
                },
                unbind: function (a, b) {
                    this.core.events.unbind(this, a.split(" "), b);
                    return this
                },
                trigger: function (a) {
                    this.core.events.triggerHandlers(this, a.split(" "));
                    return this
                },
                add: function (a) {
                    this.added || (a = a !== c ? a : !0, this.core.children.push(this), this.added = !0, this.parent = this.core, this.core.draw.objects.push(this), a && this.core.draw.redraw());
                    return this
                },
                remove: function (a) {
                    a = a !== c ? a : !0;
                    if (!this.parent) return this;
                    var b = this.parent.children.indexOf(this);
                    if (~b) {
                        this.parent.children.splice(b, 1), this.parent = c, this.added = !1, this.drawn = !1;
                        var d = this.core.draw.objects.indexOf(this);~
                        d && this.core.draw.objects.splice(f, 1);
                        var e = this.children;
                        for (var f = 0, g = e.length; f < g; f++) e[f].drawn = !1, d = this.core.draw.objects.indexOf(e[f]), ~d && this.core.draw.objects.splice(d, 1);
                        a && this.core.draw.redraw()
                    }
                    return this
                },
                draw: function () {},
                redraw: function () {
                    this.core.draw.redraw();
                    return this
                },
                rotate: function (a) {
                    this.rotation += a;
                    return this
                },
                rotateTo: function (a) {
                    this.rotation = a;
                    return this
                },
                getArgs: function (a, b, d, e) {
                    d = d || 0, e = e || 0;
                    if (typeof b == "string") {
                        var f = b,
                            g = a;
                        a = f === "x" ? g : d, b = f === "y" ? g : e
                    } else b === c && (b = a);
                    return {
                        x: a,
                        y: b
                    }
                },
                move: function (a, b) {
                    var c = this.getArgs(a, b);
                    this.x += c.x, this.y += c.y;
                    return this
                },
                moveTo: function (a, b) {
                    var c = this.getArgs(a, b, this.x, this.y);
                    this.x = c.x, this.y = c.y;
                    return this
                },
                scale: function (a, b) {
                    var c = this.getArgs(a, b, 1, 1);
                    this.scalingX = c.x, this.scalingY = c.y;
                    return this
                },
                scaleTo: function (a, b) {
                    var c = this.shapeType === "rectangular" ? this.width : this.radius,
                        d = this.shapeType === "rectangular" ? this.height : this.radius,
                        e = this.getArgs(a, b, c, d);
                    e.x = e.x <= 0 ? 1 : e.x, e.y = e.y <= 0 ? 1 : e.y, this.scalingX = e.x / c, this.scalingX = e.y / d;
                    return this
                },
                animate: function () {
                    this.core.animation.animate(this, arguments);
                    return this
                },
                stop: function () {
                    this.core.animation.stop(this);
                    return this
                },
                finish: function () {
                    this.core.animation.finish(this);
                    return this
                },
                delay: function (a, b) {
                    this.core.animation.delay(this, a, b);
                    return this
                },
                fadeIn: function () {
                    var a = Array.prototype.slice.call(arguments);
                    this.core.animation.animate(this, [{
                        opacity: 1
                    }].concat(a));
                    return this
                },
                fadeOut: function () {
                    var a = Array.prototype.slice.call(arguments);
                    this.core.animation.animate(this, [{
                        opacity: 0
                    }].concat(a));
                    return this
                },
                fadeTo: function () {
                    var a = Array.prototype.slice.call(arguments);
                    this.core.animation.animate(this, [{
                        opacity: a.splice(0, 1)[0]
                    }].concat(a));
                    return this
                },
                dragAndDrop: function (a) {
                    a = a === c ? {} : a;
                    if (a === !1 && this.draggable === !0) this.draggable = !1, this.unbind("mousedown touchstart", this._.drag_start), this.core.unbind("mouseup touchend", this._.drag_end), this.core.unbind("mousemove touchmove", this._.drag_move);
                    else if (!this.draggable) {
                        this.draggable = !0, this.dragging = !1;
                        var b = this,
                            d = {
                                x: 0,
                                y: 0
                            },
                            e = {
                                x: 0,
                                y: 0
                            },
                            f = {
                                x: 0,
                                y: 0
                            };
                        this._.drag_start = function (c) {
                            a.bubble === !1 && c.stopPropagation(), this.dragging = !0, d.x = c.x - this.x, d.y = c.y - this.y, e.x = this.x, e.y = this.y, f = b.core.tools.transformPointerPosition(b, b.abs_x, b.abs_y, b.rotation), a.changeZindex === !0 && (this.zIndex = "front"), typeof a.start == "function" && a.start.call(this), this.core.timeline.running || this.core.draw.redraw()
                        }, this._.drag_end = function (c) {
                            b.dragging && (a.bubble === !1 && c.stopPropagation(), b.dragging = !1, typeof a.end == "function" && a.end.call(b), b.core.timeline.running || b.core.draw.redraw())
                        }, this._.drag_move = function (c) {
                            if (b.dragging) {
                                a.bubble === !1 && c.stopPropagation();
                                var d = b.core.tools.transformPointerPosition(b, b.abs_x, b.abs_y, b.rotation);
                                b.x = e.x + d.x - f.x, b.y = e.y + d.y - f.y, typeof a.move == "function" && a.move.call(b), b.core.timeline.running || b.core.draw.redraw()
                            }
                        }, this.bind("mousedown touchstart", this._.drag_start), this.core.bind("mouseup touchend", this._.drag_end), this.core.bind("mousemove touchmove", this._.drag_move)
                    }
                    return this
                },
                setOrigin: function (a, b) {
                    this.origin.x = a, this.origin.y = b;
                    return this
                },
                getOrigin: function () {
                    var a, b, c = this.origin,
                        d = this.shapeType;
                    c.x === "center" ? a = d === "rectangular" ? this.width / 2 : 0 : c.x === "right" ? a = d === "rectangular" ? this.width : this.radius : c.x === "left" ? a = d === "rectangular" ? 0 : -this.radius : a = isNaN(parseFloat(c.x)) ? 0 : parseFloat(c.x), c.y === "center" ? b = d === "rectangular" ? this.height / 2 : 0 : c.y === "bottom" ? b = d === "rectangular" ? this.height : this.radius : c.y === "top" ? b = d === "rectangular" ? 0 : -this.radius : b = isNaN(parseFloat(c.y)) ? 0 : parseFloat(c.y);
                    return {
                        x: a,
                        y: b
                    }
                },
                addChild: function (a, b) {
                    if (a.parent === c) {
                        var d = this.children.push(a) - 1;
                        a.parent = this, a.x += 0, a.y += 0, this.core.draw.objects.push(a), this.drawn && this.core.draw.redraw();
                        if (b) return d
                    } else if (b) return !1;
                    return this
                },
                removeChild: function (a) {
                    var b = this.children.indexOf(a);~
                    b && this.removeChildAt(b);
                    return this
                },
                removeChildAt: function (a) {
                    this.children[a] !== c && this.children[a].remove();
                    return this
                },
                clone: function (a) {
                    a = a || {}, a.drawn = !1;
                    var b = this.core.display[this.type](a),
                        e = {},
                        f = ["core", "events", "children", "parent", "img", "fill", "strokeColor", "added"],
                        g, h, i, j, k, l, m, n, o;
                    g = function (a, b) {
                        for (h in a) {
                            if (~f.indexOf(h)) continue;
                            if (typeof a[h] == "object") {
                                b[h] = a[h].constructor === Array ? [] : {}, g(a[h], b[h]);
                                continue
                            }
                            o = Object.getOwnPropertyDescriptor(a, h), o && o.get === c && (b[h] = a[h])
                        }
                    }, g(this, e), e.fill = this._.fill, i = this.core.style.getStroke(this.stroke), e.strokeColor = i.color, b = d.extend(b, e, a), b.id = ++this.core.lastObjectID, typeof b.init == "function" && b.init(), k = this.children;
                    if (k.length > 0)
                        for (j = 0; j < k.length; j++) l = k[j].clone(), b.children.push(l), l.parent = b, a.x && (m = Math.abs(k[j].abs_x - this.x), l.x = m), a.y && (n = Math.abs(k[j].abs_y - this.y), l.y = n);
                    return b
                },
                isPointerInside: function (a) {
                    return this.core.tools.isPointerInside(this, a)
                }
            }
        },
        q = function (a, b, e, f) {
            var g = this,
                h = this.core,
                i = function (c, f) {
                    return d.extend({
                        core: f,
                        type: a,
                        shapeType: "rectangular",
                        draw: function () {
                            e.call(this, h.canvas, h);
                            return this
                        }
                    }, b, c)
                };
            this[a] = function (b) {
                var e = d.extend(Object.create(p()), new i(b, h));
                f !== c && typeof g[a][f] == "function" && g[a][f]();
                return e
            };
            return g
        };
    d.registerModule("displayObject", p), d.registerModule("display", {
        wrapper: !0,
        register: q
    }), d.registerDisplayObject = function (a, b, e) {
        d.registerModule("display." + a, {
            setCore: function (f) {
                return function (g) {
                    var h = d.extend(Object.create(p()), new b(g, f));
                    h.type = a, h.id = ++f.lastObjectID, f.animation.queues.create(h, "default"), e !== c && h[e]();
                    return h
                }
            }
        })
    };
    var r = function (a, b) {
        return d.extend({
            core: b,
            shapeType: "rectangular",
            draw: function () {
                var a = this.core.canvas,
                    b = this.getOrigin(),
                    c = this.abs_x - b.x,
                    d = this.abs_y - b.y;
                a.beginPath(), this.fill !== "" && (a.fillStyle = this.fill, a.fillRect(c, d, this.width, this.height)), this.strokeWidth > 0 && (a.lineWidth = this.strokeWidth, a.strokeStyle = this.strokeColor, this.strokePosition === "outside" ? a.strokeRect(c - this.strokeWidth / 2, d - this.strokeWidth / 2, this.width + this.strokeWidth, this.height + this.strokeWidth) : this.strokePosition === "center" ? a.strokeRect(c, d, this.width, this.height) : this.strokePosition === "inside" && a.strokeRect(c + this.strokeWidth / 2, d + this.strokeWidth / 2, this.width - this.strokeWidth, this.height - this.strokeWidth)), a.closePath();
                return this
            }
        }, a)
    };
    d.registerDisplayObject("rectangle", r);
    var s = function (a, b) {
        return d.extend({
            core: b,
            shapeType: "rectangular",
            loaded: !1,
            firstDrawn: !1,
            tile: !1,
            tile_width: 0,
            tile_height: 0,
            tile_spacing_x: 0,
            tile_spacing_y: 0,
            init: function () {
                var a = this,
                    b;
                this.image !== c && (b = this.image.nodeName && this.image.nodeName.toLowerCase() === "img" ? "htmlImg" : "newImg", this.img = b === "htmlImg" ? this.image.cloneNode(!1) : new Image, this.core.canvasElement.appendChild(this.img), this.img.onload = function () {
                    a.loaded = !0, a.width !== 0 ? a.height === 0 && (a.height = a.width / (this.width / this.height)) : a.width = this.width, a.height !== 0 ? a.width === 0 && (a.width = a.height / (this.height / this.width)) : a.height = this.height, a.tile_width = a.tile_width === 0 ? a.width : a.tile_width, a.tile_height = a.tile_height === 0 ? a.height : a.tile_height, a.core.canvasElement.removeChild(this), a.core.redraw()
                }, b === "newImg" && (this.img.src = this.image))
            },
            draw: function () {
                var a = this.core.canvas,
                    b = this,
                    d = this.getOrigin(),
                    e = this.abs_x - d.x,
                    f = this.abs_y - d.y,
                    g, h;
                if (this.loaded && this.core.draw.objects[this.zIndex] !== c && this.img.width > 0 && this.img.height > 0) {
                    g = this.width === 0 ? this.img.width : this.width, h = this.height === 0 ? this.img.height : this.height;
                    if (this.tile) {
                        var i = Math.ceil(g / this.tile_width),
                            j = Math.ceil(h / this.tile_height),
                            k, l;
                        a.save(), a.beginPath(), a.moveTo(e, f), a.lineTo(e + g, f), a.lineTo(e + g, f + h), a.lineTo(e, f + h), a.lineTo(e, f), a.clip();
                        for (l = 0; l < j; l++)
                            for (k = 0; k < i; k++) a.drawImage(this.img, e + k * (this.tile_width + this.tile_spacing_x), f + l * (this.tile_height + this.tile_spacing_y), this.tile_width, this.tile_height);
                        a.closePath(), a.restore()
                    } else a.drawImage(this.img, e, f, g, h);
                    this.strokeWidth > 0 && (a.lineWidth = this.strokeWidth, a.strokeStyle = this.strokeColor, a.strokeRect(e, f, g, h)), this.firstDrawn === !1 && (this.firstDrawn = !0, clearTimeout(this.loadtimer))
                } else clearTimeout(this.loadtimer), this.loadtimer = setTimeout(function () {
                    b.draw()
                }, 100);
                return this
            }
        }, a)
    };
    d.registerDisplayObject("image", s, "init");
    var t = function (a, c) {
        var e = function (a, b, c, d, e) {
            var f = e.style.getFont(a.font);
            f[b] = c, a._.font = e.style.getFont(f, "string"), d === "lineHeight" ? (a._.lineHeight = isNaN(parseInt(c, 10)) ? 1 : parseInt(c, 10), a._.lineHeightUnit = typeof c == "string" ? c.indexOf("px") > -1 ? "px" : "relative" : "relative") : a._[d] = c
        };
        return d.extend({
            core: c,
            shapeType: "rectangular",
            align: "start",
            baseline: "top",
            _: d.extend({}, c.displayObject._, {
                font: "normal normal normal 16px/1 sans-serif",
                style: "normal",
                variant: "normal",
                weight: "normal",
                size: 16,
                lineHeight: 1,
                family: "sans-serif",
                text: "",
                width: 0,
                height: 0,
                lines: []
            }),
            set font(a) {
                typeof a != "string" && (a = this.core.style.getFont(a, "string"));
                var b = this.core.style.getFont(a);
                a = this.core.style.getFont(b, "string"), this._.style = b.style, this._.variant = b.variant, this._.weight = b.weight, this._.size = b.size, this._.lineHeight = b.lineHeight, this._.lineHeightUnit = b.lineHeightUnit, this._.family = b.family, this._.font = a, this.initWebFont(), this.setDimensions()
            },
            set style(a) {
                e(this, "style", a, "style", this.core), this.initWebFont(), this.setDimensions()
            },
            set variant(a) {
                e(this, "variant", a, "variant", this.core), this.initWebFont(), this.setDimensions()
            },
            set weight(a) {
                e(this, "weight", a, "weight", this.core), this.initWebFont(), this.setDimensions()
            },
            set size(a) {
                e(this, "size", a, "size", this.core), this.setDimensions()
            },
            set lineHeight(a) {
                e(this, "lineHeight", a, "lineHeight", this.core), this.setDimensions()
            },
            set family(a) {
                e(this, "family", a, "family", this.core), this.initWebFont(), this.setDimensions()
            },
            set text(a) {
                this._.text = a, this.setDimensions()
            },
            set width(a) {
                return
            },
            set height(a) {
                return
            },
            get font() {
                return this._.font
            },
            get style() {
                return this._.style
            },
            get variant() {
                return this._.variant
            },
            get weight() {
                return this._.weight
            },
            get size() {
                return this._.size
            },
            get lineHeight() {
                return this._.lineHeight + (this._.lineHeightUnit === "px" ? "px" : 0)
            },
            get family() {
                return this._.family
            },
            get text() {
                return this._.text
            },
            get width() {
                return this._.width
            },
            get height() {
                return this._.height
            },
            init: function () {
                this._.initialized = !0, this.initWebFont(), this.setDimensions()
            },
            setDimensions: function () {
                if (this._.initialized) {
                    var a, b, c, d, e, f, g, h, i;
                    a = this.core.canvas, a.fillStyle = this.fill, a.font = this.font, b = (this.text + "").split("\n"), c = b.length, e = 0, f = 0, i = [];
                    for (g = 0; g < c; g++) h = a.measureText(b[g]), e = h.width > e ? h.width : e, this._.lineHeightUnit === "px" ? d = this._.lineHeight : d = this.size * this._.lineHeight, f += d, i.push({
                        text: b[g],
                        width: h.width,
                        height: d
                    });
                    this._.width = e, this._.height = f, this._.lines = i
                }
            },
            initWebFont: function () {
                var a = this.core,
                    c;
                c = b.createElement("span"), c.style.font = this.style + " " + this.variant + " " + this.weight + " 0px " + this.family, b.body.appendChild(c), setTimeout(function () {
                    b.body.removeChild(c), a.redraw()
                }, 1e3)
            },
            getAlignOffset: function () {
                var a = {
                    start: this.core.canvasElement.dir === "rtl" ? -this.width : 0,
                    end: this.core.canvasElement.dir === "rtl" ? 0 : -this.width,
                    left: 0,
                    center: -this.width / 2,
                    right: -this.width
                };
                return a[this.align] || 0
            },
            getBaselineOffset: function () {
                var a = {
                    top: this.size * .82,
                    hanging: this.size * .65,
                    middle: this.size * .31,
                    alphabetic: 0,
                    ideographic: this.size * -0.05,
                    bottom: this.size * -0.22
                };
                return a[this.baseline] || 0
            },
            draw: function () {
                var a, b, c, d, e, f, g, h, i, j, k;
                a = this.core.canvas, b = this._.lines, c = this.getAlignOffset(), d = this.getBaselineOffset(), e = this._.lineHeightUnit === "px" ? this._.lineHeight / this.size : this._.lineHeight, f = this.baseline !== "top" ? this.size * (e - 1) / 2 : 0, g = this.getOrigin(), h = this.abs_x - g.x - c, i = this.abs_y - g.y + d - f, a.beginPath(), a.font = this.font, a.textAlign = this.align, a.textBaseline = "alphabetic";
                if (this.strokeWidth > 0) {
                    a.lineWidth = this.strokeWidth, a.strokeStyle = this.strokeColor;
                    for (j = 0, k = b.length; j < k; j++) a.strokeText(b[j].text, h, i + j * b[j].height + (b[j].height - this.size) / 2)
                }
                if (this.fill !== "") {
                    a.fillStyle = this.fill;
                    for (j = 0, k = b.length; j < k; j++) a.fillText(b[j].text, h, i + j * b[j].height + (b[j].height - this.size) / 2)
                }
                a.closePath();
                return this
            }
        }, a)
    };
    d.registerDisplayObject("text", t, "init");
    var u = function (a, b) {
        return d.extend({
            core: b,
            shapeType: "radial",
            radius: 0,
            start: 0,
            end: 0,
            direction: "clockwise",
            pieSection: !1,
            draw: function () {
                var a = this.core.canvas,
                    b = this.getOrigin(),
                    c = this.abs_x - b.x,
                    d = this.abs_y - b.y;
                this.radius > 0 && this.start !== this.end && (a.beginPath(), this.pieSection && a.moveTo(c, d), a.arc(c, d, this.radius, this.start * Math.PI / 180, this.end * Math.PI / 180, this.direction === "anticlockwise"), this.fill !== "" && (a.fillStyle = this.fill, a.fill()), this.strokeWidth > 0 && (a.lineWidth = this.strokeWidth, a.strokeStyle = this.strokeColor, a.stroke()), a.closePath());
                return this
            }
        }, a)
    };
    d.registerDisplayObject("arc", u);
    var v = function (a, b) {
        return d.extend({
            core: b,
            shapeType: "radial",
            _: d.extend({}, b.displayObject._, {
                radius_x: 0,
                radius_y: 0
            }),
            set radius(a) {
                this._.radius_x = a, this._.radius_y = a
            },
            set radius_x(a) {
                this._.radius_x = a
            },
            set radius_y(a) {
                this._.radius_y = a
            },
            get radius() {
                return this._.radius_x
            },
            get radius_x() {
                return this._.radius_x
            },
            get radius_y() {
                return this._.radius_y
            },
            draw: function () {
                var a = this.core.canvas,
                    b = this.getOrigin(),
                    c = this.abs_x - b.x,
                    d = this.abs_y - b.y;
                a.beginPath();
                if (this.radius_x === this.radius_y) a.arc(c, d, this.radius_x, 0, Math.PI * 2, !1);
                else {
                    var e = .276142374915397,
                        f = {
                            x: this.radius_x * 2 * e,
                            y: this.radius_y * 2 * e
                        };
                    a.moveTo(c - this.radius_x, d), a.bezierCurveTo(c - this.radius_x, d - f.y, c - f.x, d - this.radius_y, c, d - this.radius_y), a.bezierCurveTo(c + f.x, d - this.radius_y, c + this.radius_x, d - f.y, c + this.radius_x, d), a.bezierCurveTo(c + this.radius_x, d + f.y, c + f.x, d + this.radius_y, c, d + this.radius_y), a.bezierCurveTo(c - f.x, d + this.radius_y, c - this.radius_x, d + f.y, c - this.radius_x, d)
                }
                this.fill !== "" && (a.fillStyle = this.fill, a.fill()), this.strokeWidth > 0 && (a.lineWidth = this.strokeWidth, a.strokeStyle = this.strokeColor, a.stroke()), a.closePath();
                return this
            }
        }, a)
    };
    d.registerDisplayObject("ellipse", v);
    var w = function (a, b) {
        return d.extend({
            core: b,
            shapeType: "radial",
            sides: 3,
            _: d.extend({}, b.displayObject._, {
                radius: 0,
                side: 0
            }),
            set radius(a) {
                this._.radius = a, this._.side = 2 * this._.radius * Math.sin(Math.PI / this.sides)
            },
            set side(a) {
                this._.side = a, this._.radius = this._.side / 2 / Math.sin(Math.PI / this.sides)
            },
            get radius() {
                return this._.radius
            },
            get side() {
                return this._.side
            },
            draw: function () {
                var a = this.core.canvas,
                    b = this.getOrigin(),
                    c = this.abs_x - b.x,
                    d = this.abs_y - b.y,
                    e = {
                        x: 0,
                        y: 0
                    },
                    f = this.sides,
                    g = this.radius,
                    h, i, j;
                a.beginPath();
                for (j = 0; j <= f; j++) h = c + g * Math.cos(j * 2 * Math.PI / f), i = d + g * Math.sin(j * 2 * Math.PI / f), j === 0 ? (a.moveTo(h, i), e = {
                    x: h,
                    y: i
                }) : j == f ? a.lineTo(e.x, e.y) : a.lineTo(h, i);
                a.closePath(), this.fill !== "" && (a.fillStyle = this.fill, a.fill()), this.strokeWidth > 0 && (a.lineWidth = this.strokeWidth, a.strokeStyle = this.strokeColor, a.stroke());
                return this
            }
        }, a)
    };
    d.registerDisplayObject("polygon", w);
    var x = function (a, b) {
        return d.extend({
            core: b,
            shapeType: "radial",
            _: d.extend({}, b.displayObject._, {
                start_x: 0,
                start_y: 0,
                end_x: 0,
                end_y: 0,
                x: 0,
                y: 0,
                abs_x: 0,
                abs_y: 0
            }),
            children: [],
            set start(a) {
                this._.start_x = a.x + (this.parent && !this.parent.isCore ? this.parent._.abs_x : 0), this._.start_y = a.y + (this.parent && !this.parent.isCore ? this.parent._.abs_y : 0), this.setPosition()
            },
            set end(a) {
                this._.end_x = a.x + (this.parent && !this.parent.isCore ? this.parent._.abs_x : 0), this._.end_y = a.y + (this.parent && !this.parent.isCore ? this.parent._.abs_y : 0), this.setPosition()
            },
            get start() {
                var a = {
                    x: 0,
                    y: 0
                };
                this.parent && !this.parent.isCore && (a.x = this.parent._.abs_x, a.y = this.parent._.abs_y);
                var b = this;
                return {
                    get x() {
                        return b._.start_x - a.x
                    }, get y() {
                        return b._.start_y - a.y
                    }, set x(a) {
                        b._.start_x = a + (b.parent && !b.parent.isCore ? b.parent._.abs_x : 0), b.setPosition()
                    }, set y(a) {
                        b._.start_y = a + (b.parent && !b.parent.isCore ? b.parent._.abs_y : 0), b.setPosition()
                    }
                }
            },
            get end() {
                var a = {
                    x: 0,
                    y: 0
                };
                this.parent && !this.parent.isCore && (a.x = this.parent._.abs_x, a.y = this.parent._.abs_y);
                var b = this;
                return {
                    get x() {
                        return b._.end_x - a.x
                    }, get y() {
                        return b._.end_y - a.y
                    }, set x(a) {
                        b._.end_x = a + (b.parent && !b.parent.isCore ? b.parent._.abs_x : 0), b.setPosition()
                    }, set y(a) {
                        b._.end_y = a + (b.parent && !b.parent.isCore ? b.parent._.abs_y : 0), b.setPosition()
                    }
                }
            },
            set x(a) {
                var b, c, d, e, f;
                b = this._.end_x - this._.start_x, c = this.parent && !this.parent.isCore ? this.parent._.abs_x : 0, this._.x = a, this._.abs_x = a + c, this._.start_x = a - b / 2 + c, this._.end_x = a + b / 2 + c, d = this.children, e = d.length;
                for (f = 0; f < e; f++) d[f]._.abs_x = this.abs_x + d[f].x, d[f].x += 0
            },
            set y(a) {
                var b, c, d, e, f;
                b = this._.end_y - this._.start_y, c = this.parent && !this.parent.isCore ? this.parent._.abs_y : 0, this._.y = a, this._.abs_y = a + c, this._.start_y = a - b / 2 + c, this._.end_y = a + b / 2 + c, d = this.children, e = d.length;
                for (f = 0; f < e; f++) d[f]._.abs_y = this.abs_y - d[f].y, d[f].y += 0
            },
            get x() {
                return this._.x
            },
            get y() {
                return this._.y
            },
            set length(a) {
                var b, c, d, e;
                b = Math.abs(this._.end_x - this._.start_x), c = Math.abs(this._.end_y - this._.start_y), d = Math.sqrt(b * b + c * c), e = Math.asin(b / d), b = Math.sin(e) * a, c = Math.cos(e) * a, this._.end_x = this._.start_x + b, this._.end_y = this._.start_y + c, this.setPosition()
            },
            get length() {
                var a, b, c;
                a = Math.abs(this._.end_x - this._.start_x), b = Math.abs(this._.end_y - this._.start_y), c = Math.sqrt(a * a + b * b);
                return c
            },
            set radius(a) {
                this.length = a * 2
            },
            get radius() {
                return this.length / 2
            },
            setPosition: function () {
                var a = {
                    x: 0,
                    y: 0
                };
                this.parent && !this.parent.isCore && (a.x = this.parent._.abs_x, a.y = this.parent._.abs_y), this.x = this._.start_x - a.x + (this._.end_x - this._.start_x) / 2, this.y = this._.start_y - a.y + (this._.end_y - this._.start_y) / 2
            },
            init: function () {
                this.initialized = !0, this.setPosition()
            },
            draw: function () {
                var a = this.core.canvas,
                    b = this.getOrigin(),
                    c = this.core.draw.translation;
                a.lineWidth = this.strokeWidth, a.strokeStyle = this.strokeColor, a.beginPath(), a.moveTo(this._.start_x - c.x - b.x, this._.start_y - c.y - b.y), a.lineTo(this._.end_x - c.x - b.x, this._.end_y - c.y - b.y), a.stroke(), a.closePath();
                return this
            }
        }, a)
    };
    d.registerDisplayObject("line", x, "init");
    var y = function (a, b) {
        return d.extend({
            core: b,
            shapeType: "rectangular",
            loaded: !1,
            firstDrawn: !1,
            frames: [],
            duration: 0,
            frame: 1,
            generate: !1,
            numFrames: 0,
            offset_x: 0,
            offset_y: 0,
            direction: "x",
            running: !1,
            active: !1,
            loop: !0,
            _: d.extend({}, b.displayObject._, {
                autostart: !1
            }),
            set autostart(a) {
                this.active = a, this._.autostart = a
            },
            get autostart() {
                return this._.autostart
            },
            init: function () {
                if (this.image !== c) {
                    var a = this,
                        b = this.image.nodeName && this.image.nodeName.toLowerCase() === "img" ? "htmlImg" : "newImg";
                    this.img = b === "htmlImg" ? this.image.cloneNode(!1) : new Image, this.core.canvasElement.appendChild(this.img), this.img.onload = function () {
                        a.full_width = this.width, a.full_height = this.height;
                        if (a.generate) {
                            var b, c, d, e, f;
                            b = a.direction, c = b === "y" ? a.full_height : a.full_width, d = b === "y" ? a.height : a.width, a.numFrames > 0 ? e = a.numFrames : (e = c / d, a.numFrames = e), a.frames = [];
                            for (f = 0; f < e; f++) a.frames.push({
                                x: a.offset_x + f * (b === "x" ? a.width : 0),
                                y: a.offset_y + f * (b === "y" ? a.height : 0),
                                d: a.duration
                            })
                        }
                        a.core.canvasElement.removeChild(this), a.loaded = !0, a.core.redraw()
                    }, b === "newImg" && (this.img.src = this.image)
                }
            },
            draw: function () {
                var a = this,
                    b = this.core.canvas,
                    d = this.getOrigin(),
                    e = this.abs_x - d.x,
                    f = this.abs_y - d.y,
                    g;
                if (this.loaded) {
                    if (this.frames.length > 0) {
                        if (this.frame > this.frames.length) return this;
                        g = this.frames[this.frame - 1], frame_width = g.w !== c ? g.w : this.width, frame_height = g.h !== c ? g.h : this.height, b.drawImage(this.img, g.x, g.y, frame_width, frame_height, e, f, frame_width, frame_height), this.strokeWidth > 0 && (b.lineWidth = this.strokeWidth, b.strokeStyle = this.strokeColor, b.strokeRect(e, f, frame_width, frame_height)), this.running === !1 && this.active && (setTimeout(function () {
                            a.loop ? a.frame = a.frame === a.frames.length ? 1 : a.frame + 1 : a.frame = a.frame === a.frames.length ? a.frame : a.frame + 1, a.running = !1, a.core.timeline.running || a.core.draw.redraw()
                        }, g.d), this.running = !0)
                    }
                    this.firstDrawn === !1 && (this.firstDrawn = !0, clearTimeout(this.loadtimer))
                } else clearTimeout(this.loadtimer), this.loadtimer = setTimeout(function () {
                    a.draw()
                }, 100);
                return this
            },
            start: function () {
                this.startAnimation();
                return this
            },
            startAnimation: function () {
                this.active = !0, this.core.redraw();
                return this
            },
            stopAnimation: function () {
                this.active = !1;
                return this
            }
        }, a)
    };
    d.registerDisplayObject("sprite", y, "init")
})(window, document),
function () {
    "use strict";
    var a = Object.prototype,
        b = a.__defineGetter__,
        c = a.__defineSetter__,
        d = a.__lookupGetter__,
        e = a.__lookupSetter__,
        f = a.hasOwnProperty;
    b && c && d && e && (Object.defineProperty || (Object.defineProperty = function (a, g, h) {
        if (arguments.length < 3) throw new TypeError("Arguments not optional");
        g += "";
        if (f.call(h, "value")) {
            !d.call(a, g) && !e.call(a, g) && (a[g] = h.value);
            if (f.call(h, "get") || f.call(h, "set")) throw new TypeError("Cannot specify an accessor and a value")
        }
        h.get && b.call(a, g, h.get), h.set && c.call(a, g, h.set);
        return a
    }), Object.getOwnPropertyDescriptor || (Object.getOwnPropertyDescriptor = function (a, b) {
        if (arguments.length < 2) throw new TypeError("Arguments not optional.");
        b += "";
        var c = {
                configurable: !0,
                enumerable: !0,
                writable: !0
            },
            g = d.call(a, b),
            h = e.call(a, b);
        if (!f.call(a, b)) return c;
        if (!g && !h) {
            c.value = a[b];
            return c
        }
        delete c.writable, c.get = c.set = undefined, g && (c.get = g), h && (c.set = h);
        return c
    }), Object.defineProperties || (Object.defineProperties = function (a, b) {
        for (var c in b) f.call(b, c) && Object.defineProperty(a, c, b[c])
    }))
}()