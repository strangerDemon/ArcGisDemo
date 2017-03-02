/*
 * 我的操作
 */
myAction = {
    //对象内的全局变量
    areaSymbol: null,//样式，填充样式 面积

    lineSymbol:null,//点样式

    pointSymbol: null,//点样式

    spatialReference: null,//标识，固定

    //初始化
    init: function () {
        this.areaSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 160, 122]), 2), new dojo.Color([255, 255, 255, 0.5]));
        this.lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 160, 122]), 2);

        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.pointSymbol = new esri.symbol.PictureMarkerSymbol('img/myPosition.png', 16, 16);
    },
    //居中位置
    Center: function (position) {
        var level = ssmap.map.getLevel();
        level = level < 15 ? 15 : level;
        ssmap.map.centerAndZoom(position, level);//居中点和级别
    },
    /**
     * 静态的根据data.js 内数据绘图
    */
    staticGeoPloygon: null,//点
    staticAGraphic: null,//面
    staticGraphicsLayer: null,//图层
    staticShowStatus: false,
    //完全重新绘制
    //效率低
    //静态绘图
    staticAreaDraw: function () {
        if (this.staticGraphicsLayer == null) {//第一次加载
            this.staticGeoPloygon = new esri.geometry.Polygon(this.spatialReference);//初始化点坐标 data.initPoint;//点

            this.staticGeoPloygon.addRing([data.initPoint[0], data.initPoint[1], data.initPoint[2], data.initPoint[3], data.initPoint[0]]);//添加点数据

            this.staticAGraphic = new esri.Graphic(this.staticGeoPloygon, this.areaSymbol);//面，以点汇面

            this.staticGraphicsLayer = new esri.layers.GraphicsLayer({ id: "DciMeature" });//layer，在图层中添加面

            this.staticGraphicsLayer.add(this.staticAGraphic);

            ssmap.map.addLayer(this.staticGraphicsLayer);

            dojo.connect(this.staticGraphicsLayer, "onClick", this, "staticAreaOnClickHandler");//dojo.connect为对象注册事件
        } else if (this.staticGeoPloygon == null) {//
            this.staticGeoPloygon = new esri.geometry.Polygon(this.spatialReference);
            this.staticGeoPloygon.addRing([data.initPoint[0], data.initPoint[1], data.initPoint[2], data.initPoint[3], data.initPoint[0]]);//添加点数据
            this.staticAGraphic.setGeometry(this.staticGeoPloygon);
        } else {
            this.staticGeoPloygon = null;
            this.staticAGraphic.setGeometry(this.staticGeoPloygon);
        }
    },
    //控制显隐
    staticGraphicsLayerShow: function () {
        this.staticGraphicsLayer.show();
        this.staticShowStatus = true;
    },
    staticGraphicsLayerHide: function () {
        this.staticGraphicsLayer.hide();
        this.staticShowStatus = false;
    },
    //静态图点击事件
    staticAreaOnClickHandler: function (evt) {
        evt = evt ? evt : (window.event ? window.event : null);
        var pt = evt.mapPoint;
        alert("该点坐标为(" + pt.x + "：" + pt.y + ")");
    },
    /**
     * 根据用户鼠标点击绘图
    */
    dynamicPloygon: null,
    dynamicAGraphic: null,
    dynamicGraphicsLayer: null,
    dynamicMapClick: null,//dojo绑定的事件
    dynamicMapMouseOn: null,//dojo绑定的事件
    dynamicMapText: null,
    textSymbol: null,//面积提醒样式
    dynamicAreaDrawInit: function () {
        if (this.dynamicMapClick != null) {//已绑定，再次点击时取消绑定，点清除，图层隐藏
            this.dynamicDrawEnd();
        } else if (this.dynamicGraphicsLayer != null) {//未绑定，再次点击时绑定，图像显示
            this.dynamicMapClick = dojo.connect(ssmap.map, "onMouseDown", this, "dynamicMouse");//dojo.connect为对象注册事件       
            this.dynamicGraphicsLayer.show();
        } else {//初始化
            this.dynamicMapClick = dojo.connect(ssmap.map, "onMouseDown", this, "dynamicMouse");//dojo.connect为对象注册事件          
        }
        this.lineDrawEnd();//清除画线的事件
    },
    dynamicMouse: function (evt) {
        evt = evt ? evt : (window.event ? window.event : null);
        //判断鼠标点击的按钮
        var btnNum = evt.button;
        if (btnNum == 1) {//鼠标中间键 结束
            dojo.disconnect(this.dynamicMapClick);//取消绑定            
        } else if (btnNum == 0) {//鼠标左键 绘图
            this.dynamicAreaDraw(evt.mapPoint);
        } else if (btnNum == 2) {//右建 回退
            this.dynamicAreaReturn();
        } else {
            alert("您点击了" + btnNum + "号键，我不能确定它的名称。");
            return;
        }
    },
    dynamicDrawEnd: function () {
        //清除点，隐藏layer
        this.dynamicPloygon = null;
        this.dynamicAGraphic.setGeometry(this.dynamicPloygon);
        dojo.disconnect(this.dynamicMapClick);//取消绑定
        this.dynamicGraphicsLayer.hide();
        this.dynamicMapClick = null;
        //清除面积提醒
        this.dynamicMapText.setSymbol(null);
        this.dynamicMapText.setGeometry(null)
    },
    //绘图
    dynamicAreaDraw: function (pt) {
        if (this.dynamicPloygon == null) {//初始化 1、已有图层时 2、未有图层
            this.dynamicPloygon = new esri.geometry.Polygon(this.spatialReference);
            this.dynamicPloygon.addRing([[pt.x, pt.y], [pt.x, pt.y]]);//添加点数据

            if (this.dynamicGraphicsLayer == null) {
                this.dynamicAGraphic = new esri.Graphic(this.dynamicPloygon, this.areaSymbol);//面，以点汇面

                this.dynamicGraphicsLayer = new esri.layers.GraphicsLayer({ id: "dynamicMap" });//layer，在图层中添加面

                this.dynamicGraphicsLayer.add(this.dynamicAGraphic);

                ssmap.map.addLayer(this.dynamicGraphicsLayer);

                this.dynamicMapMouseOn = dojo.connect(this.dynamicGraphicsLayer, "onMouseOver", this, "showArea");
            }
        } else {//点击图中加点
            if (this.dynamicPloygon.rings[0] == undefined || this.dynamicPloygon.rings[0].length < 1) {//后退后再次重新绘点
                this.dynamicPloygon.addRing([[pt.x, pt.y], [pt.x, pt.y]]);//添加点数据
            } else {
                this.dynamicPloygon.insertPoint(0, this.dynamicPloygon.rings[0].length - 1, pt);
            }
            this.dynamicAGraphic.setGeometry(this.dynamicPloygon);//this._geoPloygon为一个array point数组，根据point数据绘制多边形
        }
    },
    //回退点
    dynamicAreaReturn: function () {
        if (this.dynamicPloygon.rings[0] == undefined || this.dynamicPloygon.rings[0].length < 1) {//已无点时
            alert("已无回退点！");
        } else if (this.dynamicPloygon.rings[0].length <= 2) {//最后剩起始终止2个点时
            this.dynamicPloygon.removeRing(0);
            this.dynamicAGraphic.setGeometry(this.dynamicPloygon);
        } else {//回退
            this.dynamicPloygon.removePoint(0, this.dynamicPloygon.rings[0].length - 2);
            this.dynamicAGraphic.setGeometry(this.dynamicPloygon);
        }
    },
    //鼠标在上时显示
    showArea: function (evt) {
        evt = evt ? evt : (window.event ? window.event : null);
        var Area = esri.geometry.geodesicAreas([this.dynamicPloygon], esri.Units.SQUARE_METERS);
        var showWord = Area[0] < 0 ? -Area[0] : Area[0];
        showWord = showWord < 1000000 ? showWord < 10000 ? showWord.toFixed(2) + "平方米" : (showWord / 10000).toFixed(2) + "平方公顷" : (showWord / 1000000).toFixed(2) + "平方公里";
        this.textSymbol = new esri.symbol.TextSymbol(showWord).setColor(new dojo.Color([0, 0, 0])).setAlign(esri.symbol.Font.ALIGN_START)
                  .setOffset(6, 6).setFont(new esri.symbol.Font("10pt"));
        if (this.dynamicMapText == null) {
            this.dynamicMapText = new esri.Graphic(evt.mapPoint, this.textSymbol);

            this.dynamicGraphicsLayer.add(this.dynamicMapText);
        } else {
            this.dynamicMapText.setSymbol(this.textSymbol);
            this.dynamicMapText.setGeometry(evt.mapPoint)
        }
        //alert("面积：" + showWord);
    },
    /**
     * 根据ip来获取未知定位
    */
    myIp: null,//我的ip
    myPoint: null,//我的未知
    myPositionLayer: null,//我的未知
    myPositionPoint: null,//坐标点
    mypositionAGraphic: null,
    oPointOffset: { lng: 0.00000, lat: 0.00015 },//偏移量，别问我为什么是这个，是有人试出来的
    //ip获取地址 http://ip.chinaz.com/getip.aspx
    myIpGet: function (callback) {
        $.ajax({
            type: "get",
            async: false,
            url: "http://ip.chinaz.com/getip.aspx",
            dataType: "jsonp",
            success: function (data) {
                // data demo:
                // {ip:'183.250.1**.1**',address:'福建省 移动'}
                // 内部this 为window，不为myAction
                myAction.myIp = data.ip;
                callback();
            },
            error: function () {
                alert("waiting");
            }
        });
    },
    //坐标系获取 一天200次 = ='http://api.map.baidu.com/highacciploc/v1?ak=mp7UQ7pMBx9SciF4Di0kFfnE&qterm=pc&callback_type=jsonp&coord=bd09ll&qcip=' + ip,
    //需要优化，在找导一个ip时，对应记录下一个地址
    myPointGet: function (callback) {
        $.ajax({
            type: "get",
            async: false,
            url: "http://api.map.baidu.com/highacciploc/v1?ak=mp7UQ7pMBx9SciF4Di0kFfnE&qterm=pc&callback_type=jsonp&coord=bd09ll&qcip=" + this.myIp,
            dataType: "jsonp",
            success: function (d) {
                // data demo:
                //{"content":{"location":{"lat":24.******,"lng":118.******},"locid":"9***********************0","radius":30,"confidence":1.0},"result":{"error":161,"loc_time":"2017-02-28 17:16:08"}}
                if (d.content == undefined) {
                    myAction.myPoint = data.myPosition;
                } else {
                    var inaccuratePoint = d.content.location;//是不够准确的数据
                    //处理操作
                    BMap.Convertor.translate(inaccuratePoint, 0, function (point) {
                        var pointCz = { lng: point.lng - inaccuratePoint.lng, lat: point.lat - inaccuratePoint.lat };
                        var x = inaccuratePoint.lng - myAction.oPointOffset.lng - pointCz.lng,
                            y = inaccuratePoint.lat - myAction.oPointOffset.lat - pointCz.lat;
                        myAction.myPoint = { "lat": y, "lng": x };
                    });
                }
                callback();
            },
            error: function () {
                alert("waiting");
            }
        });
    },
    //优化本地的point
    myPointGetAtJson: function (callback) {
        $.ajax({
            type: "GET",
            url: "dataJson/IpToPoint.json",
            data: {},
            async: false,
            dataType: "json",
            success: callback,
            error: function (e) { alert("未响应。", -1); }
        });
    },


    //显示我的位置 控制
    //ajax 内部用this是window。而不是当前对象
    myPositionShow: function () {
        this.myIpGet(function () {//ip获取
            myAction.myPointGetAtJson(function (d) {//json文件内找寻匹配point
                for (var i = 0; i < d.length; i++) {
                    if (d[i].IP == myAction.myIp) {
                        myAction.myPoint = d[i].Point;
                        myAction.positionShowAction();
                        return;
                    }
                }
                if (myAction.myPoint == null) {//本地json未找到数据
                    myAction.myPointGet(function () {//找不到 请求
                        myAction.positionShowAction();//显示
                        //操作json 将新的ip point数据写入json
                        myAction.updateIpToPointJson();
                    });
                }
            });
        });
    },
    //显示我的位置的
    positionShowAction: function () {
        this.myPositionPoint = new esri.geometry.Point(parseFloat(this.myPoint.lng), parseFloat(this.myPoint.lat), this.spatialReference);
        if (this.myPositionLayer == null) {
            this.mypositionAGraphic = new esri.Graphic(this.myPositionPoint, this.pointSymbol);//面，以点汇面
            this.myPositionLayer = new esri.layers.GraphicsLayer({ id: "myPositionMap" });//layer，在图层中添加面

            this.myPositionLayer.add(this.mypositionAGraphic);

            ssmap.map.addLayer(this.myPositionLayer);
            dojo.connect(this.myPositionLayer, "onClick", this, "myPositionClickHandler");
        } else {
            this.mypositionAGraphic.setGeometry(this.myPositionPoint);
        }
        //图层显示级别
        this.Center(this.myPositionPoint);
        this.myPositionLayer.show();
    },
    //更新json文件，后台处理，这里不做
    updateIpToPointJson: function () {

    },
    //隐藏我的位置
    myPositionHide: function () {
        this.myPositionLayer.hide();
    },
    //我的位置点击事件
    myPositionClickHandler: function () {
        alert(this.myIp);
    },
    //绘线
    linePolygon: null,
    lineAGraphic: null,
    lineLayer: null,
    lineClick:null,
    lineDrawInit: function () {
        if (this.lineClick != null) {//一次画线结束
            this.lineDrawEnd();
        }else if (this.lineLayer != null) {//第二次及以后画线
            this.lineClick = dojo.connect(ssmap.map, "onMouseDown", this, "lineMouse");
            this.lineLayer.show();
        } else {//第一次画线
            this.lineClick = dojo.connect(ssmap.map, "onMouseDown", this, "lineMouse");
        }
        this.dynamicDrawEnd();//清除画图的事件
    },
    lineMouse: function (evt) {
        evt = evt ? evt : (window.event ? window.event : null);
        //判断鼠标点击的按钮
        var btnNum = evt.button;
        if (btnNum == 1) {//鼠标中间键 结束
            dojo.disconnect(this.lineClick);//取消绑定            
        } else if (btnNum == 0) {//鼠标左键 绘图
            this.lineDraw(evt.mapPoint);
        } else if (btnNum == 2) {//鼠标右键 回退
            this.lineDrawReturn();
        } else {
            alert("您点击了无效按键。");
            return;
        }
    },
    //画线
    lineDraw: function (pt) {
        if (this.linePolygon == null) {//初始化 1、已有图层时 2、未有图层
            this.linePolygon = new esri.geometry.Polygon(this.spatialReference);
            this.linePolygon.addRing([[pt.x, pt.y]]);//添加点数据

            if (this.lineLayer == null) {
                this.lineAGraphic = new esri.Graphic(this.linePolygon, this.lineSymbol);//面，以点汇面

                this.lineLayer = new esri.layers.GraphicsLayer({ id: "lineLayer" });//layer，在图层中添加面

                this.lineLayer.add(this.lineAGraphic);

                ssmap.map.addLayer(this.lineLayer);

            }
        } else {//点击图中加点
            if (this.linePolygon.rings[0] == undefined || this.linePolygon.rings[0].length < 1) {//后退后再次重新绘点
                this.linePolygon.addRing([[pt.x, pt.y]]);//添加点数据
            } else {
                //绘图和绘线本质上是一样的
                //绘图为起始终止断点为一个，每次在倒数第二的未知加新点
                //绘线为每次在最后未知加新点
                this.linePolygon.insertPoint(0, this.linePolygon.rings[0].length, pt);
            }
            this.lineAGraphic.setGeometry(this.linePolygon);//this._geoPloygon为一个array point数组，根据point数据绘制多边形
        }
    },
    //一次画线结束
    lineDrawEnd: function () {
        //点清空
        this.linePolygon = null;
        this.lineAGraphic.setGeometry(this.linePolygon);
        this.lineLayer.hide();
        //解除dojo绑定
        dojo.disconnect(this.lineClick);
        this.lineClick = null;
    },
    //点回退
    lineDrawReturn: function () {
        if (this.linePolygon.rings[0] == undefined || this.linePolygon.rings[0].length < 1) {//已无点时
            alert("已无回退点！");
        } else if (this.linePolygon.rings[0].length <= 2) {//最后剩起始终止2个点时
            this.linePolygon.removeRing(0);
            this.lineAGraphic.setGeometry(this.linePolygon);
        } else {//回退
            this.linePolygon.removePoint(0, this.linePolygon.rings[0].length - 1);
            this.lineAGraphic.setGeometry(this.linePolygon);
        }
    },
}


