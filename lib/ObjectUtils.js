ObjectUtils = {};
function getMatchingMember(object, key, matchingValue, returnAllMatches = false) { 
    let chain = [], objects = [];
    for (var prop in object) { 
        if (getChainValue(object[prop], key) == matchingValue) { 
            chain.push([prop]);
            objects.push(object[prop]);
            if (!returnAllMatches)
                break;
        }
    }
    return { "chain": chain, "objects": objects};
}
/**
* Build a default object from the passed object
* @returns {object} result, the default object that was built
*/
function buildDefaultObject(obj, v) {
    var dI = obj.constructor && obj.constructor.name ? new window[obj.constructor.name]() : {};
    v = v?v:[];
    v.push(obj);
    for (var key in obj) {
        if (isObject(obj[key])){
            let len = v.push(obj[key]);
            var o = {};
            for(let p in obj[key]){
                if(obj[key][p] !=null && typeof obj[key][p] == "object"){
                    let ind = v.indexOf(obj[key][p]);
                    if(ind==-1 || ind >= len-1)
                        o[p] = this.buildDefaultObject(obj[key][p], v);	
                    else
                        o[p] = obj[key][p];
                }
                else	
                    o[p] = obj[key][p];
            }
            dI[key] = o;
        }
        else if (obj[key] && obj[key]["forEach"] ){
            var a = [];
            for(let i=0;i<obj[key].length;i++){
                if(obj[key][i] !=null && typeof obj[key][i] == "object"){
                    let ind = v.indexOf(obj[key][i]);
                    if(ind==-1 || ind >= len-1)
                        a.push(this.buildDefaultObject(obj[key][i]), v); 	
                    else
                        a.push(obj[key][i]);
                }
                else
                    a.push(obj[key][i]);
            } 
            dI[key] = a; 
        } 
        else if (typeof obj[key] == "boolean")
            dI[key] = false;   
        else
            dI[key] = "";
    }
    return dI;
}


