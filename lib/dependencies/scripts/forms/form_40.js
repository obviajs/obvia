

$("#unsolicitedProposal").change(function()
{
	var checkbox_proposal_value = $('#unsolicitedProposal').is(":checked");
	if(checkbox_proposal_value == false)
	{
		$("#1412").attr("disabled", "disabled");
		$("#1413").attr("disabled", "disabled");
		$("#add_document_1414").attr("disabled", "disabled");
	}
	else
	{
		$("#1412").removeAttr("disabled");
		$("#1413").removeAttr("disabled");
		$("#add_document_1414").removeAttr("disabled");
	}
});

$(document).ready(function()
{
	var checkbox_proposal_value = $('#unsolicitedProposal').is(":checked");
	if(checkbox_proposal_value == false)
	{
		$("#1412").attr("disabled", "disabled");
		$("#1413").attr("disabled", "disabled");
		$("#add_document_1414").attr("disabled", "disabled");
	}
	else
	{
		$("#1412").removeAttr("disabled");
		$("#1413").removeAttr("disabled");
		$("#add_document_1414").removeAttr("disabled");
	}
});