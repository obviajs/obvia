var myHierarchialTree = new HierarchialTree({
    id:"hierarchialTree",
    dataProvider: new ArrayEx([
        {title: "Parent", key: "1" ,children: new ArrayEx([
            {title: "Child", key: "8" ,children: new ArrayEx([
                {title: "Grand Child", key: "9"}
            ])},
            {title: "Child", key: "5", children: new ArrayEx([
                {title: "Grand Child", key: "10"},
                {title: "Grand Child", key: "11",children: new ArrayEx([
                    {title: "Grand Child", key: "13"},
                    {title: "Grand Child", key: "14"},
                    {title: "Grand Child", key: "15"},
                ])},
                {title: "Grand Child", key: "12"}
            ])}
        ])}
    ])
});



myHierarchialTree.on('endDraw',function(){
    myHierarchialTree.on('click',function(){
        //alert("Test");
    });
});
myHierarchialTree.render().then(function (cmpInstance)
{
    $('#root').append(cmpInstance.$el);
});