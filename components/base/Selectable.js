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
    }
    }