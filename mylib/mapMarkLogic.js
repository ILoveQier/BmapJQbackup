// < !--操作地图标记点的业务代码 -->
markStart()
function markStart() {
    map.removeEventListener('click', showInfo, false)
    // 增加点击事件创建点
    map.addEventListener("click", showInfo);
}
function showInfo(e) {
    let obj = window.chooseObj
    // 如果点击到了标志点，不执行创建操作
    if (typeof (e.domEvent.toElement.className) === 'string' && e.domEvent.toElement.className.includes('BMap_noprint')) {
        return
    }
    // 如果点击的不是标记点按钮，不执行
    if (window.parentCurrent !== 0) {
        return
    }
    // 创建录入信息
    createInfoDom()
    function createInfoDom() {
        let markItem = e
        // 手机dom的id，点确定的时候发往后台
        let ids = []
        $('#inputNameWrap').show()

        $("#inputNameWrap input").val("");

        $('#inputNameWrap').css({
            'top': `${e.clientY - $('#inputNameWrap').height() / 2}px`,
            'left': `${e.clientX - $('#inputNameWrap').width() / 2}px`
        })

        $('#inputNameWrap .input-content-wrap').empty()
        for (const key in obj.input) {
            let item = obj.input[key]
            let inputType = ''
            // 根据类型觉得是输入框还是文件筐
            if (item.type == 'file') {
                inputType = `<input type="file"  
                    id='${key}'
                    name='${item.label}'
                    accept=
                    ${item.file_type == 'image' ? '.png,.jpg,.jpeg,image/png,image/jpg,image/jpeg' : 'video/mp4,audio/mp4'}
                    > `
            } else {
                inputType = item.label == '名称' ? `<input type="text"
                    placeholder='请输入名称'
                    name='${item.label}'
                    id='${key}'
                    > `: `<input  type="number" 
                    oninput="if(value.length>4)value=value.slice(0,4)" 
                    placeholder='请输入高度'
                    name='${item.label}'
                    id='${key}'
                    >`
            }

            let dom = $(`
            <div class="input-content">
                <span>${item.label}：</span>
                ${inputType}
            </div>
            `)

            ids.push(`${key}`)
            $('#inputNameWrap .input-content-wrap').append(dom)
        }

        // 监听点击按钮事件
        $('#inputNameWrap').click(function (e) {
            if (e.target.className == 'cancel') {
                $(this).hide()
                $(this).unbind()
            } else if (e.target.className == 'confirm') {
                // 点击确认后,发送请求给后台保存 todo
                saveMark(markItem, $(this))
            }
        })

        // 保存点信息
        function saveMark(item, that) {
            let getInfoObj = {}
            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                let val = $(`#${id}`).val().trim()
                if (!val) {
                    alert($(`#${id}`).attr('name') + '没有传入')
                    return
                } else {
                    getInfoObj[$(`#${id}`).attr('id')] = val
                }
            }

            //缓存数据
            data = JSON.parse(localStorage.getItem('MapMarkerData')) || [];
            data.push({
                id: obj.id,
                type: obj.type,
                type_name: obj.type_name,
                icon_url: obj.icon_url,
                ...getInfoObj,
                Longitude: item.point.lng,
                latitude: item.point.lat,
            })
            localStorage.setItem('MapMarkerData', JSON.stringify(data))

            // 创建点
            createMark(markItem, obj, getInfoObj)
            that.hide()
            that.unbind()
        }

    }
}
// 创建点
function createMark(e, obj, getInfoObj = {}, data = null) {
    // 如果是初始化创建点
    let pt = null
    let myIcon = null
    if (data) {
        pt = new BMap.Point(data.Longitude, data.latitude);
        myIcon = new BMap.Icon(data.icon_url, new BMap.Size(50, 50), { imageSize: new BMap.Size(50, 50) });
    } else {
        pt = new BMap.Point(e.point.lng, e.point.lat);
        myIcon = new BMap.Icon(window.chooseObj.icon_url, new BMap.Size(50, 50), { imageSize: new BMap.Size(50, 50) });
    }
    //创建点
    var marker = new BMap.Marker(pt, { icon: myIcon });
    // 创建标注
    if (data) {
        marker.dataSet = data
    } else {
        marker.dataSet = {
            id: obj.id,
            type: obj.type,
            type_name: obj.type_name,
            icon_url: obj.icon_url,
            ...getInfoObj,
            Longitude: e.point.lng,
            latitude: e.point.lat,
        }
    }

    // 点击标注展示信息
    marker.addEventListener("click", getAttr);
    function getAttr(e) {
        $('#inputNameWrap').hide()

        // 创建信息窗口展示图文
        var infoWindow = null
        if (this.dataSet.type == 'flight_dot') {
            let content = '高度: ' + this.dataSet.height
            infoWindow = new BMap.InfoWindow(content, {
                'title': this.dataSet.name
            });  // 创建信息窗口对象 
        } else if (this.dataSet.type == 'navigator_img') {
            infoWindow = new BMap.InfoWindow(`<img src=${this.dataSet.picture} id=${this.dataSet.type + this.dataSet.id}>`);  // 创建信息窗口对象 
        } else if (this.dataSet.type == 'navigator_video') {
            infoWindow = new BMap.InfoWindow(`<video src="${this.dataSet.video}" controls="controls"></video>`);  // 创建信息窗口对象 
        }

        if (this.dataSet.type == 'navigator_img') {
            //图片加载完毕重绘infowindow
            $(`#${this.dataSet.type + this.dataSet.id}`).onload = function () {
                console.log(222);
                infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
            }
        }
        map.openInfoWindow(infoWindow, pt); //开启信息窗口

    }
    map.addOverlay(marker);
}
initMapMark()
// 初始化标志点
function initMapMark() {
    let MapMarkerData = JSON.parse(localStorage.getItem('MapMarkerData'))
    if (MapMarkerData) {
        for (const key in MapMarkerData) {
            createMark(null, null, null, MapMarkerData[key])
        }
    }
}

