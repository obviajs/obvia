var ReportFactory = function (){

    this.xmlTemplate = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<!-- Created with Kreatx Report Builder -->'+
    '<jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports http://jasperreports.sourceforge.net/xsd/jasperreport.xsd" name="Blank_A4_1" language="javascript" pageWidth="595" pageHeight="842" columnWidth="555" leftMargin="20" rightMargin="20" topMargin="20" bottomMargin="20" uuid="6bb6cf92-83f7-4c41-aad5-52ff1bea1c59">'+
        // '{subDataset}'+
        '<queryString>'+
           '<![CDATA[]]>'+ 
        '</queryString>'+
        // '{fields}'+
        '{sectionsXML}'+
    '</jasperReport>'
    
    this.reportName = "",
    this.report_uuid = "",
    this.dataViewFields = [];
    this.subDataset = [];
    this.sections = [];
    this.names = [];				
    
    
    this.toXml = function(sections)
    {
        sections = sections == undefined ? this.sections : sections;
        // names = names == undefined ? this.names : names;												
        var sectionsXML = "";
        // var namesXML = "";				  
        for(var section = 0;section < sections.length;section++)
        {
            //console.log("section: ", section);
            if(sections[section]!=undefined && sections[section] !=null && sections[section] != "not null"){
                console.log(sections[section])
                var sectionFactory = new SectionFactory();
                sectionsXML += sectionFactory.toXml(sections[section]);
            }
        }
        // for(var name in names)
        // {
        //     if(names[name]!=undefined && names[name] !=null)
        //     {
        //         namesXML += names[name].toXml();
        //     }
        // }
        // // console.log("Props",{"sectionsXML":sectionsXML,"sql":this.sql,"fields":namesXML,"subDataset":subdataset});
            return this.xmlTemplate.formatUnicorn({"sectionsXML":sectionsXML}); 
    }
    
}