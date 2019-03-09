var flowerCM = window.flowerCM || {};
rjs.define('./js/components/TextInput.js', 'TextInput');
rjs.define('./lib/flower_dependencies/scripts/jquery.inputmask.bundle.min.js', 'InputMaskBundle');
rjs.require(["InputMaskBundle", "TextInput"], function () {
    var myText = TextInput({
        id: 'textField',
        mask: 'currency',
        value: '34,444.00'
    });

    $('#root').append(myText.render());

    this["myText"] = myText;
}, flowerCM)



