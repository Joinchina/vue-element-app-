<template>
	<div class="j-empty">
		<img src="../../assets/images/index/empty.png">
		<div class="no">{{notext}}</div>
	</div>
</template>
<script>
	export default{
		props:["notext"],
		data(){
			return{

			}
		},
		methods:{

		}
	}
</script>
<style lang="less" scopped>
	.j-empty{
		width: 174px;
		height: 192px;
		margin:20% auto 0 auto;
		text-align: center;
		.no{
			margin-top: 15px;
			font-size: 16px;
			font-weight: bold;
		}
	}
</style>