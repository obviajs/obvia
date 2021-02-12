let myObjectCmp = new ObjectCmp({
    id: "myObjectCmp",
    data: "http://gaia-billing/resources/___temp/reports/Qarkullimi_i_punonjesve_20210211212657.pdf",
    width: "100vw",
    height: "100vh"
});

myObjectCmp.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});