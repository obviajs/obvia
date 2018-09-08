$.fn.mydg = function(options) 
{  

	var fnclicked = function(rowindex,colindex, data,col,rowData,tdobject,trobject){};
	var fnover = function(rowindex,colindex, data,col,rowData,tdobject,trobject){};
	var fnout = function(rowindex,colindex, data,col,rowData,tdobject,trobject){};
	var styleit = function(obj,data,i,j){};
	var rowstyle = function(trobject,row,i)
					{
						if(i % 2 == 0)
							trobject.addClass('evenrow');
						else
							trobject.addClass('oddrow');
					};
	
    var defaults = 
	{
		_id:"mydg1",
		_cellpadding:0,
		_cellspacing:0,
		_width:'400px',
		_height:'400px',
		_recordsPerPage: 10,
		_overclass:'rowover',
		_selectedclass:'rowselected',	
		_rowstylefn:rowstyle,	
		_addrecord:true,	
		_deleterecord:true,	
		_additional:{},
		_controller:"http://xlloto/?testcontroller/",	
		columns: [{name:"Kolona1",datafield:"variable_id",sortable:true,sortdir:"asc",hidden:false,click:fnclicked,over:fnover,stylefn:styleit,editable:true,domain:["Administrator","Financier","Informaticien"]},
				  {name:"Kolona2",datafield:"varname",click:fnclicked,over:fnover,editable:true,required:true,restrict:"sint"},
				  {name:"Kolona3",datafield:"varvalue"}]
	};
  
	var options = $.extend(defaults, options);
    
							
	var _totalRecords = 0;		 
	var _currentPage = 0;	
	var _totalPages = 0;
	var _recordsPerPage = options._recordsPerPage;
	
	var _selectedItem = null;
	var _selectedIndex = -1;
	
	
	var testvalid = function(type,value)
	{
		var validator = 
		{
			decimal:{exp:'^\\d*[0-9](\\.\\d*[0-9])?$'},
			email:{exp:"^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$"},
			ipaddress:{exp:"^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$"},
			date:{exp:'^\\d{4}-(0[0-9]|1[0,1,2])-([0,1,2][0-9]|3[0,1])$'},
			time:{exp:"^([0-1][0-9]|[2][0-3])(:([0-5][0-9])){1,2}$"},
			url:{exp:"^(http[s]?://|ftp://)?(www\.)?[a-zA-Z0-9-\.]+\.(com|org|net|mil|edu|ca|co.uk|com.au|gov)$"},
			uint:{exp:'^[0-9]+$'},
			sint:{exp:'^[-]?[0-9]+[\.]?[0-9]+$'}
		}; 
		//console.log(validator[type].exp);
		if(validator[type] == undefined) return true;
		var reg = new RegExp(validator[type].exp,"i");
	    return (reg.test(value));
	}
	
	var isNonblank = function(s) 
	{
		var isNonblank_re    = /\S/;
	   return ((s).search (isNonblank_re) != -1);
	}

	var fail = function(msg)
	{
		alert(msg);
	}
	var me = this;
	function success(data)
	{
		var hidden_cols = 0;
		data = JSON.decode(data);
		me._totalRecords = data.total;
		_totalRecords = data.total;
		me._totalPages = Math.ceil(me._totalRecords / options._recordsPerPage);
		var table = $("<table class='ui-widget ui-widget-content ui-corner-all mydg1 "+options._id+"' width='"+options._width+"' height='"+options._height+"' cellpadding='"+options._cellpadding+"' cellspacing='"+options._cellspacing+"'></table>");
		
		var tr = $("<tr class='ui-widget-header' ></tr>");
		for(var i=0;i<options.columns.length;i++)
		{
			if(options.columns[i].hidden) {hidden_cols++;continue;};
			var td = $("<td class='hdr'></td>");
			tr.append(td);
			if(options.columns[i].sortable)
			{
				td.removeClass("asc");
				td.removeClass("desc");
				if(options.columns[i].sortdir != undefined)
					td.addClass((options.columns[i].sortdir=="asc"?"asc":"desc"));
				td.bind('click',
				 (function(index, object) { // a closure is created
					return function () {
					  sortcolumn(index,object);
					}
				  })(i,td));
			}
			td.html("&nbsp;&nbsp;"+options.columns[i].name);
			
		}
		table.append(tr);
		
		for(var i=0;(i<data.collection.length)&& (row = data.collection[i]);i++)
		{
			tr = $("<tr></tr>");
		
			for(var j=0;(j<options.columns.length)&& (column = options.columns[j]);j++)
			{
				if(column.hidden) continue;
			
				td = $("<td></td>");
				tr.append(td);
				
				td.bind('click',
				(function(rowindex,colindex, data,col,rowData,tdobject,trobject) { // a closure is created
					return function () {
					  _selectedItem = rowData;
					  _selectedIndex = rowindex;
					  $('.'+options._selectedclass).removeClass(options._selectedclass);
					  trobject.addClass(options._selectedclass);		
						if(col.click != undefined)
						{								
							col.click(rowindex,colindex, data,col,rowData,tdobject,trobject);
						}
					}
				})(i,j,row[column.datafield],column,row,td,tr));
				
				td.bind('mouseover',	
				(function(rowindex,colindex, data,col,rowData,tdobject,trobject) { // a closure is created
					return function () {
						trobject.addClass(options._overclass);
						if(column.over != undefined)
						{
							col.over(rowindex,colindex, data,col,rowData,tdobject,trobject);
						}
					}
				})(i,j,row[column.datafield],column,row,td,tr));

				td.bind('mouseout',	
				(function(rowindex,colindex, data,col,rowData,tdobject,trobject) { // a closure is created
					return function () {
						trobject.removeClass(options._overclass);
						if(column.out != undefined)
						{
							col.out(rowindex,colindex, data,col,rowData,tdobject,trobject);
						}
					}
				})(i,j,row[column.datafield],column,row,td,tr));				
							
				//cell edit mode
				if(column.editable != undefined && column.editable)
				{
					td.bind('dblclick', 
					(function(rowindex,colindex, data,col,rowData,tdobject) { // a closure is created
							return function () {
							  _selectedItem = rowData;
							  _selectedIndex = rowindex;
							  editcell(rowindex,colindex, data,col,rowData,tdobject);
							}
						})(i,j,row[column.datafield],column,row,td));
				}	
				//call a styling function if its defined
				if(column.stylefn != undefined)
					column.stylefn(td,row[column.datafield],i,j);
					
				if(column.domain != undefined && (typeof column.domain == 'object') )
					td.html(setLabel(column.domain,row[column.datafield]));
				else
					td.html(row[column.datafield]);			
				
			}
			if(options._rowstylefn != undefined)
					options._rowstylefn(tr,row,i);
			table.append(tr);
		}
		
		//if collection length is less than records per page we should generate the difference.		
		var delta = _recordsPerPage - data.collection.length;
		for(var i=0;i<delta;i++)
		{
			tr = $("<tr></tr>");		
			for(var j=0;(j<options.columns.length)&& (column = options.columns[j]);j++)
			{
				if(column.hidden) continue;
				td = $("<td>&nbsp;</td>");
				tr.append(td);
			}
			table.append(tr);
		}		
		
		//generate footer with pagination below		
		var pg = $("<tr></tr>");
		pg.append($("<td width='16px' class='first'>&nbsp;</td>").bind('click',function(){moveFirst()}));
		pg.append($("<td width='16px' class='previous'>&nbsp;</td>").bind('click',function(){movePrevious()}));		
		
		for(var i=0;i<me._totalPages;i++)
		{
			var pnum = (i==_currentPage?"<b>"+(i+1)+"</b>":(i+1));
			pg.append($("<td class='page'>"+pnum+"</td>").bind('click',
			(function(index) { // a closure is created
				return function () {
				  gotopage(index);
				}
			})(i)		
			));
		}
		
		pg.append($("<td width='16px' class='next'>&nbsp;</td>").bind('click',function(){moveNext()}));
		pg.append($("<td width='16px' class='last'>&nbsp;</td>").bind('click',function(){moveLast()}));
		
		var nrlnk = options._addrecord?"<td id='newrecord"+me.attr('id')+"' style='cursor:hand;cursor:pointer'><button class='ui-button ui-widget ui-corner-all ui-button-text-only'>New!</button></td>":"";	
		var delrlnk = options._deleterecord?"<td id='delrecord"+me.attr('id')+"' style='cursor:hand;cursor:pointer'><button class='ui-button ui-widget ui-corner-all ui-button-text-only'>Delete!</button></td>":"";	
		
		var footer = $("<tr>" +
						"<td colspan='"+(options.columns.length - hidden_cols)+"'>"+
							"<table >"+
								"<tr>"+nrlnk+delrlnk+								
								"<td align='right'>Tot:"+
								"</td>"+
								"<td>"+me._totalRecords+
								"</td>"+		
								"<td>"+
								"<table id='paginator'>"+
								"</table>"+
								"</td>"+		
								"</tr>"+
							"</table"+
						"</td>"+
					 "</tr>"); 	
		table.append(footer);
		table.find("#paginator").append(pg);
		me.children().each(function(){$(this).remove()});
		//me.html("");		
		me.append(table);
		
		if(options._addrecord)
		{
			$('#newrecorddialog'+me.attr('id')).remove();
			$("<div style='display:none;' title='Rekord i Ri' id='newrecorddialog"+me.attr('id')+"'></div>").appendTo("body");
			var strfld = '<form><fieldset style=" padding:0; border:0; margin-top:25px; ">';
			
			for(var j=0;(j<options.columns.length)&& (col = options.columns[j]);j++)
			{
				if(col.hidden || !col.editable) continue;
				strfld += '<label style="display:block" for="'+col.datafield+'">'+col.name+'</label>';
				
				if(col.domain != undefined && (typeof col.domain == 'object') )
				{
					strfld +="<select id='"+col.datafield+"' name='"+col.datafield+"' class='text ui-widget-content ui-corner-all'>";
					for(var i=0;i<col.domain.length;i++)
					{
						strfld +="<option value='"+col.domain[i].value+"'>"+col.domain[i].label+"</option>";
					}
					strfld +="</select>";
				}else
				{
					strfld +="<input type='text' id='"+col.datafield+"' name='"+col.datafield+"' style='margin-bottom:12px; width:95%; padding: .4em;display:block' class='text ui-widget-content ui-corner-all' />";			
				}
			}
				strfld += '</fieldset></form><label style="display:block" id="saveresp"/>';
				
				
			$('#newrecorddialog'+me.attr('id')).append(strfld);
			
			var id = '#newrecorddialog'+me.attr('id');
			$(id).dialog(
			{ 
				autoOpen: false, 
				width: 350,
				resizable:false,
				//show:'slide',
				//hide: {effect: "slide", duration: 1000},
				modal: true,buttons: {
					"Ruaje": function() {
						var newitem = new Object();
						for(var j=0;(j<options.columns.length)&& (col = options.columns[j]);j++)
						{
							if(!col.editable || col.hidden) continue;
							var fldid = '#'+col.datafield;
							var v = $(fldid).val();
							if(col.required)
								if(isNonblank(v))
								{
									if(testvalid(col.restrict,v))
									{
										$(fldid).removeClass("ui-state-error");
									}
									else
									{
										//console.log("not valid");
										$(fldid).addClass("ui-state-error");
										return;
									}
								}
								else
								{	
									//console.log("blank");
									$(fldid).addClass("ui-state-error");
									return;
								}
							
							newitem[col.datafield] = $(fldid).val();
						}
						
						var data = new Object();
						data.additional = options._additional;
						data.currentRecord = _currentPage * _recordsPerPage;
						data.recordsPerPage = _recordsPerPage;
						data.sort = [];
						for(var j=0;j<options.columns.length;j++)
						{
							if(options.columns[j].sortdir == undefined)
								continue;
							var s = new Object();
							s.sortdir = options.columns[j].sortdir;
							s.sortfield = options.columns[j].datafield;
							data.sort.push(s);
						}
						data.selectedItem = newitem;
	
						//console.log(_currentPage+" "+_recordsPerPage);
						simpleAjax(options._controller + "save",data,
						function(response)
						{
							$('#saveresp').html(response.msg);
							success(response);
							$(id).dialog("close");
						});							
					},
					"Anulloje": function() {
						$( this ).dialog("close");
					}
				}
			});
		
			

		}
		if($('#newrecord'+me.attr('id')).length != 0)
			$('#newrecord'+me.attr('id')).click(
			function()
			{
				for(var j=0;(j<options.columns.length)&& (col = options.columns[j]);j++)
				{
					if(col.restrict == "datetime")
					{
						var id = '#'+col.datafield;
						var now = new Date();
						$(id).val(formatDate(now));
					}
				}
				var id = '#newrecorddialog'+me.attr('id');				
				$(id).dialog('open');
			});
		
		if($('#delrecord'+me.attr('id')).length != 0)
			$('#delrecord'+me.attr('id')).click(
			function()
			{
				if(_selectedIndex != -1)
				{
					var a = confirm('A jeni i sigurte qe doni te kryeni kete veprim?');
					if (a)
					{
						var data = new Object();
						data.additional = options._additional;
						data.currentRecord = _currentPage * _recordsPerPage;
						data.recordsPerPage = _recordsPerPage;
						data.sort = [];
						for(var j=0;j<options.columns.length;j++)
						{
							if(options.columns[j].sortdir == undefined)
								continue;
							var s = new Object();
							s.sortdir = options.columns[j].sortdir;
							s.sortfield = options.columns[j].datafield;
							data.sort.push(s);
						}
						data.selectedItem = _selectedItem;
	
						//console.log(_currentPage+" "+_recordsPerPage);
						simpleAjax(options._controller + "delete",data,
						function(response)
						{
							alert("Rekordi u fshi me sukses.");
							success(response);
						});		
					}
				}
				else
					alert('Zgjidhni nje rekord me pare');
			});
			
	}
	
	var sortcolumn = function(i, self)
	{
		cl = options.columns[i].sortdir == "asc"?"desc":"asc";
		options.columns[i].sortdir = cl;		
		getData(); 
	}
	
	var editcell = function(rowindex,colindex, data,col,rowData,tdobject)
	{
		tdobject.html("");
		var editobj;
		if(col.domain != undefined && (typeof col.domain == 'object') )
		{
			editobj = $("<select id='newvalue'></select>");
			for(var i=0;i<col.domain.length;i++)
			{
				editobj.append("<option value='"+col.domain[i].value+"'>"+col.domain[i].label+"</option>");
			}
		}else
		{
			editobj = $("<input type='text' id='newvalue'/>");		
			if(col.restrict == "datetime")
			{
				//editobj.datetimepicker();
			}	
			editobj.val(rowData[col.datafield]);	
		}
		editobj.css('border','none');
		tdobject.append(editobj);
		editobj.focus();
		editobj.bind('keydown',
			function(event)
			{
				if (event.keyCode == '13') 
				{
					event.preventDefault();
					(function(_rowindex,_colindex, _data,_col,_rowData,_tdobject,_editobj) { // a closure is created								
					      return function () {
							save(_rowindex,_colindex, _data,_col,_rowData,_tdobject,_editobj);
							}();
						})(rowindex,colindex, data,col,rowData,tdobject,editobj);
				}else
				if(event.keyCode == '27')
				{
					editobj.remove();
					if(col.domain != undefined && (typeof col.domain == 'object') )
						tdobject.html(setLabel(col.domain,rowData[col.datafield]));
					else
						tdobject.html(rowData[col.datafield]);
				}
			}
		);	
		editobj.bind('blur',
			function()
			{
				editobj.remove();
				if(col.domain != undefined && (typeof col.domain == 'object') )
					tdobject.html(setLabel(col.domain,rowData[col.datafield]));
				else
					tdobject.html(rowData[col.datafield]);
			}
		);
	}
	var setLabel = function(dm,value)
	{
		for(var i=0;i<dm.length;i++)
			if(dm[i].value == value)
				return dm[i].label;
	}
	
	var save = function(rowindex,colindex, data,col,rowData,tdobject,editobj)
	{		
		var v = editobj.val();
		//console.log(col.required+" "+col.restrict);		
		if(col.required)
			if(isNonblank(v))
				if(testvalid(col.restrict,v))
					editobj.removeClass("ui-state-error");
				else
				{
					//console.log("not valid");
					editobj.addClass("ui-state-error");
					return;
				}
			else
			{	
				//console.log("blank");
				editobj.addClass("ui-state-error");
				return;
			}
		rowData[col.datafield] = v;
		_selectedItem = rowData;
		_selectedIndex = rowindex;
		editobj.remove();
		
		if(col.domain != undefined && (typeof col.domain == 'object') )
			tdobject.html(setLabel(col.domain,rowData[col.datafield]));
		else
			tdobject.html(v);
		
		var data = new Object();
		data.additional = options._additional;
		data.currentRecord = _currentPage * _recordsPerPage;
		data.recordsPerPage = _recordsPerPage;
		data.sort = [];
		for(var j=0;j<options.columns.length;j++)
		{
			if(options.columns[j].sortdir == undefined)
				continue;
			var s = new Object();
			s.sortdir = options.columns[j].sortdir;
			s.sortfield = options.columns[j].datafield;
			data.sort.push(s);
		}
		data.selectedItem = _selectedItem;
		//console.log(_currentPage+" "+_recordsPerPage);		
		simpleAjax(options._controller + "save",data,
						function(response)
						{
							success(response);
						}		,fail);
	}
	
	$.fn.selectedItem = function()
	{
		return _selectedItem;
	}
	
	$.fn.selectedIndex = function()
	{
		return _selectedIndex;
	}
	
	var getData = function()
	{
		var data = new Object();
		data.additional = options._additional;
		data.currentRecord = _currentPage * _recordsPerPage;
		data.recordsPerPage = _recordsPerPage;
		data.sort = [];
		for(var j=0;j<options.columns.length;j++)
		{
			if(options.columns[j].sortdir == undefined)
				continue;
			var s = new Object();
			s.sortdir = options.columns[j].sortdir;
			s.sortfield = options.columns[j].datafield;
			data.sort.push(s);
		}
		//console.log(_currentPage+" "+_recordsPerPage);
		simpleAjax(options._controller + "load",data,function(response)
						{
							success(response);
						},fail);
	}
	
	var moveNext = function()
	{	
		_totalPages = Math.ceil(_totalRecords / _recordsPerPage);
		if((_currentPage+1) != _totalPages)
		{
			++_currentPage;
			getData();
		}			
	}
		
	var movePrevious = function()
	{
		_totalPages = Math.ceil(_totalRecords / _recordsPerPage);
		if((_currentPage) != 0)
		{
			--_currentPage;
			getData();
		}
	}
		
	var moveLast = function()
	{
		_totalPages = Math.ceil(_totalRecords / _recordsPerPage);
		if((_currentPage+1) != _totalPages)
		{
			_currentPage = _totalPages - 1;
			getData();
		}
	}
	
	var moveFirst = function()
	{
		_totalPages = Math.ceil(_totalRecords / _recordsPerPage);		
		if((_currentPage) != 0)
		{
			_currentPage = 0;
			getData();
		}
	}
	
	var gotopage = function(pg)
	{
		if(_currentPage != pg)
		{
			_currentPage = pg;
			getData();
		}
	}
	
	getData();
	return this;
}