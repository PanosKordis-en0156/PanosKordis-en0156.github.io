(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a)
                    return a(o, !0);
                if (i)
                    return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND",
                f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++)
        s(r[o]);
    return s
}
)({
    1: [function(require, module, exports) {
        module.exports = {
            "banner_message_html": null,
            "debug": false,
            "enable_autosplit": true,
            "enable_feedback": true,
            "enable_publishing": true,
            "enable_page_publishing": true,
            "report_errors": true,
            "js_main": "dfe76eace8972.js",
            "js_asw_main": "aswfe76eace8972.js",
            "css_main": "dfe76eace8972.css"
        }

    }
    , {}]
    ,
    2: [function(require, module, exports) {

    }],
    3: [function(require, module, exports) {
        module.exports = {
            INIT: "init-app",
            EDITOR_DIRTY: "editor-dirty",
            OPEN_SAVED: "open-saved",
            OPEN_SAVED_FAIL: "open-saved-fail",
            SAVE: "save",
            SAVE_ERROR: "save-error",
            SHARE_LINK_OPEN: "share-link-open",
            SHARE_TEXT_OPEN: "share-text-open",
            SHARE_IMAGE_OPEN: "share-image-open",
            SHARE_IMAGE_DOWNLOAD: "share-image-download",
            SHARE_IMAGE_COPY: "share-image-copy",
            SIDEBAR_OPEN: "sidebar-open",
            FEEDBACK_OPEN: "feedback-open",
            FEEDBACK_SEND: "feedback-send",
            AUTOSPLIT: "autosplit"
        };

    }
    , {}],
    4: [function(require, module, exports) {
        const sortingPaths = [
            "type",
            "ids[0].guid"
        ];

        function hasComplexPath(pathToMatch, sourcePath) {
            try {
                var matches = eval('sourcePath.' + pathToMatch) !== undefined;
                return matches;
            } catch (e) {
                return false;
            }
        }

        function sortObject(o) {
            if (_.isArray(o)) {
                var deepSortedArray = [];
                var sortByPath = null;
                var hasObjects = false;
                for (var i = 0; i < o.length; i++) {
                    hasObjects |= _.isObject(o[i]);
                    deepSortedArray[i] = _.isObject(o[i]) ? sortObject(o[i]).value : o[i];
                    for (var sp of sortingPaths) {
                        if (i === 0 && hasComplexPath(sp, deepSortedArray[i])) {
                            sortByPath = sp;
                            break;
                        }
                    }
                }
                if (!hasObjects) {
                    deepSortedArray.sort();
                }
                return {
                    value: deepSortedArray,
                    path: sortByPath
                };
            } else {
                var so = {};
                _.forEach(Object.keys(o).sort(), function (key) {
                    var oVal = o[key];
                    if (_.isArray(oVal) || _.isObject(oVal)) {
                        var sortingResult = sortObject(oVal);
                        if (_.isArray(sortingResult.value) && !_.isNull(sortingResult.path)) {
                            oVal = _.sortBy(sortingResult.value, function (o) {
                                try {
                                    var oPathVal = eval("o." + sortingResult.path);
                                    return oPathVal;
                                } catch (e) {
                                    return null;
                                }
                            });
                        } else {
                            oVal = sortingResult.value;
                        }
                    }
                    so[key] = oVal;
                });
                return {
                    value: so
                };
            }
        }

        JsonSorter = function() {},
        JsonSorter.prototype.sort = function(t) {
            try {
                var parsedJson = JSON.parse(t);
                parsedJson = sortObject(parsedJson).value;
                return JSON.stringify(parsedJson, null, 2);
            } catch (e) {
                console.error(e);
                return t;
            }
        }
        ,
        module.exports = JsonSorter;
    }
    , {}],
    5: [function(require, module, exports) {
        var domready = require("domready")
          , $ = require("jquery")
          , DiffEditor = require("./diffeditor")
          , Flags = require("./flags")
          , FeedbackWidget = require("./feedbackwidget")
          , Platform = require("./platform")
          , ShareLinkWidget = require("./sharelinkwidget")
          , ShareTextWidget = require("./sharetextwidget")
          , ShareImageWidget = require("./shareimagewidget")
          , SidebarWidget = require("./sidebarwidget")
          , ErrorHandler = require("./errorhandler")
          , Mousetrap = require("mousetrap");
        window.jQuery = window.$ = $,
        App = function() {
            Flags.updateFromUrl(),
            this.errorHandler = new ErrorHandler(),
            this.sidebarWidget = new SidebarWidget(),
            this.diffEditor = new DiffEditor($(".editor-container")[0]),
            this.feedbackWidget = new FeedbackWidget(this.diffEditor),
            this.shareLinkWidget = new ShareLinkWidget(this.diffEditor),
            this.shareTextWidget = new ShareTextWidget(this.diffEditor),
            this.shareImageWidget = new ShareImageWidget(this.diffEditor),
            this.loadedAt = Date.now(),
            this.mousetrap = new Mousetrap(document.body),
            this.mousetrap.bind("esc", $.proxy(function() {
                this.diffEditor.swapFocus()
            }, this)).bind(Platform.CMD_CNTRL_KEY + "+enter", $.proxy(function() {
                this.diffEditor.keyboardAutosplit()
            }, this)),
            window.onpopstate = $.proxy(this.handlePopState, this);
            var e = $("#saved-data")
              , t = e.data("document");
            if (e.remove(),
            this.diffEditor.setContent(t.v1, t.v2),
            t.docModel) {
                var i = t.docModel;
                this.shareLinkWidget.setContent(i.title, i.description, i.titleV1, i.titleV2)
            }
            t.isDefault && this.diffEditor.setClearOnFocus()
        }
        ,
        App.prototype.handlePopState = function(e) {
            this.loadedAt + 100 < Date.now() && window.location.reload(!0)
        }
        ,
        domready(function() {
            new App
        });

    }
    , {
        "./diffeditor": 8,
        "./errorhandler": 11,
        "./feedbackwidget": 13,
        "./flags": 14,
        "./platform": 32,
        "./shareimagewidget": 34,
        "./sharelinkwidget": 36,
        "./sharetextwidget": 38,
        "./sidebarwidget": 39,
        "domready": 24,
        "jquery": 27,
        "mousetrap": 28
    }],
    6: [function(require, module, exports) {
        var $ = require("jquery")
          , Flags = require("./flags");
        AutosplitController = function(o) {
            this.callback = o,
            this.worker = null
        }
        ,
        AutosplitController.prototype.startAutosplit = function(o) {
        }
        ,
        AutosplitController.prototype.handleWorkerMessage = function(o) {
            this.callback(o.data)
        }
        ,
        module.exports = AutosplitController;

    }
    , {
        "./flags": 14,
        "jquery": 27
    }],
    7: [function(require, module, exports) {
        var JsonSorter = require("jsonSorter")
          , inherits = require("./inherits")
          , EventEmitter = require("eventemitter-browser")
          , Flags = require("./flags")
          , CodeMirror = require("codemirror")
          , Platform = require("./platform")
          , $ = require("jquery");
        function EditorManager(t, e) {
            EventEmitter.call(this),
            this.jsonSorter = new JsonSorter();
            this.containerEl = t,
            this.editor0 = this.createCodemirror(t, !0),
            this.editor1 = this.createCodemirror(t, !1),
            this.paddingModel = null,
            this.sizingEls = document.getElementsByClassName("CodeMirror-sizer"),
            this.clearEditorsOnFocus = [],
            this.scrollDriver = null
        }
        inherits(EditorManager, EventEmitter),
        EditorManager.prototype.createCodemirror = function(t, e) {
            var i = document.createElement("div");
            i.className = "editor",
            t.appendChild(i);
            var r = new CodeMirror(i,{
                lineNumbers: !0,
                lineWrapping: !0,
                extraKeys: {
                    Enter: function(t) {
                        t.replaceSelection("\n", "end")
                    }
                }
            });
            return r.setSize("100%", "100%"),
            r.on("scroll", $.proxy(this.handleScroll, this)),
            r.on("change", $.proxy(this.handleChange, this)),
            r.on("focus", $.proxy(this.handleFocus, this)),
            r
        }
        ,
        EditorManager.prototype.setContent = function(t, e) {
            this.editor0.getDoc().setValue(t),
            this.editor1.getDoc().setValue(e)
        }
        ,
        EditorManager.prototype.getOtherEditor = function(t) {
            return t == this.editor0 ? this.editor1 : this.editor0
        }
        ,
        EditorManager.prototype.swapFocus = function() {
            var t = document.activeElement;
            t && $.contains(this.containerEl, t) && this.editor0.hasFocus() ? this.editor1.focus() : this.editor0.focus()
        }
        ,
        EditorManager.prototype.handleScroll = function(t) {
            if (!this.scrollDriver || this.scrollDriver == t) {
                this.scrollDriver = t,
                window.setTimeout($.proxy(function() {
                    this.scrollDriver = null
                }, this), 200);
                var e = t.getScrollInfo();
                this.getOtherEditor(t).scrollIntoView({
                    left: 0,
                    right: 0,
                    top: e.top,
                    bottom: e.height
                })
            }
        }
        ,
        EditorManager.prototype.handleChange = function(t, e) {
            var textInEditor = t.getValue();
            var i = !1;
            if (Flags.ENABLE_AUTOSPLIT) {
                var r = this.getOtherEditor(t)
                  , o = "" == r.getValue() || $.inArray(r, this.clearEditorsOnFocus) >= 0
                  , n = "paste" == e.origin
                  , a = 0 == e.from.line && 0 == e.from.ch && 0 == e.to.line && 0 == e.to.ch;
                if (n === true) {
                    t.setValue(this.jsonSorter.sort(textInEditor));
                }
                i = o && n && a
            }
            this.emit("change", {
                autosplit: i ? t.getValue() : null
            })
        }
        ,
        EditorManager.prototype.setClearOnFocus = function() {
            this.clearEditorsOnFocus = [this.editor0, this.editor1]
        }
        ,
        EditorManager.prototype.handleFocus = function(t) {
            $.inArray(t, this.clearEditorsOnFocus) >= 0 && (t.setValue(""),
            this.clearEditorsOnFocus = this.clearEditorsOnFocus.filter(function(e) {
                return e != t
            }))
        }
        ,
        EditorManager.prototype.getEditor = function(t) {
            return t ? this.editor1 : this.editor0
        }
        ,
        EditorManager.prototype.showSplit = function(t) {
            var e = document.createElement("div");
            e.className = "split-bookmark",
            e.textContent = "✂️",
            e.ariaLabel = "Split here (" + Platform.CMD_CNTRL_KEY_NAME + "+Enter)";
            var i = this.editor0.posFromIndex(t);
            this.editor0.setBookmark(i, {
                widget: e,
                handleMouseEvents: !1
            }),
            e.onclick = $.proxy(this.doSplit, this, t)
        }
        ,
        EditorManager.prototype.doSplit = function(t) {
            var e = this.editor0.posFromIndex(0)
              , i = this.editor0.posFromIndex(t)
              , r = this.editor0.posFromIndex(this.editor0.getValue().length);
            this.setContent(this.editor0.getRange(e, i), this.editor0.getRange(i, r)),
            this.clearEditorsOnFocus = []
        }
        ,
        EditorManager.prototype.clearMarkers = function() {
            for (var t = 0; t < 2; t++)
                for (var e = this.getEditor(t), i = 0; i < e.lineCount(); i++) {
                    e.removeLineClass(i, "background");
                    for (var r = e.getLineHandle(i).markedSpans, o = 0; r && o < r.length; o++)
                        r[o].marker.clear()
                }
        }
        ,
        EditorManager.prototype.setPaddingModel = function(t) {
            this.paddingModel = t;
            var e = this.sizingEls[0].offsetWidth
              , i = this.sizingEls[1].offsetWidth;
            this.remeasureWidgets(),
            e == this.sizingEls[0].offsetWidth && i == this.sizingEls[1].offsetWidth || this.remeasureWidgets()
        }
        ,
        EditorManager.prototype.remeasureWidgets = function() {
            for (var t = 0; t < 2; t++) {
                var e = this.getEditor(t)
                  , i = this.getOtherEditor(e)
                  , r = this.paddingModel.getPm(t);
                this.renderWidget(e, i, 0, !0, r[-1]);
                for (var o = 0; o < e.lineCount(); o++)
                    this.renderWidget(e, i, o, !1, r[o])
            }
        }
        ,
        EditorManager.prototype.renderWidget = function(t, e, i, r, o) {
            for (var n = t.getLineHandle(i).widgets, a = null, s = 0; n && s < n.length; s++)
                n[s].above == r && (a = n[s]),
                n[s].above && 0 != i && n[s].clear();
            var d = this.measure(o, t, e);
            if (!a && d > 0) {
                var l = document.createElement("div");
                l.className = "padding",
                a = t.addLineWidget(o.lineIndex, l, {
                    above: r,
                    handleMouseEvents: !0
                })
            }
            a && (a.node.style.height = d + "px",
            a.changed())
        }
        ,
        EditorManager.prototype.measure = function(t, e, i) {
            var r = 0;
            if (!t)
                return r;
            null != t.matchingLine && (r += Math.max(0, this.getLineHeight(i, t.matchingLine) - this.getLineHeight(e, t.lineIndex)));
            for (var o = 0; o < t.nullLines.length; o++)
                r += this.getLineHeight(i, t.nullLines[o]);
            return r
        }
        ,
        EditorManager.prototype.getLineHeight = function(t, e) {
            for (var i = t.getLineHandle(e), r = 0, o = 0; i.widgets && o < i.widgets.length; o++)
                r += i.widgets[o].height;
            return i.height - r
        }
        ,
        EditorManager.prototype.highlightLine = function(t, e) {
            var i = t ? "added-line" : "deleted-line";
            this.getEditor(t).addLineClass(e, "background", i)
        }
        ,
        EditorManager.prototype.showLineDiff = function(t, e, i) {
            var r = this.getEditor(t)
              , o = t ? "added" : "deleted";
            i.arr.forEach(function(t) {
                r.markText({
                    line: e,
                    ch: t.start
                }, {
                    line: e,
                    ch: t.end
                }, {
                    className: o
                })
            }, this)
        }
        ,
        EditorManager.prototype.getLine = function(t, e) {
            return this.getEditor(t).getLine(e)
        }
        ,
        EditorManager.prototype.getLines = function(t) {
            return this.getEditor(t).getValue().split("\n")
        }
        ,
        module.exports = EditorManager;

    }
    , {
        "jsonSorter": 4,
        "./flags": 14,
        "./inherits": 19,
        "./platform": 32,
        "codemirror": 23,
        "eventemitter-browser": 25,
        "jquery": 27
    }],
    8: [function(require, module, exports) {
        var AutosplitController = require("./autosplitcontroller")
          , CodeMirrorManager = require("./codemirrormanager")
          , DiffModel = require("./diffmodel")
          , PaddingModel = require("./paddingmodel")
          , $ = require("jquery")
          , AS_READY = 0
          , AS_WAITING = 1
          , AS_PRESENT = 2
          , AS_STALE = 3;
        DiffEditor = function(t, e) {
            this.el = t,
            this.editorManager = new CodeMirrorManager(t,e),
            this.changeCount = 0,
            this.editorManager.on("change", $.proxy(this.handleChange, this)),
            this.linesDiffModel = null,
            this.autosplitController = new AutosplitController($.proxy(this.handleAutosplitResult, this)),
            this.autosplitState = AS_READY,
            this.autosplitResult = null
        }
        ,
        DiffEditor.prototype.getElement = function() {
            return this.el
        }
        ,
        DiffEditor.prototype.setContent = function(t, e) {
            this.editorManager.setContent(t, e)
        }
        ,
        DiffEditor.prototype.getContent = function() {
            return {
                x: this.editorManager.getEditor(0).getValue(),
                y: this.editorManager.getEditor(1).getValue()
            }
        }
        ,
        DiffEditor.prototype.getDiffModel = function() {
            return this.linesDiffModel
        }
        ,
        DiffEditor.prototype.handleChange = function(t) {
            this.changeCount++,
            this.editorManager.clearMarkers(),
            -1 == window.location.search.indexOf("newalgorithm=true") ? this.linesDiffModel = DiffModel.fromClrs(this.editorManager.getLines(0), this.editorManager.getLines(1)) : this.linesDiffModel = DiffModel.fromAstar(this.editorManager.getLines(0), this.editorManager.getLines(1)),
            this.editorManager.setPaddingModel(new PaddingModel(this.linesDiffModel)),
            this.linesDiffModel.forEachLine(function(t, e, i, o, r, n, a) {
                null == t ? this.editorManager.highlightLine(1, e) : null == e ? this.editorManager.highlightLine(0, t) : r || (this.editorManager.highlightLine(0, t),
                this.editorManager.highlightLine(1, e),
                this.editorManager.showLineDiff(0, t, n),
                this.editorManager.showLineDiff(1, e, a))
            }, this),
            t.autosplit ? (this.autosplitController.startAutosplit(t.autosplit),
            this.autosplitState = AS_WAITING) : this.autosplitState = this.autosplitState == AS_READY ? AS_READY : AS_STALE
        }
        ,
        DiffEditor.prototype.handleAutosplitResult = function(t) {
            this.autosplitState == AS_WAITING && null != t && (this.editorManager.showSplit(t),
            this.autosplitState = AS_PRESENT,
            this.autosplitResult = t)
        }
        ,
        DiffEditor.prototype.setClearOnFocus = function() {
            this.editorManager.setClearOnFocus()
        }
        ,
        DiffEditor.prototype.swapFocus = function() {
            this.editorManager.swapFocus()
        }
        ,
        DiffEditor.prototype.keyboardAutosplit = function() {
            this.autosplitState == AS_PRESENT && this.editorManager.doSplit(this.autosplitResult)
        }
        ,
        module.exports = DiffEditor;

    }
    , {
        "./autosplitcontroller": 6,
        "./codemirrormanager": 7,
        "./diffmodel": 10,
        "./paddingmodel": 31,
        "jquery": 27
    }],
    9: [function(require, module, exports) {
        var escapeHtml = require("./htmlescape")
          , IndexedSubsequence = require("./indexedsubsequence")
          , Css = {
            TABLE: "ddnh-diff-table",
            HEADER: "ddnh-diff-table-header",
            LINE_HEADER: "ddnh-line-header",
            LINE_CONTENT: "ddnh-line-content",
            PADDING: "ddnh-padding",
            ADDED: "ddnh-added",
            ADDED_LINE: "ddnh-added-line",
            DELETED: "ddnh-deleted",
            DELETED_LINE: "ddnh-deleted-line"
        };
        function diffModelToHtml(e) {
            return diffJsonToHtml(e.toJson(), null, null)
        }
        function diffJsonToHtml(e, s, t) {
            var n = '<table class="' + Css.TABLE + ' table-responsive">';
            return (s || t) && (n += "<thead><tr>" + makeEl("th", Css.HEADER + " " + Css.LINE_CONTENT, 'colspan="2"', escapeHtml(s)) + makeEl("th", Css.HEADER + " " + Css.LINE_CONTENT, 'colspan="2"', escapeHtml(t)) + "</tr></thead>"),
            n += "<tbody>",
            e.lines.forEach(function(e) {
                var s = e.xIdx
                  , t = e.yIdx
                  , d = e.x
                  , l = e.y
                  , E = e.eq
                  , a = e.xSeq ? IndexedSubsequence.fromJson(e.xSeq) : null
                  , r = e.ySeq ? IndexedSubsequence.fromJson(e.ySeq) : null
                  , o = ""
                  , i = ""
                  , D = ""
                  , m = ""
                  , u = ""
                  , c = "";
                null == s ? (i = t + 1,
                m = escapeHtml(l),
                c = Css.ADDED_LINE,
                u = Css.PADDING) : null == t ? (o = s + 1,
                D = escapeHtml(d),
                u = Css.DELETED_LINE,
                c = Css.PADDING) : (o = s + 1,
                i = t + 1,
                E ? (D = escapeHtml(d),
                m = escapeHtml(l)) : (u = Css.DELETED_LINE,
                D = getHtmlForLine(d, a, Css.DELETED),
                c = Css.ADDED_LINE,
                m = getHtmlForLine(l, r, Css.ADDED))),
                n += "<tr>",
                n += makeTdWithClass(o, Css.LINE_HEADER) + makeTdWithClass(D, Css.LINE_CONTENT + " " + u) + makeTdWithClass(i, Css.LINE_HEADER) + makeTdWithClass(m, Css.LINE_CONTENT + " " + c),
                n += "</tr>"
            }, this),
            n += "</tbody></table>"
        }
        var makeTdWithClass = function(e, s) {
            return makeEl("td", s, "", e)
        }
          , makeEl = function(e, s, t, n) {
            return "<" + e + (t ? " " + t : "") + (s ? ' class="' + s + '"' : "") + ">" + n + "</" + e + ">"
        }
          , getHtmlForLine = function(e, s, t) {
            var n = ""
              , d = 0;
            return s.arr.forEach(function(s) {
                n += escapeHtml(e.substring(d, s.start)),
                n += '<span class="' + t + '">',
                n += escapeHtml(e.substring(s.start, s.end)),
                n += "</span>",
                d = s.end
            }),
            n += escapeHtml(e.substring(d, e.length))
        };
        module.exports = {
            diffModelToHtml: diffModelToHtml,
            diffJsonToHtml: diffJsonToHtml
        };

    }
    , {
        "./htmlescape": 17,
        "./indexedsubsequence": 18
    }],
    10: [function(require, module, exports) {
        var IndexedSubsequence = require("./indexedsubsequence")
          , Tokenizer = require("./tokenizer");
        function DiffModel(e, t, n, i) {
            this.x = e,
            this.y = t,
            this.lcsX = n,
            this.lcsY = i,
            this.seq0 = n.invert(this.x.length - 1),
            this.seq1 = i.invert(this.y.length - 1)
        }
        DiffModel.prototype.toJson = function() {
            var e = []
              , t = {
                lines: e
            };
            return this.forEachLine(function(t, n, i, r, l, s, o) {
                e.push({
                    xIdx: t,
                    yIdx: n,
                    x: i,
                    y: r,
                    eq: l,
                    xSeq: s ? s.toJson() : null,
                    ySeq: o ? o.toJson() : null
                })
            }),
            t
        }
        ,
        DiffModel.prototype.forEachLine = function(e, t) {
            for (var n, i = 0, r = 0, l = this.lcsX.get(0), s = this.lcsY.get(0); i < l && r < s; )
                n = DiffModel.getLineInfo(this.x[i], this.y[r]),
                e.call(t, i, r, n.x, n.y, n.eq, n.xSeq, n.ySeq),
                i++,
                r++;
            for (; i < l; )
                e.call(t, i, null, this.x[i], null, !1),
                i++;
            for (; r < s; )
                e.call(t, null, r, null, this.y[r], !1),
                r++;
            for (var o = 0; o < this.lcsX.length(); o++) {
                for (l = this.lcsX.get(o),
                s = this.lcsY.get(o); i < l && r < s; )
                    n = DiffModel.getLineInfo(this.x[i], this.y[r]),
                    e.call(t, i, r, n.x, n.y, n.eq, n.xSeq, n.ySeq),
                    i++,
                    r++;
                for (; i < l; )
                    e.call(t, i, null, this.x[i], null, !1),
                    i++;
                for (; r < s; )
                    e.call(t, null, r, null, this.y[r], !1),
                    r++;
                n = DiffModel.getLineInfo(this.x[l], this.y[s]),
                e.call(t, l, s, n.x, n.y, n.eq, n.xSeq, n.ySeq),
                i++,
                r++
            }
            for (; i < this.x.length && r < this.y.length; )
                n = DiffModel.getLineInfo(this.x[i], this.y[r]),
                e.call(t, i, r, n.x, n.y, n.eq, n.xSeq, n.ySeq),
                i++,
                r++;
            for (; i < this.x.length; )
                e.call(t, i, null, this.x[i], null, !1),
                i++;
            for (; r < this.y.length; )
                e.call(t, null, r, null, this.y[r], !1),
                r++
        }
        ,
        DiffModel.getLineInfo = function(e, t) {
            var n = null
              , i = null;
            if (void 0 !== e.split) {
                var r = Tokenizer.tokenize(e)
                  , l = Tokenizer.tokenize(t)
                  , s = DiffModel.fromClrs(r, l, Tokenizer.equals);
                n = Tokenizer.issOfTokensToIssInString(s.seq0, r),
                i = Tokenizer.issOfTokensToIssInString(s.seq1, l)
            }
            return {
                x: e,
                y: t,
                eq: e == t,
                xSeq: n,
                ySeq: i
            }
        }
        ,
        DiffModel.defaultEqFn = function(e, t) {
            return e == t
        }
        ,
        DiffModel.fromClrs = function(e, t, n) {
            for (var i = n || DiffModel.defaultEqFn, r = [], l = [], s = 0; s < t.length + 1; s++)
                r[s] = [],
                l[s] = [],
                r[s][0] = new IndexedSubsequence,
                l[s][0] = new IndexedSubsequence;
            for (var o = 0; o < e.length + 1; o++)
                r[0][o] = new IndexedSubsequence,
                l[0][o] = new IndexedSubsequence;
            for (s = 1; s < t.length + 1; s++)
                for (o = 1; o < e.length + 1; o++) {
                    var h = r[s - 1][o]
                      , a = r[s - 1][o - 1]
                      , f = r[s][o - 1]
                      , u = l[s - 1][o]
                      , x = l[s - 1][o - 1]
                      , d = l[s][o - 1];
                    if (f.length() > a.length())
                        r[s][o] = f,
                        l[s][o] = d;
                    else if (h.length() > a.length())
                        r[s][o] = h,
                        l[s][o] = u;
                    else if (i(t[s - 1], e[o - 1])) {
                        var y = IndexedSubsequence.fromSequence(a);
                        y.addIndex(s - 1),
                        r[s][o] = y,
                        (y = IndexedSubsequence.fromSequence(x)).addIndex(o - 1),
                        l[s][o] = y
                    } else {
                        var g = Math.max(h.length(), f.length());
                        h.length() == g ? (r[s][o] = h,
                        l[s][o] = u) : (r[s][o] = f,
                        l[s][o] = d)
                    }
                }
            return new DiffModel(e,t,l[t.length][e.length],r[t.length][e.length])
        }
        ;
        class PriorityQueue {
            constructor() {
                this.arr = []
            }
            isEmpty() {
                return 0 == this.arr.length
            }
            swap(e, t) {
                const n = this.arr[e];
                this.arr[e] = this.arr[t],
                this.arr[t] = n
            }
            bubbleDown(e) {
                for (; e < this.arr.length; ) {
                    const t = 2 * (e + 1) - 1
                      , n = 2 * (e + 1)
                      , i = this.arr[e].value;
                    if (t < this.arr.length && this.arr[t].value < i && (n >= this.arr.length || this.arr[t].value < this.arr[n].value))
                        this.swap(e, t),
                        e = t;
                    else {
                        if (!(n < this.arr.length && this.arr[n].value < i))
                            break;
                        this.swap(e, n),
                        e = n
                    }
                }
            }
            push(e, t) {
                this.arr.push({
                    obj: e,
                    value: t
                });
                let n = this.arr.length - 1;
                for (; n > 0; ) {
                    const e = Math.floor((n - 1) / 2);
                    if (!(this.arr[e].value > this.arr[n].value))
                        break;
                    this.swap(e, n),
                    n = e
                }
            }
            pop() {
                const e = this.arr[0]
                  , t = this.arr.pop();
                return this.arr.length > 0 && (this.arr[0] = t,
                this.bubbleDown(0)),
                e.obj
            }
        }
        class Node {
            constructor(e, t) {
                this.x = e,
                this.y = t
            }
            name() {
                return this.x + "," + this.y + ";"
            }
            toString() {
                return this.name()
            }
        }
        class Graph {
            constructor(e, t, n) {
                this.v1 = e,
                this.v2 = t,
                this.similarityFn = n,
                this.lcsX = [],
                this.lcsY = []
            }
            neighbors(e) {
                let t = [];
                return e.x < this.v1.length && t.push(new Node(e.x + 1,e.y)),
                e.y < this.v2.length && t.push(new Node(e.x,e.y + 1)),
                e.x < this.v1.length && e.y < this.v2.length && t.push(new Node(e.x + 1,e.y + 1)),
                t
            }
            d(e, t) {
                if (e.x == t.x)
                    return .99999;
                if (e.y == t.y)
                    return .9999;
                var n = this.v1[e.x]
                  , i = this.v2[e.y]
                  , r = this.similarityFn(n, i);
                if (r < 0 || r > 1)
                    throw new Error("Improper similarity between [" + n + "] and [" + i + "]: " + r);
                return 2 - 2 * r
            }
            astar() {
                const e = new Node(0,0)
                  , t = new PriorityQueue;
                t.push(e, 0);
                const n = {};
                n[e.name()] = null;
                const i = e=>Math.abs(e.x - e.y)
                  , r = {};
                for (r[e.name()] = 0; !t.isEmpty(); ) {
                    const e = t.pop();
                    if (e.x == this.v1.length && e.y == this.v2.length)
                        break;
                    let l = this.neighbors(e);
                    for (let s = 0; s < l.length; s++) {
                        const o = l[s]
                          , h = r[e.name()] + this.d(e, o);
                        (void 0 === r[o.name()] || h < r[o.name()]) && (r[o.name()] = h,
                        t.push(o, h + i(o)),
                        n[o.name()] = e)
                    }
                }
                let l = new Node(this.v1.length,this.v2.length)
                  , s = null
                  , o = [];
                for (; s = n[l.name()]; )
                    o.push({
                        xIdx: l.x != s.x ? s.x : null,
                        yIdx: l.y != s.y ? s.y : null,
                        x: l.x != s.x ? this.v1[s.x] : null,
                        y: l.y != s.y ? this.v2[s.y] : null
                    }),
                    l = s;
                return o.reverse(),
                o
            }
        }
        AStarDiffModel = function(e) {
            this.arr = e
        }
        ,
        AStarDiffModel.prototype.forEachLine = function(e, t) {
            for (var n = 0; n < this.arr.length; n++) {
                var i = this.arr[n];
                e.call(t, i.xIdx, i.yIdx, i.x, i.y, i.eq, i.xSeq, i.ySeq)
            }
        }
        ,
        AStarDiffModel.prototype.toJson = function() {
            var e = []
              , t = {
                lines: e
            };
            return this.forEachLine(function(t, n, i, r, l, s, o) {
                e.push({
                    xIdx: t,
                    yIdx: n,
                    x: i,
                    y: r,
                    eq: l,
                    xSeq: s ? s.toJson() : null,
                    ySeq: o ? o.toJson() : null
                })
            }),
            t
        }
        ,
        DiffModel.fromAstar = function(e, t) {
            const n = new Graph(e,t,DiffModel.votingSimilarityFn).astar()
              , i = [];
            for (let e = 0; e < n.length; e++) {
                const t = n[e];
                let a = null
                  , f = null;
                if (null != t.x && null != t.y && t.x != t.y) {
                    var r = Tokenizer.tokenize(t.x)
                      , l = Tokenizer.tokenize(t.y)
                      , s = new Graph(r,l,DiffModel.tokenSimilarityFn).astar()
                      , o = new IndexedSubsequence
                      , h = new IndexedSubsequence;
                    for (let e = 0; e < s.length; e++) {
                        const t = s[e];
                        null != t.xIdx && null != t.yIdx && (o.addIndex(t.xIdx),
                        h.addIndex(t.yIdx))
                    }
                    a = Tokenizer.issOfTokensToIssInString(o.invert(r.length - 1), r),
                    f = Tokenizer.issOfTokensToIssInString(h.invert(l.length - 1), l)
                }
                i.push({
                    xIdx: t.xIdx,
                    yIdx: t.yIdx,
                    x: t.x,
                    y: t.y,
                    eq: t.x == t.y,
                    xSeq: a,
                    ySeq: f
                })
            }
            return new AStarDiffModel(i)
        }
        ,
        DiffModel.eqSimilarityFn = function(e, t) {
            return e == t ? 1 : 0
        }
        ,
        DiffModel.lineSimilarityFn = function(e, t) {
            var n = Tokenizer.tokenize(e)
              , i = Tokenizer.tokenize(t)
              , r = DiffModel.fromClrs(n, i, Tokenizer.equals);
            return (r.lcsX.length() + r.lcsY.length()) / (n.length + i.length)
        }
        ,
        DiffModel.votingSimilarityFn = function(e, t) {
            for (var n = Tokenizer.tokenize(e), i = Tokenizer.tokenize(t), r = new Graph(n,i,DiffModel.tokenSimilarityFn).astar(), l = .5, s = 1, o = 0; o < r.length; o++) {
                var h = r[o].x
                  , a = r[o].y;
                if (h && a) {
                    var f = Math.log(h.text.length + .1) + Math.log(a.text.length + .1);
                    0 === h.text.trim().length && (f /= 10),
                    l += (h.text === a.text ? 1 : 0) * f,
                    s += f
                } else if (h || a) {
                    var u = h || a;
                    f = Math.log(u.text.length + .1);
                    0 === u.text.trim().length && (f /= 10),
                    l += 0 * f,
                    s += f
                }
            }
            return l / s
        }
        ,
        DiffModel.tokenSimilarityFn = function(e, t) {
            let n = e.text
              , i = t.text;
            return n != i || 0 == n.length || 0 == i.length ? 0 : 0 === n.trim().length ? .1 : 1 - 1 / (n.length + 1)
        }
        ,
        module.exports = DiffModel;

    }
    , {
        "./indexedsubsequence": 18,
        "./tokenizer": 40
    }],
    11: [function(require, module, exports) {
        var Flags = require("./flags");
        ErrorHandler = function(r) {
            Flags.REPORT_ERRORS && (window.onerror = function(o, n, e, l, a) {
                console.error(o, n, e, l, a);
            }
            )
        }
        ,
        module.exports = ErrorHandler;

    }
    , {
        "./flags": 14
    }],
    12: [function(require, module, exports) {
        module.exports = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="feedback-dialog-title">\n  <div class="modal-dialog">\n    <div class="modal-content">\n\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal">\n          <span aria-hidden="true">×</span>\n          <span class="sr-only">Close</span>\n        </button>\n        <h4 class="modal-title" id="feedback-dialog-title">Email the developer</h4>\n      </div>\n      <div class="modal-body">\n        <form role="form">\n          <div class="form-group">\n            <label for="feedback-email-input">Your email address</label>\n            <span class="small text-muted">(I\'ll write back!)</span>\n            <input type="email"\n                   spellcheck="false"\n                   class="form-control feedback-email"\n                   placeholder="Enter email">\n          </div>\n          <div class="form-group">\n            <label for="feedback-text">What\'s up?</label>\n            <textarea class="form-control feedback-text"></textarea>\n          </div>\n          <div class="checkbox">\n            <label>\n              <input class="feedback-include" type="checkbox">\n                Include diffed text\n              </input>\n            </label>\n          </div>\n        </form>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\n        <button type="button" class="btn btn-primary submit-button">Send</button>\n      </div>\n    </div>\n  </div>\n</div>\n';

    }
    , {}],
    13: [function(require, module, exports) {
        var $ = require("jquery");
        window.jQuery = window.$ = $;
        var text = require("./feedbackdialog.html")
          , transition = require("bootstrap/js/transition")
          , modal = require("bootstrap/js/modal");
        FeedbackWidget = function(t, i) {
            this.diffEditor = t,
            $("#feedback").click($.proxy(this.handleButtonClick, this)),
            this.$dialog = $(text),
            this.$submitButton = this.$dialog.find(".submit-button"),
            this.$emailInput = this.$dialog.find(".feedback-email"),
            this.$textInput = this.$dialog.find(".feedback-text"),
            this.$includeDiffCheckbox = this.$dialog.find(".feedback-include"),
            this.$submitButton.click($.proxy(this.handleSubmit, this))
        }
        ,
        FeedbackWidget.prototype.handleButtonClick = function(t) {
            t.preventDefault(),
            this.$submitButton.text("Send").prop("disabled", "").removeClass("btn-success"),
            this.$emailInput.val(""),
            this.$textInput.val(""),
            this.$includeDiffCheckbox.prop("checked", !0),
            this.$dialog.modal("show")
        }
        ,
        FeedbackWidget.prototype.handleSubmit = function() {
            var t = this.$emailInput.val()
              , i = this.$textInput.val()
              , e = this.$includeDiffCheckbox.prop("checked")
              , s = this.diffEditor.getContent()
              , n = {
                email: t,
                text: i,
                includeDiff: e,
                x: e ? s.x : "",
                y: e ? s.y : ""
            };
            this.$submitButton.text("Sending...").prop("disabled", !0),
            $.post("/feedback", n).done($.proxy(function() {
                setTimeout($.proxy(function() {
                    this.$submitButton.text("Sent!").addClass("btn-success"),
                    setTimeout($.proxy(function() {
                        this.$dialog.modal("hide")
                    }, this), 500)
                }, this), 500)
            }, this)).fail($.proxy(function() {
                this.$submitButton.text("Send").prop("disabled", ""),
                alert("Sorry, there was a problem sending your feedback.")
            }))
        }
        ,
        module.exports = FeedbackWidget;

    }
    , {
        "./feedbackdialog.html": 12,
        "bootstrap/js/modal": 21,
        "bootstrap/js/transition": 22,
        "jquery": 27
    }],
    14: [function(require, module, exports) {
        var flag_json = require("./flags_content.js")
          , Flags = {};
        Flags.AMPLITUDE_ID = flag_json.amplitude_id,
        Flags.DEBUG = flag_json.debug,
        Flags.ENABLE_AUTOSPLIT = flag_json.enable_autosplit,
        Flags.ENABLE_PUBLISHING = flag_json.enable_publishing,
        Flags.ENABLE_PAGE_PUBLISHING = flag_json.enable_page_publishing,
        Flags.JS_ASW_MAIN = flag_json.js_asw_main,
        Flags.REPORT_ERRORS = flag_json.report_errors,
        Flags.updateFromUrl = function() {
            try {
                var a = new URLSearchParams(window.location.search).get("flags");
                if (null == a)
                    return;
                a.split(",").forEach(function(a) {
                    var l = a.split("=")
                      , s = l[0].toLocaleUpperCase();
                    1 == l.length ? "-" == s[0] ? Flags[s.substring(1)] = !1 : Flags[s] = !0 : Flags[s] = l[1]
                })
            } catch (a) {}
        }
        ,
        module.exports = Flags;

    }
    , {
        "./flags_content.js": 15
    }],
    15: [function(require, module, exports) {
        module.exports = require("/Users/joe/Documents/Projects/VisualDiff/diff/scripts/app/node_modules/prod_flags/index.js");

    }
    , {
        "/Users/joe/Documents/Projects/VisualDiff/diff/scripts/app/node_modules/prod_flags/index.js": 29
    }],
    16: [function(require, module, exports) {
    }
    , {}],
    17: [function(require, module, exports) {
        var amperRe_ = /&/g
          , ltRe_ = /</g
          , gtRe_ = />/g
          , quotRe_ = /"/g
          , singleQuoteRe_ = /'/g
          , allRe_ = /[&<>"']/;
        module.exports = function(e) {
            return allRe_.test(e) ? (-1 != e.indexOf("&") && (e = e.replace(amperRe_, "&amp;")),
            -1 != e.indexOf("<") && (e = e.replace(ltRe_, "&lt;")),
            -1 != e.indexOf(">") && (e = e.replace(gtRe_, "&gt;")),
            -1 != e.indexOf('"') && (e = e.replace(quotRe_, "&quot;")),
            -1 != e.indexOf("'") && (e = e.replace(singleQuoteRe_, "&#39;")),
            e) : e
        }
        ;

    }
    , {}],
    18: [function(require, module, exports) {
        var IndexedSubsequence = function() {
            this.arr = []
        };
        function Range(e, n) {
            this.start = e,
            this.end = n
        }
        IndexedSubsequence.prototype.addRange = function(e, n) {
            this.arr.push(new Range(e,n))
        }
        ,
        IndexedSubsequence.prototype.addIndex = function(e) {
            var n = this.arr;
            if (0 == n.length)
                this.addRange(e, e);
            else {
                var r = n[n.length - 1];
                r.end == e - 1 ? r.end = e : this.addRange(e, e)
            }
        }
        ,
        IndexedSubsequence.fromSequence = function(e) {
            for (var n = new IndexedSubsequence, r = 0; r < e.arr.length; r++)
                n.addRange(e.arr[r].start, e.arr[r].end);
            return n
        }
        ,
        IndexedSubsequence.prototype.toJson = function() {
            for (var e = [], n = 0; n < this.arr.length; n++)
                e.push({
                    s: this.arr[n].start,
                    e: this.arr[n].end
                });
            return e
        }
        ,
        IndexedSubsequence.fromJson = function(e) {
            for (var n = new IndexedSubsequence, r = 0; r < e.length; r++)
                n.arr.push(new Range(e[r].s,e[r].e));
            return n
        }
        ,
        IndexedSubsequence.prototype.length = function() {
            for (var e = 0, n = 0; n < this.arr.length; n++)
                e += 1 + this.arr[n].end - this.arr[n].start;
            return e
        }
        ,
        IndexedSubsequence.prototype.invert = function(e) {
            var n = new IndexedSubsequence
              , r = this.arr;
            if (0 == r.length)
                n.addRange(0, e);
            else {
                for (var t = 0, a = 0; a < r.length; a++)
                    t < r[a].start && n.addRange(t, r[a].start - 1),
                    t = r[a].end + 1;
                t <= e && n.addRange(t, e)
            }
            return n
        }
        ,
        IndexedSubsequence.prototype.get = function(e) {
            for (var n = 0, r = 0; r < this.arr.length; r++) {
                var t = this.arr[r];
                if (n + t.size() > e)
                    return t.start + (e - n);
                n += t.size()
            }
        }
        ,
        Range.prototype.size = function() {
            return this.end - this.start + 1
        }
        ,
        module.exports = IndexedSubsequence;

    }
    , {}],
    19: [function(require, module, exports) {
        module.exports = function(o, t) {
            function p() {}
            p.prototype = t.prototype,
            o.superClass_ = t.prototype,
            o.prototype = new p,
            o.prototype.constructor = o
        }
        ;

    }
    , {}],
    20: [function(require, module, exports) {
        (function(process) {
            "use strict";
            function getWindow(e) {
                if (null == e)
                    return window;
                if ("[object Window]" !== e.toString()) {
                    var t = e.ownerDocument;
                    return t && t.defaultView || window
                }
                return e
            }
            function isElement(e) {
                return e instanceof getWindow(e).Element || e instanceof Element
            }
            function isHTMLElement(e) {
                return e instanceof getWindow(e).HTMLElement || e instanceof HTMLElement
            }
            function isShadowRoot(e) {
                return "undefined" != typeof ShadowRoot && (e instanceof getWindow(e).ShadowRoot || e instanceof ShadowRoot)
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            var max = Math.max
              , min = Math.min
              , round = Math.round;
            function getBoundingClientRect(e, t) {
                void 0 === t && (t = !1);
                var n = e.getBoundingClientRect()
                  , r = 1
                  , o = 1;
                if (isHTMLElement(e) && t) {
                    var i = e.offsetHeight
                      , a = e.offsetWidth;
                    a > 0 && (r = round(n.width) / a || 1),
                    i > 0 && (o = round(n.height) / i || 1)
                }
                return {
                    width: n.width / r,
                    height: n.height / o,
                    top: n.top / o,
                    right: n.right / r,
                    bottom: n.bottom / o,
                    left: n.left / r,
                    x: n.left / r,
                    y: n.top / o
                }
            }
            function getWindowScroll(e) {
                var t = getWindow(e);
                return {
                    scrollLeft: t.pageXOffset,
                    scrollTop: t.pageYOffset
                }
            }
            function getHTMLElementScroll(e) {
                return {
                    scrollLeft: e.scrollLeft,
                    scrollTop: e.scrollTop
                }
            }
            function getNodeScroll(e) {
                return e !== getWindow(e) && isHTMLElement(e) ? getHTMLElementScroll(e) : getWindowScroll(e)
            }
            function getNodeName(e) {
                return e ? (e.nodeName || "").toLowerCase() : null
            }
            function getDocumentElement(e) {
                return ((isElement(e) ? e.ownerDocument : e.document) || window.document).documentElement
            }
            function getWindowScrollBarX(e) {
                return getBoundingClientRect(getDocumentElement(e)).left + getWindowScroll(e).scrollLeft
            }
            function getComputedStyle(e) {
                return getWindow(e).getComputedStyle(e)
            }
            function isScrollParent(e) {
                var t = getComputedStyle(e)
                  , n = t.overflow
                  , r = t.overflowX
                  , o = t.overflowY;
                return /auto|scroll|overlay|hidden/.test(n + o + r)
            }
            function isElementScaled(e) {
                var t = e.getBoundingClientRect()
                  , n = round(t.width) / e.offsetWidth || 1
                  , r = round(t.height) / e.offsetHeight || 1;
                return 1 !== n || 1 !== r
            }
            function getCompositeRect(e, t, n) {
                void 0 === n && (n = !1);
                var r = isHTMLElement(t)
                  , o = isHTMLElement(t) && isElementScaled(t)
                  , i = getDocumentElement(t)
                  , a = getBoundingClientRect(e, o)
                  , s = {
                    scrollLeft: 0,
                    scrollTop: 0
                }
                  , f = {
                    x: 0,
                    y: 0
                };
                return (r || !r && !n) && (("body" !== getNodeName(t) || isScrollParent(i)) && (s = getNodeScroll(t)),
                isHTMLElement(t) ? ((f = getBoundingClientRect(t, !0)).x += t.clientLeft,
                f.y += t.clientTop) : i && (f.x = getWindowScrollBarX(i))),
                {
                    x: a.left + s.scrollLeft - f.x,
                    y: a.top + s.scrollTop - f.y,
                    width: a.width,
                    height: a.height
                }
            }
            function getLayoutRect(e) {
                var t = getBoundingClientRect(e)
                  , n = e.offsetWidth
                  , r = e.offsetHeight;
                return Math.abs(t.width - n) <= 1 && (n = t.width),
                Math.abs(t.height - r) <= 1 && (r = t.height),
                {
                    x: e.offsetLeft,
                    y: e.offsetTop,
                    width: n,
                    height: r
                }
            }
            function getParentNode(e) {
                return "html" === getNodeName(e) ? e : e.assignedSlot || e.parentNode || (isShadowRoot(e) ? e.host : null) || getDocumentElement(e)
            }
            function getScrollParent(e) {
                return ["html", "body", "#document"].indexOf(getNodeName(e)) >= 0 ? e.ownerDocument.body : isHTMLElement(e) && isScrollParent(e) ? e : getScrollParent(getParentNode(e))
            }
            function listScrollParents(e, t) {
                var n;
                void 0 === t && (t = []);
                var r = getScrollParent(e)
                  , o = r === (null == (n = e.ownerDocument) ? void 0 : n.body)
                  , i = getWindow(r)
                  , a = o ? [i].concat(i.visualViewport || [], isScrollParent(r) ? r : []) : r
                  , s = t.concat(a);
                return o ? s : s.concat(listScrollParents(getParentNode(a)))
            }
            function isTableElement(e) {
                return ["table", "td", "th"].indexOf(getNodeName(e)) >= 0
            }
            function getTrueOffsetParent(e) {
                return isHTMLElement(e) && "fixed" !== getComputedStyle(e).position ? e.offsetParent : null
            }
            function getContainingBlock(e) {
                var t = -1 !== navigator.userAgent.toLowerCase().indexOf("firefox");
                if (-1 !== navigator.userAgent.indexOf("Trident") && isHTMLElement(e) && "fixed" === getComputedStyle(e).position)
                    return null;
                for (var n = getParentNode(e); isHTMLElement(n) && ["html", "body"].indexOf(getNodeName(n)) < 0; ) {
                    var r = getComputedStyle(n);
                    if ("none" !== r.transform || "none" !== r.perspective || "paint" === r.contain || -1 !== ["transform", "perspective"].indexOf(r.willChange) || t && "filter" === r.willChange || t && r.filter && "none" !== r.filter)
                        return n;
                    n = n.parentNode
                }
                return null
            }
            function getOffsetParent(e) {
                for (var t = getWindow(e), n = getTrueOffsetParent(e); n && isTableElement(n) && "static" === getComputedStyle(n).position; )
                    n = getTrueOffsetParent(n);
                return n && ("html" === getNodeName(n) || "body" === getNodeName(n) && "static" === getComputedStyle(n).position) ? t : n || getContainingBlock(e) || t
            }
            var top = "top"
              , bottom = "bottom"
              , right = "right"
              , left = "left"
              , auto = "auto"
              , basePlacements = [top, bottom, right, left]
              , start = "start"
              , end = "end"
              , clippingParents = "clippingParents"
              , viewport = "viewport"
              , popper = "popper"
              , reference = "reference"
              , variationPlacements = basePlacements.reduce(function(e, t) {
                return e.concat([t + "-" + start, t + "-" + end])
            }, [])
              , placements = [].concat(basePlacements, [auto]).reduce(function(e, t) {
                return e.concat([t, t + "-" + start, t + "-" + end])
            }, [])
              , beforeRead = "beforeRead"
              , read = "read"
              , afterRead = "afterRead"
              , beforeMain = "beforeMain"
              , main = "main"
              , afterMain = "afterMain"
              , beforeWrite = "beforeWrite"
              , write = "write"
              , afterWrite = "afterWrite"
              , modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
            function order(e) {
                var t = new Map
                  , n = new Set
                  , r = [];
                return e.forEach(function(e) {
                    t.set(e.name, e)
                }),
                e.forEach(function(e) {
                    n.has(e.name) || function e(o) {
                        n.add(o.name),
                        [].concat(o.requires || [], o.requiresIfExists || []).forEach(function(r) {
                            if (!n.has(r)) {
                                var o = t.get(r);
                                o && e(o)
                            }
                        }),
                        r.push(o)
                    }(e)
                }),
                r
            }
            function orderModifiers(e) {
                var t = order(e);
                return modifierPhases.reduce(function(e, n) {
                    return e.concat(t.filter(function(e) {
                        return e.phase === n
                    }))
                }, [])
            }
            function debounce(e) {
                var t;
                return function() {
                    return t || (t = new Promise(function(n) {
                        Promise.resolve().then(function() {
                            t = void 0,
                            n(e())
                        })
                    }
                    )),
                    t
                }
            }
            function format(e) {
                for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
                    n[r - 1] = arguments[r];
                return [].concat(n).reduce(function(e, t) {
                    return e.replace(/%s/, t)
                }, e)
            }
            var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s'
              , MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available'
              , VALID_PROPERTIES = ["name", "enabled", "phase", "fn", "effect", "requires", "options"];
            function validateModifiers(e) {
                e.forEach(function(t) {
                    [].concat(Object.keys(t), VALID_PROPERTIES).filter(function(e, t, n) {
                        return n.indexOf(e) === t
                    }).forEach(function(n) {
                        switch (n) {
                        case "name":
                            "string" != typeof t.name && console.error(format(INVALID_MODIFIER_ERROR, String(t.name), '"name"', '"string"', '"' + String(t.name) + '"'));
                            break;
                        case "enabled":
                            "boolean" != typeof t.enabled && console.error(format(INVALID_MODIFIER_ERROR, t.name, '"enabled"', '"boolean"', '"' + String(t.enabled) + '"'));
                            break;
                        case "phase":
                            modifierPhases.indexOf(t.phase) < 0 && console.error(format(INVALID_MODIFIER_ERROR, t.name, '"phase"', "either " + modifierPhases.join(", "), '"' + String(t.phase) + '"'));
                            break;
                        case "fn":
                            "function" != typeof t.fn && console.error(format(INVALID_MODIFIER_ERROR, t.name, '"fn"', '"function"', '"' + String(t.fn) + '"'));
                            break;
                        case "effect":
                            null != t.effect && "function" != typeof t.effect && console.error(format(INVALID_MODIFIER_ERROR, t.name, '"effect"', '"function"', '"' + String(t.fn) + '"'));
                            break;
                        case "requires":
                            null == t.requires || Array.isArray(t.requires) || console.error(format(INVALID_MODIFIER_ERROR, t.name, '"requires"', '"array"', '"' + String(t.requires) + '"'));
                            break;
                        case "requiresIfExists":
                            Array.isArray(t.requiresIfExists) || console.error(format(INVALID_MODIFIER_ERROR, t.name, '"requiresIfExists"', '"array"', '"' + String(t.requiresIfExists) + '"'));
                            break;
                        case "options":
                        case "data":
                            break;
                        default:
                            console.error('PopperJS: an invalid property has been provided to the "' + t.name + '" modifier, valid properties are ' + VALID_PROPERTIES.map(function(e) {
                                return '"' + e + '"'
                            }).join(", ") + '; but "' + n + '" was provided.')
                        }
                        t.requires && t.requires.forEach(function(n) {
                            null == e.find(function(e) {
                                return e.name === n
                            }) && console.error(format(MISSING_DEPENDENCY_ERROR, String(t.name), n, n))
                        })
                    })
                })
            }
            function uniqueBy(e, t) {
                var n = new Set;
                return e.filter(function(e) {
                    var r = t(e);
                    if (!n.has(r))
                        return n.add(r),
                        !0
                })
            }
            function getBasePlacement(e) {
                return e.split("-")[0]
            }
            function mergeByName(e) {
                var t = e.reduce(function(e, t) {
                    var n = e[t.name];
                    return e[t.name] = n ? Object.assign({}, n, t, {
                        options: Object.assign({}, n.options, t.options),
                        data: Object.assign({}, n.data, t.data)
                    }) : t,
                    e
                }, {});
                return Object.keys(t).map(function(e) {
                    return t[e]
                })
            }
            function getViewportRect(e) {
                var t = getWindow(e)
                  , n = getDocumentElement(e)
                  , r = t.visualViewport
                  , o = n.clientWidth
                  , i = n.clientHeight
                  , a = 0
                  , s = 0;
                return r && (o = r.width,
                i = r.height,
                /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (a = r.offsetLeft,
                s = r.offsetTop)),
                {
                    width: o,
                    height: i,
                    x: a + getWindowScrollBarX(e),
                    y: s
                }
            }
            function getDocumentRect(e) {
                var t, n = getDocumentElement(e), r = getWindowScroll(e), o = null == (t = e.ownerDocument) ? void 0 : t.body, i = max(n.scrollWidth, n.clientWidth, o ? o.scrollWidth : 0, o ? o.clientWidth : 0), a = max(n.scrollHeight, n.clientHeight, o ? o.scrollHeight : 0, o ? o.clientHeight : 0), s = -r.scrollLeft + getWindowScrollBarX(e), f = -r.scrollTop;
                return "rtl" === getComputedStyle(o || n).direction && (s += max(n.clientWidth, o ? o.clientWidth : 0) - i),
                {
                    width: i,
                    height: a,
                    x: s,
                    y: f
                }
            }
            function contains(e, t) {
                var n = t.getRootNode && t.getRootNode();
                if (e.contains(t))
                    return !0;
                if (n && isShadowRoot(n)) {
                    var r = t;
                    do {
                        if (r && e.isSameNode(r))
                            return !0;
                        r = r.parentNode || r.host
                    } while (r)
                }
                return !1
            }
            function rectToClientRect(e) {
                return Object.assign({}, e, {
                    left: e.x,
                    top: e.y,
                    right: e.x + e.width,
                    bottom: e.y + e.height
                })
            }
            function getInnerBoundingClientRect(e) {
                var t = getBoundingClientRect(e);
                return t.top = t.top + e.clientTop,
                t.left = t.left + e.clientLeft,
                t.bottom = t.top + e.clientHeight,
                t.right = t.left + e.clientWidth,
                t.width = e.clientWidth,
                t.height = e.clientHeight,
                t.x = t.left,
                t.y = t.top,
                t
            }
            function getClientRectFromMixedType(e, t) {
                return t === viewport ? rectToClientRect(getViewportRect(e)) : isElement(t) ? getInnerBoundingClientRect(t) : rectToClientRect(getDocumentRect(getDocumentElement(e)))
            }
            function getClippingParents(e) {
                var t = listScrollParents(getParentNode(e))
                  , n = ["absolute", "fixed"].indexOf(getComputedStyle(e).position) >= 0
                  , r = n && isHTMLElement(e) ? getOffsetParent(e) : e;
                return isElement(r) ? t.filter(function(e) {
                    return isElement(e) && contains(e, r) && "body" !== getNodeName(e) && (!n || "static" !== getComputedStyle(e).position)
                }) : []
            }
            function getClippingRect(e, t, n) {
                var r = "clippingParents" === t ? getClippingParents(e) : [].concat(t)
                  , o = [].concat(r, [n])
                  , i = o[0]
                  , a = o.reduce(function(t, n) {
                    var r = getClientRectFromMixedType(e, n);
                    return t.top = max(r.top, t.top),
                    t.right = min(r.right, t.right),
                    t.bottom = min(r.bottom, t.bottom),
                    t.left = max(r.left, t.left),
                    t
                }, getClientRectFromMixedType(e, i));
                return a.width = a.right - a.left,
                a.height = a.bottom - a.top,
                a.x = a.left,
                a.y = a.top,
                a
            }
            function getVariation(e) {
                return e.split("-")[1]
            }
            function getMainAxisFromPlacement(e) {
                return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y"
            }
            function computeOffsets(e) {
                var t, n = e.reference, r = e.element, o = e.placement, i = o ? getBasePlacement(o) : null, a = o ? getVariation(o) : null, s = n.x + n.width / 2 - r.width / 2, f = n.y + n.height / 2 - r.height / 2;
                switch (i) {
                case top:
                    t = {
                        x: s,
                        y: n.y - r.height
                    };
                    break;
                case bottom:
                    t = {
                        x: s,
                        y: n.y + n.height
                    };
                    break;
                case right:
                    t = {
                        x: n.x + n.width,
                        y: f
                    };
                    break;
                case left:
                    t = {
                        x: n.x - r.width,
                        y: f
                    };
                    break;
                default:
                    t = {
                        x: n.x,
                        y: n.y
                    }
                }
                var l = i ? getMainAxisFromPlacement(i) : null;
                if (null != l) {
                    var p = "y" === l ? "height" : "width";
                    switch (a) {
                    case start:
                        t[l] = t[l] - (n[p] / 2 - r[p] / 2);
                        break;
                    case end:
                        t[l] = t[l] + (n[p] / 2 - r[p] / 2)
                    }
                }
                return t
            }
            function getFreshSideObject() {
                return {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }
            }
            function mergePaddingObject(e) {
                return Object.assign({}, getFreshSideObject(), e)
            }
            function expandToHashMap(e, t) {
                return t.reduce(function(t, n) {
                    return t[n] = e,
                    t
                }, {})
            }
            function detectOverflow(e, t) {
                void 0 === t && (t = {});
                var n = t
                  , r = n.placement
                  , o = void 0 === r ? e.placement : r
                  , i = n.boundary
                  , a = void 0 === i ? clippingParents : i
                  , s = n.rootBoundary
                  , f = void 0 === s ? viewport : s
                  , l = n.elementContext
                  , p = void 0 === l ? popper : l
                  , c = n.altBoundary
                  , d = void 0 !== c && c
                  , u = n.padding
                  , m = void 0 === u ? 0 : u
                  , g = mergePaddingObject("number" != typeof m ? m : expandToHashMap(m, basePlacements))
                  , h = p === popper ? reference : popper
                  , v = e.rects.popper
                  , y = e.elements[d ? h : p]
                  , b = getClippingRect(isElement(y) ? y : y.contextElement || getDocumentElement(e.elements.popper), a, f)
                  , O = getBoundingClientRect(e.elements.reference)
                  , w = computeOffsets({
                    reference: O,
                    element: v,
                    strategy: "absolute",
                    placement: o
                })
                  , E = rectToClientRect(Object.assign({}, v, w))
                  , x = p === popper ? E : O
                  , P = {
                    top: b.top - x.top + g.top,
                    bottom: x.bottom - b.bottom + g.bottom,
                    left: b.left - x.left + g.left,
                    right: x.right - b.right + g.right
                }
                  , S = e.modifiersData.offset;
                if (p === popper && S) {
                    var R = S[o];
                    Object.keys(P).forEach(function(e) {
                        var t = [right, bottom].indexOf(e) >= 0 ? 1 : -1
                          , n = [top, bottom].indexOf(e) >= 0 ? "y" : "x";
                        P[e] += R[n] * t
                    })
                }
                return P
            }
            var INVALID_ELEMENT_ERROR = "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element."
              , INFINITE_LOOP_ERROR = "Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash."
              , DEFAULT_OPTIONS = {
                placement: "bottom",
                modifiers: [],
                strategy: "absolute"
            };
            function areValidElements() {
                for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                    t[n] = arguments[n];
                return !t.some(function(e) {
                    return !(e && "function" == typeof e.getBoundingClientRect)
                })
            }
            function popperGenerator(e) {
                void 0 === e && (e = {});
                var t = e
                  , n = t.defaultModifiers
                  , r = void 0 === n ? [] : n
                  , o = t.defaultOptions
                  , i = void 0 === o ? DEFAULT_OPTIONS : o;
                return function(e, t, n) {
                    void 0 === n && (n = i);
                    var o = {
                        placement: "bottom",
                        orderedModifiers: [],
                        options: Object.assign({}, DEFAULT_OPTIONS, i),
                        modifiersData: {},
                        elements: {
                            reference: e,
                            popper: t
                        },
                        attributes: {},
                        styles: {}
                    }
                      , a = []
                      , s = !1
                      , f = {
                        state: o,
                        setOptions: function(n) {
                            var s = "function" == typeof n ? n(o.options) : n;
                            l(),
                            o.options = Object.assign({}, i, o.options, s),
                            o.scrollParents = {
                                reference: isElement(e) ? listScrollParents(e) : e.contextElement ? listScrollParents(e.contextElement) : [],
                                popper: listScrollParents(t)
                            };
                            var p = orderModifiers(mergeByName([].concat(r, o.options.modifiers)));
                            if (o.orderedModifiers = p.filter(function(e) {
                                return e.enabled
                            }),
                            "production" !== process.env.NODE_ENV) {
                                if (validateModifiers(uniqueBy([].concat(p, o.options.modifiers), function(e) {
                                    return e.name
                                })),
                                getBasePlacement(o.options.placement) === auto)
                                    o.orderedModifiers.find(function(e) {
                                        return "flip" === e.name
                                    }) || console.error(['Popper: "auto" placements require the "flip" modifier be', "present and enabled to work."].join(" "));
                                var c = getComputedStyle(t);
                                [c.marginTop, c.marginRight, c.marginBottom, c.marginLeft].some(function(e) {
                                    return parseFloat(e)
                                }) && console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', "between the popper and its reference element or boundary.", "To replicate margin, use the `offset` modifier, as well as", "the `padding` option in the `preventOverflow` and `flip`", "modifiers."].join(" "))
                            }
                            return o.orderedModifiers.forEach(function(e) {
                                var t = e.name
                                  , n = e.options
                                  , r = void 0 === n ? {} : n
                                  , i = e.effect;
                                if ("function" == typeof i) {
                                    var s = i({
                                        state: o,
                                        name: t,
                                        instance: f,
                                        options: r
                                    });
                                    a.push(s || function() {}
                                    )
                                }
                            }),
                            f.update()
                        },
                        forceUpdate: function() {
                            if (!s) {
                                var e = o.elements
                                  , t = e.reference
                                  , n = e.popper;
                                if (areValidElements(t, n)) {
                                    o.rects = {
                                        reference: getCompositeRect(t, getOffsetParent(n), "fixed" === o.options.strategy),
                                        popper: getLayoutRect(n)
                                    },
                                    o.reset = !1,
                                    o.placement = o.options.placement,
                                    o.orderedModifiers.forEach(function(e) {
                                        return o.modifiersData[e.name] = Object.assign({}, e.data)
                                    });
                                    for (var r = 0, i = 0; i < o.orderedModifiers.length; i++) {
                                        if ("production" !== process.env.NODE_ENV && (r += 1) > 100) {
                                            console.error(INFINITE_LOOP_ERROR);
                                            break
                                        }
                                        if (!0 !== o.reset) {
                                            var a = o.orderedModifiers[i]
                                              , l = a.fn
                                              , p = a.options
                                              , c = void 0 === p ? {} : p
                                              , d = a.name;
                                            "function" == typeof l && (o = l({
                                                state: o,
                                                options: c,
                                                name: d,
                                                instance: f
                                            }) || o)
                                        } else
                                            o.reset = !1,
                                            i = -1
                                    }
                                } else
                                    "production" !== process.env.NODE_ENV && console.error(INVALID_ELEMENT_ERROR)
                            }
                        },
                        update: debounce(function() {
                            return new Promise(function(e) {
                                f.forceUpdate(),
                                e(o)
                            }
                            )
                        }),
                        destroy: function() {
                            l(),
                            s = !0
                        }
                    };
                    if (!areValidElements(e, t))
                        return "production" !== process.env.NODE_ENV && console.error(INVALID_ELEMENT_ERROR),
                        f;
                    function l() {
                        a.forEach(function(e) {
                            return e()
                        }),
                        a = []
                    }
                    return f.setOptions(n).then(function(e) {
                        !s && n.onFirstUpdate && n.onFirstUpdate(e)
                    }),
                    f
                }
            }
            var passive = {
                passive: !0
            };
            function effect$2(e) {
                var t = e.state
                  , n = e.instance
                  , r = e.options
                  , o = r.scroll
                  , i = void 0 === o || o
                  , a = r.resize
                  , s = void 0 === a || a
                  , f = getWindow(t.elements.popper)
                  , l = [].concat(t.scrollParents.reference, t.scrollParents.popper);
                return i && l.forEach(function(e) {
                    e.addEventListener("scroll", n.update, passive)
                }),
                s && f.addEventListener("resize", n.update, passive),
                function() {
                    i && l.forEach(function(e) {
                        e.removeEventListener("scroll", n.update, passive)
                    }),
                    s && f.removeEventListener("resize", n.update, passive)
                }
            }
            var eventListeners = {
                name: "eventListeners",
                enabled: !0,
                phase: "write",
                fn: function() {},
                effect: effect$2,
                data: {}
            };
            function popperOffsets(e) {
                var t = e.state
                  , n = e.name;
                t.modifiersData[n] = computeOffsets({
                    reference: t.rects.reference,
                    element: t.rects.popper,
                    strategy: "absolute",
                    placement: t.placement
                })
            }
            var popperOffsets$1 = {
                name: "popperOffsets",
                enabled: !0,
                phase: "read",
                fn: popperOffsets,
                data: {}
            }
              , unsetSides = {
                top: "auto",
                right: "auto",
                bottom: "auto",
                left: "auto"
            };
            function roundOffsetsByDPR(e) {
                var t = e.x
                  , n = e.y
                  , r = window.devicePixelRatio || 1;
                return {
                    x: round(t * r) / r || 0,
                    y: round(n * r) / r || 0
                }
            }
            function mapToStyles(e) {
                var t, n = e.popper, r = e.popperRect, o = e.placement, i = e.variation, a = e.offsets, s = e.position, f = e.gpuAcceleration, l = e.adaptive, p = e.roundOffsets, c = e.isFixed, d = !0 === p ? roundOffsetsByDPR(a) : "function" == typeof p ? p(a) : a, u = d.x, m = void 0 === u ? 0 : u, g = d.y, h = void 0 === g ? 0 : g, v = a.hasOwnProperty("x"), y = a.hasOwnProperty("y"), b = left, O = top, w = window;
                if (l) {
                    var E = getOffsetParent(n)
                      , x = "clientHeight"
                      , P = "clientWidth";
                    if (E === getWindow(n) && "static" !== getComputedStyle(E = getDocumentElement(n)).position && "absolute" === s && (x = "scrollHeight",
                    P = "scrollWidth"),
                    E = E,
                    o === top || (o === left || o === right) && i === end)
                        O = bottom,
                        h -= (c && w.visualViewport ? w.visualViewport.height : E[x]) - r.height,
                        h *= f ? 1 : -1;
                    if (o === left || (o === top || o === bottom) && i === end)
                        b = right,
                        m -= (c && w.visualViewport ? w.visualViewport.width : E[P]) - r.width,
                        m *= f ? 1 : -1
                }
                var S, R = Object.assign({
                    position: s
                }, l && unsetSides);
                return f ? Object.assign({}, R, ((S = {})[O] = y ? "0" : "",
                S[b] = v ? "0" : "",
                S.transform = (w.devicePixelRatio || 1) <= 1 ? "translate(" + m + "px, " + h + "px)" : "translate3d(" + m + "px, " + h + "px, 0)",
                S)) : Object.assign({}, R, ((t = {})[O] = y ? h + "px" : "",
                t[b] = v ? m + "px" : "",
                t.transform = "",
                t))
            }
            function computeStyles(e) {
                var t = e.state
                  , n = e.options
                  , r = n.gpuAcceleration
                  , o = void 0 === r || r
                  , i = n.adaptive
                  , a = void 0 === i || i
                  , s = n.roundOffsets
                  , f = void 0 === s || s;
                if ("production" !== process.env.NODE_ENV) {
                    var l = getComputedStyle(t.elements.popper).transitionProperty || "";
                    a && ["transform", "top", "right", "bottom", "left"].some(function(e) {
                        return l.indexOf(e) >= 0
                    }) && console.warn(["Popper: Detected CSS transitions on at least one of the following", 'CSS properties: "transform", "top", "right", "bottom", "left".', "\n\n", 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', "for smooth transitions, or remove these properties from the CSS", "transition declaration on the popper element if only transitioning", "opacity or background-color for example.", "\n\n", "We recommend using the popper element as a wrapper around an inner", "element that can have any CSS property transitioned for animations."].join(" "))
                }
                var p = {
                    placement: getBasePlacement(t.placement),
                    variation: getVariation(t.placement),
                    popper: t.elements.popper,
                    popperRect: t.rects.popper,
                    gpuAcceleration: o,
                    isFixed: "fixed" === t.options.strategy
                };
                null != t.modifiersData.popperOffsets && (t.styles.popper = Object.assign({}, t.styles.popper, mapToStyles(Object.assign({}, p, {
                    offsets: t.modifiersData.popperOffsets,
                    position: t.options.strategy,
                    adaptive: a,
                    roundOffsets: f
                })))),
                null != t.modifiersData.arrow && (t.styles.arrow = Object.assign({}, t.styles.arrow, mapToStyles(Object.assign({}, p, {
                    offsets: t.modifiersData.arrow,
                    position: "absolute",
                    adaptive: !1,
                    roundOffsets: f
                })))),
                t.attributes.popper = Object.assign({}, t.attributes.popper, {
                    "data-popper-placement": t.placement
                })
            }
            var computeStyles$1 = {
                name: "computeStyles",
                enabled: !0,
                phase: "beforeWrite",
                fn: computeStyles,
                data: {}
            };
            function applyStyles(e) {
                var t = e.state;
                Object.keys(t.elements).forEach(function(e) {
                    var n = t.styles[e] || {}
                      , r = t.attributes[e] || {}
                      , o = t.elements[e];
                    isHTMLElement(o) && getNodeName(o) && (Object.assign(o.style, n),
                    Object.keys(r).forEach(function(e) {
                        var t = r[e];
                        !1 === t ? o.removeAttribute(e) : o.setAttribute(e, !0 === t ? "" : t)
                    }))
                })
            }
            function effect$1(e) {
                var t = e.state
                  , n = {
                    popper: {
                        position: t.options.strategy,
                        left: "0",
                        top: "0",
                        margin: "0"
                    },
                    arrow: {
                        position: "absolute"
                    },
                    reference: {}
                };
                return Object.assign(t.elements.popper.style, n.popper),
                t.styles = n,
                t.elements.arrow && Object.assign(t.elements.arrow.style, n.arrow),
                function() {
                    Object.keys(t.elements).forEach(function(e) {
                        var r = t.elements[e]
                          , o = t.attributes[e] || {}
                          , i = Object.keys(t.styles.hasOwnProperty(e) ? t.styles[e] : n[e]).reduce(function(e, t) {
                            return e[t] = "",
                            e
                        }, {});
                        isHTMLElement(r) && getNodeName(r) && (Object.assign(r.style, i),
                        Object.keys(o).forEach(function(e) {
                            r.removeAttribute(e)
                        }))
                    })
                }
            }
            var applyStyles$1 = {
                name: "applyStyles",
                enabled: !0,
                phase: "write",
                fn: applyStyles,
                effect: effect$1,
                requires: ["computeStyles"]
            };
            function distanceAndSkiddingToXY(e, t, n) {
                var r = getBasePlacement(e)
                  , o = [left, top].indexOf(r) >= 0 ? -1 : 1
                  , i = "function" == typeof n ? n(Object.assign({}, t, {
                    placement: e
                })) : n
                  , a = i[0]
                  , s = i[1];
                return a = a || 0,
                s = (s || 0) * o,
                [left, right].indexOf(r) >= 0 ? {
                    x: s,
                    y: a
                } : {
                    x: a,
                    y: s
                }
            }
            function offset(e) {
                var t = e.state
                  , n = e.options
                  , r = e.name
                  , o = n.offset
                  , i = void 0 === o ? [0, 0] : o
                  , a = placements.reduce(function(e, n) {
                    return e[n] = distanceAndSkiddingToXY(n, t.rects, i),
                    e
                }, {})
                  , s = a[t.placement]
                  , f = s.x
                  , l = s.y;
                null != t.modifiersData.popperOffsets && (t.modifiersData.popperOffsets.x += f,
                t.modifiersData.popperOffsets.y += l),
                t.modifiersData[r] = a
            }
            var offset$1 = {
                name: "offset",
                enabled: !0,
                phase: "main",
                requires: ["popperOffsets"],
                fn: offset
            }
              , hash$1 = {
                left: "right",
                right: "left",
                bottom: "top",
                top: "bottom"
            };
            function getOppositePlacement(e) {
                return e.replace(/left|right|bottom|top/g, function(e) {
                    return hash$1[e]
                })
            }
            var hash = {
                start: "end",
                end: "start"
            };
            function getOppositeVariationPlacement(e) {
                return e.replace(/start|end/g, function(e) {
                    return hash[e]
                })
            }
            function computeAutoPlacement(e, t) {
                void 0 === t && (t = {});
                var n = t
                  , r = n.placement
                  , o = n.boundary
                  , i = n.rootBoundary
                  , a = n.padding
                  , s = n.flipVariations
                  , f = n.allowedAutoPlacements
                  , l = void 0 === f ? placements : f
                  , p = getVariation(r)
                  , c = p ? s ? variationPlacements : variationPlacements.filter(function(e) {
                    return getVariation(e) === p
                }) : basePlacements
                  , d = c.filter(function(e) {
                    return l.indexOf(e) >= 0
                });
                0 === d.length && (d = c,
                "production" !== process.env.NODE_ENV && console.error(["Popper: The `allowedAutoPlacements` option did not allow any", "placements. Ensure the `placement` option matches the variation", "of the allowed placements.", 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(" ")));
                var u = d.reduce(function(t, n) {
                    return t[n] = detectOverflow(e, {
                        placement: n,
                        boundary: o,
                        rootBoundary: i,
                        padding: a
                    })[getBasePlacement(n)],
                    t
                }, {});
                return Object.keys(u).sort(function(e, t) {
                    return u[e] - u[t]
                })
            }
            function getExpandedFallbackPlacements(e) {
                if (getBasePlacement(e) === auto)
                    return [];
                var t = getOppositePlacement(e);
                return [getOppositeVariationPlacement(e), t, getOppositeVariationPlacement(t)]
            }
            function flip(e) {
                var t = e.state
                  , n = e.options
                  , r = e.name;
                if (!t.modifiersData[r]._skip) {
                    for (var o = n.mainAxis, i = void 0 === o || o, a = n.altAxis, s = void 0 === a || a, f = n.fallbackPlacements, l = n.padding, p = n.boundary, c = n.rootBoundary, d = n.altBoundary, u = n.flipVariations, m = void 0 === u || u, g = n.allowedAutoPlacements, h = t.options.placement, v = getBasePlacement(h), y = f || (v === h || !m ? [getOppositePlacement(h)] : getExpandedFallbackPlacements(h)), b = [h].concat(y).reduce(function(e, n) {
                        return e.concat(getBasePlacement(n) === auto ? computeAutoPlacement(t, {
                            placement: n,
                            boundary: p,
                            rootBoundary: c,
                            padding: l,
                            flipVariations: m,
                            allowedAutoPlacements: g
                        }) : n)
                    }, []), O = t.rects.reference, w = t.rects.popper, E = new Map, x = !0, P = b[0], S = 0; S < b.length; S++) {
                        var R = b[S]
                          , D = getBasePlacement(R)
                          , N = getVariation(R) === start
                          , M = [top, bottom].indexOf(D) >= 0
                          , L = M ? "width" : "height"
                          , T = detectOverflow(t, {
                            placement: R,
                            boundary: p,
                            rootBoundary: c,
                            altBoundary: d,
                            padding: l
                        })
                          , I = M ? N ? right : left : N ? bottom : top;
                        O[L] > w[L] && (I = getOppositePlacement(I));
                        var A = getOppositePlacement(I)
                          , C = [];
                        if (i && C.push(T[D] <= 0),
                        s && C.push(T[I] <= 0, T[A] <= 0),
                        C.every(function(e) {
                            return e
                        })) {
                            P = R,
                            x = !1;
                            break
                        }
                        E.set(R, C)
                    }
                    if (x)
                        for (var j = function(e) {
                            var t = b.find(function(t) {
                                var n = E.get(t);
                                if (n)
                                    return n.slice(0, e).every(function(e) {
                                        return e
                                    })
                            });
                            if (t)
                                return P = t,
                                "break"
                        }, B = m ? 3 : 1; B > 0; B--) {
                            if ("break" === j(B))
                                break
                        }
                    t.placement !== P && (t.modifiersData[r]._skip = !0,
                    t.placement = P,
                    t.reset = !0)
                }
            }
            var flip$1 = {
                name: "flip",
                enabled: !0,
                phase: "main",
                fn: flip,
                requiresIfExists: ["offset"],
                data: {
                    _skip: !1
                }
            };
            function getAltAxis(e) {
                return "x" === e ? "y" : "x"
            }
            function within(e, t, n) {
                return max(e, min(t, n))
            }
            function withinMaxClamp(e, t, n) {
                var r = within(e, t, n);
                return r > n ? n : r
            }
            function preventOverflow(e) {
                var t = e.state
                  , n = e.options
                  , r = e.name
                  , o = n.mainAxis
                  , i = void 0 === o || o
                  , a = n.altAxis
                  , s = void 0 !== a && a
                  , f = n.boundary
                  , l = n.rootBoundary
                  , p = n.altBoundary
                  , c = n.padding
                  , d = n.tether
                  , u = void 0 === d || d
                  , m = n.tetherOffset
                  , g = void 0 === m ? 0 : m
                  , h = detectOverflow(t, {
                    boundary: f,
                    rootBoundary: l,
                    padding: c,
                    altBoundary: p
                })
                  , v = getBasePlacement(t.placement)
                  , y = getVariation(t.placement)
                  , b = !y
                  , O = getMainAxisFromPlacement(v)
                  , w = getAltAxis(O)
                  , E = t.modifiersData.popperOffsets
                  , x = t.rects.reference
                  , P = t.rects.popper
                  , S = "function" == typeof g ? g(Object.assign({}, t.rects, {
                    placement: t.placement
                })) : g
                  , R = "number" == typeof S ? {
                    mainAxis: S,
                    altAxis: S
                } : Object.assign({
                    mainAxis: 0,
                    altAxis: 0
                }, S)
                  , D = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null
                  , N = {
                    x: 0,
                    y: 0
                };
                if (E) {
                    if (i) {
                        var M, L = "y" === O ? top : left, T = "y" === O ? bottom : right, I = "y" === O ? "height" : "width", A = E[O], C = A + h[L], j = A - h[T], B = u ? -P[I] / 2 : 0, V = y === start ? x[I] : P[I], _ = y === start ? -P[I] : -x[I], W = t.elements.arrow, k = u && W ? getLayoutRect(W) : {
                            width: 0,
                            height: 0
                        }, H = t.modifiersData["arrow#persistent"] ? t.modifiersData["arrow#persistent"].padding : getFreshSideObject(), $ = H[L], F = H[T], q = within(0, x[I], k[I]), G = b ? x[I] / 2 - B - q - $ - R.mainAxis : V - q - $ - R.mainAxis, U = b ? -x[I] / 2 + B + q + F + R.mainAxis : _ + q + F + R.mainAxis, X = t.elements.arrow && getOffsetParent(t.elements.arrow), Y = X ? "y" === O ? X.clientTop || 0 : X.clientLeft || 0 : 0, z = null != (M = null == D ? void 0 : D[O]) ? M : 0, J = A + U - z, K = within(u ? min(C, A + G - z - Y) : C, A, u ? max(j, J) : j);
                        E[O] = K,
                        N[O] = K - A
                    }
                    if (s) {
                        var Q, Z = "x" === O ? top : left, ee = "x" === O ? bottom : right, te = E[w], ne = "y" === w ? "height" : "width", re = te + h[Z], oe = te - h[ee], ie = -1 !== [top, left].indexOf(v), ae = null != (Q = null == D ? void 0 : D[w]) ? Q : 0, se = ie ? re : te - x[ne] - P[ne] - ae + R.altAxis, fe = ie ? te + x[ne] + P[ne] - ae - R.altAxis : oe, le = u && ie ? withinMaxClamp(se, te, fe) : within(u ? se : re, te, u ? fe : oe);
                        E[w] = le,
                        N[w] = le - te
                    }
                    t.modifiersData[r] = N
                }
            }
            var preventOverflow$1 = {
                name: "preventOverflow",
                enabled: !0,
                phase: "main",
                fn: preventOverflow,
                requiresIfExists: ["offset"]
            }
              , toPaddingObject = function(e, t) {
                return mergePaddingObject("number" != typeof (e = "function" == typeof e ? e(Object.assign({}, t.rects, {
                    placement: t.placement
                })) : e) ? e : expandToHashMap(e, basePlacements))
            };
            function arrow(e) {
                var t, n = e.state, r = e.name, o = e.options, i = n.elements.arrow, a = n.modifiersData.popperOffsets, s = getBasePlacement(n.placement), f = getMainAxisFromPlacement(s), l = [left, right].indexOf(s) >= 0 ? "height" : "width";
                if (i && a) {
                    var p = toPaddingObject(o.padding, n)
                      , c = getLayoutRect(i)
                      , d = "y" === f ? top : left
                      , u = "y" === f ? bottom : right
                      , m = n.rects.reference[l] + n.rects.reference[f] - a[f] - n.rects.popper[l]
                      , g = a[f] - n.rects.reference[f]
                      , h = getOffsetParent(i)
                      , v = h ? "y" === f ? h.clientHeight || 0 : h.clientWidth || 0 : 0
                      , y = m / 2 - g / 2
                      , b = p[d]
                      , O = v - c[l] - p[u]
                      , w = v / 2 - c[l] / 2 + y
                      , E = within(b, w, O)
                      , x = f;
                    n.modifiersData[r] = ((t = {})[x] = E,
                    t.centerOffset = E - w,
                    t)
                }
            }
            function effect(e) {
                var t = e.state
                  , n = e.options.element
                  , r = void 0 === n ? "[data-popper-arrow]" : n;
                null != r && ("string" != typeof r || (r = t.elements.popper.querySelector(r))) && ("production" !== process.env.NODE_ENV && (isHTMLElement(r) || console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', "To use an SVG arrow, wrap it in an HTMLElement that will be used as", "the arrow."].join(" "))),
                contains(t.elements.popper, r) ? t.elements.arrow = r : "production" !== process.env.NODE_ENV && console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', "element."].join(" ")))
            }
            var arrow$1 = {
                name: "arrow",
                enabled: !0,
                phase: "main",
                fn: arrow,
                effect: effect,
                requires: ["popperOffsets"],
                requiresIfExists: ["preventOverflow"]
            };
            function getSideOffsets(e, t, n) {
                return void 0 === n && (n = {
                    x: 0,
                    y: 0
                }),
                {
                    top: e.top - t.height - n.y,
                    right: e.right - t.width + n.x,
                    bottom: e.bottom - t.height + n.y,
                    left: e.left - t.width - n.x
                }
            }
            function isAnySideFullyClipped(e) {
                return [top, right, bottom, left].some(function(t) {
                    return e[t] >= 0
                })
            }
            function hide(e) {
                var t = e.state
                  , n = e.name
                  , r = t.rects.reference
                  , o = t.rects.popper
                  , i = t.modifiersData.preventOverflow
                  , a = detectOverflow(t, {
                    elementContext: "reference"
                })
                  , s = detectOverflow(t, {
                    altBoundary: !0
                })
                  , f = getSideOffsets(a, r)
                  , l = getSideOffsets(s, o, i)
                  , p = isAnySideFullyClipped(f)
                  , c = isAnySideFullyClipped(l);
                t.modifiersData[n] = {
                    referenceClippingOffsets: f,
                    popperEscapeOffsets: l,
                    isReferenceHidden: p,
                    hasPopperEscaped: c
                },
                t.attributes.popper = Object.assign({}, t.attributes.popper, {
                    "data-popper-reference-hidden": p,
                    "data-popper-escaped": c
                })
            }
            var hide$1 = {
                name: "hide",
                enabled: !0,
                phase: "main",
                requiresIfExists: ["preventOverflow"],
                fn: hide
            }
              , defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1]
              , createPopper$1 = popperGenerator({
                defaultModifiers: defaultModifiers$1
            })
              , defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1]
              , createPopper = popperGenerator({
                defaultModifiers: defaultModifiers
            });
            exports.applyStyles = applyStyles$1,
            exports.arrow = arrow$1,
            exports.computeStyles = computeStyles$1,
            exports.createPopper = createPopper,
            exports.createPopperLite = createPopper$1,
            exports.defaultModifiers = defaultModifiers,
            exports.detectOverflow = detectOverflow,
            exports.eventListeners = eventListeners,
            exports.flip = flip$1,
            exports.hide = hide$1,
            exports.offset = offset$1,
            exports.popperGenerator = popperGenerator,
            exports.popperOffsets = popperOffsets$1,
            exports.preventOverflow = preventOverflow$1;

        }
        ).call(this, require('_process'))
    }
    , {
        "_process": 41
    }],
    21: [function(require, module, exports) {
        !function(t) {
            "use strict";
            var e = function(e, o) {
                this.options = o,
                this.$body = t(document.body),
                this.$element = t(e),
                this.$dialog = this.$element.find(".modal-dialog"),
                this.$backdrop = null,
                this.isShown = null,
                this.originalBodyPad = null,
                this.scrollbarWidth = 0,
                this.ignoreBackdropClick = !1,
                this.options.remote && this.$element.find(".modal-content").load(this.options.remote, t.proxy(function() {
                    this.$element.trigger("loaded.bs.modal")
                }, this))
            };
            function o(o, i) {
                return this.each(function() {
                    var s = t(this)
                      , n = s.data("bs.modal")
                      , a = t.extend({}, e.DEFAULTS, s.data(), "object" == typeof o && o);
                    n || s.data("bs.modal", n = new e(this,a)),
                    "string" == typeof o ? n[o](i) : a.show && n.show(i)
                })
            }
            e.VERSION = "3.3.5",
            e.TRANSITION_DURATION = 300,
            e.BACKDROP_TRANSITION_DURATION = 150,
            e.DEFAULTS = {
                backdrop: !0,
                keyboard: !0,
                show: !0
            },
            e.prototype.toggle = function(t) {
                return this.isShown ? this.hide() : this.show(t)
            }
            ,
            e.prototype.show = function(o) {
                var i = this
                  , s = t.Event("show.bs.modal", {
                    relatedTarget: o
                });
                this.$element.trigger(s),
                this.isShown || s.isDefaultPrevented() || (this.isShown = !0,
                this.checkScrollbar(),
                this.setScrollbar(),
                this.$body.addClass("modal-open"),
                this.escape(),
                this.resize(),
                this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', t.proxy(this.hide, this)),
                this.$dialog.on("mousedown.dismiss.bs.modal", function() {
                    i.$element.one("mouseup.dismiss.bs.modal", function(e) {
                        t(e.target).is(i.$element) && (i.ignoreBackdropClick = !0)
                    })
                }),
                this.backdrop(function() {
                    var s = t.support.transition && i.$element.hasClass("fade");
                    i.$element.parent().length || i.$element.appendTo(i.$body),
                    i.$element.show().scrollTop(0),
                    i.adjustDialog(),
                    s && i.$element[0].offsetWidth,
                    i.$element.addClass("in"),
                    i.enforceFocus();
                    var n = t.Event("shown.bs.modal", {
                        relatedTarget: o
                    });
                    s ? i.$dialog.one("bsTransitionEnd", function() {
                        i.$element.trigger("focus").trigger(n)
                    }).emulateTransitionEnd(e.TRANSITION_DURATION) : i.$element.trigger("focus").trigger(n)
                }))
            }
            ,
            e.prototype.hide = function(o) {
                o && o.preventDefault(),
                o = t.Event("hide.bs.modal"),
                this.$element.trigger(o),
                this.isShown && !o.isDefaultPrevented() && (this.isShown = !1,
                this.escape(),
                this.resize(),
                t(document).off("focusin.bs.modal"),
                this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),
                this.$dialog.off("mousedown.dismiss.bs.modal"),
                t.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", t.proxy(this.hideModal, this)).emulateTransitionEnd(e.TRANSITION_DURATION) : this.hideModal())
            }
            ,
            e.prototype.enforceFocus = function() {
                t(document).off("focusin.bs.modal").on("focusin.bs.modal", t.proxy(function(t) {
                    this.$element[0] === t.target || this.$element.has(t.target).length || this.$element.trigger("focus")
                }, this))
            }
            ,
            e.prototype.escape = function() {
                this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", t.proxy(function(t) {
                    27 == t.which && this.hide()
                }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
            }
            ,
            e.prototype.resize = function() {
                this.isShown ? t(window).on("resize.bs.modal", t.proxy(this.handleUpdate, this)) : t(window).off("resize.bs.modal")
            }
            ,
            e.prototype.hideModal = function() {
                var t = this;
                this.$element.hide(),
                this.backdrop(function() {
                    t.$body.removeClass("modal-open"),
                    t.resetAdjustments(),
                    t.resetScrollbar(),
                    t.$element.trigger("hidden.bs.modal")
                })
            }
            ,
            e.prototype.removeBackdrop = function() {
                this.$backdrop && this.$backdrop.remove(),
                this.$backdrop = null
            }
            ,
            e.prototype.backdrop = function(o) {
                var i = this
                  , s = this.$element.hasClass("fade") ? "fade" : "";
                if (this.isShown && this.options.backdrop) {
                    var n = t.support.transition && s;
                    if (this.$backdrop = t(document.createElement("div")).addClass("modal-backdrop " + s).appendTo(this.$body),
                    this.$element.on("click.dismiss.bs.modal", t.proxy(function(t) {
                        this.ignoreBackdropClick ? this.ignoreBackdropClick = !1 : t.target === t.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide())
                    }, this)),
                    n && this.$backdrop[0].offsetWidth,
                    this.$backdrop.addClass("in"),
                    !o)
                        return;
                    n ? this.$backdrop.one("bsTransitionEnd", o).emulateTransitionEnd(e.BACKDROP_TRANSITION_DURATION) : o()
                } else if (!this.isShown && this.$backdrop) {
                    this.$backdrop.removeClass("in");
                    var a = function() {
                        i.removeBackdrop(),
                        o && o()
                    };
                    t.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", a).emulateTransitionEnd(e.BACKDROP_TRANSITION_DURATION) : a()
                } else
                    o && o()
            }
            ,
            e.prototype.handleUpdate = function() {
                this.adjustDialog()
            }
            ,
            e.prototype.adjustDialog = function() {
                var t = this.$element[0].scrollHeight > document.documentElement.clientHeight;
                this.$element.css({
                    paddingLeft: !this.bodyIsOverflowing && t ? this.scrollbarWidth : "",
                    paddingRight: this.bodyIsOverflowing && !t ? this.scrollbarWidth : ""
                })
            }
            ,
            e.prototype.resetAdjustments = function() {
                this.$element.css({
                    paddingLeft: "",
                    paddingRight: ""
                })
            }
            ,
            e.prototype.checkScrollbar = function() {
                var t = window.innerWidth;
                if (!t) {
                    var e = document.documentElement.getBoundingClientRect();
                    t = e.right - Math.abs(e.left)
                }
                this.bodyIsOverflowing = document.body.clientWidth < t,
                this.scrollbarWidth = this.measureScrollbar()
            }
            ,
            e.prototype.setScrollbar = function() {
                var t = parseInt(this.$body.css("padding-right") || 0, 10);
                this.originalBodyPad = document.body.style.paddingRight || "",
                this.bodyIsOverflowing && this.$body.css("padding-right", t + this.scrollbarWidth)
            }
            ,
            e.prototype.resetScrollbar = function() {
                this.$body.css("padding-right", this.originalBodyPad)
            }
            ,
            e.prototype.measureScrollbar = function() {
                var t = document.createElement("div");
                t.className = "modal-scrollbar-measure",
                this.$body.append(t);
                var e = t.offsetWidth - t.clientWidth;
                return this.$body[0].removeChild(t),
                e
            }
            ;
            var i = t.fn.modal;
            t.fn.modal = o,
            t.fn.modal.Constructor = e,
            t.fn.modal.noConflict = function() {
                return t.fn.modal = i,
                this
            }
            ,
            t(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(e) {
                var i = t(this)
                  , s = i.attr("href")
                  , n = t(i.attr("data-target") || s && s.replace(/.*(?=#[^\s]+$)/, ""))
                  , a = n.data("bs.modal") ? "toggle" : t.extend({
                    remote: !/#/.test(s) && s
                }, n.data(), i.data());
                i.is("a") && e.preventDefault(),
                n.one("show.bs.modal", function(t) {
                    t.isDefaultPrevented() || n.one("hidden.bs.modal", function() {
                        i.is(":visible") && i.trigger("focus")
                    })
                }),
                o.call(n, a, this)
            })
        }(jQuery);

    }
    , {}],
    22: [function(require, module, exports) {
        !function(n) {
            "use strict";
            n.fn.emulateTransitionEnd = function(t) {
                var i = !1
                  , r = this;
                n(this).one("bsTransitionEnd", function() {
                    i = !0
                });
                return setTimeout(function() {
                    i || n(r).trigger(n.support.transition.end)
                }, t),
                this
            }
            ,
            n(function() {
                n.support.transition = function() {
                    var n = document.createElement("bootstrap")
                      , t = {
                        WebkitTransition: "webkitTransitionEnd",
                        MozTransition: "transitionend",
                        OTransition: "oTransitionEnd otransitionend",
                        transition: "transitionend"
                    };
                    for (var i in t)
                        if (void 0 !== n.style[i])
                            return {
                                end: t[i]
                            };
                    return !1
                }(),
                n.support.transition && (n.event.special.bsTransitionEnd = {
                    bindType: n.support.transition.end,
                    delegateType: n.support.transition.end,
                    handle: function(t) {
                        if (n(t.target).is(this))
                            return t.handleObj.handler.apply(this, arguments)
                    }
                })
            })
        }(jQuery);

    }
    , {}],
    23: [function(require, module, exports) {
        !function(e) {
            if ("object" == typeof exports && "object" == typeof module)
                module.exports = e();
            else {
                if ("function" == typeof define && define.amd)
                    return define([], e);
                this.CodeMirror = e()
            }
        }(function() {
            "use strict";
            var e = /gecko\/\d/i.test(navigator.userAgent)
              , t = /MSIE \d/.test(navigator.userAgent)
              , r = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent)
              , n = t || r
              , i = n && (t ? document.documentMode || 6 : r[1])
              , o = /WebKit\//.test(navigator.userAgent)
              , l = o && /Qt\/\d+\.\d+/.test(navigator.userAgent)
              , s = /Chrome\//.test(navigator.userAgent)
              , a = /Opera\//.test(navigator.userAgent)
              , u = /Apple Computer/.test(navigator.vendor)
              , c = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent)
              , f = /PhantomJS/.test(navigator.userAgent)
              , h = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent)
              , d = h || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent)
              , p = h || /Mac/.test(navigator.platform)
              , g = /win/i.test(navigator.platform)
              , v = a && navigator.userAgent.match(/Version\/(\d*\.\d*)/);
            v && (v = Number(v[1])),
            v && v >= 15 && (a = !1,
            o = !0);
            var m = p && (l || a && (null == v || v < 12.11))
              , y = e || n && i >= 9
              , b = !1
              , w = !1;
            function x(e, t) {
                if (!(this instanceof x))
                    return new x(e,t);
                this.options = t = t ? po(t) : {},
                po(Xr, t, !1),
                H(t);
                var r = t.value;
                "string" == typeof r && (r = new fi(r,t.mode,null,t.lineSeparator)),
                this.doc = r;
                var l = new x.inputStyles[t.inputStyle](this)
                  , s = this.display = new C(e,r,l);
                s.wrapper.CodeMirror = this,
                A(this),
                M(this),
                t.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap"),
                t.autofocus && !d && s.input.focus(),
                z(this),
                this.state = {
                    keyMaps: [],
                    overlays: [],
                    modeGen: 0,
                    overwrite: !1,
                    delayingBlurEvent: !1,
                    focused: !1,
                    suppressEdits: !1,
                    pasteIncoming: !1,
                    cutIncoming: !1,
                    selectingText: !1,
                    draggingText: !1,
                    highlight: new ro,
                    keySeq: null,
                    specialChars: null
                };
                var c = this;
                for (var f in n && i < 11 && setTimeout(function() {
                    c.display.input.reset(!0)
                }, 20),
                function(e) {
                    var t = e.display;
                    Gi(t.scroller, "mousedown", Vt(e, nr)),
                    Gi(t.scroller, "dblclick", n && i < 11 ? Vt(e, function(t) {
                        if (!_i(e, t)) {
                            var r = rr(e, t);
                            if (r && !or(e, t) && !tr(e.display, t)) {
                                Ei(t);
                                var n = e.findWordAt(r);
                                Fe(e.doc, n.anchor, n.head)
                            }
                        }
                    }) : function(t) {
                        _i(e, t) || Ei(t)
                    }
                    );
                    y || Gi(t.scroller, "contextmenu", function(t) {
                        Tr(e, t)
                    });
                    var r, o = {
                        end: 0
                    };
                    function l() {
                        t.activeTouch && (r = setTimeout(function() {
                            t.activeTouch = null
                        }, 1e3),
                        (o = t.activeTouch).end = +new Date)
                    }
                    function s(e, t) {
                        if (null == t.left)
                            return !0;
                        var r = t.left - e.left
                          , n = t.top - e.top;
                        return r * r + n * n > 400
                    }
                    Gi(t.scroller, "touchstart", function(e) {
                        if (!function(e) {
                            if (1 != e.touches.length)
                                return !1;
                            var t = e.touches[0];
                            return t.radiusX <= 1 && t.radiusY <= 1
                        }(e)) {
                            clearTimeout(r);
                            var n = +new Date;
                            t.activeTouch = {
                                start: n,
                                moved: !1,
                                prev: n - o.end <= 300 ? o : null
                            },
                            1 == e.touches.length && (t.activeTouch.left = e.touches[0].pageX,
                            t.activeTouch.top = e.touches[0].pageY)
                        }
                    }),
                    Gi(t.scroller, "touchmove", function() {
                        t.activeTouch && (t.activeTouch.moved = !0)
                    }),
                    Gi(t.scroller, "touchend", function(r) {
                        var n = t.activeTouch;
                        if (n && !tr(t, r) && null != n.left && !n.moved && new Date - n.start < 300) {
                            var i, o = e.coordsChar(t.activeTouch, "page");
                            i = !n.prev || s(n, n.prev) ? new Oe(o,o) : !n.prev.prev || s(n, n.prev.prev) ? e.findWordAt(o) : new Oe(ce(o.line, 0),Ee(e.doc, ce(o.line + 1, 0))),
                            e.setSelection(i.anchor, i.head),
                            e.focus(),
                            Ei(r)
                        }
                        l()
                    }),
                    Gi(t.scroller, "touchcancel", l),
                    Gi(t.scroller, "scroll", function() {
                        t.scroller.clientHeight && (ur(e, t.scroller.scrollTop),
                        cr(e, t.scroller.scrollLeft, !0),
                        Vi(e, "scroll", e))
                    }),
                    Gi(t.scroller, "mousewheel", function(t) {
                        pr(e, t)
                    }),
                    Gi(t.scroller, "DOMMouseScroll", function(t) {
                        pr(e, t)
                    }),
                    Gi(t.wrapper, "scroll", function() {
                        t.wrapper.scrollTop = t.wrapper.scrollLeft = 0
                    }),
                    t.dragFunctions = {
                        enter: function(t) {
                            _i(e, t) || Fi(t)
                        },
                        over: function(t) {
                            _i(e, t) || (!function(e, t) {
                                var r = rr(e, t);
                                if (!r)
                                    return;
                                var n = document.createDocumentFragment();
                                Ze(e, r, n),
                                e.display.dragCursor || (e.display.dragCursor = So("div", null, "CodeMirror-cursors CodeMirror-dragcursors"),
                                e.display.lineSpace.insertBefore(e.display.dragCursor, e.display.cursorDiv));
                                To(e.display.dragCursor, n)
                            }(e, t),
                            Fi(t))
                        },
                        start: function(t) {
                            !function(e, t) {
                                if (n && (!e.state.draggingText || +new Date - lr < 100))
                                    return void Fi(t);
                                if (_i(e, t) || tr(e.display, t))
                                    return;
                                if (t.dataTransfer.setData("Text", e.getSelection()),
                                t.dataTransfer.setDragImage && !u) {
                                    var r = So("img", null, null, "position: fixed; left: 0; top: 0;");
                                    r.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
                                    a && (r.width = r.height = 1,
                                    e.display.wrapper.appendChild(r),
                                    r._top = r.offsetTop),
                                    t.dataTransfer.setDragImage(r, 0, 0),
                                    a && r.parentNode.removeChild(r)
                                }
                            }(e, t)
                        },
                        drop: Vt(e, sr),
                        leave: function() {
                            ar(e)
                        }
                    };
                    var c = t.input.getField();
                    Gi(c, "keyup", function(t) {
                        xr.call(e, t)
                    }),
                    Gi(c, "keydown", Vt(e, wr)),
                    Gi(c, "keypress", Vt(e, Cr)),
                    Gi(c, "focus", go(Sr, e)),
                    Gi(c, "blur", go(Lr, e))
                }(this),
                function() {
                    if (Ho)
                        return;
                    Gi(window, "resize", function() {
                        null == e && (e = setTimeout(function() {
                            e = null,
                            Do(er)
                        }, 100))
                    }),
                    Gi(window, "blur", function() {
                        Do(Lr)
                    }),
                    Ho = !0;
                    var e
                }(),
                It(this),
                this.curOp.forceUpdate = !0,
                gi(this, r),
                t.autofocus && !d || c.hasFocus() ? setTimeout(go(Sr, this), 20) : Lr(this),
                _r)
                    _r.hasOwnProperty(f) && _r[f](this, t[f], $r);
                U(this),
                t.finishInit && t.finishInit(this);
                for (var h = 0; h < Jr.length; ++h)
                    Jr[h](this);
                zt(this),
                o && t.lineWrapping && "optimizelegibility" == getComputedStyle(s.lineDiv).textRendering && (s.lineDiv.style.textRendering = "auto")
            }
            function C(t, r, l) {
                var s = this;
                this.input = l,
                s.scrollbarFiller = So("div", null, "CodeMirror-scrollbar-filler"),
                s.scrollbarFiller.setAttribute("cm-not-content", "true"),
                s.gutterFiller = So("div", null, "CodeMirror-gutter-filler"),
                s.gutterFiller.setAttribute("cm-not-content", "true"),
                s.lineDiv = So("div", null, "CodeMirror-code"),
                s.selectionDiv = So("div", null, null, "position: relative; z-index: 1"),
                s.cursorDiv = So("div", null, "CodeMirror-cursors"),
                s.measure = So("div", null, "CodeMirror-measure"),
                s.lineMeasure = So("div", null, "CodeMirror-measure"),
                s.lineSpace = So("div", [s.measure, s.lineMeasure, s.selectionDiv, s.cursorDiv, s.lineDiv], null, "position: relative; outline: none"),
                s.mover = So("div", [So("div", [s.lineSpace], "CodeMirror-lines")], null, "position: relative"),
                s.sizer = So("div", [s.mover], "CodeMirror-sizer"),
                s.sizerWidth = null,
                s.heightForcer = So("div", null, null, "position: absolute; height: " + Zi + "px; width: 1px;"),
                s.gutters = So("div", null, "CodeMirror-gutters"),
                s.lineGutter = null,
                s.scroller = So("div", [s.sizer, s.heightForcer, s.gutters], "CodeMirror-scroll"),
                s.scroller.setAttribute("tabIndex", "-1"),
                s.wrapper = So("div", [s.scrollbarFiller, s.gutterFiller, s.scroller], "CodeMirror"),
                n && i < 8 && (s.gutters.style.zIndex = -1,
                s.scroller.style.paddingRight = 0),
                o || e && d || (s.scroller.draggable = !0),
                t && (t.appendChild ? t.appendChild(s.wrapper) : t(s.wrapper)),
                s.viewFrom = s.viewTo = r.first,
                s.reportedViewFrom = s.reportedViewTo = r.first,
                s.view = [],
                s.renderedView = null,
                s.externalMeasured = null,
                s.viewOffset = 0,
                s.lastWrapHeight = s.lastWrapWidth = 0,
                s.updateLineNumbers = null,
                s.nativeBarWidth = s.barHeight = s.barWidth = 0,
                s.scrollbarsClipped = !1,
                s.lineNumWidth = s.lineNumInnerWidth = s.lineNumChars = null,
                s.alignWidgets = !1,
                s.cachedCharWidth = s.cachedTextHeight = s.cachedPaddingH = null,
                s.maxLine = null,
                s.maxLineLength = 0,
                s.maxLineChanged = !1,
                s.wheelDX = s.wheelDY = s.wheelStartX = s.wheelStartY = null,
                s.shift = !1,
                s.selForContextMenu = null,
                s.activeTouch = null,
                l.init(s)
            }
            function S(e) {
                e.doc.mode = x.getMode(e.options, e.doc.modeOption),
                L(e)
            }
            function L(e) {
                e.doc.iter(function(e) {
                    e.stateAfter && (e.stateAfter = null),
                    e.styles && (e.styles = null)
                }),
                e.doc.frontier = e.doc.first,
                et(e, 100),
                e.state.modeGen++,
                e.curOp && Yt(e)
            }
            function T(e) {
                var t = Wt(e.display)
                  , r = e.options.lineWrapping
                  , n = r && Math.max(5, e.display.scroller.clientWidth / Ot(e.display) - 3);
                return function(i) {
                    if (In(e.doc, i))
                        return 0;
                    var o = 0;
                    if (i.widgets)
                        for (var l = 0; l < i.widgets.length; l++)
                            i.widgets[l].height && (o += i.widgets[l].height);
                    return r ? o + (Math.ceil(i.text.length / n) || 1) * t : o + t
                }
            }
            function k(e) {
                var t = e.doc
                  , r = T(e);
                t.iter(function(e) {
                    var t = r(e);
                    t != e.height && bi(e, t)
                })
            }
            function M(e) {
                e.display.wrapper.className = e.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + e.options.theme.replace(/(^|\s)\s*/g, " cm-s-"),
                bt(e)
            }
            function N(e) {
                A(e),
                Yt(e),
                setTimeout(function() {
                    G(e)
                }, 20)
            }
            function A(e) {
                var t = e.display.gutters
                  , r = e.options.gutters;
                Lo(t);
                for (var n = 0; n < r.length; ++n) {
                    var i = r[n]
                      , o = t.appendChild(So("div", null, "CodeMirror-gutter " + i));
                    "CodeMirror-linenumbers" == i && (e.display.lineGutter = o,
                    o.style.width = (e.display.lineNumWidth || 1) + "px")
                }
                t.style.display = n ? "" : "none",
                W(e)
            }
            function W(e) {
                var t = e.display.gutters.offsetWidth;
                e.display.sizer.style.marginLeft = t + "px"
            }
            function O(e) {
                if (0 == e.height)
                    return 0;
                for (var t, r = e.text.length, n = e; t = Wn(n); ) {
                    n = (i = t.find(0, !0)).from.line,
                    r += i.from.ch - i.to.ch
                }
                for (n = e; t = On(n); ) {
                    var i = t.find(0, !0);
                    r -= n.text.length - i.from.ch,
                    r += (n = i.to.line).text.length - i.to.ch
                }
                return r
            }
            function D(e) {
                var t = e.display
                  , r = e.doc;
                t.maxLine = vi(r, r.first),
                t.maxLineLength = O(t.maxLine),
                t.maxLineChanged = !0,
                r.iter(function(e) {
                    var r = O(e);
                    r > t.maxLineLength && (t.maxLineLength = r,
                    t.maxLine = e)
                })
            }
            function H(e) {
                var t = uo(e.gutters, "CodeMirror-linenumbers");
                -1 == t && e.lineNumbers ? e.gutters = e.gutters.concat(["CodeMirror-linenumbers"]) : t > -1 && !e.lineNumbers && (e.gutters = e.gutters.slice(0),
                e.gutters.splice(t, 1))
            }
            function P(e) {
                var t = e.display
                  , r = t.gutters.offsetWidth
                  , n = Math.round(e.doc.height + it(e.display));
                return {
                    clientHeight: t.scroller.clientHeight,
                    viewHeight: t.wrapper.clientHeight,
                    scrollWidth: t.scroller.scrollWidth,
                    clientWidth: t.scroller.clientWidth,
                    viewWidth: t.wrapper.clientWidth,
                    barLeft: e.options.fixedGutter ? r : 0,
                    docHeight: n,
                    scrollHeight: n + lt(e) + t.barHeight,
                    nativeBarWidth: t.nativeBarWidth,
                    gutterWidth: r
                }
            }
            function E(e, t, r) {
                this.cm = r;
                var o = this.vert = So("div", [So("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar")
                  , l = this.horiz = So("div", [So("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
                e(o),
                e(l),
                Gi(o, "scroll", function() {
                    o.clientHeight && t(o.scrollTop, "vertical")
                }),
                Gi(l, "scroll", function() {
                    l.clientWidth && t(l.scrollLeft, "horizontal")
                }),
                this.checkedOverlay = !1,
                n && i < 8 && (this.horiz.style.minHeight = this.vert.style.minWidth = "18px")
            }
            function I() {}
            function z(e) {
                e.display.scrollbars && (e.display.scrollbars.clear(),
                e.display.scrollbars.addClass && Ao(e.display.wrapper, e.display.scrollbars.addClass)),
                e.display.scrollbars = new x.scrollbarModel[e.options.scrollbarStyle](function(t) {
                    e.display.wrapper.insertBefore(t, e.display.scrollbarFiller),
                    Gi(t, "mousedown", function() {
                        e.state.focused && setTimeout(function() {
                            e.display.input.focus()
                        }, 0)
                    }),
                    t.setAttribute("cm-not-content", "true")
                }
                ,function(t, r) {
                    "horizontal" == r ? cr(e, t) : ur(e, t)
                }
                ,e),
                e.display.scrollbars.addClass && Wo(e.display.wrapper, e.display.scrollbars.addClass)
            }
            function F(e, t) {
                t || (t = P(e));
                var r = e.display.barWidth
                  , n = e.display.barHeight;
                R(e, t);
                for (var i = 0; i < 4 && r != e.display.barWidth || n != e.display.barHeight; i++)
                    r != e.display.barWidth && e.options.lineWrapping && q(e),
                    R(e, P(e)),
                    r = e.display.barWidth,
                    n = e.display.barHeight
            }
            function R(e, t) {
                var r = e.display
                  , n = r.scrollbars.update(t);
                r.sizer.style.paddingRight = (r.barWidth = n.right) + "px",
                r.sizer.style.paddingBottom = (r.barHeight = n.bottom) + "px",
                n.right && n.bottom ? (r.scrollbarFiller.style.display = "block",
                r.scrollbarFiller.style.height = n.bottom + "px",
                r.scrollbarFiller.style.width = n.right + "px") : r.scrollbarFiller.style.display = "",
                n.bottom && e.options.coverGutterNextToScrollbar && e.options.fixedGutter ? (r.gutterFiller.style.display = "block",
                r.gutterFiller.style.height = n.bottom + "px",
                r.gutterFiller.style.width = t.gutterWidth + "px") : r.gutterFiller.style.display = ""
            }
            function B(e, t, r) {
                var n = r && null != r.top ? Math.max(0, r.top) : e.scroller.scrollTop;
                n = Math.floor(n - nt(e));
                var i = r && null != r.bottom ? r.bottom : n + e.wrapper.clientHeight
                  , o = xi(t, n)
                  , l = xi(t, i);
                if (r && r.ensure) {
                    var s = r.ensure.from.line
                      , a = r.ensure.to.line;
                    s < o ? (o = s,
                    l = xi(t, Ci(vi(t, s)) + e.wrapper.clientHeight)) : Math.min(a, t.lastLine()) >= l && (o = xi(t, Ci(vi(t, a)) - e.wrapper.clientHeight),
                    l = a)
                }
                return {
                    from: o,
                    to: Math.max(l, o + 1)
                }
            }
            function G(e) {
                var t = e.display
                  , r = t.view;
                if (t.alignWidgets || t.gutters.firstChild && e.options.fixedGutter) {
                    for (var n = K(t) - t.scroller.scrollLeft + e.doc.scrollLeft, i = t.gutters.offsetWidth, o = n + "px", l = 0; l < r.length; l++)
                        if (!r[l].hidden) {
                            e.options.fixedGutter && r[l].gutter && (r[l].gutter.style.left = o);
                            var s = r[l].alignable;
                            if (s)
                                for (var a = 0; a < s.length; a++)
                                    s[a].style.left = o
                        }
                    e.options.fixedGutter && (t.gutters.style.left = n + i + "px")
                }
            }
            function U(e) {
                if (!e.options.lineNumbers)
                    return !1;
                var t = e.doc
                  , r = V(e.options, t.first + t.size - 1)
                  , n = e.display;
                if (r.length != n.lineNumChars) {
                    var i = n.measure.appendChild(So("div", [So("div", r)], "CodeMirror-linenumber CodeMirror-gutter-elt"))
                      , o = i.firstChild.offsetWidth
                      , l = i.offsetWidth - o;
                    return n.lineGutter.style.width = "",
                    n.lineNumInnerWidth = Math.max(o, n.lineGutter.offsetWidth - l) + 1,
                    n.lineNumWidth = n.lineNumInnerWidth + l,
                    n.lineNumChars = n.lineNumInnerWidth ? r.length : -1,
                    n.lineGutter.style.width = n.lineNumWidth + "px",
                    W(e),
                    !0
                }
                return !1
            }
            function V(e, t) {
                return String(e.lineNumberFormatter(t + e.firstLineNumber))
            }
            function K(e) {
                return e.scroller.getBoundingClientRect().left - e.sizer.getBoundingClientRect().left
            }
            function j(e, t, r) {
                var n = e.display;
                this.viewport = t,
                this.visible = B(n, e.doc, t),
                this.editorIsHidden = !n.wrapper.offsetWidth,
                this.wrapperHeight = n.wrapper.clientHeight,
                this.wrapperWidth = n.wrapper.clientWidth,
                this.oldDisplayWidth = st(e),
                this.force = r,
                this.dims = Q(e),
                this.events = []
            }
            function X(e, t) {
                var r = e.display
                  , n = e.doc;
                if (t.editorIsHidden)
                    return qt(e),
                    !1;
                if (!t.force && t.visible.from >= r.viewFrom && t.visible.to <= r.viewTo && (null == r.updateLineNumbers || r.updateLineNumbers >= r.viewTo) && r.renderedView == r.view && 0 == Jt(e))
                    return !1;
                U(e) && (qt(e),
                t.dims = Q(e));
                var i = n.first + n.size
                  , l = Math.max(t.visible.from - e.options.viewportMargin, n.first)
                  , s = Math.min(i, t.visible.to + e.options.viewportMargin);
                r.viewFrom < l && l - r.viewFrom < 20 && (l = Math.max(n.first, r.viewFrom)),
                r.viewTo > s && r.viewTo - s < 20 && (s = Math.min(i, r.viewTo)),
                w && (l = Pn(e.doc, l),
                s = En(e.doc, s));
                var a = l != r.viewFrom || s != r.viewTo || r.lastWrapHeight != t.wrapperHeight || r.lastWrapWidth != t.wrapperWidth;
                !function(e, t, r) {
                    var n = e.display;
                    0 == n.view.length || t >= n.viewTo || r <= n.viewFrom ? (n.view = _t(e, t, r),
                    n.viewFrom = t) : (n.viewFrom > t ? n.view = _t(e, t, n.viewFrom).concat(n.view) : n.viewFrom < t && (n.view = n.view.slice(Zt(e, t))),
                    n.viewFrom = t,
                    n.viewTo < r ? n.view = n.view.concat(_t(e, n.viewTo, r)) : n.viewTo > r && (n.view = n.view.slice(0, Zt(e, r))));
                    n.viewTo = r
                }(e, l, s),
                r.viewOffset = Ci(vi(e.doc, r.viewFrom)),
                e.display.mover.style.top = r.viewOffset + "px";
                var u = Jt(e);
                if (!a && 0 == u && !t.force && r.renderedView == r.view && (null == r.updateLineNumbers || r.updateLineNumbers >= r.viewTo))
                    return !1;
                var c = Mo();
                return u > 4 && (r.lineDiv.style.display = "none"),
                function(e, t, r) {
                    var n = e.display
                      , i = e.options.lineNumbers
                      , l = n.lineDiv
                      , s = l.firstChild;
                    function a(t) {
                        var r = t.nextSibling;
                        return o && p && e.display.currentWheelTarget == t ? t.style.display = "none" : t.parentNode.removeChild(t),
                        r
                    }
                    for (var u = n.view, c = n.viewFrom, f = 0; f < u.length; f++) {
                        var h = u[f];
                        if (h.hidden)
                            ;
                        else if (h.node && h.node.parentNode == l) {
                            for (; s != h.node; )
                                s = a(s);
                            var d = i && null != t && t <= c && h.lineNumber;
                            h.changes && (uo(h.changes, "gutter") > -1 && (d = !1),
                            J(e, h, c, r)),
                            d && (Lo(h.lineNumber),
                            h.lineNumber.appendChild(document.createTextNode(V(e.options, c)))),
                            s = h.node.nextSibling
                        } else {
                            var g = le(e, h, c, r);
                            l.insertBefore(g, s)
                        }
                        c += h.size
                    }
                    for (; s; )
                        s = a(s)
                }(e, r.updateLineNumbers, t.dims),
                u > 4 && (r.lineDiv.style.display = ""),
                r.renderedView = r.view,
                c && Mo() != c && c.offsetHeight && c.focus(),
                Lo(r.cursorDiv),
                Lo(r.selectionDiv),
                r.gutters.style.height = r.sizer.style.minHeight = 0,
                a && (r.lastWrapHeight = t.wrapperHeight,
                r.lastWrapWidth = t.wrapperWidth,
                et(e, 400)),
                r.updateLineNumbers = null,
                !0
            }
            function _(e, t) {
                for (var r = t.viewport, n = !0; (n && e.options.lineWrapping && t.oldDisplayWidth != st(e) || (r && null != r.top && (r = {
                    top: Math.min(e.doc.height + it(e.display) - at(e), r.top)
                }),
                t.visible = B(e.display, e.doc, r),
                !(t.visible.from >= e.display.viewFrom && t.visible.to <= e.display.viewTo))) && X(e, t); n = !1) {
                    q(e);
                    var i = P(e);
                    $e(e),
                    $(e, i),
                    F(e, i)
                }
                t.signal(e, "update", e),
                e.display.viewFrom == e.display.reportedViewFrom && e.display.viewTo == e.display.reportedViewTo || (t.signal(e, "viewportChange", e, e.display.viewFrom, e.display.viewTo),
                e.display.reportedViewFrom = e.display.viewFrom,
                e.display.reportedViewTo = e.display.viewTo)
            }
            function Y(e, t) {
                var r = new j(e,t);
                if (X(e, r)) {
                    q(e),
                    _(e, r);
                    var n = P(e);
                    $e(e),
                    $(e, n),
                    F(e, n),
                    r.finish()
                }
            }
            function $(e, t) {
                e.display.sizer.style.minHeight = t.docHeight + "px";
                var r = t.docHeight + e.display.barHeight;
                e.display.heightForcer.style.top = r + "px",
                e.display.gutters.style.height = Math.max(r + lt(e), t.clientHeight) + "px"
            }
            function q(e) {
                for (var t = e.display, r = t.lineDiv.offsetTop, o = 0; o < t.view.length; o++) {
                    var l, s = t.view[o];
                    if (!s.hidden) {
                        if (n && i < 8) {
                            var a = s.node.offsetTop + s.node.offsetHeight;
                            l = a - r,
                            r = a
                        } else {
                            var u = s.node.getBoundingClientRect();
                            l = u.bottom - u.top
                        }
                        var c = s.line.height - l;
                        if (l < 2 && (l = Wt(t)),
                        (c > .001 || c < -.001) && (bi(s.line, l),
                        Z(s.line),
                        s.rest))
                            for (var f = 0; f < s.rest.length; f++)
                                Z(s.rest[f])
                    }
                }
            }
            function Z(e) {
                if (e.widgets)
                    for (var t = 0; t < e.widgets.length; ++t)
                        e.widgets[t].height = e.widgets[t].node.offsetHeight
            }
            function Q(e) {
                for (var t = e.display, r = {}, n = {}, i = t.gutters.clientLeft, o = t.gutters.firstChild, l = 0; o; o = o.nextSibling,
                ++l)
                    r[e.options.gutters[l]] = o.offsetLeft + o.clientLeft + i,
                    n[e.options.gutters[l]] = o.clientWidth;
                return {
                    fixedPos: K(t),
                    gutterTotalWidth: t.gutters.offsetWidth,
                    gutterLeft: r,
                    gutterWidth: n,
                    wrapperWidth: t.wrapper.clientWidth
                }
            }
            function J(e, t, r, n) {
                for (var i = 0; i < t.changes.length; i++) {
                    var o = t.changes[i];
                    "text" == o ? re(e, t) : "gutter" == o ? ie(e, t, r, n) : "class" == o ? ne(t) : "widget" == o && oe(e, t, n)
                }
                t.changes = null
            }
            function ee(e) {
                return e.node == e.text && (e.node = So("div", null, null, "position: relative"),
                e.text.parentNode && e.text.parentNode.replaceChild(e.node, e.text),
                e.node.appendChild(e.text),
                n && i < 8 && (e.node.style.zIndex = 2)),
                e.node
            }
            function te(e, t) {
                var r = e.display.externalMeasured;
                return r && r.line == t.line ? (e.display.externalMeasured = null,
                t.measure = r.measure,
                r.built) : ei(e, t)
            }
            function re(e, t) {
                var r = t.text.className
                  , n = te(e, t);
                t.text == t.node && (t.node = n.pre),
                t.text.parentNode.replaceChild(n.pre, t.text),
                t.text = n.pre,
                n.bgClass != t.bgClass || n.textClass != t.textClass ? (t.bgClass = n.bgClass,
                t.textClass = n.textClass,
                ne(t)) : r && (t.text.className = r)
            }
            function ne(e) {
                !function(e) {
                    var t = e.bgClass ? e.bgClass + " " + (e.line.bgClass || "") : e.line.bgClass;
                    if (t && (t += " CodeMirror-linebackground"),
                    e.background)
                        t ? e.background.className = t : (e.background.parentNode.removeChild(e.background),
                        e.background = null);
                    else if (t) {
                        var r = ee(e);
                        e.background = r.insertBefore(So("div", null, t), r.firstChild)
                    }
                }(e),
                e.line.wrapClass ? ee(e).className = e.line.wrapClass : e.node != e.text && (e.node.className = "");
                var t = e.textClass ? e.textClass + " " + (e.line.textClass || "") : e.line.textClass;
                e.text.className = t || ""
            }
            function ie(e, t, r, n) {
                if (t.gutter && (t.node.removeChild(t.gutter),
                t.gutter = null),
                t.gutterBackground && (t.node.removeChild(t.gutterBackground),
                t.gutterBackground = null),
                t.line.gutterClass) {
                    var i = ee(t);
                    t.gutterBackground = So("div", null, "CodeMirror-gutter-background " + t.line.gutterClass, "left: " + (e.options.fixedGutter ? n.fixedPos : -n.gutterTotalWidth) + "px; width: " + n.gutterTotalWidth + "px"),
                    i.insertBefore(t.gutterBackground, t.text)
                }
                var o = t.line.gutterMarkers;
                if (e.options.lineNumbers || o) {
                    i = ee(t);
                    var l = t.gutter = So("div", null, "CodeMirror-gutter-wrapper", "left: " + (e.options.fixedGutter ? n.fixedPos : -n.gutterTotalWidth) + "px");
                    if (e.display.input.setUneditable(l),
                    i.insertBefore(l, t.text),
                    t.line.gutterClass && (l.className += " " + t.line.gutterClass),
                    !e.options.lineNumbers || o && o["CodeMirror-linenumbers"] || (t.lineNumber = l.appendChild(So("div", V(e.options, r), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + n.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + e.display.lineNumInnerWidth + "px"))),
                    o)
                        for (var s = 0; s < e.options.gutters.length; ++s) {
                            var a = e.options.gutters[s]
                              , u = o.hasOwnProperty(a) && o[a];
                            u && l.appendChild(So("div", [u], "CodeMirror-gutter-elt", "left: " + n.gutterLeft[a] + "px; width: " + n.gutterWidth[a] + "px"))
                        }
                }
            }
            function oe(e, t, r) {
                t.alignable && (t.alignable = null);
                for (var n = t.node.firstChild; n; n = i) {
                    var i = n.nextSibling;
                    "CodeMirror-linewidget" == n.className && t.node.removeChild(n)
                }
                se(e, t, r)
            }
            function le(e, t, r, n) {
                var i = te(e, t);
                return t.text = t.node = i.pre,
                i.bgClass && (t.bgClass = i.bgClass),
                i.textClass && (t.textClass = i.textClass),
                ne(t),
                ie(e, t, r, n),
                se(e, t, n),
                t.node
            }
            function se(e, t, r) {
                if (ae(e, t.line, t, r, !0),
                t.rest)
                    for (var n = 0; n < t.rest.length; n++)
                        ae(e, t.rest[n], t, r, !1)
            }
            function ae(e, t, r, n, i) {
                if (t.widgets)
                    for (var o = ee(r), l = 0, s = t.widgets; l < s.length; ++l) {
                        var a = s[l]
                          , u = So("div", [a.node], "CodeMirror-linewidget");
                        a.handleMouseEvents || u.setAttribute("cm-ignore-events", "true"),
                        ue(a, u, r, n),
                        e.display.input.setUneditable(u),
                        i && a.above ? o.insertBefore(u, r.gutter || r.text) : o.appendChild(u),
                        ji(a, "redraw")
                    }
            }
            function ue(e, t, r, n) {
                if (e.noHScroll) {
                    (r.alignable || (r.alignable = [])).push(t);
                    var i = n.wrapperWidth;
                    t.style.left = n.fixedPos + "px",
                    e.coverGutter || (i -= n.gutterTotalWidth,
                    t.style.paddingLeft = n.gutterTotalWidth + "px"),
                    t.style.width = i + "px"
                }
                e.coverGutter && (t.style.zIndex = 5,
                t.style.position = "relative",
                e.noHScroll || (t.style.marginLeft = -n.gutterTotalWidth + "px"))
            }
            E.prototype = po({
                update: function(e) {
                    var t = e.scrollWidth > e.clientWidth + 1
                      , r = e.scrollHeight > e.clientHeight + 1
                      , n = e.nativeBarWidth;
                    if (r) {
                        this.vert.style.display = "block",
                        this.vert.style.bottom = t ? n + "px" : "0";
                        var i = e.viewHeight - (t ? n : 0);
                        this.vert.firstChild.style.height = Math.max(0, e.scrollHeight - e.clientHeight + i) + "px"
                    } else
                        this.vert.style.display = "",
                        this.vert.firstChild.style.height = "0";
                    if (t) {
                        this.horiz.style.display = "block",
                        this.horiz.style.right = r ? n + "px" : "0",
                        this.horiz.style.left = e.barLeft + "px";
                        var o = e.viewWidth - e.barLeft - (r ? n : 0);
                        this.horiz.firstChild.style.width = e.scrollWidth - e.clientWidth + o + "px"
                    } else
                        this.horiz.style.display = "",
                        this.horiz.firstChild.style.width = "0";
                    return !this.checkedOverlay && e.clientHeight > 0 && (0 == n && this.overlayHack(),
                    this.checkedOverlay = !0),
                    {
                        right: r ? n : 0,
                        bottom: t ? n : 0
                    }
                },
                setScrollLeft: function(e) {
                    this.horiz.scrollLeft != e && (this.horiz.scrollLeft = e)
                },
                setScrollTop: function(e) {
                    this.vert.scrollTop != e && (this.vert.scrollTop = e)
                },
                overlayHack: function() {
                    var e = p && !c ? "12px" : "18px";
                    this.horiz.style.minHeight = this.vert.style.minWidth = e;
                    var t = this
                      , r = function(e) {
                        Ri(e) != t.vert && Ri(e) != t.horiz && Vt(t.cm, nr)(e)
                    };
                    Gi(this.vert, "mousedown", r),
                    Gi(this.horiz, "mousedown", r)
                },
                clear: function() {
                    var e = this.horiz.parentNode;
                    e.removeChild(this.horiz),
                    e.removeChild(this.vert)
                }
            }, E.prototype),
            I.prototype = po({
                update: function() {
                    return {
                        bottom: 0,
                        right: 0
                    }
                },
                setScrollLeft: function() {},
                setScrollTop: function() {},
                clear: function() {}
            }, I.prototype),
            x.scrollbarModel = {
                native: E,
                null: I
            },
            j.prototype.signal = function(e, t) {
                $i(e, t) && this.events.push(arguments)
            }
            ,
            j.prototype.finish = function() {
                for (var e = 0; e < this.events.length; e++)
                    Vi.apply(null, this.events[e])
            }
            ;
            var ce = x.Pos = function(e, t) {
                if (!(this instanceof ce))
                    return new ce(e,t);
                this.line = e,
                this.ch = t
            }
              , fe = x.cmpPos = function(e, t) {
                return e.line - t.line || e.ch - t.ch
            }
            ;
            function he(e) {
                return ce(e.line, e.ch)
            }
            function de(e, t) {
                return fe(e, t) < 0 ? t : e
            }
            function pe(e, t) {
                return fe(e, t) < 0 ? e : t
            }
            function ge(e) {
                e.state.focused || (e.display.input.focus(),
                Sr(e))
            }
            function ve(e) {
                return e.options.readOnly || e.doc.cantEdit
            }
            var me = null;
            function ye(e, t, r, n, i) {
                var o = e.doc;
                e.display.shift = !1,
                n || (n = o.sel);
                var l = e.state.pasteIncoming || "paste" == i
                  , s = o.splitLines(t)
                  , a = null;
                if (l && n.ranges.length > 1)
                    if (me && me.join("\n") == t) {
                        if (n.ranges.length % me.length == 0) {
                            a = [];
                            for (var u = 0; u < me.length; u++)
                                a.push(o.splitLines(me[u]))
                        }
                    } else
                        s.length == n.ranges.length && (a = co(s, function(e) {
                            return [e]
                        }));
                for (u = n.ranges.length - 1; u >= 0; u--) {
                    var c = n.ranges[u]
                      , f = c.from()
                      , h = c.to();
                    c.empty() && (r && r > 0 ? f = ce(f.line, f.ch - r) : e.state.overwrite && !l && (h = ce(h.line, Math.min(vi(o, h.line).text.length, h.ch + so(s).length))));
                    var d = e.curOp.updateInput
                      , p = {
                        from: f,
                        to: h,
                        text: a ? a[u % a.length] : s,
                        origin: i || (l ? "paste" : e.state.cutIncoming ? "cut" : "+input")
                    };
                    Or(e.doc, p),
                    ji(e, "inputRead", e, p)
                }
                t && !l && we(e, t),
                Rr(e),
                e.curOp.updateInput = d,
                e.curOp.typing = !0,
                e.state.pasteIncoming = e.state.cutIncoming = !1
            }
            function be(e, t) {
                var r = e.clipboardData && e.clipboardData.getData("text/plain");
                if (r)
                    return e.preventDefault(),
                    ve(t) || t.options.disableInput || Ut(t, function() {
                        ye(t, r, 0, null, "paste")
                    }),
                    !0
            }
            function we(e, t) {
                if (e.options.electricChars && e.options.smartIndent)
                    for (var r = e.doc.sel, n = r.ranges.length - 1; n >= 0; n--) {
                        var i = r.ranges[n];
                        if (!(i.head.ch > 100 || n && r.ranges[n - 1].head.line == i.head.line)) {
                            var o = e.getModeAt(i.head)
                              , l = !1;
                            if (o.electricChars) {
                                for (var s = 0; s < o.electricChars.length; s++)
                                    if (t.indexOf(o.electricChars.charAt(s)) > -1) {
                                        l = Gr(e, i.head.line, "smart");
                                        break
                                    }
                            } else
                                o.electricInput && o.electricInput.test(vi(e.doc, i.head.line).text.slice(0, i.head.ch)) && (l = Gr(e, i.head.line, "smart"));
                            l && ji(e, "electricInput", e, i.head.line)
                        }
                    }
            }
            function xe(e) {
                for (var t = [], r = [], n = 0; n < e.doc.sel.ranges.length; n++) {
                    var i = e.doc.sel.ranges[n].head.line
                      , o = {
                        anchor: ce(i, 0),
                        head: ce(i + 1, 0)
                    };
                    r.push(o),
                    t.push(e.getRange(o.anchor, o.head))
                }
                return {
                    text: t,
                    ranges: r
                }
            }
            function Ce(e) {
                e.setAttribute("autocorrect", "off"),
                e.setAttribute("autocapitalize", "off"),
                e.setAttribute("spellcheck", "false")
            }
            function Se(e) {
                this.cm = e,
                this.prevInput = "",
                this.pollingFast = !1,
                this.polling = new ro,
                this.inaccurateSelection = !1,
                this.hasSelection = !1,
                this.composing = null
            }
            function Le() {
                var e = So("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none")
                  , t = So("div", [e], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
                return o ? e.style.width = "1000px" : e.setAttribute("wrap", "off"),
                h && (e.style.border = "1px solid black"),
                Ce(e),
                t
            }
            function Te(e) {
                this.cm = e,
                this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null,
                this.polling = new ro,
                this.gracePeriod = !1
            }
            function ke(e, t) {
                var r = ft(e, t.line);
                if (!r || r.hidden)
                    return null;
                var n = vi(e.doc, t.line)
                  , i = ut(r, n, t.line)
                  , o = Si(n)
                  , l = "left";
                o && (l = Jo(o, t.ch) % 2 ? "right" : "left");
                var s = vt(i.map, t.ch, l);
                return s.offset = "right" == s.collapse ? s.end : s.start,
                s
            }
            function Me(e, t) {
                return t && (e.bad = !0),
                e
            }
            function Ne(e, t, r) {
                var n;
                if (t == e.display.lineDiv) {
                    if (!(n = e.display.lineDiv.childNodes[r]))
                        return Me(e.clipPos(ce(e.display.viewTo - 1)), !0);
                    t = null,
                    r = 0
                } else
                    for (n = t; ; n = n.parentNode) {
                        if (!n || n == e.display.lineDiv)
                            return null;
                        if (n.parentNode && n.parentNode == e.display.lineDiv)
                            break
                    }
                for (var i = 0; i < e.display.view.length; i++) {
                    var o = e.display.view[i];
                    if (o.node == n)
                        return Ae(o, t, r)
                }
            }
            function Ae(e, t, r) {
                var n = e.text.firstChild
                  , i = !1;
                if (!t || !ko(n, t))
                    return Me(ce(wi(e.line), 0), !0);
                if (t == n && (i = !0,
                t = n.childNodes[r],
                r = 0,
                !t)) {
                    var o = e.rest ? so(e.rest) : e.line;
                    return Me(ce(wi(o), o.text.length), i)
                }
                var l = 3 == t.nodeType ? t : null
                  , s = t;
                for (l || 1 != t.childNodes.length || 3 != t.firstChild.nodeType || (l = t.firstChild,
                r && (r = l.nodeValue.length)); s.parentNode != n; )
                    s = s.parentNode;
                var a = e.measure
                  , u = a.maps;
                function c(t, r, n) {
                    for (var i = -1; i < (u ? u.length : 0); i++)
                        for (var o = i < 0 ? a.map : u[i], l = 0; l < o.length; l += 3) {
                            var s = o[l + 2];
                            if (s == t || s == r) {
                                var c = wi(i < 0 ? e.line : e.rest[i])
                                  , f = o[l] + n;
                                return (n < 0 || s != t) && (f = o[l + (n ? 1 : 0)]),
                                ce(c, f)
                            }
                        }
                }
                var f = c(l, s, r);
                if (f)
                    return Me(f, i);
                for (var h = s.nextSibling, d = l ? l.nodeValue.length - r : 0; h; h = h.nextSibling) {
                    if (f = c(h, h.firstChild, 0))
                        return Me(ce(f.line, f.ch - d), i);
                    d += h.textContent.length
                }
                var p = s.previousSibling;
                for (d = r; p; p = p.previousSibling) {
                    if (f = c(p, p.firstChild, -1))
                        return Me(ce(f.line, f.ch + d), i);
                    d += h.textContent.length
                }
            }
            function We(e, t) {
                this.ranges = e,
                this.primIndex = t
            }
            function Oe(e, t) {
                this.anchor = e,
                this.head = t
            }
            function De(e, t) {
                var r = e[t];
                e.sort(function(e, t) {
                    return fe(e.from(), t.from())
                }),
                t = uo(e, r);
                for (var n = 1; n < e.length; n++) {
                    var i = e[n]
                      , o = e[n - 1];
                    if (fe(o.to(), i.from()) >= 0) {
                        var l = pe(o.from(), i.from())
                          , s = de(o.to(), i.to())
                          , a = o.empty() ? i.from() == i.head : o.from() == o.head;
                        n <= t && --t,
                        e.splice(--n, 2, new Oe(a ? s : l,a ? l : s))
                    }
                }
                return new We(e,t)
            }
            function He(e, t) {
                return new We([new Oe(e,t || e)],0)
            }
            function Pe(e, t) {
                return Math.max(e.first, Math.min(t, e.first + e.size - 1))
            }
            function Ee(e, t) {
                if (t.line < e.first)
                    return ce(e.first, 0);
                var r = e.first + e.size - 1;
                return t.line > r ? ce(r, vi(e, r).text.length) : function(e, t) {
                    var r = e.ch;
                    return null == r || r > t ? ce(e.line, t) : r < 0 ? ce(e.line, 0) : e
                }(t, vi(e, t.line).text.length)
            }
            function Ie(e, t) {
                return t >= e.first && t < e.first + e.size
            }
            function ze(e, t, r, n) {
                if (e.cm && e.cm.display.shift || e.extend) {
                    var i = t.anchor;
                    if (n) {
                        var o = fe(r, i) < 0;
                        o != fe(n, i) < 0 ? (i = r,
                        r = n) : o != fe(r, n) < 0 && (r = n)
                    }
                    return new Oe(i,r)
                }
                return new Oe(n || r,r)
            }
            function Fe(e, t, r, n) {
                Ve(e, new We([ze(e, e.sel.primary(), t, r)],0), n)
            }
            function Re(e, t, r) {
                for (var n = [], i = 0; i < e.sel.ranges.length; i++)
                    n[i] = ze(e, e.sel.ranges[i], t[i], null);
                Ve(e, De(n, e.sel.primIndex), r)
            }
            function Be(e, t, r, n) {
                var i = e.sel.ranges.slice(0);
                i[t] = r,
                Ve(e, De(i, e.sel.primIndex), n)
            }
            function Ge(e, t, r, n) {
                Ve(e, He(t, r), n)
            }
            function Ue(e, t, r) {
                var n = e.history.done
                  , i = so(n);
                i && i.ranges ? (n[n.length - 1] = t,
                Ke(e, t, r)) : Ve(e, t, r)
            }
            function Ve(e, t, r) {
                Ke(e, t, r),
                function(e, t, r, n) {
                    var i = e.history
                      , o = n && n.origin;
                    r == i.lastSelOp || o && i.lastSelOrigin == o && (i.lastModTime == i.lastSelTime && i.lastOrigin == o || function(e, t, r, n) {
                        var i = t.charAt(0);
                        return "*" == i || "+" == i && r.ranges.length == n.ranges.length && r.somethingSelected() == n.somethingSelected() && new Date - e.history.lastSelTime <= (e.cm ? e.cm.options.historyEventDelay : 500)
                    }(e, o, so(i.done), t)) ? i.done[i.done.length - 1] = t : Ni(t, i.done);
                    i.lastSelTime = +new Date,
                    i.lastSelOrigin = o,
                    i.lastSelOp = r,
                    n && !1 !== n.clearRedo && ki(i.undone)
                }(e, e.sel, e.cm ? e.cm.curOp.id : NaN, r)
            }
            function Ke(e, t, r) {
                ($i(e, "beforeSelectionChange") || e.cm && $i(e.cm, "beforeSelectionChange")) && (t = function(e, t) {
                    var r = {
                        ranges: t.ranges,
                        update: function(t) {
                            this.ranges = [];
                            for (var r = 0; r < t.length; r++)
                                this.ranges[r] = new Oe(Ee(e, t[r].anchor),Ee(e, t[r].head))
                        }
                    };
                    return Vi(e, "beforeSelectionChange", e, r),
                    e.cm && Vi(e.cm, "beforeSelectionChange", e.cm, r),
                    r.ranges != t.ranges ? De(r.ranges, r.ranges.length - 1) : t
                }(e, t));
                var n = r && r.bias || (fe(t.primary().head, e.sel.primary().head) < 0 ? -1 : 1);
                je(e, _e(e, t, n, !0)),
                r && !1 === r.scroll || !e.cm || Rr(e.cm)
            }
            function je(e, t) {
                t.equals(e.sel) || (e.sel = t,
                e.cm && (e.cm.curOp.updateInput = e.cm.curOp.selectionChanged = !0,
                Yi(e.cm)),
                ji(e, "cursorActivity", e))
            }
            function Xe(e) {
                je(e, _e(e, e.sel, null, !1))
            }
            function _e(e, t, r, n) {
                for (var i, o = 0; o < t.ranges.length; o++) {
                    var l = t.ranges[o]
                      , s = Ye(e, l.anchor, r, n)
                      , a = Ye(e, l.head, r, n);
                    (i || s != l.anchor || a != l.head) && (i || (i = t.ranges.slice(0, o)),
                    i[o] = new Oe(s,a))
                }
                return i ? De(i, t.primIndex) : t
            }
            function Ye(e, t, r, n) {
                var i = !1
                  , o = t
                  , l = r || 1;
                e.cantEdit = !1;
                e: for (; ; ) {
                    var s = vi(e, o.line);
                    if (s.markedSpans)
                        for (var a = 0; a < s.markedSpans.length; ++a) {
                            var u = s.markedSpans[a]
                              , c = u.marker;
                            if ((null == u.from || (c.inclusiveLeft ? u.from <= o.ch : u.from < o.ch)) && (null == u.to || (c.inclusiveRight ? u.to >= o.ch : u.to > o.ch))) {
                                if (n && (Vi(c, "beforeCursorEnter"),
                                c.explicitlyCleared)) {
                                    if (s.markedSpans) {
                                        --a;
                                        continue
                                    }
                                    break
                                }
                                if (!c.atomic)
                                    continue;
                                var f = c.find(l < 0 ? -1 : 1);
                                if (0 == fe(f, o) && (f.ch += l,
                                f.ch < 0 ? f = f.line > e.first ? Ee(e, ce(f.line - 1)) : null : f.ch > s.text.length && (f = f.line < e.first + e.size - 1 ? ce(f.line + 1, 0) : null),
                                !f)) {
                                    if (i)
                                        return n ? (e.cantEdit = !0,
                                        ce(e.first, 0)) : Ye(e, t, r, !0);
                                    i = !0,
                                    f = t,
                                    l = -l
                                }
                                o = f;
                                continue e
                            }
                        }
                    return o
                }
            }
            function $e(e) {
                e.display.input.showSelection(e.display.input.prepareSelection())
            }
            function qe(e, t) {
                for (var r = e.doc, n = {}, i = n.cursors = document.createDocumentFragment(), o = n.selection = document.createDocumentFragment(), l = 0; l < r.sel.ranges.length; l++)
                    if (!1 !== t || l != r.sel.primIndex) {
                        var s = r.sel.ranges[l]
                          , a = s.empty();
                        (a || e.options.showCursorWhenSelecting) && Ze(e, s.head, i),
                        a || Qe(e, s, o)
                    }
                return n
            }
            function Ze(e, t, r) {
                var n = Tt(e, t, "div", null, null, !e.options.singleCursorHeightPerLine)
                  , i = r.appendChild(So("div", " ", "CodeMirror-cursor"));
                if (i.style.left = n.left + "px",
                i.style.top = n.top + "px",
                i.style.height = Math.max(0, n.bottom - n.top) * e.options.cursorHeight + "px",
                n.other) {
                    var o = r.appendChild(So("div", " ", "CodeMirror-cursor CodeMirror-secondarycursor"));
                    o.style.display = "",
                    o.style.left = n.other.left + "px",
                    o.style.top = n.other.top + "px",
                    o.style.height = .85 * (n.other.bottom - n.other.top) + "px"
                }
            }
            function Qe(e, t, r) {
                var n = e.display
                  , i = e.doc
                  , o = document.createDocumentFragment()
                  , l = ot(e.display)
                  , s = l.left
                  , a = Math.max(n.sizerWidth, st(e) - n.sizer.offsetLeft) - l.right;
                function u(e, t, r, n) {
                    t < 0 && (t = 0),
                    t = Math.round(t),
                    n = Math.round(n),
                    o.appendChild(So("div", null, "CodeMirror-selected", "position: absolute; left: " + e + "px; top: " + t + "px; width: " + (null == r ? a - e : r) + "px; height: " + (n - t) + "px"))
                }
                function c(t, r, n) {
                    var o, l, c = vi(i, t), f = c.text.length;
                    function h(r, n) {
                        return Lt(e, ce(t, r), "div", c, n)
                    }
                    return function(e, t, r, n) {
                        if (!e)
                            return n(t, r, "ltr");
                        for (var i = !1, o = 0; o < e.length; ++o) {
                            var l = e[o];
                            (l.from < r && l.to > t || t == r && l.to == t) && (n(Math.max(l.from, t), Math.min(l.to, r), 1 == l.level ? "rtl" : "ltr"),
                            i = !0)
                        }
                        i || n(t, r, "ltr")
                    }(Si(c), r || 0, null == n ? f : n, function(e, t, i) {
                        var c, d, p, g = h(e, "left");
                        if (e == t)
                            c = g,
                            d = p = g.left;
                        else {
                            if (c = h(t - 1, "right"),
                            "rtl" == i) {
                                var v = g;
                                g = c,
                                c = v
                            }
                            d = g.left,
                            p = c.right
                        }
                        null == r && 0 == e && (d = s),
                        c.top - g.top > 3 && (u(d, g.top, null, g.bottom),
                        d = s,
                        g.bottom < c.top && u(d, g.bottom, null, c.top)),
                        null == n && t == f && (p = a),
                        (!o || g.top < o.top || g.top == o.top && g.left < o.left) && (o = g),
                        (!l || c.bottom > l.bottom || c.bottom == l.bottom && c.right > l.right) && (l = c),
                        d < s + 1 && (d = s),
                        u(d, c.top, p - d, c.bottom)
                    }),
                    {
                        start: o,
                        end: l
                    }
                }
                var f = t.from()
                  , h = t.to();
                if (f.line == h.line)
                    c(f.line, f.ch, h.ch);
                else {
                    var d = vi(i, f.line)
                      , p = vi(i, h.line)
                      , g = Hn(d) == Hn(p)
                      , v = c(f.line, f.ch, g ? d.text.length + 1 : null).end
                      , m = c(h.line, g ? 0 : null, h.ch).start;
                    g && (v.top < m.top - 2 ? (u(v.right, v.top, null, v.bottom),
                    u(s, m.top, m.left, m.bottom)) : u(v.right, v.top, m.left - v.right, v.bottom)),
                    v.bottom < m.top && u(s, v.bottom, null, m.top)
                }
                r.appendChild(o)
            }
            function Je(e) {
                if (e.state.focused) {
                    var t = e.display;
                    clearInterval(t.blinker);
                    var r = !0;
                    t.cursorDiv.style.visibility = "",
                    e.options.cursorBlinkRate > 0 ? t.blinker = setInterval(function() {
                        t.cursorDiv.style.visibility = (r = !r) ? "" : "hidden"
                    }, e.options.cursorBlinkRate) : e.options.cursorBlinkRate < 0 && (t.cursorDiv.style.visibility = "hidden")
                }
            }
            function et(e, t) {
                e.doc.mode.startState && e.doc.frontier < e.display.viewTo && e.state.highlight.set(t, go(tt, e))
            }
            function tt(e) {
                var t = e.doc;
                if (t.frontier < t.first && (t.frontier = t.first),
                !(t.frontier >= e.display.viewTo)) {
                    var r = +new Date + e.options.workTime
                      , n = tn(t.mode, rt(e, t.frontier))
                      , i = [];
                    t.iter(t.frontier, Math.min(t.first + t.size, e.display.viewTo + 500), function(o) {
                        if (t.frontier >= e.display.viewFrom) {
                            var l = o.styles
                              , s = o.text.length > e.options.maxHighlightLength
                              , a = Yn(e, o, s ? tn(t.mode, n) : n, !0);
                            o.styles = a.styles;
                            var u = o.styleClasses
                              , c = a.classes;
                            c ? o.styleClasses = c : u && (o.styleClasses = null);
                            for (var f = !l || l.length != o.styles.length || u != c && (!u || !c || u.bgClass != c.bgClass || u.textClass != c.textClass), h = 0; !f && h < l.length; ++h)
                                f = l[h] != o.styles[h];
                            f && i.push(t.frontier),
                            o.stateAfter = s ? n : tn(t.mode, n)
                        } else
                            o.text.length <= e.options.maxHighlightLength && qn(e, o.text, n),
                            o.stateAfter = t.frontier % 5 == 0 ? tn(t.mode, n) : null;
                        if (++t.frontier,
                        +new Date > r)
                            return et(e, e.options.workDelay),
                            !0
                    }),
                    i.length && Ut(e, function() {
                        for (var t = 0; t < i.length; t++)
                            $t(e, i[t], "text")
                    })
                }
            }
            function rt(e, t, r) {
                var n = e.doc
                  , i = e.display;
                if (!n.mode.startState)
                    return !0;
                var o = function(e, t, r) {
                    for (var n, i, o = e.doc, l = r ? -1 : t - (e.doc.mode.innerMode ? 1e3 : 100), s = t; s > l; --s) {
                        if (s <= o.first)
                            return o.first;
                        var a = vi(o, s - 1);
                        if (a.stateAfter && (!r || s <= o.frontier))
                            return s;
                        var u = no(a.text, null, e.options.tabSize);
                        (null == i || n > u) && (i = s - 1,
                        n = u)
                    }
                    return i
                }(e, t, r)
                  , l = o > n.first && vi(n, o - 1).stateAfter;
                return l = l ? tn(n.mode, l) : rn(n.mode),
                n.iter(o, t, function(r) {
                    qn(e, r.text, l);
                    var s = o == t - 1 || o % 5 == 0 || o >= i.viewFrom && o < i.viewTo;
                    r.stateAfter = s ? tn(n.mode, l) : null,
                    ++o
                }),
                r && (n.frontier = o),
                l
            }
            function nt(e) {
                return e.lineSpace.offsetTop
            }
            function it(e) {
                return e.mover.offsetHeight - e.lineSpace.offsetHeight
            }
            function ot(e) {
                if (e.cachedPaddingH)
                    return e.cachedPaddingH;
                var t = To(e.measure, So("pre", "x"))
                  , r = window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle
                  , n = {
                    left: parseInt(r.paddingLeft),
                    right: parseInt(r.paddingRight)
                };
                return isNaN(n.left) || isNaN(n.right) || (e.cachedPaddingH = n),
                n
            }
            function lt(e) {
                return Zi - e.display.nativeBarWidth
            }
            function st(e) {
                return e.display.scroller.clientWidth - lt(e) - e.display.barWidth
            }
            function at(e) {
                return e.display.scroller.clientHeight - lt(e) - e.display.barHeight
            }
            function ut(e, t, r) {
                if (e.line == t)
                    return {
                        map: e.measure.map,
                        cache: e.measure.cache
                    };
                for (var n = 0; n < e.rest.length; n++)
                    if (e.rest[n] == t)
                        return {
                            map: e.measure.maps[n],
                            cache: e.measure.caches[n]
                        };
                for (n = 0; n < e.rest.length; n++)
                    if (wi(e.rest[n]) > r)
                        return {
                            map: e.measure.maps[n],
                            cache: e.measure.caches[n],
                            before: !0
                        }
            }
            function ct(e, t, r, n) {
                return dt(e, ht(e, t), r, n)
            }
            function ft(e, t) {
                if (t >= e.display.viewFrom && t < e.display.viewTo)
                    return e.display.view[Zt(e, t)];
                var r = e.display.externalMeasured;
                return r && t >= r.lineN && t < r.lineN + r.size ? r : void 0
            }
            function ht(e, t) {
                var r = wi(t)
                  , n = ft(e, r);
                n && !n.text ? n = null : n && n.changes && (J(e, n, r, Q(e)),
                e.curOp.forceUpdate = !0),
                n || (n = function(e, t) {
                    var r = wi(t = Hn(t))
                      , n = e.display.externalMeasured = new Xt(e.doc,t,r);
                    n.lineN = r;
                    var i = n.built = ei(e, n);
                    return n.text = i.pre,
                    To(e.display.lineMeasure, i.pre),
                    n
                }(e, t));
                var i = ut(n, t, r);
                return {
                    line: t,
                    view: n,
                    rect: null,
                    map: i.map,
                    cache: i.cache,
                    before: i.before,
                    hasHeights: !1
                }
            }
            function dt(e, t, r, o, l) {
                t.before && (r = -1);
                var s, a = r + (o || "");
                return t.cache.hasOwnProperty(a) ? s = t.cache[a] : (t.rect || (t.rect = t.view.text.getBoundingClientRect()),
                t.hasHeights || (!function(e, t, r) {
                    var n = e.options.lineWrapping
                      , i = n && st(e);
                    if (!t.measure.heights || n && t.measure.width != i) {
                        var o = t.measure.heights = [];
                        if (n) {
                            t.measure.width = i;
                            for (var l = t.text.firstChild.getClientRects(), s = 0; s < l.length - 1; s++) {
                                var a = l[s]
                                  , u = l[s + 1];
                                Math.abs(a.bottom - u.bottom) > 2 && o.push((a.bottom + u.top) / 2 - r.top)
                            }
                        }
                        o.push(r.bottom - r.top)
                    }
                }(e, t.view, t.rect),
                t.hasHeights = !0),
                (s = function(e, t, r, o) {
                    var l, s = vt(t.map, r, o), a = s.node, u = s.start, c = s.end, f = s.collapse;
                    if (3 == a.nodeType) {
                        for (var h = 0; h < 4; h++) {
                            for (; u && Co(t.line.text.charAt(s.coverStart + u)); )
                                --u;
                            for (; s.coverStart + c < s.coverEnd && Co(t.line.text.charAt(s.coverStart + c)); )
                                ++c;
                            if (n && i < 9 && 0 == u && c == s.coverEnd - s.coverStart)
                                l = a.parentNode.getBoundingClientRect();
                            else if (n && e.options.lineWrapping) {
                                var d = wo(a, u, c).getClientRects();
                                l = d.length ? d["right" == o ? d.length - 1 : 0] : gt
                            } else
                                l = wo(a, u, c).getBoundingClientRect() || gt;
                            if (l.left || l.right || 0 == u)
                                break;
                            c = u,
                            u -= 1,
                            f = "right"
                        }
                        n && i < 11 && (l = function(e, t) {
                            if (!window.screen || null == screen.logicalXDPI || screen.logicalXDPI == screen.deviceXDPI || !function(e) {
                                if (null != Vo)
                                    return Vo;
                                var t = To(e, So("span", "x"))
                                  , r = t.getBoundingClientRect()
                                  , n = wo(t, 0, 1).getBoundingClientRect();
                                return Vo = Math.abs(r.left - n.left) > 1
                            }(e))
                                return t;
                            var r = screen.logicalXDPI / screen.deviceXDPI
                              , n = screen.logicalYDPI / screen.deviceYDPI;
                            return {
                                left: t.left * r,
                                right: t.right * r,
                                top: t.top * n,
                                bottom: t.bottom * n
                            }
                        }(e.display.measure, l))
                    } else {
                        u > 0 && (f = o = "right"),
                        l = e.options.lineWrapping && (d = a.getClientRects()).length > 1 ? d["right" == o ? d.length - 1 : 0] : a.getBoundingClientRect()
                    }
                    if (n && i < 9 && !u && (!l || !l.left && !l.right)) {
                        var p = a.parentNode.getClientRects()[0];
                        l = p ? {
                            left: p.left,
                            right: p.left + Ot(e.display),
                            top: p.top,
                            bottom: p.bottom
                        } : gt
                    }
                    for (var g = l.top - t.rect.top, v = l.bottom - t.rect.top, m = (g + v) / 2, y = t.view.measure.heights, h = 0; h < y.length - 1 && !(m < y[h]); h++)
                        ;
                    var b = h ? y[h - 1] : 0
                      , w = y[h]
                      , x = {
                        left: ("right" == f ? l.right : l.left) - t.rect.left,
                        right: ("left" == f ? l.left : l.right) - t.rect.left,
                        top: b,
                        bottom: w
                    };
                    l.left || l.right || (x.bogus = !0);
                    e.options.singleCursorHeightPerLine || (x.rtop = g,
                    x.rbottom = v);
                    return x
                }(e, t, r, o)).bogus || (t.cache[a] = s)),
                {
                    left: s.left,
                    right: s.right,
                    top: l ? s.rtop : s.top,
                    bottom: l ? s.rbottom : s.bottom
                }
            }
            Se.prototype = po({
                init: function(e) {
                    var t = this
                      , r = this.cm
                      , o = this.wrapper = Le()
                      , l = this.textarea = o.firstChild;
                    function s(e) {
                        if (r.somethingSelected())
                            me = r.getSelections(),
                            t.inaccurateSelection && (t.prevInput = "",
                            t.inaccurateSelection = !1,
                            l.value = me.join("\n"),
                            ao(l));
                        else {
                            if (!r.options.lineWiseCopyCut)
                                return;
                            var n = xe(r);
                            me = n.text,
                            "cut" == e.type ? r.setSelections(n.ranges, null, Ji) : (t.prevInput = "",
                            l.value = n.text.join("\n"),
                            ao(l))
                        }
                        "cut" == e.type && (r.state.cutIncoming = !0)
                    }
                    e.wrapper.insertBefore(o, e.wrapper.firstChild),
                    h && (l.style.width = "0px"),
                    Gi(l, "input", function() {
                        n && i >= 9 && t.hasSelection && (t.hasSelection = null),
                        t.poll()
                    }),
                    Gi(l, "paste", function(e) {
                        if (be(e, r))
                            return !0;
                        r.state.pasteIncoming = !0,
                        t.fastPoll()
                    }),
                    Gi(l, "cut", s),
                    Gi(l, "copy", s),
                    Gi(e.scroller, "paste", function(n) {
                        tr(e, n) || (r.state.pasteIncoming = !0,
                        t.focus())
                    }),
                    Gi(e.lineSpace, "selectstart", function(t) {
                        tr(e, t) || Ei(t)
                    }),
                    Gi(l, "compositionstart", function() {
                        var e = r.getCursor("from");
                        t.composing = {
                            start: e,
                            range: r.markText(e, r.getCursor("to"), {
                                className: "CodeMirror-composing"
                            })
                        }
                    }),
                    Gi(l, "compositionend", function() {
                        t.composing && (t.poll(),
                        t.composing.range.clear(),
                        t.composing = null)
                    })
                },
                prepareSelection: function() {
                    var e = this.cm
                      , t = e.display
                      , r = e.doc
                      , n = qe(e);
                    if (e.options.moveInputWithCursor) {
                        var i = Tt(e, r.sel.primary().head, "div")
                          , o = t.wrapper.getBoundingClientRect()
                          , l = t.lineDiv.getBoundingClientRect();
                        n.teTop = Math.max(0, Math.min(t.wrapper.clientHeight - 10, i.top + l.top - o.top)),
                        n.teLeft = Math.max(0, Math.min(t.wrapper.clientWidth - 10, i.left + l.left - o.left))
                    }
                    return n
                },
                showSelection: function(e) {
                    var t = this.cm.display;
                    To(t.cursorDiv, e.cursors),
                    To(t.selectionDiv, e.selection),
                    null != e.teTop && (this.wrapper.style.top = e.teTop + "px",
                    this.wrapper.style.left = e.teLeft + "px")
                },
                reset: function(e) {
                    if (!this.contextMenuPending) {
                        var t, r, o = this.cm, l = o.doc;
                        if (o.somethingSelected()) {
                            this.prevInput = "";
                            var s = l.sel.primary()
                              , a = (t = Uo && (s.to().line - s.from().line > 100 || (r = o.getSelection()).length > 1e3)) ? "-" : r || o.getSelection();
                            this.textarea.value = a,
                            o.state.focused && ao(this.textarea),
                            n && i >= 9 && (this.hasSelection = a)
                        } else
                            e || (this.prevInput = this.textarea.value = "",
                            n && i >= 9 && (this.hasSelection = null));
                        this.inaccurateSelection = t
                    }
                },
                getField: function() {
                    return this.textarea
                },
                supportsTouch: function() {
                    return !1
                },
                focus: function() {
                    if ("nocursor" != this.cm.options.readOnly && (!d || Mo() != this.textarea))
                        try {
                            this.textarea.focus()
                        } catch (e) {}
                },
                blur: function() {
                    this.textarea.blur()
                },
                resetPosition: function() {
                    this.wrapper.style.top = this.wrapper.style.left = 0
                },
                receivedFocus: function() {
                    this.slowPoll()
                },
                slowPoll: function() {
                    var e = this;
                    e.pollingFast || e.polling.set(this.cm.options.pollInterval, function() {
                        e.poll(),
                        e.cm.state.focused && e.slowPoll()
                    })
                },
                fastPoll: function() {
                    var e = !1
                      , t = this;
                    t.pollingFast = !0,
                    t.polling.set(20, function r() {
                        t.poll() || e ? (t.pollingFast = !1,
                        t.slowPoll()) : (e = !0,
                        t.polling.set(60, r))
                    })
                },
                poll: function() {
                    var e = this.cm
                      , t = this.textarea
                      , r = this.prevInput;
                    if (this.contextMenuPending || !e.state.focused || Go(t) && !r && !this.composing || ve(e) || e.options.disableInput || e.state.keySeq)
                        return !1;
                    var o = t.value;
                    if (o == r && !e.somethingSelected())
                        return !1;
                    if (n && i >= 9 && this.hasSelection === o || p && /[\uf700-\uf7ff]/.test(o))
                        return e.display.input.reset(),
                        !1;
                    if (e.doc.sel == e.display.selForContextMenu) {
                        var l = o.charCodeAt(0);
                        if (8203 != l || r || (r = "​"),
                        8666 == l)
                            return this.reset(),
                            this.cm.execCommand("undo")
                    }
                    for (var s = 0, a = Math.min(r.length, o.length); s < a && r.charCodeAt(s) == o.charCodeAt(s); )
                        ++s;
                    var u = this;
                    return Ut(e, function() {
                        ye(e, o.slice(s), r.length - s, null, u.composing ? "*compose" : null),
                        o.length > 1e3 || o.indexOf("\n") > -1 ? t.value = u.prevInput = "" : u.prevInput = o,
                        u.composing && (u.composing.range.clear(),
                        u.composing.range = e.markText(u.composing.start, e.getCursor("to"), {
                            className: "CodeMirror-composing"
                        }))
                    }),
                    !0
                },
                ensurePolled: function() {
                    this.pollingFast && this.poll() && (this.pollingFast = !1)
                },
                onKeyPress: function() {
                    n && i >= 9 && (this.hasSelection = null),
                    this.fastPoll()
                },
                onContextMenu: function(e) {
                    var t = this
                      , r = t.cm
                      , l = r.display
                      , s = t.textarea
                      , u = rr(r, e)
                      , c = l.scroller.scrollTop;
                    if (u && !a) {
                        r.options.resetSelectionOnContextMenu && -1 == r.doc.sel.contains(u) && Vt(r, Ve)(r.doc, He(u), Ji);
                        var f = s.style.cssText;
                        if (t.wrapper.style.position = "absolute",
                        s.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (e.clientY - 5) + "px; left: " + (e.clientX - 5) + "px; z-index: 1000; background: " + (n ? "rgba(255, 255, 255, .05)" : "transparent") + "; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);",
                        o)
                            var h = window.scrollY;
                        if (l.input.focus(),
                        o && window.scrollTo(null, h),
                        l.input.reset(),
                        r.somethingSelected() || (s.value = t.prevInput = " "),
                        t.contextMenuPending = !0,
                        l.selForContextMenu = r.doc.sel,
                        clearTimeout(l.detectingSelectAll),
                        n && i >= 9 && p(),
                        y) {
                            Fi(e);
                            var d = function() {
                                Ui(window, "mouseup", d),
                                setTimeout(g, 20)
                            };
                            Gi(window, "mouseup", d)
                        } else
                            setTimeout(g, 50)
                    }
                    function p() {
                        if (null != s.selectionStart) {
                            var e = r.somethingSelected()
                              , n = "​" + (e ? s.value : "");
                            s.value = "⇚",
                            s.value = n,
                            t.prevInput = e ? "" : "​",
                            s.selectionStart = 1,
                            s.selectionEnd = n.length,
                            l.selForContextMenu = r.doc.sel
                        }
                    }
                    function g() {
                        if (t.contextMenuPending = !1,
                        t.wrapper.style.position = "relative",
                        s.style.cssText = f,
                        n && i < 9 && l.scrollbars.setScrollTop(l.scroller.scrollTop = c),
                        null != s.selectionStart) {
                            (!n || n && i < 9) && p();
                            var e = 0
                              , o = function() {
                                l.selForContextMenu == r.doc.sel && 0 == s.selectionStart && s.selectionEnd > 0 && "​" == t.prevInput ? Vt(r, nn.selectAll)(r) : e++ < 10 ? l.detectingSelectAll = setTimeout(o, 500) : l.input.reset()
                            };
                            l.detectingSelectAll = setTimeout(o, 200)
                        }
                    }
                },
                setUneditable: fo,
                needsContentAttribute: !1
            }, Se.prototype),
            Te.prototype = po({
                init: function(e) {
                    var t = this
                      , r = t.cm
                      , n = t.div = e.lineDiv;
                    function i(e) {
                        if (r.somethingSelected())
                            me = r.getSelections(),
                            "cut" == e.type && r.replaceSelection("", null, "cut");
                        else {
                            if (!r.options.lineWiseCopyCut)
                                return;
                            var t = xe(r);
                            me = t.text,
                            "cut" == e.type && r.operation(function() {
                                r.setSelections(t.ranges, 0, Ji),
                                r.replaceSelection("", null, "cut")
                            })
                        }
                        if (e.clipboardData && !h)
                            e.preventDefault(),
                            e.clipboardData.clearData(),
                            e.clipboardData.setData("text/plain", me.join("\n"));
                        else {
                            var n = Le()
                              , i = n.firstChild;
                            r.display.lineSpace.insertBefore(n, r.display.lineSpace.firstChild),
                            i.value = me.join("\n");
                            var o = document.activeElement;
                            ao(i),
                            setTimeout(function() {
                                r.display.lineSpace.removeChild(n),
                                o.focus()
                            }, 50)
                        }
                    }
                    n.contentEditable = "true",
                    Ce(n),
                    Gi(n, "paste", function(e) {
                        be(e, r)
                    }),
                    Gi(n, "compositionstart", function(e) {
                        var n = e.data;
                        if (t.composing = {
                            sel: r.doc.sel,
                            data: n,
                            startData: n
                        },
                        n) {
                            var i = r.doc.sel.primary()
                              , o = r.getLine(i.head.line).indexOf(n, Math.max(0, i.head.ch - n.length));
                            o > -1 && o <= i.head.ch && (t.composing.sel = He(ce(i.head.line, o), ce(i.head.line, o + n.length)))
                        }
                    }),
                    Gi(n, "compositionupdate", function(e) {
                        t.composing.data = e.data
                    }),
                    Gi(n, "compositionend", function(e) {
                        var r = t.composing;
                        r && (e.data == r.startData || /\u200b/.test(e.data) || (r.data = e.data),
                        setTimeout(function() {
                            r.handled || t.applyComposition(r),
                            t.composing == r && (t.composing = null)
                        }, 50))
                    }),
                    Gi(n, "touchstart", function() {
                        t.forceCompositionEnd()
                    }),
                    Gi(n, "input", function() {
                        t.composing || t.pollContent() || Ut(t.cm, function() {
                            Yt(r)
                        })
                    }),
                    Gi(n, "copy", i),
                    Gi(n, "cut", i)
                },
                prepareSelection: function() {
                    var e = qe(this.cm, !1);
                    return e.focus = this.cm.state.focused,
                    e
                },
                showSelection: function(e) {
                    e && this.cm.display.view.length && (e.focus && this.showPrimarySelection(),
                    this.showMultipleSelections(e))
                },
                showPrimarySelection: function() {
                    var t = window.getSelection()
                      , r = this.cm.doc.sel.primary()
                      , n = Ne(this.cm, t.anchorNode, t.anchorOffset)
                      , i = Ne(this.cm, t.focusNode, t.focusOffset);
                    if (!n || n.bad || !i || i.bad || 0 != fe(pe(n, i), r.from()) || 0 != fe(de(n, i), r.to())) {
                        var o = ke(this.cm, r.from())
                          , l = ke(this.cm, r.to());
                        if (o || l) {
                            var s = this.cm.display.view
                              , a = t.rangeCount && t.getRangeAt(0);
                            if (o) {
                                if (!l) {
                                    var u = s[s.length - 1].measure
                                      , c = u.maps ? u.maps[u.maps.length - 1] : u.map;
                                    l = {
                                        node: c[c.length - 1],
                                        offset: c[c.length - 2] - c[c.length - 3]
                                    }
                                }
                            } else
                                o = {
                                    node: s[0].measure.map[2],
                                    offset: 0
                                };
                            try {
                                var f = wo(o.node, o.offset, l.offset, l.node)
                            } catch (e) {}
                            f && (t.removeAllRanges(),
                            t.addRange(f),
                            a && null == t.anchorNode ? t.addRange(a) : e && this.startGracePeriod()),
                            this.rememberSelection()
                        }
                    }
                },
                startGracePeriod: function() {
                    var e = this;
                    clearTimeout(this.gracePeriod),
                    this.gracePeriod = setTimeout(function() {
                        e.gracePeriod = !1,
                        e.selectionChanged() && e.cm.operation(function() {
                            e.cm.curOp.selectionChanged = !0
                        })
                    }, 20)
                },
                showMultipleSelections: function(e) {
                    To(this.cm.display.cursorDiv, e.cursors),
                    To(this.cm.display.selectionDiv, e.selection)
                },
                rememberSelection: function() {
                    var e = window.getSelection();
                    this.lastAnchorNode = e.anchorNode,
                    this.lastAnchorOffset = e.anchorOffset,
                    this.lastFocusNode = e.focusNode,
                    this.lastFocusOffset = e.focusOffset
                },
                selectionInEditor: function() {
                    var e = window.getSelection();
                    if (!e.rangeCount)
                        return !1;
                    var t = e.getRangeAt(0).commonAncestorContainer;
                    return ko(this.div, t)
                },
                focus: function() {
                    "nocursor" != this.cm.options.readOnly && this.div.focus()
                },
                blur: function() {
                    this.div.blur()
                },
                getField: function() {
                    return this.div
                },
                supportsTouch: function() {
                    return !0
                },
                receivedFocus: function() {
                    var e = this;
                    this.selectionInEditor() ? this.pollSelection() : Ut(this.cm, function() {
                        e.cm.curOp.selectionChanged = !0
                    }),
                    this.polling.set(this.cm.options.pollInterval, function t() {
                        e.cm.state.focused && (e.pollSelection(),
                        e.polling.set(e.cm.options.pollInterval, t))
                    })
                },
                selectionChanged: function() {
                    var e = window.getSelection();
                    return e.anchorNode != this.lastAnchorNode || e.anchorOffset != this.lastAnchorOffset || e.focusNode != this.lastFocusNode || e.focusOffset != this.lastFocusOffset
                },
                pollSelection: function() {
                    if (!this.composing && !this.gracePeriod && this.selectionChanged()) {
                        var e = window.getSelection()
                          , t = this.cm;
                        this.rememberSelection();
                        var r = Ne(t, e.anchorNode, e.anchorOffset)
                          , n = Ne(t, e.focusNode, e.focusOffset);
                        r && n && Ut(t, function() {
                            Ve(t.doc, He(r, n), Ji),
                            (r.bad || n.bad) && (t.curOp.selectionChanged = !0)
                        })
                    }
                },
                pollContent: function() {
                    var e, t = this.cm, r = t.display, n = t.doc.sel.primary(), i = n.from(), o = n.to();
                    if (i.line < r.viewFrom || o.line > r.viewTo - 1)
                        return !1;
                    if (i.line == r.viewFrom || 0 == (e = Zt(t, i.line)))
                        var l = wi(r.view[0].line)
                          , s = r.view[0].node;
                    else
                        l = wi(r.view[e].line),
                        s = r.view[e - 1].node.nextSibling;
                    var a = Zt(t, o.line);
                    if (a == r.view.length - 1)
                        var u = r.viewTo - 1
                          , c = r.lineDiv.lastChild;
                    else
                        u = wi(r.view[a + 1].line) - 1,
                        c = r.view[a + 1].node.previousSibling;
                    for (var f = t.doc.splitLines(function(e, t, r, n, i) {
                        var o = ""
                          , l = !1
                          , s = e.doc.lineSeparator();
                        function a(t) {
                            if (1 == t.nodeType) {
                                var r = t.getAttribute("cm-text");
                                if (null != r)
                                    return "" == r && (r = t.textContent.replace(/\u200b/g, "")),
                                    void (o += r);
                                var u, c = t.getAttribute("cm-marker");
                                if (c) {
                                    var f = e.findMarks(ce(n, 0), ce(i + 1, 0), (p = +c,
                                    function(e) {
                                        return e.id == p
                                    }
                                    ));
                                    return void (f.length && (u = f[0].find()) && (o += mi(e.doc, u.from, u.to).join(s)))
                                }
                                if ("false" == t.getAttribute("contenteditable"))
                                    return;
                                for (var h = 0; h < t.childNodes.length; h++)
                                    a(t.childNodes[h]);
                                /^(pre|div|p)$/i.test(t.nodeName) && (l = !0)
                            } else if (3 == t.nodeType) {
                                var d = t.nodeValue;
                                if (!d)
                                    return;
                                l && (o += s,
                                l = !1),
                                o += d
                            }
                            var p
                        }
                        for (; a(t),
                        t != r; )
                            t = t.nextSibling;
                        return o
                    }(t, s, c, l, u)), h = mi(t.doc, ce(l, 0), ce(u, vi(t.doc, u).text.length)); f.length > 1 && h.length > 1; )
                        if (so(f) == so(h))
                            f.pop(),
                            h.pop(),
                            u--;
                        else {
                            if (f[0] != h[0])
                                break;
                            f.shift(),
                            h.shift(),
                            l++
                        }
                    for (var d = 0, p = 0, g = f[0], v = h[0], m = Math.min(g.length, v.length); d < m && g.charCodeAt(d) == v.charCodeAt(d); )
                        ++d;
                    for (var y = so(f), b = so(h), w = Math.min(y.length - (1 == f.length ? d : 0), b.length - (1 == h.length ? d : 0)); p < w && y.charCodeAt(y.length - p - 1) == b.charCodeAt(b.length - p - 1); )
                        ++p;
                    f[f.length - 1] = y.slice(0, y.length - p),
                    f[0] = f[0].slice(d);
                    var x = ce(l, d)
                      , C = ce(u, h.length ? so(h).length - p : 0);
                    return f.length > 1 || f[0] || fe(x, C) ? (Ir(t.doc, f, x, C, "+input"),
                    !0) : void 0
                },
                ensurePolled: function() {
                    this.forceCompositionEnd()
                },
                reset: function() {
                    this.forceCompositionEnd()
                },
                forceCompositionEnd: function() {
                    this.composing && !this.composing.handled && (this.applyComposition(this.composing),
                    this.composing.handled = !0,
                    this.div.blur(),
                    this.div.focus())
                },
                applyComposition: function(e) {
                    e.data && e.data != e.startData && Vt(this.cm, ye)(this.cm, e.data, 0, e.sel)
                },
                setUneditable: function(e) {
                    e.setAttribute("contenteditable", "false")
                },
                onKeyPress: function(e) {
                    e.preventDefault(),
                    Vt(this.cm, ye)(this.cm, String.fromCharCode(null == e.charCode ? e.keyCode : e.charCode), 0)
                },
                onContextMenu: fo,
                resetPosition: fo,
                needsContentAttribute: !0
            }, Te.prototype),
            x.inputStyles = {
                textarea: Se,
                contenteditable: Te
            },
            We.prototype = {
                primary: function() {
                    return this.ranges[this.primIndex]
                },
                equals: function(e) {
                    if (e == this)
                        return !0;
                    if (e.primIndex != this.primIndex || e.ranges.length != this.ranges.length)
                        return !1;
                    for (var t = 0; t < this.ranges.length; t++) {
                        var r = this.ranges[t]
                          , n = e.ranges[t];
                        if (0 != fe(r.anchor, n.anchor) || 0 != fe(r.head, n.head))
                            return !1
                    }
                    return !0
                },
                deepCopy: function() {
                    for (var e = [], t = 0; t < this.ranges.length; t++)
                        e[t] = new Oe(he(this.ranges[t].anchor),he(this.ranges[t].head));
                    return new We(e,this.primIndex)
                },
                somethingSelected: function() {
                    for (var e = 0; e < this.ranges.length; e++)
                        if (!this.ranges[e].empty())
                            return !0;
                    return !1
                },
                contains: function(e, t) {
                    t || (t = e);
                    for (var r = 0; r < this.ranges.length; r++) {
                        var n = this.ranges[r];
                        if (fe(t, n.from()) >= 0 && fe(e, n.to()) <= 0)
                            return r
                    }
                    return -1
                }
            },
            Oe.prototype = {
                from: function() {
                    return pe(this.anchor, this.head)
                },
                to: function() {
                    return de(this.anchor, this.head)
                },
                empty: function() {
                    return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch
                }
            };
            var pt, gt = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
            function vt(e, t, r) {
                for (var n, i, o, l, s = 0; s < e.length; s += 3) {
                    var a = e[s]
                      , u = e[s + 1];
                    if (t < a ? (i = 0,
                    o = 1,
                    l = "left") : t < u ? o = (i = t - a) + 1 : (s == e.length - 3 || t == u && e[s + 3] > t) && (i = (o = u - a) - 1,
                    t >= u && (l = "right")),
                    null != i) {
                        if (n = e[s + 2],
                        a == u && r == (n.insertLeft ? "left" : "right") && (l = r),
                        "left" == r && 0 == i)
                            for (; s && e[s - 2] == e[s - 3] && e[s - 1].insertLeft; )
                                n = e[2 + (s -= 3)],
                                l = "left";
                        if ("right" == r && i == u - a)
                            for (; s < e.length - 3 && e[s + 3] == e[s + 4] && !e[s + 5].insertLeft; )
                                n = e[(s += 3) + 2],
                                l = "right";
                        break
                    }
                }
                return {
                    node: n,
                    start: i,
                    end: o,
                    collapse: l,
                    coverStart: a,
                    coverEnd: u
                }
            }
            function mt(e) {
                if (e.measure && (e.measure.cache = {},
                e.measure.heights = null,
                e.rest))
                    for (var t = 0; t < e.rest.length; t++)
                        e.measure.caches[t] = {}
            }
            function yt(e) {
                e.display.externalMeasure = null,
                Lo(e.display.lineMeasure);
                for (var t = 0; t < e.display.view.length; t++)
                    mt(e.display.view[t])
            }
            function bt(e) {
                yt(e),
                e.display.cachedCharWidth = e.display.cachedTextHeight = e.display.cachedPaddingH = null,
                e.options.lineWrapping || (e.display.maxLineChanged = !0),
                e.display.lineNumChars = null
            }
            function wt() {
                return window.pageXOffset || (document.documentElement || document.body).scrollLeft
            }
            function xt() {
                return window.pageYOffset || (document.documentElement || document.body).scrollTop
            }
            function Ct(e, t, r, n) {
                if (t.widgets)
                    for (var i = 0; i < t.widgets.length; ++i)
                        if (t.widgets[i].above) {
                            var o = Bn(t.widgets[i]);
                            r.top += o,
                            r.bottom += o
                        }
                if ("line" == n)
                    return r;
                n || (n = "local");
                var l = Ci(t);
                if ("local" == n ? l += nt(e.display) : l -= e.display.viewOffset,
                "page" == n || "window" == n) {
                    var s = e.display.lineSpace.getBoundingClientRect();
                    l += s.top + ("window" == n ? 0 : xt());
                    var a = s.left + ("window" == n ? 0 : wt());
                    r.left += a,
                    r.right += a
                }
                return r.top += l,
                r.bottom += l,
                r
            }
            function St(e, t, r) {
                if ("div" == r)
                    return t;
                var n = t.left
                  , i = t.top;
                if ("page" == r)
                    n -= wt(),
                    i -= xt();
                else if ("local" == r || !r) {
                    var o = e.display.sizer.getBoundingClientRect();
                    n += o.left,
                    i += o.top
                }
                var l = e.display.lineSpace.getBoundingClientRect();
                return {
                    left: n - l.left,
                    top: i - l.top
                }
            }
            function Lt(e, t, r, n, i) {
                return n || (n = vi(e.doc, t.line)),
                Ct(e, n, ct(e, n, t.ch, i), r)
            }
            function Tt(e, t, r, n, i, o) {
                function l(t, l) {
                    var s = dt(e, i, t, l ? "right" : "left", o);
                    return l ? s.left = s.right : s.right = s.left,
                    Ct(e, n, s, r)
                }
                function s(e, t) {
                    var r = a[t]
                      , n = r.level % 2;
                    return e == Xo(r) && t && r.level < a[t - 1].level ? (e = _o(r = a[--t]) - (r.level % 2 ? 0 : 1),
                    n = !0) : e == _o(r) && t < a.length - 1 && r.level < a[t + 1].level && (e = Xo(r = a[++t]) - r.level % 2,
                    n = !1),
                    n && e == r.to && e > r.from ? l(e - 1) : l(e, n)
                }
                n = n || vi(e.doc, t.line),
                i || (i = ht(e, n));
                var a = Si(n)
                  , u = t.ch;
                if (!a)
                    return l(u);
                var c = s(u, Jo(a, u));
                return null != Ko && (c.other = s(u, Ko)),
                c
            }
            function kt(e, t) {
                var r = 0;
                t = Ee(e.doc, t);
                e.options.lineWrapping || (r = Ot(e.display) * t.ch);
                var n = vi(e.doc, t.line)
                  , i = Ci(n) + nt(e.display);
                return {
                    left: r,
                    right: r,
                    top: i,
                    bottom: i + n.height
                }
            }
            function Mt(e, t, r, n) {
                var i = ce(e, t);
                return i.xRel = n,
                r && (i.outside = !0),
                i
            }
            function Nt(e, t, r) {
                var n = e.doc;
                if ((r += e.display.viewOffset) < 0)
                    return Mt(n.first, 0, !0, -1);
                var i = xi(n, r)
                  , o = n.first + n.size - 1;
                if (i > o)
                    return Mt(n.first + n.size - 1, vi(n, o).text.length, !0, 1);
                t < 0 && (t = 0);
                for (var l = vi(n, i); ; ) {
                    var s = At(e, l, i, t, r)
                      , a = On(l)
                      , u = a && a.find(0, !0);
                    if (!a || !(s.ch > u.from.ch || s.ch == u.from.ch && s.xRel > 0))
                        return s;
                    i = wi(l = u.to.line)
                }
            }
            function At(e, t, r, n, i) {
                var o = i - Ci(t)
                  , l = !1
                  , s = 2 * e.display.wrapper.clientWidth
                  , a = ht(e, t);
                function u(n) {
                    var i = Tt(e, ce(r, n), "line", t, a);
                    return l = !0,
                    o > i.bottom ? i.left - s : o < i.top ? i.left + s : (l = !1,
                    i.left)
                }
                var c = Si(t)
                  , f = t.text.length
                  , h = Yo(t)
                  , d = $o(t)
                  , p = u(h)
                  , g = l
                  , v = u(d)
                  , m = l;
                if (n > v)
                    return Mt(r, d, m, 1);
                for (; ; ) {
                    if (c ? d == h || d == tl(t, h, 1) : d - h <= 1) {
                        for (var y = n < p || n - p <= v - n ? h : d, b = n - (y == h ? p : v); Co(t.text.charAt(y)); )
                            ++y;
                        return Mt(r, y, y == h ? g : m, b < -1 ? -1 : b > 1 ? 1 : 0)
                    }
                    var w = Math.ceil(f / 2)
                      , x = h + w;
                    if (c) {
                        x = h;
                        for (var C = 0; C < w; ++C)
                            x = tl(t, x, 1)
                    }
                    var S = u(x);
                    S > n ? (d = x,
                    v = S,
                    (m = l) && (v += 1e3),
                    f = w) : (h = x,
                    p = S,
                    g = l,
                    f -= w)
                }
            }
            function Wt(e) {
                if (null != e.cachedTextHeight)
                    return e.cachedTextHeight;
                if (null == pt) {
                    pt = So("pre");
                    for (var t = 0; t < 49; ++t)
                        pt.appendChild(document.createTextNode("x")),
                        pt.appendChild(So("br"));
                    pt.appendChild(document.createTextNode("x"))
                }
                To(e.measure, pt);
                var r = pt.offsetHeight / 50;
                return r > 3 && (e.cachedTextHeight = r),
                Lo(e.measure),
                r || 1
            }
            function Ot(e) {
                if (null != e.cachedCharWidth)
                    return e.cachedCharWidth;
                var t = So("span", "xxxxxxxxxx")
                  , r = So("pre", [t]);
                To(e.measure, r);
                var n = t.getBoundingClientRect()
                  , i = (n.right - n.left) / 10;
                return i > 2 && (e.cachedCharWidth = i),
                i || 10
            }
            var Dt, Ht, Pt = null, Et = 0;
            function It(e) {
                e.curOp = {
                    cm: e,
                    viewChanged: !1,
                    startHeight: e.doc.height,
                    forceUpdate: !1,
                    updateInput: null,
                    typing: !1,
                    changeObjs: null,
                    cursorActivityHandlers: null,
                    cursorActivityCalled: 0,
                    selectionChanged: !1,
                    updateMaxLine: !1,
                    scrollLeft: null,
                    scrollTop: null,
                    scrollToPos: null,
                    focus: !1,
                    id: ++Et
                },
                Pt ? Pt.ops.push(e.curOp) : e.curOp.ownsGroup = Pt = {
                    ops: [e.curOp],
                    delayedCallbacks: []
                }
            }
            function zt(e) {
                var t = e.curOp.ownsGroup;
                if (t)
                    try {
                        !function(e) {
                            var t = e.delayedCallbacks
                              , r = 0;
                            do {
                                for (; r < t.length; r++)
                                    t[r].call(null);
                                for (var n = 0; n < e.ops.length; n++) {
                                    var i = e.ops[n];
                                    if (i.cursorActivityHandlers)
                                        for (; i.cursorActivityCalled < i.cursorActivityHandlers.length; )
                                            i.cursorActivityHandlers[i.cursorActivityCalled++].call(null, i.cm)
                                }
                            } while (r < t.length)
                        }(t)
                    } finally {
                        Pt = null;
                        for (var r = 0; r < t.ops.length; r++)
                            t.ops[r].cm.curOp = null;
                        !function(e) {
                            for (var t = e.ops, r = 0; r < t.length; r++)
                                Ft(t[r]);
                            for (var r = 0; r < t.length; r++)
                                n = t[r],
                                n.updatedDisplay = n.mustUpdate && X(n.cm, n.update);
                            var n;
                            for (var r = 0; r < t.length; r++)
                                Rt(t[r]);
                            for (var r = 0; r < t.length; r++)
                                Bt(t[r]);
                            for (var r = 0; r < t.length; r++)
                                Gt(t[r])
                        }(t)
                    }
            }
            function Ft(e) {
                var t = e.cm
                  , r = t.display;
                !function(e) {
                    var t = e.display;
                    !t.scrollbarsClipped && t.scroller.offsetWidth && (t.nativeBarWidth = t.scroller.offsetWidth - t.scroller.clientWidth,
                    t.heightForcer.style.height = lt(e) + "px",
                    t.sizer.style.marginBottom = -t.nativeBarWidth + "px",
                    t.sizer.style.borderRightWidth = lt(e) + "px",
                    t.scrollbarsClipped = !0)
                }(t),
                e.updateMaxLine && D(t),
                e.mustUpdate = e.viewChanged || e.forceUpdate || null != e.scrollTop || e.scrollToPos && (e.scrollToPos.from.line < r.viewFrom || e.scrollToPos.to.line >= r.viewTo) || r.maxLineChanged && t.options.lineWrapping,
                e.update = e.mustUpdate && new j(t,e.mustUpdate && {
                    top: e.scrollTop,
                    ensure: e.scrollToPos
                },e.forceUpdate)
            }
            function Rt(e) {
                var t = e.cm
                  , r = t.display;
                e.updatedDisplay && q(t),
                e.barMeasure = P(t),
                r.maxLineChanged && !t.options.lineWrapping && (e.adjustWidthTo = ct(t, r.maxLine, r.maxLine.text.length).left + 3,
                t.display.sizerWidth = e.adjustWidthTo,
                e.barMeasure.scrollWidth = Math.max(r.scroller.clientWidth, r.sizer.offsetLeft + e.adjustWidthTo + lt(t) + t.display.barWidth),
                e.maxScrollLeft = Math.max(0, r.sizer.offsetLeft + e.adjustWidthTo - st(t))),
                (e.updatedDisplay || e.selectionChanged) && (e.preparedSelection = r.input.prepareSelection())
            }
            function Bt(e) {
                var t = e.cm;
                null != e.adjustWidthTo && (t.display.sizer.style.minWidth = e.adjustWidthTo + "px",
                e.maxScrollLeft < t.doc.scrollLeft && cr(t, Math.min(t.display.scroller.scrollLeft, e.maxScrollLeft), !0),
                t.display.maxLineChanged = !1),
                e.preparedSelection && t.display.input.showSelection(e.preparedSelection),
                e.updatedDisplay && $(t, e.barMeasure),
                (e.updatedDisplay || e.startHeight != t.doc.height) && F(t, e.barMeasure),
                e.selectionChanged && Je(t),
                t.state.focused && e.updateInput && t.display.input.reset(e.typing),
                e.focus && e.focus == Mo() && ge(e.cm)
            }
            function Gt(e) {
                var t = e.cm
                  , r = t.display
                  , n = t.doc;
                if (e.updatedDisplay && _(t, e.update),
                null == r.wheelStartX || null == e.scrollTop && null == e.scrollLeft && !e.scrollToPos || (r.wheelStartX = r.wheelStartY = null),
                null == e.scrollTop || r.scroller.scrollTop == e.scrollTop && !e.forceScroll || (n.scrollTop = Math.max(0, Math.min(r.scroller.scrollHeight - r.scroller.clientHeight, e.scrollTop)),
                r.scrollbars.setScrollTop(n.scrollTop),
                r.scroller.scrollTop = n.scrollTop),
                null == e.scrollLeft || r.scroller.scrollLeft == e.scrollLeft && !e.forceScroll || (n.scrollLeft = Math.max(0, Math.min(r.scroller.scrollWidth - st(t), e.scrollLeft)),
                r.scrollbars.setScrollLeft(n.scrollLeft),
                r.scroller.scrollLeft = n.scrollLeft,
                G(t)),
                e.scrollToPos) {
                    var i = function(e, t, r, n) {
                        null == n && (n = 0);
                        for (var i = 0; i < 5; i++) {
                            var o = !1
                              , l = Tt(e, t)
                              , s = r && r != t ? Tt(e, r) : l
                              , a = zr(e, Math.min(l.left, s.left), Math.min(l.top, s.top) - n, Math.max(l.left, s.left), Math.max(l.bottom, s.bottom) + n)
                              , u = e.doc.scrollTop
                              , c = e.doc.scrollLeft;
                            if (null != a.scrollTop && (ur(e, a.scrollTop),
                            Math.abs(e.doc.scrollTop - u) > 1 && (o = !0)),
                            null != a.scrollLeft && (cr(e, a.scrollLeft),
                            Math.abs(e.doc.scrollLeft - c) > 1 && (o = !0)),
                            !o)
                                break
                        }
                        return l
                    }(t, Ee(n, e.scrollToPos.from), Ee(n, e.scrollToPos.to), e.scrollToPos.margin);
                    e.scrollToPos.isCursor && t.state.focused && function(e, t) {
                        if (_i(e, "scrollCursorIntoView"))
                            return;
                        var r = e.display
                          , n = r.sizer.getBoundingClientRect()
                          , i = null;
                        t.top + n.top < 0 ? i = !0 : t.bottom + n.top > (window.innerHeight || document.documentElement.clientHeight) && (i = !1);
                        if (null != i && !f) {
                            var o = So("div", "​", null, "position: absolute; top: " + (t.top - r.viewOffset - nt(e.display)) + "px; height: " + (t.bottom - t.top + lt(e) + r.barHeight) + "px; left: " + t.left + "px; width: 2px;");
                            e.display.lineSpace.appendChild(o),
                            o.scrollIntoView(i),
                            e.display.lineSpace.removeChild(o)
                        }
                    }(t, i)
                }
                var o = e.maybeHiddenMarkers
                  , l = e.maybeUnhiddenMarkers;
                if (o)
                    for (var s = 0; s < o.length; ++s)
                        o[s].lines.length || Vi(o[s], "hide");
                if (l)
                    for (s = 0; s < l.length; ++s)
                        l[s].lines.length && Vi(l[s], "unhide");
                r.wrapper.offsetHeight && (n.scrollTop = t.display.scroller.scrollTop),
                e.changeObjs && Vi(t, "changes", t, e.changeObjs),
                e.update && e.update.finish()
            }
            function Ut(e, t) {
                if (e.curOp)
                    return t();
                It(e);
                try {
                    return t()
                } finally {
                    zt(e)
                }
            }
            function Vt(e, t) {
                return function() {
                    if (e.curOp)
                        return t.apply(e, arguments);
                    It(e);
                    try {
                        return t.apply(e, arguments)
                    } finally {
                        zt(e)
                    }
                }
            }
            function Kt(e) {
                return function() {
                    if (this.curOp)
                        return e.apply(this, arguments);
                    It(this);
                    try {
                        return e.apply(this, arguments)
                    } finally {
                        zt(this)
                    }
                }
            }
            function jt(e) {
                return function() {
                    var t = this.cm;
                    if (!t || t.curOp)
                        return e.apply(this, arguments);
                    It(t);
                    try {
                        return e.apply(this, arguments)
                    } finally {
                        zt(t)
                    }
                }
            }
            function Xt(e, t, r) {
                this.line = t,
                this.rest = function(e) {
                    var t, r;
                    for (; t = On(e); )
                        e = t.find(1, !0).line,
                        (r || (r = [])).push(e);
                    return r
                }(t),
                this.size = this.rest ? wi(so(this.rest)) - r + 1 : 1,
                this.node = this.text = null,
                this.hidden = In(e, t)
            }
            function _t(e, t, r) {
                for (var n, i = [], o = t; o < r; o = n) {
                    var l = new Xt(e.doc,vi(e.doc, o),o);
                    n = o + l.size,
                    i.push(l)
                }
                return i
            }
            function Yt(e, t, r, n) {
                null == t && (t = e.doc.first),
                null == r && (r = e.doc.first + e.doc.size),
                n || (n = 0);
                var i = e.display;
                if (n && r < i.viewTo && (null == i.updateLineNumbers || i.updateLineNumbers > t) && (i.updateLineNumbers = t),
                e.curOp.viewChanged = !0,
                t >= i.viewTo)
                    w && Pn(e.doc, t) < i.viewTo && qt(e);
                else if (r <= i.viewFrom)
                    w && En(e.doc, r + n) > i.viewFrom ? qt(e) : (i.viewFrom += n,
                    i.viewTo += n);
                else if (t <= i.viewFrom && r >= i.viewTo)
                    qt(e);
                else if (t <= i.viewFrom) {
                    (o = Qt(e, r, r + n, 1)) ? (i.view = i.view.slice(o.index),
                    i.viewFrom = o.lineN,
                    i.viewTo += n) : qt(e)
                } else if (r >= i.viewTo) {
                    var o;
                    (o = Qt(e, t, t, -1)) ? (i.view = i.view.slice(0, o.index),
                    i.viewTo = o.lineN) : qt(e)
                } else {
                    var l = Qt(e, t, t, -1)
                      , s = Qt(e, r, r + n, 1);
                    l && s ? (i.view = i.view.slice(0, l.index).concat(_t(e, l.lineN, s.lineN)).concat(i.view.slice(s.index)),
                    i.viewTo += n) : qt(e)
                }
                var a = i.externalMeasured;
                a && (r < a.lineN ? a.lineN += n : t < a.lineN + a.size && (i.externalMeasured = null))
            }
            function $t(e, t, r) {
                e.curOp.viewChanged = !0;
                var n = e.display
                  , i = e.display.externalMeasured;
                if (i && t >= i.lineN && t < i.lineN + i.size && (n.externalMeasured = null),
                !(t < n.viewFrom || t >= n.viewTo)) {
                    var o = n.view[Zt(e, t)];
                    if (null != o.node) {
                        var l = o.changes || (o.changes = []);
                        -1 == uo(l, r) && l.push(r)
                    }
                }
            }
            function qt(e) {
                e.display.viewFrom = e.display.viewTo = e.doc.first,
                e.display.view = [],
                e.display.viewOffset = 0
            }
            function Zt(e, t) {
                if (t >= e.display.viewTo)
                    return null;
                if ((t -= e.display.viewFrom) < 0)
                    return null;
                for (var r = e.display.view, n = 0; n < r.length; n++)
                    if ((t -= r[n].size) < 0)
                        return n
            }
            function Qt(e, t, r, n) {
                var i, o = Zt(e, t), l = e.display.view;
                if (!w || r == e.doc.first + e.doc.size)
                    return {
                        index: o,
                        lineN: r
                    };
                for (var s = 0, a = e.display.viewFrom; s < o; s++)
                    a += l[s].size;
                if (a != t) {
                    if (n > 0) {
                        if (o == l.length - 1)
                            return null;
                        i = a + l[o].size - t,
                        o++
                    } else
                        i = a - t;
                    t += i,
                    r += i
                }
                for (; Pn(e.doc, r) != r; ) {
                    if (o == (n < 0 ? 0 : l.length - 1))
                        return null;
                    r += n * l[o - (n < 0 ? 1 : 0)].size,
                    o += n
                }
                return {
                    index: o,
                    lineN: r
                }
            }
            function Jt(e) {
                for (var t = e.display.view, r = 0, n = 0; n < t.length; n++) {
                    var i = t[n];
                    i.hidden || i.node && !i.changes || ++r
                }
                return r
            }
            function er(e) {
                var t = e.display;
                t.lastWrapHeight == t.wrapper.clientHeight && t.lastWrapWidth == t.wrapper.clientWidth || (t.cachedCharWidth = t.cachedTextHeight = t.cachedPaddingH = null,
                t.scrollbarsClipped = !1,
                e.setSize())
            }
            function tr(e, t) {
                for (var r = Ri(t); r != e.wrapper; r = r.parentNode)
                    if (!r || 1 == r.nodeType && "true" == r.getAttribute("cm-ignore-events") || r.parentNode == e.sizer && r != e.mover)
                        return !0
            }
            function rr(e, t, r, n) {
                var i = e.display;
                if (!r && "true" == Ri(t).getAttribute("cm-not-content"))
                    return null;
                var o, l, s = i.lineSpace.getBoundingClientRect();
                try {
                    o = t.clientX - s.left,
                    l = t.clientY - s.top
                } catch (t) {
                    return null
                }
                var a, u = Nt(e, o, l);
                if (n && 1 == u.xRel && (a = vi(e.doc, u.line).text).length == u.ch) {
                    var c = no(a, a.length, e.options.tabSize) - a.length;
                    u = ce(u.line, Math.max(0, Math.round((o - ot(e.display).left) / Ot(e.display)) - c))
                }
                return u
            }
            function nr(e) {
                var t = this
                  , r = t.display;
                if (!(r.activeTouch && r.input.supportsTouch() || _i(t, e)))
                    if (r.shift = e.shiftKey,
                    tr(r, e))
                        o || (r.scroller.draggable = !1,
                        setTimeout(function() {
                            r.scroller.draggable = !0
                        }, 100));
                    else if (!or(t, e)) {
                        var l = rr(t, e);
                        switch (window.focus(),
                        Bi(e)) {
                        case 1:
                            t.state.selectingText ? t.state.selectingText(e) : l ? function(e, t, r) {
                                n ? setTimeout(go(ge, e), 0) : e.curOp.focus = Mo();
                                var l, s = +new Date;
                                Ht && Ht.time > s - 400 && 0 == fe(Ht.pos, r) ? l = "triple" : Dt && Dt.time > s - 400 && 0 == fe(Dt.pos, r) ? (l = "double",
                                Ht = {
                                    time: s,
                                    pos: r
                                }) : (l = "single",
                                Dt = {
                                    time: s,
                                    pos: r
                                });
                                var a, u = e.doc.sel, c = p ? t.metaKey : t.ctrlKey;
                                e.options.dragDrop && Io && !ve(e) && "single" == l && (a = u.contains(r)) > -1 && (fe((a = u.ranges[a]).from(), r) < 0 || r.xRel > 0) && (fe(a.to(), r) > 0 || r.xRel < 0) ? function(e, t, r, l) {
                                    var s = e.display
                                      , a = +new Date
                                      , u = Vt(e, function(c) {
                                        o && (s.scroller.draggable = !1),
                                        e.state.draggingText = !1,
                                        Ui(document, "mouseup", u),
                                        Ui(s.scroller, "drop", u),
                                        Math.abs(t.clientX - c.clientX) + Math.abs(t.clientY - c.clientY) < 10 && (Ei(c),
                                        !l && +new Date - 200 < a && Fe(e.doc, r),
                                        o || n && 9 == i ? setTimeout(function() {
                                            document.body.focus(),
                                            s.input.focus()
                                        }, 20) : s.input.focus())
                                    });
                                    o && (s.scroller.draggable = !0);
                                    e.state.draggingText = u,
                                    s.scroller.dragDrop && s.scroller.dragDrop();
                                    Gi(document, "mouseup", u),
                                    Gi(s.scroller, "drop", u)
                                }(e, t, r, c) : function(e, t, r, n, i) {
                                    var o = e.display
                                      , l = e.doc;
                                    Ei(t);
                                    var s, a, u = l.sel, c = u.ranges;
                                    i && !t.shiftKey ? (a = l.sel.contains(r),
                                    s = a > -1 ? c[a] : new Oe(r,r)) : (s = l.sel.primary(),
                                    a = l.sel.primIndex);
                                    if (t.altKey)
                                        n = "rect",
                                        i || (s = new Oe(r,r)),
                                        r = rr(e, t, !0, !0),
                                        a = -1;
                                    else if ("double" == n) {
                                        var f = e.findWordAt(r);
                                        s = e.display.shift || l.extend ? ze(l, s, f.anchor, f.head) : f
                                    } else if ("triple" == n) {
                                        var h = new Oe(ce(r.line, 0),Ee(l, ce(r.line + 1, 0)));
                                        s = e.display.shift || l.extend ? ze(l, s, h.anchor, h.head) : h
                                    } else
                                        s = ze(l, s, r);
                                    i ? -1 == a ? (a = c.length,
                                    Ve(l, De(c.concat([s]), a), {
                                        scroll: !1,
                                        origin: "*mouse"
                                    })) : c.length > 1 && c[a].empty() && "single" == n && !t.shiftKey ? (Ve(l, De(c.slice(0, a).concat(c.slice(a + 1)), 0), {
                                        scroll: !1,
                                        origin: "*mouse"
                                    }),
                                    u = l.sel) : Be(l, a, s, eo) : (a = 0,
                                    Ve(l, new We([s],0), eo),
                                    u = l.sel);
                                    var d = r;
                                    var p = o.wrapper.getBoundingClientRect()
                                      , g = 0;
                                    function v(t) {
                                        var i = ++g
                                          , c = rr(e, t, !0, "rect" == n);
                                        if (c)
                                            if (0 != fe(c, d)) {
                                                e.curOp.focus = Mo(),
                                                function(t) {
                                                    if (0 == fe(d, t))
                                                        return;
                                                    if (d = t,
                                                    "rect" == n) {
                                                        for (var i = [], o = e.options.tabSize, c = no(vi(l, r.line).text, r.ch, o), f = no(vi(l, t.line).text, t.ch, o), h = Math.min(c, f), p = Math.max(c, f), g = Math.min(r.line, t.line), v = Math.min(e.lastLine(), Math.max(r.line, t.line)); g <= v; g++) {
                                                            var m = vi(l, g).text
                                                              , y = io(m, h, o);
                                                            h == p ? i.push(new Oe(ce(g, y),ce(g, y))) : m.length > y && i.push(new Oe(ce(g, y),ce(g, io(m, p, o))))
                                                        }
                                                        i.length || i.push(new Oe(r,r)),
                                                        Ve(l, De(u.ranges.slice(0, a).concat(i), a), {
                                                            origin: "*mouse",
                                                            scroll: !1
                                                        }),
                                                        e.scrollIntoView(t)
                                                    } else {
                                                        var b = s
                                                          , w = b.anchor
                                                          , x = t;
                                                        if ("single" != n) {
                                                            if ("double" == n)
                                                                var C = e.findWordAt(t);
                                                            else
                                                                var C = new Oe(ce(t.line, 0),Ee(l, ce(t.line + 1, 0)));
                                                            fe(C.anchor, w) > 0 ? (x = C.head,
                                                            w = pe(b.from(), C.anchor)) : (x = C.anchor,
                                                            w = de(b.to(), C.head))
                                                        }
                                                        var i = u.ranges.slice(0);
                                                        i[a] = new Oe(Ee(l, w),x),
                                                        Ve(l, De(i, a), eo)
                                                    }
                                                }(c);
                                                var f = B(o, l);
                                                (c.line >= f.to || c.line < f.from) && setTimeout(Vt(e, function() {
                                                    g == i && v(t)
                                                }), 150)
                                            } else {
                                                var h = t.clientY < p.top ? -20 : t.clientY > p.bottom ? 20 : 0;
                                                h && setTimeout(Vt(e, function() {
                                                    g == i && (o.scroller.scrollTop += h,
                                                    v(t))
                                                }), 50)
                                            }
                                    }
                                    function m(t) {
                                        e.state.selectingText = !1,
                                        g = 1 / 0,
                                        Ei(t),
                                        o.input.focus(),
                                        Ui(document, "mousemove", y),
                                        Ui(document, "mouseup", b),
                                        l.history.lastSelOrigin = null
                                    }
                                    var y = Vt(e, function(e) {
                                        Bi(e) ? v(e) : m(e)
                                    })
                                      , b = Vt(e, m);
                                    e.state.selectingText = b,
                                    Gi(document, "mousemove", y),
                                    Gi(document, "mouseup", b)
                                }(e, t, r, l, c)
                            }(t, e, l) : Ri(e) == r.scroller && Ei(e);
                            break;
                        case 2:
                            o && (t.state.lastMiddleDown = +new Date),
                            l && Fe(t.doc, l),
                            setTimeout(function() {
                                r.input.focus()
                            }, 20),
                            Ei(e);
                            break;
                        case 3:
                            y ? Tr(t, e) : function(e) {
                                e.state.delayingBlurEvent = !0,
                                setTimeout(function() {
                                    e.state.delayingBlurEvent && (e.state.delayingBlurEvent = !1,
                                    Lr(e))
                                }, 100)
                            }(t)
                        }
                    }
            }
            function ir(e, t, r, n, i) {
                try {
                    var o = t.clientX
                      , l = t.clientY
                } catch (t) {
                    return !1
                }
                if (o >= Math.floor(e.display.gutters.getBoundingClientRect().right))
                    return !1;
                n && Ei(t);
                var s = e.display
                  , a = s.lineDiv.getBoundingClientRect();
                if (l > a.bottom || !$i(e, r))
                    return zi(t);
                l -= a.top - s.viewOffset;
                for (var u = 0; u < e.options.gutters.length; ++u) {
                    var c = s.gutters.childNodes[u];
                    if (c && c.getBoundingClientRect().right >= o)
                        return i(e, r, e, xi(e.doc, l), e.options.gutters[u], t),
                        zi(t)
                }
            }
            function or(e, t) {
                return ir(e, t, "gutterClick", !0, ji)
            }
            var lr = 0;
            function sr(e) {
                var t = this;
                if (ar(t),
                !_i(t, e) && !tr(t.display, e)) {
                    Ei(e),
                    n && (lr = +new Date);
                    var r = rr(t, e, !0)
                      , i = e.dataTransfer.files;
                    if (r && !ve(t))
                        if (i && i.length && window.FileReader && window.File)
                            for (var o = i.length, l = Array(o), s = 0, a = function(e, n) {
                                var i = new FileReader;
                                i.onload = Vt(t, function() {
                                    if (l[n] = i.result,
                                    ++s == o) {
                                        var e = {
                                            from: r = Ee(t.doc, r),
                                            to: r,
                                            text: t.doc.splitLines(l.join(t.doc.lineSeparator())),
                                            origin: "paste"
                                        };
                                        Or(t.doc, e),
                                        Ue(t.doc, He(r, kr(e)))
                                    }
                                }),
                                i.readAsText(e)
                            }, u = 0; u < o; ++u)
                                a(i[u], u);
                        else {
                            if (t.state.draggingText && t.doc.sel.contains(r) > -1)
                                return t.state.draggingText(e),
                                void setTimeout(function() {
                                    t.display.input.focus()
                                }, 20);
                            try {
                                if (l = e.dataTransfer.getData("Text")) {
                                    if (t.state.draggingText && !(p ? e.altKey : e.ctrlKey))
                                        var c = t.listSelections();
                                    if (Ke(t.doc, He(r, r)),
                                    c)
                                        for (u = 0; u < c.length; ++u)
                                            Ir(t.doc, "", c[u].anchor, c[u].head, "drag");
                                    t.replaceSelection(l, "around", "paste"),
                                    t.display.input.focus()
                                }
                            } catch (e) {}
                        }
                }
            }
            function ar(e) {
                e.display.dragCursor && (e.display.lineSpace.removeChild(e.display.dragCursor),
                e.display.dragCursor = null)
            }
            function ur(t, r) {
                Math.abs(t.doc.scrollTop - r) < 2 || (t.doc.scrollTop = r,
                e || Y(t, {
                    top: r
                }),
                t.display.scroller.scrollTop != r && (t.display.scroller.scrollTop = r),
                t.display.scrollbars.setScrollTop(r),
                e && Y(t),
                et(t, 100))
            }
            function cr(e, t, r) {
                (r ? t == e.doc.scrollLeft : Math.abs(e.doc.scrollLeft - t) < 2) || (t = Math.min(t, e.display.scroller.scrollWidth - e.display.scroller.clientWidth),
                e.doc.scrollLeft = t,
                G(e),
                e.display.scroller.scrollLeft != t && (e.display.scroller.scrollLeft = t),
                e.display.scrollbars.setScrollLeft(t))
            }
            var fr = 0
              , hr = null;
            n ? hr = -.53 : e ? hr = 15 : s ? hr = -.7 : u && (hr = -1 / 3);
            var dr = function(e) {
                var t = e.wheelDeltaX
                  , r = e.wheelDeltaY;
                return null == t && e.detail && e.axis == e.HORIZONTAL_AXIS && (t = e.detail),
                null == r && e.detail && e.axis == e.VERTICAL_AXIS ? r = e.detail : null == r && (r = e.wheelDelta),
                {
                    x: t,
                    y: r
                }
            };
            function pr(t, r) {
                var n = dr(r)
                  , i = n.x
                  , l = n.y
                  , s = t.display
                  , u = s.scroller;
                if (i && u.scrollWidth > u.clientWidth || l && u.scrollHeight > u.clientHeight) {
                    if (l && p && o)
                        e: for (var c = r.target, f = s.view; c != u; c = c.parentNode)
                            for (var h = 0; h < f.length; h++)
                                if (f[h].node == c) {
                                    t.display.currentWheelTarget = c;
                                    break e
                                }
                    if (i && !e && !a && null != hr)
                        return l && ur(t, Math.max(0, Math.min(u.scrollTop + l * hr, u.scrollHeight - u.clientHeight))),
                        cr(t, Math.max(0, Math.min(u.scrollLeft + i * hr, u.scrollWidth - u.clientWidth))),
                        Ei(r),
                        void (s.wheelStartX = null);
                    if (l && null != hr) {
                        var d = l * hr
                          , g = t.doc.scrollTop
                          , v = g + s.wrapper.clientHeight;
                        d < 0 ? g = Math.max(0, g + d - 50) : v = Math.min(t.doc.height, v + d + 50),
                        Y(t, {
                            top: g,
                            bottom: v
                        })
                    }
                    fr < 20 && (null == s.wheelStartX ? (s.wheelStartX = u.scrollLeft,
                    s.wheelStartY = u.scrollTop,
                    s.wheelDX = i,
                    s.wheelDY = l,
                    setTimeout(function() {
                        if (null != s.wheelStartX) {
                            var e = u.scrollLeft - s.wheelStartX
                              , t = u.scrollTop - s.wheelStartY
                              , r = t && s.wheelDY && t / s.wheelDY || e && s.wheelDX && e / s.wheelDX;
                            s.wheelStartX = s.wheelStartY = null,
                            r && (hr = (hr * fr + r) / (fr + 1),
                            ++fr)
                        }
                    }, 200)) : (s.wheelDX += i,
                    s.wheelDY += l))
                }
            }
            function gr(e, t, r) {
                if ("string" == typeof t && !(t = nn[t]))
                    return !1;
                e.display.input.ensurePolled();
                var n = e.display.shift
                  , i = !1;
                try {
                    ve(e) && (e.state.suppressEdits = !0),
                    r && (e.display.shift = !1),
                    i = t(e) != Qi
                } finally {
                    e.display.shift = n,
                    e.state.suppressEdits = !1
                }
                return i
            }
            x.wheelEventPixels = function(e) {
                var t = dr(e);
                return t.x *= hr,
                t.y *= hr,
                t
            }
            ;
            var vr = new ro;
            function mr(e, t, r, n) {
                var i = e.state.keySeq;
                if (i) {
                    if (an(t))
                        return "handled";
                    vr.set(50, function() {
                        e.state.keySeq == i && (e.state.keySeq = null,
                        e.display.input.reset())
                    }),
                    t = i + " " + t
                }
                var o = function(e, t, r) {
                    for (var n = 0; n < e.state.keyMaps.length; n++) {
                        var i = sn(t, e.state.keyMaps[n], r, e);
                        if (i)
                            return i
                    }
                    return e.options.extraKeys && sn(t, e.options.extraKeys, r, e) || sn(t, e.options.keyMap, r, e)
                }(e, t, n);
                return "multi" == o && (e.state.keySeq = t),
                "handled" == o && ji(e, "keyHandled", e, t, r),
                "handled" != o && "multi" != o || (Ei(r),
                Je(e)),
                i && !o && /\'$/.test(t) ? (Ei(r),
                !0) : !!o
            }
            function yr(e, t) {
                var r = un(t, !0);
                return !!r && (t.shiftKey && !e.state.keySeq ? mr(e, "Shift-" + r, t, function(t) {
                    return gr(e, t, !0)
                }) || mr(e, r, t, function(t) {
                    if ("string" == typeof t ? /^go[A-Z]/.test(t) : t.motion)
                        return gr(e, t)
                }) : mr(e, r, t, function(t) {
                    return gr(e, t)
                }))
            }
            var br = null;
            function wr(e) {
                var t = this;
                if (t.curOp.focus = Mo(),
                !_i(t, e)) {
                    n && i < 11 && 27 == e.keyCode && (e.returnValue = !1);
                    var r = e.keyCode;
                    t.display.shift = 16 == r || e.shiftKey;
                    var o = yr(t, e);
                    a && (br = o ? r : null,
                    !o && 88 == r && !Uo && (p ? e.metaKey : e.ctrlKey) && t.replaceSelection("", null, "cut")),
                    18 != r || /\bCodeMirror-crosshair\b/.test(t.display.lineDiv.className) || function(e) {
                        var t = e.display.lineDiv;
                        function r(e) {
                            18 != e.keyCode && e.altKey || (Ao(t, "CodeMirror-crosshair"),
                            Ui(document, "keyup", r),
                            Ui(document, "mouseover", r))
                        }
                        Wo(t, "CodeMirror-crosshair"),
                        Gi(document, "keyup", r),
                        Gi(document, "mouseover", r)
                    }(t)
                }
            }
            function xr(e) {
                16 == e.keyCode && (this.doc.sel.shift = !1),
                _i(this, e)
            }
            function Cr(e) {
                var t = this;
                if (!(tr(t.display, e) || _i(t, e) || e.ctrlKey && !e.altKey || p && e.metaKey)) {
                    var r = e.keyCode
                      , n = e.charCode;
                    if (a && r == br)
                        return br = null,
                        void Ei(e);
                    if (!a || e.which && !(e.which < 10) || !yr(t, e))
                        (function(e, t, r) {
                            return mr(e, "'" + r + "'", t, function(t) {
                                return gr(e, t, !0)
                            })
                        }
                        )(t, e, String.fromCharCode(null == n ? r : n)) || t.display.input.onKeyPress(e)
                }
            }
            function Sr(e) {
                e.state.delayingBlurEvent && (e.state.delayingBlurEvent = !1),
                "nocursor" != e.options.readOnly && (e.state.focused || (Vi(e, "focus", e),
                e.state.focused = !0,
                Wo(e.display.wrapper, "CodeMirror-focused"),
                e.curOp || e.display.selForContextMenu == e.doc.sel || (e.display.input.reset(),
                o && setTimeout(function() {
                    e.display.input.reset(!0)
                }, 20)),
                e.display.input.receivedFocus()),
                Je(e))
            }
            function Lr(e) {
                e.state.delayingBlurEvent || (e.state.focused && (Vi(e, "blur", e),
                e.state.focused = !1,
                Ao(e.display.wrapper, "CodeMirror-focused")),
                clearInterval(e.display.blinker),
                setTimeout(function() {
                    e.state.focused || (e.display.shift = !1)
                }, 150))
            }
            function Tr(e, t) {
                tr(e.display, t) || function(e, t) {
                    return !!$i(e, "gutterContextMenu") && ir(e, t, "gutterContextMenu", !1, Vi)
                }(e, t) || e.display.input.onContextMenu(t)
            }
            var kr = x.changeEnd = function(e) {
                return e.text ? ce(e.from.line + e.text.length - 1, so(e.text).length + (1 == e.text.length ? e.from.ch : 0)) : e.to
            }
            ;
            function Mr(e, t) {
                if (fe(e, t.from) < 0)
                    return e;
                if (fe(e, t.to) <= 0)
                    return kr(t);
                var r = e.line + t.text.length - (t.to.line - t.from.line) - 1
                  , n = e.ch;
                return e.line == t.to.line && (n += kr(t).ch - t.to.ch),
                ce(r, n)
            }
            function Nr(e, t) {
                for (var r = [], n = 0; n < e.sel.ranges.length; n++) {
                    var i = e.sel.ranges[n];
                    r.push(new Oe(Mr(i.anchor, t),Mr(i.head, t)))
                }
                return De(r, e.sel.primIndex)
            }
            function Ar(e, t, r) {
                return e.line == t.line ? ce(r.line, e.ch - t.ch + r.ch) : ce(r.line + (e.line - t.line), e.ch)
            }
            function Wr(e, t, r) {
                var n = {
                    canceled: !1,
                    from: t.from,
                    to: t.to,
                    text: t.text,
                    origin: t.origin,
                    cancel: function() {
                        this.canceled = !0
                    }
                };
                return r && (n.update = function(t, r, n, i) {
                    t && (this.from = Ee(e, t)),
                    r && (this.to = Ee(e, r)),
                    n && (this.text = n),
                    void 0 !== i && (this.origin = i)
                }
                ),
                Vi(e, "beforeChange", e, n),
                e.cm && Vi(e.cm, "beforeChange", e.cm, n),
                n.canceled ? null : {
                    from: n.from,
                    to: n.to,
                    text: n.text,
                    origin: n.origin
                }
            }
            function Or(e, t, r) {
                if (e.cm) {
                    if (!e.cm.curOp)
                        return Vt(e.cm, Or)(e, t, r);
                    if (e.cm.state.suppressEdits)
                        return
                }
                if (!($i(e, "beforeChange") || e.cm && $i(e.cm, "beforeChange")) || (t = Wr(e, t, !0))) {
                    var n = b && !r && function(e, t, r) {
                        var n = null;
                        if (e.iter(t.line, r.line + 1, function(e) {
                            if (e.markedSpans)
                                for (var t = 0; t < e.markedSpans.length; ++t) {
                                    var r = e.markedSpans[t].marker;
                                    !r.readOnly || n && -1 != uo(n, r) || (n || (n = [])).push(r)
                                }
                        }),
                        !n)
                            return null;
                        for (var i = [{
                            from: t,
                            to: r
                        }], o = 0; o < n.length; ++o)
                            for (var l = n[o], s = l.find(0), a = 0; a < i.length; ++a) {
                                var u = i[a];
                                if (!(fe(u.to, s.from) < 0 || fe(u.from, s.to) > 0)) {
                                    var c = [a, 1]
                                      , f = fe(u.from, s.from)
                                      , h = fe(u.to, s.to);
                                    (f < 0 || !l.inclusiveLeft && !f) && c.push({
                                        from: u.from,
                                        to: s.from
                                    }),
                                    (h > 0 || !l.inclusiveRight && !h) && c.push({
                                        from: s.to,
                                        to: u.to
                                    }),
                                    i.splice.apply(i, c),
                                    a += c.length - 1
                                }
                            }
                        return i
                    }(e, t.from, t.to);
                    if (n)
                        for (var i = n.length - 1; i >= 0; --i)
                            Dr(e, {
                                from: n[i].from,
                                to: n[i].to,
                                text: i ? [""] : t.text
                            });
                    else
                        Dr(e, t)
                }
            }
            function Dr(e, t) {
                if (1 != t.text.length || "" != t.text[0] || 0 != fe(t.from, t.to)) {
                    var r = Nr(e, t);
                    Mi(e, t, r, e.cm ? e.cm.curOp.id : NaN),
                    Er(e, t, r, xn(e, t));
                    var n = [];
                    pi(e, function(e, r) {
                        r || -1 != uo(n, e.history) || (Pi(e.history, t),
                        n.push(e.history)),
                        Er(e, t, null, xn(e, t))
                    })
                }
            }
            function Hr(e, t, r) {
                if (!e.cm || !e.cm.state.suppressEdits) {
                    for (var n, i = e.history, o = e.sel, l = "undo" == t ? i.done : i.undone, s = "undo" == t ? i.undone : i.done, a = 0; a < l.length && (n = l[a],
                    r ? !n.ranges || n.equals(e.sel) : n.ranges); a++)
                        ;
                    if (a != l.length) {
                        for (i.lastOrigin = i.lastSelOrigin = null; (n = l.pop()).ranges; ) {
                            if (Ni(n, s),
                            r && !n.equals(e.sel))
                                return void Ve(e, n, {
                                    clearRedo: !1
                                });
                            o = n
                        }
                        var u = [];
                        Ni(o, s),
                        s.push({
                            changes: u,
                            generation: i.generation
                        }),
                        i.generation = n.generation || ++i.maxGeneration;
                        var c = $i(e, "beforeChange") || e.cm && $i(e.cm, "beforeChange");
                        for (a = n.changes.length - 1; a >= 0; --a) {
                            var f = n.changes[a];
                            if (f.origin = t,
                            c && !Wr(e, f, !1))
                                return void (l.length = 0);
                            u.push(Ti(e, f));
                            var h = a ? Nr(e, f) : so(l);
                            Er(e, f, h, Sn(e, f)),
                            !a && e.cm && e.cm.scrollIntoView({
                                from: f.from,
                                to: kr(f)
                            });
                            var d = [];
                            pi(e, function(e, t) {
                                t || -1 != uo(d, e.history) || (Pi(e.history, f),
                                d.push(e.history)),
                                Er(e, f, null, Sn(e, f))
                            })
                        }
                    }
                }
            }
            function Pr(e, t) {
                if (0 != t && (e.first += t,
                e.sel = new We(co(e.sel.ranges, function(e) {
                    return new Oe(ce(e.anchor.line + t, e.anchor.ch),ce(e.head.line + t, e.head.ch))
                }),e.sel.primIndex),
                e.cm)) {
                    Yt(e.cm, e.first, e.first - t, t);
                    for (var r = e.cm.display, n = r.viewFrom; n < r.viewTo; n++)
                        $t(e.cm, n, "gutter")
                }
            }
            function Er(e, t, r, n) {
                if (e.cm && !e.cm.curOp)
                    return Vt(e.cm, Er)(e, t, r, n);
                if (t.to.line < e.first)
                    Pr(e, t.text.length - 1 - (t.to.line - t.from.line));
                else if (!(t.from.line > e.lastLine())) {
                    if (t.from.line < e.first) {
                        var i = t.text.length - 1 - (e.first - t.from.line);
                        Pr(e, i),
                        t = {
                            from: ce(e.first, 0),
                            to: ce(t.to.line + i, t.to.ch),
                            text: [so(t.text)],
                            origin: t.origin
                        }
                    }
                    var o = e.lastLine();
                    t.to.line > o && (t = {
                        from: t.from,
                        to: ce(o, vi(e, o).text.length),
                        text: [t.text[0]],
                        origin: t.origin
                    }),
                    t.removed = mi(e, t.from, t.to),
                    r || (r = Nr(e, t)),
                    e.cm ? function(e, t, r) {
                        var n = e.doc
                          , i = e.display
                          , o = t.from
                          , l = t.to
                          , s = !1
                          , a = o.line;
                        e.options.lineWrapping || (a = wi(Hn(vi(n, o.line))),
                        n.iter(a, l.line + 1, function(e) {
                            if (e == i.maxLine)
                                return s = !0,
                                !0
                        }));
                        n.sel.contains(t.from, t.to) > -1 && Yi(e);
                        si(n, t, r, T(e)),
                        e.options.lineWrapping || (n.iter(a, o.line + t.text.length, function(e) {
                            var t = O(e);
                            t > i.maxLineLength && (i.maxLine = e,
                            i.maxLineLength = t,
                            i.maxLineChanged = !0,
                            s = !1)
                        }),
                        s && (e.curOp.updateMaxLine = !0));
                        n.frontier = Math.min(n.frontier, o.line),
                        et(e, 400);
                        var u = t.text.length - (l.line - o.line) - 1;
                        t.full ? Yt(e) : o.line != l.line || 1 != t.text.length || li(e.doc, t) ? Yt(e, o.line, l.line + 1, u) : $t(e, o.line, "text");
                        var c = $i(e, "changes")
                          , f = $i(e, "change");
                        if (f || c) {
                            var h = {
                                from: o,
                                to: l,
                                text: t.text,
                                removed: t.removed,
                                origin: t.origin
                            };
                            f && ji(e, "change", e, h),
                            c && (e.curOp.changeObjs || (e.curOp.changeObjs = [])).push(h)
                        }
                        e.display.selForContextMenu = null
                    }(e.cm, t, n) : si(e, t, n),
                    Ke(e, r, Ji)
                }
            }
            function Ir(e, t, r, n, i) {
                if (n || (n = r),
                fe(n, r) < 0) {
                    var o = n;
                    n = r,
                    r = o
                }
                "string" == typeof t && (t = e.splitLines(t)),
                Or(e, {
                    from: r,
                    to: n,
                    text: t,
                    origin: i
                })
            }
            function zr(e, t, r, n, i) {
                var o = e.display
                  , l = Wt(e.display);
                r < 0 && (r = 0);
                var s = e.curOp && null != e.curOp.scrollTop ? e.curOp.scrollTop : o.scroller.scrollTop
                  , a = at(e)
                  , u = {};
                i - r > a && (i = r + a);
                var c = e.doc.height + it(o)
                  , f = r < l
                  , h = i > c - l;
                if (r < s)
                    u.scrollTop = f ? 0 : r;
                else if (i > s + a) {
                    var d = Math.min(r, (h ? c : i) - a);
                    d != s && (u.scrollTop = d)
                }
                var p = e.curOp && null != e.curOp.scrollLeft ? e.curOp.scrollLeft : o.scroller.scrollLeft
                  , g = st(e) - (e.options.fixedGutter ? o.gutters.offsetWidth : 0)
                  , v = n - t > g;
                return v && (n = t + g),
                t < 10 ? u.scrollLeft = 0 : t < p ? u.scrollLeft = Math.max(0, t - (v ? 0 : 10)) : n > g + p - 3 && (u.scrollLeft = n + (v ? 0 : 10) - g),
                u
            }
            function Fr(e, t, r) {
                null == t && null == r || Br(e),
                null != t && (e.curOp.scrollLeft = (null == e.curOp.scrollLeft ? e.doc.scrollLeft : e.curOp.scrollLeft) + t),
                null != r && (e.curOp.scrollTop = (null == e.curOp.scrollTop ? e.doc.scrollTop : e.curOp.scrollTop) + r)
            }
            function Rr(e) {
                Br(e);
                var t = e.getCursor()
                  , r = t
                  , n = t;
                e.options.lineWrapping || (r = t.ch ? ce(t.line, t.ch - 1) : t,
                n = ce(t.line, t.ch + 1)),
                e.curOp.scrollToPos = {
                    from: r,
                    to: n,
                    margin: e.options.cursorScrollMargin,
                    isCursor: !0
                }
            }
            function Br(e) {
                var t = e.curOp.scrollToPos;
                if (t) {
                    e.curOp.scrollToPos = null;
                    var r = kt(e, t.from)
                      , n = kt(e, t.to)
                      , i = zr(e, Math.min(r.left, n.left), Math.min(r.top, n.top) - t.margin, Math.max(r.right, n.right), Math.max(r.bottom, n.bottom) + t.margin);
                    e.scrollTo(i.scrollLeft, i.scrollTop)
                }
            }
            function Gr(e, t, r, n) {
                var i, o = e.doc;
                null == r && (r = "add"),
                "smart" == r && (o.mode.indent ? i = rt(e, t) : r = "prev");
                var l = e.options.tabSize
                  , s = vi(o, t)
                  , a = no(s.text, null, l);
                s.stateAfter && (s.stateAfter = null);
                var u, c = s.text.match(/^\s*/)[0];
                if (n || /\S/.test(s.text)) {
                    if ("smart" == r && ((u = o.mode.indent(i, s.text.slice(c.length), s.text)) == Qi || u > 150)) {
                        if (!n)
                            return;
                        r = "prev"
                    }
                } else
                    u = 0,
                    r = "not";
                "prev" == r ? u = t > o.first ? no(vi(o, t - 1).text, null, l) : 0 : "add" == r ? u = a + e.options.indentUnit : "subtract" == r ? u = a - e.options.indentUnit : "number" == typeof r && (u = a + r),
                u = Math.max(0, u);
                var f = ""
                  , h = 0;
                if (e.options.indentWithTabs)
                    for (var d = Math.floor(u / l); d; --d)
                        h += l,
                        f += "\t";
                if (h < u && (f += lo(u - h)),
                f != c)
                    return Ir(o, f, ce(t, 0), ce(t, c.length), "+input"),
                    s.stateAfter = null,
                    !0;
                for (d = 0; d < o.sel.ranges.length; d++) {
                    var p = o.sel.ranges[d];
                    if (p.head.line == t && p.head.ch < c.length) {
                        Be(o, d, new Oe(h = ce(t, c.length),h));
                        break
                    }
                }
            }
            function Ur(e, t, r, n) {
                var i = t
                  , o = t;
                return "number" == typeof t ? o = vi(e, Pe(e, t)) : i = wi(t),
                null == i ? null : (n(o, i) && e.cm && $t(e.cm, i, r),
                o)
            }
            function Vr(e, t) {
                for (var r = e.doc.sel.ranges, n = [], i = 0; i < r.length; i++) {
                    for (var o = t(r[i]); n.length && fe(o.from, so(n).to) <= 0; ) {
                        var l = n.pop();
                        if (fe(l.from, o.from) < 0) {
                            o.from = l.from;
                            break
                        }
                    }
                    n.push(o)
                }
                Ut(e, function() {
                    for (var t = n.length - 1; t >= 0; t--)
                        Ir(e.doc, "", n[t].from, n[t].to, "+delete");
                    Rr(e)
                })
            }
            function Kr(e, t, r, n, i) {
                var o = t.line
                  , l = t.ch
                  , s = r
                  , a = vi(e, o)
                  , u = !0;
                function c(t) {
                    var n, s = (i ? tl : rl)(a, l, r, !0);
                    if (null == s) {
                        if (t || !((n = o + r) < e.first || n >= e.first + e.size ? u = !1 : (o = n,
                        a = vi(e, n))))
                            return u = !1;
                        l = i ? (r < 0 ? $o : Yo)(a) : r < 0 ? a.text.length : 0
                    } else
                        l = s;
                    return !0
                }
                if ("char" == n)
                    c();
                else if ("column" == n)
                    c(!0);
                else if ("word" == n || "group" == n)
                    for (var f = null, h = "group" == n, d = e.cm && e.cm.getHelper(t, "wordChars"), p = !0; !(r < 0) || c(!p); p = !1) {
                        var g = a.text.charAt(l) || "\n"
                          , v = yo(g, d) ? "w" : h && "\n" == g ? "n" : !h || /\s/.test(g) ? null : "p";
                        if (!h || p || v || (v = "s"),
                        f && f != v) {
                            r < 0 && (r = 1,
                            c());
                            break
                        }
                        if (v && (f = v),
                        r > 0 && !c(!p))
                            break
                    }
                var m = Ye(e, ce(o, l), s, !0);
                return u || (m.hitSide = !0),
                m
            }
            function jr(e, t, r, n) {
                var i, o = e.doc, l = t.left;
                if ("page" == n) {
                    var s = Math.min(e.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
                    i = t.top + r * (s - (r < 0 ? 1.5 : .5) * Wt(e.display))
                } else
                    "line" == n && (i = r > 0 ? t.bottom + 3 : t.top - 3);
                for (; ; ) {
                    var a = Nt(e, l, i);
                    if (!a.outside)
                        break;
                    if (r < 0 ? i <= 0 : i >= o.height) {
                        a.hitSide = !0;
                        break
                    }
                    i += 5 * r
                }
                return a
            }
            x.prototype = {
                constructor: x,
                focus: function() {
                    window.focus(),
                    this.display.input.focus()
                },
                setOption: function(e, t) {
                    var r = this.options
                      , n = r[e];
                    r[e] == t && "mode" != e || (r[e] = t,
                    _r.hasOwnProperty(e) && Vt(this, _r[e])(this, t, n))
                },
                getOption: function(e) {
                    return this.options[e]
                },
                getDoc: function() {
                    return this.doc
                },
                addKeyMap: function(e, t) {
                    this.state.keyMaps[t ? "push" : "unshift"](cn(e))
                },
                removeKeyMap: function(e) {
                    for (var t = this.state.keyMaps, r = 0; r < t.length; ++r)
                        if (t[r] == e || t[r].name == e)
                            return t.splice(r, 1),
                            !0
                },
                addOverlay: Kt(function(e, t) {
                    var r = e.token ? e : x.getMode(this.options, e);
                    if (r.startState)
                        throw new Error("Overlays may not be stateful.");
                    this.state.overlays.push({
                        mode: r,
                        modeSpec: e,
                        opaque: t && t.opaque
                    }),
                    this.state.modeGen++,
                    Yt(this)
                }),
                removeOverlay: Kt(function(e) {
                    for (var t = this.state.overlays, r = 0; r < t.length; ++r) {
                        var n = t[r].modeSpec;
                        if (n == e || "string" == typeof e && n.name == e)
                            return t.splice(r, 1),
                            this.state.modeGen++,
                            void Yt(this)
                    }
                }),
                indentLine: Kt(function(e, t, r) {
                    "string" != typeof t && "number" != typeof t && (t = null == t ? this.options.smartIndent ? "smart" : "prev" : t ? "add" : "subtract"),
                    Ie(this.doc, e) && Gr(this, e, t, r)
                }),
                indentSelection: Kt(function(e) {
                    for (var t = this.doc.sel.ranges, r = -1, n = 0; n < t.length; n++) {
                        var i = t[n];
                        if (i.empty())
                            i.head.line > r && (Gr(this, i.head.line, e, !0),
                            r = i.head.line,
                            n == this.doc.sel.primIndex && Rr(this));
                        else {
                            var o = i.from()
                              , l = i.to()
                              , s = Math.max(r, o.line);
                            r = Math.min(this.lastLine(), l.line - (l.ch ? 0 : 1)) + 1;
                            for (var a = s; a < r; ++a)
                                Gr(this, a, e);
                            var u = this.doc.sel.ranges;
                            0 == o.ch && t.length == u.length && u[n].from().ch > 0 && Be(this.doc, n, new Oe(o,u[n].to()), Ji)
                        }
                    }
                }),
                getTokenAt: function(e, t) {
                    return Xn(this, e, t)
                },
                getLineTokens: function(e, t) {
                    return Xn(this, ce(e), t, !0)
                },
                getTokenTypeAt: function(e) {
                    e = Ee(this.doc, e);
                    var t, r = $n(this, vi(this.doc, e.line)), n = 0, i = (r.length - 1) / 2, o = e.ch;
                    if (0 == o)
                        t = r[2];
                    else
                        for (; ; ) {
                            var l = n + i >> 1;
                            if ((l ? r[2 * l - 1] : 0) >= o)
                                i = l;
                            else {
                                if (!(r[2 * l + 1] < o)) {
                                    t = r[2 * l + 2];
                                    break
                                }
                                n = l + 1
                            }
                        }
                    var s = t ? t.indexOf("cm-overlay ") : -1;
                    return s < 0 ? t : 0 == s ? null : t.slice(0, s - 1)
                },
                getModeAt: function(e) {
                    var t = this.doc.mode;
                    return t.innerMode ? x.innerMode(t, this.getTokenAt(e).state).mode : t
                },
                getHelper: function(e, t) {
                    return this.getHelpers(e, t)[0]
                },
                getHelpers: function(e, t) {
                    var r = [];
                    if (!en.hasOwnProperty(t))
                        return r;
                    var n = en[t]
                      , i = this.getModeAt(e);
                    if ("string" == typeof i[t])
                        n[i[t]] && r.push(n[i[t]]);
                    else if (i[t])
                        for (var o = 0; o < i[t].length; o++) {
                            var l = n[i[t][o]];
                            l && r.push(l)
                        }
                    else
                        i.helperType && n[i.helperType] ? r.push(n[i.helperType]) : n[i.name] && r.push(n[i.name]);
                    for (o = 0; o < n._global.length; o++) {
                        var s = n._global[o];
                        s.pred(i, this) && -1 == uo(r, s.val) && r.push(s.val)
                    }
                    return r
                },
                getStateAfter: function(e, t) {
                    var r = this.doc;
                    return rt(this, (e = Pe(r, null == e ? r.first + r.size - 1 : e)) + 1, t)
                },
                cursorCoords: function(e, t) {
                    var r = this.doc.sel.primary();
                    return Tt(this, null == e ? r.head : "object" == typeof e ? Ee(this.doc, e) : e ? r.from() : r.to(), t || "page")
                },
                charCoords: function(e, t) {
                    return Lt(this, Ee(this.doc, e), t || "page")
                },
                coordsChar: function(e, t) {
                    return Nt(this, (e = St(this, e, t || "page")).left, e.top)
                },
                lineAtHeight: function(e, t) {
                    return e = St(this, {
                        top: e,
                        left: 0
                    }, t || "page").top,
                    xi(this.doc, e + this.display.viewOffset)
                },
                heightAtLine: function(e, t) {
                    var r, n = !1;
                    if ("number" == typeof e) {
                        var i = this.doc.first + this.doc.size - 1;
                        e < this.doc.first ? e = this.doc.first : e > i && (e = i,
                        n = !0),
                        r = vi(this.doc, e)
                    } else
                        r = e;
                    return Ct(this, r, {
                        top: 0,
                        left: 0
                    }, t || "page").top + (n ? this.doc.height - Ci(r) : 0)
                },
                defaultTextHeight: function() {
                    return Wt(this.display)
                },
                defaultCharWidth: function() {
                    return Ot(this.display)
                },
                setGutterMarker: Kt(function(e, t, r) {
                    return Ur(this.doc, e, "gutter", function(e) {
                        var n = e.gutterMarkers || (e.gutterMarkers = {});
                        return n[t] = r,
                        !r && bo(n) && (e.gutterMarkers = null),
                        !0
                    })
                }),
                clearGutter: Kt(function(e) {
                    var t = this
                      , r = t.doc
                      , n = r.first;
                    r.iter(function(r) {
                        r.gutterMarkers && r.gutterMarkers[e] && (r.gutterMarkers[e] = null,
                        $t(t, n, "gutter"),
                        bo(r.gutterMarkers) && (r.gutterMarkers = null)),
                        ++n
                    })
                }),
                lineInfo: function(e) {
                    if ("number" == typeof e) {
                        if (!Ie(this.doc, e))
                            return null;
                        var t = e;
                        if (!(e = vi(this.doc, e)))
                            return null
                    } else {
                        if (null == (t = wi(e)))
                            return null
                    }
                    return {
                        line: t,
                        handle: e,
                        text: e.text,
                        gutterMarkers: e.gutterMarkers,
                        textClass: e.textClass,
                        bgClass: e.bgClass,
                        wrapClass: e.wrapClass,
                        widgets: e.widgets
                    }
                },
                getViewport: function() {
                    return {
                        from: this.display.viewFrom,
                        to: this.display.viewTo
                    }
                },
                addWidget: function(e, t, r, n, i) {
                    var o, l, s, a, u, c, f = this.display, h = (e = Tt(this, Ee(this.doc, e))).bottom, d = e.left;
                    if (t.style.position = "absolute",
                    t.setAttribute("cm-ignore-events", "true"),
                    this.display.input.setUneditable(t),
                    f.sizer.appendChild(t),
                    "over" == n)
                        h = e.top;
                    else if ("above" == n || "near" == n) {
                        var p = Math.max(f.wrapper.clientHeight, this.doc.height)
                          , g = Math.max(f.sizer.clientWidth, f.lineSpace.clientWidth);
                        ("above" == n || e.bottom + t.offsetHeight > p) && e.top > t.offsetHeight ? h = e.top - t.offsetHeight : e.bottom + t.offsetHeight <= p && (h = e.bottom),
                        d + t.offsetWidth > g && (d = g - t.offsetWidth)
                    }
                    t.style.top = h + "px",
                    t.style.left = t.style.right = "",
                    "right" == i ? (d = f.sizer.clientWidth - t.offsetWidth,
                    t.style.right = "0px") : ("left" == i ? d = 0 : "middle" == i && (d = (f.sizer.clientWidth - t.offsetWidth) / 2),
                    t.style.left = d + "px"),
                    r && (o = this,
                    l = d,
                    s = h,
                    a = d + t.offsetWidth,
                    u = h + t.offsetHeight,
                    null != (c = zr(o, l, s, a, u)).scrollTop && ur(o, c.scrollTop),
                    null != c.scrollLeft && cr(o, c.scrollLeft))
                },
                triggerOnKeyDown: Kt(wr),
                triggerOnKeyPress: Kt(Cr),
                triggerOnKeyUp: xr,
                execCommand: function(e) {
                    if (nn.hasOwnProperty(e))
                        return nn[e].call(null, this)
                },
                triggerElectric: Kt(function(e) {
                    we(this, e)
                }),
                findPosH: function(e, t, r, n) {
                    var i = 1;
                    t < 0 && (i = -1,
                    t = -t);
                    for (var o = 0, l = Ee(this.doc, e); o < t && !(l = Kr(this.doc, l, i, r, n)).hitSide; ++o)
                        ;
                    return l
                },
                moveH: Kt(function(e, t) {
                    var r = this;
                    r.extendSelectionsBy(function(n) {
                        return r.display.shift || r.doc.extend || n.empty() ? Kr(r.doc, n.head, e, t, r.options.rtlMoveVisually) : e < 0 ? n.from() : n.to()
                    }, to)
                }),
                deleteH: Kt(function(e, t) {
                    var r = this.doc.sel
                      , n = this.doc;
                    r.somethingSelected() ? n.replaceSelection("", null, "+delete") : Vr(this, function(r) {
                        var i = Kr(n, r.head, e, t, !1);
                        return e < 0 ? {
                            from: i,
                            to: r.head
                        } : {
                            from: r.head,
                            to: i
                        }
                    })
                }),
                findPosV: function(e, t, r, n) {
                    var i = 1
                      , o = n;
                    t < 0 && (i = -1,
                    t = -t);
                    for (var l = 0, s = Ee(this.doc, e); l < t; ++l) {
                        var a = Tt(this, s, "div");
                        if (null == o ? o = a.left : a.left = o,
                        (s = jr(this, a, i, r)).hitSide)
                            break
                    }
                    return s
                },
                moveV: Kt(function(e, t) {
                    var r = this
                      , n = this.doc
                      , i = []
                      , o = !r.display.shift && !n.extend && n.sel.somethingSelected();
                    if (n.extendSelectionsBy(function(l) {
                        if (o)
                            return e < 0 ? l.from() : l.to();
                        var s = Tt(r, l.head, "div");
                        null != l.goalColumn && (s.left = l.goalColumn),
                        i.push(s.left);
                        var a = jr(r, s, e, t);
                        return "page" == t && l == n.sel.primary() && Fr(r, null, Lt(r, a, "div").top - s.top),
                        a
                    }, to),
                    i.length)
                        for (var l = 0; l < n.sel.ranges.length; l++)
                            n.sel.ranges[l].goalColumn = i[l]
                }),
                findWordAt: function(e) {
                    var t = vi(this.doc, e.line).text
                      , r = e.ch
                      , n = e.ch;
                    if (t) {
                        var i = this.getHelper(e, "wordChars");
                        (e.xRel < 0 || n == t.length) && r ? --r : ++n;
                        for (var o = t.charAt(r), l = yo(o, i) ? function(e) {
                            return yo(e, i)
                        }
                        : /\s/.test(o) ? function(e) {
                            return /\s/.test(e)
                        }
                        : function(e) {
                            return !/\s/.test(e) && !yo(e)
                        }
                        ; r > 0 && l(t.charAt(r - 1)); )
                            --r;
                        for (; n < t.length && l(t.charAt(n)); )
                            ++n
                    }
                    return new Oe(ce(e.line, r),ce(e.line, n))
                },
                toggleOverwrite: function(e) {
                    null != e && e == this.state.overwrite || ((this.state.overwrite = !this.state.overwrite) ? Wo(this.display.cursorDiv, "CodeMirror-overwrite") : Ao(this.display.cursorDiv, "CodeMirror-overwrite"),
                    Vi(this, "overwriteToggle", this, this.state.overwrite))
                },
                hasFocus: function() {
                    return this.display.input.getField() == Mo()
                },
                scrollTo: Kt(function(e, t) {
                    null == e && null == t || Br(this),
                    null != e && (this.curOp.scrollLeft = e),
                    null != t && (this.curOp.scrollTop = t)
                }),
                getScrollInfo: function() {
                    var e = this.display.scroller;
                    return {
                        left: e.scrollLeft,
                        top: e.scrollTop,
                        height: e.scrollHeight - lt(this) - this.display.barHeight,
                        width: e.scrollWidth - lt(this) - this.display.barWidth,
                        clientHeight: at(this),
                        clientWidth: st(this)
                    }
                },
                scrollIntoView: Kt(function(e, t) {
                    if (null == e ? (e = {
                        from: this.doc.sel.primary().head,
                        to: null
                    },
                    null == t && (t = this.options.cursorScrollMargin)) : "number" == typeof e ? e = {
                        from: ce(e, 0),
                        to: null
                    } : null == e.from && (e = {
                        from: e,
                        to: null
                    }),
                    e.to || (e.to = e.from),
                    e.margin = t || 0,
                    null != e.from.line)
                        Br(this),
                        this.curOp.scrollToPos = e;
                    else {
                        var r = zr(this, Math.min(e.from.left, e.to.left), Math.min(e.from.top, e.to.top) - e.margin, Math.max(e.from.right, e.to.right), Math.max(e.from.bottom, e.to.bottom) + e.margin);
                        this.scrollTo(r.scrollLeft, r.scrollTop)
                    }
                }),
                setSize: Kt(function(e, t) {
                    var r = this;
                    function n(e) {
                        return "number" == typeof e || /^\d+$/.test(String(e)) ? e + "px" : e
                    }
                    null != e && (r.display.wrapper.style.width = n(e)),
                    null != t && (r.display.wrapper.style.height = n(t)),
                    r.options.lineWrapping && yt(this);
                    var i = r.display.viewFrom;
                    r.doc.iter(i, r.display.viewTo, function(e) {
                        if (e.widgets)
                            for (var t = 0; t < e.widgets.length; t++)
                                if (e.widgets[t].noHScroll) {
                                    $t(r, i, "widget");
                                    break
                                }
                        ++i
                    }),
                    r.curOp.forceUpdate = !0,
                    Vi(r, "refresh", this)
                }),
                operation: function(e) {
                    return Ut(this, e)
                },
                refresh: Kt(function() {
                    var e = this.display.cachedTextHeight;
                    Yt(this),
                    this.curOp.forceUpdate = !0,
                    bt(this),
                    this.scrollTo(this.doc.scrollLeft, this.doc.scrollTop),
                    W(this),
                    (null == e || Math.abs(e - Wt(this.display)) > .5) && k(this),
                    Vi(this, "refresh", this)
                }),
                swapDoc: Kt(function(e) {
                    var t = this.doc;
                    return t.cm = null,
                    gi(this, e),
                    bt(this),
                    this.display.input.reset(),
                    this.scrollTo(e.scrollLeft, e.scrollTop),
                    this.curOp.forceScroll = !0,
                    ji(this, "swapDoc", this, t),
                    t
                }),
                getInputField: function() {
                    return this.display.input.getField()
                },
                getWrapperElement: function() {
                    return this.display.wrapper
                },
                getScrollerElement: function() {
                    return this.display.scroller
                },
                getGutterElement: function() {
                    return this.display.gutters
                }
            },
            qi(x);
            var Xr = x.defaults = {}
              , _r = x.optionHandlers = {};
            function Yr(e, t, r, n) {
                x.defaults[e] = t,
                r && (_r[e] = n ? function(e, t, n) {
                    n != $r && r(e, t, n)
                }
                : r)
            }
            var $r = x.Init = {
                toString: function() {
                    return "CodeMirror.Init"
                }
            };
            Yr("value", "", function(e, t) {
                e.setValue(t)
            }, !0),
            Yr("mode", null, function(e, t) {
                e.doc.modeOption = t,
                S(e)
            }, !0),
            Yr("indentUnit", 2, S, !0),
            Yr("indentWithTabs", !1),
            Yr("smartIndent", !0),
            Yr("tabSize", 4, function(e) {
                L(e),
                bt(e),
                Yt(e)
            }, !0),
            Yr("lineSeparator", null, function(e, t) {
                if (e.doc.lineSep = t,
                t) {
                    var r = []
                      , n = e.doc.first;
                    e.doc.iter(function(e) {
                        for (var i = 0; ; ) {
                            var o = e.text.indexOf(t, i);
                            if (-1 == o)
                                break;
                            i = o + t.length,
                            r.push(ce(n, o))
                        }
                        n++
                    });
                    for (var i = r.length - 1; i >= 0; i--)
                        Ir(e.doc, t, r[i], ce(r[i].line, r[i].ch + t.length))
                }
            }),
            Yr("specialChars", /[\t\u0000-\u0019\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g, function(e, t, r) {
                e.state.specialChars = new RegExp(t.source + (t.test("\t") ? "" : "|\t"),"g"),
                r != x.Init && e.refresh()
            }),
            Yr("specialCharPlaceholder", function(e) {
                var t = So("span", "•", "cm-invalidchar");
                return t.title = "\\u" + e.charCodeAt(0).toString(16),
                t.setAttribute("aria-label", t.title),
                t
            }, function(e) {
                e.refresh()
            }, !0),
            Yr("electricChars", !0),
            Yr("inputStyle", d ? "contenteditable" : "textarea", function() {
                throw new Error("inputStyle can not (yet) be changed in a running editor")
            }, !0),
            Yr("rtlMoveVisually", !g),
            Yr("wholeLineUpdateBefore", !0),
            Yr("theme", "default", function(e) {
                M(e),
                N(e)
            }, !0),
            Yr("keyMap", "default", function(e, t, r) {
                var n = cn(t)
                  , i = r != x.Init && cn(r);
                i && i.detach && i.detach(e, n),
                n.attach && n.attach(e, i || null)
            }),
            Yr("extraKeys", null),
            Yr("lineWrapping", !1, function(e) {
                e.options.lineWrapping ? (Wo(e.display.wrapper, "CodeMirror-wrap"),
                e.display.sizer.style.minWidth = "",
                e.display.sizerWidth = null) : (Ao(e.display.wrapper, "CodeMirror-wrap"),
                D(e)),
                k(e),
                Yt(e),
                bt(e),
                setTimeout(function() {
                    F(e)
                }, 100)
            }, !0),
            Yr("gutters", [], function(e) {
                H(e.options),
                N(e)
            }, !0),
            Yr("fixedGutter", !0, function(e, t) {
                e.display.gutters.style.left = t ? K(e.display) + "px" : "0",
                e.refresh()
            }, !0),
            Yr("coverGutterNextToScrollbar", !1, function(e) {
                F(e)
            }, !0),
            Yr("scrollbarStyle", "native", function(e) {
                z(e),
                F(e),
                e.display.scrollbars.setScrollTop(e.doc.scrollTop),
                e.display.scrollbars.setScrollLeft(e.doc.scrollLeft)
            }, !0),
            Yr("lineNumbers", !1, function(e) {
                H(e.options),
                N(e)
            }, !0),
            Yr("firstLineNumber", 1, N, !0),
            Yr("lineNumberFormatter", function(e) {
                return e
            }, N, !0),
            Yr("showCursorWhenSelecting", !1, $e, !0),
            Yr("resetSelectionOnContextMenu", !0),
            Yr("lineWiseCopyCut", !0),
            Yr("readOnly", !1, function(e, t) {
                "nocursor" == t ? (Lr(e),
                e.display.input.blur(),
                e.display.disabled = !0) : (e.display.disabled = !1,
                t || e.display.input.reset())
            }),
            Yr("disableInput", !1, function(e, t) {
                t || e.display.input.reset()
            }, !0),
            Yr("dragDrop", !0, function(e, t, r) {
                if (!t != !(r && r != x.Init)) {
                    var n = e.display.dragFunctions
                      , i = t ? Gi : Ui;
                    i(e.display.scroller, "dragstart", n.start),
                    i(e.display.scroller, "dragenter", n.enter),
                    i(e.display.scroller, "dragover", n.over),
                    i(e.display.scroller, "dragleave", n.leave),
                    i(e.display.scroller, "drop", n.drop)
                }
            }),
            Yr("cursorBlinkRate", 530),
            Yr("cursorScrollMargin", 0),
            Yr("cursorHeight", 1, $e, !0),
            Yr("singleCursorHeightPerLine", !0, $e, !0),
            Yr("workTime", 100),
            Yr("workDelay", 100),
            Yr("flattenSpans", !0, L, !0),
            Yr("addModeClass", !1, L, !0),
            Yr("pollInterval", 100),
            Yr("undoDepth", 200, function(e, t) {
                e.doc.history.undoDepth = t
            }),
            Yr("historyEventDelay", 1250),
            Yr("viewportMargin", 10, function(e) {
                e.refresh()
            }, !0),
            Yr("maxHighlightLength", 1e4, L, !0),
            Yr("moveInputWithCursor", !0, function(e, t) {
                t || e.display.input.resetPosition()
            }),
            Yr("tabindex", null, function(e, t) {
                e.display.input.getField().tabIndex = t || ""
            }),
            Yr("autofocus", null);
            var qr = x.modes = {}
              , Zr = x.mimeModes = {};
            x.defineMode = function(e, t) {
                x.defaults.mode || "null" == e || (x.defaults.mode = e),
                arguments.length > 2 && (t.dependencies = Array.prototype.slice.call(arguments, 2)),
                qr[e] = t
            }
            ,
            x.defineMIME = function(e, t) {
                Zr[e] = t
            }
            ,
            x.resolveMode = function(e) {
                if ("string" == typeof e && Zr.hasOwnProperty(e))
                    e = Zr[e];
                else if (e && "string" == typeof e.name && Zr.hasOwnProperty(e.name)) {
                    var t = Zr[e.name];
                    "string" == typeof t && (t = {
                        name: t
                    }),
                    (e = ho(t, e)).name = t.name
                } else if ("string" == typeof e && /^[\w\-]+\/[\w\-]+\+xml$/.test(e))
                    return x.resolveMode("application/xml");
                return "string" == typeof e ? {
                    name: e
                } : e || {
                    name: "null"
                }
            }
            ,
            x.getMode = function(e, t) {
                t = x.resolveMode(t);
                var r = qr[t.name];
                if (!r)
                    return x.getMode(e, "text/plain");
                var n = r(e, t);
                if (Qr.hasOwnProperty(t.name)) {
                    var i = Qr[t.name];
                    for (var o in i)
                        i.hasOwnProperty(o) && (n.hasOwnProperty(o) && (n["_" + o] = n[o]),
                        n[o] = i[o])
                }
                if (n.name = t.name,
                t.helperType && (n.helperType = t.helperType),
                t.modeProps)
                    for (var o in t.modeProps)
                        n[o] = t.modeProps[o];
                return n
            }
            ,
            x.defineMode("null", function() {
                return {
                    token: function(e) {
                        e.skipToEnd()
                    }
                }
            }),
            x.defineMIME("text/plain", "null");
            var Qr = x.modeExtensions = {};
            x.extendMode = function(e, t) {
                po(t, Qr.hasOwnProperty(e) ? Qr[e] : Qr[e] = {})
            }
            ,
            x.defineExtension = function(e, t) {
                x.prototype[e] = t
            }
            ,
            x.defineDocExtension = function(e, t) {
                fi.prototype[e] = t
            }
            ,
            x.defineOption = Yr;
            var Jr = [];
            x.defineInitHook = function(e) {
                Jr.push(e)
            }
            ;
            var en = x.helpers = {};
            x.registerHelper = function(e, t, r) {
                en.hasOwnProperty(e) || (en[e] = x[e] = {
                    _global: []
                }),
                en[e][t] = r
            }
            ,
            x.registerGlobalHelper = function(e, t, r, n) {
                x.registerHelper(e, t, n),
                en[e]._global.push({
                    pred: r,
                    val: n
                })
            }
            ;
            var tn = x.copyState = function(e, t) {
                if (!0 === t)
                    return t;
                if (e.copyState)
                    return e.copyState(t);
                var r = {};
                for (var n in t) {
                    var i = t[n];
                    i instanceof Array && (i = i.concat([])),
                    r[n] = i
                }
                return r
            }
              , rn = x.startState = function(e, t, r) {
                return !e.startState || e.startState(t, r)
            }
            ;
            x.innerMode = function(e, t) {
                for (; e.innerMode; ) {
                    var r = e.innerMode(t);
                    if (!r || r.mode == e)
                        break;
                    t = r.state,
                    e = r.mode
                }
                return r || {
                    mode: e,
                    state: t
                }
            }
            ;
            var nn = x.commands = {
                selectAll: function(e) {
                    e.setSelection(ce(e.firstLine(), 0), ce(e.lastLine()), Ji)
                },
                singleSelection: function(e) {
                    e.setSelection(e.getCursor("anchor"), e.getCursor("head"), Ji)
                },
                killLine: function(e) {
                    Vr(e, function(t) {
                        if (t.empty()) {
                            var r = vi(e.doc, t.head.line).text.length;
                            return t.head.ch == r && t.head.line < e.lastLine() ? {
                                from: t.head,
                                to: ce(t.head.line + 1, 0)
                            } : {
                                from: t.head,
                                to: ce(t.head.line, r)
                            }
                        }
                        return {
                            from: t.from(),
                            to: t.to()
                        }
                    })
                },
                deleteLine: function(e) {
                    Vr(e, function(t) {
                        return {
                            from: ce(t.from().line, 0),
                            to: Ee(e.doc, ce(t.to().line + 1, 0))
                        }
                    })
                },
                delLineLeft: function(e) {
                    Vr(e, function(e) {
                        return {
                            from: ce(e.from().line, 0),
                            to: e.from()
                        }
                    })
                },
                delWrappedLineLeft: function(e) {
                    Vr(e, function(t) {
                        var r = e.charCoords(t.head, "div").top + 5;
                        return {
                            from: e.coordsChar({
                                left: 0,
                                top: r
                            }, "div"),
                            to: t.from()
                        }
                    })
                },
                delWrappedLineRight: function(e) {
                    Vr(e, function(t) {
                        var r = e.charCoords(t.head, "div").top + 5
                          , n = e.coordsChar({
                            left: e.display.lineDiv.offsetWidth + 100,
                            top: r
                        }, "div");
                        return {
                            from: t.from(),
                            to: n
                        }
                    })
                },
                undo: function(e) {
                    e.undo()
                },
                redo: function(e) {
                    e.redo()
                },
                undoSelection: function(e) {
                    e.undoSelection()
                },
                redoSelection: function(e) {
                    e.redoSelection()
                },
                goDocStart: function(e) {
                    e.extendSelection(ce(e.firstLine(), 0))
                },
                goDocEnd: function(e) {
                    e.extendSelection(ce(e.lastLine()))
                },
                goLineStart: function(e) {
                    e.extendSelectionsBy(function(t) {
                        return qo(e, t.head.line)
                    }, {
                        origin: "+move",
                        bias: 1
                    })
                },
                goLineStartSmart: function(e) {
                    e.extendSelectionsBy(function(t) {
                        return Zo(e, t.head)
                    }, {
                        origin: "+move",
                        bias: 1
                    })
                },
                goLineEnd: function(e) {
                    e.extendSelectionsBy(function(t) {
                        return function(e, t) {
                            var r, n = vi(e.doc, t);
                            for (; r = On(n); )
                                n = r.find(1, !0).line,
                                t = null;
                            var i = Si(n)
                              , o = i ? i[0].level % 2 ? Yo(n) : $o(n) : n.text.length;
                            return ce(null == t ? wi(n) : t, o)
                        }(e, t.head.line)
                    }, {
                        origin: "+move",
                        bias: -1
                    })
                },
                goLineRight: function(e) {
                    e.extendSelectionsBy(function(t) {
                        var r = e.charCoords(t.head, "div").top + 5;
                        return e.coordsChar({
                            left: e.display.lineDiv.offsetWidth + 100,
                            top: r
                        }, "div")
                    }, to)
                },
                goLineLeft: function(e) {
                    e.extendSelectionsBy(function(t) {
                        var r = e.charCoords(t.head, "div").top + 5;
                        return e.coordsChar({
                            left: 0,
                            top: r
                        }, "div")
                    }, to)
                },
                goLineLeftSmart: function(e) {
                    e.extendSelectionsBy(function(t) {
                        var r = e.charCoords(t.head, "div").top + 5
                          , n = e.coordsChar({
                            left: 0,
                            top: r
                        }, "div");
                        return n.ch < e.getLine(n.line).search(/\S/) ? Zo(e, t.head) : n
                    }, to)
                },
                goLineUp: function(e) {
                    e.moveV(-1, "line")
                },
                goLineDown: function(e) {
                    e.moveV(1, "line")
                },
                goPageUp: function(e) {
                    e.moveV(-1, "page")
                },
                goPageDown: function(e) {
                    e.moveV(1, "page")
                },
                goCharLeft: function(e) {
                    e.moveH(-1, "char")
                },
                goCharRight: function(e) {
                    e.moveH(1, "char")
                },
                goColumnLeft: function(e) {
                    e.moveH(-1, "column")
                },
                goColumnRight: function(e) {
                    e.moveH(1, "column")
                },
                goWordLeft: function(e) {
                    e.moveH(-1, "word")
                },
                goGroupRight: function(e) {
                    e.moveH(1, "group")
                },
                goGroupLeft: function(e) {
                    e.moveH(-1, "group")
                },
                goWordRight: function(e) {
                    e.moveH(1, "word")
                },
                delCharBefore: function(e) {
                    e.deleteH(-1, "char")
                },
                delCharAfter: function(e) {
                    e.deleteH(1, "char")
                },
                delWordBefore: function(e) {
                    e.deleteH(-1, "word")
                },
                delWordAfter: function(e) {
                    e.deleteH(1, "word")
                },
                delGroupBefore: function(e) {
                    e.deleteH(-1, "group")
                },
                delGroupAfter: function(e) {
                    e.deleteH(1, "group")
                },
                indentAuto: function(e) {
                    e.indentSelection("smart")
                },
                indentMore: function(e) {
                    e.indentSelection("add")
                },
                indentLess: function(e) {
                    e.indentSelection("subtract")
                },
                insertTab: function(e) {
                    e.replaceSelection("\t")
                },
                insertSoftTab: function(e) {
                    for (var t = [], r = e.listSelections(), n = e.options.tabSize, i = 0; i < r.length; i++) {
                        var o = r[i].from()
                          , l = no(e.getLine(o.line), o.ch, n);
                        t.push(new Array(n - l % n + 1).join(" "))
                    }
                    e.replaceSelections(t)
                },
                defaultTab: function(e) {
                    e.somethingSelected() ? e.indentSelection("add") : e.execCommand("insertTab")
                },
                transposeChars: function(e) {
                    Ut(e, function() {
                        for (var t = e.listSelections(), r = [], n = 0; n < t.length; n++) {
                            var i = t[n].head
                              , o = vi(e.doc, i.line).text;
                            if (o)
                                if (i.ch == o.length && (i = new ce(i.line,i.ch - 1)),
                                i.ch > 0)
                                    i = new ce(i.line,i.ch + 1),
                                    e.replaceRange(o.charAt(i.ch - 1) + o.charAt(i.ch - 2), ce(i.line, i.ch - 2), i, "+transpose");
                                else if (i.line > e.doc.first) {
                                    var l = vi(e.doc, i.line - 1).text;
                                    l && e.replaceRange(o.charAt(0) + e.doc.lineSeparator() + l.charAt(l.length - 1), ce(i.line - 1, l.length - 1), ce(i.line, 1), "+transpose")
                                }
                            r.push(new Oe(i,i))
                        }
                        e.setSelections(r)
                    })
                },
                newlineAndIndent: function(e) {
                    Ut(e, function() {
                        for (var t = e.listSelections().length, r = 0; r < t; r++) {
                            var n = e.listSelections()[r];
                            e.replaceRange(e.doc.lineSeparator(), n.anchor, n.head, "+input"),
                            e.indentLine(n.from().line + 1, null, !0),
                            Rr(e)
                        }
                    })
                },
                toggleOverwrite: function(e) {
                    e.toggleOverwrite()
                }
            }
              , on = x.keyMap = {};
            function ln(e) {
                for (var t, r, n, i, o = e.split(/-(?!$)/), l = (e = o[o.length - 1],
                0); l < o.length - 1; l++) {
                    var s = o[l];
                    if (/^(cmd|meta|m)$/i.test(s))
                        i = !0;
                    else if (/^a(lt)?$/i.test(s))
                        t = !0;
                    else if (/^(c|ctrl|control)$/i.test(s))
                        r = !0;
                    else {
                        if (!/^s(hift)$/i.test(s))
                            throw new Error("Unrecognized modifier name: " + s);
                        n = !0
                    }
                }
                return t && (e = "Alt-" + e),
                r && (e = "Ctrl-" + e),
                i && (e = "Cmd-" + e),
                n && (e = "Shift-" + e),
                e
            }
            on.basic = {
                Left: "goCharLeft",
                Right: "goCharRight",
                Up: "goLineUp",
                Down: "goLineDown",
                End: "goLineEnd",
                Home: "goLineStartSmart",
                PageUp: "goPageUp",
                PageDown: "goPageDown",
                Delete: "delCharAfter",
                Backspace: "delCharBefore",
                "Shift-Backspace": "delCharBefore",
                Tab: "defaultTab",
                "Shift-Tab": "indentAuto",
                Enter: "newlineAndIndent",
                Insert: "toggleOverwrite",
                Esc: "singleSelection"
            },
            on.pcDefault = {
                "Ctrl-A": "selectAll",
                "Ctrl-D": "deleteLine",
                "Ctrl-Z": "undo",
                "Shift-Ctrl-Z": "redo",
                "Ctrl-Y": "redo",
                "Ctrl-Home": "goDocStart",
                "Ctrl-End": "goDocEnd",
                "Ctrl-Up": "goLineUp",
                "Ctrl-Down": "goLineDown",
                "Ctrl-Left": "goGroupLeft",
                "Ctrl-Right": "goGroupRight",
                "Alt-Left": "goLineStart",
                "Alt-Right": "goLineEnd",
                "Ctrl-Backspace": "delGroupBefore",
                "Ctrl-Delete": "delGroupAfter",
                "Ctrl-S": "save",
                "Ctrl-F": "find",
                "Ctrl-G": "findNext",
                "Shift-Ctrl-G": "findPrev",
                "Shift-Ctrl-F": "replace",
                "Shift-Ctrl-R": "replaceAll",
                "Ctrl-[": "indentLess",
                "Ctrl-]": "indentMore",
                "Ctrl-U": "undoSelection",
                "Shift-Ctrl-U": "redoSelection",
                "Alt-U": "redoSelection",
                fallthrough: "basic"
            },
            on.emacsy = {
                "Ctrl-F": "goCharRight",
                "Ctrl-B": "goCharLeft",
                "Ctrl-P": "goLineUp",
                "Ctrl-N": "goLineDown",
                "Alt-F": "goWordRight",
                "Alt-B": "goWordLeft",
                "Ctrl-A": "goLineStart",
                "Ctrl-E": "goLineEnd",
                "Ctrl-V": "goPageDown",
                "Shift-Ctrl-V": "goPageUp",
                "Ctrl-D": "delCharAfter",
                "Ctrl-H": "delCharBefore",
                "Alt-D": "delWordAfter",
                "Alt-Backspace": "delWordBefore",
                "Ctrl-K": "killLine",
                "Ctrl-T": "transposeChars"
            },
            on.macDefault = {
                "Cmd-A": "selectAll",
                "Cmd-D": "deleteLine",
                "Cmd-Z": "undo",
                "Shift-Cmd-Z": "redo",
                "Cmd-Y": "redo",
                "Cmd-Home": "goDocStart",
                "Cmd-Up": "goDocStart",
                "Cmd-End": "goDocEnd",
                "Cmd-Down": "goDocEnd",
                "Alt-Left": "goGroupLeft",
                "Alt-Right": "goGroupRight",
                "Cmd-Left": "goLineLeft",
                "Cmd-Right": "goLineRight",
                "Alt-Backspace": "delGroupBefore",
                "Ctrl-Alt-Backspace": "delGroupAfter",
                "Alt-Delete": "delGroupAfter",
                "Cmd-S": "save",
                "Cmd-F": "find",
                "Cmd-G": "findNext",
                "Shift-Cmd-G": "findPrev",
                "Cmd-Alt-F": "replace",
                "Shift-Cmd-Alt-F": "replaceAll",
                "Cmd-[": "indentLess",
                "Cmd-]": "indentMore",
                "Cmd-Backspace": "delWrappedLineLeft",
                "Cmd-Delete": "delWrappedLineRight",
                "Cmd-U": "undoSelection",
                "Shift-Cmd-U": "redoSelection",
                "Ctrl-Up": "goDocStart",
                "Ctrl-Down": "goDocEnd",
                fallthrough: ["basic", "emacsy"]
            },
            on.default = p ? on.macDefault : on.pcDefault,
            x.normalizeKeyMap = function(e) {
                var t = {};
                for (var r in e)
                    if (e.hasOwnProperty(r)) {
                        var n = e[r];
                        if (/^(name|fallthrough|(de|at)tach)$/.test(r))
                            continue;
                        if ("..." == n) {
                            delete e[r];
                            continue
                        }
                        for (var i = co(r.split(" "), ln), o = 0; o < i.length; o++) {
                            var l, s;
                            o == i.length - 1 ? (s = i.join(" "),
                            l = n) : (s = i.slice(0, o + 1).join(" "),
                            l = "...");
                            var a = t[s];
                            if (a) {
                                if (a != l)
                                    throw new Error("Inconsistent bindings for " + s)
                            } else
                                t[s] = l
                        }
                        delete e[r]
                    }
                for (var u in t)
                    e[u] = t[u];
                return e
            }
            ;
            var sn = x.lookupKey = function(e, t, r, n) {
                var i = (t = cn(t)).call ? t.call(e, n) : t[e];
                if (!1 === i)
                    return "nothing";
                if ("..." === i)
                    return "multi";
                if (null != i && r(i))
                    return "handled";
                if (t.fallthrough) {
                    if ("[object Array]" != Object.prototype.toString.call(t.fallthrough))
                        return sn(e, t.fallthrough, r, n);
                    for (var o = 0; o < t.fallthrough.length; o++) {
                        var l = sn(e, t.fallthrough[o], r, n);
                        if (l)
                            return l
                    }
                }
            }
              , an = x.isModifierKey = function(e) {
                var t = "string" == typeof e ? e : jo[e.keyCode];
                return "Ctrl" == t || "Alt" == t || "Shift" == t || "Mod" == t
            }
              , un = x.keyName = function(e, t) {
                if (a && 34 == e.keyCode && e.char)
                    return !1;
                var r = jo[e.keyCode]
                  , n = r;
                return null != n && !e.altGraphKey && (e.altKey && "Alt" != r && (n = "Alt-" + n),
                (m ? e.metaKey : e.ctrlKey) && "Ctrl" != r && (n = "Ctrl-" + n),
                (m ? e.ctrlKey : e.metaKey) && "Cmd" != r && (n = "Cmd-" + n),
                !t && e.shiftKey && "Shift" != r && (n = "Shift-" + n),
                n)
            }
            ;
            function cn(e) {
                return "string" == typeof e ? on[e] : e
            }
            x.fromTextArea = function(e, t) {
                if ((t = t ? po(t) : {}).value = e.value,
                !t.tabindex && e.tabIndex && (t.tabindex = e.tabIndex),
                !t.placeholder && e.placeholder && (t.placeholder = e.placeholder),
                null == t.autofocus) {
                    var r = Mo();
                    t.autofocus = r == e || null != e.getAttribute("autofocus") && r == document.body
                }
                function n() {
                    e.value = s.getValue()
                }
                if (e.form && (Gi(e.form, "submit", n),
                !t.leaveSubmitMethodAlone)) {
                    var i = e.form
                      , o = i.submit;
                    try {
                        var l = i.submit = function() {
                            n(),
                            i.submit = o,
                            i.submit(),
                            i.submit = l
                        }
                    } catch (e) {}
                }
                t.finishInit = function(t) {
                    t.save = n,
                    t.getTextArea = function() {
                        return e
                    }
                    ,
                    t.toTextArea = function() {
                        t.toTextArea = isNaN,
                        n(),
                        e.parentNode.removeChild(t.getWrapperElement()),
                        e.style.display = "",
                        e.form && (Ui(e.form, "submit", n),
                        "function" == typeof e.form.submit && (e.form.submit = o))
                    }
                }
                ,
                e.style.display = "none";
                var s = x(function(t) {
                    e.parentNode.insertBefore(t, e.nextSibling)
                }, t);
                return s
            }
            ;
            var fn = x.StringStream = function(e, t) {
                this.pos = this.start = 0,
                this.string = e,
                this.tabSize = t || 8,
                this.lastColumnPos = this.lastColumnValue = 0,
                this.lineStart = 0
            }
            ;
            fn.prototype = {
                eol: function() {
                    return this.pos >= this.string.length
                },
                sol: function() {
                    return this.pos == this.lineStart
                },
                peek: function() {
                    return this.string.charAt(this.pos) || void 0
                },
                next: function() {
                    if (this.pos < this.string.length)
                        return this.string.charAt(this.pos++)
                },
                eat: function(e) {
                    var t = this.string.charAt(this.pos);
                    if ("string" == typeof e)
                        var r = t == e;
                    else
                        r = t && (e.test ? e.test(t) : e(t));
                    if (r)
                        return ++this.pos,
                        t
                },
                eatWhile: function(e) {
                    for (var t = this.pos; this.eat(e); )
                        ;
                    return this.pos > t
                },
                eatSpace: function() {
                    for (var e = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos)); )
                        ++this.pos;
                    return this.pos > e
                },
                skipToEnd: function() {
                    this.pos = this.string.length
                },
                skipTo: function(e) {
                    var t = this.string.indexOf(e, this.pos);
                    if (t > -1)
                        return this.pos = t,
                        !0
                },
                backUp: function(e) {
                    this.pos -= e
                },
                column: function() {
                    return this.lastColumnPos < this.start && (this.lastColumnValue = no(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue),
                    this.lastColumnPos = this.start),
                    this.lastColumnValue - (this.lineStart ? no(this.string, this.lineStart, this.tabSize) : 0)
                },
                indentation: function() {
                    return no(this.string, null, this.tabSize) - (this.lineStart ? no(this.string, this.lineStart, this.tabSize) : 0)
                },
                match: function(e, t, r) {
                    if ("string" != typeof e) {
                        var n = this.string.slice(this.pos).match(e);
                        return n && n.index > 0 ? null : (n && !1 !== t && (this.pos += n[0].length),
                        n)
                    }
                    var i = function(e) {
                        return r ? e.toLowerCase() : e
                    };
                    if (i(this.string.substr(this.pos, e.length)) == i(e))
                        return !1 !== t && (this.pos += e.length),
                        !0
                },
                current: function() {
                    return this.string.slice(this.start, this.pos)
                },
                hideFirstChars: function(e, t) {
                    this.lineStart += e;
                    try {
                        return t()
                    } finally {
                        this.lineStart -= e
                    }
                }
            };
            var hn = 0
              , dn = x.TextMarker = function(e, t) {
                this.lines = [],
                this.type = t,
                this.doc = e,
                this.id = ++hn
            }
            ;
            qi(dn),
            dn.prototype.clear = function() {
                if (!this.explicitlyCleared) {
                    var e = this.doc.cm
                      , t = e && !e.curOp;
                    if (t && It(e),
                    $i(this, "clear")) {
                        var r = this.find();
                        r && ji(this, "clear", r.from, r.to)
                    }
                    for (var n = null, i = null, o = 0; o < this.lines.length; ++o) {
                        var l = this.lines[o]
                          , s = bn(l.markedSpans, this);
                        e && !this.collapsed ? $t(e, wi(l), "text") : e && (null != s.to && (i = wi(l)),
                        null != s.from && (n = wi(l))),
                        l.markedSpans = wn(l.markedSpans, s),
                        null == s.from && this.collapsed && !In(this.doc, l) && e && bi(l, Wt(e.display))
                    }
                    if (e && this.collapsed && !e.options.lineWrapping)
                        for (o = 0; o < this.lines.length; ++o) {
                            var a = Hn(this.lines[o])
                              , u = O(a);
                            u > e.display.maxLineLength && (e.display.maxLine = a,
                            e.display.maxLineLength = u,
                            e.display.maxLineChanged = !0)
                        }
                    null != n && e && this.collapsed && Yt(e, n, i + 1),
                    this.lines.length = 0,
                    this.explicitlyCleared = !0,
                    this.atomic && this.doc.cantEdit && (this.doc.cantEdit = !1,
                    e && Xe(e.doc)),
                    e && ji(e, "markerCleared", e, this),
                    t && zt(e),
                    this.parent && this.parent.clear()
                }
            }
            ,
            dn.prototype.find = function(e, t) {
                var r, n;
                null == e && "bookmark" == this.type && (e = 1);
                for (var i = 0; i < this.lines.length; ++i) {
                    var o = this.lines[i]
                      , l = bn(o.markedSpans, this);
                    if (null != l.from && (r = ce(t ? o : wi(o), l.from),
                    -1 == e))
                        return r;
                    if (null != l.to && (n = ce(t ? o : wi(o), l.to),
                    1 == e))
                        return n
                }
                return r && {
                    from: r,
                    to: n
                }
            }
            ,
            dn.prototype.changed = function() {
                var e = this.find(-1, !0)
                  , t = this
                  , r = this.doc.cm;
                e && r && Ut(r, function() {
                    var n = e.line
                      , i = wi(e.line)
                      , o = ft(r, i);
                    if (o && (mt(o),
                    r.curOp.selectionChanged = r.curOp.forceUpdate = !0),
                    r.curOp.updateMaxLine = !0,
                    !In(t.doc, n) && null != t.height) {
                        var l = t.height;
                        t.height = null;
                        var s = Bn(t) - l;
                        s && bi(n, n.height + s)
                    }
                })
            }
            ,
            dn.prototype.attachLine = function(e) {
                if (!this.lines.length && this.doc.cm) {
                    var t = this.doc.cm.curOp;
                    t.maybeHiddenMarkers && -1 != uo(t.maybeHiddenMarkers, this) || (t.maybeUnhiddenMarkers || (t.maybeUnhiddenMarkers = [])).push(this)
                }
                this.lines.push(e)
            }
            ,
            dn.prototype.detachLine = function(e) {
                if (this.lines.splice(uo(this.lines, e), 1),
                !this.lines.length && this.doc.cm) {
                    var t = this.doc.cm.curOp;
                    (t.maybeHiddenMarkers || (t.maybeHiddenMarkers = [])).push(this)
                }
            }
            ;
            hn = 0;
            function pn(e, t, r, n, i) {
                if (n && n.shared)
                    return function(e, t, r, n, i) {
                        (n = po(n)).shared = !1;
                        var o = [pn(e, t, r, n, i)]
                          , l = o[0]
                          , s = n.widgetNode;
                        return pi(e, function(e) {
                            s && (n.widgetNode = s.cloneNode(!0)),
                            o.push(pn(e, Ee(e, t), Ee(e, r), n, i));
                            for (var a = 0; a < e.linked.length; ++a)
                                if (e.linked[a].isParent)
                                    return;
                            l = so(o)
                        }),
                        new gn(o,l)
                    }(e, t, r, n, i);
                if (e.cm && !e.cm.curOp)
                    return Vt(e.cm, pn)(e, t, r, n, i);
                var o = new dn(e,i)
                  , l = fe(t, r);
                if (n && po(n, o, !1),
                l > 0 || 0 == l && !1 !== o.clearWhenEmpty)
                    return o;
                if (o.replacedWith && (o.collapsed = !0,
                o.widgetNode = So("span", [o.replacedWith], "CodeMirror-widget"),
                n.handleMouseEvents || o.widgetNode.setAttribute("cm-ignore-events", "true"),
                n.insertLeft && (o.widgetNode.insertLeft = !0)),
                o.collapsed) {
                    if (Dn(e, t.line, t, r, o) || t.line != r.line && Dn(e, r.line, t, r, o))
                        throw new Error("Inserting collapsed marker partially overlapping an existing one");
                    w = !0
                }
                o.addToHistory && Mi(e, {
                    from: t,
                    to: r,
                    origin: "markText"
                }, e.sel, NaN);
                var s, a = t.line, u = e.cm;
                if (e.iter(a, r.line + 1, function(e) {
                    u && o.collapsed && !u.options.lineWrapping && Hn(e) == u.display.maxLine && (s = !0),
                    o.collapsed && a != t.line && bi(e, 0),
                    function(e, t) {
                        e.markedSpans = e.markedSpans ? e.markedSpans.concat([t]) : [t],
                        t.marker.attachLine(e)
                    }(e, new yn(o,a == t.line ? t.ch : null,a == r.line ? r.ch : null)),
                    ++a
                }),
                o.collapsed && e.iter(t.line, r.line + 1, function(t) {
                    In(e, t) && bi(t, 0)
                }),
                o.clearOnEnter && Gi(o, "beforeCursorEnter", function() {
                    o.clear()
                }),
                o.readOnly && (b = !0,
                (e.history.done.length || e.history.undone.length) && e.clearHistory()),
                o.collapsed && (o.id = ++hn,
                o.atomic = !0),
                u) {
                    if (s && (u.curOp.updateMaxLine = !0),
                    o.collapsed)
                        Yt(u, t.line, r.line + 1);
                    else if (o.className || o.title || o.startStyle || o.endStyle || o.css)
                        for (var c = t.line; c <= r.line; c++)
                            $t(u, c, "text");
                    o.atomic && Xe(u.doc),
                    ji(u, "markerAdded", u, o)
                }
                return o
            }
            var gn = x.SharedTextMarker = function(e, t) {
                this.markers = e,
                this.primary = t;
                for (var r = 0; r < e.length; ++r)
                    e[r].parent = this
            }
            ;
            function vn(e) {
                return e.findMarks(ce(e.first, 0), e.clipPos(ce(e.lastLine())), function(e) {
                    return e.parent
                })
            }
            function mn(e) {
                for (var t = 0; t < e.length; t++) {
                    var r = e[t]
                      , n = [r.primary.doc];
                    pi(r.primary.doc, function(e) {
                        n.push(e)
                    });
                    for (var i = 0; i < r.markers.length; i++) {
                        var o = r.markers[i];
                        -1 == uo(n, o.doc) && (o.parent = null,
                        r.markers.splice(i--, 1))
                    }
                }
            }
            function yn(e, t, r) {
                this.marker = e,
                this.from = t,
                this.to = r
            }
            function bn(e, t) {
                if (e)
                    for (var r = 0; r < e.length; ++r) {
                        var n = e[r];
                        if (n.marker == t)
                            return n
                    }
            }
            function wn(e, t) {
                for (var r, n = 0; n < e.length; ++n)
                    e[n] != t && (r || (r = [])).push(e[n]);
                return r
            }
            function xn(e, t) {
                if (t.full)
                    return null;
                var r = Ie(e, t.from.line) && vi(e, t.from.line).markedSpans
                  , n = Ie(e, t.to.line) && vi(e, t.to.line).markedSpans;
                if (!r && !n)
                    return null;
                var i = t.from.ch
                  , o = t.to.ch
                  , l = 0 == fe(t.from, t.to)
                  , s = function(e, t, r) {
                    if (e)
                        for (var n, i = 0; i < e.length; ++i) {
                            var o = e[i]
                              , l = o.marker;
                            if (null == o.from || (l.inclusiveLeft ? o.from <= t : o.from < t) || o.from == t && "bookmark" == l.type && (!r || !o.marker.insertLeft)) {
                                var s = null == o.to || (l.inclusiveRight ? o.to >= t : o.to > t);
                                (n || (n = [])).push(new yn(l,o.from,s ? null : o.to))
                            }
                        }
                    return n
                }(r, i, l)
                  , a = function(e, t, r) {
                    if (e)
                        for (var n, i = 0; i < e.length; ++i) {
                            var o = e[i]
                              , l = o.marker;
                            if (null == o.to || (l.inclusiveRight ? o.to >= t : o.to > t) || o.from == t && "bookmark" == l.type && (!r || o.marker.insertLeft)) {
                                var s = null == o.from || (l.inclusiveLeft ? o.from <= t : o.from < t);
                                (n || (n = [])).push(new yn(l,s ? null : o.from - t,null == o.to ? null : o.to - t))
                            }
                        }
                    return n
                }(n, o, l)
                  , u = 1 == t.text.length
                  , c = so(t.text).length + (u ? i : 0);
                if (s)
                    for (var f = 0; f < s.length; ++f) {
                        if (null == (h = s[f]).to)
                            (d = bn(a, h.marker)) ? u && (h.to = null == d.to ? null : d.to + c) : h.to = i
                    }
                if (a)
                    for (f = 0; f < a.length; ++f) {
                        var h, d;
                        if (null != (h = a[f]).to && (h.to += c),
                        null == h.from)
                            (d = bn(s, h.marker)) || (h.from = c,
                            u && (s || (s = [])).push(h));
                        else
                            h.from += c,
                            u && (s || (s = [])).push(h)
                    }
                s && (s = Cn(s)),
                a && a != s && (a = Cn(a));
                var p = [s];
                if (!u) {
                    var g, v = t.text.length - 2;
                    if (v > 0 && s)
                        for (f = 0; f < s.length; ++f)
                            null == s[f].to && (g || (g = [])).push(new yn(s[f].marker,null,null));
                    for (f = 0; f < v; ++f)
                        p.push(g);
                    p.push(a)
                }
                return p
            }
            function Cn(e) {
                for (var t = 0; t < e.length; ++t) {
                    var r = e[t];
                    null != r.from && r.from == r.to && !1 !== r.marker.clearWhenEmpty && e.splice(t--, 1)
                }
                return e.length ? e : null
            }
            function Sn(e, t) {
                var r = function(e, t) {
                    var r = t["spans_" + e.id];
                    if (!r)
                        return null;
                    for (var n = 0, i = []; n < t.text.length; ++n)
                        i.push(Wi(r[n]));
                    return i
                }(e, t)
                  , n = xn(e, t);
                if (!r)
                    return n;
                if (!n)
                    return r;
                for (var i = 0; i < r.length; ++i) {
                    var o = r[i]
                      , l = n[i];
                    if (o && l)
                        e: for (var s = 0; s < l.length; ++s) {
                            for (var a = l[s], u = 0; u < o.length; ++u)
                                if (o[u].marker == a.marker)
                                    continue e;
                            o.push(a)
                        }
                    else
                        l && (r[i] = l)
                }
                return r
            }
            function Ln(e) {
                var t = e.markedSpans;
                if (t) {
                    for (var r = 0; r < t.length; ++r)
                        t[r].marker.detachLine(e);
                    e.markedSpans = null
                }
            }
            function Tn(e, t) {
                if (t) {
                    for (var r = 0; r < t.length; ++r)
                        t[r].marker.attachLine(e);
                    e.markedSpans = t
                }
            }
            function kn(e) {
                return e.inclusiveLeft ? -1 : 0
            }
            function Mn(e) {
                return e.inclusiveRight ? 1 : 0
            }
            function Nn(e, t) {
                var r = e.lines.length - t.lines.length;
                if (0 != r)
                    return r;
                var n = e.find()
                  , i = t.find()
                  , o = fe(n.from, i.from) || kn(e) - kn(t);
                if (o)
                    return -o;
                var l = fe(n.to, i.to) || Mn(e) - Mn(t);
                return l || t.id - e.id
            }
            function An(e, t) {
                var r, n = w && e.markedSpans;
                if (n)
                    for (var i, o = 0; o < n.length; ++o)
                        (i = n[o]).marker.collapsed && null == (t ? i.from : i.to) && (!r || Nn(r, i.marker) < 0) && (r = i.marker);
                return r
            }
            function Wn(e) {
                return An(e, !0)
            }
            function On(e) {
                return An(e, !1)
            }
            function Dn(e, t, r, n, i) {
                var o = vi(e, t)
                  , l = w && o.markedSpans;
                if (l)
                    for (var s = 0; s < l.length; ++s) {
                        var a = l[s];
                        if (a.marker.collapsed) {
                            var u = a.marker.find(0)
                              , c = fe(u.from, r) || kn(a.marker) - kn(i)
                              , f = fe(u.to, n) || Mn(a.marker) - Mn(i);
                            if (!(c >= 0 && f <= 0 || c <= 0 && f >= 0) && (c <= 0 && (fe(u.to, r) > 0 || a.marker.inclusiveRight && i.inclusiveLeft) || c >= 0 && (fe(u.from, n) < 0 || a.marker.inclusiveLeft && i.inclusiveRight)))
                                return !0
                        }
                    }
            }
            function Hn(e) {
                for (var t; t = Wn(e); )
                    e = t.find(-1, !0).line;
                return e
            }
            function Pn(e, t) {
                var r = vi(e, t)
                  , n = Hn(r);
                return r == n ? t : wi(n)
            }
            function En(e, t) {
                if (t > e.lastLine())
                    return t;
                var r, n = vi(e, t);
                if (!In(e, n))
                    return t;
                for (; r = On(n); )
                    n = r.find(1, !0).line;
                return wi(n) + 1
            }
            function In(e, t) {
                var r = w && t.markedSpans;
                if (r)
                    for (var n, i = 0; i < r.length; ++i)
                        if ((n = r[i]).marker.collapsed) {
                            if (null == n.from)
                                return !0;
                            if (!n.marker.widgetNode && 0 == n.from && n.marker.inclusiveLeft && zn(e, t, n))
                                return !0
                        }
            }
            function zn(e, t, r) {
                if (null == r.to) {
                    var n = r.marker.find(1, !0);
                    return zn(e, n.line, bn(n.line.markedSpans, r.marker))
                }
                if (r.marker.inclusiveRight && r.to == t.text.length)
                    return !0;
                for (var i, o = 0; o < t.markedSpans.length; ++o)
                    if ((i = t.markedSpans[o]).marker.collapsed && !i.marker.widgetNode && i.from == r.to && (null == i.to || i.to != r.from) && (i.marker.inclusiveLeft || r.marker.inclusiveRight) && zn(e, t, i))
                        return !0
            }
            qi(gn),
            gn.prototype.clear = function() {
                if (!this.explicitlyCleared) {
                    this.explicitlyCleared = !0;
                    for (var e = 0; e < this.markers.length; ++e)
                        this.markers[e].clear();
                    ji(this, "clear")
                }
            }
            ,
            gn.prototype.find = function(e, t) {
                return this.primary.find(e, t)
            }
            ;
            var Fn = x.LineWidget = function(e, t, r) {
                if (r)
                    for (var n in r)
                        r.hasOwnProperty(n) && (this[n] = r[n]);
                this.doc = e,
                this.node = t
            }
            ;
            function Rn(e, t, r) {
                Ci(t) < (e.curOp && e.curOp.scrollTop || e.doc.scrollTop) && Fr(e, null, r)
            }
            function Bn(e) {
                if (null != e.height)
                    return e.height;
                var t = e.doc.cm;
                if (!t)
                    return 0;
                if (!ko(document.body, e.node)) {
                    var r = "position: relative;";
                    e.coverGutter && (r += "margin-left: -" + t.display.gutters.offsetWidth + "px;"),
                    e.noHScroll && (r += "width: " + t.display.wrapper.clientWidth + "px;"),
                    To(t.display.measure, So("div", [e.node], null, r))
                }
                return e.height = e.node.offsetHeight
            }
            qi(Fn),
            Fn.prototype.clear = function() {
                var e = this.doc.cm
                  , t = this.line.widgets
                  , r = this.line
                  , n = wi(r);
                if (null != n && t) {
                    for (var i = 0; i < t.length; ++i)
                        t[i] == this && t.splice(i--, 1);
                    t.length || (r.widgets = null);
                    var o = Bn(this);
                    bi(r, Math.max(0, r.height - o)),
                    e && Ut(e, function() {
                        Rn(e, r, -o),
                        $t(e, n, "widget")
                    })
                }
            }
            ,
            Fn.prototype.changed = function() {
                var e = this.height
                  , t = this.doc.cm
                  , r = this.line;
                this.height = null;
                var n = Bn(this) - e;
                n && (bi(r, r.height + n),
                t && Ut(t, function() {
                    t.curOp.forceUpdate = !0,
                    Rn(t, r, n)
                }))
            }
            ;
            var Gn = x.Line = function(e, t, r) {
                this.text = e,
                Tn(this, t),
                this.height = r ? r(this) : 1
            }
            ;
            function Un(e) {
                e.parent = null,
                Ln(e)
            }
            function Vn(e, t) {
                if (e)
                    for (; ; ) {
                        var r = e.match(/(?:^|\s+)line-(background-)?(\S+)/);
                        if (!r)
                            break;
                        e = e.slice(0, r.index) + e.slice(r.index + r[0].length);
                        var n = r[1] ? "bgClass" : "textClass";
                        null == t[n] ? t[n] = r[2] : new RegExp("(?:^|s)" + r[2] + "(?:$|s)").test(t[n]) || (t[n] += " " + r[2])
                    }
                return e
            }
            function Kn(e, t) {
                if (e.blankLine)
                    return e.blankLine(t);
                if (e.innerMode) {
                    var r = x.innerMode(e, t);
                    return r.mode.blankLine ? r.mode.blankLine(r.state) : void 0
                }
            }
            function jn(e, t, r, n) {
                for (var i = 0; i < 10; i++) {
                    n && (n[0] = x.innerMode(e, r).mode);
                    var o = e.token(t, r);
                    if (t.pos > t.start)
                        return o
                }
                throw new Error("Mode " + e.name + " failed to advance stream.")
            }
            function Xn(e, t, r, n) {
                function i(e) {
                    return {
                        start: f.start,
                        end: f.pos,
                        string: f.current(),
                        type: o || null,
                        state: e ? tn(l.mode, c) : c
                    }
                }
                var o, l = e.doc, s = l.mode;
                t = Ee(l, t);
                var a, u = vi(l, t.line), c = rt(e, t.line, r), f = new fn(u.text,e.options.tabSize);
                for (n && (a = []); (n || f.pos < t.ch) && !f.eol(); )
                    f.start = f.pos,
                    o = jn(s, f, c),
                    n && a.push(i(!0));
                return n ? a : i()
            }
            function _n(e, t, r, n, i, o, l) {
                var s = r.flattenSpans;
                null == s && (s = e.options.flattenSpans);
                var a, u = 0, c = null, f = new fn(t,e.options.tabSize), h = e.options.addModeClass && [null];
                for ("" == t && Vn(Kn(r, n), o); !f.eol(); ) {
                    if (f.pos > e.options.maxHighlightLength ? (s = !1,
                    l && qn(e, t, n, f.pos),
                    f.pos = t.length,
                    a = null) : a = Vn(jn(r, f, n, h), o),
                    h) {
                        var d = h[0].name;
                        d && (a = "m-" + (a ? d + " " + a : d))
                    }
                    if (!s || c != a) {
                        for (; u < f.start; )
                            i(u = Math.min(f.start, u + 5e4), c);
                        c = a
                    }
                    f.start = f.pos
                }
                for (; u < f.pos; ) {
                    var p = Math.min(f.pos, u + 5e4);
                    i(p, c),
                    u = p
                }
            }
            function Yn(e, t, r, n) {
                var i = [e.state.modeGen]
                  , o = {};
                _n(e, t.text, e.doc.mode, r, function(e, t) {
                    i.push(e, t)
                }, o, n);
                for (var l = 0; l < e.state.overlays.length; ++l) {
                    var s = e.state.overlays[l]
                      , a = 1
                      , u = 0;
                    _n(e, t.text, s.mode, !0, function(e, t) {
                        for (var r = a; u < e; ) {
                            var n = i[a];
                            n > e && i.splice(a, 1, e, i[a + 1], n),
                            a += 2,
                            u = Math.min(e, n)
                        }
                        if (t)
                            if (s.opaque)
                                i.splice(r, a - r, e, "cm-overlay " + t),
                                a = r + 2;
                            else
                                for (; r < a; r += 2) {
                                    var o = i[r + 1];
                                    i[r + 1] = (o ? o + " " : "") + "cm-overlay " + t
                                }
                    }, o)
                }
                return {
                    styles: i,
                    classes: o.bgClass || o.textClass ? o : null
                }
            }
            function $n(e, t, r) {
                if (!t.styles || t.styles[0] != e.state.modeGen) {
                    var n = rt(e, wi(t))
                      , i = Yn(e, t, t.text.length > e.options.maxHighlightLength ? tn(e.doc.mode, n) : n);
                    t.stateAfter = n,
                    t.styles = i.styles,
                    i.classes ? t.styleClasses = i.classes : t.styleClasses && (t.styleClasses = null),
                    r === e.doc.frontier && e.doc.frontier++
                }
                return t.styles
            }
            function qn(e, t, r, n) {
                var i = e.doc.mode
                  , o = new fn(t,e.options.tabSize);
                for (o.start = o.pos = n || 0,
                "" == t && Kn(i, r); !o.eol(); )
                    jn(i, o, r),
                    o.start = o.pos
            }
            qi(Gn),
            Gn.prototype.lineNo = function() {
                return wi(this)
            }
            ;
            var Zn = {}
              , Qn = {};
            function Jn(e, t) {
                if (!e || /^\s*$/.test(e))
                    return null;
                var r = t.addModeClass ? Qn : Zn;
                return r[e] || (r[e] = e.replace(/\S+/g, "cm-$&"))
            }
            function ei(e, t) {
                var r = So("span", null, null, o ? "padding-right: .1px" : null)
                  , i = {
                    pre: So("pre", [r], "CodeMirror-line"),
                    content: r,
                    col: 0,
                    pos: 0,
                    cm: e,
                    splitSpaces: (n || o) && e.getOption("lineWrapping")
                };
                t.measure = {};
                for (var l = 0; l <= (t.rest ? t.rest.length : 0); l++) {
                    var s, a = l ? t.rest[l - 1] : t.line;
                    i.pos = 0,
                    i.addToken = ti,
                    Fo(e.display.measure) && (s = Si(a)) && (i.addToken = ni(i.addToken, s)),
                    i.map = [],
                    oi(a, i, $n(e, a, t != e.display.externalMeasured && wi(a))),
                    a.styleClasses && (a.styleClasses.bgClass && (i.bgClass = Oo(a.styleClasses.bgClass, i.bgClass || "")),
                    a.styleClasses.textClass && (i.textClass = Oo(a.styleClasses.textClass, i.textClass || ""))),
                    0 == i.map.length && i.map.push(0, 0, i.content.appendChild(zo(e.display.measure))),
                    0 == l ? (t.measure.map = i.map,
                    t.measure.cache = {}) : ((t.measure.maps || (t.measure.maps = [])).push(i.map),
                    (t.measure.caches || (t.measure.caches = [])).push({}))
                }
                return o && /\bcm-tab\b/.test(i.content.lastChild.className) && (i.content.className = "cm-tab-wrap-hack"),
                Vi(e, "renderLine", e, t.line, i.pre),
                i.pre.className && (i.textClass = Oo(i.pre.className, i.textClass || "")),
                i
            }
            function ti(e, t, r, o, l, s, a) {
                if (t) {
                    var u = e.splitSpaces ? t.replace(/ {3,}/g, ri) : t
                      , c = e.cm.state.specialChars
                      , f = !1;
                    if (c.test(t)) {
                        y = document.createDocumentFragment();
                        for (var h = 0; ; ) {
                            c.lastIndex = h;
                            var d = c.exec(t)
                              , p = d ? d.index - h : t.length - h;
                            if (p) {
                                var g = document.createTextNode(u.slice(h, h + p));
                                n && i < 9 ? y.appendChild(So("span", [g])) : y.appendChild(g),
                                e.map.push(e.pos, e.pos + p, g),
                                e.col += p,
                                e.pos += p
                            }
                            if (!d)
                                break;
                            if (h += p + 1,
                            "\t" == d[0]) {
                                var v = e.cm.options.tabSize
                                  , m = v - e.col % v;
                                (g = y.appendChild(So("span", lo(m), "cm-tab"))).setAttribute("role", "presentation"),
                                g.setAttribute("cm-text", "\t"),
                                e.col += m
                            } else if ("\r" == d[0] || "\n" == d[0]) {
                                (g = y.appendChild(So("span", "\r" == d[0] ? "␍" : "␤", "cm-invalidchar"))).setAttribute("cm-text", d[0]),
                                e.col += 1
                            } else {
                                (g = e.cm.options.specialCharPlaceholder(d[0])).setAttribute("cm-text", d[0]),
                                n && i < 9 ? y.appendChild(So("span", [g])) : y.appendChild(g),
                                e.col += 1
                            }
                            e.map.push(e.pos, e.pos + 1, g),
                            e.pos++
                        }
                    } else {
                        e.col += t.length;
                        var y = document.createTextNode(u);
                        e.map.push(e.pos, e.pos + t.length, y),
                        n && i < 9 && (f = !0),
                        e.pos += t.length
                    }
                    if (r || o || l || f || a) {
                        var b = r || "";
                        o && (b += o),
                        l && (b += l);
                        var w = So("span", [y], b, a);
                        return s && (w.title = s),
                        e.content.appendChild(w)
                    }
                    e.content.appendChild(y)
                }
            }
            function ri(e) {
                for (var t = " ", r = 0; r < e.length - 2; ++r)
                    t += r % 2 ? " " : " ";
                return t += " "
            }
            function ni(e, t) {
                return function(r, n, i, o, l, s, a) {
                    i = i ? i + " cm-force-border" : "cm-force-border";
                    for (var u = r.pos, c = u + n.length; ; ) {
                        for (var f = 0; f < t.length; f++) {
                            var h = t[f];
                            if (h.to > u && h.from <= u)
                                break
                        }
                        if (h.to >= c)
                            return e(r, n, i, o, l, s, a);
                        e(r, n.slice(0, h.to - u), i, o, null, s, a),
                        o = null,
                        n = n.slice(h.to - u),
                        u = h.to
                    }
                }
            }
            function ii(e, t, r, n) {
                var i = !n && r.widgetNode;
                i && e.map.push(e.pos, e.pos + t, i),
                !n && e.cm.display.input.needsContentAttribute && (i || (i = e.content.appendChild(document.createElement("span"))),
                i.setAttribute("cm-marker", r.id)),
                i && (e.cm.display.input.setUneditable(i),
                e.content.appendChild(i)),
                e.pos += t
            }
            function oi(e, t, r) {
                var n = e.markedSpans
                  , i = e.text
                  , o = 0;
                if (n)
                    for (var l, s, a, u, c, f, h, d = i.length, p = 0, g = (L = 1,
                    ""), v = 0; ; ) {
                        if (v == p) {
                            a = u = c = f = s = "",
                            h = null,
                            v = 1 / 0;
                            for (var m = [], y = 0; y < n.length; ++y) {
                                var b = n[y]
                                  , w = b.marker;
                                "bookmark" == w.type && b.from == p && w.widgetNode ? m.push(w) : b.from <= p && (null == b.to || b.to > p || w.collapsed && b.to == p && b.from == p) ? (null != b.to && b.to != p && v > b.to && (v = b.to,
                                u = ""),
                                w.className && (a += " " + w.className),
                                w.css && (s = w.css),
                                w.startStyle && b.from == p && (c += " " + w.startStyle),
                                w.endStyle && b.to == v && (u += " " + w.endStyle),
                                w.title && !f && (f = w.title),
                                w.collapsed && (!h || Nn(h.marker, w) < 0) && (h = b)) : b.from > p && v > b.from && (v = b.from)
                            }
                            if (h && (h.from || 0) == p) {
                                if (ii(t, (null == h.to ? d + 1 : h.to) - p, h.marker, null == h.from),
                                null == h.to)
                                    return;
                                h.to == p && (h = !1)
                            }
                            if (!h && m.length)
                                for (y = 0; y < m.length; ++y)
                                    ii(t, 0, m[y])
                        }
                        if (p >= d)
                            break;
                        for (var x = Math.min(d, v); ; ) {
                            if (g) {
                                var C = p + g.length;
                                if (!h) {
                                    var S = C > x ? g.slice(0, x - p) : g;
                                    t.addToken(t, S, l ? l + a : a, c, p + S.length == v ? u : "", f, s)
                                }
                                if (C >= x) {
                                    g = g.slice(x - p),
                                    p = x;
                                    break
                                }
                                p = C,
                                c = ""
                            }
                            g = i.slice(o, o = r[L++]),
                            l = Jn(r[L++], t.cm.options)
                        }
                    }
                else
                    for (var L = 1; L < r.length; L += 2)
                        t.addToken(t, i.slice(o, o = r[L]), Jn(r[L + 1], t.cm.options))
            }
            function li(e, t) {
                return 0 == t.from.ch && 0 == t.to.ch && "" == so(t.text) && (!e.cm || e.cm.options.wholeLineUpdateBefore)
            }
            function si(e, t, r, n) {
                function i(e) {
                    return r ? r[e] : null
                }
                function o(e, r, i) {
                    !function(e, t, r, n) {
                        e.text = t,
                        e.stateAfter && (e.stateAfter = null),
                        e.styles && (e.styles = null),
                        null != e.order && (e.order = null),
                        Ln(e),
                        Tn(e, r);
                        var i = n ? n(e) : 1;
                        i != e.height && bi(e, i)
                    }(e, r, i, n),
                    ji(e, "change", e, t)
                }
                function l(e, t) {
                    for (var r = e, o = []; r < t; ++r)
                        o.push(new Gn(u[r],i(r),n));
                    return o
                }
                var s = t.from
                  , a = t.to
                  , u = t.text
                  , c = vi(e, s.line)
                  , f = vi(e, a.line)
                  , h = so(u)
                  , d = i(u.length - 1)
                  , p = a.line - s.line;
                if (t.full)
                    e.insert(0, l(0, u.length)),
                    e.remove(u.length, e.size - u.length);
                else if (li(e, t)) {
                    var g = l(0, u.length - 1);
                    o(f, f.text, d),
                    p && e.remove(s.line, p),
                    g.length && e.insert(s.line, g)
                } else if (c == f) {
                    if (1 == u.length)
                        o(c, c.text.slice(0, s.ch) + h + c.text.slice(a.ch), d);
                    else
                        (g = l(1, u.length - 1)).push(new Gn(h + c.text.slice(a.ch),d,n)),
                        o(c, c.text.slice(0, s.ch) + u[0], i(0)),
                        e.insert(s.line + 1, g)
                } else if (1 == u.length)
                    o(c, c.text.slice(0, s.ch) + u[0] + f.text.slice(a.ch), i(0)),
                    e.remove(s.line + 1, p);
                else {
                    o(c, c.text.slice(0, s.ch) + u[0], i(0)),
                    o(f, h + f.text.slice(a.ch), d);
                    g = l(1, u.length - 1);
                    p > 1 && e.remove(s.line + 1, p - 1),
                    e.insert(s.line + 1, g)
                }
                ji(e, "change", e, t)
            }
            function ai(e) {
                this.lines = e,
                this.parent = null;
                for (var t = 0, r = 0; t < e.length; ++t)
                    e[t].parent = this,
                    r += e[t].height;
                this.height = r
            }
            function ui(e) {
                this.children = e;
                for (var t = 0, r = 0, n = 0; n < e.length; ++n) {
                    var i = e[n];
                    t += i.chunkSize(),
                    r += i.height,
                    i.parent = this
                }
                this.size = t,
                this.height = r,
                this.parent = null
            }
            ai.prototype = {
                chunkSize: function() {
                    return this.lines.length
                },
                removeInner: function(e, t) {
                    for (var r = e, n = e + t; r < n; ++r) {
                        var i = this.lines[r];
                        this.height -= i.height,
                        Un(i),
                        ji(i, "delete")
                    }
                    this.lines.splice(e, t)
                },
                collapse: function(e) {
                    e.push.apply(e, this.lines)
                },
                insertInner: function(e, t, r) {
                    this.height += r,
                    this.lines = this.lines.slice(0, e).concat(t).concat(this.lines.slice(e));
                    for (var n = 0; n < t.length; ++n)
                        t[n].parent = this
                },
                iterN: function(e, t, r) {
                    for (var n = e + t; e < n; ++e)
                        if (r(this.lines[e]))
                            return !0
                }
            },
            ui.prototype = {
                chunkSize: function() {
                    return this.size
                },
                removeInner: function(e, t) {
                    this.size -= t;
                    for (var r = 0; r < this.children.length; ++r) {
                        var n = this.children[r]
                          , i = n.chunkSize();
                        if (e < i) {
                            var o = Math.min(t, i - e)
                              , l = n.height;
                            if (n.removeInner(e, o),
                            this.height -= l - n.height,
                            i == o && (this.children.splice(r--, 1),
                            n.parent = null),
                            0 == (t -= o))
                                break;
                            e = 0
                        } else
                            e -= i
                    }
                    if (this.size - t < 25 && (this.children.length > 1 || !(this.children[0]instanceof ai))) {
                        var s = [];
                        this.collapse(s),
                        this.children = [new ai(s)],
                        this.children[0].parent = this
                    }
                },
                collapse: function(e) {
                    for (var t = 0; t < this.children.length; ++t)
                        this.children[t].collapse(e)
                },
                insertInner: function(e, t, r) {
                    this.size += t.length,
                    this.height += r;
                    for (var n = 0; n < this.children.length; ++n) {
                        var i = this.children[n]
                          , o = i.chunkSize();
                        if (e <= o) {
                            if (i.insertInner(e, t, r),
                            i.lines && i.lines.length > 50) {
                                for (; i.lines.length > 50; ) {
                                    var l = new ai(i.lines.splice(i.lines.length - 25, 25));
                                    i.height -= l.height,
                                    this.children.splice(n + 1, 0, l),
                                    l.parent = this
                                }
                                this.maybeSpill()
                            }
                            break
                        }
                        e -= o
                    }
                },
                maybeSpill: function() {
                    if (!(this.children.length <= 10)) {
                        var e = this;
                        do {
                            var t = new ui(e.children.splice(e.children.length - 5, 5));
                            if (e.parent) {
                                e.size -= t.size,
                                e.height -= t.height;
                                var r = uo(e.parent.children, e);
                                e.parent.children.splice(r + 1, 0, t)
                            } else {
                                var n = new ui(e.children);
                                n.parent = e,
                                e.children = [n, t],
                                e = n
                            }
                            t.parent = e.parent
                        } while (e.children.length > 10);
                        e.parent.maybeSpill()
                    }
                },
                iterN: function(e, t, r) {
                    for (var n = 0; n < this.children.length; ++n) {
                        var i = this.children[n]
                          , o = i.chunkSize();
                        if (e < o) {
                            var l = Math.min(t, o - e);
                            if (i.iterN(e, l, r))
                                return !0;
                            if (0 == (t -= l))
                                break;
                            e = 0
                        } else
                            e -= o
                    }
                }
            };
            var ci = 0
              , fi = x.Doc = function(e, t, r, n) {
                if (!(this instanceof fi))
                    return new fi(e,t,r,n);
                null == r && (r = 0),
                ui.call(this, [new ai([new Gn("",null)])]),
                this.first = r,
                this.scrollTop = this.scrollLeft = 0,
                this.cantEdit = !1,
                this.cleanGeneration = 1,
                this.frontier = r;
                var i = ce(r, 0);
                this.sel = He(i),
                this.history = new Li(null),
                this.id = ++ci,
                this.modeOption = t,
                this.lineSep = n,
                "string" == typeof e && (e = this.splitLines(e)),
                si(this, {
                    from: i,
                    to: i,
                    text: e
                }),
                Ve(this, He(i), Ji)
            }
            ;
            fi.prototype = ho(ui.prototype, {
                constructor: fi,
                iter: function(e, t, r) {
                    r ? this.iterN(e - this.first, t - e, r) : this.iterN(this.first, this.first + this.size, e)
                },
                insert: function(e, t) {
                    for (var r = 0, n = 0; n < t.length; ++n)
                        r += t[n].height;
                    this.insertInner(e - this.first, t, r)
                },
                remove: function(e, t) {
                    this.removeInner(e - this.first, t)
                },
                getValue: function(e) {
                    var t = yi(this, this.first, this.first + this.size);
                    return !1 === e ? t : t.join(e || this.lineSeparator())
                },
                setValue: jt(function(e) {
                    var t = ce(this.first, 0)
                      , r = this.first + this.size - 1;
                    Or(this, {
                        from: t,
                        to: ce(r, vi(this, r).text.length),
                        text: this.splitLines(e),
                        origin: "setValue",
                        full: !0
                    }, !0),
                    Ve(this, He(t))
                }),
                replaceRange: function(e, t, r, n) {
                    Ir(this, e, t = Ee(this, t), r = r ? Ee(this, r) : t, n)
                },
                getRange: function(e, t, r) {
                    var n = mi(this, Ee(this, e), Ee(this, t));
                    return !1 === r ? n : n.join(r || this.lineSeparator())
                },
                getLine: function(e) {
                    var t = this.getLineHandle(e);
                    return t && t.text
                },
                getLineHandle: function(e) {
                    if (Ie(this, e))
                        return vi(this, e)
                },
                getLineNumber: function(e) {
                    return wi(e)
                },
                getLineHandleVisualStart: function(e) {
                    return "number" == typeof e && (e = vi(this, e)),
                    Hn(e)
                },
                lineCount: function() {
                    return this.size
                },
                firstLine: function() {
                    return this.first
                },
                lastLine: function() {
                    return this.first + this.size - 1
                },
                clipPos: function(e) {
                    return Ee(this, e)
                },
                getCursor: function(e) {
                    var t = this.sel.primary();
                    return null == e || "head" == e ? t.head : "anchor" == e ? t.anchor : "end" == e || "to" == e || !1 === e ? t.to() : t.from()
                },
                listSelections: function() {
                    return this.sel.ranges
                },
                somethingSelected: function() {
                    return this.sel.somethingSelected()
                },
                setCursor: jt(function(e, t, r) {
                    Ge(this, Ee(this, "number" == typeof e ? ce(e, t || 0) : e), null, r)
                }),
                setSelection: jt(function(e, t, r) {
                    Ge(this, Ee(this, e), Ee(this, t || e), r)
                }),
                extendSelection: jt(function(e, t, r) {
                    Fe(this, Ee(this, e), t && Ee(this, t), r)
                }),
                extendSelections: jt(function(e, t) {
                    Re(this, function(e, t) {
                        for (var r = [], n = 0; n < t.length; n++)
                            r[n] = Ee(e, t[n]);
                        return r
                    }(this, e))
                }),
                extendSelectionsBy: jt(function(e, t) {
                    Re(this, co(this.sel.ranges, e), t)
                }),
                setSelections: jt(function(e, t, r) {
                    if (e.length) {
                        for (var n = 0, i = []; n < e.length; n++)
                            i[n] = new Oe(Ee(this, e[n].anchor),Ee(this, e[n].head));
                        null == t && (t = Math.min(e.length - 1, this.sel.primIndex)),
                        Ve(this, De(i, t), r)
                    }
                }),
                addSelection: jt(function(e, t, r) {
                    var n = this.sel.ranges.slice(0);
                    n.push(new Oe(Ee(this, e),Ee(this, t || e))),
                    Ve(this, De(n, n.length - 1), r)
                }),
                getSelection: function(e) {
                    for (var t, r = this.sel.ranges, n = 0; n < r.length; n++) {
                        var i = mi(this, r[n].from(), r[n].to());
                        t = t ? t.concat(i) : i
                    }
                    return !1 === e ? t : t.join(e || this.lineSeparator())
                },
                getSelections: function(e) {
                    for (var t = [], r = this.sel.ranges, n = 0; n < r.length; n++) {
                        var i = mi(this, r[n].from(), r[n].to());
                        !1 !== e && (i = i.join(e || this.lineSeparator())),
                        t[n] = i
                    }
                    return t
                },
                replaceSelection: function(e, t, r) {
                    for (var n = [], i = 0; i < this.sel.ranges.length; i++)
                        n[i] = e;
                    this.replaceSelections(n, t, r || "+input")
                },
                replaceSelections: jt(function(e, t, r) {
                    for (var n = [], i = this.sel, o = 0; o < i.ranges.length; o++) {
                        var l = i.ranges[o];
                        n[o] = {
                            from: l.from(),
                            to: l.to(),
                            text: this.splitLines(e[o]),
                            origin: r
                        }
                    }
                    var s = t && "end" != t && function(e, t, r) {
                        for (var n = [], i = ce(e.first, 0), o = i, l = 0; l < t.length; l++) {
                            var s = t[l]
                              , a = Ar(s.from, i, o)
                              , u = Ar(kr(s), i, o);
                            if (i = s.to,
                            o = u,
                            "around" == r) {
                                var c = e.sel.ranges[l]
                                  , f = fe(c.head, c.anchor) < 0;
                                n[l] = new Oe(f ? u : a,f ? a : u)
                            } else
                                n[l] = new Oe(a,a)
                        }
                        return new We(n,e.sel.primIndex)
                    }(this, n, t);
                    for (o = n.length - 1; o >= 0; o--)
                        Or(this, n[o]);
                    s ? Ue(this, s) : this.cm && Rr(this.cm)
                }),
                undo: jt(function() {
                    Hr(this, "undo")
                }),
                redo: jt(function() {
                    Hr(this, "redo")
                }),
                undoSelection: jt(function() {
                    Hr(this, "undo", !0)
                }),
                redoSelection: jt(function() {
                    Hr(this, "redo", !0)
                }),
                setExtending: function(e) {
                    this.extend = e
                },
                getExtending: function() {
                    return this.extend
                },
                historySize: function() {
                    for (var e = this.history, t = 0, r = 0, n = 0; n < e.done.length; n++)
                        e.done[n].ranges || ++t;
                    for (n = 0; n < e.undone.length; n++)
                        e.undone[n].ranges || ++r;
                    return {
                        undo: t,
                        redo: r
                    }
                },
                clearHistory: function() {
                    this.history = new Li(this.history.maxGeneration)
                },
                markClean: function() {
                    this.cleanGeneration = this.changeGeneration(!0)
                },
                changeGeneration: function(e) {
                    return e && (this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null),
                    this.history.generation
                },
                isClean: function(e) {
                    return this.history.generation == (e || this.cleanGeneration)
                },
                getHistory: function() {
                    return {
                        done: Oi(this.history.done),
                        undone: Oi(this.history.undone)
                    }
                },
                setHistory: function(e) {
                    var t = this.history = new Li(this.history.maxGeneration);
                    t.done = Oi(e.done.slice(0), null, !0),
                    t.undone = Oi(e.undone.slice(0), null, !0)
                },
                addLineClass: jt(function(e, t, r) {
                    return Ur(this, e, "gutter" == t ? "gutter" : "class", function(e) {
                        var n = "text" == t ? "textClass" : "background" == t ? "bgClass" : "gutter" == t ? "gutterClass" : "wrapClass";
                        if (e[n]) {
                            if (No(r).test(e[n]))
                                return !1;
                            e[n] += " " + r
                        } else
                            e[n] = r;
                        return !0
                    })
                }),
                removeLineClass: jt(function(e, t, r) {
                    return Ur(this, e, "gutter" == t ? "gutter" : "class", function(e) {
                        var n = "text" == t ? "textClass" : "background" == t ? "bgClass" : "gutter" == t ? "gutterClass" : "wrapClass"
                          , i = e[n];
                        if (!i)
                            return !1;
                        if (null == r)
                            e[n] = null;
                        else {
                            var o = i.match(No(r));
                            if (!o)
                                return !1;
                            var l = o.index + o[0].length;
                            e[n] = i.slice(0, o.index) + (o.index && l != i.length ? " " : "") + i.slice(l) || null
                        }
                        return !0
                    })
                }),
                addLineWidget: jt(function(e, t, r) {
                    return function(e, t, r, n) {
                        var i = new Fn(e,r,n)
                          , o = e.cm;
                        return o && i.noHScroll && (o.display.alignWidgets = !0),
                        Ur(e, t, "widget", function(t) {
                            var r = t.widgets || (t.widgets = []);
                            if (null == i.insertAt ? r.push(i) : r.splice(Math.min(r.length - 1, Math.max(0, i.insertAt)), 0, i),
                            i.line = t,
                            o && !In(e, t)) {
                                var n = Ci(t) < e.scrollTop;
                                bi(t, t.height + Bn(i)),
                                n && Fr(o, null, i.height),
                                o.curOp.forceUpdate = !0
                            }
                            return !0
                        }),
                        i
                    }(this, e, t, r)
                }),
                removeLineWidget: function(e) {
                    e.clear()
                },
                markText: function(e, t, r) {
                    return pn(this, Ee(this, e), Ee(this, t), r, "range")
                },
                setBookmark: function(e, t) {
                    var r = {
                        replacedWith: t && (null == t.nodeType ? t.widget : t),
                        insertLeft: t && t.insertLeft,
                        clearWhenEmpty: !1,
                        shared: t && t.shared,
                        handleMouseEvents: t && t.handleMouseEvents
                    };
                    return pn(this, e = Ee(this, e), e, r, "bookmark")
                },
                findMarksAt: function(e) {
                    var t = []
                      , r = vi(this, (e = Ee(this, e)).line).markedSpans;
                    if (r)
                        for (var n = 0; n < r.length; ++n) {
                            var i = r[n];
                            (null == i.from || i.from <= e.ch) && (null == i.to || i.to >= e.ch) && t.push(i.marker.parent || i.marker)
                        }
                    return t
                },
                findMarks: function(e, t, r) {
                    e = Ee(this, e),
                    t = Ee(this, t);
                    var n = []
                      , i = e.line;
                    return this.iter(e.line, t.line + 1, function(o) {
                        var l = o.markedSpans;
                        if (l)
                            for (var s = 0; s < l.length; s++) {
                                var a = l[s];
                                i == e.line && e.ch > a.to || null == a.from && i != e.line || i == t.line && a.from > t.ch || r && !r(a.marker) || n.push(a.marker.parent || a.marker)
                            }
                        ++i
                    }),
                    n
                },
                getAllMarks: function() {
                    var e = [];
                    return this.iter(function(t) {
                        var r = t.markedSpans;
                        if (r)
                            for (var n = 0; n < r.length; ++n)
                                null != r[n].from && e.push(r[n].marker)
                    }),
                    e
                },
                posFromIndex: function(e) {
                    var t, r = this.first;
                    return this.iter(function(n) {
                        var i = n.text.length + 1;
                        if (i > e)
                            return t = e,
                            !0;
                        e -= i,
                        ++r
                    }),
                    Ee(this, ce(r, t))
                },
                indexFromPos: function(e) {
                    var t = (e = Ee(this, e)).ch;
                    return e.line < this.first || e.ch < 0 ? 0 : (this.iter(this.first, e.line, function(e) {
                        t += e.text.length + 1
                    }),
                    t)
                },
                copy: function(e) {
                    var t = new fi(yi(this, this.first, this.first + this.size),this.modeOption,this.first,this.lineSep);
                    return t.scrollTop = this.scrollTop,
                    t.scrollLeft = this.scrollLeft,
                    t.sel = this.sel,
                    t.extend = !1,
                    e && (t.history.undoDepth = this.history.undoDepth,
                    t.setHistory(this.getHistory())),
                    t
                },
                linkedDoc: function(e) {
                    e || (e = {});
                    var t = this.first
                      , r = this.first + this.size;
                    null != e.from && e.from > t && (t = e.from),
                    null != e.to && e.to < r && (r = e.to);
                    var n = new fi(yi(this, t, r),e.mode || this.modeOption,t,this.lineSep);
                    return e.sharedHist && (n.history = this.history),
                    (this.linked || (this.linked = [])).push({
                        doc: n,
                        sharedHist: e.sharedHist
                    }),
                    n.linked = [{
                        doc: this,
                        isParent: !0,
                        sharedHist: e.sharedHist
                    }],
                    function(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var n = t[r]
                              , i = n.find()
                              , o = e.clipPos(i.from)
                              , l = e.clipPos(i.to);
                            if (fe(o, l)) {
                                var s = pn(e, o, l, n.primary, n.primary.type);
                                n.markers.push(s),
                                s.parent = n
                            }
                        }
                    }(n, vn(this)),
                    n
                },
                unlinkDoc: function(e) {
                    if (e instanceof x && (e = e.doc),
                    this.linked)
                        for (var t = 0; t < this.linked.length; ++t) {
                            if (this.linked[t].doc == e) {
                                this.linked.splice(t, 1),
                                e.unlinkDoc(this),
                                mn(vn(this));
                                break
                            }
                        }
                    if (e.history == this.history) {
                        var r = [e.id];
                        pi(e, function(e) {
                            r.push(e.id)
                        }, !0),
                        e.history = new Li(null),
                        e.history.done = Oi(this.history.done, r),
                        e.history.undone = Oi(this.history.undone, r)
                    }
                },
                iterLinkedDocs: function(e) {
                    pi(this, e)
                },
                getMode: function() {
                    return this.mode
                },
                getEditor: function() {
                    return this.cm
                },
                splitLines: function(e) {
                    return this.lineSep ? e.split(this.lineSep) : Bo(e)
                },
                lineSeparator: function() {
                    return this.lineSep || "\n"
                }
            }),
            fi.prototype.eachLine = fi.prototype.iter;
            var hi = "iter insert remove copy getEditor constructor".split(" ");
            for (var di in fi.prototype)
                fi.prototype.hasOwnProperty(di) && uo(hi, di) < 0 && (x.prototype[di] = function(e) {
                    return function() {
                        return e.apply(this.doc, arguments)
                    }
                }(fi.prototype[di]));
            function pi(e, t, r) {
                !function e(n, i, o) {
                    if (n.linked)
                        for (var l = 0; l < n.linked.length; ++l) {
                            var s = n.linked[l];
                            if (s.doc != i) {
                                var a = o && s.sharedHist;
                                r && !a || (t(s.doc, a),
                                e(s.doc, n, a))
                            }
                        }
                }(e, null, !0)
            }
            function gi(e, t) {
                if (t.cm)
                    throw new Error("This document is already in use.");
                e.doc = t,
                t.cm = e,
                k(e),
                S(e),
                e.options.lineWrapping || D(e),
                e.options.mode = t.modeOption,
                Yt(e)
            }
            function vi(e, t) {
                if ((t -= e.first) < 0 || t >= e.size)
                    throw new Error("There is no line " + (t + e.first) + " in the document.");
                for (var r = e; !r.lines; )
                    for (var n = 0; ; ++n) {
                        var i = r.children[n]
                          , o = i.chunkSize();
                        if (t < o) {
                            r = i;
                            break
                        }
                        t -= o
                    }
                return r.lines[t]
            }
            function mi(e, t, r) {
                var n = []
                  , i = t.line;
                return e.iter(t.line, r.line + 1, function(e) {
                    var o = e.text;
                    i == r.line && (o = o.slice(0, r.ch)),
                    i == t.line && (o = o.slice(t.ch)),
                    n.push(o),
                    ++i
                }),
                n
            }
            function yi(e, t, r) {
                var n = [];
                return e.iter(t, r, function(e) {
                    n.push(e.text)
                }),
                n
            }
            function bi(e, t) {
                var r = t - e.height;
                if (r)
                    for (var n = e; n; n = n.parent)
                        n.height += r
            }
            function wi(e) {
                if (null == e.parent)
                    return null;
                for (var t = e.parent, r = uo(t.lines, e), n = t.parent; n; t = n,
                n = n.parent)
                    for (var i = 0; n.children[i] != t; ++i)
                        r += n.children[i].chunkSize();
                return r + t.first
            }
            function xi(e, t) {
                var r = e.first;
                e: do {
                    for (var n = 0; n < e.children.length; ++n) {
                        var i = e.children[n]
                          , o = i.height;
                        if (t < o) {
                            e = i;
                            continue e
                        }
                        t -= o,
                        r += i.chunkSize()
                    }
                    return r
                } while (!e.lines);
                for (n = 0; n < e.lines.length; ++n) {
                    var l = e.lines[n].height;
                    if (t < l)
                        break;
                    t -= l
                }
                return r + n
            }
            function Ci(e) {
                for (var t = 0, r = (e = Hn(e)).parent, n = 0; n < r.lines.length; ++n) {
                    var i = r.lines[n];
                    if (i == e)
                        break;
                    t += i.height
                }
                for (var o = r.parent; o; o = (r = o).parent)
                    for (n = 0; n < o.children.length; ++n) {
                        var l = o.children[n];
                        if (l == r)
                            break;
                        t += l.height
                    }
                return t
            }
            function Si(e) {
                var t = e.order;
                return null == t && (t = e.order = nl(e.text)),
                t
            }
            function Li(e) {
                this.done = [],
                this.undone = [],
                this.undoDepth = 1 / 0,
                this.lastModTime = this.lastSelTime = 0,
                this.lastOp = this.lastSelOp = null,
                this.lastOrigin = this.lastSelOrigin = null,
                this.generation = this.maxGeneration = e || 1
            }
            function Ti(e, t) {
                var r = {
                    from: he(t.from),
                    to: kr(t),
                    text: mi(e, t.from, t.to)
                };
                return Ai(e, r, t.from.line, t.to.line + 1),
                pi(e, function(e) {
                    Ai(e, r, t.from.line, t.to.line + 1)
                }, !0),
                r
            }
            function ki(e) {
                for (; e.length; ) {
                    if (!so(e).ranges)
                        break;
                    e.pop()
                }
            }
            function Mi(e, t, r, n) {
                var i = e.history;
                i.undone.length = 0;
                var o, l = +new Date;
                if ((i.lastOp == n || i.lastOrigin == t.origin && t.origin && ("+" == t.origin.charAt(0) && e.cm && i.lastModTime > l - e.cm.options.historyEventDelay || "*" == t.origin.charAt(0))) && (o = function(e, t) {
                    return t ? (ki(e.done),
                    so(e.done)) : e.done.length && !so(e.done).ranges ? so(e.done) : e.done.length > 1 && !e.done[e.done.length - 2].ranges ? (e.done.pop(),
                    so(e.done)) : void 0
                }(i, i.lastOp == n))) {
                    var s = so(o.changes);
                    0 == fe(t.from, t.to) && 0 == fe(t.from, s.to) ? s.to = kr(t) : o.changes.push(Ti(e, t))
                } else {
                    var a = so(i.done);
                    for (a && a.ranges || Ni(e.sel, i.done),
                    o = {
                        changes: [Ti(e, t)],
                        generation: i.generation
                    },
                    i.done.push(o); i.done.length > i.undoDepth; )
                        i.done.shift(),
                        i.done[0].ranges || i.done.shift()
                }
                i.done.push(r),
                i.generation = ++i.maxGeneration,
                i.lastModTime = i.lastSelTime = l,
                i.lastOp = i.lastSelOp = n,
                i.lastOrigin = i.lastSelOrigin = t.origin,
                s || Vi(e, "historyAdded")
            }
            function Ni(e, t) {
                var r = so(t);
                r && r.ranges && r.equals(e) || t.push(e)
            }
            function Ai(e, t, r, n) {
                var i = t["spans_" + e.id]
                  , o = 0;
                e.iter(Math.max(e.first, r), Math.min(e.first + e.size, n), function(r) {
                    r.markedSpans && ((i || (i = t["spans_" + e.id] = {}))[o] = r.markedSpans),
                    ++o
                })
            }
            function Wi(e) {
                if (!e)
                    return null;
                for (var t, r = 0; r < e.length; ++r)
                    e[r].marker.explicitlyCleared ? t || (t = e.slice(0, r)) : t && t.push(e[r]);
                return t ? t.length ? t : null : e
            }
            function Oi(e, t, r) {
                for (var n = 0, i = []; n < e.length; ++n) {
                    var o = e[n];
                    if (o.ranges)
                        i.push(r ? We.prototype.deepCopy.call(o) : o);
                    else {
                        var l = o.changes
                          , s = [];
                        i.push({
                            changes: s
                        });
                        for (var a = 0; a < l.length; ++a) {
                            var u, c = l[a];
                            if (s.push({
                                from: c.from,
                                to: c.to,
                                text: c.text
                            }),
                            t)
                                for (var f in c)
                                    (u = f.match(/^spans_(\d+)$/)) && uo(t, Number(u[1])) > -1 && (so(s)[f] = c[f],
                                    delete c[f])
                        }
                    }
                }
                return i
            }
            function Di(e, t, r, n) {
                r < e.line ? e.line += n : t < e.line && (e.line = t,
                e.ch = 0)
            }
            function Hi(e, t, r, n) {
                for (var i = 0; i < e.length; ++i) {
                    var o = e[i]
                      , l = !0;
                    if (o.ranges) {
                        o.copied || ((o = e[i] = o.deepCopy()).copied = !0);
                        for (var s = 0; s < o.ranges.length; s++)
                            Di(o.ranges[s].anchor, t, r, n),
                            Di(o.ranges[s].head, t, r, n)
                    } else {
                        for (s = 0; s < o.changes.length; ++s) {
                            var a = o.changes[s];
                            if (r < a.from.line)
                                a.from = ce(a.from.line + n, a.from.ch),
                                a.to = ce(a.to.line + n, a.to.ch);
                            else if (t <= a.to.line) {
                                l = !1;
                                break
                            }
                        }
                        l || (e.splice(0, i + 1),
                        i = 0)
                    }
                }
            }
            function Pi(e, t) {
                var r = t.from.line
                  , n = t.to.line
                  , i = t.text.length - (n - r) - 1;
                Hi(e.done, r, n, i),
                Hi(e.undone, r, n, i)
            }
            qi(fi);
            var Ei = x.e_preventDefault = function(e) {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1
            }
              , Ii = x.e_stopPropagation = function(e) {
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
            }
            ;
            function zi(e) {
                return null != e.defaultPrevented ? e.defaultPrevented : 0 == e.returnValue
            }
            var Fi = x.e_stop = function(e) {
                Ei(e),
                Ii(e)
            }
            ;
            function Ri(e) {
                return e.target || e.srcElement
            }
            function Bi(e) {
                var t = e.which;
                return null == t && (1 & e.button ? t = 1 : 2 & e.button ? t = 3 : 4 & e.button && (t = 2)),
                p && e.ctrlKey && 1 == t && (t = 3),
                t
            }
            var Gi = x.on = function(e, t, r) {
                if (e.addEventListener)
                    e.addEventListener(t, r, !1);
                else if (e.attachEvent)
                    e.attachEvent("on" + t, r);
                else {
                    var n = e._handlers || (e._handlers = {});
                    (n[t] || (n[t] = [])).push(r)
                }
            }
              , Ui = x.off = function(e, t, r) {
                if (e.removeEventListener)
                    e.removeEventListener(t, r, !1);
                else if (e.detachEvent)
                    e.detachEvent("on" + t, r);
                else {
                    var n = e._handlers && e._handlers[t];
                    if (!n)
                        return;
                    for (var i = 0; i < n.length; ++i)
                        if (n[i] == r) {
                            n.splice(i, 1);
                            break
                        }
                }
            }
              , Vi = x.signal = function(e, t) {
                var r = e._handlers && e._handlers[t];
                if (r)
                    for (var n = Array.prototype.slice.call(arguments, 2), i = 0; i < r.length; ++i)
                        r[i].apply(null, n)
            }
              , Ki = null;
            function ji(e, t) {
                var r = e._handlers && e._handlers[t];
                if (r) {
                    var n, i = Array.prototype.slice.call(arguments, 2);
                    Pt ? n = Pt.delayedCallbacks : Ki ? n = Ki : (n = Ki = [],
                    setTimeout(Xi, 0));
                    for (var o = 0; o < r.length; ++o)
                        n.push(l(r[o]))
                }
                function l(e) {
                    return function() {
                        e.apply(null, i)
                    }
                }
            }
            function Xi() {
                var e = Ki;
                Ki = null;
                for (var t = 0; t < e.length; ++t)
                    e[t]()
            }
            function _i(e, t, r) {
                return "string" == typeof t && (t = {
                    type: t,
                    preventDefault: function() {
                        this.defaultPrevented = !0
                    }
                }),
                Vi(e, r || t.type, e, t),
                zi(t) || t.codemirrorIgnore
            }
            function Yi(e) {
                var t = e._handlers && e._handlers.cursorActivity;
                if (t)
                    for (var r = e.curOp.cursorActivityHandlers || (e.curOp.cursorActivityHandlers = []), n = 0; n < t.length; ++n)
                        -1 == uo(r, t[n]) && r.push(t[n])
            }
            function $i(e, t) {
                var r = e._handlers && e._handlers[t];
                return r && r.length > 0
            }
            function qi(e) {
                e.prototype.on = function(e, t) {
                    Gi(this, e, t)
                }
                ,
                e.prototype.off = function(e, t) {
                    Ui(this, e, t)
                }
            }
            var Zi = 30
              , Qi = x.Pass = {
                toString: function() {
                    return "CodeMirror.Pass"
                }
            }
              , Ji = {
                scroll: !1
            }
              , eo = {
                origin: "*mouse"
            }
              , to = {
                origin: "+move"
            };
            function ro() {
                this.id = null
            }
            ro.prototype.set = function(e, t) {
                clearTimeout(this.id),
                this.id = setTimeout(t, e)
            }
            ;
            var no = x.countColumn = function(e, t, r, n, i) {
                null == t && -1 == (t = e.search(/[^\s\u00a0]/)) && (t = e.length);
                for (var o = n || 0, l = i || 0; ; ) {
                    var s = e.indexOf("\t", o);
                    if (s < 0 || s >= t)
                        return l + (t - o);
                    l += s - o,
                    l += r - l % r,
                    o = s + 1
                }
            }
            ;
            function io(e, t, r) {
                for (var n = 0, i = 0; ; ) {
                    var o = e.indexOf("\t", n);
                    -1 == o && (o = e.length);
                    var l = o - n;
                    if (o == e.length || i + l >= t)
                        return n + Math.min(l, t - i);
                    if (i += o - n,
                    n = o + 1,
                    (i += r - i % r) >= t)
                        return n
                }
            }
            var oo = [""];
            function lo(e) {
                for (; oo.length <= e; )
                    oo.push(so(oo) + " ");
                return oo[e]
            }
            function so(e) {
                return e[e.length - 1]
            }
            var ao = function(e) {
                e.select()
            };
            function uo(e, t) {
                for (var r = 0; r < e.length; ++r)
                    if (e[r] == t)
                        return r;
                return -1
            }
            function co(e, t) {
                for (var r = [], n = 0; n < e.length; n++)
                    r[n] = t(e[n], n);
                return r
            }
            function fo() {}
            function ho(e, t) {
                var r;
                return Object.create ? r = Object.create(e) : (fo.prototype = e,
                r = new fo),
                t && po(t, r),
                r
            }
            function po(e, t, r) {
                for (var n in t || (t = {}),
                e)
                    !e.hasOwnProperty(n) || !1 === r && t.hasOwnProperty(n) || (t[n] = e[n]);
                return t
            }
            function go(e) {
                var t = Array.prototype.slice.call(arguments, 1);
                return function() {
                    return e.apply(null, t)
                }
            }
            h ? ao = function(e) {
                e.selectionStart = 0,
                e.selectionEnd = e.value.length
            }
            : n && (ao = function(e) {
                try {
                    e.select()
                } catch (e) {}
            }
            );
            var vo = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/
              , mo = x.isWordChar = function(e) {
                return /\w/.test(e) || e > "" && (e.toUpperCase() != e.toLowerCase() || vo.test(e))
            }
            ;
            function yo(e, t) {
                return t ? !!(t.source.indexOf("\\w") > -1 && mo(e)) || t.test(e) : mo(e)
            }
            function bo(e) {
                for (var t in e)
                    if (e.hasOwnProperty(t) && e[t])
                        return !1;
                return !0
            }
            var wo, xo = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
            function Co(e) {
                return e.charCodeAt(0) >= 768 && xo.test(e)
            }
            function So(e, t, r, n) {
                var i = document.createElement(e);
                if (r && (i.className = r),
                n && (i.style.cssText = n),
                "string" == typeof t)
                    i.appendChild(document.createTextNode(t));
                else if (t)
                    for (var o = 0; o < t.length; ++o)
                        i.appendChild(t[o]);
                return i
            }
            function Lo(e) {
                for (var t = e.childNodes.length; t > 0; --t)
                    e.removeChild(e.firstChild);
                return e
            }
            function To(e, t) {
                return Lo(e).appendChild(t)
            }
            wo = document.createRange ? function(e, t, r, n) {
                var i = document.createRange();
                return i.setEnd(n || e, r),
                i.setStart(e, t),
                i
            }
            : function(e, t, r) {
                var n = document.body.createTextRange();
                try {
                    n.moveToElementText(e.parentNode)
                } catch (e) {
                    return n
                }
                return n.collapse(!0),
                n.moveEnd("character", r),
                n.moveStart("character", t),
                n
            }
            ;
            var ko = x.contains = function(e, t) {
                if (3 == t.nodeType && (t = t.parentNode),
                e.contains)
                    return e.contains(t);
                do {
                    if (11 == t.nodeType && (t = t.host),
                    t == e)
                        return !0
                } while (t = t.parentNode)
            }
            ;
            function Mo() {
                for (var e = document.activeElement; e && e.root && e.root.activeElement; )
                    e = e.root.activeElement;
                return e
            }
            function No(e) {
                return new RegExp("(^|\\s)" + e + "(?:$|\\s)\\s*")
            }
            n && i < 11 && (Mo = function() {
                try {
                    return document.activeElement
                } catch (e) {
                    return document.body
                }
            }
            );
            var Ao = x.rmClass = function(e, t) {
                var r = e.className
                  , n = No(t).exec(r);
                if (n) {
                    var i = r.slice(n.index + n[0].length);
                    e.className = r.slice(0, n.index) + (i ? n[1] + i : "")
                }
            }
              , Wo = x.addClass = function(e, t) {
                var r = e.className;
                No(t).test(r) || (e.className += (r ? " " : "") + t)
            }
            ;
            function Oo(e, t) {
                for (var r = e.split(" "), n = 0; n < r.length; n++)
                    r[n] && !No(r[n]).test(t) && (t += " " + r[n]);
                return t
            }
            function Do(e) {
                if (document.body.getElementsByClassName)
                    for (var t = document.body.getElementsByClassName("CodeMirror"), r = 0; r < t.length; r++) {
                        var n = t[r].CodeMirror;
                        n && e(n)
                    }
            }
            var Ho = !1;
            var Po, Eo, Io = function() {
                if (n && i < 9)
                    return !1;
                var e = So("div");
                return "draggable"in e || "dragDrop"in e
            }();
            function zo(e) {
                if (null == Po) {
                    var t = So("span", "​");
                    To(e, So("span", [t, document.createTextNode("x")])),
                    0 != e.firstChild.offsetHeight && (Po = t.offsetWidth <= 1 && t.offsetHeight > 2 && !(n && i < 8))
                }
                var r = Po ? So("span", "​") : So("span", " ", null, "display: inline-block; width: 1px; margin-right: -1px");
                return r.setAttribute("cm-text", ""),
                r
            }
            function Fo(e) {
                if (null != Eo)
                    return Eo;
                var t = To(e, document.createTextNode("AخA"))
                  , r = wo(t, 0, 1).getBoundingClientRect();
                if (!r || r.left == r.right)
                    return !1;
                var n = wo(t, 1, 2).getBoundingClientRect();
                return Eo = n.right - r.right < 3
            }
            var Ro, Bo = x.splitLines = 3 != "\n\nb".split(/\n/).length ? function(e) {
                for (var t = 0, r = [], n = e.length; t <= n; ) {
                    var i = e.indexOf("\n", t);
                    -1 == i && (i = e.length);
                    var o = e.slice(t, "\r" == e.charAt(i - 1) ? i - 1 : i)
                      , l = o.indexOf("\r");
                    -1 != l ? (r.push(o.slice(0, l)),
                    t += l + 1) : (r.push(o),
                    t = i + 1)
                }
                return r
            }
            : function(e) {
                return e.split(/\r\n?|\n/)
            }
            , Go = window.getSelection ? function(e) {
                try {
                    return e.selectionStart != e.selectionEnd
                } catch (e) {
                    return !1
                }
            }
            : function(e) {
                try {
                    var t = e.ownerDocument.selection.createRange()
                } catch (e) {}
                return !(!t || t.parentElement() != e) && 0 != t.compareEndPoints("StartToEnd", t)
            }
            , Uo = "oncopy"in (Ro = So("div")) || (Ro.setAttribute("oncopy", "return;"),
            "function" == typeof Ro.oncopy), Vo = null;
            var Ko, jo = {
                3: "Enter",
                8: "Backspace",
                9: "Tab",
                13: "Enter",
                16: "Shift",
                17: "Ctrl",
                18: "Alt",
                19: "Pause",
                20: "CapsLock",
                27: "Esc",
                32: "Space",
                33: "PageUp",
                34: "PageDown",
                35: "End",
                36: "Home",
                37: "Left",
                38: "Up",
                39: "Right",
                40: "Down",
                44: "PrintScrn",
                45: "Insert",
                46: "Delete",
                59: ";",
                61: "=",
                91: "Mod",
                92: "Mod",
                93: "Mod",
                107: "=",
                109: "-",
                127: "Delete",
                173: "-",
                186: ";",
                187: "=",
                188: ",",
                189: "-",
                190: ".",
                191: "/",
                192: "`",
                219: "[",
                220: "\\",
                221: "]",
                222: "'",
                63232: "Up",
                63233: "Down",
                63234: "Left",
                63235: "Right",
                63272: "Delete",
                63273: "Home",
                63275: "End",
                63276: "PageUp",
                63277: "PageDown",
                63302: "Insert"
            };
            function Xo(e) {
                return e.level % 2 ? e.to : e.from
            }
            function _o(e) {
                return e.level % 2 ? e.from : e.to
            }
            function Yo(e) {
                var t = Si(e);
                return t ? Xo(t[0]) : 0
            }
            function $o(e) {
                var t = Si(e);
                return t ? _o(so(t)) : e.text.length
            }
            function qo(e, t) {
                var r = vi(e.doc, t)
                  , n = Hn(r);
                n != r && (t = wi(n));
                var i = Si(n)
                  , o = i ? i[0].level % 2 ? $o(n) : Yo(n) : 0;
                return ce(t, o)
            }
            function Zo(e, t) {
                var r = qo(e, t.line)
                  , n = vi(e.doc, r.line)
                  , i = Si(n);
                if (!i || 0 == i[0].level) {
                    var o = Math.max(0, n.text.search(/\S/))
                      , l = t.line == r.line && t.ch <= o && t.ch;
                    return ce(r.line, l ? 0 : o)
                }
                return r
            }
            function Qo(e, t, r) {
                var n = e[0].level;
                return t == n || r != n && t < r
            }
            function Jo(e, t) {
                Ko = null;
                for (var r, n = 0; n < e.length; ++n) {
                    var i = e[n];
                    if (i.from < t && i.to > t)
                        return n;
                    if (i.from == t || i.to == t) {
                        if (null != r)
                            return Qo(e, i.level, e[r].level) ? (i.from != i.to && (Ko = r),
                            n) : (i.from != i.to && (Ko = n),
                            r);
                        r = n
                    }
                }
                return r
            }
            function el(e, t, r, n) {
                if (!n)
                    return t + r;
                do {
                    t += r
                } while (t > 0 && Co(e.text.charAt(t)));
                return t
            }
            function tl(e, t, r, n) {
                var i = Si(e);
                if (!i)
                    return rl(e, t, r, n);
                for (var o = Jo(i, t), l = i[o], s = el(e, t, l.level % 2 ? -r : r, n); ; ) {
                    if (s > l.from && s < l.to)
                        return s;
                    if (s == l.from || s == l.to)
                        return Jo(i, s) == o ? s : r > 0 == (l = i[o += r]).level % 2 ? l.to : l.from;
                    if (!(l = i[o += r]))
                        return null;
                    s = r > 0 == l.level % 2 ? el(e, l.to, -1, n) : el(e, l.from, 1, n)
                }
            }
            function rl(e, t, r, n) {
                var i = t + r;
                if (n)
                    for (; i > 0 && Co(e.text.charAt(i)); )
                        i += r;
                return i < 0 || i > e.text.length ? null : i
            }
            x.keyNames = jo,
            function() {
                for (var e = 0; e < 10; e++)
                    jo[e + 48] = jo[e + 96] = String(e);
                for (e = 65; e <= 90; e++)
                    jo[e] = String.fromCharCode(e);
                for (e = 1; e <= 12; e++)
                    jo[e + 111] = jo[e + 63235] = "F" + e
            }();
            var nl = function() {
                var e = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN"
                  , t = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm";
                var r = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/
                  , n = /[stwN]/
                  , i = /[LRr]/
                  , o = /[Lb1n]/
                  , l = /[1n]/;
                function s(e, t, r) {
                    this.level = e,
                    this.from = t,
                    this.to = r
                }
                return function(a) {
                    if (!r.test(a))
                        return !1;
                    for (var u, c = a.length, f = [], h = 0; h < c; ++h)
                        f.push(y = (u = a.charCodeAt(h)) <= 247 ? e.charAt(u) : 1424 <= u && u <= 1524 ? "R" : 1536 <= u && u <= 1773 ? t.charAt(u - 1536) : 1774 <= u && u <= 2220 ? "r" : 8192 <= u && u <= 8203 ? "w" : 8204 == u ? "b" : "L");
                    h = 0;
                    for (var d = "L"; h < c; ++h) {
                        "m" == (y = f[h]) ? f[h] = d : d = y
                    }
                    h = 0;
                    for (var p = "L"; h < c; ++h) {
                        "1" == (y = f[h]) && "r" == p ? f[h] = "n" : i.test(y) && (p = y,
                        "r" == y && (f[h] = "R"))
                    }
                    for (h = 1,
                    d = f[0]; h < c - 1; ++h) {
                        "+" == (y = f[h]) && "1" == d && "1" == f[h + 1] ? f[h] = "1" : "," != y || d != f[h + 1] || "1" != d && "n" != d || (f[h] = d),
                        d = y
                    }
                    for (h = 0; h < c; ++h) {
                        if ("," == (y = f[h]))
                            f[h] = "N";
                        else if ("%" == y) {
                            for (var g = h + 1; g < c && "%" == f[g]; ++g)
                                ;
                            for (var v = h && "!" == f[h - 1] || g < c && "1" == f[g] ? "1" : "N", m = h; m < g; ++m)
                                f[m] = v;
                            h = g - 1
                        }
                    }
                    for (h = 0,
                    p = "L"; h < c; ++h) {
                        var y = f[h];
                        "L" == p && "1" == y ? f[h] = "L" : i.test(y) && (p = y)
                    }
                    for (h = 0; h < c; ++h)
                        if (n.test(f[h])) {
                            for (g = h + 1; g < c && n.test(f[g]); ++g)
                                ;
                            var b = "L" == (h ? f[h - 1] : "L")
                              , w = "L" == (g < c ? f[g] : "L");
                            for (v = b || w ? "L" : "R",
                            m = h; m < g; ++m)
                                f[m] = v;
                            h = g - 1
                        }
                    var x, C = [];
                    for (h = 0; h < c; )
                        if (o.test(f[h])) {
                            var S = h;
                            for (++h; h < c && o.test(f[h]); ++h)
                                ;
                            C.push(new s(0,S,h))
                        } else {
                            var L = h
                              , T = C.length;
                            for (++h; h < c && "L" != f[h]; ++h)
                                ;
                            for (m = L; m < h; )
                                if (l.test(f[m])) {
                                    L < m && C.splice(T, 0, new s(1,L,m));
                                    var k = m;
                                    for (++m; m < h && l.test(f[m]); ++m)
                                        ;
                                    C.splice(T, 0, new s(2,k,m)),
                                    L = m
                                } else
                                    ++m;
                            L < h && C.splice(T, 0, new s(1,L,h))
                        }
                    return 1 == C[0].level && (x = a.match(/^\s+/)) && (C[0].from = x[0].length,
                    C.unshift(new s(0,0,x[0].length))),
                    1 == so(C).level && (x = a.match(/\s+$/)) && (so(C).to -= x[0].length,
                    C.push(new s(0,c - x[0].length,c))),
                    2 == C[0].level && C.unshift(new s(1,C[0].to,C[0].to)),
                    C[0].level != so(C).level && C.push(new s(C[0].level,c,c)),
                    C
                }
            }();
            return x.version = "5.6.0",
            x
        });

    }
    , {}],
    24: [function(require, module, exports) {
        !function(e, t) {
            "undefined" != typeof module ? module.exports = t() : "function" == typeof define && "object" == typeof define.amd ? define(t) : this.domready = t()
        }(0, function() {
            var e, t = [], n = document, o = n.documentElement.doScroll, d = (o ? /^loaded|^c/ : /^loaded|^i|^c/).test(n.readyState);
            return d || n.addEventListener("DOMContentLoaded", e = function() {
                for (n.removeEventListener("DOMContentLoaded", e),
                d = 1; e = t.shift(); )
                    e()
            }
            ),
            function(e) {
                d ? setTimeout(e, 0) : t.push(e)
            }
        });

    }
    , {}],
    25: [function(require, module, exports) {
        (function() {
            "use strict";
            function e() {
                this.domain = null,
                this._events = this._events || {},
                this._maxListeners = this._maxListeners || void 0,
                this._listeners = function(e) {
                    return this._events[e] || (this._events[e] = [])
                }
            }
            if (e.EventEmitter = e,
            e.usingDomains = !1,
            e.defaultMaxListeners = 10,
            e.prototype.domain = void 0,
            e.prototype._events = void 0,
            e.prototype._maxListeners = void 0,
            e.prototype.addListener = e.prototype.on = function(t, r) {
                if ("function" != typeof r)
                    throw TypeError("listener must be a function");
                this.emit("newListener", t, "function" == typeof r.listener ? r.listener : r);
                var i = this._listeners(t)
                  , n = this._maxListeners || e.defaultMaxListeners
                  , s = i.push(r);
                return n > 0 && !i.warned && s > n && (i.warned = !0,
                console.error('warning: possible EventEmitter memory leak detected. %d "%s" listeners added.Use emitter.setMaxListeners() to increase limit.', s, t),
                console.trace()),
                this
            }
            ,
            e.prototype.once = function(e, t) {
                if ("function" != typeof t)
                    throw TypeError("listener must be a function");
                var r = !1
                  , i = function() {
                    this.removeListener(e, i),
                    r || (r = !0,
                    t.apply(this, arguments))
                };
                return i.listener = t,
                this.on(e, i),
                this
            }
            ,
            e.prototype.removeListener = function(e, t) {
                if ("function" != typeof t)
                    throw TypeError("listener must be a function");
                for (var r = this._listeners(e), i = r.length; ~--i && (!(i in r) || t !== (r[i].listener || r[i])); )
                    ;
                return ~i && (r.splice(i, 1),
                this.emit("removeListener", e, t)),
                this
            }
            ,
            e.prototype.removeAllListeners = function(e) {
                if (this._listeners("removeListener").length)
                    if (0 === arguments.length) {
                        for (var t in this._events)
                            "removeListener" !== t && this.removeAllListeners(t);
                        this.removeAllListeners("removeListener"),
                        this._events = {}
                    } else {
                        for (var r = this._listeners(e); r.length; )
                            this.removeListener(e, r[r.length - 1]);
                        delete this._events[e]
                    }
                return this
            }
            ,
            e.prototype.setMaxListeners = function(e) {
                if (e < 0 || isNaN(e))
                    throw TypeError("n must be a positive number");
                return this._maxListeners = e,
                this
            }
            ,
            e.prototype.listeners = function(e) {
                return this._listeners(e).slice()
            }
            ,
            e.prototype.emit = function(e) {
                var t = this._listeners(e)
                  , r = t.length
                  , i = 0;
                if (!r) {
                    if ("error" === e) {
                        var n = arguments[1];
                        throw n instanceof Error ? n : Error('Uncaught, unspecified "error" event.')
                    }
                    return !1
                }
                if (arguments.length > 1)
                    for (var s = Array.prototype.slice.call(arguments, 1); i < r; )
                        t[i++].apply(this, s);
                else
                    for (; i < r; )
                        t[i++].call(this);
                return !0
            }
            ,
            e.listenerCount = function(e, t) {
                return e.listeners(t).length
            }
            ,
            "function" == typeof define && define.amd)
                define(function() {
                    return e
                });
            else if ("object" == typeof module && module.exports)
                module.exports = e;
            else {
                var t = this
                  , r = t.EventEmitter;
                e.noConflict = function() {
                    return t.EventEmitter = r,
                    e
                }
                ,
                this.EventEmitter = e
            }
        }
        ).call(this);

    }
    , {}],
    26: [function(require, module, exports) {
        !function(A, e) {
            "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (A = A || self).html2canvas = e()
        }(this, function() {
            "use strict";
            var A = function(e, t) {
                return (A = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(A, e) {
                    A.__proto__ = e
                }
                || function(A, e) {
                    for (var t in e)
                        e.hasOwnProperty(t) && (A[t] = e[t])
                }
                )(e, t)
            };
            function e(e, t) {
                function r() {
                    this.constructor = e
                }
                A(e, t),
                e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
                new r)
            }
            var t = function() {
                return (t = Object.assign || function(A) {
                    for (var e, t = 1, r = arguments.length; t < r; t++)
                        for (var n in e = arguments[t])
                            Object.prototype.hasOwnProperty.call(e, n) && (A[n] = e[n]);
                    return A
                }
                ).apply(this, arguments)
            };
            function r(A, e, t, r) {
                return new (t || (t = Promise))(function(n, B) {
                    function s(A) {
                        try {
                            i(r.next(A))
                        } catch (A) {
                            B(A)
                        }
                    }
                    function o(A) {
                        try {
                            i(r.throw(A))
                        } catch (A) {
                            B(A)
                        }
                    }
                    function i(A) {
                        A.done ? n(A.value) : new t(function(e) {
                            e(A.value)
                        }
                        ).then(s, o)
                    }
                    i((r = r.apply(A, e || [])).next())
                }
                )
            }
            function n(A, e) {
                var t, r, n, B, s = {
                    label: 0,
                    sent: function() {
                        if (1 & n[0])
                            throw n[1];
                        return n[1]
                    },
                    trys: [],
                    ops: []
                };
                return B = {
                    next: o(0),
                    throw: o(1),
                    return: o(2)
                },
                "function" == typeof Symbol && (B[Symbol.iterator] = function() {
                    return this
                }
                ),
                B;
                function o(B) {
                    return function(o) {
                        return function(B) {
                            if (t)
                                throw new TypeError("Generator is already executing.");
                            for (; s; )
                                try {
                                    if (t = 1,
                                    r && (n = 2 & B[0] ? r.return : B[0] ? r.throw || ((n = r.return) && n.call(r),
                                    0) : r.next) && !(n = n.call(r, B[1])).done)
                                        return n;
                                    switch (r = 0,
                                    n && (B = [2 & B[0], n.value]),
                                    B[0]) {
                                    case 0:
                                    case 1:
                                        n = B;
                                        break;
                                    case 4:
                                        return s.label++,
                                        {
                                            value: B[1],
                                            done: !1
                                        };
                                    case 5:
                                        s.label++,
                                        r = B[1],
                                        B = [0];
                                        continue;
                                    case 7:
                                        B = s.ops.pop(),
                                        s.trys.pop();
                                        continue;
                                    default:
                                        if (!(n = (n = s.trys).length > 0 && n[n.length - 1]) && (6 === B[0] || 2 === B[0])) {
                                            s = 0;
                                            continue
                                        }
                                        if (3 === B[0] && (!n || B[1] > n[0] && B[1] < n[3])) {
                                            s.label = B[1];
                                            break
                                        }
                                        if (6 === B[0] && s.label < n[1]) {
                                            s.label = n[1],
                                            n = B;
                                            break
                                        }
                                        if (n && s.label < n[2]) {
                                            s.label = n[2],
                                            s.ops.push(B);
                                            break
                                        }
                                        n[2] && s.ops.pop(),
                                        s.trys.pop();
                                        continue
                                    }
                                    B = e.call(A, s)
                                } catch (A) {
                                    B = [6, A],
                                    r = 0
                                } finally {
                                    t = n = 0
                                }
                            if (5 & B[0])
                                throw B[1];
                            return {
                                value: B[0] ? B[1] : void 0,
                                done: !0
                            }
                        }([B, o])
                    }
                }
            }
            for (var B = function() {
                function A(A, e, t, r) {
                    this.left = A,
                    this.top = e,
                    this.width = t,
                    this.height = r
                }
                return A.prototype.add = function(e, t, r, n) {
                    return new A(this.left + e,this.top + t,this.width + r,this.height + n)
                }
                ,
                A.fromClientRect = function(e) {
                    return new A(e.left,e.top,e.width,e.height)
                }
                ,
                A
            }(), s = function(A) {
                return B.fromClientRect(A.getBoundingClientRect())
            }, o = function(A) {
                for (var e = [], t = 0, r = A.length; t < r; ) {
                    var n = A.charCodeAt(t++);
                    if (n >= 55296 && n <= 56319 && t < r) {
                        var B = A.charCodeAt(t++);
                        56320 == (64512 & B) ? e.push(((1023 & n) << 10) + (1023 & B) + 65536) : (e.push(n),
                        t--)
                    } else
                        e.push(n)
                }
                return e
            }, i = function() {
                for (var A = [], e = 0; e < arguments.length; e++)
                    A[e] = arguments[e];
                if (String.fromCodePoint)
                    return String.fromCodePoint.apply(String, A);
                var t = A.length;
                if (!t)
                    return "";
                for (var r = [], n = -1, B = ""; ++n < t; ) {
                    var s = A[n];
                    s <= 65535 ? r.push(s) : (s -= 65536,
                    r.push(55296 + (s >> 10), s % 1024 + 56320)),
                    (n + 1 === t || r.length > 16384) && (B += String.fromCharCode.apply(String, r),
                    r.length = 0)
                }
                return B
            }, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", c = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256), Q = 0; Q < a.length; Q++)
                c[a.charCodeAt(Q)] = Q;
            var u, w = function(A, e, t) {
                return A.slice ? A.slice(e, t) : new Uint16Array(Array.prototype.slice.call(A, e, t))
            }, U = function() {
                function A(A, e, t, r, n, B) {
                    this.initialValue = A,
                    this.errorValue = e,
                    this.highStart = t,
                    this.highValueIndex = r,
                    this.index = n,
                    this.data = B
                }
                return A.prototype.get = function(A) {
                    var e;
                    if (A >= 0) {
                        if (A < 55296 || A > 56319 && A <= 65535)
                            return e = ((e = this.index[A >> 5]) << 2) + (31 & A),
                            this.data[e];
                        if (A <= 65535)
                            return e = ((e = this.index[2048 + (A - 55296 >> 5)]) << 2) + (31 & A),
                            this.data[e];
                        if (A < this.highStart)
                            return e = 2080 + (A >> 11),
                            e = this.index[e],
                            e += A >> 5 & 63,
                            e = ((e = this.index[e]) << 2) + (31 & A),
                            this.data[e];
                        if (A <= 1114111)
                            return this.data[this.highValueIndex]
                    }
                    return this.errorValue
                }
                ,
                A
            }(), l = 10, C = 13, g = 15, E = 17, F = 18, h = 19, H = 20, d = 21, f = 22, p = 24, N = 25, K = 26, I = 27, T = 28, m = 30, R = 32, L = 33, O = 34, v = 35, D = 37, b = 38, S = 39, M = 40, y = 42, _ = "!", P = function(A) {
                var e, t, r, n = function(A) {
                    var e, t, r, n, B, s = .75 * A.length, o = A.length, i = 0;
                    "=" === A[A.length - 1] && (s--,
                    "=" === A[A.length - 2] && s--);
                    var a = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array && void 0 !== Uint8Array.prototype.slice ? new ArrayBuffer(s) : new Array(s)
                      , Q = Array.isArray(a) ? a : new Uint8Array(a);
                    for (e = 0; e < o; e += 4)
                        t = c[A.charCodeAt(e)],
                        r = c[A.charCodeAt(e + 1)],
                        n = c[A.charCodeAt(e + 2)],
                        B = c[A.charCodeAt(e + 3)],
                        Q[i++] = t << 2 | r >> 4,
                        Q[i++] = (15 & r) << 4 | n >> 2,
                        Q[i++] = (3 & n) << 6 | 63 & B;
                    return a
                }(A), B = Array.isArray(n) ? function(A) {
                    for (var e = A.length, t = [], r = 0; r < e; r += 4)
                        t.push(A[r + 3] << 24 | A[r + 2] << 16 | A[r + 1] << 8 | A[r]);
                    return t
                }(n) : new Uint32Array(n), s = Array.isArray(n) ? function(A) {
                    for (var e = A.length, t = [], r = 0; r < e; r += 2)
                        t.push(A[r + 1] << 8 | A[r]);
                    return t
                }(n) : new Uint16Array(n), o = w(s, 12, B[4] / 2), i = 2 === B[5] ? w(s, (24 + B[4]) / 2) : (e = B,
                t = Math.ceil((24 + B[4]) / 4),
                e.slice ? e.slice(t, r) : new Uint32Array(Array.prototype.slice.call(e, t, r)));
                return new U(B[0],B[1],B[2],B[3],o,i)
            }("KwAAAAAAAAAACA4AIDoAAPAfAAACAAAAAAAIABAAGABAAEgAUABYAF4AZgBeAGYAYABoAHAAeABeAGYAfACEAIAAiACQAJgAoACoAK0AtQC9AMUAXgBmAF4AZgBeAGYAzQDVAF4AZgDRANkA3gDmAOwA9AD8AAQBDAEUARoBIgGAAIgAJwEvATcBPwFFAU0BTAFUAVwBZAFsAXMBewGDATAAiwGTAZsBogGkAawBtAG8AcIBygHSAdoB4AHoAfAB+AH+AQYCDgIWAv4BHgImAi4CNgI+AkUCTQJTAlsCYwJrAnECeQKBAk0CiQKRApkCoQKoArACuALAAsQCzAIwANQC3ALkAjAA7AL0AvwCAQMJAxADGAMwACADJgMuAzYDPgOAAEYDSgNSA1IDUgNaA1oDYANiA2IDgACAAGoDgAByA3YDfgOAAIQDgACKA5IDmgOAAIAAogOqA4AAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAK8DtwOAAIAAvwPHA88D1wPfAyAD5wPsA/QD/AOAAIAABAQMBBIEgAAWBB4EJgQuBDMEIAM7BEEEXgBJBCADUQRZBGEEaQQwADAAcQQ+AXkEgQSJBJEEgACYBIAAoASoBK8EtwQwAL8ExQSAAIAAgACAAIAAgACgAM0EXgBeAF4AXgBeAF4AXgBeANUEXgDZBOEEXgDpBPEE+QQBBQkFEQUZBSEFKQUxBTUFPQVFBUwFVAVcBV4AYwVeAGsFcwV7BYMFiwWSBV4AmgWgBacFXgBeAF4AXgBeAKsFXgCyBbEFugW7BcIFwgXIBcIFwgXQBdQF3AXkBesF8wX7BQMGCwYTBhsGIwYrBjMGOwZeAD8GRwZNBl4AVAZbBl4AXgBeAF4AXgBeAF4AXgBeAF4AXgBeAGMGXgBqBnEGXgBeAF4AXgBeAF4AXgBeAF4AXgB5BoAG4wSGBo4GkwaAAIADHgR5AF4AXgBeAJsGgABGA4AAowarBrMGswagALsGwwbLBjAA0wbaBtoG3QbaBtoG2gbaBtoG2gblBusG8wb7BgMHCwcTBxsHCwcjBysHMAc1BzUHOgdCB9oGSgdSB1oHYAfaBloHaAfaBlIH2gbaBtoG2gbaBtoG2gbaBjUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHbQdeAF4ANQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQd1B30HNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B4MH2gaKB68EgACAAIAAgACAAIAAgACAAI8HlwdeAJ8HpweAAIAArwe3B14AXgC/B8UHygcwANAH2AfgB4AA6AfwBz4B+AcACFwBCAgPCBcIogEYAR8IJwiAAC8INwg/CCADRwhPCFcIXwhnCEoDGgSAAIAAgABvCHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIhAiLCI4IMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAANQc1BzUHNQc1BzUHNQc1BzUHNQc1B54INQc1B6II2gaqCLIIugiAAIAAvgjGCIAAgACAAIAAgACAAIAAgACAAIAAywiHAYAA0wiAANkI3QjlCO0I9Aj8CIAAgACAAAIJCgkSCRoJIgknCTYHLwk3CZYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiAAIAAAAFAAXgBeAGAAcABeAHwAQACQAKAArQC9AJ4AXgBeAE0A3gBRAN4A7AD8AMwBGgEAAKcBNwEFAUwBXAF4QkhCmEKnArcCgAHHAsABz4LAAcABwAHAAd+C6ABoAG+C/4LAAcABwAHAAc+DF4MAAcAB54M3gweDV4Nng3eDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEeDqABVg6WDqABoQ6gAaABoAHXDvcONw/3DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DncPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB7cPPwlGCU4JMACAAIAAgABWCV4JYQmAAGkJcAl4CXwJgAkwADAAMAAwAIgJgACLCZMJgACZCZ8JowmrCYAAswkwAF4AXgB8AIAAuwkABMMJyQmAAM4JgADVCTAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAqwYWBNkIMAAwADAAMADdCeAJ6AnuCR4E9gkwAP4JBQoNCjAAMACAABUK0wiAAB0KJAosCjQKgAAwADwKQwqAAEsKvQmdCVMKWwowADAAgACAALcEMACAAGMKgABrCjAAMAAwADAAMAAwADAAMAAwADAAMAAeBDAAMAAwADAAMAAwADAAMAAwADAAMAAwAIkEPQFzCnoKiQSCCooKkAqJBJgKoAqkCokEGAGsCrQKvArBCjAAMADJCtEKFQHZCuEK/gHpCvEKMAAwADAAMACAAIwE+QowAIAAPwEBCzAAMAAwADAAMACAAAkLEQswAIAAPwEZCyELgAAOCCkLMAAxCzkLMAAwADAAMAAwADAAXgBeAEELMAAwADAAMAAwADAAMAAwAEkLTQtVC4AAXAtkC4AAiQkwADAAMAAwADAAMAAwADAAbAtxC3kLgAuFC4sLMAAwAJMLlwufCzAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAApwswADAAMACAAIAAgACvC4AAgACAAIAAgACAALcLMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAvwuAAMcLgACAAIAAgACAAIAAyguAAIAAgACAAIAA0QswADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAANkLgACAAIAA4AswADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACJCR4E6AswADAAhwHwC4AA+AsADAgMEAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMACAAIAAGAwdDCUMMAAwAC0MNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQw1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHPQwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADUHNQc1BzUHNQc1BzUHNQc2BzAAMAA5DDUHNQc1BzUHNQc1BzUHNQc1BzUHNQdFDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAATQxSDFoMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAF4AXgBeAF4AXgBeAF4AYgxeAGoMXgBxDHkMfwxeAIUMXgBeAI0MMAAwADAAMAAwAF4AXgCVDJ0MMAAwADAAMABeAF4ApQxeAKsMswy7DF4Awgy9DMoMXgBeAF4AXgBeAF4AXgBeAF4AXgDRDNkMeQBqCeAM3Ax8AOYM7Az0DPgMXgBeAF4AXgBeAF4AXgBeAF4AXgBeAF4AXgBeAF4AXgCgAAANoAAHDQ4NFg0wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAeDSYNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAC4NMABeAF4ANg0wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAD4NRg1ODVYNXg1mDTAAbQ0wADAAMAAwADAAMAAwADAA2gbaBtoG2gbaBtoG2gbaBnUNeg3CBYANwgWFDdoGjA3aBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gaUDZwNpA2oDdoG2gawDbcNvw3HDdoG2gbPDdYN3A3fDeYN2gbsDfMN2gbaBvoN/g3aBgYODg7aBl4AXgBeABYOXgBeACUG2gYeDl4AJA5eACwO2w3aBtoGMQ45DtoG2gbaBtoGQQ7aBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gZJDjUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B1EO2gY1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQdZDjUHNQc1BzUHNQc1B2EONQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHaA41BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B3AO2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gY1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B2EO2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gZJDtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBkkOeA6gAKAAoAAwADAAMAAwAKAAoACgAKAAoACgAKAAgA4wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAD//wQABAAEAAQABAAEAAQABAAEAA0AAwABAAEAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAKABMAFwAeABsAGgAeABcAFgASAB4AGwAYAA8AGAAcAEsASwBLAEsASwBLAEsASwBLAEsAGAAYAB4AHgAeABMAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAFgAbABIAHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYADQARAB4ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkAFgAaABsAGwAbAB4AHQAdAB4ATwAXAB4ADQAeAB4AGgAbAE8ATwAOAFAAHQAdAB0ATwBPABcATwBPAE8AFgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwArAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAAQABAANAA0ASwBLAEsASwBLAEsASwBLAEsASwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUAArACsABABQAAQABAAEAAQABAAEAAQAKwArAAQABAArACsABAAEAAQAUAArACsAKwArACsAKwArACsABAArACsAKwArAFAAUAArAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAGgAaAFAAUABQAFAAUABMAB4AGwBQAB4AKwArACsABAAEAAQAKwBQAFAAUABQAFAAUAArACsAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUAArAFAAUAArACsABAArAAQABAAEAAQABAArACsAKwArAAQABAArACsABAAEAAQAKwArACsABAArACsAKwArACsAKwArAFAAUABQAFAAKwBQACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwAEAAQAUABQAFAABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUAArACsABABQAAQABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQAKwArAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwAeABsAKwArACsAKwArACsAKwBQAAQABAAEAAQABAAEACsABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwArAAQABAArACsABAAEAAQAKwArACsAKwArACsAKwArAAQABAArACsAKwArAFAAUAArAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwAeAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwAEAFAAKwBQAFAAUABQAFAAUAArACsAKwBQAFAAUAArAFAAUABQAFAAKwArACsAUABQACsAUAArAFAAUAArACsAKwBQAFAAKwArACsAUABQAFAAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQAKwArACsABAAEAAQAKwAEAAQABAAEACsAKwBQACsAKwArACsAKwArAAQAKwArACsAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAB4AHgAeAB4AHgAeABsAHgArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABAArACsAKwArACsAKwArAAQABAArAFAAUABQACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAB4AUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABAArACsAKwArACsAKwArAAQABAArACsAKwArACsAKwArAFAAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwArAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAKwBcAFwAKwBcACsAKwBcACsAKwArACsAKwArAFwAXABcAFwAKwBcAFwAXABcAFwAXABcACsAXABcAFwAKwBcACsAXAArACsAXABcACsAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgArACoAKgBcACsAKwBcAFwAXABcAFwAKwBcACsAKgAqACoAKgAqACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAFwAXABcAFwAUAAOAA4ADgAOAB4ADgAOAAkADgAOAA0ACQATABMAEwATABMACQAeABMAHgAeAB4ABAAEAB4AHgAeAB4AHgAeAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUAANAAQAHgAEAB4ABAAWABEAFgARAAQABABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAAQABAAEAAQABAANAAQABABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsADQANAB4AHgAeAB4AHgAeAAQAHgAeAB4AHgAeAB4AKwAeAB4ADgAOAA0ADgAeAB4AHgAeAB4ACQAJACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgAeAB4AHgBcAFwAXABcAFwAXAAqACoAKgAqAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAKgAqACoAKgAqACoAKgBcAFwAXAAqACoAKgAqAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAXAAqAEsASwBLAEsASwBLAEsASwBLAEsAKgAqACoAKgAqACoAUABQAFAAUABQAFAAKwBQACsAKwArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQACsAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwAEAAQABAAeAA0AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAEQArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAADQANAA0AUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAA0ADQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoADQANABUAXAANAB4ADQAbAFwAKgArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAB4AHgATABMADQANAA4AHgATABMAHgAEAAQABAAJACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAUABQAFAAUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwAeACsAKwArABMAEwBLAEsASwBLAEsASwBLAEsASwBLAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwBcAFwAXABcAFwAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcACsAKwArACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwAeAB4AXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgArACsABABLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKgAqACoAKgAqACoAKgBcACoAKgAqACoAKgAqACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAUABQAFAAUABQAFAAUAArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4ADQANAA0ADQAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAHgAeAB4AHgBQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwANAA0ADQANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwBQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsABAAEAAQAHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAABABQAFAAUABQAAQABAAEAFAAUAAEAAQABAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAKwBQACsAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAKwArAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAKwAeAB4AHgAeAB4AHgAeAA4AHgArAA0ADQANAA0ADQANAA0ACQANAA0ADQAIAAQACwAEAAQADQAJAA0ADQAMAB0AHQAeABcAFwAWABcAFwAXABYAFwAdAB0AHgAeABQAFAAUAA0AAQABAAQABAAEAAQABAAJABoAGgAaABoAGgAaABoAGgAeABcAFwAdABUAFQAeAB4AHgAeAB4AHgAYABYAEQAVABUAFQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgANAB4ADQANAA0ADQAeAA0ADQANAAcAHgAeAB4AHgArAAQABAAEAAQABAAEAAQABAAEAAQAUABQACsAKwBPAFAAUABQAFAAUAAeAB4AHgAWABEATwBQAE8ATwBPAE8AUABQAFAAUABQAB4AHgAeABYAEQArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAGwAbABsAGwAbABsAGwAaABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAaABsAGwAbABsAGgAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgBQABoAHgAdAB4AUAAeABoAHgAeAB4AHgAeAB4AHgAeAB4ATwAeAFAAGwAeAB4AUABQAFAAUABQAB4AHgAeAB0AHQAeAFAAHgBQAB4AUAAeAFAATwBQAFAAHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AUABQAFAAUABPAE8AUABQAFAAUABQAE8AUABQAE8AUABPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAE8ATwBPAE8ATwBPAE8ATwBPAE8AUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAATwAeAB4AKwArACsAKwAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB0AHQAeAB4AHgAdAB0AHgAeAB0AHgAeAB4AHQAeAB0AGwAbAB4AHQAeAB4AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB0AHgAdAB4AHQAdAB0AHQAdAB0AHgAdAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAdAB0AHQAdAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAlACUAHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBQAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB0AHQAeAB4AHgAeAB0AHQAdAB4AHgAdAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB0AHQAeAB4AHQAeAB4AHgAeAB0AHQAeAB4AHgAeACUAJQAdAB0AJQAeACUAJQAlACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAHgAeAB4AHgAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHQAdAB0AHgAdACUAHQAdAB4AHQAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHQAdAB0AHQAlAB4AJQAlACUAHQAlACUAHQAdAB0AJQAlAB0AHQAlAB0AHQAlACUAJQAeAB0AHgAeAB4AHgAdAB0AJQAdAB0AHQAdAB0AHQAlACUAJQAlACUAHQAlACUAIAAlAB0AHQAlACUAJQAlACUAJQAlACUAHgAeAB4AJQAlACAAIAAgACAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeABcAFwAXABcAFwAXAB4AEwATACUAHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwArACUAJQBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAKwArACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAE8ATwBPAE8ATwBPAE8ATwAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeACsAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUAArACsAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQBQAFAAUABQACsAKwArACsAUABQAFAAUABQAFAAUABQAA0AUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQACsAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgBQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAABAAEAAQAKwAEAAQAKwArACsAKwArAAQABAAEAAQAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsABAAEAAQAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsADQANAA0ADQANAA0ADQANAB4AKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AUABQAFAAUABQAFAAUABQAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAUABQAFAAUABQAA0ADQANAA0ADQANABQAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwANAA0ADQANAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAeAAQABAAEAB4AKwArAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLACsADQArAB4AKwArAAQABAAEAAQAUABQAB4AUAArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwAEAAQABAAEAAQABAAEAAQABAAOAA0ADQATABMAHgAeAB4ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0AUABQAFAAUAAEAAQAKwArAAQADQANAB4AUAArACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXABcAA0ADQANACoASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUAArACsAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANACsADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEcARwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQACsAKwAeAAQABAANAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAEAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUAArACsAUAArACsAUABQACsAKwBQAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AKwArAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAeAB4ADQANAA0ADQAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAArAAQABAArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAEAAQABAAEAAQABAAEACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAFgAWAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAKwBQACsAKwArACsAKwArAFAAKwArACsAKwBQACsAUAArAFAAKwBQAFAAUAArAFAAUAArAFAAKwArAFAAKwBQACsAUAArAFAAKwBQACsAUABQACsAUAArACsAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAUABQAFAAUAArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUAArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAlACUAJQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeACUAJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeACUAJQAlACUAJQAeACUAJQAlACUAJQAgACAAIAAlACUAIAAlACUAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIQAhACEAIQAhACUAJQAgACAAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACAAIAAlACUAJQAlACAAJQAgACAAIAAgACAAIAAgACAAIAAlACUAJQAgACUAJQAlACUAIAAgACAAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeACUAHgAlAB4AJQAlACUAJQAlACAAJQAlACUAJQAeACUAHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAIAAgACAAJQAlACUAIAAgACAAIAAgAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFwAXABcAFQAVABUAHgAeAB4AHgAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACAAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAlACAAIAAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsA"), x = [m, 36], V = [1, 2, 3, 5], z = [l, 8], X = [I, K], J = V.concat(z), G = [b, S, M, O, v], k = [g, C], W = function(A, e, t, r) {
                var n = r[t];
                if (Array.isArray(A) ? -1 !== A.indexOf(n) : A === n)
                    for (var B = t; B <= r.length; ) {
                        if ((i = r[++B]) === e)
                            return !0;
                        if (i !== l)
                            break
                    }
                if (n === l)
                    for (B = t; B > 0; ) {
                        var s = r[--B];
                        if (Array.isArray(A) ? -1 !== A.indexOf(s) : A === s)
                            for (var o = t; o <= r.length; ) {
                                var i;
                                if ((i = r[++o]) === e)
                                    return !0;
                                if (i !== l)
                                    break
                            }
                        if (s !== l)
                            break
                    }
                return !1
            }, Y = function(A, e) {
                for (var t = A; t >= 0; ) {
                    var r = e[t];
                    if (r !== l)
                        return r;
                    t--
                }
                return 0
            }, q = function(A, e, t, r, n) {
                if (0 === t[r])
                    return "×";
                var B = r - 1;
                if (Array.isArray(n) && !0 === n[B])
                    return "×";
                var s = B - 1
                  , o = B + 1
                  , i = e[B]
                  , a = s >= 0 ? e[s] : 0
                  , c = e[o];
                if (2 === i && 3 === c)
                    return "×";
                if (-1 !== V.indexOf(i))
                    return _;
                if (-1 !== V.indexOf(c))
                    return "×";
                if (-1 !== z.indexOf(c))
                    return "×";
                if (8 === Y(B, e))
                    return "÷";
                if (11 === P.get(A[B]) && (c === D || c === R || c === L))
                    return "×";
                if (7 === i || 7 === c)
                    return "×";
                if (9 === i)
                    return "×";
                if (-1 === [l, C, g].indexOf(i) && 9 === c)
                    return "×";
                if (-1 !== [E, F, h, p, T].indexOf(c))
                    return "×";
                if (Y(B, e) === f)
                    return "×";
                if (W(23, f, B, e))
                    return "×";
                if (W([E, F], d, B, e))
                    return "×";
                if (W(12, 12, B, e))
                    return "×";
                if (i === l)
                    return "÷";
                if (23 === i || 23 === c)
                    return "×";
                if (16 === c || 16 === i)
                    return "÷";
                if (-1 !== [C, g, d].indexOf(c) || 14 === i)
                    return "×";
                if (36 === a && -1 !== k.indexOf(i))
                    return "×";
                if (i === T && 36 === c)
                    return "×";
                if (c === H && -1 !== x.concat(H, h, N, D, R, L).indexOf(i))
                    return "×";
                if (-1 !== x.indexOf(c) && i === N || -1 !== x.indexOf(i) && c === N)
                    return "×";
                if (i === I && -1 !== [D, R, L].indexOf(c) || -1 !== [D, R, L].indexOf(i) && c === K)
                    return "×";
                if (-1 !== x.indexOf(i) && -1 !== X.indexOf(c) || -1 !== X.indexOf(i) && -1 !== x.indexOf(c))
                    return "×";
                if (-1 !== [I, K].indexOf(i) && (c === N || -1 !== [f, g].indexOf(c) && e[o + 1] === N) || -1 !== [f, g].indexOf(i) && c === N || i === N && -1 !== [N, T, p].indexOf(c))
                    return "×";
                if (-1 !== [N, T, p, E, F].indexOf(c))
                    for (var Q = B; Q >= 0; ) {
                        if ((u = e[Q]) === N)
                            return "×";
                        if (-1 === [T, p].indexOf(u))
                            break;
                        Q--
                    }
                if (-1 !== [I, K].indexOf(c))
                    for (Q = -1 !== [E, F].indexOf(i) ? s : B; Q >= 0; ) {
                        var u;
                        if ((u = e[Q]) === N)
                            return "×";
                        if (-1 === [T, p].indexOf(u))
                            break;
                        Q--
                    }
                if (b === i && -1 !== [b, S, O, v].indexOf(c) || -1 !== [S, O].indexOf(i) && -1 !== [S, M].indexOf(c) || -1 !== [M, v].indexOf(i) && c === M)
                    return "×";
                if (-1 !== G.indexOf(i) && -1 !== [H, K].indexOf(c) || -1 !== G.indexOf(c) && i === I)
                    return "×";
                if (-1 !== x.indexOf(i) && -1 !== x.indexOf(c))
                    return "×";
                if (i === p && -1 !== x.indexOf(c))
                    return "×";
                if (-1 !== x.concat(N).indexOf(i) && c === f || -1 !== x.concat(N).indexOf(c) && i === F)
                    return "×";
                if (41 === i && 41 === c) {
                    for (var w = t[B], U = 1; w > 0 && 41 === e[--w]; )
                        U++;
                    if (U % 2 != 0)
                        return "×"
                }
                return i === R && c === L ? "×" : "÷"
            }, Z = function(A, e) {
                e || (e = {
                    lineBreak: "normal",
                    wordBreak: "normal"
                });
                var t = function(A, e) {
                    void 0 === e && (e = "strict");
                    var t = []
                      , r = []
                      , n = [];
                    return A.forEach(function(A, B) {
                        var s = P.get(A);
                        if (s > 50 ? (n.push(!0),
                        s -= 50) : n.push(!1),
                        -1 !== ["normal", "auto", "loose"].indexOf(e) && -1 !== [8208, 8211, 12316, 12448].indexOf(A))
                            return r.push(B),
                            t.push(16);
                        if (4 === s || 11 === s) {
                            if (0 === B)
                                return r.push(B),
                                t.push(m);
                            var o = t[B - 1];
                            return -1 === J.indexOf(o) ? (r.push(r[B - 1]),
                            t.push(o)) : (r.push(B),
                            t.push(m))
                        }
                        return r.push(B),
                        31 === s ? t.push("strict" === e ? d : D) : s === y ? t.push(m) : 29 === s ? t.push(m) : 43 === s ? A >= 131072 && A <= 196605 || A >= 196608 && A <= 262141 ? t.push(D) : t.push(m) : void t.push(s)
                    }),
                    [r, t, n]
                }(A, e.lineBreak)
                  , r = t[0]
                  , n = t[1]
                  , B = t[2];
                return "break-all" !== e.wordBreak && "break-word" !== e.wordBreak || (n = n.map(function(A) {
                    return -1 !== [N, m, y].indexOf(A) ? D : A
                })),
                [r, n, "keep-all" === e.wordBreak ? B.map(function(e, t) {
                    return e && A[t] >= 19968 && A[t] <= 40959
                }) : void 0]
            }, j = function() {
                function A(A, e, t, r) {
                    this.codePoints = A,
                    this.required = e === _,
                    this.start = t,
                    this.end = r
                }
                return A.prototype.slice = function() {
                    return i.apply(void 0, this.codePoints.slice(this.start, this.end))
                }
                ,
                A
            }();
            !function(A) {
                A[A.STRING_TOKEN = 0] = "STRING_TOKEN",
                A[A.BAD_STRING_TOKEN = 1] = "BAD_STRING_TOKEN",
                A[A.LEFT_PARENTHESIS_TOKEN = 2] = "LEFT_PARENTHESIS_TOKEN",
                A[A.RIGHT_PARENTHESIS_TOKEN = 3] = "RIGHT_PARENTHESIS_TOKEN",
                A[A.COMMA_TOKEN = 4] = "COMMA_TOKEN",
                A[A.HASH_TOKEN = 5] = "HASH_TOKEN",
                A[A.DELIM_TOKEN = 6] = "DELIM_TOKEN",
                A[A.AT_KEYWORD_TOKEN = 7] = "AT_KEYWORD_TOKEN",
                A[A.PREFIX_MATCH_TOKEN = 8] = "PREFIX_MATCH_TOKEN",
                A[A.DASH_MATCH_TOKEN = 9] = "DASH_MATCH_TOKEN",
                A[A.INCLUDE_MATCH_TOKEN = 10] = "INCLUDE_MATCH_TOKEN",
                A[A.LEFT_CURLY_BRACKET_TOKEN = 11] = "LEFT_CURLY_BRACKET_TOKEN",
                A[A.RIGHT_CURLY_BRACKET_TOKEN = 12] = "RIGHT_CURLY_BRACKET_TOKEN",
                A[A.SUFFIX_MATCH_TOKEN = 13] = "SUFFIX_MATCH_TOKEN",
                A[A.SUBSTRING_MATCH_TOKEN = 14] = "SUBSTRING_MATCH_TOKEN",
                A[A.DIMENSION_TOKEN = 15] = "DIMENSION_TOKEN",
                A[A.PERCENTAGE_TOKEN = 16] = "PERCENTAGE_TOKEN",
                A[A.NUMBER_TOKEN = 17] = "NUMBER_TOKEN",
                A[A.FUNCTION = 18] = "FUNCTION",
                A[A.FUNCTION_TOKEN = 19] = "FUNCTION_TOKEN",
                A[A.IDENT_TOKEN = 20] = "IDENT_TOKEN",
                A[A.COLUMN_TOKEN = 21] = "COLUMN_TOKEN",
                A[A.URL_TOKEN = 22] = "URL_TOKEN",
                A[A.BAD_URL_TOKEN = 23] = "BAD_URL_TOKEN",
                A[A.CDC_TOKEN = 24] = "CDC_TOKEN",
                A[A.CDO_TOKEN = 25] = "CDO_TOKEN",
                A[A.COLON_TOKEN = 26] = "COLON_TOKEN",
                A[A.SEMICOLON_TOKEN = 27] = "SEMICOLON_TOKEN",
                A[A.LEFT_SQUARE_BRACKET_TOKEN = 28] = "LEFT_SQUARE_BRACKET_TOKEN",
                A[A.RIGHT_SQUARE_BRACKET_TOKEN = 29] = "RIGHT_SQUARE_BRACKET_TOKEN",
                A[A.UNICODE_RANGE_TOKEN = 30] = "UNICODE_RANGE_TOKEN",
                A[A.WHITESPACE_TOKEN = 31] = "WHITESPACE_TOKEN",
                A[A.EOF_TOKEN = 32] = "EOF_TOKEN"
            }(u || (u = {}));
            var $ = function(A) {
                return A >= 48 && A <= 57
            }
              , AA = function(A) {
                return $(A) || A >= 65 && A <= 70 || A >= 97 && A <= 102
            }
              , eA = function(A) {
                return 10 === A || 9 === A || 32 === A
            }
              , tA = function(A) {
                return function(A) {
                    return function(A) {
                        return A >= 97 && A <= 122
                    }(A) || function(A) {
                        return A >= 65 && A <= 90
                    }(A)
                }(A) || function(A) {
                    return A >= 128
                }(A) || 95 === A
            }
              , rA = function(A) {
                return tA(A) || $(A) || 45 === A
            }
              , nA = function(A) {
                return A >= 0 && A <= 8 || 11 === A || A >= 14 && A <= 31 || 127 === A
            }
              , BA = function(A, e) {
                return 92 === A && 10 !== e
            }
              , sA = function(A, e, t) {
                return 45 === A ? tA(e) || BA(e, t) : !!tA(A) || !(92 !== A || !BA(A, e))
            }
              , oA = function(A, e, t) {
                return 43 === A || 45 === A ? !!$(e) || 46 === e && $(t) : $(46 === A ? e : A)
            }
              , iA = function(A) {
                var e = 0
                  , t = 1;
                43 !== A[e] && 45 !== A[e] || (45 === A[e] && (t = -1),
                e++);
                for (var r = []; $(A[e]); )
                    r.push(A[e++]);
                var n = r.length ? parseInt(i.apply(void 0, r), 10) : 0;
                46 === A[e] && e++;
                for (var B = []; $(A[e]); )
                    B.push(A[e++]);
                var s = B.length
                  , o = s ? parseInt(i.apply(void 0, B), 10) : 0;
                69 !== A[e] && 101 !== A[e] || e++;
                var a = 1;
                43 !== A[e] && 45 !== A[e] || (45 === A[e] && (a = -1),
                e++);
                for (var c = []; $(A[e]); )
                    c.push(A[e++]);
                var Q = c.length ? parseInt(i.apply(void 0, c), 10) : 0;
                return t * (n + o * Math.pow(10, -s)) * Math.pow(10, a * Q)
            }
              , aA = {
                type: u.LEFT_PARENTHESIS_TOKEN
            }
              , cA = {
                type: u.RIGHT_PARENTHESIS_TOKEN
            }
              , QA = {
                type: u.COMMA_TOKEN
            }
              , uA = {
                type: u.SUFFIX_MATCH_TOKEN
            }
              , wA = {
                type: u.PREFIX_MATCH_TOKEN
            }
              , UA = {
                type: u.COLUMN_TOKEN
            }
              , lA = {
                type: u.DASH_MATCH_TOKEN
            }
              , CA = {
                type: u.INCLUDE_MATCH_TOKEN
            }
              , gA = {
                type: u.LEFT_CURLY_BRACKET_TOKEN
            }
              , EA = {
                type: u.RIGHT_CURLY_BRACKET_TOKEN
            }
              , FA = {
                type: u.SUBSTRING_MATCH_TOKEN
            }
              , hA = {
                type: u.BAD_URL_TOKEN
            }
              , HA = {
                type: u.BAD_STRING_TOKEN
            }
              , dA = {
                type: u.CDO_TOKEN
            }
              , fA = {
                type: u.CDC_TOKEN
            }
              , pA = {
                type: u.COLON_TOKEN
            }
              , NA = {
                type: u.SEMICOLON_TOKEN
            }
              , KA = {
                type: u.LEFT_SQUARE_BRACKET_TOKEN
            }
              , IA = {
                type: u.RIGHT_SQUARE_BRACKET_TOKEN
            }
              , TA = {
                type: u.WHITESPACE_TOKEN
            }
              , mA = {
                type: u.EOF_TOKEN
            }
              , RA = function() {
                function A() {
                    this._value = []
                }
                return A.prototype.write = function(A) {
                    this._value = this._value.concat(o(A))
                }
                ,
                A.prototype.read = function() {
                    for (var A = [], e = this.consumeToken(); e !== mA; )
                        A.push(e),
                        e = this.consumeToken();
                    return A
                }
                ,
                A.prototype.consumeToken = function() {
                    var A = this.consumeCodePoint();
                    switch (A) {
                    case 34:
                        return this.consumeStringToken(34);
                    case 35:
                        var e = this.peekCodePoint(0)
                          , t = this.peekCodePoint(1)
                          , r = this.peekCodePoint(2);
                        if (rA(e) || BA(t, r)) {
                            var n = sA(e, t, r) ? 2 : 1
                              , B = this.consumeName();
                            return {
                                type: u.HASH_TOKEN,
                                value: B,
                                flags: n
                            }
                        }
                        break;
                    case 36:
                        if (61 === this.peekCodePoint(0))
                            return this.consumeCodePoint(),
                            uA;
                        break;
                    case 39:
                        return this.consumeStringToken(39);
                    case 40:
                        return aA;
                    case 41:
                        return cA;
                    case 42:
                        if (61 === this.peekCodePoint(0))
                            return this.consumeCodePoint(),
                            FA;
                        break;
                    case 43:
                        if (oA(A, this.peekCodePoint(0), this.peekCodePoint(1)))
                            return this.reconsumeCodePoint(A),
                            this.consumeNumericToken();
                        break;
                    case 44:
                        return QA;
                    case 45:
                        var s = A
                          , o = this.peekCodePoint(0)
                          , a = this.peekCodePoint(1);
                        if (oA(s, o, a))
                            return this.reconsumeCodePoint(A),
                            this.consumeNumericToken();
                        if (sA(s, o, a))
                            return this.reconsumeCodePoint(A),
                            this.consumeIdentLikeToken();
                        if (45 === o && 62 === a)
                            return this.consumeCodePoint(),
                            this.consumeCodePoint(),
                            fA;
                        break;
                    case 46:
                        if (oA(A, this.peekCodePoint(0), this.peekCodePoint(1)))
                            return this.reconsumeCodePoint(A),
                            this.consumeNumericToken();
                        break;
                    case 47:
                        if (42 === this.peekCodePoint(0))
                            for (this.consumeCodePoint(); ; ) {
                                var c = this.consumeCodePoint();
                                if (42 === c && 47 === (c = this.consumeCodePoint()))
                                    return this.consumeToken();
                                if (-1 === c)
                                    return this.consumeToken()
                            }
                        break;
                    case 58:
                        return pA;
                    case 59:
                        return NA;
                    case 60:
                        if (33 === this.peekCodePoint(0) && 45 === this.peekCodePoint(1) && 45 === this.peekCodePoint(2))
                            return this.consumeCodePoint(),
                            this.consumeCodePoint(),
                            dA;
                        break;
                    case 64:
                        var Q = this.peekCodePoint(0)
                          , w = this.peekCodePoint(1)
                          , U = this.peekCodePoint(2);
                        if (sA(Q, w, U)) {
                            B = this.consumeName();
                            return {
                                type: u.AT_KEYWORD_TOKEN,
                                value: B
                            }
                        }
                        break;
                    case 91:
                        return KA;
                    case 92:
                        if (BA(A, this.peekCodePoint(0)))
                            return this.reconsumeCodePoint(A),
                            this.consumeIdentLikeToken();
                        break;
                    case 93:
                        return IA;
                    case 61:
                        if (61 === this.peekCodePoint(0))
                            return this.consumeCodePoint(),
                            wA;
                        break;
                    case 123:
                        return gA;
                    case 125:
                        return EA;
                    case 117:
                    case 85:
                        var l = this.peekCodePoint(0)
                          , C = this.peekCodePoint(1);
                        return 43 !== l || !AA(C) && 63 !== C || (this.consumeCodePoint(),
                        this.consumeUnicodeRangeToken()),
                        this.reconsumeCodePoint(A),
                        this.consumeIdentLikeToken();
                    case 124:
                        if (61 === this.peekCodePoint(0))
                            return this.consumeCodePoint(),
                            lA;
                        if (124 === this.peekCodePoint(0))
                            return this.consumeCodePoint(),
                            UA;
                        break;
                    case 126:
                        if (61 === this.peekCodePoint(0))
                            return this.consumeCodePoint(),
                            CA;
                        break;
                    case -1:
                        return mA
                    }
                    return eA(A) ? (this.consumeWhiteSpace(),
                    TA) : $(A) ? (this.reconsumeCodePoint(A),
                    this.consumeNumericToken()) : tA(A) ? (this.reconsumeCodePoint(A),
                    this.consumeIdentLikeToken()) : {
                        type: u.DELIM_TOKEN,
                        value: i(A)
                    }
                }
                ,
                A.prototype.consumeCodePoint = function() {
                    var A = this._value.shift();
                    return void 0 === A ? -1 : A
                }
                ,
                A.prototype.reconsumeCodePoint = function(A) {
                    this._value.unshift(A)
                }
                ,
                A.prototype.peekCodePoint = function(A) {
                    return A >= this._value.length ? -1 : this._value[A]
                }
                ,
                A.prototype.consumeUnicodeRangeToken = function() {
                    for (var A = [], e = this.consumeCodePoint(); AA(e) && A.length < 6; )
                        A.push(e),
                        e = this.consumeCodePoint();
                    for (var t = !1; 63 === e && A.length < 6; )
                        A.push(e),
                        e = this.consumeCodePoint(),
                        t = !0;
                    if (t) {
                        var r = parseInt(i.apply(void 0, A.map(function(A) {
                            return 63 === A ? 48 : A
                        })), 16)
                          , n = parseInt(i.apply(void 0, A.map(function(A) {
                            return 63 === A ? 70 : A
                        })), 16);
                        return {
                            type: u.UNICODE_RANGE_TOKEN,
                            start: r,
                            end: n
                        }
                    }
                    var B = parseInt(i.apply(void 0, A), 16);
                    if (45 === this.peekCodePoint(0) && AA(this.peekCodePoint(1))) {
                        this.consumeCodePoint(),
                        e = this.consumeCodePoint();
                        for (var s = []; AA(e) && s.length < 6; )
                            s.push(e),
                            e = this.consumeCodePoint();
                        n = parseInt(i.apply(void 0, s), 16);
                        return {
                            type: u.UNICODE_RANGE_TOKEN,
                            start: B,
                            end: n
                        }
                    }
                    return {
                        type: u.UNICODE_RANGE_TOKEN,
                        start: B,
                        end: B
                    }
                }
                ,
                A.prototype.consumeIdentLikeToken = function() {
                    var A = this.consumeName();
                    return "url" === A.toLowerCase() && 40 === this.peekCodePoint(0) ? (this.consumeCodePoint(),
                    this.consumeUrlToken()) : 40 === this.peekCodePoint(0) ? (this.consumeCodePoint(),
                    {
                        type: u.FUNCTION_TOKEN,
                        value: A
                    }) : {
                        type: u.IDENT_TOKEN,
                        value: A
                    }
                }
                ,
                A.prototype.consumeUrlToken = function() {
                    var A = [];
                    if (this.consumeWhiteSpace(),
                    -1 === this.peekCodePoint(0))
                        return {
                            type: u.URL_TOKEN,
                            value: ""
                        };
                    var e = this.peekCodePoint(0);
                    if (39 === e || 34 === e) {
                        var t = this.consumeStringToken(this.consumeCodePoint());
                        return t.type === u.STRING_TOKEN && (this.consumeWhiteSpace(),
                        -1 === this.peekCodePoint(0) || 41 === this.peekCodePoint(0)) ? (this.consumeCodePoint(),
                        {
                            type: u.URL_TOKEN,
                            value: t.value
                        }) : (this.consumeBadUrlRemnants(),
                        hA)
                    }
                    for (; ; ) {
                        var r = this.consumeCodePoint();
                        if (-1 === r || 41 === r)
                            return {
                                type: u.URL_TOKEN,
                                value: i.apply(void 0, A)
                            };
                        if (eA(r))
                            return this.consumeWhiteSpace(),
                            -1 === this.peekCodePoint(0) || 41 === this.peekCodePoint(0) ? (this.consumeCodePoint(),
                            {
                                type: u.URL_TOKEN,
                                value: i.apply(void 0, A)
                            }) : (this.consumeBadUrlRemnants(),
                            hA);
                        if (34 === r || 39 === r || 40 === r || nA(r))
                            return this.consumeBadUrlRemnants(),
                            hA;
                        if (92 === r) {
                            if (!BA(r, this.peekCodePoint(0)))
                                return this.consumeBadUrlRemnants(),
                                hA;
                            A.push(this.consumeEscapedCodePoint())
                        } else
                            A.push(r)
                    }
                }
                ,
                A.prototype.consumeWhiteSpace = function() {
                    for (; eA(this.peekCodePoint(0)); )
                        this.consumeCodePoint()
                }
                ,
                A.prototype.consumeBadUrlRemnants = function() {
                    for (; ; ) {
                        var A = this.consumeCodePoint();
                        if (41 === A || -1 === A)
                            return;
                        BA(A, this.peekCodePoint(0)) && this.consumeEscapedCodePoint()
                    }
                }
                ,
                A.prototype.consumeStringSlice = function(A) {
                    for (var e = ""; A > 0; ) {
                        var t = Math.min(6e4, A);
                        e += i.apply(void 0, this._value.splice(0, t)),
                        A -= t
                    }
                    return this._value.shift(),
                    e
                }
                ,
                A.prototype.consumeStringToken = function(A) {
                    for (var e = "", t = 0; ; ) {
                        var r = this._value[t];
                        if (-1 === r || void 0 === r || r === A)
                            return e += this.consumeStringSlice(t),
                            {
                                type: u.STRING_TOKEN,
                                value: e
                            };
                        if (10 === r)
                            return this._value.splice(0, t),
                            HA;
                        if (92 === r) {
                            var n = this._value[t + 1];
                            -1 !== n && void 0 !== n && (10 === n ? (e += this.consumeStringSlice(t),
                            t = -1,
                            this._value.shift()) : BA(r, n) && (e += this.consumeStringSlice(t),
                            e += i(this.consumeEscapedCodePoint()),
                            t = -1))
                        }
                        t++
                    }
                }
                ,
                A.prototype.consumeNumber = function() {
                    var A = []
                      , e = 4
                      , t = this.peekCodePoint(0);
                    for (43 !== t && 45 !== t || A.push(this.consumeCodePoint()); $(this.peekCodePoint(0)); )
                        A.push(this.consumeCodePoint());
                    t = this.peekCodePoint(0);
                    var r = this.peekCodePoint(1);
                    if (46 === t && $(r))
                        for (A.push(this.consumeCodePoint(), this.consumeCodePoint()),
                        e = 8; $(this.peekCodePoint(0)); )
                            A.push(this.consumeCodePoint());
                    t = this.peekCodePoint(0),
                    r = this.peekCodePoint(1);
                    var n = this.peekCodePoint(2);
                    if ((69 === t || 101 === t) && ((43 === r || 45 === r) && $(n) || $(r)))
                        for (A.push(this.consumeCodePoint(), this.consumeCodePoint()),
                        e = 8; $(this.peekCodePoint(0)); )
                            A.push(this.consumeCodePoint());
                    return [iA(A), e]
                }
                ,
                A.prototype.consumeNumericToken = function() {
                    var A = this.consumeNumber()
                      , e = A[0]
                      , t = A[1]
                      , r = this.peekCodePoint(0)
                      , n = this.peekCodePoint(1)
                      , B = this.peekCodePoint(2);
                    if (sA(r, n, B)) {
                        var s = this.consumeName();
                        return {
                            type: u.DIMENSION_TOKEN,
                            number: e,
                            flags: t,
                            unit: s
                        }
                    }
                    return 37 === r ? (this.consumeCodePoint(),
                    {
                        type: u.PERCENTAGE_TOKEN,
                        number: e,
                        flags: t
                    }) : {
                        type: u.NUMBER_TOKEN,
                        number: e,
                        flags: t
                    }
                }
                ,
                A.prototype.consumeEscapedCodePoint = function() {
                    var A = this.consumeCodePoint();
                    if (AA(A)) {
                        for (var e = i(A); AA(this.peekCodePoint(0)) && e.length < 6; )
                            e += i(this.consumeCodePoint());
                        eA(this.peekCodePoint(0)) && this.consumeCodePoint();
                        var t = parseInt(e, 16);
                        return 0 === t || function(A) {
                            return A >= 55296 && A <= 57343
                        }(t) || t > 1114111 ? 65533 : t
                    }
                    return -1 === A ? 65533 : A
                }
                ,
                A.prototype.consumeName = function() {
                    for (var A = ""; ; ) {
                        var e = this.consumeCodePoint();
                        if (rA(e))
                            A += i(e);
                        else {
                            if (!BA(e, this.peekCodePoint(0)))
                                return this.reconsumeCodePoint(e),
                                A;
                            A += i(this.consumeEscapedCodePoint())
                        }
                    }
                }
                ,
                A
            }()
              , LA = function() {
                function A(A) {
                    this._tokens = A
                }
                return A.create = function(e) {
                    var t = new RA;
                    return t.write(e),
                    new A(t.read())
                }
                ,
                A.parseValue = function(e) {
                    return A.create(e).parseComponentValue()
                }
                ,
                A.parseValues = function(e) {
                    return A.create(e).parseComponentValues()
                }
                ,
                A.prototype.parseComponentValue = function() {
                    for (var A = this.consumeToken(); A.type === u.WHITESPACE_TOKEN; )
                        A = this.consumeToken();
                    if (A.type === u.EOF_TOKEN)
                        throw new SyntaxError("Error parsing CSS component value, unexpected EOF");
                    this.reconsumeToken(A);
                    var e = this.consumeComponentValue();
                    do {
                        A = this.consumeToken()
                    } while (A.type === u.WHITESPACE_TOKEN);
                    if (A.type === u.EOF_TOKEN)
                        return e;
                    throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one")
                }
                ,
                A.prototype.parseComponentValues = function() {
                    for (var A = []; ; ) {
                        var e = this.consumeComponentValue();
                        if (e.type === u.EOF_TOKEN)
                            return A;
                        A.push(e),
                        A.push()
                    }
                }
                ,
                A.prototype.consumeComponentValue = function() {
                    var A = this.consumeToken();
                    switch (A.type) {
                    case u.LEFT_CURLY_BRACKET_TOKEN:
                    case u.LEFT_SQUARE_BRACKET_TOKEN:
                    case u.LEFT_PARENTHESIS_TOKEN:
                        return this.consumeSimpleBlock(A.type);
                    case u.FUNCTION_TOKEN:
                        return this.consumeFunction(A)
                    }
                    return A
                }
                ,
                A.prototype.consumeSimpleBlock = function(A) {
                    for (var e = {
                        type: A,
                        values: []
                    }, t = this.consumeToken(); ; ) {
                        if (t.type === u.EOF_TOKEN || PA(t, A))
                            return e;
                        this.reconsumeToken(t),
                        e.values.push(this.consumeComponentValue()),
                        t = this.consumeToken()
                    }
                }
                ,
                A.prototype.consumeFunction = function(A) {
                    for (var e = {
                        name: A.value,
                        values: [],
                        type: u.FUNCTION
                    }; ; ) {
                        var t = this.consumeToken();
                        if (t.type === u.EOF_TOKEN || t.type === u.RIGHT_PARENTHESIS_TOKEN)
                            return e;
                        this.reconsumeToken(t),
                        e.values.push(this.consumeComponentValue())
                    }
                }
                ,
                A.prototype.consumeToken = function() {
                    var A = this._tokens.shift();
                    return void 0 === A ? mA : A
                }
                ,
                A.prototype.reconsumeToken = function(A) {
                    this._tokens.unshift(A)
                }
                ,
                A
            }()
              , OA = function(A) {
                return A.type === u.DIMENSION_TOKEN
            }
              , vA = function(A) {
                return A.type === u.NUMBER_TOKEN
            }
              , DA = function(A) {
                return A.type === u.IDENT_TOKEN
            }
              , bA = function(A) {
                return A.type === u.STRING_TOKEN
            }
              , SA = function(A, e) {
                return DA(A) && A.value === e
            }
              , MA = function(A) {
                return A.type !== u.WHITESPACE_TOKEN
            }
              , yA = function(A) {
                return A.type !== u.WHITESPACE_TOKEN && A.type !== u.COMMA_TOKEN
            }
              , _A = function(A) {
                var e = []
                  , t = [];
                return A.forEach(function(A) {
                    if (A.type === u.COMMA_TOKEN) {
                        if (0 === t.length)
                            throw new Error("Error parsing function args, zero tokens for arg");
                        return e.push(t),
                        void (t = [])
                    }
                    A.type !== u.WHITESPACE_TOKEN && t.push(A)
                }),
                t.length && e.push(t),
                e
            }
              , PA = function(A, e) {
                return e === u.LEFT_CURLY_BRACKET_TOKEN && A.type === u.RIGHT_CURLY_BRACKET_TOKEN || (e === u.LEFT_SQUARE_BRACKET_TOKEN && A.type === u.RIGHT_SQUARE_BRACKET_TOKEN || e === u.LEFT_PARENTHESIS_TOKEN && A.type === u.RIGHT_PARENTHESIS_TOKEN)
            }
              , xA = function(A) {
                return A.type === u.NUMBER_TOKEN || A.type === u.DIMENSION_TOKEN
            }
              , VA = function(A) {
                return A.type === u.PERCENTAGE_TOKEN || xA(A)
            }
              , zA = function(A) {
                return A.length > 1 ? [A[0], A[1]] : [A[0]]
            }
              , XA = {
                type: u.NUMBER_TOKEN,
                number: 0,
                flags: 4
            }
              , JA = {
                type: u.PERCENTAGE_TOKEN,
                number: 50,
                flags: 4
            }
              , GA = {
                type: u.PERCENTAGE_TOKEN,
                number: 100,
                flags: 4
            }
              , kA = function(A, e, t) {
                var r = A[0]
                  , n = A[1];
                return [WA(r, e), WA(void 0 !== n ? n : r, t)]
            }
              , WA = function(A, e) {
                if (A.type === u.PERCENTAGE_TOKEN)
                    return A.number / 100 * e;
                if (OA(A))
                    switch (A.unit) {
                    case "rem":
                    case "em":
                        return 16 * A.number;
                    case "px":
                    default:
                        return A.number
                    }
                return A.number
            }
              , YA = function(A) {
                if (A.type === u.DIMENSION_TOKEN)
                    switch (A.unit) {
                    case "deg":
                        return Math.PI * A.number / 180;
                    case "grad":
                        return Math.PI / 200 * A.number;
                    case "rad":
                        return A.number;
                    case "turn":
                        return 2 * Math.PI * A.number
                    }
                throw new Error("Unsupported angle type")
            }
              , qA = function(A) {
                return A.type === u.DIMENSION_TOKEN && ("deg" === A.unit || "grad" === A.unit || "rad" === A.unit || "turn" === A.unit)
            }
              , ZA = function(A) {
                switch (A.filter(DA).map(function(A) {
                    return A.value
                }).join(" ")) {
                case "to bottom right":
                case "to right bottom":
                case "left top":
                case "top left":
                    return [XA, XA];
                case "to top":
                case "bottom":
                    return jA(0);
                case "to bottom left":
                case "to left bottom":
                case "right top":
                case "top right":
                    return [XA, GA];
                case "to right":
                case "left":
                    return jA(90);
                case "to top left":
                case "to left top":
                case "right bottom":
                case "bottom right":
                    return [GA, GA];
                case "to bottom":
                case "top":
                    return jA(180);
                case "to top right":
                case "to right top":
                case "left bottom":
                case "bottom left":
                    return [GA, XA];
                case "to left":
                case "right":
                    return jA(270)
                }
                return 0
            }
              , jA = function(A) {
                return Math.PI * A / 180
            }
              , $A = function(A) {
                if (A.type === u.FUNCTION) {
                    var e = ae[A.name];
                    if (void 0 === e)
                        throw new Error('Attempting to parse an unsupported color function "' + A.name + '"');
                    return e(A.values)
                }
                if (A.type === u.HASH_TOKEN) {
                    if (3 === A.value.length) {
                        var t = A.value.substring(0, 1)
                          , r = A.value.substring(1, 2)
                          , n = A.value.substring(2, 3);
                        return te(parseInt(t + t, 16), parseInt(r + r, 16), parseInt(n + n, 16), 1)
                    }
                    if (4 === A.value.length) {
                        t = A.value.substring(0, 1),
                        r = A.value.substring(1, 2),
                        n = A.value.substring(2, 3);
                        var B = A.value.substring(3, 4);
                        return te(parseInt(t + t, 16), parseInt(r + r, 16), parseInt(n + n, 16), parseInt(B + B, 16) / 255)
                    }
                    if (6 === A.value.length) {
                        t = A.value.substring(0, 2),
                        r = A.value.substring(2, 4),
                        n = A.value.substring(4, 6);
                        return te(parseInt(t, 16), parseInt(r, 16), parseInt(n, 16), 1)
                    }
                    if (8 === A.value.length) {
                        t = A.value.substring(0, 2),
                        r = A.value.substring(2, 4),
                        n = A.value.substring(4, 6),
                        B = A.value.substring(6, 8);
                        return te(parseInt(t, 16), parseInt(r, 16), parseInt(n, 16), parseInt(B, 16) / 255)
                    }
                }
                if (A.type === u.IDENT_TOKEN) {
                    var s = ce[A.value.toUpperCase()];
                    if (void 0 !== s)
                        return s
                }
                return ce.TRANSPARENT
            }
              , Ae = function(A) {
                return 0 == (255 & A)
            }
              , ee = function(A) {
                var e = 255 & A
                  , t = 255 & A >> 8
                  , r = 255 & A >> 16
                  , n = 255 & A >> 24;
                return e < 255 ? "rgba(" + n + "," + r + "," + t + "," + e / 255 + ")" : "rgb(" + n + "," + r + "," + t + ")"
            }
              , te = function(A, e, t, r) {
                return (A << 24 | e << 16 | t << 8 | Math.round(255 * r) << 0) >>> 0
            }
              , re = function(A, e) {
                if (A.type === u.NUMBER_TOKEN)
                    return A.number;
                if (A.type === u.PERCENTAGE_TOKEN) {
                    var t = 3 === e ? 1 : 255;
                    return 3 === e ? A.number / 100 * t : Math.round(A.number / 100 * t)
                }
                return 0
            }
              , ne = function(A) {
                var e = A.filter(yA);
                if (3 === e.length) {
                    var t = e.map(re)
                      , r = t[0]
                      , n = t[1]
                      , B = t[2];
                    return te(r, n, B, 1)
                }
                if (4 === e.length) {
                    var s = e.map(re)
                      , o = (r = s[0],
                    n = s[1],
                    B = s[2],
                    s[3]);
                    return te(r, n, B, o)
                }
                return 0
            };
            function Be(A, e, t) {
                return t < 0 && (t += 1),
                t >= 1 && (t -= 1),
                t < 1 / 6 ? (e - A) * t * 6 + A : t < .5 ? e : t < 2 / 3 ? 6 * (e - A) * (2 / 3 - t) + A : A
            }
            var se, oe, ie = function(A) {
                var e = A.filter(yA)
                  , t = e[0]
                  , r = e[1]
                  , n = e[2]
                  , B = e[3]
                  , s = (t.type === u.NUMBER_TOKEN ? jA(t.number) : YA(t)) / (2 * Math.PI)
                  , o = VA(r) ? r.number / 100 : 0
                  , i = VA(n) ? n.number / 100 : 0
                  , a = void 0 !== B && VA(B) ? WA(B, 1) : 1;
                if (0 === o)
                    return te(255 * i, 255 * i, 255 * i, 1);
                var c = i <= .5 ? i * (o + 1) : i + o - i * o
                  , Q = 2 * i - c
                  , w = Be(Q, c, s + 1 / 3)
                  , U = Be(Q, c, s)
                  , l = Be(Q, c, s - 1 / 3);
                return te(255 * w, 255 * U, 255 * l, a)
            }, ae = {
                hsl: ie,
                hsla: ie,
                rgb: ne,
                rgba: ne
            }, ce = {
                ALICEBLUE: 4042850303,
                ANTIQUEWHITE: 4209760255,
                AQUA: 16777215,
                AQUAMARINE: 2147472639,
                AZURE: 4043309055,
                BEIGE: 4126530815,
                BISQUE: 4293182719,
                BLACK: 255,
                BLANCHEDALMOND: 4293643775,
                BLUE: 65535,
                BLUEVIOLET: 2318131967,
                BROWN: 2771004159,
                BURLYWOOD: 3736635391,
                CADETBLUE: 1604231423,
                CHARTREUSE: 2147418367,
                CHOCOLATE: 3530104575,
                CORAL: 4286533887,
                CORNFLOWERBLUE: 1687547391,
                CORNSILK: 4294499583,
                CRIMSON: 3692313855,
                CYAN: 16777215,
                DARKBLUE: 35839,
                DARKCYAN: 9145343,
                DARKGOLDENROD: 3095837695,
                DARKGRAY: 2846468607,
                DARKGREEN: 6553855,
                DARKGREY: 2846468607,
                DARKKHAKI: 3182914559,
                DARKMAGENTA: 2332068863,
                DARKOLIVEGREEN: 1433087999,
                DARKORANGE: 4287365375,
                DARKORCHID: 2570243327,
                DARKRED: 2332033279,
                DARKSALMON: 3918953215,
                DARKSEAGREEN: 2411499519,
                DARKSLATEBLUE: 1211993087,
                DARKSLATEGRAY: 793726975,
                DARKSLATEGREY: 793726975,
                DARKTURQUOISE: 13554175,
                DARKVIOLET: 2483082239,
                DEEPPINK: 4279538687,
                DEEPSKYBLUE: 12582911,
                DIMGRAY: 1768516095,
                DIMGREY: 1768516095,
                DODGERBLUE: 512819199,
                FIREBRICK: 2988581631,
                FLORALWHITE: 4294635775,
                FORESTGREEN: 579543807,
                FUCHSIA: 4278255615,
                GAINSBORO: 3705462015,
                GHOSTWHITE: 4177068031,
                GOLD: 4292280575,
                GOLDENROD: 3668254975,
                GRAY: 2155905279,
                GREEN: 8388863,
                GREENYELLOW: 2919182335,
                GREY: 2155905279,
                HONEYDEW: 4043305215,
                HOTPINK: 4285117695,
                INDIANRED: 3445382399,
                INDIGO: 1258324735,
                IVORY: 4294963455,
                KHAKI: 4041641215,
                LAVENDER: 3873897215,
                LAVENDERBLUSH: 4293981695,
                LAWNGREEN: 2096890111,
                LEMONCHIFFON: 4294626815,
                LIGHTBLUE: 2916673279,
                LIGHTCORAL: 4034953471,
                LIGHTCYAN: 3774873599,
                LIGHTGOLDENRODYELLOW: 4210742015,
                LIGHTGRAY: 3553874943,
                LIGHTGREEN: 2431553791,
                LIGHTGREY: 3553874943,
                LIGHTPINK: 4290167295,
                LIGHTSALMON: 4288707327,
                LIGHTSEAGREEN: 548580095,
                LIGHTSKYBLUE: 2278488831,
                LIGHTSLATEGRAY: 2005441023,
                LIGHTSLATEGREY: 2005441023,
                LIGHTSTEELBLUE: 2965692159,
                LIGHTYELLOW: 4294959359,
                LIME: 16711935,
                LIMEGREEN: 852308735,
                LINEN: 4210091775,
                MAGENTA: 4278255615,
                MAROON: 2147483903,
                MEDIUMAQUAMARINE: 1724754687,
                MEDIUMBLUE: 52735,
                MEDIUMORCHID: 3126187007,
                MEDIUMPURPLE: 2473647103,
                MEDIUMSEAGREEN: 1018393087,
                MEDIUMSLATEBLUE: 2070474495,
                MEDIUMSPRINGGREEN: 16423679,
                MEDIUMTURQUOISE: 1221709055,
                MEDIUMVIOLETRED: 3340076543,
                MIDNIGHTBLUE: 421097727,
                MINTCREAM: 4127193855,
                MISTYROSE: 4293190143,
                MOCCASIN: 4293178879,
                NAVAJOWHITE: 4292783615,
                NAVY: 33023,
                OLDLACE: 4260751103,
                OLIVE: 2155872511,
                OLIVEDRAB: 1804477439,
                ORANGE: 4289003775,
                ORANGERED: 4282712319,
                ORCHID: 3664828159,
                PALEGOLDENROD: 4008225535,
                PALEGREEN: 2566625535,
                PALETURQUOISE: 2951671551,
                PALEVIOLETRED: 3681588223,
                PAPAYAWHIP: 4293907967,
                PEACHPUFF: 4292524543,
                PERU: 3448061951,
                PINK: 4290825215,
                PLUM: 3718307327,
                POWDERBLUE: 2967529215,
                PURPLE: 2147516671,
                REBECCAPURPLE: 1714657791,
                RED: 4278190335,
                ROSYBROWN: 3163525119,
                ROYALBLUE: 1097458175,
                SADDLEBROWN: 2336560127,
                SALMON: 4202722047,
                SANDYBROWN: 4104413439,
                SEAGREEN: 780883967,
                SEASHELL: 4294307583,
                SIENNA: 2689740287,
                SILVER: 3233857791,
                SKYBLUE: 2278484991,
                SLATEBLUE: 1784335871,
                SLATEGRAY: 1887473919,
                SLATEGREY: 1887473919,
                SNOW: 4294638335,
                SPRINGGREEN: 16744447,
                STEELBLUE: 1182971135,
                TAN: 3535047935,
                TEAL: 8421631,
                THISTLE: 3636451583,
                TOMATO: 4284696575,
                TRANSPARENT: 0,
                TURQUOISE: 1088475391,
                VIOLET: 4001558271,
                WHEAT: 4125012991,
                WHITE: 4294967295,
                WHITESMOKE: 4126537215,
                YELLOW: 4294902015,
                YELLOWGREEN: 2597139199
            };
            !function(A) {
                A[A.VALUE = 0] = "VALUE",
                A[A.LIST = 1] = "LIST",
                A[A.IDENT_VALUE = 2] = "IDENT_VALUE",
                A[A.TYPE_VALUE = 3] = "TYPE_VALUE",
                A[A.TOKEN_VALUE = 4] = "TOKEN_VALUE"
            }(se || (se = {})),
            function(A) {
                A[A.BORDER_BOX = 0] = "BORDER_BOX",
                A[A.PADDING_BOX = 1] = "PADDING_BOX",
                A[A.CONTENT_BOX = 2] = "CONTENT_BOX"
            }(oe || (oe = {}));
            var Qe, ue = {
                name: "background-clip",
                initialValue: "border-box",
                prefix: !1,
                type: se.LIST,
                parse: function(A) {
                    return A.map(function(A) {
                        if (DA(A))
                            switch (A.value) {
                            case "padding-box":
                                return oe.PADDING_BOX;
                            case "content-box":
                                return oe.CONTENT_BOX
                            }
                        return oe.BORDER_BOX
                    })
                }
            }, we = {
                name: "background-color",
                initialValue: "transparent",
                prefix: !1,
                type: se.TYPE_VALUE,
                format: "color"
            }, Ue = function(A) {
                var e = $A(A[0])
                  , t = A[1];
                return t && VA(t) ? {
                    color: e,
                    stop: t
                } : {
                    color: e,
                    stop: null
                }
            }, le = function(A, e) {
                var t = A[0]
                  , r = A[A.length - 1];
                null === t.stop && (t.stop = XA),
                null === r.stop && (r.stop = GA);
                for (var n = [], B = 0, s = 0; s < A.length; s++) {
                    var o = A[s].stop;
                    if (null !== o) {
                        var i = WA(o, e);
                        i > B ? n.push(i) : n.push(B),
                        B = i
                    } else
                        n.push(null)
                }
                var a = null;
                for (s = 0; s < n.length; s++) {
                    var c = n[s];
                    if (null === c)
                        null === a && (a = s);
                    else if (null !== a) {
                        for (var Q = s - a, u = (c - n[a - 1]) / (Q + 1), w = 1; w <= Q; w++)
                            n[a + w - 1] = u * w;
                        a = null
                    }
                }
                return A.map(function(A, t) {
                    return {
                        color: A.color,
                        stop: Math.max(Math.min(1, n[t] / e), 0)
                    }
                })
            }, Ce = function(A, e, t) {
                var r = "number" == typeof A ? A : function(A, e, t) {
                    var r = e / 2
                      , n = t / 2
                      , B = WA(A[0], e) - r
                      , s = n - WA(A[1], t);
                    return (Math.atan2(s, B) + 2 * Math.PI) % (2 * Math.PI)
                }(A, e, t)
                  , n = Math.abs(e * Math.sin(r)) + Math.abs(t * Math.cos(r))
                  , B = e / 2
                  , s = t / 2
                  , o = n / 2
                  , i = Math.sin(r - Math.PI / 2) * o
                  , a = Math.cos(r - Math.PI / 2) * o;
                return [n, B - a, B + a, s - i, s + i]
            }, ge = function(A, e) {
                return Math.sqrt(A * A + e * e)
            }, Ee = function(A, e, t, r, n) {
                return [[0, 0], [0, e], [A, 0], [A, e]].reduce(function(A, e) {
                    var B = e[0]
                      , s = e[1]
                      , o = ge(t - B, r - s);
                    return (n ? o < A.optimumDistance : o > A.optimumDistance) ? {
                        optimumCorner: e,
                        optimumDistance: o
                    } : A
                }, {
                    optimumDistance: n ? 1 / 0 : -1 / 0,
                    optimumCorner: null
                }).optimumCorner
            }, Fe = function(A) {
                var e = jA(180)
                  , t = [];
                return _A(A).forEach(function(A, r) {
                    if (0 === r) {
                        var n = A[0];
                        if (n.type === u.IDENT_TOKEN && -1 !== ["top", "left", "right", "bottom"].indexOf(n.value))
                            return void (e = ZA(A));
                        if (qA(n))
                            return void (e = (YA(n) + jA(270)) % jA(360))
                    }
                    var B = Ue(A);
                    t.push(B)
                }),
                {
                    angle: e,
                    stops: t,
                    type: Qe.LINEAR_GRADIENT
                }
            }, he = function(A) {
                return 0 === A[0] && 255 === A[1] && 0 === A[2] && 255 === A[3]
            }, He = function(A, e, t, r, n) {
                var B = "http://www.w3.org/2000/svg"
                  , s = document.createElementNS(B, "svg")
                  , o = document.createElementNS(B, "foreignObject");
                return s.setAttributeNS(null, "width", A.toString()),
                s.setAttributeNS(null, "height", e.toString()),
                o.setAttributeNS(null, "width", "100%"),
                o.setAttributeNS(null, "height", "100%"),
                o.setAttributeNS(null, "x", t.toString()),
                o.setAttributeNS(null, "y", r.toString()),
                o.setAttributeNS(null, "externalResourcesRequired", "true"),
                s.appendChild(o),
                o.appendChild(n),
                s
            }, de = function(A) {
                return new Promise(function(e, t) {
                    var r = new Image;
                    r.onload = function() {
                        return e(r)
                    }
                    ,
                    r.onerror = t,
                    r.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent((new XMLSerializer).serializeToString(A))
                }
                )
            }, fe = {
                get SUPPORT_RANGE_BOUNDS() {
                    var A = function(A) {
                        if (A.createRange) {
                            var e = A.createRange();
                            if (e.getBoundingClientRect) {
                                var t = A.createElement("boundtest");
                                t.style.height = "123px",
                                t.style.display = "block",
                                A.body.appendChild(t),
                                e.selectNode(t);
                                var r = e.getBoundingClientRect()
                                  , n = Math.round(r.height);
                                if (A.body.removeChild(t),
                                123 === n)
                                    return !0
                            }
                        }
                        return !1
                    }(document);
                    return Object.defineProperty(fe, "SUPPORT_RANGE_BOUNDS", {
                        value: A
                    }),
                    A
                },
                get SUPPORT_SVG_DRAWING() {
                    var A = function(A) {
                        var e = new Image
                          , t = A.createElement("canvas")
                          , r = t.getContext("2d");
                        if (!r)
                            return !1;
                        e.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
                        try {
                            r.drawImage(e, 0, 0),
                            t.toDataURL()
                        } catch (A) {
                            return !1
                        }
                        return !0
                    }(document);
                    return Object.defineProperty(fe, "SUPPORT_SVG_DRAWING", {
                        value: A
                    }),
                    A
                },
                get SUPPORT_FOREIGNOBJECT_DRAWING() {
                    var A = "function" == typeof Array.from && "function" == typeof window.fetch ? function(A) {
                        var e = A.createElement("canvas");
                        e.width = 100,
                        e.height = 100;
                        var t = e.getContext("2d");
                        if (!t)
                            return Promise.reject(!1);
                        t.fillStyle = "rgb(0, 255, 0)",
                        t.fillRect(0, 0, 100, 100);
                        var r = new Image
                          , n = e.toDataURL();
                        r.src = n;
                        var B = He(100, 100, 0, 0, r);
                        return t.fillStyle = "red",
                        t.fillRect(0, 0, 100, 100),
                        de(B).then(function(e) {
                            t.drawImage(e, 0, 0);
                            var r = t.getImageData(0, 0, 100, 100).data;
                            t.fillStyle = "red",
                            t.fillRect(0, 0, 100, 100);
                            var B = A.createElement("div");
                            return B.style.backgroundImage = "url(" + n + ")",
                            B.style.height = "100px",
                            he(r) ? de(He(100, 100, 0, 0, B)) : Promise.reject(!1)
                        }).then(function(A) {
                            return t.drawImage(A, 0, 0),
                            he(t.getImageData(0, 0, 100, 100).data)
                        }).catch(function() {
                            return !1
                        })
                    }(document) : Promise.resolve(!1);
                    return Object.defineProperty(fe, "SUPPORT_FOREIGNOBJECT_DRAWING", {
                        value: A
                    }),
                    A
                },
                get SUPPORT_CORS_IMAGES() {
                    var A = void 0 !== (new Image).crossOrigin;
                    return Object.defineProperty(fe, "SUPPORT_CORS_IMAGES", {
                        value: A
                    }),
                    A
                },
                get SUPPORT_RESPONSE_TYPE() {
                    var A = "string" == typeof (new XMLHttpRequest).responseType;
                    return Object.defineProperty(fe, "SUPPORT_RESPONSE_TYPE", {
                        value: A
                    }),
                    A
                },
                get SUPPORT_CORS_XHR() {
                    var A = "withCredentials"in new XMLHttpRequest;
                    return Object.defineProperty(fe, "SUPPORT_CORS_XHR", {
                        value: A
                    }),
                    A
                }
            }, pe = function() {
                function A(A) {
                    var e = A.id
                      , t = A.enabled;
                    this.id = e,
                    this.enabled = t,
                    this.start = Date.now()
                }
                return A.prototype.debug = function() {
                    for (var A = [], e = 0; e < arguments.length; e++)
                        A[e] = arguments[e];
                    this.enabled && ("undefined" != typeof window && window.console && "function" == typeof console.debug ? console.debug.apply(console, [this.id, this.getTime() + "ms"].concat(A)) : this.info.apply(this, A))
                }
                ,
                A.prototype.getTime = function() {
                    return Date.now() - this.start
                }
                ,
                A.create = function(e) {
                    A.instances[e.id] = new A(e)
                }
                ,
                A.destroy = function(e) {
                    delete A.instances[e]
                }
                ,
                A.getInstance = function(e) {
                    var t = A.instances[e];
                    if (void 0 === t)
                        throw new Error("No logger instance found with id " + e);
                    return t
                }
                ,
                A.prototype.info = function() {
                    for (var A = [], e = 0; e < arguments.length; e++)
                        A[e] = arguments[e];
                    this.enabled && "undefined" != typeof window && window.console && "function" == typeof console.info && console.info.apply(console, [this.id, this.getTime() + "ms"].concat(A))
                }
                ,
                A.prototype.error = function() {
                    for (var A = [], e = 0; e < arguments.length; e++)
                        A[e] = arguments[e];
                    this.enabled && ("undefined" != typeof window && window.console && "function" == typeof console.error ? console.error.apply(console, [this.id, this.getTime() + "ms"].concat(A)) : this.info.apply(this, A))
                }
                ,
                A.instances = {},
                A
            }(), Ne = function() {
                function A() {}
                return A.create = function(e, t) {
                    return A._caches[e] = new Ke(e,t)
                }
                ,
                A.destroy = function(e) {
                    delete A._caches[e]
                }
                ,
                A.open = function(e) {
                    var t = A._caches[e];
                    if (void 0 !== t)
                        return t;
                    throw new Error('Cache with key "' + e + '" not found')
                }
                ,
                A.getOrigin = function(e) {
                    var t = A._link;
                    return t ? (t.href = e,
                    t.href = t.href,
                    t.protocol + t.hostname + t.port) : "about:blank"
                }
                ,
                A.isSameOrigin = function(e) {
                    return A.getOrigin(e) === A._origin
                }
                ,
                A.setContext = function(e) {
                    A._link = e.document.createElement("a"),
                    A._origin = A.getOrigin(e.location.href)
                }
                ,
                A.getInstance = function() {
                    var e = A._current;
                    if (null === e)
                        throw new Error("No cache instance attached");
                    return e
                }
                ,
                A.attachInstance = function(e) {
                    A._current = e
                }
                ,
                A.detachInstance = function() {
                    A._current = null
                }
                ,
                A._caches = {},
                A._origin = "about:blank",
                A._current = null,
                A
            }(), Ke = function() {
                function A(A, e) {
                    this.id = A,
                    this._options = e,
                    this._cache = {}
                }
                return A.prototype.addImage = function(A) {
                    var e = Promise.resolve();
                    return this.has(A) ? e : ve(A) || Re(A) ? (this._cache[A] = this.loadImage(A),
                    e) : e
                }
                ,
                A.prototype.match = function(A) {
                    return this._cache[A]
                }
                ,
                A.prototype.loadImage = function(A) {
                    return r(this, void 0, void 0, function() {
                        var e, t, r, B, s = this;
                        return n(this, function(n) {
                            switch (n.label) {
                            case 0:
                                return e = Ne.isSameOrigin(A),
                                t = !Le(A) && !0 === this._options.useCORS && fe.SUPPORT_CORS_IMAGES && !e,
                                r = !Le(A) && !e && "string" == typeof this._options.proxy && fe.SUPPORT_CORS_XHR && !t,
                                e || !1 !== this._options.allowTaint || Le(A) || r || t ? (B = A,
                                r ? [4, this.proxy(B)] : [3, 2]) : [2];
                            case 1:
                                B = n.sent(),
                                n.label = 2;
                            case 2:
                                return pe.getInstance(this.id).debug("Added image " + A.substring(0, 256)),
                                [4, new Promise(function(A, e) {
                                    var r = new Image;
                                    r.onload = function() {
                                        return A(r)
                                    }
                                    ,
                                    r.onerror = e,
                                    (Oe(B) || t) && (r.crossOrigin = "anonymous"),
                                    r.src = B,
                                    !0 === r.complete && setTimeout(function() {
                                        return A(r)
                                    }, 500),
                                    s._options.imageTimeout > 0 && setTimeout(function() {
                                        return e("Timed out (" + s._options.imageTimeout + "ms) loading image")
                                    }, s._options.imageTimeout)
                                }
                                )];
                            case 3:
                                return [2, n.sent()]
                            }
                        })
                    })
                }
                ,
                A.prototype.has = function(A) {
                    return void 0 !== this._cache[A]
                }
                ,
                A.prototype.keys = function() {
                    return Promise.resolve(Object.keys(this._cache))
                }
                ,
                A.prototype.proxy = function(A) {
                    var e = this
                      , t = this._options.proxy;
                    if (!t)
                        throw new Error("No proxy defined");
                    var r = A.substring(0, 256);
                    return new Promise(function(n, B) {
                        var s = fe.SUPPORT_RESPONSE_TYPE ? "blob" : "text"
                          , o = new XMLHttpRequest;
                        if (o.onload = function() {
                            if (200 === o.status)
                                if ("text" === s)
                                    n(o.response);
                                else {
                                    var A = new FileReader;
                                    A.addEventListener("load", function() {
                                        return n(A.result)
                                    }, !1),
                                    A.addEventListener("error", function(A) {
                                        return B(A)
                                    }, !1),
                                    A.readAsDataURL(o.response)
                                }
                            else
                                B("Failed to proxy resource " + r + " with status code " + o.status)
                        }
                        ,
                        o.onerror = B,
                        o.open("GET", t + "?url=" + encodeURIComponent(A) + "&responseType=" + s),
                        "text" !== s && o instanceof XMLHttpRequest && (o.responseType = s),
                        e._options.imageTimeout) {
                            var i = e._options.imageTimeout;
                            o.timeout = i,
                            o.ontimeout = function() {
                                return B("Timed out (" + i + "ms) proxying " + r)
                            }
                        }
                        o.send()
                    }
                    )
                }
                ,
                A
            }(), Ie = /^data:image\/svg\+xml/i, Te = /^data:image\/.*;base64,/i, me = /^data:image\/.*/i, Re = function(A) {
                return fe.SUPPORT_SVG_DRAWING || !De(A)
            }, Le = function(A) {
                return me.test(A)
            }, Oe = function(A) {
                return Te.test(A)
            }, ve = function(A) {
                return "blob" === A.substr(0, 4)
            }, De = function(A) {
                return "svg" === A.substr(-3).toLowerCase() || Ie.test(A)
            }, be = function(A) {
                var e = Se.CIRCLE
                  , t = Me.FARTHEST_CORNER
                  , r = []
                  , n = [];
                return _A(A).forEach(function(A, B) {
                    var s = !0;
                    if (0 === B ? s = A.reduce(function(A, e) {
                        if (DA(e))
                            switch (e.value) {
                            case "center":
                                return n.push(JA),
                                !1;
                            case "top":
                            case "left":
                                return n.push(XA),
                                !1;
                            case "right":
                            case "bottom":
                                return n.push(GA),
                                !1
                            }
                        else if (VA(e) || xA(e))
                            return n.push(e),
                            !1;
                        return A
                    }, s) : 1 === B && (s = A.reduce(function(A, r) {
                        if (DA(r))
                            switch (r.value) {
                            case "circle":
                                return e = Se.CIRCLE,
                                !1;
                            case "ellipse":
                                return e = Se.ELLIPSE,
                                !1;
                            case "contain":
                            case "closest-side":
                                return t = Me.CLOSEST_SIDE,
                                !1;
                            case "farthest-side":
                                return t = Me.FARTHEST_SIDE,
                                !1;
                            case "closest-corner":
                                return t = Me.CLOSEST_CORNER,
                                !1;
                            case "cover":
                            case "farthest-corner":
                                return t = Me.FARTHEST_CORNER,
                                !1
                            }
                        else if (xA(r) || VA(r))
                            return Array.isArray(t) || (t = []),
                            t.push(r),
                            !1;
                        return A
                    }, s)),
                    s) {
                        var o = Ue(A);
                        r.push(o)
                    }
                }),
                {
                    size: t,
                    shape: e,
                    stops: r,
                    position: n,
                    type: Qe.RADIAL_GRADIENT
                }
            };
            !function(A) {
                A[A.URL = 0] = "URL",
                A[A.LINEAR_GRADIENT = 1] = "LINEAR_GRADIENT",
                A[A.RADIAL_GRADIENT = 2] = "RADIAL_GRADIENT"
            }(Qe || (Qe = {}));
            var Se, Me;
            !function(A) {
                A[A.CIRCLE = 0] = "CIRCLE",
                A[A.ELLIPSE = 1] = "ELLIPSE"
            }(Se || (Se = {})),
            function(A) {
                A[A.CLOSEST_SIDE = 0] = "CLOSEST_SIDE",
                A[A.FARTHEST_SIDE = 1] = "FARTHEST_SIDE",
                A[A.CLOSEST_CORNER = 2] = "CLOSEST_CORNER",
                A[A.FARTHEST_CORNER = 3] = "FARTHEST_CORNER"
            }(Me || (Me = {}));
            var ye = function(A) {
                if (A.type === u.URL_TOKEN) {
                    var e = {
                        url: A.value,
                        type: Qe.URL
                    };
                    return Ne.getInstance().addImage(A.value),
                    e
                }
                if (A.type === u.FUNCTION) {
                    var t = Pe[A.name];
                    if (void 0 === t)
                        throw new Error('Attempting to parse an unsupported image function "' + A.name + '"');
                    return t(A.values)
                }
                throw new Error("Unsupported image type")
            };
            var _e, Pe = {
                "linear-gradient": function(A) {
                    var e = jA(180)
                      , t = [];
                    return _A(A).forEach(function(A, r) {
                        if (0 === r) {
                            var n = A[0];
                            if (n.type === u.IDENT_TOKEN && "to" === n.value)
                                return void (e = ZA(A));
                            if (qA(n))
                                return void (e = YA(n))
                        }
                        var B = Ue(A);
                        t.push(B)
                    }),
                    {
                        angle: e,
                        stops: t,
                        type: Qe.LINEAR_GRADIENT
                    }
                },
                "-moz-linear-gradient": Fe,
                "-ms-linear-gradient": Fe,
                "-o-linear-gradient": Fe,
                "-webkit-linear-gradient": Fe,
                "radial-gradient": function(A) {
                    var e = Se.CIRCLE
                      , t = Me.FARTHEST_CORNER
                      , r = []
                      , n = [];
                    return _A(A).forEach(function(A, B) {
                        var s = !0;
                        if (0 === B) {
                            var o = !1;
                            s = A.reduce(function(A, r) {
                                if (o)
                                    if (DA(r))
                                        switch (r.value) {
                                        case "center":
                                            return n.push(JA),
                                            A;
                                        case "top":
                                        case "left":
                                            return n.push(XA),
                                            A;
                                        case "right":
                                        case "bottom":
                                            return n.push(GA),
                                            A
                                        }
                                    else
                                        (VA(r) || xA(r)) && n.push(r);
                                else if (DA(r))
                                    switch (r.value) {
                                    case "circle":
                                        return e = Se.CIRCLE,
                                        !1;
                                    case "ellipse":
                                        return e = Se.ELLIPSE,
                                        !1;
                                    case "at":
                                        return o = !0,
                                        !1;
                                    case "closest-side":
                                        return t = Me.CLOSEST_SIDE,
                                        !1;
                                    case "cover":
                                    case "farthest-side":
                                        return t = Me.FARTHEST_SIDE,
                                        !1;
                                    case "contain":
                                    case "closest-corner":
                                        return t = Me.CLOSEST_CORNER,
                                        !1;
                                    case "farthest-corner":
                                        return t = Me.FARTHEST_CORNER,
                                        !1
                                    }
                                else if (xA(r) || VA(r))
                                    return Array.isArray(t) || (t = []),
                                    t.push(r),
                                    !1;
                                return A
                            }, s)
                        }
                        if (s) {
                            var i = Ue(A);
                            r.push(i)
                        }
                    }),
                    {
                        size: t,
                        shape: e,
                        stops: r,
                        position: n,
                        type: Qe.RADIAL_GRADIENT
                    }
                },
                "-moz-radial-gradient": be,
                "-ms-radial-gradient": be,
                "-o-radial-gradient": be,
                "-webkit-radial-gradient": be,
                "-webkit-gradient": function(A) {
                    var e = jA(180)
                      , t = []
                      , r = Qe.LINEAR_GRADIENT
                      , n = Se.CIRCLE
                      , B = Me.FARTHEST_CORNER;
                    return _A(A).forEach(function(A, e) {
                        var n = A[0];
                        if (0 === e) {
                            if (DA(n) && "linear" === n.value)
                                return void (r = Qe.LINEAR_GRADIENT);
                            if (DA(n) && "radial" === n.value)
                                return void (r = Qe.RADIAL_GRADIENT)
                        }
                        if (n.type === u.FUNCTION)
                            if ("from" === n.name) {
                                var B = $A(n.values[0]);
                                t.push({
                                    stop: XA,
                                    color: B
                                })
                            } else if ("to" === n.name)
                                B = $A(n.values[0]),
                                t.push({
                                    stop: GA,
                                    color: B
                                });
                            else if ("color-stop" === n.name) {
                                var s = n.values.filter(yA);
                                if (2 === s.length) {
                                    B = $A(s[1]);
                                    var o = s[0];
                                    vA(o) && t.push({
                                        stop: {
                                            type: u.PERCENTAGE_TOKEN,
                                            number: 100 * o.number,
                                            flags: o.flags
                                        },
                                        color: B
                                    })
                                }
                            }
                    }),
                    r === Qe.LINEAR_GRADIENT ? {
                        angle: (e + jA(180)) % jA(360),
                        stops: t,
                        type: r
                    } : {
                        size: B,
                        shape: n,
                        stops: t,
                        position: [],
                        type: r
                    }
                }
            }, xe = {
                name: "background-image",
                initialValue: "none",
                type: se.LIST,
                prefix: !1,
                parse: function(A) {
                    if (0 === A.length)
                        return [];
                    var e = A[0];
                    return e.type === u.IDENT_TOKEN && "none" === e.value ? [] : A.filter(function(A) {
                        return yA(A) && function(A) {
                            return A.type !== u.FUNCTION || Pe[A.name]
                        }(A)
                    }).map(ye)
                }
            }, Ve = {
                name: "background-origin",
                initialValue: "border-box",
                prefix: !1,
                type: se.LIST,
                parse: function(A) {
                    return A.map(function(A) {
                        if (DA(A))
                            switch (A.value) {
                            case "padding-box":
                                return 1;
                            case "content-box":
                                return 2
                            }
                        return 0
                    })
                }
            }, ze = {
                name: "background-position",
                initialValue: "0% 0%",
                type: se.LIST,
                prefix: !1,
                parse: function(A) {
                    return _A(A).map(function(A) {
                        return A.filter(VA)
                    }).map(zA)
                }
            };
            !function(A) {
                A[A.REPEAT = 0] = "REPEAT",
                A[A.NO_REPEAT = 1] = "NO_REPEAT",
                A[A.REPEAT_X = 2] = "REPEAT_X",
                A[A.REPEAT_Y = 3] = "REPEAT_Y"
            }(_e || (_e = {}));
            var Xe, Je = {
                name: "background-repeat",
                initialValue: "repeat",
                prefix: !1,
                type: se.LIST,
                parse: function(A) {
                    return _A(A).map(function(A) {
                        return A.filter(DA).map(function(A) {
                            return A.value
                        }).join(" ")
                    }).map(Ge)
                }
            }, Ge = function(A) {
                switch (A) {
                case "no-repeat":
                    return _e.NO_REPEAT;
                case "repeat-x":
                case "repeat no-repeat":
                    return _e.REPEAT_X;
                case "repeat-y":
                case "no-repeat repeat":
                    return _e.REPEAT_Y;
                case "repeat":
                default:
                    return _e.REPEAT
                }
            };
            !function(A) {
                A.AUTO = "auto",
                A.CONTAIN = "contain",
                A.COVER = "cover"
            }(Xe || (Xe = {}));
            var ke, We = {
                name: "background-size",
                initialValue: "0",
                prefix: !1,
                type: se.LIST,
                parse: function(A) {
                    return _A(A).map(function(A) {
                        return A.filter(Ye)
                    })
                }
            }, Ye = function(A) {
                return DA(A) || VA(A)
            }, qe = function(A) {
                return {
                    name: "border-" + A + "-color",
                    initialValue: "transparent",
                    prefix: !1,
                    type: se.TYPE_VALUE,
                    format: "color"
                }
            }, Ze = qe("top"), je = qe("right"), $e = qe("bottom"), At = qe("left"), et = function(A) {
                return {
                    name: "border-radius-" + A,
                    initialValue: "0 0",
                    prefix: !1,
                    type: se.LIST,
                    parse: function(A) {
                        return zA(A.filter(VA))
                    }
                }
            }, tt = et("top-left"), rt = et("top-right"), nt = et("bottom-right"), Bt = et("bottom-left");
            !function(A) {
                A[A.NONE = 0] = "NONE",
                A[A.SOLID = 1] = "SOLID"
            }(ke || (ke = {}));
            var st, ot = function(A) {
                return {
                    name: "border-" + A + "-style",
                    initialValue: "solid",
                    prefix: !1,
                    type: se.IDENT_VALUE,
                    parse: function(A) {
                        switch (A) {
                        case "none":
                            return ke.NONE
                        }
                        return ke.SOLID
                    }
                }
            }, it = ot("top"), at = ot("right"), ct = ot("bottom"), Qt = ot("left"), ut = function(A) {
                return {
                    name: "border-" + A + "-width",
                    initialValue: "0",
                    type: se.VALUE,
                    prefix: !1,
                    parse: function(A) {
                        return OA(A) ? A.number : 0
                    }
                }
            }, wt = ut("top"), Ut = ut("right"), lt = ut("bottom"), Ct = ut("left"), gt = {
                name: "color",
                initialValue: "transparent",
                prefix: !1,
                type: se.TYPE_VALUE,
                format: "color"
            }, Et = {
                name: "display",
                initialValue: "inline-block",
                prefix: !1,
                type: se.LIST,
                parse: function(A) {
                    return A.filter(DA).reduce(function(A, e) {
                        return A | Ft(e.value)
                    }, 0)
                }
            }, Ft = function(A) {
                switch (A) {
                case "block":
                    return 2;
                case "inline":
                    return 4;
                case "run-in":
                    return 8;
                case "flow":
                    return 16;
                case "flow-root":
                    return 32;
                case "table":
                    return 64;
                case "flex":
                case "-webkit-flex":
                    return 128;
                case "grid":
                case "-ms-grid":
                    return 256;
                case "ruby":
                    return 512;
                case "subgrid":
                    return 1024;
                case "list-item":
                    return 2048;
                case "table-row-group":
                    return 4096;
                case "table-header-group":
                    return 8192;
                case "table-footer-group":
                    return 16384;
                case "table-row":
                    return 32768;
                case "table-cell":
                    return 65536;
                case "table-column-group":
                    return 131072;
                case "table-column":
                    return 262144;
                case "table-caption":
                    return 524288;
                case "ruby-base":
                    return 1048576;
                case "ruby-text":
                    return 2097152;
                case "ruby-base-container":
                    return 4194304;
                case "ruby-text-container":
                    return 8388608;
                case "contents":
                    return 16777216;
                case "inline-block":
                    return 33554432;
                case "inline-list-item":
                    return 67108864;
                case "inline-table":
                    return 134217728;
                case "inline-flex":
                    return 268435456;
                case "inline-grid":
                    return 536870912
                }
                return 0
            };
            !function(A) {
                A[A.NONE = 0] = "NONE",
                A[A.LEFT = 1] = "LEFT",
                A[A.RIGHT = 2] = "RIGHT",
                A[A.INLINE_START = 3] = "INLINE_START",
                A[A.INLINE_END = 4] = "INLINE_END"
            }(st || (st = {}));
            var ht, Ht = {
                name: "float",
                initialValue: "none",
                prefix: !1,
                type: se.IDENT_VALUE,
                parse: function(A) {
                    switch (A) {
                    case "left":
                        return st.LEFT;
                    case "right":
                        return st.RIGHT;
                    case "inline-start":
                        return st.INLINE_START;
                    case "inline-end":
                        return st.INLINE_END
                    }
                    return st.NONE
                }
            }, dt = {
                name: "letter-spacing",
                initialValue: "0",
                prefix: !1,
                type: se.VALUE,
                parse: function(A) {
                    return A.type === u.IDENT_TOKEN && "normal" === A.value ? 0 : A.type === u.NUMBER_TOKEN ? A.number : A.type === u.DIMENSION_TOKEN ? A.number : 0
                }
            };
            !function(A) {
                A.NORMAL = "normal",
                A.STRICT = "strict"
            }(ht || (ht = {}));
            var ft, pt = {
                name: "line-break",
                initialValue: "normal",
                prefix: !1,
                type: se.IDENT_VALUE,
                parse: function(A) {
                    switch (A) {
                    case "strict":
                        return ht.STRICT;
                    case "normal":
                    default:
                        return ht.NORMAL
                    }
                }
            }, Nt = {
                name: "line-height",
                initialValue: "normal",
                prefix: !1,
                type: se.TOKEN_VALUE
            }, Kt = {
                name: "list-style-image",
                initialValue: "none",
                type: se.VALUE,
                prefix: !1,
                parse: function(A) {
                    return A.type === u.IDENT_TOKEN && "none" === A.value ? null : ye(A)
                }
            };
            !function(A) {
                A[A.INSIDE = 0] = "INSIDE",
                A[A.OUTSIDE = 1] = "OUTSIDE"
            }(ft || (ft = {}));
            var It, Tt = {
                name: "list-style-position",
                initialValue: "outside",
                prefix: !1,
                type: se.IDENT_VALUE,
                parse: function(A) {
                    switch (A) {
                    case "inside":
                        return ft.INSIDE;
                    case "outside":
                    default:
                        return ft.OUTSIDE
                    }
                }
            };
            !function(A) {
                A[A.NONE = -1] = "NONE",
                A[A.DISC = 0] = "DISC",
                A[A.CIRCLE = 1] = "CIRCLE",
                A[A.SQUARE = 2] = "SQUARE",
                A[A.DECIMAL = 3] = "DECIMAL",
                A[A.CJK_DECIMAL = 4] = "CJK_DECIMAL",
                A[A.DECIMAL_LEADING_ZERO = 5] = "DECIMAL_LEADING_ZERO",
                A[A.LOWER_ROMAN = 6] = "LOWER_ROMAN",
                A[A.UPPER_ROMAN = 7] = "UPPER_ROMAN",
                A[A.LOWER_GREEK = 8] = "LOWER_GREEK",
                A[A.LOWER_ALPHA = 9] = "LOWER_ALPHA",
                A[A.UPPER_ALPHA = 10] = "UPPER_ALPHA",
                A[A.ARABIC_INDIC = 11] = "ARABIC_INDIC",
                A[A.ARMENIAN = 12] = "ARMENIAN",
                A[A.BENGALI = 13] = "BENGALI",
                A[A.CAMBODIAN = 14] = "CAMBODIAN",
                A[A.CJK_EARTHLY_BRANCH = 15] = "CJK_EARTHLY_BRANCH",
                A[A.CJK_HEAVENLY_STEM = 16] = "CJK_HEAVENLY_STEM",
                A[A.CJK_IDEOGRAPHIC = 17] = "CJK_IDEOGRAPHIC",
                A[A.DEVANAGARI = 18] = "DEVANAGARI",
                A[A.ETHIOPIC_NUMERIC = 19] = "ETHIOPIC_NUMERIC",
                A[A.GEORGIAN = 20] = "GEORGIAN",
                A[A.GUJARATI = 21] = "GUJARATI",
                A[A.GURMUKHI = 22] = "GURMUKHI",
                A[A.HEBREW = 22] = "HEBREW",
                A[A.HIRAGANA = 23] = "HIRAGANA",
                A[A.HIRAGANA_IROHA = 24] = "HIRAGANA_IROHA",
                A[A.JAPANESE_FORMAL = 25] = "JAPANESE_FORMAL",
                A[A.JAPANESE_INFORMAL = 26] = "JAPANESE_INFORMAL",
                A[A.KANNADA = 27] = "KANNADA",
                A[A.KATAKANA = 28] = "KATAKANA",
                A[A.KATAKANA_IROHA = 29] = "KATAKANA_IROHA",
                A[A.KHMER = 30] = "KHMER",
                A[A.KOREAN_HANGUL_FORMAL = 31] = "KOREAN_HANGUL_FORMAL",
                A[A.KOREAN_HANJA_FORMAL = 32] = "KOREAN_HANJA_FORMAL",
                A[A.KOREAN_HANJA_INFORMAL = 33] = "KOREAN_HANJA_INFORMAL",
                A[A.LAO = 34] = "LAO",
                A[A.LOWER_ARMENIAN = 35] = "LOWER_ARMENIAN",
                A[A.MALAYALAM = 36] = "MALAYALAM",
                A[A.MONGOLIAN = 37] = "MONGOLIAN",
                A[A.MYANMAR = 38] = "MYANMAR",
                A[A.ORIYA = 39] = "ORIYA",
                A[A.PERSIAN = 40] = "PERSIAN",
                A[A.SIMP_CHINESE_FORMAL = 41] = "SIMP_CHINESE_FORMAL",
                A[A.SIMP_CHINESE_INFORMAL = 42] = "SIMP_CHINESE_INFORMAL",
                A[A.TAMIL = 43] = "TAMIL",
                A[A.TELUGU = 44] = "TELUGU",
                A[A.THAI = 45] = "THAI",
                A[A.TIBETAN = 46] = "TIBETAN",
                A[A.TRAD_CHINESE_FORMAL = 47] = "TRAD_CHINESE_FORMAL",
                A[A.TRAD_CHINESE_INFORMAL = 48] = "TRAD_CHINESE_INFORMAL",
                A[A.UPPER_ARMENIAN = 49] = "UPPER_ARMENIAN",
                A[A.DISCLOSURE_OPEN = 50] = "DISCLOSURE_OPEN",
                A[A.DISCLOSURE_CLOSED = 51] = "DISCLOSURE_CLOSED"
            }(It || (It = {}));
            var mt, Rt = {
                name: "list-style-type",
                initialValue: "none",
                prefix: !1,
                type: se.IDENT_VALUE,
                parse: function(A) {
                    switch (A) {
                    case "disc":
                        return It.DISC;
                    case "circle":
                        return It.CIRCLE;
                    case "square":
                        return It.SQUARE;
                    case "decimal":
                        return It.DECIMAL;
                    case "cjk-decimal":
                        return It.CJK_DECIMAL;
                    case "decimal-leading-zero":
                        return It.DECIMAL_LEADING_ZERO;
                    case "lower-roman":
                        return It.LOWER_ROMAN;
                    case "upper-roman":
                        return It.UPPER_ROMAN;
                    case "lower-greek":
                        return It.LOWER_GREEK;
                    case "lower-alpha":
                        return It.LOWER_ALPHA;
                    case "upper-alpha":
                        return It.UPPER_ALPHA;
                    case "arabic-indic":
                        return It.ARABIC_INDIC;
                    case "armenian":
                        return It.ARMENIAN;
                    case "bengali":
                        return It.BENGALI;
                    case "cambodian":
                        return It.CAMBODIAN;
                    case "cjk-earthly-branch":
                        return It.CJK_EARTHLY_BRANCH;
                    case "cjk-heavenly-stem":
                        return It.CJK_HEAVENLY_STEM;
                    case "cjk-ideographic":
                        return It.CJK_IDEOGRAPHIC;
                    case "devanagari":
                        return It.DEVANAGARI;
                    case "ethiopic-numeric":
                        return It.ETHIOPIC_NUMERIC;
                    case "georgian":
                        return It.GEORGIAN;
                    case "gujarati":
                        return It.GUJARATI;
                    case "gurmukhi":
                        return It.GURMUKHI;
                    case "hebrew":
                        return It.HEBREW;
                    case "hiragana":
                        return It.HIRAGANA;
                    case "hiragana-iroha":
                        return It.HIRAGANA_IROHA;
                    case "japanese-formal":
                        return It.JAPANESE_FORMAL;
                    case "japanese-informal":
                        return It.JAPANESE_INFORMAL;
                    case "kannada":
                        return It.KANNADA;
                    case "katakana":
                        return It.KATAKANA;
                    case "katakana-iroha":
                        return It.KATAKANA_IROHA;
                    case "khmer":
                        return It.KHMER;
                    case "korean-hangul-formal":
                        return It.KOREAN_HANGUL_FORMAL;
                    case "korean-hanja-formal":
                        return It.KOREAN_HANJA_FORMAL;
                    case "korean-hanja-informal":
                        return It.KOREAN_HANJA_INFORMAL;
                    case "lao":
                        return It.LAO;
                    case "lower-armenian":
                        return It.LOWER_ARMENIAN;
                    case "malayalam":
                        return It.MALAYALAM;
                    case "mongolian":
                        return It.MONGOLIAN;
                    case "myanmar":
                        return It.MYANMAR;
                    case "oriya":
                        return It.ORIYA;
                    case "persian":
                        return It.PERSIAN;
                    case "simp-chinese-formal":
                        return It.SIMP_CHINESE_FORMAL;
                    case "simp-chinese-informal":
                        return It.SIMP_CHINESE_INFORMAL;
                    case "tamil":
                        return It.TAMIL;
                    case "telugu":
                        return It.TELUGU;
                    case "thai":
                        return It.THAI;
                    case "tibetan":
                        return It.TIBETAN;
                    case "trad-chinese-formal":
                        return It.TRAD_CHINESE_FORMAL;
                    case "trad-chinese-informal":
                        return It.TRAD_CHINESE_INFORMAL;
                    case "upper-armenian":
                        return It.UPPER_ARMENIAN;
                    case "disclosure-open":
                        return It.DISCLOSURE_OPEN;
                    case "disclosure-closed":
                        return It.DISCLOSURE_CLOSED;
                    case "none":
                    default:
                        return It.NONE
                    }
                }
            }, Lt = function(A) {
                return {
                    name: "margin-" + A,
                    initialValue: "0",
                    prefix: !1,
                    type: se.TOKEN_VALUE
                }
            }, Ot = Lt("top"), vt = Lt("right"), Dt = Lt("bottom"), bt = Lt("left");
            !function(A) {
                A[A.VISIBLE = 0] = "VISIBLE",
                A[A.HIDDEN = 1] = "HIDDEN",
                A[A.SCROLL = 2] = "SCROLL",
                A[A.AUTO = 3] = "AUTO"
            }(mt || (mt = {}));
            var St, Mt = {
                name: "overflow",
                initialValue: "visible",
                prefix: !1,
                type: se.LIST,
                parse: function(A) {
                    return A.filter(DA).map(function(A) {
                        switch (A.value) {
                        case "hidden":
                            return mt.HIDDEN;
                        case "scroll":
                            return mt.SCROLL;
                        case "auto":
                            return mt.AUTO;
                        case "visible":
                        default:
                            return mt.VISIBLE
                        }
                    })
                }
            };
            !function(A) {
                A.NORMAL = "normal",
                A.BREAK_WORD = "break-word"
            }(St || (St = {}));
            var yt, _t = {
                name: "overflow-wrap",
                initialValue: "normal",
                prefix: !1,
                type: se.IDENT_VALUE,
                parse: function(A) {
                    switch (A) {
                    case "break-word":
                        return St.BREAK_WORD;
                    case "normal":
                    default:
                        return St.NORMAL
                    }
                }
            }, Pt = function(A) {
                return {
                    name: "padding-" + A,
                    initialValue: "0",
                    prefix: !1,
                    type: se.TYPE_VALUE,
                    format: "length-percentage"
                }
            }, xt = Pt("top"), Vt = Pt("right"), zt = Pt("bottom"), Xt = Pt("left");
            !function(A) {
                A[A.LEFT = 0] = "LEFT",
                A[A.CENTER = 1] = "CENTER",
                A[A.RIGHT = 2] = "RIGHT"
            }(yt || (yt = {}));
            var Jt, Gt = {
                name: "text-align",
                initialValue: "left",
                prefix: !1,
                type: se.IDENT_VALUE,
                parse: function(A) {
                    switch (A) {
                    case "right":
                        return yt.RIGHT;
                    case "center":
                    case "justify":
                        return yt.CENTER;
                    case "left":
                    default:
                        return yt.LEFT
                    }
                }
            };
            !function(A) {
                A[A.STATIC = 0] = "STATIC",
                A[A.RELATIVE = 1] = "RELATIVE",
                A[A.ABSOLUTE = 2] = "ABSOLUTE",
                A[A.FIXED = 3] = "FIXED",
                A[A.STICKY = 4] = "STICKY"
            }(Jt || (Jt = {}));
            var kt, Wt = {
                name: "position",
                initialValue: "static",
                prefix: !1,
                type: se.IDENT_VALUE,
                parse: function(A) {
                    switch (A) {
                    case "relative":
                        return Jt.RELATIVE;
                    case "absolute":
                        return Jt.ABSOLUTE;
                    case "fixed":
                        return Jt.FIXED;
                    case "sticky":
                        return Jt.STICKY
                    }
                    return Jt.STATIC
                }
            }, Yt = {
                name: "text-shadow",
                initialValue: "none",
                type: se.LIST,
                prefix: !1,
                parse: function(A) {
                    return 1 === A.length && SA(A[0], "none") ? [] : _A(A).map(function(A) {
                        for (var e = {
                            color: ce.TRANSPARENT,
                            offsetX: XA,
                            offsetY: XA,
                            blur: XA
                        }, t = 0, r = 0; r < A.length; r++) {
                            var n = A[r];
                            xA(n) ? (0 === t ? e.offsetX = n : 1 === t ? e.offsetY = n : e.blur = n,
                            t++) : e.color = $A(n)
                        }
                        return e
                    })
                }
            };
            !function(A) {
                A[A.NONE = 0] = "NONE",
                A[A.LOWERCASE = 1] = "LOWERCASE",
                A[A.UPPERCASE = 2] = "UPPERCASE",
                A[A.CAPITALIZE = 3] = "CAPITALIZE"
            }(kt || (kt = {}));
            var qt, Zt = {
                name: "text-transform",
                initialValue: "none",
                prefix: !1,
                type: se.IDENT_VALUE,
                parse: function(A) {
                    switch (A) {
                    case "uppercase":
                        return kt.UPPERCASE;
                    case "lowercase":
                        return kt.LOWERCASE;
                    case "capitalize":
                        return kt.CAPITALIZE
                    }
                    return kt.NONE
                }
            }, jt = {
                name: "transform",
                initialValue: "none",
                prefix: !0,
                type: se.VALUE,
                parse: function(A) {
                    if (A.type === u.IDENT_TOKEN && "none" === A.value)
                        return null;
                    if (A.type === u.FUNCTION) {
                        var e = $t[A.name];
                        if (void 0 === e)
                            throw new Error('Attempting to parse an unsupported transform function "' + A.name + '"');
                        return e(A.values)
                    }
                    return null
                }
            }, $t = {
                matrix: function(A) {
                    var e = A.filter(function(A) {
                        return A.type === u.NUMBER_TOKEN
                    }).map(function(A) {
                        return A.number
                    });
                    return 6 === e.length ? e : null
                },
                matrix3d: function(A) {
                    var e = A.filter(function(A) {
                        return A.type === u.NUMBER_TOKEN
                    }).map(function(A) {
                        return A.number
                    })
                      , t = e[0]
                      , r = e[1]
                      , n = (e[2],
                    e[3],
                    e[4])
                      , B = e[5]
                      , s = (e[6],
                    e[7],
                    e[8],
                    e[9],
                    e[10],
                    e[11],
                    e[12])
                      , o = e[13];
                    e[14],
                    e[15];
                    return 16 === e.length ? [t, r, n, B, s, o] : null
                }
            }, Ar = {
                type: u.PERCENTAGE_TOKEN,
                number: 50,
                flags: 4
            }, er = [Ar, Ar], tr = {
                name: "transform-origin",
                initialValue: "50% 50%",
                prefix: !0,
                type: se.LIST,
                parse: function(A) {
                    var e = A.filter(VA);
                    return 2 !== e.length ? er : [e[0], e[1]]
                }
            };
            !function(A) {
                A[A.VISIBLE = 0] = "VISIBLE",
                A[A.HIDDEN = 1] = "HIDDEN",
                A[A.COLLAPSE = 2] = "COLLAPSE"
            }(qt || (qt = {}));
            var rr, nr = {
                name: "visible",
                initialValue: "none",
                prefix: !1,
                type: se.IDENT_VALUE,
                parse: function(A) {
                    switch (A) {
                    case "hidden":
                        return qt.HIDDEN;
                    case "collapse":
                        return qt.COLLAPSE;
                    case "visible":
                    default:
                        return qt.VISIBLE
                    }
                }
            };
            !function(A) {
                A.NORMAL = "normal",
                A.BREAK_ALL = "break-all",
                A.KEEP_ALL = "keep-all"
            }(rr || (rr = {}));
            var Br, sr = {
                name: "word-break",
                initialValue: "normal",
                prefix: !1,
                type: se.IDENT_VALUE,
                parse: function(A) {
                    switch (A) {
                    case "break-all":
                        return rr.BREAK_ALL;
                    case "keep-all":
                        return rr.KEEP_ALL;
                    case "normal":
                    default:
                        return rr.NORMAL
                    }
                }
            }, or = {
                name: "z-index",
                initialValue: "auto",
                prefix: !1,
                type: se.VALUE,
                parse: function(A) {
                    if (A.type === u.IDENT_TOKEN)
                        return {
                            auto: !0,
                            order: 0
                        };
                    if (vA(A))
                        return {
                            auto: !1,
                            order: A.number
                        };
                    throw new Error("Invalid z-index number parsed")
                }
            }, ir = {
                name: "opacity",
                initialValue: "1",
                type: se.VALUE,
                prefix: !1,
                parse: function(A) {
                    return vA(A) ? A.number : 1
                }
            }, ar = {
                name: "text-decoration-color",
                initialValue: "transparent",
                prefix: !1,
                type: se.TYPE_VALUE,
                format: "color"
            }, cr = {
                name: "text-decoration-line",
                initialValue: "none",
                prefix: !1,
                type: se.LIST,
                parse: function(A) {
                    return A.filter(DA).map(function(A) {
                        switch (A.value) {
                        case "underline":
                            return 1;
                        case "overline":
                            return 2;
                        case "line-through":
                            return 3;
                        case "none":
                            return 4
                        }
                        return 0
                    }).filter(function(A) {
                        return 0 !== A
                    })
                }
            }, Qr = {
                name: "font-family",
                initialValue: "",
                prefix: !1,
                type: se.LIST,
                parse: function(A) {
                    var e = []
                      , t = [];
                    return A.forEach(function(A) {
                        switch (A.type) {
                        case u.IDENT_TOKEN:
                        case u.STRING_TOKEN:
                            e.push(A.value);
                            break;
                        case u.NUMBER_TOKEN:
                            e.push(A.number.toString());
                            break;
                        case u.COMMA_TOKEN:
                            t.push(e.join(" ")),
                            e.length = 0
                        }
                    }),
                    e.length && t.push(e.join(" ")),
                    t.map(function(A) {
                        return -1 === A.indexOf(" ") ? A : "'" + A + "'"
                    })
                }
            }, ur = {
                name: "font-size",
                initialValue: "0",
                prefix: !1,
                type: se.TYPE_VALUE,
                format: "length"
            }, wr = {
                name: "font-weight",
                initialValue: "normal",
                type: se.VALUE,
                prefix: !1,
                parse: function(A) {
                    if (vA(A))
                        return A.number;
                    if (DA(A))
                        switch (A.value) {
                        case "bold":
                            return 700;
                        case "normal":
                        default:
                            return 400
                        }
                    return 400
                }
            }, Ur = {
                name: "font-variant",
                initialValue: "none",
                type: se.LIST,
                prefix: !1,
                parse: function(A) {
                    return A.filter(DA).map(function(A) {
                        return A.value
                    })
                }
            };
            !function(A) {
                A.NORMAL = "normal",
                A.ITALIC = "italic",
                A.OBLIQUE = "oblique"
            }(Br || (Br = {}));
            var lr, Cr = {
                name: "font-style",
                initialValue: "normal",
                prefix: !1,
                type: se.IDENT_VALUE,
                parse: function(A) {
                    switch (A) {
                    case "oblique":
                        return Br.OBLIQUE;
                    case "italic":
                        return Br.ITALIC;
                    case "normal":
                    default:
                        return Br.NORMAL
                    }
                }
            }, gr = function(A, e) {
                return 0 != (A & e)
            }, Er = {
                name: "content",
                initialValue: "none",
                type: se.LIST,
                prefix: !1,
                parse: function(A) {
                    if (0 === A.length)
                        return [];
                    var e = A[0];
                    return e.type === u.IDENT_TOKEN && "none" === e.value ? [] : A
                }
            }, Fr = {
                name: "counter-increment",
                initialValue: "none",
                prefix: !0,
                type: se.LIST,
                parse: function(A) {
                    if (0 === A.length)
                        return null;
                    var e = A[0];
                    if (e.type === u.IDENT_TOKEN && "none" === e.value)
                        return null;
                    for (var t = [], r = A.filter(MA), n = 0; n < r.length; n++) {
                        var B = r[n]
                          , s = r[n + 1];
                        if (B.type === u.IDENT_TOKEN) {
                            var o = s && vA(s) ? s.number : 1;
                            t.push({
                                counter: B.value,
                                increment: o
                            })
                        }
                    }
                    return t
                }
            }, hr = {
                name: "counter-reset",
                initialValue: "none",
                prefix: !0,
                type: se.LIST,
                parse: function(A) {
                    if (0 === A.length)
                        return [];
                    for (var e = [], t = A.filter(MA), r = 0; r < t.length; r++) {
                        var n = t[r]
                          , B = t[r + 1];
                        if (DA(n) && "none" !== n.value) {
                            var s = B && vA(B) ? B.number : 0;
                            e.push({
                                counter: n.value,
                                reset: s
                            })
                        }
                    }
                    return e
                }
            }, Hr = {
                name: "quotes",
                initialValue: "none",
                prefix: !0,
                type: se.LIST,
                parse: function(A) {
                    if (0 === A.length)
                        return null;
                    var e = A[0];
                    if (e.type === u.IDENT_TOKEN && "none" === e.value)
                        return null;
                    var t = []
                      , r = A.filter(bA);
                    if (r.length % 2 != 0)
                        return null;
                    for (var n = 0; n < r.length; n += 2) {
                        var B = r[n].value
                          , s = r[n + 1].value;
                        t.push({
                            open: B,
                            close: s
                        })
                    }
                    return t
                }
            }, dr = function(A, e, t) {
                if (!A)
                    return "";
                var r = A[Math.min(e, A.length - 1)];
                return r ? t ? r.open : r.close : ""
            }, fr = {
                name: "box-shadow",
                initialValue: "none",
                type: se.LIST,
                prefix: !1,
                parse: function(A) {
                    return 1 === A.length && SA(A[0], "none") ? [] : _A(A).map(function(A) {
                        for (var e = {
                            color: 255,
                            offsetX: XA,
                            offsetY: XA,
                            blur: XA,
                            spread: XA,
                            inset: !1
                        }, t = 0, r = 0; r < A.length; r++) {
                            var n = A[r];
                            SA(n, "inset") ? e.inset = !0 : xA(n) ? (0 === t ? e.offsetX = n : 1 === t ? e.offsetY = n : 2 === t ? e.blur = n : e.spread = n,
                            t++) : e.color = $A(n)
                        }
                        return e
                    })
                }
            }, pr = function() {
                function A(A) {
                    this.backgroundClip = Ir(ue, A.backgroundClip),
                    this.backgroundColor = Ir(we, A.backgroundColor),
                    this.backgroundImage = Ir(xe, A.backgroundImage),
                    this.backgroundOrigin = Ir(Ve, A.backgroundOrigin),
                    this.backgroundPosition = Ir(ze, A.backgroundPosition),
                    this.backgroundRepeat = Ir(Je, A.backgroundRepeat),
                    this.backgroundSize = Ir(We, A.backgroundSize),
                    this.borderTopColor = Ir(Ze, A.borderTopColor),
                    this.borderRightColor = Ir(je, A.borderRightColor),
                    this.borderBottomColor = Ir($e, A.borderBottomColor),
                    this.borderLeftColor = Ir(At, A.borderLeftColor),
                    this.borderTopLeftRadius = Ir(tt, A.borderTopLeftRadius),
                    this.borderTopRightRadius = Ir(rt, A.borderTopRightRadius),
                    this.borderBottomRightRadius = Ir(nt, A.borderBottomRightRadius),
                    this.borderBottomLeftRadius = Ir(Bt, A.borderBottomLeftRadius),
                    this.borderTopStyle = Ir(it, A.borderTopStyle),
                    this.borderRightStyle = Ir(at, A.borderRightStyle),
                    this.borderBottomStyle = Ir(ct, A.borderBottomStyle),
                    this.borderLeftStyle = Ir(Qt, A.borderLeftStyle),
                    this.borderTopWidth = Ir(wt, A.borderTopWidth),
                    this.borderRightWidth = Ir(Ut, A.borderRightWidth),
                    this.borderBottomWidth = Ir(lt, A.borderBottomWidth),
                    this.borderLeftWidth = Ir(Ct, A.borderLeftWidth),
                    this.boxShadow = Ir(fr, A.boxShadow),
                    this.color = Ir(gt, A.color),
                    this.display = Ir(Et, A.display),
                    this.float = Ir(Ht, A.cssFloat),
                    this.fontFamily = Ir(Qr, A.fontFamily),
                    this.fontSize = Ir(ur, A.fontSize),
                    this.fontStyle = Ir(Cr, A.fontStyle),
                    this.fontVariant = Ir(Ur, A.fontVariant),
                    this.fontWeight = Ir(wr, A.fontWeight),
                    this.letterSpacing = Ir(dt, A.letterSpacing),
                    this.lineBreak = Ir(pt, A.lineBreak),
                    this.lineHeight = Ir(Nt, A.lineHeight),
                    this.listStyleImage = Ir(Kt, A.listStyleImage),
                    this.listStylePosition = Ir(Tt, A.listStylePosition),
                    this.listStyleType = Ir(Rt, A.listStyleType),
                    this.marginTop = Ir(Ot, A.marginTop),
                    this.marginRight = Ir(vt, A.marginRight),
                    this.marginBottom = Ir(Dt, A.marginBottom),
                    this.marginLeft = Ir(bt, A.marginLeft),
                    this.opacity = Ir(ir, A.opacity);
                    var e = Ir(Mt, A.overflow);
                    this.overflowX = e[0],
                    this.overflowY = e[e.length > 1 ? 1 : 0],
                    this.overflowWrap = Ir(_t, A.overflowWrap),
                    this.paddingTop = Ir(xt, A.paddingTop),
                    this.paddingRight = Ir(Vt, A.paddingRight),
                    this.paddingBottom = Ir(zt, A.paddingBottom),
                    this.paddingLeft = Ir(Xt, A.paddingLeft),
                    this.position = Ir(Wt, A.position),
                    this.textAlign = Ir(Gt, A.textAlign),
                    this.textDecorationColor = Ir(ar, A.textDecorationColor || A.color),
                    this.textDecorationLine = Ir(cr, A.textDecorationLine),
                    this.textShadow = Ir(Yt, A.textShadow),
                    this.textTransform = Ir(Zt, A.textTransform),
                    this.transform = Ir(jt, A.transform),
                    this.transformOrigin = Ir(tr, A.transformOrigin),
                    this.visibility = Ir(nr, A.visibility),
                    this.wordBreak = Ir(sr, A.wordBreak),
                    this.zIndex = Ir(or, A.zIndex)
                }
                return A.prototype.isVisible = function() {
                    return this.display > 0 && this.opacity > 0 && this.visibility === qt.VISIBLE
                }
                ,
                A.prototype.isTransparent = function() {
                    return Ae(this.backgroundColor)
                }
                ,
                A.prototype.isTransformed = function() {
                    return null !== this.transform
                }
                ,
                A.prototype.isPositioned = function() {
                    return this.position !== Jt.STATIC
                }
                ,
                A.prototype.isPositionedWithZIndex = function() {
                    return this.isPositioned() && !this.zIndex.auto
                }
                ,
                A.prototype.isFloating = function() {
                    return this.float !== st.NONE
                }
                ,
                A.prototype.isInlineLevel = function() {
                    return gr(this.display, 4) || gr(this.display, 33554432) || gr(this.display, 268435456) || gr(this.display, 536870912) || gr(this.display, 67108864) || gr(this.display, 134217728)
                }
                ,
                A
            }(), Nr = function() {
                return function(A) {
                    this.content = Ir(Er, A.content),
                    this.quotes = Ir(Hr, A.quotes)
                }
            }(), Kr = function() {
                return function(A) {
                    this.counterIncrement = Ir(Fr, A.counterIncrement),
                    this.counterReset = Ir(hr, A.counterReset)
                }
            }(), Ir = function(A, e) {
                var t = new RA
                  , r = null != e ? e.toString() : A.initialValue;
                t.write(r);
                var n = new LA(t.read());
                switch (A.type) {
                case se.IDENT_VALUE:
                    var B = n.parseComponentValue();
                    return A.parse(DA(B) ? B.value : A.initialValue);
                case se.VALUE:
                    return A.parse(n.parseComponentValue());
                case se.LIST:
                    return A.parse(n.parseComponentValues());
                case se.TOKEN_VALUE:
                    return n.parseComponentValue();
                case se.TYPE_VALUE:
                    switch (A.format) {
                    case "angle":
                        return YA(n.parseComponentValue());
                    case "color":
                        return $A(n.parseComponentValue());
                    case "image":
                        return ye(n.parseComponentValue());
                    case "length":
                        var s = n.parseComponentValue();
                        return xA(s) ? s : XA;
                    case "length-percentage":
                        var o = n.parseComponentValue();
                        return VA(o) ? o : XA
                    }
                }
                throw new Error("Attempting to parse unsupported css format type " + A.format)
            }, Tr = function() {
                return function(A) {
                    this.styles = new pr(window.getComputedStyle(A, null)),
                    this.textNodes = [],
                    this.elements = [],
                    null !== this.styles.transform && Qn(A) && (A.style.transform = "none"),
                    this.bounds = s(A),
                    this.flags = 0
                }
            }(), mr = function() {
                return function(A, e) {
                    this.text = A,
                    this.bounds = e
                }
            }(), Rr = function(A, e, t) {
                var r = vr(A, e)
                  , n = []
                  , B = 0;
                return r.forEach(function(A) {
                    if (e.textDecorationLine.length || A.trim().length > 0)
                        if (fe.SUPPORT_RANGE_BOUNDS)
                            n.push(new mr(A,Or(t, B, A.length)));
                        else {
                            var r = t.splitText(A.length);
                            n.push(new mr(A,Lr(t))),
                            t = r
                        }
                    else
                        fe.SUPPORT_RANGE_BOUNDS || (t = t.splitText(A.length));
                    B += A.length
                }),
                n
            }, Lr = function(A) {
                var e = A.ownerDocument;
                if (e) {
                    var t = e.createElement("html2canvaswrapper");
                    t.appendChild(A.cloneNode(!0));
                    var r = A.parentNode;
                    if (r) {
                        r.replaceChild(t, A);
                        var n = s(t);
                        return t.firstChild && r.replaceChild(t.firstChild, t),
                        n
                    }
                }
                return new B(0,0,0,0)
            }, Or = function(A, e, t) {
                var r = A.ownerDocument;
                if (!r)
                    throw new Error("Node has no owner document");
                var n = r.createRange();
                return n.setStart(A, e),
                n.setEnd(A, e + t),
                B.fromClientRect(n.getBoundingClientRect())
            }, vr = function(A, e) {
                return 0 !== e.letterSpacing ? o(A).map(function(A) {
                    return i(A)
                }) : Dr(A, e)
            }, Dr = function(A, e) {
                for (var t, r = function(A, e) {
                    var t = o(A)
                      , r = Z(t, e)
                      , n = r[0]
                      , B = r[1]
                      , s = r[2]
                      , i = t.length
                      , a = 0
                      , c = 0;
                    return {
                        next: function() {
                            if (c >= i)
                                return {
                                    done: !0,
                                    value: null
                                };
                            for (var A = "×"; c < i && "×" === (A = q(t, B, n, ++c, s)); )
                                ;
                            if ("×" !== A || c === i) {
                                var e = new j(t,A,a,c);
                                return a = c,
                                {
                                    value: e,
                                    done: !1
                                }
                            }
                            return {
                                done: !0,
                                value: null
                            }
                        }
                    }
                }(A, {
                    lineBreak: e.lineBreak,
                    wordBreak: e.overflowWrap === St.BREAK_WORD ? "break-word" : e.wordBreak
                }), n = []; !(t = r.next()).done; )
                    t.value && n.push(t.value.slice());
                return n
            }, br = function() {
                return function(A, e) {
                    this.text = Sr(A.data, e.textTransform),
                    this.textBounds = Rr(this.text, e, A)
                }
            }(), Sr = function(A, e) {
                switch (e) {
                case kt.LOWERCASE:
                    return A.toLowerCase();
                case kt.CAPITALIZE:
                    return A.replace(Mr, yr);
                case kt.UPPERCASE:
                    return A.toUpperCase();
                default:
                    return A
                }
            }, Mr = /(^|\s|:|-|\(|\))([a-z])/g, yr = function(A, e, t) {
                return A.length > 0 ? e + t.toUpperCase() : A
            }, _r = function(A) {
                function t(e) {
                    var t = A.call(this, e) || this;
                    return t.src = e.currentSrc || e.src,
                    t.intrinsicWidth = e.naturalWidth,
                    t.intrinsicHeight = e.naturalHeight,
                    Ne.getInstance().addImage(t.src),
                    t
                }
                return e(t, A),
                t
            }(Tr), Pr = function(A) {
                function t(e) {
                    var t = A.call(this, e) || this;
                    return t.canvas = e,
                    t.intrinsicWidth = e.width,
                    t.intrinsicHeight = e.height,
                    t
                }
                return e(t, A),
                t
            }(Tr), xr = function(A) {
                function t(e) {
                    var t = A.call(this, e) || this
                      , r = new XMLSerializer;
                    return t.svg = "data:image/svg+xml," + encodeURIComponent(r.serializeToString(e)),
                    t.intrinsicWidth = e.width.baseVal.value,
                    t.intrinsicHeight = e.height.baseVal.value,
                    Ne.getInstance().addImage(t.svg),
                    t
                }
                return e(t, A),
                t
            }(Tr), Vr = function(A) {
                function t(e) {
                    var t = A.call(this, e) || this;
                    return t.value = e.value,
                    t
                }
                return e(t, A),
                t
            }(Tr), zr = function(A) {
                function t(e) {
                    var t = A.call(this, e) || this;
                    return t.start = e.start,
                    t.reversed = "boolean" == typeof e.reversed && !0 === e.reversed,
                    t
                }
                return e(t, A),
                t
            }(Tr), Xr = [{
                type: u.DIMENSION_TOKEN,
                flags: 0,
                unit: "px",
                number: 3
            }], Jr = [{
                type: u.PERCENTAGE_TOKEN,
                flags: 0,
                number: 50
            }], Gr = function(A) {
                return A.width > A.height ? new B(A.left + (A.width - A.height) / 2,A.top,A.height,A.height) : A.width < A.height ? new B(A.left,A.top + (A.height - A.width) / 2,A.width,A.width) : A
            }, kr = function(A) {
                var e = A.type === qr ? new Array(A.value.length + 1).join("•") : A.value;
                return 0 === e.length ? A.placeholder || "" : e
            }, Wr = "checkbox", Yr = "radio", qr = "password", Zr = function(A) {
                function t(e) {
                    var t = A.call(this, e) || this;
                    switch (t.type = e.type.toLowerCase(),
                    t.checked = e.checked,
                    t.value = kr(e),
                    t.type !== Wr && t.type !== Yr || (t.styles.backgroundColor = 3739148031,
                    t.styles.borderTopColor = t.styles.borderRightColor = t.styles.borderBottomColor = t.styles.borderLeftColor = 2779096575,
                    t.styles.borderTopWidth = t.styles.borderRightWidth = t.styles.borderBottomWidth = t.styles.borderLeftWidth = 1,
                    t.styles.borderTopStyle = t.styles.borderRightStyle = t.styles.borderBottomStyle = t.styles.borderLeftStyle = ke.SOLID,
                    t.styles.backgroundClip = [oe.BORDER_BOX],
                    t.styles.backgroundOrigin = [0],
                    t.bounds = Gr(t.bounds)),
                    t.type) {
                    case Wr:
                        t.styles.borderTopRightRadius = t.styles.borderTopLeftRadius = t.styles.borderBottomRightRadius = t.styles.borderBottomLeftRadius = Xr;
                        break;
                    case Yr:
                        t.styles.borderTopRightRadius = t.styles.borderTopLeftRadius = t.styles.borderBottomRightRadius = t.styles.borderBottomLeftRadius = Jr
                    }
                    return t
                }
                return e(t, A),
                t
            }(Tr), jr = function(A) {
                function t(e) {
                    var t = A.call(this, e) || this
                      , r = e.options[e.selectedIndex || 0];
                    return t.value = r && r.text || "",
                    t
                }
                return e(t, A),
                t
            }(Tr), $r = function(A) {
                function t(e) {
                    var t = A.call(this, e) || this;
                    return t.value = e.value,
                    t
                }
                return e(t, A),
                t
            }(Tr), An = function(A) {
                return $A(LA.create(A).parseComponentValue())
            }, en = function(A) {
                function t(e) {
                    var t = A.call(this, e) || this;
                    t.src = e.src,
                    t.width = parseInt(e.width, 10) || 0,
                    t.height = parseInt(e.height, 10) || 0,
                    t.backgroundColor = t.styles.backgroundColor;
                    try {
                        if (e.contentWindow && e.contentWindow.document && e.contentWindow.document.documentElement) {
                            t.tree = Bn(e.contentWindow.document.documentElement);
                            var r = e.contentWindow.document.documentElement ? An(getComputedStyle(e.contentWindow.document.documentElement).backgroundColor) : ce.TRANSPARENT
                              , n = e.contentWindow.document.body ? An(getComputedStyle(e.contentWindow.document.body).backgroundColor) : ce.TRANSPARENT;
                            t.backgroundColor = Ae(r) ? Ae(n) ? t.styles.backgroundColor : n : r
                        }
                    } catch (A) {}
                    return t
                }
                return e(t, A),
                t
            }(Tr), tn = ["OL", "UL", "MENU"], rn = function(A, e, t) {
                for (var r = A.firstChild, n = void 0; r; r = n)
                    if (n = r.nextSibling,
                    an(r) && r.data.trim().length > 0)
                        e.textNodes.push(new br(r,e.styles));
                    else if (cn(r)) {
                        var B = nn(r);
                        B.styles.isVisible() && (sn(r, B, t) ? B.flags |= 4 : on(B.styles) && (B.flags |= 2),
                        -1 !== tn.indexOf(r.tagName) && (B.flags |= 8),
                        e.elements.push(B),
                        fn(r) || Cn(r) || pn(r) || rn(r, B, t))
                    }
            }, nn = function(A) {
                return Fn(A) ? new _r(A) : En(A) ? new Pr(A) : Cn(A) ? new xr(A) : wn(A) ? new Vr(A) : Un(A) ? new zr(A) : ln(A) ? new Zr(A) : pn(A) ? new jr(A) : fn(A) ? new $r(A) : hn(A) ? new en(A) : new Tr(A)
            }, Bn = function(A) {
                var e = nn(A);
                return e.flags |= 4,
                rn(A, e, e),
                e
            }, sn = function(A, e, t) {
                return e.styles.isPositionedWithZIndex() || e.styles.opacity < 1 || e.styles.isTransformed() || gn(A) && t.styles.isTransparent()
            }, on = function(A) {
                return A.isPositioned() || A.isFloating()
            }, an = function(A) {
                return A.nodeType === Node.TEXT_NODE
            }, cn = function(A) {
                return A.nodeType === Node.ELEMENT_NODE
            }, Qn = function(A) {
                return cn(A) && void 0 !== A.style && !un(A)
            }, un = function(A) {
                return "object" == typeof A.className
            }, wn = function(A) {
                return "LI" === A.tagName
            }, Un = function(A) {
                return "OL" === A.tagName
            }, ln = function(A) {
                return "INPUT" === A.tagName
            }, Cn = function(A) {
                return "svg" === A.tagName
            }, gn = function(A) {
                return "BODY" === A.tagName
            }, En = function(A) {
                return "CANVAS" === A.tagName
            }, Fn = function(A) {
                return "IMG" === A.tagName
            }, hn = function(A) {
                return "IFRAME" === A.tagName
            }, Hn = function(A) {
                return "STYLE" === A.tagName
            }, dn = function(A) {
                return "SCRIPT" === A.tagName
            }, fn = function(A) {
                return "TEXTAREA" === A.tagName
            }, pn = function(A) {
                return "SELECT" === A.tagName
            }, Nn = function() {
                function A() {
                    this.counters = {}
                }
                return A.prototype.getCounterValue = function(A) {
                    var e = this.counters[A];
                    return e && e.length ? e[e.length - 1] : 1
                }
                ,
                A.prototype.getCounterValues = function(A) {
                    var e = this.counters[A];
                    return e || []
                }
                ,
                A.prototype.pop = function(A) {
                    var e = this;
                    A.forEach(function(A) {
                        return e.counters[A].pop()
                    })
                }
                ,
                A.prototype.parse = function(A) {
                    var e = this
                      , t = A.counterIncrement
                      , r = A.counterReset
                      , n = !0;
                    null !== t && t.forEach(function(A) {
                        var t = e.counters[A.counter];
                        t && 0 !== A.increment && (n = !1,
                        t[Math.max(0, t.length - 1)] += A.increment)
                    });
                    var B = [];
                    return n && r.forEach(function(A) {
                        var t = e.counters[A.counter];
                        B.push(A.counter),
                        t || (t = e.counters[A.counter] = []),
                        t.push(A.reset)
                    }),
                    B
                }
                ,
                A
            }(), Kn = {
                integers: [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
                values: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
            }, In = {
                integers: [9e3, 8e3, 7e3, 6e3, 5e3, 4e3, 3e3, 2e3, 1e3, 900, 800, 700, 600, 500, 400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
                values: ["Ք", "Փ", "Ւ", "Ց", "Ր", "Տ", "Վ", "Ս", "Ռ", "Ջ", "Պ", "Չ", "Ո", "Շ", "Ն", "Յ", "Մ", "Ճ", "Ղ", "Ձ", "Հ", "Կ", "Ծ", "Խ", "Լ", "Ի", "Ժ", "Թ", "Ը", "Է", "Զ", "Ե", "Դ", "Գ", "Բ", "Ա"]
            }, Tn = {
                integers: [1e4, 9e3, 8e3, 7e3, 6e3, 5e3, 4e3, 3e3, 2e3, 1e3, 400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 20, 19, 18, 17, 16, 15, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
                values: ["י׳", "ט׳", "ח׳", "ז׳", "ו׳", "ה׳", "ד׳", "ג׳", "ב׳", "א׳", "ת", "ש", "ר", "ק", "צ", "פ", "ע", "ס", "נ", "מ", "ל", "כ", "יט", "יח", "יז", "טז", "טו", "י", "ט", "ח", "ז", "ו", "ה", "ד", "ג", "ב", "א"]
            }, mn = {
                integers: [1e4, 9e3, 8e3, 7e3, 6e3, 5e3, 4e3, 3e3, 2e3, 1e3, 900, 800, 700, 600, 500, 400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
                values: ["ჵ", "ჰ", "ჯ", "ჴ", "ხ", "ჭ", "წ", "ძ", "ც", "ჩ", "შ", "ყ", "ღ", "ქ", "ფ", "ჳ", "ტ", "ს", "რ", "ჟ", "პ", "ო", "ჲ", "ნ", "მ", "ლ", "კ", "ი", "თ", "ჱ", "ზ", "ვ", "ე", "დ", "გ", "ბ", "ა"]
            }, Rn = function(A, e, t, r, n, B) {
                return A < e || A > t ? bn(A, n, B.length > 0) : r.integers.reduce(function(e, t, n) {
                    for (; A >= t; )
                        A -= t,
                        e += r.values[n];
                    return e
                }, "") + B
            }, Ln = function(A, e, t, r) {
                var n = "";
                do {
                    t || A--,
                    n = r(A) + n,
                    A /= e
                } while (A * e >= e);
                return n
            }, On = function(A, e, t, r, n) {
                var B = t - e + 1;
                return (A < 0 ? "-" : "") + (Ln(Math.abs(A), B, r, function(A) {
                    return i(Math.floor(A % B) + e)
                }) + n)
            }, vn = function(A, e, t) {
                void 0 === t && (t = ". ");
                var r = e.length;
                return Ln(Math.abs(A), r, !1, function(A) {
                    return e[Math.floor(A % r)]
                }) + t
            }, Dn = function(A, e, t, r, n, B) {
                if (A < -9999 || A > 9999)
                    return bn(A, It.CJK_DECIMAL, n.length > 0);
                var s = Math.abs(A)
                  , o = n;
                if (0 === s)
                    return e[0] + o;
                for (var i = 0; s > 0 && i <= 4; i++) {
                    var a = s % 10;
                    0 === a && gr(B, 1) && "" !== o ? o = e[a] + o : a > 1 || 1 === a && 0 === i || 1 === a && 1 === i && gr(B, 2) || 1 === a && 1 === i && gr(B, 4) && A > 100 || 1 === a && i > 1 && gr(B, 8) ? o = e[a] + (i > 0 ? t[i - 1] : "") + o : 1 === a && i > 0 && (o = t[i - 1] + o),
                    s = Math.floor(s / 10)
                }
                return (A < 0 ? r : "") + o
            }, bn = function(A, e, t) {
                var r = t ? ". " : ""
                  , n = t ? "、" : ""
                  , B = t ? ", " : ""
                  , s = t ? " " : "";
                switch (e) {
                case It.DISC:
                    return "•" + s;
                case It.CIRCLE:
                    return "◦" + s;
                case It.SQUARE:
                    return "◾" + s;
                case It.DECIMAL_LEADING_ZERO:
                    var o = On(A, 48, 57, !0, r);
                    return o.length < 4 ? "0" + o : o;
                case It.CJK_DECIMAL:
                    return vn(A, "〇一二三四五六七八九", n);
                case It.LOWER_ROMAN:
                    return Rn(A, 1, 3999, Kn, It.DECIMAL, r).toLowerCase();
                case It.UPPER_ROMAN:
                    return Rn(A, 1, 3999, Kn, It.DECIMAL, r);
                case It.LOWER_GREEK:
                    return On(A, 945, 969, !1, r);
                case It.LOWER_ALPHA:
                    return On(A, 97, 122, !1, r);
                case It.UPPER_ALPHA:
                    return On(A, 65, 90, !1, r);
                case It.ARABIC_INDIC:
                    return On(A, 1632, 1641, !0, r);
                case It.ARMENIAN:
                case It.UPPER_ARMENIAN:
                    return Rn(A, 1, 9999, In, It.DECIMAL, r);
                case It.LOWER_ARMENIAN:
                    return Rn(A, 1, 9999, In, It.DECIMAL, r).toLowerCase();
                case It.BENGALI:
                    return On(A, 2534, 2543, !0, r);
                case It.CAMBODIAN:
                case It.KHMER:
                    return On(A, 6112, 6121, !0, r);
                case It.CJK_EARTHLY_BRANCH:
                    return vn(A, "子丑寅卯辰巳午未申酉戌亥", n);
                case It.CJK_HEAVENLY_STEM:
                    return vn(A, "甲乙丙丁戊己庚辛壬癸", n);
                case It.CJK_IDEOGRAPHIC:
                case It.TRAD_CHINESE_INFORMAL:
                    return Dn(A, "零一二三四五六七八九", "十百千萬", "負", n, 14);
                case It.TRAD_CHINESE_FORMAL:
                    return Dn(A, "零壹貳參肆伍陸柒捌玖", "拾佰仟萬", "負", n, 15);
                case It.SIMP_CHINESE_INFORMAL:
                    return Dn(A, "零一二三四五六七八九", "十百千萬", "负", n, 14);
                case It.SIMP_CHINESE_FORMAL:
                    return Dn(A, "零壹贰叁肆伍陆柒捌玖", "拾佰仟萬", "负", n, 15);
                case It.JAPANESE_INFORMAL:
                    return Dn(A, "〇一二三四五六七八九", "十百千万", "マイナス", n, 0);
                case It.JAPANESE_FORMAL:
                    return Dn(A, "零壱弐参四伍六七八九", "拾百千万", "マイナス", n, 7);
                case It.KOREAN_HANGUL_FORMAL:
                    return Dn(A, "영일이삼사오육칠팔구", "십백천만", "마이너스", B, 7);
                case It.KOREAN_HANJA_INFORMAL:
                    return Dn(A, "零一二三四五六七八九", "十百千萬", "마이너스", B, 0);
                case It.KOREAN_HANJA_FORMAL:
                    return Dn(A, "零壹貳參四五六七八九", "拾百千", "마이너스", B, 7);
                case It.DEVANAGARI:
                    return On(A, 2406, 2415, !0, r);
                case It.GEORGIAN:
                    return Rn(A, 1, 19999, mn, It.DECIMAL, r);
                case It.GUJARATI:
                    return On(A, 2790, 2799, !0, r);
                case It.GURMUKHI:
                    return On(A, 2662, 2671, !0, r);
                case It.HEBREW:
                    return Rn(A, 1, 10999, Tn, It.DECIMAL, r);
                case It.HIRAGANA:
                    return vn(A, "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");
                case It.HIRAGANA_IROHA:
                    return vn(A, "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");
                case It.KANNADA:
                    return On(A, 3302, 3311, !0, r);
                case It.KATAKANA:
                    return vn(A, "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン", n);
                case It.KATAKANA_IROHA:
                    return vn(A, "イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス", n);
                case It.LAO:
                    return On(A, 3792, 3801, !0, r);
                case It.MONGOLIAN:
                    return On(A, 6160, 6169, !0, r);
                case It.MYANMAR:
                    return On(A, 4160, 4169, !0, r);
                case It.ORIYA:
                    return On(A, 2918, 2927, !0, r);
                case It.PERSIAN:
                    return On(A, 1776, 1785, !0, r);
                case It.TAMIL:
                    return On(A, 3046, 3055, !0, r);
                case It.TELUGU:
                    return On(A, 3174, 3183, !0, r);
                case It.THAI:
                    return On(A, 3664, 3673, !0, r);
                case It.TIBETAN:
                    return On(A, 3872, 3881, !0, r);
                case It.DECIMAL:
                default:
                    return On(A, 48, 57, !0, r)
                }
            }, Sn = function() {
                function A(A, e) {
                    if (this.options = e,
                    this.scrolledElements = [],
                    this.referenceElement = A,
                    this.counters = new Nn,
                    this.quoteDepth = 0,
                    !A.ownerDocument)
                        throw new Error("Cloned element does not have an owner document");
                    this.documentElement = this.cloneNode(A.ownerDocument.documentElement)
                }
                return A.prototype.toIFrame = function(A, e) {
                    var t = this
                      , B = yn(A, e);
                    if (!B.contentWindow)
                        return Promise.reject("Unable to find iframe window");
                    var s = A.defaultView.pageXOffset
                      , o = A.defaultView.pageYOffset
                      , i = B.contentWindow
                      , a = i.document
                      , c = _n(B).then(function() {
                        return r(t, void 0, void 0, function() {
                            var A;
                            return n(this, function(t) {
                                switch (t.label) {
                                case 0:
                                    return this.scrolledElements.forEach(zn),
                                    i && (i.scrollTo(e.left, e.top),
                                    !/(iPad|iPhone|iPod)/g.test(navigator.userAgent) || i.scrollY === e.top && i.scrollX === e.left || (a.documentElement.style.top = -e.top + "px",
                                    a.documentElement.style.left = -e.left + "px",
                                    a.documentElement.style.position = "absolute")),
                                    A = this.options.onclone,
                                    void 0 === this.clonedReferenceElement ? [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")] : a.fonts && a.fonts.ready ? [4, a.fonts.ready] : [3, 2];
                                case 1:
                                    t.sent(),
                                    t.label = 2;
                                case 2:
                                    return "function" == typeof A ? [2, Promise.resolve().then(function() {
                                        return A(a)
                                    }).then(function() {
                                        return B
                                    })] : [2, B]
                                }
                            })
                        })
                    });
                    return a.open(),
                    a.write(xn(document.doctype) + "<html></html>"),
                    Vn(this.referenceElement.ownerDocument, s, o),
                    a.replaceChild(a.adoptNode(this.documentElement), a.documentElement),
                    a.close(),
                    c
                }
                ,
                A.prototype.createElementClone = function(A) {
                    if (En(A))
                        return this.createCanvasClone(A);
                    if (Hn(A))
                        return this.createStyleClone(A);
                    var e = A.cloneNode(!1);
                    return Fn(e) && "lazy" === e.loading && (e.loading = "eager"),
                    e
                }
                ,
                A.prototype.createStyleClone = function(A) {
                    try {
                        var e = A.sheet;
                        if (e && e.cssRules) {
                            var t = [].slice.call(e.cssRules, 0).reduce(function(A, e) {
                                return e && "string" == typeof e.cssText ? A + e.cssText : A
                            }, "")
                              , r = A.cloneNode(!1);
                            return r.textContent = t,
                            r
                        }
                    } catch (A) {
                        if (pe.getInstance(this.options.id).error("Unable to access cssRules property", A),
                        "SecurityError" !== A.name)
                            throw A
                    }
                    return A.cloneNode(!1)
                }
                ,
                A.prototype.createCanvasClone = function(A) {
                    if (this.options.inlineImages && A.ownerDocument) {
                        var e = A.ownerDocument.createElement("img");
                        try {
                            return e.src = A.toDataURL(),
                            e
                        } catch (A) {
                            pe.getInstance(this.options.id).info("Unable to clone canvas contents, canvas is tainted")
                        }
                    }
                    var t = A.cloneNode(!1);
                    try {
                        t.width = A.width,
                        t.height = A.height;
                        var r = A.getContext("2d")
                          , n = t.getContext("2d");
                        return n && (r ? n.putImageData(r.getImageData(0, 0, A.width, A.height), 0, 0) : n.drawImage(A, 0, 0)),
                        t
                    } catch (A) {}
                    return t
                }
                ,
                A.prototype.cloneNode = function(A) {
                    if (an(A))
                        return document.createTextNode(A.data);
                    if (!A.ownerDocument)
                        return A.cloneNode(!1);
                    var e = A.ownerDocument.defaultView;
                    if (e && cn(A) && (Qn(A) || un(A))) {
                        var t = this.createElementClone(A)
                          , r = e.getComputedStyle(A)
                          , n = e.getComputedStyle(A, ":before")
                          , B = e.getComputedStyle(A, ":after");
                        this.referenceElement === A && Qn(t) && (this.clonedReferenceElement = t),
                        gn(t) && Gn(t);
                        for (var s = this.counters.parse(new Kr(r)), o = this.resolvePseudoContent(A, t, n, lr.BEFORE), i = A.firstChild; i; i = i.nextSibling)
                            cn(i) && (dn(i) || i.hasAttribute("data-html2canvas-ignore") || "function" == typeof this.options.ignoreElements && this.options.ignoreElements(i)) || this.options.copyStyles && cn(i) && Hn(i) || t.appendChild(this.cloneNode(i));
                        o && t.insertBefore(o, t.firstChild);
                        var a = this.resolvePseudoContent(A, t, B, lr.AFTER);
                        return a && t.appendChild(a),
                        this.counters.pop(s),
                        r && (this.options.copyStyles || un(A)) && !hn(A) && Pn(r, t),
                        0 === A.scrollTop && 0 === A.scrollLeft || this.scrolledElements.push([t, A.scrollLeft, A.scrollTop]),
                        (fn(A) || pn(A)) && (fn(t) || pn(t)) && (t.value = A.value),
                        t
                    }
                    return A.cloneNode(!1)
                }
                ,
                A.prototype.resolvePseudoContent = function(A, e, t, r) {
                    var n = this;
                    if (t) {
                        var B = t.content
                          , s = e.ownerDocument;
                        if (s && B && "none" !== B && "-moz-alt-content" !== B && "none" !== t.display) {
                            this.counters.parse(new Kr(t));
                            var o = new Nr(t)
                              , i = s.createElement("html2canvaspseudoelement");
                            Pn(t, i),
                            o.content.forEach(function(e) {
                                if (e.type === u.STRING_TOKEN)
                                    i.appendChild(s.createTextNode(e.value));
                                else if (e.type === u.URL_TOKEN) {
                                    var t = s.createElement("img");
                                    t.src = e.value,
                                    t.style.opacity = "1",
                                    i.appendChild(t)
                                } else if (e.type === u.FUNCTION) {
                                    if ("attr" === e.name) {
                                        var r = e.values.filter(DA);
                                        r.length && i.appendChild(s.createTextNode(A.getAttribute(r[0].value) || ""))
                                    } else if ("counter" === e.name) {
                                        var B = e.values.filter(yA)
                                          , a = B[0]
                                          , c = B[1];
                                        if (a && DA(a)) {
                                            var Q = n.counters.getCounterValue(a.value)
                                              , w = c && DA(c) ? Rt.parse(c.value) : It.DECIMAL;
                                            i.appendChild(s.createTextNode(bn(Q, w, !1)))
                                        }
                                    } else if ("counters" === e.name) {
                                        var U = e.values.filter(yA)
                                          , l = (a = U[0],
                                        U[1]);
                                        c = U[2];
                                        if (a && DA(a)) {
                                            var C = n.counters.getCounterValues(a.value)
                                              , g = c && DA(c) ? Rt.parse(c.value) : It.DECIMAL
                                              , E = l && l.type === u.STRING_TOKEN ? l.value : ""
                                              , F = C.map(function(A) {
                                                return bn(A, g, !1)
                                            }).join(E);
                                            i.appendChild(s.createTextNode(F))
                                        }
                                    }
                                } else if (e.type === u.IDENT_TOKEN)
                                    switch (e.value) {
                                    case "open-quote":
                                        i.appendChild(s.createTextNode(dr(o.quotes, n.quoteDepth++, !0)));
                                        break;
                                    case "close-quote":
                                        i.appendChild(s.createTextNode(dr(o.quotes, --n.quoteDepth, !1)));
                                        break;
                                    default:
                                        i.appendChild(s.createTextNode(e.value))
                                    }
                            }),
                            i.className = Xn + " " + Jn;
                            var a = r === lr.BEFORE ? " " + Xn : " " + Jn;
                            return un(e) ? e.className.baseValue += a : e.className += a,
                            i
                        }
                    }
                }
                ,
                A.destroy = function(A) {
                    return !!A.parentNode && (A.parentNode.removeChild(A),
                    !0)
                }
                ,
                A
            }();
            !function(A) {
                A[A.BEFORE = 0] = "BEFORE",
                A[A.AFTER = 1] = "AFTER"
            }(lr || (lr = {}));
            var Mn, yn = function(A, e) {
                var t = A.createElement("iframe");
                return t.className = "html2canvas-container",
                t.style.visibility = "hidden",
                t.style.position = "fixed",
                t.style.left = "-10000px",
                t.style.top = "0px",
                t.style.border = "0",
                t.width = e.width.toString(),
                t.height = e.height.toString(),
                t.scrolling = "no",
                t.setAttribute("data-html2canvas-ignore", "true"),
                A.body.appendChild(t),
                t
            }, _n = function(A) {
                return new Promise(function(e, t) {
                    var r = A.contentWindow;
                    if (!r)
                        return t("No window assigned for iframe");
                    var n = r.document;
                    r.onload = A.onload = n.onreadystatechange = function() {
                        r.onload = A.onload = n.onreadystatechange = null;
                        var t = setInterval(function() {
                            n.body.childNodes.length > 0 && "complete" === n.readyState && (clearInterval(t),
                            e(A))
                        }, 50)
                    }
                }
                )
            }, Pn = function(A, e) {
                for (var t = A.length - 1; t >= 0; t--) {
                    var r = A.item(t);
                    "content" !== r && e.style.setProperty(r, A.getPropertyValue(r))
                }
                return e
            }, xn = function(A) {
                var e = "";
                return A && (e += "<!DOCTYPE ",
                A.name && (e += A.name),
                A.internalSubset && (e += A.internalSubset),
                A.publicId && (e += '"' + A.publicId + '"'),
                A.systemId && (e += '"' + A.systemId + '"'),
                e += ">"),
                e
            }, Vn = function(A, e, t) {
                A && A.defaultView && (e !== A.defaultView.pageXOffset || t !== A.defaultView.pageYOffset) && A.defaultView.scrollTo(e, t)
            }, zn = function(A) {
                var e = A[0]
                  , t = A[1]
                  , r = A[2];
                e.scrollLeft = t,
                e.scrollTop = r
            }, Xn = "___html2canvas___pseudoelement_before", Jn = "___html2canvas___pseudoelement_after", Gn = function(A) {
                kn(A, "." + Xn + ':before{\n    content: "" !important;\n    display: none !important;\n}\n         .' + Jn + ':after{\n    content: "" !important;\n    display: none !important;\n}')
            }, kn = function(A, e) {
                var t = A.ownerDocument;
                if (t) {
                    var r = t.createElement("style");
                    r.textContent = e,
                    A.appendChild(r)
                }
            };
            !function(A) {
                A[A.VECTOR = 0] = "VECTOR",
                A[A.BEZIER_CURVE = 1] = "BEZIER_CURVE"
            }(Mn || (Mn = {}));
            var Wn, Yn = function(A, e) {
                return A.length === e.length && A.some(function(A, t) {
                    return A === e[t]
                })
            }, qn = function() {
                function A(A, e) {
                    this.type = Mn.VECTOR,
                    this.x = A,
                    this.y = e
                }
                return A.prototype.add = function(e, t) {
                    return new A(this.x + e,this.y + t)
                }
                ,
                A
            }(), Zn = function(A, e, t) {
                return new qn(A.x + (e.x - A.x) * t,A.y + (e.y - A.y) * t)
            }, jn = function() {
                function A(A, e, t, r) {
                    this.type = Mn.BEZIER_CURVE,
                    this.start = A,
                    this.startControl = e,
                    this.endControl = t,
                    this.end = r
                }
                return A.prototype.subdivide = function(e, t) {
                    var r = Zn(this.start, this.startControl, e)
                      , n = Zn(this.startControl, this.endControl, e)
                      , B = Zn(this.endControl, this.end, e)
                      , s = Zn(r, n, e)
                      , o = Zn(n, B, e)
                      , i = Zn(s, o, e);
                    return t ? new A(this.start,r,s,i) : new A(i,o,B,this.end)
                }
                ,
                A.prototype.add = function(e, t) {
                    return new A(this.start.add(e, t),this.startControl.add(e, t),this.endControl.add(e, t),this.end.add(e, t))
                }
                ,
                A.prototype.reverse = function() {
                    return new A(this.end,this.endControl,this.startControl,this.start)
                }
                ,
                A
            }(), $n = function(A) {
                return A.type === Mn.BEZIER_CURVE
            }, AB = function() {
                return function(A) {
                    var e = A.styles
                      , t = A.bounds
                      , r = kA(e.borderTopLeftRadius, t.width, t.height)
                      , n = r[0]
                      , B = r[1]
                      , s = kA(e.borderTopRightRadius, t.width, t.height)
                      , o = s[0]
                      , i = s[1]
                      , a = kA(e.borderBottomRightRadius, t.width, t.height)
                      , c = a[0]
                      , Q = a[1]
                      , u = kA(e.borderBottomLeftRadius, t.width, t.height)
                      , w = u[0]
                      , U = u[1]
                      , l = [];
                    l.push((n + o) / t.width),
                    l.push((w + c) / t.width),
                    l.push((B + U) / t.height),
                    l.push((i + Q) / t.height);
                    var C = Math.max.apply(Math, l);
                    C > 1 && (n /= C,
                    B /= C,
                    o /= C,
                    i /= C,
                    c /= C,
                    Q /= C,
                    w /= C,
                    U /= C);
                    var g = t.width - o
                      , E = t.height - Q
                      , F = t.width - c
                      , h = t.height - U
                      , H = e.borderTopWidth
                      , d = e.borderRightWidth
                      , f = e.borderBottomWidth
                      , p = e.borderLeftWidth
                      , N = WA(e.paddingTop, A.bounds.width)
                      , K = WA(e.paddingRight, A.bounds.width)
                      , I = WA(e.paddingBottom, A.bounds.width)
                      , T = WA(e.paddingLeft, A.bounds.width);
                    this.topLeftBorderBox = n > 0 || B > 0 ? eB(t.left, t.top, n, B, Wn.TOP_LEFT) : new qn(t.left,t.top),
                    this.topRightBorderBox = o > 0 || i > 0 ? eB(t.left + g, t.top, o, i, Wn.TOP_RIGHT) : new qn(t.left + t.width,t.top),
                    this.bottomRightBorderBox = c > 0 || Q > 0 ? eB(t.left + F, t.top + E, c, Q, Wn.BOTTOM_RIGHT) : new qn(t.left + t.width,t.top + t.height),
                    this.bottomLeftBorderBox = w > 0 || U > 0 ? eB(t.left, t.top + h, w, U, Wn.BOTTOM_LEFT) : new qn(t.left,t.top + t.height),
                    this.topLeftPaddingBox = n > 0 || B > 0 ? eB(t.left + p, t.top + H, Math.max(0, n - p), Math.max(0, B - H), Wn.TOP_LEFT) : new qn(t.left + p,t.top + H),
                    this.topRightPaddingBox = o > 0 || i > 0 ? eB(t.left + Math.min(g, t.width + p), t.top + H, g > t.width + p ? 0 : o - p, i - H, Wn.TOP_RIGHT) : new qn(t.left + t.width - d,t.top + H),
                    this.bottomRightPaddingBox = c > 0 || Q > 0 ? eB(t.left + Math.min(F, t.width - p), t.top + Math.min(E, t.height + H), Math.max(0, c - d), Q - f, Wn.BOTTOM_RIGHT) : new qn(t.left + t.width - d,t.top + t.height - f),
                    this.bottomLeftPaddingBox = w > 0 || U > 0 ? eB(t.left + p, t.top + h, Math.max(0, w - p), U - f, Wn.BOTTOM_LEFT) : new qn(t.left + p,t.top + t.height - f),
                    this.topLeftContentBox = n > 0 || B > 0 ? eB(t.left + p + T, t.top + H + N, Math.max(0, n - (p + T)), Math.max(0, B - (H + N)), Wn.TOP_LEFT) : new qn(t.left + p + T,t.top + H + N),
                    this.topRightContentBox = o > 0 || i > 0 ? eB(t.left + Math.min(g, t.width + p + T), t.top + H + N, g > t.width + p + T ? 0 : o - p + T, i - (H + N), Wn.TOP_RIGHT) : new qn(t.left + t.width - (d + K),t.top + H + N),
                    this.bottomRightContentBox = c > 0 || Q > 0 ? eB(t.left + Math.min(F, t.width - (p + T)), t.top + Math.min(E, t.height + H + N), Math.max(0, c - (d + K)), Q - (f + I), Wn.BOTTOM_RIGHT) : new qn(t.left + t.width - (d + K),t.top + t.height - (f + I)),
                    this.bottomLeftContentBox = w > 0 || U > 0 ? eB(t.left + p + T, t.top + h, Math.max(0, w - (p + T)), U - (f + I), Wn.BOTTOM_LEFT) : new qn(t.left + p + T,t.top + t.height - (f + I))
                }
            }();
            !function(A) {
                A[A.TOP_LEFT = 0] = "TOP_LEFT",
                A[A.TOP_RIGHT = 1] = "TOP_RIGHT",
                A[A.BOTTOM_RIGHT = 2] = "BOTTOM_RIGHT",
                A[A.BOTTOM_LEFT = 3] = "BOTTOM_LEFT"
            }(Wn || (Wn = {}));
            var eB = function(A, e, t, r, n) {
                var B = (Math.sqrt(2) - 1) / 3 * 4
                  , s = t * B
                  , o = r * B
                  , i = A + t
                  , a = e + r;
                switch (n) {
                case Wn.TOP_LEFT:
                    return new jn(new qn(A,a),new qn(A,a - o),new qn(i - s,e),new qn(i,e));
                case Wn.TOP_RIGHT:
                    return new jn(new qn(A,e),new qn(A + s,e),new qn(i,a - o),new qn(i,a));
                case Wn.BOTTOM_RIGHT:
                    return new jn(new qn(i,e),new qn(i,e + o),new qn(A + s,a),new qn(A,a));
                case Wn.BOTTOM_LEFT:
                default:
                    return new jn(new qn(i,a),new qn(i - s,a),new qn(A,e + o),new qn(A,e))
                }
            }
              , tB = function(A) {
                return [A.topLeftBorderBox, A.topRightBorderBox, A.bottomRightBorderBox, A.bottomLeftBorderBox]
            }
              , rB = function(A) {
                return [A.topLeftPaddingBox, A.topRightPaddingBox, A.bottomRightPaddingBox, A.bottomLeftPaddingBox]
            }
              , nB = function() {
                return function(A, e, t) {
                    this.type = 0,
                    this.offsetX = A,
                    this.offsetY = e,
                    this.matrix = t,
                    this.target = 6
                }
            }()
              , BB = function() {
                return function(A, e) {
                    this.type = 1,
                    this.target = e,
                    this.path = A
                }
            }()
              , sB = function() {
                return function(A) {
                    this.element = A,
                    this.inlineLevel = [],
                    this.nonInlineLevel = [],
                    this.negativeZIndex = [],
                    this.zeroOrAutoZIndexOrTransformedOrOpacity = [],
                    this.positiveZIndex = [],
                    this.nonPositionedFloats = [],
                    this.nonPositionedInlineLevel = []
                }
            }()
              , oB = function() {
                function A(A, e) {
                    if (this.container = A,
                    this.effects = e.slice(0),
                    this.curves = new AB(A),
                    null !== A.styles.transform) {
                        var t = A.bounds.left + A.styles.transformOrigin[0].number
                          , r = A.bounds.top + A.styles.transformOrigin[1].number
                          , n = A.styles.transform;
                        this.effects.push(new nB(t,r,n))
                    }
                    if (A.styles.overflowX !== mt.VISIBLE) {
                        var B = tB(this.curves)
                          , s = rB(this.curves);
                        Yn(B, s) ? this.effects.push(new BB(B,6)) : (this.effects.push(new BB(B,2)),
                        this.effects.push(new BB(s,4)))
                    }
                }
                return A.prototype.getParentEffects = function() {
                    var A = this.effects.slice(0);
                    if (this.container.styles.overflowX !== mt.VISIBLE) {
                        var e = tB(this.curves)
                          , t = rB(this.curves);
                        Yn(e, t) || A.push(new BB(t,6))
                    }
                    return A
                }
                ,
                A
            }()
              , iB = function(A, e, t, r) {
                A.container.elements.forEach(function(n) {
                    var B = gr(n.flags, 4)
                      , s = gr(n.flags, 2)
                      , o = new oB(n,A.getParentEffects());
                    gr(n.styles.display, 2048) && r.push(o);
                    var i = gr(n.flags, 8) ? [] : r;
                    if (B || s) {
                        var a = B || n.styles.isPositioned() ? t : e
                          , c = new sB(o);
                        if (n.styles.isPositioned() || n.styles.opacity < 1 || n.styles.isTransformed()) {
                            var Q = n.styles.zIndex.order;
                            if (Q < 0) {
                                var u = 0;
                                a.negativeZIndex.some(function(A, e) {
                                    return Q > A.element.container.styles.zIndex.order ? (u = e,
                                    !1) : u > 0
                                }),
                                a.negativeZIndex.splice(u, 0, c)
                            } else if (Q > 0) {
                                var w = 0;
                                a.positiveZIndex.some(function(A, e) {
                                    return Q >= A.element.container.styles.zIndex.order ? (w = e + 1,
                                    !1) : w > 0
                                }),
                                a.positiveZIndex.splice(w, 0, c)
                            } else
                                a.zeroOrAutoZIndexOrTransformedOrOpacity.push(c)
                        } else
                            n.styles.isFloating() ? a.nonPositionedFloats.push(c) : a.nonPositionedInlineLevel.push(c);
                        iB(o, c, B ? c : t, i)
                    } else
                        n.styles.isInlineLevel() ? e.inlineLevel.push(o) : e.nonInlineLevel.push(o),
                        iB(o, e, t, i);
                    gr(n.flags, 8) && aB(n, i)
                })
            }
              , aB = function(A, e) {
                for (var t = A instanceof zr ? A.start : 1, r = A instanceof zr && A.reversed, n = 0; n < e.length; n++) {
                    var B = e[n];
                    B.container instanceof Vr && "number" == typeof B.container.value && 0 !== B.container.value && (t = B.container.value),
                    B.listValue = bn(t, B.container.styles.listStyleType, !0),
                    t += r ? -1 : 1
                }
            }
              , cB = function(A, e, t, r) {
                var n = [];
                return $n(A) ? n.push(A.subdivide(.5, !1)) : n.push(A),
                $n(t) ? n.push(t.subdivide(.5, !0)) : n.push(t),
                $n(r) ? n.push(r.subdivide(.5, !0).reverse()) : n.push(r),
                $n(e) ? n.push(e.subdivide(.5, !1).reverse()) : n.push(e),
                n
            }
              , QB = function(A) {
                var e = A.bounds
                  , t = A.styles;
                return e.add(t.borderLeftWidth, t.borderTopWidth, -(t.borderRightWidth + t.borderLeftWidth), -(t.borderTopWidth + t.borderBottomWidth))
            }
              , uB = function(A) {
                var e = A.styles
                  , t = A.bounds
                  , r = WA(e.paddingLeft, t.width)
                  , n = WA(e.paddingRight, t.width)
                  , B = WA(e.paddingTop, t.width)
                  , s = WA(e.paddingBottom, t.width);
                return t.add(r + e.borderLeftWidth, B + e.borderTopWidth, -(e.borderRightWidth + e.borderLeftWidth + r + n), -(e.borderTopWidth + e.borderBottomWidth + B + s))
            }
              , wB = function(A, e, t) {
                var r, n, B = (r = gB(A.styles.backgroundOrigin, e),
                n = A,
                0 === r ? n.bounds : 2 === r ? uB(n) : QB(n)), s = function(A, e) {
                    return A === oe.BORDER_BOX ? e.bounds : A === oe.CONTENT_BOX ? uB(e) : QB(e)
                }(gB(A.styles.backgroundClip, e), A), o = CB(gB(A.styles.backgroundSize, e), t, B), i = o[0], a = o[1], c = kA(gB(A.styles.backgroundPosition, e), B.width - i, B.height - a);
                return [EB(gB(A.styles.backgroundRepeat, e), c, o, B, s), Math.round(B.left + c[0]), Math.round(B.top + c[1]), i, a]
            }
              , UB = function(A) {
                return DA(A) && A.value === Xe.AUTO
            }
              , lB = function(A) {
                return "number" == typeof A
            }
              , CB = function(A, e, t) {
                var r = e[0]
                  , n = e[1]
                  , B = e[2]
                  , s = A[0]
                  , o = A[1];
                if (VA(s) && o && VA(o))
                    return [WA(s, t.width), WA(o, t.height)];
                var i = lB(B);
                if (DA(s) && (s.value === Xe.CONTAIN || s.value === Xe.COVER))
                    return lB(B) ? t.width / t.height < B != (s.value === Xe.COVER) ? [t.width, t.width / B] : [t.height * B, t.height] : [t.width, t.height];
                var a = lB(r)
                  , c = lB(n)
                  , Q = a || c;
                if (UB(s) && (!o || UB(o)))
                    return a && c ? [r, n] : i || Q ? Q && i ? [a ? r : n * B, c ? n : r / B] : [a ? r : t.width, c ? n : t.height] : [t.width, t.height];
                if (i) {
                    var u = 0
                      , w = 0;
                    return VA(s) ? u = WA(s, t.width) : VA(o) && (w = WA(o, t.height)),
                    UB(s) ? u = w * B : o && !UB(o) || (w = u / B),
                    [u, w]
                }
                var U = null
                  , l = null;
                if (VA(s) ? U = WA(s, t.width) : o && VA(o) && (l = WA(o, t.height)),
                null === U || o && !UB(o) || (l = a && c ? U / r * n : t.height),
                null !== l && UB(s) && (U = a && c ? l / n * r : t.width),
                null !== U && null !== l)
                    return [U, l];
                throw new Error("Unable to calculate background-size for element")
            }
              , gB = function(A, e) {
                var t = A[e];
                return void 0 === t ? A[0] : t
            }
              , EB = function(A, e, t, r, n) {
                var B = e[0]
                  , s = e[1]
                  , o = t[0]
                  , i = t[1];
                switch (A) {
                case _e.REPEAT_X:
                    return [new qn(Math.round(r.left),Math.round(r.top + s)), new qn(Math.round(r.left + r.width),Math.round(r.top + s)), new qn(Math.round(r.left + r.width),Math.round(i + r.top + s)), new qn(Math.round(r.left),Math.round(i + r.top + s))];
                case _e.REPEAT_Y:
                    return [new qn(Math.round(r.left + B),Math.round(r.top)), new qn(Math.round(r.left + B + o),Math.round(r.top)), new qn(Math.round(r.left + B + o),Math.round(r.height + r.top)), new qn(Math.round(r.left + B),Math.round(r.height + r.top))];
                case _e.NO_REPEAT:
                    return [new qn(Math.round(r.left + B),Math.round(r.top + s)), new qn(Math.round(r.left + B + o),Math.round(r.top + s)), new qn(Math.round(r.left + B + o),Math.round(r.top + s + i)), new qn(Math.round(r.left + B),Math.round(r.top + s + i))];
                default:
                    return [new qn(Math.round(n.left),Math.round(n.top)), new qn(Math.round(n.left + n.width),Math.round(n.top)), new qn(Math.round(n.left + n.width),Math.round(n.height + n.top)), new qn(Math.round(n.left),Math.round(n.height + n.top))]
                }
            }
              , FB = function() {
                function A(A) {
                    this._data = {},
                    this._document = A
                }
                return A.prototype.parseMetrics = function(A, e) {
                    var t = this._document.createElement("div")
                      , r = this._document.createElement("img")
                      , n = this._document.createElement("span")
                      , B = this._document.body;
                    t.style.visibility = "hidden",
                    t.style.fontFamily = A,
                    t.style.fontSize = e,
                    t.style.margin = "0",
                    t.style.padding = "0",
                    B.appendChild(t),
                    r.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                    r.width = 1,
                    r.height = 1,
                    r.style.margin = "0",
                    r.style.padding = "0",
                    r.style.verticalAlign = "baseline",
                    n.style.fontFamily = A,
                    n.style.fontSize = e,
                    n.style.margin = "0",
                    n.style.padding = "0",
                    n.appendChild(this._document.createTextNode("Hidden Text")),
                    t.appendChild(n),
                    t.appendChild(r);
                    var s = r.offsetTop - n.offsetTop + 2;
                    t.removeChild(n),
                    t.appendChild(this._document.createTextNode("Hidden Text")),
                    t.style.lineHeight = "normal",
                    r.style.verticalAlign = "super";
                    var o = r.offsetTop - t.offsetTop + 2;
                    return B.removeChild(t),
                    {
                        baseline: s,
                        middle: o
                    }
                }
                ,
                A.prototype.getMetrics = function(A, e) {
                    var t = A + " " + e;
                    return void 0 === this._data[t] && (this._data[t] = this.parseMetrics(A, e)),
                    this._data[t]
                }
                ,
                A
            }()
              , hB = function() {
                function A(A) {
                    this._activeEffects = [],
                    this.canvas = A.canvas ? A.canvas : document.createElement("canvas"),
                    this.ctx = this.canvas.getContext("2d"),
                    this.options = A,
                    A.canvas || (this.canvas.width = Math.floor(A.width * A.scale),
                    this.canvas.height = Math.floor(A.height * A.scale),
                    this.canvas.style.width = A.width + "px",
                    this.canvas.style.height = A.height + "px"),
                    this.fontMetrics = new FB(document),
                    this.ctx.scale(this.options.scale, this.options.scale),
                    this.ctx.translate(-A.x + A.scrollX, -A.y + A.scrollY),
                    this.ctx.textBaseline = "bottom",
                    this._activeEffects = [],
                    pe.getInstance(A.id).debug("Canvas renderer initialized (" + A.width + "x" + A.height + " at " + A.x + "," + A.y + ") with scale " + A.scale)
                }
                return A.prototype.applyEffects = function(A, e) {
                    for (var t = this; this._activeEffects.length; )
                        this.popEffect();
                    A.filter(function(A) {
                        return gr(A.target, e)
                    }).forEach(function(A) {
                        return t.applyEffect(A)
                    })
                }
                ,
                A.prototype.applyEffect = function(A) {
                    this.ctx.save(),
                    function(A) {
                        return 0 === A.type
                    }(A) && (this.ctx.translate(A.offsetX, A.offsetY),
                    this.ctx.transform(A.matrix[0], A.matrix[1], A.matrix[2], A.matrix[3], A.matrix[4], A.matrix[5]),
                    this.ctx.translate(-A.offsetX, -A.offsetY)),
                    function(A) {
                        return 1 === A.type
                    }(A) && (this.path(A.path),
                    this.ctx.clip()),
                    this._activeEffects.push(A)
                }
                ,
                A.prototype.popEffect = function() {
                    this._activeEffects.pop(),
                    this.ctx.restore()
                }
                ,
                A.prototype.renderStack = function(A) {
                    return r(this, void 0, void 0, function() {
                        var e;
                        return n(this, function(t) {
                            switch (t.label) {
                            case 0:
                                return (e = A.element.container.styles).isVisible() ? (this.ctx.globalAlpha = e.opacity,
                                [4, this.renderStackContent(A)]) : [3, 2];
                            case 1:
                                t.sent(),
                                t.label = 2;
                            case 2:
                                return [2]
                            }
                        })
                    })
                }
                ,
                A.prototype.renderNode = function(A) {
                    return r(this, void 0, void 0, function() {
                        return n(this, function(e) {
                            switch (e.label) {
                            case 0:
                                return A.container.styles.isVisible() ? [4, this.renderNodeBackgroundAndBorders(A)] : [3, 3];
                            case 1:
                                return e.sent(),
                                [4, this.renderNodeContent(A)];
                            case 2:
                                e.sent(),
                                e.label = 3;
                            case 3:
                                return [2]
                            }
                        })
                    })
                }
                ,
                A.prototype.renderTextWithLetterSpacing = function(A, e) {
                    var t = this;
                    0 === e ? this.ctx.fillText(A.text, A.bounds.left, A.bounds.top + A.bounds.height) : o(A.text).map(function(A) {
                        return i(A)
                    }).reduce(function(e, r) {
                        return t.ctx.fillText(r, e, A.bounds.top + A.bounds.height),
                        e + t.ctx.measureText(r).width
                    }, A.bounds.left)
                }
                ,
                A.prototype.createFontStyle = function(A) {
                    var e = A.fontVariant.filter(function(A) {
                        return "normal" === A || "small-caps" === A
                    }).join("")
                      , t = A.fontFamily.join(", ")
                      , r = OA(A.fontSize) ? "" + A.fontSize.number + A.fontSize.unit : A.fontSize.number + "px";
                    return [[A.fontStyle, e, A.fontWeight, r, t].join(" "), t, r]
                }
                ,
                A.prototype.renderTextNode = function(A, e) {
                    return r(this, void 0, void 0, function() {
                        var t, r, B, s, o = this;
                        return n(this, function(n) {
                            return t = this.createFontStyle(e),
                            r = t[0],
                            B = t[1],
                            s = t[2],
                            this.ctx.font = r,
                            A.textBounds.forEach(function(A) {
                                o.ctx.fillStyle = ee(e.color),
                                o.renderTextWithLetterSpacing(A, e.letterSpacing);
                                var t = e.textShadow;
                                t.length && A.text.trim().length && (t.slice(0).reverse().forEach(function(e) {
                                    o.ctx.shadowColor = ee(e.color),
                                    o.ctx.shadowOffsetX = e.offsetX.number * o.options.scale,
                                    o.ctx.shadowOffsetY = e.offsetY.number * o.options.scale,
                                    o.ctx.shadowBlur = e.blur.number,
                                    o.ctx.fillText(A.text, A.bounds.left, A.bounds.top + A.bounds.height)
                                }),
                                o.ctx.shadowColor = "",
                                o.ctx.shadowOffsetX = 0,
                                o.ctx.shadowOffsetY = 0,
                                o.ctx.shadowBlur = 0),
                                e.textDecorationLine.length && (o.ctx.fillStyle = ee(e.textDecorationColor || e.color),
                                e.textDecorationLine.forEach(function(e) {
                                    switch (e) {
                                    case 1:
                                        var t = o.fontMetrics.getMetrics(B, s).baseline;
                                        o.ctx.fillRect(A.bounds.left, Math.round(A.bounds.top + t), A.bounds.width, 1);
                                        break;
                                    case 2:
                                        o.ctx.fillRect(A.bounds.left, Math.round(A.bounds.top), A.bounds.width, 1);
                                        break;
                                    case 3:
                                        var r = o.fontMetrics.getMetrics(B, s).middle;
                                        o.ctx.fillRect(A.bounds.left, Math.ceil(A.bounds.top + r), A.bounds.width, 1)
                                    }
                                }))
                            }),
                            [2]
                        })
                    })
                }
                ,
                A.prototype.renderReplacedElement = function(A, e, t) {
                    if (t && A.intrinsicWidth > 0 && A.intrinsicHeight > 0) {
                        var r = uB(A)
                          , n = rB(e);
                        this.path(n),
                        this.ctx.save(),
                        this.ctx.clip(),
                        this.ctx.drawImage(t, 0, 0, A.intrinsicWidth, A.intrinsicHeight, r.left, r.top, r.width, r.height),
                        this.ctx.restore()
                    }
                }
                ,
                A.prototype.renderNodeContent = function(e) {
                    return r(this, void 0, void 0, function() {
                        var t, r, s, o, i, a, c, Q, w, U, l, C, g, E;
                        return n(this, function(n) {
                            switch (n.label) {
                            case 0:
                                this.applyEffects(e.effects, 4),
                                t = e.container,
                                r = e.curves,
                                s = t.styles,
                                o = 0,
                                i = t.textNodes,
                                n.label = 1;
                            case 1:
                                return o < i.length ? (a = i[o],
                                [4, this.renderTextNode(a, s)]) : [3, 4];
                            case 2:
                                n.sent(),
                                n.label = 3;
                            case 3:
                                return o++,
                                [3, 1];
                            case 4:
                                if (!(t instanceof _r))
                                    return [3, 8];
                                n.label = 5;
                            case 5:
                                return n.trys.push([5, 7, , 8]),
                                [4, this.options.cache.match(t.src)];
                            case 6:
                                return C = n.sent(),
                                this.renderReplacedElement(t, r, C),
                                [3, 8];
                            case 7:
                                return n.sent(),
                                pe.getInstance(this.options.id).error("Error loading image " + t.src),
                                [3, 8];
                            case 8:
                                if (t instanceof Pr && this.renderReplacedElement(t, r, t.canvas),
                                !(t instanceof xr))
                                    return [3, 12];
                                n.label = 9;
                            case 9:
                                return n.trys.push([9, 11, , 12]),
                                [4, this.options.cache.match(t.svg)];
                            case 10:
                                return C = n.sent(),
                                this.renderReplacedElement(t, r, C),
                                [3, 12];
                            case 11:
                                return n.sent(),
                                pe.getInstance(this.options.id).error("Error loading svg " + t.svg.substring(0, 255)),
                                [3, 12];
                            case 12:
                                return t instanceof en && t.tree ? [4, new A({
                                    id: this.options.id,
                                    scale: this.options.scale,
                                    backgroundColor: t.backgroundColor,
                                    x: 0,
                                    y: 0,
                                    scrollX: 0,
                                    scrollY: 0,
                                    width: t.width,
                                    height: t.height,
                                    cache: this.options.cache,
                                    windowWidth: t.width,
                                    windowHeight: t.height
                                }).render(t.tree)] : [3, 14];
                            case 13:
                                c = n.sent(),
                                t.width && t.height && this.ctx.drawImage(c, 0, 0, t.width, t.height, t.bounds.left, t.bounds.top, t.bounds.width, t.bounds.height),
                                n.label = 14;
                            case 14:
                                if (t instanceof Zr && (Q = Math.min(t.bounds.width, t.bounds.height),
                                t.type === Wr ? t.checked && (this.ctx.save(),
                                this.path([new qn(t.bounds.left + .39363 * Q,t.bounds.top + .79 * Q), new qn(t.bounds.left + .16 * Q,t.bounds.top + .5549 * Q), new qn(t.bounds.left + .27347 * Q,t.bounds.top + .44071 * Q), new qn(t.bounds.left + .39694 * Q,t.bounds.top + .5649 * Q), new qn(t.bounds.left + .72983 * Q,t.bounds.top + .23 * Q), new qn(t.bounds.left + .84 * Q,t.bounds.top + .34085 * Q), new qn(t.bounds.left + .39363 * Q,t.bounds.top + .79 * Q)]),
                                this.ctx.fillStyle = ee(707406591),
                                this.ctx.fill(),
                                this.ctx.restore()) : t.type === Yr && t.checked && (this.ctx.save(),
                                this.ctx.beginPath(),
                                this.ctx.arc(t.bounds.left + Q / 2, t.bounds.top + Q / 2, Q / 4, 0, 2 * Math.PI, !0),
                                this.ctx.fillStyle = ee(707406591),
                                this.ctx.fill(),
                                this.ctx.restore())),
                                HB(t) && t.value.length) {
                                    switch (this.ctx.font = this.createFontStyle(s)[0],
                                    this.ctx.fillStyle = ee(s.color),
                                    this.ctx.textBaseline = "middle",
                                    this.ctx.textAlign = fB(t.styles.textAlign),
                                    E = uB(t),
                                    w = 0,
                                    t.styles.textAlign) {
                                    case yt.CENTER:
                                        w += E.width / 2;
                                        break;
                                    case yt.RIGHT:
                                        w += E.width
                                    }
                                    U = E.add(w, 0, 0, -E.height / 2 + 1),
                                    this.ctx.save(),
                                    this.path([new qn(E.left,E.top), new qn(E.left + E.width,E.top), new qn(E.left + E.width,E.top + E.height), new qn(E.left,E.top + E.height)]),
                                    this.ctx.clip(),
                                    this.renderTextWithLetterSpacing(new mr(t.value,U), s.letterSpacing),
                                    this.ctx.restore(),
                                    this.ctx.textBaseline = "bottom",
                                    this.ctx.textAlign = "left"
                                }
                                if (!gr(t.styles.display, 2048))
                                    return [3, 20];
                                if (null === t.styles.listStyleImage)
                                    return [3, 19];
                                if ((l = t.styles.listStyleImage).type !== Qe.URL)
                                    return [3, 18];
                                C = void 0,
                                g = l.url,
                                n.label = 15;
                            case 15:
                                return n.trys.push([15, 17, , 18]),
                                [4, this.options.cache.match(g)];
                            case 16:
                                return C = n.sent(),
                                this.ctx.drawImage(C, t.bounds.left - (C.width + 10), t.bounds.top),
                                [3, 18];
                            case 17:
                                return n.sent(),
                                pe.getInstance(this.options.id).error("Error loading list-style-image " + g),
                                [3, 18];
                            case 18:
                                return [3, 20];
                            case 19:
                                e.listValue && t.styles.listStyleType !== It.NONE && (this.ctx.font = this.createFontStyle(s)[0],
                                this.ctx.fillStyle = ee(s.color),
                                this.ctx.textBaseline = "middle",
                                this.ctx.textAlign = "right",
                                E = new B(t.bounds.left,t.bounds.top + WA(t.styles.paddingTop, t.bounds.width),t.bounds.width,(F = s.lineHeight,
                                h = s.fontSize.number,
                                (DA(F) && "normal" === F.value ? 1.2 * h : F.type === u.NUMBER_TOKEN ? h * F.number : VA(F) ? WA(F, h) : h) / 2 + 1)),
                                this.renderTextWithLetterSpacing(new mr(e.listValue,E), s.letterSpacing),
                                this.ctx.textBaseline = "bottom",
                                this.ctx.textAlign = "left"),
                                n.label = 20;
                            case 20:
                                return [2]
                            }
                            var F, h
                        })
                    })
                }
                ,
                A.prototype.renderStackContent = function(A) {
                    return r(this, void 0, void 0, function() {
                        var e, t, r, B, s, o, i, a, c, Q, u, w, U, l, C;
                        return n(this, function(n) {
                            switch (n.label) {
                            case 0:
                                return [4, this.renderNodeBackgroundAndBorders(A.element)];
                            case 1:
                                n.sent(),
                                e = 0,
                                t = A.negativeZIndex,
                                n.label = 2;
                            case 2:
                                return e < t.length ? (C = t[e],
                                [4, this.renderStack(C)]) : [3, 5];
                            case 3:
                                n.sent(),
                                n.label = 4;
                            case 4:
                                return e++,
                                [3, 2];
                            case 5:
                                return [4, this.renderNodeContent(A.element)];
                            case 6:
                                n.sent(),
                                r = 0,
                                B = A.nonInlineLevel,
                                n.label = 7;
                            case 7:
                                return r < B.length ? (C = B[r],
                                [4, this.renderNode(C)]) : [3, 10];
                            case 8:
                                n.sent(),
                                n.label = 9;
                            case 9:
                                return r++,
                                [3, 7];
                            case 10:
                                s = 0,
                                o = A.nonPositionedFloats,
                                n.label = 11;
                            case 11:
                                return s < o.length ? (C = o[s],
                                [4, this.renderStack(C)]) : [3, 14];
                            case 12:
                                n.sent(),
                                n.label = 13;
                            case 13:
                                return s++,
                                [3, 11];
                            case 14:
                                i = 0,
                                a = A.nonPositionedInlineLevel,
                                n.label = 15;
                            case 15:
                                return i < a.length ? (C = a[i],
                                [4, this.renderStack(C)]) : [3, 18];
                            case 16:
                                n.sent(),
                                n.label = 17;
                            case 17:
                                return i++,
                                [3, 15];
                            case 18:
                                c = 0,
                                Q = A.inlineLevel,
                                n.label = 19;
                            case 19:
                                return c < Q.length ? (C = Q[c],
                                [4, this.renderNode(C)]) : [3, 22];
                            case 20:
                                n.sent(),
                                n.label = 21;
                            case 21:
                                return c++,
                                [3, 19];
                            case 22:
                                u = 0,
                                w = A.zeroOrAutoZIndexOrTransformedOrOpacity,
                                n.label = 23;
                            case 23:
                                return u < w.length ? (C = w[u],
                                [4, this.renderStack(C)]) : [3, 26];
                            case 24:
                                n.sent(),
                                n.label = 25;
                            case 25:
                                return u++,
                                [3, 23];
                            case 26:
                                U = 0,
                                l = A.positiveZIndex,
                                n.label = 27;
                            case 27:
                                return U < l.length ? (C = l[U],
                                [4, this.renderStack(C)]) : [3, 30];
                            case 28:
                                n.sent(),
                                n.label = 29;
                            case 29:
                                return U++,
                                [3, 27];
                            case 30:
                                return [2]
                            }
                        })
                    })
                }
                ,
                A.prototype.mask = function(A) {
                    this.ctx.beginPath(),
                    this.ctx.moveTo(0, 0),
                    this.ctx.lineTo(this.canvas.width, 0),
                    this.ctx.lineTo(this.canvas.width, this.canvas.height),
                    this.ctx.lineTo(0, this.canvas.height),
                    this.ctx.lineTo(0, 0),
                    this.formatPath(A.slice(0).reverse()),
                    this.ctx.closePath()
                }
                ,
                A.prototype.path = function(A) {
                    this.ctx.beginPath(),
                    this.formatPath(A),
                    this.ctx.closePath()
                }
                ,
                A.prototype.formatPath = function(A) {
                    var e = this;
                    A.forEach(function(A, t) {
                        var r = $n(A) ? A.start : A;
                        0 === t ? e.ctx.moveTo(r.x, r.y) : e.ctx.lineTo(r.x, r.y),
                        $n(A) && e.ctx.bezierCurveTo(A.startControl.x, A.startControl.y, A.endControl.x, A.endControl.y, A.end.x, A.end.y)
                    })
                }
                ,
                A.prototype.renderRepeat = function(A, e, t, r) {
                    this.path(A),
                    this.ctx.fillStyle = e,
                    this.ctx.translate(t, r),
                    this.ctx.fill(),
                    this.ctx.translate(-t, -r)
                }
                ,
                A.prototype.resizeImage = function(A, e, t) {
                    if (A.width === e && A.height === t)
                        return A;
                    var r = this.canvas.ownerDocument.createElement("canvas");
                    return r.width = e,
                    r.height = t,
                    r.getContext("2d").drawImage(A, 0, 0, A.width, A.height, 0, 0, e, t),
                    r
                }
                ,
                A.prototype.renderBackgroundImage = function(A) {
                    return r(this, void 0, void 0, function() {
                        var e, t, r, B, s, o;
                        return n(this, function(i) {
                            switch (i.label) {
                            case 0:
                                e = A.styles.backgroundImage.length - 1,
                                t = function(t) {
                                    var B, s, o, i, a, c, Q, u, w, U, l, C, g, E, F, h, H, d, f, p, N, K, I, T, m, R, L, O, v, D, b;
                                    return n(this, function(n) {
                                        switch (n.label) {
                                        case 0:
                                            if (t.type !== Qe.URL)
                                                return [3, 5];
                                            B = void 0,
                                            s = t.url,
                                            n.label = 1;
                                        case 1:
                                            return n.trys.push([1, 3, , 4]),
                                            [4, r.options.cache.match(s)];
                                        case 2:
                                            return B = n.sent(),
                                            [3, 4];
                                        case 3:
                                            return n.sent(),
                                            pe.getInstance(r.options.id).error("Error loading background-image " + s),
                                            [3, 4];
                                        case 4:
                                            return B && (o = wB(A, e, [B.width, B.height, B.width / B.height]),
                                            h = o[0],
                                            K = o[1],
                                            I = o[2],
                                            f = o[3],
                                            p = o[4],
                                            E = r.ctx.createPattern(r.resizeImage(B, f, p), "repeat"),
                                            r.renderRepeat(h, E, K, I)),
                                            [3, 6];
                                        case 5:
                                            t.type === Qe.LINEAR_GRADIENT ? (i = wB(A, e, [null, null, null]),
                                            h = i[0],
                                            K = i[1],
                                            I = i[2],
                                            f = i[3],
                                            p = i[4],
                                            a = Ce(t.angle, f, p),
                                            c = a[0],
                                            Q = a[1],
                                            u = a[2],
                                            w = a[3],
                                            U = a[4],
                                            (l = document.createElement("canvas")).width = f,
                                            l.height = p,
                                            C = l.getContext("2d"),
                                            g = C.createLinearGradient(Q, w, u, U),
                                            le(t.stops, c).forEach(function(A) {
                                                return g.addColorStop(A.stop, ee(A.color))
                                            }),
                                            C.fillStyle = g,
                                            C.fillRect(0, 0, f, p),
                                            f > 0 && p > 0 && (E = r.ctx.createPattern(l, "repeat"),
                                            r.renderRepeat(h, E, K, I))) : function(A) {
                                                return A.type === Qe.RADIAL_GRADIENT
                                            }(t) && (F = wB(A, e, [null, null, null]),
                                            h = F[0],
                                            H = F[1],
                                            d = F[2],
                                            f = F[3],
                                            p = F[4],
                                            N = 0 === t.position.length ? [JA] : t.position,
                                            K = WA(N[0], f),
                                            I = WA(N[N.length - 1], p),
                                            T = function(A, e, t, r, n) {
                                                var B = 0
                                                  , s = 0;
                                                switch (A.size) {
                                                case Me.CLOSEST_SIDE:
                                                    A.shape === Se.CIRCLE ? B = s = Math.min(Math.abs(e), Math.abs(e - r), Math.abs(t), Math.abs(t - n)) : A.shape === Se.ELLIPSE && (B = Math.min(Math.abs(e), Math.abs(e - r)),
                                                    s = Math.min(Math.abs(t), Math.abs(t - n)));
                                                    break;
                                                case Me.CLOSEST_CORNER:
                                                    if (A.shape === Se.CIRCLE)
                                                        B = s = Math.min(ge(e, t), ge(e, t - n), ge(e - r, t), ge(e - r, t - n));
                                                    else if (A.shape === Se.ELLIPSE) {
                                                        var o = Math.min(Math.abs(t), Math.abs(t - n)) / Math.min(Math.abs(e), Math.abs(e - r))
                                                          , i = Ee(r, n, e, t, !0)
                                                          , a = i[0]
                                                          , c = i[1];
                                                        s = o * (B = ge(a - e, (c - t) / o))
                                                    }
                                                    break;
                                                case Me.FARTHEST_SIDE:
                                                    A.shape === Se.CIRCLE ? B = s = Math.max(Math.abs(e), Math.abs(e - r), Math.abs(t), Math.abs(t - n)) : A.shape === Se.ELLIPSE && (B = Math.max(Math.abs(e), Math.abs(e - r)),
                                                    s = Math.max(Math.abs(t), Math.abs(t - n)));
                                                    break;
                                                case Me.FARTHEST_CORNER:
                                                    if (A.shape === Se.CIRCLE)
                                                        B = s = Math.max(ge(e, t), ge(e, t - n), ge(e - r, t), ge(e - r, t - n));
                                                    else if (A.shape === Se.ELLIPSE) {
                                                        o = Math.max(Math.abs(t), Math.abs(t - n)) / Math.max(Math.abs(e), Math.abs(e - r));
                                                        var Q = Ee(r, n, e, t, !1);
                                                        a = Q[0],
                                                        c = Q[1],
                                                        s = o * (B = ge(a - e, (c - t) / o))
                                                    }
                                                }
                                                return Array.isArray(A.size) && (B = WA(A.size[0], r),
                                                s = 2 === A.size.length ? WA(A.size[1], n) : B),
                                                [B, s]
                                            }(t, K, I, f, p),
                                            m = T[0],
                                            R = T[1],
                                            m > 0 && m > 0 && (L = r.ctx.createRadialGradient(H + K, d + I, 0, H + K, d + I, m),
                                            le(t.stops, 2 * m).forEach(function(A) {
                                                return L.addColorStop(A.stop, ee(A.color))
                                            }),
                                            r.path(h),
                                            r.ctx.fillStyle = L,
                                            m !== R ? (O = A.bounds.left + .5 * A.bounds.width,
                                            v = A.bounds.top + .5 * A.bounds.height,
                                            b = 1 / (D = R / m),
                                            r.ctx.save(),
                                            r.ctx.translate(O, v),
                                            r.ctx.transform(1, 0, 0, D, 0, 0),
                                            r.ctx.translate(-O, -v),
                                            r.ctx.fillRect(H, b * (d - v) + v, f, p * b),
                                            r.ctx.restore()) : r.ctx.fill())),
                                            n.label = 6;
                                        case 6:
                                            return e--,
                                            [2]
                                        }
                                    })
                                }
                                ,
                                r = this,
                                B = 0,
                                s = A.styles.backgroundImage.slice(0).reverse(),
                                i.label = 1;
                            case 1:
                                return B < s.length ? (o = s[B],
                                [5, t(o)]) : [3, 4];
                            case 2:
                                i.sent(),
                                i.label = 3;
                            case 3:
                                return B++,
                                [3, 1];
                            case 4:
                                return [2]
                            }
                        })
                    })
                }
                ,
                A.prototype.renderBorder = function(A, e, t) {
                    return r(this, void 0, void 0, function() {
                        return n(this, function(r) {
                            return this.path(function(A, e) {
                                switch (e) {
                                case 0:
                                    return cB(A.topLeftBorderBox, A.topLeftPaddingBox, A.topRightBorderBox, A.topRightPaddingBox);
                                case 1:
                                    return cB(A.topRightBorderBox, A.topRightPaddingBox, A.bottomRightBorderBox, A.bottomRightPaddingBox);
                                case 2:
                                    return cB(A.bottomRightBorderBox, A.bottomRightPaddingBox, A.bottomLeftBorderBox, A.bottomLeftPaddingBox);
                                case 3:
                                default:
                                    return cB(A.bottomLeftBorderBox, A.bottomLeftPaddingBox, A.topLeftBorderBox, A.topLeftPaddingBox)
                                }
                            }(t, e)),
                            this.ctx.fillStyle = ee(A),
                            this.ctx.fill(),
                            [2]
                        })
                    })
                }
                ,
                A.prototype.renderNodeBackgroundAndBorders = function(A) {
                    return r(this, void 0, void 0, function() {
                        var e, t, r, B, s, o, i, a, c = this;
                        return n(this, function(n) {
                            switch (n.label) {
                            case 0:
                                return this.applyEffects(A.effects, 2),
                                e = A.container.styles,
                                t = !Ae(e.backgroundColor) || e.backgroundImage.length,
                                r = [{
                                    style: e.borderTopStyle,
                                    color: e.borderTopColor
                                }, {
                                    style: e.borderRightStyle,
                                    color: e.borderRightColor
                                }, {
                                    style: e.borderBottomStyle,
                                    color: e.borderBottomColor
                                }, {
                                    style: e.borderLeftStyle,
                                    color: e.borderLeftColor
                                }],
                                B = dB(gB(e.backgroundClip, 0), A.curves),
                                t || e.boxShadow.length ? (this.ctx.save(),
                                this.path(B),
                                this.ctx.clip(),
                                Ae(e.backgroundColor) || (this.ctx.fillStyle = ee(e.backgroundColor),
                                this.ctx.fill()),
                                [4, this.renderBackgroundImage(A.container)]) : [3, 2];
                            case 1:
                                n.sent(),
                                this.ctx.restore(),
                                e.boxShadow.slice(0).reverse().forEach(function(e) {
                                    c.ctx.save();
                                    var t, r, n, B, s, o = tB(A.curves), i = e.inset ? 0 : 1e4, a = (t = o,
                                    r = -i + (e.inset ? 1 : -1) * e.spread.number,
                                    n = (e.inset ? 1 : -1) * e.spread.number,
                                    B = e.spread.number * (e.inset ? -2 : 2),
                                    s = e.spread.number * (e.inset ? -2 : 2),
                                    t.map(function(A, e) {
                                        switch (e) {
                                        case 0:
                                            return A.add(r, n);
                                        case 1:
                                            return A.add(r + B, n);
                                        case 2:
                                            return A.add(r + B, n + s);
                                        case 3:
                                            return A.add(r, n + s)
                                        }
                                        return A
                                    }));
                                    e.inset ? (c.path(o),
                                    c.ctx.clip(),
                                    c.mask(a)) : (c.mask(o),
                                    c.ctx.clip(),
                                    c.path(a)),
                                    c.ctx.shadowOffsetX = e.offsetX.number + i,
                                    c.ctx.shadowOffsetY = e.offsetY.number,
                                    c.ctx.shadowColor = ee(e.color),
                                    c.ctx.shadowBlur = e.blur.number,
                                    c.ctx.fillStyle = e.inset ? ee(e.color) : "rgba(0,0,0,1)",
                                    c.ctx.fill(),
                                    c.ctx.restore()
                                }),
                                n.label = 2;
                            case 2:
                                s = 0,
                                o = 0,
                                i = r,
                                n.label = 3;
                            case 3:
                                return o < i.length ? (a = i[o]).style === ke.NONE || Ae(a.color) ? [3, 5] : [4, this.renderBorder(a.color, s, A.curves)] : [3, 7];
                            case 4:
                                n.sent(),
                                n.label = 5;
                            case 5:
                                s++,
                                n.label = 6;
                            case 6:
                                return o++,
                                [3, 3];
                            case 7:
                                return [2]
                            }
                        })
                    })
                }
                ,
                A.prototype.render = function(A) {
                    return r(this, void 0, void 0, function() {
                        var e;
                        return n(this, function(t) {
                            switch (t.label) {
                            case 0:
                                return this.options.backgroundColor && (this.ctx.fillStyle = ee(this.options.backgroundColor),
                                this.ctx.fillRect(this.options.x - this.options.scrollX, this.options.y - this.options.scrollY, this.options.width, this.options.height)),
                                r = new oB(A,[]),
                                n = new sB(r),
                                iB(r, n, n, B = []),
                                aB(r.container, B),
                                e = n,
                                [4, this.renderStack(e)];
                            case 1:
                                return t.sent(),
                                this.applyEffects([], 2),
                                [2, this.canvas]
                            }
                            var r, n, B
                        })
                    })
                }
                ,
                A
            }()
              , HB = function(A) {
                return A instanceof $r || (A instanceof jr || A instanceof Zr && A.type !== Yr && A.type !== Wr)
            }
              , dB = function(A, e) {
                switch (A) {
                case oe.BORDER_BOX:
                    return tB(e);
                case oe.CONTENT_BOX:
                    return function(A) {
                        return [A.topLeftContentBox, A.topRightContentBox, A.bottomRightContentBox, A.bottomLeftContentBox]
                    }(e);
                case oe.PADDING_BOX:
                default:
                    return rB(e)
                }
            }
              , fB = function(A) {
                switch (A) {
                case yt.CENTER:
                    return "center";
                case yt.RIGHT:
                    return "right";
                case yt.LEFT:
                default:
                    return "left"
                }
            }
              , pB = function() {
                function A(A) {
                    this.canvas = A.canvas ? A.canvas : document.createElement("canvas"),
                    this.ctx = this.canvas.getContext("2d"),
                    this.options = A,
                    this.canvas.width = Math.floor(A.width * A.scale),
                    this.canvas.height = Math.floor(A.height * A.scale),
                    this.canvas.style.width = A.width + "px",
                    this.canvas.style.height = A.height + "px",
                    this.ctx.scale(this.options.scale, this.options.scale),
                    this.ctx.translate(-A.x + A.scrollX, -A.y + A.scrollY),
                    pe.getInstance(A.id).debug("EXPERIMENTAL ForeignObject renderer initialized (" + A.width + "x" + A.height + " at " + A.x + "," + A.y + ") with scale " + A.scale)
                }
                return A.prototype.render = function(A) {
                    return r(this, void 0, void 0, function() {
                        var e, t;
                        return n(this, function(r) {
                            switch (r.label) {
                            case 0:
                                return e = He(Math.max(this.options.windowWidth, this.options.width) * this.options.scale, Math.max(this.options.windowHeight, this.options.height) * this.options.scale, this.options.scrollX * this.options.scale, this.options.scrollY * this.options.scale, A),
                                [4, NB(e)];
                            case 1:
                                return t = r.sent(),
                                this.options.backgroundColor && (this.ctx.fillStyle = ee(this.options.backgroundColor),
                                this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale)),
                                this.ctx.drawImage(t, -this.options.x * this.options.scale, -this.options.y * this.options.scale),
                                [2, this.canvas]
                            }
                        })
                    })
                }
                ,
                A
            }()
              , NB = function(A) {
                return new Promise(function(e, t) {
                    var r = new Image;
                    r.onload = function() {
                        e(r)
                    }
                    ,
                    r.onerror = t,
                    r.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent((new XMLSerializer).serializeToString(A))
                }
                )
            }
              , KB = function(A) {
                return $A(LA.create(A).parseComponentValue())
            };
            "undefined" != typeof window && Ne.setContext(window);
            var IB = function(A, e) {
                return r(void 0, void 0, void 0, function() {
                    var r, o, i, a, c, Q, u, w, U, l, C, g, E, F, h, H, d, f, p, N, K, I, T;
                    return n(this, function(n) {
                        switch (n.label) {
                        case 0:
                            if (!(r = A.ownerDocument))
                                throw new Error("Element is not attached to a Document");
                            if (!(o = r.defaultView))
                                throw new Error("Document is not attached to a Window");
                            return i = (Math.round(1e3 * Math.random()) + Date.now()).toString(16),
                            a = gn(A) || "HTML" === A.tagName ? function(A) {
                                var e = A.body
                                  , t = A.documentElement;
                                if (!e || !t)
                                    throw new Error("Unable to get document size");
                                var r = Math.max(Math.max(e.scrollWidth, t.scrollWidth), Math.max(e.offsetWidth, t.offsetWidth), Math.max(e.clientWidth, t.clientWidth))
                                  , n = Math.max(Math.max(e.scrollHeight, t.scrollHeight), Math.max(e.offsetHeight, t.offsetHeight), Math.max(e.clientHeight, t.clientHeight));
                                return new B(0,0,r,n)
                            }(r) : s(A),
                            c = a.width,
                            Q = a.height,
                            u = a.left,
                            w = a.top,
                            U = t({}, {
                                allowTaint: !1,
                                imageTimeout: 15e3,
                                proxy: void 0,
                                useCORS: !1
                            }, e),
                            l = {
                                backgroundColor: "#ffffff",
                                cache: e.cache ? e.cache : Ne.create(i, U),
                                logging: !0,
                                removeContainer: !0,
                                foreignObjectRendering: !1,
                                scale: o.devicePixelRatio || 1,
                                windowWidth: o.innerWidth,
                                windowHeight: o.innerHeight,
                                scrollX: o.pageXOffset,
                                scrollY: o.pageYOffset,
                                x: u,
                                y: w,
                                width: Math.ceil(c),
                                height: Math.ceil(Q),
                                id: i
                            },
                            C = t({}, l, U, e),
                            g = new B(C.scrollX,C.scrollY,C.windowWidth,C.windowHeight),
                            pe.create({
                                id: i,
                                enabled: C.logging
                            }),
                            pe.getInstance(i).debug("Starting document clone"),
                            E = new Sn(A,{
                                id: i,
                                onclone: C.onclone,
                                ignoreElements: C.ignoreElements,
                                inlineImages: C.foreignObjectRendering,
                                copyStyles: C.foreignObjectRendering
                            }),
                            (F = E.clonedReferenceElement) ? [4, E.toIFrame(r, g)] : [2, Promise.reject("Unable to find element in cloned iframe")];
                        case 1:
                            return h = n.sent(),
                            H = r.documentElement ? KB(getComputedStyle(r.documentElement).backgroundColor) : ce.TRANSPARENT,
                            d = r.body ? KB(getComputedStyle(r.body).backgroundColor) : ce.TRANSPARENT,
                            f = e.backgroundColor,
                            p = "string" == typeof f ? KB(f) : null === f ? ce.TRANSPARENT : 4294967295,
                            N = A === r.documentElement ? Ae(H) ? Ae(d) ? p : d : H : p,
                            K = {
                                id: i,
                                cache: C.cache,
                                canvas: C.canvas,
                                backgroundColor: N,
                                scale: C.scale,
                                x: C.x,
                                y: C.y,
                                scrollX: C.scrollX,
                                scrollY: C.scrollY,
                                width: C.width,
                                height: C.height,
                                windowWidth: C.windowWidth,
                                windowHeight: C.windowHeight
                            },
                            C.foreignObjectRendering ? (pe.getInstance(i).debug("Document cloned, using foreign object rendering"),
                            [4, new pB(K).render(F)]) : [3, 3];
                        case 2:
                            return I = n.sent(),
                            [3, 5];
                        case 3:
                            return pe.getInstance(i).debug("Document cloned, using computed rendering"),
                            Ne.attachInstance(C.cache),
                            pe.getInstance(i).debug("Starting DOM parsing"),
                            T = Bn(F),
                            Ne.detachInstance(),
                            N === T.styles.backgroundColor && (T.styles.backgroundColor = ce.TRANSPARENT),
                            pe.getInstance(i).debug("Starting renderer"),
                            [4, new hB(K).render(T)];
                        case 4:
                            I = n.sent(),
                            n.label = 5;
                        case 5:
                            return !0 === C.removeContainer && (Sn.destroy(h) || pe.getInstance(i).error("Cannot detach cloned iframe as it is not in the DOM anymore")),
                            pe.getInstance(i).debug("Finished rendering"),
                            pe.destroy(i),
                            Ne.destroy(i),
                            [2, I]
                        }
                    })
                })
            };
            return function(A, e) {
                return void 0 === e && (e = {}),
                IB(A, e)
            }
        });

    }
    , {}],
    27: [function(require, module, exports) {
        !function(e, t) {
            "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
                if (!e.document)
                    throw new Error("jQuery requires a window with a document");
                return t(e)
            }
            : t(e)
        }("undefined" != typeof window ? window : this, function(e, t) {
            var n = []
              , r = n.slice
              , i = n.concat
              , o = n.push
              , s = n.indexOf
              , a = {}
              , u = a.toString
              , l = a.hasOwnProperty
              , c = {}
              , f = e.document
              , p = function(e, t) {
                return new p.fn.init(e,t)
            }
              , d = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
              , h = /^-ms-/
              , g = /-([\da-z])/gi
              , m = function(e, t) {
                return t.toUpperCase()
            };
            function v(e) {
                var t = "length"in e && e.length
                  , n = p.type(e);
                return "function" !== n && !p.isWindow(e) && (!(1 !== e.nodeType || !t) || ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e))
            }
            p.fn = p.prototype = {
                jquery: "2.1.4",
                constructor: p,
                selector: "",
                length: 0,
                toArray: function() {
                    return r.call(this)
                },
                get: function(e) {
                    return null != e ? e < 0 ? this[e + this.length] : this[e] : r.call(this)
                },
                pushStack: function(e) {
                    var t = p.merge(this.constructor(), e);
                    return t.prevObject = this,
                    t.context = this.context,
                    t
                },
                each: function(e, t) {
                    return p.each(this, e, t)
                },
                map: function(e) {
                    return this.pushStack(p.map(this, function(t, n) {
                        return e.call(t, n, t)
                    }))
                },
                slice: function() {
                    return this.pushStack(r.apply(this, arguments))
                },
                first: function() {
                    return this.eq(0)
                },
                last: function() {
                    return this.eq(-1)
                },
                eq: function(e) {
                    var t = this.length
                      , n = +e + (e < 0 ? t : 0);
                    return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
                },
                end: function() {
                    return this.prevObject || this.constructor(null)
                },
                push: o,
                sort: n.sort,
                splice: n.splice
            },
            p.extend = p.fn.extend = function() {
                var e, t, n, r, i, o, s = arguments[0] || {}, a = 1, u = arguments.length, l = !1;
                for ("boolean" == typeof s && (l = s,
                s = arguments[a] || {},
                a++),
                "object" == typeof s || p.isFunction(s) || (s = {}),
                a === u && (s = this,
                a--); a < u; a++)
                    if (null != (e = arguments[a]))
                        for (t in e)
                            n = s[t],
                            s !== (r = e[t]) && (l && r && (p.isPlainObject(r) || (i = p.isArray(r))) ? (i ? (i = !1,
                            o = n && p.isArray(n) ? n : []) : o = n && p.isPlainObject(n) ? n : {},
                            s[t] = p.extend(l, o, r)) : void 0 !== r && (s[t] = r));
                return s
            }
            ,
            p.extend({
                expando: "jQuery" + ("2.1.4" + Math.random()).replace(/\D/g, ""),
                isReady: !0,
                error: function(e) {
                    throw new Error(e)
                },
                noop: function() {},
                isFunction: function(e) {
                    return "function" === p.type(e)
                },
                isArray: Array.isArray,
                isWindow: function(e) {
                    return null != e && e === e.window
                },
                isNumeric: function(e) {
                    return !p.isArray(e) && e - parseFloat(e) + 1 >= 0
                },
                isPlainObject: function(e) {
                    return "object" === p.type(e) && !e.nodeType && !p.isWindow(e) && !(e.constructor && !l.call(e.constructor.prototype, "isPrototypeOf"))
                },
                isEmptyObject: function(e) {
                    var t;
                    for (t in e)
                        return !1;
                    return !0
                },
                type: function(e) {
                    return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? a[u.call(e)] || "object" : typeof e
                },
                globalEval: function(e) {
                    var t, n = eval;
                    (e = p.trim(e)) && (1 === e.indexOf("use strict") ? ((t = f.createElement("script")).text = e,
                    f.head.appendChild(t).parentNode.removeChild(t)) : n(e))
                },
                camelCase: function(e) {
                    return e.replace(h, "ms-").replace(g, m)
                },
                nodeName: function(e, t) {
                    return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
                },
                each: function(e, t, n) {
                    var r = 0
                      , i = e.length
                      , o = v(e);
                    if (n) {
                        if (o)
                            for (; r < i && !1 !== t.apply(e[r], n); r++)
                                ;
                        else
                            for (r in e)
                                if (!1 === t.apply(e[r], n))
                                    break
                    } else if (o)
                        for (; r < i && !1 !== t.call(e[r], r, e[r]); r++)
                            ;
                    else
                        for (r in e)
                            if (!1 === t.call(e[r], r, e[r]))
                                break;
                    return e
                },
                trim: function(e) {
                    return null == e ? "" : (e + "").replace(d, "")
                },
                makeArray: function(e, t) {
                    var n = t || [];
                    return null != e && (v(Object(e)) ? p.merge(n, "string" == typeof e ? [e] : e) : o.call(n, e)),
                    n
                },
                inArray: function(e, t, n) {
                    return null == t ? -1 : s.call(t, e, n)
                },
                merge: function(e, t) {
                    for (var n = +t.length, r = 0, i = e.length; r < n; r++)
                        e[i++] = t[r];
                    return e.length = i,
                    e
                },
                grep: function(e, t, n) {
                    for (var r = [], i = 0, o = e.length, s = !n; i < o; i++)
                        !t(e[i], i) !== s && r.push(e[i]);
                    return r
                },
                map: function(e, t, n) {
                    var r, o = 0, s = e.length, a = [];
                    if (v(e))
                        for (; o < s; o++)
                            null != (r = t(e[o], o, n)) && a.push(r);
                    else
                        for (o in e)
                            null != (r = t(e[o], o, n)) && a.push(r);
                    return i.apply([], a)
                },
                guid: 1,
                proxy: function(e, t) {
                    var n, i, o;
                    if ("string" == typeof t && (n = e[t],
                    t = e,
                    e = n),
                    p.isFunction(e))
                        return i = r.call(arguments, 2),
                        (o = function() {
                            return e.apply(t || this, i.concat(r.call(arguments)))
                        }
                        ).guid = e.guid = e.guid || p.guid++,
                        o
                },
                now: Date.now,
                support: c
            }),
            p.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
                a["[object " + t + "]"] = t.toLowerCase()
            });
            var y = function(e) {
                var t, n, r, i, o, s, a, u, l, c, f, p, d, h, g, m, v, y, x, b = "sizzle" + 1 * new Date, w = e.document, T = 0, C = 0, N = se(), k = se(), E = se(), S = function(e, t) {
                    return e === t && (f = !0),
                    0
                }, D = 1 << 31, j = {}.hasOwnProperty, A = [], L = A.pop, q = A.push, H = A.push, O = A.slice, F = function(e, t) {
                    for (var n = 0, r = e.length; n < r; n++)
                        if (e[n] === t)
                            return n;
                    return -1
                }, P = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", R = "[\\x20\\t\\r\\n\\f]", M = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", W = M.replace("w", "w#"), $ = "\\[" + R + "*(" + M + ")(?:" + R + "*([*^$|!~]?=)" + R + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + W + "))|)" + R + "*\\]", I = ":(" + M + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + $ + ")*)|.*)\\)|)", B = new RegExp(R + "+","g"), _ = new RegExp("^" + R + "+|((?:^|[^\\\\])(?:\\\\.)*)" + R + "+$","g"), z = new RegExp("^" + R + "*," + R + "*"), X = new RegExp("^" + R + "*([>+~]|" + R + ")" + R + "*"), U = new RegExp("=" + R + "*([^\\]'\"]*?)" + R + "*\\]","g"), V = new RegExp(I), Y = new RegExp("^" + W + "$"), G = {
                    ID: new RegExp("^#(" + M + ")"),
                    CLASS: new RegExp("^\\.(" + M + ")"),
                    TAG: new RegExp("^(" + M.replace("w", "w*") + ")"),
                    ATTR: new RegExp("^" + $),
                    PSEUDO: new RegExp("^" + I),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + R + "*(even|odd|(([+-]|)(\\d*)n|)" + R + "*(?:([+-]|)" + R + "*(\\d+)|))" + R + "*\\)|)","i"),
                    bool: new RegExp("^(?:" + P + ")$","i"),
                    needsContext: new RegExp("^" + R + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + R + "*((?:-\\d)?\\d*)" + R + "*\\)|)(?=[^-]|$)","i")
                }, Q = /^(?:input|select|textarea|button)$/i, J = /^h\d$/i, K = /^[^{]+\{\s*\[native \w/, Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ee = /[+~]/, te = /'|\\/g, ne = new RegExp("\\\\([\\da-f]{1,6}" + R + "?|(" + R + ")|.)","ig"), re = function(e, t, n) {
                    var r = "0x" + t - 65536;
                    return r != r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
                }, ie = function() {
                    p()
                };
                try {
                    H.apply(A = O.call(w.childNodes), w.childNodes),
                    A[w.childNodes.length].nodeType
                } catch (e) {
                    H = {
                        apply: A.length ? function(e, t) {
                            q.apply(e, O.call(t))
                        }
                        : function(e, t) {
                            for (var n = e.length, r = 0; e[n++] = t[r++]; )
                                ;
                            e.length = n - 1
                        }
                    }
                }
                function oe(e, t, r, i) {
                    var o, a, l, c, f, h, v, y, T, C;
                    if ((t ? t.ownerDocument || t : w) !== d && p(t),
                    r = r || [],
                    c = (t = t || d).nodeType,
                    "string" != typeof e || !e || 1 !== c && 9 !== c && 11 !== c)
                        return r;
                    if (!i && g) {
                        if (11 !== c && (o = Z.exec(e)))
                            if (l = o[1]) {
                                if (9 === c) {
                                    if (!(a = t.getElementById(l)) || !a.parentNode)
                                        return r;
                                    if (a.id === l)
                                        return r.push(a),
                                        r
                                } else if (t.ownerDocument && (a = t.ownerDocument.getElementById(l)) && x(t, a) && a.id === l)
                                    return r.push(a),
                                    r
                            } else {
                                if (o[2])
                                    return H.apply(r, t.getElementsByTagName(e)),
                                    r;
                                if ((l = o[3]) && n.getElementsByClassName)
                                    return H.apply(r, t.getElementsByClassName(l)),
                                    r
                            }
                        if (n.qsa && (!m || !m.test(e))) {
                            if (y = v = b,
                            T = t,
                            C = 1 !== c && e,
                            1 === c && "object" !== t.nodeName.toLowerCase()) {
                                for (h = s(e),
                                (v = t.getAttribute("id")) ? y = v.replace(te, "\\$&") : t.setAttribute("id", y),
                                y = "[id='" + y + "'] ",
                                f = h.length; f--; )
                                    h[f] = y + me(h[f]);
                                T = ee.test(e) && he(t.parentNode) || t,
                                C = h.join(",")
                            }
                            if (C)
                                try {
                                    return H.apply(r, T.querySelectorAll(C)),
                                    r
                                } catch (e) {} finally {
                                    v || t.removeAttribute("id")
                                }
                        }
                    }
                    return u(e.replace(_, "$1"), t, r, i)
                }
                function se() {
                    var e = [];
                    return function t(n, i) {
                        return e.push(n + " ") > r.cacheLength && delete t[e.shift()],
                        t[n + " "] = i
                    }
                }
                function ae(e) {
                    return e[b] = !0,
                    e
                }
                function ue(e) {
                    var t = d.createElement("div");
                    try {
                        return !!e(t)
                    } catch (e) {
                        return !1
                    } finally {
                        t.parentNode && t.parentNode.removeChild(t),
                        t = null
                    }
                }
                function le(e, t) {
                    for (var n = e.split("|"), i = e.length; i--; )
                        r.attrHandle[n[i]] = t
                }
                function ce(e, t) {
                    var n = t && e
                      , r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || D) - (~e.sourceIndex || D);
                    if (r)
                        return r;
                    if (n)
                        for (; n = n.nextSibling; )
                            if (n === t)
                                return -1;
                    return e ? 1 : -1
                }
                function fe(e) {
                    return function(t) {
                        return "input" === t.nodeName.toLowerCase() && t.type === e
                    }
                }
                function pe(e) {
                    return function(t) {
                        var n = t.nodeName.toLowerCase();
                        return ("input" === n || "button" === n) && t.type === e
                    }
                }
                function de(e) {
                    return ae(function(t) {
                        return t = +t,
                        ae(function(n, r) {
                            for (var i, o = e([], n.length, t), s = o.length; s--; )
                                n[i = o[s]] && (n[i] = !(r[i] = n[i]))
                        })
                    })
                }
                function he(e) {
                    return e && void 0 !== e.getElementsByTagName && e
                }
                for (t in n = oe.support = {},
                o = oe.isXML = function(e) {
                    var t = e && (e.ownerDocument || e).documentElement;
                    return !!t && "HTML" !== t.nodeName
                }
                ,
                p = oe.setDocument = function(e) {
                    var t, i, s = e ? e.ownerDocument || e : w;
                    return s !== d && 9 === s.nodeType && s.documentElement ? (d = s,
                    h = s.documentElement,
                    (i = s.defaultView) && i !== i.top && (i.addEventListener ? i.addEventListener("unload", ie, !1) : i.attachEvent && i.attachEvent("onunload", ie)),
                    g = !o(s),
                    n.attributes = ue(function(e) {
                        return e.className = "i",
                        !e.getAttribute("className")
                    }),
                    n.getElementsByTagName = ue(function(e) {
                        return e.appendChild(s.createComment("")),
                        !e.getElementsByTagName("*").length
                    }),
                    n.getElementsByClassName = K.test(s.getElementsByClassName),
                    n.getById = ue(function(e) {
                        return h.appendChild(e).id = b,
                        !s.getElementsByName || !s.getElementsByName(b).length
                    }),
                    n.getById ? (r.find.ID = function(e, t) {
                        if (void 0 !== t.getElementById && g) {
                            var n = t.getElementById(e);
                            return n && n.parentNode ? [n] : []
                        }
                    }
                    ,
                    r.filter.ID = function(e) {
                        var t = e.replace(ne, re);
                        return function(e) {
                            return e.getAttribute("id") === t
                        }
                    }
                    ) : (delete r.find.ID,
                    r.filter.ID = function(e) {
                        var t = e.replace(ne, re);
                        return function(e) {
                            var n = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                            return n && n.value === t
                        }
                    }
                    ),
                    r.find.TAG = n.getElementsByTagName ? function(e, t) {
                        return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : n.qsa ? t.querySelectorAll(e) : void 0
                    }
                    : function(e, t) {
                        var n, r = [], i = 0, o = t.getElementsByTagName(e);
                        if ("*" === e) {
                            for (; n = o[i++]; )
                                1 === n.nodeType && r.push(n);
                            return r
                        }
                        return o
                    }
                    ,
                    r.find.CLASS = n.getElementsByClassName && function(e, t) {
                        if (g)
                            return t.getElementsByClassName(e)
                    }
                    ,
                    v = [],
                    m = [],
                    (n.qsa = K.test(s.querySelectorAll)) && (ue(function(e) {
                        h.appendChild(e).innerHTML = "<a id='" + b + "'></a><select id='" + b + "-\f]' msallowcapture=''><option selected=''></option></select>",
                        e.querySelectorAll("[msallowcapture^='']").length && m.push("[*^$]=" + R + "*(?:''|\"\")"),
                        e.querySelectorAll("[selected]").length || m.push("\\[" + R + "*(?:value|" + P + ")"),
                        e.querySelectorAll("[id~=" + b + "-]").length || m.push("~="),
                        e.querySelectorAll(":checked").length || m.push(":checked"),
                        e.querySelectorAll("a#" + b + "+*").length || m.push(".#.+[+~]")
                    }),
                    ue(function(e) {
                        var t = s.createElement("input");
                        t.setAttribute("type", "hidden"),
                        e.appendChild(t).setAttribute("name", "D"),
                        e.querySelectorAll("[name=d]").length && m.push("name" + R + "*[*^$|!~]?="),
                        e.querySelectorAll(":enabled").length || m.push(":enabled", ":disabled"),
                        e.querySelectorAll("*,:x"),
                        m.push(",.*:")
                    })),
                    (n.matchesSelector = K.test(y = h.matches || h.webkitMatchesSelector || h.mozMatchesSelector || h.oMatchesSelector || h.msMatchesSelector)) && ue(function(e) {
                        n.disconnectedMatch = y.call(e, "div"),
                        y.call(e, "[s!='']:x"),
                        v.push("!=", I)
                    }),
                    m = m.length && new RegExp(m.join("|")),
                    v = v.length && new RegExp(v.join("|")),
                    t = K.test(h.compareDocumentPosition),
                    x = t || K.test(h.contains) ? function(e, t) {
                        var n = 9 === e.nodeType ? e.documentElement : e
                          , r = t && t.parentNode;
                        return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
                    }
                    : function(e, t) {
                        if (t)
                            for (; t = t.parentNode; )
                                if (t === e)
                                    return !0;
                        return !1
                    }
                    ,
                    S = t ? function(e, t) {
                        if (e === t)
                            return f = !0,
                            0;
                        var r = !e.compareDocumentPosition - !t.compareDocumentPosition;
                        return r || (1 & (r = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !n.sortDetached && t.compareDocumentPosition(e) === r ? e === s || e.ownerDocument === w && x(w, e) ? -1 : t === s || t.ownerDocument === w && x(w, t) ? 1 : c ? F(c, e) - F(c, t) : 0 : 4 & r ? -1 : 1)
                    }
                    : function(e, t) {
                        if (e === t)
                            return f = !0,
                            0;
                        var n, r = 0, i = e.parentNode, o = t.parentNode, a = [e], u = [t];
                        if (!i || !o)
                            return e === s ? -1 : t === s ? 1 : i ? -1 : o ? 1 : c ? F(c, e) - F(c, t) : 0;
                        if (i === o)
                            return ce(e, t);
                        for (n = e; n = n.parentNode; )
                            a.unshift(n);
                        for (n = t; n = n.parentNode; )
                            u.unshift(n);
                        for (; a[r] === u[r]; )
                            r++;
                        return r ? ce(a[r], u[r]) : a[r] === w ? -1 : u[r] === w ? 1 : 0
                    }
                    ,
                    s) : d
                }
                ,
                oe.matches = function(e, t) {
                    return oe(e, null, null, t)
                }
                ,
                oe.matchesSelector = function(e, t) {
                    if ((e.ownerDocument || e) !== d && p(e),
                    t = t.replace(U, "='$1']"),
                    n.matchesSelector && g && (!v || !v.test(t)) && (!m || !m.test(t)))
                        try {
                            var r = y.call(e, t);
                            if (r || n.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                                return r
                        } catch (e) {}
                    return oe(t, d, null, [e]).length > 0
                }
                ,
                oe.contains = function(e, t) {
                    return (e.ownerDocument || e) !== d && p(e),
                    x(e, t)
                }
                ,
                oe.attr = function(e, t) {
                    (e.ownerDocument || e) !== d && p(e);
                    var i = r.attrHandle[t.toLowerCase()]
                      , o = i && j.call(r.attrHandle, t.toLowerCase()) ? i(e, t, !g) : void 0;
                    return void 0 !== o ? o : n.attributes || !g ? e.getAttribute(t) : (o = e.getAttributeNode(t)) && o.specified ? o.value : null
                }
                ,
                oe.error = function(e) {
                    throw new Error("Syntax error, unrecognized expression: " + e)
                }
                ,
                oe.uniqueSort = function(e) {
                    var t, r = [], i = 0, o = 0;
                    if (f = !n.detectDuplicates,
                    c = !n.sortStable && e.slice(0),
                    e.sort(S),
                    f) {
                        for (; t = e[o++]; )
                            t === e[o] && (i = r.push(o));
                        for (; i--; )
                            e.splice(r[i], 1)
                    }
                    return c = null,
                    e
                }
                ,
                i = oe.getText = function(e) {
                    var t, n = "", r = 0, o = e.nodeType;
                    if (o) {
                        if (1 === o || 9 === o || 11 === o) {
                            if ("string" == typeof e.textContent)
                                return e.textContent;
                            for (e = e.firstChild; e; e = e.nextSibling)
                                n += i(e)
                        } else if (3 === o || 4 === o)
                            return e.nodeValue
                    } else
                        for (; t = e[r++]; )
                            n += i(t);
                    return n
                }
                ,
                (r = oe.selectors = {
                    cacheLength: 50,
                    createPseudo: ae,
                    match: G,
                    attrHandle: {},
                    find: {},
                    relative: {
                        ">": {
                            dir: "parentNode",
                            first: !0
                        },
                        " ": {
                            dir: "parentNode"
                        },
                        "+": {
                            dir: "previousSibling",
                            first: !0
                        },
                        "~": {
                            dir: "previousSibling"
                        }
                    },
                    preFilter: {
                        ATTR: function(e) {
                            return e[1] = e[1].replace(ne, re),
                            e[3] = (e[3] || e[4] || e[5] || "").replace(ne, re),
                            "~=" === e[2] && (e[3] = " " + e[3] + " "),
                            e.slice(0, 4)
                        },
                        CHILD: function(e) {
                            return e[1] = e[1].toLowerCase(),
                            "nth" === e[1].slice(0, 3) ? (e[3] || oe.error(e[0]),
                            e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                            e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && oe.error(e[0]),
                            e
                        },
                        PSEUDO: function(e) {
                            var t, n = !e[6] && e[2];
                            return G.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && V.test(n) && (t = s(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                            e[2] = n.slice(0, t)),
                            e.slice(0, 3))
                        }
                    },
                    filter: {
                        TAG: function(e) {
                            var t = e.replace(ne, re).toLowerCase();
                            return "*" === e ? function() {
                                return !0
                            }
                            : function(e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t
                            }
                        },
                        CLASS: function(e) {
                            var t = N[e + " "];
                            return t || (t = new RegExp("(^|" + R + ")" + e + "(" + R + "|$)")) && N(e, function(e) {
                                return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                            })
                        },
                        ATTR: function(e, t, n) {
                            return function(r) {
                                var i = oe.attr(r, e);
                                return null == i ? "!=" === t : !t || (i += "",
                                "=" === t ? i === n : "!=" === t ? i !== n : "^=" === t ? n && 0 === i.indexOf(n) : "*=" === t ? n && i.indexOf(n) > -1 : "$=" === t ? n && i.slice(-n.length) === n : "~=" === t ? (" " + i.replace(B, " ") + " ").indexOf(n) > -1 : "|=" === t && (i === n || i.slice(0, n.length + 1) === n + "-"))
                            }
                        },
                        CHILD: function(e, t, n, r, i) {
                            var o = "nth" !== e.slice(0, 3)
                              , s = "last" !== e.slice(-4)
                              , a = "of-type" === t;
                            return 1 === r && 0 === i ? function(e) {
                                return !!e.parentNode
                            }
                            : function(t, n, u) {
                                var l, c, f, p, d, h, g = o !== s ? "nextSibling" : "previousSibling", m = t.parentNode, v = a && t.nodeName.toLowerCase(), y = !u && !a;
                                if (m) {
                                    if (o) {
                                        for (; g; ) {
                                            for (f = t; f = f[g]; )
                                                if (a ? f.nodeName.toLowerCase() === v : 1 === f.nodeType)
                                                    return !1;
                                            h = g = "only" === e && !h && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (h = [s ? m.firstChild : m.lastChild],
                                    s && y) {
                                        for (d = (l = (c = m[b] || (m[b] = {}))[e] || [])[0] === T && l[1],
                                        p = l[0] === T && l[2],
                                        f = d && m.childNodes[d]; f = ++d && f && f[g] || (p = d = 0) || h.pop(); )
                                            if (1 === f.nodeType && ++p && f === t) {
                                                c[e] = [T, d, p];
                                                break
                                            }
                                    } else if (y && (l = (t[b] || (t[b] = {}))[e]) && l[0] === T)
                                        p = l[1];
                                    else
                                        for (; (f = ++d && f && f[g] || (p = d = 0) || h.pop()) && ((a ? f.nodeName.toLowerCase() !== v : 1 !== f.nodeType) || !++p || (y && ((f[b] || (f[b] = {}))[e] = [T, p]),
                                        f !== t)); )
                                            ;
                                    return (p -= i) === r || p % r == 0 && p / r >= 0
                                }
                            }
                        },
                        PSEUDO: function(e, t) {
                            var n, i = r.pseudos[e] || r.setFilters[e.toLowerCase()] || oe.error("unsupported pseudo: " + e);
                            return i[b] ? i(t) : i.length > 1 ? (n = [e, e, "", t],
                            r.setFilters.hasOwnProperty(e.toLowerCase()) ? ae(function(e, n) {
                                for (var r, o = i(e, t), s = o.length; s--; )
                                    e[r = F(e, o[s])] = !(n[r] = o[s])
                            }) : function(e) {
                                return i(e, 0, n)
                            }
                            ) : i
                        }
                    },
                    pseudos: {
                        not: ae(function(e) {
                            var t = []
                              , n = []
                              , r = a(e.replace(_, "$1"));
                            return r[b] ? ae(function(e, t, n, i) {
                                for (var o, s = r(e, null, i, []), a = e.length; a--; )
                                    (o = s[a]) && (e[a] = !(t[a] = o))
                            }) : function(e, i, o) {
                                return t[0] = e,
                                r(t, null, o, n),
                                t[0] = null,
                                !n.pop()
                            }
                        }),
                        has: ae(function(e) {
                            return function(t) {
                                return oe(e, t).length > 0
                            }
                        }),
                        contains: ae(function(e) {
                            return e = e.replace(ne, re),
                            function(t) {
                                return (t.textContent || t.innerText || i(t)).indexOf(e) > -1
                            }
                        }),
                        lang: ae(function(e) {
                            return Y.test(e || "") || oe.error("unsupported lang: " + e),
                            e = e.replace(ne, re).toLowerCase(),
                            function(t) {
                                var n;
                                do {
                                    if (n = g ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang"))
                                        return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
                                } while ((t = t.parentNode) && 1 === t.nodeType);
                                return !1
                            }
                        }),
                        target: function(t) {
                            var n = e.location && e.location.hash;
                            return n && n.slice(1) === t.id
                        },
                        root: function(e) {
                            return e === h
                        },
                        focus: function(e) {
                            return e === d.activeElement && (!d.hasFocus || d.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                        },
                        enabled: function(e) {
                            return !1 === e.disabled
                        },
                        disabled: function(e) {
                            return !0 === e.disabled
                        },
                        checked: function(e) {
                            var t = e.nodeName.toLowerCase();
                            return "input" === t && !!e.checked || "option" === t && !!e.selected
                        },
                        selected: function(e) {
                            return e.parentNode && e.parentNode.selectedIndex,
                            !0 === e.selected
                        },
                        empty: function(e) {
                            for (e = e.firstChild; e; e = e.nextSibling)
                                if (e.nodeType < 6)
                                    return !1;
                            return !0
                        },
                        parent: function(e) {
                            return !r.pseudos.empty(e)
                        },
                        header: function(e) {
                            return J.test(e.nodeName)
                        },
                        input: function(e) {
                            return Q.test(e.nodeName)
                        },
                        button: function(e) {
                            var t = e.nodeName.toLowerCase();
                            return "input" === t && "button" === e.type || "button" === t
                        },
                        text: function(e) {
                            var t;
                            return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                        },
                        first: de(function() {
                            return [0]
                        }),
                        last: de(function(e, t) {
                            return [t - 1]
                        }),
                        eq: de(function(e, t, n) {
                            return [n < 0 ? n + t : n]
                        }),
                        even: de(function(e, t) {
                            for (var n = 0; n < t; n += 2)
                                e.push(n);
                            return e
                        }),
                        odd: de(function(e, t) {
                            for (var n = 1; n < t; n += 2)
                                e.push(n);
                            return e
                        }),
                        lt: de(function(e, t, n) {
                            for (var r = n < 0 ? n + t : n; --r >= 0; )
                                e.push(r);
                            return e
                        }),
                        gt: de(function(e, t, n) {
                            for (var r = n < 0 ? n + t : n; ++r < t; )
                                e.push(r);
                            return e
                        })
                    }
                }).pseudos.nth = r.pseudos.eq,
                {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                })
                    r.pseudos[t] = fe(t);
                for (t in {
                    submit: !0,
                    reset: !0
                })
                    r.pseudos[t] = pe(t);
                function ge() {}
                function me(e) {
                    for (var t = 0, n = e.length, r = ""; t < n; t++)
                        r += e[t].value;
                    return r
                }
                function ve(e, t, n) {
                    var r = t.dir
                      , i = n && "parentNode" === r
                      , o = C++;
                    return t.first ? function(t, n, o) {
                        for (; t = t[r]; )
                            if (1 === t.nodeType || i)
                                return e(t, n, o)
                    }
                    : function(t, n, s) {
                        var a, u, l = [T, o];
                        if (s) {
                            for (; t = t[r]; )
                                if ((1 === t.nodeType || i) && e(t, n, s))
                                    return !0
                        } else
                            for (; t = t[r]; )
                                if (1 === t.nodeType || i) {
                                    if ((a = (u = t[b] || (t[b] = {}))[r]) && a[0] === T && a[1] === o)
                                        return l[2] = a[2];
                                    if (u[r] = l,
                                    l[2] = e(t, n, s))
                                        return !0
                                }
                    }
                }
                function ye(e) {
                    return e.length > 1 ? function(t, n, r) {
                        for (var i = e.length; i--; )
                            if (!e[i](t, n, r))
                                return !1;
                        return !0
                    }
                    : e[0]
                }
                function xe(e, t, n, r, i) {
                    for (var o, s = [], a = 0, u = e.length, l = null != t; a < u; a++)
                        (o = e[a]) && (n && !n(o, r, i) || (s.push(o),
                        l && t.push(a)));
                    return s
                }
                function be(e, t, n, r, i, o) {
                    return r && !r[b] && (r = be(r)),
                    i && !i[b] && (i = be(i, o)),
                    ae(function(o, s, a, u) {
                        var l, c, f, p = [], d = [], h = s.length, g = o || function(e, t, n) {
                            for (var r = 0, i = t.length; r < i; r++)
                                oe(e, t[r], n);
                            return n
                        }(t || "*", a.nodeType ? [a] : a, []), m = !e || !o && t ? g : xe(g, p, e, a, u), v = n ? i || (o ? e : h || r) ? [] : s : m;
                        if (n && n(m, v, a, u),
                        r)
                            for (l = xe(v, d),
                            r(l, [], a, u),
                            c = l.length; c--; )
                                (f = l[c]) && (v[d[c]] = !(m[d[c]] = f));
                        if (o) {
                            if (i || e) {
                                if (i) {
                                    for (l = [],
                                    c = v.length; c--; )
                                        (f = v[c]) && l.push(m[c] = f);
                                    i(null, v = [], l, u)
                                }
                                for (c = v.length; c--; )
                                    (f = v[c]) && (l = i ? F(o, f) : p[c]) > -1 && (o[l] = !(s[l] = f))
                            }
                        } else
                            v = xe(v === s ? v.splice(h, v.length) : v),
                            i ? i(null, s, v, u) : H.apply(s, v)
                    })
                }
                function we(e) {
                    for (var t, n, i, o = e.length, s = r.relative[e[0].type], a = s || r.relative[" "], u = s ? 1 : 0, c = ve(function(e) {
                        return e === t
                    }, a, !0), f = ve(function(e) {
                        return F(t, e) > -1
                    }, a, !0), p = [function(e, n, r) {
                        var i = !s && (r || n !== l) || ((t = n).nodeType ? c(e, n, r) : f(e, n, r));
                        return t = null,
                        i
                    }
                    ]; u < o; u++)
                        if (n = r.relative[e[u].type])
                            p = [ve(ye(p), n)];
                        else {
                            if ((n = r.filter[e[u].type].apply(null, e[u].matches))[b]) {
                                for (i = ++u; i < o && !r.relative[e[i].type]; i++)
                                    ;
                                return be(u > 1 && ye(p), u > 1 && me(e.slice(0, u - 1).concat({
                                    value: " " === e[u - 2].type ? "*" : ""
                                })).replace(_, "$1"), n, u < i && we(e.slice(u, i)), i < o && we(e = e.slice(i)), i < o && me(e))
                            }
                            p.push(n)
                        }
                    return ye(p)
                }
                return ge.prototype = r.filters = r.pseudos,
                r.setFilters = new ge,
                s = oe.tokenize = function(e, t) {
                    var n, i, o, s, a, u, l, c = k[e + " "];
                    if (c)
                        return t ? 0 : c.slice(0);
                    for (a = e,
                    u = [],
                    l = r.preFilter; a; ) {
                        for (s in n && !(i = z.exec(a)) || (i && (a = a.slice(i[0].length) || a),
                        u.push(o = [])),
                        n = !1,
                        (i = X.exec(a)) && (n = i.shift(),
                        o.push({
                            value: n,
                            type: i[0].replace(_, " ")
                        }),
                        a = a.slice(n.length)),
                        r.filter)
                            !(i = G[s].exec(a)) || l[s] && !(i = l[s](i)) || (n = i.shift(),
                            o.push({
                                value: n,
                                type: s,
                                matches: i
                            }),
                            a = a.slice(n.length));
                        if (!n)
                            break
                    }
                    return t ? a.length : a ? oe.error(e) : k(e, u).slice(0)
                }
                ,
                a = oe.compile = function(e, t) {
                    var n, i = [], o = [], a = E[e + " "];
                    if (!a) {
                        for (t || (t = s(e)),
                        n = t.length; n--; )
                            (a = we(t[n]))[b] ? i.push(a) : o.push(a);
                        (a = E(e, function(e, t) {
                            var n = t.length > 0
                              , i = e.length > 0
                              , o = function(o, s, a, u, c) {
                                var f, p, h, g = 0, m = "0", v = o && [], y = [], x = l, b = o || i && r.find.TAG("*", c), w = T += null == x ? 1 : Math.random() || .1, C = b.length;
                                for (c && (l = s !== d && s); m !== C && null != (f = b[m]); m++) {
                                    if (i && f) {
                                        for (p = 0; h = e[p++]; )
                                            if (h(f, s, a)) {
                                                u.push(f);
                                                break
                                            }
                                        c && (T = w)
                                    }
                                    n && ((f = !h && f) && g--,
                                    o && v.push(f))
                                }
                                if (g += m,
                                n && m !== g) {
                                    for (p = 0; h = t[p++]; )
                                        h(v, y, s, a);
                                    if (o) {
                                        if (g > 0)
                                            for (; m--; )
                                                v[m] || y[m] || (y[m] = L.call(u));
                                        y = xe(y)
                                    }
                                    H.apply(u, y),
                                    c && !o && y.length > 0 && g + t.length > 1 && oe.uniqueSort(u)
                                }
                                return c && (T = w,
                                l = x),
                                v
                            };
                            return n ? ae(o) : o
                        }(o, i))).selector = e
                    }
                    return a
                }
                ,
                u = oe.select = function(e, t, i, o) {
                    var u, l, c, f, p, d = "function" == typeof e && e, h = !o && s(e = d.selector || e);
                    if (i = i || [],
                    1 === h.length) {
                        if ((l = h[0] = h[0].slice(0)).length > 2 && "ID" === (c = l[0]).type && n.getById && 9 === t.nodeType && g && r.relative[l[1].type]) {
                            if (!(t = (r.find.ID(c.matches[0].replace(ne, re), t) || [])[0]))
                                return i;
                            d && (t = t.parentNode),
                            e = e.slice(l.shift().value.length)
                        }
                        for (u = G.needsContext.test(e) ? 0 : l.length; u-- && (c = l[u],
                        !r.relative[f = c.type]); )
                            if ((p = r.find[f]) && (o = p(c.matches[0].replace(ne, re), ee.test(l[0].type) && he(t.parentNode) || t))) {
                                if (l.splice(u, 1),
                                !(e = o.length && me(l)))
                                    return H.apply(i, o),
                                    i;
                                break
                            }
                    }
                    return (d || a(e, h))(o, t, !g, i, ee.test(e) && he(t.parentNode) || t),
                    i
                }
                ,
                n.sortStable = b.split("").sort(S).join("") === b,
                n.detectDuplicates = !!f,
                p(),
                n.sortDetached = ue(function(e) {
                    return 1 & e.compareDocumentPosition(d.createElement("div"))
                }),
                ue(function(e) {
                    return e.innerHTML = "<a href='#'></a>",
                    "#" === e.firstChild.getAttribute("href")
                }) || le("type|href|height|width", function(e, t, n) {
                    if (!n)
                        return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
                }),
                n.attributes && ue(function(e) {
                    return e.innerHTML = "<input/>",
                    e.firstChild.setAttribute("value", ""),
                    "" === e.firstChild.getAttribute("value")
                }) || le("value", function(e, t, n) {
                    if (!n && "input" === e.nodeName.toLowerCase())
                        return e.defaultValue
                }),
                ue(function(e) {
                    return null == e.getAttribute("disabled")
                }) || le(P, function(e, t, n) {
                    var r;
                    if (!n)
                        return !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
                }),
                oe
            }(e);
            p.find = y,
            p.expr = y.selectors,
            p.expr[":"] = p.expr.pseudos,
            p.unique = y.uniqueSort,
            p.text = y.getText,
            p.isXMLDoc = y.isXML,
            p.contains = y.contains;
            var x = p.expr.match.needsContext
              , b = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
              , w = /^.[^:#\[\.,]*$/;
            function T(e, t, n) {
                if (p.isFunction(t))
                    return p.grep(e, function(e, r) {
                        return !!t.call(e, r, e) !== n
                    });
                if (t.nodeType)
                    return p.grep(e, function(e) {
                        return e === t !== n
                    });
                if ("string" == typeof t) {
                    if (w.test(t))
                        return p.filter(t, e, n);
                    t = p.filter(t, e)
                }
                return p.grep(e, function(e) {
                    return s.call(t, e) >= 0 !== n
                })
            }
            p.filter = function(e, t, n) {
                var r = t[0];
                return n && (e = ":not(" + e + ")"),
                1 === t.length && 1 === r.nodeType ? p.find.matchesSelector(r, e) ? [r] : [] : p.find.matches(e, p.grep(t, function(e) {
                    return 1 === e.nodeType
                }))
            }
            ,
            p.fn.extend({
                find: function(e) {
                    var t, n = this.length, r = [], i = this;
                    if ("string" != typeof e)
                        return this.pushStack(p(e).filter(function() {
                            for (t = 0; t < n; t++)
                                if (p.contains(i[t], this))
                                    return !0
                        }));
                    for (t = 0; t < n; t++)
                        p.find(e, i[t], r);
                    return (r = this.pushStack(n > 1 ? p.unique(r) : r)).selector = this.selector ? this.selector + " " + e : e,
                    r
                },
                filter: function(e) {
                    return this.pushStack(T(this, e || [], !1))
                },
                not: function(e) {
                    return this.pushStack(T(this, e || [], !0))
                },
                is: function(e) {
                    return !!T(this, "string" == typeof e && x.test(e) ? p(e) : e || [], !1).length
                }
            });
            var C, N = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
            (p.fn.init = function(e, t) {
                var n, r;
                if (!e)
                    return this;
                if ("string" == typeof e) {
                    if (!(n = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : N.exec(e)) || !n[1] && t)
                        return !t || t.jquery ? (t || C).find(e) : this.constructor(t).find(e);
                    if (n[1]) {
                        if (t = t instanceof p ? t[0] : t,
                        p.merge(this, p.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : f, !0)),
                        b.test(n[1]) && p.isPlainObject(t))
                            for (n in t)
                                p.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                        return this
                    }
                    return (r = f.getElementById(n[2])) && r.parentNode && (this.length = 1,
                    this[0] = r),
                    this.context = f,
                    this.selector = e,
                    this
                }
                return e.nodeType ? (this.context = this[0] = e,
                this.length = 1,
                this) : p.isFunction(e) ? void 0 !== C.ready ? C.ready(e) : e(p) : (void 0 !== e.selector && (this.selector = e.selector,
                this.context = e.context),
                p.makeArray(e, this))
            }
            ).prototype = p.fn,
            C = p(f);
            var k = /^(?:parents|prev(?:Until|All))/
              , E = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
            function S(e, t) {
                for (; (e = e[t]) && 1 !== e.nodeType; )
                    ;
                return e
            }
            p.extend({
                dir: function(e, t, n) {
                    for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
                        if (1 === e.nodeType) {
                            if (i && p(e).is(n))
                                break;
                            r.push(e)
                        }
                    return r
                },
                sibling: function(e, t) {
                    for (var n = []; e; e = e.nextSibling)
                        1 === e.nodeType && e !== t && n.push(e);
                    return n
                }
            }),
            p.fn.extend({
                has: function(e) {
                    var t = p(e, this)
                      , n = t.length;
                    return this.filter(function() {
                        for (var e = 0; e < n; e++)
                            if (p.contains(this, t[e]))
                                return !0
                    })
                },
                closest: function(e, t) {
                    for (var n, r = 0, i = this.length, o = [], s = x.test(e) || "string" != typeof e ? p(e, t || this.context) : 0; r < i; r++)
                        for (n = this[r]; n && n !== t; n = n.parentNode)
                            if (n.nodeType < 11 && (s ? s.index(n) > -1 : 1 === n.nodeType && p.find.matchesSelector(n, e))) {
                                o.push(n);
                                break
                            }
                    return this.pushStack(o.length > 1 ? p.unique(o) : o)
                },
                index: function(e) {
                    return e ? "string" == typeof e ? s.call(p(e), this[0]) : s.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
                },
                add: function(e, t) {
                    return this.pushStack(p.unique(p.merge(this.get(), p(e, t))))
                },
                addBack: function(e) {
                    return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
                }
            }),
            p.each({
                parent: function(e) {
                    var t = e.parentNode;
                    return t && 11 !== t.nodeType ? t : null
                },
                parents: function(e) {
                    return p.dir(e, "parentNode")
                },
                parentsUntil: function(e, t, n) {
                    return p.dir(e, "parentNode", n)
                },
                next: function(e) {
                    return S(e, "nextSibling")
                },
                prev: function(e) {
                    return S(e, "previousSibling")
                },
                nextAll: function(e) {
                    return p.dir(e, "nextSibling")
                },
                prevAll: function(e) {
                    return p.dir(e, "previousSibling")
                },
                nextUntil: function(e, t, n) {
                    return p.dir(e, "nextSibling", n)
                },
                prevUntil: function(e, t, n) {
                    return p.dir(e, "previousSibling", n)
                },
                siblings: function(e) {
                    return p.sibling((e.parentNode || {}).firstChild, e)
                },
                children: function(e) {
                    return p.sibling(e.firstChild)
                },
                contents: function(e) {
                    return e.contentDocument || p.merge([], e.childNodes)
                }
            }, function(e, t) {
                p.fn[e] = function(n, r) {
                    var i = p.map(this, t, n);
                    return "Until" !== e.slice(-5) && (r = n),
                    r && "string" == typeof r && (i = p.filter(r, i)),
                    this.length > 1 && (E[e] || p.unique(i),
                    k.test(e) && i.reverse()),
                    this.pushStack(i)
                }
            });
            var D, j = /\S+/g, A = {};
            function L() {
                f.removeEventListener("DOMContentLoaded", L, !1),
                e.removeEventListener("load", L, !1),
                p.ready()
            }
            p.Callbacks = function(e) {
                e = "string" == typeof e ? A[e] || function(e) {
                    var t = A[e] = {};
                    return p.each(e.match(j) || [], function(e, n) {
                        t[n] = !0
                    }),
                    t
                }(e) : p.extend({}, e);
                var t, n, r, i, o, s, a = [], u = !e.once && [], l = function(f) {
                    for (t = e.memory && f,
                    n = !0,
                    s = i || 0,
                    i = 0,
                    o = a.length,
                    r = !0; a && s < o; s++)
                        if (!1 === a[s].apply(f[0], f[1]) && e.stopOnFalse) {
                            t = !1;
                            break
                        }
                    r = !1,
                    a && (u ? u.length && l(u.shift()) : t ? a = [] : c.disable())
                }, c = {
                    add: function() {
                        if (a) {
                            var n = a.length;
                            !function t(n) {
                                p.each(n, function(n, r) {
                                    var i = p.type(r);
                                    "function" === i ? e.unique && c.has(r) || a.push(r) : r && r.length && "string" !== i && t(r)
                                })
                            }(arguments),
                            r ? o = a.length : t && (i = n,
                            l(t))
                        }
                        return this
                    },
                    remove: function() {
                        return a && p.each(arguments, function(e, t) {
                            for (var n; (n = p.inArray(t, a, n)) > -1; )
                                a.splice(n, 1),
                                r && (n <= o && o--,
                                n <= s && s--)
                        }),
                        this
                    },
                    has: function(e) {
                        return e ? p.inArray(e, a) > -1 : !(!a || !a.length)
                    },
                    empty: function() {
                        return a = [],
                        o = 0,
                        this
                    },
                    disable: function() {
                        return a = u = t = void 0,
                        this
                    },
                    disabled: function() {
                        return !a
                    },
                    lock: function() {
                        return u = void 0,
                        t || c.disable(),
                        this
                    },
                    locked: function() {
                        return !u
                    },
                    fireWith: function(e, t) {
                        return !a || n && !u || (t = [e, (t = t || []).slice ? t.slice() : t],
                        r ? u.push(t) : l(t)),
                        this
                    },
                    fire: function() {
                        return c.fireWith(this, arguments),
                        this
                    },
                    fired: function() {
                        return !!n
                    }
                };
                return c
            }
            ,
            p.extend({
                Deferred: function(e) {
                    var t = [["resolve", "done", p.Callbacks("once memory"), "resolved"], ["reject", "fail", p.Callbacks("once memory"), "rejected"], ["notify", "progress", p.Callbacks("memory")]]
                      , n = "pending"
                      , r = {
                        state: function() {
                            return n
                        },
                        always: function() {
                            return i.done(arguments).fail(arguments),
                            this
                        },
                        then: function() {
                            var e = arguments;
                            return p.Deferred(function(n) {
                                p.each(t, function(t, o) {
                                    var s = p.isFunction(e[t]) && e[t];
                                    i[o[1]](function() {
                                        var e = s && s.apply(this, arguments);
                                        e && p.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[o[0] + "With"](this === r ? n.promise() : this, s ? [e] : arguments)
                                    })
                                }),
                                e = null
                            }).promise()
                        },
                        promise: function(e) {
                            return null != e ? p.extend(e, r) : r
                        }
                    }
                      , i = {};
                    return r.pipe = r.then,
                    p.each(t, function(e, o) {
                        var s = o[2]
                          , a = o[3];
                        r[o[1]] = s.add,
                        a && s.add(function() {
                            n = a
                        }, t[1 ^ e][2].disable, t[2][2].lock),
                        i[o[0]] = function() {
                            return i[o[0] + "With"](this === i ? r : this, arguments),
                            this
                        }
                        ,
                        i[o[0] + "With"] = s.fireWith
                    }),
                    r.promise(i),
                    e && e.call(i, i),
                    i
                },
                when: function(e) {
                    var t, n, i, o = 0, s = r.call(arguments), a = s.length, u = 1 !== a || e && p.isFunction(e.promise) ? a : 0, l = 1 === u ? e : p.Deferred(), c = function(e, n, i) {
                        return function(o) {
                            n[e] = this,
                            i[e] = arguments.length > 1 ? r.call(arguments) : o,
                            i === t ? l.notifyWith(n, i) : --u || l.resolveWith(n, i)
                        }
                    };
                    if (a > 1)
                        for (t = new Array(a),
                        n = new Array(a),
                        i = new Array(a); o < a; o++)
                            s[o] && p.isFunction(s[o].promise) ? s[o].promise().done(c(o, i, s)).fail(l.reject).progress(c(o, n, t)) : --u;
                    return u || l.resolveWith(i, s),
                    l.promise()
                }
            }),
            p.fn.ready = function(e) {
                return p.ready.promise().done(e),
                this
            }
            ,
            p.extend({
                isReady: !1,
                readyWait: 1,
                holdReady: function(e) {
                    e ? p.readyWait++ : p.ready(!0)
                },
                ready: function(e) {
                    (!0 === e ? --p.readyWait : p.isReady) || (p.isReady = !0,
                    !0 !== e && --p.readyWait > 0 || (D.resolveWith(f, [p]),
                    p.fn.triggerHandler && (p(f).triggerHandler("ready"),
                    p(f).off("ready"))))
                }
            }),
            p.ready.promise = function(t) {
                return D || (D = p.Deferred(),
                "complete" === f.readyState ? setTimeout(p.ready) : (f.addEventListener("DOMContentLoaded", L, !1),
                e.addEventListener("load", L, !1))),
                D.promise(t)
            }
            ,
            p.ready.promise();
            var q = p.access = function(e, t, n, r, i, o, s) {
                var a = 0
                  , u = e.length
                  , l = null == n;
                if ("object" === p.type(n))
                    for (a in i = !0,
                    n)
                        p.access(e, t, a, n[a], !0, o, s);
                else if (void 0 !== r && (i = !0,
                p.isFunction(r) || (s = !0),
                l && (s ? (t.call(e, r),
                t = null) : (l = t,
                t = function(e, t, n) {
                    return l.call(p(e), n)
                }
                )),
                t))
                    for (; a < u; a++)
                        t(e[a], n, s ? r : r.call(e[a], a, t(e[a], n)));
                return i ? e : l ? t.call(e) : u ? t(e[0], n) : o
            }
            ;
            function H() {
                Object.defineProperty(this.cache = {}, 0, {
                    get: function() {
                        return {}
                    }
                }),
                this.expando = p.expando + H.uid++
            }
            p.acceptData = function(e) {
                return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
            }
            ,
            H.uid = 1,
            H.accepts = p.acceptData,
            H.prototype = {
                key: function(e) {
                    if (!H.accepts(e))
                        return 0;
                    var t = {}
                      , n = e[this.expando];
                    if (!n) {
                        n = H.uid++;
                        try {
                            t[this.expando] = {
                                value: n
                            },
                            Object.defineProperties(e, t)
                        } catch (r) {
                            t[this.expando] = n,
                            p.extend(e, t)
                        }
                    }
                    return this.cache[n] || (this.cache[n] = {}),
                    n
                },
                set: function(e, t, n) {
                    var r, i = this.key(e), o = this.cache[i];
                    if ("string" == typeof t)
                        o[t] = n;
                    else if (p.isEmptyObject(o))
                        p.extend(this.cache[i], t);
                    else
                        for (r in t)
                            o[r] = t[r];
                    return o
                },
                get: function(e, t) {
                    var n = this.cache[this.key(e)];
                    return void 0 === t ? n : n[t]
                },
                access: function(e, t, n) {
                    var r;
                    return void 0 === t || t && "string" == typeof t && void 0 === n ? void 0 !== (r = this.get(e, t)) ? r : this.get(e, p.camelCase(t)) : (this.set(e, t, n),
                    void 0 !== n ? n : t)
                },
                remove: function(e, t) {
                    var n, r, i, o = this.key(e), s = this.cache[o];
                    if (void 0 === t)
                        this.cache[o] = {};
                    else {
                        p.isArray(t) ? r = t.concat(t.map(p.camelCase)) : (i = p.camelCase(t),
                        r = t in s ? [t, i] : (r = i)in s ? [r] : r.match(j) || []),
                        n = r.length;
                        for (; n--; )
                            delete s[r[n]]
                    }
                },
                hasData: function(e) {
                    return !p.isEmptyObject(this.cache[e[this.expando]] || {})
                },
                discard: function(e) {
                    e[this.expando] && delete this.cache[e[this.expando]]
                }
            };
            var O = new H
              , F = new H
              , P = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
              , R = /([A-Z])/g;
            function M(e, t, n) {
                var r;
                if (void 0 === n && 1 === e.nodeType)
                    if (r = "data-" + t.replace(R, "-$1").toLowerCase(),
                    "string" == typeof (n = e.getAttribute(r))) {
                        try {
                            n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : P.test(n) ? p.parseJSON(n) : n)
                        } catch (e) {}
                        F.set(e, t, n)
                    } else
                        n = void 0;
                return n
            }
            p.extend({
                hasData: function(e) {
                    return F.hasData(e) || O.hasData(e)
                },
                data: function(e, t, n) {
                    return F.access(e, t, n)
                },
                removeData: function(e, t) {
                    F.remove(e, t)
                },
                _data: function(e, t, n) {
                    return O.access(e, t, n)
                },
                _removeData: function(e, t) {
                    O.remove(e, t)
                }
            }),
            p.fn.extend({
                data: function(e, t) {
                    var n, r, i, o = this[0], s = o && o.attributes;
                    if (void 0 === e) {
                        if (this.length && (i = F.get(o),
                        1 === o.nodeType && !O.get(o, "hasDataAttrs"))) {
                            for (n = s.length; n--; )
                                s[n] && 0 === (r = s[n].name).indexOf("data-") && (r = p.camelCase(r.slice(5)),
                                M(o, r, i[r]));
                            O.set(o, "hasDataAttrs", !0)
                        }
                        return i
                    }
                    return "object" == typeof e ? this.each(function() {
                        F.set(this, e)
                    }) : q(this, function(t) {
                        var n, r = p.camelCase(e);
                        if (o && void 0 === t)
                            return void 0 !== (n = F.get(o, e)) ? n : void 0 !== (n = F.get(o, r)) ? n : void 0 !== (n = M(o, r, void 0)) ? n : void 0;
                        this.each(function() {
                            var n = F.get(this, r);
                            F.set(this, r, t),
                            -1 !== e.indexOf("-") && void 0 !== n && F.set(this, e, t)
                        })
                    }, null, t, arguments.length > 1, null, !0)
                },
                removeData: function(e) {
                    return this.each(function() {
                        F.remove(this, e)
                    })
                }
            }),
            p.extend({
                queue: function(e, t, n) {
                    var r;
                    if (e)
                        return t = (t || "fx") + "queue",
                        r = O.get(e, t),
                        n && (!r || p.isArray(n) ? r = O.access(e, t, p.makeArray(n)) : r.push(n)),
                        r || []
                },
                dequeue: function(e, t) {
                    t = t || "fx";
                    var n = p.queue(e, t)
                      , r = n.length
                      , i = n.shift()
                      , o = p._queueHooks(e, t);
                    "inprogress" === i && (i = n.shift(),
                    r--),
                    i && ("fx" === t && n.unshift("inprogress"),
                    delete o.stop,
                    i.call(e, function() {
                        p.dequeue(e, t)
                    }, o)),
                    !r && o && o.empty.fire()
                },
                _queueHooks: function(e, t) {
                    var n = t + "queueHooks";
                    return O.get(e, n) || O.access(e, n, {
                        empty: p.Callbacks("once memory").add(function() {
                            O.remove(e, [t + "queue", n])
                        })
                    })
                }
            }),
            p.fn.extend({
                queue: function(e, t) {
                    var n = 2;
                    return "string" != typeof e && (t = e,
                    e = "fx",
                    n--),
                    arguments.length < n ? p.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                        var n = p.queue(this, e, t);
                        p._queueHooks(this, e),
                        "fx" === e && "inprogress" !== n[0] && p.dequeue(this, e)
                    })
                },
                dequeue: function(e) {
                    return this.each(function() {
                        p.dequeue(this, e)
                    })
                },
                clearQueue: function(e) {
                    return this.queue(e || "fx", [])
                },
                promise: function(e, t) {
                    var n, r = 1, i = p.Deferred(), o = this, s = this.length, a = function() {
                        --r || i.resolveWith(o, [o])
                    };
                    for ("string" != typeof e && (t = e,
                    e = void 0),
                    e = e || "fx"; s--; )
                        (n = O.get(o[s], e + "queueHooks")) && n.empty && (r++,
                        n.empty.add(a));
                    return a(),
                    i.promise(t)
                }
            });
            var W, $, I = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, B = ["Top", "Right", "Bottom", "Left"], _ = function(e, t) {
                return e = t || e,
                "none" === p.css(e, "display") || !p.contains(e.ownerDocument, e)
            }, z = /^(?:checkbox|radio)$/i;
            W = f.createDocumentFragment().appendChild(f.createElement("div")),
            ($ = f.createElement("input")).setAttribute("type", "radio"),
            $.setAttribute("checked", "checked"),
            $.setAttribute("name", "t"),
            W.appendChild($),
            c.checkClone = W.cloneNode(!0).cloneNode(!0).lastChild.checked,
            W.innerHTML = "<textarea>x</textarea>",
            c.noCloneChecked = !!W.cloneNode(!0).lastChild.defaultValue;
            c.focusinBubbles = "onfocusin"in e;
            var X = /^key/
              , U = /^(?:mouse|pointer|contextmenu)|click/
              , V = /^(?:focusinfocus|focusoutblur)$/
              , Y = /^([^.]*)(?:\.(.+)|)$/;
            function G() {
                return !0
            }
            function Q() {
                return !1
            }
            function J() {
                try {
                    return f.activeElement
                } catch (e) {}
            }
            p.event = {
                global: {},
                add: function(e, t, n, r, i) {
                    var o, s, a, u, l, c, f, d, h, g, m, v = O.get(e);
                    if (v)
                        for (n.handler && (n = (o = n).handler,
                        i = o.selector),
                        n.guid || (n.guid = p.guid++),
                        (u = v.events) || (u = v.events = {}),
                        (s = v.handle) || (s = v.handle = function(t) {
                            return void 0 !== p && p.event.triggered !== t.type ? p.event.dispatch.apply(e, arguments) : void 0
                        }
                        ),
                        l = (t = (t || "").match(j) || [""]).length; l--; )
                            h = m = (a = Y.exec(t[l]) || [])[1],
                            g = (a[2] || "").split(".").sort(),
                            h && (f = p.event.special[h] || {},
                            h = (i ? f.delegateType : f.bindType) || h,
                            f = p.event.special[h] || {},
                            c = p.extend({
                                type: h,
                                origType: m,
                                data: r,
                                handler: n,
                                guid: n.guid,
                                selector: i,
                                needsContext: i && p.expr.match.needsContext.test(i),
                                namespace: g.join(".")
                            }, o),
                            (d = u[h]) || ((d = u[h] = []).delegateCount = 0,
                            f.setup && !1 !== f.setup.call(e, r, g, s) || e.addEventListener && e.addEventListener(h, s, !1)),
                            f.add && (f.add.call(e, c),
                            c.handler.guid || (c.handler.guid = n.guid)),
                            i ? d.splice(d.delegateCount++, 0, c) : d.push(c),
                            p.event.global[h] = !0)
                },
                remove: function(e, t, n, r, i) {
                    var o, s, a, u, l, c, f, d, h, g, m, v = O.hasData(e) && O.get(e);
                    if (v && (u = v.events)) {
                        for (l = (t = (t || "").match(j) || [""]).length; l--; )
                            if (h = m = (a = Y.exec(t[l]) || [])[1],
                            g = (a[2] || "").split(".").sort(),
                            h) {
                                for (f = p.event.special[h] || {},
                                d = u[h = (r ? f.delegateType : f.bindType) || h] || [],
                                a = a[2] && new RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                                s = o = d.length; o--; )
                                    c = d[o],
                                    !i && m !== c.origType || n && n.guid !== c.guid || a && !a.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (d.splice(o, 1),
                                    c.selector && d.delegateCount--,
                                    f.remove && f.remove.call(e, c));
                                s && !d.length && (f.teardown && !1 !== f.teardown.call(e, g, v.handle) || p.removeEvent(e, h, v.handle),
                                delete u[h])
                            } else
                                for (h in u)
                                    p.event.remove(e, h + t[l], n, r, !0);
                        p.isEmptyObject(u) && (delete v.handle,
                        O.remove(e, "events"))
                    }
                },
                trigger: function(t, n, r, i) {
                    var o, s, a, u, c, d, h, g = [r || f], m = l.call(t, "type") ? t.type : t, v = l.call(t, "namespace") ? t.namespace.split(".") : [];
                    if (s = a = r = r || f,
                    3 !== r.nodeType && 8 !== r.nodeType && !V.test(m + p.event.triggered) && (m.indexOf(".") >= 0 && (v = m.split("."),
                    m = v.shift(),
                    v.sort()),
                    c = m.indexOf(":") < 0 && "on" + m,
                    (t = t[p.expando] ? t : new p.Event(m,"object" == typeof t && t)).isTrigger = i ? 2 : 3,
                    t.namespace = v.join("."),
                    t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + v.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
                    t.result = void 0,
                    t.target || (t.target = r),
                    n = null == n ? [t] : p.makeArray(n, [t]),
                    h = p.event.special[m] || {},
                    i || !h.trigger || !1 !== h.trigger.apply(r, n))) {
                        if (!i && !h.noBubble && !p.isWindow(r)) {
                            for (u = h.delegateType || m,
                            V.test(u + m) || (s = s.parentNode); s; s = s.parentNode)
                                g.push(s),
                                a = s;
                            a === (r.ownerDocument || f) && g.push(a.defaultView || a.parentWindow || e)
                        }
                        for (o = 0; (s = g[o++]) && !t.isPropagationStopped(); )
                            t.type = o > 1 ? u : h.bindType || m,
                            (d = (O.get(s, "events") || {})[t.type] && O.get(s, "handle")) && d.apply(s, n),
                            (d = c && s[c]) && d.apply && p.acceptData(s) && (t.result = d.apply(s, n),
                            !1 === t.result && t.preventDefault());
                        return t.type = m,
                        i || t.isDefaultPrevented() || h._default && !1 !== h._default.apply(g.pop(), n) || !p.acceptData(r) || c && p.isFunction(r[m]) && !p.isWindow(r) && ((a = r[c]) && (r[c] = null),
                        p.event.triggered = m,
                        r[m](),
                        p.event.triggered = void 0,
                        a && (r[c] = a)),
                        t.result
                    }
                },
                dispatch: function(e) {
                    e = p.event.fix(e);
                    var t, n, i, o, s, a, u = r.call(arguments), l = (O.get(this, "events") || {})[e.type] || [], c = p.event.special[e.type] || {};
                    if (u[0] = e,
                    e.delegateTarget = this,
                    !c.preDispatch || !1 !== c.preDispatch.call(this, e)) {
                        for (a = p.event.handlers.call(this, e, l),
                        t = 0; (o = a[t++]) && !e.isPropagationStopped(); )
                            for (e.currentTarget = o.elem,
                            n = 0; (s = o.handlers[n++]) && !e.isImmediatePropagationStopped(); )
                                e.namespace_re && !e.namespace_re.test(s.namespace) || (e.handleObj = s,
                                e.data = s.data,
                                void 0 !== (i = ((p.event.special[s.origType] || {}).handle || s.handler).apply(o.elem, u)) && !1 === (e.result = i) && (e.preventDefault(),
                                e.stopPropagation()));
                        return c.postDispatch && c.postDispatch.call(this, e),
                        e.result
                    }
                },
                handlers: function(e, t) {
                    var n, r, i, o, s = [], a = t.delegateCount, u = e.target;
                    if (a && u.nodeType && (!e.button || "click" !== e.type))
                        for (; u !== this; u = u.parentNode || this)
                            if (!0 !== u.disabled || "click" !== e.type) {
                                for (r = [],
                                n = 0; n < a; n++)
                                    void 0 === r[i = (o = t[n]).selector + " "] && (r[i] = o.needsContext ? p(i, this).index(u) >= 0 : p.find(i, this, null, [u]).length),
                                    r[i] && r.push(o);
                                r.length && s.push({
                                    elem: u,
                                    handlers: r
                                })
                            }
                    return a < t.length && s.push({
                        elem: this,
                        handlers: t.slice(a)
                    }),
                    s
                },
                props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
                fixHooks: {},
                keyHooks: {
                    props: "char charCode key keyCode".split(" "),
                    filter: function(e, t) {
                        return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode),
                        e
                    }
                },
                mouseHooks: {
                    props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                    filter: function(e, t) {
                        var n, r, i, o = t.button;
                        return null == e.pageX && null != t.clientX && (r = (n = e.target.ownerDocument || f).documentElement,
                        i = n.body,
                        e.pageX = t.clientX + (r && r.scrollLeft || i && i.scrollLeft || 0) - (r && r.clientLeft || i && i.clientLeft || 0),
                        e.pageY = t.clientY + (r && r.scrollTop || i && i.scrollTop || 0) - (r && r.clientTop || i && i.clientTop || 0)),
                        e.which || void 0 === o || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0),
                        e
                    }
                },
                fix: function(e) {
                    if (e[p.expando])
                        return e;
                    var t, n, r, i = e.type, o = e, s = this.fixHooks[i];
                    for (s || (this.fixHooks[i] = s = U.test(i) ? this.mouseHooks : X.test(i) ? this.keyHooks : {}),
                    r = s.props ? this.props.concat(s.props) : this.props,
                    e = new p.Event(o),
                    t = r.length; t--; )
                        e[n = r[t]] = o[n];
                    return e.target || (e.target = f),
                    3 === e.target.nodeType && (e.target = e.target.parentNode),
                    s.filter ? s.filter(e, o) : e
                },
                special: {
                    load: {
                        noBubble: !0
                    },
                    focus: {
                        trigger: function() {
                            if (this !== J() && this.focus)
                                return this.focus(),
                                !1
                        },
                        delegateType: "focusin"
                    },
                    blur: {
                        trigger: function() {
                            if (this === J() && this.blur)
                                return this.blur(),
                                !1
                        },
                        delegateType: "focusout"
                    },
                    click: {
                        trigger: function() {
                            if ("checkbox" === this.type && this.click && p.nodeName(this, "input"))
                                return this.click(),
                                !1
                        },
                        _default: function(e) {
                            return p.nodeName(e.target, "a")
                        }
                    },
                    beforeunload: {
                        postDispatch: function(e) {
                            void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                        }
                    }
                },
                simulate: function(e, t, n, r) {
                    var i = p.extend(new p.Event, n, {
                        type: e,
                        isSimulated: !0,
                        originalEvent: {}
                    });
                    r ? p.event.trigger(i, null, t) : p.event.dispatch.call(t, i),
                    i.isDefaultPrevented() && n.preventDefault()
                }
            },
            p.removeEvent = function(e, t, n) {
                e.removeEventListener && e.removeEventListener(t, n, !1)
            }
            ,
            p.Event = function(e, t) {
                if (!(this instanceof p.Event))
                    return new p.Event(e,t);
                e && e.type ? (this.originalEvent = e,
                this.type = e.type,
                this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? G : Q) : this.type = e,
                t && p.extend(this, t),
                this.timeStamp = e && e.timeStamp || p.now(),
                this[p.expando] = !0
            }
            ,
            p.Event.prototype = {
                isDefaultPrevented: Q,
                isPropagationStopped: Q,
                isImmediatePropagationStopped: Q,
                preventDefault: function() {
                    var e = this.originalEvent;
                    this.isDefaultPrevented = G,
                    e && e.preventDefault && e.preventDefault()
                },
                stopPropagation: function() {
                    var e = this.originalEvent;
                    this.isPropagationStopped = G,
                    e && e.stopPropagation && e.stopPropagation()
                },
                stopImmediatePropagation: function() {
                    var e = this.originalEvent;
                    this.isImmediatePropagationStopped = G,
                    e && e.stopImmediatePropagation && e.stopImmediatePropagation(),
                    this.stopPropagation()
                }
            },
            p.each({
                mouseenter: "mouseover",
                mouseleave: "mouseout",
                pointerenter: "pointerover",
                pointerleave: "pointerout"
            }, function(e, t) {
                p.event.special[e] = {
                    delegateType: t,
                    bindType: t,
                    handle: function(e) {
                        var n, r = e.relatedTarget, i = e.handleObj;
                        return r && (r === this || p.contains(this, r)) || (e.type = i.origType,
                        n = i.handler.apply(this, arguments),
                        e.type = t),
                        n
                    }
                }
            }),
            c.focusinBubbles || p.each({
                focus: "focusin",
                blur: "focusout"
            }, function(e, t) {
                var n = function(e) {
                    p.event.simulate(t, e.target, p.event.fix(e), !0)
                };
                p.event.special[t] = {
                    setup: function() {
                        var r = this.ownerDocument || this
                          , i = O.access(r, t);
                        i || r.addEventListener(e, n, !0),
                        O.access(r, t, (i || 0) + 1)
                    },
                    teardown: function() {
                        var r = this.ownerDocument || this
                          , i = O.access(r, t) - 1;
                        i ? O.access(r, t, i) : (r.removeEventListener(e, n, !0),
                        O.remove(r, t))
                    }
                }
            }),
            p.fn.extend({
                on: function(e, t, n, r, i) {
                    var o, s;
                    if ("object" == typeof e) {
                        for (s in "string" != typeof t && (n = n || t,
                        t = void 0),
                        e)
                            this.on(s, t, n, e[s], i);
                        return this
                    }
                    if (null == n && null == r ? (r = t,
                    n = t = void 0) : null == r && ("string" == typeof t ? (r = n,
                    n = void 0) : (r = n,
                    n = t,
                    t = void 0)),
                    !1 === r)
                        r = Q;
                    else if (!r)
                        return this;
                    return 1 === i && (o = r,
                    (r = function(e) {
                        return p().off(e),
                        o.apply(this, arguments)
                    }
                    ).guid = o.guid || (o.guid = p.guid++)),
                    this.each(function() {
                        p.event.add(this, e, r, n, t)
                    })
                },
                one: function(e, t, n, r) {
                    return this.on(e, t, n, r, 1)
                },
                off: function(e, t, n) {
                    var r, i;
                    if (e && e.preventDefault && e.handleObj)
                        return r = e.handleObj,
                        p(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler),
                        this;
                    if ("object" == typeof e) {
                        for (i in e)
                            this.off(i, t, e[i]);
                        return this
                    }
                    return !1 !== t && "function" != typeof t || (n = t,
                    t = void 0),
                    !1 === n && (n = Q),
                    this.each(function() {
                        p.event.remove(this, e, n, t)
                    })
                },
                trigger: function(e, t) {
                    return this.each(function() {
                        p.event.trigger(e, t, this)
                    })
                },
                triggerHandler: function(e, t) {
                    var n = this[0];
                    if (n)
                        return p.event.trigger(e, t, n, !0)
                }
            });
            var K = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi
              , Z = /<([\w:]+)/
              , ee = /<|&#?\w+;/
              , te = /<(?:script|style|link)/i
              , ne = /checked\s*(?:[^=]|=\s*.checked.)/i
              , re = /^$|\/(?:java|ecma)script/i
              , ie = /^true\/(.*)/
              , oe = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
              , se = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                thead: [1, "<table>", "</table>"],
                col: [2, "<table><colgroup>", "</colgroup></table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: [0, "", ""]
            };
            function ae(e, t) {
                return p.nodeName(e, "table") && p.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
            }
            function ue(e) {
                return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
                e
            }
            function le(e) {
                var t = ie.exec(e.type);
                return t ? e.type = t[1] : e.removeAttribute("type"),
                e
            }
            function ce(e, t) {
                for (var n = 0, r = e.length; n < r; n++)
                    O.set(e[n], "globalEval", !t || O.get(t[n], "globalEval"))
            }
            function fe(e, t) {
                var n, r, i, o, s, a, u, l;
                if (1 === t.nodeType) {
                    if (O.hasData(e) && (o = O.access(e),
                    s = O.set(t, o),
                    l = o.events))
                        for (i in delete s.handle,
                        s.events = {},
                        l)
                            for (n = 0,
                            r = l[i].length; n < r; n++)
                                p.event.add(t, i, l[i][n]);
                    F.hasData(e) && (a = F.access(e),
                    u = p.extend({}, a),
                    F.set(t, u))
                }
            }
            function pe(e, t) {
                var n = e.getElementsByTagName ? e.getElementsByTagName(t || "*") : e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
                return void 0 === t || t && p.nodeName(e, t) ? p.merge([e], n) : n
            }
            se.optgroup = se.option,
            se.tbody = se.tfoot = se.colgroup = se.caption = se.thead,
            se.th = se.td,
            p.extend({
                clone: function(e, t, n) {
                    var r, i, o, s, a, u, l, f = e.cloneNode(!0), d = p.contains(e.ownerDocument, e);
                    if (!(c.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || p.isXMLDoc(e)))
                        for (s = pe(f),
                        r = 0,
                        i = (o = pe(e)).length; r < i; r++)
                            a = o[r],
                            u = s[r],
                            l = void 0,
                            "input" === (l = u.nodeName.toLowerCase()) && z.test(a.type) ? u.checked = a.checked : "input" !== l && "textarea" !== l || (u.defaultValue = a.defaultValue);
                    if (t)
                        if (n)
                            for (o = o || pe(e),
                            s = s || pe(f),
                            r = 0,
                            i = o.length; r < i; r++)
                                fe(o[r], s[r]);
                        else
                            fe(e, f);
                    return (s = pe(f, "script")).length > 0 && ce(s, !d && pe(e, "script")),
                    f
                },
                buildFragment: function(e, t, n, r) {
                    for (var i, o, s, a, u, l, c = t.createDocumentFragment(), f = [], d = 0, h = e.length; d < h; d++)
                        if ((i = e[d]) || 0 === i)
                            if ("object" === p.type(i))
                                p.merge(f, i.nodeType ? [i] : i);
                            else if (ee.test(i)) {
                                for (o = o || c.appendChild(t.createElement("div")),
                                s = (Z.exec(i) || ["", ""])[1].toLowerCase(),
                                a = se[s] || se._default,
                                o.innerHTML = a[1] + i.replace(K, "<$1></$2>") + a[2],
                                l = a[0]; l--; )
                                    o = o.lastChild;
                                p.merge(f, o.childNodes),
                                (o = c.firstChild).textContent = ""
                            } else
                                f.push(t.createTextNode(i));
                    for (c.textContent = "",
                    d = 0; i = f[d++]; )
                        if ((!r || -1 === p.inArray(i, r)) && (u = p.contains(i.ownerDocument, i),
                        o = pe(c.appendChild(i), "script"),
                        u && ce(o),
                        n))
                            for (l = 0; i = o[l++]; )
                                re.test(i.type || "") && n.push(i);
                    return c
                },
                cleanData: function(e) {
                    for (var t, n, r, i, o = p.event.special, s = 0; void 0 !== (n = e[s]); s++) {
                        if (p.acceptData(n) && (i = n[O.expando]) && (t = O.cache[i])) {
                            if (t.events)
                                for (r in t.events)
                                    o[r] ? p.event.remove(n, r) : p.removeEvent(n, r, t.handle);
                            O.cache[i] && delete O.cache[i]
                        }
                        delete F.cache[n[F.expando]]
                    }
                }
            }),
            p.fn.extend({
                text: function(e) {
                    return q(this, function(e) {
                        return void 0 === e ? p.text(this) : this.empty().each(function() {
                            1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                        })
                    }, null, e, arguments.length)
                },
                append: function() {
                    return this.domManip(arguments, function(e) {
                        1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || ae(this, e).appendChild(e)
                    })
                },
                prepend: function() {
                    return this.domManip(arguments, function(e) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var t = ae(this, e);
                            t.insertBefore(e, t.firstChild)
                        }
                    })
                },
                before: function() {
                    return this.domManip(arguments, function(e) {
                        this.parentNode && this.parentNode.insertBefore(e, this)
                    })
                },
                after: function() {
                    return this.domManip(arguments, function(e) {
                        this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                    })
                },
                remove: function(e, t) {
                    for (var n, r = e ? p.filter(e, this) : this, i = 0; null != (n = r[i]); i++)
                        t || 1 !== n.nodeType || p.cleanData(pe(n)),
                        n.parentNode && (t && p.contains(n.ownerDocument, n) && ce(pe(n, "script")),
                        n.parentNode.removeChild(n));
                    return this
                },
                empty: function() {
                    for (var e, t = 0; null != (e = this[t]); t++)
                        1 === e.nodeType && (p.cleanData(pe(e, !1)),
                        e.textContent = "");
                    return this
                },
                clone: function(e, t) {
                    return e = null != e && e,
                    t = null == t ? e : t,
                    this.map(function() {
                        return p.clone(this, e, t)
                    })
                },
                html: function(e) {
                    return q(this, function(e) {
                        var t = this[0] || {}
                          , n = 0
                          , r = this.length;
                        if (void 0 === e && 1 === t.nodeType)
                            return t.innerHTML;
                        if ("string" == typeof e && !te.test(e) && !se[(Z.exec(e) || ["", ""])[1].toLowerCase()]) {
                            e = e.replace(K, "<$1></$2>");
                            try {
                                for (; n < r; n++)
                                    1 === (t = this[n] || {}).nodeType && (p.cleanData(pe(t, !1)),
                                    t.innerHTML = e);
                                t = 0
                            } catch (e) {}
                        }
                        t && this.empty().append(e)
                    }, null, e, arguments.length)
                },
                replaceWith: function() {
                    var e = arguments[0];
                    return this.domManip(arguments, function(t) {
                        e = this.parentNode,
                        p.cleanData(pe(this)),
                        e && e.replaceChild(t, this)
                    }),
                    e && (e.length || e.nodeType) ? this : this.remove()
                },
                detach: function(e) {
                    return this.remove(e, !0)
                },
                domManip: function(e, t) {
                    e = i.apply([], e);
                    var n, r, o, s, a, u, l = 0, f = this.length, d = this, h = f - 1, g = e[0], m = p.isFunction(g);
                    if (m || f > 1 && "string" == typeof g && !c.checkClone && ne.test(g))
                        return this.each(function(n) {
                            var r = d.eq(n);
                            m && (e[0] = g.call(this, n, r.html())),
                            r.domManip(e, t)
                        });
                    if (f && (r = (n = p.buildFragment(e, this[0].ownerDocument, !1, this)).firstChild,
                    1 === n.childNodes.length && (n = r),
                    r)) {
                        for (s = (o = p.map(pe(n, "script"), ue)).length; l < f; l++)
                            a = n,
                            l !== h && (a = p.clone(a, !0, !0),
                            s && p.merge(o, pe(a, "script"))),
                            t.call(this[l], a, l);
                        if (s)
                            for (u = o[o.length - 1].ownerDocument,
                            p.map(o, le),
                            l = 0; l < s; l++)
                                a = o[l],
                                re.test(a.type || "") && !O.access(a, "globalEval") && p.contains(u, a) && (a.src ? p._evalUrl && p._evalUrl(a.src) : p.globalEval(a.textContent.replace(oe, "")))
                    }
                    return this
                }
            }),
            p.each({
                appendTo: "append",
                prependTo: "prepend",
                insertBefore: "before",
                insertAfter: "after",
                replaceAll: "replaceWith"
            }, function(e, t) {
                p.fn[e] = function(e) {
                    for (var n, r = [], i = p(e), s = i.length - 1, a = 0; a <= s; a++)
                        n = a === s ? this : this.clone(!0),
                        p(i[a])[t](n),
                        o.apply(r, n.get());
                    return this.pushStack(r)
                }
            });
            var de, he = {};
            function ge(t, n) {
                var r, i = p(n.createElement(t)).appendTo(n.body), o = e.getDefaultComputedStyle && (r = e.getDefaultComputedStyle(i[0])) ? r.display : p.css(i[0], "display");
                return i.detach(),
                o
            }
            function me(e) {
                var t = f
                  , n = he[e];
                return n || ("none" !== (n = ge(e, t)) && n || ((t = (de = (de || p("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement))[0].contentDocument).write(),
                t.close(),
                n = ge(e, t),
                de.detach()),
                he[e] = n),
                n
            }
            var ve = /^margin/
              , ye = new RegExp("^(" + I + ")(?!px)[a-z%]+$","i")
              , xe = function(t) {
                return t.ownerDocument.defaultView.opener ? t.ownerDocument.defaultView.getComputedStyle(t, null) : e.getComputedStyle(t, null)
            };
            function be(e, t, n) {
                var r, i, o, s, a = e.style;
                return (n = n || xe(e)) && (s = n.getPropertyValue(t) || n[t]),
                n && ("" !== s || p.contains(e.ownerDocument, e) || (s = p.style(e, t)),
                ye.test(s) && ve.test(t) && (r = a.width,
                i = a.minWidth,
                o = a.maxWidth,
                a.minWidth = a.maxWidth = a.width = s,
                s = n.width,
                a.width = r,
                a.minWidth = i,
                a.maxWidth = o)),
                void 0 !== s ? s + "" : s
            }
            function we(e, t) {
                return {
                    get: function() {
                        if (!e())
                            return (this.get = t).apply(this, arguments);
                        delete this.get
                    }
                }
            }
            !function() {
                var t, n, r = f.documentElement, i = f.createElement("div"), o = f.createElement("div");
                function s() {
                    o.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",
                    o.innerHTML = "",
                    r.appendChild(i);
                    var s = e.getComputedStyle(o, null);
                    t = "1%" !== s.top,
                    n = "4px" === s.width,
                    r.removeChild(i)
                }
                o.style && (o.style.backgroundClip = "content-box",
                o.cloneNode(!0).style.backgroundClip = "",
                c.clearCloneStyle = "content-box" === o.style.backgroundClip,
                i.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",
                i.appendChild(o),
                e.getComputedStyle && p.extend(c, {
                    pixelPosition: function() {
                        return s(),
                        t
                    },
                    boxSizingReliable: function() {
                        return null == n && s(),
                        n
                    },
                    reliableMarginRight: function() {
                        var t, n = o.appendChild(f.createElement("div"));
                        return n.style.cssText = o.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
                        n.style.marginRight = n.style.width = "0",
                        o.style.width = "1px",
                        r.appendChild(i),
                        t = !parseFloat(e.getComputedStyle(n, null).marginRight),
                        r.removeChild(i),
                        o.removeChild(n),
                        t
                    }
                }))
            }(),
            p.swap = function(e, t, n, r) {
                var i, o, s = {};
                for (o in t)
                    s[o] = e.style[o],
                    e.style[o] = t[o];
                for (o in i = n.apply(e, r || []),
                t)
                    e.style[o] = s[o];
                return i
            }
            ;
            var Te = /^(none|table(?!-c[ea]).+)/
              , Ce = new RegExp("^(" + I + ")(.*)$","i")
              , Ne = new RegExp("^([+-])=(" + I + ")","i")
              , ke = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            }
              , Ee = {
                letterSpacing: "0",
                fontWeight: "400"
            }
              , Se = ["Webkit", "O", "Moz", "ms"];
            function De(e, t) {
                if (t in e)
                    return t;
                for (var n = t[0].toUpperCase() + t.slice(1), r = t, i = Se.length; i--; )
                    if ((t = Se[i] + n)in e)
                        return t;
                return r
            }
            function je(e, t, n) {
                var r = Ce.exec(t);
                return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
            }
            function Ae(e, t, n, r, i) {
                for (var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, s = 0; o < 4; o += 2)
                    "margin" === n && (s += p.css(e, n + B[o], !0, i)),
                    r ? ("content" === n && (s -= p.css(e, "padding" + B[o], !0, i)),
                    "margin" !== n && (s -= p.css(e, "border" + B[o] + "Width", !0, i))) : (s += p.css(e, "padding" + B[o], !0, i),
                    "padding" !== n && (s += p.css(e, "border" + B[o] + "Width", !0, i)));
                return s
            }
            function Le(e, t, n) {
                var r = !0
                  , i = "width" === t ? e.offsetWidth : e.offsetHeight
                  , o = xe(e)
                  , s = "border-box" === p.css(e, "boxSizing", !1, o);
                if (i <= 0 || null == i) {
                    if (((i = be(e, t, o)) < 0 || null == i) && (i = e.style[t]),
                    ye.test(i))
                        return i;
                    r = s && (c.boxSizingReliable() || i === e.style[t]),
                    i = parseFloat(i) || 0
                }
                return i + Ae(e, t, n || (s ? "border" : "content"), r, o) + "px"
            }
            function qe(e, t) {
                for (var n, r, i, o = [], s = 0, a = e.length; s < a; s++)
                    (r = e[s]).style && (o[s] = O.get(r, "olddisplay"),
                    n = r.style.display,
                    t ? (o[s] || "none" !== n || (r.style.display = ""),
                    "" === r.style.display && _(r) && (o[s] = O.access(r, "olddisplay", me(r.nodeName)))) : (i = _(r),
                    "none" === n && i || O.set(r, "olddisplay", i ? n : p.css(r, "display"))));
                for (s = 0; s < a; s++)
                    (r = e[s]).style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? o[s] || "" : "none"));
                return e
            }
            function He(e, t, n, r, i) {
                return new He.prototype.init(e,t,n,r,i)
            }
            p.extend({
                cssHooks: {
                    opacity: {
                        get: function(e, t) {
                            if (t) {
                                var n = be(e, "opacity");
                                return "" === n ? "1" : n
                            }
                        }
                    }
                },
                cssNumber: {
                    columnCount: !0,
                    fillOpacity: !0,
                    flexGrow: !0,
                    flexShrink: !0,
                    fontWeight: !0,
                    lineHeight: !0,
                    opacity: !0,
                    order: !0,
                    orphans: !0,
                    widows: !0,
                    zIndex: !0,
                    zoom: !0
                },
                cssProps: {
                    float: "cssFloat"
                },
                style: function(e, t, n, r) {
                    if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                        var i, o, s, a = p.camelCase(t), u = e.style;
                        if (t = p.cssProps[a] || (p.cssProps[a] = De(u, a)),
                        s = p.cssHooks[t] || p.cssHooks[a],
                        void 0 === n)
                            return s && "get"in s && void 0 !== (i = s.get(e, !1, r)) ? i : u[t];
                        "string" === (o = typeof n) && (i = Ne.exec(n)) && (n = (i[1] + 1) * i[2] + parseFloat(p.css(e, t)),
                        o = "number"),
                        null != n && n == n && ("number" !== o || p.cssNumber[a] || (n += "px"),
                        c.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (u[t] = "inherit"),
                        s && "set"in s && void 0 === (n = s.set(e, n, r)) || (u[t] = n))
                    }
                },
                css: function(e, t, n, r) {
                    var i, o, s, a = p.camelCase(t);
                    return t = p.cssProps[a] || (p.cssProps[a] = De(e.style, a)),
                    (s = p.cssHooks[t] || p.cssHooks[a]) && "get"in s && (i = s.get(e, !0, n)),
                    void 0 === i && (i = be(e, t, r)),
                    "normal" === i && t in Ee && (i = Ee[t]),
                    "" === n || n ? (o = parseFloat(i),
                    !0 === n || p.isNumeric(o) ? o || 0 : i) : i
                }
            }),
            p.each(["height", "width"], function(e, t) {
                p.cssHooks[t] = {
                    get: function(e, n, r) {
                        if (n)
                            return Te.test(p.css(e, "display")) && 0 === e.offsetWidth ? p.swap(e, ke, function() {
                                return Le(e, t, r)
                            }) : Le(e, t, r)
                    },
                    set: function(e, n, r) {
                        var i = r && xe(e);
                        return je(0, n, r ? Ae(e, t, r, "border-box" === p.css(e, "boxSizing", !1, i), i) : 0)
                    }
                }
            }),
            p.cssHooks.marginRight = we(c.reliableMarginRight, function(e, t) {
                if (t)
                    return p.swap(e, {
                        display: "inline-block"
                    }, be, [e, "marginRight"])
            }),
            p.each({
                margin: "",
                padding: "",
                border: "Width"
            }, function(e, t) {
                p.cssHooks[e + t] = {
                    expand: function(n) {
                        for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; r < 4; r++)
                            i[e + B[r] + t] = o[r] || o[r - 2] || o[0];
                        return i
                    }
                },
                ve.test(e) || (p.cssHooks[e + t].set = je)
            }),
            p.fn.extend({
                css: function(e, t) {
                    return q(this, function(e, t, n) {
                        var r, i, o = {}, s = 0;
                        if (p.isArray(t)) {
                            for (r = xe(e),
                            i = t.length; s < i; s++)
                                o[t[s]] = p.css(e, t[s], !1, r);
                            return o
                        }
                        return void 0 !== n ? p.style(e, t, n) : p.css(e, t)
                    }, e, t, arguments.length > 1)
                },
                show: function() {
                    return qe(this, !0)
                },
                hide: function() {
                    return qe(this)
                },
                toggle: function(e) {
                    return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                        _(this) ? p(this).show() : p(this).hide()
                    })
                }
            }),
            p.Tween = He,
            He.prototype = {
                constructor: He,
                init: function(e, t, n, r, i, o) {
                    this.elem = e,
                    this.prop = n,
                    this.easing = i || "swing",
                    this.options = t,
                    this.start = this.now = this.cur(),
                    this.end = r,
                    this.unit = o || (p.cssNumber[n] ? "" : "px")
                },
                cur: function() {
                    var e = He.propHooks[this.prop];
                    return e && e.get ? e.get(this) : He.propHooks._default.get(this)
                },
                run: function(e) {
                    var t, n = He.propHooks[this.prop];
                    return this.options.duration ? this.pos = t = p.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
                    this.now = (this.end - this.start) * t + this.start,
                    this.options.step && this.options.step.call(this.elem, this.now, this),
                    n && n.set ? n.set(this) : He.propHooks._default.set(this),
                    this
                }
            },
            He.prototype.init.prototype = He.prototype,
            He.propHooks = {
                _default: {
                    get: function(e) {
                        var t;
                        return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = p.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0 : e.elem[e.prop]
                    },
                    set: function(e) {
                        p.fx.step[e.prop] ? p.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[p.cssProps[e.prop]] || p.cssHooks[e.prop]) ? p.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
                    }
                }
            },
            He.propHooks.scrollTop = He.propHooks.scrollLeft = {
                set: function(e) {
                    e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
                }
            },
            p.easing = {
                linear: function(e) {
                    return e
                },
                swing: function(e) {
                    return .5 - Math.cos(e * Math.PI) / 2
                }
            },
            p.fx = He.prototype.init,
            p.fx.step = {};
            var Oe, Fe, Pe = /^(?:toggle|show|hide)$/, Re = new RegExp("^(?:([+-])=|)(" + I + ")([a-z%]*)$","i"), Me = /queueHooks$/, We = [function(e, t, n) {
                var r, i, o, s, a, u, l, c = this, f = {}, d = e.style, h = e.nodeType && _(e), g = O.get(e, "fxshow");
                n.queue || (null == (a = p._queueHooks(e, "fx")).unqueued && (a.unqueued = 0,
                u = a.empty.fire,
                a.empty.fire = function() {
                    a.unqueued || u()
                }
                ),
                a.unqueued++,
                c.always(function() {
                    c.always(function() {
                        a.unqueued--,
                        p.queue(e, "fx").length || a.empty.fire()
                    })
                }));
                1 === e.nodeType && ("height"in t || "width"in t) && (n.overflow = [d.overflow, d.overflowX, d.overflowY],
                l = p.css(e, "display"),
                "inline" === ("none" === l ? O.get(e, "olddisplay") || me(e.nodeName) : l) && "none" === p.css(e, "float") && (d.display = "inline-block"));
                n.overflow && (d.overflow = "hidden",
                c.always(function() {
                    d.overflow = n.overflow[0],
                    d.overflowX = n.overflow[1],
                    d.overflowY = n.overflow[2]
                }));
                for (r in t)
                    if (i = t[r],
                    Pe.exec(i)) {
                        if (delete t[r],
                        o = o || "toggle" === i,
                        i === (h ? "hide" : "show")) {
                            if ("show" !== i || !g || void 0 === g[r])
                                continue;
                            h = !0
                        }
                        f[r] = g && g[r] || p.style(e, r)
                    } else
                        l = void 0;
                if (p.isEmptyObject(f))
                    "inline" === ("none" === l ? me(e.nodeName) : l) && (d.display = l);
                else
                    for (r in g ? "hidden"in g && (h = g.hidden) : g = O.access(e, "fxshow", {}),
                    o && (g.hidden = !h),
                    h ? p(e).show() : c.done(function() {
                        p(e).hide()
                    }),
                    c.done(function() {
                        var t;
                        for (t in O.remove(e, "fxshow"),
                        f)
                            p.style(e, t, f[t])
                    }),
                    f)
                        s = _e(h ? g[r] : 0, r, c),
                        r in g || (g[r] = s.start,
                        h && (s.end = s.start,
                        s.start = "width" === r || "height" === r ? 1 : 0))
            }
            ], $e = {
                "*": [function(e, t) {
                    var n = this.createTween(e, t)
                      , r = n.cur()
                      , i = Re.exec(t)
                      , o = i && i[3] || (p.cssNumber[e] ? "" : "px")
                      , s = (p.cssNumber[e] || "px" !== o && +r) && Re.exec(p.css(n.elem, e))
                      , a = 1
                      , u = 20;
                    if (s && s[3] !== o) {
                        o = o || s[3],
                        i = i || [],
                        s = +r || 1;
                        do {
                            s /= a = a || ".5",
                            p.style(n.elem, e, s + o)
                        } while (a !== (a = n.cur() / r) && 1 !== a && --u)
                    }
                    return i && (s = n.start = +s || +r || 0,
                    n.unit = o,
                    n.end = i[1] ? s + (i[1] + 1) * i[2] : +i[2]),
                    n
                }
                ]
            };
            function Ie() {
                return setTimeout(function() {
                    Oe = void 0
                }),
                Oe = p.now()
            }
            function Be(e, t) {
                var n, r = 0, i = {
                    height: e
                };
                for (t = t ? 1 : 0; r < 4; r += 2 - t)
                    i["margin" + (n = B[r])] = i["padding" + n] = e;
                return t && (i.opacity = i.width = e),
                i
            }
            function _e(e, t, n) {
                for (var r, i = ($e[t] || []).concat($e["*"]), o = 0, s = i.length; o < s; o++)
                    if (r = i[o].call(n, t, e))
                        return r
            }
            function ze(e, t, n) {
                var r, i, o = 0, s = We.length, a = p.Deferred().always(function() {
                    delete u.elem
                }), u = function() {
                    if (i)
                        return !1;
                    for (var t = Oe || Ie(), n = Math.max(0, l.startTime + l.duration - t), r = 1 - (n / l.duration || 0), o = 0, s = l.tweens.length; o < s; o++)
                        l.tweens[o].run(r);
                    return a.notifyWith(e, [l, r, n]),
                    r < 1 && s ? n : (a.resolveWith(e, [l]),
                    !1)
                }, l = a.promise({
                    elem: e,
                    props: p.extend({}, t),
                    opts: p.extend(!0, {
                        specialEasing: {}
                    }, n),
                    originalProperties: t,
                    originalOptions: n,
                    startTime: Oe || Ie(),
                    duration: n.duration,
                    tweens: [],
                    createTween: function(t, n) {
                        var r = p.Tween(e, l.opts, t, n, l.opts.specialEasing[t] || l.opts.easing);
                        return l.tweens.push(r),
                        r
                    },
                    stop: function(t) {
                        var n = 0
                          , r = t ? l.tweens.length : 0;
                        if (i)
                            return this;
                        for (i = !0; n < r; n++)
                            l.tweens[n].run(1);
                        return t ? a.resolveWith(e, [l, t]) : a.rejectWith(e, [l, t]),
                        this
                    }
                }), c = l.props;
                for (!function(e, t) {
                    var n, r, i, o, s;
                    for (n in e)
                        if (i = t[r = p.camelCase(n)],
                        o = e[n],
                        p.isArray(o) && (i = o[1],
                        o = e[n] = o[0]),
                        n !== r && (e[r] = o,
                        delete e[n]),
                        (s = p.cssHooks[r]) && "expand"in s)
                            for (n in o = s.expand(o),
                            delete e[r],
                            o)
                                n in e || (e[n] = o[n],
                                t[n] = i);
                        else
                            t[r] = i
                }(c, l.opts.specialEasing); o < s; o++)
                    if (r = We[o].call(l, e, c, l.opts))
                        return r;
                return p.map(c, _e, l),
                p.isFunction(l.opts.start) && l.opts.start.call(e, l),
                p.fx.timer(p.extend(u, {
                    elem: e,
                    anim: l,
                    queue: l.opts.queue
                })),
                l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always)
            }
            p.Animation = p.extend(ze, {
                tweener: function(e, t) {
                    p.isFunction(e) ? (t = e,
                    e = ["*"]) : e = e.split(" ");
                    for (var n, r = 0, i = e.length; r < i; r++)
                        n = e[r],
                        $e[n] = $e[n] || [],
                        $e[n].unshift(t)
                },
                prefilter: function(e, t) {
                    t ? We.unshift(e) : We.push(e)
                }
            }),
            p.speed = function(e, t, n) {
                var r = e && "object" == typeof e ? p.extend({}, e) : {
                    complete: n || !n && t || p.isFunction(e) && e,
                    duration: e,
                    easing: n && t || t && !p.isFunction(t) && t
                };
                return r.duration = p.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in p.fx.speeds ? p.fx.speeds[r.duration] : p.fx.speeds._default,
                null != r.queue && !0 !== r.queue || (r.queue = "fx"),
                r.old = r.complete,
                r.complete = function() {
                    p.isFunction(r.old) && r.old.call(this),
                    r.queue && p.dequeue(this, r.queue)
                }
                ,
                r
            }
            ,
            p.fn.extend({
                fadeTo: function(e, t, n, r) {
                    return this.filter(_).css("opacity", 0).show().end().animate({
                        opacity: t
                    }, e, n, r)
                },
                animate: function(e, t, n, r) {
                    var i = p.isEmptyObject(e)
                      , o = p.speed(t, n, r)
                      , s = function() {
                        var t = ze(this, p.extend({}, e), o);
                        (i || O.get(this, "finish")) && t.stop(!0)
                    };
                    return s.finish = s,
                    i || !1 === o.queue ? this.each(s) : this.queue(o.queue, s)
                },
                stop: function(e, t, n) {
                    var r = function(e) {
                        var t = e.stop;
                        delete e.stop,
                        t(n)
                    };
                    return "string" != typeof e && (n = t,
                    t = e,
                    e = void 0),
                    t && !1 !== e && this.queue(e || "fx", []),
                    this.each(function() {
                        var t = !0
                          , i = null != e && e + "queueHooks"
                          , o = p.timers
                          , s = O.get(this);
                        if (i)
                            s[i] && s[i].stop && r(s[i]);
                        else
                            for (i in s)
                                s[i] && s[i].stop && Me.test(i) && r(s[i]);
                        for (i = o.length; i--; )
                            o[i].elem !== this || null != e && o[i].queue !== e || (o[i].anim.stop(n),
                            t = !1,
                            o.splice(i, 1));
                        !t && n || p.dequeue(this, e)
                    })
                },
                finish: function(e) {
                    return !1 !== e && (e = e || "fx"),
                    this.each(function() {
                        var t, n = O.get(this), r = n[e + "queue"], i = n[e + "queueHooks"], o = p.timers, s = r ? r.length : 0;
                        for (n.finish = !0,
                        p.queue(this, e, []),
                        i && i.stop && i.stop.call(this, !0),
                        t = o.length; t--; )
                            o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0),
                            o.splice(t, 1));
                        for (t = 0; t < s; t++)
                            r[t] && r[t].finish && r[t].finish.call(this);
                        delete n.finish
                    })
                }
            }),
            p.each(["toggle", "show", "hide"], function(e, t) {
                var n = p.fn[t];
                p.fn[t] = function(e, r, i) {
                    return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(Be(t, !0), e, r, i)
                }
            }),
            p.each({
                slideDown: Be("show"),
                slideUp: Be("hide"),
                slideToggle: Be("toggle"),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function(e, t) {
                p.fn[e] = function(e, n, r) {
                    return this.animate(t, e, n, r)
                }
            }),
            p.timers = [],
            p.fx.tick = function() {
                var e, t = 0, n = p.timers;
                for (Oe = p.now(); t < n.length; t++)
                    (e = n[t])() || n[t] !== e || n.splice(t--, 1);
                n.length || p.fx.stop(),
                Oe = void 0
            }
            ,
            p.fx.timer = function(e) {
                p.timers.push(e),
                e() ? p.fx.start() : p.timers.pop()
            }
            ,
            p.fx.interval = 13,
            p.fx.start = function() {
                Fe || (Fe = setInterval(p.fx.tick, p.fx.interval))
            }
            ,
            p.fx.stop = function() {
                clearInterval(Fe),
                Fe = null
            }
            ,
            p.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            },
            p.fn.delay = function(e, t) {
                return e = p.fx && p.fx.speeds[e] || e,
                t = t || "fx",
                this.queue(t, function(t, n) {
                    var r = setTimeout(t, e);
                    n.stop = function() {
                        clearTimeout(r)
                    }
                })
            }
            ,
            function() {
                var e = f.createElement("input")
                  , t = f.createElement("select")
                  , n = t.appendChild(f.createElement("option"));
                e.type = "checkbox",
                c.checkOn = "" !== e.value,
                c.optSelected = n.selected,
                t.disabled = !0,
                c.optDisabled = !n.disabled,
                (e = f.createElement("input")).value = "t",
                e.type = "radio",
                c.radioValue = "t" === e.value
            }();
            var Xe, Ue = p.expr.attrHandle;
            p.fn.extend({
                attr: function(e, t) {
                    return q(this, p.attr, e, t, arguments.length > 1)
                },
                removeAttr: function(e) {
                    return this.each(function() {
                        p.removeAttr(this, e)
                    })
                }
            }),
            p.extend({
                attr: function(e, t, n) {
                    var r, i, o = e.nodeType;
                    if (e && 3 !== o && 8 !== o && 2 !== o)
                        return void 0 === e.getAttribute ? p.prop(e, t, n) : (1 === o && p.isXMLDoc(e) || (t = t.toLowerCase(),
                        r = p.attrHooks[t] || (p.expr.match.bool.test(t) ? Xe : void 0)),
                        void 0 === n ? r && "get"in r && null !== (i = r.get(e, t)) ? i : null == (i = p.find.attr(e, t)) ? void 0 : i : null !== n ? r && "set"in r && void 0 !== (i = r.set(e, n, t)) ? i : (e.setAttribute(t, n + ""),
                        n) : void p.removeAttr(e, t))
                },
                removeAttr: function(e, t) {
                    var n, r, i = 0, o = t && t.match(j);
                    if (o && 1 === e.nodeType)
                        for (; n = o[i++]; )
                            r = p.propFix[n] || n,
                            p.expr.match.bool.test(n) && (e[r] = !1),
                            e.removeAttribute(n)
                },
                attrHooks: {
                    type: {
                        set: function(e, t) {
                            if (!c.radioValue && "radio" === t && p.nodeName(e, "input")) {
                                var n = e.value;
                                return e.setAttribute("type", t),
                                n && (e.value = n),
                                t
                            }
                        }
                    }
                }
            }),
            Xe = {
                set: function(e, t, n) {
                    return !1 === t ? p.removeAttr(e, n) : e.setAttribute(n, n),
                    n
                }
            },
            p.each(p.expr.match.bool.source.match(/\w+/g), function(e, t) {
                var n = Ue[t] || p.find.attr;
                Ue[t] = function(e, t, r) {
                    var i, o;
                    return r || (o = Ue[t],
                    Ue[t] = i,
                    i = null != n(e, t, r) ? t.toLowerCase() : null,
                    Ue[t] = o),
                    i
                }
            });
            var Ve = /^(?:input|select|textarea|button)$/i;
            p.fn.extend({
                prop: function(e, t) {
                    return q(this, p.prop, e, t, arguments.length > 1)
                },
                removeProp: function(e) {
                    return this.each(function() {
                        delete this[p.propFix[e] || e]
                    })
                }
            }),
            p.extend({
                propFix: {
                    for: "htmlFor",
                    class: "className"
                },
                prop: function(e, t, n) {
                    var r, i, o = e.nodeType;
                    if (e && 3 !== o && 8 !== o && 2 !== o)
                        return (1 !== o || !p.isXMLDoc(e)) && (t = p.propFix[t] || t,
                        i = p.propHooks[t]),
                        void 0 !== n ? i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get"in i && null !== (r = i.get(e, t)) ? r : e[t]
                },
                propHooks: {
                    tabIndex: {
                        get: function(e) {
                            return e.hasAttribute("tabindex") || Ve.test(e.nodeName) || e.href ? e.tabIndex : -1
                        }
                    }
                }
            }),
            c.optSelected || (p.propHooks.selected = {
                get: function(e) {
                    var t = e.parentNode;
                    return t && t.parentNode && t.parentNode.selectedIndex,
                    null
                }
            }),
            p.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
                p.propFix[this.toLowerCase()] = this
            });
            var Ye = /[\t\r\n\f]/g;
            p.fn.extend({
                addClass: function(e) {
                    var t, n, r, i, o, s, a = "string" == typeof e && e, u = 0, l = this.length;
                    if (p.isFunction(e))
                        return this.each(function(t) {
                            p(this).addClass(e.call(this, t, this.className))
                        });
                    if (a)
                        for (t = (e || "").match(j) || []; u < l; u++)
                            if (r = 1 === (n = this[u]).nodeType && (n.className ? (" " + n.className + " ").replace(Ye, " ") : " ")) {
                                for (o = 0; i = t[o++]; )
                                    r.indexOf(" " + i + " ") < 0 && (r += i + " ");
                                s = p.trim(r),
                                n.className !== s && (n.className = s)
                            }
                    return this
                },
                removeClass: function(e) {
                    var t, n, r, i, o, s, a = 0 === arguments.length || "string" == typeof e && e, u = 0, l = this.length;
                    if (p.isFunction(e))
                        return this.each(function(t) {
                            p(this).removeClass(e.call(this, t, this.className))
                        });
                    if (a)
                        for (t = (e || "").match(j) || []; u < l; u++)
                            if (r = 1 === (n = this[u]).nodeType && (n.className ? (" " + n.className + " ").replace(Ye, " ") : "")) {
                                for (o = 0; i = t[o++]; )
                                    for (; r.indexOf(" " + i + " ") >= 0; )
                                        r = r.replace(" " + i + " ", " ");
                                s = e ? p.trim(r) : "",
                                n.className !== s && (n.className = s)
                            }
                    return this
                },
                toggleClass: function(e, t) {
                    var n = typeof e;
                    return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : p.isFunction(e) ? this.each(function(n) {
                        p(this).toggleClass(e.call(this, n, this.className, t), t)
                    }) : this.each(function() {
                        if ("string" === n)
                            for (var t, r = 0, i = p(this), o = e.match(j) || []; t = o[r++]; )
                                i.hasClass(t) ? i.removeClass(t) : i.addClass(t);
                        else
                            "undefined" !== n && "boolean" !== n || (this.className && O.set(this, "__className__", this.className),
                            this.className = this.className || !1 === e ? "" : O.get(this, "__className__") || "")
                    })
                },
                hasClass: function(e) {
                    for (var t = " " + e + " ", n = 0, r = this.length; n < r; n++)
                        if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(Ye, " ").indexOf(t) >= 0)
                            return !0;
                    return !1
                }
            });
            var Ge = /\r/g;
            p.fn.extend({
                val: function(e) {
                    var t, n, r, i = this[0];
                    return arguments.length ? (r = p.isFunction(e),
                    this.each(function(n) {
                        var i;
                        1 === this.nodeType && (null == (i = r ? e.call(this, n, p(this).val()) : e) ? i = "" : "number" == typeof i ? i += "" : p.isArray(i) && (i = p.map(i, function(e) {
                            return null == e ? "" : e + ""
                        })),
                        (t = p.valHooks[this.type] || p.valHooks[this.nodeName.toLowerCase()]) && "set"in t && void 0 !== t.set(this, i, "value") || (this.value = i))
                    })) : i ? (t = p.valHooks[i.type] || p.valHooks[i.nodeName.toLowerCase()]) && "get"in t && void 0 !== (n = t.get(i, "value")) ? n : "string" == typeof (n = i.value) ? n.replace(Ge, "") : null == n ? "" : n : void 0
                }
            }),
            p.extend({
                valHooks: {
                    option: {
                        get: function(e) {
                            var t = p.find.attr(e, "value");
                            return null != t ? t : p.trim(p.text(e))
                        }
                    },
                    select: {
                        get: function(e) {
                            for (var t, n, r = e.options, i = e.selectedIndex, o = "select-one" === e.type || i < 0, s = o ? null : [], a = o ? i + 1 : r.length, u = i < 0 ? a : o ? i : 0; u < a; u++)
                                if (((n = r[u]).selected || u === i) && (c.optDisabled ? !n.disabled : null === n.getAttribute("disabled")) && (!n.parentNode.disabled || !p.nodeName(n.parentNode, "optgroup"))) {
                                    if (t = p(n).val(),
                                    o)
                                        return t;
                                    s.push(t)
                                }
                            return s
                        },
                        set: function(e, t) {
                            for (var n, r, i = e.options, o = p.makeArray(t), s = i.length; s--; )
                                ((r = i[s]).selected = p.inArray(r.value, o) >= 0) && (n = !0);
                            return n || (e.selectedIndex = -1),
                            o
                        }
                    }
                }
            }),
            p.each(["radio", "checkbox"], function() {
                p.valHooks[this] = {
                    set: function(e, t) {
                        if (p.isArray(t))
                            return e.checked = p.inArray(p(e).val(), t) >= 0
                    }
                },
                c.checkOn || (p.valHooks[this].get = function(e) {
                    return null === e.getAttribute("value") ? "on" : e.value
                }
                )
            }),
            p.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
                p.fn[t] = function(e, n) {
                    return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
                }
            }),
            p.fn.extend({
                hover: function(e, t) {
                    return this.mouseenter(e).mouseleave(t || e)
                },
                bind: function(e, t, n) {
                    return this.on(e, null, t, n)
                },
                unbind: function(e, t) {
                    return this.off(e, null, t)
                },
                delegate: function(e, t, n, r) {
                    return this.on(t, e, n, r)
                },
                undelegate: function(e, t, n) {
                    return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
                }
            });
            var Qe = p.now()
              , Je = /\?/;
            p.parseJSON = function(e) {
                return JSON.parse(e + "")
            }
            ,
            p.parseXML = function(e) {
                var t;
                if (!e || "string" != typeof e)
                    return null;
                try {
                    t = (new DOMParser).parseFromString(e, "text/xml")
                } catch (e) {
                    t = void 0
                }
                return t && !t.getElementsByTagName("parsererror").length || p.error("Invalid XML: " + e),
                t
            }
            ;
            var Ke = /#.*$/
              , Ze = /([?&])_=[^&]*/
              , et = /^(.*?):[ \t]*([^\r\n]*)$/gm
              , tt = /^(?:GET|HEAD)$/
              , nt = /^\/\//
              , rt = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/
              , it = {}
              , ot = {}
              , st = "*/".concat("*")
              , at = e.location.href
              , ut = rt.exec(at.toLowerCase()) || [];
            function lt(e) {
                return function(t, n) {
                    "string" != typeof t && (n = t,
                    t = "*");
                    var r, i = 0, o = t.toLowerCase().match(j) || [];
                    if (p.isFunction(n))
                        for (; r = o[i++]; )
                            "+" === r[0] ? (r = r.slice(1) || "*",
                            (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
                }
            }
            function ct(e, t, n, r) {
                var i = {}
                  , o = e === ot;
                function s(a) {
                    var u;
                    return i[a] = !0,
                    p.each(e[a] || [], function(e, a) {
                        var l = a(t, n, r);
                        return "string" != typeof l || o || i[l] ? o ? !(u = l) : void 0 : (t.dataTypes.unshift(l),
                        s(l),
                        !1)
                    }),
                    u
                }
                return s(t.dataTypes[0]) || !i["*"] && s("*")
            }
            function ft(e, t) {
                var n, r, i = p.ajaxSettings.flatOptions || {};
                for (n in t)
                    void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
                return r && p.extend(!0, e, r),
                e
            }
            p.extend({
                active: 0,
                lastModified: {},
                etag: {},
                ajaxSettings: {
                    url: at,
                    type: "GET",
                    isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(ut[1]),
                    global: !0,
                    processData: !0,
                    async: !0,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    accepts: {
                        "*": st,
                        text: "text/plain",
                        html: "text/html",
                        xml: "application/xml, text/xml",
                        json: "application/json, text/javascript"
                    },
                    contents: {
                        xml: /xml/,
                        html: /html/,
                        json: /json/
                    },
                    responseFields: {
                        xml: "responseXML",
                        text: "responseText",
                        json: "responseJSON"
                    },
                    converters: {
                        "* text": String,
                        "text html": !0,
                        "text json": p.parseJSON,
                        "text xml": p.parseXML
                    },
                    flatOptions: {
                        url: !0,
                        context: !0
                    }
                },
                ajaxSetup: function(e, t) {
                    return t ? ft(ft(e, p.ajaxSettings), t) : ft(p.ajaxSettings, e)
                },
                ajaxPrefilter: lt(it),
                ajaxTransport: lt(ot),
                ajax: function(e, t) {
                    "object" == typeof e && (t = e,
                    e = void 0),
                    t = t || {};
                    var n, r, i, o, s, a, u, l, c = p.ajaxSetup({}, t), f = c.context || c, d = c.context && (f.nodeType || f.jquery) ? p(f) : p.event, h = p.Deferred(), g = p.Callbacks("once memory"), m = c.statusCode || {}, v = {}, y = {}, x = 0, b = "canceled", w = {
                        readyState: 0,
                        getResponseHeader: function(e) {
                            var t;
                            if (2 === x) {
                                if (!o)
                                    for (o = {}; t = et.exec(i); )
                                        o[t[1].toLowerCase()] = t[2];
                                t = o[e.toLowerCase()]
                            }
                            return null == t ? null : t
                        },
                        getAllResponseHeaders: function() {
                            return 2 === x ? i : null
                        },
                        setRequestHeader: function(e, t) {
                            var n = e.toLowerCase();
                            return x || (e = y[n] = y[n] || e,
                            v[e] = t),
                            this
                        },
                        overrideMimeType: function(e) {
                            return x || (c.mimeType = e),
                            this
                        },
                        statusCode: function(e) {
                            var t;
                            if (e)
                                if (x < 2)
                                    for (t in e)
                                        m[t] = [m[t], e[t]];
                                else
                                    w.always(e[w.status]);
                            return this
                        },
                        abort: function(e) {
                            var t = e || b;
                            return n && n.abort(t),
                            T(0, t),
                            this
                        }
                    };
                    if (h.promise(w).complete = g.add,
                    w.success = w.done,
                    w.error = w.fail,
                    c.url = ((e || c.url || at) + "").replace(Ke, "").replace(nt, ut[1] + "//"),
                    c.type = t.method || t.type || c.method || c.type,
                    c.dataTypes = p.trim(c.dataType || "*").toLowerCase().match(j) || [""],
                    null == c.crossDomain && (a = rt.exec(c.url.toLowerCase()),
                    c.crossDomain = !(!a || a[1] === ut[1] && a[2] === ut[2] && (a[3] || ("http:" === a[1] ? "80" : "443")) === (ut[3] || ("http:" === ut[1] ? "80" : "443")))),
                    c.data && c.processData && "string" != typeof c.data && (c.data = p.param(c.data, c.traditional)),
                    ct(it, c, t, w),
                    2 === x)
                        return w;
                    for (l in (u = p.event && c.global) && 0 == p.active++ && p.event.trigger("ajaxStart"),
                    c.type = c.type.toUpperCase(),
                    c.hasContent = !tt.test(c.type),
                    r = c.url,
                    c.hasContent || (c.data && (r = c.url += (Je.test(r) ? "&" : "?") + c.data,
                    delete c.data),
                    !1 === c.cache && (c.url = Ze.test(r) ? r.replace(Ze, "$1_=" + Qe++) : r + (Je.test(r) ? "&" : "?") + "_=" + Qe++)),
                    c.ifModified && (p.lastModified[r] && w.setRequestHeader("If-Modified-Since", p.lastModified[r]),
                    p.etag[r] && w.setRequestHeader("If-None-Match", p.etag[r])),
                    (c.data && c.hasContent && !1 !== c.contentType || t.contentType) && w.setRequestHeader("Content-Type", c.contentType),
                    w.setRequestHeader("Accept", c.dataTypes[0] && c.accepts[c.dataTypes[0]] ? c.accepts[c.dataTypes[0]] + ("*" !== c.dataTypes[0] ? ", " + st + "; q=0.01" : "") : c.accepts["*"]),
                    c.headers)
                        w.setRequestHeader(l, c.headers[l]);
                    if (c.beforeSend && (!1 === c.beforeSend.call(f, w, c) || 2 === x))
                        return w.abort();
                    for (l in b = "abort",
                    {
                        success: 1,
                        error: 1,
                        complete: 1
                    })
                        w[l](c[l]);
                    if (n = ct(ot, c, t, w)) {
                        w.readyState = 1,
                        u && d.trigger("ajaxSend", [w, c]),
                        c.async && c.timeout > 0 && (s = setTimeout(function() {
                            w.abort("timeout")
                        }, c.timeout));
                        try {
                            x = 1,
                            n.send(v, T)
                        } catch (e) {
                            if (!(x < 2))
                                throw e;
                            T(-1, e)
                        }
                    } else
                        T(-1, "No Transport");
                    function T(e, t, o, a) {
                        var l, v, y, b, T, C = t;
                        2 !== x && (x = 2,
                        s && clearTimeout(s),
                        n = void 0,
                        i = a || "",
                        w.readyState = e > 0 ? 4 : 0,
                        l = e >= 200 && e < 300 || 304 === e,
                        o && (b = function(e, t, n) {
                            for (var r, i, o, s, a = e.contents, u = e.dataTypes; "*" === u[0]; )
                                u.shift(),
                                void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
                            if (r)
                                for (i in a)
                                    if (a[i] && a[i].test(r)) {
                                        u.unshift(i);
                                        break
                                    }
                            if (u[0]in n)
                                o = u[0];
                            else {
                                for (i in n) {
                                    if (!u[0] || e.converters[i + " " + u[0]]) {
                                        o = i;
                                        break
                                    }
                                    s || (s = i)
                                }
                                o = o || s
                            }
                            if (o)
                                return o !== u[0] && u.unshift(o),
                                n[o]
                        }(c, w, o)),
                        b = function(e, t, n, r) {
                            var i, o, s, a, u, l = {}, c = e.dataTypes.slice();
                            if (c[1])
                                for (s in e.converters)
                                    l[s.toLowerCase()] = e.converters[s];
                            for (o = c.shift(); o; )
                                if (e.responseFields[o] && (n[e.responseFields[o]] = t),
                                !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                                u = o,
                                o = c.shift())
                                    if ("*" === o)
                                        o = u;
                                    else if ("*" !== u && u !== o) {
                                        if (!(s = l[u + " " + o] || l["* " + o]))
                                            for (i in l)
                                                if ((a = i.split(" "))[1] === o && (s = l[u + " " + a[0]] || l["* " + a[0]])) {
                                                    !0 === s ? s = l[i] : !0 !== l[i] && (o = a[0],
                                                    c.unshift(a[1]));
                                                    break
                                                }
                                        if (!0 !== s)
                                            if (s && e.throws)
                                                t = s(t);
                                            else
                                                try {
                                                    t = s(t)
                                                } catch (e) {
                                                    return {
                                                        state: "parsererror",
                                                        error: s ? e : "No conversion from " + u + " to " + o
                                                    }
                                                }
                                    }
                            return {
                                state: "success",
                                data: t
                            }
                        }(c, b, w, l),
                        l ? (c.ifModified && ((T = w.getResponseHeader("Last-Modified")) && (p.lastModified[r] = T),
                        (T = w.getResponseHeader("etag")) && (p.etag[r] = T)),
                        204 === e || "HEAD" === c.type ? C = "nocontent" : 304 === e ? C = "notmodified" : (C = b.state,
                        v = b.data,
                        l = !(y = b.error))) : (y = C,
                        !e && C || (C = "error",
                        e < 0 && (e = 0))),
                        w.status = e,
                        w.statusText = (t || C) + "",
                        l ? h.resolveWith(f, [v, C, w]) : h.rejectWith(f, [w, C, y]),
                        w.statusCode(m),
                        m = void 0,
                        u && d.trigger(l ? "ajaxSuccess" : "ajaxError", [w, c, l ? v : y]),
                        g.fireWith(f, [w, C]),
                        u && (d.trigger("ajaxComplete", [w, c]),
                        --p.active || p.event.trigger("ajaxStop")))
                    }
                    return w
                },
                getJSON: function(e, t, n) {
                    return p.get(e, t, n, "json")
                },
                getScript: function(e, t) {
                    return p.get(e, void 0, t, "script")
                }
            }),
            p.each(["get", "post"], function(e, t) {
                p[t] = function(e, n, r, i) {
                    return p.isFunction(n) && (i = i || r,
                    r = n,
                    n = void 0),
                    p.ajax({
                        url: e,
                        type: t,
                        dataType: i,
                        data: n,
                        success: r
                    })
                }
            }),
            p._evalUrl = function(e) {
                return p.ajax({
                    url: e,
                    type: "GET",
                    dataType: "script",
                    async: !1,
                    global: !1,
                    throws: !0
                })
            }
            ,
            p.fn.extend({
                wrapAll: function(e) {
                    var t;
                    return p.isFunction(e) ? this.each(function(t) {
                        p(this).wrapAll(e.call(this, t))
                    }) : (this[0] && (t = p(e, this[0].ownerDocument).eq(0).clone(!0),
                    this[0].parentNode && t.insertBefore(this[0]),
                    t.map(function() {
                        for (var e = this; e.firstElementChild; )
                            e = e.firstElementChild;
                        return e
                    }).append(this)),
                    this)
                },
                wrapInner: function(e) {
                    return p.isFunction(e) ? this.each(function(t) {
                        p(this).wrapInner(e.call(this, t))
                    }) : this.each(function() {
                        var t = p(this)
                          , n = t.contents();
                        n.length ? n.wrapAll(e) : t.append(e)
                    })
                },
                wrap: function(e) {
                    var t = p.isFunction(e);
                    return this.each(function(n) {
                        p(this).wrapAll(t ? e.call(this, n) : e)
                    })
                },
                unwrap: function() {
                    return this.parent().each(function() {
                        p.nodeName(this, "body") || p(this).replaceWith(this.childNodes)
                    }).end()
                }
            }),
            p.expr.filters.hidden = function(e) {
                return e.offsetWidth <= 0 && e.offsetHeight <= 0
            }
            ,
            p.expr.filters.visible = function(e) {
                return !p.expr.filters.hidden(e)
            }
            ;
            var pt = /%20/g
              , dt = /\[\]$/
              , ht = /\r?\n/g
              , gt = /^(?:submit|button|image|reset|file)$/i
              , mt = /^(?:input|select|textarea|keygen)/i;
            function vt(e, t, n, r) {
                var i;
                if (p.isArray(t))
                    p.each(t, function(t, i) {
                        n || dt.test(e) ? r(e, i) : vt(e + "[" + ("object" == typeof i ? t : "") + "]", i, n, r)
                    });
                else if (n || "object" !== p.type(t))
                    r(e, t);
                else
                    for (i in t)
                        vt(e + "[" + i + "]", t[i], n, r)
            }
            p.param = function(e, t) {
                var n, r = [], i = function(e, t) {
                    t = p.isFunction(t) ? t() : null == t ? "" : t,
                    r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
                };
                if (void 0 === t && (t = p.ajaxSettings && p.ajaxSettings.traditional),
                p.isArray(e) || e.jquery && !p.isPlainObject(e))
                    p.each(e, function() {
                        i(this.name, this.value)
                    });
                else
                    for (n in e)
                        vt(n, e[n], t, i);
                return r.join("&").replace(pt, "+")
            }
            ,
            p.fn.extend({
                serialize: function() {
                    return p.param(this.serializeArray())
                },
                serializeArray: function() {
                    return this.map(function() {
                        var e = p.prop(this, "elements");
                        return e ? p.makeArray(e) : this
                    }).filter(function() {
                        var e = this.type;
                        return this.name && !p(this).is(":disabled") && mt.test(this.nodeName) && !gt.test(e) && (this.checked || !z.test(e))
                    }).map(function(e, t) {
                        var n = p(this).val();
                        return null == n ? null : p.isArray(n) ? p.map(n, function(e) {
                            return {
                                name: t.name,
                                value: e.replace(ht, "\r\n")
                            }
                        }) : {
                            name: t.name,
                            value: n.replace(ht, "\r\n")
                        }
                    }).get()
                }
            }),
            p.ajaxSettings.xhr = function() {
                try {
                    return new XMLHttpRequest
                } catch (e) {}
            }
            ;
            var yt = 0
              , xt = {}
              , bt = {
                0: 200,
                1223: 204
            }
              , wt = p.ajaxSettings.xhr();
            e.attachEvent && e.attachEvent("onunload", function() {
                for (var e in xt)
                    xt[e]()
            }),
            c.cors = !!wt && "withCredentials"in wt,
            c.ajax = wt = !!wt,
            p.ajaxTransport(function(e) {
                var t;
                if (c.cors || wt && !e.crossDomain)
                    return {
                        send: function(n, r) {
                            var i, o = e.xhr(), s = ++yt;
                            if (o.open(e.type, e.url, e.async, e.username, e.password),
                            e.xhrFields)
                                for (i in e.xhrFields)
                                    o[i] = e.xhrFields[i];
                            for (i in e.mimeType && o.overrideMimeType && o.overrideMimeType(e.mimeType),
                            e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest"),
                            n)
                                o.setRequestHeader(i, n[i]);
                            t = function(e) {
                                return function() {
                                    t && (delete xt[s],
                                    t = o.onload = o.onerror = null,
                                    "abort" === e ? o.abort() : "error" === e ? r(o.status, o.statusText) : r(bt[o.status] || o.status, o.statusText, "string" == typeof o.responseText ? {
                                        text: o.responseText
                                    } : void 0, o.getAllResponseHeaders()))
                                }
                            }
                            ,
                            o.onload = t(),
                            o.onerror = t("error"),
                            t = xt[s] = t("abort");
                            try {
                                o.send(e.hasContent && e.data || null)
                            } catch (e) {
                                if (t)
                                    throw e
                            }
                        },
                        abort: function() {
                            t && t()
                        }
                    }
            }),
            p.ajaxSetup({
                accepts: {
                    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
                },
                contents: {
                    script: /(?:java|ecma)script/
                },
                converters: {
                    "text script": function(e) {
                        return p.globalEval(e),
                        e
                    }
                }
            }),
            p.ajaxPrefilter("script", function(e) {
                void 0 === e.cache && (e.cache = !1),
                e.crossDomain && (e.type = "GET")
            }),
            p.ajaxTransport("script", function(e) {
                var t, n;
                if (e.crossDomain)
                    return {
                        send: function(r, i) {
                            t = p("<script>").prop({
                                async: !0,
                                charset: e.scriptCharset,
                                src: e.url
                            }).on("load error", n = function(e) {
                                t.remove(),
                                n = null,
                                e && i("error" === e.type ? 404 : 200, e.type)
                            }
                            ),
                            f.head.appendChild(t[0])
                        },
                        abort: function() {
                            n && n()
                        }
                    }
            });
            var Tt = []
              , Ct = /(=)\?(?=&|$)|\?\?/;
            p.ajaxSetup({
                jsonp: "callback",
                jsonpCallback: function() {
                    var e = Tt.pop() || p.expando + "_" + Qe++;
                    return this[e] = !0,
                    e
                }
            }),
            p.ajaxPrefilter("json jsonp", function(t, n, r) {
                var i, o, s, a = !1 !== t.jsonp && (Ct.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && Ct.test(t.data) && "data");
                if (a || "jsonp" === t.dataTypes[0])
                    return i = t.jsonpCallback = p.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback,
                    a ? t[a] = t[a].replace(Ct, "$1" + i) : !1 !== t.jsonp && (t.url += (Je.test(t.url) ? "&" : "?") + t.jsonp + "=" + i),
                    t.converters["script json"] = function() {
                        return s || p.error(i + " was not called"),
                        s[0]
                    }
                    ,
                    t.dataTypes[0] = "json",
                    o = e[i],
                    e[i] = function() {
                        s = arguments
                    }
                    ,
                    r.always(function() {
                        e[i] = o,
                        t[i] && (t.jsonpCallback = n.jsonpCallback,
                        Tt.push(i)),
                        s && p.isFunction(o) && o(s[0]),
                        s = o = void 0
                    }),
                    "script"
            }),
            p.parseHTML = function(e, t, n) {
                if (!e || "string" != typeof e)
                    return null;
                "boolean" == typeof t && (n = t,
                t = !1),
                t = t || f;
                var r = b.exec(e)
                  , i = !n && [];
                return r ? [t.createElement(r[1])] : (r = p.buildFragment([e], t, i),
                i && i.length && p(i).remove(),
                p.merge([], r.childNodes))
            }
            ;
            var Nt = p.fn.load;
            p.fn.load = function(e, t, n) {
                if ("string" != typeof e && Nt)
                    return Nt.apply(this, arguments);
                var r, i, o, s = this, a = e.indexOf(" ");
                return a >= 0 && (r = p.trim(e.slice(a)),
                e = e.slice(0, a)),
                p.isFunction(t) ? (n = t,
                t = void 0) : t && "object" == typeof t && (i = "POST"),
                s.length > 0 && p.ajax({
                    url: e,
                    type: i,
                    dataType: "html",
                    data: t
                }).done(function(e) {
                    o = arguments,
                    s.html(r ? p("<div>").append(p.parseHTML(e)).find(r) : e)
                }).complete(n && function(e, t) {
                    s.each(n, o || [e.responseText, t, e])
                }
                ),
                this
            }
            ,
            p.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
                p.fn[t] = function(e) {
                    return this.on(t, e)
                }
            }),
            p.expr.filters.animated = function(e) {
                return p.grep(p.timers, function(t) {
                    return e === t.elem
                }).length
            }
            ;
            var kt = e.document.documentElement;
            function Et(e) {
                return p.isWindow(e) ? e : 9 === e.nodeType && e.defaultView
            }
            p.offset = {
                setOffset: function(e, t, n) {
                    var r, i, o, s, a, u, l = p.css(e, "position"), c = p(e), f = {};
                    "static" === l && (e.style.position = "relative"),
                    a = c.offset(),
                    o = p.css(e, "top"),
                    u = p.css(e, "left"),
                    ("absolute" === l || "fixed" === l) && (o + u).indexOf("auto") > -1 ? (s = (r = c.position()).top,
                    i = r.left) : (s = parseFloat(o) || 0,
                    i = parseFloat(u) || 0),
                    p.isFunction(t) && (t = t.call(e, n, a)),
                    null != t.top && (f.top = t.top - a.top + s),
                    null != t.left && (f.left = t.left - a.left + i),
                    "using"in t ? t.using.call(e, f) : c.css(f)
                }
            },
            p.fn.extend({
                offset: function(e) {
                    if (arguments.length)
                        return void 0 === e ? this : this.each(function(t) {
                            p.offset.setOffset(this, e, t)
                        });
                    var t, n, r = this[0], i = {
                        top: 0,
                        left: 0
                    }, o = r && r.ownerDocument;
                    return o ? (t = o.documentElement,
                    p.contains(t, r) ? (void 0 !== r.getBoundingClientRect && (i = r.getBoundingClientRect()),
                    n = Et(o),
                    {
                        top: i.top + n.pageYOffset - t.clientTop,
                        left: i.left + n.pageXOffset - t.clientLeft
                    }) : i) : void 0
                },
                position: function() {
                    if (this[0]) {
                        var e, t, n = this[0], r = {
                            top: 0,
                            left: 0
                        };
                        return "fixed" === p.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(),
                        t = this.offset(),
                        p.nodeName(e[0], "html") || (r = e.offset()),
                        r.top += p.css(e[0], "borderTopWidth", !0),
                        r.left += p.css(e[0], "borderLeftWidth", !0)),
                        {
                            top: t.top - r.top - p.css(n, "marginTop", !0),
                            left: t.left - r.left - p.css(n, "marginLeft", !0)
                        }
                    }
                },
                offsetParent: function() {
                    return this.map(function() {
                        for (var e = this.offsetParent || kt; e && !p.nodeName(e, "html") && "static" === p.css(e, "position"); )
                            e = e.offsetParent;
                        return e || kt
                    })
                }
            }),
            p.each({
                scrollLeft: "pageXOffset",
                scrollTop: "pageYOffset"
            }, function(t, n) {
                var r = "pageYOffset" === n;
                p.fn[t] = function(i) {
                    return q(this, function(t, i, o) {
                        var s = Et(t);
                        if (void 0 === o)
                            return s ? s[n] : t[i];
                        s ? s.scrollTo(r ? e.pageXOffset : o, r ? o : e.pageYOffset) : t[i] = o
                    }, t, i, arguments.length, null)
                }
            }),
            p.each(["top", "left"], function(e, t) {
                p.cssHooks[t] = we(c.pixelPosition, function(e, n) {
                    if (n)
                        return n = be(e, t),
                        ye.test(n) ? p(e).position()[t] + "px" : n
                })
            }),
            p.each({
                Height: "height",
                Width: "width"
            }, function(e, t) {
                p.each({
                    padding: "inner" + e,
                    content: t,
                    "": "outer" + e
                }, function(n, r) {
                    p.fn[r] = function(r, i) {
                        var o = arguments.length && (n || "boolean" != typeof r)
                          , s = n || (!0 === r || !0 === i ? "margin" : "border");
                        return q(this, function(t, n, r) {
                            var i;
                            return p.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (i = t.documentElement,
                            Math.max(t.body["scroll" + e], i["scroll" + e], t.body["offset" + e], i["offset" + e], i["client" + e])) : void 0 === r ? p.css(t, n, s) : p.style(t, n, r, s)
                        }, t, o ? r : void 0, o, null)
                    }
                })
            }),
            p.fn.size = function() {
                return this.length
            }
            ,
            p.fn.andSelf = p.fn.addBack,
            "function" == typeof define && define.amd && define("jquery", [], function() {
                return p
            });
            var St = e.jQuery
              , Dt = e.$;
            return p.noConflict = function(t) {
                return e.$ === p && (e.$ = Dt),
                t && e.jQuery === p && (e.jQuery = St),
                p
            }
            ,
            void 0 === t && (e.jQuery = e.$ = p),
            p
        });

    }
    , {}],
    28: [function(require, module, exports) {
        !function(e, t, n) {
            for (var r, i = {
                8: "backspace",
                9: "tab",
                13: "enter",
                16: "shift",
                17: "ctrl",
                18: "alt",
                20: "capslock",
                27: "esc",
                32: "space",
                33: "pageup",
                34: "pagedown",
                35: "end",
                36: "home",
                37: "left",
                38: "up",
                39: "right",
                40: "down",
                45: "ins",
                46: "del",
                91: "meta",
                93: "meta",
                224: "meta"
            }, o = {
                106: "*",
                107: "+",
                109: "-",
                110: ".",
                111: "/",
                186: ";",
                187: "=",
                188: ",",
                189: "-",
                190: ".",
                191: "/",
                192: "`",
                219: "[",
                220: "\\",
                221: "]",
                222: "'"
            }, a = {
                "~": "`",
                "!": "1",
                "@": "2",
                "#": "3",
                $: "4",
                "%": "5",
                "^": "6",
                "&": "7",
                "*": "8",
                "(": "9",
                ")": "0",
                _: "-",
                "+": "=",
                ":": ";",
                '"': "'",
                "<": ",",
                ">": ".",
                "?": "/",
                "|": "\\"
            }, c = {
                option: "alt",
                command: "meta",
                return: "enter",
                escape: "esc",
                plus: "+",
                mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"
            }, s = 1; s < 20; ++s)
                i[111 + s] = "f" + s;
            for (s = 0; s <= 9; ++s)
                i[s + 96] = s;
            function l(e, t, n) {
                e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent("on" + t, n)
            }
            function u(e) {
                if ("keypress" == e.type) {
                    var t = String.fromCharCode(e.which);
                    return e.shiftKey || (t = t.toLowerCase()),
                    t
                }
                return i[e.which] ? i[e.which] : o[e.which] ? o[e.which] : String.fromCharCode(e.which).toLowerCase()
            }
            function f(e) {
                return "shift" == e || "ctrl" == e || "alt" == e || "meta" == e
            }
            function p(e, t, n) {
                return n || (n = function() {
                    if (!r)
                        for (var e in r = {},
                        i)
                            e > 95 && e < 112 || i.hasOwnProperty(e) && (r[i[e]] = e);
                    return r
                }()[e] ? "keydown" : "keypress"),
                "keypress" == n && t.length && (n = "keydown"),
                n
            }
            function h(e, t) {
                var n, r, i, o = [];
                for (n = function(e) {
                    return "+" === e ? ["+"] : (e = e.replace(/\+{2}/g, "+plus")).split("+")
                }(e),
                i = 0; i < n.length; ++i)
                    r = n[i],
                    c[r] && (r = c[r]),
                    t && "keypress" != t && a[r] && (r = a[r],
                    o.push("shift")),
                    f(r) && o.push(r);
                return {
                    key: r,
                    modifiers: o,
                    action: t = p(r, o, t)
                }
            }
            function d(e) {
                var n = this;
                if (e = e || t,
                !(n instanceof d))
                    return new d(e);
                n.target = e,
                n._callbacks = {},
                n._directMap = {};
                var r, i = {}, o = !1, a = !1, c = !1;
                function s(e) {
                    e = e || {};
                    var t, n = !1;
                    for (t in i)
                        e[t] ? n = !0 : i[t] = 0;
                    n || (c = !1)
                }
                function p(e, t, r, o, a, c) {
                    var s, l, u, p, h = [], d = r.type;
                    if (!n._callbacks[e])
                        return [];
                    for ("keyup" == d && f(e) && (t = [e]),
                    s = 0; s < n._callbacks[e].length; ++s)
                        if (l = n._callbacks[e][s],
                        (o || !l.seq || i[l.seq] == l.level) && d == l.action && ("keypress" == d && !r.metaKey && !r.ctrlKey || (u = t,
                        p = l.modifiers,
                        u.sort().join(",") === p.sort().join(",")))) {
                            var y = !o && l.combo == a
                              , m = o && l.seq == o && l.level == c;
                            (y || m) && n._callbacks[e].splice(s, 1),
                            h.push(l)
                        }
                    return h
                }
                function y(e, t, r, i) {
                    n.stopCallback(t, t.target || t.srcElement, r, i) || !1 === e(t, r) && (function(e) {
                        e.preventDefault ? e.preventDefault() : e.returnValue = !1
                    }(t),
                    function(e) {
                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
                    }(t))
                }
                function m(e) {
                    "number" != typeof e.which && (e.which = e.keyCode);
                    var t = u(e);
                    t && ("keyup" != e.type || o !== t ? n.handleKey(t, function(e) {
                        var t = [];
                        return e.shiftKey && t.push("shift"),
                        e.altKey && t.push("alt"),
                        e.ctrlKey && t.push("ctrl"),
                        e.metaKey && t.push("meta"),
                        t
                    }(e), e) : o = !1)
                }
                function k(e, t, n, a) {
                    function l(t) {
                        return function() {
                            c = t,
                            ++i[e],
                            clearTimeout(r),
                            r = setTimeout(s, 1e3)
                        }
                    }
                    function f(t) {
                        y(n, t, e),
                        "keyup" !== a && (o = u(t)),
                        setTimeout(s, 10)
                    }
                    i[e] = 0;
                    for (var p = 0; p < t.length; ++p) {
                        var d = p + 1 === t.length ? f : l(a || h(t[p + 1]).action);
                        v(t[p], d, a, e, p)
                    }
                }
                function v(e, t, r, i, o) {
                    n._directMap[e + ":" + r] = t;
                    var a, c = (e = e.replace(/\s+/g, " ")).split(" ");
                    c.length > 1 ? k(e, c, t, r) : (a = h(e, r),
                    n._callbacks[a.key] = n._callbacks[a.key] || [],
                    p(a.key, a.modifiers, {
                        type: a.action
                    }, i, e, o),
                    n._callbacks[a.key][i ? "unshift" : "push"]({
                        callback: t,
                        modifiers: a.modifiers,
                        action: a.action,
                        seq: i,
                        level: o,
                        combo: e
                    }))
                }
                n._handleKey = function(e, t, n) {
                    var r, i = p(e, t, n), o = {}, l = 0, u = !1;
                    for (r = 0; r < i.length; ++r)
                        i[r].seq && (l = Math.max(l, i[r].level));
                    for (r = 0; r < i.length; ++r)
                        if (i[r].seq) {
                            if (i[r].level != l)
                                continue;
                            u = !0,
                            o[i[r].seq] = 1,
                            y(i[r].callback, n, i[r].combo, i[r].seq)
                        } else
                            u || y(i[r].callback, n, i[r].combo);
                    var h = "keypress" == n.type && a;
                    n.type != c || f(e) || h || s(o),
                    a = u && "keydown" == n.type
                }
                ,
                n._bindMultiple = function(e, t, n) {
                    for (var r = 0; r < e.length; ++r)
                        v(e[r], t, n)
                }
                ,
                l(e, "keypress", m),
                l(e, "keydown", m),
                l(e, "keyup", m)
            }
            d.prototype.bind = function(e, t, n) {
                return e = e instanceof Array ? e : [e],
                this._bindMultiple.call(this, e, t, n),
                this
            }
            ,
            d.prototype.unbind = function(e, t) {
                return this.bind.call(this, e, function() {}, t)
            }
            ,
            d.prototype.trigger = function(e, t) {
                return this._directMap[e + ":" + t] && this._directMap[e + ":" + t]({}, e),
                this
            }
            ,
            d.prototype.reset = function() {
                return this._callbacks = {},
                this._directMap = {},
                this
            }
            ,
            d.prototype.stopCallback = function(e, n) {
                return !((" " + n.className + " ").indexOf(" mousetrap ") > -1) && (!function e(n, r) {
                    return null !== n && n !== t && (n === r || e(n.parentNode, r))
                }(n, this.target) && ("INPUT" == n.tagName || "SELECT" == n.tagName || "TEXTAREA" == n.tagName || n.isContentEditable))
            }
            ,
            d.prototype.handleKey = function() {
                return this._handleKey.apply(this, arguments)
            }
            ,
            d.init = function() {
                var e = d(t);
                for (var n in e)
                    "_" !== n.charAt(0) && (d[n] = function(t) {
                        return function() {
                            return e[t].apply(e, arguments)
                        }
                    }(n))
            }
            ,
            d.init(),
            e.Mousetrap = d,
            "undefined" != typeof module && module.exports && (module.exports = d),
            "function" == typeof define && define.amd && define(function() {
                return d
            })
        }(window, document);

    }
    , {}],
    29: [function(require, module, exports) {
        var flags_json = require("../../../../config/prod_flags.json");
        module.exports = flags_json;

    }
    , {
        "../../../../config/prod_flags.json": 1
    }],
    30: [function(require, module, exports) {
    }
    , {
        "@popperjs/core": 20,
        "_process": 41
    }],
    31: [function(require, module, exports) {
        function PaddingModel(n) {
            var i = PaddingModel.LineModel;
            this.paddingX = [],
            this.paddingY = [];
            var d = -1
              , l = -1;
            n.forEachLine(function(n, t) {
                null != n && null != t && (null == this.paddingY[n] && (this.paddingY[n] = new i(n)),
                this.paddingY[n].matchingLine = t,
                null == this.paddingX[t] && (this.paddingX[t] = new i(t)),
                this.paddingX[t].matchingLine = n),
                null == n ? (null == this.paddingY[d] && (this.paddingY[d] = new i(d)),
                this.paddingY[d].nullLines.push(t)) : null == t && (null == this.paddingX[l] && (this.paddingX[l] = new i(l)),
                this.paddingX[l].nullLines.push(n)),
                null != n && (d = n),
                null != t && (l = t)
            }, this)
        }
        PaddingModel.prototype.getPm = function(n) {
            return n ? this.paddingX : this.paddingY
        }
        ,
        PaddingModel.LineModel = function(n) {
            this.isAbove = -1 == n,
            this.lineIndex = -1 == n ? 0 : n,
            this.nullLines = [],
            this.matchingLine = null
        }
        ,
        module.exports = PaddingModel;

    }
    , {}],
    32: [function(require, module, exports) {
        Platform = function() {}
        ;
        var ios = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent)
          , mac = ios || /Mac/.test(navigator.platform);
        Platform.CMD_CNTRL_KEY = mac ? "command" : "ctrl",
        Platform.CMD_CNTRL_KEY_NAME = mac ? "Cmd" : "Ctrl",
        module.exports = Platform;

    }
    , {}],
    33: [function(require, module, exports) {
        module.exports = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="share-dialog-title">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="diff-dialog-butter" style="display:none;"></div>\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal">\n          <span aria-hidden="true">×</span>\n          <span class="sr-only">Close</span>\n        </button>\n        <h2 class="modal-title">Export image</h4>\n      </div>\n      <div class="modal-body">\n\n        <div class="small">\n          Download the image below:\n        </div>\n        <div class="publish-container">\n          <div class="copy-container">\n            <div class="diff-html-container"></div>\n            <img class="diff-img" style="display:none"></img>\n          </div>\n        </div>\n\n      </div>\n      <div class="modal-footer">\n        <a class="btn btn-default diff-img-copy">\n          Copy to clipboard\n        </a>\n        <a class="btn btn-default diff-img-download" download="diff.png">\n          Download\n        </a>\n        <button type="button" class="btn btn-default" data-dismiss="modal">\n          Done\n        </button>\n      </div>\n    </div>\n  </div>\n</div>\n';

    }
    , {}],
    34: [function(require, module, exports) {
        var $ = require("jquery");
        window.jQuery = window.$ = $;
        var Flags = require("./flags")
          , text = require("./shareimagedialog.html")
          , diffModelToHtml = require("./diffhtmlgenerator").diffModelToHtml
          , html2canvas = require("html2canvas");
        ShareImageWidget = function(t, i) {
            this.diffEditor = t,
            $("#share-image").click($.proxy(this.onButtonClick, this)),
            this.$dialog = $(text),
            this.$dialog.on("shown.bs.modal", $.proxy(this.onShown, this)),
            this.$dialog.on("hidden.bs.modal", $.proxy(this.onHidden, this)),
            this.$diffHtmlContainer = this.$dialog.find(".diff-html-container"),
            this.$diffImg = this.$dialog.find(".diff-img"),
            this.imgDataURL = null,
            this.$diffImgDownload = this.$dialog.find(".diff-img-download"),
            this.$diffImgDownload.click($.proxy(this.onDownloadClick, this)),
            this.$diffImgCopy = this.$dialog.find(".diff-img-copy"),
            this.$diffImgCopy.click($.proxy(this.onCopyClick, this)),
            this.$copyStatusButter = this.$dialog.find(".diff-dialog-butter")
        }
        ,
        ShareImageWidget.prototype.onButtonClick = function(t) {
            t.preventDefault(),
            this.$dialog.modal("show");
            var i = diffModelToHtml(this.diffEditor.linesDiffModel);
            this.$diffHtmlContainer.html(i)
        }
        ,
        ShareImageWidget.prototype.onShown = function() {
            html2canvas(this.$diffHtmlContainer.get(0)).then($.proxy(this.updateImage, this))
        }
        ,
        ShareImageWidget.prototype.updateImage = function(t) {
            this.imgDataURL = t.toDataURL(),
            this.$diffImg.width(this.$diffHtmlContainer.width()).attr("src", this.imgDataURL).show(),
            this.$diffHtmlContainer.hide(),
            this.$diffImgDownload.attr("href", this.imgDataURL)
        }
        ,
        ShareImageWidget.prototype.onDownloadClick = function() {
        }
        ,
        ShareImageWidget.prototype.onCopyClick = function() {
            window.fetch ? window.fetch(this.imgDataURL).then($.proxy(function(t) {
                return t.blob()
            }, this)).then($.proxy(function(t) {
                return navigator.clipboard.write([new ClipboardItem({
                    "image/png": t
                })])
            }, this)).then($.proxy(function() {
                this.setStatusButter("success")
            }, this)).catch($.proxy(function() {
                this.setStatusButter("failure")
            }, this)) : this.setStatusButter("failure")
        }
        ,
        ShareImageWidget.prototype.setStatusButter = function(t) {
            switch (t) {
            case "success":
                return void this.$copyStatusButter.text("Image copied to clipboard").show().removeClass("diff-dialog-butter-failure").addClass("diff-dialog-butter-success");
            case "failure":
                return void this.$copyStatusButter.text("Error copying to clipboard").show().removeClass("diff-dialog-butter-success").addClass("diff-dialog-butter-failure")
            }
        }
        ,
        ShareImageWidget.prototype.onHidden = function() {
            this.$diffImg.attr("src", "").hide(),
            this.$diffHtmlContainer.html("").show(),
            this.$diffImgDownload.attr("href", ""),
            this.$copyStatusButter.hide()
        }
        ,
        module.exports = ShareImageWidget;

    }
    , {
        "./diffhtmlgenerator": 9,
        "./flags": 14,
        "./shareimagedialog.html": 33,
        "html2canvas": 26,
        "jquery": 27
    }],
    35: [function(require, module, exports) {
        module.exports = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="share-dialog-title">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal">\n          <span aria-hidden="true">×</span>\n          <span class="sr-only">Close</span>\n        </button>\n        <h2 class="modal-title">Share link</h4>\n      </div>\n      <div class="modal-body">\n\n        <div class="publish-container">\n          <form>\n            <div class="form-group">\n              Want a link you can share? Publish the content to diffdiff.net.\n            </div>\n            <div class="form-group page-publishing-only">\n              <label for="publish-title">Title</label>\n              <input class="form-control" id="publish-title" placeholder="Title">\n            </div>\n            <div class="form-group page-publishing-only">\n              <label for="publish-description">Description</label>\n              <textarea class="form-control" style="resize:vertical" id="publish-description" placeholder="A brief description..."></textarea>\n            </div>\n            <div class="form-group page-publishing-only">\n              <div class="row">\n                <div class="col-xs-6">\n                  <label for="publish-title-v1">Left title</label>\n                  <input class="form-control" id="publish-title-v1" placeholder="Before">\n                </div>\n                <div class="col-xs-6">\n                  <label for="publish-title-v2">Right title</label>\n                  <input class="form-control" id="publish-title-v2" placeholder="After">\n                </div>\n              </div>\n            </div>\n\n            <div class="form-group">\n              <button type="button" class="btn btn-primary publish-button">\n                Publish now\n              </button>\n            </div>\n            <div style="display:none" class="share-link-error bg-danger">\n              Sorry, something went wrong.\n            </div>\n            <div class="form-group">\n              <input readonly="readonly" type="url" class="form-control share-link-input" />\n            </div>\n          </form>\n        </div>\n\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">\n          Done\n        </button>\n      </div>\n    </div>\n  </div>\n</div>\n';

    }
    , {}],
    36: [function(require, module, exports) {
        var $ = require("jquery");
        window.jQuery = window.$ = $;
        var Flags = require("./flags")
          , text = require("./sharelinkdialog.html");
        ShareLinkWidget = function(i) {
            Flags.ENABLE_PUBLISHING && (this.diffEditor = i,
            $("#share-link").click($.proxy(this.handleButtonClick, this)),
            this.$dialog = $(text),
            Flags.ENABLE_PAGE_PUBLISHING ? (this.$titleInput = this.$dialog.find("#publish-title"),
            this.$descriptionInput = this.$dialog.find("#publish-description"),
            this.$titleV1Input = this.$dialog.find("#publish-title-v1"),
            this.$titleV2Input = this.$dialog.find("#publish-title-v2")) : this.$dialog.find(".page-publishing-only").hide(),
            this.$dialog.find(".publish-button").click($.proxy(this.handlePublish, this)),
            this.$shareLinkInput = this.$dialog.find(".share-link-input"),
            this.$shareLinkInput.click(function() {
                this.select()
            }),
            this.$shareLinkInput.focus(function() {
                this.select()
            }),
            this.$error = this.$dialog.find(".share-link-error"))
        }
        ,
        ShareLinkWidget.prototype.setContent = function(i, t, e, s) {
            this.$titleInput.val(i),
            this.$descriptionInput.val(t),
            this.$titleV1Input.val(e),
            this.$titleV2Input.val(s)
        }
        ,
        ShareLinkWidget.prototype.handleButtonClick = function(i) {
            i.preventDefault(),
            this.$dialog.modal("show"),
            this.$shareLinkInput.hide()
        }
        ,
        ShareLinkWidget.prototype.handlePublish = function(i) {
            i.preventDefault(),
            this.$error.hide();
            var t = this.diffEditor.getContent()
              , e = {
                v1: t.x,
                v2: t.y
            };
            Flags.ENABLE_PAGE_PUBLISHING && (e.dm = JSON.stringify(this.diffEditor.getDiffModel().toJson()),
            e.title = this.$titleInput.val(),
            e.description = this.$descriptionInput.val(),
            e.titleV1 = this.$titleV1Input.val(),
            e.titleV2 = this.$titleV2Input.val()),
            $.post("/setcontent", e).success($.proxy(this.handlePublishSuccess, this)).fail($.proxy(this.handlePublishFailure, this))
        }
        ,
        ShareLinkWidget.prototype.handlePublishSuccess = function(i) {
            Flags.ENABLE_PAGE_PUBLISHING ? (window.history.propertyIsEnumerable({}, null, "/fork/" + i),
            window.location = "/page/" + i) : (window.history.propertyIsEnumerable({}, null, "/a/" + i),
            this.$shareLinkInput.val(document.location),
            this.$shareLinkInput.show(),
            this.$shareLinkInput.focus())
        }
        ,
        ShareLinkWidget.prototype.handlePublishFailure = function() {
            this.$error.show()
        }
        ,
        module.exports = ShareLinkWidget;

    }
    , {
        "./flags": 14,
        "./sharelinkdialog.html": 35,
        "jquery": 27
    }],
    37: [function(require, module, exports) {
        module.exports = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="share-dialog-title">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal">\n          <span aria-hidden="true">×</span>\n          <span class="sr-only">Close</span>\n        </button>\n        <h2 class="modal-title">Export HTML</h4>\n      </div>\n      <div class="modal-body">\n\n        <div class="copy-container">\n          <h3>Copy elsewhere</h3>\n          <div class="small">\n            Just copy and paste the content below:\n          </div>\n          <div class="diff-html-container"></div>\n        </div>\n\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">\n          Done\n        </button>\n      </div>\n    </div>\n  </div>\n</div>\n';

    }
    , {}],
    38: [function(require, module, exports) {
        var $ = require("jquery");
        window.jQuery = window.$ = $;
        var text = require("./sharetextdialog.html")
          , diffModelToHtml = require("./diffhtmlgenerator").diffModelToHtml;
        ShareTextWidget = function(t, e) {
            this.diffEditor = t,
            $("#share-text").click($.proxy(this.handleButtonClick, this)),
            this.$dialog = $(text),
            this.$diffHtmlContainer = this.$dialog.find(".diff-html-container"),
            this.$diffHtmlContainer.click($.proxy(this.selectHtml, this))
        }
        ,
        ShareTextWidget.prototype.handleButtonClick = function(t) {
            t.preventDefault(),
            this.$dialog.modal("show");
            var e = diffModelToHtml(this.diffEditor.linesDiffModel);
            this.$diffHtmlContainer.html(e)
        }
        ,
        ShareTextWidget.prototype.selectHtml = function() {
            setTimeout($.proxy(function() {
                var t = document.createRange();
                t.selectNodeContents(this.$diffHtmlContainer[0].firstChild);
                var e = window.getSelection();
                e.removeAllRanges(),
                e.addRange(t)
            }, this), 1)
        }
        ,
        module.exports = ShareTextWidget;

    }
    , {
        "./analytics/eventid": 3,
        "./diffhtmlgenerator": 9,
        "./flags": 14,
        "./sharetextdialog.html": 37,
        "jquery": 27
    }],
    39: [function(require, module, exports) {
        var $ = require("jquery");
        SidebarWidget = function(i) {
            $(".navbar-toggle").click($.proxy(this.handleOpenSidebar, this)),
            this.sidebarRoot = $("#sidebar-root")
        }
        ,
        SidebarWidget.prototype.handleOpenSidebar = function() {
            this.sidebarRoot.modal("show"),
            this.sidebarRoot.click($.proxy(this.handleSidebarClick, this))
        }
        ,
        SidebarWidget.prototype.handleSidebarClick = function() {
            this.sidebarRoot.modal("hide")
        }
        ,
        module.exports = SidebarWidget;

    }
    , {
        "jquery": 27
    }],
    40: [function(require, module, exports) {
        var IndexedSubsequence = require("./indexedsubsequence")
          , Tokenizer = {
            regex: /(\w*)/,
            tokenize: function(e) {
                for (var n = e.split(Tokenizer.regex), t = 0, r = [], s = 0; s < n.length; s++) {
                    var u = n[s];
                    u.length > 0 && (r.push(new Token(u,t)),
                    t += u.length)
                }
                return r
            },
            equals: function(e, n) {
                return e.text == n.text
            },
            issOfTokensToIssInString: function(e, n) {
                for (var t = new IndexedSubsequence, r = 0; r < e.length(); r++) {
                    var s = n[e.get(r)];
                    t.addRange(s.start, s.end)
                }
                return t
            }
        }
          , Token = function(e, n) {
            this.text = e,
            this.start = n,
            this.end = n + e.length
        };
        module.exports = Tokenizer;

    }
    , {
        "./indexedsubsequence": 18
    }],
    41: [function(require, module, exports) {
        var currentQueue, process = module.exports = {}, queue = [], draining = !1, queueIndex = -1;
        function cleanUpNextTick() {
            draining = !1,
            currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1,
            queue.length && drainQueue()
        }
        function drainQueue() {
            if (!draining) {
                var e = setTimeout(cleanUpNextTick);
                draining = !0;
                for (var n = queue.length; n; ) {
                    for (currentQueue = queue,
                    queue = []; ++queueIndex < n; )
                        currentQueue[queueIndex].run();
                    queueIndex = -1,
                    n = queue.length
                }
                currentQueue = null,
                draining = !1,
                clearTimeout(e)
            }
        }
        function Item(e, n) {
            this.fun = e,
            this.array = n
        }
        function noop() {}
        process.nextTick = function(e) {
            var n = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var r = 1; r < arguments.length; r++)
                    n[r - 1] = arguments[r];
            queue.push(new Item(e,n)),
            1 !== queue.length || draining || setTimeout(drainQueue, 0)
        }
        ,
        Item.prototype.run = function() {
            this.fun.apply(null, this.array)
        }
        ,
        process.title = "browser",
        process.browser = !0,
        process.env = {},
        process.argv = [],
        process.version = "",
        process.versions = {},
        process.on = noop,
        process.addListener = noop,
        process.once = noop,
        process.off = noop,
        process.removeListener = noop,
        process.removeAllListeners = noop,
        process.emit = noop,
        process.binding = function(e) {
            throw new Error("process.binding is not supported")
        }
        ,
        process.cwd = function() {
            return "/"
        }
        ,
        process.chdir = function(e) {
            throw new Error("process.chdir is not supported")
        }
        ,
        process.umask = function() {
            return 0
        }
        ;

    }
    , {}]
}, {}, [5]);
