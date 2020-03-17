
renderFlightArea()

// 空域相关
function renderFlightArea() {
    // $('.check-wrap .check-content').empty()
    let data = window.globalData.flightArea
    drawPanel(data, drawFilghtArea, 'flightArea')
}

// 绘制空域图像
function drawFilghtArea(item) {
    let sdata = item.shape_data
    let picOvlay = null
    // 返回颜色选项
    function getOpt(color) {
        return { strokeColor: color, strokeWeight: 1, strokeOpacity: 1, fillColor: color, fillOpacity: .5 }
    }
    switch (item.shape_type) {
        // 椭圆
        case 'ellipse':
            //centre:椭圆中心点,X:横向经度,Y:纵向纬度
            function add_ellipse(centre, x, y) {
                var assemble = new Array();
                var angle;
                var dot;
                var tangent = x / y;
                for (i = 0; i < 36; i++) {
                    angle = (2 * Math.PI / 36) * i;
                    dot = new BMap.Point(centre.lng + Math.sin(angle) * y * tangent, centre.lat + Math.cos(angle) * y);
                    assemble.push(dot);
                }
                return assemble;
            }
            var point = new BMap.Point(sdata.lng, sdata.lat);
            picOvlay = new BMap.Polygon(add_ellipse(point, sdata.long, sdata.short), getOpt('green'));
            break;
        case 'circle':
            //centre:圆中心点,r:半径
            var point = new BMap.Point(sdata.lng, sdata.lat);
            picOvlay = new BMap.Circle(point, sdata.r, getOpt('red'));
            break;
        case 'polygon':
            //arr是多边形点数组,进行处理
            function add_polygon(arr) {
                return arr.map(item => {
                    return new BMap.Point(item.lng, item.lat)
                })
            }
            picOvlay = new BMap.Polygon(add_polygon(sdata), getOpt('blue'));
            break;
        default:
            break;
    }

    picOvlay.id = 'flightArea' + item.id
    mapOverlay.push(picOvlay)
    map.addOverlay(picOvlay);
}

// 开启空域绘制
function drawArea(sname, stype) {
    tempId++
    let idName = 'flightArea'
    styleOptions.strokeWeight = 1
    styleOptions.strokeOpacity = 1
    styleOptions.fillOpacity = .5
    let obj = {
        isOpen: true, //是否开启绘制模式
        enableDrawingTool: false, //是否显示工具栏
        enableCalculate: false,
    }
    drawingManager = new BMapLib.DrawingManager(map, obj);
    switch (stype) {
        case 0:
            styleOptions.fillColor = 'red'
            styleOptions.strokeColor = 'red'

            // 开启圆绘图
            drawingManager.circleOptions = styleOptions
            drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
            drawingManager.addEventListener('circlecomplete', circlecomplete);
            break;
        case 1:
            styleOptions.fillColor = 'green'
            styleOptions.strokeColor = 'green'

            // 开启椭圆绘图
            drawingManager.rectangleOptions = styleOptions
            drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
            drawingManager.addEventListener('rectanglecomplete', ellipsecomplete);
            break;
        case 2:
            styleOptions.fillColor = 'blue'
            styleOptions.strokeColor = 'blue'
            // 开启椭圆绘图
            drawingManager.polygonOptions = styleOptions
            drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
            drawingManager.addEventListener('polygoncomplete', polygoncomplete);
            break;

        default:
            break;
    }

    // 画圆的回调
    function circlecomplete(ov) {
        // 组装渲染数据，应该发往后台
        let item = {
            id: tempId,
            name: sname,
            shape_type: "circle",
            shape_data: {
                lng: ov.point.lng, lat: ov.point.lat, r: ov.getRadius()
            }
        }
        innerOptMap(ov, item)
    }
    // 画多边形的回调
    function polygoncomplete(ov) {
        // 组装渲染数据，应该发往后台
        let item = {
            id: tempId,
            name: sname,
            shape_type: "polygon",
            shape_data: [...ov.Qn]
        }
        innerOptMap(ov, item)
    }
    // 画椭圆的回调 todo
    function ellipsecomplete(ov) {
        let res = ov.Qn
        map.removeOverlay(ov)
        let item = {
            id: tempId,
            name: sname,
            shape_type: "ellipse",
            shape_data: {
                lng: (res[0].lng + res[1].lng) / 2, lat: (res[0].lat + res[3].lat) / 2, long: Math.abs(res[0].lng - res[1].lng) / 2, short: Math.abs(res[0].lat - res[3].lat) / 2
            }
        }
        // (椭圆特殊化处理)增加到空域panel中
        drawFilghtArea(item)
        drawingManager.close()
        // 增加到空域panel中
        createInputDom(idName, { id: tempId, name: sname })
        // 默认选中
        $(`#${idName + tempId}`).prop('checked', true)
        optCheckAndMap(idName + tempId, item, drawFilghtArea)
    }
    // 内部使用的小方法
    function innerOptMap(ov, item) {
        ov.id = idName + tempId
        mapOverlay.push(ov)
        map.addOverlay(ov);
        drawingManager.close()
        // 增加到空域panel中
        createInputDom(idName, { id: tempId, name: sname })
        // 默认选中
        $(`#${ov.id}`).prop('checked', true)
        optCheckAndMap(idName + tempId, item, drawFilghtArea)
    }
}