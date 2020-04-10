<template>
      
    <div>
        <v-head></v-head>
        <template>
            <div class="courseNmae"><p>{{courseNmae}}</p></div>
        </template>
        <div class="previewWrapper">
            <el-row class="tac">
                <el-col :span="24">
                    <h5>{{msg}}</h5>
                    <el-menu 
                        default-active="2"
                        class="el-menu-vertical-demo"
                        active-text-color="#FF8D00"
                        :unique-opened="uniqueOpened"
                        :router="false"
                        @select="menuItemSelect"
                        @open="handleOpen">
                        <template v-for="(item,index) in navArray">
                            <!-- 目录 -->
                            <el-submenu :index="item.courseId" :key="index" v-if="item.directory">
                                <template slot="title">
                                    <el-tooltip :open-delay="500" :enterable="false" class="item" effect="light" :content="item.name" placement="bottom">
                                            <span>{{item.name}}</span>                                                                          
                                    </el-tooltip>
                                </template>
                                <el-menu-item v-for="(item2,index2) in item.children" :key="index2" :index="item2.courseId">
                                    <el-tooltip :open-delay="500" :enterable="false" class="item" effect="light" :content="item.name" placement="bottom">
                                        <span :style="styleset">{{item2.name}}</span>                                                                                                                          
                                    </el-tooltip>
                                    <div class="endview">
                                        <span v-show="item2.finiFhed==1">完成</span>
                                        <span v-show="item2.BreakPoint!=0 && item2.finiFhed==0"><img src="../../assets/images/online/20.png" alt=""></span>
                                    </div>
                                </el-menu-item>
                            </el-submenu>
                            <!-- 非目录 -->
                            <el-menu-item :index="item.courseId" v-else :key="index">
                                
                                <el-tooltip :open-delay="500" :enterable="false" class="item" effect="light" :content="item.name" placement="bottom">
                                        <span :style="styleset">{{item.name}}</span>                                        
                                </el-tooltip>
                                <div  class="endview">
                                    <span v-show="item.finiFhed!=0">完成</span>
                                    <span v-show="item.BreakPoint!=0 && item.finiFhed==0"><img src="../../assets/images/online/20.png" alt=""></span>
                                </div>
                            </el-menu-item>
                        </template>
                    </el-menu>
                </el-col>
            </el-row>
            
            <div class="showBox">
                <el-breadcrumb separator-class="el-icon-arrow-right" v-if="hasClass">
                    <el-breadcrumb-item><span class="step1">{{breadcrumbone}}</span></el-breadcrumb-item>
                    <el-breadcrumb-item><span class="step2">{{breadcrumbtwo}}</span></el-breadcrumb-item>
                </el-breadcrumb>

                <div class="viewBox">
                    <video v-show="vedioShow" :src="courseUrl" controls="controls"  width="90%" height="auto" class="vedioTag" id="videoSource">
                    您的浏览器暂不支持vedio媒体播放，请升级浏览器
                    </video>
                    <iframe v-show="htmlShow" :src="nocourseUrl" id="showIframe" frameborder="0" width="100%" height="100%"></iframe>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
    import vHead from '@/pages/header/header';
    import learn from "@/model/learn/learn"
    export default{
        data () {
            return {
               msg:"目录",
               uniqueOpened:true, //是否只打开一个下拉菜单
               breadcrumbone:"",
               breadcrumbtwo:"",
               clazzId:"",  //班级id
               staticText:"当前位置：",
               onlineCourseId :"",  //网络课程id
               courseNmae:"", //课程名
               vedioShow:false,
               htmlShow: true,
               courseUrl:'',    //课程显示的地址
               nocourseUrl:'',    //非课程显示的地址
               courseAllData:{},   //后台获取的全部课程数据
               depositText:"",    //预存一级面包屑导航
               hasClass: false,   //控制面包屑，有数据显示，无数据隐藏
               navArray:[],     //左侧nav菜单
               settimer: null, //定义定时器
               timedata: 0, //定义观看时长
               courseId:0,//课程资源ID
               breakPoint:0,//播放的断点时长
               finished:false,//当前资源是否播放完成
               videotime:0, //当前视频的长度，服务器获取的断点时长+当前播放时长
               view:'', //是预览还是学习
               taskStatus:'',
               styleset:{
                    'width':' 90%',
                    'overflow': 'hidden',
                    'display': 'inline-block',
                    'text-overflow': 'ellipsis',
                    'white-space':' nowrap',
               },
               videoitem:{},
            }
        },
        created () {
            this.getQuery();                                 
        },
        mounted() {    
             this.getHiddenProp();                     
        },

        methods:{
            getQuery(){
                //获取路由参数
                this.clazzId=this.$route.query.clazzId;
                this.onlineCourseId=this.$route.query.courseId;
                this.view=this.$route.query.view;
                this.taskStatus=this.$route.query.taskStatus;
                this.onlineCourseDetail();
            },
            //获取课程目录
            onlineCourseDetail(){
                let coursedata ={
                    clazzId: this.clazzId,
                    onlineCourseId: this.onlineCourseId
                };
                learn.onlinecoursedetail(coursedata,(result)=>{                    
                    if(result.status==200){
                        //console.log(result.data)
                        let cursorData = result.data;
                        this.courseNmae = cursorData.name;
                        this.courseAllData = cursorData;
                        document.title= this.courseNmae;   
                        if(cursorData.resourceItemList.length>0){
                            this.dealDate(cursorData.resourceItemList);
                        }else{
                            this.msg="目录为空";
                        }
                        
                    }else{
                        this.$message.error(result.message);
                        
                    }
                })
            },       
            handleOpen(key, keyPath) {
                console.log(key)
                this.courseAllData.resourceItemList.forEach((item,index)=>{
                    if(item.itemId==key){
                        this.depositText=item.itemName;
                        
                    }
                })
            },
            // //默认播放第一个视频
            // opendefault(){
            //     console.log(this.navArray)
            //     if(this.navArray[0].directory==false){
            //         // 没有child
            //         this.menuItemSelect(this.navArray[0].courseId);
            //     }else{
            //         //有child
            //         this.menuItemSelect(this.navArray[0].children[0].courseId);
            //     }
            // },
            //点击播放
            menuItemSelect(index){
                clearInterval(this.settimer)
                let clickId = index;
                let video=document.getElementById("videoSource");                                                             
                this.courseAllData.resourceItemList.forEach((item,index)=>{
                    if(item.itemId==clickId){
                        this.courseId=item.resourceId;
                        if(item.parentItemId=="00000000-0000-0000-0000-000000000000"){
                            this.breadcrumbone = this.staticText+item.itemName;
                            this.breadcrumbtwo = "";
                        }else{
                            this.breadcrumbtwo = item.itemName
                            this.breadcrumbone = this.staticText+this.depositText;
                        }
                        this.hasClass=true;
                        if(item.resourceType=="URL"){
                            video.pause();
                            this.vedioShow=false;
                            this.htmlShow=true;
                            this.nocourseUrl = item.resourceUrl;
                            this.finished= true;
                            this.postlearntime()
                            this.timelearn();
                        }else if(item.resourceType=="VIDEO"){
                            this.videoitem=item
                            this.vedioShow=true;
                            this.htmlShow=false;
                            this.courseUrl = this.videoitem.resourceUrl; 
                            video.removeEventListener("play",this.videoplay2); 
                            video.removeEventListener("pause",this.videopause);                                                          
                            this.videoplay();                                                                                                                
                        }
                        
                    }
                })
            },
            //章节目录遍历生成                
            dealDate(dataArray){
                let resultArr = [];
                dataArray.forEach((item,index) => {
                    if(item.directory){
                        resultArr.push({name:item.itemName,directory:true,courseId:item.itemId,children:[]});
                    }else if(item.parentItemId=="00000000-0000-0000-0000-000000000000"){
                        resultArr.push({name:item.itemName,directory:false,courseId:item.itemId,BreakPoint:item.breakPoint,finiFhed:item.finished});
                    }else{
                        resultArr.forEach((item2,index2)=>{
                            if(item.parentItemId==item2.courseId){
                                item2.children.push({name:item.itemName,courseId:item.itemId,BreakPoint:item.breakPoint,finiFhed:item.finished})
                                return true
                            }
                        })
                    }
                });
                this.navArray=resultArr;
                //console.log(this.navArray)
                // this.opendefault()
            },
            //shipin状态监控
            videoplay(){
                //添加监听事件
                //console.log("11",this.videoitem)
                let video=document.getElementById("videoSource");                                                                                                               
                video.addEventListener("play",this.videoplay2);
                video.addEventListener("pause",this.videopause);                
            },
            // video事件监听
            videoplay2(){
                let video=document.getElementById("videoSource");
                // 视频断点续播currentTime                          
                if(this.videoitem.finished==0){
                    //没有播放完毕
                    this.finished= false;                                
                    video.currentTime=parseInt(this.videoitem.breakPoint+video.currentTime);
                }else{
                    //播放完毕直接到视频最后
                    this.finished= true;
                    video.currentTime=video.duration;
                };                  
                    clearInterval(this.settimer)
                    this.timelearn();                    
            },
            videopause(){
                let video=document.getElementById("videoSource");               
                this.postlearntime();
                clearInterval(this.settimer)
            },            
            //判断窗口是否被浏览，在最小化时也是不被浏览
            getHiddenProp() {
                // 各种浏览器兼容                
                var hidden, state, visibilityChange;
                if (typeof document.hidden !== "undefined") {
                    hidden = "hidden";
                    visibilityChange = "visibilitychange";
                    state = "visibilityState";
                } else if (typeof document.mozHidden !== "undefined") {
                    hidden = "mozHidden";
                    visibilityChange = "mozvisibilitychange";
                    state = "mozVisibilityState";
                } else if (typeof document.msHidden !== "undefined") {
                    hidden = "msHidden";
                    visibilityChange = "msvisibilitychange";
                    state = "msVisibilityState";
                } else if (typeof document.webkitHidden !== "undefined") {
                    hidden = "webkitHidden";
                    visibilityChange = "webkitvisibilitychange";
                    state = "webkitVisibilityState";
                }
                document.addEventListener(
                    visibilityChange,
                    () => {
                    clearInterval(this.settimer)
                    //  console.log(document[state]);
                    if (document[state] == "visible") {
                        if(this.htmlShow==true){
                            this.timelearn();
                        };
                        if(this.vedioShow==true){
                            this.videoplay()
                        }
                    } else {                        
                        this.postlearntime();                      
                        document.getElementById("videoSource").pause();

                    }
                    },
                    false
                );
                },
            //计时函数
            timelearn() {
                let time = 0;                
                clearInterval(this.settimer);                 
                this.settimer = setInterval(() => {
                    time++;
                    if (time >= 180) {
                        //时间三分钟，传数据
                        this.timedata = 180;
                        //重置time为0
                        time = 0;
                        //执行学习时间上传                        
                        this.postlearntime();
                    } else {
                        this.timedata = time;
                    };

                }, 1000);
            },
            //每三分钟学时上报
            postlearntime(){
                let video=document.getElementById("videoSource");
                if(parseInt(video.currentTime)==parseInt(video.duration)){
                    this.finished=true;
                }
                if(this.view=='false' && this.taskStatus!='END'){
                   
                    let data={
                        breakPoint:parseInt(video.currentTime), // 播放断点的时间点
                        clazzId:this.clazzId,
                        finished:this.finished, //当前资源是否观看完成
                        onlineCourseId :this.onlineCourseId ,//网络课程id 
                        onlineResourceId:this.courseId,//课程资源ID
                        time :this.timedata,//学习时长
                    };
                    learn.onlinetimereport(data,(res=>{
                        if(res.status==200){
                            console.log(res);
                            //发送成功后this.timedata清零
                            this.timedata = 0;
                            this.onlineCourseDetail(); 
                           
                        }
                    }))
                }else{
                    console.log('不符合规则的上传被阻断')
                }              
            },
                     
        },
        destroyed(){
            clearInterval(this.settimer)
        },
        components:{
            vHead
        }
    }
