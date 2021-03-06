﻿/**
 * 按钮的点击事件
 */
$(document).ready(function () {
    //动态图的绘制
    $("#toolbar_dynamicMapDraw").click(function () {
        myAction.dynamicAreaDrawInit();
    });
    //静态图的 绘制
    $("#toolbar_staticMapDraw").click(function () {
        //重绘
        //myAction.staticAreaDraw();
        //控制显隐
        if (myAction.staticGraphicsLayer == null) {
            myAction.staticAreaDraw();//初始化，为方便和上面重绘的使用同一个函数
        }
        if (myAction.staticShowStatus) {
            myAction.staticGraphicsLayerHide();
        } else {
            myAction.staticGraphicsLayerShow();
        }
    });
    //图片切换
    var mayTypeCount = 0;
    $("#toolbar_mapType").click(function () {
        ssmap.showTdtLayer((mayTypeCount++) % 3);
    });
    //显示我的未知
    var myPositionCount = 0;
    $("#toolbar_showMyPosition").click(function () {
        myPositionCount++ % 2 == 0 ? myAction.myPositionShow() : myAction.myPositionHide();
    });
    //绘线
    var lineCount = 0;
    $("#toolbar_lineDraw").click(function () {
        myAction.lineDrawInit();
    })
})