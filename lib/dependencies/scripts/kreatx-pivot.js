/**
 * @author
 * Mateo Jovani
 * mateo.jovani@kreatx.al
 *
 * @licence
 * Copyright Kreatx 2017
 */

//TODO dont let multiple field names

var Pivot = (function(svg2Image) {
    var settings;
    var container;
    var fragment;
    var gui = {};
    var fields = [];
    var hiddenFields = [];
    var fieldPositioning = {};
    var excelURL = '';
    var openedFilterBoxes = [];
    var openedSettingsBox = 0;
    var currentChart;
    var savedChangeState = true;
    
    //language - Albanian default
    var language = {
        'fields': 'Fushat',
        'cells': 'Qelizat',
        'actions': {
            'ok': 'Ok',
            'reset': 'Rivendos',
            'cancel': 'Anullo',
            'downloadImage': 'Shkarko Imazh',
            'saveDashlet': 'Ruaj si Dashlet',
            'generateGraph': 'Gjenero Grafik',
            'downloadExcel': 'Shkarko Excel',
            'applyPivot': {
                'main': 'Apliko Pivot',
                'custom': 'Grida pa excel'
            },
            'save': {
                'context': 'Ruaj',
                'same': 'Mbishkruaj',
                'new': 'I ri',
                'close': 'Mbyll'
            }
        },
        'filters': {
            'context': 'Filtrat',
            'order': 'Renditja',
            'group': 'Grupo daten sipas',
            'aggregation': 'Lloji i agregimit'
        },
        'settings': {
            'number': {
                'context': 'Formatimi i numrave',
                'shorten': 'Shkurto numrat e gjate'
            },
            'save': {
                'context': 'Ruaj Konfigurimin'
            }
        },
        'dashlet': {
            'context': 'Ruaj Dashlet',
            'name': 'Emer Dashlet',
            'description': 'Pershkrimi',
            'usersWithAccess': 'Perdoruesit me akses',
            'dashboard': 'Dashboard',
            'size': {
                'context': 'Madhesia',
                'small': 'E vogel',
                'medium': 'Mesatare',
                'big': 'E madhe',
                'full': 'E plote'
            },
        },
        'graph': {
            'columns': 'Me Kolona',
            'line': 'Me vije',
            'pie': 'Pie',
            'heat': 'Heat Map',
            'web': 'Rrjete',
            'map': 'Harte',
            'sankey': 'Sankey'
        },
        'responses': {
            'successfulReport': 'Raporti u shkarkua me sukses!',
            'nameDashboard': 'Vendosni nje emer per dashboard!'
        }
    };

    function setLanguage(lang) {
        //use dafault language object
        if (!lang)
            return this;
        language = lang;

        return this;
    }

    //TODO expand operator list
    var operatorMappings = {
        '=': 'equal',
        '>': 'greater',
        '<': 'less'
    }

    //Bypass elements for document click event
    var bypassElements = [
        'generate-chart',
        'generate-dashlet',
        'download-excel',
        'back',
        'fa fa-caret-square-o-down',
        'fa fa-cog',
        'filterBoxContent',
        'dashlet-box',
        'dashletContent',
        'settings-box',
        'number-format',
        'box-content',
        'BUTTON',
        'SELECT',
        'INPUT',
        'OPTION',
        'TEXTAREA'
    ];

    function render(config, selector) {

        //close window event
        if(config.server.misc.id_pivot == '-1')
            savedChangeState = false;
        window.onbeforeunload = function (e) {
            if(!savedChangeState)
            return false;
        };

        container = selector;
        settings = config;
        //Static GUI
        buildGUIContainer();

        //fields
        for (var i=0; i<config.fields.length; i++) {
            //build field
            var field = {};
            field.visible = true;
            field.dataField = config.fields[i].name;
            field.headerText = config.fields[i].display;
            if(config.fields[i].hasOwnProperty('type'))
                field.type = config.fields[i].type;
            if(config.fields[i].hasOwnProperty('date_grouping'))
                field.date_grouping = config.fields[i].date_grouping;
            else field.date_grouping = '';
            if(config.fields[i].hasOwnProperty('order'))
                field.sort = config.fields[i].order;
            else field.sort = 'DESC';
            if(config.fields[i].hasOwnProperty('aggregate'))
                field.aggregate = config.fields[i].aggregate;

            if(!config.fields[i].visible){
                hiddenFields.push(field);
                continue;
            }

            fields.push(field);

            //iterate rows, columns and data for predefined structure
            var appendTo = null;
            var configField = JSON.parse(JSON.stringify(config.fields[i]));
            for(var k=0;k<config.rows.length; k++){
                if(config.rows[k] == config.fields[i].name){
                    appendTo = 'rows';
                }
            }
            for(k=0;k<config.columns.length; k++){
                if(config.columns[k] == config.fields[i].name){
                    appendTo = 'columns';
                }
            }
            for(k=0;k<config.data.length; k++){
                if(config.data[k] == config.fields[i].name){
                    if(!config.fields[i].hasOwnProperty('aggregate'))
                       configField.aggregate = 'SUM';
                    appendTo = 'data';
                }
            }

            createDomField(configField, appendTo);
        }

        //init drag&drop using dragula.js
        dragula([gui.fieldsHolderBar, gui.dataHolder, gui.rowsHolder, gui.columns], {
                moves: function (el, source, handle, sibling) {
                    return canFieldMove(el, source, handle, sibling);
                }
            })
            .on('drop', function (el, parent, source) {
                track(el, parent, source);
            });
        
        return this;
    }

    function initFragment() {
        //document fragment
        fragment = document.createDocumentFragment();
    }

    function fillDashBoardSelect(dashboardSelect){
        $.when(
            getDashboards()
        ).done(function(dashboards){
            dashboardSelect.innerHTML = "";
            for(var i=0; i<dashboards.length; i++){
                dashboardSelect.innerHTML += "<option value='"+dashboards[i].id+"'>"+dashboards[i].name+"</option>";
            }
        });
    }

    function attachEvents() {
        document.addEventListener('click', function (e) {
            if (bypassElements.indexOf(e.target.id) == -1 && bypassElements.indexOf(e.target.className) == -1 && bypassElements.indexOf(e.target.tagName) == -1) {
                closeSettingsBox();
                closeDashletBox();
                closeFiltersBox();
                closeChartOptionsBox();
            }
        });
    }

    function buildGUIContainer() {
        initFragment();
        //gen GUI
        gui.fieldsHolderBar = document.createElement("div");
        gui.icon = document.createElement("div");
        gui.mainHolder = document.createElement("div");
        gui.cells = document.createElement("div");
        gui.down = document.createElement("div");
        gui.rowsHolder = document.createElement("div");
        gui.columnsHolder = document.createElement("div");
        gui.columns = document.createElement("div");
        gui.dataHolder =  document.createElement("div");
        gui.renderArea = document.createElement("div");
        gui.filterBox = document.createElement("div");
        gui.settingsBox = document.createElement("div");
        gui.chartOptionsBox = document.createElement("div");
        gui.dashletBox = document.createElement("div");

        //events
        attachEvents();
   
        //fields bar
        var div = document.createElement("div");
        div.innerHTML = language['fields'];
        div.classList.add('label');
        gui.icon.appendChild(div);

        //settings
        gui.settingsBox.classList.add('settings-box');
        gui.settingsBox.style.display = 'none';

        div = document.createElement('div');
        div.innerHTML = '<b>' + language['settings']['number']['context'] + '</b>';
        div.className = 'col-md-12 panel panel-default';
        gui.settingsBox.appendChild(div);
        div = document.createElement('div');
        div.className = 'box-content col-md-12';
        gui.settingsBox.appendChild(div);
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = 'number-format';
        if(settings.hasOwnProperty('settings')){
            checkbox.checked = settings.settings.numberFormat;
        }
        var label = document.createElement('label');
        label.appendChild(document.createTextNode(language['settings']['number']['shorten']));
        div.appendChild(checkbox);
        div.appendChild(label);

        div = document.createElement('div');
        div.innerHTML = '<b>' + language['settings']['save']['context'] + '</b>';
        div.className = 'box-content col-md-12 panel panel-default';
        gui.settingsBox.appendChild(div);
        div = document.createElement('div');
        div.className = 'box-content col-md-12';
        var buttonGr = document.createElement('div');
        buttonGr.className = 'box-content btn-group';
        var btn = document.createElement('button');
        btn.className = 'btn btn-xs btn-danger';
        btn.style.marginRight = '5px';
        btn.innerHTML = language['actions']['save']['same'];
        if(settings.server.misc.id_pivot == '-1'){
            btn.setAttribute('disabled', true);
        }
        btn.addEventListener('click', function(){
            //ajax
            saveConfig();
            closeSettingsBox();
            openedSettingsBox = 0;
        });
        buttonGr.appendChild(btn);
        btn = document.createElement('button');
        btn.style.marginRight = '5px';
        btn.className = 'btn btn-xs btn-danger';
        btn.innerHTML = language['actions']['save']['new'];
        btn.addEventListener('click', function(){
            var _self = this;
            _self.setAttribute('disabled', true);
            //give a name
            input = document.createElement('input');
            input.setAttribute('placeholder', 'Emri i Pivot');
            gui.settingsBox.appendChild(input);
            var textNode = document.createTextNode('Direktoria');
            gui.settingsBox.appendChild(textNode);
            var selectGroup = document.createElement('select');
            selectGroup.id = 'pivot-group';
            $.when(
                getPivotGroups()
            ).done(function(groups){
                for(var i=0; i<groups.length; i++){
                    selectGroup.innerHTML += "<option value='"+groups[i].id+"'>"+groups[i].name+"</option>";
                }
            });
            gui.settingsBox.appendChild(selectGroup);
            gui.settingsBox.appendChild(document.createElement('br'));
            btn = document.createElement('button');
            btn.className = 'btn btn-xs btn-danger';
            btn.innerHTML = language['actions']['save']['context'];
            btn.addEventListener('click', function(){
                //ajax
                _self.removeAttribute('disabled');
                this.remove();
                input.remove();
                textNode.remove();
                selectGroup.remove();
                saveConfig('new', input.value, selectGroup.options[selectGroup.selectedIndex].value);
                // closeSettingsBox();
                openedSettingsBox = 0;
            });
            gui.settingsBox.appendChild(btn);
        });
        buttonGr.appendChild(btn);
        btn = document.createElement('button');
        btn.className = 'btn btn-xs btn-danger';
        btn.innerHTML = language['actions']['save']['close'];
        btn.addEventListener('click', function(){
            if(openedSettingsBox == 0){
                openSettingsBox(e);
                openedSettingsBox = 1;
            }else{
                closeSettingsBox();
                openedSettingsBox = 0;
            }
        });
        buttonGr.appendChild(btn);
        div.appendChild(buttonGr);
        gui.settingsBox.appendChild(div);

        document.querySelector('body').appendChild(gui.settingsBox);
        div = document.createElement("a");
        div.classList.add('settings');
        div.setAttribute('href', 'javascript:void(0)');
        div.innerHTML = '<i class="fa fa-cog" aria-hidden="true"></i>';
        div.addEventListener('click', function(e){
            if(openedSettingsBox == 0){
                openSettingsBox(e);
                openedSettingsBox = 1;
            }else{
                closeSettingsBox();
                openedSettingsBox = 0;
            }
        });
        gui.icon.appendChild(div);
        gui.fieldsHolderBar.classList.add('col-md-12', 'fieldsHolderBar', 'panel', 'panel-default');
        gui.icon.classList.add('col-md-12', 'icon', 'panel', 'panel-default');
        gui.cells.classList.add('cells');

        div = document.createElement("a");
        div.classList.add('btn','btn-box-tool','pull-right');
        div.setAttribute('data-widget', 'collapse');
        div.innerHTML = '<i class="fa fa-minus"></i>';
        div.addEventListener('click', function(e){
            $('.fieldsHolderBar').toggle("false");
        });
        gui.icon.appendChild(div);
        // gui.fieldsHolderBar.appendChild(icondiv);

        //main container
        gui.mainHolder.classList.add('col-md-12', 'mainHolder', 'panel', 'panel-default','main');

        //dummy placeholder
        div = document.createElement("div");
        div.classList.add('edgeHolder');
        gui.mainHolder.appendChild(div);

        //columns container
        gui.columnsHolder.classList.add('columnsHolder');
        gui.columns.classList.add('columns');
        gui.columnsHolder.appendChild(gui.columns);
        gui.mainHolder.appendChild(gui.columnsHolder);

        //rows container
        div = document.createElement("div");
        gui.rowsHolder.appendChild(div);
        gui.rowsHolder.classList.add('rowsHolder');
        gui.mainHolder.appendChild(gui.rowsHolder);

        //render Area
        div = document.createElement("div");
        div.id = 'grid';
        div.style.height = settings.dimensions.height - 260 + 'px';
        gui.renderArea.appendChild(div);

        //dashlet
        gui.dashletBox.classList.add('dashlet-box');
        gui.dashletBox.style.display = 'none';
        div = document.createElement('a');
        div.style.float = 'right';
        div.setAttribute('href', 'javascript:void(0)');
        div.classList.add('fa', 'fa-times-circle');
        div.addEventListener('click', function(){
            closeDashletBox();
        });
        gui.dashletBox.appendChild(div);
        div = document.createElement('div');
        div.id = 'dashletContent';
        div.style.height = 'auto';
        gui.dashletBox.appendChild(div);
        var title = document.createElement("e");
        title.innerHTML = "<h4 class='box-content' style='margin-bottom: 20px'>" + language['dashlet']['context'] + "</h4>";
        div.appendChild(title);
        var input = document.createElement('input');
        input.style.marginBottom = '10px';
        input.setAttribute('placeholder', language['dashlet']['name']);
        div.appendChild(input);
        var textarea = document.createElement('textarea');
        textarea.style.width = '300px';
        textarea.style.marginBottom = '10px';
        textarea.setAttribute('placeholder', language['dashlet']['description']);
        div.appendChild(textarea);
        div.appendChild(document.createElement('br'));

        label = document.createTextNode(language['dashlet']['usersWithAccess'] + ': ');
        div.appendChild(label);
        var selectRights = document.createElement('select');
        selectRights.id = 'dashlet-roles';
        $.when(
            getRoleRights()
        ).done(function(roles){
            for(var i=0; i<roles.length; i++){
                selectRights.innerHTML += "<option value='"+roles[i].id+"'>"+roles[i].name+"</option>";
            }
        });
        div.appendChild(selectRights);
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('br'));

        label = document.createTextNode(language['dashlet']['dashboard'] + ': ');
        div.appendChild(label);
        var dashboardSelect = document.createElement('select');
        dashboardSelect.id = 'dashlet-group';
        fillDashBoardSelect(dashboardSelect);
        div.appendChild(dashboardSelect);

        btn = document.createElement('button');
        btn.className = 'btn btn-xs btn-danger';
        btn.style.marginLeft = '5px';
        btn.innerHTML = language['actions']['save']['new'];
        btn.addEventListener('click', function(){
            bootbox.prompt(
                language['responses']['nameDashboard'],
                function(name){
                    if(name != null){
                        saveDashboard(name, function(){
                            fillDashBoardSelect(dashboardSelect);
                        });
                    }
                }
            );
        });
        div.appendChild(btn);
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('br'));

        label = document.createTextNode(language['dashlet']['size']['context'] + ': ');
        div.appendChild(label);
        var select = document.createElement('select');
        select.id = 'dashlet-size';
        select.innerHTML = "" +
            "<option value='4'>" + language['dashlet']['size']['small'] + "</option>" +
            "<option value='6'>" + language['dashlet']['size']['medium'] + "</option>" +
            "<option value='8'>" + language['dashlet']['size']['big'] + "</option>" +
            "<option value='12'>" + language['dashlet']['size']['full'] + "</option>";
        div.appendChild(select);
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('hr'));
        btn = document.createElement('button');
        btn.className = 'btn btn-xs btn-danger';
        btn.innerHTML = 'Ruaj';
        btn.style.marginRight = '10px';
        btn.addEventListener('click', function(){
            saveDashlet(input.value, textarea.value, selectRights.options[selectRights.selectedIndex].value, dashboardSelect.options[dashboardSelect.selectedIndex].value, select.options[select.selectedIndex].value, currentChart);
        });
        div.appendChild(btn);

        document.querySelector('body').appendChild(gui.dashletBox);

        //filtersBox
        gui.filterBox.classList.add('filter-box');
        gui.filterBox.style.display = 'none';
        div = document.createElement('a');
        div.style.float = 'right';
        div.setAttribute('href', 'javascript:void(0)');
        div.classList.add('fa', 'fa-times-circle');
        div.addEventListener('click', function(){
            closeFiltersBox();
        });
        gui.filterBox.appendChild(div);
        div = document.createElement('div');
        div.id = 'filterBoxContent';
        div.style.height = 'auto';
        gui.filterBox.appendChild(div);
        document.querySelector('body').appendChild(gui.filterBox);

        gui.mainHolder.appendChild(gui.renderArea);

        //data bar
        div = document.createElement("div");
        div.innerHTML = language['cells'];
        div.classList.add('label','cell');
        gui.cells.appendChild(div);

        //apply btn
        var dropBtn = document.createElement("div");
        dropBtn.classList.add('btn-group', 'rightFloat');

        div = document.createElement("button");
        div.innerHTML = "<i class='fa fa-table' aria-hidden='true'></i> " + language['actions']['applyPivot']['main'];
        div.classList.add('btn', 'btn-sm', 'btn-danger');
        div.addEventListener('click', getPivotData);
        dropBtn.appendChild(div);

        div = document.createElement("button");
        div.innerHTML = "<b class='caret'></b>";
        div.classList.add('btn', 'btn-sm', 'btn-danger', 'dropdown-toggle', 'dropdown-toggle-split');
        div.setAttribute('data-toggle', 'dropdown');
        div.setAttribute('aria-haspopup', 'true');
        div.setAttribute('aria-expanded', 'false');
        dropBtn.appendChild(div);

        div = document.createElement("div");
        var el = document.createElement("a");
        el.classList.add('dropdown-item');
        el.setAttribute('href', '#');
        el.addEventListener('click', function(){
            getPivotData(false);
        });
        el.innerHTML = language['actions']['applyPivot']['custom'];
        div.appendChild(el);
        div.classList.add('dropdown-menu');
        dropBtn.appendChild(div);

        gui.dataHolder.appendChild(dropBtn);
        gui.dataHolder.appendChild(gui.cells);

        //chart btn
        div = document.createElement("button");
        div.innerHTML = "<i class='fa fa-area-chart' aria-hidden='true'></i> " + language['actions']['generateGraph'];
        div.classList.add('btn', 'btn-sm', 'btn-danger', 'rightFloat');
        // div.style.borderBottom = 'solid 4px red';
        div.id = 'generate-chart';
        div.addEventListener('click', function(e){
            if(gui.chartOptionsBox.style.display == 'none')
                openChartOptionsBox(e);
            else closeChartOptionsBox();
        });
        gui.dataHolder.appendChild(div);

        //dashlet btn
        div = document.createElement("button");
        div.innerHTML = "<i class='fa fa-floppy-o' aria-hidden='true'></i> " + language['actions']['saveDashlet'];
        div.classList.add('btn', 'btn-sm', 'btn-danger', 'rightFloat');
        // div.style.borderBottom = 'solid 4px orange';
        div.style.display = 'none';
        div.id = 'generate-dashlet';
        div.addEventListener('click', function(e){
            if(gui.chartOptionsBox.style.display == 'none')
                openDashletBox(e);
            else closeDashletBox();
        });
        gui.dataHolder.appendChild(div);

        //chartOptions
        gui.chartOptionsBox.classList.add('chart-box');
        gui.chartOptionsBox.style.display = 'none';

        div = document.createElement("button");
        div.innerHTML = "<i class='fa fa-bar-chart' aria-hidden='true'></i> " + language['graph']['columns'];
        div.style.marginBottom = '5px';
        div.classList.add('btn', 'btn-xs', 'btn-default');
        div.addEventListener('click', function(){
            generateChart('columns');
            closeChartOptionsBox();
        });
        gui.chartOptionsBox.appendChild(div);
        document.querySelector('body').appendChild(gui.chartOptionsBox);
        gui.chartOptionsBox.appendChild(document.createElement('br'));

        div = document.createElement("button");
        div.innerHTML = "<i class='fa fa-line-chart' aria-hidden='true'></i> " + language['graph']['line'];
        div.style.marginBottom = '5px';
        div.classList.add('btn', 'btn-xs', 'btn-default');
        div.addEventListener('click', function(){
            generateChart('line');
            closeChartOptionsBox();
        });
        gui.chartOptionsBox.appendChild(div);
        document.querySelector('body').appendChild(gui.chartOptionsBox);
        gui.chartOptionsBox.appendChild(document.createElement('br'));

        div = document.createElement("button");
        div.innerHTML = "<i class='fa fa-pie-chart' aria-hidden='true'></i> " + language['graph']['pie'];
        div.style.marginBottom = '5px';
        div.classList.add('btn', 'btn-xs', 'btn-default');
        div.addEventListener('click', function(){
            generateChart('pie');
            closeChartOptionsBox();
        });
        gui.chartOptionsBox.appendChild(div);
        document.querySelector('body').appendChild(gui.chartOptionsBox);
        gui.chartOptionsBox.appendChild(document.createElement('br'));

        div = document.createElement("button");
        div.innerHTML = "<i class='fa fa-table' aria-hidden='true'></i> " + language['graph']['heat'];
        div.style.marginBottom = '5px';
        div.classList.add('btn', 'btn-xs', 'btn-default');
        div.addEventListener('click', function(){
            generateChart('heat');
            closeChartOptionsBox();
        });
        gui.chartOptionsBox.appendChild(div);
        document.querySelector('body').appendChild(gui.chartOptionsBox);
        gui.chartOptionsBox.appendChild(document.createElement('br'));

        div = document.createElement("button");
        div.innerHTML = "<i class='fa fa-area-chart' aria-hidden='true'></i> " + language['graph']['web'];
        div.style.marginBottom = '5px';
        div.classList.add('btn', 'btn-xs', 'btn-default');
        div.addEventListener('click', function(){
            generateChart('web');
            closeChartOptionsBox();
        });
        gui.chartOptionsBox.appendChild(div);
        document.querySelector('body').appendChild(gui.chartOptionsBox);
        gui.chartOptionsBox.appendChild(document.createElement('br'));

        div = document.createElement("button");
        div.innerHTML = "<i class='fa fa-map' aria-hidden='true'></i> " + language['graph']['map'];
        div.style.marginBottom = '5px';
        div.classList.add('btn', 'btn-xs', 'btn-default');
        div.addEventListener('click', function(){
            generateChart('map');
            closeChartOptionsBox();
        });
        gui.chartOptionsBox.appendChild(div);
        document.querySelector('body').appendChild(gui.chartOptionsBox);
        gui.chartOptionsBox.appendChild(document.createElement('br'));

        div = document.createElement("button");
        div.innerHTML = "<i class='fa fa-align-left' aria-hidden='true'></i> " + language['graph']['sankey'];
        div.style.marginBottom = '5px';
        div.classList.add('btn', 'btn-xs', 'btn-default');
        div.addEventListener('click', function () {
            generateChart('sankey');
            closeChartOptionsBox();
        });
        gui.chartOptionsBox.appendChild(div);
        document.querySelector('body').appendChild(gui.chartOptionsBox);

        //excel btn
        div = document.createElement("button");
        div.innerHTML = "<i class='fa fa-file-excel-o' aria-hidden='true'></i> " + language['actions']['downloadExcel'];
        div.classList.add('btn', 'btn-sm', 'btn-danger', 'rightFloat');
        div.style.display = 'none';
        // div.style.borderBottom = 'solid 4px green';
        div.id = 'download-excel';
        div.addEventListener('click', downloadExcel);
        gui.dataHolder.appendChild(div);

        div = document.createElement("button");
        div.innerHTML = "<i class='fa fa-chevron-left' aria-hidden='true'></i> " + language['actions']['cancel'];
        div.classList.add('btn', 'btn-sm', 'btn-danger', 'rightFloat');
        // div.style.borderBottom = 'solid 4px green';
        div.id = 'back';
        div.addEventListener('click', returnPivot);
        gui.dataHolder.appendChild(div);
        gui.down.appendChild(gui.cells);
        gui.down.appendChild(gui.dataHolder);


        gui.dataHolder.classList.add('col-md-11', 'dataHolder', 'panel', 'panel-default');

        container.style.width = config.dimensions.width;
        container.style.height = config.dimensions.height + 'px';

        fragment.appendChild(gui.icon);
        fragment.appendChild(gui.fieldsHolderBar);
        fragment.appendChild(gui.mainHolder);
        fragment.appendChild(gui.down);
        // fragment.appendChild(gui.cells);
        // fragment.appendChild(gui.dataHolder);

        container.appendChild(fragment);
        fragment = null;
    }

    function createDomFilter(field, selector) {
        var filter = document.createElement("a");
        filter.setAttribute('href', 'javascript:void(0)');
        filter.classList.add('fa', 'fa-caret-square-o-down');
        filter.style.fontSize = '12px';
        filter.style.padding = '5px';
        filter.style.color = 'white';
        filter.addEventListener('click', function(e){
            var found = 0;
            for(var i=0; i<openedFilterBoxes.length; i++){
                if(openedFilterBoxes[i] == field.dataField){
                    closeFiltersBox();
                    found++;
                    break;
                }
            }
            if(found == 0){
                openFiltersBox(field, e, selector);
                openedFilterBoxes.push(field.dataField);
            }

        });

        return filter;
    }

    function createDomField(field, parent) {
        var div = document.createElement("div");
        if(field.hasOwnProperty('aggregate') && parent == 'data'){
            div.appendChild(document.createTextNode(" ("+field.aggregate+") "));
        }
        div.appendChild(document.createTextNode(field.display));
        if(field.hasOwnProperty('date_grouping')){
            div.appendChild(document.createTextNode(" ("+field.date_grouping+")"));
        }
        div.appendChild(createDomFilter(field, div));
        div.classList.add('field');

        switch (parent){
            case 'rows':
                gui.rowsHolder.appendChild(div);
                break;
            case 'columns':
                gui.columns.appendChild(div);
                break;
            case 'data':
                gui.dataHolder.appendChild(div);
                break;
            default:
                gui.fieldsHolderBar.appendChild(div);
        }

    }

    function openDashletBox(event){
        gui.dashletBox.style.display = 'block';
    }

    function closeDashletBox(){
        gui.dashletBox.style.display = 'none';
    }

    function getGridControllerName(url){
        return url.split('/')[0].replace('?','');
    }

    function saveDashlet(title, description, rights, dashboard, size, type) {
        if (title == "") {
            return false;
        }

        applyFieldPositioning();
        var cond = buildQueryObject();

        $.ajax({
            url: settings.server.dashlet_url,
            type: "POST",
            dataType: "json",
            data: {
                title: title,
                type: type,
                cond: JSON.stringify(cond),
                description: description,
                rights: rights,
                dashboard: dashboard,
                size: size,
                pivotRowsData: JSON.stringify(fieldPositioning.rows),
                pivotColumnsData: JSON.stringify(fieldPositioning.columns),
                pivotCellsData: JSON.stringify(fieldPositioning.data)
            },
            success: function (response) {
                bootbox.alert(response.message);
                closeDashletBox();
            }
        })
    }

    function saveDashboard(name, callback){
        if(name == ''){
            return false;
        }

        $.ajax({
            url : '?dashboardCRUD/saveDashboard',
            type : 'post',
            dataType : 'json',
            data : {name: name},
            success: function(response){
                bootbox.alert(response.message);
                callback();
            }
        });
    }

    function openSettingsBox(event){
        gui.settingsBox.style.display = 'block';
        gui.settingsBox.style.left = event.pageX - 200 + 'px';
        gui.settingsBox.style.top = event.pageY - 30 + 'px';
    }

    function closeSettingsBox(){
        gui.settingsBox.style.display = 'none';
    }

    function openFiltersBox(field, event, selector) {
        var text;
        if(field.hasOwnProperty('display'))
             text = field.display;
        else text = field.headerText;
        gui.filterBox.style.display = 'block';
        gui.filterBox.style.left = event.pageX - 4 + 'px';
        gui.filterBox.style.top = event.pageY - 25 + 'px';
        if(selector.parentElement.classList.contains('dataHolder')){
            gui.filterBox.style.left = event.pageX - 4 + 'px';
            gui.filterBox.style.top = event.pageY - 220 + 'px';
        }
        gui.filterBox.querySelector('#filterBoxContent').innerHTML = '';

        //filters
        var filterLabel = document.createElement('div');
        filterLabel.innerHTML = language['filters']['context'] + ':';
        filterLabel.style.marginBottom = '10px';
        gui.filterBox.querySelector('#filterBoxContent').appendChild(filterLabel);
        var opt0 = '', opt1 = '', opt2 = '', opt3 = '', value = '';

        var fld = getFieldByName(text, 'fields');
        if(fld.hasOwnProperty('filters')){
            switch(fld.filters.type){
                case '=' :
                    opt0 = 'selected';
                    break;
                case '<' :
                    opt1 = 'selected';
                    break;
                case '>' :
                    opt2 = 'selected';
                    break;
                case '<>' :
                    opt3 = 'selected';
                    break;
            }

            value = fld.filters.value;
        }

        var select = document.createElement('select');
        select.id = 'filter-select';
        select.innerHTML = "" +
            "<option "+opt0+" value='0'>=</option>" +
            "<option "+opt1+" value='1'><</option>" +
            "<option "+opt2+" value='2'>></option>" +
            "<option "+opt3+" value='3'><></option>";
        select.style.width = '28%';
        select.style.marginRight = '2%';
        select.style.marginBottom = '10px';
        gui.filterBox.querySelector('#filterBoxContent').appendChild(select);

        var input = document.createElement('input');
        input.value = value;
        input.style.width = '60%';
        input.style.marginBottom = '10px';
        if(field.hasOwnProperty('type')){
            if(field.type == 'date'){
                input.classList.add('date-picker');
                $(input).datetimepicker({
                    format:'YYYY-MM-DD'
                });
            }
        }
        gui.filterBox.querySelector('#filterBoxContent').appendChild(input);

        //sort options
        var sortLabel = document.createElement('div');
        sortLabel.innerHTML = language['filters']['order'] + ': ';
        sortLabel.style.width = '50%';
        sortLabel.style.float = 'left';
        gui.filterBox.querySelector('#filterBoxContent').appendChild(sortLabel);
        var sopt0 = '', sopt1 = '';

        var sfld = getFieldByName(text, 'fields');
        if(sfld.hasOwnProperty('sort')){
            switch(sfld.sort){
                case 'ASC' :
                    sopt1 = 'selected';
                    break;
                case 'DESC' :
                    sopt0 = 'selected';
                    break;
            }

        }

        var sselect = document.createElement('select');
        sselect.id = 'sort-select';
        sselect.style.marginBottom = '10px';
        sselect.innerHTML = "" +
            "<option "+sopt0+" value='0'>DESC</option>" +
            "<option "+sopt1+" value='1'>ASC</option>";
        sselect.style.float = 'left';
        gui.filterBox.querySelector('#filterBoxContent').appendChild(sselect);

        //date fields
        if(field.hasOwnProperty('type')){
            if(field.type == 'date'){
                var dtopt0 = '', dtopt1 = '', dtopt2 = '', dtopt3 = '', dtopt4 = '';
                if(field.hasOwnProperty('date_grouping')){
                    switch(field.date_grouping){
                        case 'DATE':
                            dtopt0 = 'selected';
                            break;
                        case 'WEEK':
                            dtopt1 = 'selected';
                            break;
                        case 'MONTH':
                            dtopt2 = 'selected';
                            break;
                        case 'QUARTER':
                            dtopt3 = 'selected';
                            break;
                        case 'YEAR':
                            dtopt4 = 'selected';
                            break;
                    }
                }
                else dtopt0 = 'selected';

                var label = document.createElement('div');
                label.innerHTML = language['filters']['group'] + ":";
                label.style.width = '50%';
                label.style.float = 'left';
                gui.filterBox.querySelector('#filterBoxContent').appendChild(label);

                var dateSelect = document.createElement('select');
                dateSelect.id = 'date-select';
                dateSelect.style.float = 'left';
                dateSelect.style.marginBottom = '10px';
                dateSelect.innerHTML = "" +
                    "<option "+dtopt0+" value='0'>DATE</option>" +
                    "<option "+dtopt1+" value='1'>WEEK</option>" +
                    "<option "+dtopt2+" value='2'>MONTH</option>" +
                    "<option "+dtopt3+" value='3'>QUARTER</option>" +
                    "<option "+dtopt4+" value='4'>YEAR</option>";
                gui.filterBox.querySelector('#filterBoxContent').appendChild(dateSelect);
            }
        }

        //cell fields
        if(selector.parentElement.classList.contains('dataHolder')){
            if(field.hasOwnProperty('aggregate')){
                var aggopt0 = '', aggopt1 = '';
                switch(field.aggregate){
                    case 'SUM':
                        aggopt0 = 'selected';
                        break;
                    case 'COUNT':
                        aggopt1 = 'selected';
                        break
                }
            }
            else aggopt0 = 'selected';

            var agglabel = document.createElement('div');
            agglabel.innerHTML = language['filters']['aggregation'] + ": ";
            agglabel.style.width = '50%';
            agglabel.style.float = 'left';
            gui.filterBox.querySelector('#filterBoxContent').appendChild(agglabel);

            var aggSelect = document.createElement('select');
            aggSelect.id = 'aggregate-select';
            aggSelect.style.float = 'left';
            aggSelect.innerHTML = "" +
                "<option "+aggopt0+" value='0'>SUM</option>" +
                "<option "+aggopt1+" value='1'>COUNT</option>";

            gui.filterBox.querySelector('#filterBoxContent').appendChild(aggSelect);
        }

        var row = document.createElement('div');
        row.className = 'row';
        row.style.marginBottom = '10px';
        gui.filterBox.querySelector('#filterBoxContent').appendChild(row);

        var div = document.createElement('button');
        div.classList.add('btn', 'btn-xs', 'btn-danger');
        div.innerHTML = language['actions']['ok'];
        div.addEventListener('click', function(){
            //filter
            var field = getFieldByName(text, 'fields');
            if(input.value != '')
                field.filters = {type: select.options[select.selectedIndex].text, value: input.value};

            //sort
            field.sort = sselect.options[sselect.selectedIndex].text;

            //date grouping
            if(field.hasOwnProperty('type')){
                if(field.type == 'date'){
                    field.date_grouping = dateSelect.options[dateSelect.selectedIndex].text;
                    selector.innerHTML = text + " ("+field.date_grouping+")";
                    selector.appendChild(createDomFilter(field, selector));
                }
            }

            //aggregate
            if(selector.parentElement.classList.contains('dataHolder')) {
                field.aggregate = aggSelect.options[aggSelect.selectedIndex].text;
                selector.innerHTML ="("+field.aggregate+") " + text;
                selector.appendChild(createDomFilter(field, selector));

            }

            closeFiltersBox();
        });
        gui.filterBox.querySelector('#filterBoxContent').appendChild(div);

        div = document.createElement('button');
        div.classList.add('btn', 'btn-xs', 'btn-danger');
        div.style.marginLeft = '5px';
        div.innerHTML = language['actions']['reset'];
        div.addEventListener('click', function(){
            var field = getFieldByName(text, 'fields');
            if(field.hasOwnProperty('filters'))
                delete field.filters;

            input.value = '';
            select.selectedIndex = 0;
        });
        gui.filterBox.querySelector('#filterBoxContent').appendChild(div);
    }

    function closeFiltersBox() {
        gui.filterBox.style.display = 'none';
        openedFilterBoxes = [];
    }

    function openChartOptionsBox(event){
        var parent = gui.dataHolder.querySelector('#generate-chart').getBoundingClientRect();

        gui.chartOptionsBox.style.display = 'block';
        gui.chartOptionsBox.style.left = parent.left + 'px';
        gui.chartOptionsBox.style.top = event.pageY - 260 + 'px';
    }

    function closeChartOptionsBox(){
        gui.chartOptionsBox.style.display = 'none';
    }

    function saveConfig(context, value, group) {
        savedChangeState = true;
        applyFieldPositioning();

        //build new config array
        if(context)
            context = 'new_config';
        else context = 'config';
        if(value == '')
            value = 'Pivot copy '+ new Date();

        var newConfig = {};
        newConfig.server = {};
        newConfig.server.url = settings.server.url;
        newConfig.server.chart_url = settings.server.chart_url;
        newConfig.server.dashlet_url = settings.server.dashlet_url;
        newConfig.server.role_rights = settings.server.role_rights;
        newConfig.server.data = settings.server.data;
        newConfig.server.misc = settings.server.misc;
        newConfig.dimensions = settings.dimensions;
        newConfig.settings = applySettings();
        newConfig.fields = [];

        for(var k=0;k<fields.length;k++){
            var field = {};
            field.name = fields[k].dataField;
            field.display = fields[k].headerText;
            if(fields[k].hasOwnProperty('type')){
                field.type = fields[k].type;
                if(fields[k].type == 'date')
                if(fields[k].hasOwnProperty('date_grouping'))
                    field.date_grouping = fields[k].date_grouping;
            }
            if(fields[k].hasOwnProperty('aggregate'))
                field.aggregate = fields[k].aggregate;
            field.order = fields[k].sort;
            field.visible = fields[k].visible;
            newConfig.fields.push(field);
        }

        for(k=0;k<hiddenFields.length;k++){
            field = {};
            field.name = hiddenFields[k].dataField;
            field.display = hiddenFields[k].headerText;
            if(hiddenFields[k].hasOwnProperty('type')){
                field.type = hiddenFields[k].type;
                if(hiddenFields[k].type == 'date')
                    if(hiddenFields[k].hasOwnProperty('date_grouping'))
                        field.date_grouping = hiddenFields[k].date_grouping;
            }
            if(hiddenFields[k].hasOwnProperty('aggregate'))
                field.aggregate = hiddenFields[k].aggregate;
            field.order = hiddenFields[k].sort;
            field.visible = false;
            newConfig.fields.push(field);
        }

        newConfig.rows = [];
        newConfig.columns = [];
        newConfig.data = [];
        newConfig.forcedPivotingFields = context == 'new_config' ? [] : settings.forcedPivotingFields;

        for(var i=0; i<fieldPositioning.rows.length; i++){
            newConfig.rows.push(fieldPositioning.rows[i].dataField);
        }
        for(i=0; i<fieldPositioning.columns.length; i++){
            newConfig.columns.push(fieldPositioning.columns[i].dataField);
        }
        for(i=0; i<fieldPositioning.data.length; i++){
            newConfig.data.push(fieldPositioning.data[i].dataField);
        }

        //case new pivot
        var id_source = -1;
        if(settings.server.misc.id_pivot == '-1'){
            //find source
            id_source = window.location.search.split('/')[3]
        }
        
        $.ajax({
            url:settings.server.misc.config_url,
            dataType: "json",
            data: {
                id_pivot: settings.server.misc.id_pivot,
                id_source: id_source,
                config: JSON.stringify(newConfig),
                context: context,
                value: value,
                group: group
            },
            type: "POST",
            success: function(response){
                bootbox.alert(response);
                if(response.error == 0)
                    window.location.href = '?pivotCRUD/show/'+response.id_pivot;
            }
        })
    }

    function buildQueryString(){
        var queryString = [];
        for(var i=0; i<fields.length; i++){
            if(fields[i].hasOwnProperty('filters')){
                var found = 0;
                for(var k=0; k<fieldPositioning.stack.length; k++){
                    if(fieldPositioning.stack[k].dataField == fields[i].dataField){
                        found++;
                        break;
                    }

                }
                if(found<1)
                    queryString.push(fields[i].dataField + " " + fields[i].filters.type + " '" + fields[i].filters.value + "'");
            }
        }

        queryString = queryString.join(' AND ');

        if(queryString.length > 0){
            if(settings.server.data != '')
                queryString = settings.server.data + ' AND ' + queryString;
        }else{
            if(settings.server.data != '')
                queryString = settings.server.data;
        }

        return queryString;
    }

    function buildQueryObject() {
        var queryObject = {};
        var rules = [];
       
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].hasOwnProperty('filters')) {
                var found = 0;
                for (var k = 0; k < fieldPositioning.stack.length; k++) {
                    if (fieldPositioning.stack[k].dataField == fields[i].dataField) {
                        found++;
                        break;
                    }

                }
                if (found < 1)
                    rules.push({
                        id: fields[i].dataField,
                        type: 'string',
                        field: fields[i].dataField,
                        operator: operatorMappings[fields[i].filters.type],
                        value: fields[i].filters.value
                    });
            }
        }
        
        if (rules.length > 0) {
            if (settings.server.data != '') {
                queryObject.condition = "AND";
                rules.push(settings.server.data);
                queryObject.rules = rules;
            } else {
                queryObject.condition = "AND";
                queryObject.rules = rules;
            }              
        } else {
            if (settings.server.data != null)
                queryObject = settings.server.data;
        }
    
        return queryObject;
    }

    function getRoleRights(){
        return $.ajax({
            url: settings.server.role_rights,
            dataType: "json"
        });
    }

    function getPivotGroups(){
        return $.ajax({
            url: '?pivotCRUD/getPivotGroups',
            dataType: "json"
        });
    }

    function getDashboards(){
        return $.ajax({
            url: '?dashboardCRUD/getDashboards',
            dataType: "json"
        });
    }

    function validatePivoting(fieldPositioning){
        var obj = {
            message: 'Sukses',
            flag: true
        };

        // if(fieldPositioning.columns.length <= 0 && fieldPositioning.rows.length <= 0 && fieldPositioning.data.length <= 0)
        // {
        //     obj.msg = 'Ju lutem  plotësoni të gjitha fushat!';
        //     obj.flag = false;
        //     return obj;
        // }
        // if(fieldPositioning.columns.length <= 0 ){
        //     obj.msg = 'Ju lutem  plotësoni të gjitha fushat për kolonat!';
        //     obj.flag = false;
        //     return obj;
        // }
        // if(fieldPositioning.rows.length <= 0 ){
        //     obj.msg = 'Ju lutem  plotësoni të gjitha fushat për rreshtat!';
        //     obj.flag = false;
        //     return obj;
        // }
        if( fieldPositioning.data.length <= 0){
            obj.msg = 'Ju lutem  plotësoni të gjitha fushat për qelizat!';
            obj.flag = false;
            return obj;
        }

        return obj;
    }

    function getPivotData(excel) {
        applyFieldPositioning();
        var response = validatePivoting(fieldPositioning);
        if (response.flag == false) {
            bootbox.alert(response.msg);
            return;
        }

        var menuSettings = applySettings();
        var grid = gui.renderArea.querySelector('#grid');
        grid.innerHTML = '';
        gui.columnsHolder.style.display = 'block';
        gui.mainHolder.querySelector('.edgeHolder').style.display = 'block';

        if(excel)
            var url = settings.server.url+'/true';
        else
            url = settings.server.url;

        //filters
        var cond = buildQueryObject();

        //ajax
        $("#form_loader_2").fadeIn();
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: {
                pivotRowsData: JSON.stringify(fieldPositioning.rows),
                pivotColumnsData: JSON.stringify(fieldPositioning.columns),
                pivotCellsData: JSON.stringify(fieldPositioning.data),
                cond: JSON.stringify(cond),
                settings: menuSettings,
                forcedFields: JSON.stringify(settings.forcedPivotingFields)
            },
            success: function (response) {
                $("#form_loader_2").fadeOut();

                var options = {
                    enableCellNavigation: true,
                    enableColumnReorder: false,
                    explicitInitialization: true
                };
                var grid;
                var post_format_timeout;
                var post_format_cells = [];

                function removeEmptyCells(grid, row, cell, value, cellNode) {
                    var $c = $(cellNode);
                    if(value == '') {
                        $c.css('border-bottom', 'none');
                    }else{
                        $c.css('border-top', '1px dotted silver');
                        $c.css('border-bottom', 'none');
                    }

                }

                function post_format() {
                    var n = post_format_cells.length;
                    for (var i=0; i<n; ++i) {
                        var info = post_format_cells[i];
                        var grid = info[0];
                        var row = info[1];
                        var cell = info[2];
                        var value = info[3];
                        var highlight_fn = info[4];
                        var cellNode = grid.getCellNode(row, cell);
                        highlight_fn(grid, row, cell, value, cellNode);
                    }
                    post_format_timeout = null;
                    post_format_cells = [];
                }

                function post_format_push(info) {
                    if (!post_format_timeout) {
                        post_format_timeout = setTimeout(post_format, 0);
                        post_format_cells = [];
                    }
                    post_format_cells.push(info);
                }

                function format_completion(grid, row, cell, value, colDef, dataContext) {
                    post_format_push([grid, row, cell, value, removeEmptyCells]);
                    return grid.getOptions().defaultFormatter(row, cell, value, colDef, dataContext);
                }

                $(function () {
                    var my_format_completion = function(row, cell, value, colDef, dataContext) {
                        return format_completion(grid, row, cell, value, colDef, dataContext);
                    };
                    for(var i=0;i<5; i++){
                        if(response.columns[i] != undefined)
                            if(response.columns[i].flag == 'header')
                                response.columns[i].formatter = my_format_completion;
                    }
                    for(i=response.columns.length;i>response.columns.length - 5; i--){
                        if(response.columns[i] != undefined)
                            if(response.columns[i].flag == 'header')
                                response.columns[i].formatter = my_format_completion;
                    }
                    grid =  new Slick.Grid("#grid", response.data, response.columns, options);
                    grid.init();
                });
                if(excel){
                    excelURL = response.url;
                    gui.dataHolder.querySelector('#download-excel').style.display = 'block';
                }

            }
        });

    }

    function generateChart(type) {
        currentChart = type;
        applyFieldPositioning();
        var response = validatePivoting(fieldPositioning);
        if (response.flag == false) {
            bootbox.alert(response.msg);
            return;
        }

        var grid = gui.renderArea.querySelector('#grid');
        grid.innerHTML = '';
        //gui.columnsHolder.style.display = 'none';
        //gui.mainHolder.querySelector('.edgeHolder').style.display = 'none';

        //filters
        var cond = buildQueryObject();

        //ajax
        $("#form_loader_2").fadeIn();
        $.ajax({
            url: settings.server.chart_url,
            type: "POST",
            dataType: 'json',
            data: {
                pivotRowsData: JSON.stringify(fieldPositioning.rows),
                pivotColumnsData: JSON.stringify(fieldPositioning.columns),
                pivotCellsData: JSON.stringify(fieldPositioning.data),
                cond: JSON.stringify(cond),
                type: type
            },
            success: function (response) {
                $("#form_loader_2").fadeOut();

                $(function () {
                    var chart = null;
                    switch (type){
                        case 'columns':
                            chart = columnChart(response);
                            break;
                        case 'line':
                            chart = lineChart(response);
                            break;
                        case 'pie':
                            chart = pieChart(response);
                            break;
                        case 'heat':
                            chart = heatChart(response);
                            break;
                        case 'web':
                            chart = webChart(response);
                            break;
                        case 'map':
                            chart = mapChart(response);
                            break;
                        case 'sankey':
                            chart = sankeyChart(response);
                            break;    
                    }
                });

                //dashlet btn
                gui.dataHolder.querySelector('#generate-dashlet').style.display = 'block';
            }
        })

    }

    function columnChart(response){
        var axisText = 'Sasia';

        return Highcharts.chart('grid', {
            credits: {
                enabled: false
            },
            chart: {
                type: 'column',
                zoomType: 'x'
            },
            title: {
                text: ''
            },
            xAxis: {
                min: 0,
                type: 'category'
            },
            yAxis: {
                title: {
                    text: axisText
                }
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    turboThreshold: 0
                }
            },
            tooltip: {

            },

            series: response.series,

            drilldown: response.drilldown
        });
    }

    function lineChart(response){
        var axisText = 'Sasia';

        return Highcharts.chart('grid', {
            credits: {
                enabled: false
            },
            chart: {
                zoomType: 'x'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: response.categories
            },
            yAxis: {
                title: {
                    text: axisText
                }
            },

            series: response.series
        });
    }

    function pieChart(response){

        return Highcharts.chart('grid', {
            credits: {
                enabled: false
            },
            chart: {
                type: 'pie'
            },
            title: {
                text: ''
            },

            series: response.series,

            drilldown: response.drilldown
        });
    }

    function heatChart(response){

        return Highcharts.chart('grid', {
            credits: {
                enabled: false
            },
            chart: {
                type: 'heatmap',
                plotBorderWidth: 1
            },
            title: {
                text: ''
            },

            xAxis: {
                categories: response.Xcategories
            },

            yAxis: {
                categories: response.Ycategories,
                title: null
            },

            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors[0]
            },

            series: response.series

        });

    }

    function webChart(response){

        return Highcharts.chart('grid', {
            credits: {
                enabled: false
            },
            chart: {
                polar: true,
                type: 'line'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: response.categories,
                tickmarkPlacement: 'on',
                lineWidth: 0
            },
            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0
            },
            series: response.series

        });
    }

    function mapChart(response) {
        return Highcharts.mapChart('grid', {
            chart: {
                map: 'countries/al/al-all'
            },

            title: {
                text: 'Highmaps basic demo'
            },

            subtitle: {
                text: ''
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                min: 0
            },

            series: [{
                data: response,
                name: 'Random data',
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }]
        });
    }

    function sankeyChart(response) {
        
        var margin = { top: 1, right: 1, bottom: 6, left: 1 },
            width = 960 - margin.left - margin.right,
            height = 338 - margin.top - margin.bottom;

        var formatNumber = d3.format(",.0f"),
            format = function (d) { return formatNumber(d) + " "; },
            color = d3.scale.category20();

        var svg = d3.select("#grid").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var sankey = d3.sankey(width)
            .nodeWidth(22)
            .nodePadding(10)
            .size([width, height]);

        var path = sankey.link();

        sankey
            .nodes(response.nodes)
            .links(response.links)
            .layout(32);

        var link = svg.append("g").selectAll(".link")
            .data(response.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function (d) { return Math.max(1, d.dy); })
            .sort(function (a, b) { return b.dy - a.dy; });

        link.append("title")
            .text(function (d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

        var node = svg.append("g").selectAll(".node")
            .data(response.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.behavior.drag()
                .origin(function (d) { return d; })
                .on("dragstart", function () { this.parentNode.appendChild(this); })
                .on("drag", dragmove));

        node.append("rect")
            .attr("height", function (d) { return d.dy; })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) { return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", function (d) { return d3.rgb(d.color).darker(2); })
            .append("title")
            .text(function (d) { return d.name + "\n" + format(d.value); });

        node.append("text")
            .attr("x", -6)
            .attr("y", function (d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function (d) { return d.name; })
            .filter(function (d) { return d.x < width / 2; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");
        
        node.append("text")
            .attr("class", "node_value")
            .attr("x", function (i) { return -i.dy / 2 })
            .attr("y", function (i) { return i.dx / 2 + 6 })
            .attr("transform", "rotate(270)")
            .attr("text-anchor", "middle")
            .text(function (i) { return format(i.value) })
            .text(function (i) {
                if ((this.getComputedTextLength() / i.dy) > 0.8) 
                    //Check to see that text doesn't make up more than 80% of the height.
                    return "";
                return format(i.value);
            })
            .attr("fill", "white");  

        function dragmove(d) {
            d3.select(this).attr(
                "transform",
                //"translate(" + (d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))) + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")"
                "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")"
            );
            sankey.relayout();
            link.attr("d", path);
        }

        //export
        $('#grid').append(
            "<div id='sankey-actions'>" +
            "<a href='javascript:void(0)' onclick='svg2Image.export(document.getElementsByTagName(\"svg\")[0], " + width +" , " + height + ");' class='btn btn-xs btn-default'><i class='fa fa-external-link' aria-hidden='true'></i>" +
            language['actions']['downloadImage'] + "</a> " +
            "</div>"
        )  
        
    }

    function downloadExcel() {
        $("#form_loader_2").fadeIn();
        window.open(excelURL);
        bootbox.alert(language['responses']['successfulReport']);
        $("#form_loader_2").fadeOut();
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function returnPivot() {
        if(settings.server.misc.id_pivot != '-1')
            window.location.href = '?pivotCRUD/load/'+settings.server.misc.id_pivot;
        else
            window.location.href = '?pivotCRUD';
    }

    function applyFieldPositioning() {
        //flush nodes
        fieldPositioning.columns = [];
        fieldPositioning.rows = [];
        fieldPositioning.data = [];
        fieldPositioning.stack = [];

        //data nodes
        var nodes = gui.dataHolder.childNodes;
        for(var i=0; i<nodes.length; i++){
            if(nodes[i].className != 'field')
                continue;
            fieldPositioning.data.push(getFieldByName(nodes[i].innerText, 'fields'));
        }

        //row nodes
        nodes = gui.rowsHolder.childNodes;
        for(i=0; i<nodes.length; i++){
            if(nodes[i].className != 'field')
                continue;
            fieldPositioning.rows.push(getFieldByName(nodes[i].innerText, 'fields'));
        }

        //columns nodes
        nodes = gui.columns.childNodes;
        for(i=0; i<nodes.length; i++){
            if(nodes[i].className != 'field')
                continue;
            fieldPositioning.columns.push(getFieldByName(nodes[i].innerText, 'fields'));
        }

        //unused nodes
        nodes = gui.fieldsHolderBar.childNodes;
        for(i=0; i<nodes.length; i++){
            if(nodes[i].className != 'field')
                continue;
            fieldPositioning.stack.push(getFieldByName(nodes[i].innerText, 'fields'));
        }

    }

    function applySettings(){
        var settings = {};
        //get number format
        settings.numberFormat = gui.settingsBox.querySelector('#number-format').checked;

        return settings;
    }

    function track(name, parent, source) {
        savedChangeState = false;
        //aggregation type
        var field;
        if(parent.classList.contains('dataHolder')){
            //data field
            field = getFieldByName(name.innerText, 'fields');
            var settingsField = getFieldByName(name.innerText, 'settings');
            if(settingsField.hasOwnProperty('aggregate')){
                field.aggregate = settingsField.aggregate;
            }
            else field.aggregate = 'SUM';
            pushFieldUnique(field);

            //change dom
            for(var i=0; i<parent.childNodes.length; i++){
                if(parent.childNodes[i].innerText == name.innerText){
                    parent.childNodes[i].innerHTML = '('+field.aggregate+') ';
                    parent.childNodes[i].append(field.headerText);
                    parent.childNodes[i].appendChild(createDomFilter(field,  parent.childNodes[i]));
                    parent.childNodes[i].classList.remove('dropup');
                    parent.childNodes[i].classList.add('field');
                }
            }
        }else{

            //force unmove filtered fields
            // if (parent.classList.contains('fieldsHolderBar')) {
            //     if (settings.forcedPivotingFields.length > 0)
            //         if (settings.forcedPivotingFields.indexOf(getFieldByName(name.innerText).name) != '-1') {
            //             parent.removeChild(name);
            //             source.appendChild(name);
            //             return;
            //         }
            // }

            //other field
            field = getFieldByName(name.innerText, 'fields');
            if(field.hasOwnProperty('aggregate'))
                delete field.aggregate;
            pushFieldUnique(field);

            //change dom
            for(i=0; i<parent.childNodes.length; i++){
                if(parent.childNodes[i].innerText == name.innerText){
                    parent.childNodes[i].innerHTML = '';
                    parent.childNodes[i].append(field.headerText);
                    if(field.hasOwnProperty('type')){
                        if(field.type == 'date'){
                            if(field.hasOwnProperty('date_grouping')){
                                parent.childNodes[i].append(" ("+field.date_grouping+")");
                            }
                        }
                    }
                    parent.childNodes[i].appendChild(createDomFilter(field,  parent.childNodes[i]));
                    parent.childNodes[i].classList.remove('dropup');
                    parent.childNodes[i].classList.add('field');
                }
            }
        }
    }

    function canFieldMove(el, source, handle, sibling) { 
        if (el.classList.contains('label') || el.classList.contains('btn-group') || el.classList.contains('btn'))
            return false;  
        
        return true;
    }

    function getFieldByName(name, type){
        //clean name from this patern 'data (SUM)'
        name = name
            .replace('(SUM) ','')
            .replace('(AVG) ','')
            .replace('(COUNT) ','')
            .replace(' (QUARTER)','')
            .replace(' (WEEK)','')
            .replace(' (MONTH)','')
            .replace(' (DATE)','')
            .replace(' (YEAR)','');

        if(type == 'fields')
            for(var i=0; i<fields.length; i++){
                if(fields[i].headerText == name){
                    return fields[i];
                }
            }
        else
            for(i=0; i<settings.fields.length; i++){
                if(settings.fields[i].display == name){
                    return settings.fields[i];
                }
            }

    }

    function pushFieldUnique(field){
        for(var i=0; i<fields.length; i++){
            if(fields[i].dataField == field.dataField){
                fields[i] = field;
                return;
            }
        }
        fields.push(field);
    }

    //outer accessible keys
    return {
        //visible
        render : render,
        gui: gui,
        fields : fieldPositioning,
        track : track,
        savedChangeState: savedChangeState,
        language: setLanguage
    };

})(svg2Image);