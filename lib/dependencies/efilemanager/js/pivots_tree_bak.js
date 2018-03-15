
var document_node = {
	id_report:0,
	document_name:"",
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
    click: function (event, data){
        //console.log(event);
        document_node.id_report = data.node.key;
        document_node.document_name = data.node.title;

        //show grid when clicked
        if(!data.node.folder)
            showGrid(document_node.id_report);

        $('#info').html("<h4>Pershkrimi</h4><br>"+data.node.data.description);

    }
};

function getSelectedNode() {
    var node = $('#tree').fancytree("getActiveNode");
    return (node != null) ? { key: node.key, title: node.title } : { key: 0, title: ""};
}

function showGrid(id){
    //get grid html
    $.ajax({
        url: "?pivotCRUD/load/"+id,
        method: "post",
        success: function(response){
            $("#grid_container").html(response).show();
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

