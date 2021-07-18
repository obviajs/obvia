var ScrollPane = function(_props)
{
    let _self = this, _child, _component;

    Object.defineProperty(this, "height", 
    {
        get: function height() 
        {
            return _height;
        },
        set: function height(v) 
        {
            if(_height != v)
            {
                _height = v;
                if(this.$el)
                {
                    v = v || 0;
                    this.$el.css('height', v+(isString(_height) && _height.indexOf("%")>-1?"":"px"));
                    _$scrollArea.css('margin-top', v+(isString(_height) && _height.indexOf("%")>-1?"":"px"));
                    _rowCount = Math.ceil(_height/_scrollUnitHeight);
                }
            }
        },
        configurable:true
    });
    
    Object.defineProperty(this, "scrollUnitHeight", 
    {
        get: function scrollUnitHeight() 
        {
            return _scrollUnitHeight;
        }
    });
    
    Object.defineProperty(this, "child", 
    {
        get: function child() 
        {
            return _child;
        }
    });

    Object.defineProperty(this, "component", 
    {
        get: function component() 
        {
            return _component;
        }
    });

    Object.defineProperty(this, "scrollHeight", 
    {
        get: function scrollHeight() 
        {
            return _scrollHeight;
        },
        set: function scrollHeight(v) 
        {
            if(_scrollHeight != v)
            {
                if(this.$el)
                {
                    v = v || 0;
                    _$scrollArea.css('height', v+(isString(v) && v.indexOf("%")>-1?"":"px"));
                    //_updateMyScrollerTop(this.$el.scrollTop());
                    _scrollHeight = v;
                }
            }
        },
        configurable:true
    });

    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_props.height)
                this.height = _props.height;
            this.$el.css({ "overflow-y": "scroll" });
            _$scrollArea.css({ "margin-top": -_height + "px", float: "right", position: "relative", "margin-left": "-16px", width: "10px", height: _scrollHeight + "px" });
            this.$container = this.$el;
            let inst = this.addComponents();
            _child = inst[0];
            
            e.preventDefault();
        }
    };
    
    let _prevScrollTop = 0;
    let _prevVirtualIndex = 0;
    let _progressiveScrollUnits = 0;

    let _scroll = function(e)
    {
        if(_scrollHeight > (e.target.scrollTop + _height) - 2*_scrollUnitHeight)
        {
            //let h = this.$scrollArea.height();
            //this.$scroller.css({"top": (16 + 1.2*(h - (h- e.target.scrollTop)))+"px"});
            let evt = jQuery.Event("virtualScrollStart");
            _self.trigger(evt);
            _child.$el.css({"margin-top":e.target.scrollTop});   
            _$scrollArea.css({"margin-top": (-(_height)-e.target.scrollTop)+"px"});

            //let mt = parseInt(_$scrollArea.css("margin-top"));
            
            let mt = -(_height)-e.target.scrollTop;
            let pct = e.target.scrollTop/_self.scrollHeight;
            let myScrollTop = (_self.scrollHeight + mt)*pct;
/*
            pct = e.target.scrollTop/(_self.scrollHeight-mt);
            myScrollTop = pct * (_self.scrollHeight-230);
            myScrollTop *= _self.scrollHeight/_scrollHeightInit;
            */
            console.log("scrollTop:",e.target.scrollTop," scrollHeight:",_self.scrollHeight," mt:",mt," pct:",pct," myScrollTop:",myScrollTop);
            _$scroller.css({"top": myScrollTop +"px", "margin-top":-230+"px"});
            
            //_updateMyScrollerTop(e.target.scrollTop);
            _delayScroll.apply(_self, arguments);
        }
    };
    let _updateMyScrollerTop = function (scrollTop) {
        let mt = -(_height) - scrollTop;
        let pct = scrollTop / _self.scrollHeight;
        let myScrollTop = (_self.scrollHeight + mt) * pct;
        
        console.log("scrollTop:", scrollTop, " scrollHeight:", _self.scrollHeight, " mt:", mt, " pct:", pct, " myScrollTop:", myScrollTop);
        _$scroller.css({ "top": myScrollTop + "px", "margin-top": -230 + "px" });
    };

    let _virtualScroll = function (e) {
        let scrollTop = e.target.scrollTop;
        let evt = jQuery.Event("virtualScrollEnd");
        evt.prevVirtualIndex = _prevVirtualIndex;
        evt.virtualIndex = _prevVirtualIndex;
        evt.scrollUnits = 0;
        evt.progressiveScrollUnits = _progressiveScrollUnits;
        if (scrollTop >= 0) {
            console.log("scrollTop:", scrollTop);
                
            let virtualIndex = Math.ceil(scrollTop / _scrollUnitHeight);
            scrollTop = virtualIndex * _scrollUnitHeight;

            let deltaScroll = _prevScrollTop - scrollTop;
            if (deltaScroll != 0) {
                let scrollUnits = Math.ceil(Math.abs(deltaScroll) / _scrollUnitHeight) * (deltaScroll / Math.abs(deltaScroll));

                if (deltaScroll < 0) {
                    console.log("scroll down");
                } else {
                    console.log("scroll up");
                }
            
                // virtualIndex = (_rowCount+virtualIndex < _dataProvider.length) ? virtualIndex : (_dataProvider.length-_rowCount);        
                _prevScrollTop = scrollTop;
                if (_prevVirtualIndex != virtualIndex) {
                    _prevVirtualIndex = virtualIndex;
                    if (scrollUnits != 0) {
                        _progressiveScrollUnits += scrollUnits;
                    }
                }
            
                evt.virtualIndex = virtualIndex;
                evt.scrollUnits = scrollUnits;
                evt.progressiveScrollUnits = _progressiveScrollUnits;
            }
        }
        _self.trigger(evt);
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
            if (_height == 0)
                this.$el.css({ height: _child.$el.height() });
            this.$el.append(_$scrollArea);
            this.$el.append(_$scroller);
            this.$el.on("scroll", _scroll);
        }
    };

    var _defaultParams = {
        type: ContainerType.NONE,
        scrollHeight:800,
        attr:{"data-triggers":"virtualScrollStart virtualScrollEnd"},
        scrollUnitHeight:20
    };

    _props = extend(false, false, _defaultParams, _props);
    if (!_props.attr) { 
        _props.attr = {};
    }
    let myDtEvts = ["virtualScrollStart", "virtualScrollEnd"];
    if (!ObjectUtils.isEmpty(_props.attr) && _props.attr["data-triggers"] && !ObjectUtils.isEmpty(_props.attr["data-triggers"]))
    {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++)
        {   
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");
    let _height = 0;
    let _scrollHeight = _props.scrollHeight;
    let _scrollHeightInit = _scrollHeight;
    let _scrollUnitHeight = _props.scrollUnitHeight;
    let _$scrollArea = $("<div style='border:1px solid black;'/>");
    let _$scroller = $("<div style='border:1px solid black;position:relative;float:right;height:40px;width:16px;top:0px;margin-left:-16px;margin-top:-230px;'></div>");
        
    _component = _props.component;
    _props.components = [];

    if(_component && !ObjectUtils.isEmpty(_component)){
        _props.components.push(_component);
    }
    let _delayScroll = debounce(_virtualScroll, 400);

    Container.call(this, _props);
};
ScrollPane.prototype.ctor = 'ScrollPane';