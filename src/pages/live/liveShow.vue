<template>
    <div class="liveBox">
        <header>
            <div class="fl">
                <img class="iconImg" src="@/assets/images/liveIcon/liveIcon.png" alt="">
                <span class="iconText">云课堂</span>
            </div>

            <div class="fr rightCon">
                <span class="scaleBtn" @click.stop="exitRoom">退出</span>
            </div>
        </header>
        <div class="streamBox">
            <el-row :gutter="10" type="flex" justify="center">
                <el-col :span="19">
                    <b class="roomPeople">({{viewPeople<0?0:viewPeople}}人观看)</b>
                    <div class="grid-content bg-purple" ref="pictureBoxOne">
                        <div :class="{'fullscreen':isFullscreen,'whiteBg':true}" ref="pictureBoxTwo">
                            <div class="liveWrapper showbarrageBox" id="barrageBox" v-loading="!haveClass&&loadingFlag">
                                <!--声网播流-->
                                <div class="noclass" v-if="!haveClass&&!loadingFlag">
                                    <p>主播不在线～</p>
                                </div>
                                <div class="noclass" v-else-if="haveClass">
                                    <p v-if="cdnFlashFlag == false" class="cdn">
                                        由于您未安装flash播放器视频无法播放，点击
                                        <a href="http://www.adobe.com/go/getflashplayer" target="_blank" class="cdn-blue">
                                            这里
                                        </a>
                                        安装
                                    </p>
                                </div>
                                <section v-show="hostStream.length > 0">
                                   
                                    <transition name="el-fade-in-linear">
                                        <div class="playBtn" @click.stop="playHandler(hostStream[0])" v-if="haveClass&&hostStream[0]&&hostStream[0].autoplayFailed"></div>
                                    </transition>
                                    <div class="hostViewBox" v-if="hostStream.length > 0" v-for="(item,index) in hostStream" :key="index" :id="item.playAreaId+item.getId()"></div>
                                </section>
                                <!--cdn播流-->
                                <section v-show="cdnFlagShow">
                                    <div class="hostViewBox cdnViewBox" id="cdnViewBox">
                                        <!-- <video
                                            id="my-player1"
                                            class="video-js
                                            vjs-default-skin
                                            vjs-big-play-centered"
                                            preload="auto"
                                            style="width:100%;height:100%"
                                            data-setup='{ "html5" : { "nativeTextTracks" : false } }'>
                                                <source type="rtmp/flv">
                                          </video> -->
                                    </div>
                                </section>
                                <div class="streamOpera">
                                    <div class="tablecell">
                                        <label class="volLabel">
                                            <em class="volumnIcon outputIcon" @click="tomute"></em><el-slider v-model="outputVolumn" @change="setVolume"></el-slider>
                                        </label>
                                        <button :class={barrageBtn:true,openBarrage:barrageFlag} @click.stop="barrageHandle">
                                            <!-- {{barrageText}} -->
                                            <em>弹</em>
                                        </button>
                                    </div>
                                    <div class="cameraCon tablecell">  
                                        <div class="connectInfo" v-if="attchmentText=='挂断'">
                                          <span>连线中</span>
                                          <span>{{connectInfo.time}}</span>
                                          <span>{{connectInfo.bitrate}}</span>
                                        </div>                                  
                                        <button :class="{conBtn:true,attchented:attchented,applying:attchmentText=='申请中'}" @click="attachmentHandle">{{attchmentText=="申请中"?attchmentText+'...':attchmentText}}</button>                               
                                        <em class="detection" @click="tabledetection">                                        
                                            <el-tooltip class="item" effect="dark" content="设备检测" placement="top">                                            
                                                <el-button></el-button>                                        
                                            </el-tooltip>                                         
                                            <img src="../../assets/images/liveIcon/xitong.png" alt="">                                                                                              
                                        </em>                                    
                                        <em :class="{scaleIcon:true,'narrow':isFullscreen}" @click.stop="viewPortScale"></em>                                    
                                        <b class="setting" v-if="false"></b>                                
                                    </div>   
                                    
                                </div>
                                
                            </div>
                            <!-- 签到动画 -->

                            <div class="signanimate" v-if="showsignani" @click="showsignanimate">
                                <div class="aniimg">
                                    <img src="../../assets/images/liveIcon/signani.png" alt="">
                                </div>
                                <div class="anid">

                                </div>
                            </div>
                        </div>
                        <!-- 连麦 -->
                        <ul class="connectionList" ref="connectionListDom">
                            <li
                                v-for="(item,index) in connectStream"
                                :key="index"
                                :id="item.playAreaId+item.getId()"
                            >
                                <div class="videoMask" v-if="item.closeVedio"></div>
                                <transition name="el-fade-in-linear">
                                    <div
                                        class="playBtn"
                                        @click.stop="playHandler(item)"
                                        v-if="haveClass&&item&&item.autoplayFailed"
                                    ></div>
                                </transition>
                                <div class="popLayer"  v-if="tourclassTeacher == false">
                                    <span class="nameText" :title="item.accountName">{{item.accountName}}</span>
                                    <div class="popOpera">
                                        <em :class="{closeAudio:item.closeAudio}"></em>
                                    </div>
                                </div>
                                <div class="popLayer"  v-else-if="tourclassTeacher == true">
                                    <p class="tour-status">巡课中...</p>
                                </div>
                            </li>
                        </ul>
                        <!-- 巡课 -->
                        <!-- <ul class="connectionList tourclass">
                        <li
                            v-for="(item,index) in tourStream"
                            :key="index"
                            :id="item.playAreaId+item.getId()"
                        >
                            <div class="videoMask" v-if="item.closeVedio"></div>
                            <div class="popLayer">
                            <p class="tour-status">巡课中...</p>
                            </div>
                        </li>
                        </ul> -->
                    </div>
                </el-col>

                <!-- 聊天box -->
                <el-col :span="5" class="singalBox" style="padding-left:0;padding-right:0">
                    <!-- 学员信息界面组建 -->
                    <div class="student_info">
                        <studentInfo :passstudent="passstudent" :evevwheat="evenwheat" @studentshow="studentshow" :liveController="liveController" @showfl="showfl"></studentInfo>
                        <section>
                            <div class="noticeTop"  v-show="chatNoticeFlag">
                                <div class="title title-top">
                                    <span class="horn"></span>
                                    <span class="yellow">公告：</span> 
                                    <span class="text">{{chatNotice.msg}}</span>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div class="grid-content">

                        <!--讨论组-->
                        <ul class="tab clearfix">
                            <li :class="{'cur':nowIndex === index, 'activity':index == 1}" v-for="(item,index) in tabData" :key="index"  @click="tabSwitch(index)">   <i class="dotred" v-if="index == 1 && showred"></i>
                                {{item}}
                            </li>
                        </ul>
                        <div class="clearfix"></div>

                         <!--讨论组内容-->
                        <section class="discuss" v-show="nowIndex===0" >
                            <div class="con" ref="chatId" id="chatId">
                                <!--公告站位-->
                                <!-- <section>
                                    <div class="noticeTop" v-show="chatNoticeFlag">
                                        <div class="title title-top">
                                            <span class="horn"></span>
                                            <span class="yellow">公告：</span> 
                                            <span class="text">555555{{chatNotice.msg}}</span>
                                        </div>
                                    </div>
                                </section> -->
                                <!--系统消息-->
                                <div class="sys">
                                    系统消息：欢迎来到直播间。请各位学员认真听讲，积极发言，配合老师完成教学。同时禁止发送任何违法、违规、低俗等不良信息。
                                </div>

                                <section  v-for="(item,index) in chatArray" :key="index">

                                   
                                    <div class="sectionjoin">
                                        <!--进入直播间-->
                                        <!-- <div class="comin" v-if="item.joinRoom">
                                            {{item.joinRoom.account | namefilter}}进入直播间
                                        </div> -->

                                        <!--进入直播间-->
                                        <!-- <div class="comin" v-if="item.leaveRoom">
                                            {{item.leaveRoom.account | namefilter}}离开直播间
                                        </div> -->
                                        <!--xx收到了花-->
                                        <div class="comin" v-if="item.content">
                                            {{item.content}}
                                        </div>
                                        <!--申请连线-->
                                        <div class="apply-connect" v-if="item.connect">
                                            {{item.connect.msg}}
                                        </div>
                                         <!--您已被下线-->
                                        <div class="apply-connect" v-if="item.close">
                                            {{item.close.msg}}
                                        </div>
                                         <!--全体禁言已开启-->
                                        <div class="comin" v-if="item.canSpeakStart">
                                            <ul>
                                                <li>
                                                    <div>{{item.canSpeakStart.msg}}</div>
                                                </li>
                                            </ul>
                                        </div>
                                         <!--全体禁言已结束-->
                                         <div class="comin" v-if="item.canSpeakEnd">
                                            <ul>
                                                <li>
                                                    <div>{{item.canSpeakEnd.msg}}</div>
                                                </li>
                                            </ul>
                                        </div>
                                        <!--单个禁言已关闭-->
                                        <div class="comin" v-if="item.turnOnSingleMic">
                                            <ul>
                                                <li>
                                                    <div>{{item.turnOnSingleMic.msg}}</div>
                                                </li>
                                            </ul>
                                        </div>
                                        <!--单个禁言已开启-->
                                         <div class="comin" v-if="item.turnOffSingleMic">
                                            <ul>
                                                <li>
                                                    <div>{{item.turnOffSingleMic.msg}}</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <!--聊天-频道聊天-->
                                    <div class="chat" v-if="item.chat">
                                        <ul>
                                            <li>
                                                <span class="icon-identity" v-if="item.chat.role == 'Assistant' || item.chat.role == 'Broadcaster'">{{item.chat.role | rolefilter}}</span>
                                                <span class="icon-Audience" v-else-if="item.chat.role == 'Audience'">{{item.chat.role | rolefilter}}</span>
                                                <span class="name">{{item.chat.account | namefilter}}</span>
                                                <div>{{item.chat.msg}}</div>
                                            </li>
                                        </ul>
                                    </div>

                                    <!--聊天-点对点-->
                                    <div class="chat" v-if="item.PtoMsg">
                                        <ul>
                                            <li>
                                                <span class="icon-identity">{{item.PtoMsg.role | rolefilter}}</span>
                                                <span class="name">{{item.PtoMsg.account | namefilter}}</span>
                                                <div>{{item.PtoMsg.msg}}</div>
                                            </li>
                                        </ul>
                                    </div>

                                    
                                    

                                    <!--公告-->
                                    <!-- <div class="title title-none">
                                        <span class="horn"></span>
                                        <span class="yellow">公告：</span> 
                                        <span class="text">直播还有5分钟开始</span>
                                    </div> -->

                                </section>

                            </div>

                            <!--发送信息-->
                            <section class="sendMsg">
                                <el-form :model="form" :rules="rules" ref="form">
                                    <div class="textareaBg" v-show="nowIndex2 === 0">
                                         <el-form-item prop="textarea">
                                            <el-input
                                              type="textarea"
                                              :rows="3"
                                              :disabled="chatTextAreaFlag"
                                              @keyup.native.13="sendChannelMsg('form')"
                                              :placeholder="placeholderArear"
                                              v-model.trim="form.textarea">
                                            </el-input>
                                        </el-form-item>

                                        <div>
                                           <!--  <a href="#" class="icon-cancel" @click="addChannelAttr" >添加频道属性</a> -->
                                            <el-button class="icon-send" :disabled="sendFlag" :class="{'icon-send-gray':sendFlag}" @click="sendChannelMsg('form')">发送</el-button>
                                            <!--  <a href="javascript:void(0)" class="icon-send" @click="leaveChanel">离开</a> -->
                                        </div>
                                    </div>
                                </el-form>

                            </section>
                            
                        </section>

                        <section v-show="nowIndex===1">
                            <activity v-if="!kickOut" :courseId = "courseId" :controller = "liveController" ref = "act" @actShow = "actShow" @actDotRed="actDotRed"></activity>
                        </section>

                        <!--******************************学员*****************************-->

                        <section class="staff"  v-show="nowIndex===2">

                            <!-- <el-input class="search-name" v-model="search" placeholder="搜索"></el-input> -->
                            <ul class="list">
                                <li v-for="(item,index) in liveRoomMemberList" :key="index" v-show="(item.loginStatus||item.role=='STUDENT')||item.identification==liveAuthInfo.host" v-if="!kickOutList.includes(item.identification)">
                                    <span :class="{'icon-host':true,'grayMask':!haveClass}" v-if="item.identification==liveAuthInfo.host"></span>
                                    <span v-else-if="item.role!='STUDENT'" :class="{'icon-assistant':true,'grayMask':!item.loginStatus}"></span>
                                    <span class="icon-student" v-else>
                                        <span v-if="item.miniAvatar">
                                        <img :src="item.miniAvatar" :class="{'grayMask':!item.loginStatus}">
                                    </span>
                                    <span v-else>
                                        <img src="../../assets/images/liveIcon/noavatar.png" :class="{'grayMask':!item.loginStatus}">
                                    </span>
                                    </span>
                                    <span class="icon-name">{{item.name}}</span>
                                </li>
                            </ul>
                        </section>

                    </div>

                </el-col>

                
            </el-row>
        </div>

        <!-- 被踢出后的弹层 -->
        <div class="kickedOut" v-if="kickOut">
            <p>你已经被主播踢出啦~</p>
        </div>

        <!-- 签到组建 -->
        <signin :liveController="liveController" :signpassdata="signpassdata" v-if="showsignin" @conshowsign="conshowsign"></signin>
        
        <!-- 答题器 -->
        <answer
            v-if="!kickOut"
            :answerShow.sync="answerShow"
            :options = "quesOptions"
            :questionId = "questionId"
            :controller = "liveController"
            :quesClose = "quesClose"></answer>

        <!-- 答题器结果 -->
        <answer-all
            v-if="!kickOut"
            :answerAllShow.sync="answerAllShow"
            :quesAnswer = "quesAnswer"
            ref="closeanswer"
            ></answer-all>

        <!-- 送花动画组建     -->
        <sendflowers v-if="showflowers" @showfl="showfl"></sendflowers> 
        <!-- 设备检测 -->
        <transition name="slide-fade">
            <detection
                v-if="showdetection"
                @tabledetection="tabledetection"
                :liveController="liveController"
                :liveAuthInfo="liveAuthInfo"
            ></detection>
        </transition>   
    </div>
    
