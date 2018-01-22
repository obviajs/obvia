function showMessage() {
    $panel = $('<div></div>')
            .addClass('alert')
            .addClass('alert-danger')
            .addClass('floating')
            .html('Rekordi eshte fshire.');
    $('#page-wrapper').append($panel);
    $panel.fadeIn(400);
    setTimeout(
            function () {
                $panel.fadeOut(400);
            },
            4000
            );
}
function handleRowDelete(row, data, dataIndex, callback) {
    $(row).find('.dataTable_delete').click(function (e) {

        e.preventDefault();
        e.stopImmediatePropagation();
        bootbox.confirm("Jeni i sigurt qe deshironi ta fshini kete rekord?", function (result) {
            if (result)
            {
                var $url_deleted = $(row).find('.dataTable_delete').attr("href");
                $.ajax({
                    url: $url_deleted,
                    type: 'POST',
                    dataType: "json",
                    success: function (data) 
					{
                        if( data.caseBrowser == 1){ //JSON.parse(data);
                            statusLoad();
                        }
						if (JSON.stringify(data).indexOf("window.location.href='javascript: history.go(-1)'") > -1)
						{
						    alertNoRights();
						}
						else
						    showMessage();

                        // get  table id
                        var tbl = $(row).closest('table');
                        var tbl_id = tbl.attr("id");
                        // reload table
                        var table = $('#' + tbl_id +'').DataTable();

                        table.ajax.reload();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        handleAjaxError(jqXHR, textStatus, errorThrown);
                    },
                    complete: function (data) 
					{
						if (data.responseText.indexOf("window.location.href='javascript: history.go(-1)'") > -1) {
							return;
						}
                        $(row).rowslide(function () {
                            /*  table.fnDeleteRow(row);*/
                        });
                        if (callback && typeof callback == 'function')
                            callback();

                    }
                });
            }
        });
    });
}
function conditionDelete(row, data, dataIndex, callback) {
    $(row).find('.dataTable_delete').click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        bootbox.confirm("Jeni i sigurt qe deshironi ta fshini kete rekord?", function (result) {
            if (result)
            {
                var $url_deleted = $(row).find('.dataTable_delete').attr("href");
                $.ajax({
                    url: $url_deleted,
                    type: 'POST',
                    contentType: "application/json; charset=UTF-8",
                    dataType: "json",
                    traditional: true,
                    success: function (response) 
					{
                        if(response.is_successfull) 
						{
                            var tbl = $(row).closest('table');
                            var tbl_id = tbl.attr("id");
                            // reload table
                            var table = $('#' + tbl_id +'').DataTable();

                            table.ajax.reload();
                            showMessage();
                            $(row).rowslide(function () {
                            /*  table.fnDeleteRow(row);*/
                            });
                            if (callback && typeof callback == 'function')
                                callback();
                        } 
						else 
						{
							bootbox.alert(response.message);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        handleAjaxError(jqXHR, textStatus, errorThrown);
                    }
                });
            }
        });
    });
}

/* Test to check the browser support for web storage( localStorage / sessionStorage ) */
function webStorageSupport() {

    if( typeof Storage === 'undefined' ) {
        return false;
    }
    return true;
}

function removeItemsLocalStorage(partialIdentifier) {
    
    Object.keys(localStorage).forEach(function(key, index) {
        if(key.includes(partialIdentifier)) {
            localStorage.removeItem(key);
        }
        //console.log(localStorage);
    }); 
}

// This function is used to get error message for all ajax calls
function getAjaxErrorMessage(jqXHR, textStatus, errorThrown) {
    var msg = '';
    if (jqXHR.status === 0) {
        msg = 'Not connected.\n Verify Network.';
    } else if (jqXHR.status == 404) {
        msg = 'Requested page not found. [404]';
    } else if (jqXHR.status == 500) {
        msg = 'Internal Server Error [500].';
    } else if (textStatus === 'parsererror') {
        msg = 'Requested JSON parse failed.';
    } else if (textStatus === 'timeout') {
        msg = 'Time out error.';
    } else if (textStatus === 'abort') {
        msg = 'Ajax request aborted.';
    } else {
        msg = 'Uncaught Error.\n' + jqXHR.responseText;
    }
    return msg;
}

function alertNoRights() {
    $.post("/?removeNotRightSessionValue/index"); //remove value of session variable
    $('#notRights_div').html("<b>Nuk keni te drejta per kete veprim!</b>");
    $('#notRights_div').css('display', '');
    setTimeout( function () {
            $('#notRights_div').html("<b></b>");
            $('#notRights_div').css('display', 'none');
        },
        3000
    );
}

function requestLogin() {
    var form = '<form class="hide" id="requestLoginForm" method="post" action="?login" >' +
                    '<input type="hidden" id="url" name="url" value="'+ window.location.search +'" />' +
                '</form>';
    $(document.body).append(form);
    $('#requestLoginForm').submit();
}

function handleAjaxError(jqXHR, textStatus, errorThrown) {
    if(jqXHR.responseText.indexOf("window.location.href='javascript: history.go(-1)'") > -1) {
        alertNoRights(); // Nuk keni te drejta per kete veprim
    }
    else if(jqXHR.responseText.indexOf('<form role="form" action="validate" method="POST" id="loginFormID">') > -1) {

        requestLogin(); // session expired
    }
    else {
        bootbox.alert(getAjaxErrorMessage(jqXHR, textStatus, errorThrown));
    }
}

