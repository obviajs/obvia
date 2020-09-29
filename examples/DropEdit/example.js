var myDropEdit = new DropEdit({
    id: 'dropdown',
    hrefField: "key",
    labelField: "title",
    placeholder: "Click me",
    dataProvider: new ArrayEx([

        {
            key: "#",
            title: "Folder 1"
        },
        {
            key: "#",
            title: "Folder 2"
        },
        {
            key: "#",
            title: "Folder 3"
        },
        {
            key: "#",
            title: "Folder 4"
        },
        {
            key: "#",
            title: "Folder 5"
        },
        {
            key: "#",
            title: "Folder 6"
        },

    ]),
});

myDropEdit.on('creationComplete', function () {
    myDropEdit.on('click', function () {
        //alert(test);
    });
});
myDropEdit.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});

var dpReplace = new ArrayEx([

    {
        key: "#",
        title: "Link 5"
    },
    {
        key: "#",
        title: "Link 6"
    },
    {
        key: "#",
        title: "Link 7"
    },
    {
        key: "#",
        title: "Link 8"
    },
])

// myDropDown.dataProvider = dpReplace;
var dp = {
    key: '10',
    title: 'Folder 10'
};
var dp1 = {
    key: '#',
    title: 'Folder 11'
};
// myDropDown.dataProvider.splice(2,1);
//myDropDown.dataProvider.splice(2,0, dp,dp1);