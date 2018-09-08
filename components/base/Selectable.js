var Selectable = {
    get selectedItem() {
     var result = null;
        if (this.dataProvider != null){
          var found = getMatching(this.dataProvider, this.valueField,  this.value, true);  
          if(found.objects.length > 0){
           result = found.objects[0];
          }
        }
        return result;
    },
    validateItem: function(item, i){
      if(item != undefined && item != null && item[this.valueField] != undefined && item[this.labelField]!= undefined)
        return true;
      else
        console.log("Please specify a valid object"+(i!=undefined?" on row: "+i:"")+". The provided one is either null or doesn`t have '"+this.valueField+"' and '"+this.labelField+"' properties.");
      return false;
    }
}