
var document_node = {
	id_report:0,
	document_name:""
};

var tree_settings = {

    source: {
        url: "?pivotCRUD/get_tree/",
        dataType: "json"
    },
    lazyLoad: function(event, data){
        data.result = {
            url: "?pivotCRUD/get_tree/",
            data: document_node,
            cache: false
        };
    },
    init: function(event, data, flag) {
        clickOnNode(getSelectedNode());
    },
    click: function (event, data){
        //console.log(event);
        document_node.id_report = data.node.key;
        document_node.document_name = data.node.title;
        showGrid(document_node);
    }
};

//focus on a node
function clickOnNode(node) {
    $('#tree').fancytree("getTree").getNodeByKey(node).li.click();
}

function getSelectedNode() {
    var node = $('#tree').fancytree("getActiveNode");
    return (node != null) ? node.key : 0;
}

function getSelectedNodeTitle() {
    var node = $('#tree').fancytree("getActiveNode");
    return (node != null) ? node.title : '';
}

function showGrid(node){
	$.ajax({
		url: '?pivotCRUD/renderGrid/'+node.id_report,
		type: 'POST',
		dataType: 'text',
		success: function (response){
			$('#grid-container').html(response);
		}
	});
}

$(document).ready(function(){

	$("#tree").fancytree(tree_settings);

	/*******************************Search***********************************************/
	
	$(document).on('keyup', '#search', function(){
		var searchValue = $("#search").val();
		
        if(searchValue.length > 1)
		{
			$("#tree").remove();
			$("#tree_wrapper").append('<div id="tree"></div>');
			
			var search_settings = {
	
				source: {
					url: "?pivotCRUD/get_tree_search/"+searchValue+"/",
					dataType: "json"
				},	
				lazyLoad: function(event, data){
						
						data.result = {
						url: "?pivotCRUD/get_tree/",
						data: document_node,
						cache: false
					};
					
				},
				click: function (event, data){
											
					document_node.id_report = data.node.key;
					document_node.document_name = data.node.title;
			
					//add grid when clicked

				}
			};
			
			$("#tree").fancytree(search_settings);
			
		}
		else
		{
			$("#tree").remove();
			$("#tree_wrapper").append('<div id="tree"></div>');
			$("#tree").fancytree(tree_settings);	
		}
		
    });
	
	$(document).on('click', '#clear_btn', function(){
		$("#search").val("");
		$("#tree").remove();
		$("#tree_wrapper").append('<div id="tree"></div>');
		$("#tree").fancytree(tree_settings);
	});
});

