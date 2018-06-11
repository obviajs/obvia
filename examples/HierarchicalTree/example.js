var myHierarchicalTree= new HierarchicalTree({
    id: 'tree',
    type: "button",
    value: "Clicked Me",
    style: '',
    class: "btn btn-success",
    lazy:true,
    dataProvider:[
        {title: "Node 1", key: "1"},
        {title: "Folder 2", key: "2", folder: true, children: [
          {title: "Node 2.1", key: "3", myOwnAttr: "abc"},
          {title: "Node 2.2", key: "4"}
        ]}
      ],
      
    onclick : function(e){console.log("From ClickAction");}
});

myHierarchicalTree.on('creationComplete', function () {
  myHierarchicalTree.on('click',function (){
   // alert("test");
  });
});
$('#root').append(myHierarchicalTree.render());