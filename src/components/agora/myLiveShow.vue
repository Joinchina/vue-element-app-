<template>
        <div id="liveWarp">
            <vHead></vHead>
            <div class="topMenu" v-if="hostFlag">
                <el-tooltip class="item" effect="dark" v-if="totalMicFlag"  content="媒体库" placement="bottom">
                    <el-button type="warning" icon="el-icon-service" circle @click="dialogVisible = true"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" v-if="totalMicFlag"  content="全员禁麦" placement="bottom">
                    <el-button type="info" icon="el-icon-close" circle @click="banTotalMic"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" v-if="!totalMicFlag" content="全员上麦" placement="bottom">
                    <el-button type="info" icon="el-icon-check" circle @click="banTotalMic"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="屏幕共享" placement="bottom">
                    <el-button type="primary" icon="el-icon-mobile-phone" circle @click="screenShare"></el-button>
                </el-tooltip>
                <el-button v-if="!haveClass" type="primary" @click="publish" class="cursorOpera">开始上课</el-button>
                <el-button v-if="haveClass" type="danger" @click="unpublish" class="cursorOpera">下课</el-button>
            </div>
            <el-row type="flex" class="row-bg" justify="space-around">
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <div v-for='(item,index) in originStream' :class="{liveItem:true,bigScreen:item.bigScreen}" :key="index" :id="item.playAreaId+item.getId()" @dblclick.stop="scanle">
                            <div class="suspensionLayer" v-if="item.liveHost">
                                <span :class="{operaIcon:true, closedVedio:closeVedio,openVedio:!closeVedio}" @click.stop="closeVedioHandle"></span>
                                <span :class="{operaIcon:true, closedAudio:closeAudio,openAudio:!closeAudio}" @click.stop="closeAudioHandle"></span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="15">
                    <div class="grid-content bg-purple-light liveHostBox" >
                        <div class="middleTop">
                            <div class="rightText">
                                <div v-if="!hostFlag">
                                    <img class="volummIcon" src="../../assets/images/liveIcon/sound48.png" alt="">
                                    <el-slider v-model="volumeValue" @change="changeHostVolume"></el-slider>
                                    <el-button :type="attachment?'danger':'primary'" size="mini" round @click.stop="attachmentHandle">{{attachmentText}}</el-button>
                                </div>
                                <div v-if="hostFlag">
                                    <span>摄像头：</span>
                                    <span>{{usedCameraLabel}}</span>
                                    <el-button type="primary" size="mini" round @click.stop="cameraVisible=true">切换</el-button>
                                </div>
                            </div>
                        </div>

                        <div v-for='(item,index) in hostStream' :class="{liveItem:true,bigScreen:item.bigScreen}" :key="index" :id="item.playAreaId+item.getId()" @dblclick.stop="scanle" v-show="hostShowFlag">
                            <div class="suspensionLayer" v-if="item.liveHost">
                                <span :class="{operaIcon:true, closedVedio:closeVedio,openVedio:!closeVedio}" @click.stop="closeVedioHandle"></span>
                                <span :class="{operaIcon:true, closedAudio:closeAudio,openAudio:!closeAudio}" @click.stop="closeAudioHandle"></span>
                            </div>
                        </div> 


                        <div id="agora_local" v-show="!hostShowFlag" style="position:relative;">
                            
                            <div class="button" @click="closeShareScreen">
                                <input type="button" name="" value="结束屏幕共享">
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <h2>聊天</h2>

                        <ul class="chat">
                            <li class="clearfix" v-for="(item,index) in chatArray" :key="index">
                                <p class="account">{{item.account}}</p>
                                <div class="chatCon">{{item.msg}}</div>
                            </li>
                        </ul>

                        <div class="messageInner">
                            <el-input
                                type="textarea"
                                :rows="2"
                                resize="none"
                                placeholder="请输入内容"
                                @keyup.13.native="sendChannelMsg"
                                v-model="textarea">
                            </el-input>
                           
                           <el-button type="info" size="mini" @click="sendChannelMsg">发送<i class="el-icon-message el-icon--right"></i></el-button>

                            <el-button type="info" size="mini" @click="sendPtoPMsg">点对点<i class="el-icon-message el-icon--right"></i></el-button>

                            <el-button type="info" size="mini" @click = "invitatePerson">贾君彦加入指定频道<i class="el-icon-message el-icon--right"></i></el-button>

                            <el-button type="info" size="mini" @click = "studentApplyOnLine">学员端申请连线<i class="el-icon-message el-icon--right"></i></el-button>
                            
                        </div>


                        <!--禁言-->
                      <!--   <section style="position:absolute;top:700px;left:0;">
                            <el-button style="margin-right:10px;">
                                 全体禁言
                            </el-button>

                            <div class="clearfix">
                                 <el-switch
                                  v-model="connet"
                                  active-text="连麦">
                                 </el-switch>
                            </div>

                            <div>
                                <ul>
                                    <li>

                                        常键1 <input type="button" value="连麦"name="" @click="connectChannel">
                                             <input type="button" value="禁言"name="">
                                             <input type="button" value="踢出"name="">

                                    </li>

                                    <li>

                                        常键2 <input type="button" value="连麦"name="">
                                             <input type="button" value="禁言"name="">
                                             <input type="button" value="踢出"name="">

                                    </li>

                                </ul>
                            </div>
                        </section> -->

                    </div>
                </el-col>
            </el-row>
            
            <el-dialog
                title="音乐文件"
                :visible.sync="dialogVisible"
                width="30%">
                <ul class="musicList">
                    <li @click.stop="startAudioMixing">故乡的原风景</li>
                </ul>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog
                title="切换摄像头"
                :visible.sync="cameraVisible"
                width="30%"
                @open="getCamera">
                <el-select v-model="usedCameraVal" placeholder="请选择">
                    <el-option
                    v-for="item in cameraArr"
                    :key="item.deviceId"
                    :label="item.label"
                    :value="item.deviceId">
                    </el-option>
                </el-select>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cameraVisible = false">取 消</el-button>
                    <el-button type="primary" @click="switchCamera">确 定</el-button>
                </span>
            </el-dialog>
        </div>

