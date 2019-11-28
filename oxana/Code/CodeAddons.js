var CodeAddons = 
{

}
CodeAddons.require = function(){
    //Scrollbar
    rjs.define(CodeAddons.basepath + "scroll/simplescrollbars.js", "simplescrollbars");
    rjs.define(CodeAddons.basepath + "scroll/simplescrollbars.css", "simplescrollbars_css");
    //Fullscreen
    rjs.define(CodeAddons.basepath + "display/fullscreen.css", "fullscreen_css");
    rjs.define(CodeAddons.basepath + "display/fullscreen.js", "fullscreen");
    //Folding
    rjs.define(CodeAddons.basepath + "fold/foldgutter.css", "foldgutter_css");
    rjs.define(CodeAddons.basepath + "fold/foldcode.js", "foldcode");
    rjs.define(CodeAddons.basepath + "fold/foldgutter.js", "foldgutter");
    rjs.define(CodeAddons.basepath + "fold/brace-fold.js", "brace-fold");
    rjs.define(CodeAddons.basepath + "fold/indent-fold.js", "indent-fold");
    rjs.define(CodeAddons.basepath + "fold/comment-fold.js", "comment-fold");
    //Brackets
    rjs.define(CodeAddons.basepath + "edit/closebrackets.js", "closebrackets");
    rjs.define(CodeAddons.basepath + "edit/matchbrackets.js", "matchbrackets");
    //Search/Replace
    rjs.define(CodeAddons.basepath + "search/matchesonscrollbar.css", "matchesonscrollbar_css");
    rjs.define(CodeAddons.basepath + "search/search.js", "search");
    rjs.define(CodeAddons.basepath + "search/searchcursor.js", "searchcursor");
    rjs.define(CodeAddons.basepath + "search/jump-to-line.js", "jump-to-line");
    rjs.define(CodeAddons.basepath + "scroll/annotatescrollbar.js", "annotatescrollbar");
    rjs.define(CodeAddons.basepath + "dialog/dialog.css", "dialog_css");
    rjs.define(CodeAddons.basepath + "dialog/dialog.js", "dialog");
    //Merge/diff
    rjs.define(CodeAddons.basepath + "merge/merge.css", "merge_css");
    rjs.define(CodeAddons.basepath + "merge/diff_match_patch.js", "diff_match_patch");
    rjs.define(CodeAddons.basepath + "merge/merge.js", "merge");
    //Linter
    rjs.define(CodeAddons.basepath + "lint/lint.css", "lint_css");
    rjs.define(CodeAddons.basepath + "lint/lint.js", "lint");
    rjs.define(CodeAddons.basepath + "lint/json-lint.js", "json-lint");
    rjs.define(CodeAddons.basepath + "lint/javascript-lint.js", "javascript-lint");
    //Hinter
    rjs.define(CodeAddons.basepath + "hint/show-hint.css", "show-hint_css");
    rjs.define(CodeAddons.basepath + "hint/show-hint.js", "show-hint");
    rjs.define(CodeAddons.basepath + "hint/javascript-hint.js", "javascript-hint");
    rjs.define(CodeAddons.basepath + "hint/jshint.js", "jshint");

    return rjs.require(["simplescrollbars", "simplescrollbars_css", "fullscreen_css", "fullscreen", "foldgutter_css",
        "foldcode", "foldgutter", "brace-fold", "indent-fold", "comment-fold", "closebrackets", "matchesonscrollbar_css",
        "search", "searchcursor", "jump-to-line", "annotatescrollbar", "dialog_css", "dialog", "merge_css", "diff_match_patch", "merge",
        "lint_css", "lint", "json-lint", "javascript-lint.js", "show-hint_css", "show-hint", "javascript-hint", "jshint"                     
    ]);
}
CodeAddons.basepath = "./oxana/Code/require/addon/"; 