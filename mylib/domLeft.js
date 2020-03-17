

// 用于给左边图标配置样式的函数
function judgeCurrent(p, isShow) {

    $('.allmap-left').children().hide()
    if (isShow) {
        $('.allmap-left .close').show()
        $('.allmap-left').show()
    } else {
        $('.allmap-left').hide()
        return
    }
    $('.allmap-left').css({
        'width':'10%'
    })
    // todo 
    $('.allmap-left').hide()
    // todo
    switch (Number(p)) {
        case 0:
            renderData(window.globalData.markData, '.map-left-mark')
            markStart()
            break;
        case 1:
            renderData(window.globalData.measureData, '.map-left-measure')
            measureStart()
            break;
        default:
            $('.map-left-task').show()
            $('.allmap-left').css({
                'width':'20%'
            })
            break;
    }

    // 给左部的图标设置点击事件，只有在dom创建完毕后才行
    // mark的处理
    $('.allmap-left .map-left-mark .map-icon').click(function (e) {
        window.chooseObj = JSON.parse(e.currentTarget.dataset.item)
        markStart()
        $(this).siblings().removeClass('is-icon-choose');
        $(this).addClass('is-icon-choose');
    })
    // measure的处理
    $('.allmap-left .map-left-measure .map-icon').click(function (e) {
        window.chooseObj = JSON.parse(e.currentTarget.dataset.item)
        measureStart()
        $(this).siblings().removeClass('is-icon-choose');
        $(this).addClass('is-icon-choose');
    })
}
// 渲染左边图标数据的函数
function renderData(data, wrap) {
    // 清空左边所有数据
    $(wrap).children().remove()
    // 显示标记，请求数据
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        item.current = i
        let ele = $(
            `<div class='map-icon' data-item='${JSON.stringify(item)}'>
                    <img src='${item.icon_url}' class='img'/>
                    <span>${item.type_name}</span>
                </div >`)
        $(wrap).append(ele)
    }
    // 多增加一个防止布局混乱
    let e = $(
        `<div class='map-icon'>
                </div >`)
    // 赋值初始值为第一个图标对象
    window.chooseObj = data[0]

    renderDom(wrap)
    $(wrap).append(e)
    // 渲染dom添加当前点击的图标样式
    function renderDom(className) {
        $(`.allmap-left ${className} .map-icon:eq(${window.chooseObj.current})`).addClass('is-icon-choose')
        $(className).show()
    }
}


