<template>
    <div class="z-content">
        <div class="signinbox" v-show="showsiginin">
            <img src="../../assets/images/liveIcon/siginin.png" alt="" class="bg_1">
            <div class="signin">
                <div class="close" @click="closetc('close')"><img src="../../assets/images/liveIcon/tip-close.png" alt=""></div>
                <h1>管理者开启了签到</h1>
                <button @click="playsign">请签到</button>
            </div>
        </div>
        <!-- 签到成功 -->
        <div class="success_box" v-show="successsignin">
            <div class="signin">
                <div class="close" @click="closetc('')"><img src="../../assets/images/liveIcon/tip-close.png" alt=""></div>
                <div class="status"><img src="../../assets/images/liveIcon/success.png" alt=""></div>
                <h1>签到成功</h1>
                <button @click="closesuccess('')">确定</button>
            </div>
        </div>
        <!-- 签到失败 -->
        <div class="error_box" v-show="errorsignin">
            <div class="signin">
                <div class="close" @click="closetc('')"><img src="../../assets/images/liveIcon/tip-close.png" alt=""></div>
                <div class="status"><img src="../../assets/images/liveIcon/error.png" alt=""></div>
                <h1>签到失败</h1>
                <h2>{{errorfont}}</h2>
                <button @click="closeerror('')">请重试</button>
            </div>
        </div>
    </div>
</template>
<script>
import {startsign} from '@/sw/utils/sig'
import live from '@/model/live/live.js'
import storage from '@/utils/storage'
import userObj from '@/utils/loginServer'
export default {
    data(){
        return {
            showsiginin:true,
            successsignin:false,
            errorsignin:false,
            userid:'',
            errorfont:'',
            closetime:null,
        }
    },
    computed:{
            
            username(){
                return userObj.curname() ? userObj.curname() : this.name;
            },
            
        },
    props:["liveController","signpassdata"],
    created(){
        //获取当前用户的id
        this.userid=storage.get("userId");
    },
    methods:{
        closesuccess(val){
            this.$emit("conshowsign",val)
        },
        closeerror(){
            this.errorsignin=false;
            this.showsiginin=true;
        },
        closetc(val){
            this.$emit("conshowsign",val)
        },
       
        //点击签到
        playsign(){
            console.log(this.signpassdata)
            let data={
                id:this.signpassdata.ext.taskId,
            };
            live.livepostsign(data,(res=>{
                if(res.status==200 && res.data=='签到成功'){
                    let auth=this.$store.getters.liveauth
                    let account=auth.broadcaster.name+"_"+auth.broadcaster.id
                    this.showsiginin=false;                                  
                    this.liveController.sendPtoPMsg(account,startsign("FINISHED_TASK","SIGN", this.username,this.userid, this.signpassdata.ext.taskId));                    
                    this.successsignin=true;
                    this.errorsignin=false;
                    this.closetan();
                    //签到成功在本地增加签到记录
                    storage.set("successsign",this.signpassdata.ext.taskId)
                }else{
                    this.errorsignin=true;
                    this.successsignin=false;
                    this.errorfont=res.message;
                    this.closetan();
                }
            }))
        },
        //3秒关闭弹窗
        closetan(){
            this.closetime=setTimeout(()=>{
                this.$emit("conshowsign",'')
            },3000)
        }
    },
}
</script>
<style lang="less" scoped>
.z-content{
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.68);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    .signinbox{
        width: 306px;
        height: 250px;       
        border-radius: 10px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -125px;
        margin-left: -153px;
        overflow: hidden;
        .bg_1{
            display: block;
            width: 103px;
            position: absolute;
            top:0;
            left: 50%;
            margin-left: -51.5px;
            z-index: 2;
        }
        .signin{
            position: absolute;
            top: 27px;
            left: 0;
            z-index:0;
            width: 306px;
            height: 223px;
            background-image: linear-gradient(-180deg, #FDEEB3 0%, #FFFFFF 61%);
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.11);
            border-radius: 10px;
            .close{
                width: 16px;
                height: 16px;
                float:right;
                margin: 10px 10px 0 0;
                img{
                    max-width: 100%;
                }
            }
            h1{
                font-size: 18px;
                color: #171717;
                text-align: center;
                margin-top: 107px;
            }
            button{
                width: 107px;
                height: 36px;
                display: block;
                margin: 0 auto;
                margin-top: 35px;
                cursor: pointer;
                background-image: linear-gradient(-90deg, #FF9E23 0%, #FF6F29 100%);
                box-shadow: 0 7px 8px 0 rgba(255,123,40,0.39);
                border-radius: 18px;
                font-size: 16px;
                color: #FFFFFF;
            }
        }
        
    }
    .success_box{
            width: 306px;
            height: 248px;
            background: #FFFFFF;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.11);
            border-radius: 10px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -124px;
            margin-left: -153px;
            .signin{
                width: 306px;
            height: 248px;
                .close{
                width: 16px;
                height: 16px;
                float:right;
                margin: 10px 10px 0 0;
                img{
                    max-width: 100%;
                }
            }
            .status{
                width: 70px;
                margin: 0 auto;
                padding-top: 31px;
                img{
                    max-width: 100%;
                }
            }
            h1{
                font-size: 18px;
                color: #171717;
                text-align: center;
                margin-top: 28px;
            }
            button{
                width: 107px;
                height: 36px;
                display: block;
                margin: 0 auto;
                margin-top: 35px;
                cursor: pointer;
                background-image: linear-gradient(-90deg, #FF9E23 0%, #FF6F29 100%);
                box-shadow: 0 7px 8px 0 rgba(255,123,40,0.39);
                border-radius: 18px;
                font-size: 16px;
                color: #FFFFFF;
            }
            }
            
        }
    .error_box{
        width: 306px;
            height: 289px;
            background: #FFFFFF;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.11);
            border-radius: 10px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -144px;
            margin-left: -153px;
            .signin{
                width: 306px;
            height: 248px;
                .close{
                width: 16px;
                height: 16px;
                float:right;
                margin: 10px 10px 0 0;
                img{
                    max-width: 100%;
                }
            }
            .status{
                width: 70px;
                margin: 0 auto;
                padding-top: 31px;
                img{
                    max-width: 100%;
                }
            }
            h1{
                font-size: 18px;
                color: #171717;
                text-align: center;
                margin-top: 28px;
            }
            h2{
                font-size: 18px;
                color: #171717;
                text-align: center;
                margin-top: 16px;
            }
            button{
                width: 107px;
                height: 36px;
                display: block;
                margin: 0 auto;
                margin-top: 30px;
                cursor: pointer;
                background-image: linear-gradient(-90deg, #FF9E23 0%, #FF6F29 100%);
                box-shadow: 0 7px 8px 0 rgba(255,123,40,0.39);
                border-radius: 18px;
                font-size: 16px;
                color: #FFFFFF;
            }
            }
    }     
}
</style>


