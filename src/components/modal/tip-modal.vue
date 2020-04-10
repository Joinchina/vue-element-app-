<!-- 子组件 -->
<template>
<transition name="modal">
	<div class="modal-mask" v-show="show">
		<div class="modal-wrapper">
			<div :class="['modal-container', !!mdCont ? mdCont : '']" :style="{ width: contWidth, 'background': bgColor}">
				<i @click="handleClose" class="icon-close"></i>
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
			bgColor: String,
			countDown: Number
			
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
		updated() {
			// if(this.show && Number(this.countDown) > 0) {
			// 	this.countD();
			// }
			
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
			},

			countD() {
				let t;
				let timer = Number(this.countDown)*1000;
				if(timer > 0) {
					console.log("%c 监听========","color:red", timer);
					clearTimeout(t);
					t = setTimeout(()=> {
						this.handleClose();
					}, timer); 
				}
				
			}
		},

		watch: {
			show(val) {
				console.log("%c 监听========","color:red", this.countDown, val);
				if(val) {
					this.$emit('open');
					this.countD();
				}
			},

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
		min-width: 310px;
		width: 310px;
		height: 250px;
		margin: 0 auto;
		padding: 20px;
		background-color: #fff ;
		box-shadow: 0 4px 8px 0 rgba(0,0,0,0.11);
		border-radius: 10px;
		transition: all .3s ease;
		font-family: Helvetica, Arial, sans-serif;
		

		.icon-close {
			display: block;
			width: 16px;
			height: 16px;
			background: url("../../assets/images/liveIcon/tip-close.png") center center no-repeat;
			background-size: 100% 100%;
			overflow: hidden;
			text-indent: -999px;
			position: absolute;
		    right: 12px;
		    top: 12px;
		    cursor: pointer;

		}
	}

	.modal-header h3 {
		margin-top: 0;
		color: #42b983;
	}

	.modal-body {
		padding: 20px 0;
	    overflow: auto;
	}

	.modal-default-button {
		float: right;
	}
}


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