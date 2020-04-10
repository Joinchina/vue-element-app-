/**
 * CC live video
 * v2.5.0 2018/09/10
 */
(function () {

    var DELAY_TIME = 10 * 1000;

    function isSupportFlash() {
        var isIE = (navigator.appVersion.indexOf('MSIE') >= 0);
        var hasFlash = true;

        if (isIE) {
            try {
                var objFlash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            } catch (e) {
                hasFlash = false;
            }
        } else {
            if (!navigator.plugins['Shockwave Flash']) {
                hasFlash = false;
            }
        }
        return hasFlash;
    }

    var DWDpc = {
        dpc: {},
        fastMode: false,
        init: function () {
            this.dpc = new Dpc();
        },
        appendDrawPanel: function () {
            var dp = '<iframe id="dpa" allow-scripts allowfullscreen allowusermedia frameborder="0" style="width: 100%;height:100%;"></iframe>';
            if (MobileLive.isMobile() == 'isMobile') {
                dp = '<iframe id="dpa" allow-scripts allowfullscreen allowusermedia frameborder="0" style="width: 100%;height:100%;pointer-events: none;"></iframe>';
            }
            $('#drawPanel').parent().append(dp);
            $('div#drawPanel').remove();

            if (typeof window.on_cc_live_db_flip === 'function') {
                window.on_cc_live_db_flip();
            }
        },
        pageChange: function (pc) {
            if (!this.fastMode) {
                return;
            }
            this.dpc.pageChange(pc);
        },
        animationChange: function (ac) {
            if (!this.fastMode) {
                return;
            }
            this.dpc.animationChange(ac);
        },
        history: function (h) {
            if (!this.fastMode) {
                return;
            }
            this.dpc.history(h);
        },
        draw: function (d) {
            if (!this.fastMode) {
                return;
            }
            this.dpc.draw(d);
        },
        clear: function () {
            if (!this.fastMode) {
                return;
            }
            this.dpc.clear();
        },
        reload: function () {
            if (!this.fastMode) {
                return;
            }
            this.dpc.reload();
        }
    };

    var DWLive = {
        init: function (option) {
            if (typeof option == 'undefined') {
                option = {};
            }
            this.userid = $.trim(option.userid);
            this.roomid = $.trim(option.roomid);
            this.viewername = $.trim(option.viewername);
            this.viewertoken = $.trim(option.viewertoken);
            this.forcibly = $.trim(option.forcibly);
            this.viewercustomua = $.trim(option.viewercustomua);
            this.language = $.trim(option.language);
            this.viewercustominfo = $.trim(option.viewercustominfo);
            if (typeof option.fastMode == 'string') {
                if (option.fastMode === 'false') {
                    this.fastMode = false;
                } else {
                    this.fastMode = true;
                }
            } else if (typeof option.fastMode == 'boolean') {
                this.fastMode = option.fastMode;
            } else {
                this.fastMode = false;
            }
            DWDpc.fastMode = this.fastMode;

            var _this = this;
            var scripts = [
                '//static.csslcloud.net/js/socket.io.js'
            ];

            if (MobileLive.isMobile() == 'isMobile') {
                if ($('#drawPanel').length > 0) {
                    //启动极速动画模式
                    if (!DWDpc.fastMode) {
                        scripts.push('//static.csslcloud.net/js/module/drawingBoard-2.0.0.js');
                    }
                }
            } else {
                if (!isSupportFlash()) {

                    if (typeof DWLive.onNotSupportFlash === 'function') {
                        DWLive.onNotSupportFlash();
                    }

                    if (this.userid == '18452D400D6B81D5') {
                        var lpph = $('#' + LivePlayer.id).parent().height();
                        var lppw = $('#' + LivePlayer.id).parent().width();

                        var tip = '<div style="z-index: 999999;"><p style="color: #0e0e0e; width: 260px;">您还没有安装flash播放器,请点击'
                            + '<a href="http://www.adobe.com/go/getflash" style="color: red;" target="_blank">这里'
                            + '</a>安装</p></div>';

                        $('#' + LivePlayer.id).append(tip).parent().css('z-index', '999999');

                        var lpdh = $($('#' + LivePlayer.id + ' div p')[0]).height();
                        var lpdw = $($('#' + LivePlayer.id + ' div p')[0]).width();

                        $('#' + LivePlayer.id + ' div').css({
                            'margin-left': ((lppw - lpdw - 60) / 2) + 'px',
                            'margin-top': ((lpph - lpdh) / 2) + 'px'
                        });

                        setInterval(function () {
                            $('#' + LivePlayer.id).parent().show();
                        }, 3000);
                    }
                }

                scripts.push(
                    '//static.csslcloud.net/js/swfobject.js',
                    '//static.csslcloud.net/js/json3.min.js'
                );
            }
            _this.loadScript(scripts, function () {
                _this.login(fn);

                function fn() {
                    _this.history = new History();
                }

                if (MobileLive.isMobile() == 'isMobile' && $.DrawingBoard) {
                    var dp = '<canvas id="drawPanel" width="1200" height="1200" style="position: absolute;z-index:2;top:0;left: 0"></canvas>'
                        + '<iframe id="dpa" src="" frameborder="0" style="position: absolute;top:0;left: 0"></iframe>';
                    $('#drawPanel').parent().append(dp);
                    $('div#drawPanel').remove();
                    $.DrawingBoard.config();
                }
            });
        },

        login: function (fn) {
            $.ajax({
                url: '//view.csslcloud.net/api/room/login',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    roomid: this.roomid,
                    userid: this.userid,
                    viewername: this.viewername,
                    viewertoken: this.viewertoken,
                    forcibly: this.forcibly,
                    viewercustomua: this.viewercustomua,
                    viewercustominfo: this.viewercustominfo
                },
                success: function (data) {
                    if (!data.success) {
                        if (typeof DWLive.onLoginError === 'function') {
                            DWLive.onLoginError(data);
                        }
                        return;
                    }

                    var isHttps = window.location.protocol === 'https:';
                    var host = data.datas.pusherNode.primary;
                    if (isHttps && host && host.indexOf(':')) {
                        var s = host.split(':');
                        if (s.length == 2) {
                            var port = parseInt(s[1]);
                            if (!isNaN(port)) {
                                var httpsPort = port + 400;
                                host = s[0] + ':' + httpsPort;
                            }
                        }
                    }

                    var url = document.location.protocol + '//' + host + '/' + data.datas.pusher.nsp;
                    var key = data.datas.viewer.key;
                    Pusher.options.pusherUrl = url;
                    Pusher.options.key = key;
                    DWLive.viewerid = data.datas.viewer.id;
                    DWLive.viewername = data.datas.viewer.name;
                    DWLive.isBan = data.datas.room.isBan;//禁播
                    DWLive.multiQuality = data.datas.room.multiQuality;
                    DWLive.documentDisplayMode = data.datas.room.documentDisplayMode;
                    DWLive.liveCountdown = data.datas.room.liveCountdown;

                    //初始化极速动画对象
                    if (DWDpc.fastMode) {
                        $('#documentDisplayMode').val(DWLive.documentDisplayMode);
                        DWDpc.appendDrawPanel();
                        DWDpc.init();
                    }
                    fn();

                    var delay = data.datas.room.delayTime,
                        foreignPublish = data.datas.room.foreignPublish;
                    LivePlayer.delay = delay;
                    if (delay <= 0) {
                        DELAY_TIME = 5 * 1000;
                    }
                    LivePlayer.foreignPublish = foreignPublish;

                    LivePlayer.openHostMode = data.datas.room.openHostMode;
                    LivePlayer.dvr = data.datas.room.dvr;
                    LivePlayer.barrageData = data.datas.room.barrage;
                    LivePlayer.warmVideoId = data.datas.room.encryptWarmVideoId;

                    var playerBackgroundImageUri = data.datas.room.playerBackgroundImageUri;
                    if (!playerBackgroundImageUri) {
                        playerBackgroundImageUri = '';
                    }
                    LivePlayer.backgroundImageUri = playerBackgroundImageUri;

                    if (typeof DWLive.playerBackgroundImageUri === 'function') {
                        DWLive.playerBackgroundImageUri(playerBackgroundImageUri);
                    }

                    var playerBackgroundHint = data.datas.room.playerBackgroundHint;
                    if (!playerBackgroundHint) {
                        playerBackgroundHint = '';
                    }
                    LivePlayer.backgroundHint = playerBackgroundHint;

                    if (typeof DWLive.playerBackgroundHint === 'function') {
                        DWLive.playerBackgroundHint(playerBackgroundHint);
                    }

                    var announcement = data.datas.announcement;
                    if (typeof DWLive.onAnnouncementShow === 'function' && announcement) {
                        DWLive.onAnnouncementShow(announcement);
                    }

                    var desc = data.datas.room.desc;
                    if (typeof DWLive.onLiveDesc === 'function') {
                        DWLive.onLiveDesc(desc);
                    }

                    var count = data.datas.room.showUserCount;
                    if (typeof DWLive.showUserCount === 'function') {
                        DWLive.showUserCount(count);
                    }

                    var marquee = data.datas.viewer.marquee;
                    if (typeof DWLive.getMarquee === 'function') {
                        DWLive.getMarquee(marquee);
                    }

                    if (typeof DWLive.onLoginSuccess === 'function') {
                        DWLive.onLoginSuccess();
                    }

                    var time = data.datas.live;
                    if (typeof DWLive.onLiveTime === 'function') {
                        DWLive.onLiveTime(time);
                    }

                    Pusher.init();

                    if (MobileLive.isMobile() == 'isMobile') {
                        MobileLive.init();
                    } else {
                        LivePlayer.init();
                    }

                    switch (data.datas.template.type) {
                        case 6:
                            Qa.init();
                            DWLive.sendPublicChatMsg = DWLive.sendPrivateChatMsg = function () {
                                return false;
                            };
                            break;
                        case 5:
                            Chat.init();
                            Qa.init();
                            DrawPanel.init();
                            break;
                        case 4:
                            Chat.init();
                            DrawPanel.init();
                            DWLive.sendQuestionMsg = function () {
                                return false;
                            };
                            break;
                        case 3:
                            Chat.init();
                            DWLive.sendQuestionMsg = function () {
                                return false;
                            };
                            break;
                        case 2:
                            Chat.init();
                            Qa.init();
                            break;
                        default:
                            Chat.init();
                            Qa.init();
                            DrawPanel.init();
                    }

                }
            });
        },

        logout: function () {
            $.ajax({
                url: '//view.csslcloud.net/api/live/logout',
                type: 'GET',
                dataType: 'json',
                timeout: 5000,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                },
                error: function (xhr, status, error) {
                }
            });
        },

        getScript: function (url, success) {

            var readyState = false,
                script = document.createElement('script');
            script.src = url;

            script.onload = script.onreadystatechange = function () {
                if (!readyState && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                    readyState = true;
                    success && success();
                }
            };
            document.body.appendChild(script);

        },

        loadScript: function (res, callback) {

            if (typeof res === 'string') {
                var _res = res;
                res = [];
                res.push(_res);
            }
            var _this = this,
                queue = function (fs, cb) {
                    _this.getScript(fs.shift(), function () {
                        fs.length ? queue(fs, cb) : cb && cb();
                    });
                };

            queue(res, callback);

        },

        //改名
        changeNickname: function (name) {
            if (!name || typeof name !== 'string' || name.length > 20) {
                return false;
            }
            Pusher.socket.emit('change_nickname', name);
        },

        sendPublicChatMsg: function (msg) {
            if (!msg || msg.length > 300) {
                return;
            }
            Pusher.socket.emit('chat_message', msg);
        },

        sendPrivateChatMsg: function (touserid, tousername, msg) {
            var h = new Date().getHours(),
                m = new Date().getMinutes(),
                s = new Date().getSeconds();
            m = m > 9 ? m : '0' + m;
            s = s > 9 ? s : '0' + s;
            var j = {
                'fromuserid': this.viewerid,
                'fromusername': this.viewername,
                'touserid': touserid,
                'tousername': tousername,
                'msg': $.trim(msg),
                'time': h + ':' + m + ':' + s
            };
            Pusher.socket.emit('private_chat', JSON.stringify(j));
        },

        sendQuestionMsg: function (content) {
            if (!content || content.length > 300) {
                return;
            }

            var j = {
                'action': 'question',
                'value': {
                    'userId': this.viewerid,
                    'userName': this.viewername,
                    'content': content
                }
            };

            try {
                Pusher.socket.emit('question', JSON.stringify(j));
            } catch (e) {
            }
        },

        barrage: function (msg, color) {
            // 移动H5暂不支持弹幕功能
            if (MobileLive.isMobile() == 'isMobile') {
                return;
            }

            var newm = $.trim(msg);
            if (!newm) {
                return;
            }
            newm = msg.replace(/\[em2?_([0-9]*)\]/g, '');

            LivePlayer.barrage({
                'txt': newm,
                'color': color == null ? 0xffffff : color
            });
        },

        getLine: function () {
            if (MobileLive.isMobile() == 'isMobile') {
                var l = MobileLive.src;
                return l;
            } else {
                return LivePlayer.getLine();
            }
        },

        changeLine: function (line) {
            if (MobileLive.isMobile() == 'isMobile') {
                MobileLive.changeLine(line);
            } else {
                LivePlayer.changeLine(line);
            }
        },

        onlyAudio: function () {
            if (MobileLive.isMobile() == 'isMobile') {
                MobileLive.onlyAudio();
            } else {
                LivePlayer.onlyAudio();
            }
        },

        setSound: function (n) {
            if (MobileLive.isMobile() == 'isMobile') {
                return;
            }
            LivePlayer.setSound(n);
        },

        answerRollcall: function (rid, pid) {
            var j = {
                'rollcallId': rid,
                'userId': this.viewerid,
                'userName': this.viewername,
                'publisherId': pid
            };
            Pusher.socket.emit('answer_rollcall', JSON.stringify(j));
        },

        replyVote: function (voteid, option, pid) {
            var j = {
                'voteId': voteid,
                'voteOption': option,
                'publisherId': pid
            };
            Pusher.socket.emit('reply_vote', JSON.stringify(j));
        },

        docBarrage: function (msg, color) {
            if (!$.trim(msg)) {
                return;
            }
            DrawPanel.barrage({
                'txt': msg,
                'color': color == null ? 0xffffff : color
            });
        },

        openBarrage: function (b) {
            LivePlayer.openBarrage(b);
        },

        showControl: function (b) {
            LivePlayer.showControl(b);
        },

        livePlayerInit: function () {
            LivePlayer.init();
        },

        openSound: function () {
            LivePlayer.openSound();
        },

        closeSound: function () {
            LivePlayer.closeSound();
        },

        docAdapt: function (t) {
            live.adapt = t;
        },

        // 请求语音互动
        requestInteraction: function (t) {
            live.interaction.requestInteraction(t);
        },

        // 挂断双向视频
        hangupInteraction: function () {
            live.interaction.hangupInteraction();
        },

        // 进入互动房间
        enterInteractionRoom: function (callback) {
            var err = undefined;
            try {
                Pusher.socket.emit('speak_enter');
            } catch (e) {
                err = e;
            } finally {
                if (typeof callback === 'function') callback(err);
            }
        },

        // 发送互动信息
        sendInteractionMessage: function (p, toId, event, data, callback) {
            var type = 'audio';
            if (p.video) {
                type = 'audiovideo';
            }

            var j = {
                type: type,
                fromname: this.viewername,
                fromid: this.viewerid,
                fromrole: 'student',
                toid: toId,
                event: event,
                data: JSON.stringify(data)
            };

            var err = undefined;
            try {
                Pusher.socket.emit('speak_message', JSON.stringify(j));
            } catch (e) {
                err = e;
            } finally {
                if (typeof callback === 'function') callback(err);
            }
        },

        // 跑马灯
        showMarquee: function (m) {
            LivePlayer.showMarquee(m);
        },
        showMarqueeDoc: function (m) {
            DrawPanel.showMarquee(m);
        },

        getPublishingQuestionnaire: function () {
            $.ajax({
                url: '//eva.csslcloud.net/api/questionnaire/info',
                type: 'GET',
                dataType: 'jsonp',
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    if (!data.success) {
                        return;
                    }

                    if (typeof DWLive.onQuestionnairePublish === 'function') {
                        DWLive.onQuestionnairePublish(data);
                    }
                }
            });
        }

    };

    // Pusher
    var Pusher = {
        options: {
            pusherUrl: '',
            key: '',
            maxMessageCount: 300, // 保存聊天条数
            userId: '',
            roomId: '',
            livePlayerId: '',
            drawPanel: ''
        },
        drawjson: [],
        pagechangedata: [],

        init: function () {

            var t = MobileLive.isMobile() == 'isMobile' ? 1 : 0;

            this.socket = io.connect(this.options.pusherUrl, {
                query: {
                    sessionid: Pusher.options.key,
                    platform: 1,
                    terminal: t
                }
            });
            this.bind();
        },

        bind: function () {
            // 翻页回调
            this.socket.on('page_change', function (j) {
                if (j && typeof(j) === 'string') {
                    Pusher.pagechangedata.push(JSON.parse(j));
                }
                if (typeof window.on_cc_live_dw_page_change === 'function') {
                    window.on_cc_live_dw_page_change(j);
                }
                if (typeof DWLive.onPageChange === 'function') {
                    var obj = JSON.parse(j);
                    var data = {
                        docId: obj.value.docid,
                        docName: obj.value.fileName,
                        docTotalPage: obj.value.totalPage,
                        pageNum: obj.value.page
                    };
                    DWLive.onPageChange(data);
                }
            });

            // 改名
            this.socket.on('change_nickname', function (j) {
                DWLive.viewername = j;
                if (typeof DWLive.onChangeNickname === 'function') {
                    DWLive.onChangeNickname(j);
                }
            });

            // 动画翻页
            this.socket.on('animation_change', function (j) {
                if (typeof window.on_cc_live_dw_animation_change === 'function') {
                    window.on_cc_live_dw_animation_change(j);
                }
            });

            // 画板回调
            this.socket.on('draw', function (j) {
                if (j && typeof(j) === 'string') {
                    Pusher.drawjson.push(JSON.parse(j));
                }
                if (typeof window.on_cc_live_dw_draw === 'function') {
                    window.on_cc_live_dw_draw(j);
                }
            });

            this.socket.on('room_user_count', function (j) {
                if (typeof DWLive.onUserCountMessage === 'function') {
                    DWLive.onUserCountMessage(j);
                }
            });

            this.socket.on('publish_stream', function (j) {
                if (LivePlayer) {
                    LivePlayer.isPublishing = 1;
                }
                if (LivePlayer && LivePlayer.start) {
                    LivePlayer.start();
                }
                if (typeof DWLive.onLiveStart === 'function') {
                    DWLive.onLiveStart(j);
                }
            });

            this.socket.on('end_stream', function (j) {
                if (LivePlayer) {
                    LivePlayer.isPublishing = 0;
                }
                if (LivePlayer && LivePlayer.end) {
                    LivePlayer.end();
                }
                if (DrawPanel && DrawPanel.clear) {
                    DrawPanel.clear();
                }
                DWDpc.clear();
                if (typeof DWLive.onLiveEnd === 'function') {
                    DWLive.onLiveEnd(j);
                }
            });

            this.socket.on('kick_out', function (j) {
                Pusher.socket.disconnect();

                if (typeof DWLive.onKickOut === 'function') {
                    DWLive.onKickOut(j);
                }
                if (!MobileLive.isIPad() && !MobileLive.isIPhone() && !MobileLive.isAndroid() && !MobileLive.isWindowsPhone()) {
                    LivePlayer.getFlash()._kickOff();
                }
            });

            this.socket.on('announcement', function (data) {
                data = toJson(data);

                if (data.action == 'release') {
                    if (typeof DWLive.onAnnouncementRelease === 'function') {
                        DWLive.onAnnouncementRelease(data.announcement);
                    }
                } else if (data.action == 'remove') {
                    if (typeof DWLive.onAnnouncementRemove === 'function') {
                        DWLive.onAnnouncementRemove(data);
                    }
                }
            });

            // 签到功能
            this.socket.on('start_rollcall', function (data) {
                data = toJson(data);
                if (typeof DWLive.onStartRollCall === 'function') {
                    DWLive.onStartRollCall(data);
                }
            });

            // 开始抽奖
            this.socket.on('start_lottery', function (data) {
                data = toJson(data);
                if (typeof DWLive.onStartLottery === 'function') {
                    DWLive.onStartLottery(data);
                }
            });

            // 中奖
            this.socket.on('win_lottery', function (data) {
                data = toJson(data);
                if (typeof DWLive.onWinLottery === 'function') {
                    DWLive.onWinLottery(data);
                }
            });

            // 结束抽奖
            this.socket.on('stop_lottery', function (data) {
                data = toJson(data);
                if (typeof DWLive.onStopLottery === 'function') {
                    DWLive.onStopLottery(data);
                }
            });

            // 开始答题
            this.socket.on('start_vote', function (data) {
                data = toJson(data);
                if (typeof DWLive.onStartVote === 'function') {
                    DWLive.onStartVote(data);
                }
            });

            // 结束答题
            this.socket.on('stop_vote', function (data) {
                data = toJson(data);
                if (typeof DWLive.onStopVote === 'function') {
                    DWLive.onStopVote(data);
                }
            });

            // 答题结果
            this.socket.on('vote_result', function (data) {
                data = toJson(data);
                if (typeof DWLive.onVoteResult === 'function') {
                    DWLive.onVoteResult(data);
                }
            });

            // 禁播
            this.socket.on('ban_stream', function (data) {
                data = toJson(data);
                //h5禁播
                DWLive.isBan = 1;
                if (MobileLive.isMobile() == 'isMobile') {
                    MobileLive.ban();

                } else {
                    LivePlayer.banLive();
                }

                if (typeof DWLive.onBanStream === 'function') {
                    DWLive.onBanStream(data);
                }
            });
            // 解禁
            this.socket.on('unban_stream', function (data) {
                data = toJson(data);
                //h5解禁
                DWLive.isBan = 0;
                if (MobileLive.isMobile() == 'isMobile') {
                    MobileLive.unban();
                } else {
                    LivePlayer.unbanLive();

                }

                if (typeof DWLive.onUnBanStream === 'function') {
                    DWLive.onUnBanStream(data);
                }
            });
            this.socket.on('room_setting', function (data) {
                data = toJson(data);
                if (typeof DWLive.onRoomSetting === 'function') {
                    DWLive.onRoomSetting(data);
                }
            });

            // 讲师接受互动信息
            this.socket.on('accept_speak', function (data) {
                if (typeof window.on_cc_live_accept_interaction === 'function') {
                    window.on_cc_live_accept_interaction(toJson(data));
                }
            });

            // 互动信息
            this.socket.on('speak_message', function (data) {
                if (typeof window.on_cc_live_interaction_message === 'function') {
                    window.on_cc_live_interaction_message(toJson(data));
                }
            });

            // 已经在聊天的列表信息
            this.socket.on('speak_peer_list', function (data) {
                if (typeof window.on_cc_live_interaction_chatusers === 'function') {
                    window.on_cc_live_interaction_chatusers(toJson(data));
                }
            });

            // 挂断互动信息
            this.socket.on('speak_disconnect', function (data) {
                if (typeof window.on_cc_live_interaction_disconnect === 'function') {
                    window.on_cc_live_interaction_disconnect(toJson(data));
                }
            });

            // 广播信息
            this.socket.on('broadcast_msg', function (data) {
                if (typeof DWLive.onBroadcastMsg === 'function') {
                    DWLive.onBroadcastMsg(toJson(data).value);
                }
            });

            // 发布提问
            this.socket.on('publish_question', function (data) {
                if (typeof DWLive.onQaPublish === 'function') {
                    DWLive.onQaPublish(toJson(data));
                }
            });

            /**
             * 发布问卷
             * */
            this.socket.on('questionnaire_publish', function (data) {
                data = toJson(data);

                if (typeof DWLive.onQuestionnairePublish === 'function') {
                    DWLive.onQuestionnairePublish(data);
                }
            });

            /**
             * 结束发布问卷
             * */
            this.socket.on('questionnaire_publish_stop', function (data) {
                data = toJson(data);

                if (typeof DWLive.onQuestionnairePublishStop === 'function') {
                    DWLive.onQuestionnairePublishStop(data);
                }
            });

            this.socket.on('room_teachers', function (data) {
                if (typeof DWLive.onOnlineTeachers === 'function') {
                    DWLive.onOnlineTeachers(toJson(data));
                }
            });

            this.socket.on('external_questionnaire_publish', function (data) {
                if (typeof DWLive.onExternalQuestionnairePublish === 'function') {
                    DWLive.onExternalQuestionnairePublish(toJson(data));
                }
            });

            this.socket.on('ban_chat', function (data) {
                if (typeof DWLive.onBanChat === 'function') {
                    DWLive.onBanChat(toJson(data));
                }
            });

            this.socket.on('unban_chat', function (data) {
                if (typeof DWLive.onUnBanChat === 'function') {
                    DWLive.onUnBanChat(toJson(data));
                }
            });

            var _this = this;
            setTimeout(function () {
                try {
                    _this.socket.emit('room_user_count');
                } catch (e) {
                }
                try {
                    _this.socket.emit('room_teachers');
                } catch (e) {
                }
            }, 1500);
            setInterval(function () {
                try {
                    _this.socket.emit('room_user_count');
                } catch (e) {
                }
                try {
                    _this.socket.emit('room_teachers');
                } catch (e) {
                }
            }, 15000);
        },

        // 请求互动
        requestInteraction: function (p, callback) {

            var t = 'audio';

            if (p.video) {
                t += 'video';
            }

            var j = {
                'viewerId': DWLive.viewerid,
                'viewerName': DWLive.viewername,
                'type': t
            };

            var err = undefined;
            try {
                this.socket.emit('request_speak', JSON.stringify(j));
            } catch (e) {
                err = e;
            } finally {
                if (typeof callback === 'function') callback(err);
            }
        },

        // 取消申请
        cancelRequestInteraction: function (type, callback) {
            var j = {
                'viewerId': this.viewerid,
                'viewerName': this.viewername,
                'type': type
            };

            debug('interaction', '取消申请：' + JSON.stringify(j));

            var err = undefined;
            try {
                this.socket.emit('cancel_request_speak', JSON.stringify(j));
            } catch (e) {
                err = e;
            } finally {
                if (typeof callback === 'function') callback(err);
            }
        },

        //挂断互动
        hangupInteraction: function (type, callback) {
            var j = {
                'viewerId': DWLive.viewerid,
                'viewerName': DWLive.viewername,
                'type': type
            };

            debug('interaction', '挂断事件：' + JSON.stringify(j));

            var err = undefined;
            try {
                this.socket.emit('hangup_interaction', JSON.stringify(j));
            } catch (e) {
                err = e;
            } finally {
                if (typeof callback === 'function') callback(err);
            }
        }
    };

    /**
     * 语音互动支持
     *
     * */
    var Interaction = function (opts) {
        try {
            window.PeerConnection = (window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
            window.URL = (window.URL || window.webkitURL || window.msURL || window.oURL);
            window.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
            window.nativeRTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);
            window.nativeRTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription);
        } catch (e) {
        }

        this.usersPcs = {
            length: 0
        };

        // 本地流信息
        this.local = {
            type: {
                video: false,
                audio: false
            },
            video: {},
            audio: {}
        };

        this.isRequesting = false;

        /**
         * 请求语音互动
         *
         * t = {
         *  video: true,
         *  audio: true
         * }
         * */
        this.requestInteraction = function (t, callback) {
            debug('Interaction', '请求互动');

            this.local.type = t;

            this.isRequesting = true;

            // 请求互动超时计时器
            this.setRequestTimeoutTimer();

            // 创建音视频信息
            this.createLocalMedia(function (error) {
                if (error) {
                    if (typeof window.on_cc_live_interaction_error === 'function') {
                        window.on_cc_live_interaction_error(live.interaction.local.type, error, '创建音视频信息出错');
                    }
                    return;
                }

                Pusher.requestInteraction(t, callback);
            });
        };


        // 语音通话计时器
        this.setCallingTimer = function () {
            live.interaction.interactionTime = 0;
            live.interaction.interactionTimeInterval = setInterval(function () {
                ++live.interaction.interactionTime;
                if (typeof window.on_cc_live_interaction_interval === 'function') {
                    var p = live.interaction.local.type;
                    var t = live.interaction.interactionTime;
                    window.on_cc_live_interaction_interval(p, t);
                }
            }, 1000);
        };
        // 清除语音通话计时器
        this.clearCallingTimer = function () {
            live.interaction.interactionTime = 0;
            clearInterval(live.interaction.interactionTimeInterval);
        };

        // 互动请求超时定时器
        this.setRequestTimeoutTimer = function () {
            /**
             * 请求互动，60s内没有接受，则自动断开
             *
             * 通知pusher断开
             * */
            live.interaction.REQUEST_INTERACTION_TIMEOUT = setTimeout(function () {
                live.interaction.REQUEST_INTERACTION_TIMEOUT = -1;

                // 超时挂断语音通话
                live.interaction.hangupInteraction(DWLive.viewerid);
                live.interaction.stopLocalStream();

                live.interaction.isRequesting = false;

                $('#interactionLocalVideo')[0].src = '';
                $('#videoInteraction').hide();

                if (typeof window.on_cc_live_interaction_request_timeout === 'function') {
                    window.on_cc_live_interaction_request_timeout(live.interaction.local.type);
                }
            }, 60000);
        };
        // 清空互动请求超时定时器
        this.clearRequestTimeoutTimer = function () {
            if (live.interaction.REQUEST_INTERACTION_TIMEOUT > 0) {
                clearTimeout(live.interaction.REQUEST_INTERACTION_TIMEOUT);
                live.interaction.REQUEST_INTERACTION_TIMEOUT = -1;
            }
        };

        // 停止本地流
        this.stopLocalStream = function () {
            if (live.interaction.local.video.stream) {
                try {
                    live.interaction.local.video.stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                } catch (e) {
                }
            }

            if (live.interaction.local.audio.stream) {
                try {
                    live.interaction.local.audio.stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                } catch (e) {
                }
            }
        };

        this.cancelInteraction = function () {
            live.interaction.isRequesting = false;

            if (typeof window.on_cc_live_interaction_cancal === 'function') {
                window.on_cc_live_interaction_cancal(live.interaction.local.type);
            }
        };

        // 断开连接
        this.disconnectInteraction = function (uId) {
            DWLive.openSound();

            this.clearRequestTimeoutTimer();

            // 删除所有
            if (uId == DWLive.viewerid) {
                $.each(live.interaction.usersPcs, function (userId, up) {
                    var pc = up.pc;
                    if (pc == null) {
                        return true;
                    }

                    pc.close();
                    pc = null;

                    if (live.interaction.usersPcs[userId]) {
                        delete live.interaction.usersPcs[userId];
                        var l = live.interaction.usersPcs.length - 1;
                        live.interaction.usersPcs.length = l < 0 ? 0 : l;
                    }

                });
            } else {
                $.each(live.interaction.usersPcs, function (userId, up) {
                    var pc = up.pc;
                    if (!pc) {
                        return true;
                    }

                    if (userId != uId) {
                        return true;
                    }

                    pc.close();
                    pc = null;

                    if (live.interaction.usersPcs[userId]) {
                        delete live.interaction.usersPcs[userId];
                        var l = live.interaction.usersPcs.length - 1;
                        live.interaction.usersPcs.length = l < 0 ? 0 : l;
                    }
                });
            }

            if (live.interaction.usersPcs.length == 0) {
                this.stopLocalStream();
            }

            live.interaction.isInteractioning = false;
            live.interaction.isRequesting = false;
        };

        // 创建本地音视频流
        this.createLocalAudioAndVideoMedia = function (c) {
            var that = this;
            getUserMedia.call(navigator, {
                video: true,
                audio: true
            }, function (stream) {
                that.local.video.stream = stream;

                if (c && typeof c === 'function') {
                    c(stream);
                }
            }, function (error) {
                debug('Interaction', 'getUserMedia error: ' + error);

                if (c && typeof c === 'function') {
                    c(error);
                }
            });
        };

        // 创建本地音频流
        this.createLocalAudioMedia = function (c) {
            var that = this;
            getUserMedia.call(navigator, {
                video: false,
                audio: true
            }, function (stream) {
                that.local.audio.stream = stream;

                if (c && typeof c === 'function') {
                    c(stream);
                }
            }, function (error) {
                debug('Interaction', 'getUserMedia error: ' + error);

                if (c && typeof c === 'function') {
                    c(error);
                }
            });
        };

        this.createLocalMedia = function (c) {
            var that = this;
            var p = that.local.type;
            getUserMedia.call(navigator, p, function (stream) {
                if (p.video) {
                    that.local.video.stream = stream;
                } else {
                    that.local.audio.stream = stream;
                }

                if (typeof window.on_cc_live_interaction_local_media === 'function') {
                    window.on_cc_live_interaction_local_media(p, stream);
                }

                if (c && typeof c === 'function') {
                    c();
                }
            }, function (error) {
                debug('Interaction', 'getUserMedia error: ' + error);

                if (c && typeof c === 'function') {
                    c(error);
                }
            });
        };

        this.iceServers = {
            'iceServers': [{
                url: 'stun:turn.csslcloud.net:3478',
                credential: 'bokecc',
                username: 'cc'
            }, {
                url: 'turn:turn.csslcloud.net:3478',
                credential: 'bokecc',
                username: 'cc'
            }]
        };

        // 创建被动创建连接的PC
        this.createAnswerPeerConnection = function (chatuser) {
            var pc = new PeerConnection(this.iceServers);

            if (chatuser.type == 'audio') {
                if (!live.interaction.local.audio.stream) {
                    this.createLocalAudioMedia();
                }
                pc.addStream(live.interaction.local.audio.stream);
            } else {
                if (!live.interaction.local.video.stream) {
                    this.createLocalAudioAndVideoMedia();
                }
                pc.addStream(live.interaction.local.video.stream);
            }

            // 如果检测到媒体流连接到本地，将其绑定到一个audio标签上输出
            pc.onaddstream = function (event) {
                if (typeof window.on_cc_live_interaction_remote_media === 'function') {
                    window.on_cc_live_interaction_remote_media(live.interaction.local.type, chatuser, event.stream);
                }
            };

            pc.createAnswer(function (desc) {
                pc.setLocalDescription(desc);
                DWLive.sendInteractionMessage(live.interaction.local.type, chatuser.id, 'answer', desc);
            }, function (error) {
                debug('Interaction', 'Failure callback: ' + error);
            });

            pc.onicecandidate = function (event) {
                if (event.candidate !== null) {
                    DWLive.sendInteractionMessage(live.interaction.local.type, chatuser.id, '', event.candidate);
                }
            };

            live.interaction.usersPcs[chatuser.id] = {
                pc: pc,
                user: chatuser
            };

            live.interaction.usersPcs.length += 1;
        };

        // 创建主动创建连接的PC
        this.createOfferPeerConnection = function (chatuser) {
            var pc = new PeerConnection(this.iceServers);

            var p = live.interaction.local.type;
            if (p.video) {
                pc.addStream(live.interaction.local.video.stream);
            } else {
                pc.addStream(live.interaction.local.audio.stream);
            }

            // 如果检测到媒体流连接到本地，将其绑定到一个audio标签上输出
            pc.onaddstream = function (event) {
                if (typeof window.on_cc_live_interaction_remote_media === 'function') {
                    window.on_cc_live_interaction_remote_media(live.interaction.local.type, chatuser, event.stream);
                }
            };

            pc.oniceconnectionstatechange = function (d) {
                debug('Interaction', 'iceConnectionState ...' + pc.iceConnectionState);

                if (pc.iceConnectionState == 'failed') {
                    debug('Interaction', 'iceConnectionState failed');

                    live.interaction.hangupInteraction();

                    if (typeof window.on_cc_live_interaction_disconnect === 'function') {
                        window.on_cc_live_interaction_disconnect({
                            disconnectid: DWLive.viewerid
                        });
                    }
                }
            };

            pc.createOffer(function (desc) {
                pc.setLocalDescription(desc);

                DWLive.sendInteractionMessage(p, chatuser.id, 'offer', desc);
            }, function (error) {
                if (typeof window.on_cc_live_interaction_error === 'function') {
                    window.on_cc_live_interaction_error(live.interaction.local.type, error, 'createOfferPeerConnection');
                }
            });

            pc.onicecandidate = function (event) {
                if (event.candidate !== null) {
                    DWLive.sendInteractionMessage(p, chatuser.id, '', event.candidate);
                }
            };

            live.interaction.usersPcs[chatuser.id] = {
                pc: pc,
                user: chatuser
            };

            live.interaction.usersPcs.length += 1;
        };

        this.id = opts.interaction.id;

        // 当前浏览器是否支持互动功能
        this.isSupportInteraction = function () {
            return window.location.protocol === 'https:' && !!(PeerConnection && URL && getUserMedia && nativeRTCIceCandidate && nativeRTCSessionDescription);
        };

        // 挂断互动
        this.hangupInteraction = function (callback) {
            if (this.isInteractioning) {
                Pusher.hangupInteraction(this.type, callback);
            } else if (this.isRequesting) {
                Pusher.cancelRequestInteraction(this.type, callback);
                this.stopLocalStream();
                this.cancelInteraction();
            } else {
                this.stopLocalStream();
                this.cancelInteraction();
            }
        };
    };

    // LivePlayer
    var LivePlayer = {
        id: 'livePlayer',

        swfUrl: '//zeus.csslcloud.net/flash/Player.swf',

        isReady: false,

        isPublishing: 0,

        delay: '',

        foreignPublish: '',

        init: function () {
            var flashvars = {
                'userid': DWLive.userid,
                'roomid': DWLive.roomid,
                'foreignPublish': this.foreignPublish,
                'warmvideoid': this.warmVideoId,
                'openhostmode': this.openHostMode, // 多主讲
                'dvr': this.dvr,
                'barrage': this.barrageData,
                'backgroundImageUri': this.backgroundImageUri,
                'backgroundHint': this.backgroundHint,
                'countDownTime': DWLive.liveCountdown,
                'openMultiQuality': DWLive.multiQuality,
                'language': DWLive.language || '',
                'type': 'liveplayer'
            };

            var buffer = this.delay;
            if (buffer > 0) {
                flashvars.buffer = buffer;
            }

            var params = {
                allowFullscreen: 'true',
                allowScriptAccess: 'always',
                wmode: 'transparent'
            };

            swfobject.embedSWF(this.swfUrl, this.id, '100%', '100%', '10.0.0',
                '/flash/expressInstall.swf', flashvars, params);

        },

        getFlash: function () {
            return swfobject.getObjectById(this.id);
        },

        getPlayerTime: function () {
            var t = parseInt(this.getFlash()._time());
            if (isNaN(t) || t < 0) {
                return 0;
            }
            return t;
        },

        start: function () {
            if (MobileLive.isMobile() == 'isMobile') {
                //禁播
                if (DWLive.isBan) {
                    $('#livePlayer').css({
                        'text-align': 'center',
                        'color': 'white',
                        'font-size': '18px',
                        'line-height': '232px'
                    });
                    $('#livePlayer').html('<p>直播已封禁，请联系管理员</p>');
                    return;
                }

                setTimeout(function () {
                    MobileLive.init();
                }, DELAY_TIME);
            } else {
                if (!this.getFlash()) {
                    return;
                }
                this.isPublishing = 1;
                this.getFlash()._streamStart();
            }
        },

        end: function () {
            if (MobileLive.isMobile() == 'isMobile') {
                setTimeout(function () {
                    MobileLive.end();
                }, DELAY_TIME);
            } else {

                if (!this.getFlash()) {
                    return;
                }
                this.isPublishing = 0;
                this.getFlash()._streamEnd();
            }
        },

        // 弹幕
        barrage: function (m) {
            if (!m) {
                return;
            }

            if (!this.getFlash()) {
                return;
            }

            if (this.getFlash()._jsTOASbarrage) {
                this.getFlash()._jsTOASbarrage(m);
            }
        },

        getLine: function () {
            var lines = this.getFlash().getLine();
            if (lines) {
                lines = JSON.parse(lines);
            }
            return lines;
        },

        changeLine: function (line) {
            this.getFlash().changeLine(line);
        },

        onlyAudio: function () {
            this.getFlash()._onlyAudio();
        },

        setSound: function (n) {
            this.getFlash()._SetSound(n);
        },

        // 打开声音
        openSound: function () {
            if (!this.getFlash()) {
                return;
            }

            this.getFlash()._onSound();
        },

        // 关闭声音
        closeSound: function () {
            if (!this.getFlash()) {
                return;
            }

            this.getFlash()._unSound();
        },

        // 开启关闭弹幕
        openBarrage: function (b) {
            if (!this.getFlash()) {
                return;
            }

            this.getFlash()._barrage(b);
        },

        showControl: function (b) {
            if (!this.getFlash()) {
                return;
            }
            this.getFlash()._ShowControl(b);
        },

        //封禁
        banLive: function () {
            if (!this.getFlash()) {
                return;
            }
            this.getFlash()._banLive();
        },

        //解禁
        unbanLive: function () {
            if (!this.getFlash()) {
                return;
            }
            this.getFlash()._unbanLive();
        },

        // 显示跑马灯功能
        showMarquee: function (marquee) {
            if (!marquee) {
                return;
            }

            if (!this.getFlash()) {
                return;
            }

            this.getFlash()._showMarqueePlugin(marquee);
        }
    };

    // window.LivePlayer = LivePlayer;

    window._onStart = function () {
//		直播播放器准备开始播放
        LivePlayer.isReady = true;
    };

    function initDrawPanelInfo() {
        if (!isHistoryReady) {
            setTimeout(function () {
                initDrawPanelInfo();
            }, 3000);
            return;
        }

        if (DWDpc.fastMode) {
            return;
        }

        if (draws.length) {
            DrawPanel.draws(draws);
            draws = [];
        }

        // 显示最后一张图片
        if (pageChanges.length) {
            var ppc = pageChanges.pop();
            if (!ppc) {
                return;
            }

            DrawPanel.filp(ppc);
            if (animations.length) {
                var animation = animations.pop();

                var animationJ = toJson(animation);
                var ppcJ = toJson(ppc);

                if (ppcJ.docid == animationJ.docid && ppcJ.time <= animationJ.time) {
                    DrawPanel.animationFilp(animation);
                }
            }

            pageChanges = [];
        }
    }


    // DrawPanel
    var DrawPanel = {
        id: 'drawPanel',

        isReady: false,

        isProcessing: false,

        getWidth: function () {
            return '100%';
        },

        getHeight: function () {
            return '100%';
        },

        swfUrl: '//zeus.csslcloud.net/flash/Player.swf',

        init: function () {
            var flashvars = {
                'type': 'drawpanel'
            };
            var params = {
                allowFullscreen: 'true',
                allowScriptAccess: 'always',
                wmode: 'transparent'
            };
            var attributes = {};

            if (!MobileLive.isIPad() && !MobileLive.isIPhone() && !MobileLive.isAndroid() && !MobileLive.isWindowsPhone()) {
                //开启极速动画模式
                if (!DWDpc.fastMode) {
                    swfobject.embedSWF(this.swfUrl, this.id, this.getWidth(), this.getHeight(), '10.0.0', '/flash/expressInstall.swf', flashvars, params, attributes);
                }

            }
        },

        getSwf: function () {
            if (!this.isReady) {
                return;
            }

            return swfobject.getObjectById(this.id);
        },

        clear: function () {
            var swf = this.getSwf();
            if (!swf) {
                return;
            }
            swf._streamEnd();

            Pusher.pagechangedata = [];
            Pusher.drawjson = [];
        },

        // 画图
        draw: function (j) {
            var swf = this.getSwf();
            if (!swf) {
                return;
            }
            swf.draw(j);
        },

        draws: function (js) {
            var swf = this.getSwf();
            if (!swf) {
                return;
            }

            (function (jstr) {
                setTimeout(function () {
                    swf.drawList(jstr);
                });
            })(js);
        },

        // 翻页
        filp: function (j) {
            var swf = this.getSwf();
            if (!swf) {
                return;
            }

            var documentDisplayMode = DWLive.documentDisplayMode;
            if (documentDisplayMode == 1) {
                this.displayMode = 'auto';
            } else if (documentDisplayMode == 2) {
                this.displayMode = 'width';
            } else {
                this.displayMode = 'auto';
            }

            if (live.adapt !== undefined) {
                this.displayMode = live.adapt ? 'auto' : 'width';
            }

            var jj = JSON.parse(j);
            var u = jj.url;
            var isHttps = window.location.protocol === 'https:';
            if (isHttps) {
                jj.url = u.replace(/http:/g, 'https:');
            }

            swf.filp(JSON.stringify(jj), this.displayMode);

        },

        // 动画
        animationFilp: function (j) {
            var swf = this.getSwf();
            if (!swf) {
                return;
            }

            swf.animation(j);
        },


        // 弹幕
        barrage: function (m) {
            if (!m) {
                return;
            }

            if (!this.getSwf()) {
                return;
            }

            if (this.getSwf()._jsTOASbarrage) {
                this.getSwf()._jsTOASbarrage(m);
            }
        },

        // 显示跑马灯功能
        showMarquee: function (marquee) {
            if (!marquee) {
                return;
            }

            if (!this.getSwf()) {
                return;
            }

            this.getSwf().showMarqueeLight(marquee);
        }
    };


    var draws = [];
    var pageChanges = [];
    var animations = [];
    var isHistoryReady = false;

    // 历史数据
    var History = function () {
        $.ajax({
            url: '//view.csslcloud.net/api/view/info?userid=' + DWLive.userid + '&roomid=' + DWLive.roomid,
            type: 'GET',
            dataType: 'jsonp',
            success: function (data) {
                if (!data.success) {
                    return;
                }

                if (!data.datas) {
                    return;
                }
                var datas = data.datas;

                var meta = datas.meta;
                if (!meta) {
                    return;
                }

                LivePlayer.isPublishing = meta.isPublishing;

                // 没有推流
                if (meta.isPublishing != 1) {
                    return;
                }

                var answers = meta.answer ? meta.answer : [];
                var questions = meta.question ? meta.question : [];
                var broadcasts = meta.broadcast ? meta.broadcast : [];
                for (var i = 0; i < answers.length; i++) {
                    var answer = answers[i];
                    for (var ii = 0; ii < questions.length; ii++) {
                        var question = questions[ii];
                        if (question.encryptId == answer.encryptId) {
                            answer.questionUserId = question.questionUserId;
                        }
                    }
                }

                if (questions && questions.length) {
                    for (var i = 0; i < questions.length; i++) {
                        var question = questions[i];
                        if (typeof DWLive.onQuestion === 'function') {
                            DWLive.onQuestion(JSON.stringify({
                                'action': 'question',
                                'value': {
                                    'id': question.encryptId,
                                    'content': question.content,
                                    'userId': question.questionUserId,
                                    'userName': question.questionUserName,
                                    'isPublish': question.isPublish,
                                    'triggerTime': question.triggerTime,
                                    'userAvatar': question.userAvatar
                                }
                            }));
                        }
                    }
                }

                if (answers && answers.length) {
                    for (var i = 0; i < answers.length; i++) {
                        var answer = answers[i];
                        if (typeof DWLive.onAnswer === 'function') {
                            DWLive.onAnswer(JSON.stringify({
                                'action': 'answer',
                                'value': {
                                    'questionId': answer.encryptId,
                                    'isPrivate': answer.isPrivate,
                                    'content': answer.content,
                                    'userId': answer.answerUserId,
                                    'userName': answer.answerUserName,
                                    'questionUserId': answer.questionUserId,
                                    'triggerTime': answer.triggerTime,
                                    'userAvatar': answer.userAvatar
                                }
                            }));
                        }
                    }
                }

                if (broadcasts && broadcasts.length) {
                    for (var i = 0; i < broadcasts.length; i++) {
                        var broadcast = broadcasts[i];
                        if (typeof DWLive.onBroadcastMsg == 'function') {
                            DWLive.onBroadcastMsg({
                                content: broadcast.content,
                                time: broadcast.time
                            });
                        }
                    }
                }

                if (MobileLive.isMobile() == 'isMobile' && $.DrawingBoard) {
                    $.DrawingBoard.history(meta);
                }

                //极速动画获取历史信息
                DWDpc.history(meta);

                var chatLogs = meta.chatLog;
                if (chatLogs && chatLogs.length) {
                    var cls = [];
                    for (var i = 0; i < chatLogs.length; i++) {
                        var chatLog = chatLogs[i];

                        cls.push({
                            'userid': chatLog.userId,
                            'username': chatLog.userName,
                            'userrole': chatLog.userRole,
                            'useravatar': chatLog.userAvatar,
                            'msg': chatLog.content,
                            'time': '',
                            'usercustommark': chatLog.userCustomMark
                        });
                    }

                    if (typeof DWLive.onPublicChatMessage === 'function') {
                        for (var idx = 0; idx < cls.length; idx++) {
                            DWLive.onPublicChatMessage(JSON.stringify(cls[idx]));
                        }
                    }
                }

                if (!DWDpc.fastMode) {
                    var pageChange = meta.pageChange;
                    if (pageChange && pageChange.length) {
                        pageChange.sort(function (p1, p2) {
                            return parseInt(p1.time) - parseInt(p2.time);
                        });
                        var lastPage = pageChange.pop();
                        pageChanges.push(JSON.stringify({
                            'fileName': lastPage.docName,
                            'totalPage': lastPage.docTotalPage,
                            'docid': lastPage.encryptDocId,
                            'url': lastPage.url,
                            'page': lastPage.pageNum,
                            'time': lastPage.time,
                            'useSDK': lastPage.useSDK
                        }));
                    }

                    var animation = meta.animation;
                    if (animation && animation.length) {
                        animation.sort(function (p1, p2) {
                            return parseInt(p1.time) - parseInt(p2.time);
                        });
                        var lastAnimation = animation.pop();
                        animations.push(JSON.stringify({
                            'fileName': lastAnimation.docName,
                            'totalPage': lastAnimation.docTotalPage,
                            'docid': lastAnimation.encryptDocId,
                            'url': lastAnimation.url,
                            'page': lastAnimation.pageNum,
                            'time': lastAnimation.time,
                            'step': lastAnimation.step
                        }));
                    }

                    var draw = meta.draw;
                    if (draw && draw.length) {
                        for (var i = 0; i < draw.length; i++) {
                            draws.push(draw[i].data);
                        }
                    }
                }

                isHistoryReady = true;
            }
        });
    };


    var opts = {
        // 互动信息
        interaction: {
            id: 'interactionPlayer',
            width: '100%',
            height: '100%'
        }
    };
    var Live = function (opts) {
        this.interaction = new Interaction(opts);
    };
    var live = new Live(opts);


    window.on_drampanel_ready = function () {
        // 画板Flash加载完成回调
        DrawPanel.isReady = true;
        setTimeout(function () {
            initDrawPanelInfo();
        }, 1500);
    };


    // 画图事件
    window.on_cc_live_dw_draw = function (data) {
        setTimeout(function () {
            DWDpc.draw(data);
        }, getDeltaTime());
        setTimeout(function () {
            var j = toJson(data);
            DrawPanel.draw(JSON.stringify(j.value.data));
        }, getDeltaTime());
        if (MobileLive.isMobile() == 'isMobile') {
            setTimeout(function () {
                $.DrawingBoard && $.DrawingBoard.db(data);
            }, getDeltaTime());
        }
    };

    // 翻页事件
    window.on_cc_live_dw_page_change = function (data) {
        //极速动画
        setTimeout(function () {
            DWDpc.pageChange(data);
        }, getDeltaTime());
        //flash
        setTimeout(function () {
            var j = toJson(data);
            DrawPanel.filp(JSON.stringify(j.value));
        }, getDeltaTime());
        //canvas
        if (MobileLive.isMobile() == 'isMobile') {
            setTimeout(function () {
                $.DrawingBoard && $.DrawingBoard.db(data);
            }, getDeltaTime());
        }
    };

    // 动画翻页事件
    window.on_cc_live_dw_animation_change = function (data) {
        setTimeout(function () {
            DWDpc.animationChange(data);
        }, getDeltaTime());
        setTimeout(function () {
            var j = toJson(data);
            DrawPanel.animationFilp(JSON.stringify(j.value));
        }, getDeltaTime());
        if (MobileLive.isMobile() == 'isMobile') {
            setTimeout(function () {
                $.DrawingBoard && $.DrawingBoard.db(data);
            }, getDeltaTime());
        }
    };


    // Chat
    var Chat = {
        init: function () {
            Pusher.socket.on('chat_message', function (j) {
                if (typeof DWLive.onPublicChatMessage === 'function') {
                    DWLive.onPublicChatMessage(j);
                }
            });

            // 消息提醒
            Pusher.socket.on('notification', function (j) {
                if (typeof DWLive.onNotification === 'function') {
                    DWLive.onNotification(j);
                }
            });

            Pusher.socket.on('information', function (j) {
                if (typeof DWLive.onInformation === 'function') {
                    DWLive.onInformation(j);
                }
            });

            // 接收发送私聊函数
            Pusher.socket.on('private_chat_self', function (j) {
                if (typeof DWLive.onPrivateChatMessage === 'function') {
                    DWLive.onPrivateChatMessage(j);
                }
            });

            // 接收回答私聊函数
            Pusher.socket.on('private_chat', function (j) {
                if (typeof DWLive.onPrivateAnswer === 'function') {
                    DWLive.onPrivateAnswer(j);
                }
            });

            // 在线列表
            Pusher.socket.on('room_context', function (msg) {

            });

            // 自定义消息
            Pusher.socket.on('custom_message', function (j) {
                if (typeof DWLive.onCustomChatMessage === 'function') {
                    DWLive.onCustomChatMessage(j);
                }
            });
        }
    };

    // Qa
    var Qa = {
        init: function () {

            // 问答->提交问题
            Pusher.socket.on('question', function (j) {
                if (typeof DWLive.onQuestion === 'function') {
                    DWLive.onQuestion(j);
                }
                if (typeof DWLive.onQuestionSend === 'function') {
                    DWLive.onQuestionSend(j);
                }
            });

            // 问答->返回答案
            Pusher.socket.on('answer', function (j) {
                if (typeof DWLive.onAnswer === 'function') {
                    DWLive.onAnswer(j);
                }
                if (typeof DWLive.onAnswerSend === 'function') {
                    DWLive.onAnswerSend(j);
                }
            });
        }
    };

    //事件兼容处理
    var Event = {};
    Event.addEvents = function (target, eventType, handle) {
        if (document.addEventListener) {
            Event.addEvents = function (target, eventType, handle) {
                target.addEventListener(eventType, handle, false);
            };
        } else {
            Event.addEvents = function (target, eventType, handle) {
                target.attachEvent('on' + eventType, function () {
                    handle.call(target, arguments);
                });
            };
        }
        ;
        Event.addEvents(target, eventType, handle);
    };

    var MobileLive = {

        src: '',
        audio: false,
        line: 0,

        init: function () {
            var _this = this;
            $.ajax({
                url: '//zeus.csslcloud.net/api/hls/play',
                type: 'GET',
                dataType: 'json',
                data: {roomid: DWLive.roomid, userid: DWLive.userid},
                success: function (data) {
                    var status = data.live.status;
                    if (status == 0) {
                        _this.m3u8 = data.live.m3u8;
                        _this.src = data.live.m3u8;

                        _this.secureHosts = data.live.secureHosts || [];
                        _this.audioM3u8 = data.live.audioM3u8 || [];
                        _this.audioSecureHosts = data.live.audioSecureHosts || [];
                        _this.isHttps = window.location.protocol === 'https:';
                        if (_this.isHttps && _this.secureHosts && _this.secureHosts.length) {
                            _this.m3u8 = _this.secureHosts;
                        }

                        _this.appendVideo(_this.m3u8[0]);

                        if (typeof DWLive.onLiveStarting === 'function') {
                            DWLive.onLiveStarting();
                        }

                        //ios解禁播放失败处理
                        var vd = $('#livePlayer>video')[0];
                        var index = 0;
                        var handle = function () {
                            if (index >= 3) {
                                vd.removeEventListener('error', handle);
                                return;
                            }
                            vd.removeEventListener('error', handle);
                            setTimeout(function () {
                                index++;
                                vd.src = vd.src;
                                Event.addEvents(vd, 'error', handle, false);
                            }, 1000);
                        };

                        Event.addEvents(vd, 'error', handle, false);

                    } else {
                        if (DWLive.isBan) {
                            $('#livePlayer').css({
                                'text-align': 'center',
                                'color': 'white',
                                'font-size': '18px',
                                'line-height': '232px'
                            });
                            $('#livePlayer').html('<p>直播已封禁，请联系管理员</p>');
                            return;
                        }
                    }

                }
            });
        },

        appendVideo: function (s) {
            var v = '<video webkit-playsinline playsinline controls autoplay x-webkit-airplay="allow" x5-playsinline width="100%" height="100%" src="' + s + '"></video>';
            $('#' + LivePlayer.id).html(v);

            DWLive.onKickOut = function () {
                $('#' + LivePlayer.id).html('');
            };
        },

        ban: function () {
            $('#livePlayer').css({
                'text-align': 'center',
                'color': 'white',
                'font-size': '18px',
                'line-height': '232px'
            });
            $('#livePlayer').html('<p>直播已封禁，请联系管理员</p>');
        },

        unban: function () {
            $('#livePlayer').css({
                'text-align': '',
                'color': '',
                'font-size': '',
                'line-height': ''
            });
            this.init();
        },

        end: function () {
            $('#' + LivePlayer.id).html('');
        },

        appendDoc: function (s) {
            var isHttps = window.location.protocol === 'https:';
            if (isHttps) {
                s = s.replace(/http:/g, 'https:');
            }

            var img = '<img src="' + s + '" />';
            $('#' + DrawPanel.id).html(img);
        },

        changeLine: function (line) {
            $('#' + LivePlayer.id).find('video').attr('src', this.m3u8[line]);
            this.line = line;

            if (MobileLive.audio) {
                audio.src = '';
                audio.src = this.m3u8[this.line];
                audio.play();
            }
        },

        onlyAudio: function () {
            var v = $('#' + LivePlayer.id).find('video');
            MobileLive.audio = !MobileLive.audio;
            if (MobileLive.audio) {
                if (this.isHttps && this.audioSecureHosts && this.audioSecureHosts.length) {
                    this.m3u8 = this.audioSecureHosts;
                } else {
                    this.m3u8 = this.audioM3u8;
                }
                audio = new Audio();
                audio.src = this.m3u8[this.line];
                audio.play();
            } else {
                if (this.isHttps && this.secureHosts && this.secureHosts.length) {
                    this.m3u8 = this.secureHosts;
                } else {
                    this.m3u8 = this.src;
                }
                audio.src = '';
                v.attr('src', this.m3u8[this.line]);
            }
        },

        isMobile: function () {
            if (this.isIPad() || this.isIPhone() || this.isAndroid() || this.isWindowsPhone()) {
                return 'isMobile';
            }
        },

        isIPad: function () {
            return navigator.userAgent.match(/iPad/i) != null;
        },

        isIPhone: function () {
            return navigator.userAgent.match(/iPhone/i) != null;
        },

        isAndroid: function () {
            return navigator.userAgent.match(/Android/i) != null;
        },

        isWindowsPhone: function () {
            return navigator.userAgent.match(/Windows Phone/i) != null;
        }

    };

    // 接受语音互动请求
    window.on_cc_live_accept_interaction = function (data) {
        DWLive.closeSound();

        // 清除请求超时计时器
        live.interaction.clearRequestTimeoutTimer();

        DWLive.enterInteractionRoom();

        live.interaction.isInteractioning = true;

        live.interaction.setCallingTimer();

        if (typeof window.on_cc_live_interaction_accept === 'function') {
            window.on_cc_live_interaction_accept(live.interaction.local.type, toJson(data));
        }
    };

    // 主动连接语音聊天信息
    window.on_cc_live_interaction_chatusers = function (data) {
        data = toJson(data);
        $.each(data, function (index, chatuser) {
            if (chatuser.id == DWLive.viewerid) {
                return true;
            }

            // 客户端只是和主播进行语音互动
            if (chatuser.role == 'publisher' && !chatuser.isMainSpeaker) {
                return true;
            }

            live.interaction.createOfferPeerConnection(chatuser);
        });

    };

    // 接收互动信息
    window.on_cc_live_interaction_message = function (d) {
        var d = toJson(d);

        debug('Interaction', 'rtc互动信息:' + JSON.stringify(d));

        var toId = d.toid;
        var fromId = d.fromid;
        var fromName = d.fromname;
        var type = d.type;
        var data = d.data;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        var event = d.event;

        if (event === 'offer') {
            data.type = event;

            live.interaction.createAnswerPeerConnection({
                id: fromId,
                name: fromName,
                type: type
            });

            var pc = live.interaction.usersPcs[fromId].pc;
            if (!pc) {
                return;
            }

            pc.setRemoteDescription(new nativeRTCSessionDescription(data));
            pc.createAnswer(function () {
            }, function (error) {
                debug('Interaction', 'Failure callback: ' + error);
            });

        } else if (event === 'answer') {
            var pc = live.interaction.usersPcs[fromId].pc;
            if (!pc) {
                return;
            }

            data.type = event;

            debug('Interaction', 'answer spark_message信息:' + data);
            pc.setRemoteDescription(new nativeRTCSessionDescription(data));

            pc.receivedAnswer = true;
            if (!pc.hasAddIce && pc.RTCICE) {
                pc.addIceCandidate(pc.RTCICE);
            }

        } else {
            var u = live.interaction.usersPcs[fromId];
            if (!u) {
                u = live.interaction.usersPcs[toId];
            }
            var pc = u ? u.pc : null;

            if (!pc) {
                return;
            }

            // 收到answer之后再addIce
            var ice = new RTCIceCandidate(data);
            if (pc.receivedAnswer) {
                pc.hasAddIce = true;
                pc.addIceCandidate(ice);
            } else {
                pc.hasAddIce = false;
                pc.RTCICE = ice;
            }

        }
    };

    // 打印debug信息
    var debug = function (t, d) {
        var isDegbug = false;
        if (!isDegbug) {
            return;
        }

        if (console && typeof console.log === 'function') {
            console.log(t, d);
        }
    };

    function toJson(data) {
        if (typeof data === 'string') {
            try {
                return JSON.parse(data);
            } catch (e) {
                return {};
            }
        }

        return data;
    }

    window.DWLive = DWLive;
    window.live = live;

    // live player ready
    window._swfInit = function () {
        if (typeof window.on_cc_live_player_ready === 'function') {
            window.on_cc_live_player_ready();
        }
    };

    /**
     * Flash 加载完成
     * */
    window._swfOk = function (id) {
        if (typeof window.on_cc_swf_loading_completed === 'function') {
            window.on_cc_swf_loading_completed(id);
        }
    };

    function getDeltaTime() {
        var b = LivePlayer.delay;
        if (isNaN(b) || b < 0) {
            b = 0;
        }
        b = b * 1000;

        // 低延迟
        if (MobileLive.isMobile() == 'isMobile') {
            if (b === 0) {
                return 5000;
            } else {
                return 10000;
            }
        } else {
            if (b === 0) {
                return 1300;
            } else {
                return 3000;
            }
        }
    }

})(window);