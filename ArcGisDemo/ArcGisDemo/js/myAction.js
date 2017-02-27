/*
 * 我的操作
 */
myAction = {
    //对象内的全局变量
    fillSymbol : null,

    spatialReference : null,//
    
    /**
     * 静态的根据data.js 内数据绘图
    */
    //初始化
    init: function () {      
        this.fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 160, 122]), 2), new dojo.Color([255, 255, 255, 0.5]));
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
    },
    //绘图
    drawArea : function () {
     
        var _geoPloygon= new esri.geometry.Polygon(this.spatialReference);//初始化点坐标 data.initPoint;//点

        _geoPloygon.addRing([data.initPoint[0], data.initPoint[1],data.initPoint[2],data.initPoint[3],data.initPoint[0]]);//添加点数据

        var _AGraphic = new esri.Graphic(_geoPloygon, this.fillSymbol);//面，以点汇面
    
        var _graphicsLayer = new esri.layers.GraphicsLayer({ id: "DciMeature" });//layer，在图层中添加面

        _graphicsLayer.add(_AGraphic);

        ssmap.map.addLayer(_graphicsLayer);

        dojo.connect(_graphicsLayer, "onClick", this, "onClickHandler");//dojo.connect为对象注册事件
    },
    //点击事件
    onClickHandler : function (evt) {
        evt = evt ? evt : (window.event ? window.event : null);
        var pt = evt.mapPoint;
        alert("该点坐标为("+pt.x+"："+pt.y+")");
    },
    /**
     * 根据用户鼠标点击绘图
    */
    drawPloygon: null,
    drawAGraphic: null,
    drawGraphicsLayer: null,

    drawInit:function(){
        dojo.connect(ssmap, "onClick", this, "mapDraw");//dojo.connect为对象注册事件
        this.drawPloygon= null;
        this.drawAGraphic=null;
        this.drawGraphicsLayer=null;
    },
    mapDraw:function(){
        evt = evt ? evt : (window.event ? window.event : null);
        var pt = evt.mapPoint;
        if (this.drawPloygon == null) {
            this.drawPloygon = new esri.geometry.Polygon(this.spatialReference);
            this.drawPloygon.addRing([[pt.x, pt, y], [pt.x, pt, y]]);//添加点数据

            this.drawAGraphic = new esri.Graphic(this.drawPloygon, this.fillSymbol);//面，以点汇面

            this.drawGraphicsLayer = new esri.layers.GraphicsLayer({ id: "DciMeature" });//layer，在图层中添加面

            this.drawGraphicsLayer.add(drawAGraphic);

            ssmap.map.addLayer(this.drawGraphicsLayer);
        } else {
            this.drawPloygon.insertPoint(0, this.drawPloygon.rings[0].length - 1, pt);
            this.drawAGraphic.setGeometry(this.drawPloygon);//this._geoPloygon为一个array point数组，根据point数据绘制多边形
        }
    },
}


