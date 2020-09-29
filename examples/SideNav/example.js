let click = function () {
    console.log("SideNav item click", arguments);
}

var mySideNav = new SideNav({
    id: "mySideNav",
    width: 250,
    classes: ["sidenav"],
    components: [{
            ctor: Link,
            props: {
                id: 'fa',
                label: "",
                href: "#",
                target: "",
                classes: ["fas", "fa-times", "closebtn"]
            }
        },
        {
            ctor: Repeater,
            props: {
                rendering: {
                    direction: 'vertical'
                },
                components: [{
                    ctor: Link,
                    props: {
                        id: "menuItem",
                        label: "{label}",
                        href: "#",
                        target: "",
                        "click": click
                    }
                }],
                dataProvider: new ArrayEx([{
                    "label": "Item 1"
                }, {
                    "label": "Item 2"
                }, {
                    "label": "Item 3"
                }])
            }
        }
    ]
});

mySideNav.render().then(function (cmpInstance)
{
  $('#root').append(cmpInstance.$el);
});