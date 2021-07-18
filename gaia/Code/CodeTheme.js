var CodeTheme =
{
    "default":"default",
    "3024-day":"3024-day",
    "3024-night":"3024-night",
    "abcdef":"abcdef",
    "ambiance":"ambiance",
    "base16-dark":"base16-dark",
    "base16-light":"base16-light",
    "bespin":"bespin",
    "blackboard":"blackboard",
    "cobalt":"cobalt",
    "colorforth":"colorforth",
    "darcula":"darcula",
    "dracula":"dracula",
    "duotone-dark":"duotone-dark",
    "duotone-light":"duotone-light",
    "eclipse":"eclipse",
    "elegant":"elegant",
    "erlang-dark":"erlang-dark",
    "gruvbox-dark":"gruvbox-dark",
    "hopscotch":"hopscotch",
    "icecoder":"icecoder",
    "idea":"idea",
    "isotope":"isotope",
    "lesser-dark":"lesser-dark",
    "liquibyte":"liquibyte",
    "lucario":"lucario",
    "material":"material",
    "material-darker":"material-darker",
    "material-palenight":"material-palenight",
    "material-ocean":"material-ocean",
    "mbo":"mbo",
    "mdn-like":"mdn-like",
    "midnight":"midnight",
    "monokai":"monokai",
    "moxer":"moxer",
    "neat":"neat",
    "neo":"neo",
    "night":"night",
    "nord":"nord",
    "oceanic-next":"oceanic-next",
    "panda-syntax":"panda-syntax",
    "paraiso-dark":"paraiso-dark",
    "paraiso-light":"paraiso-light",
    "pastel-on-dark":"pastel-on-dark",
    "railscasts":"railscasts",
    "rubyblue":"rubyblue",
    "seti":"seti",
    "shadowfox":"shadowfox",
    "solarized dark":"solarized dark",
    "solarized light":"solarized light",
    "the-matrix":"the-matrix",
    "tomorrow-night-bright":"tomorrow-night-bright",
    "tomorrow-night-eighties":"tomorrow-night-eighties",
    "ttcn":"ttcn",
    "twilight":"twilight",
    "vibrant-ink":"vibrant-ink",
    "xq-dark":"xq-dark",
    "xq-light":"xq-light",
    "yeti":"yeti",
    "yonce":"yonce",
    "zenburn":"zenburn"
}
CodeTheme.require = function(theme){
    let p;
    if(theme!="default"){
        rjs.define(CodeTheme.basepath+"/"+theme+".css", theme+"_css");
        p = rjs.require([theme+"_css"]);
    }else{
        p = Promise.resolve();
    }
    return p;
}
CodeTheme.basepath = "Code/require/theme/";
export {
    CodeTheme
};