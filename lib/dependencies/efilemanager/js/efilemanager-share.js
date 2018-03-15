//globals
var document_node = {
	id_document: 0,
	id_group: 0,
	document_name: "",
	is_group: false,
	is_dir: true,
	root_dir: true,
	upload_right: true,
	download_right: true,
	delete_right: true,
	list_right: true,
	from_shared: false
};

var pagination;
var doc_id;
var currentNode = 0;
var clipboard = new Clipboard('#clip-btn');
var obj_meta = {};
var del_obj = {};
var version_obj = {};
var root = $('#root').val();
var guid = $('#guid').val();

$(document).ready(function () {

	//Cache the gui components 
	var GUIComponents = {
		docsPanel: $('#docs_panel'),
		directoryTree: $('#tree'),
		loadedDirectoryTree: null,
		documentTree: $('#treetable'),
		documentVersionTree: $("#treeversiontable"),
		topButtons: $("#addDirAndDOcsDiv"),
		zipHolder: $("#zip-holder"),
		friendlyPath: $("#friendlyPath"),
		directoryDetails: $("#directory-details"),
		modals: {
			spinner: $('#form_loader_2'),
			scan: {
				base: $('#scan-modal')
			},
		},
		pagination: $('#pagination')
	}

	//update the document_node object	
	function updateState(data) {
		document_node.id_document = data.node.key;
		document_node.document_name = data.node.title;
		document_node.id_group = data.node.data.id_group;
		document_node.is_group = data.node.data.is_group;
		document_node.is_dir = data.node.folder;
		document_node.root_dir = data.node.root_dir;
		document_node.delete_right = data.node.data.delete_right;
		document_node.download_right = data.node.data.download_right;
		document_node.delete_right = data.node.data.delete_right;
		document_node.list_right = data.node.data.list_right;
		document_node.from_shared = data.node.data.from_shared;

	}

	//generate header buttons accordingly to received rights on data parameter	
	function generateHeaderButtons(data) {
		GUIComponents.topButtons.show();
		var string = " <a class='col-lg-3' id='zip_directory' href='javascript:void(0);' data-toggle='tooltip' title='Shkarko Zip'></a>";
		GUIComponents.zipHolder.html(string);
	}

	//generate document action buttons
	function generateActionButtons(node) {
		var ext = node.title.split('.').pop();
		var data_attr = 'data-key="' + node.key + '" data-title="' + node.title + '" data-from_shared="' + node.data.from_shared + '"';
		var _downloadHtml, _addVersionHtml;


		_downloadHtml = '<a href="?efilemanager/download_doc/' + node.key + '/1/" class="btn btn-default btn-xs download_document">' +
			' <span class="glyphicon glyphicon-download"></span> <span class="text">Shkarko</span></a>';

		_addVersionHtml = '<a title="Shto te dokumentat e mia" href="javascript:void(0);" ' + data_attr + ' class="btn btn-success btn-xs add_version">' +
			' <span class="glyphicon glyphicon-plus"></span> <span class="text">Ruaj</span></a>';

		var title = "<span class='" + node.data.icon_style + "'></span> " + "<a href='javascript:void(0)' data-id='" + node.key + "' data-ext='" + ext + "' class='view-document'>" + node.title.truncate(50, 'middle') + "</a>";

		$tdList = $(node.tr).find(">td");
		$tdList.eq(0).html(title);
		$tdList.eq(1).html(_downloadHtml + " " + _addVersionHtml);
		$tdList.eq(1).attr('class', 'veprimet');
	}

	//get selected node id	
	function getSelectedNode() {
		var node = GUIComponents.directoryTree.fancytree("getActiveNode");
		return (node != null) ? node.key : 0;
	}

	//focus on a node
	function clickOnNode(node) {
		GUIComponents.loadedDirectoryTree.getNodeByKey(node).li.click();
	}

	//refresh document tree
	function refreshDocTree(order) {

		if (order != undefined)
			document_node.order = order;
		else {
			if (document_node.hasOwnProperty('order'))
				delete document_node.order;
		}

		document_node.offset = 0;

		$.ajax({
			type: "POST",
			url: "?efilemanager/get_shared_documents/" + guid,
			data: document_node,
			success: function (response) {
				GUIComponents.documentTree.fancytree("getTree").reload(response.data);
				pagination = response.details;
				addPagination(GUIComponents.pagination, '', "?efilemanager/get_shared_documents/" + guid);
			}, dataType: "json"
		});

	}

	var tree_settings = {
		source: {
			url: "?efilemanager/get_shared_directory/" + root + "/",
			dataType: "json"
		},
		init: function (event, data, flag) {
			clickOnNode(getSelectedNode());
			if (GUIComponents.loadedDirectoryTree.getNodeByKey(getSelectedNode()).data.special == '1') {
				GUIComponents.topButtons.hide();
			}
		},
		lazyLoad: function (event, data) {
			updateState(data);
			data.result = {
				url: "?efilemanager/get_shared_directory/" + root + "/",
				data: document_node,
				cache: false
			};
		},
		click: function (event, data) {
			generateHeaderButtons(data);
			updateState(data);
			refreshDocTree();
			if (GUIComponents.loadedDirectoryTree.getNodeByKey(getSelectedNode()).data.special == '1') {
				GUIComponents.topButtons.hide();
			}
		}
	};

	var treetable_settings = {
		extensions: ["table"],
		source: {
			url: "?efilemanager/get_shared_documents/" + guid,
			type: "POST",
			dataType: "json",
			data: document_node
		},
		renderColumns: function (event, data) {
			generateActionButtons(data.node);
		}
	};

	$("#tree").fancytree(tree_settings);
	GUIComponents.loadedDirectoryTree = GUIComponents.directoryTree.fancytree("getTree");

	$("#treetable").fancytree(treetable_settings);

	var sortOrder = 'asc';
	$(document).on('click', '#doc-name', function () {
		refreshDocTree(sortOrder);
		if (sortOrder == 'asc')
			sortOrder = 'desc';
		else sortOrder = 'asc';
	});

	//actions
	$('.veprimet').livequery(function () {
		$(this).hover(function () {
			$(".download_document").tooltip();
			$(".share_document").tooltip();
			$(".delete_document").tooltip();
			$(".add_version").tooltip();
			$(".view_version").tooltip();
		});

	});

	$('.view_version').livequery(function () {
		$(this).click(function () {
			version_obj.key = $(this).data('key');
			version_obj.title = $(this).data('title');
			version_obj.from_shared = $(this).data('from_shared');
			//console.log(version_obj);
			refreshDocVersionTree();
			$('#view_version_modal').modal('show');
		});
	});

	$('.download_document').livequery(function () {
		$(this).click(function () {
			$.fileDownload($(this).attr('href'), {
				successCallback: function (responseHtml, url) {
					//console.log(responseHtml);
				},
				failCallback: function (responseHtml, url) {
					//console.log("failCallback");
				}
			});
			return false; //this is critical to stop the click event which will trigger a normal file download!
		});
	});

	$('#zip_directory').livequery(function () {
		$(this).click(function () {
			var data = {};
			data.document_id = document_node.id_document;
			$.ajax({
				type: "POST",
				url: "?efilemanager/Zip/",
				data: data,
				success: function (response) {
					console.log("?efilemanager/downloadZip/" + response.document_id + "/" + response.path);
					var url = "?efilemanager/downloadZip/" + response.document_id + "/" + response.path;
					//$.ajax({url: "?efilemanager/downloadZip/"+response.document_id+"/"+response.path});
					$.fileDownload(url, {
						successCallback: function (responseHtml, url) {
							//console.log(responseHtml);
						},
						failCallback: function (responseHtml, url) {
							//console.log("failCallback");
						}
					});
					return false; //this is critical to stop the click event which will trigger a normal file download!
				},
				dataType: "json"
			});
		});
	});


	//extra
	function addPagination(selector, term, url) {
		var data = document_node;
		data.s = term;
		data.offset = pagination.page * pagination.resultsPerPage;

		selector.html("");
		selector
			.append(
			$('<button>')
				.addClass('btn btn-xs btn-default')
				.attr('id', 'prev-btn')
				.html('<i class="fa fa-angle-left" aria-hidden="true"></i>')
				.on('click', function () {
					pagination.page -= 2;
					data.offset = pagination.page * pagination.resultsPerPage;
					$.ajax({
						type: "POST",
						url: url,
						data: data,
						success: function (response) {
							pagination = response.details;
							if (pagination.page == 1) {
								$('#prev-btn').hide();
							} else {
								$('#prev-btn').show();
							}
							if (pagination.page == pagination.pages) {
								$('#next-btn').hide();
							} else {
								$('#next-btn').show();
							}
							$('#page-num').val(pagination.page);
							$("#treetable").data("ui-fancytree").getTree().reload(response.data);
						}, dataType: "json"
					});
				})
			)
			.append(
			$('<span>')
				.append(
				'Page'
				)
				.append(
				$('<input>')
					.attr('id', 'page-num')
					.addClass('input-xs')
					.val(pagination.page)
				)
				.append(
				'of ' + pagination.pages
				)
			)
			.append(

			$('<button>')
				.addClass('btn btn-xs btn-default')
				.html('<i class="fa fa-angle-right" aria-hidden="true"></i>')
				.attr('id', 'next-btn')
				.on('click', function () {
					data.offset = (pagination.page) * pagination.resultsPerPage;
					$.ajax({
						type: "POST",
						url: url,
						data: data,
						success: function (response) {
							pagination = response.details;
							if (pagination.page == 1) {
								$('#prev-btn').hide();
							} else {
								$('#prev-btn').show();
							}
							if (pagination.page == pagination.pages) {
								$('#next-btn').hide();
							} else {
								$('#next-btn').show();
							}
							$('#page-num').val(pagination.page);
							$("#treetable").data("ui-fancytree").getTree().reload(response.data);
						}, dataType: "json"
					});
				})
			);

		if (pagination.page == 1) {
			$('#prev-btn').hide();
		}
		if (pagination.page == pagination.pages) {
			$('#next-btn').hide();
		}
	}

	function getSelectedNode() { var node = $("#tree").fancytree("getActiveNode"); return (node != null) ? node.key : 0; }

	//vertical scroll
	$(function () {
		GUIComponents.directoryTree.slimScroll({
			height: '440px',
			size: '2px',
			color: '#2980b9'
		});
		GUIComponents.docsPanel.slimScroll({
			height: '530px',
			size: '0px',
			color: '#2980b9'
		});
	});

	//view document
	$(".modal-fullscreen").on('show.bs.modal', function () {
		setTimeout(function () {
			$(".modal-backdrop").addClass("modal-backdrop-fullscreen");
		}, 0);
	});

	$(".modal-fullscreen").on('hidden.bs.modal', function () {
		$(".modal-backdrop").addClass("modal-backdrop-fullscreen");
		$('#view-document-modal-body').html("");
	});

	$(document).on('click', '.view-document', function () {
		var document_id = $(this).data('id');
		var ext = $(this).data('ext');

		$('#view-document-modal').modal('show');
		if (ext == 'jpg' || ext == 'JPG' || ext == 'jpeg' || ext == 'JPEG' || ext == 'png' || ext == 'PNG')
			viewImage(document_id);
		else viewDoc(document_id);
	});

	function viewImage(id) {
		$('#view-document-modal-body').append(
			"<img class='img-responsive' src='?efilemanager/view_doc/" + id + "/1/'>"
		)
	}

	function viewDoc(id) {
		var url = window.location.hostname + '/?efilemanager/view_doc/' + id + '/1/';

		$('#view-document-modal-body').append(
			"<iframe src='http://docs.google.com/viewer?url=" + url + "&embedded=true'  style='position: absolute;width:100%; min-height: 600px;border: none;'></iframe>"
		)
	}

	//sharing features
	$('#login-btn').livequery(function () {
		$(this).click(function () {
			$("#login-modal").modal('show');
		});
	});

	//add directory
	$('#add_directory').livequery(function () {
		$(this).click(function () {
			var data = {};
			data.id_document = document_node.id_document;
			data.guid = $("#guid").val();
			$.ajax({
				dataType: "json",
				type: "post",
				url: "?efilemanager/add_shared_documents/",
				data: data,
				success: onSuccessDirectoryAdd
			});
		});
	});

	function onSuccessDirectoryAdd(response) {
		bootbox.alert(response.message);
		if (response.error == 0) {
			$('#add_directory')
				.html("Rikthehu")
				.on('click', function () {
					location.href = "?efilemanager/index";
				})
		}
	}

	//add document
	$('.add_version').livequery(function () {
		$(this).click(function () {
			var data = {};
			data.id_document = $(this).data('key');
			data.guid = $("#guid").val();
			$('#login-btn').click();
			$.ajax({
				dataType: "json",
				type: "post",
				url: "?efilemanager/add_shared_documents/",
				data: data,
				success: onSuccessDocumentAdd.bind(this)
			});
		});
	})

	function onSuccessDocumentAdd(response) {
		bootbox.alert(response.message);
		if (response.error == 0) {
			$(this).tooltip('hide');
			$(this).remove();

		}
	}

});

