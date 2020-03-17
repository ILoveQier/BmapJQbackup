// <!-- 初始化地图代码 -->
// 百度地图API功能
var map = new BMap.Map('map-right-realmap');
var poi = new BMap.Point(104.0690502742971, 30.694182737423144);
map.centerAndZoom(poi, 12);
map.enableScrollWheelZoom();
//添加地图类型控件
map.addControl(new BMap.MapTypeControl({
    mapTypes: [
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
    ]
}));

// 测距的方法
var myDis = new BMapLib.DistanceTool(map);
var styleOptions = {
    strokeColor: "red",    //边线颜色。
    fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
}
// 实例化鼠标绘图
var drawingManager = null

// 监听鼠标点击的地理位置
var mapPos = null
map.addEventListener("mousedown", function (e) {
    mapPos = new BMap.Point(e.point.lng, e.point.lat)
});