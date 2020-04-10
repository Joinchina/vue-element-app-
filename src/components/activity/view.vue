<template>
    <div>
        <div class="goback" v-if="origin != 'live'" @click="goback">
            <span> <img src="../../assets/images/icon/icon-goback.png" alt="">
                返回 {{gobacktitle}}</span>
        </div>
        <div class="no-goback" v-else></div>
        <div class="vote_box">
            <article class="x-article">
				<div class="realname"  v-show="activity=='questionview'">
					<span v-if="item.realNameFlag==true">实名</span>
					<span v-else>匿名</span>
				</div>
				<div class="status">
					<button>{{status | statusfont}}</button>
				</div>
				<div class="header">
					<h1>{{item.title}}</h1>
					<!-- 投票 -->
					<template v-if="item.type=='VOTE'">
					<p class="summary" ><i class="icon-course"></i>所属课程：{{item.courseName}}</p>
					<p class="summary" ><i class="icon-ques-num"></i>题目：共{{item.questionCount}}道题</p>
					</template>
					<!-- 问卷 -->
					<template v-if="item.type=='QUESTIONNAIRE'">
					<p class="summary" >问卷说明：{{item.description}}</p>
					<p class="summary" ><i class="icon-course"></i>所属课程：{{item.courseName}}</p>
					<p class="summary">
						<span class="mg-r30"><i class="icon-time"></i>截止时间：{{item.endTime | timerfilter}}</span>
						<span ><i class="icon-ques-num"></i>题目：共{{item.questionCount}}道题</span>
					</p>
					</template>
				</div>
				
				<section class="x-ques">
				<div v-for="(val,index) in item.questions" :key="index">
					<!-- 单选	 -->
					<dl v-if="val.type=='SELECT'">
						<dt>
							<h2 :class="{'estyle':val.errstyle}">
								<span class="q" >Q{{index+1}}</span>
								<span class="type" v-if="val.required==true">
								{{val.question}}？（单选题）（必答）
								</span>
								<span class="type" v-else>
								{{val.question}}？（单选题）（选答）
								</span>
							</h2>
						</dt>
						<dd >
							<el-radio-group v-model="reflum[index].radio">
								<el-radio  v-for="(radio,index1) in val.optionStatistics" :key="index1" :label="radio.optionContent" disabled >{{selList[index1]}}{{radio.optionContent}}</el-radio>								
							</el-radio-group>				
						</dd>
						
					</dl>
					<!-- 多选 -->
					<dl  v-if="val.type=='MUILTSELECT'">
						<dt>
							<h2>
								<span class="q" >Q{{index+1}}</span>
								<span class="type" v-if="val.required==true">
								{{val.question}}？（多选题）（必答）
								</span>
								<span class="type" v-else>
								{{val.question}}？（多选题）（选答）
								</span>
							</h2>
						</dt>
						<dd >
							<el-checkbox-group v-model="reflum[index].radio">
								<el-checkbox v-for="(radio,index2) in val.optionStatistics" :key="index2" :label="radio.optionContent" disabled >{{selList[index2]}}{{radio.optionContent}}</el-checkbox>								
							</el-checkbox-group>
						</dd>
						
					</dl>
					<!-- 问答 -->
					<dl v-if="val.type=='SUBJECTIVE'">
						<dt>
							<h2>
								<h2>
								<span class="q" >Q{{index+1}}</span>
								<span class="type" v-if="val.required==true">
								{{val.question}}？（问答题）（必答）
								</span>
								<span class="type" v-else>
								{{val.question}}？（问答题）（选答）
								</span>
							</h2>
							</h2>
						</dt>
						<dd >
							<el-input
							type="textarea"
							:rows="6"
							v-model="reflum[index].radio[0]"
							:disabled="true"
							:label="reflum[index].radio[0]"							
							>
							</el-input>
						</dd>
						
					</dl>										
				</div>					
				</section>								
			</article>
        </div>
    </div>
