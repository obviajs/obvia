var ReportFactory = function (){

  this.xmlTemplate = '<?xml version="1.0" encoding="UTF-8"?>' +
  '<!-- Created with Kreatx Report Builder -->'+
  '<jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports http://jasperreports.sourceforge.net/xsd/jasperreport.xsd" name="Blank_A4_1" language="javascript" pageWidth="595" pageHeight="842" columnWidth="555" leftMargin="20" rightMargin="20" topMargin="20" bottomMargin="20" uuid="6bb6cf92-83f7-4c41-aad5-52ff1bea1c59">'+
    '<property name="com.jaspersoft.studio.data.sql.tables" value=""/>' +
    '<property name="com.jaspersoft.studio.data.defaultdataadapter" value="DataAdapter.xml"/>' +
    '<queryString>'+
      '<![CDATA[{query}]]>'+ 
    '</queryString>' +
    '{fields}' +
    '{groups}' +
    '{sectionsXML}'+
  '</jasperReport>'
  
  this.reportName = "",
  this.report_uuid = "",
  this.dataViewFields = [];
  this.subDataset = [];
  this.sections = [];
  this.names = [];				
  
  
  this.toXml = (sections, dataViewFields) => {
    sections = sections == undefined ? this.sections : sections;
    var sectionsXML = "";
    for(var section = 0;section < sections.length;section++) {
      if(sections[section]!=undefined && sections[section] !=null && sections[section] != "not null"){
        var sectionFactory = new SectionFactory();
        sectionsXML += sectionFactory.toXml(sections[section]);
      }
    }

    let fields = '';
    let groups = '';

    if (dataViewFields) {
      let dotIndex = dataViewFields.table_name.indexOf('.')
      let tableName = dataViewFields.table_name.slice(0, dotIndex)

      //get fields' names
      let queryFields = dataViewFields.fields.map(dvf => dvf.fieldName)
      
      queryFields.forEach(field => {
        //add field tag to the xml
        fields +=
        ('<field name="' + field + '" class="java.lang.String">' +
        '<property name="com.jaspersoft.studio.field.name" value="' + field + '"/>' +
        '<property name="com.jaspersoft.studio.field.label" value="' + field + '"/>' +
        '<property name="com.jaspersoft.studio.field.tree.path" value="' + tableName +'"/>' +
        '<fieldDescription><![CDATA[]]></fieldDescription>' +
        '</field>')
        
        //add group tag to the xml
        groups += 
        '<group name="'+ field +'">' + 
        '<groupExpression><![CDATA[$F{'+ field +'}]]></groupExpression>' +
        '</group>'
      })
    }
      
    return this.xmlTemplate.formatUnicorn({
      "sectionsXML": sectionsXML,
      "query": dataViewFields ? dataViewFields.sql : '',
      "fields": fields,
      "groups": groups
    }); 
  }
  
}