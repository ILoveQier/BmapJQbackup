
renderPlanContent()
// 初始化默认选中第一个日志
function renderPlanContent() {
    let data = window.globalData.planData
    // 展示上边飞行列表
    data.forEach(e => {
        let dom = $(`
            <div data-item='${JSON.stringify(e)}'>${e.planDate}</div>
        `)
        dom.click(function () {
            // 增加dom单击样式
            $(this).addClass("current-plan-choose").siblings().removeClass("current-plan-choose");
        })
        $('.map-left-plan .content').append(dom)
    });

    // 初始化默认第一个
    $('.map-left-plandetail').empty()
    $('.map-left-plandetail').append(getDetailDom(data[0].planDetail))
    $('.map-left-plan .content div:eq(0)').addClass("current-plan-choose");
    // 点击获取详细内容
    $('.map-left-plan .content').click(function (e) {
        // 数据量小，会点击到content
        if (!Object.keys(e.target.dataset).length) {
            return
        }
        let item = JSON.parse(e.target.dataset.item)
        let obj = item.planDetail

        $('.map-left-plandetail').empty()
        $('.map-left-plandetail').append(getDetailDom(obj))

    })
    function getDetailDom(obj) {
        function fn(obj) {
            // 直升机小循环
            let item = obj.planHelicaptor
            let str = ''
            item.forEach(e => {
                str +=
                    '<div><span>' + e.num + '</span>' +
                    '<span>' + e.attach + '</span></div>'
            });
            return str
        }
        return $(`
        <div class="detail-item">
            <span>计划编号：</span>
            <span>${obj.planNum}</span>
        </div>
        <div class="detail-item">
            <span>单位：</span>
            <span>${obj.planFirm}</span>
        </div>
        <div class="detail-item">
            <span>训练时间：</span>
            <span>${obj.planTime}</span>
        </div>
        <div class="detail-item">
            <span>直升机：</span>
            <div style="display: inline-block;vertical-align: top;">
                ${fn(obj)}
            </div>
        </div>
`)


    }


}