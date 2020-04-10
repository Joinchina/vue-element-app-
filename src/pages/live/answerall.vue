<template>
	<div class="answerall">
		<tip-modal 
			class="answer-pop"
			:show.sync = "answerAllShow" 
			contWidth = '573px' 
			contHeight = 'auto'
			bgColor="#fff"
			:before-close="close" 
			

			>
			<div slot="header">
				<h1 class="title-box">
					<img src="../../assets/images/liveIcon/icon-line3-left.png" alt="">
					<span class="title">答题器</span>
					<img src="../../assets/images/liveIcon/icon-line3-right.png" alt="">
				</h1>
			</div>

			<div slot="body"  class="contentall">
				<p class="result">
					<span class="mybox">我的答案：<i class="my">{{myAnswer}}</i></span>
					<span>正确答案：<i class="correct">{{result}}</i></span>
				</p>
				<ul class="progress_box">
					<li v-for="(item,index) in options" :key="index" class="clearfix">
                        <h2>{{item.question}}</h2>
                        <div class="progress" >
                            <span :style="{width:(item.people/allpeople*300)+'px',background:color[index]}"></span>
                            
                        </div>  
                        <h3 :style="{color:color[index]}">{{item.people}}</h3>                      
                    </li>
				</ul>
			</div>

		</tip-modal>
	</div>
</template>
<script>
	import TipModal from "@/components/modal/answer-modal"
	import storage from '@/utils/storage'

	export default {
		data() {
			return {
				allpeople: 0,
	            color:["#009791","#4A90E2","#7D70CD","#CF788D","#009791","#4A90E2","#7D70CD","#CF788D"],
	            result:"",
	            questionId: '',
	            options: [],	// 所有答案

	            myAnswer: '',
			}
		},
		computed: {
			
			
		},
		props: ['answerAllShow', 'quesAnswer'],
		watch:{
			quesAnswer:"open"
		},
		mounted() {
		},
		methods: {
			open() {				
				this.allpeople = this.quesAnswer.allpeople;
				this.result = this.quesAnswer.result;
				this.questionId = this.quesAnswer.questionId;
				this.options = this.quesAnswer.options;
				console.log("答题器结果====++++++++", this.options)
				this.my();
			},
			my() {
				
				let answer = storage.get("liveanswer");
				// console.log("取回我的答案===", answer)
				if(answer && this.questionId == answer.id) {
					this.myAnswer = answer.question;
				}
				
			},
			close() {
				this.$emit('update:answerAllShow', false);
			},
			//答题器关闭的时候清除上个答题器的结果
			clearanswer(){
				this.result='';
				this.options=[];
				this.myAnswer='';
			}
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
		
		
	}
	.contentall {
		text-align: center;
	}
	.result {
		font-size: 16px;
		color: #333333;
		line-height: 20px;
		.mybox {
			margin-right: 35px;
		}
		
		.my {
			font-size: 20px;
			color: #333333;
			vertical-align: text-bottom;
		}
		.correct {
			font-size: 20px;
			color: #FD7E23;
			vertical-align: text-bottom;
		}
	}
	.progress_box{
        
        width: 80%;
        overflow: hidden;
        margin: 10px auto;
        li{
        	position: relative;
            width: 100%;
            overflow: hidden;
            margin-top: 26px;

            img{
                float: left;
                max-width:25px;
            }
            h2{
                float: left;
                font-size: 21px;
                color: #333;
                margin-left: 10px;
            }
            .progress{
            	float: left;
                max-width: 365px;
                overflow: hidden;
                margin-left: 14px;
                text-align: left;
                span{
                	display: inline-block;
                    height: 10px;
                    
                    border-radius: 10px;
                    margin-top: 6px;
                   
                }
                
            }
            h3{
				float: left;
				margin-left: 10px;
                font-size: 20px;
                color: #05CDC5;

            }
        }

    }
	
</style>