var Case = KxGenerator.createComponent({
    data: null,
    viewMode: "steps",
    render: function () {
        
    }
});

/*
    initModel: function () {
        return {
            formAction: (this.viewMode == "steps") ? "?forms/modify_form_submit" : "#"
        }
    },

    renderFormHeader: function (viewMode) {
        return (
            viewMode == 'steps' ? 
                "<div class='row'>" +
                "</div>" :
                
                "<div class='row'>" +
                    "<div class='col-sm-12'>" +
                        "<center>" +
                            "<h4>" +
                                "{formName}" +
                            "</h4>" +
                        "</center>" +
                    "</div>" +
                "</div><hr>"
        )    
    },*/
//component prototype
Case.type = 'case';

//register dom element for this component
KxGenerator.registerDOMElement(Case, 'kx-case');