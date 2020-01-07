var CalendarBase = function(_props){
    let _self = this, _calendarEvents, _inputFormat, _outputFormat, _childrenField, _guidField, _nowDate, _calendarStartDate;
    
    let _dpWatcher;
    let _dpLengthChanged = function(e){
        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    let _dpMemberChanged = function(e){
        e.stopPropagation();
        e.stopImmediatePropagation();
      
    }
    
    Object.defineProperty(this, "calendarEvents", {
        get: function calendarEvents(){
           return _calendarEvents;
        },
        set: function calendarEvents(v){
            if(_calendarEvents != v){
                if(_dpWatcher && _calendarEvents){
                    _dpWatcher.reset();
                    _calendarEvents.off("propertyChange", _dpMemberChanged);
                }
                _calendarEvents = v;
                if(_calendarEvents){
                    _dpWatcher = ChangeWatcher.getInstance(_calendarEvents);
                    _dpWatcher.watch(_calendarEvents, "length", _dpLengthChanged);
                    _calendarEvents.on("propertyChange", _dpMemberChanged);
                }
            }
        },
        enumerable: true
    });  
    
    Object.defineProperty(this, "inputFormat", {
        get: function inputFormat()
        {
            return _inputFormat;
        },
        set: function inputFormat(v)
        {
            if (_inputFormat != v)
            {
                _inputFormat = v;
            }
        },
        enumerable: true
    });
    
    Object.defineProperty(this, "outputFormat", {
        get: function outputFormat()
        {
            return _outputFormat;
        },
        set: function outputFormat(v)
        {
            if (_outputFormat != v)
            {
                _outputFormat = v;
            }
        },
        enumerable: true
    });
    
    Object.defineProperty(this, "guidField", {
        get: function guidField()
        {
            return _guidField;
        }
    });
    
    Object.defineProperty(this, "childrenField", {
        get: function childrenField()
        {
            return _childrenField;
        }
    });
    
    Object.defineProperty(this, "calendarStartDate",{
        get: function calendarStartDate(){
            return  _calendarStartDate;
        },
        set: function calendarStartDate(v)
        {
            if (_calendarStartDate != v)
            {
                _calendarStartDate = v;
            }
        }
    });
    
    Object.defineProperty(this, "nowDate",{
        get: function nowDate(){
            return  _nowDate;
        },
        set: function nowDate(v)
        {
            if (_nowDate != v)
            {
                _nowDate = v;
            }
        }
    });
    
    let _defaultParams = {        
        type: ContainerType.NONE,
        calendarEvents: new ArrayEx(),
        inputFormat: 'YYYY-MM-DD HH:mm',
        outputFormat: 'YYYY-MM-DD HH:mm',
        guidField: "guid",
        childrenField: "children",
        nowDate: new Date(),
        calendarStartDate: undefined
    };
    
    _props = extend(false, false, _defaultParams, _props);
    if (!_props.attr) { 
        _props.attr = {};
    }
    let myDtEvts = ["cellClick"];
    if (!Object.isEmpty(_props.attr) && _props.attr["data-triggers"] && !Object.isEmpty(_props.attr["data-triggers"]))
    {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++)
        {   
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");
    if (_props.calendarEvents)
        _self.calendarEvents = _props.calendarEvents;
    if (_props.inputFormat)
        _self.inputFormat = _props.inputFormat;
    if (_props.outputFormat)
        _self.outputFormat = _props.outputFormat;
    if (_props.childrenField)
        _self.childrenField = _props.childrenField;
    if (_props.nowDate)
        _self.nowDate = _props.nowDate;
    if (_props.calendarStartDate)
        _self.calendarStartDate = _props.calendarStartDate;        
        
    let r = Container.call(this, _props);
    
    return r;
}
CalendarBase.prototype.ctor = 'CalendarBase';