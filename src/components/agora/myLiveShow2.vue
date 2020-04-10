<template>
        <div id="liveWarp">
            <el-form ref="form" :model="form" label-width="110px">
                <el-form-item label="Audio source">
                    <el-select v-model="form.audio" placeholder="source">
                        <el-option :label="item.label" v-if="item.kind=='audioinput'" :value="item.deviceId" v-for="(item,index) in devicesArr" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Video source">
                    <el-select v-model="form.vedio" placeholder="source">
                        <el-option :label="item.label" v-if="item.kind=='videoinput'" :value="item.deviceId" v-for="(item,index) in devicesArr" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="App ID">
                    <el-input v-model="form.appId"></el-input>
                </el-form-item>
                <el-form-item label="Channel">
                    <el-input v-model="form.channel"></el-input>
                </el-form-item>
                <el-form-item label="Host">
                    <el-switch v-model="form.host"></el-switch>
                </el-form-item>
                <el-form-item label="AudioMixing">
                    <el-switch v-model="AudioMixing" @change="startAudioMixing"></el-switch>
                </el-form-item>
                <el-form-item label="volume">
                    <el-slider v-model="volumeValue" @change="changeVolume"></el-slider>
                </el-form-item>
                <el-form-item label="closeVedio">
                    <el-switch v-model="closeVedio" @change="closeVedioHandle"></el-switch>
                </el-form-item>
                <el-form-item label="closeAudio">
                    <el-switch v-model="closeAudio" @change="closeAudioHandle"></el-switch>
                </el-form-item>


                <el-form-item>
                    <!--发送频道消息-->
                    <div style="float:left">
                        <textarea cols="10" rows="10" v-model="sendMsg" id="textarea"></textarea>
                    </div>

                    <div style="float:left">
                        <input type="button" value="发送频道消息" name="" id="sendMsg">
                    </div>
                    

                    <div style="float:left;border:1px solid red;line-height:25px;height:150px;width:150px;">
                       <ul>
                           <li v-for="(item,index) in sendMsgArray">
                               {{item}}
                           </li>
                       </ul>
                    </div>

                </el-form-item>



                <el-form-item>
                    <el-button type="primary" @click="join">Join</el-button>
                    <el-button type="primary" @click="leavelChannel">Leave</el-button>
                    <el-button type="primary" @click="publish">Publish</el-button>
                    <el-button type="primary" @click="unpublish">Unpublish</el-button>

                </el-form-item>



               

            </el-form>
            <div id="video" :class="{videoShowBox:liveShowStart}" style="margin:0 auto;">
                <div v-for='(item,index) in totalStream' :class="{liteItem:true,bigScreen:item.bigScreen}" :key="index" :id="playAreaId+item.getId()" @dblclick.stop="scanle"></div> 
                <!-- <div class="smallScreen" id="smallScreenView"></div> -->
            </div>
        </div>

</template>

