﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="ArcGisDemo.index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <%-- esri --%>

    <link rel="stylesheet" type="text/css" href="lib/esri/3.14/esri.css" />
    <link rel="stylesheet" type="text/css" href="lib/esri/3.14/tundra.css" />
    <script src="lib/esri/3.14/init.js"></script>


    <%-- jquery --%>
    <script src="lib/jquery/3.1.1/jquery-3.1.1.min.js"></script>

    <%-- js --%>
    <script src="js/data.js"></script>
    <script src="js/map.js"></script>
    <script src="js/InitMap.js"></script>
    <script src="js/myAction.js"></script>
    <script src="js/onclick.js"></script>
    <%-- css --%>
    <link rel="stylesheet" type="text/css" href="css/map.css" />
     <link rel="stylesheet" type="text/css" href="css/label.css" />
    <title>arcgis demo</title>
    <style>
       
    </style>
</head>
<body>
    <div id="map"></div>
    <div class="ibox-content toolbarContainer hideElem" style="width: 412px; padding: 5px;">
        <div class="toolbarItem" id="toolbar_mapType">
            <span class="icon" style="background: rgba(0, 0, 0, 0) url('img/mapType.png') no-repeat scroll 0 0 / 16px"></span>
            <span class="name">地图类型</span>
        </div>
        <div class="toolbarItem" id="toolbar_mapDraw">
            <span class="icon" style="background: rgba(0, 0, 0, 0) url('img/drawMap.png') no-repeat scroll 0 0 / 16px"></span>
            <span class="name">绘图</span>
        </div>
    </div>
</body>
</html>