</template>

<script>
    import SxbRTC from "@/sw/controllers/conclient";
    import seeting from './seeting';
    import seetingCamera from './settingCamera';
    import signin from './signin'
    import barrageWall from '@/sw/utils/barrage.js'
    import {sendChat,sliceArray,splitUid,curDate,tourClass} from '@/sw/utils/sig';
    import storage from '@/utils/storage'
    import userObj from '@/utils/loginServer'
    import model from '@/model/live/live';
    import swConfig from "@/sw/config"
    import activity from "./activity"


    import answer from "./answer"
    import answerAll from "./answerall"
    import Timer from '@/sw/utils/timer';

    import studentInfo from './student_info.vue'
    import sendflowers from './sendflowers'

    import detection from "./detection";


    export default{
        data(){
            return{
                liveController:null,            //控制器
                outputVolumn:100,                 //播放音量
                barrageFlag:true,              //弹幕flag
                barrageText:"弹幕关",              //弹幕文本
                hostStream:[],                   //主播流
                connectStream:[],               //连线远端流
                usedCameraVal:"",               //正在使用的相机id
                usedCameraLabel:"",               //正在使用的相机设备名称
                attchented:false,                 //连线标识
                attchmentText:'连线',             //连线文本
                kickOut:false,                  //提出标识
                hostUid: 0,                 //主播id
                haveClass:false,                //上课标识
                liveAuthInfo: null,             //直播间课程信息
                timeOut:null,                   //申请连麦超时
                showsignin:false,  //控制显示签到
                signpassdata:{}, //传递给签到组建的信息
                liveRoomMemberList:[],          //成员列表
                onlineMemberList:[],            //在线学员列表
                canApply: true,                 //主播是否开启连线
                disVideoList:[],                //禁摄像头列表
                disAudioList:[],                //禁麦克风列表
                loadingFlag:true,               //加载loading
                showflowers:false,//送花动画
                passstudent:false,
                isFullscreen:false,             //全屏标识
                showsignani:false,//显示隐藏签到动画
                signtime:null,//签到动画定时器
                connectInfo:{time:"00:00",bitrate:'32kb/s'},  //连线数据
                viewPeople:0,   //观看人数
                /***********************************************信令相关*****************************************/
                placeholderArear:"积极发言～",
                form: {
                  textarea: ''
                },
                rules: {
                  textarea: [
                    {required: true, message: '请输入内容', trigger: 'focus'},
                    {max: 100, message: '最多100字', trigger: 'change'}
                  ],
                  
                },
                textareaNotice:"",
                switchs:true,
                search:"",

                nowIndex:0,
                nowIndex2:0,
                tabData:["讨论","活动","成员"],

                num:0,
                chatArray:[],
                chatNotice:{},
                chatNoticeFlag:false,
                adressName:"所有人",

                chatTextAreaFlag:false,
                userList:[
                    // {
                    //     id:"all",
                    //     name:"所有"
                    // },
                    // {
                    //     id:"张瑞雪_41767",
                    //     name:"张瑞雪"
                    // },
                    // {
                    //     id:"41768",
                    //     name:"贾君彦"
                    // }
                ],

                time:3000,
                sendFlag:false,
                sendFlagAll:false,
                applyUserList:[],
                connectedUserList:[],
                noSpeakUserList:[],
                kickOutList:[],
                stuCurAccount:"",
                authInfos:{},
                updateObj:{},

                // 活动相关
                showred: false,
                // 答题器
                answerShow: false,      //答题器选项弹出框
                answerAllShow: false,   // 答题器所有结果弹出框
                quesOptions: [],    //答题选项
                questionId: "",     //答题id
                quesClose: false,      // 关闭答题卡弹出框    
                quesAnswer: null,   // 答题器结果数据 
                
                //obj:{},
                objMsgDup:{},     
                noticeClear:"" ,    
                evenwheat:0,//连麦次数
                nowsignid:'',//当前签到的Id用来对比一下是否签过到
                showdetection: false, //显示隐藏设备检查
                videoInputFlag: false, // 是否有摄像头
                documentVisible: document.visibilityState, //监听tab变化
                documentFlag: true, // 是否停留在当前tab
                tourclassFlag: false, // 当前用户是否开启巡课
                tourclassTeacher: false, // 是否有巡课进行中
                tourStream: [], // 巡课流

                cdnUrl:{
                    flvPlayUrl:"",
                    hlsPlayUrl:"",
                    rtmpPlayUrl:""
                },
                cdnStatus:"cdn",
                cdnFlagShow:true,
                cdnPlayer:null,
                cdnFlashFlag:true,
                cdnTourStats:false, //申请连线如为巡课延迟3秒--解决关闭巡课后管理端先接通后得到远端流，导致接通有问题
                cdnDisplay:Boolean,
                options1: {
                  autoplay: true, // 是否自动播放
                  muted: false, // 是否静音
                  controls: false,
                  fluid: true, // 宽高自适应
                  // sources: [{
                  //   src: '',
                  //   type: 'rtmp/flv'
                  // }]
                  // flash:{
                  //   swf:"../../../static/swf/video-js.swf"
                  // }
                }

            }
        },
        filters: {
            namefilter:function(val) {
                return val.split("_")[0];
            },
            rolefilter:function(val){
                // return val == "Broadcaster" ? "主播":"助教";
                if(val == "Broadcaster"){
                    return val = "主播";
                }else if(val == "Attendee"){
                    return val = "学员";
                }else if(val == "Audience"){
                    return val = "游客";
                }else{
                    return val = "助教"
                }
            }
        },
        computed:{
            courseId(){
                return this.$route.query.courseId;
            },
            username(){
                return userObj.curname() ? userObj.curname() : this.studentname;
            },
            userId(){
                return userObj.curUserId() ? userObj.curUserId() : "";
            },
        },

        created(){
            this.liveController = new SxbRTC("",{onInviteReceived:this.onInviteReceived,hostUid:this.hostUid});
            barrageWall.init({container:"#barrageBox",barrageLen:6});
            //websoket推流失败
            this.webSocketFail();

            

        },
        mounted(){
            //判断当前是否安装flash
            this.checkFlashAll();
            // this.getsigninin()//获取当前借口下是否有签到   
            /************************************信令相关******************************************/
            //获取授权token
            this.channelTokenAuth();
            //频道属性发生变化
            this.channelUpdated();
            //发送消息
            this.receiveMsg();
            //接收点对点消息
            this.receivePtoP();
            //某人加入直播间
            this.userJoinChannel();
            //某人离开直播间
            this.userleaveChannel();
            
            this.curAccount();
             // 获取本地媒体设备
            this.getVideoInput();
            //刷新事件
            window.onbeforeunload=()=>{
                let taLiveStates = {
                    attchented: this.attchented,
                }
                if(this.attchented&&this.attchmentText=="申请中"){
                    taLiveStates.attchented = false;
                }
                sessionStorage.setItem("taLiveStates",JSON.stringify(taLiveStates));
                if(this.attchented)
                    this.liveController.invitateEndBySelf(); 
            }
            //关闭页面事件
            window.onunload=()=>{
                if(this.attchented)
                    this.liveController.invitateEndBySelf();
                    this.liveController.leaveChanel();
            }
            //刷新前触发的函数
            window.onload=()=>{
                // this.windowOnLoad();
            }
            this.getforgign();//查询当前页面是否有签到

            if((navigator.userAgent.indexOf("compatible") > -1 && navigator.userAgent.indexOf("MSIE") > -1)||(navigator.userAgent.indexOf("Edge") > -1)||(navigator.userAgent.indexOf('Trident') > -1 && navigator.userAgent.indexOf("rv:11.0") > -1)){
                // document.write('<b>暂不支持ie浏览器，请使用其他浏览器打开</b>');
                alert('暂不支持当前浏览器，请使用其他浏览器打开')
            }
            setTimeout(()=>{this.loadingFlag=false;},3000)
            navigator.connection.addEventListener('change', this.getNetworkState);

            this.chatHeight();
             //con当前的高度
             $(window).resize(()=>{
                this.chatHeight();
             })
            this.watchKey();

        },
        destroyed(){
            this.liveController.unpublish();
            this.liveController.leavelChannel();
            clearInterval(this.signtime);
        },

        beforeDestroy(){
            const videoDom = this.$refs.viodeRef;  //不能用document 获取节点
            this.$video("my-player1").dispose();  //销毁video实例，避免出现节点不存在 但是flash一直在执行，报 this.el.......is not function
        },

        methods:{
            webSocketFail(){
                this.liveController.webSocketFail((code)=>{
                    console.log("websocket链接失败,尝试重新连接",code);
                    this.loginSig();
                })
            },
            checkFlashAll(){
                if (window.ActiveXObject) {
                    var s = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    if(!s){
                        this.cdnFlashFlag = false
                    }
                } else {
                    var s = navigator.plugins['Shockwave Flash'];
                    if(!s){
                        this.cdnFlashFlag = false
                    }
                }
            },
            cdnMyPalyDispose(){
                let player = this.$video("my-player1");
                player.dispose();

            },
            cdnCreateVideo(){
                var str = '<video id="my-player1" ref="viodeRef" class="video-js vjs-default-skin vjs-big-play-centered" preload="auto" style="width:100%;height:100%" data-setup="{}"><source type="rtmp/flv"></video>';
                $("#cdnViewBox").html(str);
            },
                videoPlay(){
                  let _this = this;
                   _this.$video.options.flash.swf = '/static/swf/video-jst.swf'
                    var player = this.$video('my-player1');
                    console.log("playessss");
                    console.log(player);
                    player.ready(function(){
                        //alert(_this.cdnUrl.rtmpPlayUrl);
                        console.log(_this.cdnUrl.rtmpPlayUrl);
                        player.src(_this.cdnUrl.rtmpPlayUrl);
                        player.load();
                        player.play();
                    })  
                },
                //设备检测每次进入直播间都要把信息发给主播
                postdetection(){
                    let detection=storage.get("detection");       
                    if(detection==undefined){
                        this.tabledetection()
                    }else{
                        let endinfo= storage.get("detection");
                        let role =this.$store.getters.liveauth;;             
                        //  //上报摄像头
                        let data = {
                                "command":"CAMERA_STATUS",
                                "roomCode":role.authInfo.roomCode,
                                "fromRole":role.authInfo.role,
                                "ext":endinfo.camera==true?"OK":"NO"
                        }
                        this.liveController.sendPtoPMsg("sxb_1",JSON.stringify(data));
                        // //上报麦克风
                        let data2 = {
                                "command":"MIC_STATUS",
                                "roomCode":role.authInfo.roomCode,
                                "fromRole":role.authInfo.role,
                                "ext":endinfo.audio==true?"OK":"NO"
                        }
                        this.liveController.sendPtoPMsg("sxb_1",JSON.stringify(data2));                        
                    }
                },
             //显示隐藏设备检查
            tabledetection() {
            this.showdetection = !this.showdetection;
            },    
            chatHeight(){
                let _this = this;
                setTimeout(function(){
                    let height = $(document).height();
                    let len = height-($(".student_info").outerHeight(true)+$(".tab").outerHeight(true)+$(".el-form").outerHeight(true)+105);
                    $("#chatId").css({
                        'height':len + "px",
                        'overflow-y':"auto"
                    })
                },200)
            },
            showfl(val){
                // console.log("接受来自收花的数据",val)
                this.showflowers=val;
                this.passstudent=true;
            },
            studentshow(val){
                this.passstudent=val;
            },
            chatList(){
                let data = {
                    roomCode:this.liveAuthInfo.roomCode
                }
                model.liveRoomRecordPage(data,(res=>{
                    console.log("redd");
                    console.log(res);
                    if(res.status == 200){
                        let data = res.data.content;
                        data.forEach((item,index)=>{
                            let obj = {
                                "chat":{
                                    role:item.fromRole,
                                    msg:item.content,
                                    account:item.fromName + "_" + item.from
                                }
                            }
                            this.chatArray.push(obj);
                        })
                        //滚动条设置底部
                        setTimeout(()=>{
                            if(this.$refs.chatId){
                                var chatId = this.$refs.chatId;
                                chatId.scrollTop = chatId.scrollHeight;
                            }
                        },50)
                    }else{
                        this.$message.error(res.message);
                    }
                }))
            },
            //签到组建控制
            conshowsign(val){
                if(val=='close'){
                   this.showsignin=false;
                   this.showsignani=true;
                }else{
                    this.showsignin=false;
                    this.showsignani=false;
                    this.hidesignanimate('')
                }
                
            },
            // 60秒隐藏签到窗
            hidesignanimate(val){
                if(val=='this'){
                    this.signtime=setTimeout(()=>{
                        this.showsignin=false;
                        this.showsignani=true;
                    },60000)
                }else{
                    clearInterval(this.signtime)
                }                
            },
            //点击签到动画显示签到
            showsignanimate(){
                 this.showsignin=true;
                this.showsignani=false;
               
            },
            //直播间是否有签到
             getforgign(){
                model.liveforsign({},(res=>{                    
                    if(res.status==200){                                      
                        if(res.data!=undefined){
                            console.log("直播间有咩有签到啊",res.data);
                            let ext={};
                            ext.taskId=res.data.id;
                            let newArr=res.data;
                            this.$set(newArr,"ext",ext)
                            this.signpassdata=newArr;
                            this.showsignin=true;
                            this.hidesignanimate('this')
                        }else{
                            this.showsignin=false
                        }                      
                    }
                }))
            },        



            // 活动相关
            actShow(val) {
                if(val) {
                    this.nowIndex = 1;
                }
            },
            actDotRed(val) {
                if(val) {
                    this.showred = true;
                } else {
                    this.showred = false;
                }
            }, 
             // 判断是否有摄像头
            getVideoInput() {
            this.liveController.getDevicesW().then(res => {
                let n = 0;
                console.log("%c 媒体设备", "color:red", res);
                res.forEach((val, index) => {
                if (val.kind == "videoinput") {
                    n++;
                }
                });
                if (n > 0) {
                    this.videoInputFlag = true;
                } else {
                    this.videoInputFlag = false;
                }
                console.log("%c 摄像头数量", "color:green", n);
            });
            },            
            channelTokenAuth(){
                let data = {
                    courseId:this.courseId
                }

                model.liveRoomAuth(data, ( res => {
                    console.log("ress");
                    console.log(res);
                    var _this = this;
                    this.liveAuthInfo = res.data;
                    //将主播信息存到vuex中
                    this.$store.state.liveAuth=res.data;
                    this.authInfos = res.data.authInfo;
                    swConfig.channelName = this.liveAuthInfo.roomCode;
                    swConfig.appId = this.liveAuthInfo.authInfo.appId;
                    this.hostUid = this.liveAuthInfo.host;
                    this.liveroomPlayUrl();
                    this.liveController.setHostId(res.data.host);
                    this.onlineMember();
                    this.liveRoomMember();
                    this.chatList();
                    this.viewPeople=res.data.viewPeopleCount;
                    // swConfig.
                    //this.joinRoom();
                    //登录信令
                    this.loginSig();
                    //当前登录状态为0,信令重新登录,此问题是否能解决直播bug
                    // this.liveController.checkLoginStatus(function(code){
                    //     setInterval(()=>{
                    //         if(code !== 1 && code !== 2){
                    //             console.log("登录状态为0，请重新登录信令");
                    //             _this.loginSig();
                    //         }
                    //     },30*1000)
                    // });
                    //this.getCameraArr();
                }))
            },
            loginSig(){
                let _this = this;
                this.liveController.login(
                    {
                        channelName:this.authInfos.roomCode,
                        appId:this.authInfos.appId,
                        role:this.authInfos.role,
                        account:this.liveAuthInfo.broadcaster.name+'_'+this.liveAuthInfo.broadcaster.id,
                        callback:function(){
                            let role = _this.authInfos.role;
                            let data = {
                                    "command":"CURRENT_DEVICE",
                                    "roomCode":_this.authInfos.roomCode,
                                    "to":"pc",
                                    "fromRole":role
                            }
                            _this.liveController.sendPtoPMsg("sxb_1",JSON.stringify(data));
                            _this.postdetection();
                        }
                    }
                );
            },
            liveroomPlayUrl(){
                let data = {
                    roomCode:this.authInfos.roomCode
                }
                model.liveroomPlayUrl(data,(res=>{
                    console.log("推流地址");
                    console.log(res);
                    let resData = res.data;
                    this.cdnUrl.rtmpPlayUrl = resData.rtmpPlayUrl;
                    if(resData.liveStatus == "LIVING"){
                        this.haveClass = true;
                        if(this.cdnFlashFlag){
                            this.cdnFlagShow = true;
                            this.cdnDispose();
                            this.cdnCreateVideo();
                            //播放器
                            this.videoPlay();
                        }else{
                            this.cdnFlagShow = false;
                        }
                        
                    }else if(resData.liveStatus == "WAITING"){
                        this.haveClass = false;
                        this.loadingFlag = false;
                        this.cdnFlagShow = false;
                    }else if(resData.liveStatus == "END"){
                        this.haveClass = false;
                        this.loadingFlag = false;
                        this.cdnFlagShow = false;
                    }
                    console.log("resdata");
                    console.log(resData);
                    
                    

                })) 
            },
            //监听键盘事件
            watchKey(){
                window.onresize=(e)=>{
                    if (Boolean(this.scaleDom)&&(Math.abs(this.scaleDom.scrollHeight - window.screen.height)>20)){
                        if (Math.abs(this.scaleDom.scrollHeight - window.screen.height)>20) {
                            this.isFullscreen=false;
                        }
                    }
                }
            },
            //在线成员列表
            onlineMember(array){
                let data = {
                    roomCode :this.liveAuthInfo.roomCode
                }
                model.onlineMember(data, ( res => {
                    if(res.status==200){
                        this.onlineMemberList = res.data;
                        let hostArr=[];
                        let taArr=[];
                        let onlinestudentArr=[];
                        let offlinelinestudentArr=[];
                        console.warn(this.liveRoomMemberList)
                        this.liveRoomMemberList.map((item,index)=>{
                            item.loginStatus = false;
                            if(item.role == "Broadcaster" || item.role == "Assistant"){
                                this.onlineMemberList.forEach((item2,index)=>{
                                    if(item2.userId==item.identification){
                                        item.loginStatus = true;
                                        return
                                    }
                                })
                                if(item.role=="Broadcaster"){
                                    hostArr.push(item);
                                }else{
                                    taArr.push(item);
                                }
                            }else{
                                this.onlineMemberList.forEach((item2,index2)=>{
                                    if(item2.userId==item.identification){
                                        onlinestudentArr.push(item);
                                        item.loginStatus = true;
                                        return
                                    }
                                })
                                if(!item.loginStatus)
                                    offlinelinestudentArr.push(item);
                            }
                        });
                        this.liveRoomMemberList = hostArr.concat(taArr,onlinestudentArr,offlinelinestudentArr);
                    }
                }))
            },

            //成员列表
            liveRoomMember(){
                let data = {
                    clazzId:this.$route.query.clazzId
                }
                model.liveRoomMember(data, ( res => {
                    
                    if(res.status==200){
                        let hostArr=[];
                        let taArr=[];
                        let onlinestudentArr=[];
                        let offlinelinestudentArr=[];
                        res.data.map((item,index)=>{
                            item.loginStatus = false;
                            if(item.role == "CLAZZMANAGER" || item.role == "PROJECTADMIN" || item.role == "PROFESSOR"||item.role=="ORGADMIN"){
                                if(this.onlineMemberList.includes(item.identification))
                                    item.loginStatus = true;
                                if(item.identification == this.liveAuthInfo.host){
                                    item.role = "Broadcaster";
                                    hostArr.push(item);
                                }else{
                                    item.role = "Assistant";
                                    taArr.push(item);
                                }
                            }else{
                                if(this.onlineMemberList.includes(item.identification)){
                                    onlinestudentArr.push(item);
                                    item.loginStatus = true;
                                }else{
                                    offlinelinestudentArr.push(item);
                                }
                            }
                        })
                        
                        this.liveRoomMemberList = hostArr.concat(taArr,onlinestudentArr,offlinelinestudentArr);
                        console.warn(this.liveRoomMemberList)
                    }
                    
                }))
            },
            curAccount(){
                var userName = userObj.curname();
                var uid = storage.get("userId")?storage.get("userId"):null;
                this.stuCurAccount = userName + "_" + uid;
            },
            //加入房间
            joinRoom(callback){
                let _this = this;

                _this.liveController.joinRoom({ liveFlag: false }).then(() => {
                    callback();
                    _this.liveController.subscribedStream(res => {
                        if (!_this.tourclassTeacher||res.getId() == _this.hostUid) {
                            console.log(
                                "%c远端流拉取",
                                "background:#000;color:#fff;font-size:20px;"
                            );
                            console.log(res);
                            res.autoplayFailed = false;
                            if (res.getId() == _this.hostUid) {
                                _this.hostStream = [];
                                _this.hostStream.push(res);
                                _this.haveClass = true;
                            } else {
                                res.closeVedio = this.disVideoList.includes(String(res.getId()))
                                ? true
                                : false;
                                res.closeAudio = this.disAudioList.includes(String(res.getId()))
                                ? true
                                : false;
                                if (document.querySelector("#liveItem" + res.getId()) == null) {
                                _this.connectStream.push(res);
                                }
                                this.liveRoomMemberList.forEach(item => {
                                if (item.identification == res.getId()) {
                                    res.accountName = item.name;
                                }
                                });
                            }
                        }else{
                            console.log('巡课中');
                            // _this.tourclassTeacher=true
                        }
                    })
                    //主播结束推流后的回调
                    this.liveController.leaveNoPub(()=>{
                        if(_this.attchented){
                            this.liveController.invitateEndBySelf();
                            this.attchmentText="连线";
                            this.attchented=false;
                        }
                        this.hostStream.length=0;
                        _this.haveClass=false
                    })
                });
            },
            //本地推流数据
            getLocalStreamStates(){
                let seconds=0,minutes=0,hours=0;
                this.connectInfo.interval=setInterval(()=>{
                    this.liveController.getLocalStreamStates((res)=>{

                        if(!res.LocalVideo||!res.LocalAudio){
                            clearInterval(this.connectInfo.interval);
                            return
                        }
                        // this.systemsStates.aventerEnd2EndDelay = res.LocalVideo[this.liveAuthInfo.authInfo.uid].EncodeDelay;
                        this.connectInfo.bitrate = Number(res.LocalVideo[this.liveAuthInfo.authInfo.uid].SendBitrate)+Number(res.LocalAudio[this.liveAuthInfo.authInfo.uid].SendBitrate)+'Kb/s';
                    });
                    seconds++;
                    if(seconds>59){
                      ++minutes;
                      seconds=0;
                    };
                    if(minutes>59){
                      ++hours;
                      minutes=0;
                    }
                    this.connectInfo.time=hours>0?(hours<10?"0"+hours:hours)+":"+(minutes<10?"0"+minutes:minutes)+':'+(seconds<10?"0"+seconds:seconds):(minutes<10?"0"+minutes:minutes)+':'+(seconds<10?"0"+seconds:seconds);
                },1000)
            },
            /**
             * 退出房间
             */
            exitRoom(){
                this.$confirm("您是否要退出直播间？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //点击确定后执行函数体
                    if(this.attchented)
                        this.liveController.invitateEndBySelf();
                        this.liveController.leaveChanel();

                    window.close();

                }).catch(()=>{});
            },


            //弹幕开关
            barrageHandle(){
               this.barrageFlag = !this.barrageFlag; 
               this.barrageText=this.barrageFlag?"弹幕开":"弹幕关";
            },

            viewPortScale(){
                let elDom = this.$refs.connectionListDom.children.length>0?this.$refs.pictureBoxOne:this.$refs.pictureBoxTwo;
                this.scaleDom = elDom;
                console.log(elDom);
                this.isFullscreenForNoScroll(elDom)?this.exitFullScreen(this.scaleDom):this.fullScreen(elDom);
            },

            //全屏
            fullScreen(el) {
                let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
                    wscript;
            
                if(typeof rfs != "undefined" && rfs) {
                    rfs.call(el);
                    return;
                }
            
                if(typeof window.ActiveXObject != "undefined") {
                    wscript = new ActiveXObject("WScript.Shell");
                    if(wscript) {
                        wscript.SendKeys("{F11}");
                    }
                }
            },
 
            //退出全屏
            exitFullScreen(el) {
                var el= document,
                    cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
                    wscript;
            
                if (typeof cfs != "undefined" && cfs) {
                    cfs.call(el);
                    return;
                }
            
                if (typeof window.ActiveXObject != "undefined") {
                    wscript = new ActiveXObject("WScript.Shell");
                    if (wscript != null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            },

            //判断是否全屏
            isFullscreenForNoScroll(el){
                var explorer = window.navigator.userAgent.toLowerCase();
                if(explorer.indexOf('chrome')>0){//webkit
                    // console.log(this.$refs.pictureBox.scrollHeight);
                    console.log(window.screen.height);
                    if (el.scrollHeight === window.screen.height) {
                        console.log('全屏')
                        this.isFullscreen=false
                        return true
                    } else {
                        console.log('未全屏')
                        this.isFullscreen=true
                        return false
                    }
                }else{//IE 9+  fireFox
                    if (el.outerHeight === window.screen.height) {
                        this.isFullscreen=false
                        return true
                    } else {
                        this.isFullscreen=true
                        return false
                    }
                }
            },
            // 学员连线成功后台接口
            succConnect() {
                let data = {
                    roomCode: this.liveAuthInfo.roomCode,
                    courseId: this.courseId
                }
                model.liveRoomSuccConnect(data, (res => {
                    if(res.status !== 200) {
                        this.$message.error(res.message);
                    }
                }));

            },
            //申请连线
            attachmentHandle(refresh){
                if(this.tourclassFlag){
                    this.cdnTourStats = true;
                    this.closeTourClass();
                }else{
                    this.cdnTourStats = false;
                }
                if(this.attchented){
                    if(this.attchmentText=="申请中"){
                        this.$confirm("是否取消连线申请？", '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.liveController.invitateEndBySelf();
                            this.$message.success('您已取消连线申请');
                            this.attchmentText="连线";
                            this.attchented=false;
                            console.log(this.attchented);
                            clearTimeout(this.timeOut);
                        });
                    }else{
                        this.$confirm("是否挂断连线？", '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.liveController.invitateEndBySelf();
                            //声网切回cdn
                            this.connectStream = [];
                            this.cdnStatus = "cdn";
                            this.cdnChange();
                            this.liveController.attachment(false,(res)=>{
                                this.attchmentText="连线";
                                this.attchented=false;
                                console.log(this.attchented);
                                clearInterval(this.connectInfo.interval);this.connectInfo.time='00:00'
                            })
                            //挂断
                        });
                    }
                    
                }else{
                    if(typeof(refresh)!='boolean'&&!this.haveClass){
                        this.$message.error('主播未上课，不能连线');
                        return
                    }
                    if(!this.canApply){
                        this.$message.error('直播间暂未开启连线');
                        return
                    }
                    this.tryIng(refresh,status);
                    
                }
                
            },
            tryIng(refresh,status){
                let _this = this;
                let account = this.liveAuthInfo.broadcaster.name+'_'+this.liveAuthInfo.broadcaster.id;
                let params = {
                        account:account,                //账号
                        onInviteReceivedByPeer:(extra)=>{   //对方收到连麦邀请
                            this.attchented = true;
                            this.attchmentText="申请中";
                            console.warn(this.stuCurAccount);
                            this.timeOut = setTimeout(()=>{
                                this.$message.error("连线无应答");
                                this.liveController.invitateEndBySelf();
                            },1000*60*1)
                        },
                        onInviteAcceptedByPeer:(extra)=>{   //对方接受连麦邀请
                            //声网切换
                            _this.joinRoom(()=>{
                                this.liveController.attachment(true,(res)=>{
                                if(res){
                                    //cdn切换声网
                                    this.cdnStatus = "sw";
                                    this.cdnDispose();

                                    res.accountName=this.liveAuthInfo.authInfo.name;
                                    res.closeVedio=this.disVideoList.includes(String(res.getId()))?true:false;
                                    res.closeAudio = this.disAudioList.includes(String(res.getId()))?true:false;
                                    if(document.querySelector('#liveItem'+res.getId())==null){
                                        _this.connectStream.push(res);
                                    }
                                    setTimeout(function(){
                                        let timing = setInterval(()=>{
                                            if(_this.liveController.getPermissions()=="requesting"){
                                            }else if(_this.liveController.getPermissions()=="denied"){
                                                clearInterval(timing);
                                                _this.$message.error('获取摄像头与麦克风权限失败');
                                                _this.liveController.invitateRefusedBySelf(JSON.stringify({permissions:"denied"}));
                                                _this.liveController.attachment(false,(res)=>{
                                                    _this.attchented = false;
                                                    _this.attchmentText="连线";
                                                    $('#liveItem'+res.getId()).remove()
                                                })
                                                clearTimeout(this.timeOut);
                                            }else if(_this.liveController.getPermissions()=="allowed"){
                                                clearInterval(timing);
                                                // 连线成功
                                                _this.succConnect();
                                                let data = {
                                                  command:"connect"
                                                }
                                                _this.chatAll(data,_this,null,null,null,"no");
                                                _this.getLocalStreamStates();
                                                _this.liveController.palyStream(res).then(()=>{
                                                    _this.disAorV(res);
                                                    // 连麦成功向组件传递+1
                                                    _this.evenwheat++;
                                                    // console.log("我连麦成功了1",_this.evenwheat)
                                                    let videoTag = document.querySelector('#video'+res.getId());
                                                    if(videoTag&&!videoTag.paused)
                                                        videoTag.play();
                                                });
                                            }
                                                            
                                        },500);
                                    },1000)
                                }
                                this.attchmentText="挂断";
                                clearTimeout(this.timeOut);

                                })
                            });
                            
                        },
                        onInviteRefusedByPeer:(extra)=>{   //对方拒绝连麦邀请
                            this.attchented = false;
                            this.attchmentText="连线";
                            this.$message('error','对方拒绝了你的邀请');
                            clearInterval(this.connectInfo.interval);
                            this.connectInfo.time='00:00';
                            clearTimeout(this.timeOut);
                        },
                        onInviteEndByMyself:(extra)=>{   //本地挂断连麦回调
                            if(this.attchmentText=="挂断"){
                                this.liveController.attachment(false,(res)=>{
                                    clearInterval(this.connectInfo.interval);
                                    this.connectInfo.time='00:00';
                                })
                            }
                            _this.attchented = false;
                            _this.attchmentText="连线";
                            clearTimeout(this.timeOut);

                        },
                        onInviteEndByPeer:(extra)=>{   //对方挂断连麦回调
                            //连续挂断后不在执行
                            this.liveController.attachment(false,(res)=>{
                                console.log("对方挂断了1");
                                //声网切回cdn
                                this.cdnStatus = "cdn";
                                this.cdnChange();
                                let data = {
                                        command:"close"
                                }
                                _this.chatAll(data,this,null,null,null,'no')
                                //恢复初始状态
                                _this.attchented = false;
                                _this.attchmentText="连线";
                                clearInterval(this.connectInfo.interval);
                                this.connectInfo.time='00:00';

                                
                            })
                            
                        },
                        
                    }
                    if(refresh&&typeof(refresh)=="boolean"){
                        params.extra={refresh_reconnect:true};
                    }
                    _this.liveController.getVedioInput((device)=>{
                        if(device.length>0){
                            if(this.cdnTourStats){
                                setTimeout(()=>{
                                    this.liveController.invitatePerson(params);
                                },2000)
                            }else{
                                this.liveController.invitatePerson(params);
                            }
                        }else{
                            this.$message.error('无可用设备');
                        }
                    })
            },
            //onInviteReceived  邀请回调 主播推给学员
            onInviteReceived(call){
                let _this = this;
                if(this.attchented){
                    return new Promise((reslove,reject)=>{
                        call.channelInviteAccept('');
                        let params = {
                            onInviteEndByPeer:(extra)=>{   //对方挂断连麦回调
                                this.liveController.attachment(false,(res)=>{
                                    _this.attchented = false;
                                    _this.attchmentText="连线";

                                    //声网切回cdn
                                    this.cdnStatus = "cdn";
                                    this.cdnChange();
                                })
                                // this.$message.success("讲师挂断连线");
                            },
                            punStr:()=>{}
                        }
                        reslove(params);
                    })
                }
                return new Promise((reslove,reject)=>{
                    let params = {
                        onInviteReceivedByPeer:(extra)=>{   //对方收到连麦邀请
                        },
                        onInviteAcceptedByPeer:(extra)=>{   //对方接受连麦邀请
                        },
                        onInviteRefusedByPeer:(extra)=>{   //对方拒绝连麦邀请

                        },
                        onInviteEndByMyself:(extra)=>{   //本地挂断连麦回调
                            // this.$message.success("学员下线成功")

                        },
                        onInviteEndByPeer:(extra)=>{   //对方挂断连麦回调
                            if(_this.attchented){
                                this.liveController.attachment(false,(res)=>{
                                    console.log("对方挂断2");
                                    //console.log("你一步啊啊");
                                    //您已被下线
                                    let data = {
                                        command:"close"
                                    }
                                    clearInterval(_this.connectInfo.interval);
                                    this.connectInfo.time="00:00";
                                    _this.chatAll(data,this,null,null,null,'no')
                                    _this.attchented = false;
                                    _this.attchmentText="连线";
                                    //声网切回cdn
                                    this.cdnStatus = "cdn";
                                    this.cdnChange();
                                })
                            }
                            // this.$message.success("讲师挂断连线");
                        },
                        
                    }
                    _this.joinRoom(()=>{
                         //cdn切换声网
                        this.cdnStatus = "sw";
                        this.cdnDispose();
                        setTimeout(()=>{
                            _this.liveController.attachment(true,(res)=>{
                                
                                params.punStr = ()=>{
                                    console.log(res)
                                    if(res){
                                        res.accountName=this.liveAuthInfo.authInfo.name;
                                        res.closeVedio=this.disVideoList.includes(String(res.getId()))?true:false;
                                        res.closeAudio = this.disAudioList.includes(String(res.getId()))?true:false;
                                        if(document.querySelector('#liveItem'+res.getId())==null){
                                        _this.connectStream.push(res);
                                        }
                                        _this.liveController.getVedioInput((device)=>{
                                            if(device.length>0){
                                                let timing = setInterval(()=>{
                                                    if(_this.liveController.getPermissions()=="requesting"){
                                                    }else if(_this.liveController.getPermissions()=="denied"||_this.liveController.getPermissions()=="NotReadable"){
                                                        clearInterval(timing);
                                                        let promatInfo = _this.liveController.getPermissions()=="denied"?"获取摄像头与麦克风权限失败":"有其他设备占用摄像头"
                                                        this.$message.error(promatInfo);
                                                        call.channelInviteRefuse(JSON.stringify({permissions:"denied"}));
                                                        $('#liveItem'+res.getId()).remove()
                                                    }else if(_this.liveController.getPermissions()=="allowed"){
                                                        // 连线成功
                                                        _this.succConnect();
                                                        let data = {
                                                        command:"connect"
                                                        }
                                                        _this.chatAll(data,_this,null,null,null,"no");
                                                        _this.attchented = true;
                                                        _this.attchmentText="挂断";
                                                        call.channelInviteAccept("");
                                                        clearInterval(timing);
                                                        _this.getLocalStreamStates();
                                                        _this.liveController.palyStream(res).then(()=>{
                                                            _this.disAorV(res);
                                                            // 连麦成功向组件传递+1
                                                            _this.evenwheat++;
                                                            // console.log("我连麦成功了2",_this.evenwheat)
                                                            // console.warn(document.querySelector('#video'+res.getId()))
                                                            let videoTag = document.querySelector('#video'+res.getId());
                                                            if(videoTag&&!videoTag.paused)
                                                                videoTag.play();
                                                        });
                                                    }
                                                                    
                                                },500);
                                            }else{
                                                this.$message.error('无可用设备');  
                                                _this.attchented = false;
                                                _this.attchmentText="连线";
                                                $('#liveItem'+res.getId()).remove()
                                                call.channelInviteRefuse(JSON.stringify({permissions:"denied"}));
                                            }
                                        })

                                        
                                    }
                                }
                                reslove(params);
                            })
                        },500)
                        
                    })
                    })
                    
                
                
            },

            //cdn销毁 --- cdn切回声网
            cdnDispose(){
                if($("#my-player1").length > 0){
                    this.$video("my-player1").dispose();
                    this.cdnFlagShow = false;
                }
                
            },
            //声网切回cdn
            cdnChange(){
                this.hostStream = [];
                this.connectStream = [];
                // this.cdnCreateVideo();
                // this.videoPlay();
                this.cdnFlagShow=true;
                console.log("挂断后===================================");
                console.log(this.cdnFlagShow);
                this.liveroomPlayUrl();
               
            },

            //设置音量
            setVolume(){
                let volumeStream = Array.concat(this.connectStream,this.hostStream);

                this.liveController.changeHostVolume(volumeStream,this.outputVolumn);
            },

            //点击静音
            tomute(){
              this.outputVolumn=0;
              this.setVolume();
            },




            windowOnLoad(){
                setTimeout(()=>{
                    let taLiveStates = sessionStorage.getItem('taLiveStates');
                        if(taLiveStates){
                            taLiveStates = JSON.parse(taLiveStates);
                            if(taLiveStates.attchented){
                                this.attachmentHandle(true);
                            }
                            
                        }
                },1000)
            },

            //手动播放
            playHandler(res){
                console.log(res)
                document.querySelector('#video'+res.getId()).play();
                res.autoplayFailed=false;
            },    




            //*************************************信令相关****************************************************//

            userListAll(){
                console.log("hauhau");
                console.log(this.userList);
            },

            handleCommand(command){
                this.adressName = command;
            },

            addChannelAttr(){
                //直播间黑名单，这些人不能再进入直播间（被踢的人) 添加
                //this.liveController.addChannelAttr("non_access_user_list","11,22,33,44");

                //被禁言的用户id 被禁言 - 添加  取消 - 移除
                //this.liveController.addChannelAttr("non_speak_user_list","11,22,33,44")

                //申请连线的用户id 申请连线 - 添加  主播同意 - 移除
                //this.liveController.addChannelAttr("apply_user_list","11,22,33,44")

                //目前正在连线的用户id  连线成功 - 添加  学员主动结束、主播让下线 -- 移除
                //this.liveController.addChannelAttr("connected_user_list","11,22,33,44")

                //频道内 0 - 禁言  1-可说话
                //this.liveController.addChannelAttr("can_speak","11,22,33,44")

                //学员能否申请连线 0 - 不可以   1-可以  主播上线为 1 下线为0
                //this.liveController.addChannelAttr("can_apply","11,22,33,44")

                this.liveController.addChannelAttr("test","1111");

            },

            channelUpdated(){
                let _this = this;
                _this.liveController.channelAttrUpdated((name,value,v)=>{
                   console.log(
                    "%c频道属性发生变化" + name + ":" + this.tourclassTeacher + ":" + v,
                    "background:blue;color:#fff;font-size:20px;"
                    );

                    if(v == "update"){
                        _this.updateObj[name] = value;
                        //申请用户
                        if(name == "apply_user_list"){
                            //this.applyUserList = value.split("_");

                            //正在连线
                        }
                        if(name=="connect_resolution"){
                            this.liveController.setConnectQuality(value);
                            //this.connectedUserList = value.split("_");
                           
                        }
                        if(name == "non_access_user_list"){
                            //alert(value);
                            let valueFomat = value.substring(value.indexOf("_")+1,value.length-1);
                            this.kickOutList = valueFomat.split("_");
                             //alert(this.authInfos.uid);
                            if(this.kickOutList.length > 0){
                                this.kickOutList.forEach((item,index)=>{

                                    if(item == this.authInfos.uid){
                                        console.log("您已经被踢出了哦");
                                        this.kickOut = true;
                                        _this.liveController.leavelChannel();
                                    }
                                })
                            }
                        }
                        if(name=="can_apply"){
                            let flag = Boolean(Number(value.match(/\d+/g)[0]));
                            this.canApply = flag;
                        }
                        if(name=="connect_disvideo_list"){
                            this.disVideoList=value.split('_');
                            this.connectStream.map((item,index)=>{
                                if(this.disVideoList.includes(String(item.getId()))){
                                    item.closeVedio = true;
                                }else{
                                    item.closeVedio = false;
                                }
                            })
                        }
                        if(name=="connect_disaudio_list"){
                            this.disAudioList=value.split('_');
                            this.connectStream.map((item,index)=>{
                                if(this.disAudioList.includes(String(item.getId()))){
                                    item.closeAudio = true;
                                }else{
                                    item.closeAudio = false;
                                }
                            })
                        }
                        // 巡课是否进行中 viewPeople
                        if (name == "tourclass") {
                            this.tourclassTeacher = !!Number(value.split("_")[1]);
                            console.log(
                            "%c 巡课的频道属性",
                            "color:red; font-size:20px",
                            value.split("_")[1],
                            this.tourclassTeacher
                            );
                        }
                        if(name=="_member_num"){
                           this.viewPeople=value;
                        }
                        this.canSpeakStatus(name, value);

                        //滚动条设置底部
                        setTimeout(()=>{
                            if(_this.$refs.chatId){
                                var chatId = _this.$refs.chatId;
                                chatId.scrollTop = chatId.scrollHeight;
                            }
                        },50)
                    }
                   
                    
                })
            },
            disAorV(res){
                if(this.disAudioList.includes(this.liveAuthInfo.authInfo.uid)){
                    this.liveController.closeAudioHandle(true);
                    res.closeAudio = true;
                }
                if(this.disVideoList.includes(this.liveAuthInfo.authInfo.uid)){
                    this.liveController.closeVedioHandle(true);
                    res.closeVedio=true;
                }
            },
            canSpeakStatus(name,value){
                //逻辑有待修改
                //全体禁言未启用过
                    if(name == "non_speak_user_list"){
                        if(this.updateObj["can_speak"] && this.updateObj["can_speak"] == "_0_"){
                            this.chatTextAreaFlag = true;
                            this.sendFlag = true;
                            this.placeholderArear = "直播间禁言中";
                            return;
                        }
                        let valueFomat = value.substring(value.indexOf("_")+1,value.length-1);
                        let flag = false;
                        this.noSpeakUserList = valueFomat.split("_");
                        //alert("到底解除了吗" + JSON.stringify(this.noSpeakUserList));
                        if(this.noSpeakUserList.length > 0){
                            this.noSpeakUserList.forEach((item,index)=>{
                                console.log(item + ":" + this.authInfos.uid);

                               if(item.indexOf(this.authInfos.uid)>-1){
                                    flag = true;
                                }
                                
                            })
                            if(flag){
                                this.chatTextAreaFlag = true;
                                this.sendFlag = true;
                                this.placeholderArear = "直播间禁言中";
                                return;
                            }
                            this.chatTextAreaFlag = false;
                            this.sendFlag = false;
                            this.placeholderArear = "积极发言～";       
                        }
                    
                    }
                    if(name == "can_speak"){
                        if(value == "_0_"){
                            this.chatTextAreaFlag = true;
                            this.sendFlag = true;
                            //this.sendFlagAll = true; //直播间禁言中标识
                            this.placeholderArear = "直播间禁言中";
                            return;
                        }
                        if(value == "_1_"){
                            //=="" 值为false
                            let flag = false;
                            if(this.updateObj["non_speak_user_list"] == "" || !!this.updateObj["non_speak_user_list"]){
                                var value = this.updateObj["non_speak_user_list"];
                                var valueFomat = value.substring(value.indexOf("_")+1,value.length-1);
                                this.noSpeakUserList = valueFomat.split("_");
                                console.log("nononoe");
                                console.log(this.noSpeakUserList);
                            }
                            if(this.noSpeakUserList.length > 0){
                                this.noSpeakUserList.forEach((item,index)=>{
                                    if(item.indexOf(this.authInfos.uid)>-1){
                                        console.log("禁言中中中......");
                                        flag = true;
                                    }
                                })
                                if(flag){
                                    this.chatTextAreaFlag = true;
                                    this.sendFlag = true;
                                    this.placeholderArear = "直播间禁言中";
                                    return;
                                }
                                this.chatTextAreaFlag = false;
                                this.sendFlag = false;
                                this.placeholderArear = "积极发言～";       
                            }else{
                                this.chatTextAreaFlag = false;
                                this.sendFlag = false;
                                this.placeholderArear = "积极发言～";
                            }
                        }
                    }
                
            },
            substr(str){
                var subStr = str.substring(str.indexOf("_")+1,str.lastIndexOf("_"));
                return substr;
            },

            tabSwitch(index){
                this.nowIndex = index;

                if(index == 1) {
                    this.$refs.act.getList();
                }else if(index == 2){
                    this.onlineMember(this.liveRoomMemberList);
                }else if(index == 0){
                    this.chatHeight();
                }
            },

            //发送频道消息
            sendChannelMsg(form){              
                var _this = this;
                _this.$refs[form].validate((valid) =>{
                    if(valid){
                        var time = curDate("yyyy-MM-dd HH:mm");
                        var getImg = "";
                        this.liveRoomMemberList.forEach((item,index)=>{
                            if(item.identification == this.authInfos.uid){
                                getImg = item["miniAvatar"]?item["miniAvatar"]:"";
                                console.log(getImg);
                            }                            
                        })
                        Timer.sendTime({
                             time:3,
                             callback:function(status){
                                 if(status == 200){
                                    // console.log(sendChat("chat",_this.form.textarea,time,getImg));
                                    _this.liveController.sendChannelMsg(sendChat("chat",_this.form.textarea,time,getImg,_this.username));
                                    _this.form.textarea = "";
                                 }else{
                                    _this.$message({
                                          message: '歇一会儿再发~',
                                          type: 'warning'
                                    });
                                 }
                             }
                        });
                    }
                })
                
            },

            //接收对点消息
            receivePtoP(){
                let _this = this;
                this.liveController.receivePtoPMsg(function(account,uid,msg){
                    console.log("接收对点消息============", msg);
                    let data = JSON.parse(msg);
                    if(data.command == "CLOSE_VEDIO"){
                         _this.liveController.closeVedioHandle(true);
                    }
                    if(data.command == "OPEN_VEDIO"){
                        _this.liveController.closeVedioHandle(false);
                    }
                    if(data.command == "CLOSE_AUDIO"){
                         _this.liveController.closeAudioHandle(true);
                    }
                    if(data.command == "OPEN_AUDIO"){
                        _this.liveController.closeAudioHandle(false);
                    }
                    if(data.command == "TURN_OFF_SINGLE_MIC"){
                        _this.chatAll(data,_this,account,uid,msg,"no");
                    }
                    if(data.command == "TURN_ON_SINGLE_MIC"){
                        _this.chatAll(data,_this,account,uid,msg,"no");
                    }
                    if(data.command == "KICK_OUT"){
                         console.log("你已经被主播踢出");
                        _this.kickOut = true;
                        //声网踢出频道
                        //_this.liveController.leavelChannel();
                         //信令踢出频道
                        _this.liveController.leaveChanel();
                    }
                    if(data.command == "CHAT"){
                        _this.chatAll(data,_this,account,uid,msg);
                    }
                     //滚动条设置底部
                    setTimeout(()=>{
                        if(_this.$refs.chatId){
                            var chatId = _this.$refs.chatId;
                            chatId.scrollTop = chatId.scrollHeight;
                        }
                    },50)
                })
            },

             //接收频道消息
             receiveMsg(){
                var _this = this;
                _this.chatArray = [];
                this.liveController.receiveChannelMsg(function(account,uid,msg){
                    let data = JSON.parse(msg);
                    console.log("我是签到提醒啊========",data)                                     
                    //签到开启                    
                    if(data.command=='PUBLISH_TASK' && data.ext.type=='SIGN' && _this.nowsignid!=data.ext.taskId){
                        _this.nowsignid=data.ext.taskId
                        _this.showsignin=true;
                        _this.signpassdata=data; 
                        _this.hidesignanimate('this');                       
                    }
                    //签到提醒                 
                    if(data.command=='PUBLISH_TASK' && data.ext.type=='SIGN' &&  data.ext.tixing=='tixing' && storage.get("successsign")!=data.ext.taskId){
                        console.log("您已经签到成功了啊========",storage.get("successsign"))
                        _this.showsignanimate();                       
                    }
                    //主播端关闭签到时，隐藏签到框
                    if(data.command=='OVER_TASK' && data.ext.type=='SIGN' ){
                        _this.nowsignid='';
                        _this.showsignin=false;
                        _this.showsignani=false;
                        _this.signpassdata=''; 
                        _this.hidesignanimate('');
                        storage.remove("successsign")                       
                    }
                    //送花的消息
                    if(data.command=="CHAT" && data.chatMessage.msgType=="REWARD"){
                        _this.chatArray.push(data.chatMessage);
                        // console.log( _this.chatArray)
                    }
                    //全体禁言
                    if(data.command == "TURN_OFF_ALL_MIC"){
                        _this.chatAll(data,_this,account,uid,msg,"no");        
                    }
                    //取消禁言
                    if(data.command == "TURN_ON_ALL_MIC"){
                        _this.chatAll(data,_this,account,uid,msg,"no");
                    }
                    if(data.command == "CHAT"){
                        _this.chatAll(data,_this,account,uid,msg);
                    }

                     
                    // 答题器接收选项结构
                    if(data.command == "PUBLISH_TASK") {
                        if(data.ext.type == "ANSWER") {
                            //开启答题器
                            _this.answerAllShow = false;
                            _this.answerShow = true;
                            _this.quesOptions = data.ext.options;
                            _this.questionId = data.ext.questionId;
                                                      
                        }
                    } 

                    // 答题结果接收
                    if(data.command == "OVER_TASK") {
                        if(data.ext.type == "ANSWER" ) {
                            // 结束答题器
                            _this.quesAnswer = data.ext;
                            _this.answerShow = false;
                            _this.answerAllShow = true;

                        }
                    }

                    // 关闭答题器
                    if(data.command == "PUBLISH_CLOSE") {
                        if(data.ext.type == "ANSWER") {
                            _this.answerShow = false;
                            _this.answerAllShow = false;
                            _this.quesClose = true;
                            storage.remove("liveanswer");
                            // 关闭答题器时清除结果
                            _this.$refs.closeanswer.clearanswer()
                            // console.log("关闭答题器====", data.ext);

                        }
                    }

                    // 开启巡课
                    if (data.command == "TOURCLASS_OPEN") {
                        let userIds = data.ext.userIds;
                        let userid = storage.get("userId");
                        if(userIds.includes(userid)){
                            console.log("管理端发巡课者====", data.ext.user);
                            _this.$message({
                                showClose: true,
                                message: '管理者邀请您参与互动，请打开摄像头。拒绝可能会影响您的个人成绩哦~',
                                type: 'warning',
                                duration:20*1000
                            });
                            _this.tourClassStatus(account, data.ext.user);
                        }else{
                            if (_this.tourclassFlag) {
                                _this.liveController.unpublish();
                                _this.liveController.leavelChannel();
                                // _this.$message.error('老师已结束巡课活动');
                                _this.tourclassFlag = false;
                                _this.connectStream = [];
                                // this.liveController.attachment(false, (res=>{}));
                            }
                        }
                        console.log("当前用户id", uid);
                    }
                    // 关闭巡课
                    if (data.command == "TOURCLASS_OVER") {
                        console.warn(_this.tourclassFlag);
                        if (_this.tourclassFlag) {
                            _this.liveController.unpublish();
                            _this.liveController.leavelChannel();
                            //cdn切换
                            _this.cdnStatus = "cdn";
                            _this.cdnChange();

                            // _this.$message.error('老师已结束巡课活动');
                            _this.tourclassFlag = false;
                        }
                        _this.tourclassTeacher=false;
                        _this.connectStream = [];
                    }

                    //开始上课-重新推至cdn
                    if (data.command == "BEGIN_CLASS"){
                        if(_this.cdnStatus == "sw"){
                            _this.liveController.unpublish();
                            _this.liveController.leavelChannel();
                        }
                        setTimeout(()=>{
                            _this.liveroomPlayUrl();
                            _this.haveClass = true;
                            _this.cdnFlagShow = true;
                        },500)
                        
                    }

                    //下课-结束cdn
                    if(data.command == "FINISH_CLASS"){
                        if(_this.cdnStatus == "sw"){
                            _this.liveController.unpublish();
                            _this.liveController.leavelChannel();
                        }
                        _this.haveClass = false;
                        _this.connectStream = [];
                        _this.hostStream = [];
                        _this.cdnDispose();
                        _this.cdnFlagShow = false;  
                    }

                    //滚动条设置底部
                    setTimeout(()=>{
                        if(_this.$refs.chatId){
                            var chatId = _this.$refs.chatId;
                            chatId.scrollTop = chatId.scrollHeight;
                        }
                    },50)
                })              
             },

             chatAll(data,_this,account,uid,msg,no){
                //聊天相关 系统消息、公告、频道、私聊
                if(!no){
                     var msgs = data.chatMessage.content;
                }
                let roleimg={Broadcaster:"../../../static/img/barrageOne.png",Assistant:'../../../static/img/barrageTwo.png',Audience:'../../../static/img/barrageThree.png'};
                let type = _this.commonDataChat(data);
                let obj = {};
                //聊天内容
                if(type === "channelChat"){
                    let sobj = {
                        account:account,
                        role:data.fromRole,
                        msg:msgs
                    }
                    _this.$set(obj,'chat',sobj);
                    if(_this.barrageFlag)
                        barrageWall.upWall(roleimg[data.fromRole], account.split('_')[0], msgs,data.fromRole);
                }
                //私聊信息
                if(type === "PtoMsg"){
                    let sobj = {
                        account:account,
                        role:data.fromRole,
                        msg:msgs
                    }
                    _this.$set(obj,"PtoMsg",sobj);
                    if(_this.barrageFlag)
                        barrageWall.upWall(roleimg[data.fromRole], account.split('_')[0], msgs,data.fromRole);

                
                }
                //公告内容
                if(type == "NOTICE"){
                    var noticeTop = $(".title-top");
                    noticeTop.css({
                        'bottom':0,
                        'transition':".7s"
                    })
                    noticeTop.addClass("bounceInUp");
                    clearTimeout(_this.noticeClear)
                    let sobj = {
                        account:account,
                        msg:msgs
                    }
                    _this.$set(obj,"notice",sobj);
                    _this.chatNotice = sobj;
                    _this.chatNoticeFlag = true;
                    setTimeout(function(){
                        var noticeTop = $(".title-top");
                        var height = $(".title-top").height();
                        noticeTop.removeClass("bounceInUp");
                        noticeTop.css({
                            'bottom':"-"+height+5+"px",
                            'transition':".7s"
                        })
                        setTimeout(()=>{
                            _this.chatNoticeFlag = false;
                        },700)
                        
                    },10*1000)
                    if(_this.barrageFlag)
                        barrageWall.upWall("../../../static/img/horn.png", "公告", msgs,"horn");
                
                }
                //开启全体禁言
                if(type == "turnOffAllMic"){
                   let sobj = {
                        msg:"学员禁言模式已开启"
                    }
                    _this.$set(obj,"canSpeakStart",sobj);
                
                }
                //全体禁言已关闭
                if(type == "turnOnAllMic"){
                    let sobj = {
                        msg:"学员禁言模式已结束"
                    }
                    _this.$set(obj,"canSpeakEnd",sobj);
                }
                if(type == "turnOffSingleMic"){
                     let sobj = {
                        msg:"您已被禁言"
                    }
                    _this.$set(obj,"turnOffSingleMic",sobj);
                }
                if(type == "turnOnSingleMic"){
                    let sobj = {
                        msg:"您已被解除禁言"
                    }
                    _this.$set(obj,"turnOnSingleMic",sobj);
                }
                if(type == "connect"){
                    var sobj = {
                         msg:"您已被成功连线啦"
                    }
                    this.$set(obj,"connect",sobj);
                }
                if(type == "close"){
                    var sobj = {
                        msg:"您已被关闭连线"
                    }
                    _this.$set(obj,"close",sobj);
                }
                _this.chatArray.push(obj);
                setTimeout(()=>{
                    if(_this.$refs.chatId){
                        var chatId = _this.$refs.chatId;
                        chatId.scrollTop = chatId.scrollHeight;
                    }
                },50)
             },
            // 学员点击连线 先关闭巡课
            closeTourClass() {
                this.liveController.sendChannelMsg(
                    tourClass("TOURCLASS_OVER", null, null, null, null, null)
                );
                // this.tourclassFlag = false;
            },
            documentTab() {
                // 页面是否在当前页且不是最小化
                let status = document.visibilityState;
                if (status == "visible") {
                    console.log("当前激活tab，且不是最小化");
                    this.documentFlag = true;
                } else if (status == "hidden") {
                    console.log("学员不在当前直播页面或是窗口最小化");
                    this.documentFlag = false;
                } else if (status == "prerender") {
                    console.log("页面从新生成，对用户不可见");
                    this.documentFlag = false;
                }
            },
            // 学员开启巡课的各种状态
            tourClassStatus(account, user) {
                this.tourclassFlag = true;
                let _this = this;
                this.documentTab();
                let stuname = userObj.curname();
                let stuId = storage.get("userId") ? storage.get("userId") : null;
                console.log("%c 摄像头状态", "color:green", this.videoInputFlag, account);
                if (this.videoInputFlag) {
                    this.cdnStatus = "sw";
                    this.cdnDispose();
                    // 执行弹出框提示 有摄像头
                    // 开启巡课 连线操作
                    _this.joinRoom(()=>{
                         //cdn切换声网
                        _this.liveController.tourclass(true, res => {
                        console.log("%c 学员端获取的流", "color:red", res);
                        if (res) {
                            // res.accountName=this.liveAuthInfo.authInfo.name;
                            // res.closeVedio=this.disVideoList.includes(String(res.getId()))?true:false;
                            if (document.querySelector("#liveItem" + res.getId()) == null) {
                                _this.connectStream.push(res);
                            }
                            setTimeout(() => {
                                let timing = setInterval(() => {
                                    console.log("%c 学员端获取的流", "color:red", "=====================================");
                                    if (_this.liveController.getPermissions() == "requesting") {

                                    } else if (_this.liveController.getPermissions() == "denied") {
                                        //cdn离开频道
                                        _this.liveController.leavelChannel();
                                        clearInterval(timing);
                                        // 发送点对点
                                        _this.liveController.sendPtoPMsg(
                                            account,
                                            tourClass(
                                            "LOOK_STU_STATUS",
                                            this.documentFlag,
                                            this.videoInputFlag,
                                            false,
                                            stuname,
                                            stuId
                                            )
                                        );
                                        console.log("用户禁用了摄像头");
                                        this.$message.error("获取摄像头权限失败");
                                        // call.channelInviteEnd(JSON.stringify({permissions:"denied"}));
                                    } else if (_this.liveController.getPermissions() == "allowed") {
                                        // 发送点对点
                                        _this.liveController.sendPtoPMsg(
                                            account,
                                            tourClass(
                                            "LOOK_STU_STATUS",
                                            this.documentFlag,
                                            this.videoInputFlag,
                                            true,
                                            stuname,
                                            stuId
                                            )
                                        );
                                        console.log("用户开启了摄像头");
                                        clearInterval(timing);
                                        _this.liveController.palyStream(res).then(() => {
                                            // console.warn(document.querySelector('#video'+res.getId()))
                                            let videoTag = document.querySelector(
                                            "#video" + res.getId()
                                            );
                                            if (videoTag && !videoTag.paused) videoTag.play();
                                        });
                                    }
                                }, 500);
                            }, 700);
                        }
                        });
                    })
                    
                } else {
                    console.log("学员没有摄像头");
                    // 发送点对点
                    _this.liveController.sendPtoPMsg(
                    account,
                    tourClass(
                        "LOOK_STU_STATUS",
                        this.documentFlag,
                        this.videoInputFlag,
                        null,
                        stuname,
                        stuId
                    )
                    );
                }
            },

             //聊天信息
             //公告 -- 单聊  -- 私聊
             commonDataChat(data){
                if(data.command == "CHAT"){

                    //私聊
                    if(data.chatMessage.chatType == "USER"){
                        return "PtoMsg";
                    }

                    //公告
                    if(data.chatMessage.chatMessageType == "NOTICE"){

                        return "NOTICE";
                    }

                    //频道消息
                    if(data.chatMessage.chatMessageType == "CHAT"){
                        
                        return "channelChat";
                    }

                }
                if(data.command == "TURN_OFF_ALL_MIC"){
                    return "turnOffAllMic";
                }
                if(data.command == "TURN_ON_ALL_MIC"){
                    return "turnOnAllMic";
                }
                if(data.command == "TURN_OFF_SINGLE_MIC"){
                    return "turnOffSingleMic";
                }
                if(data.command == "TURN_ON_SINGLE_MIC"){
                    return "turnOnSingleMic";
                }
                if(data.command == "connect"){
                    return "connect";
                }
                if(data.command == "close"){
                    return "close";
                }

             },

             //某人加入直播间
             userJoinChannel(){
                var _this = this;
                _this.chatArray = [];
                 _this.liveController.userJoinChannel((account,uid)=>{
                    console.log("直播小助手");
                    console.log(account);
                    //非本班级成员
                    if(!(_this.liveRoomMemberList.some((item)=>{return (account.indexOf(item.identification)>-1)})))
                        return
                    if(account.indexOf("直播课小助手") == -1){
                        let objw={};
                        let obj={
                            account:account
                        };
                        this.$set(objw,"joinRoom",obj);
                        _this.chatArray.push(obj);
                        setTimeout(()=>{
                            if(_this.$refs.chatId){
                                var chatId = _this.$refs.chatId;
                                chatId.scrollTop = chatId.scrollHeight;
                            }
                            
                        },50)
                    }
                    
                 })
             },

             //离开直播间
             userleaveChannel(){
                let _this = this;
                _this.chatArray = [];
                _this.liveController.userleaveChannel((account,uid)=>{
                    if(!(_this.liveRoomMemberList.some((item)=>{return (account.indexOf(item.identification)>-1)})))
                        return
                    if(account.indexOf("直播课小助手") == -1){
                        let objw={};
                        let obj={
                            account:account
                        };
                        this.$set(objw,"leaveRoom",obj);
                        _this.chatArray.push(obj);
                        setTimeout(()=>{
                            if(_this.$refs.chatId){
                                var chatId = _this.$refs.chatId;
                                chatId.scrollTop = chatId.scrollHeight;
                            }
                            
                        },50)
                    }
                
                })
             },


             tabChat(index){

                this.textareaFlag = "public";

                this.nowIndex2 = index;
             },

             leaveChanel(){
                this.liveController.leaveChanel();
             },

             switchsRadio(){
                console.log(this.switchs);
             },

             //3秒倒计时
             menus(){
                console.log(111);
             },

             delchannle(){

             },
        },



        components:{
            seeting:seeting,
            seetingCamera:seetingCamera,
            activity,

            signin,

            answer,
            answerAll,
            studentInfo,
            sendflowers,
            detection
                
        },

    }
