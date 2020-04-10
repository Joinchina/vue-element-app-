<template>
	<div class="activity">
		<!-- <i class="dotred" v-if="tipred"></i> -->
		<ul class="act-list">
			<template  v-for="(item,index) in items" >

			
				<li  v-if="item.type == 'HOMEWORK'">
					<div class="top clearfix" >
						<img src="../../assets/images/liveIcon/icon-act-work.png" alt="">
						<span class="white" ><i class="orange">作业 ({{item.commitCount}}/</i>{{item.totalCount}})</span>
						<a href="javascript:;" class="open" 
							@click = "handleAct('HOMEWORK', item.id)"
							v-if="item.status == 'ATTEND'"
							>做作业</a>
						<a href="javascript:;" class="close" 
							v-else-if="item.status == 'NOTSTARTE'">未开始</a>
						<a href="javascript:;" class="close" 
							v-else-if="item.status == 'OVERDUE'">已过期</a>
						<router-link :to="{path:'/work/viewwork',query:{workId:item.id, origin: 'live' }}" class="close go"  target="_blank"
							v-else-if="item.status == 'FINISH'">已完成</router-link>
					</div>
					<p class="title">{{item.title}}</p>
				</li>
				<li v-if="item.type == 'VOTE'">
					<div class="top">
						<img src="../../assets/images/liveIcon/icon-act-vote.png" alt="">
						<span class="white"><i class="orange">投票 ({{item.commitCount}}/</i>{{item.totalCount}})</span>
						<a href="javascript:;"  class="open" 
							@click = "handleAct('VOTE', item.id)"
							v-if="item.status == 'ATTEND'"
							>去参与</a>
						<a href="javascript:;" class="close" 
							v-else-if="item.status == 'NOTSTARTE'">未开始</a>
						<a href="javascript:;" class="close" 
							v-else-if="item.status == 'OVERDUE'">已过期</a>
						<router-link :to="{path:'/Vote/votedetail',query:{activityId:item.id, status:'FINISH',origin: 'live' }}" class="close go" target="_blank"
							v-else-if="item.status == 'FINISH'">已完成</router-link>
					</div>
					<p class="title">{{item.title}}</p>
				</li>
				<li v-if="item.type == 'QUESTIONNAIRE'">
					<div class="top">
						<img src="../../assets/images/liveIcon/icon-act-ques.png" alt="">
						<span class="white"><i class="orange">问卷 ({{item.commitCount}}/</i>{{item.totalCount}})</span>
						<a href="javascript:;"  class="open" 
							@click = "handleAct('QUESTIONNAIRE', item.id)"
							v-if="item.status == 'ATTEND'"
							>去参与</a>
						<a href="javascript:;" class="close" 
							v-else-if="item.status == 'NOTSTARTE'">未开始</a>
						<a href="javascript:;" class="close" 
							v-else-if="item.status == 'OVERDUE'">已过期</a>

						<router-link :to="{path:'/Question/questiondetail',query:{activityId:item.id, status: 'FINISH',origin: 'live' }}" target="_blank" class="close go" 
							v-else-if="item.status == 'FINISH'">已完成</router-link>
						<!-- <a href="javascript:;" class="close" 
							v-else-if="item.status == 'FINISH'">已完成</a> -->
					</div>
					<p class="title">{{item.title}}</p>
				</li>
				<li v-if="item.type == 'EVALUATION'">
					<div class="top">
						<img src="../../assets/images/liveIcon/icon-act-pj.png" alt="">
						<span class="white"><i class="orange">评价 ({{item.commitCount}}/</i>{{item.totalCount}})</span>
						<a href="javascript:;"  class="open" 
							@click = "handleAct('EVALUATION', item.id)"
							v-if="item.status == 'ATTEND'"
							>去参与</a>
						<a href="javascript:;" class="close" 
							v-else-if="item.status == 'NOTSTARTE'">未开始</a>
						<a href="javascript:;" class="close" 
							v-else-if="item.status == 'OVERDUE'">已过期</a>
						<router-link :to="{path:'/Evaluation/evaluationdetail',query:{activityId:item.id, status: 'FINISH',origin: 'live' }}" target="_blank" class="close go" 
							v-else-if="item.status == 'FINISH'">已完成</router-link>
						
					</div>
					<p class="title">{{item.title}}</p>
				</li>
				<li v-if="item.type == 'INTROSPECTION'">
					<div class="top">
						<img src="../../assets/images/liveIcon/icon-act-fs.png" alt="">
						<span class="white"><i class="orange">反思 ({{item.commitCount}}/</i>{{item.totalCount}})</span>
						<a href="javascript:;"  class="open"  
							@click = "handleAct('INTROSPECTION', item.id)"
							v-if="item.status == 'ATTEND'"
							>去参与</a>
						<a href="javascript:;" class="close" 
							v-else-if="item.status == 'NOTSTARTE'">未开始</a>
						<a href="javascript:;" class="close" 
							v-else-if="item.status == 'OVERDUE'">已过期</a>
						<router-link :to="{path:'/Refl/refldetail',query:{activityId:item.id, status: 'FINISH',origin: 'live' }}" class="close go"  target="_blank"
							v-else-if="item.status == 'FINISH'">已完成</router-link>
					
					</div>
					<p class="title">{{item.title}}</p>
				</li>
			</template>
			
		</ul>

		<!-- 活动开启关闭提示弹出框 -->

		<act-pop
			:popShow.sync = "popShow"
			:actType = "actType"
			:curActId = "curActId"
		></act-pop>


	</div>
