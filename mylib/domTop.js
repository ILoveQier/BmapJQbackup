// <!-- 操作top dom标签栏切换代码 -->

window.parentCurrent == 2 ? $('.child-btn').show() : $('.child-btn').hide()
$('.parent-btn').children(`span:eq(${window.parentCurrent})`).addClass('is-btn-current')
$('.child-btn').children(`span:eq(${window.childCurrent})`).addClass('is-btn-current')

// 初始化左边显示
judgeCurrent(window.parentCurrent, true)

$('.parent-btn').click(function (e) {
    e.stopPropagation()
    window.parentCurrent = Number(e.target.dataset.id)
    $('.map-right-areaAndLine').hide()

    $(this).children().removeClass('is-btn-current');
    $(this).children(`span:eq(${window.parentCurrent})`).addClass('is-btn-current')
    judgeCurrent(window.parentCurrent, true)
    if (window.parentCurrent === 0) {
        // 如果是标记点
        markStart()
    } else if (window.parentCurrent === 1) {
        // 如果是测量的话，初始加载测距功能
        measureStart()
    } else if (window.parentCurrent === 2) {
        // 空域和航线相关
        $('.map-right-areaAndLine').show()
    }
    // 如果不是测量的标签，清空监听
    if (window.parentCurrent !== 1) {
        myDis.close();
        if (drawingManager) {
            drawingManager._mask.dispatchEvent('dblclick')
            drawingManager.close()
            map.removeEventListener('mouseup', countNum, false)
        }
    }
    window.parentCurrent == 2 ? $('.child-btn').show() : $('.child-btn').hide()
});
$('.child-btn').click(function (e) {
    window.childCurrent = Number(e.target.dataset.id)
    // 点击切换空域和航线的显隐
    panelShowOff()
    $(this).children('span').removeClass('is-btn-current');
    $(this).children(`span:eq(${window.childCurrent})`).addClass('is-btn-current')
})

// 左部图标区域
$('.allmap-left .close').click(e => {
    judgeCurrent(window.parentCurrent, false)
})


// 拍照
$('.allmap-right .take-photo').click(e => {
    alert('截图拍照')
})