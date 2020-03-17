renderFlightLine()
let pois = []
let polyline = null
let markerDots = []
let isDrawFlightLine = false
let newName = ''
// 航线相关
function renderFlightLine() {
    let data = window.globalData.flightLine
    drawPanel(data, drawFlightLine, 'flightLine')
}
// 绘制航线图像 todo
function drawFlightLine(data) {
    lineMakerArr = []
    drawPolyline(data);
}
// 绘制航线
function drawPolyline(data) {
    // 创建polyline对象
    pois = [];
    data.flight_dots.forEach(item => {
        createMakerDot(item)
        pois.push(new BMap.Point(item.lng, item.lat))
    });
    makePolyline(pois, data)
}
// 制作航线函数
function makePolyline(pois, data) {
    polyline = new BMap.Polyline(pois, {
        enableEditing: false,//是否启用线编辑，默认为false
        enableClicking: true,//是否响应点击事件，默认为true
        strokeWeight: '5',//折线的宽度，以像素为单位
        strokeOpacity: 0.6,//折线的透明度，取值范围0 - 1
        strokeColor: "#000" //折线颜色
    });
    polyline.id = 'flightLine' + data.id
    // 航线特殊的航路点
    polyline.lineMakerArr = lineMakerArr
    // 点击航线展示信息
    polyline.addEventListener("click", polylineDetail.bind(this, data.name), false);
    map.addOverlay(polyline);
    mapOverlay.push(polyline)


    function polylineDetail(name) {
        // 创建信息窗口展示图文
        var infoWindow = null
        let content = '航线名: ' + name
        infoWindow = new BMap.InfoWindow(content, {
            'title': '航线'
        });  // 创建信息窗口对象 
        map.openInfoWindow(infoWindow, mapPos); //开启信息窗口
    }

    return polyline
}

// 创建航路点
function createMakerDot(item) {
    // 创建航路点
    let pt = null
    let myIcon = null
    pt = new BMap.Point(item.lng, item.lat);
    myIcon = new BMap.Icon(item.icon, new BMap.Size(20, 20), { imageSize: new BMap.Size(20, 20) });
    //创建点
    let marker = new BMap.Marker(pt, { icon: myIcon });
    marker.id = 'markerLine' + item.id

    makerEvent(marker, item, pt)
    // 点击标注展示信息
    function makerEvent(marker, item, pt) {
        marker.addEventListener("click", showDetail.bind(marker, item, pt));
        lineMakerArr.push(marker)
        map.addOverlay(marker);
        function showDetail(item, pt) {
            // 创建信息窗口展示图文
            var infoWindow = null
            let content = '名称: ' + item.name
            infoWindow = new BMap.InfoWindow(content, {
                'title': '航路点'
            });  // 创建信息窗口对象 
            map.openInfoWindow(infoWindow, pt); //开启信息窗口
        }
    }
}

// 开启绘制航路点
function drawMakerDot(name) {
    newName = name
    lineMakerArr = []
    isDrawFlightLine = true
    tempId++
    let idName = 'flightLine'
    let markerOptions = {
        icon: new BMap.Icon("./images/m2.png", new BMap.Size(20, 20), { imageSize: new BMap.Size(20, 20) })
    }
    let obj = {
        isOpen: true, //是否开启绘制模式
        enableDrawingTool: false, //是否显示工具栏
        enableCalculate: false,
        markerOptions: markerOptions
    }
    drawingManager = new BMapLib.DrawingManager(map, obj);
    drawingManager.setDrawingMode(BMAP_DRAWING_MARKER)
    drawingManager.addEventListener("markercomplete", function (e, marker) {
        marker.id = 'markerLine' + tempId
        marker.name = 'markerName' + tempId
        lineMakerArr.push(marker)
    });

    map.addEventListener("mouseup", listenMouseUp);
    function listenMouseUp(e) {
        // 监听右键 并且是绘制航线的时候
        if (e.domEvent.button == 2 && isDrawFlightLine) {
            drawingManager.close()
            // 组装渲染数据，应该发往后台
            let item = {
                id: tempId,
                name: newName,
                flight_dots: []
            }
            // 找出创建点的point数组
            let points = []
            lineMakerArr.forEach(e => {
                item.flight_dots.push(
                    { id: e.id, lng: e.point.lng, lat: e.point.lat, name: e.name, icon: "./images/m2.png" }
                )
                points.push(new BMap.Point(e.point.lng, e.point.lat))
            });
            // 创建线
            let pov = makePolyline(points, { id: tempId, name: newName })
            isDrawFlightLine = false
            // 点击右键之后才添加
            // 增加到空域panel中
            createInputDom(idName, { id: tempId, name: newName })
            // 默认选中
            $(`#${pov.id}`).prop('checked', true)
            optCheckAndMap(idName + tempId, item, drawFlightLine)
            map.removeEventListener('mouseup', listenMouseUp)
        }
    }
}

