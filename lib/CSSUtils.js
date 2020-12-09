var CSSUtils = {

    //**************************************************************************
    //https://stackoverflow.com/a/46589334
    //** hasStyleRule
    //**************************************************************************
    /** Returns true if there is a style rule defined for a given selector.
     *  @param selector CSS selector (e.g. ".deleteIcon", "h2", "#mid")
     */
    hasStyleRule: function (selector) {

        var hasRule = function (selector, rules) {
            if (!rules) return false;
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                if (rule.selectorText) {
                    var arr = rule.selectorText.split(',');
                    for (var j = 0; j < arr.length; j++) {
                        if (arr[j].indexOf(selector) !== -1) {
                            var txt = trim(arr[j]);
                            if (txt === selector) {
                                return true;
                            } else {
                                var colIdx = txt.indexOf(":");
                                if (colIdx !== -1) {
                                    txt = trim(txt.substring(0, colIdx));
                                    if (txt === selector) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return false;
        };

        var trim = function (str) {
            return str.replace(/^\s*/, "").replace(/\s*$/, "");
        };

        for (var i = 0; i < document.styleSheets.length; i++) {
            var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
            if (hasRule(selector, rules)) {
                return true;
            }

            var imports = document.styleSheets[i].imports;
            if (imports) {
                for (var j = 0; j < imports.length; j++) {
                    rules = imports[j].rules || imports[j].cssRules;
                    if (hasRule(selector, rules)) return true;
                }
            }
        }

        return false;
    },
    copyStyles: function (originDoc, destDoc) {
        var childHead = destDoc.getElementsByTagName("head")[0];
        $(originDoc).find("link").each(
            function (index, element) {
                var childLink = destDoc.createElement("link");
                childLink.rel = "stylesheet";
                childLink.href = element.href;
                childHead.appendChild(childLink);
            });
        $(originDoc).find("style").each(
            function (index, element) {
                var childStyle = destDoc.createElement("style");
                childStyle.type = 'text/css';
                childStyle.innerHTML = $(this).html();
                childHead.appendChild(childStyle);
            });
    },
    addStyle: function (styleOrUrl, mode = 1, destDoc = null) {
        destDoc = destDoc || document;
        var childHead = destDoc.getElementsByTagName("head")[0];
        if (mode == 1) {
            var childLink = destDoc.createElement("link");
            childLink.rel = "stylesheet";
            childLink.href = styleOrUrl;
            childHead.appendChild(childLink);
        } else {
            var childStyle = destDoc.createElement("style");
            childStyle.type = 'text/css';
            childStyle.innerHTML = styleOrUrl;
            childHead.appendChild(childStyle);
        }
    }
};