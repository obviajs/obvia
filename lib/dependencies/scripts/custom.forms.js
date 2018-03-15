function initialize_html_elements() {
   /*  $(".data-calendar").datetimepicker({
        format: "DD/MM/YYYY HH:mm",
        minDate: "01/01/1990 00:00",
        maxDate: "01/01/2100 00:00"
    });  */ 
}

function setData(data, element) {
    $(element).children().remove();
    $(element).closest('.multiselect-container').children().remove();
    /*$(element).append(
            $("<option></option>")
            .val(element + "_new")
            .text("Add option")
            );*/
    /*$(element).append(
            $("<option></option>")
            .val(element + "_new")
            .text("Zgjidh")
            );*/
	$(element).append(
            $("<option></option>")
            .val("0")
            .text("Zgjidh")
            );
    $(element).append(
            $("<option></option>").attr("data-role", "divider")
            );

    for (var i = 0; i < data.length; i++)
        $(element).append(
                $("<option></option>").val(data[i].value).text(data[i].text).attr("title", data[i].text)
                );
}

function getData(url, element, selectedElements) {
    if(typeof url == "undefined" || url == "" || url == null)
        url="?c./a."; // dummy value

    $.ajax({
        url: url,
        type: "GET",
        success: function(result) {

            if(typeof result != "undefined" && result != "")
                setData(JSON.parse(result), element);
            
            $(element).multiselect({
                enableFiltering: true,
                maxHeight: 250,
                minWidth: 350,
                templates: {
                    divider: "<div class=\"divider\" data-role=\"divider\"></div>"
                }
            });
			if(selectedElements.length > 0)
			{
				$(element).multiselect('select', selectedElements);
			}
        },
        complete: function () {
            $('#form_loader').fadeOut();
        }
    });
}

function addData(data, element) {
    $(element).append(
            $("<option></option>")
            .attr("value", data.id)
            .text(data.name)
            );

    $(element).multiselect("destroy");
    $(element).multiselect({
        enableFiltering: true,
        maxHeight: 250,
        templates: {
            divider: "<div class=\"divider\" data-role=\"divider\"></div>"
        }
    });
}

function getRow(data) {
    var row = $('<tr></tr>').addClass('template-download')
            .addClass('fade')
            .addClass('in')
            .append(
                $('<td></td>').append(
                $('<span></span>').addClass('preview')
                )
                ).append(
            $('<td></td>').append(
            $('<p></p>').addClass('name')
            .append(
                $('<a></a>').attr('title', data.value)
                .attr('download', data.value)
                .attr('href', '/resources/upload/files/' + data.value)
                .text(data.value)
                )
            )
            ).append(
            $('<td></td>').append(
            $('<span></span>').addClass('size')
            )
            ).append(
            $('<td></td>').append(
            $('<button></button>').addClass('btn')
            .addClass('btn-danger')
            .addClass('delete')
            .attr('data-type', 'DELETE')
            .attr('data-url', '/resources/upload/files/' + data.value)
            .append(
                    $('<i></i>').addClass('glyphicon')
                    .addClass('glyphicon-trash')
                    ).append(
            $('<span></span>').text(' Delete')
            ).click(function(e) {
        e.stopImmediatePropagation();
        $.ajax({
            url: '/resources/upload/?file=' + data.value,
            type: 'DELETE',
            success: function() {
                $(e.target).closest('tr').remove();
                var files = $('[name="' + data.name + '"]').val();
                if (files) {
                    var f = files.split(',');
                    f.pop(data.value);
                    $('[name="' + data.name + '"]').val(f.join(','));
                }
            }
        });
        return false;
    })
            )
            );
    return row;
}