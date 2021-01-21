var BandFactory = function(){
    
    this.xmlTemplate = '<band height="{height}" splitType="{splitType}">{bandContent}</band>';
    
    this.height = 200;
    this.splitType = "Stretch";
    this.components = [];
    
    this.toXml = function(components)
    {
      var bandContent = "";
      for(i=1;i<components.length;i++) {
        switch(components[i].ctor){
          case "JRLabel": 
            constructorFactory = new StaticTextFactory(components[i].props); 
            break;
          case "JRImage": 
            constructorFactory = new ImageFactory(components[i].props);
            // constructorFactory.props.path = cmp_ci.cmp.src;
            break;
          case "JRHRule": 
            constructorFactory = new HRuleFactory(components[i].props); 
            break;
          case "JRTextInput": 
            var xmlSyntax =
              components[i].props.value.split(components[i].props.value)
                .join(
                  (components[i].props.editorCode && components[i].props.editorCode !== "")
                    ? components[i].props.editorCode
                    : components[i].props.componentWithData
                    ? "$F{" + components[i].props.value + "}"
                    : ('"' + components[i].props.value + '"')
                );
            components[i].props.value = xmlSyntax;
            constructorFactory = new TextFieldFactory(components[i].props);
            break;
        }
        bandContent += constructorFactory.toXml();
      }
      return this.xmlTemplate.formatUnicorn({"height":this.height, "splitType":this.splitType,"bandContent":bandContent}); 
    }

}