var Case = KxGenerator.createComponent({
    data: null,
    viewMode: "steps",
    render: function () {
        
    }
});

//component prototype
Case.type = 'case';

//register dom element for this component
KxGenerator.registerDOMElement(Case, 'kx-case');