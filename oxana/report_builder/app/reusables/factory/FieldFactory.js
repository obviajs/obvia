var FieldFactory = function (){

    this.xmlTemplate = '{fields}'
    
    this.field = ''				
    
    this.toXml = function(queryFields)
    {
      //get fields' names
      let queryFields = dataViewFields.fields.map(dvf => dvf.fieldName)
      
      let fields = "";
      let groups = ""
  
      queryFields.forEach(field => {
          //add field tag to the xml
          fields +=
          ('<field name="' + field + '" class="java.lang.String">' +
            '<property name="com.jaspersoft.studio.field.name" value="' + field + '"/>' +
            '<property name="com.jaspersoft.studio.field.label" value="' + field + '"/>' +
            '<property name="com.jaspersoft.studio.field.tree.path" value="document"/>' +
            '<fieldDescription><![CDATA[]]></fieldDescription>' +
          '</field>')
          
          //add group tag to the xml
          groups += 
          '<group name="'+ field +'">' + 
            '<groupExpression><![CDATA[$F{'+ field +'}]]></groupExpression>' +
          '</group>'
      })
  
      
      return this.xmlTemplate.formatUnicorn({
        "sectionsXML": sectionsXML,
        "query": dataViewFields.sql,
        "fields": fields,
        "groups": groups
      }); 
    }
      
  }