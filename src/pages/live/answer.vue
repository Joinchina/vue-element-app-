<template>
	<div class="answer">
		<tip-modal 
			class="answer-pop"
			:show.sync = "answerShow" 
			contWidth = '450px' 
			contHeight = 'auto'
			bgColor="#fff"
			:before-close="close" 
			@open="open"
			@update="update"
			>
			<div slot="header">
				<h1 class="title-box">
					<img src="../../assets/images/liveIcon/icon-line3-left.png" alt="">
					<span class="title">答题器</span>
					<img src="../../assets/images/liveIcon/icon-line3-right.png" alt="">
				</h1>
			</div>
			<template v-if="!submitted">
				<div slot="body"  >
					<ul class="tip-txt clearfix">
						<li v-for="item in options" @click = "checkedFn(item.question)">
							<span class="option selected" v-if="checked == item.question" >{{item.question}}</span>
							<span class="option" v-else>{{item.question}}</span>
						</li>
					</ul>
				</div>
				<div slot="footer" class="btn-box">
					
					<a href="javascript:;" v-if="checked" class="btn-sub" @click="submit()">提交</a>
					<a href="javascript:;" v-else class="btn-no">提交</a>
				</div>
			</template>
			<div  slot="body" v-else>
				<p class="answer-box">
					我的选择：<span>{{checked}}</span>
				</p>
				
			</div>
			


		</tip-modal>
	</div>
</template>
<script>
	import TipModal from "@/components/modal/answer-modal"
	import Live from '@/model/live/live'
	import storage from '@/utils/storage'
	import { sendAnswer } from '@/sw/utils/sig';
	import userObj from '@/utils/loginServer'
	export default {
		data() {
			return {
				checked: "",
				submitted: false,		// 已提交的
				answer:0,
			}
		},
		computed:{
			username(){
                return userObj.curname() ? userObj.curname() : this.studentname;
        },
		},
		props: ['answerShow', 'options', 'questionId', 'controller', 'quesClose'],
		mounted() {
			console.log(this.controller)	
		},
		methods: {
			open() {
				if(this.quesClose) {
					this.checked = "";
					this.submitted = false;
				}
				console.log('open');
			},
			update() {
				// 弹出框显示时的内容更新
				console.log('update');
			},
			close() {
				this.$emit('update:answerShow', false);
				this.checked = "";
			},
			checkedFn(option) {
				if(option) {
					this.checked = option;
					console.log("checked === ", this.checked);
				}
			},
			submit() {
				if(this.checked) {
					// 可以提交
					let data = {
						id: this.questionId,
						question: this.checked
					}
					
					Live.liveCourseAnswer(data, (res => {
						
						if(res.status == 200) {
							console.log("提交成功===", res)
							// 发送信道
							this.controller.sendChannelMsg(sendAnswer("ANSWER", data.question,this.username));
							storage.set('liveanswer', data);
							this.submitted = true;
						} else {
							this.submitted = false;
							this.$message.error("res.message");
						}
					}));
					
				} else {
					// 请选择答案
					this.$message.error("请选择答案！");
				}

			},

		},
		components: {
			TipModal
		}
	}
</script>
<style scoped lang="less">
	.answer-pop {
		.title-box {
			text-align: center;
			>img {
				display: inline-block;
				width: 22px;
				height: auto;
				vertical-align: middle;
			}
		}
		.title {
			font-size: 18px;
			color: #FD7E23;
			line-height: 1em;
			margin: 0 10px;
		}
		.tip-txt {
			li {
				width: 25%;
				float: left;
				text-align: center;
				margin-top: 20px;
			}
			.option {
				display: inline-block;
				width: 58px;
				height: 58px;
				border-radius: 58px;
				border: 1px solid #FD7E23;
				font-size: 24px;
				color: #FD7E23;
				padding-top: 12px;
				cursor: pointer;
				transition: all .5s;

				&:hover {
					background: #FD7E23;
					border: 1px solid #FD8129;
					color: #fff;
				}
			}
			.selected {
				background: #FD7E23;
				border: 1px solid #FD8129;
				color: #fff;
			}
		}
		.btn-box {
			text-align: center;
			padding-top: 30px;
			padding-bottom: 10px;
		}
		.btn-no {
			display: inline-block;
			background: #D8D8D8;
			border-radius: 18px;
			padding: 10px 36px;
			font-size: 16px;
			color: #FFFFFF;
			line-height: 16px;

		}
		.btn-sub {
			display: inline-block;
			background-image: linear-gradient(-90deg, #FF9E23 0%, #FF6F29 100%);
			box-shadow: 0 7px 8px 0 rgba(255,123,40,0.39);
			border-radius: 18px;
			padding: 10px 36px;
			font-size: 16px;
			color: #FFFFFF;
			line-height: 16px;
		}

		.answer-box {
			text-align: center;
			font-size: 16px;
			color: #333333;
			line-height: 20px;
			padding: 75px 0;
			>span {
				font-size: 20px;
				color: #009791;
				vertical-align: text-bottom;
			}
		}
		
	}
	
</style>