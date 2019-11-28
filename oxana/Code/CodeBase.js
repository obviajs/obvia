var CodeBase = 
{

}
CodeBase.require = function(){
    rjs.define(CodeBase.basepath + "codemirror.js", "codemirror");
    rjs.define(CodeBase.basepath + "codemirror.css", "codemirror_css");
    return rjs.require(["codemirror", "codemirror_css"]);
}
CodeBase.basepath = "./oxana/Code/require/lib/";