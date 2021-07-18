var CodeMode =
{
    "javascript": "javascript",
    "clike": "clike",
    "php": "php",
    "python": "python",
    "sql": "sql",
    "xml": "xml",
    "xquery": "xquery",
    "yaml": "yaml"
}
CodeMode.require = function(mode){
    rjs.define(CodeMode.basepath+mode+"/"+mode+".js", mode);
    return rjs.require([mode]);
}
CodeMode.basepath = "Code/require/mode/"; 