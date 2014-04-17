
'use strict';


// putting the utilities in the main file
var colorNameToHex = function(colour)
{
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return false;
}




// Initialization of angular root application
var derm_app = angular.module('DermApp', ['ui.bootstrap', 'ngSanitize', 'xml']);

derm_app.value( "ol", ol );

var olViewer = derm_app.factory('olViewer', function(ol, $http, xmlParser) {

        var olViewer = function(viewer_options) {

//            console.log('Creating OLViewer with opts', viewer_options, this);

            var self = this;

            // Instance variables
            this.image_source = undefined;
            this.image_layer = undefined;

            this.map = undefined;

            this.draw_interaction = undefined;
            this.draw_mode = undefined;

            this.last_click_location = undefined;
            this.last_job_id = undefined;
            this.fill_tolerance = 50;


            // annotations added that need to be saved
            this.clearTemporaryAnnotations();


            // annotations previously saved
            this.saved_annotations = [];

            var styleFunction = (function() {
              var styles = {};
              var image = new ol.style.Circle({
                radius: 1,
                fill: null,
                stroke: new ol.style.Stroke({color: 'orange', width: 2})
              });

              styles['Point'] = [new ol.style.Style({image: image})];

              styles['Polygon'] = [new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: 'blue',
                  width: 3
                }),
                fill: new ol.style.Fill({
                  color: 'rgba(0, 0, 255, 0.1)'
                })
              })];
              styles['MultiLinestring'] = [new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: 'green',
                  width: 3
                })
              })];
              styles['MultiPolygon'] = [new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: 'blue',
                  width: 1
                }),
                fill: new ol.style.Fill({
                  color: 'rgba(255, 255, 0, 0.1)'
                })
              })];
              styles['default'] = [new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: 'yellow',
                  width: 3
                }),
                fill: new ol.style.Fill({
                  color: 'rgba(255, 0, 0, 0.1)'
                }),
                image: image
              })];


              styles['normal'] = [new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: 'blue',
                  width: 2
                }),
                fill: new ol.style.Fill({
                  color: 'rgba(0, 0, 255, 0.2)'
                })
              })];
              styles['symmetry'] = [new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: 'black',
                  width: 3
                })
              })];
              styles['lesion'] = [new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: 'red',
                  width: 2
                }),
                fill: new ol.style.Fill({
                  color: 'rgba(255, 0, 0, 0.2)'
                })
              })];              
              
              return function(feature, resolution) {
                // console.log(feature)
                return styles[feature.get('classification')] || styles['default'];
              };
            })();



            // at some point, convert this into multiple layers
            this.vector_source = new ol.source.Vector();

            this.vector_layer = new ol.layer.Vector({
                source: this.vector_source,
                style: styleFunction
            })

            // initialize map (imageviewer)

            this.map = new ol.Map({
                renderer:'canvas',
                target: 'map'
            });
            
            
            // set map event handlers



            this.map.on('singleclick', function(evt) {

                // console.log(evt.coordinate)
                var click_coords = [evt.coordinate[0], -evt.coordinate[1]];

                if (self.draw_mode == 'navigate') {

                    console.log("Click at native px:", click_coords);

                    self.last_click_location = click_coords;

                } else if (self.draw_mode == 'pointlist') {

                    self.last_click_location = evt.coordinate;

                    self.addPoint(evt.coordinate);                	

                } else if (self.draw_mode == 'autofill') {

                    console.log("Click at native px:", click_coords);

                    self.last_click_location = click_coords;
                   	self.autofill(click_coords)

                } else if (self.draw_mode == 'lines') {

                    self.last_click_location = evt.coordinate;

                    self.addPoint(evt.coordinate);
                  
                } 
            });


            // magic wand point style
            var imageStyle = new ol.style.Circle({
              radius: 3,
              fill: new ol.style.Fill({color: '#fff'}),
              stroke: new ol.style.Stroke({color: '#fff', width: 2})
            });

            var sStyle = new ol.style.Stroke({
                color: 'rgba(255, 255, 255, 0.5)',
                width: 2
            });

            var fStyle = new ol.style.Fill({
                 color: 'rgba(0, 0, 255, 0.1)'
            });


            this.map.on('postcompose', function(event) {

              var vectorContext = event.vectorContext;
              var frameState = event.frameState;

              vectorContext.setImageStyle(imageStyle);

              vectorContext.setFillStrokeStyle(fStyle, sStyle);

//              vectorContext.drawMultiPointGeometry(
//                  new ol.geom.MultiPoint(self.temporary_annotations.polygons), null);

//              vectorContext.drawMultiPointGeometry(
//                  new ol.geom.MultiPoint(self.temporary_annotations.lines), null);

//              vectorContext.drawLineStringGeometry(
//                  new ol.geom.LineString(self.temporary_annotations.polygons), null);

              vectorContext.drawLineStringGeometry(
                  new ol.geom.LineString(self.temporary_annotations.lines), null);

              vectorContext.drawPolygonGeometry(
                  new ol.geom.Polygon([self.temporary_annotations.polygons]), null);



//              vectorContext.drawMultiPolygonGeometry(
//                  new ol.geom.Polygon(self.temporary_annotations.polygons), null);

////              vectorContext.drawMultiPointGeometry(
////                  new ol.geom.MultiPoint(self.temporary_annotations.polygons), null);
////


//              vectorContext.drawMultiLineStringGeometry(
//                  new ol.geom.MultiLineString(self.temporary_annotations.lines), null);

//LineString


              self.map.requestRenderFrame();
            });




            // function onMoveEnd(evt) {
            //   var map = evt.map;
            //   var extent = map.getView().calculateExtent(map.getSize());
            //   console.log(extent);
            // }

            // this.map.on('moveend', onMoveEnd);
    
            // add zoom slider
