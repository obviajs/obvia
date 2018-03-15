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

//mime types
var MimeType = {
	map: {},
	init: function () {
		MimeType.set("manifest,.manifest,.mf,.appcache", "text/cache-manifest");
	},
	set: function (ext, type) {
		ext.split(",").forEach(function (item) {
			MimeType.map[item] = type;
		});	
	}
}

var pagination;
var doc_id;
var clipboard = new Clipboard('#clip-btn');
var del_obj = {};
var version_obj = {};
var stopFocus = 0;

//validate
var validateForms = function (selector) {
	var valid = true;
	selector.each(function () {

		if (!$(this).valid()) {
			valid = false;
		}
	});
	return valid;
}

$(document).ready(function () {

	//Cache the gui components 
	var GUIComponents = {
		docsPanel: $('#docs_panel'),
		directoryTree: $('#tree'),
		loadedDirectoryTree: null,
		documentTree: $('#treetable'),
		documentVersionTree: $("#treeversiontable"),
		manageSharedDirsBtn: $("#manage-shared-dirs"),
		topButtons: $("#addDirAndDOcsDiv"),
		directoryDetailsBtn: $("#directory-deep-details"),
		friendlyPath: $("#friendlyPath"),
		directoryDetails: $("#directory-details"),
		filtersBtn: $('#filters'),
		filtersBuilder: $('#builder'),
		modals: {
			spinner: $('#form_loader_2'),
			info: {
				base: $('#info-modal'),
				title: $('#info-modal-title'),
				body: $('#info-modal-body')
			},
			scan: {
				base: $('#scan-modal'),
				specifications: $('#scan-properties')
			},
			addDocument: {
				base: $('#add_document_modal'),
				body: $('#upload-modal-content'),
				specifications: $('#document-specifications-area')
			},
			metadata: {
				base: $('#metadata-modal'),
				body: $('#metadata-modal-content'),
				title: $('#metadata-modal-title')
			},
			addDirectory: {
				base: $('#add_directory_modal')
			},
			addVersion: {
				base: $('#add_version_modal'),
				title: $('#add_version_modal_title'),
				specifications: $('#document-revision-specifications-area')

			},
			filters: {
				base: $('#adv_filters_popup'),
				grid: $("#adv_filters_popup_grid"),
				buttons: {
					clear: $('#clear_filters'),
					close: $("[data-dismiss=\"modal-adv-filters\"]"),
					apply: $('#apply_advanced_filters'),
					save: $('#save_advanced_filters'),
					template: $("#filter_templates")
				}
			},
			manageSharedDirs: {
				base: $("#manage-shared-dirs-modal"),
				body: $("#manage-shared-dirs-modal-content")
			}
		},
		pagination: $('#pagination'),
		search: {
			input: $('#search_input'),
			button: $('#search_')
		}
	};

	//array max
	Array.max = function (array) {
		return Math.max.apply(Math, array);
	};

	//update the document_node object	
	function updateState(data) {
		//console.log(data.node.data);
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
		GUIComponents.directoryDetailsBtn.show();

		if (data.node.data.upload_right && data.node.data.download_right) {
			//console.log("upload + download");
			GUIComponents.topButtons.html("");

			if (data.node.data.list_right) {
				var string = " <a class='col-lg-3' id='add_document' href='javascript:void(0);' data-toggle='tooltip' title='Ngarko Dokument'> </a>";
				string += " <a class='col-lg-3' id='scan_document' href='javascript:void(0);' data-toggle='tooltip' title='Skano Dokument'> </a>";
				string += "<a class='col-lg-3' id='add_directory' href='javascript:void(0);' data-toggle='tooltip' title='Shto Direktori'></a>";
				string += " <a class='col-lg-3' id='zip_directory' href='javascript:void(0);' data-toggle='tooltip' title='Shkarko Zip'></a>";

				if (!data.node.data.from_shared)
					string += " <a id='share_directory' href='javascript:void(0);' class='col-lg-3' data-toggle='tooltip' title='Shpernda'></a>";

				string += "<a class='col-lg-2' id='delete_directory' href='javascript:void(0);' data-toggle='tooltip' title='Fshi Direktori'></a>";
				GUIComponents.topButtons.html(string);
			}

		}
		else if (data.node.data.upload_right && !data.node.data.download_right) {
			//console.log("upload only");
			GUIComponents.topButtons.html("");

			var string = " <a class='col-lg-3' id='add_document' href='javascript:void(0);' data-toggle='tooltip' title='Ngarko Dokument'> </a>";
			string += " <a class='col-lg-3' id='scan_document' href='javascript:void(0);' data-toggle='tooltip' title='Skano Dokument'> </a>";
			string += "<a class='col-lg-3' id='add_directory' href='javascript:void(0);' data-toggle='tooltip' title='Shto Direktori'></a>";
			string += "<a class='col-lg-2' id='delete_directory' href='javascript:void(0);' data-toggle='tooltip' title='Fshi Direktori'></a>";
			GUIComponents.topButtons.html(string);
		}
		else if (!data.node.data.upload_right && !data.node.data.download_right) {
			//console.log("no right");
			var string = "<a class='col-lg-2' id='delete_directory' href='javascript:void(0);' data-toggle='tooltip' title='Fshi Direktori'></a>";
			GUIComponents.topButtons.html(string);
		}
		else if (!data.node.data.upload_right && data.node.data.download_right) {
			if (data.node.data.list_right) {
				//console.log("download only");
				var string = " <a class='col-lg-3' id='zip_directory' href='javascript:void(0);' data-toggle='tooltip' title='Shkarko Zip'></a>";
				string += "<a class='col-lg-2' id='delete_directory' href='javascript:void(0);' data-toggle='tooltip' title='Fshi Direktori'></a>";
				GUIComponents.topButtons.html(string);
			}
			else GUIComponents.topButtons.html("");

		}
	}

	//generate document action buttons
	function generateActionButtons(node) {
		var key, type;
		if (node.data.versions == 'ALL') {
			key = node.key;
			type = 1;
		} else {
			key = Array.max(node.data.versions.split(','));
			type = 2;
		}

		var ext = node.title.split('.').pop();
		var data_attr = 'data-key="' + node.key + '" data-title="' + node.title + '" data-from_shared="' + node.data.from_shared + '"' + '" data-versions="' + node.data.versions + '" ';
		var _shareHtml, _addVersionHtml, _delHtml, _downloadHtml, _addInfoHtml, _viewHtml;

		if (node.data.download_right && node.data.upload_right && !node.data.from_shared) {
			_shareHtml = '<a title="Share" href="javascript:void(0);" ' + data_attr + ' class="btn btn-success btn-xs share_document">' +
				' <span class="glyphicon glyphicon-share"></span></a>';
		}
		else
			_shareHtml = "";

		if (node.data.upload_right) {
			_addVersionHtml = '<a title="Add Version" href="javascript:void(0);" ' + data_attr + ' class="btn btn-default btn-xs add_version">' +
				' <span class="glyphicon glyphicon-list-alt"></span> <span class="text"></span></a>';
		}
		else
			_addVersionHtml = "";

		if (node.data.delete_right) {
			_delHtml = '<a title="Delete" href="javascript:void(0);" ' + data_attr + ' class="btn btn-danger btn-xs delete_document">' +
				' <span class="glyphicon glyphicon-trash"></span> <span class="text"></span></a>';
		}
		else
			_delHtml = "";

		if (node.data.download_right) {
			//is encrypted
			if (node.data.encrypted == '1') {
				_downloadHtml = '<a title="Decrypt & Download" href="javascript:void(0)" onclick="downloadDecryptedFile(this, ' + key + ',' + type + ',\'' + node.title + '\');" class="btn btn-default btn-xs download_document">' +
					'<i class="fa fa-key" aria-hidden="true"></i> <span class="text"></span></a>';
			}else
				_downloadHtml = '<a title="Download" href="?efilemanager/download_doc/' + key + '/' + type + '/"  class="btn btn-default btn-xs download_document">' +
					' <span class="glyphicon glyphicon-download"></span> <span class="text"></span></a>';
		}
		else
			_downloadHtml = "";


		_addInfoHtml = '<a href="javascript:void(0);" ' + data_attr + ' data-version="0" class="btn btn-default btn-xs add_doc_info">' +
			' <span class="glyphicon glyphicon-plus"></span>  Info </a>';

		_viewHtml = '<a title="View Versions" href="javascript:void(0);" ' + data_attr + ' class="btn btn-default btn-xs view_version">' +
			' <span class="glyphicon glyphicon-time"></span> <span class="text"></span></a>';

		var title = "<span class='" + node.data.icon_style + "'></span> " + "<a href='javascript:void(0)' data-type='" + type + "' data-id='" + key + "' data-ext='" + ext + "' class='view-document'>" + node.title.substring(0, 100) + "</a>";

		$tdList = $(node.tr).find(">td");
		$tdList.eq(0).html(title);
		$tdList.eq(1).html(_downloadHtml + " " + _viewHtml + "  " + _addVersionHtml + " " + _addInfoHtml + " " + _shareHtml + " " + _delHtml);
		$tdList.eq(1).attr('class', 'veprimet');
	}

	//generate version document action buttons
	function generateActionButtonsForVersion(node) {
		var data_attr = 'data-key="' + node.key + '" data-title="' + node.title + '" ';
		var _delHtml, _downloadHtml, _addInfoHtml;

		if (node.data.delete_right) {
			_delHtml = '<a href="javascript:void(0);" ' + data_attr + ' class="btn btn-danger btn-xs delete_revision">' +
				' <span class="glyphicon glyphicon-trash"></span> Fshi </a>';
		}
		else
			_delHtml = "-";

		if (node.data.download_right) {
			_downloadHtml = '<a href="?efilemanager/download_doc/' + node.key + '" class="btn btn-default btn-xs download_document">' +
				' <span class="glyphicon glyphicon-download"></span>  Shkarko </a>';
		}
		else {
			_downloadHtml = "-";
		}

		_addInfoHtml = '<a href="javascript:void(0);" ' + data_attr + ' data-version="1" class="btn btn-default btn-xs add_doc_info">' +
			' <span class="glyphicon glyphicon-plus"></span>  Info </a>';


		$tdList = $(node.tr).find(">td");
		$tdList.eq(0).text(node.getIndexHier()).addClass("alignRight");
		$tdList.eq(1).text(node.title.substring(0, 100));
		$tdList.eq(3).text(node.data.byte_size);
		$tdList.eq(2).text(node.data.date);
		$tdList.eq(4).text(node.data.user);
		$tdList.eq(5).html(_downloadHtml);
		$tdList.eq(6).html(_addInfoHtml);
		$tdList.eq(7).html(_delHtml);
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

	//directory details
	function getDirectoryDetails(document_id, from_shared) {
		$.ajax({
			url: "?/efilemanager/directoryDetailsHtml",
			type: "post",
			dataType: "json",
			data: { document_id: document_id, from_shared: from_shared },
			success: function (response) {
				//console.log(response.data);
				GUIComponents.directoryDetails.html(response.modal);
				GUIComponents.friendlyPath.html(response.friendlyPath);
			}
		});
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
			url: "?efilemanager/get_documents/",
			data: document_node,
			success: function (response) {
				GUIComponents.documentTree.fancytree("getTree").reload(response.data);
				pagination = response.details;
				addPagination(
					GUIComponents.pagination,
					{
						type: 'docs'
					},
					"?efilemanager/get_documents/"
				);
			}, dataType: "json"
		});


	}

	//refresh document version tree
	function refreshDocVersionTree() {
		//console.log(document_node);
		$.ajax({
			type: "POST",
			url: "?efilemanager/get_document_versions/",
			data: version_obj,
			success: function (ret_data) {
				GUIComponents.documentVersionTree.data("ui-fancytree").getTree().reload(ret_data);
			}, dataType: "json"
		});
	}

	var tree_settings = {
		source: {
			url: "?efilemanager/get_directory/",
			dataType: "json"
		},
		init: function (event, data, flag) {
			clickOnNode(getSelectedNode());
		},
		lazyLoad: function (event, data) {
			updateState(data);
			data.result = {
				url: "?efilemanager/get_directory/",
				data: document_node,
				cache: false
			};
		},
		click: function (event, data) {
			//check rights
			//console.log("upload: "+data.node.data.upload_right+", download: "+data.node.data.download_right+", delete: "+data.node.data.delete_right+", list: "+data.node.data.list_right+", shared: "+data.node.data.from_shared);
			getDirectoryDetails(data.node.key, data.node.data.from_shared);
			generateHeaderButtons(data)
			updateState(data);
			refreshDocTree();
		}
	};

	var treetable_settings = {
		extensions: ["table"],
		source: {
			url: "?efilemanager/get_documents/",
			type: "POST",
			dataType: "json",
			data: document_node
		},
		renderColumns: function (event, data) {
			generateActionButtons(data.node);
		}

	};

	var treetable_version_settings = {
		extensions: ["table"],
		table: { indentation: 20 },
		source: {
			url: "?efilemanager/get_document_versions/0/",
			type: "POST",
			dataType: "json",
			data: document_node
		},
		renderColumns: function (event, data) {
			generateActionButtonsForVersion(data.node);
		}
	};

	GUIComponents.directoryTree.fancytree(tree_settings);

	GUIComponents.loadedDirectoryTree = GUIComponents.directoryTree.fancytree("getTree");

	GUIComponents.documentTree.fancytree(treetable_settings);

	GUIComponents.documentVersionTree.fancytree(treetable_version_settings);

	//sort
	var sortOrder = 'asc';
	$(document).on('click', '#doc-name', function () {
		//TODO sort
		/**refreshDocTree(sortOrder);
		if(sortOrder == 'asc')
			sortOrder = 'desc';
		else sortOrder = 'asc';
		 */
	});

	//details	
	$(document).on('click', '#directory-deep-details', function () {
		GUIComponents.modals.spinner.fadeIn();
		$.ajax({
			url: "?efilemanager/directoryDeepDetails",
			data: { document_id: getSelectedNode() },
			type: "POST",
			dataType: "json",
			success: function (response) {
				GUIComponents.modals.spinner.fadeOut();
				GUIComponents.modals.info.base.modal('show');
				GUIComponents.modals.info.title.html(response.data.document);
				GUIComponents.modals.info.body.html(
					"<div class='row' style='margin: 10px'>" +
					"<div class='col-lg-3'><small>Krijimi:</small><b> " + response.data.date + "</b></div>" +
					"<div class='col-lg-4'><small>Modifikimi i Fundit:</small><b> " + response.data.lastModified + "</b></div>" +
					"<div class='col-lg-5'><b> " + response.data.size + "</b>" +
					"<b> (" + response.data.files + ")</b>" +
					"</div></div>"
				);
			}
		});
	});

	//upload
	$("#start_upload_version").click(function () {
		uploadVersionObj.startUpload();
	});

	//scan document
	function uploadSuccessCallbackOnce(response) {
		if (response != '-2003') {
			GUIComponents.modals.spinner.fadeOut();
			GUIComponents.modals.scan.base.modal('hide');
			$('#scanned-doc-name').val('');
			Dynamsoft_clearCanvas();
			refreshDocTree();
			bootbox.alert("Dokumenti i Skanuar u ngarkua me sukses");
		} else {
			bootbox.alert("Ngarkimi i dokumentit deshtoi");
		}
	}

	function uploadSuccessCallbackUnlimited(response) {
		if (response != '-2003') {
			GUIComponents.modals.spinner.fadeOut();
			$('#scanned-doc-name').val('');
			Dynamsoft_clearCanvas();
			refreshDocTree();
			bootbox.alert("Dokumenti i Skanuar u ngarkua me sukses");
		} else {
			bootbox.alert("Ngarkimi i dokumentit deshtoi");
		}
	}

	$(document).on('click', '#scan_document', function () {
		var selectors = {
			documentCategories: $('#scan-document-categories'),
			forms: $('#scan-document-categories-forms'),
			formsId: '#scan-document-categories-forms',
			selectId: 'scan-document-categories-select'
		};
		$(this).tooltip('hide');
		$('#scan-modal').modal('show');
		renderFilePreferencesView(selectors, {});
	});

	$(document).on('click', '#scan-doc', function () {
		scanner();
	});

	$(document).on('click', '#upload-scanned-doc', function () {
		var fileName;
		if ($('#scanned-doc-name').val() != '')
			fileName = $('#scanned-doc-name').val() + ".pdf";
		else fileName = "scanned-document.pdf";

		GUIComponents.modals.spinner.fadeIn();
		uploadDocumentAsPDF(
			fileName,
			document_node.id_document,
			document_node.is_group,
			document_node.id_group,
			getFormsFilledData($('.formHtml')),
			selectedCategory('scan-document-categories-select').value,
			uploadSuccessCallbackOnce
		);
	});

	$(document).on('click', '#upload-scanned-doc-new', function () {
		var fileName;
		if ($('#scanned-doc-name').val() != '')
			fileName = $('#scanned-doc-name').val() + ".pdf";
		else fileName = "scanned-document.pdf";

		GUIComponents.modals.spinner.fadeIn();
		uploadDocumentAsPDF(
			fileName,
			document_node.id_document,
			document_node.is_group,
			document_node.id_group,
			getFormsFilledData($('.formHtml')),
			selectedCategory('scan-document-categories-select').value,
			uploadSuccessCallbackUnlimited
		);
	});

	GUIComponents.modals.scan.base.on('hidden.bs.modal', function () {
		Dynamsoft_clearCanvas();
		$('#scan-document-categories-forms').html("");
	});

	//add document/directory
	$('#add_document').livequery(function () {
		$(this).click(function () {
			GUIComponents.modals.addDocument.base.modal('show');
		});
	});

	$('#add_directory').livequery(function () {
		$(this).click(function () {
			GUIComponents.modals.addDirectory.base.modal('show');
			GUIComponents.loadedDirectoryTree.getNodeByKey(getSelectedNode()).setExpanded();
		});
	});

	$('#save_directory').click(function () {

		//get selected node
		var input_val = $("#add_directory_name").val();

		if (input_val == "") {
			bootbox.alert('Vendosni nje emer per direktorine');
			return;
		}

		document_node.new_directory_name = input_val;

		$.ajax({
			type: "POST",
			url: "?efilemanager/add_directory",
			data: document_node,
			success: function (ret_data) {
				GUIComponents.modals.addDirectory.base.modal('hide');
				$("#add_directory_name").val("");
				if (ret_data.error == 0) {
					activeNode = GUIComponents.loadedDirectoryTree.getActiveNode();
					activeNode.addChildren(ret_data.data);
					activeNode.setExpanded(true);
				}
				bootbox.alert(ret_data.message);

			}, dataType: "json"
		});

	});

	$('.add_version').livequery(function () {
		$(this).click(function () {
			version_obj.key = $(this).data('key');
			version_obj.title = $(this).data('title');
			GUIComponents.modals.addVersion.base.modal('show');
		});
	});

	//share document
	$('#share_directory').livequery(function () {
		$(this).click(function () {
			$("#share_directory_modal #myModalLabel").html("Share direktori");
			$("#share-box").html("");
			$("#share-footer").html("<a href='javascript:void(0);' class='btn btn-default btn-sm' data-dismiss='modal'>Mbyll</a>" +
				"<a href='javascript:void(0);' id='dir_gen_link_btn' class='btn btn-danger btn-sm'>Gjenero Link</a>");
			$('#share_directory_modal').modal('show');
		});
	});

	$('.share_document').livequery(function () {
		$(this).click(function () {
			doc_id = $(this).attr('data-key');
			$("#share_directory_modal #myModalLabel").html("Share dokument");
			$("#share-box").html("");
			$("#share-footer").html("<a href='javascript:void(0);' class='btn btn-default btn-sm' data-dismiss='modal'>Mbyll</a>" +
				"<a href='javascript:void(0);' id='doc_gen_link_btn' class='btn btn-danger btn-sm'>Gjenero Link</a>");
			$('#share_directory_modal').modal('show');
		});
	});

	$("#dir_gen_link_btn").livequery(function () {
		$(this).click(function () {
			var data = {};
			data.id_document = document_node.id_document;

			var download = 1;
			var listVar = 1;

			if ($('input#upload').is(':checked'))
				var upload = 1;
			else
				var upload = 0;

			if ($('input#delete').is(':checked'))
				var deleteVar = 1;
			else
				var deleteVar = 0;

			data.upload = upload;
			data.download = download;
			data.delete = deleteVar;
			data.list = listVar;
			data.expire = $('#expire').val();
			data.time = $('#time').val();

			$.ajax({
				type: "POST",
				url: "?efilemanager/shareDocument/",
				data: data,
				success: function (response) {
					$("#dir_gen_link_btn").prop("disabled", true);
					$('#share-box')
						.html("<h5>Link</h5><div class='input-group'>" +
						"<input type='text' id='link' class='form-control' value='" + response + "'>" +
						"<span class='input-group-btn'>" +
						"<button class='btn btn-default' id='clip-btn' data-clipboard-target='#link'>" +
						"<span class='glyphicon glyphicon-paperclip'>" +
						"</span></button></span></div>" +
						"<br><h5>Send link via mail</h5><div class='input-group'>" +
						"<input type='email' id='email' class='form-control' placeholder='example@mail.com'>" +
						"<span class='input-group-btn'>" +
						"<button class='btn btn-success' id='email-btn'>" +
						"<span class='glyphicon glyphicon-send'> " +
						" Send</span></button></span></div>");
				}, dataType: "html"
			});

		});

	});

	$("#doc_gen_link_btn").livequery(function () {
		$(this).click(function () {
			var data = {};
			data.id_document = doc_id;

			var download = 1;
			var listVar = 1;

			if ($('input#upload').is(':checked'))
				var upload = 1;
			else
				var upload = 0;

			if ($('input#delete').is(':checked'))
				var deleteVar = 1;
			else
				var deleteVar = 0;

			data.upload = upload;
			data.download = download;
			data.delete = deleteVar;
			data.list = listVar;
			data.expire = $('#expire').val();
			data.time = $('#time').val();

			$.ajax({
				type: "POST",
				url: "?efilemanager/shareDocument/",
				data: data,
				success: function (response) {
					response = response.replace(" ", "");
					$("#dir_gen_link_btn").prop("disabled", true);
					$('#share-box')
						.html("<h5>Link</h5><div class='input-group'>" +
						"<input type='text' id='link' class='form-control' value='" + response + "'>" +
						"<span class='input-group-btn'>" +
						"<button class='btn btn-default' id='clip-btn' data-clipboard-target='#link'>" +
						"<span class='glyphicon glyphicon-paperclip'>" +
						"</span></button></span></div>" +
						"<br><h5>Send link via mail</h5><div class='input-group'>" +
						"<input type='email' id='email' class='form-control' placeholder='example@mail.com'>" +
						"<span class='input-group-btn'>" +
						"<button class='btn btn-success' id='email-btn'>" +
						"<span class='glyphicon glyphicon-send'> " +
						" Send</span></button></span></div>");
				}, dataType: "html"
			});


		});

	});

	$("#email-btn").livequery(function () {
		$(this).click(function () {
			var data = {};
			data.email = $("#email").val();
			data.link = $("#link").val();
			data.expire = $("#expire").val();
			data.time = $("#time").val();

			$.ajax({
				url: "?efilemanager/sendLinkViaMail",
				type: "post",
				dataType: "json",
				data: data,
				success: function (response) {
					$("#email-btn").prop("disabled", false);
					$("#email-btn").html("Send");
					bootbox.alert(response.message);
					$("#email").val("");
				}
			});
			//wait for response
			$.when($(this)).done(function () {
				$("#email-btn").prop("disabled", true);
				spinner($("#email-btn"), ' Sending ...', 'fa-1x', 'color:white');
			});
		});
	});

	//metadata
	$(".add_doc_info").livequery(function () {
		$(this).click(function () {

			version_obj.key = $(this).data('key');
			version_obj.title = $(this).data('title');
			version_obj.version = $(this).data('version');

			$('#save-metadata').attr("data-docid", version_obj.key);
			$('#save-metadata').attr("data-version", 'false');

			var options = {
				documentId: version_obj.key,
				selectStatus: 'disabled'
			};

			if (version_obj.version == '1') {
				options.documentId = doc_id;
				options.version = true;
				options.versionId = version_obj.key;
				$('#save-metadata').attr("data-version", 'true');
			}

			GUIComponents.modals.metadata.base.modal('show');
			GUIComponents.modals.metadata.title.html("Te dhena per dokumentin <b>" + version_obj.title + "</b>");

			var selectors = {
				documentCategories: $('#meta-document-categories'),
				forms: $('#meta-document-categories-forms'),
				formsId: '#meta-document-categories-forms',
				selectId: 'meta-document-categories-select'
			};

			renderFilePreferencesView(selectors, options);

		});

	});

	GUIComponents.modals.metadata.base.on('hide.bs.modal', function () {
		$('#meta-document-categories-forms').html("");
		$('#meta-document-categories').html("");
	});

	$('#save-metadata').on('click', function () {
		var dataString = getFormsFilledData($('.formHtml')) + "&documentId=" + $(this).attr('data-docid') + '&dcid=' + $('#meta-document-categories-select').val();;
		dataString = window.btoa(dataString);

		var url = "?efilemanager/save_meta_data";
		if ($(this).attr('data-version') == 'true')
			url = "?efilemanager/save_meta_data/" + $(this).attr('data-version');

		if (!validateForms($('.formHtml'))) {
			stopFocus = 0;
			return;
		}

		$.ajax({
			url: url,
			type: "post",
			dataType: "json",
			data: {
				formData: dataString
			},
			success: function (response) {
				if (response.error == 0) {
					GUIComponents.modals.metadata.base.modal('hide');
				}
				bootbox.alert(response.message);
			}
		})
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
			doc_id = parseInt($(this).attr('data-key'));
			version_obj.key = $(this).data('key');
			version_obj.title = $(this).data('title');
			version_obj.from_shared = $(this).data('from_shared');
			version_obj.versions = $(this).data('versions');

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
					//console.log(response);
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

	function delete_document(key) {
		$('#confirm_modal').modal('show');
	}

	$(".delete_document").livequery(function () {
		$(this).click(function () {

			var key = $(this).data('key');
			var title = $(this).data('title');

			del_obj.type = 0;
			del_obj.key = key;
			del_obj.title = title;
			del_obj.from_shared = document_node.from_shared;

			deleteDocument(del_obj);

		});
	});

	$(".delete_revision").livequery(function () {
		$(this).click(function () {

			var key = $(this).data('key');
			var title = $(this).data('title');
			$('#confirm_modal_title_revision').html("Fshi version");
			$('#confirm_modal_message_revision').html("Doni te fshini versionin '" + title + "' ?");

			$('#confirm_action_revision').show();
			$('#confirm_modal_revision').modal('show');

			del_obj.type = 0;
			del_obj.key = key;
			del_obj.title = title;

		});

	});

	$('#delete_directory').livequery(function () {
		$(this).click(function () {
			del_obj.type = 1;
			del_obj.key = document_node.id_document;
			del_obj.title = document_node.document_name;
			del_obj.from_shared = document_node.from_shared;

			deleteDocument(del_obj);
		});
	});

	function deleteDocument(del_obj) {

		var appendix = (del_obj.type) ? " direktorine " : " dokumentin ";
		bootbox.confirm("Deshironi te fshini" + appendix + "'" + del_obj.title + "' ?", function (result) {
			if (result) {
				var data = { document_id: del_obj.key, from_shared: del_obj.from_shared, is_dir: del_obj.type };
				$("#form_loader_2").fadeIn();
				$.ajax({
					type: "POST",
					url: "?efilemanager/delete_document/",
					data: data,
					success: function (data) {
						$("#form_loader_2").fadeOut();
						bootbox.alert(data.message);
						if (data.error == 0) {
							if (del_obj.type) {
								var node = GUIComponents.loadedDirectoryTree.getActiveNode();
								node.parent.li.click();
								node.remove();
							}
							else
								refreshDocTree();
						}
					}
					, dataType: "json"
				});
			}
		});
	}

	$('#confirm_action_revision').click(function () {
		$.ajax({
			type: "GET",
			url: "?efilemanager/delete_revision/" + del_obj.key,
			success: function (data) {

				var message = "Direktoria ";
				var node = $("#tree");
				if (del_obj.type == 0) {
					message = "Dokumenti ";
					var node = GUIComponents.documentVersionTree;
				}

				message += "'" + del_obj.title + "'" + data.message;

				var html_mesage = "";
				if (data.error == 0) {
					html_mesage = "<span class='alert alert-success'>" + message + "</span>";
					node.fancytree("getActiveNode").remove();
				} else {
					html_mesage = "<span class='alert alert-danger'>" + message + "</span>";
				}

				$('#confirm_modal_message_revision').html(html_mesage);
				setTimeout(function () { $('#confirm_modal_revision').modal('hide'); }, 2000);
				refreshDocTree();


			}, dataType: "json"
		});

	});

	GUIComponents.manageSharedDirsBtn.on('click', function () {
		GUIComponents.modals.manageSharedDirs.base.modal('show');

		$.getJSON('?efilemanager/sharedDirsUserHasAccess', function (response) {
			var container = $('#my-dirs-content');
			container.html("");

			response.forEach(function (item) {
				var list = item.list == 1 ? 'checked' : '';
				var download = item.download == 1 ? 'checked' : '';
				var upload = item.upload == 1 ? 'checked' : '';
				var del = item.delete == 1 ? 'checked' : '';


				container
					.append(
					$('<div>')
						.addClass('row')
						.css({ 'padding': '10px' })
						.append(
						$('<div>')
							.addClass('col-md-5')
							.html("<a href='javascript:void(0)'>" + item.path + "</a>")
						)
						.append(
						$('<div>')
							.addClass('col-md-6')
							.append("<div class='col-md-3'>" +
							"<input class='magic-checkbox rights-checkbox' type='checkbox' name='list' disabled " + list + ">" +
							"<label class='checkbox-btn pull-left'></label>" +
							"</div>")
							.append("<div class='col-md-3'>" +
							"<input class='magic-checkbox rights-checkbox' type='checkbox' name='download' disabled " + download + ">" +
							"<label class='checkbox-btn pull-left'></label>" +
							"</div>")
							.append("<div class='col-md-3'>" +
							"<input class='magic-checkbox rights-checkbox' type='checkbox' name='upload' disabled " + upload + ">" +
							"<label class='checkbox-btn pull-left'></label>" +
							"</div>")
							.append("<div class='col-md-3'>" +
							"<input class='magic-checkbox rights-checkbox' type='checkbox' name='delete' disabled " + del + ">" +
							"<label class='checkbox-btn pull-left'></label>" +
							"</div>")

						)
						.append(
						$('<div>')
							.addClass('col-md-1')
							.html("<a href='javascript:void(0)' class='leave-shared-dir' data-id='" + item.id + "'><i class='fa fa-sign-out' aria-hidden='true'></i> Dil</a>")
						)
					)
			});
		});

		$.getJSON('?efilemanager/sharedDiresUserGaveAccess', function (response) {
			var container = $('#shared-dirs-content');
			container.html("");
			response.forEach(function (item) {

				container
					.append(
					$('<div>')
						.addClass('row')
						.css({ 'padding': '10px' })
						.append(
						$('<div>')
							.addClass('col-md-5')
							.html("<a href='javascript:void(0)'>" + item.path + "</a>")
						)
						.append(
						$('<div>')
							.addClass('col-md-7')

						)

					);

				item.users.forEach(function (user) {
					var list = user.list == 1 ? 'checked' : '';
					var download = user.download == 1 ? 'checked' : '';
					var upload = user.upload == 1 ? 'checked' : '';
					var del = user.delete == 1 ? 'checked' : '';

					container
						.append(
						$('<div>')
							.addClass('row')
							.css({ 'padding': '10px' })
							.append(
							$('<div>')
								.addClass('col-md-5')
								.html("<i>" + user.name + "</i>")
							)
							.append(
							$('<div>')
								.addClass('col-md-6')
								.append("<div class='col-md-3'>" +
								"<input class='magic-checkbox sh-rights-checkbox sh-rights-checkbox-list' type='checkbox' name='list' " + list + " id='sh-list-" + item.id + "-" + user.id + "' data-user='" + user.id + "' data-document='" + item.id + "' data-right='list_right'>" +
								"<label class='checkbox-btn pull-left' for='sh-list-" + item.id + "-" + user.id + "'></label>" +
								"</div>")
								.append("<div class='col-md-3'>" +
								"<input class='magic-checkbox sh-rights-checkbox sh-rights-checkbox-download' type='checkbox' name='download' " + download + " id='sh-download-" + item.id + "-" + user.id + "' data-user='" + user.id + "' data-document='" + item.id + "' data-right='download_right'>" +
								"<label class='checkbox-btn pull-left' for='sh-download-" + item.id + "-" + user.id + "'></label>" +
								"</div>")
								.append("<div class='col-md-3'>" +
								"<input class='magic-checkbox sh-rights-checkbox sh-rights-checkbox-upload' type='checkbox' name='upload' " + upload + " id='sh-upload-" + item.id + "-" + user.id + "' data-user='" + user.id + "' data-document='" + item.id + "' data-right='upload_right'>" +
								"<label class='checkbox-btn pull-left' for='sh-upload-" + item.id + "-" + user.id + "'></label>" +
								"</div>")
								.append("<div class='col-md-3'>" +
								"<input class='magic-checkbox sh-rights-checkbox sh-rights-checkbox-delete' type='checkbox' name='delete' " + del + " id='sh-delete-" + item.id + "-" + user.id + "' data-user='" + user.id + "' data-document='" + item.id + "' data-right='delete_right'>" +
								"<label class='checkbox-btn pull-left' for='sh-delete-" + item.id + "-" + user.id + "'></label>" +
								"</div>")

							)
							.append(
							$('<div>')
								.addClass('col-md-1')
								.html("<a href='javascript:void(0)' class='remove-access' data-user='" + user.id + "' data-document='" + item.id + "'><i class='fa fa-eraser' aria-hidden='true'></i> Fshi</a>")
							)
						)
				});

				container
					.append("<hr>");

			});
		});
	});

	$(document).on('click', '.leave-shared-dir', function () {
		var id = $(this).data('id');
		var elementToRemove = $(this).parent().closest('.row');

		bootbox.confirm("Deshironi te hiqni aksesin?", function (result) {
			if (result) {
				$.ajax({
					url: '?efilemanager/leaveSharedDir',
					type: 'POST',
					data: { id_document: id },
					dataType: 'json',
					success: function (response) {
						bootbox.alert(response.message);
						if (response.error == 0) {
							elementToRemove.remove();
							GUIComponents.loadedDirectoryTree.reload();
						}
					}
				});
			}
		});

	});

	$(document).on('click', '#leave-all-shared-dir', function () {
		var elementToRemove = $('#my-dirs-content');

		bootbox.confirm("Deshironi te hiqni aksesin nga te gjitha dokumentat?", function (result) {
			if (result) {
				$.ajax({
					url: '?efilemanager/leaveAllSharedDir',
					type: 'POST',
					dataType: 'json',
					success: function (response) {
						bootbox.alert(response.message);
						if (response.error == 0) {
							elementToRemove.html("");
							GUIComponents.loadedDirectoryTree.reload();
						}
					}
				});
			}
		});

	});

	$(".sh-rights-checkbox").livequery(function () {
		$(this).click(function () {
			var data = {};
			data.userId = $(this).attr('data-user');
			data.documentId = $(this).attr('data-document');
			data.right = $(this).attr('data-right');

			$.ajax({
				url: "?efilemanager/setSharedDocumentRight",
				type: "post",
				dataType: "json",
				data: data,
				success: function (response) {

				}
			});
		});
	});

	$(document).on('click', '.remove-access', function () {
		var elementToRemove = $(this).parent().closest('.row');
		var data = {};
		data.userId = $(this).attr('data-user');
		data.documentId = $(this).attr('data-document');

		bootbox.confirm("Deshironi te hiqni aksesin nga dokumenti?", function (result) {
			if (result) {
				$.ajax({
					url: "?efilemanager/removeSharedDirAccess",
					type: "post",
					dataType: "json",
					data: data,
					success: function (response) {
						elementToRemove.remove();
						bootbox.alert(response.message);
					}
				});
			}
		});
	});

	$(document).on('click', '#remove-all-access', function () {
		var elementToRemove = $('#shared-dirs-content');
		var data = {};

		bootbox.confirm("Deshironi te hiqni aksesin nga te gjithe dokumentat?", function (result) {
			if (result) {
				$.ajax({
					url: "?efilemanager/removeAllSharedDirAccess",
					type: "post",
					dataType: "json",
					data: data,
					success: function (response) {
						elementToRemove.html("");
						bootbox.alert(response.message);
					}
				});
			}
		});
	});

	$(document).on('click', '#list-all', function () {
		if (this.checked) {
			$('.sh-rights-checkbox-list').each(function () {
				if (!this.checked) {
					$(this).click();
				}
			});
		} else {
			$('.sh-rights-checkbox-list').each(function () {
				if (this.checked) {
					$(this).click();
				}
			});
		}

	});

	$(document).on('click', '#download-all', function () {
		if (this.checked) {
			$('.sh-rights-checkbox-download').each(function () {
				if (!this.checked) {
					$(this).click();
				}
			});
		} else {
			$('.sh-rights-checkbox-download').each(function () {
				if (this.checked) {
					$(this).click();
				}
			});
		}

	});

	$(document).on('click', '#upload-all', function () {
		if (this.checked) {
			$('.sh-rights-checkbox-upload').each(function () {
				if (!this.checked) {
					$(this).click();
				}
			});
		} else {
			$('.sh-rights-checkbox-upload').each(function () {
				if (this.checked) {
					$(this).click();
				}
			});
		}

	});

	$(document).on('click', '#delete-all', function () {
		if (this.checked) {
			$('.sh-rights-checkbox-delete').each(function () {
				if (!this.checked) {
					$(this).click();
				}
			});
		} else {
			$('.sh-rights-checkbox-delete').each(function () {
				if (this.checked) {
					$(this).click();
				}
			});
		}

	});

	//search
	var timeOutId;
	GUIComponents.search.button.keydown(function (event) {
		refreshResults(GUIComponents.search.input.val());
	});

	GUIComponents.search.button.click(function () {
		GUIComponents.search.button.keydown();
		GUIComponents.topButtons.hide();
		GUIComponents.directoryDetailsBtn.hide();
		GUIComponents.friendlyPath.html("<h5>Kerkimi per: '" + GUIComponents.search.input.val() + "'</h5>");
	});

	GUIComponents.search.input.keyup(function (e) {
		if (e.keyCode == 27) {
			GUIComponents.search.input.val('');
			setTimeout(function () {
				clickOnNode(getSelectedNode());
			}, 200);
			return;
		}

		if (GUIComponents.search.input.val().length > 2) {
			clearTimeout(timeOutId);
			timeOutId = setTimeout(function () {
				GUIComponents.search.button.keydown();
				GUIComponents.topButtons.hide();
				GUIComponents.directoryDetailsBtn.hide();
				GUIComponents.friendlyPath.html("<h5>Kerkimi per: '" + GUIComponents.search.input.val() + "'</h5>");
			}, 800);
		} else {
			clickOnNode(getSelectedNode());
		}

	});

	function refreshResults(str_input) {

		spinner(GUIComponents.documentTree.find('tbody'), '');
		$.ajax({
			type: "POST",
			url: "?efilemanager/search_data",
			data: { s: str_input, offset: 0 },
			success: function (response) {
				GUIComponents.documentTree.find('tbody').html("");
				GUIComponents.documentTree.data("ui-fancytree").getTree().reload(response.data);
				pagination = response.details;
				addPagination(
					GUIComponents.pagination,
					{
						type: 'search',
						term: str_input
					},
					"?efilemanager/search_data"
				);
				GUIComponents.directoryDetails.html("<b>Rezultatet e kerkimit: </b>" + response.details.results + " dokument(a)");
			}, dataType: "json"
		});
	}

	//filters
	var filteredForms = {};
	GUIComponents.filtersBuilder.on('afterUpdateRuleFilter.queryBuilder', function (event, rule) {
		if (filteredForms == null)
			filteredForms = {};	
		filteredForms[rule.filter.form] = 1;
	});

	GUIComponents.filtersBuilder.on('beforeDeleteRule.queryBuilder', function (event, rule) {
		if (rule.filter)
			delete filteredForms[rule.filter.form];
	});

	function getFilteredDocs(condition) {
		if (typeof condition == 'object')
			condition = JSON.stringify(condition);
		
		spinner(GUIComponents.documentTree.find('tbody'), '');
		$.ajax({
			type: "POST",
			url: "?efilemanager/filter_documents/",
			data: { cond: condition, filteredForms: JSON.stringify(filteredForms), offset: 0 },
			success: function (response) {
				GUIComponents.documentTree.find('tbody').html("");
				GUIComponents.documentTree.fancytree("getTree").reload(response.data);
				pagination = response.details;
				addPagination(
					GUIComponents.pagination,
					{
						type: 'filter-search',
						cond: condition,
						filteredForms: JSON.stringify(filteredForms)
					},
					"?efilemanager/filter_documents/"
				);
				GUIComponents.topButtons.hide();
				GUIComponents.directoryDetailsBtn.hide();
				GUIComponents.friendlyPath.html("<h5>Filtrim Dokumentash</h5>");
				GUIComponents.directoryDetails.html("<b>Rezultatet e kerkimit: </b>" + response.details.results + " dokument(a)");
			}, dataType: "json"
		});
	}

	function filterResults(getDocs, rules) {
		getDocs(rules);
	}

	function resetAddFiltersView() {
		$('#filter_id').val('0');
		$('#filter_name').val('');
		$('#filter_desc').val('');
	}

	function getAdvancedFilters() {
		advancedSqlFilters = "";
		var filters = [];
		GUIComponents.filtersBuilder.queryBuilder("destroy");
		$.ajax({
			url: "?efilemanager/get_form_fields",
			method: "post",
			data: {},
			success: function (response) {
				var data = JSON.parse(response);
				data.forEach(function (field) {
					var filter = {};
					filter.id = "form_" + field.id_form + "." + field.name;
					filter.label = field.document_category_name + " - " + field.label;
					filter.form = field.id_form;

					switch (field.type) {
						case "datetime":
							filter.type = 'date';
							filter.validation = {
								format: 'yyyy-mm-dd'
							};
							filter.plugin = 'datepicker';
							filter.plugin_config = {
								format: 'yyyy-mm-dd',
								todayBtn: 'linked',
								todayHighlight: true,
								autoclose: true
							};
							filter.operators = ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "is_null",
								"is_not_null", "between", "not_between"];
							filters.push(filter);
							break;
						case "checkbox":
							filter.type = "string";
							filter.input = "select";
							filter.values = [{ 0: field.extradata2 }, { 1: field.extradata1 }];
							filter.operators = ["equal", "not_equal"];
							filters.push(filter);
							break;
						case "combobox":
							filter.type = "string";
							filter.input = "select";
							filter.values = field.combo_values;
							filter.operators = ["equal", "not_equal", "is_null", "is_not_null", "is_empty", "is_not_empty"];
							filters.push(filter);
							break;
						case "number":
							var validate = {
								min: field.extradata1,
								max: field.extradata2
							}
							filter.type = "double";
							filter.input = "text";
							filter.validation = validate;
							filter.operators = ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "between", "not_between", "is_null", "is_not_null"];
							filters.push(filter);
							break;
						case "text":
							filter.type = "string";
							filter.input = "text";
							filter.operators = ["equal", "not_equal", "contains", "not_contains", "is_empty", "is_not_empty", "ends_with",
								"not_ends_with", "begins_with", "not_begins_with", "is_null", "is_not_null"];
							filters.push(filter);
							break;
						case "textarea":
							filter.type = "string";
							filter.input = "text";
							filter.operators = ["equal", "not_equal", "contains", "not_contains", "is_empty", "is_not_empty", "ends_with",
								"not_ends_with", "begins_with", "not_begins_with", "is_null", "is_not_null"];
							filters.push(filter);
							break;
						default: break;
					}

				});

				GUIComponents.filtersBuilder.queryBuilder({
					filters: filters,
					lang_code: 'en'
				});
			}
		});
	}

	getAdvancedFilters();

	function applyFilters() {
		var result = GUIComponents.filtersBuilder.queryBuilder('getSQL', false);
		var rules = GUIComponents.filtersBuilder.queryBuilder('getRules');

		if (result.sql != "")
			filterResults(getFilteredDocs, rules);
	}

	GUIComponents.filtersBtn.click(function () {
		resetAddFiltersView();
		GUIComponents.modals.filters.base.modal('show');
	});

	GUIComponents.modals.filters.buttons.clear.click(function () {
		GUIComponents.filtersBuilder.queryBuilder('reset');
		resetAddFiltersView();
		filteredForms = {}
	});

	GUIComponents.modals.filters.buttons.close.click(function () {
		resetAddFiltersView();
		GUIComponents.modals.filters.base.modal('hide');
	});

	GUIComponents.modals.filters.buttons.apply.click(function () {
		applyFilters();
	});

	GUIComponents.modals.filters.buttons.save.click(function () {
		var result_sql = GUIComponents.filtersBuilder.queryBuilder('getSQL', false);
		var result_json = GUIComponents.filtersBuilder.queryBuilder('getRules');
		var f_id = 0;
		if ($('#filter_id').val() != "" && $('#filter_id').val() != null)
			f_id = parseInt($('#filter_id').val());

		if ($('#filter_name').val() != "" && $('#filter_name').val() != null) {
			var data = {
				filter_id: f_id,
				filter_name: $('#filter_name').val(),
				description: $('#filter_desc').val(),
				json: JSON.stringify(result_json),
				datecreated: new Date(),
				type: "document",
				type_name: 'digital-archive',
				filtered_forms: filteredForms
			};
			var post_data = {};
			post_data.filter_data = data;

			if (result_sql.sql.length > 0) {
				$.ajax({
					url: "?filterTemplateCRUD/save",
					type: 'POST',
					data: post_data,
					dataType: "json",
					success: function (response) {
						bootbox.alert(response.message);
						filters_dt.ajax.reload();
					}
				});
			}
		}
		else
			bootbox.alert("Ju lutem specifikoni nje emer per kete filter!");
	});

	GUIComponents.modals.filters.buttons.template.click(function () {
		GUIComponents.modals.filters.grid.modal('show');
	});

	var filters_dt = $('#filters_grid').DataTable({
		columns: [
			{ "data": "filter_name" },
			{ "data": "description" },
			{ "data": "apply" },
			{ "data": "edit" },
			{ "data": "delete" }
		],
		deferLoading: 0,
		ajax: function (data, callback, settings) {
			$.ajax({
				url: "?filterTemplateCRUD/load",
				type: 'POST',
				contentType: "application/json; charset=UTF-8",
				dataType: "json",
				traditional: true,
				data: JSON.stringify({
					additionalData: {
						conditionData: {}
					},
					type: 'document',
					type_name: 'digital-archive'
				}),
				success: function (result) {
					callback(result);
				}
			});
		},
		columnDefs: [],
		iDisplayLength: 25,
		//createdRow: handleRowDelete ,
		//drawCallback: drawCallback
	});
	
	$(document).on('click', '.dt-apply-filter', function () {
		var row_data = filters_dt.row($(this).parents("tr")).data();
		filteredForms = JSON.parse(row_data.forms);
		filterResults(getFilteredDocs, row_data.json);
		GUIComponents.modals.filters.grid.modal('hide');
	});
	
	$(document).on('click', '.dt-delete-filter', function () {
		var row_data = filters_dt.row($(this).parents("tr")).data();
		if (isNaN(row_data.filter_id)) {
			return;
		}
		$.ajax({
			url: "?filterTemplateCRUD/delete/",
			method: "post",
			data: { filter_id: row_data.filter_id },
			dataType: 'json',
			success: function (response) {
				if (response.success == 1)
					filters_dt.ajax.reload();
				else
					bootbox.alert(success.message);
			}
		});
	});

	$(document).on('click', '.dt-edit-filter', function () {
		var row_data = filters_dt.row($(this).parents("tr")).data();
		filter_sql = row_data.sql;
		filter_json = row_data.json;
		if (filter_json.length > 0) {
			GUIComponents.filtersBuilder.queryBuilder('setRules', JSON.parse(filter_json));
		}

		$('#filter_id').val(row_data.filter_id);
		$('#filter_name').val(row_data.filter_name);
		$('#filter_desc').val(row_data.description);
		GUIComponents.modals.filters.base.modal('show');

	});

	//extra
	function addPagination(selector, feeder, url) {
		var data;

		if (feeder.type == 'search') {
			data = document_node;
			data.s = feeder.term;
		} else if (feeder.type == 'filter-search') {
			data = {};
			data.filteredForms = feeder.filteredForms;
			data.cond = feeder.cond;
		} else {
			data = document_node;
		}

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

	$(".rights-checkbox").livequery(function () {
		$(this).click(function () {
			var data = {};
			data.userID = $(this).attr('data-user');
			data.right = $(this).attr('data-right');
			var contextType = $(this).attr('data-context_type');
			var contextID = $(this).attr('data-context_id');
			data.context = { id: contextID, type: contextType };

			$.ajax({
				url: "?efilemanager/setUserRight",
				type: "post",
				dataType: "json",
				data: data,
				success: function (response) {
					//console.log(response);
				}
			});
		});
	});

	$(document).on('click', '.pathNode', function () {
		clickOnNode($(this).attr('data-id'));
	});

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
		GUIComponents.modals.addDocument.specifications.slimScroll({
			height: '400px',
			size: '8px',
			color: '#2980b9',
			alwaysVisible: true,
			railVisible: true
		});
		GUIComponents.modals.scan.specifications.slimScroll({
			height: '400px',
			size: '8px',
			color: '#2980b9',
			alwaysVisible: true,
			railVisible: true
		});
		GUIComponents.modals.addVersion.specifications.slimScroll({
			height: '400px',
			size: '8px',
			color: '#2980b9',
			alwaysVisible: true,
			railVisible: true
		});
		GUIComponents.modals.metadata.body.slimScroll({
			height: '400px',
			size: '8px',
			color: '#2980b9',
			alwaysVisible: true,
			railVisible: true
		});
		GUIComponents.modals.manageSharedDirs.body.slimScroll({
			height: '400px',
			size: '8px',
			color: '#2980b9',
			alwaysVisible: true,
			railVisible: true
		});
	});

	GUIComponents.modals.addDocument.base.on('hide.bs.modal', function () {
		var node = $('#tree').fancytree("getActiveNode").key;
		$('#tree').fancytree("getTree").getNodeByKey(node).li.click();
		$('#submit-document').html("");
		$('#drop-document-area').attr('class', 'col-md-12');
		$('#document-specifications-area').hide();
		$('#document-categories').html("");
		$('#document-categories-forms').html("");
		$('.fileuploader-action-remove').click();
	});

	GUIComponents.modals.addVersion.base.on('hide.bs.modal', function () {
		var node = $('#tree').fancytree("getActiveNode").key;
		$('#tree').fancytree("getTree").getNodeByKey(node).li.click();
		$('#submit-document-revision').html("");
		$('#drop-document-version-area').attr('class', 'col-md-12');
		$('#document-revision-specifications-area').hide();
		$('#document-revision-categories').html("");
		$('#document-revision-categories-forms').html("");
		$('.fileuploader-action-remove').click();
	});

	GUIComponents.modals.scan.base.on('hide.bs.modal', function () {
		$('#scan-document-categories').html("");
		$('#scan-document-categories-forms').html("");
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
		var type = $(this).data('type');
		var ext = $(this).data('ext');

		$('#view-document-modal').modal('show');
		if (ext == 'jpg' || ext == 'JPG' || ext == 'jpeg' || ext == 'JPEG' || ext == 'png' || ext == 'PNG')
			viewImage(document_id, type);
		else viewDoc(document_id, type);
	});

	function viewImage(id, type) {
		$('#view-document-modal-body').append(
			"<img class='img-responsive' src='?efilemanager/view_doc/" + id + "/" + type + "/'>"
		)
	}

	function viewDoc(id, type) {
		var url = window.location.hostname + '/?efilemanager/view_doc/' + id + '/' + type + '/';

		$('#view-document-modal-body').append(
			"<iframe src='http://docs.google.com/viewer?url=" + url + "&embedded=true'  style='position: absolute;width:100%; min-height: 600px;border: none;'></iframe>"
		)
	}

});

