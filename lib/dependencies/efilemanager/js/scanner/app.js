
var DWObject;
var hTTPServer = location.hostname;
var actionPage = '?efilemanager/upload_file';

Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady);
function Dynamsoft_OnReady() {
    DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('scanned-image');
}

function Dynamsoft_clearCanvas() {
    DWObject.RemoveAllImages();
    $('#upload-scanned-doc').attr('disabled', true);
}

function acquireSuccess() {
    $('#upload-scanned-doc').attr('disabled', false);
}

function acquireFailure() {
    
}

function scanner() {

    if (DWObject) {
        DWObject.SelectSource();
        DWObject.OpenSource();
        DWObject.IfDisableSourceAfterAcquire = true; 
        if (document.getElementById("autofeed").checked) 
            DWObject.IfFeederEnabled = true;
        else
            DWObject.IfFeederEnabled = false;
        DWObject.AcquireImage(acquireSuccess, acquireFailure);       
    }
}

function uploadDocumentAsPDF(fileName, document_id, is_group, id_group, callback) {
    DWObject.SetHTTPFormField("id_document", document_id);
    DWObject.SetHTTPFormField("is_group", is_group);
    DWObject.SetHTTPFormField("id_group", id_group);
    DWObject.MaxImagesInBuffer = 600000;
    DWObject
        .HTTPUploadAllThroughPostAsPDF(
            hTTPServer,
            actionPage,
            fileName,
            callback,
            callback
        );
}

function OnHttpUploadFailure(errorCode, errorString, sHttpResponse) {
    alert(errorString + sHttpResponse);
}

function openModal() {
    $('#scan-modal').modal('show');
}

$('#flip-image').click(function () {
    if (DWObject.HowManyImagesInBuffer == 0) {
        return;
    }
    DWObject.Rotate(DWObject.CurrentImageIndexInBuffer, 180, true);
});