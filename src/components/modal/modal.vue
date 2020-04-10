<!-- 子组件 -->
<template>
<transition name="modal">
	<div class="modal-mask" v-show="show">
		<div class="modal-wrapper">
			<div :class="['modal-container', !!mdCont ? mdCont : '']" :style="{ width: contWidth, height: contHt, 'background-color': bgColor}">
				<i @click="handleClose" class="icon-close">X</i>
				<div class="modal-header">
					<slot name="header">
						
					</slot>
				</div>

				<div class="modal-body" >
					<slot name="body">
						
					</slot>
				</div>
				
				<div class="modal-footer">
					<slot name="footer">
						
					</slot>
				</div>

			</div>
		</div>
	</div>
</transition>
</template>

<script>
	export default {
		props: {
			show: Boolean,
			contWidth: [String, Number],
			contHeight: [String, Number],
			beforeClose: Function,
			mdCont: String,
			bgColor: String
			
		},
		computed: {
			contHt () {
				let h = window.screen.availHeight;
				   	h = h*0.8+'px'
				    
				return this.contHeight ? this.contHeight : h;
			},
			
		},
		created() {
			
		},
		methods:{
			handleClose() {
				if(typeof this.beforeClose === 'function') {
					this.beforeClose(this.close);
					this.$emit('cleartimer', this.show); 
				} else {
					this.close();
					this.$emit('cleartimer', this.show);
				}
			},

			close() {
				this.$emit('update:show', false)
			}
		}
		
	}
</script>

<style lang="less" scoped>
.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,.5);
	display: table;
	transition: opacity .3s ease; 
}

.modal-wrapper {
	display: table-cell;
	vertical-align: middle;

	.modal-container {
		position: relative;
		min-width: 300px;
		width: 60%;
		height: auto;
		margin: 0 auto;
		padding: 20px;
		background-color: #fff;
		border-radius: 2px;
		box-shadow: 0 2px 8px rgba(0,0,0, .33);
		transition: all .3s ease;
		font-family: Helvetica, Arial, sans-serif;
		

		.icon-close {
			display: block;
			width: 28px;
			height: 28px;
			background: url("img/icon-close.png") center center no-repeat;
			background-size: 100% 100%;
			overflow: hidden;
			text-indent: -999px;
			position: absolute;
		    right: 5px;
		    top: 5px;

		}
	}

	.modal-header h3 {
		margin-top: 0;
		color: #42b983;
	}

	.modal-body {
		padding: 20px 0;
	    height: 100%;
	    overflow: auto;
	}

	.modal-default-button {
		float: right;
	}
}

// transition="modal"
.modal-enter {
	opacity: 0;
}
.modal-leave-active {
	opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
	transform: scale(1.1);
}
</style>