var BindingUtils = function()
{
 
}
/**
     *  Binds a public property, <code>prop</code> on the <code>site</code>
     *  Object, to a bindable property or property chain. 
     *  If a ChangeWatcher instance is successfully created, <code>prop</code>
     *  is initialized to the current value of <code>chain</code>.
*/
BindingUtils.bindProperty = function(site, site_chain, host, host_chain)
{
    var w = new ChangeWatcher();
    w.watch(host, host_chain, function(e){
        setChainValue(site, site_chain, e.newValue)
    });
}
/*
    s: String binding Expression
    site: Object Host object
    chain: String|Array property path or property chain
*/
BindingUtils.getPropertyChains = function(bindingExpression)
{
    var tokens = tokenize(bindingExpression).all();
    var toBind = [];
    var kndex = 0;
    for(var i=0;i<tokens.length;i++)
    {
        if(tokens[i].type==="IDENTIFIER" || tokens[i].type==="STRING")
        {
            if(toBind[kndex] == undefined)
            {
                toBind[kndex] = [];
            }
            toBind[kndex].push(tokens[i].value);
            
        }else 
        if(!(tokens[i].type==="DOT" || tokens[i].type==="LEFT_BRACKET" || tokens[i].type==="RIGHT_BRACKET") && toBind[kndex]!=undefined)
        {
            kndex++;
        }
    }
    return toBind;
}
BindingUtils.watchersCount = 0;
BindingUtils.watchers = [];
BindingUtils.bindingFunctions = [];
BindingUtils.totalBindings = 0;
//TODO: check for duplicate chains to avoid adding multiple watcher for same host and chain
//TODO: defaultContextProperty implement the possibility for this param to be a property chain
BindingUtils.getValue = function(context, bindingExpression, site, site_chain, defaultContextProperty)
{
    var toBind = this.getPropertyChains(bindingExpression);
    //alert(JSON.stringify(toBind));
    var generatedBindingFn = "";
    var generatedBinding1StTimeFn = "";
    if(toBind.length>0)
    {
        if(site != null && site != undefined && site_chain != undefined && Array.isArray(site_chain) && site_chain.length>0) 
		{
            context = context || {};

           
            
            var varsIn_defaultContextProperty = "";

            for(var i=0;i<toBind.length;i++)
            {   
                if(!Object.prototype.hasOwnProperty.call(context, toBind[i][0]))
                {
                    if((defaultContextProperty!=null && defaultContextProperty!=undefined) && Object.prototype.hasOwnProperty.call(context, defaultContextProperty) && Object.prototype.hasOwnProperty.call(context[defaultContextProperty], toBind[i][0]))
                    {
                        varsIn_defaultContextProperty += "var "+(toBind[i][0])+" = context['"+defaultContextProperty+"']['"+(toBind[i][0])+"'];\n";
                        toBind[i].unshift(defaultContextProperty);
                    }
                    else
                        throw toBind[i][0]+" property not found on specified context. Please specify a valid 'defaultContextProperty' parameter.";
                }else{
                    varsIn_defaultContextProperty += "var "+(toBind[i][0])+" = context['"+(toBind[i][0])+"'];\n";     
                }    
            }
            BindingUtils.bindingFunctions[this.totalBindings] = function(){
                //console.log("Binding Fn: ", varsIn_defaultContextProperty+'setChainValue(site, site_chain, ('+bindingExpression+'))');
                    eval(varsIn_defaultContextProperty+'setChainValue(site, site_chain, ('+bindingExpression+'))');
                }.bind(context);

            var watchers = new Array(toBind.length);
            //TODO:Reduce watchers by grouping them based on host and toBind[i]
            for(var i=0;i<toBind.length;i++)
            {
                var host = toBind[i].shift();
                //watchers[i] = BindingUtils.watchers[this.watchersCount] = new ChangeWatcher();
                watchers[i] = BindingUtils.watchers[this.watchersCount] = ChangeWatcher.getInstance(context[host]);
                BindingUtils.watchers[this.watchersCount].watch(context[host], toBind[i], BindingUtils.bindingFunctions[this.totalBindings]);
                //generatedBindingFn += "var w_"+this.watchersCount+" = new ChangeWatcher();"
                //generatedBindingFn += "w_"+this.watchersCount+".watch("+host+", "+JSON.stringify(toBind[i])+", "+name+");";
                this.watchersCount++;
               
            }
            BindingUtils.bindingFunctions[this.totalBindings]();
            this.totalBindings++;
        }
    }	
    //TODO:Return the watchers Collection, so we can unwatch :) 
    return watchers;
}