</template>
<script>
import activity from "@/model/activity/activity";
export default {
    data () {
		return {
			item:{},//数据对象
            reflum:[],//当前页面数据
			selList:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T"],
		}
	},
	filters: {
		statusfont:function (val) {
			switch (val) {
				case 'FINISH':
					return '已完成'
					break;
				case 'OVERDUE':
					return '已过期'
					break;
				case 'NOTSTARTE':
					return '未开始'
					break;
				case 'ATTEND':
					return '未完成'
					break;		
				default:
					return ''
					break;
			}
		},
		timerfilter:function(val){
			if(!val){
				return '永久'
			}else{
				return val
			}
		}		
	},
    props:{
        gobacktitle:{
            type:String,
            default:'返回'
        },
    },        
	computed: {
		activityId(){
			return this.$route.query.activityId
		},
		status(){
			return this.$route.query.status
		},
		activity(){
			return this.$route.name
		},
		origin(){
			return this.$route.query.origin
		},	
	},
	created () {
		this.getactivitylist();
	},
	methods: {
		//返回
		goback(){
			this.$router.go(-1);
		},
		//获取资源列表
		getactivitylist(){
			let data={
				activityId:this.activityId
			};
			activity.getpaperdetail(data,(res=>{
				if(res.status==200){
                    this.item=res.data;	
                    this.questionPaperId=res.data.questionPaperId;
					//遍历每一个问卷并增加一个radio作为必选的验证；如果radio没有值则为没选
					let newref=res.data.questions;
					newref.forEach(ele => {
                        this.$set(ele,"radio",[])
                        this.$set(ele,"errstyle",false)											
					});
                    this.reflum=newref;
                    // console.log(this.reflum)
					this.setradio(newref)				
				}
			}))
		},
		setradio(msg){
			// console.log(msg);
			msg.forEach(val=>{
				if(val.type=='SELECT'){
					//单选
					val.optionStatistics.forEach((ele,index) => {
						if(ele.selected==true){
							val.radio=ele.optionContent
						}
					});
				}else if(val.type=='MUILTSELECT'){
					//多选
					val.optionStatistics.forEach((ele,index) => {
						if(ele.selected==true){
							val.radio.push(ele.optionContent)
						}
					});
				}else {
					//主观题				
					if(val.answers){
						val.radio=val.answers;
					}else{
						val.radio=[];
					}
				};				
			})
		},
	},  
}
</script>
<style lang="less" scoped>
@import "../../assets/less/activity.less";
    .estyle{
        color: red;
    }
    .goback{
        width: 1216px;
        margin: 0 auto;
        font-size: 14px;
        color: #666;
        line-height: 50px;
        cursor: pointer;
	}
	.no-goback {
		height: 20px;
	}
	.el-textarea{
		width: 60%;
	}
    .vote_box{
        width: 1216px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 6px;
        border-top: 4px solid #149588;
		position: relative;
		margin-bottom: 30px;
        .x-article{
            .realname{
                    position: absolute;
                    border-top: 4px solid rgba(255, 255, 255, 0);
                    border-top-right-radius:6px; 
                    top: -4px;
                    right: 0;
                    width: 68px;
                    height: 62px;
                    background: url('../../assets/images/activity/shibg.png');
                span{
                    color: #fff;
                    font-size: 16px;
                    display: block;
                    float: right;
                    margin: 4px 4px 0 0;
                }    
			}
			.status{
				position: absolute;
				right: 100px;
				top: 30px;
				button{
					width: 60px;
					height: 30px;
					font-size: 14px;
					color: #727272;
					border:1px solid #cdd0d5;
					background-color: #ffffff;
					border-radius: 3px;
				}
			}
			.x-ques{
				.el-radio{
					display: block;
					margin: 20px 0 0 0;
				}
				.el-checkbox{
					display: block;
					margin: 20px 0 0 0;
				}
			}
			.btn-ora{
				display:block;
				font-size: 16px;
				background-color: #ff8d00;
				color: #fff;
				width: 132px;
				height: 36px;
				line-height: 36px;				
				border-radius: 4px;
				-webkit-transition: all .5s;
				transition: all .5s;
				margin: 0 auto;
			}
			.btn-ora:hover {
				background-color: #e86801;
			}
        }
    }
</style>


