
this.replaceAll = function(find, replace, str) {
    var tempStr = str.replace(find, replace);
    if (tempStr.contains(find)) {
        return replaceAll(find, replace, tempStr);
    }
    return tempStr;
}

//var  dp = createData();

var myCalendar = new Calendar({
    id: 'fullCalendar',
    labelField:"value",
    labelField1:"value",
    childrenField: "children",
    nowDate:new Date(),
    selectedClasses:"selectedClasses",
    classField:"classField",
    classField1:"classField1",
    dataContent:"dataContent",
    //dataProvider: [],//new ArrayEx(dp),
    click : function(e){console.log("From ClickAction");}
    // dataProvider: new ArrayEx([		
    //     {key:'1',value:'Data 1'},
    //     {key:'1',value:'Data 2', children: new ArrayEx([		
    //     {key:'1',value:'Event 1'},
    //        ]),
    //     }
    // ]),
    
});
myCalendar.on('creationComplete', function () {
    
});


$('#root').append(myCalendar.render());