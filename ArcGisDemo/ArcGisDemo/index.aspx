<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="ArcGisDemo.index" %>

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
    <%-- css --%>
    <%--<link rel="stylesheet" type="text/css" href="css/map.css" />--%>
    <title>arcgis demo</title>
   <style>
       html, body{
            height: 100%;
           width: 100%;
       }
       #map {
           height: 100%;
           width: 100%;
           margin: 0;
           padding: 0;
           font-size: 10px;
           -webkit-text-size-adjust: 100%;
       }
   </style>
</head>
<body>
    <div id="map" ></div>
</body>
</html>
