<template>
    <div>
        <div class="goback" v-if="origin != 'live'" @click="goback">
    		<span> <img src="../../assets/images/icon/icon-goback.png" alt="">
            返回 {{gobacktitle}}</span>
        </div>
        <div class="no-goback" v-else></div>
        <div class="vote_box">
            <article class="x-article">
				<div class="realname" v-show="activity=='questionEdit'">
					<span v-if="item.realNameFlag==true">实名</span>
					<span v-else>匿名</span>
				</div>
				<div class="status">
					<button>{{isstatus | statusfont}}</button>
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
								{{val.question}}（单选题）（必答）
								</span>
								<span class="type" v-else>
								{{val.question}}（单选题）（选答）
								</span>
							</h2>
						</dt>
						<dd >
							<el-radio-group v-model="reflum[index].radio">
								<el-radio  v-for="(radio,index1) in val.optionStatistics" :key="index1" :label="radio.optionContent">{{selList[index1]}}{{radio.optionContent}}</el-radio>								
							</el-radio-group>				
						</dd>
						
					</dl>
					<!-- 多选 -->
					<dl  v-if="val.type=='MUILTSELECT'">
						<dt>
							<h2 :class="{'estyle':val.errstyle}">
								<span class="q" >Q{{index+1}}</span>
								<span class="type" v-if="val.required==true">
								{{val.question}}（多选题）（必答）
								</span>
								<span class="type" v-else>
								{{val.question}}（多选题）（选答）
								</span>
							</h2>
						</dt>
						<dd >
							<el-checkbox-group v-model="reflum[index].radio">
								<el-checkbox v-for="(radio,index2) in val.optionStatistics" :key="index2" :label="radio.optionContent">{{selList[index2]}}{{radio.optionContent}}</el-checkbox>								
							</el-checkbox-group>
						</dd>
						
					</dl>
					<!-- 问答 -->
					<dl v-if="val.type=='SUBJECTIVE'">
						<dt>
							<h2 :class="{'estyle':val.errstyle}">
								<span class="q" >Q{{index+1}}</span>
								<span class="type" v-if="val.required==true">
								{{val.question}}（问答题）（必答）
								</span>
								<span class="type" v-else>
								{{val.question}}（问答题）（选答）
								</span>
							</h2>
						</dt>
						<dd >
							<el-input
							type="textarea"
							:rows="6"
							v-model="reflum[index].radio[0]"													
							>
							</el-input>
						</dd>
						
					</dl>										
				</div>					
				</section>
				<button type="button" class="btn-ora" @click="btnclick">提交</button>				
			</article>
        </div>
    </div>
</template>
<script>
import activity from "@/model/activity/activity";
import API from '@/fetch/api'
import { getToken } from '@/utils/common'
import axios from 'axios'
import storage from '@/utils/storage'
export default {
    data () {
		return {
			item:{},//数据对象
            reflum:[],//当前页面数据
            errdata:[],//错误的数据
            questionPaperId:'',
			selList:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T"],
			isstatus:'',
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
		
		this.isstatus=this.status;		
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
                    // console.log(res.data)
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
				}
			}))
		},
		btnclick(){
            // console.log(this.reflum);
            /*
            *提交表单验证，如果题目是必选题，没有radio属性，
			*则将当前题目标红，并且在tost提示第一个问题，
			*如果是问答题超过1000字则提示qn超过1000字
            */ 
            this.errdata=[];
            this.reflum.forEach((val,index)=>{			
				console.log(val);					
				if(val.required==true && (val.radio.length==0||val.radio[0].trim()=="")){
					// console.log("111",val)
					this.$set(val,'errstyle',true);
					this.errdata.push(index+1);
					this.$message.error('请完成必答题Q'+this.errdata[0]+'');               
				}else{
					this.$set(val,'errstyle',false)
				};
				this.morefont(val,index)                               
			});			
            //全部验证通过
            // console.log(this.reflum)
            if(this.errdata.length==0){
				// console.log("111",this.reflum)
                let answerArr=[];                
                for (let i = 0; i < this.reflum.length; i++) {
                    let numberobj={};
                    let answerkey=[];
					//必答题
					if(this.reflum[i].type=='SUBJECTIVE'){
						//问答题
						numberobj.answer=this.reflum[i].radio;
						numberobj.type=this.reflum[i].type;
						answerArr.push(numberobj)
					}else if(this.reflum[i].type=='MUILTSELECT'){
						//多选题
						this.reflum[i].optionStatistics.forEach((val,index) => {
							this.reflum[i].radio.forEach(ele=>{
								if(ele==val.optionContent){
									answerkey.push(index)
								}
							})
							
						});
						numberobj.answer=answerkey;
						numberobj.type=this.reflum[i].type;
						answerArr.push(numberobj)
					}else{
						//单选题
						this.reflum[i].optionStatistics.forEach((val,index) => {
							if(this.reflum[i].radio==val.optionContent){
								answerkey.push(index)
							} 
						});
						numberobj.answer=answerkey;
						numberobj.type=this.reflum[i].type;
						answerArr.push(numberobj)
					}                                                                
                }  
                //   console.log(answerArr)            
                let passdata={
                        'questionPaperId':this.questionPaperId,
                        'answers':answerArr,
				}; 
				              
                axios({
                    method: 'post',
                    url: API.urls.addquestionanswer,
                    data:JSON.stringify(passdata),
                    headers:{
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': 'application/json;charset=UTF-8',
                        'Authorization': getToken()
                    }
                }).then(res=>{
                    if(res.status==200){
						// console.log(res.data)
						if(res.data.message){
							this.$message.error(res.data.message);	
						}else{
							this.$message({
								message: '发布成功',
								type: 'success'
							});
							if(this.origin=="live"&&this.item.type=="VOTE"){
								this.$router.push({path:'/Vote/votedetail',query:{activityId:this.item.activityId, status:'FINISH',origin: 'live' }});
								return
							}
							//存储一个活动id和状态,用来判断直播间知否已经提交过了当前评价
							let livestatus={
								status:"FINISH",
								id:this.activityId,
							};
							storage.set("livestatus",livestatus);

							this.isstatus="FINISH"
							console.log(storage.get("livestatus"));
							this.goback()	
						}											                       
                    }else{
						this.$message.error(res.message);
					}
                }).catch(error=> {
                    console.log(error);
                });
            }                        
		},
		morefont(val,index) {
			if(val.type=='SUBJECTIVE' && val.radio.length>0){
				// console.log(val.radio[0].length)
				if(val.radio[0].length>1000){
					this.$set(val,'errstyle',true);
					this.errdata.push(index+1);
					this.$message.error('Q'+this.errdata[0]+'最多输入1000字'); 
				}
			}
		}		
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


