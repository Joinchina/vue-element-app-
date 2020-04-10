<template>
	<div class="cclist">
		<empty 
			class="empty"
			v-if="emptyFlag"
			:tip="tip"></empty>

		<template v-else>		
			<section class="live" v-if="liveList.length > 0">
				<ul class="clearfix">
					<li class="panel" v-for="(item,index) in liveList" @click="winOPenLive(item)">
						<div class="picbg">
							<i v-if="item.liveRoom.liveStatus=='LIVING'" class="live-ing">直播中</i>							
							<i v-else-if="item.liveRoom.liveStatus=='WAITING'" class="live-not">未开始</i>
							<i v-else class="live-not">已结束</i>
							<!-- <img class="cover" src="../../assets/images/cclive/p1.png" alt=""> -->
							<img class="cover" :src="'/static/img/p'+ ((index+1 > 10) ? ((index+1)%10 ? (index+1)%10 : 10) : (index+1)) +'.png'" alt="">
							<p class="time">{{item.courseDate}}</p>
						</div>
						<p class="person clearfix">
							<img class="headpic" v-if="item.mainTeacher.photo" :src="item.mainTeacher.photo" alt="">
							<img class="headpic" v-else src="../../assets/images/common/default-avatar.png" alt="">
							<el-tooltip class="item" effect="dark" :content="item.mainTeacher.name" placement="bottom-start">
						      	<span class="name">{{item.mainTeacher.name}}</span>
						    </el-tooltip>
							<!-- <span class="duration">30分24秒</span> -->
						</p>
						<p class="desc">{{item.name}}</p>
					</li>					
				</ul>
			</section>

			<section class="playback" v-if="recordList.length > 0">
				<h2 class="title">往期回看</h2>
				<ul class="clearfix">
					<li class="panel" v-for="(item,index) in recordList" @click="winOpen(item)">
					 	<!-- <a target="_blank" :href="'http://stu.shixunbao.cn/static/cc/playback.html?roomId='+item.roomId+'&recordId='+item.recordId+'&liveId='+item.liveId+'&userName='+item.userName+'&userId='+item.userId"> -->
						<div class="picbg">
							<p class="topCover" v-if="item.viewTime!=0"></p>
							<i class="live-review"  v-if="item.recordStatus=='RECORDING'">录制中</i>
							<i class="live-review"  v-else-if="item.recordStatus=='ENCODING'">转码中</i>
							<i class="live-review orange" v-else>已完成</i>
							<span class="reviewTimes" v-if="Boolean(item.viewTime)&&item.viewTime!=0">学习时长：{{item.viewTime|viewTimeFilter}}</span>
														
							<!-- <img class="cover" src="../../assets/images/cclive/p3.png" alt=""> -->
							<img class="cover" :src="'/static/img/p'+ ((index+1 > 10) ? ((index+1)%10 ? (index+1)%10 : 10) : (index+1)) +'.png'" >
							<p class="time">{{item.recordEndTime}}</p>
						</div>
						<p class="person clearfix">
							<img class="headpic" v-if="item.avatar" :src="item.avatar" alt="">
							<img class="headpic" v-else src="../../assets/images/common/default-avatar.png" alt="">
							<el-tooltip class="item" effect="dark" :content="item.mainTeacher.name" placement="bottom-start">
						      	<span class="name">{{item.mainTeacher.name}}</span>
						    </el-tooltip>							
							<span class="duration answer_tit"><i class="el-icon-view"></i>{{item.viewCount}}</span>
						</p>
						<p class="desc">{{item.recordName}}</p>
						<!-- </a> -->
					</li>
					
				</ul>
			</section>

		</template>
		<!-- 视频播放组建	 -->
		<modal :show.sync = "viewVideoShow" contWidth = '80%' bgColor="#53575a" :before-close="videoClose">
			<div slot="body" style="height:100%">
				<video :src="linkUrl" controls="controls"  width="100%" height="100%" id="myVideo">
				您的浏览器不支持video标签
				</video>
			</div>
		</modal>
	</div>
