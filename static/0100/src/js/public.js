var jiaju = {
    api: '',
    //懒加载-s
    lazy: {
        effect: "fadeIn",
        threshold: 200,
        load: function(w1, h1) {
            var load_this = $(this),
                _this_parent_width, _this_parent_height, _this_width, _this_height;
            if (load_this.hasClass('auto')) {
                _this_parent_width = load_this.parents('.lazy').width();
                _this_parent_height = load_this.parents('.lazy').height();
                _this_width = w1;
                _this_height = h1;
                //              console.log(_this_width+"}"+_this_height)
                if (_this_parent_width / _this_parent_height < _this_width / _this_height) {
                    load_this.css({
                        width: 'auto',
                        height: '100%'
                    });
                    _this_width = _this_parent_height * w1 / h1;
                    load_this.css({
                        left: -(((_this_width - _this_parent_width) / 2) / _this_parent_width) * 100 + '%',
                        top: 0
                    });
                } else {
                    load_this.css({
                        width: '100%',
                        height: 'auto'
                    });
                    _this_height = _this_parent_width * h1 / w1;
                    load_this.css({
                        top: -(((_this_height - _this_parent_height) / 2) / _this_parent_height) * 100 + '%',
                        left: 0
                    });
                }
            } else if (load_this.hasClass('auto_height')) {
                load_this.css({
                    height: 'auto'
                });
            } else if (load_this.hasClass('height_middle')) {
                _this_parent_height = load_this.parents('.lazy').height();
                _this_parent_width = load_this.parents('.lazy').width();
                _this_height = _this_parent_width * h1 / w1;
                load_this.css({
                    top: -(((_this_height - _this_parent_height) / 2) / _this_parent_height) * 100 + '%',
                    left: 0
                });
            } else if (load_this.hasClass('auto_inner')) {
                _this_parent_width = load_this.parents('.lazy').width();
                _this_parent_height = load_this.parents('.lazy').height();
                _this_width = w1;
                _this_height = h1;
                //              console.log(_this_width+"}"+_this_height)
                if (_this_parent_width / _this_parent_height > _this_width / _this_height) {
                    load_this.css({
                        width: 'auto',
                        height: '100%'
                    });
                    _this_width = _this_parent_height * w1 / h1;
                    load_this.css({
                        left: -(((_this_width - _this_parent_width) / 2) / _this_parent_width) * 100 + '%',
                        top: 0
                    });
                } else {
                    load_this.css({
                        width: '100%',
                        height: 'auto'
                    });
                    _this_height = _this_parent_width * h1 / w1;
                    load_this.css({
                        top: -(((_this_height - _this_parent_height) / 2) / _this_parent_height) * 100 + '%',
                        left: 0
                    });
                }
            }
        }
    },
    //懒加载-e
    //ajax-s
    post: function(api, obj_json, fn) {
        //		jiaju.show_loading();
        $.post(jiaju.api + api, obj_json, function(data) {
            jiaju.hide_loading();
            if (data.status == 1) {
                if (fn) {
                    fn(data);
                }
            } else {
                jiaju.tips({
                    type: 'wrong',
                    content: data.msg
                });
            }
        }, 'json');
    },
    get: function(api, obj_json, fn) {
        //		jiaju.show_loading();
        $.get(jiaju.api + api, obj_json, function(data) {
            jiaju.hide_loading();
            if (data.status == 1) {
                if (fn) {
                    fn(data);
                }
            } else {
                jiaju.tips({
                    type: 'wrong',
                    content: data.msg
                });
            }
        }, 'json');
    },
    //ajax-e
    //自定义小方法-s
    scroll: 0,
    system: 'ios',
    view_scroll: function() {
        $('html,body').removeClass('no_scroll');
        $(window).scrollTop(jiaju.scroll)
        jiaju.scroll = 0;
    },
    load: ['<img src="http://icon.carimg.com/m/0201/loading.gif?v=1"> 正在加载中', '加载已完成！'],
    show_loading: function() {
        $('#ajax_loading').show(0);
    },
    hide_loading: function() {
        $('#ajax_loading').hide(0);
    },
    view_no_scroll: function() {
        jiaju.scroll = $(window).scrollTop();
        $('html,body').addClass('no_scroll');
    },
    view_scroll: function() {
        $('html,body').removeClass('no_scroll');
        $(window).scrollTop(jiaju.scroll)
        jiaju.scroll = 0;
    },
    //自定义小方法-e
    //下拉加载-s
    scroll_ajax_flag: true,
    page: function(txt, ajax_fn) {
        var $win = $(window);
        var $txt = $(txt);
        if ($txt.length <= 0) {
            return false;
        }
        $win.scroll(function() {
            if ($win.scrollTop() + 100 > $txt.offset().top - $win.height()) {
                ajax_fn($txt);
            }
        });
    },
    //下拉加载-e
    //warn-s
    tips: function(obj) {
        var $warn = $('#warn')
        $warn.find('em').html(obj.content);
        $warn.find('i')[0].className = "iconfont icon-" + obj.type;
        $warn.show();
        var time = obj.time ? obj.time : 2000;
        var tt = setTimeout(function() {
            $('#warn').hide();
            if (obj.fn) {
                obj.fn();
            }
            clearTimeout(tt);
        }, time);
    },
    url_attr: function(name) {
        var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
        var matcher = pattern.exec(location.href);
        var items = null;
        if (null != matcher) {
            try {
                items = decodeURIComponent(decodeURIComponent(matcher[1]));
            } catch (e) {
                try {
                    items = decodeURIComponent(matcher[1]);
                } catch (e) {
                    items = matcher[1];
                }
            }
        }
        return items;
    },
    url0_attr: function(name) {
        var pattern = new RegExp("[#&]" + name + "\=([^&]+)", "g");
        var matcher = pattern.exec(location.href);
        var items = null;
        if (null != matcher) {
            try {
                items = decodeURIComponent(decodeURIComponent(matcher[1]));
            } catch (e) {
                try {
                    items = decodeURIComponent(matcher[1]);
                } catch (e) {
                    items = matcher[1];
                }
            }
        }
        return items;
    },
    //表单错误提示
    formerror: function(e, t) {
        var err='',inputType='请输入',placeholder;
        if(e.attr('placeholder')){
            placeholder=e.attr('placeholder').replace('请输入','');
        }
        if(e.find('option').length){
            inputType='请选择';
        }
        switch(t){
            case '不能为空':
                var
                err=inputType+placeholder;
            break;
            case '请输入数字':
                err=t;
            break;
            default:
                err=placeholder+t;
        }
        notie.alert(3, err, 1.5);
        $(e).addClass('error').one('focus', function() {
            $(this).removeClass('error');
        });
        // var $box = $(e).parent(),
        //     $err = $box.find('div.form_error');
        // if ($err.length) {
        //     $err.text(t).show();
        // } else {
        //     $box.append('<div class="form_error">' + t + '</div>');
        // }
        // $(e).addClass('error').one('focus', function() {
        //     $(this).parent().find('div.form_error').hide();
        //     $(this).removeClass('error');
        // });
    },
    //公共表单验证支持异步提交
    submit: function(opt) {
        var $obj = $('#' + opt.id),
            error;
        if (typeof opt.error == 'function') {
            error = opt.error;
        } else {
            error = jiaju.formerror;
        }
        $obj.submit(function(e) {
            var b = $(this).validate({
                validate: {
                    pwd: function(e, err) {
                        if (!/^[0-9A-Za-z]{6,20}$/.test(e.val())) {
                            _error(e, 'pwd');
                            return false
                        }
                    }
                },
                messages: {
                    pwd: '请将密码设置为6-20位，并且由字母，数字和符号两种以上组合'
                },
                isone: true,
                error: error
            });
            if (b) {
                if (typeof opt.callback == 'function') {
                    return opt.callback(this);
                } else {
                    return true;
                }
            }
            return false;
        });
        $obj.find('[type=submit]')[0].disabled = false;
    },
    yuyue: function(obj) {
        jiaju.submit({
            id: 'yuyue',
            callback: function(e) {
                jiaju.show_loading();
                var $form = $(e);
                $form.find('[type=submit]')[0].disabled=true;
                $('#pc_url').val(window.location.href);
                var user_id = $.cookie('user_base_id');
                if (user_id !== undefined) {
                    $('#pc_userid').val(user_id);
                } else {
                    $('#pc_userid').val(0);
                }
                $.ajax({
                    url: $form.attr('action'),
                    dataType: "jsonp",
                    data: $form.serializeArray(),
                    success: function(d) {
                        jiaju.hide_loading();
                        var types;
                        if (d.status == 200) {
                            $form[0].reset();
                            types='correct';
                            //notie.alert(1, d.msg, 1.5);
                        } else {
                            types='wrong';
                        }
                        if(typeof obj!="undefined" && typeof obj.callback=="function"){
                            obj.callback(d);
                        }else{
                            jiaju.tips({
                                type:types,
                                content: d.msg
                            });
                        }
                        $form.find('[type=submit]')[0].disabled=false;
                    },
                    error: function() {
                        //alert('请求出错！');
                        jiaju.hide_loading();
                        $form.find('[type=submit]')[0].disabled=false;
                    }
                });
                return false;
            }
        });
    },
    //获取验证码用倒计时
    getcode: function(obj) {
        var t = obj.innerHTML,
            n = 60;
        (function() {
            if (n > 0) {
                obj.disabled = true;
                $(obj).addClass('disabled');
                obj.innerHTML = '倒计时' + (n--) + '秒';
                setTimeout(arguments.callee, 1000);
            } else {
                obj.disabled = false;
                obj.innerHTML = t;
                $(obj).removeClass('disabled');
            }
        })();
    },
    //活动倒计时
    countdown: function(opt) {
        //  1h = 3600 s
        //  1s = 1000 ms
        (function() {
            var t = null;
            var sTime = new Date(opt.date);
            var mydate = new Date();
            var T = Math.floor((sTime - mydate) / 1000);
            if (T <= 0) {
                clearTimeout(t);
                opt.obj.html(opt.txt).parents('.count').addClass('pass');
                return;
            }
            var D = Math.floor(T / (3600 * 24));
            var H = Math.floor((T - D * 24 * 3600) / 3600);
            var M = Math.floor((T / 60) - (D * 24 * 60 + H * 60));
            var S = T % 60;

            function setnum(d, t) {
                if (d === 0) {
                    return '';
                } else {
                    return d + t;
                }
            }

            var html = setnum(D, '天') + setnum(H, '小时') + setnum(M, '分') + S + '秒';
            opt.obj.html(html);
            t = setTimeout(function() {
                jiajuol.countdown(opt);
            }, 1000);
        })();
    },
    share: function($jsons) {
        var share_obj = new nativeShare({
            url: '',
            title: $jsons.title,
            desc: $jsons.description,
            img: $jsons.image,
            img_title: '家居在线',
            from: '家居在线'
        });
        $('<div class="share_body change_fixed"><div class="socials icon_h5"></div></div><section class=erweima><div><img src="><span>微信里点“发现”，扫一下<br>二维码便可将本文分享至朋友圈。</span></div></section>').appendTo('body');
        share_fn();
        $('.socials').share($jsons);
        $(document).on('click', '.shares', function() {
            if (!jiaju.share_flag) {
                $('.share_body').show().find('social-share').addClass('normal');
            }
        });
        // $('.social-share').on('click', '.icon-wechat', function() {
        //     $('.erweima').show();
        //     $('.erweima img').attr('src', $(this).find('.wechat-qrcode img').attr('src'))
        //
        // });
        $('.erweima div,.social-share').click(function(e) {
            e.stopPropagation();
        })
        $('.erweima,.share_body').click(function() {
            $(this).hide();
        })
    },
    //footer_href-s
    //go_phone-s
    phone: function(obj) {
        // $('<a href="https://static.meiqia.com/dist/standalone.html?eid=10466" class="iconfont icon-guanjiaowangtubiao11 go_phone" target="_blank"></a>').appendTo('body');
        // if (obj) {
        //     $('.go_phone').attr('href', obj);
        // };
    },
    //go_phone-e
    footer_value: function(json) {
            $('body').addClass('pd_b');
            var footer_arr = ['<a href="/free" class=flex1><span><i class="iconfont icon-baojiadan"></i>装修报价</span></a>', '<a href="/appoint" class=flex1><span><i class="iconfont icon-lease-resv-2homezaixian"></i>在线预约</span></a>', '<a href="" class=flex1><span><i class="iconfont icon-goumai"></i>预约购买</span></a>', '<a href="http://m.jiajuol.com/seller/0200/activity/activity_appoint.php?activity_id=38" class=flex1><span><i class="iconfont icon-baoming"></i>我要报名</span></a>', '<a href=tel:400-9230-798 class=flex1><span><i class="iconfont icon-dianhuayuyue"></i>电话预约</span></a>', '<a href=tel:400-9230-798 class=flex1><span><i class="iconfont icon-dianhuayuyue"></i>电话咨询</span></a>', '<a href="" class=flex1><span><i class="iconfont icon-dianping"></i>我要点评</span></a>','<a href="/appoint" class=flex1><span><i class="iconfont icon-lease-resv-2homezaixian"></i>预约到店</span></a>'];
            $('<section class="footer_href_body"><section class="footer_href change_fixed box fadeInUp"></section></section>').appendTo('body');
            var $footer_href = $('section.footer_href');
            var $footer_href_body = $('section.footer_href_body');
            for (var i = 0; i < json.arr.length; i++) {
                var $add = $(footer_arr[json.arr[i]]);
                if (json.arr_href) {
                    if (json.arr_href[i]) {
                        $add.attr('href', json.arr_href[i]);
                    }
                }
                $add.appendTo($footer_href);
            };
            $footer_href_body.show();
       },
        //footer_href-e
		shop_list:function(){
			if($.cookie('user_base_id') != undefined) {
				var c_user = false;
				var go_str = '';
				$('.shangpin_list li dl dd').find('p').addClass('active').html('我想买');

				$('.shangpin_list li dl dd').each(function(index, obj) {
					go_str += $(obj).attr('data-value') + ',';
					//console.log($(obj).attr('data-value'));
				});
				//console.log(go_str.slice(0,-1));
				$.get('/api/seller/goods/goods_price.php', {
					goods_id: go_str.slice(0, -1)
				}, function(data) {
					//console.log(data);
					var data = data;
					if(data.status == 200) {
						$('.shangpin_list li dl dd span').each(function(index, obj) {
							$(obj).html(data.data[index].price == 0 ? '到店更低' : '￥' + data.data[index].price);
						});
					}
				}, 'json')
			} else {
				var c_user = true;
				$('.shangpin_list li dl dd').find('span').html('劲爆底价').next().html('登录可见');

			}

			$('.shangpin_list li a').click(function(e) {
				if(c_user) {
					if($.cookie('user_base_id') != undefined) {
						location.reload();
						e.preventDefault();
					}
				}
			});
		},
        zan:function(obj){
            $('body').on('click',obj.dom,function(){
                var th=this;
                if($.cookie('user_base_id')){
                    if(th.flag){
                        return ;
                    }
                    if(obj.dom_target){
                        var $ajax_zan=$(this).find(obj.dom_target);
                    }else{
                        var $ajax_zan=$(this);
                    }
                    var action,txt;
                    var go_on=false;
                    th.flag=true;
                    var fnfn=function(){
                        jiaju.post('/api/collect/collect.php',{
                            action:action,
                            tid:$ajax_zan.attr('data-id')
                        },function(data){
                            th.flag=false;
                            data.target=$ajax_zan;
                            if(obj.fn){
                                obj.fn(data);
                            }
                        })
                    }
                    if(obj.action==1){
                        action='collectSubject';
                        if($ajax_zan.hasClass('on')){
                            action='deleteCollectSubject';
                            txt='是否取消收藏';
                        }
                    }else if(obj.action==2){
                        action='collectPhoto';
                        if($ajax_zan.hasClass('on')){
                            action='deleteCollectPhoto';
                            txt='是否取消收藏';
                        }
                    }

                    if(txt){
                        notie.confirm(txt, '是', '否',function() {
                            fnfn();
                            notie.alert('success', '已取消收藏',1.5);
                        }, function(){
                            th.flag=false;
                        })
                    }else{
                        fnfn();
                        notie.alert('success', '收藏成功',1.5)
                    }
                }else{
                    th.flag=false;
                    location='/service/login';
                }
            });
        },
        safari_tip:function(obj){
            var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
            if(ua.match(/WeiBo/i) == "weibo"){
                $('<div class="safari-tip fadeIn"><i class="fadeInUp"></i><div>').appendTo('body').on('touchmove',function(e){
                    e.preventDefault();
                }).on('touchend',function(){
                    $(this).hide();
                }).on('click',function(){
                    $(this).hide();
                });

                $('body').on('click',obj,function(e){
                    $('div.safari-tip').show();
                    e.preventDefault();
                })
            }
        }

};
$(function() {
    //懒加载-s
    jiaju.lazy_tt = setTimeout(function() {
        $(".lazy_img").lazyload(jiaju.lazy);
        clearTimeout(jiaju.lazy_tt);
    }, 300);
    //懒加载-e
    //fastclick-s
    window.addEventListener('load', function() {
        FastClick.attach(document.body);
    }, false);
    //fastclick-e
    //添加loading模块/S
    $("<section id='ajax_loading'><div><i></i></div></section>").appendTo('body');
    document.getElementById("ajax_loading").addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);
    //添加loading模块/E
    //警告框-s
    $('<section id="warn" class="change_fixed no_touch"><span class="warn"><i class=" iconfont"></i><em></em></span></section>').appendTo('body');
    $('<section id="input_bug">').appendTo('body');
    $('.no_touch').each(function(index, obj) {
        obj.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false);
    });
    //警告框-e
    //菜单/s
    jiaju.meun_img_flag = true;
    jiaju.meun_flag = false;
    $('body').on('click', '#meun_icon', function() {
        if (jiaju.meun_flag) {
            return false;
        }
        var $_this = $(this);
        if ($_this.hasClass('on')) {
            $('.top-hrefs').show();
            if(jiaju.view_show){
                $('.close_view').show();
                $('.top-hrefs').hide();
            }else{
                $('.close_view').hide();
            }
            $_this.removeClass('on')
            $('#public_meun').removeClass('zoom_big').addClass('zoom_small');
            $('div.black_block').stop().fadeOut();
            jiaju.view_scroll();
            jiaju.meun_flag = true;
            var tt = setTimeout(function() {
                $('#public_meun').hide();
                $('#public_meun').addClass('zoom_big').removeClass('zoom_small');
                jiaju.meun_flag = false;
                clearTimeout(tt);
            }, 500)
        } else {
            $('#public_meun').show(); 
            if(jiaju.view_show){
                $('.close_view').show();
                $('.top-hrefs').hide();
            }else{
                $('.close_view').hide();
            }
            $('div.black_block').stop().fadeIn();

            jiaju.meun_flag = true;
            var tts = setTimeout(function() {
                jiaju.view_no_scroll();
                jiaju.meun_flag = false;
                clearTimeout(tts);
            }, 500);
            if (jiaju.meun_img_flag) {
                jiaju.meun_img_flag = false;
                $('#public_meun .lazy_img').lazyload(jiaju.lazy);
            }
            $_this.addClass('on');
        }
    });
    //菜单/e
    //footer高度/s
    $('footer').height($('.footer').height()+30);
    //footer高度/e 
    //input_close/s
    jiaju.input_tt = '';
    jiaju.location_flag = true;
    $(document).on('click', '.input i.icon-guanbi', function() {
        $(this).removeClass('has_close').siblings('input').val('');
    });
    $(document).on('input', '.input input', function() {
        if ($(this).val()) {
            $(this).siblings('i.icon-guanbi').addClass('has_close');
        } else {
            $(this).siblings('i.icon-guanbi').removeClass('has_close');
        }
    }).on('focus', '.input input', function() {
        if ($(this).val()) {
            $(this).siblings('i.icon-guanbi').addClass('has_close');
        } else {
            $(this).siblings('i.icon-guanbi').removeClass('has_close');
        };
    }).on('blur', '.input input', function() {
        var $this = $(this);
        if (jiaju.input_tt) {
            clearTimeout(jiaju.input_tt);
        };
        jiaju.input_tt = setTimeout(function() {
            $this.siblings('i.icon-guanbi').removeClass('has_close');
        }, 400);
    }).on('focus', '#word', function(e) {
        $('#input_bug').show();
        $('section.search_hot').addClass('search_font');
        jiaju.view_no_scroll();
        window.scrollTo(0, 0);
        $('#public_title').css('position', 'absolute');
        var $this = $(this);
    }).on('blur', '#word', function() {
        $('#public_title').css('position', 'fixed');
        jiaju.view_scroll();
        $('#input_bug').hide();
        $('section.search_hot').removeClass('search_font');
    }).on('click','.need_href',function(e){
        e.preventDefault();
        location.href=$(this).attr('href');
        return false;
    });
    //input_close/e
    //判断平台-s
    if (!(navigator.userAgent).match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        jiaju.system = 'android';
    }
    //判断平台-e
    //notice bug
    $('body').on('click','#notie-confirm-background',function(){$('#notie-confirm-no').click()})
    //hearder search-s
    $('#public_search_input').on('click', '.search_select', function() {
        $('.select_list_body').show();
    }).on('click', '.select_list_body', function() {
        $(this).hide();
    }).on('click', '.public_share', function() {});
    $('#public_search_input').on('click', '.search_select_list span', function() {
        $('.search_select i.selected').html($(this).html());
        $('#public_search_input').attr('action', $(this).attr('data-href')).find('#search_select option').val($(this).attr('data-action'));
        $('input#word').focus();
        $('section.search_hot div').stop().hide().eq($(this).index()).fadeIn();
    });
    $('#public_search_input').submit(function(e) {
        if ($.trim($('#word').val()) == '') {
            e.preventDefault();
        }
    });
    //hearder search-e
    //返回箭头-s
    $('body').on('click', '.url_back', function() {
        history.go(-1);
        return false;
    });
    //返回箭头-e
    //返回顶部s
    $('<div class="go_top iconfont icon-fanhuidingbu"></div>').appendTo('body').click(function() {
        $('html,body').stop().animate({
            scrollTop: 0
        }, 500);
    });
    $('<a href="https://static.meiqia.com/dist/standalone.html?eid=10466" class="iconfont icon-guanjiaowangtubiao11 go_phone" target="_blank"></a>').appendTo('body');
    //返回顶部e
    var $go_top = $('.go_top');
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
            $go_top.show();
        } else {
            $go_top.hide();
        }
    });
    //返回顶部e
    var now_title = $('body').attr('data-title');
    if (page_title) {
        $('#title_title1 div').html(page_title).show();
    } else {
        $('#title_title1 div').html(now_title).show();
    };
    $('body').on('touchmove','#notie-select-background',function(e){
    	e.preventDefault();
    });
    //菜单登录是否/s
    if ($.cookie('user_base_id')) {
        var now_login = $('.logins').eq(1);
        now_login.addClass('on').find('img').attr('data-original', $.cookie('imgfile'));
        now_login.find('.ellipsis i').html($.cookie('nickname'));
        now_login.find('.button').click(function() {
            jiaju.show_loading();
            $.ajax({
                type: "get",
                async: false,
                url: "http://service.jiajuol.com/ajax/ajaxUserCtl.php",
                dataType: "jsonp",
                success: function(data) {
                    jiaju.hide_loading();

                    if (data.status == 200) {
                        location.reload();
                    } else {
                        layer.alert(data.msg);
                    }
                },
                error: function() {
                    //alert('fail');
                }
            });
        })
        }
        else {
            $('.logins').eq(0).addClass('on');
        }
        //菜单登录是否/e
});

