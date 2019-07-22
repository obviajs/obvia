function visit(n, parent) {
    console.log($(n).prop("tagName"));
    var lit, nid = $(n).attr('id'); 

    var cmp = [];
    var ch_nodes = $(n).children();
    for (var i = 0; i < ch_nodes.length; i++) {
        cmp.push(visit(ch_nodes[i]))
    };
    var cls = (new ArrayEx($(n).prop("classList"))).toArray();
    if (["div", "header"].indexOf($(n).prop("tagName").toLowerCase()) > -1) {       
        lit = {
            constructor: "Container",
            props: {
                "id": nid,
                classes: cls,
                components: cmp
            }
        };
    } else if(["ul"].indexOf($(n).prop("tagName").toLowerCase()) > -1){
        lit = {
            constructor: "Tree",
            props: {
                id: nid,
                valueField: "key",
                labelField: "title",
                childrenField: "children",
                dataProvider: cmp,
                classes: cls
            }
        };
    } else if(["li"].indexOf($(n).prop("tagName").toLowerCase()) > -1){
        lit = {}; var title;
        if($(n).children().length>0)
            title = $(n).last().text();
        else
            title = $(n).text();
        lit.title = title;
    } else if(["button"].indexOf($(n).prop("tagName").toLowerCase()) > -1){
        lit = {
            constructor: "Button",
            props: {
                id: nid,
                type: "button",
                value: $(n).attr('value'),
                label: $(n).text(),
                classes: cls,
                components: cmp
            }
        };
    } else if(["img"].indexOf($(n).prop("tagName").toLowerCase()) > -1){
        lit = {
            constructor: "Image",
            props: {
                id: nid,
                src: $(n).attr('src'),
                alt: $(n).attr('alt'),
                height: $(n).attr('height'),
                width: $(n).attr('width')
            }
        };
    } else if(["i", "b", "u", "span", "label", "p", "sup"].indexOf($(n).prop("tagName").toLowerCase()) > -1){
        lit = {
            constructor: "Label",
            props: {
                id: nid,
                label: $(n).text(),
                labelType: $(n).prop("tagName").toLowerCase(),
                classes: cls,
                components: cmp
            }
        };
    } else if(["a"].indexOf($(n).prop("tagName").toLowerCase()) > -1){
        lit = {
            constructor: "Link",
            props: {
                id: nid,
                href: $(n).attr('href'),
                label: $(n).text(),
                target: $(n).attr('target'),
                classes: cls,
                components: cmp
            }
        };
    }
    return lit;
}