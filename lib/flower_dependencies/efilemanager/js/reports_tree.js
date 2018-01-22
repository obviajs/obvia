
var document_node = {
	id_report:0,
	document_name:"",
}


$(document).ready(function(){

	var tree_settings = {
	
		source: {
			url: "?ctreports/get_tree/",
			dataType: "json"
		},
		lazyLoad: function(event, data){
			
			data.result = {
				url: "?ctreports/get_tree/",
				data: document_node,
				cache: false
			};
		},
		click: function (event, data){
			//console.log(event);
			document_node.id_report = data.node.key;
			document_node.document_name = data.node.title;
			
			//add tabs when clicked
			addReportTab(data.node.data.class, data.node.key, data.node.title, data.node.folder, data.node.data.author, data.node.data.date, data.node.data.description);
			
			
		}
	};
	
	
	$("#tree").fancytree(tree_settings);	
	
	$.support.cors = true;
	
	var activeReports = [];
	var focusedTab = 0;
	
	//string truncation
	String.prototype.trunc =
     function( n, useWordBoundary ){
         var isTooLong = this.length > n,
             s_ = isTooLong ? this.substr(0,n-1) : this;
         s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
         return  isTooLong ? s_ + '...' : s_;
      };
	
	$(document).on('click', '#report_tabs li a' ,function (e) {
		e.preventDefault();
		$(this).tab('show');
		focusedTab = openedTabIndex($(this).attr('data-report'));
		if(focusedTab < 0) focusedTab = 0;
		
		//report info
		if (activeReports.lengh > 0) {
			if (activeReports[focusedTab].author === null)
				author = '';
			$("#info").show();
			$("#info").html(
				"<h5>" + activeReports[focusedTab].title + "<span style='float:right' class='glyphicon glyphicon-info-sign'></span></h5><br>" +
				"<i>Autori i Raportit:</i> <strong>" + author + "</strong><br>" +
				"<i>Data e Raportit:</i> <strong>" + activeReports[focusedTab].date + "</strong><br>" +
				"<i>Pershkrim:</i> <strong>" + activeReports[focusedTab].description + "</strong><br>"

			);
		}
		
		//untruncate this
		if(activeReports.length > 5)
		{
			if(activeReports.length > 7)
			{	
				$(".tab_title").each(function(){
					var truncTitle = $(this).text().trunc(3);
					$(this).text(truncTitle);			
				});
			}
			else
			{
				$(".tab_title").each(function(){
					var truncTitle = $(this).text().trunc(12);
					$(this).text(truncTitle);			
				});
			}				
		}	
		if (activeReports.lengh > 0) 
			$(this).children(".tab_title").text(activeReports[focusedTab].title);
	});
	
    
	function accordion(file, id)
	{
		$.ajax({
			url: "?"+file+"/show/"+id,
			method: "get",
	
			success: function(data) {
				var form = $(data);
			
				$("#accordionOne_"+id).html("");
				$("#accordionOne_"+id).append(data);
				
			}
		});
		
	}
	
	function openedTabIndex(tabId)
	{
		var index = -1;
		activeReports.forEach(function(item, i){
			if(activeReports[i].id == tabId)
			{
				index = i
				return false;
			}
				
		});
		
		return index;
	}
	
	function addReportTab(file, id, title, folder, author, date, description)
	{
		
		var activeClass = '';
		if(activeReports.length < 1) activeClass = 'active';
		
		//unique tabs
		if(openedTabIndex(id) == -1 && !folder)
		{
			//show tabs
			$("#tabs_container").show();
			
			//append tab
			$("#report_tabs").append("<li class='"+activeClass+"' data-toggle='tooltip' title='"+title+"'>" +
									 "<a href='#report_"+id+"' data-toggle='tab' data-report='"+id+"'>" +
									"<span class='tab_title' style='fontSize:10em'>"+title+"</span><span class='close' data-report='"+id+"' id='close_btn'>×</span>" + 
									 "</a></li>");
			activeReports.push({"id":id, "title":title, "author":author, "date":date, "description":description});
			focusedTab = activeReports.length-1;
			
			//append tab content
			$("#tabs").append(
			
				"<div id='report_"+id+"' class='tab-pane active'>" +
					"<div class='row'>" +
						"<div class='col-lg-12'>" +
							"<h1></h1>"+
							"<div class='panel-group' id='accordion_"+id+"'>" +
								"<div class='panel'>" +
									"<div class='panel-heading'>" +

										"<div class='panel-collapse' id='accordionOne_"+id+"'>" +


										"</div>" +
									"</div>" +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>"+
					"<div id='pdfHiddenDiv_"+id+"' style='border: 1px solid black;  display: none;' ></div>" +
				"</div>"
			);
			
			//get filters
			accordion(file, id);
			
			//focus on tab
			$("#report_tabs a[href='#report_"+id+"']").tab('show');	

		}
		else
		{
			//focus on tab that exists
			$("#report_tabs a[href='#report_"+id+"']").tab('show');
			
		}
		
		//shrink tabs width when too many
			if(activeReports.length > 5)
			{
				
				if(activeReports.length > 7)
				{
					$(".tab_title").each(function(){
						if( $(this).parents("li").hasClass('active') ) 
						{
							var truncTitle = $(this).text().trunc(50);
							$(this).text(truncTitle);
						}
						else
						{
							var truncTitle = $(this).text().trunc(3);
							$(this).text(truncTitle);
						}
						
					});
				}
				else
				{
					$(".tab_title").each(function(){
						if( $(this).parents("li").hasClass('active') ) 
						{
							var truncTitle = $(this).text().trunc(50);
							$(this).text(truncTitle);
						}
						else
						{
							var truncTitle = $(this).text().trunc(12);
							$(this).text(truncTitle);
						}
						
					});
				}

			
			}
			
		//report info
		if(author === null)
			author = '';
		$("#info").show();
		$("#info").html(
			"<h5>"+title+"<span style='float:right' class='glyphicon glyphicon-info-sign'></span></h5><br>" +
			"<i>Autori i Raportit:</i> <strong>"+author+"</strong><br>" +
			"<i>Data e Raportit:</i> <strong>"+date+"</strong><br>" +
			"<i>Pershkrim:</i> <strong>"+description+"</strong><br>" 
		
		);
		
		//show nav buttons on many tabs
		if ($("#report_tabs").prop('scrollWidth') > $("#report_tabs").width() ) 
		{
			$(".arrow").show();
			$("#report_tabs").animate({scrollLeft:$("#report_tabs").prop('scrollWidth')}, 300);
		}
		else
		{
			$(".arrow").hide();
		}
			
	}

	$(document).on('click', '#close_btn' , function(){
		
		//remove content
		var _self = $(this);
		var id = _self.attr("data-report");
		$(".tooltip").remove();
		_self.parents("li").remove();
	
		$("#report_"+id).remove();
		
		//remove index in array
		var index = openedTabIndex(id);
		if (index > -1) 
			activeReports.splice(index, 1);
		
		
		
		//focus on tab
		if(activeReports.length > 0)
		{
			var focus = activeReports[0].id;
			$("#report_tabs a[href='#report_"+focus+"']").tab('show');
			focusedTab = 0;
			if(focusedTab < 0) focusedTab = 0;
			
			//report info
			if(activeReports[focusedTab].author === null)
				author = '';
			$("#info").show();
			$("#info").html(
				"<h5>"+activeReports[focusedTab].title+"<span style='float:right' class='glyphicon glyphicon-info-sign'></span></h5><br>" +
				"<i>Autori i Raportit:</i> <strong>"+author+"</strong><br>" +
				"<i>Data e Raportit:</i> <strong>"+activeReports[focusedTab].date+"</strong><br>" +
				"<i>Pershkrim:</i> <strong>"+activeReports[focusedTab].description+"</strong><br>" 
		
			);
			
		}
		else
		{
			focusedTab = 0;
			$("#tabs_container").hide();
			$("#info").hide();
			$("#tree_container").show();
			$("#tabs_container").removeClass("col-lg-12");
			$("#tabs_container").addClass("col-lg-9");
		}
		
		//untruncate
		if(activeReports.length <= 7)
		{
		
			if(activeReports.length <= 5)
			{
				$(".tab_title").each(function(i){
					$(this).text(activeReports[i].title);
				});
			}
			else
			{
				$(".tab_title").each(function(i){
					if( $(this).parents("li").hasClass('active') )
					{
						$(this).text(activeReports[i].title);
					}
					else
					{
						var truncTitle = activeReports[i].title.trunc(12);
						$(this).text(truncTitle);
	
					}
					
				});
			}
	
		}
		else
		{
			$(".tab_title").each(function(i){
				if( $(this).parents("li").hasClass('active') )
				{
					$(this).text(activeReports[i].title);
				}
				else
				{
					var truncTitle = activeReports[i].title.trunc(3);
					$(this).text(truncTitle);
				}
					
			});
		}
		
	
		//show nav buttons on many tabs
		if ($("#report_tabs").prop('scrollWidth') > $("#report_tabs").width() ) {
			$(".arrow").show();
			$("#report_tabs").animate({scrollLeft:0}, 300);
		}
		else
		{
			$(".arrow").hide();
		}	
		
	});
	
	$('#tree_collapse').click(function (e) {
		
		$("#tree_container").animate({width:'toggle'}, 300);
		//focus on tab
		if(activeReports.length > 0)
		{
			var focus = activeReports[focusedTab];
			$("#report_tabs a[href='#report_"+focus+"']").tab('show');
		}
		
		var className = $('#tabs_container').attr('class');
		if(className == 'col-lg-9')
		{
			setTimeout(function(){
				$("#tabs_container").removeClass("col-lg-9");
				$("#tabs_container").addClass("col-lg-12");
			}, 500);
			
		}
		else
		{
			$("#tabs_container").removeClass("col-lg-12");
			$("#tabs_container").addClass("col-lg-9");
		}
		

	});
	
	$(document).on('click', '#close_all' , function(){
		$("#report_tabs").children().remove();
		$("#tabs").children().remove();
		activeReports = [];
		focusedTab = 0;
		$("#tabs_container").hide();
	});
	/*******************************Search***********************************************/
	
	$(document).on('keyup', '#search', function(){
		var searchValue = $("#search").val();
		
        if(searchValue.length > 1)
		{
			$("#tree").remove();
			$("#tree_wrapper").append('<div id="tree"></div>');
			
			var search_settings = {
	
				source: {
					url: "?ctreports/get_tree_search/"+searchValue+"/",
					dataType: "json"
				},	
				lazyLoad: function(event, data){
						
						data.result = {
						url: "?ctreports/get_tree/",
						data: document_node,
						cache: false
					};
					
				},
				click: function (event, data){
											
					document_node.id_report = data.node.key;
					document_node.document_name = data.node.title;
			
					//add tabs when clicked
					addReportTab(data.node.data.class, data.node.key, data.node.title, data.node.folder, data.node.data.author, data.node.data.date, data.node.data.description);

			
			
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

