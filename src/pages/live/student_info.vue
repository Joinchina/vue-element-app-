<template>
    <div class="z-content">
        <div class="top_bg">            
        </div>
        <div class="top_img">
            <img :src="imgurl" alt="">
            <span>{{username}}</span>
        </div>
        <div class="info">
            <ul>
                <li>讨论<i>({{discussnum}})</i></li>
                <li>连麦<i>({{wheatnum}})</i></li>
                <li>答题<i>({{answernum}})</i></li>
            </ul>
        </div>
        <div class="vant">
            <div class="van_img_1">
                <img src="../../assets/images/livezan/live2.png" alt="">
            </div>            
            <div class="scrollnum">
                奖励：
            </div>
            <div class="zanfont">
                <span class="span_1">{{zannum}}</span>
            </div>
            <div class="van_img_2">
                <img src="../../assets/images/livezan/live1.png" alt="">
            </div> 
        </div>
    </div>
</template>
<script>
 import model from '@/model/live/live.js'
 import userObj from '@/utils/loginServer'
import storage from '@/utils/storage'
import { Base64 } from 'js-base64';
export default {
    data(){
        return {
            discussnum:0,
            wheatnum:0,
            answernum:0,
            zannum:0,
            studentname:'',
            imgurl:'',
            romeCodeID:'',          
        }
    },
    computed:{
        clazzId(){
            return this.$route.query.clazzId
        },
        courseId(){
            return this.$route.query.courseId
        },
        username(){
                return userObj.curname() ? userObj.curname() : this.studentname;
        },

        
    },
    props:['passstudent','liveController','evevwheat'],
    watch:{
       passstudent:"show1",        
       evevwheat:"addwheat"
    },

    mounted(){      
        let imginfo=storage.get('auth')     
        let token_json = storage.get("token_users");
        for(var i in token_json){
            let item = token_json[i].split(".")[1];
            let itemDecode = JSON.parse(Base64.decode(item));
            if(itemDecode.miniAvatar){
                 imginfo= itemDecode.miniAvatar;
            }else{
                 imginfo='../../../static/default-avatar.png'
            }           
        };
        
        this.imgurl=imginfo;
        this.channelTokenAuth();
    },
    methods:{
        show1(){
            setTimeout(()=>{
                if(this.passstudent==false){
                    $(".van_img_2").fadeOut();
                }else{
                    $(".van_img_2").show();
                    let num=this.zannum
                    $(".zanfont span").eq(0).animate({"top":"0px","opacity":"0"},500,function(){
                        $(this).remove();
                        $(".zanfont").append("<span style='position: absolute;top: 16px;left: 0;opacity: 1;'>"+num+"</span>");
                    });
                    
                }
                
                setTimeout(()=>{
                    this.$emit("studentshow",false)
                })
            },1500)            
        },
        addwheat(){
            this.wheatnum++;
            
        }, 
        getflower(){
            let _this=this;
            //信道接收消息包括送花，讨论，答题
            _this.liveController.receiveChannelFloMsg(function(account,uid,msg){
                let data=JSON.parse(msg);
                console.log("我是学员信息部分接收的信息=====",data)             
                if(data.command=='CHAT'&& data.chatMessage.sendname==_this.username){
                    _this.discussnum++;
                    console.log("zhixingle mei111111111111111")
                    
                }
                if(data.command=='FINISHED_TASK'&&data.ext.type=='ANSWER' && data.ext.name==_this.username){
                    _this.answernum++;
                   
                }
                if(data.command=='CHAT'&& data.chatMessage.name==_this.username&&data.chatMessage.chatMessageType == 'SYSTEM' && data.chatMessage.msgType == 'REWARD'){
                       console.log("zhixingle mei")
                       _this.$emit("showfl",true)
                        _this.zannum++;
                       
                }
            })
        },
        channelTokenAuth(){
            let data = {
                courseId:this.courseId
            }
            model.liveRoomAuth(data,res=>{
                if(res.status==200){
                    this.getstudentdata(res.data)
                }
            })
        },     
        getstudentdata(val){
            // console.log("直播间信息",this.liveAuthInfo)
            let data={
                roomCode:val.roomCode 
            }
            model.getstudentdata(data,(res=>{
                if(res.status==200){
                    console.log("zhi博间学员信息",res.data);
                    this.discussnum=res.data.discussMessageCount;
                    this.answernum=res.data.answerQuestionCount;
                    this.wheatnum=res.data.voiceChatCount;
                    this.zannum=res.data.sendflowerByOtherCount;
                    this.getflower(res.data.userId);  
                }
            }))
        },         
    }
}
</script>
<style lang="less" scoped>
.z-content{
    width: 100%;
    overflow: hidden;
    position: relative;
    .top_bg{
       width: 100%;
       height:170px;
       background-repeat: no-repeat;
       background-position: canter center;
       background-size: cover;
        opacity:1;
    }
    .top_img{
        width: 100%;
        overflow: hidden;
        position: absolute;
        padding: 0 30px;
        top: 20px;
        left: 0;
        img{
            width: 52px;
            height: 52px;
            float: left;
            border-radius: 52px;
        }
        span{
            float: left;
            font-size: 22px;
            color: #333;
            font-weight: 500;
            letter-spacing: 0;
            text-align: justify;
            margin-top: 10px;
            margin-left: 10px;
        }
    }
    .info{
        width: 100%;
        overflow: hidden;
        position: absolute;
        padding: 0 30px;
        top: 82px;
        left: 0;
        ul{
            width: 100%;
            height: 20px;
            li{
                width: 33.33%;
                float: left;
                font-size: 14px;
                color: #666;
                letter-spacing: 0;
                text-align: justify;
                line-height: 14px;
                i{
                    color: #333;
                }
            }
        }
    }
    .vant{
        width: 100%;
        height: 90px;
        position: absolute;
        padding: 0 30px;
        top: 100px;
        left: 0;
        .van_img_1{
            width: 17px;
            height: 18px;
            float: left;
            margin-top: 10px;
            img{
                max-width: 100%;
            }
        }
        .scrollnum{
            float: left;
            font-size: 14px;
            color: #666;
            letter-spacing: 0;
            text-align: justify;
            line-height: 14px;
            margin:7px 0 0 10px;
            margin-top: 16px;
        }
        .zanfont{
            float: left;
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            text-align: justify;
            width:auto;
            height: 50px;
            line-height: 14px;
            position: relative;
            .span_1{
                display: block;
                position: absolute;
                top: 16px;
                left: 0;
                opacity: 1;
                color: #333;                
            }                               
        }
        .van_img_2{
            position: absolute;
            top: -40px;
            left: 80px;
            transform: scale(0.5);
            animation: scaleDraw 1s ease 1;
            display: none;
        }
        @keyframes scaleDraw {
            0%{
                transform: scale(1);  
            }
            100%{
                transform: scale(0.5); 
            }            
        }

    }
}
</style>


