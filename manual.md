#KxGenerator

When building a component you use the generator provided {KxGenerator.createComponent}
It returns a component, which can then be instantiated with the new keyword and properties.

#createComponent(object)
this creates a component. The object you provide contains the sceleton of your componnet. The sceleton 
consist on methods, some of which are provided out of the box for you. You can add as many methods as you wish

#component unimplemented sceleton (+life cycle) methods

initModel() - returns an object with data as you wish. This is best used when you wish to bind data to the template, or simply 
              as your component state

beforeAttach() - this method will be called before your component is rendered, right after it is instantiated. This is best utilised
                for an ajax call or an event dispatch.

afterAttach() - this method is going to get called right after component mounts on the dom. This is best utilised for a plugin init or
                jQuery dom manipulations/events since they require the element to be attached on the dom

template() - it should return a html string containing the component definition, and binding since it uses rivets.js for that. 

render() - when you wish to attach your component in the dom you call render(), it should always return a jQuery element, preferebly 
         it should return this.$el, where this.$el is the compiled template (into a jQuery element)

#component helper methods

getModel() - returns application model/state at any given point. ex. this.getModel()   
getModelValue(key) - returns a key's value in your model
setModelValue(key, value) - sets a model value  

#component creation guidelines and best practices         