//            var zoomslider = new ol.control.ZoomSlider();
//            this.map.addControl(zoomslider);
        }



        // Define the "instance" methods using the prototype
        // and standard prototypal inheritance.
        olViewer.prototype = {

            clearCurrentImage : function(){

                if(this.image_layer){
                    this.map.removeLayer(this.image_layer);
                }

            },

            hasTemporaryAnnotations : function (){

                var tempLength = this.temporary_annotations.polygons.length + Math.floor(this.temporary_annotations.lines.length / 2)+ this.temporary_annotations.points.length + this.temporary_annotations.select;
                // console.log('Temp length', tempLength);
                return tempLength > 0;

            },

            hasLayerAnnotations : function() {
                return this.saved_annotations.length > 0;
            },


            moveToFeature: function(feature){


                var featuresExtent = ol.extent.createEmpty();

                console.log(feature);
                console.log(feature.getGeometry());
                console.log(ol.extent);

                ol.extent.extend(featuresExtent, feature.getGeometry().getExtent());

                this.map.getView().fitExtent(featuresExtent, this.map.getSize());
            },



            featureListFromAnnotation : function(annotation){

            	// console.log(annotation);

                var features_list = [];

                if (annotation.polygons.length > 0) {

                    var af_feature = new ol.Feature({
                        'classification' : annotation.classification
                    });

                    af_feature.setGeometry(new ol.geom.Polygon([annotation.polygons]))
                    features_list.push(af_feature)
                }

				if (annotation.lines.length > 0) {

                    var l_feature = new ol.Feature({
                        'classification' : annotation.classification
                    });

                    l_feature.setGeometry(new ol.geom.Polygon([annotation.lines]))
                    features_list.push(l_feature)

                }

                return features_list;

            },

            saveSelectionStack : function(selection_stack){

            	// if (this.saved_annotations.length > 0) {
	            // 	var lastAnnotation = this.saved_annotations[this.saved_annotations.length];
	            // 	lastAnnotation.select = selection_stack;
            	// }
            	// else {

					this.temporary_annotations.select = selection_stack;
            		this.temporary_annotations.classification = 'lesion';
					this.saved_annotations.push(this.temporary_annotations);
	
            	// }
            	// var temporary_annotations = $rootScope.imageviewer.saveTemporaryAnnotations($scope.step_config.classification)

            	this.clearTemporaryAnnotations();
            },

            saveTemporaryAnnotations : function (classification){
                // Moves the temporary annotation to the saved annotation state

                console.log('Saving temporary annotation to SavedAnnotationList');

                this.temporary_annotations.createdate = new Date().valueOf();
                this.temporary_annotations.classification = classification
                
                var features = this.featureListFromAnnotation(this.temporary_annotations);

                for(var i=0; i<features.length;i++){
                    this.vector_source.addFeature(features[i])
                }

                this.saved_annotations.push(this.temporary_annotations)

				this.clearTemporaryAnnotations();
            },



            getSavedAnnotations : function(){

                var s = this.saved_annotations;
                this.saved_annotations = [];
                this.vector_source.clear();
                return s;

            },



            setAnnotations : function(annotations){

            	console.log('annotion to set', annotations)

            	if (annotations) {

            		var feature_list = [];	   

            		for(var key in annotations){

            			var features = this.featureListFromAnnotation(annotations[key]);	

		                for(var i=0; i<features.length;i++){
		                    this.vector_source.addFeature(features[i])
		                }

            		}

	            	this.saved_annotations = annotations;

            	};
            },

            addPoint : function(click_coords){

                var pointurl = 'point'
                var msg = {};
                msg['click'] = click_coords
                var self = this;
                // interesting hack to get the UI to update without external scopy applys
                $http.post(pointurl, msg).success(function(response){

                    self.temporary_annotations.lines.push(response.point.click)

                    // only store last two points if we're doing lines of symmetry
                    if (self.draw_mode == 'lines') {

	                    if(self.temporary_annotations.lines.length == 3){
	                        self.temporary_annotations.lines.splice(0,1);
	                    }
	                    	
                    };
                    
                });


            },

            clearTemporaryAnnotations : function(){

				this.temporary_annotations = {
	                polygons : [],
	                lines : [],	
	                points : [],
	                select : [],
	                classification : '',
	                createdate : -1
	            };

            },

            clearLayerAnnotations : function(step){
                console.log('clear?', step);
                this.vector_source.clear();
                this.saved_annotations = [];
            },

            acceptPainting : function(){

                var annotation = this.segmentannotator.getAnnotation();

                var extent = this.map.getView().calculateExtent(this.map.getSize());
                var tr = ol.extent.getTopRight(extent)
                var tl = ol.extent.getTopLeft(extent)
                var bl = ol.extent.getBottomLeft(extent)

                var segmenturl = 'segment'

                var msg = {};
                msg['image'] = annotation
                msg['extent'] = [tr, bl]

                var self = this;
                // interesting hack to get the UI to update without external scopy applys
                $http.post(segmenturl, msg).success(function(response){

                    self.temporary_annotations.polygons = []

                    var contours = JSON.parse(response.contourstr);
                    console.log(contours[0]);

                    self.temporary_annotations.polygons = contours[0].slice()

                    delete self.segmentannotator;

                    $('#annotatorcontainer').empty();

                    self.map.unfreezeRendering();
                    self.map.requestRenderFrame();

                    // console.log(self.temporary_annotations.autofill);
                    // var inner = JSON.parse(response.contour.inner);
                    
                    // var transform = JSON.parse(response.xform);
                    
                    // self.segmentation_list = [];
                    // self.temporary_annotations.autofill = []

                    // var applyTransform = function(pt, _transform){
                    //     var px = (pt[0] / _transform.scale[0]) + _transform.offset[0];
                    //     var py = - (pt[1] / _transform.scale[1]) + _transform.offset[1];
                    //     return [px, py];
                    // }

                    // for (var j =0; j < outer.length; j++)
                    // {                        
                    //     var c = applyTransform(outer[j][0], transform);

                    //     self.temporary_annotations.autofill.push(c)
                    // }

                    // for (var j =0; j < inner.length; j++)
                    // {                        
                    //     var c = applyTransform(inner[j][0], transform);

                    //     self.temporary_annotations.autofill.push(c)
                    // }
                    // self.temporary_annotations.lines.push(response.point.click)

                    // if(self.temporary_annotations.lines.length == 3){
                    //     self.temporary_annotations.lines.splice(0,1);
                    // }
                    
                });

            },


            startPainting : function(){

            // if ('download' in exportPNGElement) {
            //   exportPNGElement.addEventListener('click', function(e) {
            //     map.once('postcompose', function(event) {
            //       var canvas = event.context.canvas;
            //       exportPNGElement.href = canvas.toDataURL('image/png');
            //     });
            //     map.render();
            //   }, false);

                var self = this;

                this.map.once('postcompose', function(event) {

                    var canvas = event.context.canvas;

                    self.segmentannotator = new SLICSegmentAnnotator(canvas, {
                        regionSize: 80,
                        container: document.getElementById('annotatorcontainer'),
                        backgroundColor: [0,0,0],
                        // annotation: 'annotation.png' // optional existing annotation data.
                        labels: [
                          {name: 'background', color: [255, 255, 255]},
                          'lesion',
                          'normal',
                          'other'
                          ],
                        onload: function() {
                          // initializeLegend(this);
                          // initializeLegendAdd(this);
                          // initializeButtons(this);
                        }
                      });


                    self.segmentannotator.setCurrentLabel(3);

                    self.map.freezeRendering();


                //   // exportPNGElement.href = canvas.toDataURL('image/png');
                });



                // this.map.freezeRendering();
                // this.map.render();



                // var self = this;

                // var extent = this.map.getView().calculateExtent(this.map.getSize());
                // var tr = ol.extent.getTopRight(extent)
                // var tl = ol.extent.getTopLeft(extent)
                // var bl = ol.extent.getBottomLeft(extent)

                // // think: if x is positive on left, subtract from total width
                // // if x on right is greater than width, x = width

                // var origin_x = 0;
                // var origin_y = 0;

                // var click_x_offset = 0;
                // var click_y_offset = 0;

                // var newWidth = this.nativeSize.w;

                // if(tr[0] < this.nativeSize.w) {
                //     newWidth = tr[0];
                // };
                // if(tl[0] > 0) {
                //     newWidth -= tl[0]
                //     origin_x = tl[0]
                //     click_x_offset
                // };

                // var newHeight = this.nativeSize.h;
                
                // if(- bl[1] < this.nativeSize.h) {
                //     newHeight = -bl[1];
                // };
                // if(tl[1] < 0) {
                //     newHeight += tl[1]
                //     origin_y = -tl[1];
                // }                

                // console.log(origin_x, origin_y, newWidth, newHeight);

                // if (newWidth <= 0 || newHeight <= 0){
                //     console.log('offscreen or invalid region')
                // };

                // var rel = []
                // rel[0] = origin_x / this.nativeSize.w;
                // rel[1] = origin_y / this.nativeSize.h;
                // rel[2] = newWidth / this.nativeSize.w;
                // rel[3] = newHeight / this.nativeSize.h;

                // var dataurl = function(rel, width){
                //     return '&WID=' + width + '&RGN=' + rel.join(',') + '&CVT=jpeg'
                // }

                // // var url_to_use = this.data_url + '&WID=400&RGN=0.25,0.25,0.5,0.5&CVT=jpeg'
                
                // var url_to_use = this.data_url + dataurl(rel, newWidth);


                // new SLICSegmentAnnotator(url_to_use, {
                //     regionSize: 70,
                //     container: document.getElementById('annotatorcontainer'),
                //     backgroundColor: [0,0,0],
                //     // annotation: 'annotation.png' // optional existing annotation data.
                //     labels: [
                //       {name: 'background', color: [255, 255, 255]},
                //       'lesion',
                //       'normal',
                //       'other'
                //       ],
                //     onload: function() {
                //       // initializeLegend(this);
                //       // initializeLegendAdd(this);
                //       // initializeButtons(this);
                //     }
                //   });

                // <a id="export-png" class="btn" download="map.png"><i class="icon-download"></i> Export PNG</a>
        

            },

            setFillParameter : function(new_fill_tolerance){

                this.fill_tolerance = new_fill_tolerance;


            },

            regenerateFill : function(){

              this.autofill(this.last_click_location);

            },



            autofill : function(click_coords){

                var self = this;

                var extent = this.map.getView().calculateExtent(this.map.getSize());
                var tr = ol.extent.getTopRight(extent)
                var tl = ol.extent.getTopLeft(extent)
                var bl = ol.extent.getBottomLeft(extent)

                // think: if x is positive on left, subtract from total width
                // if x on right is greater than width, x = width

                var origin_x = 0;
                var origin_y = 0;

                var click_x_offset = 0;
                var click_y_offset = 0;

                var newWidth = this.nativeSize.w;

                if(tr[0] < this.nativeSize.w) {
                    newWidth = tr[0];
                };
                if(tl[0] > 0) {
                    newWidth -= tl[0]
                    origin_x = tl[0]
                };

                var newHeight = this.nativeSize.h;
                
                if(- bl[1] < this.nativeSize.h) {
                    newHeight = -bl[1];
                };
                if(tl[1] < 0) {
                    newHeight += tl[1]
                    origin_y = -tl[1];
                }                

                console.log(origin_x, origin_y, newWidth, newHeight);

                if (newWidth <= 0 || newHeight <= 0){
                    console.log('offscreen or invalid region')
                };

                var rel = []
                rel[0] = origin_x / this.nativeSize.w;
                rel[1] = origin_y / this.nativeSize.h;
                rel[2] = newWidth / this.nativeSize.w;
                rel[3] = newHeight / this.nativeSize.h;

                var dataurl = function(rel, width){
                    return '&WID=' + width + '&RGN=' + rel.join(',') + '&CVT=jpeg'
                }

                // var url_to_use = this.data_url + '&WID=400&RGN=0.25,0.25,0.5,0.5&CVT=jpeg'
                var url_to_use = this.data_url + dataurl(rel, 500);

                var subimage = {}
                subimage.origin = [origin_x, origin_y]
                subimage.size = [newWidth, newHeight]
                subimage.rel = rel;
                var origimage = {}
                origimage.origin = [0,0]
                origimage.size = [this.nativeSize.w, this.nativeSize.h]


                // relative click is not based on the image origin, but rather the extent origin
                var click = {}
                click.absolute = click_coords;
                click.relative = [(click_coords[0])/this.nativeSize.w, (click_coords[1])/this.nativeSize.h]


                var msg = {}
                msg.image = {}
                msg.image.region = subimage
                msg.image.base = origimage
                msg.image.url = url_to_use
                msg.tolerance = this.fill_tolerance;
                msg.click = click

                // console.log(msg);

                var segmentURL = 'fill'

                $http.post(segmentURL, msg).success(function(response){

//                    console.log(response)
//                    self.last_job_id = response.jobid;

                    var outer = JSON.parse(response.result.contour.outer);
                    // var inner = JSON.parse(response.contour.inner);

//                    var transform = JSON.parse(response.result.xform);

                    // self.segmentation_list = [];
                    self.temporary_annotations.polygons = []

//                    var applyTransform = function(pt, _transform){
//                        var px = (pt[0] / _transform.scale[0]) + _transform.offset[0];
//                        var py = - (pt[1] / _transform.scale[1]) + _transform.offset[1];
//                        return [px, py];
//                    }
//
                    for (var j =0; j < outer.length; j++)
                    {
//                        var c = applyTransform(outer[j][0], transform);
//
                        self.temporary_annotations.polygons.push(outer[j][0])
                    }

                    // console.log(self.temporary_annotations.polygons);

                    // for (var j =0; j < inner.length; j++)
                    // {                        
                    //     var c = applyTransform(inner[j][0], transform);
                    //     self.temporary_annotations.autofill.push(c)
                    // }

                });

            },

            hasJobResult : function(results){

                if(results.uuid == this.last_job_id){

                    console.log(results.result);
//
//                    console.log('use me', results)
//
//                    var result_url = 'http://localhost:5555/api/task/result/' + results.uuid
//
//                    $http.get(result_url, function(response){
//
//                        console.log(response)
//
//                        var outer = JSON.parse(response.contour.outer);
//                        // var inner = JSON.parse(response.contour.inner);
//
//                        var transform = JSON.parse(response.xform);
//
//                        // self.segmentation_list = [];
//                        self.temporary_annotations.polygons = []
//
//                        var applyTransform = function(pt, _transform){
//                            var px = (pt[0] / _transform.scale[0]) + _transform.offset[0];
//                            var py = - (pt[1] / _transform.scale[1]) + _transform.offset[1];
//                            return [px, py];
//                        }
//
//                        for (var j =0; j < outer.length; j++)
//                        {
//                            var c = applyTransform(outer[j][0], transform);
//
//                            self.temporary_annotations.polygons.push(c)
//                        }
//
//                    })

                }

            },

            setDrawMode : function(draw_mode) {

                this.draw_mode = draw_mode;

                console.log(this.draw_mode);

                if (draw_mode == 'navigate') {
                } else if (draw_mode == 'paintbrush') {
                } else if (draw_mode == 'autofill') {
                } else if (draw_mode == 'lines') {
                } 

            },

            loadImageWithURL : function(dzi_url) {

                var self = this;
                self.segmentation_list = [];

                var base_array = dzi_url.split('DeepZoom')
                var data_array = dzi_url.split('DeepZoom')

                base_array.splice(1, 0, "Zoomify");
                data_array.splice(1, 0, 'FIF')

                var zoomify_join = base_array.join('');
                var zoomify_url =  zoomify_join.substr(0, zoomify_join.length - 4);

                var data_join = data_array.join('')
                var data_url = data_join.substr(0, data_join.length - 4);

                self.zoomify_url = zoomify_url;
                self.data_url = data_url;

                var image_properties_xml = zoomify_url + '/ImageProperties.xml'

                $http.get(image_properties_xml).then(function (hresp) {

                    /* Parse a Zoomify protocol metadata request

                    */
                    var parseMetaData = function(response){
                        // Simply split the reponse as a string
                        var tmp = response.split('"');
                        var w = parseInt(tmp[1]);
                        var h = parseInt(tmp[3]);
                        var ts = parseInt(tmp[11]);
                        // Calculate the number of resolutions - smallest fits into a tile
                        var max = (w>h)? w : h;
                        var n = 1;
                        while( max > ts ){
                          max = Math.floor( max/2 );
                          n++;
                        }
                        var result = {
                          'max_size': { w: w, h: h },
                          'tileSize': { w: ts, h: ts },
                          'num_resolutions': n
                        };
                        return result;
                    }

                    var metadata = parseMetaData(hresp.data)
                    // console.log(metadata);

                    self.imageCenter = [metadata.max_size.w / 2, - metadata.max_size.h / 2];

                    self.proj = new ol.proj.Projection({
                        code: 'ZOOMIFY',
                        units: 'pixels',
                        extent: [0, 0, metadata.max_size.w, metadata.max_size.h]
                    });

                    var crossOrigin = 'anonymous';

                    self.image_source = new ol.source.Zoomify({
                        url: zoomify_url + '/',
                        size: [metadata.max_size.w, metadata.max_size.h],
                        crossOrigin: crossOrigin,

                    });

                    self.image_layer = new ol.layer.Tile({
                       source: self.image_source,
                       preload: 1
                    })

                    self.nativeSize = metadata.max_size;

                    self.view = new ol.View2D({
                      projection: self.proj,
                      center: self.imageCenter,
                      zoom: 2,
                      maxZoom: metadata.num_resolutions 
                    })       

                    self.map.addLayer(self.image_layer);
                    self.map.addLayer(self.vector_layer);
                    self.map.setView(self.view);

                })
            }
        }

        return( olViewer );

        }
    );
    


