//临时头尾
if (window.location.href.indexOf('m.jiajuol.com') < 0) {
    $('<div/>').load('public/header.html', function() {
        $('#title_title1').html(document.title)
    }).prependTo("body");
    $('<div/>').load('public/footer.html').appendTo("body");
}
// 顶部分类筛选
;(function() {
    var $layer = $('.catTab .tabLayer');
    $('.catTab').on('click', 'li', function() {
        var index = $(this).index(),
            $this = $(this)
        if ($this.hasClass('active')) {
            $this.removeClass('active');
            $layer.hide(0, function() {
                $(this).children("div").hide(0);
            });
            $('#catTab_black').hide();
        } else {
            $this.addClass('active').siblings().removeClass('active');
            $layer.children('div').eq(index).siblings('div').hide(0).end().show(0, function() {
                $layer.show();
            });
            $('#catTab_black').show();
        };
    });
    $layer.on('click', 'div a', function() {
        $(this).addClass('active').siblings('a').removeClass('active');
    });
    $('#catTab_black').on('touchmove', function() {
        $('.catTab li').removeClass('active');
        $layer.hide(0, function() {
            $(this).children("div").hide(0);
        });
        $('#catTab_black').hide();
    })
})();
/*
  @ Name:图片上传依赖jquery.form
  @ Author:xusl
  @ date:2016-8-29
  @ example:
    $('.imgUpload').imgUpload({
        url:'http://172.0.0.1:8000',
        data:{},
        before:function(e){      //e:当前对象
            alert('上传开始...');
            //return false //如果返回false则不进行上传
        },
        success:function(e,data){   //e:当前对象,data:返回的完整数据
            alert('上传完毕...');
        },
        error:function(e){      //e:当前对象
            alert('接口异常！');
        }
    });
*/
(function($) {
    $.fn.imgUpload = function(opt) {
        var $this = $(this);
        var $form = $('<form method="post" enctype="multipart/form-data"><input type="file" accept="image/gif,image/jpeg,image/jpg,image/png" name="file"></form>');
        $this.click(function(event) {
            var _self=$(this);
            if(_self.hasClass('disabled')){
                return;
            }
            $form[0].reset();
            $form.find(':file').one('change', function(ev) {
                _self.addClass('disabled');
                // 加载开始执行回调
                if (typeof opt.before == 'function') {
                    if(opt.before($this,ev)===false){
                        return;
                    }
                }
                //上传中
                var options = {
                    url: opt.url,
                    dataType: "json",
                    data: opt.data ? opt.data : {},
                    success: function(data) {
                        //成功上传执行回调
                        opt.success($this,data);
                        _self.removeClass('disabled');
                    },
                    error: function(e) {
                        //接口异常执行回调
                        if (typeof opt.error == 'function') {
                            opt.error($this);
                        }
                        _self.removeClass('disabled');
                    }
                }
                $form.ajaxSubmit(options);
            }).trigger('click');
        });
    }
})(jQuery);
