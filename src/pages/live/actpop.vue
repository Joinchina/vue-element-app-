<template>
	<div>
		<tip-modal 
			class="tip-pop"
			:show.sync = "popShow" 
			contWidth = ''
			:countDown = '60' 
			:beforeClose = 'close'
			:bgColor="bg" 
			>
			<div slot="header">
				<img v-if="actType == 'VOTE'" class="top-img" src="../../assets/images/liveIcon/tip-vote.png" alt="">
				<img v-if="actType == 'QUESTIONNAIRE'" class="top-img" src="../../assets/images/liveIcon/tip-ques.png" alt="">
				<img v-if="actType == 'HOMEWORK'" class="top-img" src="../../assets/images/liveIcon/tip-work.png" alt="">
				<img v-if="actType == 'EVALUATION'" class="top-img" src="../../assets/images/liveIcon/tip-pj.png" alt="">
				<img v-if="actType == 'INTROSPECTION'" class="top-img" src="../../assets/images/liveIcon/tip-fs.png" alt="">
			</div>
			<div slot="body"  class="tip-txt">
				<p>管理者发布了<span class="green">{{actType | typeName}}活动</span></p>
				<p>是否去参与？</p>
			</div>
			<div slot="footer" class="btn-box">
				<a href="javascript:;" class="golink" @click="handleAct(actType, curActId)">去参与</a>
			</div>
		</tip-modal>
	</div>
</template>
<script>
import TipModal from "@/components/modal/tip-modal"
	import storage from '@/utils/storage'
	export default {
		data() {
			return {

			}
		},
		props: ["actType", "popShow", "curActId"],
		filters: {
			typeName(value) {
				let name = "";
				switch(value) {
					case 'HOMEWORK':
						name = "作业"
						break;
					case 'VOTE':
						name = "投票"
						break;
					case 'QUESTIONNAIRE':
						name = "问卷"
						break;
					case 'EVALUATION':
						name = "评价"
						break;
					case 'INTROSPECTION':
						name = "反思"
						break;
				}

				return name;
			},
			
		},
		computed:{
			bg() {
				let color = "";
				switch(this.actType) {
					case 'HOMEWORK':
						color = "linear-gradient(-180deg, #B3FDFC 0%, #FFFFFF 61%)"
						break;
					case 'VOTE':
						color = "linear-gradient(-180deg, #FDEEB3 0%, #FFFFFF 61%)"
						break;
					case 'QUESTIONNAIRE':
						color = "linear-gradient(-180deg, #B3FDFC 0%, #FFFFFF 61%)"
						break;
					case 'EVALUATION':
						color = "linear-gradient(-180deg, #FDD0B3 0%, #FFFFFF 61%)"
						break;
					case 'INTROSPECTION':
						color = "linear-gradient(-180deg, #FDEEB3 0%, #FFFFFF 61%)"
						break;
				}

				return color;
			}
		},
		methods: {
			close() {
				this.$emit('update:popShow', false);
			},
			handleAct(type, actId) {
				let islivestatus=storage.get("livestatus")
				this.close();
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
					//当前评价是否做过，
					console.log("评价");
					console.log(islivestatus);
						if(!!islivestatus&&islivestatus.status=="FINISH" && !!islivestatus&&islivestatus.id==actId){
							let eurl = this.$router.resolve({
								path:"/Evaluation/evaluationdetail",
								query:{
									activityId: actId,
									status: 'FINISH',
									origin: 'live'
								}
							})
							window.open(eurl.href, '_blank');
						}else{
							let eurl = this.$router.resolve({
								path:"/Evaluation/evaluationedit",
								query:{
									activityId: actId,
									status: 'ATTEND',
									origin: 'live'
								}
							})
							window.open(eurl.href, '_blank');
						}	
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
		},
		components: {
			TipModal
		}
	}
</script>
<style scoped lang="less">
.tip-pop{
	.top-img {
		width: auto;
		height: 100px;
		position: absolute;
		top: -50px;
		left: 50%;
		margin-left: -61px;
	}
	.tip-txt {
		margin-top: 50px;
		font-size: 18px;
		color: #171717;
		line-height: 1.6em;
		text-align: center;
	}
	.green {
		color: #009791;
	}
	.golink {
		display: inline-block;
		background-image: linear-gradient(-90deg, #FF9E23 0%, #FF6F29 100%);
		box-shadow: 0 7px 8px 0 rgba(255,123,40,0.39);
		border-radius: 18px;

		font-size: 16px;
		color: #FFFFFF;
		line-height: 1em;
		padding: 10px 27px;
	}
	.btn-box {
		text-align: center;
		padding-top: 20px;
	}
}
</style>