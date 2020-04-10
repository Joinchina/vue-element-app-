<template>
    <div class="z-contetn">
        <div class="detection_box">
            <i class="close" @click="closedetection">&times;</i>
            <div class="progress">
                <ul>
                    <li :style="{'margin-left':'58px'}">
                        <span :class="{active:cameradetection}">1</span>
                        <i :class="{activefont:camerafont}">摄像头检测</i>
                    </li>
                    <li>
                        <span :class="{active:horndetection}">2</span>
                        <i :class="{activefont:hornfont}">扬声器检测</i>
                    </li>
                    <li>
                        <span :class="{active:microphonedetection}">3</span>
                        <i :class="{activefont:microfont}">麦克风检测</i>
                    </li>
                    <li :style="{'margin-right':0}">
                        <span :class="{active:enddetection}">4</span>
                        <i :style="{'margin-left':'-12px'}" :class="{activefont:endfont}">检测结果</i>
                    </li>
                </ul>
                <div class="line"></div>
            </div>
            <!-- 摄像头检测 -->
            <div class="cameradetection" v-show="cameradetection">
                <div class="proinfo">
                    <div class="info_top">
                        <h1>摄像头</h1>
                        <template>
                            <el-select v-model="value" placeholder="请选择" @change="changecamera">
                                <el-option
                                v-for="(item,index) in options"
                                :key="index"
                                :label="item.label"
                                :value="item.deviceId"
                                >
                                </el-option>
                            </el-select>
                        </template>
                        <div class="notice">
                            <i class="noticeimg"></i>
                            <span>注意：请勿选择禁用摄像头</span>
                        </div>
                    </div>
                    <div class="info_center">
                        <div class="camera">
                            <img src="../../assets/images/liveIcon/tool8.png" alt="" v-if="camera">
                            <div id="camerapreShow2"></div>
                        </div>
                    </div>
                    <div class="info_botton">
                        <h1>
                            <img src="../../assets/images/liveIcon/tool9.png" alt="">
                            <span>温馨提示：如果您无法看到声音值变化，请按以下方式排查问题</span>
                        </h1>
                        <p>1.若杀毒软件弹出提示信息，请选择“允许”</p>
                        <p>2.确认摄像头已经处于开启状态并且连接至电脑</p>
                        <p>3.如果摄像头仍然没有画面，换一个插孔插入摄像头</p>
                        <p>4.请勿选择禁用摄像头按钮</p>
                        <p>5.确认摄像头没有被其他程序占用</p>
                        <p>6.重启电脑或者更换摄像头</p>
                    </div>
                    
                </div>
                <div class="buttonbox">
                    <button class="btn_1" @click="camerainfo(false)"> 不可以看到</button>
                    <button class="btn_2" @click="camerainfo(true)"> 可以看到</button>
                </div>              
            </div>
            <!-- 扬声器检测 -->
            <div class="horndetection" v-show="horndetection">
                <div class="proinfo">
                    <div class="info_top">
                        <h1>音频输出</h1>
                        <template>
                            <el-select v-model="value1" placeholder="请选择" @visible-change="changehorn">
                                <el-option
                                v-for="item in options2"
                                :key="item.label"
                                :label="item.label"
                                :value="item.label"
                                >
                                </el-option>
                            </el-select>
                        </template>
                    </div>
                    <div class="info_center">
                        <div class="yinpin">
                            <h1>点击下方的播放按钮，您可以听到音乐吗？</h1>
                            <button class="btn1" @click="playyin('play')" :disabled="disabledd" v-if="dianani.length==0">
                                <img src="../../assets/images/liveIcon/tool10.png" alt="">
                                <span>播放音乐</span>
                            </button>
                            <button class="btn1" @click="playyin('pause')" :disabled="disabledd" v-else id="testImg">
                                <img src="../../assets/images/liveIcon/btngif.gif" alt="">
                                <span>播放中...</span>
                            </button>
                            <audio src="../../../static/decetionaudio.mp3" id="playaudio"></audio>
                        </div>
                    </div>
                    <div class="info_botton">
                        <h1>
                            <img src="../../assets/images/liveIcon/tool9.png" alt="">
                            <span>温馨提示：如果您无法看到声音值变化，请按以下方式排查问题</span>
                        </h1>
                        <p>1.若杀毒软件弹出提示信息，请选择“允许”</p>
                        <p>2.确认扬声器已连接并开启</p>
                        <p>3.音量调整至正常范围</p>
                        <p>4.如果仍然没有声音，换一个插口插入耳机或扬声器</p>
                        <p>5.重启电脑或者更换设备</p>
                    </div>
                    
                </div>
                <div class="buttonbox">
                    <button class="btn_1" @click="horninfo(false)"> 不可以听到</button>
                    <button class="btn_2" @click="horninfo(true)"> 可以听到</button>
                </div>              
            </div>
            <!-- 麦克风检测 -->
            <div class="microphonedetection" v-show="microphonedetection">
                <div class="proinfo">
                    <div class="info_top">
                        <h1>麦克风</h1>
                        <template>
                            <el-select v-model="value2" placeholder="请选择" @visible-change="getaudioput">
                                <el-option
                                v-for="item in options3"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                                </el-option>
                            </el-select>
                        </template>
                        
                    </div>
                    <div class="info_center">
                        <div id="play"></div>
                        <div class="yinpin">
                            <h1>对着麦克风从1数到10，您能看到声音值波动吗？</h1>
                            <div class="btn2">
                                <span>
                                     <img src="../../assets/images/liveIcon/yin.png" alt="" id="animateimg"> 
                                </span>                                                              
                            </div>
                        </div>
                    </div>
                    <div class="info_botton">
                        <h1>
                            <img src="../../assets/images/liveIcon/tool9.png" alt="">
                            <span>温馨提示：如果您无法看到声音值变化，请按以下方式排查问题</span>
                        </h1>
                        <p>1.若杀毒软件弹出提示信息，请选择“允许”</p>
                        <p>2.确认扬麦克风已连接并开启</p>
                        <p>3.确认麦克风已经插入电脑的麦克风插口中，且麦克风的声音已经调整到最大</p>
                        <p>4.如果麦克风仍然没有，换一个插口重新插入</p>
                        <p>5.重启电脑或者更换设备</p>
                    </div>
                    
                </div>
                <div class="buttonbox">
                    <button class="btn_1" @click="audioinfo(false)"> 不可以看到波动</button>
                    <button class="btn_2" @click="audioinfo(true)"> 可以看到波动</button>
                </div>              
            </div>
            <!-- 检测结果 -->
            <div class="enddetection" v-show="enddetection">
                <div class="consequence">
                    <div class="detectionheard">
                        <div class="left">
                            <h1>检测项目</h1>
                            <span></span>
                        </div>
                        <div class="right">
                            <h1>检测结果</h1>
                            <span></span>
                        </div>                        
                    </div>
                    <div class="equipment">
                        <ul>
                            <li>
                                <span>摄像头检测</span>
                                <span :class="{activeerror:activeerror}" v-if="endinfo.camera==false">异常</span>
                                <span :class="{activelv:activelv}" v-else>正常</span>
                            </li>
                                <li>
                                <span>扬声器检测</span>
                                <span :class="{activeerror:activeerror}" v-if="endinfo.horn==false">异常</span>
                                <span :class="{activelv:activelv}" v-else>正常</span>
                            </li>
                                <li>
                                <span>麦克风检测</span>
                                <span :class="{activeerror:activeerror}" v-if="endinfo.audio==false">异常</span>
                                <span :class="{activelv:activelv}" v-else>正常</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="buttonbox">
                    <button class="btn_1" :style="{'margin-left':'235px'}" @click="aginone"> 重新检测</button>
                    <button class="btn_2" @click="closedetection"> 进入直播间</button>
                </div>   
            </div>
        </div>
    </div>
