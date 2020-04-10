'use strict'
let api = "";
let host = window.location.host;
let soketUrl;
if (host.indexOf("stu.shixunbao.cn")>-1) {
    soketUrl = "stu.shixunbao.cn";
} else {
    soketUrl = "10.98.24.67";
}
if (process.env.NODE_ENV === "development") {
    api = '/api';
}
let WEB_CONFIG = {
    intServiceReqTimeout: 30000,
    queryType: "GET",
    url: "", //a 标签需要带上域名时修改本参数，默认为空
    version: "1.0", //版本号
    client: "web", //设备
    accessflag: new Date().getTime(), //随机标签
    coreHost: "http://core", // 设置二级域名接口

    urls: {
        //登录接口
        login: api + '/login',
        getSms: api + '/sms/',
        loginPhone: api + '/loginPhone',
        webSocket: soketUrl + "/qrcode/login/websocket",

        //班级选择页面
        clazzList: api + '/clazz/list',
        //通过班级Id查询班级
        clazzId: api + '/clazz/id',


        // 资源
        resourceList: api + '/resource/list', //学员后台：资源列表
        resourceId: api + '/resource/id', // 资源详情
        resourceDownLoad: api + '/resource/resourceDownLoad', //下载资源
        resourceTimelearn: api + '/resource/learn/reportLearnTime', //学习时长

        // 作业
        workList: api + '/homework/myHomeworkList', //作业列表
        workCommit: api + '/homework/commitHomework', //作业提交
        workDetails: api + '/homework/findOne', //作业详情,作业要求
        workDraft: api + '/homework/saveHomeworkDraft', // 作业暂存
        attachment: api + '/attachment/homework/office/upload', // 上传作业附件，只支持PPT、WORD
        gethomework: api + '/homework/downLoadAttachment', //下载作业
        // 阿里云
        aliyunUpload: api + '/aliyunoss/getUploadToken', // 获取阿里云权限
        aliyunAttachment: api + '/attachment/saveAttachmentInfo', // 上传阿里云附件文件信息
        aliyunossVideo: api + '/aliyunoss/token/homework/attachment/video', // 获取作业附件上传权限

        // 直播
        ccliveRecordList: api + '/live/getClazzLiveRecordList',   // 直播间回放列表
        ccliveList: api + '/live/getClazzRoomList',                 // 直播列表
        liveRecordList:api+'/livecourse/clazz/liveCourse/list',//直播列表
        getstudentdata:api+'/liveroom/student/live/data',//获取直播间数据
        kickoutList:api +'/liveroom/kickout/user/list',//踢出用户列表
        liveroomPlayUrl:api +'/liveroom/push/play/url',//获取直播间推流地址

        // 网课学习
        onlineclazzlist: api + '/onlinecourse/clazz/required/course/list', //查询班级“必修课”
        onlinecoursedetail: api + '/onlinecourse/course/detail', //获取课程详细信息
        onlinetimereport: api + '/onlinecourse/course/resource/learntime/report', //上报学时
        onlinelearnstatus: api + '/onlinecourse/learn/status', //学员的网络课程完成情况
        onlinesubjectrange: api + '/onlinecourse/optional/course/subject/range', //获取选课范围的学段学科
        onlinecoursepage: api + '/onlinecourse/search/optional/course/page', //搜索选修课
        onlinecourseselect: api + '/onlinecourse/student/optional/course/select', //学员选课
        onlinecourselist: api + '/onlinecourse/user/optional/course/list', //查询学员的“选修课
        //活动接口
        getmyActivity: api + '/clazz/myActivityCount', //v3.6.4 获取班级各类活动数量
        getquestionpaper: api + '/questionpaper/type/list.json', //v3.6.4 根据试卷类型查询试卷集合
        getpaperdetail: api + '/questionpaper/detail.json', //v3.6.4 查看试卷详情(用户已完成试卷会将答案一起返回)
        addquestionanswer: api + '/questionanswer/save.json', //答题

        liveCourseActList: api + '/livecourse/course/activityList', // 直播课程活动列表
        liveCourseRedPoint: api + '/livecourse/isShowRedPoint', // 直播间活动是否显示小红点，全部完成不显示小红点，否则显示
        liveCourseAnswer: api + '/livecourse/answerQuestion', // 直播课程学员答题

        //声网接口
        liveRoomAuth: api + '/liveroom/auth', //获取token

        liveRoomCode: api + '/liveroom/chat/record/page',
        //直播课签到借口
        livesign: api + '/livecourse/user/sign',
        //获取当前班级下是否有签到
        livegetsign: api + '/livecourse/isShowInprogressSign',
        liveRoomMember: api + '/clazzuser/member/list', //获取班级成员列表
        onlineMember: api + '/liveroom/online/user/list', //获取班级在线成员列表
        liveforsign: api + '/livecourse/unFinishedInprogressSign', //查村直播间是否存在正在进行中签到

        // liveRoomRecordPage:api + '/liveroom/chat/record/page',//获取聊天记录
        liveRoomRecordPage: api + '/liveroom/chat/record/latest', //获取聊天记录
        gettolivelist: api + '/livecourse/liveRoomRecord/list', //获取回访列表
        liveLoginOsType: api + '/liveroom/user/login/ostype', //只能一端进行登录

        // 获取直播间被踢出的用户
        liveRoomKickout: api + '/liveroom/kickout/user/list',
        liveRoomSuccConnect: api + '/liveroom/student/success/connect', // 学员连麦成功

        recordingLearn: api + '/livecourse/recording/learn', // V4.2.3直播录制回放视频，统计学员学习时长
        recordingCount: api + '/livecourse/recording/view', // V4.2.3直播录制回放视频，统计回放视频查看次数
    }
}

export default WEB_CONFIG;