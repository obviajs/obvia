var SectionFactory = function(){

    this.name = '';
    this.xmlTemplate = '<{name}>{bandsPlaceholder}</{name}>';
    this.bands=[];
    this.xmlDoc = [];

    this.toXml = function(bands)
    {
        console.log("Band: ",bands);
        var bandsXML = [];
        name = bands.props.name;
        bands = bands.props.components;
        // var bandsPlaceholder = "{{index}} ";
        // var bandsPlaceholderAcc = "";
        // for(var key in bands){
        //     bandsPlaceholderAcc += bandsPlaceholder.formatUnicorn({"index":key}); 
        //     bandsXML[key]=bands[key].toXml();

        // }
        // for(var i=0;i<bands.length;i++)
        // {
        //     bandsPlaceholderAcc += bandsPlaceholder.formatUnicorn({"index":i}); 
        //     bandsXML.push(bands[i].toXml());
        // }
        var bandFactory = new BandFactory();
        bandsXML += bandFactory.toXml(bands); 
        //var xmlTemplate_bph = this.xmlTemplate.formatUnicorn({"name":bands.props.name, "bandsPlaceholder": bandXML});

        return this.xmlTemplate.formatUnicorn({"name":name, "bandsPlaceholder": bandsXML}); 
    }
}