</template>
<script>
import AgoraRTC from "agora-rtc-sdk";
import storage from '@/utils/storage'
import { setInterval, clearInterval } from 'timers';
export default {
    data(){
        return {
           value:'',
           value1:'',
           value2:'',
           options:[],
           options2:[],
           options3:[],
           camera:true,//显示视频还是无摄像头
           cameradetection:true,//摄像头检测
           horndetection:false,//扬声器检测
           microphonedetection:false,//麦克风检测
           enddetection:false,//检测结果
           activelv:true,//正常
           activeerror:true,//异常
           videourl:'',//视频路劲
           camerafont:true,
            hornfont:false,
            microfont:false,
            endfont:false,
            disabledd:true,
            endinfo:{},//检测结果
            dianani:'',
            mytimer:null,//定义一个定时器
            audioLevel:'',
            stream:'',
            seis:false,
            yinis:false,
            luis:false,

        }
    },
    computed:{
    },
    props:[
        'liveController','liveAuthInfo'
    ],
    mounted(){
        this.detescreen()
        this.getcamera();
    },
    methods:{
        closedetection(){
            this.$emit('tabledetection');
        },
        ///如果有摄像头则显示图像
        changecamera(){            
            if(this.value){
                this.liveController.cameraPreview2(this.value)
                this.camera=false;
                this.seis=true;
            }else{
                this.seis=true;
            }
        },
        camerainfo(val){
            if(this.seis==false){
                this.$message.error('请选择摄像头~');
                return
            }else if(this.options.length==0&&val==true){
                this.$message.error('没有摄像头~');
                return
            }else{
                this.$store.state.detection.camera=val;
                //关闭摄像头检测进入扬声器检测
                this.cameradetection=false;
                this.horndetection=true;
                this.hornfont=true;
            }            
            
        },
        changehorn(){
            this.disabledd=false;            
        },
        //播放音乐
        playyin(val){            
            let audioplay=document.getElementById("playaudio");
            if(val=='play'){
                audioplay.play();
                this.dianani="播放中"
            }else{
                audioplay.pause();
                this.dianani=""
            } 
            this.yinis=true;           
        },
       
        horninfo(val){
            if(this.yinis==false){
                this.$message.error('请选择扬声器~');
                return;
            }else if(this.options2.length==0&&val==true){
                this.$message.error('没有扬声器~');
                return;
                
            }else{
                //将扬声器的检测结果存入vuex中
                this.$store.state.detection.horn=val;
                //关闭扬声器检测进入扬声器检测
                this.playyin('pasue')
                this.horndetection=false;
                this.microphonedetection=true;
                this.microfont=true;
            }
            
        },      

        // 获取麦克风的音频
        getaudioput(){
            let _this=this
            _this.luis=true
            // var client = AgoraRTC.createClient({ mode: 'live', codec: 'h264' });
            // client.init(_this.liveAuthInfo.authInfo.appId, function () {                    
            //     client.join(null, "1024",null, function(uid) {
            //         console.log("加入频道成功" + uid + " join channel successfully");
            //         //加入频道成功后创建音频流
                    
            //     }, function(err) {
            //         console.log("加入频道失败Join channel failed", err);
            //     });
            // }, function (err) {
            //         console.log("创建频道失败AgoraRTC client init failed", err);
            // });
            var uid = Math.floor(Math.random()*10000);
            var stream = AgoraRTC.createStream({
                    streamID: uid,
                    audio: true,
                    video: false,
                    screen: false
                });
            // init stream
            stream.init(()=>{
                // stream.play('play');
                _this.stream=stream;
                clearInterval(_this.mytimer)
                _this.mytimer=setInterval(()=> {
                    var audioLevel = stream.getAudioLevel();
                    // Use audioLevel to render the UI
                    
                    console.log(audioLevel)
                    if(_this.audioLevel!=audioLevel){
                        _this.animateyin(parseInt(audioLevel*100))
                        _this.audioLevel=audioLevel;
                    }
                }, 1000)
                
                
            },function(err){
                console.log("银平流创建失败")
            })
            
        },
        //音频动画   
         animateyin(val){           
             $("#animateimg").animate({"marginLeft":"-200px"},1500,function(){
                 $("#animateimg").css({"marginLeft":"0px"},0)
             })            
         },   
        audioinfo(val){
            if(this.luis==false){
                this.$message.error('请选择麦克风~');
                return;
            }else if(this.options3.length==0&&val==true){
                this.$message.error('没有麦克风~');
                 //关闭当前流
                if(this.stream){
                     this.stream.close();
                }
                return;
                
               
            }else{
                if(this.stream){
                    console.log(this.mytimer)
                    clearInterval(this.mytimer)
                    this.mytimer=null
                     this.stream.close();
                     this.stream.disableAudio();
                }                
                this.$store.state.detection.audio=val;
                this.microphonedetection=false;
                this.enddetection=true;
                this.endfont=true; 
                this.getdetectionend();
            }
            
        },
        //获取当前的检测结果
        getdetectionend(){
            if(this.enddetection==true){
               this.endinfo= this.$store.getters.getdetection;
               storage.set("detection",this.endinfo);
               //上报当前的检测结果给管理端
               let role =this.$store.getters.liveauth;
               //上报摄像头
                let data = {
                        "command":"CAMERA_STATUS",
                        "roomCode":role.authInfo.roomCode,
                        "fromRole":role.authInfo.role,
                        "ext":this.endinfo.camera==true?"OK":"NO"
                }
                this.liveController.sendPtoPMsg("sxb_1",JSON.stringify(data));
                //上报麦克风
                let data2 = {
                        "command":"MIC_STATUS",
                        "roomCode":role.authInfo.roomCode,
                        "fromRole":role.authInfo.role,
                        "ext":this.endinfo.audio==true?"OK":"NO"
                }
                this.liveController.sendPtoPMsg("sxb_1",JSON.stringify(data2));
            }
        },
        //重新检测
        aginone(){
            this.cameradetection=true;
           this.enddetection=false;
           this.camerafont=true;
             this.hornfont=false;
             this.microfont=false;
             this.endfont=false;
        },
        //获取摄像头信息
        getcamera(){
            let _this=this;
            navigator.getUserMedia({video: true,audio:true}, function onSuccess(stream) {
                console.log('已点击允许,开启成功');
                AgoraRTC.getDevices(function (devices) {
                    console.log("获取到的设备信息",devices)               
                    devices.forEach(val=>{
                        if(val.kind=='videoinput'){
                            _this.options.push(val)
                        };
                        if(val.kind=='audiooutput'){
                            _this.options2.push(val)
                        };
                        if(val.kind=='audioinput'){
                            _this.options3.push(val)
                        }
                    })
                });
            }, function onError(error) {
                console.log("错误：", error);
            });                        
        },
        //检测当前屏幕大小在小于768的屏幕下重置弹框的距离
        detescreen(){
            let screenheight=$(window).height();         
            if(screenheight<=768){
                $(".detection_box").css({"top":"0vh"});
                $(".buttonbox").css({"marginTop":"16px"});
                $(".info_top").css({"marginTop":"10px"});
            }
        },
    },
    destroyed(){
        clearInterval(this.mytimer);
        this.mytimer=null
    }
}
</script>
<style lang="less">
.z-contetn{
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.64);
    position:fixed;
    top:0;
    left: 0;
    z-index:1002;
    .detection_box{        
        width: 778px;
        // height: 642px;
        overflow: hidden;
        position: absolute;
        top:15vh;
        left: 50%;
        margin-left: -389px;
        background: #212833;
        box-shadow: 0 0 7px 0 rgba(0,0,0,0.03);
        border-radius: 10px;
        .close{
            float: right;
            width: 28px;
            height: 28px;
            margin: 6px 6px;
            background-color: #121720;
            border-radius: 28px;
            cursor: pointer;
            text-align: center;
            line-height: 28px;
            font-size: 24px;
            color: #ffffff;
        }
        .progress{
           width: 96%;
           margin-top: 40px;
           margin-left: 2%;
           position: relative;
           height: 80px;
           ul{
               width: 100%;
               overflow: hidden;
               position: absolute;
               z-index: 2;
               li{
                   width: 100px;
                   float: left;
                    margin-right: 96px;
                    .active{
                         background: linear-gradient(90deg, #4AC9AA 0%, #1CB6C8 100%);
                         color:#ffffff;
                    }
                    .activefont{
                        color: #009791;
                    }
                   span{
                        width: 38px;
                        height: 38px;
                        display: block;
                        background: rgba(104,109,116,0.99);
                        color: #999999;
                        text-align: center;
                        line-height: 38px;
                        font-size: 20px;
                        border-radius:38px;
                       
                   };
                   i{
                       display: block;
                       margin-left: -20px;
                       font-size: 16px;
                       margin-top:23px;
                        color: #999999;
                   };
            
                   
               }
           }
           .line{
               width: 600px;
               height: 4px;
               background: rgba(255,255,255,0.16);
                border-radius: 2px;
                position: absolute;
                z-index: 1;
                left: 66px;
                top: 17px;
           }
        } 
        .proinfo{
            width: 100%;
            overflow: hidden;
            .info_top{
                width: 90%;
                overflow: hidden;
                margin-top: 55px;
                margin-left: 55px;
                h1{
                    float: left;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 36px;
                }
                .el-select{
                    width: 192px;
                    height: 36px;
                    float: left;
                    margin-left: 10px;
                }
                .el-select>.el-input{
                    height: 36px;
                    
                }
                .el-input__inner{
                    height: 36px;
                    background-color: rgba(255,255,255,0.34);
                    border: 1px solid #979797;
                    color:#ffffff;
                }
                .el-input.is-active .el-input__inner, .el-input__inner:focus {
                    border-color: rgba(255,255,255,0.34);
                }
                .el-select .el-input.is-focus .el-input__inner{
                    border-color: rgba(255,255,255,0.34);
                }
                .notice{
                    float: left;
                    margin-left: 10px;
                    .noticeimg{
                        width: 14px;
                        height: 14px;
                        background: url('../../assets/images/liveIcon/tool7.png') top left no-repeat;
                        float: left;
                        background-size: cover;
                        margin-top: 11px;
                        margin-right: 4px;
                    }
                    span{
                        font-size: 14px;
                        color: #999999;
                        line-height: 36px;
                    }
                }
            }
            .info_center{
                width: 100%;
                overflow: hidden;
                margin-top: 16px;
                .camera{
                    width: 171px;
                    height: 130px;
                    margin-left: 55px;
                    img{
                        width: 100%;
                    }
                    #camerapreShow2{
                        width: 171px;
                        height: 130px;
                    }
                }
                .yinpin{
                    margin-left: 55px;
                    h1{
                        font-size: 16px;
                        color: #FFFFFF;  
                    }
                    .btn1{
                        width: 112px;
                        height: 36px;
                        background: #009791;
                        border: 1px solid #009791;
                        box-shadow: 0 7px 8px 0 rgba(0,151,145,0.19);
                        border-radius: 18px;
                        margin-top: 27px;
                        img{
                            float: left;
                            width: 14px;
                            height: 14px;
                            margin: 11px 6px 0 12px;
                        }
                        span{
                            float: left;
                            line-height: 35px;
                            font-size: 16px;
                            color: #FFFFFF;
                        }
                    }
                    .btn2{
                        width: 165px;
                        height: 36px;
                        background: #009791;
                        border: 1px solid #009791;
                        box-shadow: 0 7px 8px 0 rgba(0,151,145,0.19);
                        border-radius: 18px;
                        margin-top: 27px;
                        overflow: hidden;
                        span{
                            width: 115px;
                            height: 22px;
                            display: block;
                            overflow: hidden;
                            margin-top: 6px;
                            margin-left: 22px;
                            img{
                                height: 100%;
                                transform: translateX(0px);
                            }
                        }
                    }
                    
                }
            }
            .info_botton{
                width: 100%;
                overflow: hidden;
                margin-top: 28px;
                h1{
                    margin-left: 55px;
                    margin-bottom: 10px;
                    img{
                        width: 18px;
                        height: 18px;
                        float: left;
                    }
                    span{
                        font-size: 14px;
                        color: #999999;
                        margin-left: 6px;
                    }
                }
                p{
                    width: 345px;
                    font-size: 14px;
                    color: #999999;
                    line-height: 21px;
                    margin-left: 78px;
                }
            }
        }
        .buttonbox{
            width: 100%;
            box-shadow:0px 5px 30px 10px rgba(0, 0, 0, 0.1);
            background-color: rgba(0, 0, 0,0);
            height: 76px;
            margin-top: 50px;
            .btn_1{
                width: 130px;
                height: 36px;
                background:none;
                
                border-radius: 36px;
                background: #000000;
                color:#ffffff;
                font-size: 16px;
                float: left;
                margin: 20px 36px 20px 75px;                    
            }
            .btn_2{
                width: 130px;
                height: 36px;
                background:linear-gradient(-90deg, #FF9E23 0%, #FF6F29 100%);
                border-radius: 18px;
                font-size: 16px;
                color: #FFFFFF;
                float: left;
                margin: 20px 36px 20px 0; 
            }
        }
        .enddetection{
            width: 100%;
            overflow: hidden;
            .consequence{
                width: 50%;
                overflow: hidden;
                margin-left: 25%;
                .detectionheard{
                    width: 100%;
                    overflow: hidden;
                    margin-top: 90px;
                    .left{
                        width: 50%;
                        float: left;
                        position: relative;
                       
                        height: 60px;
                        h1{
                            text-align: center;
                            position: absolute;
                            z-index: 2;
                            font-size: 16px;
                            color: #FD7E23;
                            top: 0;
                            left: 66px;
                        }
                        span{
                            width: 82px;
                            height: 6px;
                            opacity: 0.16;
                            background: #FD7E23;
                            position: absolute;
                            top: 17px;
                            left: 56px;
                        }
                    }
                    .right{
                        width: 50%;
                        float: left;
                        position: relative;
                       
                        height: 62px;
                        h1{
                            text-align: center;
                            position: absolute;
                            z-index: 2;
                            font-size: 16px;
                            color: #FD7E23;
                            top: 0;
                            left: 68px;
                        }
                        span{
                            width: 82px;
                            height: 6px;
                            opacity: 0.16;
                            background: #FD7E23;
                            position: absolute;
                            top: 17px;
                            left: 58px;
                        }
                    }
                }
                .equipment{
                    width: 100%;
                    overflow: hidden;
                    ul{
                        width: 100%;
                        overflow: hidden;
                        li{
                            width: 100%;
                            overflow: hidden;
                            margin-bottom: 37px;
                            span{
                                width: 50%;
                                float: left;
                                text-align: center;
                                font-size: 16px;
                                color: #CCCCCC;
                            }
                        }
                    }
                    .activelv{
                        color: #009791
                    }
                    .activeerror{
                        color: #CC3300;
                    }
                }
            } 
        }  
    
    }
    
}
</style>