var document_node = {
	id_process_group:0,
	document_name:"",
	is_dir:true,
}


$(document).ready(function(){

	var tree_settings = {
	
		source: {
			url: "?processCRUD/get_group_directory/",
			dataType: "json"
		},
		lazyLoad: function(event, data){
			//console.log(document_node);
			var node = data.node;
			data.result = {
				url: "?processCRUD/get_group_directory/",
				data: document_node,
				cache: false
			};
		},
		click: function (event, data){
			document_node.id_process_group = data.node.key;
			document_node.document_name = data.node.title;
			document_node.is_dir = data.node.folder;
			
			 $('input[name="selectedFolder"]').val(document_node.id_process_group).change();
			//refreshDocTree();
			//console.log(document_node);
			
		}
	};
	
	/*function refreshDocTree(){
		//console.log(document_node);
		//return;
		$.ajax({
			type: "POST",
			url: "?efilemanager/get_documents/",
			data: document_node,
			success: function(ret_data) {
				 $("#treetable").data("ui-fancytree").getTree().reload(ret_data);
			},dataType: "json"
		});	
	}*/
	
	$("#tree").fancytree(tree_settings);	
	
	function showNotification(msg, type){
		if(type == 'error') $('#error_msg').html(msg).fadeIn('slow').delay(2000).fadeOut('slow');
		else $('#success_msg').html(msg).fadeIn('slow').delay(2000).fadeOut('slow');
	}

	function getSelectedNode(){ var node = $("#tree").fancytree("getActiveNode"); return (node != null) ? node.key : 0; }
	
	

	
});

