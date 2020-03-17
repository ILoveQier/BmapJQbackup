
// 创建全局当前图标元素
window.chooseObj = {}

window.parentCurrent = 2
window.childCurrent = 1

// 全局数据
window.globalData = {
    markData: [{
        id: 1,
        type: "flight_dot",
        type_name: "航路点",
        icon_url: "./images/m2.png",
        input: {
            name: {
                label: "名称",
                type: 'text'
            },
            height: {
                label: "高度",
                type: 'text'
            },

        }
    }, {
        id: 2,
        type: "navigator_img",
        type_name: "导航图片",
        icon_url: "./images/m3.png",
        input: {
            name: {
                label: "名称",
                type: 'text'
            },

            picture: {
                label: "图像",
                type: "file",
                file_type: "image"
            },
        }
    }, {
        id: 3,
        type: "navigator_video",
        type_name: "导航视频",
        icon_url: "./images/m4.png",
        input: {
            name: {
                label: "名称",
                type: 'text'
            },
            video: {
                label: "视频",
                type: "file",
                file_type: "video"
            }
        }
    }],
    measureData: [{
        id: 4,
        type: "measure_distance",
        type_name: "测距",
        icon_url: "./images/phone.png",
    }, {
        id: 5,
        type: "measure_angel",
        type_name: "测量角度",
        icon_url: "./images/quanjing.png",
    }],
    planData: [
        {
            id: 0,
            planDate: '2020311',
            planDetail: {
                planNum: 20200311,
                planFirm: '直升机一营',
                planTime: '10:12至20:33',
                planHelicaptor: [
                    {
                        num: 399,
                        attach: '(科目三，河流)'
                    },
                    {
                        num: 421,
                        attach: '(科目二，山川)'
                    }
                ]
            }
        },
        {
            id: 1,
            planDate: '2020312',
            planDetail: {
                planNum: 20200312,
                planFirm: '直升机2营',
                planTime: '11:42至15:33',
                planHelicaptor: [
                    {
                        num: 259,
                        attach: '(科目1，大地)'
                    },
                    {
                        num: 687,
                        attach: '(科目6，天空)'
                    }
                ]
            }
        },
        {
            id: 2,
            planDate: '2020313',
            planDetail: {
                planNum: 20200313,
                planFirm: '直升机3营',
                planTime: '12:12至17:13',
                planHelicaptor: [
                    {
                        num: 653,
                        attach: '(科目4，平原)'
                    },
                    {
                        num: 378,
                        attach: '(科目5，海洋)'
                    }
                ]
            }
        },
        {
            id: 2,
            planDate: '2020313',
            planDetail: {
                planNum: 20200313,
                planFirm: '直升机3营',
                planTime: '12:12至17:13',
                planHelicaptor: [
                    {
                        num: 653,
                        attach: '(科目4，平原)'
                    },
                    {
                        num: 378,
                        attach: '(科目5，海洋)'
                    }
                ]
            }
        },
        {
            id: 2,
            planDate: '2020313',
            planDetail: {
                planNum: 20200313,
                planFirm: '直升机3营',
                planTime: '12:12至17:13',
                planHelicaptor: [
                    {
                        num: 653,
                        attach: '(科目4，平原)'
                    },
                    {
                        num: 378,
                        attach: '(科目5，海洋)'
                    }
                ]
            }
        },
        {
            id: 2,
            planDate: '2020313',
            planDetail: {
                planNum: 20200313,
                planFirm: '直升机3营',
                planTime: '12:12至17:13',
                planHelicaptor: [
                    {
                        num: 653,
                        attach: '(科目4，平原)'
                    },
                    {
                        num: 378,
                        attach: '(科目5，海洋)'
                    }
                ]
            }
        },
        {
            id: 2,
            planDate: '2020313',
            planDetail: {
                planNum: 20200313,
                planFirm: '直升机3营',
                planTime: '12:12至17:13',
                planHelicaptor: [
                    {
                        num: 653,
                        attach: '(科目4，平原)'
                    },
                    {
                        num: 378,
                        attach: '(科目5，海洋)'
                    }
                ]
            }
        },
        {
            id: 2,
            planDate: '2020313',
            planDetail: {
                planNum: 20200313,
                planFirm: '直升机3营',
                planTime: '12:12至17:13',
                planHelicaptor: [
                    {
                        num: 653,
                        attach: '(科目4，平原)'
                    },
                    {
                        num: 378,
                        attach: '(科目5，海洋)'
                    }
                ]
            }
        },
        {
            id: 2,
            planDate: '2020313',
            planDetail: {
                planNum: 20200313,
                planFirm: '直升机3营',
                planTime: '12:12至17:13',
                planHelicaptor: [
                    {
                        num: 653,
                        attach: '(科目4，平原)'
                    },
                    {
                        num: 378,
                        attach: '(科目5，海洋)'
                    }
                ]
            }
        },
        {
            id: 2,
            planDate: '2020313',
            planDetail: {
                planNum: 20200313,
                planFirm: '直升机3营',
                planTime: '12:12至17:13',
                planHelicaptor: [
                    {
                        num: 653,
                        attach: '(科目4，平原)'
                    },
                    {
                        num: 378,
                        attach: '(科目5，海洋)'
                    }
                ]
            }
        },
        {
            id: 2,
            planDate: '2020313',
            planDetail: {
                planNum: 20200313,
                planFirm: '直升机3营',
                planTime: '12:12至17:13',
                planHelicaptor: [
                    {
                        num: 653,
                        attach: '(科目4，平原)'
                    },
                    {
                        num: 378,
                        attach: '(科目5，海洋)'
                    }
                ]
            }
        },
        {
            id: 2,
            planDate: '2020313',
            planDetail: {
                planNum: 20200313,
                planFirm: '直升机3营',
                planTime: '12:12至17:13',
                planHelicaptor: [
                    {
                        num: 653,
                        attach: '(科目4，平原)'
                    },
                    {
                        num: 378,
                        attach: '(科目5，海洋)'
                    }
                ]
            }
        }
    ],
    flightArea: [
        {
            id: 0,
            name: "一号空域",
            shape_type: "ellipse",
            shape_data: {
                lng: 104.0, lat: 30.7, long: 0.01, short: 0.02
            }
        },
        {
            id: 1,
            name: "二号空域",
            shape_type: "polygon",
            shape_data: [{ lng: 104.04, lat: 30.72 }, { lng: 104.05, lat: 30.75 }, { lng: 104.08, lat: 30.8 }, { lng: 104.19, lat: 30.88 }]
        },
        {
            id: 2,
            name: "三号空域",
            shape_type: "circle",
            shape_data: {
                lng: 104.01, lat: 30.6, r: 1332
            }
        }
    ],
    flightLine: [
        {
            id: 10,
            name: "一号航线",
            flight_dots: [{ id: 1, lng: 104.0, lat: 30.7, name: 'a', icon: "./images/m2.png" }, { id: 2, lng: 104.1, lat: 30.8, name: 'b', icon: "./images/m2.png" }, { id: 3, lng: 104.2, lat: 30.7, name: 'c', icon: "./images/m2.png" }]
        },
        {
            id: 11,
            name: "二号航线",
            flight_dots: [{ id: 4, lng: 103.9, lat: 30.84, name: 'd', icon: "./images/m2.png" }, { id: 5, lng: 104.13, lat: 30.73, name: 'e', icon: "./images/m2.png" }, { id: 6, lng: 104.12, lat: 30.67222, name: 'f', icon: "./images/m2.png" }]
        }
    ]
}


