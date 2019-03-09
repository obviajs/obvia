var Spacing = function(_props, $el)
{  
    this.setClass = function(className, v)
    {
        var classArr = [];
        for(var i=0;i<13;i++)
        {
            classArr.push(className+i);       
        }

        _$el.removeClass(classArr);
        _$el.addClass(className + v);
    }
    Object.defineProperty(this, "colSpan", 
    {
        get: function colSpan() 
        {
            return _colSpan;
        },
        set: function colSpan(v) 
        {
            if(_colSpan != v)
            {
                _colSpan = v;
                if(_$el && v && !isNaN(v))
                {
                    this.setClass('col-sm-', v);
                }
            }
        },
        configurable: true
    });
    
    Object.defineProperty(this, "offset", 
    {
        get: function offset() 
        {
            return _offset;
        },
        set: function offset(v) 
        {
            if(_offset != v)
            {
                _offset = v;
                if(_$el && v && !isNaN(v))
                {
                    this.setClass('col-sm-offset-', v);
                }
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "mb", 
    {
        get: function mb() 
        {
            return _mb;
        },
        set: function mb(v) 
        {
            if(_mb != v)
            {
                _mb = v;
                if(_$el && v && !isNaN(v))
                {
                    this.setClass('mb-', v);
                }
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "mt", 
    {
        get: function mt() 
        {
            return _mt;
        },
        set: function mt(v) 
        {
            if(_mt != v)
            {
                _mt = v;
                if(_$el && v && !isNaN(v))
                {
                    this.setClass('mt-', v);
                }
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "ml", 
    {
        get: function ml() 
        {
            return _ml;
        },
        set: function ml(v) 
        {
            if(_ml != v)
            {
                _ml = v;
                if(_$el && v && !isNaN(v))
                {
                    this.setClass('ml-', v);
                }
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "mr", 
    {
        get: function mr() 
        {
            return _mr;
        },
        set: function mr(v) 
        {
            if(_mr != v)
            {
                _mr = v;
                if(_$el && v && !isNaN(v))
                {
                    this.setClass('mr-', v);
                }
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "mx", 
    {
        get: function mx() 
        {
            return _mx;
        },
        set: function mx(v) 
        {
            if(_mx != v)
            {
                _mx = v;
                if(_$el && v && !isNaN(v))
                {
                    this.setClass('mx-', v);
                }
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "my", 
    {
        get: function my() 
        {
            return _my;
        },
        set: function my(v) 
        {
            if(_my != v)
            {
                _my = v;
                if(_$el && v && !isNaN(v))
                {
                    this.setClass('my-', v);
                }
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "pb", 
    {
        get: function pb() 
        {
            return _pb;
        },
        set: function pb(v) 
        {
            if(_pb != v)
            {
                _pb = v;
                if(_$el && v && !isNaN(v))
                {
                    this.setClass('pb-', v);
                }
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "pt", 
    {
        get: function pt() 
        {
            return _pt;
        },
        set: function pt(v) 
        {
            if(_pt != v)
            {
                _pt = v;
                if(_$el && v && !isNaN(v))
                {
                    this.setClass('pt-', v);
                }
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "pl", 
    {
        get: function pl() 
        {
            return _pl;
        },
        set: function pl(v) 
        {
            if(_pl != v)
            {
                _pl = v;
                if(_$el && v && !isNaN(v))
                {
                    this.setClass('pl-', v);
                }
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "pr", 
    {
        get: function pr() 
        {
            return _pr;
        },
        set: function pr(v) 
        {
            if(_pr != v)
            {
                _pr = v;
                if(_$el && v && !isNaN(v))
                {
                    this.setClass('pr-', v);
                }
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "px", 
    {
        get: function px() 
        {
            return _px;
        },
        set: function px(v) 
        {
            if(_px != v)
            {
                _px = v;
                if(_$el && v && !isNaN(v))
                {
                    this.setClass('px-', v);
                }
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "py", 
    {
        get: function py() 
        {
            return _py;
        },
        set: function py(v) 
        {
            if(_py != v)
            {
                _py = v;
                if(_$el && v && !isNaN(v))
                {
                    this.setClass('py-', v);
                }
            }
        }, 
        configurable: true
    });
//mx-auto, my-auto
    var _$el = $el;
    var _offset, _colSpan, _mb, _mt, _ml, _mr, _mx, _my, _pb, _pt, _pl, _pr, _px, _py;
    if (_props)
    {
        var pArr = ['offset', 'colSpan', 'mb', 'mt', 'ml', 'mr', 'mx', 'my', 'pb', 'pt', 'pl', 'pr', 'px', 'py'];
        for(var i=0;i<pArr.length;i++)
        {
            var prop = pArr[i];
            if (_props[prop])
                this[prop] = _props[prop];
        }       
    }
}