(function($, window) {

    var template = '<div id="{{id}}" class="mui-slider mui-preview-image mui-fullscreen"><div class="mui-preview-header">{{header}}</div><div class="mui-slider-group"></div><div class="mui-preview-footer mui-hidden">{{footer}}</div><div class="mui-preview-loading"><span class="mui-spinner mui-spinner-white"></span></div></div>';
    var itemTemplate = '<div class="mui-slider-item mui-zoom-wrapper {{className}}"><div class="mui-zoom-scroller"><img src="{{src}}" data-preview-lazyload="{{lazyload}}" style="{{style}}" class="mui-zoom"></div></div>';
    var defaultGroupName = '__DEFAULT';
    var div = document.createElement('div');
    var imgId = 0;
    var PreviewImage = function(options) {
        this.options = $.extend(true, {
            id: '__MUI_PREVIEWIMAGE',
            zoom: true,
            header: '<span class="mui-preview-indicator"></span>',
            footer: ''
        }, options || {});
        this.init();
        this.initEvent();
    };
    var proto = PreviewImage.prototype;
    proto.init = function() {
        var options = this.options;
        var el = document.getElementById(this.options.id);
        if (!el) {
            div.innerHTML = template.replace(/\{\{id\}\}/g, this.options.id).replace('{{header}}', options.header).replace('{{footer}}', options.footer);
            document.body.appendChild(div.firstElementChild);
            el = document.getElementById(this.options.id);
        }

        this.element = el;
        this.scroller = this.element.querySelector($.classSelector('.slider-group'));
        this.indicator = this.element.querySelector($.classSelector('.preview-indicator'));
        this.loader = this.element.querySelector($.classSelector('.preview-loading'));
        if (options.footer) {
            this.element.querySelector($.classSelector('.preview-footer')).classList.remove($.className('hidden'));
        }
        this.addImages();
    };
    proto.initEvent = function() {
        var self = this;
        $(document.body).on('click', 'img[data-preview-src]', function() {
            self.open(this);
            return false;
        });
        var laterClose = null;
        var laterCloseEvent = function() {
            !laterClose && (laterClose = $.later(function() {
                self.loader.removeEventListener('click', laterCloseEvent);
                self.scroller.removeEventListener('click', laterCloseEvent);
                self.close();
            }, 300));
        };
        this.scroller.addEventListener('doubletap', function() {
            if (laterClose) {
                laterClose.cancel();
                laterClose = null;
            }
        });
        this.element.addEventListener('webkitAnimationEnd', function() {
            if (self.element.classList.contains($.className('preview-out'))) { //close
                self.element.style.display = 'none';
                self.element.classList.remove($.className('preview-out'));
                self.element.classList.remove($.className('preview-in'));
                laterClose = null;
            } else { //open
                //				self.loader.addEventListener('tap', laterCloseEvent);
                //				self.scroller.addEventListener('tap', laterCloseEvent);
            }
        });
        this.element.addEventListener('slide', function(e) {
            if (self.options.zoom) {
                var lastZoomerEl = self.element.querySelector('.mui-zoom-wrapper:nth-child(' + (self.lastIndex + 1) + ')');
                if (lastZoomerEl) {
                    $(lastZoomerEl).zoom().setZoom(1);
                }
            }
            if (jiaju.transition) {
                jiaju.transition(e.detail.slideNumber);
            }
            var slideNumber = e.detail.slideNumber;
            self.lastIndex = slideNumber;
            self.indicator && (self.indicator.innerText = (slideNumber + 1) + '/' + self.currentGroup.length);
            self._loadItem(slideNumber);

        });
    };
    proto.addImages = function(group, index) {
        this.groups = {};
        var imgs = [];
        if (group) {
            if (group === defaultGroupName) {
                imgs = document.querySelectorAll("img[data-preview-src]:not([data-preview-group])");
            } else {

                imgs = jiaju.prev_imgs = document.querySelectorAll("img[data-preview-src][data-preview-group='" + group + "']");
                if (typeof(zoom_img_list) != 'undefined') {
                    var list_left = document.querySelectorAll('.list_left img[data-preview-src]');
                    var list_right = document.querySelectorAll('.list_right img[data-preview-src]');
                    if (list_left.length > list_right.length) {
                        var now_list = list_left;
                    } else {
                        var now_list = list_right;
                    }
                    var now_imgs = [];
                    if (imgs.length > 1) {
                        for (var n = 0; n < now_list.length; n++) {
                            now_imgs.push(list_left[n])
                            if (list_right[n]) {
                                now_imgs.push(list_right[n])
                            }
                        }
                    } else {
                        now_imgs = list_left;
                    }
                    imgs = now_imgs;
                    jiaju.prev_imgs = now_imgs;
                }
            }
        } else {
            imgs = document.querySelectorAll("img[data-preview-src]");
        }
        if (imgs.length) {
            //console.log(imgs)

            for (var i = 0, len = imgs.length; i < len; i++) {
                this.addImage(imgs[i]);
            }
        }
    };
    proto.addImage = function(img) {
        //		console.log(img)
        if (!img) {
            return false;
        }
        var group = img.getAttribute('data-preview-group');
        group = group || defaultGroupName;
        if (!this.groups[group]) {
            this.groups[group] = [];
        }
        var src = img.getAttribute('data-original');
        if (img.__mui_img_data && img.__mui_img_data.src === src) { //已缓存且图片未变化
            this.groups[group].push(img.__mui_img_data);
        } else {
            var lazyload = img.getAttribute('data-preview-src');
            if (!lazyload) {
                lazyload = src;
            }
            var imgObj = {
                src: src,
                lazyload: src === lazyload ? '' : lazyload,
                loaded: src === lazyload ? true : false,
                sWidth: 0,
                sHeight: 0,
                sTop: 0,
                sLeft: 0,
                sScale: 1,
                el: img
            };
            this.groups[group].push(imgObj);
            img.__mui_img_data = imgObj;
        }
    };

    proto.empty = function() {
        this.scroller.innerHTML = '';
    };
    proto._initImgData = function(itemData, imgEl) {
        if (!itemData.sWidth) {
            var img = itemData.el;
            itemData.sWidth = img.offsetWidth;
            itemData.sHeight = img.offsetHeight;
            var offset = $.offset(img);
            itemData.sTop = offset.top;
            itemData.sLeft = offset.left;
            itemData.sScale = 1; //Math.max(itemData.sWidth / window.innerWidth, itemData.sHeight / window.innerHeight);
        }
        imgEl.style.webkitTransform = 'translate3d(0,0,0) scale(' + itemData.sScale + ')';
    };

    proto._getScale = function(from, to) {
        var scaleX = from.width / to.width;
        var scaleY = from.height / to.height;
        var scale = 1;
        if (scaleX <= scaleY) {
            scale = from.height / (to.height * scaleX);
        } else {
            scale = from.width / (to.width * scaleY);
        }
        return scale;
    };
    proto._imgTransitionEnd = function(e) {
        //		console.log(e)
        //		if(jiaju.transition) {
        //			console.log(22)
        //
        //		}
        var img = e.target;
        img.classList.remove($.className('transitioning'));
        img.removeEventListener('webkitTransitionEnd', this._imgTransitionEnd.bind(this));
    };
    proto._loadItem = function(index, isOpening) { //TODO 暂时仅支持img
        var itemEl = this.scroller.querySelector($.classSelector('.slider-item:nth-child(' + (index + 1) + ')'));
        var itemData = this.currentGroup[index];
        var imgEl = itemEl.querySelector('img');
        this._initImgData(itemData, imgEl);
        if (isOpening) {
            // var posi = this._getPosition(itemData);
            // imgEl.style.webkitTransitionDuration = '0ms';
            // imgEl.style.webkitTransform = 'translate3d(' + posi.x + 'px,' + posi.y + 'px,0) scale(' + itemData.sScale + ')';
            // imgEl.offsetHeight;
        }
        if (!itemData.loaded && imgEl.getAttribute('data-preview-lazyload')) {
            var self = this;
            self.loader.classList.add($.className('active'));
            //移动位置动画
            imgEl.style.webkitTransitionDuration = '0.5s';
            imgEl.addEventListener('webkitTransitionEnd', self._imgTransitionEnd.bind(self));
            imgEl.style.webkitTransform = 'translate3d(0,0,0) scale(' + itemData.sScale + ')';
            this.loadImage(imgEl, function() {
                itemData.loaded = true;
                imgEl.src = itemData.lazyload;
                self._initZoom(itemEl, this.width, this.height);
                imgEl.classList.add($.className('transitioning'));
                imgEl.addEventListener('webkitTransitionEnd', self._imgTransitionEnd.bind(self));
                imgEl.setAttribute('style', '');
                imgEl.offsetHeight;
                self.loader.classList.remove($.className('active'));
            });
        } else {
            itemData.lazyload && (imgEl.src = itemData.lazyload);
            this._initZoom(itemEl, imgEl.width, imgEl.height);
            imgEl.classList.add($.className('transitioning'));
            imgEl.addEventListener('webkitTransitionEnd', this._imgTransitionEnd.bind(this));
            imgEl.setAttribute('style', '');
            imgEl.offsetHeight;
        }
        this._preloadItem(index + 1);
        this._preloadItem(index - 1);
    };
    proto._preloadItem = function(index) {
        var itemEl = this.scroller.querySelector($.classSelector('.slider-item:nth-child(' + (index + 1) + ')'));
        if (itemEl) {
            var itemData = this.currentGroup[index];
            if (!itemData.sWidth) {
                var imgEl = itemEl.querySelector('img');
                this._initImgData(itemData, imgEl);
            }
        }
    };
    proto._initZoom = function(zoomWrapperEl, zoomerWidth, zoomerHeight) {
        if (!this.options.zoom) {
            return;
        }
        if (zoomWrapperEl.getAttribute('data-zoomer')) {
            return;
        }
        var zoomEl = zoomWrapperEl.querySelector($.classSelector('.zoom'));
        if (zoomEl.tagName === 'IMG') {
            var self = this;
            var maxZoom = self._getScale({
                width: zoomWrapperEl.offsetWidth,
                height: zoomWrapperEl.offsetHeight
            }, {
                width: zoomerWidth,
                height: zoomerHeight
            });
            $(zoomWrapperEl).zoom({
                maxZoom: Math.max(maxZoom, 1)
            });
        } else {
            $(zoomWrapperEl).zoom();
        }
    };
    proto.loadImage = function(imgEl, callback) {
        var onReady = function() {
            callback && callback.call(this);
        };
        var img = new Image();
        img.onload = onReady;
        img.onerror = onReady;
        img.src = imgEl.getAttribute('data-preview-lazyload');
    };
    proto.getRangeByIndex = function(index, length) {
        return {
            from: 0,
            to: length - 1
        };
        //		var from = Math.max(index - 1, 0);
        //		var to = Math.min(index + 1, length);
        //		if (index === length - 1) {
        //			from = Math.max(length - 3, 0);
        //			to = length - 1;
        //		}
        //		if (index === 0) {
        //			from = 0;
        //			to = Math.min(2, length - 1);
        //		}
        //		return {
        //			from: from,
        //			to: to
        //		};
    };

    proto._getPosition = function(itemData) {
        var sLeft = itemData.sLeft - window.pageXOffset;
        var sTop = itemData.sTop - window.pageYOffset;
        var left = (window.innerWidth - itemData.sWidth) / 2;
        var top = (window.innerHeight - itemData.sHeight) / 2;
        return {
            left: sLeft,
            top: sTop,
            x: sLeft - left,
            y: sTop - top
        };
    };
    proto.refresh = function(index, groupArray) {
        //console.log(index);
        if (jiaju.odd) {
            var now_arr = [];
            var now_length = Math.ceil(groupArray.length / 2);
            //console.log(now_length);
            for (var i = 0, len = now_length; i < len; i++) {
                now_arr.push(groupArray[i]);
                now_arr.push(groupArray[i + now_length]);
            }
            if (index) {
                if (index >= now_length) {
                    index = (index - now_length) * 2 + 1
                } else {
                    index = (index) * 2
                }
            }
			groupArray = now_arr;

        }

        //console.log('ss' + index);

        this.currentGroup = groupArray;
        //重新生成slider
        var length = groupArray.length;
        var itemHtml = [];
        var currentRange = this.getRangeByIndex(index, length);
        var from = currentRange.from;
        var to = currentRange.to + 1;
        var currentIndex = index;
        var className = '';
        var itemStr = '';
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;
        for (var i = 0; from < to; from++, i++) {
            var itemData = groupArray[from];
            var style = '';
            if (itemData.sWidth) {
                style = '-webkit-transform:translate3d(0,0,0) scale(' + itemData.sScale + ');transform:translate3d(0,0,0) scale(' + itemData.sScale + ')';
            }
            //console.log(itemData);
            itemStr = itemTemplate.replace('{{src}}', itemData.src).replace('{{lazyload}}', itemData.lazyload).replace('{{style}}', style);
            if (from === index) {
                currentIndex = i;
                className = $.className('active');
            } else {
                className = '';
            }
            itemHtml.push(itemStr.replace('{{className}}', className));
        }
        this.scroller.innerHTML = itemHtml.join('');
        this.element.style.display = 'block';
        this.element.classList.add($.className('preview-in'));
        this.lastIndex = currentIndex;
        this.element.offsetHeight;
        $(this.element).slider().gotoItem(currentIndex, 0);
        this.indicator && (this.indicator.innerText = (currentIndex + 1) + '/' + this.currentGroup.length);
        this._loadItem(currentIndex, true);
    };
    proto.openByGroup = function(index, group) {
        index = Math.min(Math.max(0, index), this.groups[group].length - 1);
        this.refresh(index, this.groups[group]);
    };
    proto.open = function(index, group) {
        // if(this.isShown()) {
        // 	return;
        // }
        if (typeof index === "number") {
            //console.log('1');
            group = group || defaultGroupName;
            this.addImages(group, index); //刷新当前group
            this.openByGroup(index, group);
        } else {

        //    console.log('2');

            group = index.getAttribute('data-preview-group');
            group = group || defaultGroupName;
            this.addImages(group, index); //刷新当前group
            this.openByGroup(this.groups[group].indexOf(index.__mui_img_data), group);
        }
    };
    proto.close = function(index, group) {
        if (!jiaju.view_close_flag) {
            return false;
        }
        if (!this.isShown()) {
            return;
        }
        this.element.classList.remove($.className('preview-in'));
        this.element.classList.add($.className('preview-out'));
        var itemEl = this.scroller.querySelector($.classSelector('.slider-item:nth-child(' + (this.lastIndex + 1) + ')'));
        var imgEl = itemEl.querySelector('img');
        if (imgEl) {

            imgEl.classList.add($.className('transitioning'));
            var itemData = this.currentGroup[this.lastIndex];
            var posi = this._getPosition(itemData);
            var sLeft = posi.left;
            var sTop = posi.top;

            if (sTop > window.innerHeight || sLeft > window.innerWidth || sTop < 0 || sLeft < 0) { //out viewport
                imgEl.style.opacity = 0;
                imgEl.style.webkitTransitionDuration = '0.5s';
                imgEl.style.webkitTransform = 'scale(' + itemData.sScale + ')';
            } else {
                if (this.options.zoom) {
                    $(imgEl.parentNode.parentNode).zoom().toggleZoom(0);
                }
                imgEl.style.webkitTransitionDuration = '0.5s';
                imgEl.style.webkitTransform = 'translate3d(' + posi.x + 'px,' + posi.y + 'px,0) scale(' + itemData.sScale + ')';
            }
        }
        var zoomers = this.element.querySelectorAll($.classSelector('.zoom-wrapper'));
        for (var i = 0, len = zoomers.length; i < len; i++) {
            $(zoomers[i]).zoom().destroy();
        }
        $(this.element).slider().destroy();
        //		this.empty();
    };
    proto.isShown = function() {
        return this.element.classList.contains($.className('preview-in'));
    };

    var previewImageApi = null;
    $.previewImage = function(options) {
        if (!previewImageApi) {
            previewImageApi = new PreviewImage(options);
        }
        return previewImageApi;
    };
    $.getPreviewImage = function() {
        return previewImageApi;
    }

})(mui, window);
jiaju.view_img = function(view_json) {
    if (view_json.if_num) {
        $('.title_icons').append('<section id="view_num">');
    }

    if (view_json.pic) {
        jiaju.pic = true;
    }
    if (view_json.odd) {
        jiaju.odd = true;
    }
    jiaju.view_close_flag = true;
    jiaju.tran_flag = true;
    if (view_json.fn_tran) {
        jiaju.tran_fn_flag = true;
        jiaju.tran_fn = view_json.fn_tran;
    }
    jiaju.transition = function(obj) {
        //		$('.mui-zoom').index(obj)
        view_fonts.eq(obj).addClass('show').siblings().removeClass('show');
        jiaju.now_view = obj;
        if (jiaju.tran_fn_flag) {
            jiaju.tran_fn(obj + 1, jiaju.prev_imgs.length)
        }
        // var view_imgs = $('[data-preview-group]');
        if (jiaju.view_imgs.eq(obj).attr('data-href')) {
            $('#add_pic_href').attr('href', jiaju.view_imgs.eq(obj).attr('data-href')).show();
        } else {
            $('#add_pic_href').hide()
        }
        $('section#view_num').html((obj + 1) + '/' + jiaju.prev_imgs.length);
        /*var all_prev_img=$('.mui-zoom-scroller img');
		if(all_prev_img.eq(obj+1).attr('data-preview-lazyload')){
			var img1=new Image();
			var $img1=all_prev_img.eq(obj+1);
			img1.src=$img1.attr('data-preview-lazyload');
			img1.onload=function(){
				$img1.attr('src',this.src);
			}
//			console.log(img1.src)

		}
		if(all_prev_img.eq(obj-1).attr('data-preview-lazyload')){
			var img2=new Image();
			img2.src=all_prev_img.eq(obj-1).attr('data-preview-lazyload');
			all_prev_img.eq(obj-1).attr('src',img2.src);
			img2.onload=function(){
				all_prev_img.eq(obj-1).attr('src',this.src);
			}
//			console.log(img2.src)
		}*/
        if (typeof(zoom_img_list) != 'undefined') {
            //			console.log($(jiaju.prev_imgs).eq(obj).attr('data-id'))
            $.post("/api/user/visit.php", {
                'action': 'AddRecords',
                'sid': $(jiaju.prev_imgs).eq(obj).attr('data-id'),
                'type': 3
            }, function(data) {
                //记录不成功暂不处理
                //				console.log(data);
            }, 'json');
        }
        if (view_json.last_dom) {
            if ($('.mui-zoom').index(obj) == view_fonts.length - 1) {
                last_content.find('img.lazy_img').lazyload(jiaju.lazy);
            }
        }
    }
    var mui_views = mui.previewImage();
    $('body').on('click', 'a', function() {
        if ($(this).attr('target')) {
            window.open(this.href)
        } else {
            if (this.href) {
                location.href = this.href;
            }
        }
    });
    $('.footer_href a').eq(0).click(function(e) {
        e.preventDefault();
    });
    var $view_body = $('<section class="view_fonts_body change_fixed">').appendTo('body');
    var $close_view = $('<button class="close_view iconfont icon-close01">').appendTo('body').click(function() {
        mui_views.close();
        if (jiaju.pic) {
            $('body').addClass('title7').removeClass('title-pic')
        }
        $('section.footer_href').removeClass('footer_href_add').html(jiaju.footer_html);
        clearInterval(img_load_tt);
        jiaju.view_show = false;
        $('.title_btn').show();
        $('.top-hrefs').show();
        $('#public_title,.footer_href').stop().fadeIn();
        $close_view.hide();
        $view_body.hide();
        clearTimeout(setTT);
        $('section#view_num').hide();
    });
    var view_fonts = $('div.view_fonts');
    var now_tap_num = 0;
    if (view_json.last_dom) {
        var last_content = $(view_json.last_dom).clone(true);
    }
    var setTT;
    var img_load_tt;
    $('body').on('click', '[data-preview-group]', function() {
        jiaju.view_imgs = $('[data-preview-group]');
        if (jiaju.odd) {
            //console.log(jiaju.view_imgs);
            var now_lenth = Math.ceil(jiaju.view_imgs.length / 2);
            var now_arr = [];
            jiaju.view_imgs.each(function(index, obj) {
                if (index < now_lenth) {
                    now_arr.push(obj);
                    // if(now_lenth%2){
                    // 	now_arr.push(jiaju.view_imgs.eq(index+(now_lenth-1)));
                    // }else{
                    now_arr.push(jiaju.view_imgs.eq(index + now_lenth)[0]);
                    // }

                }
            })
            jiaju.view_imgs = $(now_arr);

        }
        if (!jiaju.footer_html) {
            //jiaju.footer_html=$('section.footer_href').addClass('footer_href_add').html();
        }

        //$('section.footer_href').html('<a class="flex1"><span><i class="iconfont icon-xihuan"></i></span></a><a href="/free" class="flex1"><span><i class="iconfont icon-baojiadan"></i></span></a><a href="tel:400-9230-798" class="flex1"><span><i class="iconfont icon-dianhuayuyue"></i></span></a>')
        now_tap_num = jiaju.view_imgs.index(this);
        if (jiaju.pic) {
            $('body').removeClass('title7').addClass('title-pic');
            if (jiaju.view_imgs.eq(now_tap_num).attr('data-href')) {
                $('#add_pic_href').attr('href', jiaju.view_imgs.eq(now_tap_num).attr('data-href')).show();
            } else {
                $('#add_pic_href').hide()
            }
        }
        $close_view.show();
        img_load_tt = setInterval(function() {
            // var all_prev_img=$('.mui-zoom-scroller img');
            var now_view_img = $('.mui-active');
            if (now_view_img.next().length) {
                var $img1 = now_view_img.next().find('.mui-zoom-scroller img');
                var img1 = new Image();
                img1.src = $img1.attr('data-preview-lazyload');
                img1.onload = function() {
                    $img1.attr('src', this.src);
                }
            };
            if (now_view_img.prev().length) {
                var $img2 = now_view_img.prev().find('.mui-zoom-scroller img');
                var img2 = new Image();
                img2.src = $img2.attr('data-preview-lazyload');
                img2.onload = function() {
                    $img2.attr('src', this.src);
                }
            };
        }, 500)
        jiaju.view_show = true;
        setTT = setTimeout(function() {
            if ($('.mui-slider-group').hasClass('flag')) {

            } else {
                if (!jiaju.meun_flag) {
                    $('.mui-slider-group').addClass('flag');
                    $('.close_view,#public_title,.view_fonts_body,.footer_href').stop().fadeOut();
                }

            }
            clearTimeout(setTT);
        }, 2000)
        $('.title_btn').hide();
        jiaju.now_tap = this;
        var tt1 = setTimeout(function() {
            if (typeof(zoom_img_list) != 'undefined') {
                view_imgs = $(jiaju.prev_imgs);
                now_tap_num = view_imgs.index(jiaju.now_tap);
            }
            //			var slice = view_fonts.length - 1 < 0 ? 0 : view_fonts.length - 1;
            var view_imgs_slice = jiaju.view_imgs;
            //			.slice(slice);
            $view_body.html('');
            view_imgs_slice.each(function(index, obj) {

                var data = {
                    font: $(obj).attr('data-font'),
                    num: Number($(obj).attr('data-num')),
                    id: $(obj).attr('data-id'),
                    red_flag: $(obj).parents('section').find('.collect_img').hasClass('now'),
                    red_flag1: $(obj).hasClass('on')
                };
                if (index == view_imgs_slice.length - 1 && view_json.last_dom) {
                    data.last = true;
                } else {
                    data.last = false;
                }
                if (!view_json.no_fonts) {
                    $view_body.append(template('view_module', data));
                }

            });
            view_fonts = $('div.view_fonts');
            $view_body.show();
            //$('section#view_num').show();  xusl as 2016-10-11
            view_fonts.eq(now_tap_num).addClass('show').siblings().removeClass('show');
            if (view_json.last_dom) {
                $('.mui-zoom-wrapper').last().append(last_content);
                last_content.show();
                last_content.find('img').lazyload(jiaju.lazy);
                $(window).scroll();
            }
           $('section#view_num').html((now_tap_num + 1) + '/' + jiaju.prev_imgs.length);

            if (typeof(zoom_img_list) != 'undefined') {
                $.post("/api/user/visit.php", {
                    'action': 'AddRecords',
                    'sid': $(jiaju.prev_imgs).eq(now_tap_num).attr('data-id'),
                    'type': 3
                }, function(data) {
                    //记录不成功暂不处理
                }, 'json');
            }
            clearTimeout(tt1);
        }, 500);
    })
}
mui('body').on('tap', '.mui-slider-group', function() {
        if ($(this).hasClass('flag')) {
            $(this).removeClass('flag');
            $('.close_view,#public_title,.view_fonts_body,.footer_href').stop().fadeIn();
        } else {
            $(this).addClass('flag');
            $('.close_view,#public_title,.view_fonts_body,.footer_href').stop().fadeOut();
        }
    })
    //
