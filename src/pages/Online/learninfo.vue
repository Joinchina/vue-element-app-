<template>
    <div class="learn_top">
        <div class="progress">
            <div class="pro_state">
                <img src="../../assets/images/online/10.png" alt="" v-show="learnStatus=='NOTSTART'">                              
                <img src="../../assets/images/online/11.png" alt="" v-show="learnStatus=='UNFINISHED'">
                <img src="../../assets/images/online/14.png" alt="" v-show="learnStatus=='EXPIRED'">
                <img src="../../assets/images/online/15.png" alt="" v-show="learnStatus=='FINISHED'">
            </div>
            <div class="progress_1"></div>
            <prirEdius :proGress="finishRate"></prirEdius>
            <h1>网络课程学习进度</h1>            
        </div>
        <div class="line"></div>
        <div class="learntime">
            <div :style="fontstyle">
                <h1>必修学时要求：{{minRequiredCourseLearnTime}}学时</h1>
                <h2>已完成：<span>{{online.learnedRequiredCourseime}}学时</span></h2>
            </div>
            <div :style="fontstyle2" v-show="minOptionalCourseLearnTime!=0">
                <h1>选修学时要求：{{minOptionalCourseLearnTime}}学时</h1>
                <h2>已完成：<span>{{online.learnedOptionalCourseTime}}学时</span></h2>
            </div>
            <h3>学习要求</h3>
        </div>
        <div class="line"></div>
        <div class="starttime">
            <h1> {{beginDate | timefilter}} — {{endDate | timefilter}}</h1>
            <h2>学习起止时间</h2>
        </div>
    </div>
</template>
<script>
import prirEdius from './progress'
import learn from "@/model/learn/learn"
import storage from '@/utils/storage'
export default {
    data(){
        return {
            fontstyle:{
               marginTop:'70px', 
            },
            fontstyle2:{
               marginTop:'26px', 
            },
            clazzId:"",
            finishRate:0,//完成进度
            
            minOptionalCourseLearnTime:0,
            minRequiredCourseLearnTime:0,
            beginDate:'',
            endDate:'',
            learnStatus:'', //FINISHED：完成 UNFINISHED：未完成 EXPIRED：已截止 NOTSTART：未开始            
            online:{
                taskStatus:'',  //WAITING：未开始, INPROGRESS：进行中, END：已结束
                learnedRequiredCourseime:0,
                learnedOptionalCourseTime:0,
                minOptionalCourseLearnTime:0,//是否有选修
            },
        }
    },
    filters:{
        timefilter:function(value){
            if (!value) return 0;
            return value.replace(/-/g, '.')
        }
    },
    created(){
        //获取班级id
        this.clazzId = storage.get("clazzId");
        this. getlearnstatus(); 
    },
    methods:{
       //获取学员的学习信息
       getlearnstatus(){
           let data={
               clazzId :this.clazzId
           }
           learn.onlinelearnstatus(data,(res=>{
               if(res.status==200){
                  //console.log(res.data)
                   this.finishRate=res.data.finishRate;                   
                    this.beginDate=res.data.beginDate;
                    this.endDate=res.data.endDate;
                    this.minOptionalCourseLearnTime=res.data.minOptionalCourseLearnTime;
                    this.minRequiredCourseLearnTime=res.data.minRequiredCourseLearnTime;
                    this.learnStatus=res.data.learnStatus;
                    this.online.taskStatus=res.data.taskStatus;
                    this.online.minOptionalCourseLearnTime=res.data.minOptionalCourseLearnTime;
                    this.online.learnedRequiredCourseime=res.data.learnedRequiredCourseime;
                    this.online.learnedOptionalCourseTime=res.data.learnedOptionalCourseTime;                    
               }
           }))
       }
    },
    components:{
        prirEdius,
    },
}
</script>
<style lang="less" scoped>
.learn_top{
    width: 1004px;
    background: #FFFFFF;
    box-shadow: 0 0 35px 0 rgba(0,0,0,0.04);
    border-radius: 6px;
    margin-top: 27px;
    display: block;
    overflow: hidden;
    .progress{
        width: 305px;
        float: left;
        height: 250px;
        position: relative;
        .pro_state{
            top:19px;
            left:217px;
            position: absolute;
            img{
                width: 66px;
            }
        }
        .progress_1{
            width: 156px;
            height: 156px;
            display: block;
            border-radius:100px; 
            opacity: 0.55;
            background: #F6F6F6;
            top: 23px;
            left: 75px;
            position: absolute;
        }
        h1{
            font-size: 18px;
            color: #002B53;
            text-align: center;
            position: absolute;
            bottom: 30px;
            left: 0; 
            width: 100%;
        }
        
    }
    .line{
        width: 1px;
        height: 186px;
        opacity: 0.11;
        background: #333333;
        float: left;
        margin-top: 31px;
    }
    .learntime{
        width: 406px;
        height: 250px;
        float: left;
        position: relative;
        div{
            width: 100%;
            overflow: hidden;
            margin-left: 52px;
            h1{
                float: left;
                font-size: 16px;
                color: #333333;
                margin-right: 30px;
            }
            h2{
                float: left;
                font-size: 16px;
                color: #333333;
                span{
                    color: #ff6c00;
                } 
            }
        }
        h3{
            font-size: 18px;
            color: #002B53;
            text-align: center;
            position: absolute;
            bottom: 30px;
            left: 0; 
            width: 100%;
        }
    }
    .starttime{
        width: 291px;
        float: left;
        height: 250px;
        position: relative;
        h1{
            text-align: center;
            font-size: 16px;
            color: #333333;
            margin-top: 93px;
        }
        h2{
            text-align: center;
           font-size: 18px;
            color: #002B53;            
            position: absolute;
            bottom: 30px;
            left: 0; 
            width: 100%; 
        }
    }
}
</style>


