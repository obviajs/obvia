var myCode = new Code({
    id: "myCode",
    width: 700,
    height: 300                          
});
var myMergeView = new CodeMerge({
    id: "myMergeView",
    width: 700,
    height: 300,
    value: "function a(){}",
    orig: "function b(){}"   
});
$('#root').append(myCode.render());
$('#root').append(myMergeView.render());