</template>

<script>
    import AgoraRTC from "agora-rtc-sdk";
    import SxbRTC from "@/sw/controllers/conclient";
    import vHead from '@/pages/header/header';
    export default{
        data(){
            return {
                channel:'sxbLive',         //频道
                devicesArr:"",      //视频音频设备
                volumeValue:30,            //音量
                AudioMixing:false,      //伴奏
                hostStream:[],          //主播音视频流
                originStream:[],        //其他远端流
                closeVedio: false,           //关闭视频轨道
                closeAudio:false,            //关闭音频频轨道
                haveClass:false,
                sxbController:'',            //控制器
                dialogVisible: false,        //音乐文件弹出框
                cameraVisible: false,        //切换摄像头弹出框
                messageInfo:'',              //输入的聊天信息
                usedCameraVal:'',               //正在使用的摄像头id
                usedCameraLabel:'',               //正在使用的摄像头名称
                cameraArr:'',                //视频输入设备集合
                totalMicFlag:true,            //是否全员上麦
                role:'',                      //角色
                hostFlag:false,                 //是否为主播
                attachment:false,               //连线
                attachmentText:'申请连线',       //连线按钮文字
                volummValue:30,               //主播音量


                //发送消息
                textarea:"",
                chatArray:[],
                connet:"",
                hostShowFlag:true
            }
        },

        computed:{
            account(){
                return this.$route.query.name;
            }
        },

        created () {


            if(!AgoraRTC.checkSystemRequirements()) {
                this.$message.error("您的浏览器暂不支持WebRTC!");
            }else{
                this.$message.success("支持WebRTC!");
                this.getDevices();
            }
            this.sxbController = new SxbRTC();

            this.role = this.$route.query.role;
            
            this.joinRoom();



            /*********************信令********************/
            this.receiveMsg();

            this.receivePtoPMsg();


        },

        // destroyed(){
        //     window.location.reload()
        // },
        components:{
          vHead:vHead  
        },
        methods:{

            //加入房间
            joinRoom(){
                let _this = this

                _this.hostFlag = _this.role=="STUDENT"?false:true
                console.warn(_this.hostFlag)
                _this.sxbController.joinRoom({liveFlag:_this.hostFlag},(res)=>{
                    // console.warn(res);
                    _this.hostStream.push(res)
                    _this.usedCameraVal = res.usedCamera.deviceId;
                    _this.usedCameraLabel = res.usedCamera.label;
                    setTimeout(()=>{
                        _this.sxbController.palyStream(res)
                        // res.play(res.playAreaId + res.getId(), {fit: 'contain'});
                    },500)
                    
                })
                _this.sxbController.subscribedStream((res)=>{
                    if(!_this.hostFlag&&_this.hostStream.length==0){
                        _this.hostStream.push(res)
                    }else{
                        _this.originStream.push(res);
                    }
                    setTimeout(function(){
                        _this.sxbController.palyStream(res)
                        // res.play(res.playAreaId + res.getId(), {fit: 'contain'});
                    },700)
                })
            },

            //
            //离开频道
            leavelChannel(){
                this.sxbController.leavelChannel()
            },
            getDevices(){
                let that = this;
                AgoraRTC.getDevices(function (devices) {
                    that.devicesArr=devices;
                });
            },

            //推流
            publish(){
                this.sxbController.publish();
                this.haveClass = true;
            },
            //结束推流
            unpublish() {
                this.sxbController.unpublish()
                this.haveClass = false;
                this.$router.push({path:"/agora/login"})
            },

            //订阅流音量调节
            changeHostVolume(){
                console.log(this.volumeValue)
                this.sxbController.changeHostVolume(this.hostStream[0],this.volumeValue);
                
            },
            // 设置混响
            startAudioMixing(){
                this.AudioMixing=true;
                this.sxbController.startAudioMixing(this.AudioMixing)
            },
            //双击放大
            scanle(e){
                return
                // console.log(e.target.id);
                this.totalStream.forEach((element) => {
                    if(e.target.id.indexOf(element.getId())>-1){
                        element.liveHost=true;
                    }else{
                        element.liveHost=false;
                    }
                });
            },

            // 视频轨道开启与关闭
            closeVedioHandle(){
                this.closeVedio = !this.closeVedio;
                this.sxbController.closeVedioHandle(this.closeVedio)
            },

            // 音频轨道开启与关闭
            closeAudioHandle(){
                this.closeAudio = !this.closeAudio;
                this.sxbController.closeAudioHandle(this.closeAudio)
            },

            //获取摄像头
            getCamera(){
                let that = this;
                this.sxbController.getVedioInput((res)=>{
                    that.cameraArr= res
                })
            },

            //切换摄像头
            switchCamera(){
                this.sxbController.switchCamera(this.usedCameraVal)
                this.cameraVisible = false;
                
                let _this = this;
                _this.cameraArr.forEach(item=>{
                    if(item.deviceId==_this.usedCameraVal){
                        _this.usedCameraLabel = item.label
                    }
                })
            },

            //申请连线
            attachmentHandle(){
                let _this = this;
                let closeattachment = this.attachment
                console.log(this.attachment)
                this.sxbController.attachment(closeattachment,(res)=>{
                    if(res){
                        _this.originStream.push(res);
                        setTimeout(function(){
                            _this.sxbController.palyStream(res)
                            // res.play(res.playAreaId + res.getId(), {fit: 'contain'});
                        },300)
                    }
                    _this.attachment=!this.attachment;
                    _this.attachmentText=_this.attachment?'连线中':'申请连线';
                })
            },


            //全员禁麦
            banTotalMic(){
                this.totalMicFlag = !this.totalMicFlag
                console.log(this.totalMicFlag);
                this.sxbController.banTotalMic(this.totalMicFlag);
            },
            screenShare(){

                this.hostShowFlag = false;

                this.sxbController.screenShare();
            },

            closeShareScreen(){

                this.hostShowFlag = true;

                this.sxbController.closeShareScreen();
            },











             //*************************************信令相关****************************************************//

             //发送频道消息
             sendChannelMsg(){

                console.log('keyup3333');
                this.sxbController.sendChannelMsg(this.textarea);

                this.textarea = "";
             },

             //接收频道消息
             receiveMsg(){

                let _this = this;
                _this.sxbController.signalClinet.receiveChannelMsg = function(account,uid,msg){

                    let obj = {
                        account:account,
                        msg:msg
                    }
                    _this.chatArray.push(obj);

                }
             },


             //发送点对点聊天
             sendPtoPMsg(){

                this.sxbController.sendPtoPMsg(this.textarea);
             },

             //接受点对点聊天
             receivePtoPMsg(){

                let _this = this;
                this.sxbController.signalClinet.receivePtoPMsg = function(account,uid,msg){
                    let obj = {
                        account:account,
                        msg:msg
                    }
                    _this.chatArray.push(obj);

                }
             },

             //某人申请加入频道
             invitatePerson(){

                let account = "41761";
                this.sxbController.invitatePerson(account);
             },


             studentApplyOnLine(){
                console.log("ssss");

                let account = "41761";
                let msg = {
                    account:account,
                    msg:"申请连线"
                }
                this.sxbController.studentApplyOnLine(msg);
             }







        }
    }
