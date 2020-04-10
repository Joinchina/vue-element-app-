<template>
	<div class="playback">
		<!-- header -->
		<v-head></v-head>
		<!-- /header -->
		
		<!-- middle start -->
		<div class="video-middle" id="video-middle">
		    
		    <div class="video-m-top" id="doc-main" data-module="1">
		        <div class="document-main">
					<!-- 回放视频模块 -->
		            <div id="playbackPlayer"></div>
		            <!-- 回放视频模块 -->
		            <div id="playbackPanel"></div>

		        </div>
		    </div>
		    <div class="l-m-b">
		        <div class="progress-box" id="progress-box">
		            <div class="background" id="background"></div>
		            <div class="buffer" id="buffer"></div>
		            <div class="progress" id="progress"></div>
		            <span class="dot" id="dot"></span>
		        </div>
		        <div class="controls">
		            <div class="left">
		                <div class="play">
		                    <a href="javascript:void(0);" class="btn-play" title="播放" id="btn-play"></a>
		                </div>
		                <div class="time">
		                    <span>00:00</span>/<span>00:00</span>
		                </div>
		                <div class="volume">
		                    <a href="javascript:void(0);" class="btn-volume" title="静音" id="btn-volume"></a>
		                </div>
		                <div class="volume-slider" id="volume-slider">
		                    <div class="v-progress" id="v-progress"></div>
		                    <div class="v-dot" id="v-dot"></div>
		                </div>
		            </div>
		            <div class="right">
		                <ul class="tools">
		                    <li class="rate" id="rate">
		                        <a href="javascript:void(0);" title="倍速" class="btn-rate" id="btn-rate">正常</a>
		                    </li>
		                    <li class="switch">
		                        <a href="javascript:void(0);" title="切换窗口" class="btn-switch" id="btn-switch"></a>
		                    </li>
		                    <li class="fullscreen">
		                        <a href="javascript:void(0);" title="网页全屏" class="btn-fullscreen" id="btn-fullscreen"></a>
		                    </li>
		                </ul>
		                <ul class="select" id="select">
		                    <li value="0"><a href="#">0.8X</a></li>
		                    <li value="1"><a href="#">正常</a></li>
		                    <li value="2"><a href="#">1.25X</a></li>
		                    <li value="3"><a href="#">1.5X</a></li>
		                    <li value="4"><a href="#">2.0X</a></li>
		                </ul>
		            </div>
		        </div>

	    	</div>
		</div>
		<!-- middle end -->

		<!-- right start -->
		<div class="video-right live-right" id="video-right">
		    <div id="right-bar" class="right-bar">
		        <span id="right-switch" class="bar-switch right-icons"></span>
		    </div>
		    <div class="chat-main">
		        <div class="chat-title">
		            <h2><i></i><span>公共聊天区</span></h2>
		        </div>
		        <div class="chat-list l-r-m">
		            <ul id="chat-list" class="chat-list l-r-m-list" style="top: 0px;">
		            </ul>
		        </div>
		    </div>
		</div>
		<!-- right end -->
	</div>
</template>

<script>

import vHead from '@/pages/header/header'
import storage from '@/utils/storage'

export default {
    data(){
        return{
        	roomId: storage.session.get('wroomId'),
        	recordId: storage.session.get('wrecordId'),
        	replayUrl: storage.session.get('wreplayUrl'),
        	liveId: storage.session.get('wliveid')
        }
    },
    created(){

        //判断是否为登录状态 
        let token_users = storage.get("token_users");
        let auth = storage.get("auth");
        let userId = storage.get("userId");

        if(!token_users && !auth && !userId){
            this.$router.push("/login");
        }

    },
    mounted() {
    	// require('../../../static/cc/js/ui.js');
    	// document 加载完成后执行
    	require('../../../static/cc/js/callback.pc.extend.js');
    	this.ccView();

    },
    methods: {
   //  	getInfor() {
   //  		let roomId = storage.session.get('wroomId'),
   //  			recordId = storage.session.get('wrecordId'),
			// 	replayUrl = storage.session.get('wreplayUrl');

			// console.log(roomId, recordId, replayUrl );
   //  	},
    	ccView() {
    		console.log("cclive", this.roomId, this.recordId);
    		$.DW.config({
		       userId: '87507F61AF96530B',
		       roomId: this.roomId,
		       recordId: this.recordId,
		       viewername: '',
		       viewertoken: '',
		       isH5play:true,
		       fastMode:true
		   });
    	},
    },
    components:{
        vHead
    }
}
</script>
<style scoped lang="less">
@import '../../assets/cc/css/indexme.css';
html, body {
    height: 100%;
    overflow-x: auto;
}

.chat-main, .document-main {
    background: #fff;
}

@media (max-width: 1200px) {
    body {
        width: 1200px;
        margin: 0 auto;
        position: relative;
        background: #ddd;
        box-shadow: 0 0 10px 2px #ccc;
    }
}

@media (min-width: 1600px) {
    body {
        width: 1400px;
        margin: 0 auto;
        position: relative;
        background: #ddd;
        box-shadow: 0 0 10px 2px #ccc;
    }
}


.live-right .l-r-m, .question-main {
    bottom: 0
}


#callbackPanel, #callbackPanel img {
    width: 100%;
    height: 100%;
}

#playbackPlayer {
	width: 100%;
	height: 100%;
}
</style>