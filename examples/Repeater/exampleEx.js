var dp = new ArrayEx([{first_name:"john", last_name:"qwerty"}, {first_name:"jack", last_name:"toast"}]);
var myRepeater = new RepeaterEx({
    id: 'repeater',
    dataProvider:dp,
    components: [
        {
            ctor: Button,
            props: {
                id: 'component',
                label: "{first_name+' '+last_name}",
            }
        }
    ]
});

myRepeater.renderPromise().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});