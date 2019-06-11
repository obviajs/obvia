

/*var _submit = document.getElementById('_submit'), 
_file = document.getElementById('_file'), 
_progress = document.getElementById('_progress');

var upload = function(){
//kontroll nese nje file eshte selektuar
    if(_file.files.length === 0){
        return;
    }

//krijojme nje forme data to send
    var data = new FormData();

    data.append('SelectedFile', _file.files[0]);//name,value
//krijojme nje xmlhttprequest per te uploduar scriptet me event listeners
    var request = new XMLHttpRequest();
    //check nese request eshte bere complete
    request.onreadystatechange = function(){
        if(request.readyState == 4){
            try {
                var resp = JSON.parse(request.response);
            } catch (e){
                var resp = {
                    status: 'error',
                    data: 'Unknown error occurred: [' + request.responseText + ']'
                };
            }
            console.log(resp.status + ': ' + resp.data);
        }
    };
//loaded-->how much data is sent to server
//total->sasia max e datave to be sent
    request.upload.addEventListener('progress', function(e){
        _progress.style.width = Math.ceil(e.loaded/e.total) * 100 + '%';
    }, false);

    request.open('POST', 'upload.php');
    request.send(data);
}

_submit.addEventListener('click', upload);
*/


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