</script>


<style lang="less" scoped>
    .courseNmae{
        font-size: 20px;
        color: #333333;
        height: 60px;
        line-height: 60px;
        background: #fff;
        font-weight: bold;
        p{
            max-width:1250px;
            margin: 0 auto;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    .viewBox{
        width: 100%;
        height: 100%;
    }
    .previewWrapper{
        display: flex;
        max-width: 1250px;
        margin: 20px auto;
        justify-content: space-between;
        .el-row{
            flex-grow:1;
            box-shadow: 0 0 12px 0 rgba(0,0,0,0.06);
            background: #ffffff;
           h5{
                max-width: 240px;
                font-size: 20px;
                color: #333333;
                height: 60px;
                line-height: 60px;
                text-indent: 20px;
                border-bottom:2px solid  rgba(120,144,156,0.16);
            }
        }
        .showBox{
            flex-grow:2;
            max-width: 980px;
            min-height: 670px;
            background: #ffffff;
            box-shadow: 0 0 12px 0 rgba(0,0,0,0.06);
            .el-breadcrumb{
                height: 50px;
                line-height: 50px;
                padding: 0 10px;  
                border-bottom: 1px solid rgba(120,144,156,0.16);     
            }
            .step1{
                font-size: 14px;
                color: #9B9B9B;
            }
            .step2{
                color: #333333 !important;        
            }
            .vedioTag{
                margin: 30px auto;
            }
        }
    }
    
    .el-row{
        max-width: 240px;
    }
    .littleTitle{
        background: #ffffff;
        height: 50px;
        line-height: 50px;
        span{
            display: inline-block;
            width: 45%;
            font-size: 14px;
            color: #333333;
            text-indent: 20px;
        }
        span:last-child{
            text-indent: 0;
            text-align: right;
            font-size: 10px;
            color: #999999;
        }
    }
    .el-menu{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: "微软雅黑";
        .el-submenu{
            font-size: 16px;
            color: #333333;
            font-weight: bold;
            // .el-menu-item.is-active{
            //     background: #FFF4E8 !important;
            //     border-left: 6px solid #FF8D00;
            // }
            .el-submenu__title span{
                display: inline-block;
                max-width: 190px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .el-submenu .el-menu-item{
            font-weight: normal;
            border-left: 6px solid transparent;
        }
        .el-menu-item.is-active{
            background: #FFF4E8 !important;
            border-left: 6px solid #FF8D00;
        }
        .el-menu-item{
            font-weight: bold;
            font-size: 14px;
            font-weight: bold;
            color: #333333;
            width: 100%;
            padding: 0 20px !important;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .endview{
            position: absolute;
            top: 0;
            right: 4px;
            z-index: 2;
            span{
                color: #999999;
                font-size: 12px;
            }
        }    

        
    }
</style>
