<template>
    <div class="mustlearn">
        <h1>我 <span>／</span> 的 <span>／</span> 必 <span>／</span> 修</h1>
        <h2>（必修课已学：{{online.learnedRequiredCourseime}}学时）</h2>
        <div class="mustlearn_box">
            <ul>
                <li v-for="(item,index) in items" :key="index" @click="viewcourse(item)">
                    <div class="choose">
                        <img src="../../assets/images/online/16.png" alt="">
                    </div>
                    <div class="z-content">
                        <div class="z-content_img">
                            <img :src="item.img" alt="">
                            <h1>{{item.name}}</h1>
                        </div>
                        <h3>
                            <i class="teacher"></i>
                            <span>讲师：{{item.teacher}}</span>
                        </h3>
                        <h4>
                            <i class="time"></i>
                            <span>建议学时：{{item.recommendLearnTime | learntime}}   已学：{{item.learnTime | learntime}}</span>
                        </h4>
                    </div>
                </li>                
            </ul>
        </div>
    </div>
</template>
<script>
import learn from "@/model/learn/learn"
import storage from '@/utils/storage'
export default {
    data(){
        return {
          clazzId:'',
          items:[],
          imgArr:[
              {img:'../../../static/img/1.png'},
              {img:'../../../static/img/2.png'},
              {img:'../../../static/img/3.png'},
              {img:'../../../static/img/4.png'},
              {img:'../../../static/img/5.png'},
              {img:'../../../static/img/6.png'},
              {img:'../../../static/img/7.png'},
              {img:'../../../static/img/8.png'},
              {img:'../../../static/img/9.png'},
          ],
          learntimedata:0,
          online:[], //存储的学习信息 
        }
    },
    computed:{
         
    },
    filters:{
        learntime:function(val){
            if (!val) return '0'
            return val
        }
    },
    created(){
        //获取班级id
        this.clazzId = storage.get("clazzId")
        this. getmustlearn(); 
       this.online=storage.session.get("onLine");
    },
    methods:{
        //获取必修课信息
        getmustlearn(){
            let data={
                clazzId:this.clazzId
            };
            learn.onlineclazzlist(data,(res=>{
                if(res.status==200){
                    let imgnum=0;
                    let classwork=res.data;
                    for (let i = 0; i < classwork.length; i++) {
                        if(imgnum<9){
                            this.$set(classwork[i], 'img', this.imgArr[imgnum].img);
                        }else{
                            imgnum=0;
                            this.$set(classwork[i], 'img', this.imgArr[imgnum].img);
                        }
                        imgnum++;
                    }                    
                    this.items=classwork;                
                    //console.log(this.items);
                    this.addtimelearn();
                }
            }))
        },
        //必修课学习时间
        addtimelearn(){
            let datatime=[];
            let timelearn=0;
            this.items.forEach((item,index)=>{
                datatime.push(item.learnTime)
            });            
            for (let i = 0; i < datatime.length; i++) {
                timelearn+=datatime[i]                
            };
            this.learntimedata=timelearn.toFixed(1);
        },
        //学习课程
        viewcourse(msg){
            //判断学习是否开始
            if(this.online.taskStatus=="WAITING"){
                this.$message({
                message: '学习未开始',
                type: 'warning'
                });
            }else{
                 window.open("#/Online/viewcourse?clazzId="+this.clazzId+"&courseId="+msg.id+"&view="+false+"&taskStatus="+this.online.taskStatus+"")
            }                        
        },
    },
}
</script>
<style lang="less" scoped>
.mustlearn{
    background: #FFFFFF;
    box-shadow: 0 0 35px 0 rgba(0,0,0,0.04);
    border-radius: 6px;
    width: 1004px;
    overflow: hidden;
    margin-top: 20px;
    h1{
        text-align: center;
        font-size: 20px;
        color: #333333;;
        margin-top: 27px;
        span{
                color: #000000!important;
                opacity: 0.2;
                font-size: 18px;
            }
    }
    h2{
        text-align: center;
        font-size: 16px;
        color: #FD7E23;
        margin-top: 10px;
         font-weight: 600;
    }
    .mustlearn_box{
        width: 100%;
        overflow: hidden;
        ul{
            width: 100%;
            overflow: hidden;
            margin-top: 20px;
            li{
                width: 23%;
                float: left;
                height: 195px;
                margin-top: 4px;
                margin-bottom: 20px;
                margin-left: 1.5%;
                position: relative;
                background: #FFFFFF;
                cursor: pointer;                               
                .choose{
                    width: 47px;
                    height: 22px;
                    position: absolute;
                    top: -6px;
                    left: -14px;
                    z-index: 1;
                    img{
                        max-width: 100%;
                        display: inline;
                    }
                }
                .z-content{
                    width: 226px;
                    overflow: hidden;
                    position: absolute;
                    top: 0;
                    right: 0;
                    box-shadow: 0 8px 10px 0 rgba(51,51,51,0.04);
                    border-radius: 6px;
                    -webkit-transition: -webkit-box-shadow 0.3s ease-in-out;
                    -moz-transition: -moz-box-shadow 0.3s ease-in-out;
                    -o-transition: -o-box-shadow 0.3s ease-in-out;
                    transition:box-shadow 0.3s ease-in-out;
                    .z-content_img{
                        position: relative;
                        width: 226px;
                        height: 124px;
                        overflow: hidden;
                        img{
                            max-width: 100%;
                            -webkit-transition: -webkit-transform 0.3s;
                            -moz-transition: -moz-transform 0.3s;
                            -o-transition: -o-transform 0.3s;
                            transition: transform 0.3s;
                        }
                        h1{
                            width: 210px;
                            text-align: left;
                            position: absolute;
                            top: 8px;
                            left: 50%;
                            margin-left: -105px;
                            font-size: 20px;
                            color: #FFFFFF;
                            height: 90px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 3;
                            -webkit-box-orient: vertical;                            
                        }
                    }
                    h3,h4{
                        font-size: 14px;
                        color: #666666;
                        margin: 10px 0 13px 13px;
                        i{
                            vertical-align: middle;
                            margin-right: 4px;
                        }
                    }                   
                }
            }
            li:hover{              
                .z-content{                
                     box-shadow: 0 8px 10px 0 rgba(51,51,51,0.2);
                }
                .z-content_img{                  
                    img{
                         -webkit-transform: scale(1.1);
                        -moz-transform: scale(1.1);
                        -ms-transform: scale(1.1);
                        -o-transform: scale(1.1);
                        transform: scale(1.1);
                    }
                }
            }
        }
    }
    .teacher{
        width: 12px;
        height: 12px;
        display: inline-block;
        background: url("../../assets/images/online/19.png") center center no-repeat;
        background-size: 100% 100%;
    }
    .time{
        width: 12px;
        height: 12px;
        display: inline-block;
        background: url("../../assets/images/online/22.png") center center no-repeat;
        background-size: 100% 100%;
    }
}
</style>


