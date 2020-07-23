var HRuleFactory = function(props){
    this.xmlTemplate = '<break>'+
				'<reportElement x="{left}" y="{top}" width="{width}" height="{height}" uuid="{uuid}"/>'+
            '</break>';
    this.defaultParams={
        "left": 10,
         "top": 10,
         "width":100,
         "height":100,
    };
    this.props = extend(this.defaultParams, props);

    this.toXml = function()
    {
        return this.xmlTemplate.formatUnicorn(this.props);
    }
}