// Initialization of angular app controller with necessary scope variables. Inline declaration of external variables
// needed within the controller's scope. State variables (available between controllers using $rootScope). Necessary to
// put these in rootScope to handle pushed data via websocket service.
var appController = derm_app.controller('ApplicationController', ['$scope', '$rootScope', '$location', '$timeout', '$http', 'imageList', 'decisionTree', 'olViewer', 'WebSocketService',
    function ($scope, $rootScope, $location, $timeout, $http, imageList, decisionTree, olViewer, WebSocketService) {

        // global ready state variable
        $rootScope.applicationReady = false;

        $rootScope.imageviewer = undefined;

         // pull user variables (via template render) in js app...
         var current_user = $("#user_email").val();
         var current_user_id = $("#user_id").val();
         $rootScope.user_email = current_user;
         $rootScope.user_id = current_user_id;


        // initial layout    
        $("#angular_id").height(window.innerHeight);
        $("#map").height(window.innerHeight);






        $rootScope.image_list = [];
        $rootScope.image_index = undefined;

        var useRandomStart = false;
        if(useRandomStart){
            $rootScope.startingIndex =  Math.floor(175 * Math.random());
        }
        else{
            $rootScope.startingIndex = 0;    
        }
        

        $timeout(function(){
            $rootScope.ApplicationInit();
        }, 150);


        // main application, gives a bit of a delay before loading everything
        $rootScope.ApplicationInit = function() {

             $rootScope.debug  = $location.url().indexOf('debug') > -1;

             // load subject list from the query
             var shouldShuffle = false;

             imageList.fromDB(current_user, $rootScope.startingIndex, 10, shouldShuffle).then(function(d){

                $rootScope.image_list = d;

             });

             decisionTree.fromLocal().then(function(d){
                $rootScope.decision_tree = d;
             });

            $rootScope.imageviewer = new olViewer({'div' : 'annotationView'});

            $rootScope.applicationReady = true;

        };

        $rootScope.hasJobResult = function(result_contents){

            $rootScope.imageviewer.hasJobResult(result_contents)

        }


        $scope.safeApply = function( fn ) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if(fn) { fn(); }
            } else {
                this.$apply(fn);
            }
        };


        // effectively a callback from the initial subject query
        $rootScope.$watch('image_list', function(newValue, originalValue) {
            if($rootScope.applicationReady){
                $rootScope.image_index = 0;    
            }
        });


        $rootScope.getActiveImage = function(){
            if($rootScope.applicationReady){
                return $rootScope.image_list[$rootScope.image_index];
            }
            return undefined;
        }

        $rootScope.$watch('image_index', function(newValue, originalValue) {
            if ($rootScope.applicationReady) {
                var activeImage = $rootScope.getActiveImage();
                $rootScope.imageviewer.clearCurrentImage();
                $rootScope.imageviewer.loadImageWithURL(activeImage.dzi_source);
            }
        });

}]);







