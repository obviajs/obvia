	
	var _jointJSObject = {};
	_jointJSObject.paper = {};
	
	function createElement(fsmObject)
	{	
		var _arrayLink;
		var paper;
		if(fsmObject.linkAttribute)
		{
			_arrayLink = fsmObject.linkAttribute;
		}
		else
		{
			_arrayLink = new joint.dia.Link(
			{
				attrs: 
				{ 
					'.connection': { 'stroke-width': 3, stroke: '#34495E' },
					'.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
				},
				smooth: true
			});
		}
	
		var graph = new joint.dia.Graph();
		
		if(fsmObject.paper)
		{
			if(!fsmObject.paper.el)
				fsmObject.paper.el = "paper";
			if(!fsmObject.paper.width)
				fsmObject.paper.width = 1000;
			if(!fsmObject.paper.height)
				fsmObject.paper.height = 500;
			if(!fsmObject.paper.gridSize)
				fsmObject.paper.gridSize = 1;
			
			_jointJSObject.paper.width = fsmObject.paper.width;
			_jointJSObject.paper.height = fsmObject.paper.height;
			paper = new joint.dia.Paper(
			{
				el: $('#' + fsmObject.paper.el),
				width: fsmObject.paper.width,
				height: fsmObject.paper.height,
				gridSize: fsmObject.paper.gridSize,
				model: graph,
				defaultLink: _arrayLink
			});
		}
		else
		{
			paper = new joint.dia.Paper(
			{
				el: $('#paper'),
				width: 1000,
				height: 500,
				gridSize: 1,
				model: graph,
				defaultLink: _arrayLink
			});
			
			_jointJSObject.paper.width = 1000;
			_jointJSObject.paper.height = 500;
		}
		
		//Create custom elemet
		joint.shapes.html = {};
		joint.shapes.html.Element = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, 
		{
			markup: '<g class="rotatable"><g class="scalable"><rect/></g><g class="outPorts"/></g>',
			portMarkup: '<g class="port<%= id %>"><circle class="port port-body"/></g>',
			defaults: joint.util.deepSupplement(
			{
				type: 'html.Element',
				size: { width: 100, height: 80 },
				id: 1,
				outPorts: [],
				attrs: 
				{
					'.': { magnet: true },
					rect: 
					{
						stroke: 'none', 'fill-opacity': 0, 
						width: 150, 
						height: 250
					},
					circle: {
						r: 12, //circle radius
						magnet: true,
						stroke: 'black'
					},
					'.outPorts circle': { fill: 'red', type: 'output'},
					'.port-body': { width: 10, height: 10, x: -5, stroke: 'gray', fill: 'lightgray', magnet: 'active' }
				}
			}, joint.shapes.basic.Generic.prototype.defaults),
			
			getPortAttrs: function (portName, index, total, selector, type) 
			{
				var attrs = {};
				var portClass = 'port' + index;
				var portSelector = selector + '>.' + portClass;
				var portCircleSelector = portSelector + '>circle';
				attrs[portCircleSelector] = { port: { id: portName || _.uniqueId(type), type: type } };
				attrs[portSelector] = { ref: 'rect', 'ref-y': (index + 0.5) * (1 / total) };
				if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0; }
				return attrs;
			}
		}));
	
		// Create a custom view for that element that displays an HTML div above it.
		// -------------------------------------------------------------------------
		joint.shapes.html.ElementView = joint.dia.ElementView.extend(
		{

			template: 
			[
				'<div class="html-element">',
				'<button type="button" class="btn btn-danger delete"><i class="glyphicon glyphicon-remove"></i></button>',
				'<label></label>',
				'<span style="display: none;"></span>',
				'<br/>',
				'</div>'
			].join(''),
			
			initialize: function() 
			{
				_.bindAll(this, 'updateBox');
				joint.dia.ElementView.prototype.initialize.apply(this, arguments);

				this.$box = $(_.template(this.template)());
				//console.log(this.$box);
				// Prevent paper from handling pointerdown.
				this.$box.find('input').on('mousedown click', function(evt) { evt.stopPropagation();});
			
				// This is an example of reacting on the input change and storing the input data in the cell model.
				this.$box.find('input').on('change', _.bind(function(evt) 
				{
					this.model.set('input', $(evt.target).val());
				}, this));
				
				this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
				// Update the box position whenever the underlying model changes.
				this.model.on('change', this.updateBox, this);
				// Remove the box when the model gets removed from the graph.
				this.model.on('remove', this.removeBox, this);
			
				this.updateBox();
			
			},

			render: function() 
			{
				joint.dia.ElementView.prototype.render.apply(this, arguments);
				this.paper.$el.prepend(this.$box);
				this.updateBox();
				return this;
			},
		
			renderPorts: function () 
			{
				var $inPorts = this.$('.inPorts').empty();
				var $outPorts = this.$('.outPorts').empty();

				var portTemplate = _.template(this.model.portMarkup);

				_.each(_.filter(this.model.ports, function (p) { return p.type === 'out' }), function (port, index) 
				{
					$outPorts.append(V(portTemplate({ id: index, port: port })).node);
				});
			}, 
		
			update: function () 
			{
				// First render ports so that `attrs` can be applied to those newly created DOM elements
				// in `ElementView.prototype.update()`.
				this.renderPorts();
				joint.dia.ElementView.prototype.update.apply(this, arguments);
			},
		
			updateBox: function() 
			{
				// Set the position and dimension of the box so that it covers the JointJS element.
				var bbox = this.model.getBBox();
				// Example of updating the HTML with a data stored in the cell model.
				this.$box.find('label').text(this.model.get('label'));
				this.$box.find('span').text(this.model.get('statusId'));
				this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
			},
			
			removeBox: function(evt) 
			{
				this.$box.remove();
			}
		});
		
		
		var myAdjustVertices = _.partial(adjustVertices, graph);
		
		//regulate links with the same source and target.
		paper.on('cell:pointerup', myAdjustVertices);

		//when link is drop to the target change source from source port to the element as source
		graph.on('change:source change:target', function(link) 
		{
			if (link.get('source').id && link.get('target').id ) 
			{
				if(link.get('labels'))
					link_input.value = link.get('labels')[0].attrs.text.text;
				else
					link_input.value = "";
					
				_jointJSObject.link = link;
				if(fsmObject.popUpFormName)
					$("#" + fsmObject.popUpFormName).fadeIn();
				else
					$("#linkForm").fadeIn();
				link.set('source', {'id' : link.get('source').id});
				
				//if link source and target is same...
				/*if (link.get('source').id == link.get('target').id ) 
				{
					var modelCenter = graph.getCell(link.get('source').id).getBBox().center();
					console.log(modelCenter);
					link.set('vertices', [{ x: modelCenter.x + 100, y: modelCenter.y + 100 }, { x: modelCenter.x - 100, y: modelCenter.y + 100 }]);
				}*/
				//
			}
			
		});
		
		graph.on('change:source change:target', myAdjustVertices);
		
		for(var index = 0; index < fsmObject.element.length; index++)
		{
			//position of element
			var position = {};
			if(fsmObject.element[index].position.x)
				position.x = fsmObject.element[index].position.x;
			else
				position.x = 80;
				
			if(fsmObject.element[index].position.y)
				position.y = fsmObject.element[index].position.y;
			else
				position.y = 80;
			//
			
			//size of element
			var size = {};
			if(fsmObject.element[index].size.width)
				size.width = fsmObject.element[index].size.width;
			else
				size.width = 100;
			if(fsmObject.element[index].size.height)
				size.height = fsmObject.element[index].size.height;
			else
				size.height = 100;
			//
			
			//label of element
			var label = "";
			if(fsmObject.element[index].label)
				label = fsmObject.element[index].label;
			//
			
			//statusId of element
			var statusId = "";
			if(fsmObject.element[index].statusId)
				statusId = fsmObject.element[index].statusId;
			//
			console.log(statusId);
			
			var el1;
			//element with id spcified
			if(fsmObject.element[index].id)
			{
				el1 = new joint.shapes.html.Element(
				{ 
					position: { x: position.x, y: position.y }, 
					size: { width: size.width, height: size.height }, 
					outPorts: ['out'], 
					label: label,
					statusId: statusId,
					id: fsmObject.element[index].id
				});
			}
			//
			//element without id
			else
			{
				el1 = new joint.shapes.html.Element(
				{ 
					position: { x: position.x, y: position.y }, 
					size: { width: size.width, height: size.height }, 
					outPorts: ['out'],
					statusId: statusId, 
					label: label
				});
			}
			graph.addCell(el1);
		}
		
		for(var index = 0; index < fsmObject.link.length; index++)
		{
			var link = new joint.dia.Link({
					source: { id: fsmObject.link[index].sourceId },
					target: { id: fsmObject.link[index].targetId },
					smooth: true,
					attrs: { 
						'.connection': { 'stroke-width': 5, stroke: '#34495E' }, 
						'.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } 
						}
				});
			graph.addCell(link);
		}
		_jointJSObject.graph = graph;
		return _jointJSObject;
	};
	
	
	function adjustVertices(graph, cell) {

		// If the cell is a view, find its model.
		cell = cell.model || cell;
		
		if (cell instanceof joint.dia.Element) {

			_.chain(graph.getConnectedLinks(cell)).groupBy(function(link) {
				// the key of the group is the model id of the link's source or target, but not our cell id.
				return _.omit([link.get('source').id, link.get('target').id], cell.id)[0];
			}).each(function(group, key) {
				// If the member of the group has both source and target model adjust vertices.
				if (key !== 'undefined') adjustVertices(graph, _.first(group));
			});

			return;
		}

		// The cell is a link. Let's find its source and target models.
		var srcId = cell.get('source').id || cell.previous('source').id;
		var trgId = cell.get('target').id || cell.previous('target').id;

		// If one of the ends is not a model, the link has no siblings.
		if (!srcId || !trgId) return;

		var siblings = _.filter(graph.getLinks(), function(sibling) {

			var _srcId = sibling.get('source').id;
			var _trgId = sibling.get('target').id;

			return (_srcId === srcId && _trgId === trgId) || (_srcId === trgId && _trgId === srcId);
		});

		switch (siblings.length) {

		case 0:
			// The link was removed and had no siblings.
			break;

		case 1:
			// There is only one link between the source and target. No vertices needed.
			//cell.unset('vertices');
			targetIsSource(siblings, graph);
			
			break;

		default:
			//control number of link in the same directions
			numberOfLinks(siblings, 1);
			
			// There is more than one siblings. We need to create vertices.

			// First of all we'll find the middle point of the link.
			var srcCenter = graph.getCell(srcId).getBBox().center();
			var trgCenter = graph.getCell(trgId).getBBox().center();
			var midPoint = g.line(srcCenter, trgCenter).midpoint();

			// Then find the angle it forms.
			var theta = srcCenter.theta(trgCenter);

			// This is the maximum distance between links
			var gap = 20;

			_.each(siblings, function(sibling, index) {

				// We want the offset values to be calculated as follows 0, 20, 20, 40, 40, 60, 60 ..
				var offset = gap * Math.ceil(index / 2);

				// Now we need the vertices to be placed at points which are 'offset' pixels distant
				// from the first link and forms a perpendicular angle to it. And as index goes up
				// alternate left and right.
				//
				//  ^  odd indexes 
				//  |
				//  |---->  index 0 line (straight line between a source center and a target center.
				//  |
				//  v  even indexes
				var sign = index % 2 ? 1 : -1;
				var angle = g.toRad(theta + sign * 90);

				// We found the vertex.
				var vertex = g.point.fromPolar(offset, angle, midPoint);

				sibling.set('vertices', [{ x: vertex.x, y: vertex.y}]);
			});
		}
	};
	
	function numberOfLinks(siblings, nrLinkSameDirection)
	{
		if(siblings.length >= 2)
		{
			for(var i = 0; i < siblings.length - 1; i++)
			{
				var sameDir = 1;
				for(var j = i + 1; j < siblings.length; j++)
				{
					if(siblings[i].attributes.source.id == siblings[j].attributes.source.id && siblings[i].attributes.target.id == siblings[j].attributes.target.id)
					{	
						if(sameDir == nrLinkSameDirection)
						{
							siblings[j].remove();
						}
						else 
							sameDir++;
					}
				}
			}
		}
	};
	
	function targetIsSource(siblings, graph)
	{
		//if link source and target is same...
		if(siblings[0].attributes.source.id == siblings[0].attributes.target.id)
		{
			var modelCenter = graph.getCell(siblings[0].attributes.source.id).getBBox().center();
			//console.log(_jointJSObject);
			
			//when model is in left-bottom
			if(_jointJSObject.paper.width < modelCenter.x + 150 && _jointJSObject.paper.height <  modelCenter.y + 150 )
				siblings[0].set('vertices', [{ x: modelCenter.x - 120, y: modelCenter.y - 30 }, { x: modelCenter.x - 120, y: modelCenter.y + 30 }]);
			//when model is right-bottom
			else if(150 > modelCenter.x  && _jointJSObject.paper.height <  modelCenter.y + 150)
				siblings[0].set('vertices', [{ x: modelCenter.x + 50, y: modelCenter.y - 100 }, { x: modelCenter.x - 50, y: modelCenter.y - 100 }]);
			//when model is bottom not in corner
			else if(_jointJSObject.paper.height <  modelCenter.y + 150)
				siblings[0].set('vertices', [{ x: modelCenter.x - 150, y: modelCenter.y - 30 }, { x: modelCenter.x - 150, y: modelCenter.y + 30 }]);
			else
				siblings[0].set('vertices', [{ x: modelCenter.x + 50, y: modelCenter.y + 100 }, { x: modelCenter.x - 50, y: modelCenter.y + 100 }]);
		}
		//
	};
