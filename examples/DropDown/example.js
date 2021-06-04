import { DropDown } from "../../components/DropDown/DropDown.js";
import { ArrayEx } from "../../lib/ArrayEx.js";

var myDropDown = new DropDown({
  id: 'dropdown',
  valueField: "key",
  labelField: "title",
  label: "Click me",
  dataProvider: new ArrayEx([

    { key: "#", title: "Folder 1" },
    { key: "#", title: "Folder 2" },
    { key: "#", title: "Folder 3" },
    { key: "#", title: "Folder 4" },
    { key: "#", title: "Folder 5" },
    { key: "#", title: "Folder 6" },

  ]),
});

myDropDown.on('endDraw', function () {
  myDropDown.on('click', function () {
    //alert(test);
  });
});
myDropDown.render().then(function (cmpInstance) {
  $(document.body).append(cmpInstance.$el);
});


export { myDropDown }