/**
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
        if(objFromDesc[prop] && ((!!objFromDesc[prop]['get']) || (!!objFromDesc[prop]['set'])))
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
/**
* This function will copy the specified getter or setter.
*/
function copyAccessor(prop, objFrom, objTo)
{
	objTo = objTo || {};
     if(typeof arguments[0] === 'string' || arguments[0] instanceof String) {
		prop = arguments[0];
        var objFromDesc = Object.getOwnPropertyDescriptor(objFrom, prop);   
        if(objFromDesc && ((!!objFromDesc['get']) || (!!objFromDesc['set'])))
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
    var propDescr = Object.getOwnPropertyDescriptor(obj, prop);
    return propDescr && !!propDescr['get'];
}
function isSetter (obj, prop) {
    var propDescr = Object.getOwnPropertyDescriptor(obj, prop);
    return  propDescr && !!propDescr['set'];
}
function isFunction (obj, prop) {
    const desc = Object.getOwnPropertyDescriptor (obj, prop);
    return !!desc && typeof desc.value === 'function';
}
/**
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

/**
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
/**
* @param {string[]} excludeProperties optional parameter. Skip property names included in this array
 */
var shallowCopy = function (src, dest, excludeProperties = []) {
    for (var prop in src) {
        if (!excludeProperties || !excludeProperties.includes(prop))
            dest[prop] = src[prop];
    }
};
/**
* This function returns a collection of objects with properties member name and member value from src
* @param {object} src the object you want to extract property information from
* @param {string} labelField the member name for object property name
* @param {string} valueField the member name for object property value
* @returns {object[]} return the collection of property information objects
*/
var getMembersCollection = function(src, labelField, valueField){
    let c = [];
    for(let p in src){
        let o = {};
        o[labelField] = p;
        o[valueField] = src[p];
        c.push(o);
    }
    return c;
}
/**
 * https://github.com/mbrowne/simpleoo.js/blob/master/simpleoo.js
 * Deep copy an object (make copies of all its object properties, sub-properties, etc.)
 * An improved version of http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone
 * that doesn't break if the constructor has required parameters
 * 
 * It also borrows some code from http://stackoverflow.com/a/11621004/560114
 */ 
function deepCopy(src, /* INTERNAL */ _visited, _copiesVisited) {
    if(src === null || typeof(src) !== 'object'){
        return src;
    }
    
    //Honor native/custom clone methods
    if(typeof src.clone == 'function'){
        return src.clone(true);
    }
    
    //Special cases:
    if (src.constructor == Date || src.constructor == RegExp || src.constructor == Function ||
        src.constructor == String || src.constructor == Number || src.constructor == Boolean)
        return new src.constructor(src);

    //DOM Element
    if(src.nodeType && typeof src.cloneNode == 'function'){
        return src.cloneNode(true);
    }
    
    // Initialize the visited objects arrays if needed.
    // This is used to detect cyclic references.
    if (_visited === undefined){
        _visited = [];
        _copiesVisited = [];
    }
    
    // Check if this object has already been visited
    var i, len = _visited.length;
    for (i = 0; i < len; i++) {
        // If so, get the copy we already made
        if (src === _visited[i]) {
            return _copiesVisited[i];
        }
    }
    
    //Array
    if (Object.prototype.toString.call(src) == '[object Array]') {
        //[].slice() by itself would soft clone
        var ret = src.slice();
        
        //add it to the visited array
        _visited.push(src);
        _copiesVisited.push(ret);
        
        var i = ret.length;
        while (i--) {
            ret[i] = deepCopy(ret[i], _visited, _copiesVisited);
        }
        return ret;
    }
    
    //If we've reached here, we have a regular object
    
    //make sure the returned object has the same prototype as the original
    var proto = (Object.getPrototypeOf ? Object.getPrototypeOf(src): src.__proto__);
    if (!proto) {
        proto = src.constructor.prototype; //this line would probably only be reached by very old browsers 
    }
    var dest = Object.create(proto);
    
    //add this object to the visited array
    _visited.push(src);
    _copiesVisited.push(dest);
    var avoid = ["Window", "HTMLDocument", "HTMLBodyElement"];
    for (var key in src) {
        //Note: this does NOT preserve ES5 property attributes like 'writable', 'enumerable', etc.
        //For an example of how this could be modified to do so, see the singleMixin() function
        if(src[key] && src[key].constructor && avoid.indexOf(src[key].constructor.name)==-1){
            dest[key] = deepCopy(src[key], _visited, _copiesVisited);
        }else
            dest[key] = src[key];
        
    }
    return dest;
}
/**
* This function can: 
* deep copy objects
* merge multiple objects
* @param {Boolean} deep optional parameter, false by default. For a deep extend, set to `true`.
* @param {Boolean} copyAccessors optional parameter, false by default. Set to true if you want to copy getter and setters.
* @param {Boolean} derive optional parameter, false by default. If set to true, the last passed object will be returned after all properties from other objects are copied to it.
* Non existing properties on the destination will be copied. This rule is applied recursively
* @param {string|string[]} staticProperties property name or array of property names that you want to avoid deep copy for
* @param {string[]} excludeProperties optional parameter. Skip property names included in this array
* @param {...object} var_args the objects you want to merge.
* @returns {object} return the merged result. If derive is true, the reference will be that of the last object passed otherwise a new object is created.
*/
var extend = function () {

	// Variables
	var extended = {};
	var deep = false;
	var i = 0;
	var length = arguments.length;
    var copyAccessors_flag = false;
    var staticProperties = ["bindingDefaultContext"];
    var excludeProperties = [];
    var keepDefined = [];
    var derive = false;
	// Check if a deep merge
	if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
		deep = arguments[0];
		i++;
	}
    if (Object.prototype.toString.call(arguments[1]) === '[object Boolean]') {
		copyAccessors_flag = arguments[1];
		i++;
    }
    if (Object.prototype.toString.call(arguments[2]) === '[object Boolean]' && arguments[2]===true) {
        derive = arguments[2];
        i++;
        --length;
        extended = arguments[length];
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
		excludeProperties.push(arguments[3]);
		i++;
    }else if(Array.isArray(arguments[3]))
    {
        excludeProperties = arguments[3];
        i++;
    }
    if (typeof arguments[4] === 'string' || arguments[4] instanceof String) {
		keepDefined.push(arguments[4]);
		i++;
    }else if(Array.isArray(arguments[4]))
    {
        keepDefined = arguments[4];
        i++;
    }
	// Merge the object into the extended object
	var merge = function (obj) {
		for ( var prop in obj ) {
            
            var value = obj[prop];
         //   if(value && !(value instanceof jQuery))
           // {
                if (Object.prototype.hasOwnProperty.call(obj, prop) && !excludeProperties.includes(prop)) {
                    if(!(isGetter (obj, prop) || isSetter (obj, prop))){
                        // If deep merge and property is an object, merge properties
                        if (deep && (isObject(obj[prop]) && (obj[prop]["forEach"]==null) && !staticProperties.includes(prop) && !value.$el)) {
                            if(!(keepDefined.includes(prop) && (obj[prop]==null || obj[prop]==undefined))){
                                var index = visited.indexOf(value);
                                if (index === -1) {
                                    visited.push(value);
                                    extended[prop] = extend(true, copyAccessors_flag, obj[prop]);
                                    set.push({up: extended, value: extended[prop]});
                                }else{
                                    extended[prop] = set[index].value;
                                }
                            }
                        } else if(deep && obj[prop] && obj[prop]["forEach"] && !staticProperties.includes(prop)){
                                //its faster to allocate memory at once than to cause continuous expansion (might cause re-allocation)
                                var index = visited.indexOf(value);
                                if (index === -1) {
                                    visited.push(value);
                                    extended[prop] = new window[obj[prop].constructor.name]((obj[prop]).length);
                                    set.push({up: extended, value: extended[prop]});
                                    for(var j=0;j<(obj[prop]).length;j++){
                                        if((obj[prop][j] && obj[prop][j]["forEach"]) || isObject(obj[prop][j]))
                                            extended[prop][j] = extend( true, copyAccessors_flag, obj[prop][j]);
                                        else
                                            extended[prop][j] = obj[prop][j];
                                    }
                                }else{
                                    extended[prop] = set[index].value;
                                }
                        } else if(extended[prop] && isObject(obj[prop]) && (obj[prop]["forEach"]==null) && !((value.constructor && avoid.indexOf(value.constructor.name)>-1) || (value.constructor && value.constructor.name!="Object") || (value && (value.jquery!=null || value.jQuery!=null))) && !((extended[prop] && extended[prop].constructor && avoid.indexOf(extended[prop].constructor.name)>-1) || (extended[prop] && (extended[prop].jquery!=null || extended[prop].jQuery!=null)))){
                            var index = visited.indexOf(value);
                            if (index === -1) {
                                visited.push(value);
                                if(!extended.hasOwnProperty(prop) || staticProperties.includes(prop)){
                                   // extended[prop] = extend(false, copyAccessors_flag, obj[prop]);
                                    // if(!derive)
                                    //     extend(false, copyAccessors_flag, true, obj, extended);
                                    // else
                                        extended[prop] = obj[prop];
                                }else{
                                    if(extended[prop].constructor.name != obj[prop].constructor.name){
                                        extended[prop] = new window[obj[prop].constructor.name]();
                                    }
                                    for(let p in obj[prop]){
                                        if(!extended[prop].hasOwnProperty(p) && isObject(obj[prop][p])){
                                            if(obj[prop][p]["forEach"]==null){
                                                extended[prop][p] = extend(false, copyAccessors_flag, obj[prop][p]);
                                            }else{
                                                extended[prop][p] = new window[obj[prop][p].constructor.name]((obj[prop][p]).length);
                                                extended[prop][p].splicea(0, extended[prop][p].length, obj[prop][p]);
                                            }
                                        }else
                                        {
                                            if(isObject(obj[prop][p]) && (obj[prop][p]["forEach"]==null)){
                                                extended[prop][p] = extend(false, copyAccessors_flag, true, obj[prop][p], extended[prop][p]);
                                            }else if(obj[prop][p] && obj[prop][p]["forEach"]!=null){
                                                if(!derive){
                                                    if(!extended[prop][p]){
                                                        extended[prop][p] = new window[obj[prop][p].constructor.name]((obj[prop][p]).length);
                                                    }
                                                    extended[prop][p].splicea(0, extended[prop][p].length, obj[prop][p]);
                                                }
                                            }else{
                                                if(!derive)
                                                    extended[prop][p] = obj[prop][p];
                                            }
                                        }
                                    }
                                }
                                set.push({up: extended, value: extended[prop]});
                            }else{
                                extended[prop] = set[index].value;
                            }
                        } else {
                            if(!(keepDefined.includes(prop) && (obj[prop]==null || obj[prop]==undefined)))
                                extended[prop] = obj[prop];
                        }
                    }else if(copyAccessors_flag)
                    {
                        copyAccessor(prop, obj, extended);   
                    }else{
                        extended[prop] = obj[prop];
                    }
                }
          //  }else{
            //    extended[prop] = obj[prop];
           // }
		}
    };
    //https://en.wikipedia.org/wiki/Adjacency_list
    var visited = [], set=[];
    var ic = i;
    for (; ic < arguments.length; ic++) {
        visited.push(arguments[ic]);
        set.push({value:arguments[ic]});
    }
    visited.push(extended);
    set.push({value: extended});
    var avoid = ["Window", "HTMLDocument", "HTMLBodyElement"]
	// Loop through each object and conduct a merge
	for ( ; i < length; i++ ) {
        var obj = arguments[i];
        merge(obj);
        
	}

	return extended;
};
/**
* Polyfill for Object.keys. Return the member names of an object
* @returns {string[]} result, an array with the object member names
*/
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
/**
* Test if passed variable is an object
* @param {object} x the object that you want to test
* @returns {Boolean} result, true if passed variable is an object
*/
function isObject(x) {
    return (Object.prototype.toString.call(x) === '[object Object]');
}
/**
* Does the object have properties or not
* @param {object} the object you want to test
* @returns {Boolean} result, true if object has no properties
*/
Object.isEmpty = function (obj) {
    let empty = true;
    for (let prop in obj) {
        empty = false;
        break;
    }
    return empty;
};
/**
* Get the value of an object path expression (square brackets or dot notation or mixed) 
* @param {object} host object to get the property path value from
* @param {string|string[]} chain property path or property chain array
* @returns {string[]} result, null if path doesn`t exist on host
*/
function getChainValue(host, chain){
    if(typeof chain === 'string')
        chain = parseObjectPathExpression(chain);

    var curObj = host;
    let len = chain.length;
    for(var i=0;i<len && curObj!=null;i++){
        if(curObj[chain[i]]!=null || curObj.hasOwnProperty(chain[i])){
            curObj = curObj[chain[i]];
        }else{
            console.log(chain[i] + " not found on ObjectPath");
            curObj = null;
        }
    }
    return curObj;
}
/**
* Set the value of an object path expression (square brackets or dot notation or mixed) 
* @param {object} host object to set the property
* @param {string|string[]} chain property path or property chain array
* @param {*} value The value you want to assign
* @param {Boolean} create Create the path if it doesn`t exist on host
* @returns {string[]} result : false if path doesn`t exist on host and create is false otherwise true
*/
function setChainValue(host, chain, value, create=false) {
    if(typeof chain === 'string')
        chain = parseObjectPathExpression(chain);
    
    var curObj = host;
    let len = chain.length, ok = true;
    for(var i=0;i<len-1 && ok;i++){
        if(curObj[chain[i]]!=undefined){
            curObj = curObj[chain[i]];
        }else{
            if(create){
                curObj[chain[i]] = {};
                curObj = curObj[chain[i]];
            }else{
                ok = false;
                console.log(chain[i]+" property not found");
            }
        }
    }
    if(ok){
        curObj[chain[len-1]] = value;
    }
    return ok;
}
/**
* Parse an object path expression (square brackets or dot notation or mixed) and return an array with path components. 
* This function will cache results for better performance
* @param {string} str object path expression
* @returns {string[]} result 
*/
ObjectUtils.opath = {};
function parseObjectPathExpression(str){
    if(typeof str !== 'string'){
        throw new TypeError('parseObjectPathExpression must be passed a string');
    }

    let parts;
    if(ObjectUtils.opath.hasOwnProperty(str)){
        parts = ObjectUtils.opath[str];
    } 
    if(parts==null)
    {
        parts = [];
        var i = 0;
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
        ObjectUtils.opath[str] = parts;
    }
    return acExtend(parts);
}
/**
* Check whether objects are copies or similiar to each other
* @param {object} x first object
* @param {object} y second object
* @param {Boolean} matchAllKeys if true will match all keys, otherwise only x keys will be matched against y keys 
* @param {string[]} v properties to ommit
* @returns {Boolean} result 
*/
function deepEqual(x, y, matchAllKeys = false, v) {
    const ok = Object.keys, tx = typeof x, ty = typeof y; v = v?v:[];
    v.push(x);
    return x && y && tx === 'object' && tx === ty && (!matchAllKeys || (ok(x).length==ok(y).length)) ? (
        ok(x).every((key) => {
            let r = true;
            if(v.indexOf(x[key]) == -1){
                v.push(x[key]);
                r =  deepEqual(x[key], y[key], matchAllKeys, v);
            }
            return r;
        })
    ) : (x === y);
}
/**
* find cyclic references in an object
* @param {object} orig where to look for
* @param {string} objName variable name for this object, used to get a full property path for the cyclic reference
* @returns {string[]} property path for the cyclic reference
*/
function findCyclicReference(orig, objName){
    var inspectedObjects = [];
    if(typeof objName === 'string' || objName instanceof String) {
        objName = [objName];
    }

    objName = objName ? objName : ["obj"];
    return (function _find(o,s){
      for(var i in o){
        if(o[i] === orig){
          console.log('Found Cyclic Reference: '+objName.join(".")+'.'+(s.length>0? (s.join('.')+'.'):"")+i +'='+objName.join(".")); 
          return true;
        }
        if(inspectedObjects.indexOf(o[i])>=0) continue;
        else{
          inspectedObjects.push(o[i]);
          s.push(i); 
          return false || _find(o[i],s) || findCyclicReference(o[i], objName.concat([i])); s.pop(i);
        }
      }
      return false;
    }(orig,[]));
}

