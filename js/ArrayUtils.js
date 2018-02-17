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