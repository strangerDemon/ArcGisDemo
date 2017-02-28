//匿名函数
//this 为index.aspx
(function ($) {
    //数据源
    var MapServer = {
        //厦门矢量地图
        XMMAP: "...",
        //厦门矢量地图注记
        XMMAP_CVA: "...",
        //厦门影像地图
        DOMMAP: "...",
        //厦门影像地图注记
        DOMMAP_CIA: "...",
        //厦门晕渲染地图
        DEMMAP: "...",
        //厦门晕渲染地图注记
        DEMMAP_CVA: "..."
    };

    var ArcGis = (function () {
        function ArcGis(element, options) {
            this.map = {};
            this.settings = $.extend(true, ArcGis.defaults, options || {});
            this.symbol = {
                line: new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 160, 122]), 2),
                simpleLine: new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([127, 127, 255]), 2),
                dotLine: new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SHORTDOT, new dojo.Color([147, 147, 255]), 2)
            }
            this.Spatial = new esri.SpatialReference({ wkid: 4326 });
            this.init();
        }
        ArcGis.prototype = {
            /* 初始化 */
            init: function () {
                var me = this;
                this.map = new esri.Map(this.settings.element, {
                    logo: this.settings.logo,
                    center: this.settings.center,
                    zoom: this.settings.zoom,
                    slider: this.settings.slider
                });
                this.map.spatialReference = {};
                this.map.spatialReference.wkid = 4326;
                this.addLayer(MapServer.XMMAP);
                this.addLayer(MapServer.XMMAP_CVA);
            },
            wkid: function () {
                // return this.map.spatialReference;

            },
            //设置地图范围
            setExtent: function (extent) {
                //.getExtent()).expand(3)
                this.map.setExtent(extent);
            },
            changeWkid: function (extent) {
                if (!extent) {
                    extent = this.settings.extend;
                }
                extent.spatialReference.wkid = 4490;
                return new esri.geometry.Extent(extent);
            },
            addLayer: function (url) {
                var layer = new esri.layers.ArcGISTiledMapServiceLayer(url);
                this.map.addLayer(layer);
            },
            addGraphicsLayer: function () {
                // return new esri.layers.GraphicsLayer({ id: "correct" });
                var layer = new esri.layers.GraphicsLayer();
                this.map.addLayer(layer);
                return layer;
            },
            newPoint: function (data) {
                var x = parseFloat(data.x), y = parseFloat(data.y);
                return new esri.geometry.Point([x, y], this.Spatial);
            },
            xy2arr: function (data) {
                return [parseFloat(data.x), parseFloat(data.y)];
            },
            newPolyline: function () {
                //arguments
                // var polylineJson = {"paths":[[[-122.68,45.53], -122.58,45.55],[-122.57,45.58],[-122.53,45.6]]],"spatialReference":{"wkid":4326}};
                // var singlePathPolyline = new Polyline([[-50, 0], [-120, -20], [-130, 0]]);
                // polyline.addPath([new Point(10,10), new Point(20,20), new Point(30,30)]);
                // polyline.addPath([[-122.68,45.53], [-122.58,45.55], [-122.57,45.58],[-122.53,45.60]]);
                //  return new esri.geometry.Polyline(this.wkid());
                //console.log('arguments',arguments[0]);
                var paths = arguments[0];
                if (paths) {
                    //  return new esri.geometry.Polyline({"paths":[paths],"spatialReference":{"wkid":4326}});
                    return new esri.geometry.Polyline(paths);
                } else {
                    return new esri.geometry.Polyline(this.Spatial);
                }
            },
            newPictureMarkerSymbol: function (url, width, height) {
                return new esri.symbol.PictureMarkerSymbol(url, width, height);
            },
            /*
            * 多种图形点线面增加判断
            * 判断 graphic 是点元素 或是xy坐标
            */
            newGraphic: function (graphic, symbol) {
                var gp = graphic.type ? graphic : this.newPoint(graphic);
                return new esri.Graphic(gp, symbol);
            },
            dom: function () {
                //   $("#map_zoom_slider").hide();
            },
            milliSecondToTime: function (seconds) {
                var time = parseFloat(seconds);
                if (null != time && "" != time) {
                    if (time > 60 && time < 60 * 60) {
                        time = "00:" + parseInt(time / 60.0) + ":" + parseInt((parseFloat(time / 60.0) -
                            parseInt(time / 60.0)) * 60) + "";
                    }
                    else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                        time = this.prefix(2, parseInt(time / 3600.0)) + ":" +
                            this.prefix(2, parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) + ":" +
                            this.prefix(2, parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) - parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60))
                    }
                    else {
                        time = "00:00:" + parseInt(time) + "";
                    }
                }
                return time;
            },
            averagePace: function (seconds) {
                var time = parseFloat(seconds);
                if (null != time && "" != time) {
                    if (time > 60 && time < 60 * 60) {
                        time = parseInt(time / 60.0) + "'" + parseInt((parseFloat(time / 60.0) -
                            parseInt(time / 60.0)) * 60) + "''";
                    }
                    else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                        time = "-";
                    }
                    else {
                        time = "--";
                    }
                }
                return time;
            },
            prefix: function (num, val) {
                return (new Array(num).join('0') + val).slice(-num);
            }

        };
       
        //获取数据库中数据从aspx
        ArcGis.prototype.getDb = function (obj) {
            var responseData;
            $.ajax({
                type: "POST",
                url: obj.url,
                data: obj.source,
                cache: false,
                async: false,
                dataType: "json",
                success: function (data) {
                    if (data) {
                        responseData = data;
                    } else {
                        console.log("错误");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrow) {
                    console.log("打开异常" + errorThrow);
                }
            });
            return responseData;
        };
        ArcGis.prototype.showSport = function (sportId) {
            var data = this.getDb({ url: "../appHtml/infoPage.aspx?type=getSportShare&id=" + sportId })
            var route = data.Route.replace(/\ +/g, "").replace(/[ ]/g, "").replace(/[\r\n]/g, "").replace([], ''),
                orig = JSON.parse(data.Orig),
                dest = JSON.parse(data.Dest);
            route = JSON.parse(route);
            if (Math.abs(route[0].x - orig.x) > Math.abs(route[0].x - dest.x)) {
                route = route.reverse();
            }
            this.fillDataSport(data);
            this.addgpSport(route);
        };
        ArcGis.prototype.fillDataSport = function (data) {
            data.TotalDistance = (data.TotalDistance / 1000).toFixed(2);
            data.TotalTime = this.milliSecondToTime(data.TotalTime);
            data.AveragePace = this.averagePace(data.AveragePace);
            var sportType = ["骑行", "跑步", "步行"];
            $('#sportType').text(sportType[data['SportType']]);
            var strTime = data['BeginTime'];
            var strDate = strTime.split('T')[0].substring(5, 20);

            $('#beginTime').text(strDate.split('-')[0] + '月' + strDate.split('-')[1] + "日 " + strTime.split('T')[1].substring(0, 5));

            $(".showData .value").each(function (i, elem) {
                var id = $(this).attr("id");
                id = id.substring(0, 1).toUpperCase() + id.substring(1);
                data[id] = data[id] == 0 ? '-' : data[id];
                $(this).text(data[id]);
            });
        }
        ArcGis.defaults = {
            element: 'map',
            logo: false,
            center: [118.13388, 24.56],
            zoom: 11,
            slider: false,
            extent: { "xmin": 117.79392681225585, "ymin": 24.39858676494489, "xmax": 118.45310649975585, "ymax": 24.72474338115583, "spatialReference": { wkid: 4326 } }
        };
        window.ArcGis = ArcGis;
        return ArcGis;
    })();
})(jQuery)