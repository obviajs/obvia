function indexOfObject(ac, key,  matchingValue, startAt)
{
    var index = -1;
    var i = startAt || 0; 
    var found = false;
    if(ac != null)
    {
        while(!found && i < ac.length)
        {        
            if(ac[i] != null && (ac[i][key] == matchingValue))
            {
                index = i;
                found = true;
            }
            i++;
        }
    }
    return index;
}

function getMatching(ac, key,  matchingValue, stopAtFirstOcurrence)		
{
    var i = 0; 
    var matching = {objects:[], indices:[]};
    var found = false;
    if(typeof(matchingValue)==="object" && !(matchingValue instanceof Array)){
        matchingValue = matchingValue[key];
    }
    if(matchingValue!=null)
    {
        stopAtFirstOcurrence = stopAtFirstOcurrence==null?false:stopAtFirstOcurrence;
        if(ac != null)
        {
            while((!found || !stopAtFirstOcurrence) && i < ac.length)
            {        
                if(ac[i] != null && (ac[i][key] == matchingValue))
                {
                    matching.objects.push(ac[i]);
                    matching.indices.push(i);
                    found = true;
                }
                i++;
            }
        }
    }else
        console.log("You have not provided a valid matchingValue parameter (if you provided an object it should contain '"+key+"' property).");
    return matching;
}
//PolyFill
if (!Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function(searchElement, fromIndex) {
  
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }
  
        // 1. Let O be ? ToObject(this value).
        var o = Object(this);
  
        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;
  
        // 3. If len is 0, return false.
        if (len === 0) {
          return false;
        }
  
        // 4. Let n be ? ToInteger(fromIndex).
        //    (If fromIndex is undefined, this step produces the value 0.)
        var n = fromIndex | 0;
  
        // 5. If n ≥ 0, then
        //  a. Let k be n.
        // 6. Else n < 0,
        //  a. Let k be len + n.
        //  b. If k < 0, let k be 0.
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
  
        function sameValueZero(x, y) {
          return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }
  
        // 7. Repeat, while k < len
        while (k < len) {
          // a. Let elementK be the result of ? Get(O, ! ToString(k)).
          // b. If SameValueZero(searchElement, elementK) is true, return true.
          if (sameValueZero(o[k], searchElement)) {
            return true;
          }
          // c. Increase k by 1. 
          k++;
        }
  
        // 8. Return false
        return false;
      }
    });
}
//get the intersection elements of two arrays
function intersect(a, b) {
    var d = {};
    var results = [];
    for (var i = 0; i < b.length; i++) {
        d[b[i]] = true;
    }
    for (var j = 0; j < a.length; j++) {
        if (d[a[j]]) 
            results.push(a[j]);
    }
    return results;
}

//get the intersection elements of two arrays give the key field to match
function intersectOnKeyMatch(a, b, key) {
    var d = {};
    var results = [];
    for (var i = 0; i < b.length && b[i][key]; i++) {
        d[b[i][key]] = true;
    }
    for (var j = 0; j < a.length && a[j][key]; j++) {
        if (d[a[j][key]]) 
            results.push(a[j]);
    }
    return results;
}

// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array, matchAllKeys = false) {
    // if the other array is a falsy value, return
    if (!array)
        return false;
 
    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;
 
    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }else if(typeof(this[i])==="object" && !(this[i] instanceof Array) && typeof(array[i])==="object" && !(array[i] instanceof Array) ){
            var match = deepEqual(this[i], array[i], matchAllKeys);
            if(!match)
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

if(Array.prototype.difference)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");

Array.prototype.difference = function (a2) {
    // if the other array is a falsy value, return
    if (!a2 || a2.length==0)
        return this;
    if(this.length==0)
        return a2;
    var result = [];
    for (var i = 0; i < this.length; i++) {
        if (a2.indexOf(this[i]) === -1) {
            result.push(this[i]);
        }
    }
    return result;
}
Object.defineProperty(Array.prototype, "difference", {enumerable: false});

function differenceOnKeyMatch (a1, a2, key) {
    // if the other array is a falsy value, return
    var result = [];
    if (!a2 || a2.length==0){
        for (var i = 0; i < a1.length; i++) {
            result.push(a1[i]);
        }
    } else if(a1.length==0){
        for (var i = 0; i < a2.length; i++) {
            result.push(a2[i]);
        }
    } else{
        for (var i = 0; i < a1.length; i++) {
            if (indexOfObject(a2, key, a1[i][key]) === -1) {
                result.push(a1[i]);
            }
        }
    }
    return result;
}
Array.prototype.group = function (fields, aggregate_fn) {
    
    //group elements in $in_arr by the field names in $fields array
    out_arr = {};
    fields_zero = fields[0];
    for (var i = 0; i < this.length; i++)
    {
        var el = this[i];
        if(!out_arr[el[fields_zero]])
        {
            out_arr[el[fields_zero]] = {};
            out_arr[el[fields_zero]].elements = [];
           
        }
        
        out_arr[el[fields_zero]].elements.push(el);
        if(aggregate_fn && Array.isArray(aggregate_fn))
        {
            for(var j=0;j<aggregate_fn.length;j++)
            {
                var aggregate_field = aggregate_fn[j]["field"]+'_'+aggregate_fn[j]["fn"];
                if(!out_arr[el[fields_zero]][aggregate_field]){
                    out_arr[el[fields_zero]][aggregate_field] = 0;
                }
                out_arr[el[fields_zero]][aggregate_field] += el[aggregate_fn[j].field];
            }
        }
    }

    //ti grupojme sipas fushes se radhes tani
    fields.shift();
    
    if(fields.length>0)
    {
        for(var key in out_arr)	
        {
            var value = out_arr[key];
            value.elements = value.elements.group(fields, aggregate_fn);
        }
    }
    return out_arr;
}
Object.defineProperty(Array.prototype, "group", {enumerable: false});

Array.prototype.pushUnique = function (el, key) {
	for (var i = 0; i < this.length; i++){
		if ((key && (el[key] == this[i][key])) || el == this[i])
			return;
	}
	this.push(el);
}
Object.defineProperty(Array.prototype, "pushUnique", {enumerable: false});

Array.prototype.dedupe = function (key) {
    var i = 0;
    var index = -1;
	while (i < this.length){
        if ((key && (index = indexOfObject(this, key,  this[i][key], ++i)) > -1) || ((index = this.indexOf(this[i], ++i)) >- 1))
            this.splice(index, 1);
	}
}
Object.defineProperty(Array.prototype, "dedupe", {enumerable: false});

//same as splice but takes an array of items other than comma separated items 
Array.prototype.splicea = function (index, howmany, items) {
	var params = (items==null||items==undefined) ? [index, howmany] : [index, howmany].concat(items);
	this.splice.apply(this,  params);
}
Object.defineProperty(Array.prototype, "splicea", {enumerable: false});


function createEmptyObject(ac, keyField, valueField)
{
    var emptyObj = {};
    var len = ac.length;
    for(var i=0;i<len;i++)
    {
        emptyObj[ac[i][keyField]] = ac[i][valueField];
    }
    return emptyObj;
}

Array.prototype.pad = function (el, howMuch, direction) {
    direction = direction ? direction : "right";
    var a = new Array(howMuch);
    for (var i = 0; i < howMuch; i++){
        a[i] = el;
    }
    (direction=="right" ? this.splicea(this.length,0,a) : this.splicea(0,0,a));	
}
Object.defineProperty(Array.prototype, "pad", {enumerable: false});