var annotationTool = derm_app.controller('AnnotationTool', ['$scope', '$rootScope', '$timeout', '$sanitize', '$http', '$modal', '$log',
    function ($scope, $rootScope, $timeout, $sanitize, $http, $modal, $log) {

        console.log('Initialized annotation tool.');


        $scope.draw_mode = 'navigate';


        $scope.completedImages = 0;
        $scope.totalItems = 0;

        $scope.step = -1;
        $scope.totalSteps = 0;

        // local scope from nested vars
        $scope.step_config = undefined;
        $scope.tool_bar_state = undefined;
        $scope.active_image = undefined;
        $scope.step_options = undefined;
        $scope.step_base = '';

        $scope.select_stack = [];
        $scope.select_last = undefined;

        $scope.annotations = undefined;
        $scope.magicwand_tolerance = 50;
        $scope.regionpaint_size = 70;


        $rootScope.$watch('image_index', function(newValue, originalValue) {

            if ($rootScope.applicationReady) {
                $scope.active_image = $rootScope.getActiveImage();
            };
        });

		$rootScope.$watch('image_list', function(newValue, originalValue) {

            if ($rootScope.applicationReady) {

            	$scope.totalItems = $rootScope.image_list.length;

            	$scope.annotations = [];


            	$.each($rootScope.image_list, function(n, image_data){

                     var placeholder_obj = {
                         complete: false,
                         annotationid: undefined,
                         step: {},
                         userid: $rootScope.current_user_id,
                         imageid: image_data.DA_id,
                         mskccid: image_data.DA_key,
                         saved: false,
                         lastUpdateDate: -1
                     };

                     $scope.annotations.push(placeholder_obj);
                 });            		

            	
//            	console.log('annotations?', $scope.annotations);
            };
        });


        // shortcut key bindings -> takes you home to task list
        Mousetrap.bind( ['ctrl+q'], function(evt) {
            if (typeof (evt.preventDefault) === 'function') {evt.preventDefault();}
            else {evt.returnValue = false}
            $rootScope.debug = !$rootScope.debug;
            $scope.$apply();
        });

        // shortcut key bindings -> takes you home to task list
        Mousetrap.bind( ['space'], function(evt) {
            if (typeof (evt.preventDefault) === 'function') {evt.preventDefault();}
            else {evt.returnValue = false}

            console.log('space');
            $scope.nextStep();
//            $rootScope.debug = !$rootScope.debug;
            $scope.$apply();
        });


        Mousetrap.bind( ['up'], function(evt) {
            if (typeof (evt.preventDefault) === 'function') {evt.preventDefault();}
            else {evt.returnValue = false}

            console.log('increase value');
            $scope.increaseParameter();

//            $rootScope.debug = !$rootScope.debug;
            $scope.$apply();

        });


        Mousetrap.bind( ['down'], function(evt) {
            if (typeof (evt.preventDefault) === 'function') {evt.preventDefault();}
            else {evt.returnValue = false}

            console.log('decrease value');
            $scope.decreaseParameter();
//            $rootScope.debug = !$rootScope.debug;
            $scope.$apply();

        });


        // watches

        // effectively a callback from the initial subject query
        $rootScope.$watch('decision_tree', function(newValue, originalValue) {

            if($rootScope.applicationReady){
            
                console.log("There are " + $rootScope.decision_tree.length + ' steps');

                $scope.totalSteps = $rootScope.decision_tree.length;



            }
        });




        // Accessors

        $scope.getCurrentStepConfig = function(){
            if ($scope.step >= 0) {
                return $rootScope.decision_tree[$scope.step]    
            };

            return undefined;
        }

        $scope.getCurrentAnnotation = function(){
        	if($rootScope.applicationReady){
        		if ($scope.annotations) {
        			return $scope.annotations[$scope.image_index];	
        		};
        	}
        	return undefined;
        }


        // setters

        $scope.saveStepAnnotation = function(annotations, step_to_save){

        	var currentAnnotation = $scope.getCurrentAnnotation();
        	currentAnnotation.step[step_to_save] = annotations;
        }

        $scope.getStepAnnotations = function(){

        	var currentAnnotation = $scope.getCurrentAnnotation();
        	console.log('current annotation', currentAnnotation);
        	return currentAnnotation.step[$scope.step]
        }



        // controls

        $scope.selectImage = function(selected_index){
            $rootScope.image_index = selected_index;
        }

        $scope.nextStep = function(){

            // if we have the step config, use it to define next step
            if($scope.step_config){

                if($scope.step_config.next != $scope.step){

                    $scope.gotoStep($scope.step_config.next);
                }
                else {
                    console.log('already at this step');
                }
            }
            else {
                console.log('next', $scope.step+1)
                $scope.gotoStep($scope.step+1);

            }




        }

        $scope.previousStep = function(){
            $scope.gotoStep($scope.step-1);
        }

        $scope.help = function(help_val)
        {
            alert('help!');
        }

        $scope.increaseParameter = function(){

            if($scope.tool_bar_state == 'mwdefine'){
                $scope.magicwand_tolerance += 5;
                $scope.imageviewer.setFillParameter($scope.magicwand_tolerance);
                $scope.imageviewer.regenerateFill();
            }


        }

        $scope.decreaseParameter = function(){

            if($scope.tool_bar_state == 'mwdefine'){

                if($scope.magicwand_tolerance >= 5){
                    $scope.magicwand_tolerance -= 5;
                }
                else {
                    $scope.magicwand_tolerance = 0;
                }

                $scope.imageviewer.setFillParameter($scope.magicwand_tolerance);
                $scope.imageviewer.regenerateFill();
            }
        }








        // initial function when a step is loaded
        $scope.loadStep = function(){



            // get current step configuration
            $scope.step_config = $scope.getCurrentStepConfig();

            console.log($scope.step_config);

            // clear viewer current and temporary annotations
            $scope.clearStep();

            // load previous annotations if there are any
            var stepAnnotations = $scope.getStepAnnotations();

            if (stepAnnotations) {

                $rootScope.imageviewer.setAnnotations(stepAnnotations);

                for(var i=0; i<stepAnnotations.length;i++){
                    if(stepAnnotations[i].select.length > 0){
                        $scope.select_stack = stepAnnotations[i].select;
                    }
                }
            }
            else {

                // this step doesn't have annotations, do appropriate step selection processing steps (aka auto)


            }

            if($scope.step_config){

                // set imageviewer to current step configuration
                if ($scope.step_config.default != "") {

                    $rootScope.imageviewer.setDrawMode($scope.step_config.default);

                }
                else {
                    $rootScope.imageviewer.setDrawMode('navigate');
                }

                if($scope.step_config.zoom == "lesion"){

                    console.log('test')

                    var bounds = $scope.getLesionBoundary();

                }


                // set some UI helpers
                $scope.step_options = $scope.step_config.options;
                $scope.step_base = $scope.step_config.step;

                console.log('Finished loading step', $scope.step_config.step);


            }


        }



        $scope.clearStep = function(){


            // if no annotations, do nothing.

            // if only saved annotations, do nothing (for now)

            // if stable imageviewer annotations, clear them

//            $scope.clearStableAnnotations();

            // if temporary imageviewer annotations, clear them
            $scope.clearTempAnnotations();

            // if stack exists, clear it
            $scope.clearStackAnnotations();

            // return to original step definition
            if($scope.step_config){
                $scope.tool_bar_state = $scope.step_config.type;
            }


        }



        $scope.getLesionBoundary = function(){


        	var currentAnnotation = $scope.getCurrentAnnotation();


            console.log(features);

            var step_zero = currentAnnotation.step[0];

            var lesion_zero = step_zero[0]

            var features = $rootScope.imageviewer.featureListFromAnnotation(lesion_zero);

            console.log(features);

            var first_feature = features[0]

            $rootScope.imageviewer.moveToFeature(first_feature);

//
//            var minpt = { x : 100000, y: 100000 }
//            var maxpt = { x : -100000, y: -10000 }
//
//
//            for(var pt in lesion_zero){
//
////                console.log(lesion_zero[pt]);
//
//                if(lesion_zero[pt][0] < minpt.x) {
//                   minpt.x = lesion_zero[pt][0]
//                }
//
//                // remember y is flipped in annotation coords
//                if((-1) * lesion_zero[pt][1] <  minpt.y) {
//                    minpt.y = (-1) * lesion_zero[pt][1]
//                }
//
//
//                if(lesion_zero[pt][0] > maxpt.x) {
//                   maxpt.x = lesion_zero[pt][0]
//                }
//
//                // remember y is flipped in annotation coords
//                if((-1) * lesion_zero[pt][1] >  maxpt.y) {
//                    maxpt.y = (-1) * lesion_zero[pt][1]
//                }
//
//
//            }
//
////            console.log(step_zero);
////            console.log(minpt, maxpt)
//
//            $rootScope.imageviewer.moveToBounds([maxpt.x, - maxpt.y, minpt.x, - minpt.y]);
//
//            return { min: minpt, max: maxpt};

        }







        // saved annotations refers to the annotation stack maintained by this controller
        $scope.clearSavedAnnotations = function(){



        }

        // this will clear the
        $scope.clearLayerAnnotations = function(){

            $rootScope.imageviewer.clearLayerAnnotations();


        }

        // This will clear the image viewer temporary annotations
        $scope.clearTempAnnotations = function(){

            $rootScope.imageviewer.clearTemporaryAnnotations();

        }

        // This clears the selection stack for overall pattern
        $scope.clearStackAnnotations = function(){

            // clear the selection stack
            $scope.select_stack = [];
            $scope.select_last = undefined;

            if($scope.step_config){

                $scope.step_base = $scope.step_config.step;
                $scope.step_options = $scope.step_config.options;


            }

        }


        // This will save the current image viewer annotations to this controller
        $scope.saveViewerAnnotations = function(){

            if ($rootScope.imageviewer.hasTemporaryAnnotations()){

                console.log('Saving temporary annotations to stable')

                $rootScope.imageviewer.saveTemporaryAnnotations($scope.step_config.classification)

            }


            if ($rootScope.imageviewer.hasLayerAnnotations()){

                console.log('Saving stable annotations to controller')

                $scope.saveStepAnnotation($rootScope.imageviewer.getSavedAnnotations(), $scope.step);
            }

        }




































//        $scope.resetStep = function(){
//
//            //
//            if($scope.stepHasAnnotations($scope.step) || $rootScope.imageviewer.hasSavedAnnotations()){
//
//                $rootScope.imageviewer.clearTemporary();
//                $rootScope.imageviewer.clearSaved()
//
//            }
//            else {
//
//                $rootScope.imageviewer.clearTemporary();
//
//            }
//
//
//
//
//            // if we're returning from a selectadvanced workflow, keep stack and add
//            if ($scope.select_last){
//
//            	console.log('completed annotation');
//
//                $scope.select_stack.push($scope.select_last)
//
//               	console.log($scope.step_options);
//
//				$rootScope.imageviewer.saveSelectionStack($scope.select_stack);
//
//            	$scope.select_last = undefined;
//
//
//            }
//            else {
//
//                // not in selectadvanced, just reset things
//
//	            $scope.step_config = $scope.getCurrentStepConfig();
//
//	            if ($scope.step_config.default != "") {
//					$rootScope.imageviewer.setDrawMode($scope.step_config.default);
//	            }
//	            else {
//	            	$rootScope.imageviewer.setDrawMode('navigate');
//	            }
//
//            	$scope.step_options = $scope.step_config.options;
//            	$scope.step_base = $scope.step_config.step;
//
//            	$scope.select_stack = [];
//            }
//
//            $scope.tool_bar_state = $scope.step_config.type; // load defaults, will adjust as navigating tree
//        }




        $scope.gotoStep = function(step){

            if (step < $scope.totalSteps) {

                // pre step change transition
                $scope.saveViewerAnnotations();

                $scope.step = step;

                $scope.loadStep();

            }
            else if (step == $scope.totalSteps) {

            	console.log($scope.getCurrentAnnotation());

            	var msg ={};

				msg['user_id'] = $rootScope.user_id;
                msg['image'] = $scope.active_image;
				msg['annotation'] = $scope.getCurrentAnnotation()

                var self = this;



                var annotation_url = 'annotation/'
                $http.post(annotation_url, msg).success(function(response){

                	console.log('Post response:', response);

                	$scope.step = -1;
                    $scope.step_config = undefined;


                    var c_count = 0;
                    for(var i = 0; i < $scope.annotations.length; i++){
                        if(Object.keys($scope.annotations[i].step).length >0){
                            c_count += 1
                        }
                    }

                    $scope.completedImages = c_count;

                    // self.temporary_annotations.lines.push(response.point.click)

                    // // only store last two points if we're doing lines of symmetry
                    // if (self.draw_mode == 'lines') {

	                   //  if(self.temporary_annotations.lines.length == 3){
	                   //      self.temporary_annotations.lines.splice(0,1);
	                   //  }

                    // };

                });
            }
        }




// Point list / perimeter methods


        $scope.startPointList = function(){
        	$scope.tool_bar_state = 'pldefine';
        	$rootScope.imageviewer.setDrawMode('pointlist');
        }








// Paint by numbers methods

        $scope.startRegionPaint = function(){

        	$scope.tool_bar_state = 'rpdefine';
            $rootScope.imageviewer.setDrawMode('paintbrush');
        }

        $scope.runRegionPaint = function(){

        	$scope.tool_bar_state = 'rppaint';
        	$rootScope.imageviewer.startPainting();

        }

        $scope.finishRegionPaint = function(){

			$scope.tool_bar_state = 'rpreview';
            $rootScope.imageviewer.acceptPainting();

//            $scope.nextStep();

        }

        $scope.cancelRegionPaint = function(){

        	$rootScope.imageviewer.acceptPainting();
        	$rootScope.imageviewer.clearTemporary();

        	$scope.resetStep();
        }




// Magic wand methods


        $scope.startMagicWand = function(){
            $scope.tool_bar_state = 'mwdefine';
            $rootScope.imageviewer.setDrawMode('autofill');
        }




// Universal annotation methods


        // converts a temporary annotation into a valid annotation in the imageviewer
        $scope.acceptRegion = function(){

            $rootScope.imageviewer.saveTemporaryAnnotations($scope.step_config.classification)

        }
























//        $scope.acceptMagicWand = function(){
//            $scope.tool_bar_state = 'mwaccept';
//        }











//                $scope.resetStep();

//                var stepAnnotations = $scope.getStepAnnotations()
//
//                console.log('step annotations', stepAnnotations);
//
//                if (stepAnnotations) {
//
//                	$rootScope.imageviewer.setAnnotations(stepAnnotations);
//
//                	for(var i=0; i<stepAnnotations.length;i++){
//                		if(stepAnnotations[i].select.length > 0){
//                			$scope.select_stack = stepAnnotations[i].select;
//                		}
//                	}
//                }
//                else {
//
//                    // this step doesn't have annotations, do appopriate step selection processing steps (aka auto)
//                    console.log($scope.step_config);
//
//                    if($scope.step_config.type == 'autopbn'){
//
//
//                        console.log('zoom to full size')
//
//                        $scope.runRegionPaint();
//
//
//
//                    }
//
//
//                }

//
//            }

//        }



//        $scope.startLines = function(){
//			$rootScope.imageviewer.setDrawMode('lines');
//        }















//        $scope.clearPoints = function(){
//
//        	$rootScope.imageviewer.clearTemporary();
//        };
//
//
//        $scope.clearSavedPoints = function(step){
//            $rootScope.imageviewer.clearSavedStep(step);
//        }


//
//		$scope.saveCurrentPointsAsPolygon = function(){
//
//		     if ($rootScope.applicationReady)
//		     {
//
//		     	var temporary_annotations = $rootScope.imageviewer.saveTemporaryAnnotations($scope.step_config.classification)
//
//                console.log('temp', temporary_annotations);
//
////                $scope.nextStep();
//
//                 $scope.resetStep();
//
//		        return temporary_annotations;
//
//		     }
//		}






		$scope.selectOption = function(key, option_to_select) {


			var selected_url = 'static/rev3/' + $scope.step_base + '/' + (key+1) + '.jpg'

			console.log('selected url', selected_url)

			var select_single = {
				url : selected_url,
				key : key
			}
			
			if(option_to_select.type == 'select'){

				$scope.select_stack.push(select_single);
				$scope.step_options = option_to_select.options;
				$scope.step_base = $scope.step_base + '/' + (key+1);

			}
			else if (option_to_select.type == 'review') {


				$scope.select_stack.push(select_single);
				$rootScope.imageviewer.saveSelectionStack($scope.select_stack);
	        	$scope.tool_bar_state = option_to_select.type;

                $scope.openModalWithOptions(option_to_select);

			}
            else if (option_to_select.type == 'gotostep'){

                console.log(option_to_select.value);
                $scope.gotoStep(option_to_select.value);

            }


//			else if (option_to_select.type == 'selectadvanced') {
//
//				$scope.select_last = select_single;
//
//				// $rootScope.imageviewer.saveSelectionStack($scope.select_stack);
//
//				$scope.step_options = option_to_select.options;
//
//				$scope.step_base = $scope.step_base + '/' + (key+1);
//
//	        	$scope.tool_bar_state = option_to_select.type;
//
//
//			}
//			else if(option_to_select.type == 'next') {
//
//				console.log('proceeding to next step');
//
//				$scope.nextStep();
//
//			}

		}


        var ModalInstanceCtrl = function ($scope, $modalInstance, options) {

            $scope.base = options;
            $scope.selectOption = function(opt){
                $modalInstance.close(opt);
            }

        };



        $scope.openModalWithOptions = function(options){

            console.log(options)

            $scope.modal_options = options.options[0]

            var modalInstance = $modal.open({
              templateUrl: 'myModalContent.html',
              controller: ModalInstanceCtrl,
              backdrop: 'static',
              keyboard: false,
              resolve: {
                options: function () {
                  return $scope.modal_options;
                }
              }
            });

            modalInstance.result.then(function (selectedOption) {

                console.log(selectedOption);

                // assuming we have steps to go to

                $scope.gotoStep(selectedOption.value);

            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });

        }

        $scope.deleteSaved = function(key){

            if ($rootScope.applicationReady)
            {

            	var current_annotation = this.getCurrentAnnotation();

                if(current_annotation){


//                    console.log(current_annotation.step)


//                    console.log(current_annotation.step.hasOwnProperty(key))

//                    console.log(Object.keys(current_annotation.step).indexOf(key))

                    if (current_annotation.step.hasOwnProperty(key)){


//                        console.log($scope.annotations[$scope.image_index].step)

                        delete $scope.annotations[$scope.image_index].step[key];

//                        console.log('after', $scope.annotations[$scope.image_index].step)

                        $scope.clearLayerAnnotations();

//                        delete current_annotation.step[key];

//                        console.log('deleted', current_annotation.step)

//                        $scope.loadStep();

                    }

                }
            }

            return false;

        }

        // state functions 

        $scope.showIfStep = function(step){            
            return parseInt(step) == $scope.step;
        }

        $scope.showIfStepGTE = function(step){
        	return parseInt(step) <= $scope.step;	
        }

        $scope.compareState = function(target, current_value){
            return target == current_value;
        }



        // if there are any annotations, you can proceed
        $scope.hasAnnotations = function(){
            return ($scope.hasTemporaryAnnotations() || $scope.hasLayerAnnotations());
        }

        $scope.imageHasAnnotations = function(index){

            if ($rootScope.applicationReady)
            {
                var current_annotation = $scope.annotations[index];

                if(current_annotation){
                    return (Object.keys(current_annotation.step).length > 0);
                }
            }
            return false;
        }

        //temporary annotations = points that need to be converted into a polygon
        $scope.hasTemporaryAnnotations = function(){

            if ($rootScope.applicationReady)
            {
                return $rootScope.imageviewer.hasTemporaryAnnotations();
            }
            return false;
        }

        // saved annotations = points that have been converted... NOT TO BE CONFUSED WITH STEP annotations
        $scope.hasLayerAnnotations = function(){
            if ($rootScope.applicationReady)
            {
                return $rootScope.imageviewer.hasLayerAnnotations();
            }
            return false;
        }

        $scope.stepHasAnnotations = function(step){

            if ($rootScope.applicationReady)
            {
            	var current_annotation = this.getCurrentAnnotation();

            	if (current_annotation) {

	            	var step_annotation = current_annotation.step[step]

	            	if(step_annotation){

	            		// console.log('step', step_annotation)	
	            		return step_annotation.length > 0;
	            	}


            	}
//                else {
//                    console.log('annotation doesnt exist');
//                }

            }
            return false;
        }







        $scope.updateCompleteState = function() {

            if($rootScope.annotation_list.length > 0)
            {
                // update current image state
                var o = $rootScope.annotation_list[$rootScope.image_index];
                var is_complete = true;
                is_complete = o.step[1].length > 0 && is_complete;
                is_complete = o.step[2].length > 0 && is_complete;
                is_complete = o.step[3].length > 0 && is_complete;
                // is_complete = o.details.length > 0 && is_complete;

                o.complete = is_complete;

                // recalculate the total complete count
                var completed = 0;

                $.each($rootScope.annotation_list, function(n, subject_data){

                    if(subject_data.complete == true){
                        console.log('complete: ', subject_data);
                        completed +=1;
                    }
                });

                return completed;
            }
            return 0;
        }


        $scope.drawModeIs = function(mode_query) {

            if($rootScope.applicationReady)
            {            
                return mode_query == $scope.draw_mode;
            }
            return false;
        }



    }]);





