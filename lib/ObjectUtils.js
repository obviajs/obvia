/*
* This function will copy getters and setter. if you call $.extend (or a similiar function) on the resulting object 
* the accessors will be overwritten with fixed values (return value of the accessor when it is being copied)  
*/
function copyAccessors(objFrom, objTo)
{
  //var ob2 = Object.assign({}, object1);
    objTo = objTo || {};
    var objFromDesc = Object.getOwnPropertyDescriptors(objFrom);
    for(var prop in objFrom)
    {
        if((!!objFromDesc[prop]['get']) || (!!objFromDesc[prop]['set']))
        {
            Object.defineProperty(objTo, prop, 
            { 
                get: objFromDesc[prop]['get'], enumerable: objFromDesc[prop].enumerable, configurable: objFromDesc[prop].configurable,
                set: objFromDesc[prop]['set']  
            });
        }
    }
    return objTo;
}
/*
* This function will copy the specified getter or setter.
*/
function copyAccessor(prop, objFrom, objTo)
{
	objTo = objTo || {};
     if(typeof arguments[0] === 'string' || arguments[0] instanceof String) {
		prop = arguments[0];
        i++;
        var objFromDesc = Object.getOwnPropertyDescriptor(objFrom, prop);   
        if((!!objFromDesc['get']) || (!!objFromDesc['set']))
        {
            Object.defineProperty(objTo, prop, 
            { 
                get: objFromDesc['get'], enumerable: objFromDesc.enumerable, configurable: objFromDesc.configurable,
                set: objFromDesc['set'] 
            });
        }    
    }else if(arguments[0] && arguments[0].constructor === Array)
    {
        var props = arguments[0];
        for(var i=0;i<props.length;i++)
        {
            objTo = copyAccessor(props[i], objFrom, objTo)
        }
    }
    return objTo;
}

function isGetter (obj, prop) {
    return !!Object.getOwnPropertyDescriptor(obj, prop)['get'];
}
function isSetter (obj, prop) {
    return !!Object.getOwnPropertyDescriptor(obj, prop)['set'];
}
function isFunction (obj, prop) {
    const desc = Object.getOwnPropertyDescriptor (obj, prop);
    return !!desc && typeof desc.value === 'function';
}
/*
* Object.copy works like Object.assign but includes getters, setters, and non enumerable properties too.
*/
Object.copy = (function (O) {
    var
        dP    = O.defineProperty,
        gOPD  = O.getOwnPropertyDescriptor,
        gOPN  = O.getOwnPropertyNames,
        gOPS  = O.getOwnPropertySymbols,
        set   = function (target, source) {
        for (var
            key,
            keys = gOPN(source).concat(gOPS(source)),
            i = 0,
            l = keys.length; i < l; i++
        ) {
            key = keys[i];
            dP(target, key, gOPD(source, key));
        }
        };
    return function copy(target) {
        for (var i = 1, l = arguments.length; i < l; i++) {
        set(target, arguments[i]);
        }
        return target;
    };
}(Object));

/*
* A plural ES5 + ES6 friendly version of Object.getOwnPropertyDescriptors
*/
'getOwnPropertyDescriptors' in Object || (
    Object.getOwnPropertyDescriptors = function (Object) {
        var
        gOPD    = Object.getOwnPropertyDescriptor,
        gOPN    = Object.getOwnPropertyNames,
        gOPS    = Object.getOwnPropertySymbols,
        gNS     = gOPS ? function (object) {
                            return gOPN(object).concat(gOPS(object));
                            } :
                            gOPN,
        descriptors
        ;
        function copyFrom(key) {
            descriptors[key] = gOPD(this, key);
        }
        return function getOwnPropertyDescriptors(object) {
            var result = descriptors = {};
            gNS(object).forEach(copyFrom, object);
            descriptors = null;
            return result;
        };
    }(Object)
);

