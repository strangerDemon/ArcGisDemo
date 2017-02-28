/*
 * 我的操作
 */
myAction = {
    //对象内的全局变量
    fillSymbol: null,

    spatialReference: null,//标识，固定

    //初始化
    init: function () {
        this.fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 160, 122]), 2), new dojo.Color([255, 255, 255, 0.5]));
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
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

            this.staticAGraphic = new esri.Graphic(this.staticGeoPloygon, this.fillSymbol);//面，以点汇面

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
    dynamicAreaDrawInit: function () {
        if (this.dynamicMapClick != null) {//已绑定，再次点击时取消绑定，点清除，图层隐藏
            this.dynamicDrawEnd();
        } else if (this.dynamicGraphicsLayer != null) {//未绑定，再次点击时绑定，图像显示
            this.dynamicMapClick = dojo.connect(ssmap.map, "onMouseDown", this, "dynamicMouse");//dojo.connect为对象注册事件       
            this.dynamicGraphicsLayer.show();
        } else {//初始化
            this.dynamicMapClick = dojo.connect(ssmap.map, "onMouseDown", this, "dynamicMouse");//dojo.connect为对象注册事件
        }
    },
    dynamicMouse: function (evt) {
        evt = evt ? evt : (window.event ? window.event : null);
        //判断鼠标点击的按钮
        var btnNum = evt.button;
        if (btnNum == 2) {//鼠标右键 结束
            this.dynamicDrawEnd();
        } else if (btnNum == 0) {//鼠标左键 绘图
            this.dynamicAreaDraw(evt.mapPoint);
        } else if (btnNum == 1) {//中建 回退
            this.dynamicAreaReturn();
        } else {
            alert("您点击了" + btnNum + "号键，我不能确定它的名称。");
            return;
        }
    },
    dynamicDrawEnd:function(){
        this.dynamicPloygon = null;
        this.dynamicAGraphic.setGeometry(this.dynamicPloygon);
        dojo.disconnect(this.dynamicMapClick);//取消绑定
        this.dynamicGraphicsLayer.hide();
        this.dynamicMapClick = null;
    },
    //绘图
    dynamicAreaDraw: function (pt) {
        if (this.dynamicPloygon == null) {//初始化 1、已有图层时 2、未有图层
            this.dynamicPloygon = new esri.geometry.Polygon(this.spatialReference);
            this.dynamicPloygon.addRing([[pt.x, pt.y], [pt.x, pt.y]]);//添加点数据

            if (this.dynamicGraphicsLayer == null) {
                this.dynamicAGraphic = new esri.Graphic(this.dynamicPloygon, this.fillSymbol);//面，以点汇面

                this.dynamicGraphicsLayer = new esri.layers.GraphicsLayer({ id: "dynamicMap" });//layer，在图层中添加面

                this.dynamicGraphicsLayer.add(this.dynamicAGraphic);

                ssmap.map.addLayer(this.dynamicGraphicsLayer);
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
        if (this.dynamicPloygon.rings[0]==undefined||this.dynamicPloygon.rings[0].length < 1) {//已无点时
            alert("已无回退点！");
        } else if (this.dynamicPloygon.rings[0].length <=2) {//最后剩起始终止2个点时
            this.dynamicPloygon.removeRing(0);
            this.dynamicAGraphic.setGeometry(this.dynamicPloygon);
        } else{//回退
            this.dynamicPloygon.removePoint(0, this.dynamicPloygon.rings[0].length - 2);
            this.dynamicAGraphic.setGeometry(this.dynamicPloygon);
        }
    },

}