//exposed intentionally

//validation
var validationConfiguration = {
	ignore: ".upload_hidden_input",
	rules: {},
	invalidHandler: function (form, validator) {
		for (var i = 0; i < validator.errorList.length; i++) {
			if (!stopFocus) {
				//focus on hidden fields
				if (i == 0 && validator.errorList[i].element.type == 'hidden') {
					var hiddenInput = validator.errorList[i].element;
					//combobox
					if ($(hiddenInput).attr('data-type') == 'combobox') {
						var focusOn = $(hiddenInput).parent();
						$(focusOn).addClass("error");
						$(focusOn).attr('tabindex', '1');
						$(focusOn).focus();
						setTimeout(function () {
							$(focusOn).removeClass("error")
						}, 5000);
						stopFocus = 1;
						break;
					}
					//other
					//find sibling div
					var focusOn = $(hiddenInput).parent().children()[3];
					console.log(focusOn);
					$(focusOn).addClass("error");
					$(focusOn).attr('tabindex', '1');
					$(focusOn).focus();
					setTimeout(function () {
						$(focusOn).removeClass("error")
					}, 5000);
					stopFocus = 1;
					break;
				}
				//normal fields
				validator.errorList[0].element.focus();
				stopFocus = 1;
			}

		}
	},
	errorPlacement: function (error, element) {
		return false;
	}
};

