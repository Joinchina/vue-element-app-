import Vue from 'vue'
import Router from 'vue-router'
import RouterConfig from '@/fetch/router'

//错误页面
const NotFound = resolve => require(['@/pages/error_page/NotFound'], resolve)
const Forbidden = resolve => require(['@/pages/error_page/Forbidden'], resolve)
const ServiceError = resolve => require(['@/pages/error_page/ServiceError'], resolve)

const Home = resolve => require(['@/pages/home/home'], resolve)
const Login = resolve => require(['@/pages/login/login'], resolve)

// 班级
const Index = resolve => require(['@/pages/index/index'], resolve)
const Choose = resolve => require(['@/pages/choose/choose'], resolve)

// 作业
const Dowork = resolve => require(['@/pages/work/dowork'], resolve)
const Viewwork = resolve => require(['@/pages/work/viewwork'], resolve)
const Updatework = resolve => require(['@/pages/work/updatework'], resolve)
const Overwork = resolve => require(['@/pages/work/overwork'], resolve)

// 资源
const ResourceIndex = resolve => require(['@/pages/resource/index'], resolve)
const ResourceList = resolve => require(['@/pages/resource/list'], resolve)

// 直播
const CCliveList = resolve => require(['@/pages/CClive/list'], resolve)
const CCliveView = resolve => require(['@/pages/CClive/liveview'], resolve)
const CCplaybackView = resolve => require(['@/pages/CClive/playbackview'], resolve)
//网络课程
const Onlinelearn = resolve => require(['@/pages/Online/learn'], resolve)
const Onlinechoose = resolve => require(['@/pages/Online/choose'], resolve)

/******************************************************直播页******************************************************************************/
const liveShow = () => import('../components/agora/myLiveShow')

const LiveLogin = () => import('../components/agora/login')

const liveShow2 = () => import('../components/agora/myLiveShow2')

const live = ()=>import('@/pages/live/liveShow');