var findMember = function (o, member, excludeProps=[], value=null, autoOptimize=true,/*internal*/ pn = [], visited=[]) {
    let ap = [];
    if (o.forEach) {
        let len = o.length;
        for (let i = 0; i < len; i++) {
            if (o[i] && (o[i].forEach || isObject(o[i]))) {
                let pni = pn.slice(0);
                pni.push(`${i}`);
                let d = findMember(o[i], member, excludeProps, value, autoOptimize, pni, visited);
                if (d.length > 0) {
                    ap.splicea(ap.length, 0, d);
                }
            }  
        }
    } else if (isObject(o)) { 
        for (let prop in o) { 
            if (excludeProps.indexOf(prop) < 0) { 
                let pnp = pn.slice(0);
                pnp.push(prop);
                if (prop == member && (value==null || (value!=null && o[prop]==value))) {
                    ap.push(pnp);
                } else if (o[prop] && (o[prop].forEach || isObject(o[prop]))) {
                    let ind = indexOfObject(visited, "instance", o[prop]);
                    if (ind < 0) { 
                        visited.push({"instance": o[prop], "path": pnp});
                        let d = findMember(o[prop], member, excludeProps, value, autoOptimize, pnp, visited);
                        if (d.length > 0) {
                            ap.splicea(ap.length, 0, d);
                        }
                    } else {
                        if (autoOptimize) { 
                            let exProp = pnp.last();
                            excludeProps.push(exProp);
                            console.info(exProp, " will be avoided.");
                        }
                        console.warn("Circular Reference found at path: ", pnp, " referencing to path: ",visited[ind].path); 
                    }
                }   
            }
        }
    }
    return ap;
};