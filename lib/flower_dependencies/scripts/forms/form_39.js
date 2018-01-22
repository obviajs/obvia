$("#f_aplikant_kategoria").on('change', function(){

	var kategSelected = $(this).val();
	var url = "?klasa_klasifikimitCRUD/retrieveByCategory/" + kategSelected;
	var element = "#f_aplikant_klasifikimi";
	var selectedElements = [];
	$.ajax({
        url: url,
        type: "GET",
        success: function(result) {
        	if(result) {
        		result = JSON.parse(result);
        	}
        	else {
        		result = [];
        	}
         	result.unshift({value: "0", label: "Zgjidh"});
            $(element).multiselect('dataprovider', result);
			if(selectedElements.length > 0) {
				$(element).multiselect('select', selectedElements);
			}
        }
    });
})

/*var sallaKonferencash = 0;
$("#f_aplikant_salla_konferencash").keyup(function (event) {

	if( Number.parseInt($(this).val()) > 0) {
		sallaKonferencash = $(this).val();
		console.log(sallaKonferencash);
	}
})*/

/*sallaKonferencash*/
$('#f_aplikant_salla_konferencash').prop('disabled', true);
$('#f_aplikant_salla_konferencash').val($('#length_input').val());

$('#add_input').click(function(){
	$('#f_aplikant_salla_konferencash').val($('#length_input').val());
});

$('#remove_input').click(function(){
	$('#f_aplikant_salla_konferencash').val($('#length_input').val());
});



$(document).ready(function(){

	var klasSelected = $("#f_aplikant_klasifikimi").val();
	var kategSelected = $("#f_aplikant_kategoria").val();
	var element = "#f_aplikant_klasifikimi";
	var url = "?klasa_klasifikimitCRUD/retrieveByCategory/" + kategSelected;
	var selectedElements = [];

	if(kategSelected) {
		if(klasSelected) {
			selectedElements.push(klasSelected);
		}
		$.ajax({
	        url: url,
	        type: "GET",
	        success: function(result) {
	        	if(result) {
	        		result = JSON.parse(result);
	        	}
	        	else {
	        		result = [];
	        	}
	         	result.unshift({value: "0", label: "Zgjidh"});
	            $(element).multiselect('dataprovider', result);
				if(selectedElements.length > 0) {
					$(element).multiselect('select', selectedElements);
				}
	        }
   		});

	}
})