</script>

<style lang="less" scoped>

    /*************new css*******************/
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
        position: relative;
        h2{
            text-align: center;
            line-height: 40px;
            background: #99a9bf;
        }
        .messageInner{
            position: absolute;
            left: 0;
            bottom: 10px;
            padding: 0 10px;
            button{
                float: right;
                margin-top: 10px;
            }
        }
    }
    #agora_local{
        height: 650px;
        .button{
            position: absolute;
            left: 40%;
            top: 30%;
            z-index: 10000;
            input{
                color: red;
            }
        }
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 650px;
        height: 100%;

        .chat{

            height: 500px;
            overflow-y:auto;
            li{

                margin-bottom: 10px;
                .account{
                    color: #333;
                    text-align: right;
                    font-size: 16px;
                    margin-right: 25px;
                    margin-bottom: 5px;
                    margin-top: 10px;

                }
                .chatCon{
                    background: #fd7a06;
                    float: right;
                    text-align: left;
                    /* width: 30%; */
                    margin: 5px;
                    padding: 7px 10px;
                    border-radius: 5px;
                    color: #fff;
                    max-width: 90%;
                }
               
            }
        }

    }
    .liveItem{
        position: relative;
        z-index: 999;
        width: 100%;
        height: 150px;
        margin-bottom: 10px;
        .suspensionLayer{
            display: none;
            width: 100%;
            height: 40px;
            background: rgba(0, 0, 0, .6);
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 1001;
            overflow: hidden;
            .closedVedio{
                background: url(../../assets/images/liveIcon/close_video_default.png) no-repeat center 6px;
            }
            .openVedio{
                background: url(../../assets/images/liveIcon/open_video_default.png) no-repeat center 6px;
            }
            .closedAudio{
                background: url(../../assets/images/liveIcon/icon_voice-8151f7d0.png) no-repeat center 6px;
            }
            .openAudio{
                background: url(../../assets/images/liveIcon/microphone_default.png) no-repeat center 6px;
            }
            .operaIcon{
                // display: inline-block;
                width: 60px;
                height: 60px;
                float: right;
                background-size: 25px 25px;
                cursor: pointer;
            }
        }
    }
    .liveItem:hover{
        .suspensionLayer{
            display: block;
        }
    }
    .liveHostBox{
        .liveItem{
            height: 650px;
        }
    }
    .topMenu{
        margin: 20px auto;
        width: 63%;
        overflow: hidden;
        .cursorOpera{
            float: right;
        }
    }
    .musicList{
        li{
            margin-bottom: 10px;
            cursor: pointer;
        }
        li:hover{
            color: #409EFF;
        }
    }
    .middleTop{
        overflow: hidden;
        padding: 10px 10px;
        .rightText{
            float: right;
            font-size: 14px;
        }
    }
    .adjustVol{
        position:relative;
        .el-slider{
            position: absolute;
            top:-30px;
            left: 10px;
            z-index: 100002;
        }
    }
    .volummIcon{
        width: 30px;
        height: 30px;
    }
    .el-slider{
        display: inline-block;
        width: 100px;
        margin: 0 10px;
        margin-bottom: -16px;
    }
</style>
