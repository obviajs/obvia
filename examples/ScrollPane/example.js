var rpp = 10;
var ra = new RemoteArray({url:"http://192.168.64.2/rca/index.php", post:{"testKey":"testValue"}, recordsPerPage:rpp, method: "POST"})
var dp = new ArrayEx(ra);
var myScrollPane = new ScrollPane({
    id: "pane",
    height: 230,
    scrollHeight: 253,
    scrollUnitHeight:23,
    component: {
        ctor: Repeater,
        props:{
            id: 'repeater',
            dataProvider:dp.page,
            components: [
                {
                    ctor: Button,
                    props: {
                        id: 'component',
                        label: "{first_name+' '+last_name}",
                    }
                }
            ]
        }
    }
});
myScrollPane.on('endDraw', function(e)
{
    dp.on("propertyChange", function(e){
        if(e.property == "length"){
            if(ra.totalRecords == Infinity){
                myScrollPane.scrollHeight += 230;
            }else{
                myScrollPane.scrollHeight += (ra.totalRecords % rpp) * myScrollPane.scrollUnitHeight;
            }
        }
    });
    myScrollPane.on("virtualScrollEnd", function(e){
        console.log("prevVirtualIndex:", e.prevVirtualIndex);
        console.log("virtualIndex:", e.virtualIndex);
        console.log("scroll units:", e.scrollUnits);
        console.log("progressiveScrollUnits", e.progressiveScrollUnits);
        dp.gotoRecord(e.virtualIndex);
    });
});

myScrollPane.render().then(function (cmpInstance)
{
  $('#root').append(cmpInstance.$el);
});