addAreaOrLine()
// 覆盖物数组
let mapOverlay = []
// 航路点数组
let lineMakerArr = []
// 临时id 为来用数据库创建id
let tempId = 100
let currentItem = null
// 切换显示隐藏
function panelShowOff() {
    $('.map-right-areaAndLine .title').text(window.childCurrent === 0 ? '空域' : '航线')
    if (window.parentCurrent === 2 && window.childCurrent === 0) {
        $('#flightArea').show()
        $('#flightLine').hide()
    } else if (window.childCurrent === 1) {
        $('#flightArea').hide()
        $('#flightLine').show()
    }
}
// 创建右边飞行操作面板
function drawPanel(data, callback, idName) {
    // 这一系列操作是为了给content创建id，为了以后显隐
    let contentWrapDom = $(`
        <div class="check-content" id="${idName}">
                        
        </div>
        `)
    $('.check-wrap').append(contentWrapDom)

    data.forEach(item => {
        createInputDom(idName, item)
        // 给checkbox增加点击判断
        optCheckAndMap(item.id, item, callback)
    })
    // 创建完dom后再显隐
    panelShowOff()
}
// 飞行操作面板的添加事件
function addAreaOrLine() {
    // 点击遮罩关闭
    $('#areaOrLineAddMask').click(function () {
        $('#areaOrLineAddMask').fadeOut(300)
    })
    // 点击按钮显示遮罩
    $('#alAddbtn').click(e => {
        $('#areaOrLineAddMask').fadeIn(300)
        $('.add-item-wrap').empty()
        let dom = null
        if (window.childCurrent === 0) {
            dom = $(`
            <div class="add-item">
                <span>空域名称：</span>
                <input type="text" placeholder="请输入空域名称" id="shape-name">
            </div>
            <div class="add-item">
                <span class="title">空域类型：</span>
                <select name="shapeType" id="shape-type">
                <option value="1">椭圆</option>
                    <option value="0">圆</option>
                    <option value="2">多边形</option>
                </select>
            </div>
            `)
        } else if (window.childCurrent === 1) {
            dom = $(`
            <div class="add-item">
                <span>航线名称：</span>
                <input type="text" placeholder="请输入航线名称" id="shape-name">
            </div>
            `)

        }
        $('.add-content .add-type').html(window.childCurrent === 0 ? '增加空域' : '增加航线')
        $('.add-item-wrap').append(dom)
    })
    // 点击内容不关闭
    $('#areaOrLineAddMask .add-content').click(e => {
        e.stopPropagation()
    })
    // 增加按钮点击
    $('#areaOrLineAddMask .add-content .add-btn').click(e => {
        if (e.target.className == 'cancel') {
            $('#areaOrLineAddMask').fadeOut(300)
        } else if (e.target.className == 'confirm') {
            // 如果点击确定，并且是空域
            if (window.childCurrent === 0) {
                $('#shape-name').on('keyup', function (e) {
                    $(this).val($(this).val().replace(/\s+/g, ''))
                })
                // 点击确认后,关闭遮罩并且绘制
                let sname = $('#shape-name').val().trim()
                let stype = $('#shape-type').val() / 1
                if (sname === '') return alert('名称不能为空')

                $('#areaOrLineAddMask').fadeOut(300)
                // 开启绘制空域模式
                drawArea(sname, stype)
            } else if (window.childCurrent === 1) {
                // 如果点击确定，并且是航线
                $('#shape-name').on('keyup', function (e) {
                    $(this).val($(this).val().replace(/\s+/g, ''))
                })
                // 点击确认后,关闭遮罩并且绘制
                let sname = $('#shape-name').val().trim()
                if (sname === '') return alert('名称不能为空')
                $('#areaOrLineAddMask').fadeOut(300)
                // 开启绘制航线模式
                lineMakerArr = []
                drawMakerDot(sname)
            }
        }
    })
}
// 操作checkbox和覆盖物的显隐
function optCheckAndMap(id, item, callback) {
    $(`#${id}`).click(function () {
        if ($(this).prop("checked")) {
            // 渲染空域或者航线
            callback(item)
        } else {
            // 取消空域或航线渲染
            let id = $(this).attr('id')
            // 找到复选框和mapoverlay一样的位置，并且移除覆盖物
            let existIndex = mapOverlay.findIndex(ov => {
                if (ov.id == id) {
                    // 如果是航线，需要单独处理下航路点的移除
                    if (ov.lineMakerArr && ov.lineMakerArr.length) {
                        ov.lineMakerArr.forEach(e => {
                            map.removeOverlay(e)
                        })
                    }
                    map.removeOverlay(ov)
                }
                return ov.id == id
            })
            // 如果找到了才从覆盖物数组中删除
            if (existIndex !== -1) {
                mapOverlay.splice(existIndex, 1)
            }
        }
    })
}
// 创建显隐的checkbox
function createInputDom(idName, item) {
    let dom = $(`
    <div class="check-item">
        <label for="${item.id}">
            <input id="${item.id}" type="checkbox"/>
            <span>${item.name}</span>
        </label>
    </div>`)

    $(`.check-wrap .check-content#${idName}`).append(dom)
}