<script>
    import AgoraRTC from "agora-rtc-sdk";

    // import SxbRTC from '@/sw/sdkextends/signal';
    import SxbRTC from "@/sw/controllers/conclient";


    export default{
        data(){
            return {
                form: {
                    shareScreen:false,   //屏幕共享
                    host: true,         //开启直播
                    camera:'',          //视频源
                    microphone:'',      //音频源
                    appId:"8b209c6b57f24b3b80540137eeb52394",           //appid
                    channel:'10000',         //频道
                },
                client:'',          //客户端对象
                localStream:'',     //创建的音视频流对象。
                devicesArr:"",      //视频音频设备
                liveShowStart:false,
                volumeValue:30,            //音量
                subscribeStream: "",    //拉流对象
                AudioMixing:false,      //伴奏
                totalStream:[],          //所有的音视频流
                playAreaId:'agora_local',  //播放音视频流标签的id
                closeVedio: false,           //关闭视频轨道
                closeAudio:false,            //关闭音频频轨道




                //频道消息相关
                sendMsg:"发送消息",
                sendMsgArray:[]
            }
        },
        created () {

            // console.log("111111");
            // console.log(AgoraSis)

            //加入房间
            //new SxbRTC("joinRoom");


            
            
            if(!AgoraRTC.checkSystemRequirements()) {
                this.$message.error("您的浏览器暂不支持WebRTC!");
            }else{
                this.$message.success("支持WebRTC!");
                this.getDevices();
            }
        },

        methods:{

            //发送频道消息
            // sendMsgChannel(){

            //     new SxbRTC().;

            // },

            join(){
               
                // document.getElementById("join").disabled = true;
                // document.getElementById("video").disabled = true;
                let channel_key = null;

                console.log("Init AgoraRTC client with App ID: " + this.form.appId);
                this.client = AgoraRTC.createClient({mode: 'live',codec:"h264"});
                // this.client.configPublisher({
                //     width: 360,
                //     height: 640,
                //     framerate: 60,
                //     bitrate: 500,
                //     // publishUrl: "rtmp://xxx/xxx/"
                // });
                let that = this;
                this.client.init(this.form.appId, function () {
                    console.log("AgoraRTC client initialized");
                    that.client.join(channel_key, that.form.channel, null, function(uid) {
                        console.log("User " + uid + " join channel successfully");

                        if (that.form.host) {
                            // camera = this.camera;
                            // microphone = this.microphone;
                            that.localStream = AgoraRTC.createStream({streamID: uid, audio: true, cameraId: that.form.camera, microphoneId: that.form.microphone, video: that.form.host, screen: false});
                            //localStream = AgoraRTC.createStream({streamID: uid, audio: false, cameraId: camera, microphoneId: microphone, video: false, screen: true, extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg'});
                            if (that.form.host) {
                                that.localStream.setVideoProfile('1080p_3');
                            }

                            // The user has granted access to the camera and mic.
                            that.localStream.on("accessAllowed", function() {
                                console.log("accessAllowed");
                            });

                            // The user has denied access to the camera and mic.
                            that.localStream.on("accessDenied", function() {
                                console.log("accessDenied");
                            });

                            that.localStream.init(function() {
                                console.log("getUserMedia successfully");
                                that.localStream.bigScreen=true;
                                that.totalStream.push(that.localStream);
                                setTimeout(function(){
                                    that.localStream.play(that.playAreaId+that.localStream.getId(),{fit:'contain'});
                                },400)
                                
                                that.liveShowStart = true;
                                that.client.on('stream-published', function (evt) {
                                    console.log("Publish local stream successfully");
                                });
                            }, function (err) {
                                if(err.msg="NotReadableError"){
                                    that.$message.error('有其他设备正在占用摄像头和麦克风，请关闭后刷新并重新加入频道！')
                                }
                                console.log("getUserMedia failed", err);
                            });
                        }
                        //禁用鼠标右击事件
                        document.getElementById('video').oncontextmenu=function(){return false};
                    }, function(err) {
                        console.log("Join channel failed", err);
                    });
                }, function (err) {
                    console.log("AgoraRTC client init failed", err);
                });

                let channelKey = "";
                that.client.on('error', function(err) {
                    console.log("Got error msg:", err.reason);
                    if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
                        that.client.renewChannelKey(channelKey, function(){
                            console.log("Renew channel key successfully");
                        }, function(err){
                            console.log("Renew channel key failed: ", err);
                        });
                    }
                });


                that.client.on('stream-added', function (evt) {
                    let stream = evt.stream;
                    console.log("New stream added: " + stream.getId());
                    console.log("Subscribe ", stream);
                    that.client.subscribe(stream, function (err) {
                        console.log("Subscribe stream failed", err);
                    });
                });

                that.client.on('stream-subscribed', function (evt) {
                    let stream = evt.stream;
                    that.client.setRemoteVideoStreamType(stream, 0);  //选择接大（0）/小（1）流
                    console.log("Subscribe remote stream successfully: " + stream.getId());
                    // if ($('div#video #'+that.playAreaId+stream.getId()).length === 0) {
                    //     $('div#video').append('<div id="agora_remote'+stream.getId()+'" class=""></div>');
                    // }
                    // that.subscribeStream = stream;
                    stream.bigScreen=false;
                    stream.setVideoProfile('1080p_3');
                    that.totalStream.push(stream);
                    setTimeout(function(){
                        stream.play(that.playAreaId + stream.getId(),{fit:'contain'});
                    },500)
                });

                that.client.getRemoteVideoStats(function(res){
                    console.warn(res);
                })

                that.client.on('stream-removed', function (evt) {
                    let stream = evt.stream;
                    stream.stop();
                    $('#agora_remote' + stream.getId()).remove();
                    console.log("Remote stream is removed " + stream.getId());
                });

                that.client.on('peer-leave', function (evt) {
                    let stream = evt.stream;
                    if (stream) {
                        stream.stop();
                        $('#agora_remote' + stream.getId()).remove();
                        console.log(evt.uid + " leaved from this channel");
                    }
                });
            },

            //离开频道
            leavelChannel(){
                this.localStream.stop();
                this.client.leave(function () {
                    console.log("Leavel channel successfully");
                }, function (err) {
                    console.log("Leave channel failed");
                });
            },
            getDevices(){
                let that = this;
                AgoraRTC.getDevices(function (devices) {
                    that.devicesArr=devices;
                });
            },

            //推流
            publish(){
                // this.client.enableDualStream(function() {
                //     console.log("Enable dual stream success!")
                // }, function(err) {
                //     console,log(err)
                // })
                this.client.publish(this.localStream, function (err) {
                    console.log("Publish local stream error: " + err);
                });
            },
            //结束推流
            unpublish() {
                this.client.unpublish(this.localStream, function (err) {
                    console.log("Unpublish local stream failed" + err);
                });
            },

            //订阅流音量调节
            changeVolume(){
                if(this.subscribeStream){
                    this.subscribeStream.setAudioVolume(Number(this.volumeValue));
                }
                
            },
            // 设置混响
            startAudioMixing(){
                if(this.AudioMixing&&this.localStream){
                    this.localStream.startAudioMixing({
                        //cycle:1,        //伴奏循环次数
                        filePath:'http://127.0.0.1:8090/src/assets/music/故乡的原风景.mp3',    //文件路径
                        loop:true,       //是否无限循环
                        playTime: 0,     //设置音频文件开始播放的时间位置，单位为 ms。
                        replace: false   //是否要用音频文件替换本地音频流
                    },function(info){
                        console.log(info)
                    })
                }else if(!this.AudioMixing&&this.localStream){
                    this.localStream.stopAudioMixing();
                }
               
            },
            //双击放大
            scanle(e){
                // console.log(e.target.id);
                this.totalStream.forEach((element) => {
                    if(e.target.id.indexOf(element.getId())>-1){
                        element.bigScreen=true;
                    }else{
                        element.bigScreen=false;
                    }
                });
            },

            // 视频轨道开启与关闭
            closeVedioHandle(){
                this.closeVedio?this.localStream.disableVideo():this.localStream.enableVideo();
            },

            // 音频轨道开启与关闭
            closeAudioHandle(){
                this.closeAudio?this.localStream.disableAudio():this.localStream.enableAudio();
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-form{
        margin-top: 60px;
    }

    .videoShowBox{
        overflow: hidden;
        background: #333;
        // position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        .hostView{
            // height: 100%;
            // width: 70%;
            width: 210px;
            height: 150px;
            margin: 0 auto;
        }
        .smallScreen{
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: auto;
        }
        .liteItem{
            position: relative;
            z-index: 999;
            float: left;
            width: 210px;
            height: 150px;
        }
        .bigScreen{
            // position: fixed;
            top: 0;
            left: 0;
            // width: 100%;
            // height: 100%;
            z-index: 99;
        }
    }
    .el-slider{
        width: 400px;
    }
</style>
