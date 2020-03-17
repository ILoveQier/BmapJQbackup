renderFlightLine()
let pois = []
let polyline = null
let markerDots = []
let isDrawFlightLine = false
let newName = ''
let isDotClick = false
let originLine = null
// 航线相关
function renderFlightLine() {
    let data = window.globalData.flightLine
    drawPanel(data, drawFlightline, 'flightLine')
}
// 绘制航线
function drawFlightline(data) {
    lineMakerArr = []
    // 创建polyline对象
    pois = [];
    data.flight_dots.forEach((item, index) => {
        createMakerDot(item, index === data.flight_dots.length - 1)
        pois.push(new BMap.Point(item.lng, item.lat))
    });

    makePolyline(pois, data)
}
// 制作航线函数
function makePolyline(pois, data) {
    let orginId = 0
    // 如果是点击继续航线添加按钮，先移除之前航线
    if (isDotClick) {
        orginId = originLine.id
        // originLine.lineMakerArr.forEach(e => {
        //     map.removeOverlay(e)
        // })
        let existIndex = mapOverlay.findIndex(ov => ov.id === orginId)
        mapOverlay.splice(existIndex, 1)
        map.removeOverlay(originLine)
    }

    polyline = new BMap.Polyline(pois, {
        enableEditing: false,//是否启用线编辑，默认为false
        enableClicking: true,//是否响应点击事件，默认为true
        strokeWeight: '5',//折线的宽度，以像素为单位
        strokeOpacity: 0.6,//折线的透明度，取值范围0 - 1
        strokeColor: "#000" //折线颜色
    });
    polyline.id = isDotClick ? orginId : data.id
    // 航线特殊的航路点
    polyline.lineMakerArr = lineMakerArr
    let lastMaker = polyline.lineMakerArr[lineMakerArr.length - 1]
    lastMaker.polyline = polyline
    polyline.originData = data
    // console.log(data);
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
function createMakerDot(item, isLast) {
    // 创建航路点
    let pt = null
    let myIcon = null
    pt = new BMap.Point(item.lng, item.lat);
    myIcon = new BMap.Icon(isLast ? './images/add.png' : item.icon, new BMap.Size(30, 30), { imageSize: new BMap.Size(30, 30) })
    //创建点
    let marker = new BMap.Marker(pt, { icon: myIcon });
    marker.id = 'marker' + item.id
    marker.name = item.name
    // 如果是最后一个修改图标为添加
    if (isLast) {
        marker.isLast = true
    }
    makerEvent(marker)
    // 点击标注展示信息
    function makerEvent(marker) {
        marker.addEventListener("click", showDetail);
        lineMakerArr.push(marker)
        map.addOverlay(marker);
    }
}
function showDetail(e) {
    e.domEvent.stopPropagation()
    if (window.parentCurrent === 2 && window.childCurrent === 1) {
        // 如果是最后一个，则新建点
        if (this.isLast) {
            // 先找到之前的航线
            originLine = this.polyline
            lineMakerArr = [...originLine.lineMakerArr]
            drawMakerDot(this.name, true)
            return
        }
        // 创建信息窗口展示图文
        var infoWindow = null
        let content = '名称: ' + this.name
        infoWindow = new BMap.InfoWindow(content, {
            'title': '航路点'
        });  // 创建信息窗口对象 
        map.openInfoWindow(infoWindow, this.point); //开启信息窗口
    }
}

// 开启绘制航路点
function drawMakerDot(name, dotClick = false) {
    isDotClick = dotClick
    newName = name
    isDrawFlightLine = true
    tempId++
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
        // 创建好的marker应该发往后台
        marker.id = 'marker' + tempId
        marker.name = 'markerName' + tempId
        marker.addEventListener("click", showDetail);
        lineMakerArr.push(marker)
    });

    map.addEventListener("mouseup", listenMouseUp);
    function listenMouseUp(e) {
        // 监听右键 并且是绘制航线的时候
        if (e.domEvent.button == 2 && isDrawFlightLine) {
            drawingManager.close()
            // 组装渲染数据，应该发往后台
            let item = {

                flight_dots: []
            }
            // 找出创建点的point数组
            let points = []
            lineMakerArr.forEach((e, index) => {
                // 如果是最后一个修改图标为添加
                e.setIcon(new BMap.Icon('./images/m2.png', new BMap.Size(20, 20), { imageSize: new BMap.Size(20, 20) }))
                e.isLast = false
                if (index === lineMakerArr.length - 1) {
                    e.isLast = true
                    e.setIcon(new BMap.Icon('./images/add.png', new BMap.Size(30, 30), { imageSize: new BMap.Size(30, 30) }))
                }
                item.flight_dots.push(
                    { id: e.id, ...e.point, name: e.name, icon: "./images/m2.png" }
                )
                points.push(e.point)
            });
            // 创建线
            let pov = null
            isDrawFlightLine = false
            // 如果是航线点击添加
            if (isDotClick) {
                // 获取原先的航线信息
                item.id = originLine.originData.id
                item.name = originLine.originData.name
                pov = makePolyline(points, item)
                // 必须给原来的checkbox id解绑一下，才能给新的id重新绑定
                $(`#${pov.id}`).unbind('click')
                optCheckAndMap(pov.id, item, drawFlightline)
            } else {
                // 如果是直接添加
                item.id = 'flightLine' + tempId
                item.name = newName
                pov = makePolyline(points, { id: 'flightLine' + tempId, name: newName })
                // 增加到空域panel中
                createInputDom('flightLine', { id: 'flightLine' + tempId, name: newName })
                // 默认选中
                $(`#${pov.id}`).prop('checked', true)
                optCheckAndMap('flightLine' + tempId, item, drawFlightline)
            }
            isDotClick = false
            map.removeEventListener('mouseup', listenMouseUp)
        }
    }
}

