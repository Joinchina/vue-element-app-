<template>
	<div>
		 <div  class="prism-player" id="J_prismPlayer" style="width:500px;height:400px;"></div>
	</div>
</template>
<script type="text/javascript">
	export default{
		mounted(){
			this.videoPlay();
		},
		methods:{
			videoPlay(){
				 var player = new Aliplayer({
                        id: 'J_prismPlayer',
                        width: '100%',
                        height:"100%",
                        autoplay: true,
                        //支持播放地址播放,此播放优先级最高
                        source : 'rtmp://liveplay.shixunbao.cn/shixunbaodev/10005272?auth_key=1553060708-0-0-c516f6503d527eeb06d923fb7be18b41',
                        },function(player){
                            console.log('播放器创建好了。')
                    });
			}
		}
	}
</script>
<style type="text/css" lang="less">
	
</style>