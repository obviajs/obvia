var myCreditCard = new CreditCard({
    id:'creditCard',

});



myCreditCard.on('creationComplete',function(){
    myCreditCard.on('click',function(){
        //alert(test1A);
    });
});

myCreditCard.render().then(function (cmpInstance)
{
  $('#root').append(cmpInstance.$el);
});
