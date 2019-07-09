var myTree = new Tree({
    id: 'tree',
    type: "button",
    value: "Clicked Me",
    style: '',
    class: "btn btn-success",
    valueField: "key",
    labelField: "title",
    childrenField: "children",
    dataProvider:[
        {title: "Node 1", key: "1"},
        {title: "Folder 2", key: "2", children: [
          {title: "Node 2.1", key: "3", myOwnAttr: "abc"},
          {title: "Node 2.2", key: "4"}
        ]}
      ],
      
    click : function(e){console.log("From ClickAction");}
});

myTree.on('creationComplete', function () {
  myTree.on('click',function (){
   // alert("test");
  });
});
$('#root').append(myTree.render());