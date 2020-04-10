<template>
    <div class="z-content">
        <v-head></v-head>
        <activity :gobacktitle="goback_title"></activity>
    </div>
</template>
<script>
import vHead from '@/pages/header/header';
import activity from "@/components/activity/view";
export default {
	data () {
		return {
			goback_title:'当前：评价详情'			
		}
	},
	
	created () {
		
	},
	methods: {
		
	},
	components: {
		vHead,
		activity,
	}  
}
</script>

<style lang="less" scoped>
@import "../../assets/less/activity.less";
.z-content{
    width: 100%;
    overflow: hidden;
}
</style>


