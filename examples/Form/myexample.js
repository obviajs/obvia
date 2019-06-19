var loader=new Loader({id:'loader'});
$('#root').append(loader.render());
loader.show();
    function upload()
    {
        var blob = $('#file')[0].files[0];
        myForm.addFormData("upload", blob);  
        myForm.post();
    }
    function previewFile() {
        var preview = document.querySelector('.myclass'); //selects the query named img
        var upl = $('#file')[0];
        if(upl){
            var file = upl.files[0]; //sames as here
       
            var reader = new FileReader();
    //A handler for the loadend event. 
    //This event is triggered each time the reading operation is completed (either in success or failure).
            reader.onloadend = function () {
                preview.src = reader.result;
            }

            if (file) {
                reader.readAsDataURL(file); //reads the data as a URL
            } else {
                preview.src = "";
            }
        }
    }


    var myForm = new Form({
    id: 'form',
    action:'upload.php',
    formName: 'My Form',
    viewMode: 'steps',
    components: [
    
    
   
     
                ]
    
});



myForm.on('creationComplete', function () {
    loader.hide();
    
   

});



$('#root').append(myForm.render());