</script>

<style lang="less" scoped>
    @bgColorHead: rgb(18,23,32);
    @bgColorCon:  #F1F2F4;
    @bgColorAside: linear-gradient(-180deg, #232E44 0%, #232833 32%, #212833 100%);
    ::-webkit-scrollbar {
        width: 10px;/*竖向滚动条的宽度*/
        height: 10px;/*横向滚动条的高度*/
    }
    /*滚动条轨道的样式*/
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        -webkit-border-radius: 10px;
        border-radius: 10px;
    }
    /*滚动条轨道内滑块的样式*/
    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        border-radius: 10px;
        background: rgba(155,155,155,0.8);
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
    .liveBox{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: @bgColorCon;
        overflow: hidden;
        overflow-y: auto;
    }
    header{
        padding: 0 2.7%;
        padding-bottom: 0.3vh;
        background-color: @bgColorHead;
        overflow: hidden;
        position: relative;
        z-index: 1000;
        height: 5.2vh;
        .fl{
            margin-top: 1.5vh;
            float: left;
            .iconImg{
                width: 70px;
                height: 30px;   
            }
            .iconText{
                font-family: "FZZZHONGJW--GB1-0","microsoft yahei";
                font-size: 16px;
                color: #1AAB8E;
                letter-spacing: 0;
                line-height: 16px;
                margin-left: 10px;
            }
        }
        .fr{
            float: right;
        }
        .rightCon{
            .scaleBtn{
                display: inline-block;
                height: 30px;
                padding-left: 30px;
                font-size: 14px;
                color: #FD7E23;
                background: url(../../assets/images/liveIcon/signOut.png) no-repeat center left;
                background-size: 20px 20px;
                vertical-align: middle;
                margin-left: 10px;
                cursor: pointer;
                line-height: 30px;
                margin-top: 1.3vh;
            }
        }
    }
    
    .streamBox{
        position:relative;
        width: 100%;
        margin-top: 1vh;
        padding-left: 2.7%;
        height: 90vh;
        .roomPeople{
            position: absolute;
            left: 10px;
            top: 6px;
            z-index: 99;
            font-size: 14px;
            color: #FB4804;
            text-shadow: 0 2px 4px rgba(0,0,0,0.50);
            text-indent: 20px;
            background: url(../../assets/images/liveIcon/roomPeople.png) left center no-repeat;
            background-size: 20px 20px;
            height: 20px;
            line-height: 18px;
            font-weight: normal;
        }
        .bg-purple{
            background: #F1F2F4;
            // height: 110%;
        }
        .el-slider{
            display:inline-block;
            width:100px;
            vertical-align: bottom;
            margin-left: 6px;
        }
        .el-row{
            position: relative;
            height: 100%;
        }
        .el-col-19{
            position: relative;
            // height: 67vh;
            width: 70vh*16/9;
        }
        .liveWrapper{
            width: 100%;
            min-height: 70vh;
            background: url(../../assets/images/liveIcon/emptyBg.png) center center no-repeat;
            position: relative;
        }
        .hostViewBox{
            // background: #4AC9AA;
            height: 70vh;
            width: 100%;
        }
        .tablecell{
            display: table-cell;
            vertical-align: middle;
            .connectInfo{
              display: inline-block;
              font-size: 14px;
              color: #8B572A;
              span{
                margin: 0 4px;
              }
            }
        }
        .streamOpera{
            overflow: hidden;
            padding: 4px;
            background: #fff;
            width: 100%;
            // position: absolute;
            // bottom: 0;
            // left:0;
            display: table;
            .volumnIcon{
                display: inline-block;
                width: 30px;
                height: 30px;
                cursor: pointer;
            }
            
            .outputIcon{
                background: url(../../assets/images/liveIcon/outputIcon.png) center center no-repeat;
                background-size: 16*1.26px 16px;
            }
            .barrageBtn{
                float: left;
                position: relative;
                // background-color: rgba(0,0,0,0.07);
                border-radius: 10px;
                width: 40px;
                height: 22px;
                line-height: 20px;
                text-align: center;
                font-size: 14px;
                color: #999999;
                margin-top: 10px;
                margin-left: 10px;
                background: rgb(233,233,233);
                display: table-cell;
                vertical-align: middle;
                em{
                    transition: left .3s;
                    position: absolute;
                    left: 0px;
                    top: 1px;
                    width: 20px;
                    height: 20px;
                    background: #FFFFFF;
                    box-shadow: 1px 0 9px 0 rgba(0,0,0,0.23);
                    border-radius: 50%;
                    font-size: 12px;
                    // background-image: url(../../assets/images/liveIcon/closeBarrage.png);
                    // background-position: center center;
                    // background-repeat: no-repeat;
                    // background-size: 24px 24px;
                }
            }
            .barrageBtn.openBarrage{
                background-image: linear-gradient(-90deg, #FF9E23 0%, #FF6F29 100%);
                em{
                    left: 100%-52px;
                    //background-image: url(../../assets/images/liveIcon/openBarrage.png);
                    // background-position: center center;
                    // background-size: 24px 24px;
                }
                color:#F47202;
            }
            .volLabel{
                float: left;
                margin-right: 6px;
                padding-top: 4px;
            }
            .cameraCon{
                margin-top: 6px;
                text-align: right;
                padding-right: 20px;
                .detection {
                    color: #fff;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    position: relative;
                    margin-right: 37px;
                    .el-button {
                    width: 30px;
                    height: 30px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 2;
                    opacity: 0;
                    }
                    img {
                    width: 30px;
                    height: 30px;
                    margin-top: -2px;
                    position: absolute;
                    top: 0;
                    left: 6px;
                    z-index: 1;
                    }
                }
                .scaleIcon,.setting{
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    border-radius: 4px;
                    background-image: url(../../assets/images/liveIcon/scaleIcon.png);
                    background-position: center center;
                    background-size: 30px 30px; 
                    background-repeat: no-repeat;
                    vertical-align: middle;
                    cursor: pointer;
                    margin-left: 10px;
                }
                .scaleIcon.narrow{
                    background-image: url(../../assets/images/liveIcon/narrow.png);
                }
                .scaleIcon.cameraClosed{
                    background-image: url(../../assets/images/liveIcon/closeCaerma.png);
                    background-size: 28.6px 28px;
                }
                .setting{
                    background-image: url(../../assets/images/liveIcon/setting.png);
                    background-size: 24px 24px;
                }
                .conBtn{
                    background: #F0F0F0;
                    border-radius: 100px;
                    width: 90px;
                    height: 30px;
                    text-align: center;
                    line-height: 30px;
                    font-size: 14px;
                    color: #1FAC90;
                    background-image: url(../../assets/images/liveIcon/attachment.png);
                    background-position: 14px center;
                    background-repeat: no-repeat;
                    background-size: 10*42/24px 10px;
                    text-indent: 20px;
                }
                .conBtn.attchented{
                    color: #D10C24;
                    background-image: url(../../assets/images/liveIcon/handup.png);
                }
                .conBtn.attchented.applying{
                    color: #1077D7;
                    background-image: url();
                    text-indent: 0px;
                }
            }
        }
        .whiteBg{
            background: #fff;
            position: relative;
            // height: 100%
        }
        .whiteBg.fullscreen .noclass p{
            height: 90vh;
            line-height: 105vh;
        }
        .whiteBg.fullscreen .hostViewBox{
            height: 90vh;
        }
        .playBtn{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url(../../assets/images/liveIcon/playBtn2.png) center center no-repeat;
            z-index: 99;
            background-size: 18%;
            cursor: pointer;
        }
        .connectionList{
            margin-top: 1vh;
            // margin-bottom: 2vh;
            overflow: hidden;
            .playBtn{
                background-size: 30%;
            }
            li {
      float: left;
      width: 10.5vw;
      height: 10.5vw * 3/4;
      position: relative;
      margin-right: 0.8vw;
      margin-bottom: 10px;
      // max-width: 180px;
      // max-height: 150px;
      .popLayer {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 20%;
        width: 100%;
        z-index: 102;
        background: rgba(0, 0, 0, 0.56);
        .nameText {
          float: left;
          line-height: 200%;
          font-size: 14px;
          height: 100%;
          color: #ffffff;
          width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          // text-align: center;
          text-indent: 6px;
        }
        .tour-status {
            font-size: 14px;
            color: #F8E71C;
            text-align: center;
        }
        .popOpera {
          // width: 48%;
          float: right;
          margin-top: 4px;
          margin-right: 4px;
          em {
            display: inline-block;
            width: 20px;
            height: 20px;
            cursor: pointer;
          }
          em:nth-child(1) {
            background: url(../../assets/images/liveIcon/micConnect.png) center
              center no-repeat;
            background-size: 20 * 54/63px 20px;
            margin-right: 0px;
          }
          // em:nth-child(2){
          //     background: url(../../assets/images/liveIcon/cameraIcon.png) center center no-repeat;
          //     background-size: 20*45/54px 20px;
          //     margin-right: 4px;
          // }
          // em.closeVedio{
          //     background: url(../../assets/images/liveIcon/camConClose.png) center center no-repeat;
          //     background-size: 20*45/54px 20px;
          // }
          em.closeAudio {
            background: url(../../assets/images/liveIcon/micConClose.png) center
              center no-repeat;
            background-size: 20 * 54/63px 20px;
          }
        }
      }
                .videoMask{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url(../../assets/images/liveIcon/img_empty_direct@3x.png) center center no-repeat;
                    z-index: 101;
                    background-size: 50% 50%;
                    background-color: #000;
                }
            }
            li:last-child{
                margin-right: 0;
            }
        }
    }
    .kickedOut{
        background: url(../../assets/images/liveIcon/emptyBg.png) center center no-repeat;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        p{
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            text-align: center;
            font-size: 18px;
            color: #FFFFFF;
            line-height: 16px;
            height: 4vh;
            padding-top: 6.1vw;
            background: url(../../assets/images/liveIcon/img_empty_direct@3x.png) top center no-repeat;
            background-size: 4.6vw 4.6vw*192/183;
        }
    }
</style>
<style lang="less">
    .streamBox{
        .el-slider{
            .el-slider__button{
                width: 10px;
                height: 10px;
                border: 0 none;
                box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
            }
            .el-slider__button-wrapper{
                top: -16px;
                z-index: 10;
            }
            .el-slider__bar,.el-slider__runway{
                height: 3px;
                // border-radius: 6px;
            }
            .el-slider__bar{
                background-color: #F47202;
            }
        }
    }
</style>


<style type="text/css" lang="less">
.singalBox{
    .grid-content{
        border-top: 7px solid #F1F2F4;
    }
    .student_info{
        width:100%;
        overflow: hidden;
        position: relative;
        .noticeTop{
            background: #fffeed;
            color: #91908b;
        }
        .title-top{
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 0;
            line-height: 25px;
            padding: 5px 0 0 10px;
            background: #fffeed;
        }

        .title-none{
            background: none;
        }
        .horn{
            display: inline-block;
            width: 10px;
            height: 13px;
            background-image: url(../../assets/images/liveIcon/horn1.png);
            background-position: center center;
            background-size: 10px 13px; 
            background-repeat: no-repeat;
            vertical-align:middle;
        }
        .text{
            color: #333;
        }

        .yellow{
                color: #CC3300;
        }
    }
    font-size: 14px;
    color: #4A4A4A;
    height: 100%;
    position: relative;
    margin-top: 0;
    background: #fff;
    .tab{
        position: relative;
        height: 5vh;
        line-height: 5vh;
        border-bottom: 1px solid #f9f9f8;
        color: #999;
        font-size: 14px;

        .dis{
            margin-right: 3%;
        }

        li{
            
            float: left;
            width: 18%;
            margin:0 6.5%;;
            text-align: center;
            transition: .2s;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .cur{
            font-size: 18px;
            border-bottom:3px solid #FD7E23;
            color: #FF7500;
        }
        .activity {
            position: relative;
        }

    }

    .discuss{
        .sectionjoin{
            text-align: center;
        }
        .title{
            // height: 4.5vh;
            font-size: 14px;
            line-height: 20px;;
            // padding-left: 16px;
            
        }
        

        .con{
            padding:10px 20px 0 15px;
            line-height: 18px;
            font-size: 14px;
            overflow-y:auto;
            .sys{
                color:#FD7E23;
                line-height: 18px;
                margin-bottom: 6px;
            }
            .comin{
                background:  rgb(230,230,230);
                border-radius: 100px;
                font-size: 14px;
                color: #9B9B9B;
                padding:5px 10px;
                line-height: 14px;
                margin: 1.5vh auto;
                display: inline-block;
                border-radius: 10px;
                text-align: center;
                width: auto!important;
            }
            .apply-connect{
                background: rgb(230,230,230);
                border-radius: 100px;
                font-size: 14px;
                color: #9B9B9B;
                padding:5px 10px;
                line-height: 14px;
                margin: 1.5vh auto;
                border-radius: 10px;
                text-align: center;
                width: auto!important;
                display: inline-block;
            }
            .chat{
                margin-bottom: 20px;
                word-break: break-all;
                li{
                    color: #4A4A4A;
                    font-size: 14px;
                    line-height: 25px;

                    .icon-identity,.icon-Audience{
                        padding:1px 4px 3px 4px;
                        background-image:linear-gradient(90deg, #EE676C 0%,#F07D94 100%);
                        border-radius: 2px;
                        margin-bottom: 2vh;
                        font-size: 12px;
                        color: #fff;
                    }
                    .icon-Audience{
                        background-image: linear-gradient(90deg,#0B89C5 0%, #18B3D1 100%);
                    }
                    .name{
                        color:#4A90E2;
                    }
                }
                
            }
        }
    }
    .bounceInUp {
      -webkit-animation: bounceInUp .7s;
      animation: bounceInUp .7s;
    }
    @-webkit-keyframes bounceInUp {
      from,
      60%,
      75%,
      90%,
      to {
        -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      }

      from {
        opacity: 0;
        -webkit-transform: translate3d(0, 3000px, 0);
        transform: translate3d(0, 3000px, 0);
      }

      /*60% {
        opacity: 1;
        -webkit-transform: translate3d(0, -20px, 0);
        transform: translate3d(0, -20px, 0);
      }

      75% {
        -webkit-transform: translate3d(0, 10px, 0);
        transform: translate3d(0, 10px, 0);
      }

      90% {
        -webkit-transform: translate3d(0, -5px, 0);
        transform: translate3d(0, -5px, 0);
      }*/

      to {
        opacity: 1;
        -webkit-transform: translate3d(0, 10vh, 0);
        transform: translate3d(0, 0, 0);
      }
    }

    @keyframes bounceInUp {
      from,
      60%,
      75%,
      90%,
      to {
        -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      }

      from {
        opacity: 0;
        -webkit-transform: translate3d(0, 3000px, 0);
        transform: translate3d(0, 3000px, 0);
      }

      /*60% {
        opacity: 1;
        -webkit-transform: translate3d(0, -20px, 0);
        transform: translate3d(0, -20px, 0);
      }

      75% {
        -webkit-transform: translate3d(0, 10px, 0);
        transform: translate3d(0, 10px, 0);
      }

      90% {
        -webkit-transform: translate3d(0, -5px, 0);
        transform: translate3d(0, -5px, 0);
      }*/

      to {
        opacity: 1;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
      }
    }

     .bounceInUp {
      -webkit-animation: bounceInUp .7s;
      animation: bounceInUp .7s;
    }

    .sendMsg{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        .tab{
            background: #373D47;
            border-radius: 3px;
            height: 4vh;
            line-height: 4vh;
            width: 50%;
            padding: 0 11px;
            font-size: 14px;
            color: #9B9B9B;
            float: left;
        }
        
        .cur{
            background: red;
        }

        .textareaBg{
            background: rgb(247,247,247);
            height: 120px;
            margin-top: -1px;
            position: relative;
            z-index: 10;
            .el-textarea__inner{
                background:rgb(247,247,247) !important;
                font-size: 14px!important;
            }
            .icon-send{
                background: #289cf6;
                padding: 4px 14px;
                display: inline-block;
                color: #fff;
                border-radius: 12px;
                position: absolute;
                bottom: 10px;
                right: 0;
                margin-top: 2%;
                margin-right: 5%;
                
            }
        }
    }



    //成员
    .staff{
        .search-name{
            margin-top: 2vh;
            width:90%;
            position:relative;
            left:0;
        }
        .list{
            height: 58vh;
            margin-top: 2.5vh;
            overflow-y:auto;
        }
        .list::-webkit-scrollbar {/*滚动条整体样式*/
            width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
            height: 8px;
        }
        .list::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.35);
            background: rgba(255,255,255,0.35);
        }
        .list::-webkit-scrollbar-thumb:hover {/*滚动条里面小方块hover*/
            background: rgba(255,255,255,0.5);
        }
        .list::-webkit-scrollbar-track {/*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            border-radius: 0;
            background: rgba(255,255,255,0.10);
        }


        padding-left: 15px;

        .title{
            margin-right: 10vh;
            padding-top: 3%;
            padding-bottom: 3%;
            color: #fff;
            font-size: 14px;
            background: none;
        }
        .left{
            float: left;
        }
        .rg{
            float: right;
            
        }
        .yellow{
            color: #a97b2e;
        } 

        .search{

        } 
        li{
            margin-bottom: 3vh;
            color: #666;
            font-size: 14px;
            .icon-host{
                display: inline-block;
                width: 26px;
                height: 26px;
                background: url(../../assets/images/liveIcon/host.png) no-repeat center center;
                background-size: 26px 26px;
                vertical-align: middle;
                margin-left: 10px;
                cursor: pointer;

            }

            .icon-assistant{
                display: inline-block;
                width: 26px;
                height: 26px;
                background: url(../../assets/images/liveIcon/assistant.png) no-repeat center center;
                background-size: 26px 26px;
                vertical-align: middle;
                margin-left: 10px;
                cursor: pointer;

            }
            .grayMask{
                -webkit-filter: grayscale(100%);
                -moz-filter: grayscale(100%);
                -ms-filter: grayscale(100%);
                -o-filter: grayscale(100%);
                filter: grayscale(100%);
            }
            .icon-student{
                img{
                    width: 26px;
                    height: 26px;
                    border-radius:50%;
                    vertical-align: middle;
                }
                margin-left: 10px;
            }

            .icon-name{
                width: 43%;
                //display: inline-block;
            }
            .linebg{
                background: rgba(0,0,0,0.74);
                border-radius: 45px;
                padding: 6px 10px;
            }
            .on-line{
                color: #fff;
            }
            .off-line{
                color: #F5A623;
            }
            .connect{
                color: #06CA96;
            }
        }
    }


    
}
.noclass{
    p{
        // position:absolute;
        // left: 0;
        // top: 0;
        // right: 0;
        // bottom: 0;
        margin: auto;
        text-align: center;
        font-size: 18px;
        color: #FFFFFF;
        line-height: 85vh;
        height: 70vh;
        // padding-top: 6.1vw;
        background: url(../../assets/images/liveIcon/img_empty_direct@3x.png) center center no-repeat;
        background-size: 4.6vw 4.6vw*192/183;
    }
}
</style>
<style lang="less">
    .signanimate{
        position: absolute;
        width: 120px;
        height: 120px;
        bottom: 50px;
        right: -16px;
        .aniimg{
            width: 80px;
            height: 80px;
            border-radius: 80px;
            margin: 20px 20px;
            animation:signina 1s ease infinite;
            box-shadow: 0 3px 26px -2px #F5A623;
            @keyframes signina {
                0%{
                    transform:rotate(-20deg);
                };
                25%{
                    transform:rotate(20deg);
                };
                50%{
                    transform:rotate(-10deg);
                }
                75%{
                    transform:rotate(10deg);
                };
                100%{
                    transform:rotate(0deg);
                };
            }
            img{
                max-width: 100%;
            }
        }
        .anid{
            width: 8px;
            height: 8px;
            border-radius: 8px;
            background-color: #f00;
            position: absolute;
            top: 33px;
            right: 31px;
        }
    }
    .showbarrageBox{
        overflow: hidden;
        position: relative;
        .barrageItem{
            position: absolute;
            left: 100%;
            white-space: nowrap;
            height: 38px;
            line-height: 38px;
            font-size: 18px;
            color: #fff;
            text-shadow: 0 0 3px #000;
            -webkit-transition: -webkit-transform 25s linear;
            -moz-transition: -moz-transform 25s linear;
            -o-transition: -o-transform 25s linear;
            transition: transform 25s linear;
            z-index: 99999;  
            text-shadow: 0 1px 4px #000000;            
        }
        .hornItem{
            background-image: linear-gradient(270deg,#86C3E9 0%, #4181E3 100%);
            border-radius: 50px;
            color: #fff;
            font-size: 15px;
            height: auto;
            line-height: normal;
            padding: 4px 14px;
            em{
                color:#F8E71C;
            }
            img{
                width: 45/39*18px;
                height: 18px;
                margin-right: 6px;
                margin-top: -2px;
            }
        }
        .administrator{
            b{
                background-image: linear-gradient(90deg, #51ECCE 0%, #248D53 100%);
                font-weight:normal;
                font-size: 14px;
                color: #FFFFFF;
                letter-spacing: 0;
                line-height: 12px;
                padding: 0 6px;
                margin-right: 4px;
                border-radius: 2px;
            }
            img{
              height: 19px;
              width: 40px;
              margin-right: 4px;
              margin-top: -2px;
            }
        }
        .animate{
            -webkit-transform: translateX(-3420px);
            -moz-transform: translateX(-3420px);
            -ms-transform: translateX(-3420px);
            -o-transform: translateX(-3420px);
            transform: translateX(-3420px);
        }
    }

    .dotred {
        width: 8px;
        height: 8px;
        background: #D0021B;;
        border-radius: 10px;
        position: absolute;
        z-index: 99;
        top: 8px;
        left: 50%;
        margin-left: 15px;
    }
    .cdn{
        font-size: 18px;
        color: #fff;
        background: none!important;
        line-height: 70vh!important;
    }
    .cdn-blue{
        color: #45B0E9;
    }
</style>