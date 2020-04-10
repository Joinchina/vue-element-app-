<template>
	<div class="w-empty">
		<img src="../../assets/images/index/empty.png">
		<div class="tip">{{tip}}</div>
	</div>
</template>
<script>
	export default{
		props:["tip"],
		data(){
			return{

			}
		},
		methods:{

		}
	}
</script>
<style lang="less" scopped>
	.w-empty{
		background: #FFFFFF;
		box-shadow: 0 0 35px 0 rgba(0,0,0,0.04);
		border-radius: 6px;
		text-align: center;
		padding: 150px 0 200px;
		img {
			display: inline-block;
			width: 162px;
			height: 182px;
		}
		
		.tip{
			margin-top: 15px;
			font-size: 16px;
			color: #666666;
		}
	}
</style>