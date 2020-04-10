<template>
	<div>
		 <!--讨论组-->
        <ul class="tab clearfix">
            <!-- <li :class="{'cur':curIndex == }" @click="tabSwitch">讨论</li>
            <li @click="tabSwitch">活动</li>
            <li @click="tabSwitch">成员</li> -->
            <li :class="{'cur':nowIndex === index}" v-for="(item,index) in tabData" @click="tabSwitch(index)">
            	{{item}}
            </li>
        </ul>
        <div class="clearfix"></div>

         <!--讨论组内容-->
        <section class="discuss" v-show="nowIndex===0">

            <div class="title">
                <span class="horn"></span>
                <span class="yellow">公告：</span> 
                <span class="text">直播还有5分钟开始</span>
            </div>

            <div class="con">

                <!--系统消息-->
                <div class="sys">
                    系统消息：欢迎来到直播间。请各位老师认真听讲课积极发言。配合老师完成教学。同时禁止发送任何违法、违规、低俗等不良信息行为。
                </div>

                <!--进入直播间-->
                <div class="comin">
                    王嘉尔进入直播间
                </div>

                <!--聊天-->
                <div class="chat">
                    <ul>
                        <li>
                            <span class="icon-identity">班主任</span>
                            <span class="name">王家平</span>
                            <div>同学们认真听讲</div>
                        </li>
                    </ul>
                </div>

                <!--聊天-->
                <div class="chat">
                    <ul>
                        <li>
                            <span class="icon-identity">助教</span>
                            <span class="name">贾君彦</span>
                            <div>同学们认真听讲</div>
                        </li>
                    </ul>
                </div>

                <!--申请连线-->
                <div class="apply-connect">
                    王家平申请连线
                </div>


                <!--公告-->
                <div class="title title-none">
                    <span class="horn"></span>
                    <span class="yellow">公告：</span> 
                    <span class="text">直播还有5分钟开始</span>
                </div>

            </div>

            <!--发送信息-->
            <section class="sendMsg">

                <div class="clearfix">
                    <div class="tab">
                       <span class="dis">聊天</span> to:

                       <el-dropdown size="mini" split-button type="primary" class="button-live">
                          所有人
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>黄金糕</el-dropdown-item>
                            <el-dropdown-item>狮子头</el-dropdown-item>
                            <el-dropdown-item>螺蛳粉</el-dropdown-item>
                            <el-dropdown-item>双皮奶</el-dropdown-item>
                            <el-dropdown-item>蚵仔煎</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="tab-rg">
                       公告
                    </div>
                </div>

                <div class="textareaBg">
                    <el-input
                      type="textarea"
                      :rows="3"
                      placeholder="请输入"
                      v-model="textarea">
                    </el-input>

                    <div>
                        <a href="#" class="icon-cancel">取消禁言</a>
                        <a href="javascript:void(0)" class="icon-send" @click="sendChannelMsg">发送</a>
                    </div>
                </div>
            </section>
            
        </section>

        <section class="staff"  v-show="nowIndex===1">
        	活动
        </section>

        <!--********************************************学员*************************************************-->

        <section class="staff"  v-show="nowIndex===2">
            <header class="title">

                <div class="right">
                    登录学员<span class="yellow">33/</span>66


                </div>
                <div class="left">
                    连线

                    <el-switch
                      v-model="switchs"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>

                </div>

            </header>

            <el-input class="search-name" v-model="search" placeholder="搜索"></el-input>

            <ul class="list">
                <li>
                    <span class="icon-host"></span>
                    <span class="icon-name">王家平</span>
                </li>
                 <li>

                    <span class="icon-assistant"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg on-line">
                        连线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>

                 <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg off-line">
                        下线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>

                 <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg connect">
                        接通
                    </span>

                    <el-dropdown class="status">
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>
                <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg off-line">
                        下线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>
                <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg off-line">
                        下线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>
                <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg off-line">
                        下线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>
                <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg off-line">
                        下线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>
                <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg off-line">
                        下线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>
                <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg off-line">
                        下线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>
                <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg off-line">
                        下线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>
                <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg off-line">
                        下线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>
                <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg off-line">
                        下线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>
                <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg off-line">
                        下线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>
                <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg off-line">
                        下线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>
                <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg off-line">
                        下线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>
                <li>

                    <span class="icon-host"></span>

                    <span class="icon-name">小公主</span>

                    <span class="linebg off-line">
                        下线
                    </span>

                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>禁言</el-dropdown-item>
                        <el-dropdown-item>踢出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                </li>
            </ul>
        </section>



	</div>
</template>
<script>

	export default{

		created(){

		},

		data(){
			return{
				textarea:"",  //请输入内容
                switchs:"",
                search:"",

                nowIndex:0,
                tabData:["讨论","活动","学员"]
			}
		},
		methods:{
			tabSwitch(index){

				this.nowIndex = index;
			},

			//发送频道消息
             sendChannelMsg(){

                this.$emit("sinalSend",this.textarea);
             },
		},
	}