</template>
<script>

	import Live from '@/model/live/live'
	import actPop from "@/pages/live/actpop"

	export default {
		data () {
			return {
				items: [],			// 活动列表
				popShow: false,
				curActId: "",		// 当前活动id
				actType: "",	// 活动类型
				tipred: false,		// 红点提示
			}
		},

		props: ["courseId", "controller"],
		mounted() {
			this.getList();
			this.receiveAct();
			this.hintRed();
		},
		destroyed(){
            // this.controller.leavelChannel();
        },
		methods: {
			handleAct(type, actId) {
				this.popShow = false;
				switch(type) {
					case 'HOMEWORK':
						let hurl = this.$router.resolve({
							path:"/work/updatework",
							query:{
								workId:actId,
								origin: 'live'
							}
						})
						window.open(hurl.href, '_blank');
						break;
					case 'VOTE':
						let vurl = this.$router.resolve({
							path:"/Vote/votededit",
							query:{
								activityId: actId,
								status: 'ATTEND',
								origin: 'live'
							}
						})
						window.open(vurl.href, '_blank');
						break;
					case 'QUESTIONNAIRE':
						let qurl = this.$router.resolve({
							path:"/Question/questionedit",
							query:{
								activityId: actId,
								status: 'ATTEND',
								origin: 'live'
							}
						})
						window.open(qurl.href, '_blank');
						break;
					case 'EVALUATION':						
						let eurl = this.$router.resolve({
							path:"/Evaluation/evaluationedit",
							query:{
								activityId: actId,
								status: 'ATTEND',
								origin: 'live'
							}
						})
						window.open(eurl.href, '_blank');					
						break;
					case 'INTROSPECTION':
						let surl = this.$router.resolve({
							path:"/Refl/refledit",
							query:{
								activityId: actId,
								status: 'ATTEND',
								origin: 'live'
							}
						});
						window.open(surl.href, '_blank');
						break;
				}
				
				
			},
			// 接收活动消息
			receiveAct() {
				this.controller.receiveChannelMsgAct((account,uid,msg)=> {
					// console.log("收到信道消息===", account,msg);
					if(account) {
						// 改变活动状态更新数据
						this.getList();
						msg = JSON.parse(msg);
						// 开启活动提示弹出框
						if(msg.command == 'PUBLISH_TASK' && msg.ext.type !== 'ANSWER' && msg.ext.type !== 'SIGN') {

							this.actType = msg.ext.type;
							this.curActId = msg.ext.taskId;

							this.popShow = true;
							// 前端判断红点判断当前活动是否已完成，没完成的，tipred 显示
							// this.hintRed(msg.ext.taskId);

							// 弹出框外挪
							
							this.$emit("actShow", this.popShow);
							
						}
						
					}
					
					
				})
			},
			// 红点提示计算
			hintRed() {
				let data = {
					courseId: this.courseId
				}

				Live.liveCourseRedPoint(data, (res => {
					// console.log("红点状态====", res);
					if(res.status == 200) {
						this.tipred = res.data;
						this.$emit("actDotRed", this.tipred);
					} 
				}))
			},
	

			getList() {
				let data = {
					courseId: this.courseId
				}
				console.log("活动======", data);
				Live.liveCourseActList(data, (res => {
					console.log("活动列表======", res);
					if(res.status == 200) {
						this.items = res.data;
						
						// 作业完成是改变红点状态
						this.hintRed();
						// console.log("直播活动列表============", res);
					} else {
						this.$message.error(res.message);
					}
				}));
			}
		},

		components: {
			actPop,
		}
	}
</script>
<style scoped lang="less">

	.activity {
		height: 60vh;
		overflow-y: auto;
	}
	.act-list {
		width: 100%;
		height: 100%;
		li {
			padding: 12px 20px;
			border-bottom: 1px solid #F9F9FB;
		}
		.top {
			font-size: 16px;
			line-height: 16px;
			margin-bottom: 10px;

			>img {
				display: inline-block;
				width: 24px;
				height: 24px;
				border-radius: 12px;
				vertical-align: -6px;
			}
			.orange {
				color: #08BF8F;
			}
			.white {
				color: #999;
			}
			.open,
			.close {
				float: right;
				font-size: 14px;
				line-height: 14px;
				padding: 5px 13px;
				background-image: linear-gradient(90deg, #FF9E23 2%, #FF6F29 100%);
				border-radius: 14px;
				color: #fff;
			}
			.close {
				background: #E0DFDF;
				cursor: default;
			}
			.go {
				cursor: pointer;
				background: rgba(0,151,145,0.05);
				color: #009791;
			}
		}
		.title {
			font-size: 14px;
			color: #666;
			line-height: 1.5em;

			overflow:hidden; 
			text-overflow:ellipsis;
			display:-webkit-box; 
			-webkit-box-orient:vertical;
			-webkit-line-clamp:2; 
		}
		
	}
	
	
</style>