<template>
	<div class="">
        <el-menu router :default-active="onRoutes" class="el-menu-vertical-demo" unique-opened >
            <template v-for="item in items">                
                <template>
                    <el-menu-item :index="item.index" class="title" @click="selectMenuCur(item)" v-show="item.isshow==true">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>
<script>
    import storage from '@/utils/storage';
    import learn from "@/model/learn/learn";
    import activity from "@/model/activity/activity";
    import work from '@/model/work/work';
	export default {
		data() {
            return {
                clazzId:"",
                items: [{
                    icon: 'icon-work',
                    index: '/index',
                    title: '我的作业',
                    isshow:true
                },{
                    icon: 'icon-vote',
                    index: '/Vote/votelist',
                    title: '我的投票',
                    isshow:true
                }, 
                {
                    icon: 'icon-question',
                    index: '/Question/questionlist',
                    title: '我的问卷',
                    isshow:true
                },  
                {
                    icon: 'icon-resource',
                    index: '/resource',
                    title: '课件下载',
                    isshow:true
                }, {
                    icon: 'icon-cclive',
                    index: '/CClive/list',
                    title: '直播课',
                    isshow:true
                }, {
                    icon: 'icon-online',
                    index: '/Online/learn',
                    title: '网络课程',
                    isshow:true
                },{

                    icon: 'icon-evaluation',
                    index: '/Evaluation/evaluationlist',
                    title: '我的评价',
                    isshow:true
                }, {
                    icon: 'icon-refl',
                    index: '/Refl/refllist',
                    title: '我的反思',
                    isshow:true
                }]
            }
        },
        created(){
            //设置左侧菜单当前使用状态
            this.statusCur();
            //获取班级id
            this.clazzId = storage.get("clazzId");
            this.getlearnstatus();
            this.getactivity();
        },
        methods:{
            statusCur(){
                let status = storage.get("status");
                if(!!status){
                    if(status == "/index"){
                        this.$store.state.menuActive = "/index";
                    }else if(status == "/resource"){
                        this.$store.state.menuActive = "/resource";
                    } else if(status == "/CClive/list") {
                        this.$store.state.menuActive = "/CClive/list";
                    }else if(status == "/Online/learn"){
                        this.$store.state.menuActive = "/Online/learn";
                    }else if(status == "/Vote/votelist"){                        
                        this.$store.state.menuActive = "/Vote/votelist";
                    }else if(status=='/Question/questionlist'){
                        this.$store.state.menuActive="/Question/questionlist";
                    }else if(status=='/Evaluation/evaluationlist'){
                        this.$store.state.menuActive="/Evaluation/evaluationlist";
                    }else if(status=='/Refl/refllist'){
                        this.$store.state.menuActive="/Refl/refllist";
                    }
                }
            },
            selectMenuCur(amout){
                
                return this.$store.dispatch("routeActive",amout.index);
            },
            //获取学员的学习信息
            getlearnstatus(){
                let data={
                    clazzId :this.clazzId
                }
                learn.onlinelearnstatus(data,(res=>{                        
                    if(res.status==200){
                        //没网络课程去掉导航
                        if(!res.data){
                            // this.items.splice(5,1)
                            this.items[5].isshow=false
                        }else{
                            // 有课程的时候存数据
                            storage.session.set("onLine",res.data);
                        }
                    }
                }))
            },
            getactivity(){
                let data={
                    clazzId :this.clazzId
                };
                activity.getmyActivity(data,(res=>{
                    if(res.status==200){
                        // console.log(res);
                        if (res.data.totalQuestionnaireCount==0) {
                            // this.items.splice(2,1)
                            this.items[2].isshow=false
                        };
                        if (res.data.totalVoteCount==0) {
                            // this.items.splice(1,1)
                            this.items[1].isshow=false
                        }
                    }  
                }))
            },
        },
        computed:{
            onRoutes(){
                //console.log(this.$store.state.menuActive);
               return this.$store.state.menuActive;
            },            
        }
	}
</script>
<style lang="less" scoped>
	.el-menu {
		border: 0;
	}
	.title {
		font-size: 16px;
		color: #333;
		&.is-active {
			color: #ff6c00;
			background: #fff5e8;
			.icon-work {
				background: url("../../assets/images/common/icon-work-sel.png") 0 0 no-repeat;
				background-size: 100% 100%;
			}
			.icon-resource {
				background: url("../../assets/images/common/icon-resource-sel.png") 0 0 no-repeat;
				background-size: 100% 100%;
			}
            .icon-cclive {
                background: url("../../assets/images/common/icon-cclive-sel.png") 0 0 no-repeat;
                background-size: 100% 100%;
            }
            .icon-online {
                background: url("../../assets/images/common/online.png") 0 0 no-repeat;
                background-size: 100% 100%;
            }
            .icon-vote {
                background: url("../../assets/images/icon/3645.png") 0 0 no-repeat;
                background-size: 100% 100%;
            }
            .icon-question {
                background: url("../../assets/images/icon/3647.png") 0 0 no-repeat;
                background-size: 100% 100%;
            }
            .icon-evaluation {
                background: url("../../assets/images/icon/3644.png") 0 0 no-repeat;
                background-size: 100% 100%;
            }
            .icon-refl {
                background: url("../../assets/images/icon/3641.png") 0 0 no-repeat;
                background-size: 100% 100%;
            }
		}
	}
	.icon-work {
		display: inline-block;
		width: 15px;
		height: 18px;
		background: url("../../assets/images/common/icon-work.png") 0 0 no-repeat;
		margin-right: 10px;
    	vertical-align: text-bottom;
    	background-size: 100% 100%;
	}
	.icon-resource {
		display: inline-block;
		width: 17px;
		height: 14px;
		background: url("../../assets/images/common/icon-resource.png") 0 0 no-repeat;
		margin-right: 10px;
    	vertical-align: text-bottom;
    	background-size: 100% 100%;
	}
    .icon-cclive {
        display: inline-block;
        width: 18px;
        height: 13px;
        background: url("../../assets/images/common/icon-cclive.png") 0 0 no-repeat;
        background-size: 100% 100%;
        vertical-align: middle;
        margin-right: 10px;
    }
    .icon-online {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url("../../assets/images/common/onlineno.png") 0 0 no-repeat;
        background-size: 100% 100%;
        vertical-align: middle;
        margin-right: 10px;
    }
    .icon-vote {
        display: inline-block;
        width: 14px;
        height: 16px;
        background: url("../../assets/images/icon/3646.png") 0 0 no-repeat;
        background-size: 100% 100%;
        vertical-align: middle;
        margin-right: 10px;
    }
    .icon-question {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url("../../assets/images/icon/3648.png") 0 0 no-repeat;
        background-size: 100% 100%;
        vertical-align: middle;
        margin-right: 10px;
    }
    .icon-evaluation {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url("../../assets/images/icon/3643.png") 0 0 no-repeat;
        background-size: 100% 100%;
        vertical-align: middle;
        margin-right: 10px;
    }
    .icon-refl {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url("../../assets/images/icon/3642.png") 0 0 no-repeat;
        background-size: 100% 100%;
        vertical-align: middle;
        margin-right: 10px;
    }
    .is-active{
        border-right:4px solid #ff8d00;
        background: #fff5e8;
    }
    .el-menu{
        padding-top: 32px;
    }
</style>