/*
* Pass in the objects to merge as arguments.
* For a deep extend, set the first argument to `true`.
* For copying accessors (getters and setters) set the second argument to true, otherwise they will be skipped 
* If you want to skip deep copying for a specified property pass it as a third string or array parameter -
* this is useful for mimicking static variables
*/
var extend = function () {

	// Variables
	var extended = {};
	var deep = false;
	var i = 0;
	var length = arguments.length;
    var copyAccessors_flag = false;
    var staticProperties = [];
    var excludeProperties = [];
	// Check if a deep merge
	if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
		deep = arguments[0];
		i++;
	}
    if (Object.prototype.toString.call(arguments[1]) === '[object Boolean]') {
		copyAccessors_flag = arguments[1];
		i++;
    }
    
    if (typeof arguments[2] === 'string' || arguments[2] instanceof String) {
		staticProperties.push(arguments[2]);
		i++;
    }else if(Array.isArray(arguments[2]))
    {
        staticProperties = arguments[2];
        i++;
    }
    if (typeof arguments[3] === 'string' || arguments[3] instanceof String) {
		excludeProperties.push(arguments[2]);
		i++;
    }else if(Array.isArray(arguments[3]))
    {
        excludeProperties = arguments[3];
        i++;
    }
	// Merge the object into the extended object
	var merge = function (obj) {
		for ( var prop in obj ) {
			if (Object.prototype.hasOwnProperty.call(obj, prop) && !excludeProperties.includes(prop)) {
                if(!(isGetter (obj, prop) || isSetter (obj, prop))){
                    // If deep merge and property is an object, merge properties
                    if (deep && (Object.prototype.toString.call(obj[prop]) === '[object Object]') && !staticProperties.includes(prop)) {
                        extended[prop] = extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }else if(copyAccessors_flag)
                {
                		 copyAccessor(prop, obj, extended);   
                }
			}
		}
	};

	// Loop through each object and conduct a merge
	for ( ; i < length; i++ ) {
		var obj = arguments[i];
		merge(obj);
	}

	return extended;
};

if (!Object.keys) {
    Object.keys = (function() {
      'use strict';
      var hasOwnProperty = Object.prototype.hasOwnProperty,
          hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
          dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
          ],
          dontEnumsLength = dontEnums.length;
  
      return function(obj) {
        if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
          throw new TypeError('Object.keys called on non-object');
        }
  
        var result = [], prop, i;
  
        for (prop in obj) {
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }
  
        if (hasDontEnumBug) {
          for (i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
          }
        }
        return result;
      };
    }());
  }

function isObject(x) {
    return Object(x) === x;
}

function evalBindingExpression(parent, expression){
    var pieces = parseObjectPathExpression(expression);

    var curObj = parent;
    for(var i=1;i<pieces.length;i++){
        if(curObj[pieces[i]]!=undefined){
            curObj = curObj[pieces[i]];
        }else{
            console.log(pieces[i]+" not found on "+expression+" ObjectPath")
        }
    }
    return curObj;
}

function parseObjectPathExpression(str){
    if(typeof str !== 'string'){
        throw new TypeError('parseObjectPathExpression must be passed a string');
    }

    var i = 0;
    var parts = [];
    var d, b, q, c;
    while (i < str.length){
        d = str.indexOf('.', i);
        b = str.indexOf('[', i);

        // we've reached the end
        if (d === -1 && b === -1){
            parts.push(str.slice(i, str.length));
            i = str.length;
        }

        // dots
        else if (b === -1 || (d !== -1 && d < b)) {
            parts.push(str.slice(i, d));
            i = d + 1;
        }

        // brackets
        else {
            if (b > i){
                parts.push(str.slice(i, b));
                i = b;
            }
            q = str.slice(b+1, b+2);
            if (q !== '"' && q !=='\'') {
                c = str.indexOf(']', b);
                if (c === -1) c = str.length;
                parts.push(str.slice(i + 1, c));
                i = (str.slice(c + 1, c + 2) === '.') ? c + 2 : c + 1;
            } else {
                c = str.indexOf(q+']', b);
                if (c === -1) c = str.length;
                while (str.slice(c - 1, c) === '\\' && b < str.length){
                    b++;
                    c = str.indexOf(q+']', b);
                }
                parts.push(str.slice(i + 2, c).replace(new RegExp('\\'+q,'g'), q));
                i = (str.slice(c + 2, c + 3) === '.') ? c + 3 : c + 2;
            }
        }
    }
    return parts;
}