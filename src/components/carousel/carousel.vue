<template>
	<div>
		<el-dialog
			custom-class="carousel"
			:visible.sync="carouselVisible"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open"
			>
		</el-dialog>
		

		<el-carousel :autoplay="false" arrow="never">
			<el-carousel-item v-for="item in 4" :key="item">
				<h3>{{item}}</h3>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				
			};
		},
		props: {
			carouselVisible: Boolean,
			items: Array
		},
		computed: {

		},
		methods: {
			open() {

			},
			close() {
				this.$emit('update: carouselVisible', false);
			}
		}
	}
</script>
<style scoped lang="less">
.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
}
  
.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}
  
.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
</style>