//document preferences

function selectedCategory(id) {
	var select = document.getElementById(id);
	return {
		value: select.options[select.selectedIndex].value,
		text: select.options[select.selectedIndex].text
	}
}

function getDocumentCategories(selectors, options, callback) {
	var html = "<select class='categories-select' id='" + selectors.selectId + "' data-forms='" + selectors.formsId + "'>";
	if (options.hasOwnProperty('selectStatus')) {
		if (options.selectStatus == 'disabled') {
			html = "<select class='categories-select' id='" + selectors.selectId + "' data-forms='" + selectors.formsId + "' disabled>";
		}
	}
	var url = "?configureEfilemanagerCRUD/getDocumentCategories";
	if (options.hasOwnProperty('documentId')) {
		url = "?configureEfilemanagerCRUD/getDocumentCategories/" + options.documentId;
	}
	$.getJSON(url, function (data, status) {
		data.forEach(function (item) {
			html += "<option value='" + item.id + "'>" + item.name + "</option>";
		});
		html += "</select>";

		selectors.documentCategories.html(html);
		$('.categories-select').select2();

		//forms load callback
		callback(selectedCategory(selectors.selectId).value);
	});
}

function spinner(selector, text = '', size = 'fa-5x', style = 'margin: 20px; color:#2980b9') {
	selector.html('<center><i class="fa fa-spin fa-spinner ' + size + '" style="' + style + '" aria-hidden="true"></i>' + text + '</center>');
}

