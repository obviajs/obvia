var myHRule = new HRule({
    id: 'hrule',
    align: "center",
    size: 5,
    width: 1000,
});
$('#root').append(await myHRule.render().$el);