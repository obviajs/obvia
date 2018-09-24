var flowerCM = window.flowerCM || {};
rjs.define('./js/components/TextField.js','TextField');
rjs.define('./lib/flower_dependecies/scripts/jquery.inputmask.bundle.min.js','InputMaskBundle');
rjs.require(['InputMaskBundle','TextField'],function(){
    var myTextField = new TextField({
        id: 'textfield',
        colspan: '6',
        versionStyle: '',
        blockProcessAttr: false,
        required: true,
        mask: 'currency',
        value: '34,444.00'
    });
    $('#root').append(myTextField.render());
},flowerCM);