function renderFilePreferencesView(selectors, options) {
	//get document categories
	getDocumentCategories(selectors, options, function (selected) {
		//load forms
		var url = "?configureEfilemanagerCRUD/generateFormsForDocumentCategory/" + selected;
		if (options.hasOwnProperty('documentId')) {
			url = "?configureEfilemanagerCRUD/generateFormsForDocumentCategory/" + selected + "/" + options.documentId;
			if (options.hasOwnProperty('version')) {
				url = "?configureEfilemanagerCRUD/generateFormsForDocumentCategory/" + selected + "/" + options.versionId + "/true";
			}
		}

		spinner(selectors.forms, '');
		$.get(url, function (data, status) {
			selectors.forms.html("");
			selectors.forms.append(data);

			//get rules
			$.getJSON("?configureEfilemanagerCRUD/getRules/" + selected, function (rules) {
				var rulesObj = {};
				JSON.parse(JSON.stringify(rules)).forEach(function (item) {
					var arr = item.split(':');
					//to be replaced
					rulesObj[arr[0]] = { required: true };

				});
				validationConfiguration.rules = rulesObj;

				$('.formHtml').each(function () {
					$(this).validate(validationConfiguration);
				});
			});

		});
	});
}

$(document).on('change', '.categories-select', function () {
	var formsId = $(this).attr('data-forms');
	var selected = selectedCategory(this.id).value;
	spinner($(formsId), '');
	$.get("?configureEfilemanagerCRUD/generateFormsForDocumentCategory/" + selected, function (data, status) {
		$(formsId).html("");
		$(formsId).append(data);

		//get rules
		$.getJSON("?configureEfilemanagerCRUD/getRules/" + selected, function (rules) {
			var rulesObj = {};
			JSON.parse(JSON.stringify(rules)).forEach(function (item) {
				var arr = item.split(':');
				//to be replaced
				rulesObj[arr[0]] = { required: true };

			});
			validationConfiguration.rules = rulesObj;

			$('.formHtml').each(function () {
				$(this).validate(validationConfiguration);
			});
		});
	});
});