var annotationView = derm_app.controller('AnnotationView', ['$scope', '$rootScope', '$timeout',

    function ($scope, $rootScope, $timeout) {


    }]);





// utilities
var studyToImageSource = function (study_num) {
    var src = "http://dermannotator.org/cgi-bin/iipsrv.fcgi?DeepZoom=/RAW_IMAGE_DATA/bigdata2/PYRAMIDS/MSKCC/BATCH1/B1/"
            + study_num + ".tif.dzi.tif.dzi";
//    console.log(src);
    return src;
};


var iff_filter = derm_app.filter('iif', function () {
   return function(input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
   };
});


// drag and drop list directive
// directive for a single list
// based on code from
// http://www.smartjava.org/content/drag-and-drop-angularjs-using-jquery-ui
var dndList = derm_app.directive('dndList', function() {

    return function(scope, element, attrs) {

        // variables used for dnd
        var toUpdate;
        var startIndex = -1;

        // watch the model, so we always know what element
        // is at a specific position
        scope.$watch(attrs.dndList, function(value) {
            toUpdate = value;
        },true);

        // use jquery to make the element sortable (dnd). This is called
        // when the element is rendered
        $(element[0]).sortable({
            items:'li',
            start:function (event, ui) {
                // on start we define where the item is dragged from
                startIndex = ($(ui.item).index());
            },
            stop:function (event, ui) {
                // on stop we determine the new index of the
                // item and store it there
                var newIndex = ($(ui.item).index());
                var toMove = toUpdate[startIndex];
                toUpdate.splice(startIndex,1);
                toUpdate.splice(newIndex,0,toMove);

                // we move items in the array, if we want
                // to trigger an update in angular use $apply()
                // since we're outside angulars lifecycle
                scope.$apply(scope.model);
            },
            axis:'y'
        })
    }
});




