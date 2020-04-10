<template>
    <div class="progress_3">
        <el-progress type="circle" 
        :percentage="num"
        :stroke-width="6"
        :width="146"
        :color="colorset"
        >
        </el-progress>               
    </div>
</template>
<script>
export default {
    data(){
        return {
            num:0,
           colorset:'#02B2C7',                          
        }
    },
    watch: {
        proGress: function(newVal,oldVal){
            console.log(newVal)
            this.num = Number((newVal*100).toFixed(2));  //小数*100，取两位
            console.log(this.num)
        }
    },
    props:['proGress'],
   
}
</script>
<style lang="less" >
.progress_3{
    width:146px;
    height: 146px;
    display: block;
    top: 28px;
    left: 80px;
    position: absolute;           
    border-radius: 50%;
    // background-color: #39CAA6;
    // background-image: -webkit-linear-gradient(top, #39CAA6, #02B2C7); 
    .el-progress--circle{
       .el-progress__text{
           font-size: 34px!important;
            color: #02B2C7;
       }   
    } 
    
}
</style>