function getFormsFilledData(selector) {
	return selector.serialize();
}

//bad bad implementation and pattern, but no time so ..., called from upload.js
//click upload button
var uploadMode = 'once'; //upload once and close modal
function startUpload(mode) {
	uploadMode = mode;
	document.getElementsByClassName('fileuploader-action-start')[0].click();
}

function buildDecryptModalBody(xmlHtmlObj, mime, name) {
	$('#decrypt_modal').modal('show');
	$('#decrypt_modal_title').text('Shkarko Dokument');
	$('#decrypt_modal_body').html(
		$("<a>")
			.attr('href', window.URL.createObjectURL(new Blob([xmlHtmlObj.response], { type: mime })))
			.attr('download', name.replace('.kxencrypted', ''))
			.addClass('btn btn-default btn-sm')
			.html('<i class="fa fa-download" aria-hidden="true"></i> Shkarko')
			.on('click', function () {
				$('#decrypt_modal').modal('hide');
			})
	);
}

var downloadDecryptedFile = function (target, key, type, name) {
	bootbox.prompt({
		title: "Vendosni Fjalekalimin!",
		inputType: 'password',
		callback: function (result) {
			if (result) {
				$('#decrypt_modal').modal('show');
				spinner($('#decrypt_modal_body'));

				$.get('?efilemanager/download_doc/' + key + '/' + type + '/', function (content) {
					var decrypted = CryptoJS.AES.decrypt(content, result)
						.toString(CryptoJS.enc.Latin1);

					if (!/^data:/.test(decrypted)) {
						$('#decrypt_modal').modal('hide');
						bootbox.alert("Fjalekalim i Gabuar");
						return;
					}

					var req = new XMLHttpRequest;
					req.open('GET', decrypted);
					req.responseType = 'arraybuffer';
					req.onload = function fileLoaded(e) {
						var mime = this.getResponseHeader('content-type');
						target.innerHTML = '<span class="glyphicon glyphicon-download"></span> <span class="text"></span>';
						target.onclick = function () {
							buildDecryptModalBody(this, mime, name);
						}
						buildDecryptModalBody(this, mime, name);
					};
					req.send();
				
				});
			}
		}
	});
}

//filters shadow functions - added because dataTable onclick
function applyFilter(target) { }

function editFilter(target) { }

function deleteFilter(target) { }

function countfilters(id) { }