/******************************************************直播页******************************************************************************/
const Onlineviewcourse = resolve => require(['@/pages/Online/previewCourse'], resolve)
//我的投票
const voteList = resolve => require(['@/pages/vote/vote_list'], resolve)
const voteEdit = resolve => require(['@/pages/vote/edit'], resolve)
const voteview = resolve => require(['@/pages/vote/view'], resolve)
//我的问卷
const questionlist = resolve => require(['@/pages/question/question_list'], resolve)
const questionEdit = resolve => require(['@/pages/question/edit'], resolve)
const questionview = resolve => require(['@/pages/question/view'], resolve)
//我的评价
const evaluationlist = resolve => require(['@/pages/evaluation/evaluation_list'], resolve)
const evaluationEdit = resolve => require(['@/pages/evaluation/edit'], resolve)
const evaluationview = resolve => require(['@/pages/evaluation/view'], resolve)
//我的反思
const refllist = resolve => require(['@/pages/refl/refl_list'], resolve)
const reflEdit = resolve => require(['@/pages/refl/edit'], resolve)
const reflview = resolve => require(['@/pages/refl/view'], resolve)
Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '*',
            redirect: { path: RouterConfig.common.notFound.path } //404页面
        },
        {
            path: '/',
            redirect: { path: RouterConfig.login.account.path }
        },
        {
            path: RouterConfig.common.notFound.path, // 404 页面
            component: NotFound,
            meta: {
                title: RouterConfig.common.notFound.title
            }
        },
        {
            path: RouterConfig.common.forbidden.path, // 403 页面
            component: Forbidden,
            meta: {
                title: RouterConfig.common.forbidden.title
            }
        },
        {
            path: RouterConfig.common.serverError.path, //500 页面
            component: ServiceError,
            meta: {
                title: RouterConfig.common.serverError.title
            }
        },
        {
            path: RouterConfig.login.account.path,
            name: 'login',
            component: Login,
            meta: {
                title: RouterConfig.login.account.title
            }
        },
        {
            path: RouterConfig.class.choose.path,
            name: 'choose',
            component: Choose,
            meta: {
                title: RouterConfig.class.choose.title
            }
        },
        {
            path: RouterConfig.class.home.path,
            component: Home,
            children: [
            {
                path: '/',
                redirect: { path: RouterConfig.class.index.path }
            },
            {
                path: RouterConfig.class.index.path,
                name: 'index',
                component: Index,
                meta: {
                    title: RouterConfig.class.index.title
                }
            },
            {
                path: RouterConfig.resource.index.path, //资源首页
                name: 'resourceindex',
                component: ResourceIndex,
                meta: {
                    title: RouterConfig.resource.index.title
                }
            },
            {
                path: RouterConfig.resource.folderlist.path, //资源文件夹列表
                name: 'resourcelist',
                component: ResourceList,
                meta: {
                    title: RouterConfig.resource.folderlist.title
                }
            },
            // {
            //     path: RouterConfig.work.dowork.path,        //做作业
            //     name: 'dowork',
            //     component: Dowork,
            //     meta: {
            //         title: RouterConfig.work.dowork.title
            //     }
            // },
            {
                path: RouterConfig.work.viewwork.path, //查看作业
                name: 'viewwork',
                component: Viewwork,
                meta: {
                    title: RouterConfig.work.viewwork.title
                }
            },
            {
                path: RouterConfig.work.updatework.path, //编辑作业
                name: 'updatework',
                component: Updatework,
                meta: {
                    title: RouterConfig.work.updatework.title
                }
            },
            {
                path: RouterConfig.work.overwork.path, //已过期作业
                name: 'overwork',
                component: Overwork,
                meta: {
                    title: RouterConfig.work.overwork.title
                }
            },
            {
                path: RouterConfig.CClive.list.path, // 直播列表
                name: 'CClivelist',
                component: CCliveList,
                meta: {
                    title: RouterConfig.CClive.list.title
                }
            },
            {
                path: RouterConfig.Online.learn.path, // 网络课程
                name: 'Onlinelearn',
                component: Onlinelearn,
                meta: {
                    title: RouterConfig.Online.learn.title
                }
            },
            {
                path: RouterConfig.Vote.vote.path, // 我的投票
                name: 'votelist',
                component: voteList,
                meta: {
                    title: RouterConfig.Vote.vote.title
                }
            },
            {
                path: RouterConfig.Question.question.path, // questionlist
                name: 'questionlist',
                component: questionlist,
                meta: {
                    title: RouterConfig.Question.question.title
                }
            },
            {
                path: RouterConfig.Evaluation.evaluation.path, // evaluationlist
                name: 'evaluationlist',
                component: evaluationlist,
                meta: {
                    title: RouterConfig.Evaluation.evaluation.title
                }
            },
            {
                path: RouterConfig.Refl.refl.path, // refllist
                name: 'refllist',
                component: refllist,
                meta: {
                    title: RouterConfig.Refl.refl.title
                }
            }
            ]
        },
        // 选课中心
        {
            path: RouterConfig.Online.choose.path, // 直播视频页
            name: 'Onlinechoose',
            component: Onlinechoose,
            meta: {
                title: RouterConfig.Online.choose.title
            }
        },
        // 网络课程播放界面
        {
            path: RouterConfig.Online.viewcourse.path, // 直播视频页
            name: 'Onlineviewcourse',
            component: Onlineviewcourse,
            meta: {
                title: RouterConfig.Online.viewcourse.title
            }
        },
        // 直播播放页
        {
            path: RouterConfig.CClive.liveview.path, // 直播视频页
            name: 'CCliveview',
            component: CCliveView,
            meta: {
                title: RouterConfig.CClive.liveview.title
            }
        },
        {
            path: RouterConfig.CClive.playbackview.path, // 回播视频页
            name: 'CCliveplayback',
            component: CCplaybackView,
            meta: {
                title: RouterConfig.CClive.playbackview.title
            }
        },


        /*********声网直播相关*************/
        {
            path: '/agora/login',
            component: LiveLogin,
        },

        {
            path: '/agora/liveShow',
            component: liveShow,
        },

        {
            path: '/agora/liveShow2',
            component: liveShow2,
        },

        {
            path: "/live/show",
            component: live,
            meta:{
                title:"视频直播"
            }
        },

        // 投票编辑
        {
            path: RouterConfig.Vote.voteedit.path, 
            name: 'voteEdit',
            component: voteEdit,
            meta: {
                title: RouterConfig.Vote.voteedit.title
            }
        },
        // 投票详情
        {
            path: RouterConfig.Vote.votedetail.path, 
            name: 'voteview',
            component: voteview,
            meta: {
                title: RouterConfig.Vote.votedetail.title
            }
        },
        // 问卷编辑
        {
            path: RouterConfig.Question.questionedit.path, 
            name: 'questionEdit',
            component: questionEdit,
            meta: {
                title: RouterConfig.Question.questionedit.title
            }
        },
        // 问卷详情
        {
            path: RouterConfig.Question.questiondetail.path, 
            name: 'questionview',
            component: questionview,
            meta: {
                title: RouterConfig.Question.questiondetail.title
            }
        },
        // 评价编辑
        {
            path: RouterConfig.Evaluation.evaluationedit.path, 
            name: 'evaluationEdit',
            component: evaluationEdit,
            meta: {
                title: RouterConfig.Evaluation.evaluationedit.title
            }
        },
        // 评价详情
        {
            path: RouterConfig.Evaluation.evaluationdetail.path, 
            name: 'evaluationview',
            component: evaluationview,
            meta: {
                title: RouterConfig.Evaluation.evaluationdetail.title
            }
        },
        // 我的反思
        {
            path: RouterConfig.Refl.refledit.path, 
            name: 'reflEdit',
            component: reflEdit,
            meta: {
                title: RouterConfig.Refl.refledit.title
            }
        },
        // 我的反思
        {
            path: RouterConfig.Refl.refldetail.path, 
            name: 'reflview',
            component: reflview,
            meta: {
                title: RouterConfig.Refl.refldetail.title
            }
        },
    ]
})