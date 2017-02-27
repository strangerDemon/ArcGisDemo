﻿/*
 * 我的操作
 */
myAction = {
    //初始化
    init:function(){
        dojo.connect(ssmap.map, "onClick", this, "onClickHandler");//dojo.connect为对象注册事件
    },
    //绘图
    drawArea : function () {
        this.init();
        var fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 160, 122]), 2), new dojo.Color([255, 255, 255, 0.5]));

        var  spatialReference = new esri.SpatialReference({ wkid: 4326 });//

        var _geoPloygon = new esri.geometry.Polygon(spatialReference); //初始化点坐标 data.initPoint;//点
        _geoPloygon.addRing([data.initPoint[0], data.initPoint[1],data.initPoint[2],data.initPoint[3],data.initPoint[0]]);
        var count=data.initPoint.length;

        var _AGraphic = new esri.Graphic(_geoPloygon, fillSymbol);//面，以点汇面
    
        var _graphicsLayer = new esri.layers.GraphicsLayer({ id: "DciMeature" });//layer，在图层中添加面

        _graphicsLayer.add(_AGraphic);

        ssmap.map.addLayer(_graphicsLayer);
    },
    //点击事件
    onClickHandler : function (evt) {
        evt = evt ? evt : (window.event ? window.event : null);
        var pt = evt.mapPoint;
        alert("该点坐标为("+pt.x+"："+pt.y+")");
    }
}


