// < !--操作地图测量测距的业务代码 -->
var angel = 0
var point = null
var count = 0
var arr = []

function measureStart() {
    switch (window.chooseObj.type) {
        case 'measure_distance':
            // 关闭measure_angel监听
            if (drawingManager) {
                drawingManager.close()
                map.removeEventListener('mouseup', countNum, false)
            }
            // var myDis = new BMapLib.DistanceTool(map);
            myDis.open();  //开启鼠标测距
            break;
        case 'measure_angel':
            myDis.close();  //关闭鼠标测距
            drawAngel()
            break;
        default:
            break;
    }
}

function drawAngel() {
    arr = []
    count = 0
    drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: false, //是否显示工具栏
        enableCalculate: false,
        polylineOptions: styleOptions, //线的样式
    });
    // 开启绘图
    drawingManager.open()
    drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);
    drawingManager.addEventListener('polylinecomplete', polylinecomplete);
    map.addEventListener('mouseup', countNum);
}

// 线画完触发的回调
function polylinecomplete(overlay) {
    // 防止用户点击测距然后切换tabbtn
    if (window.parentCurrent !== 1) {
        return
    }
    // 增加删除覆盖物
    overlayDelete()
    // 给角度覆盖物增加点击事件
    overlay.addEventListener('click', function (e) { clickHandlerWithArg(e, angel) })
    function clickHandlerWithArg(e, angel) {
        openInfo.call(map, angel, point)
    }

    function overlayDelete() {
        var pt = new BMap.Point(point.lng, point.lat);
        let imgurl = 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=396093129,3474375624&fm=26&gp=0.jpg'
        var myIcon = new BMap.Icon(imgurl, new BMap.Size(20, 20), { imageSize: new BMap.Size(20, 20) });
        var marker2 = new BMap.Marker(pt, { icon: myIcon });  // 创建标注
        marker2.addEventListener('click', function (e) {
            // 清除角度覆盖物
            map.removeOverlay(overlay)
            // 清除自己
            map.removeOverlay(this)
        })
        map.addOverlay(marker2);
    }

    // window.lineOverlay.push(overlay)
}
// 计算点击次数
function countNum(e) {
    count++
    arr.push({
        ...e.point
    })
    // 点击第三次取消继续绘制，提高用户体验
    if (count == 3) {
        count = 0
        // 获取角度
        angel = angleOflocation(arr).toFixed(2)
        point = arr[1]
        openInfo.call(this, angel, point)
        this.removeEventListener('mouseup', countNum, false)
        changeClick(e)
        // 当点击第三个点的时候让线消失,触发画线的双击事件
        function changeClick(event) {
            for (const key in drawingManager._mask.__listeners.onmousedown) {
                if (drawingManager._mask.__listeners.onmousedown.hasOwnProperty(key)) {
                    const ele = drawingManager._mask.__listeners.onmousedown[key];
                    ele(event)
                }
            }
            drawingManager._mask.dispatchEvent('dblclick')
        }
    }
}

function openInfo(content, point) {
    var opts = {
        width: 200,     // 信息窗口宽度
        height: 100,     // 信息窗口高度
        title: "测得角度", // 信息窗口标题
    }
    var p = new BMap.Point(point.lng, point.lat);
    var infoWindow = new BMap.InfoWindow(content + '', opts);  // 创建信息窗口对象 
    this.openInfoWindow(infoWindow, p); //开启信息窗口
}

// lat,lng为弧度表示的经纬度，r为地球半径，由于是算夹角，r是多少不重要
function ball2xyz(lat, lng, r = 6400) {
    return {
        x: r * Math.cos(lat) * Math.cos(lng),
        y: r * Math.cos(lat) * Math.sin(lng),
        z: r * Math.sin(lat)
    };
}
// https://blog.csdn.net/reborn_lee/article/details/82497577
// 将地理经纬度转换成笛卡尔坐标系
function geo2xyz({ lat, lng }) {
    let thera = (Math.PI * lat) / 180;
    let fie = (Math.PI * lng) / 180;
    return ball2xyz(thera, fie);
}

// 计算3个地理坐标点之间的夹角
function angleOflocation(arr) {
    let p1 = geo2xyz(arr[0]);
    let p2 = geo2xyz(arr[1]);
    let p3 = geo2xyz(arr[2]);

    let { x: x1, y: y1, z: z1 } = p1;
    let { x: x2, y: y2, z: z2 } = p2;
    let { x: x3, y: y3, z: z3 } = p3;

    // 计算向量 P2P1 和 P2P3 的夹角 https://www.zybang.com/question/3379a30c0dd3041b3ef966803f0bf758.html
    let _P1P2 = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
    let _P2P3 = Math.sqrt((x3 - x2) ** 2 + (y3 - y2) ** 2 + (z3 - z2) ** 2);

    let P = (x1 - x2) * (x3 - x2) + (y1 - y2) * (y3 - y2) + (z1 - z2) * (z3 - z2); //P2P1*P2P3

    return (Math.acos(P / (_P1P2 * _P2P3)) / Math.PI) * 180;
}