// The WebSocketService operates by either linking callbacks to scope variables (promises) or handling spontaneous
// events sent from the tornado application. These events can be status updates or errors not triggered by user input.
derm_app.factory('WebSocketService', ['$q', '$rootScope', function ($q, $rootScope) {

    var Service = {};
    var callbacks = {};
    var currentCallbackId = 0;
    var ws = new WebSocket("ws://localhost:5555/api/task/events/task-succeeded/");

    ws.onopen = function () {

        console.log("Websocket connection opened to Flower task monitoring");

    };

    ws.onmessage = function (message) {

        $rootScope.hasJobResult(JSON.parse(message.data));

//        listener(JSON.parse(message.data));

    };

    function sendRequest(request) {

        var defer = $q.defer();
        var callbackId = getCallbackId();
        callbacks[callbackId] = {
            time: new Date(),
            cb: defer
        };
        request.callback_id = callbackId;
        ws.send(JSON.stringify(request));
        return defer.promise;
    }

    function listener(messageObj) {

         console.log(messageObj)
//
//         if (callbacks.hasOwnProperty(messageObj.callback_id)) {
//    //            console.log(callbacks[messageObj.callback_id]);
//                $rootScope.$apply(callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
//                delete callbacks[messageObj.callbackID];
//            }
//            else {
//                if(messageObj.target == 'aplog'){
//                    console.log('aplog', messageObj.data);
//                }
//                else if (messageObj.target == 'remotelog') {
//                    console.log('remotelog', messageObj.data);
//                }
//                else if (messageObj.target == 'console') {
//                    console.log('console ::', messageObj.data);
//                }
//                else if (messageObj.target == 'angular') {
//
//                    console.log('angular ::', messageObj.data);
//
//                    if(messageObj.data[0] == 'update') {
//
//                         console.log('updating')
//
//                        $rootScope.updateStatus(messageObj.data[1]);
//                    }
//                    else if (messageObj.data[0] == 'reload') {
//
//                        console.log('reloading')
//
//                        $rootScope.updateStatus(messageObj.data[1]);
//                    }
//
//
//    //                $rootScope.ApplicationInit();
//
//                }
//                else if (messageObj.target == 'notice') {
//                    console.log('notice', messageObj.data);
//                }
//                else if (messageObj.target == 'init') {
//                    console.log('Websocket init complete');
//                }
//                else
//                {
//                    console.log('unsupported target ' + messageObj.target);
//                }
//            }
    }

    function getCallbackId() {
        currentCallbackId += 1;
        if (currentCallbackId > 10000) {
            currentCallbackId = 0;
        }
        return currentCallbackId;
    }


    Service.sendAsyncRequestWithCallback = function(target,data) {

       var d = {
            'target':target,
            'data': data
        }

        var promise = sendRequest(d);
        return promise;
    }

    return Service;
}]);