</template>
<script>
import Empty from '@/components/empty/empty'
import CClive from '@/model/CClive/CClive'
import storage from "@/utils/storage"
import Modal from "@/components/modal/modal";
import live from '@/model/live/live';
export default {
	data() {
		return {
			emptyFlag: false,	// 空页面显示
			tip: '还没有直播哦 ~',
			liveList: [],		// 直播列表
			recordList: [],		// 回拨列表
			viewVideoShow:false,
			linkUrl:'',
			settimer: null, //定义定时器
			watchingVideo:"",	//在观看的视频
			timedata: 0,		//学习时长
			hasplay:false,		//正在播放
		}
	},
	computed: {
		clazzId() {
	      	return storage.get("clazzId");
	    },
	},
	filters: {

	},
	created(){
		this.getliveList();
		this.getliveRecordList();
	},
	mounted() {		
		
	}, 
	methods: {
		
		// 获取直播列表
		getliveList() {			
			CClive.getlive(
				{},
				res=> {
					if(res.status == 200) {
						this.liveList = res.data;
						console.log("直播列表",this.liveList)
						this.emptyFn()
					} else {
						this.$message.error(res.message);
					}
				},
				res => {
					this.$message.error("请求错误，请检查网络！");
          			console.log("请求错误", res);
				}
			);
		},

		// 获取回拨列表
		getliveRecordList() {
			CClive.getgolive(
				{},
				res=> {
					if(res.status==200){
						console.log("回顾列表", res.data);
						this.recordList=res.data;
						this.emptyFn();
						this.getHiddenProp();
					}else{
						this.$message.error(res.message);
					}
					
				},
				res => {
					this.$message.error("请求错误，请检查网络！");
          			console.log("请求错误", res);
				}
			);
		},

		emptyFn() {
			if(this.liveList.length == 0 && this.recordList.length == 0) {
				this.emptyFlag = true;
			} else {
				this.emptyFlag = false;
			}
		},

		videoClose() {
			document.getElementById("myVideo").pause();
			this.viewVideoShow = false;
			clearInterval(this.settimer);
			this.getliveRecordList();
			this.hasplay==false;
		},
		winOpen(item) {
			console.log(item)
			live.recordingCount({recordingId:item.id,roomCode: item.roomCode},(res)=>{
				this.viewVideoShow=true;
				this.linkUrl=item.replayUrl;
				this.watchingVideo = item;
				let videoTag=document.getElementById("myVideo");
				videoTag.addEventListener("play",this.videoHasPlay);
				videoTag.addEventListener("pause",this.videopause);
				videoTag.addEventListener("ended",()=>{this.hasplay=false;});                                                                                                           
				
			},(res)=>{
				console.log("学员学习时长上报失败"+res);
			});
		},
		videoHasPlay(){
			clearInterval(this.settimer);
			this.hasplay=true;
            this.timelearn();
		},
		videopause(){
			clearInterval(this.settimer);
			this.recordingLearnTime();
		},
		recordingLearnTime(){
			live.recordingLearn({recordingId:this.watchingVideo.id,roomCode: this.watchingVideo.roomCode,time:this.timedata},(res)=>{
				if(res.status==200){
					//发送成功后this.timedata清零
					this.timedata = 0;
					// this.onlineCourseDetail(); 
					
				}
			},(res)=>{
				console.log("学员学习时长上报失败"+res);
			});
		},
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
                visibilityChange,() => {
					clearInterval(this.settimer)
					if(this.viewVideoShow){
						
						if (document[state] == "visible") {
							if(this.hasplay){
								this.timelearn();
								document.getElementById("myVideo").play();
							};
							// if(this.vedioShow==true){
							//     this.videoplay()
							// }
						} else {                      
							document.getElementById("myVideo").pause();
						}
					}					
                },
            false);
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
					this.recordingLearnTime();
				} else {
					this.timedata = time;
				};

			}, 1000);
		},
		winOPenLive(item) {
			if(item.liveRoom.liveStatus=='LIVING') {
				let data = {
					courseId:item.liveRoom.courseId
				};
				let newWindow = window.open('');
				live.liveLoginOsType(data,(res)=>{
					console.log(res);
					if(res.status == 200){
						if(!!res.data && res.data == "android" || !!res.data && res.data == "ios"|| !!res.data && res.data == "pc"){
							newWindow.close();
							this.$message.error("不支持多设备同时进入直播间");
							return;
						}
						let {href} = this.$router.resolve({
							path:"/live/show",
							query: {clazzId:item.liveRoom.clazzId,courseId:item.liveRoom.courseId}
						});
						// window.open(href, '_blank');
						newWindow.location.href=href;
					}else{
						newWindow.close();
						this.$message.error(res.message);
					}
					
				})
			} else {
				this.$message({
					message: '直播未开始',
					type: 'warning'
				});
			}
			
		}
	},
	filters:{
		viewTimeFilter:function(value){
			if(value<60){
				return value+'秒'
			}else{
				let returnValue ='';
				let minutes = parseInt(value/60);
				let seconds = value%60>9?value%60:"0"+value%60;
				let hours = '';
				returnValue=minutes+"分"+seconds+"秒";
				if(minutes>60){
					hours= parseInt(minutes/60);
					minutes=minutes%60;
					returnValue=hours+"时"+minutes+"分"+seconds+"秒";
				}
				return returnValue
			}
		}	
	},
	components: {
		Empty,
		Modal,
	}
}
</script>
<style lang="less" scoped>
.empty {

	margin-top: 30px;
}
.live,
.playback {
	background: #FFFFFF;
	box-shadow: 0 0 35px 0 rgba(0,0,0,0.04);
	border-radius: 6px;
	padding: 40px 30px;
	margin-top: 30px;
	ul {
		margin-right: -16px;
		margin-bottom: -35px;
	}
	li {
		float: left;
		width: 225px;
		margin-right: 15px;
		margin-bottom: 25px;
		box-sizing: border-box;
		border-radius: 5px;
		padding-bottom: 10px;
		cursor: pointer;

		&:hover {
			box-shadow: 0 8px 10px 0 rgba(51,51,51,0.15);

			.cover {
				transform:scale(1.1,1.1);
			}
		}
	}
}
.playback {
	margin-top: 22px;
	padding-top: 25px;
	.title {
		font-size: 20px;
		line-height: 1em;
		color: #333333;
		border-left: 3px solid #35A69D;
		padding-left: 10px;
		margin-bottom: 25px;
	}
}
.panel {
	>a {
		display: block;
	}
	.picbg {
		width: 225px;
		height: 124px;
		position: relative;
		z-index: 1;
		overflow: hidden;
		border-radius: 5px 5px 0 0;
		
		.topCover{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 40px;
			z-index: 2;
			// box-shadow: 0px 10px 5px #888888 inset;
			background-image: linear-gradient(0deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.7) 100%);
		}
	}
	.cover {
		transition:ease-out .5s
	}
	.live-ing,
	.live-not {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		padding: 5px 8px;
		font-size: 13px;
		line-height: 12px;
		color: #FFFFFF;
		background: #CC3300;
		border-radius: 6px 0 6px 0;
	}
	.live-not {
		background: #CDCDD3;
	}
	.live-review {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		padding: 5px 8px;
		font-size: 13px;
		line-height: 12px;
		color: #1077D7;
		background: rgba(255, 255, 255, 0.67);
		border-radius: 6px 0 6px 0;


	}
	.reviewTimes{
		font-size: 14px;
		color: #F3FF2D;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 2;
		margin-right: 10px;
	}
	.orange {
		color: #ff6c00
	}

	.time {
		position: absolute;
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0.36);
		text-align: right;
		font-size: 12px;
		line-height: 11px;
		color: #FFFFFF;
		padding: 5px 10px;
	}
	.person {
		position: relative;
		z-index: 2;
		padding: 5px 10px;
		line-height: 13px;

		.headpic {
			width: 40px;
			height: 40px;
			border-radius: 20px;
			border: 3px solid #fff;
			margin-top: -20px;
		}
		.name {
			width: 100px;
			height: 14px;
			position: absolute;
			top: 5px;
			left: 55px;
			font-size: 13px;
			line-height: 1em;
			color: #666666;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.duration {
			float: right;
			font-size: 14px;
			line-height: 1em;
			color: #666666;
			letter-spacing: 1px;
			.el-icon-view{
				margin-right: 4px;
			}
		}

	}
	.desc {
		width: 100%;
		height: 53px;
		padding: 5px 10px;
		font-size: 15px;
		color: #333;
		line-height: 1.5em;
		word-break: break-all;

		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
}
.answer_tit .icon-members{
  background: url("../../assets/images/icon/icon-answer-members.png") center center no-repeat;
  background-size:100% 100%;
  vertical-align:text-bottom;
  display: inline-block;
  width: 11px;
  height: 12.8px;
  margin-top:4px;
  margin-right: 4px;
}
</style>