</script>
<style scoped="" lang="less">
.singalBox{
    
    .tab{

        border-bottom: 1px solid rgba(255,255,255,0.05);
        height: 5.3vh;
        line-height: 5.3vh;
        color: #ccc;
        font-size: 14px;

        .dis{
            margin-right: 3%;
        }

        li{
            
            float: left;
            width: 20%;
            margin:0 5%;
            text-align: center;
            transition: .2s;

        }

        .cur{
            font-size: 18px;
            border-bottom:3px solid #1AAB8E;
            color: #1AAB8E;
        }

    }

    .discuss{
        .title{
            background: #2e4567;
            height: 4.5vh;
            font-size: 14px;
            line-height: 4.5vh;
            padding-left: 16px;
            .horn{
                display: inline-block;
                width: 10px;
                height: 13px;
                background-image: url(../../assets/images/liveIcon/horn.png);
                background-position: center center;
                background-size: 10px 13px; 
                background-repeat: no-repeat;
                vertical-align:middle;
            }
            .text{
                color: #fff;
            }

            .yellow{
                color: #F8E71C;
            }
        }

        .title-none{
            background: none;
        }

        .con{
            padding:10px 20px 0 15px;
            line-height: 18px;
            font-size: 14px;
            .sys{
                color:#FFBF55;
                line-height: 18px;
            }
            .comin{
                background: #2a2f3b;
                border-radius: 100px;
                font-size: 14px;
                color: #666;
                padding:5px 10px;
                line-height: 14px;
                margin: 3vh auto;
                border-radius: 10px;
                text-align: center;
                width: 40%;
            }
            .apply-connect{
                background: #292f3a;
                border-radius: 100px;
                font-size: 14px;
                color: #fcbd54;
                padding:5px 10px;
                line-height: 14px;
                margin: 3vh auto;
                border-radius: 10px;
                text-align: center;
                width: 40%;
            }
            .chat{
                margin-bottom: 20px;
                li{
                    color: #fff;
                    font-size: 14px;
                    line-height: 25px;

                    .icon-identity{
                        padding:2px 4px;
                        background-image: linear-gradient(90deg, #51ECCE 0%, #248D53 100%);
                        border-radius: 2px;
                        margin-bottom: 2vh;
                        font-size: 12px;
                    }
                    .name{
                        color:#4A90E2;
                    }
                }
                
            }
        }
    }




    .sendMsg{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        .tab{
            background: #373D47;
            border-radius: 3px;
            height: 4vh;
            line-height: 4vh;
            width: 50%;
            padding: 0 11px;
            font-size: 14px;
            color: #9B9B9B;
            float: left;
        }
        .tab-rg{
            margin-left: 20px;
            background: #373D47;
            border-radius: 3px;
            height: 4vh;
            line-height: 4vh;
            width: 15%;
            text-align: center;
            font-size: 14px;
            color: #9B9B9B;
            float: left;
        }
        .textareaBg{
            background: #2d333e;
            height: 120px;
            margin-top: -1px;
            position: relative;
            z-index: 10;
            .icon-cancel{
                font-size: 14px;
                color: #E49B54;
                display: inline-block;
                padding-top: 10px;
                margin-left: 10px;
                
            }
            .icon-send{
                background: #009791;
                padding: 4px 14px;
                display: inline-block;
                color: #fff;
                border-radius: 12px;
                float: right;
                margin-top: 2%;
                margin-right: 5%;
                
            }
        }
    }



    //成员
    .staff{
    	.search-name{
    		margin-top: 2vh;
    		width:90%;
    		position:relative;
    		left:0;
    	}
        .list{
            height: 75vh;
            overflow-y:auto;
        }

        padding-left: 15px;

        .title{
        	margin-right: 10vh;
            padding-top: 3%;
            padding-bottom: 3%;
            color: #fff;
            font-size: 14px;
            background: none;
        }
        .left{
            float: left;
        }
        .rg{
            float: right;
            
        }
        .yellow{
            color: #a97b2e;
        } 

        .search{

        } 
        li{
            margin-top: 3.5vh;
            margin-bottom: 3.5vh;
            color: #fff;
            font-size: 14px;
            .icon-host{
                display: inline-block;
                width: 26px;
                height: 26px;
                background: url(../../assets/images/liveIcon/host.png) no-repeat center center;
                background-size: 26px 26px;
                vertical-align: middle;
                margin-left: 10px;
                cursor: pointer;

            }

            .icon-assistant{
                display: inline-block;
                width: 26px;
                height: 26px;
                background: url(../../assets/images/liveIcon/assistant.png) no-repeat center center;
                background-size: 26px 26px;
                vertical-align: middle;
                margin-left: 10px;
                cursor: pointer;

            }

            .icon-name{
                width: 50%;
                display: inline-block;
            }
            .linebg{
                background: rgba(0,0,0,0.74);
                border-radius: 45px;
                padding: 6px 10px;
            }
            .on-line{
                color: #fff;
            }
            .off-line{
                color: #F5A623;
            }
            .connect{
                color: #06CA96;
            }
        }
    }


    
}
</style>