// data sources

var imageList = derm_app.factory('imageList', function($http) {

  // shuffle from SO: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(array) {
      var currentIndex = array.length
        , temporaryValue
        , randomIndex
        ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
  }

  var imageList= {
    fromServer: function() {
        var url = 'http://example.com/json.json';
            var promise = $http.jsonp(url).then(function (response) {
          return response.data;
        });
      return promise;
    },
    fromLocal: function() {
        var url = 'static/data/json_subj_list.json';
            var promise = $http.get(url).then(function (response) {
          return response.data;
        });
      return promise;
    },

    // fromDB -> perform API request with user_id, image offset, count to get, and whether it should be shuffled
    fromDB: function(user_id, offset, count, shouldShuffle) {
        console.log('Query:: fromDB: ' + user_id + " " + offset + " " + count + " " + shouldShuffle)
//        var url = 'static/data/json_subj_list.json';
            var url = 'images/' + offset + "/" + count + "/";

            var promise = $http.get(url).then(function (response) {

            if(shouldShuffle){
//                return shuffle(response.data.slice(offset,count));
                return shuffle(response.data);
            }
            else
            {
//                return response.data.slice(offset, count);
                return response.data;
            }
        });
      return promise;
    }

    };

  return imageList;
});





var decisionTree = derm_app.factory('decisionTree', function($http) {

  var decisionTree= {
    fromServer: function() {
        var url = 'http://example.com/json.json';
            var promise = $http.jsonp(url).then(function (response) {

                console.log(response.data);
          return response.data;
        });
      return promise;
    },
    fromLocal: function() {
        var url = 'static/rev3/decisiontree.json';
            var promise = $http.get(url).then(function (response) {
          return response.data;
        });
      return promise;
    }

    };

  return decisionTree;
});




// handle window resize events
function updateLayout() {

    var scope = angular.element($("#angular_id")).scope();
    scope.safeApply(function(){

        $("#angular_id").height(window.innerHeight);
        $("#annotationView").height(window.innerHeight);

    })
}

function toggleDebug() {

    var scope = angular.element($("#angular_id")).scope();

    console.log('Angular state before: ', scope.debug);

    scope.safeApply(function(){

       scope.debug = !scope.debug;

    })

    console.log('Angular state before: ', scope.debug);

}

window.onresize = updateLayout;














