function indexOfObject(ac, key,  matchingValue)
{
    var index = -1;
    var i = 0; 
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
    stopAtFirstOcurrence = stopAtFirstOcurrence==undefined?false:stopAtFirstOcurrence;
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