<template>
    <div class="z-content">
        <div class="fl_box">
            <div class="decoration">
                <span class="img_1"><img src="../../assets/images/livezan/live3.png" alt=""></span>
                <span class="img_2"><img src="../../assets/images/livezan/live4.png" alt=""></span>
                <span class="img_3"><img src="../../assets/images/livezan/live5.png" alt=""></span>
                <span class="img_4"><img src="../../assets/images/livezan/live6.png" alt=""></span>
                <span class="img_5"><img src="../../assets/images/livezan/live7.png" alt=""></span>
                <span class="img_6"><img src="../../assets/images/livezan/live8.png" alt=""></span>
                <span class="img_7"><img src="../../assets/images/livezan/live9.png" alt=""></span>
                <span class="img_8"><img src="../../assets/images/livezan/live10.png" alt=""></span>
                <span class="img_9"><img src="../../assets/images/livezan/live11.png" alt=""></span>
                <span class="img_10"><img src="../../assets/images/livezan/live12.png" alt=""></span>
            </div>
            <div class="vant">
                <img src="../../assets/images/livezan/live14.png" alt="">
            </div>
            <div class="font">
                <img src="../../assets/images/livezan/live13.png" alt="">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    mounted(){
        this.animatemove()
    },
    methods:{
        animatemove(){
            setTimeout(()=>{
                $(".fl_box").animate({top:"2vh",left:"90%",opacity:0},400)
                setTimeout(()=>{
                     this.$emit("showfl")
                },400)               
            },1400)
            
        }
    },
}
</script>
<style lang="less" scoped>
.z-content{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    img{
        max-width: 100%;
    }
    span{
        display: block;
    }
    .fl_box{
        width: 300px;
        height:300px;
        position: absolute;
        top: 15vh;
        left: 50%;
        margin-left: -150px;
        opacity: 1;
        .decoration{
            width: 100%;
            .img_1{
                width: 6px;
                height: 10px;
                position: absolute;
                top: 52px;
                left: 29px;
                animation: anisui2 2s ease-out 1;                
            }
            .img_2{
                width: 10px;
                height: 10px;
                position: absolute;
                top: 63px;
                left: 70px;
                animation: anisui2 1.8s ease-out 1;                 
            }
            .img_3{
                width: 14px;
                height: 12px;
                position: absolute;
                top: 85px;
                left: 45px;
                animation: anisui2 1.6s ease-out 1;                 
            }
            .img_4{
                width: 22px;
                height: 32px;
                position: absolute;
                top: 114px;
                left: 15px;
                 animation: anisui2 1.5s ease-out 1;                 
            }
            .img_5{
                width: 8px;
                height: 9px;
                position: absolute;
                top: 162px;
                left: 15px;
                animation: anisui2 1.4s ease-out 1;                 
            }
            .img_6{
                width: 10px;
                height: 10px;
                position: absolute;
                top: 180px;
                left: 58px;
                animation: anisui2 1.3s ease-out 1;                 
            }
            .img_7{
                width: 12px;
                height: 12px;
                position: absolute;
                top: 76px;
                right: 48px;
                animation: anisui 0.8s ease-out 1;                 
            }
            .img_8{
                width: 7px;
                height: 12px;
                position: absolute;
                top: 94px;
                right: 20px;
                animation: anisui 0.6s ease-out 1;                  
            }
            .img_9{
                width: 10px;
                height: 11px;
                position: absolute;
                top: 132px;
                right: 37px;
                animation: anisui 0.4s ease-out 1;                  
            }
            .img_10{
                width: 16px;
                height: 22px;
                position: absolute;
                top: 180px;
                right: 49px;
                animation: anisui 0.4s ease-out 1;                  
            }
            @keyframes anisui {
                0%{
                    transform:translateY(-1000px);  
                }                
                100%{
                    transform:translateY(0); 
                }
            }
            @keyframes anisui2 {
                0%{
                    transform:translateY(-1000px);  
                }
                50%{
                    transform:translateY(0px); 
                }
                75%{
                    transform:translateY(-4px);
                }               
                100%{
                    transform:translateY(0); 
                }
            }
        }
        .vant{
            width: 166px;
            height: 166px;
            position: absolute;
            top:55px;
            left:67px;
            animation: anitop 1s cubic-bezier(0.5,0.2,0.5,1) 1;
        }
        @keyframes anitop {
             0%{
                transform:translateY(-1000px);  
            }
            50%{
                transform:translateY(0px); 
            }
            75%{
                transform:translateY(-30px);
            }
            100%{
                transform:translateY(0); 
            }
        }
        .font{
            width: 279px;
            height: 37px;
            position: absolute;
            bottom: 0;
            left:10px;
            animation: anibottom 1s cubic-bezier(0.5,0.2,0.5,1) 1;
        }
        @keyframes anibottom {
            0%{
                transform:translateX(-1000px);  
            }
            50%{
                transform:translateX(0px); 
            }
            75%{
                transform:translateX(-30px);
            }
            100%{
                transform:translateX(0); 
            }
        }
    }
}
</style>
