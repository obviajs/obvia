/**
 * This is an Upload Input Element
 *
 * Kreatx 2019
 */
 
//component definition
var Upload = function (_props, overrided = false) {
    var _self = this;
 
    Object.defineProperty(this, "files",
    {
        get: function files() {
            return this.$el[0].files;
        }
    });
    
    Object.defineProperty(this, "name", 
    {
        get: function name() 
        {
            return _name;
        },
        set: function name(v) 
        {
            if(_name != v)
            {  
                _name = v;
                if(_name)
                {
                    if(this.$el)
                        this.$el.attr("name", _name);
                }else
                {
                    if(this.$el)
                        this.$el.removeAttr('name');
                }
            }
        }
    });

    Object.defineProperty(this, "multiple", 
    {
        get: function multiple() 
        {
            return _multiple;
        },
        set: function multiple(v) 
        {
            if(_multiple != v)
            {  
                _multiple = v;
                if(_multiple)
                {
                    if(this.$el)
                        this.$el.attr("multiple", _multiple);
                }else
                {
                    if(this.$el)
                        this.$el.removeAttr('multiple');
                }
            }
        }
    });
    Object.defineProperty(this, "accept", 
    {
        get: function accept() 
        {
            return _accept;
        },
        set: function accept(v) 
        {
            if(_accept != v)
            {  
                _accept = v;
                if(_accept)
                {
                    if(this.$el)
                        this.$el.attr("accept", _accept);
                }else
                {
                    if(this.$el)
                        this.$el.removeAttr('accept');
                }
            }
        }
    });
    
    this.fileDialog = function() {
        this.$el.click();
    }

    this.template = function () {
        return  "<input data-triggers='change' type='file' id='" + this.domID + "'>";
    };
 
    var _defaultParams = {
        multiple:false
    };
    _props = extend(false, false, _defaultParams, _props);
 
    var _name; 
    var _multiple;
    var _accept;
    var _promise;

    Component.call(this, _props);
    
    if(_props.name)
        this.name = _props.name;
    if(_props.multiple)
        this.multiple = _props.multiple;  
    if(_props.accept)
        this.accept = _props.accept;      
        
};
 
//component prototype
Upload.prototype.ctor = 'Upload';