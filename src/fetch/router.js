
// 路由地址配置
let defaultSuffixTitle = ' - 师训宝学员平台';

// let viewtitle=this.$store.getters.title;
export default {
    // 通用页面
    common: {
        // 页面不存在
        notFound: {
            path: '/404',
            title: '404' + defaultSuffixTitle,
        },
        // 无权限访问该页面
        forbidden: {
            path: '/403',
            title: '403' + defaultSuffixTitle,
        },
        // 服务器错误
        serverError: {
            path: '/500',
            title: '500' + defaultSuffixTitle,
        }
    },

    // 登录
    login: {
        account: {
            path: '/login',
            title: '账号登录' + defaultSuffixTitle,
        }
    },

    // 登出
    logout: {
        index: {
            path: '/logout'
        }
    },

    // 班级页面
    class: {
        // 基础
        home: {
            path: '/'
        },
        // 首页
        index: {
            path: '/index',
            title: '班级首页' + defaultSuffixTitle,
        },
        //班级选择
        choose: {
            path: "/choose",
            title: "选择班级" + defaultSuffixTitle
        }
    },

    // 资源页面
    resource: {
        // 资源首页
        index: {
            path: '/resource',
            title: '资源首页' + defaultSuffixTitle,
        },
        // 资源文件夹列表
        folderlist: {
            path: '/resource/list',
            title: '资源列表' + defaultSuffixTitle,
        }

    },

    // 作业
    work: {
        // 做作业
        // dowork: {
        // 	path: '/work/dowork',
        // 	title: '去做作业' + defaultSuffixTitle,
        // },
        // 查看作业
        viewwork: {
            path: '/work/viewwork',
            title: '查看作业' + defaultSuffixTitle,
        },
        // 编辑作业
        updatework: {
            path: '/work/updatework',
            title: '编辑作业' + defaultSuffixTitle,
        },
        // 已过期作业
        overwork: {
            path: '/work/overwork',
            title: '已过期作业' + defaultSuffixTitle,
        }
    },

    // CC直播
    CClive: {
        // 直播列表
        list: {
            path: '/CClive/list',
            title: '直播列表页' + defaultSuffixTitle,
        },
        // 查看直播
        liveview: {
            path: '/CClive/liveview',
            title: '直播视频页' + defaultSuffixTitle,
        },
        // 查看回放
        playbackview: {
            path: '/CClive/playbackview',
            title: '回播视频页' + defaultSuffixTitle,
        }
    },
    //网络课程
    Online: {
        // 网络课程页
        learn: {
            path: '/Online/learn',
            title: '网络课程页' + defaultSuffixTitle,
        },
        // 选课中心
        choose: {
            path: '/Online/choose',
            title: '选课中心',
        },
        // 查看直播
        viewcourse: {
            path: '/Online/viewcourse',
            title: 'viewtitle',
        }
    },
    //我的投票
    Vote: {
        //投票列表页
        vote: {
            path: '/Vote/votelist',
            title: '我的投票' + defaultSuffixTitle,
        },
        //投票详情页
        votedetail: {
            path: '/Vote/votedetail',
            title: '我的投票' + defaultSuffixTitle,
        },
        //投票编辑页
        voteedit: {
            path: '/Vote/votededit',
            title: '我的投票' + defaultSuffixTitle,
        }
    },
    //我的问卷
    Question: {
        //问卷列表页
        question: {
            path: '/Question/questionlist',
            title: '我的问卷' + defaultSuffixTitle,
        },
        //问卷详情页
        questiondetail: {
            path: '/Question/questiondetail',
            title: '我的问卷' + defaultSuffixTitle,
        },
        //问卷编辑页
        questionedit: {
            path: '/Question/questionedit',
            title: '我的问卷' + defaultSuffixTitle,
        }
    },
    //我的评价
    Evaluation: {
        //评价列表页
        evaluation: {
            path: '/Evaluation/evaluationlist',
            title: '我的评价' + defaultSuffixTitle,
        },
        //评价详情页
        evaluationdetail: {
            path: '/Evaluation/evaluationdetail',
            title: '我的评价' + defaultSuffixTitle,
        },
        evaluationedit: {
            path: '/Evaluation/evaluationedit',
            title: '我的评价' + defaultSuffixTitle,
        }
    },
    //我的反思
    Refl: {
        //反思列表页
        refl: {
            path: '/Refl/refllist',
            title: '我的反思' + defaultSuffixTitle,
        },
        //反思详情页
        refldetail: {
            path: '/Refl/refldetail',
            title: '我的反思' + defaultSuffixTitle,
        },
        refledit: {
            path: '/Refl/refledit',
            title: '我的反思' + defaultSuffixTitle,
        }
    }
}