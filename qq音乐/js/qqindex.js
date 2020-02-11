$(function () {
    //自定义滚动条
    $('.list').mCustomScrollbar();

    let $audio = $('audio');
    let player = new Player($audio);

    let off = false;
//一，加载音乐列表
    getPlayerList();

    function getPlayerList() {
        //歌曲列表加载
        $.ajax({
            url: '../file/source/musiclist.json',
            datatype: "json",
            success: function (data) {
                player.musicList = data;

                //遍历获取到的数据，创建每一首歌
                $.each(data, function (index, music) {
                    let $list_music = `<li class="music_list_item">
                    <span class="list_select"></span>
                    <span class="list_index">${index + 1}</span>
                    <span class="list_music">${music.name}
                    <ul class="music_list_f4">
                        <li class="music_list_player"></li>
                        <li class="music_list_add"></li>
                        <li class="music_list_download"></li>
                        <li class="music_list_share"></li>
                    </ul>
                    </span>
                    <span class="list_name">${music.singer}</span>
                    <span class="list_time">${music.time}</span>
                </li>`;
                    $('.list_head').parent().append($list_music);

                    $('.music_list_item').get(index).index = index;
                    $('.music_list_item').get(index).music = music;
                    $('.music_list_item').get(index).lrc = music.link_lrc;

                })
            }
        });
    }


//二，初始化事件监听
    initEvent();

    function initEvent() {
        //banner func span 鼠标移入移出事件
        $('.func span').hover(function () {
            $(this).toggleClass('func_hover');
            $(this).children().toggleClass('func_i_hover');//通过调高背景图片的亮度；来实现高亮的效果，省去了换背景图片的步骤
        },);
        //选择框事件
        $('body').delegate('.list_select:gt(0)', 'click', function () {
            $(this).toggleClass('list_select_icon');
               //console.log($("[class='list_select list_select_icon']").length);
            if ($("[class='list_select list_select_icon']").length !== $('.list_select:gt(0)').length){
                $('.list_select:first').removeClass('list_select_icon');
            }else if ($("[class='list_select list_select_icon']").length === $('.list_select:gt(0)').length){
                $('.list_select:first').addClass('list_select_icon');
            }
            //完善一次删除多行音乐

        });
        //删除按钮，点击删除选中的音乐可一次删除选中的多个
            //现阶段存在问题：音乐不播放情况下功能正常使用，只删除一个音乐且删除的音乐正在播放功能正常，但如果选中多个里面有正在播放的会出错
        $('.remove').on('click',function () {
            //如果当前没有选中的直接跳出
            if ($("[class='list_select list_select_icon']").length === 0) return;
            if ($("[class='list_select list_select_icon']").length === 12){
                if (confirm('Are you sure you want to delete it ?') ===true){
                    $('.music_list_item').remove();
                    player.musicList.splice(0);//从第0个开始删
                }else {

                }
            }else {
                //删除的如果是正在播放的歌曲，让它消失不见，并播放下一曲
                let idx = $("[class='list_select list_select_icon']").parents('li').get(0).index;
                let list = $("[class='list_select list_select_icon']").parents('li');
                list.remove();
                if (idx === currentIndex) {
                    //主动触发下一曲事件
                    $(".down_music").trigger('click');
                }
                //如果删除的是在正在播放的歌曲的前面，确保下一曲功能正常
                if (idx < currentIndex) {
                    currentIndex -= 1
                }
                player.musicList = $(".music_list_item");
                $('.music_list_item').each(function (index, element) {
                    element.index = index;
                    $(element).find('.list_index').html(index + 1);
                });
                // if (idx > currentIndex) {
                //     currentIndex -= 1;
                //     $(".down_music").trigger('click');
                // }
            }
        });
        //清空列表
        $('.clear_list').on('click',function () {
            if (confirm('You definitely want to clear the list?') ===true)
                $('.music_list_item').remove();
                player.musicList.splice(0);//从第0个开始删

        });
        //选择框鼠标移入高亮
        $('body').delegate('.list_select', 'mouseenter', function () {
            $('.list_select').each(function (index, element) {
                $('.list_select')[index].onmouseenter = function () {
                    $('.list_select')[index].style.border = '1px solid #ffffff';
                    $('.list_select')[index].style.opacity = '1';
                }
            });
        });
        $('body').delegate('.list_select', 'mouseleave', function () {
            $('.list_select').each(function (index, element) {
                $('.list_select')[index].onmouseleave = function () {
                    $('.list_select')[index].style.border = '1px solid #b6b6b6';
                    $('.list_select')[index].style.opacity = '0.5';
                }
            });
        });
        //鼠标触碰歌曲事件(事件委托)
        $('body').delegate('.music_list_item', 'mouseenter', function () {
            $(this).css('color', "rgba(254, 254, 254, 1)")
                .children('.list_time').css('color', 'transparent').parent().append($('<span class="list_rem"></span>'));
            $(this).find('.music_list_f4').fadeIn(100).css('display', 'inline-block');
        });
        $('body').delegate('.music_list_item', 'mouseleave', function () {
            $(this).css('color', "rgba(254, 254, 254, 0.5)")
                .children('.list_rem').hide();
            $('.list_time').css('color', 'rgba(255,255,255,0.6)');
            $(this).find('.music_list_f4').css('display', 'none');
        });
        //进度条触碰事件
        $('.scrollbar_current').hover(function () {
            $('.scrollbar_current').toggleClass('scrollbar_hover');
            $('.scroll_radius').toggleClass('scrollbar_hover');
        });
        $('.scroll_radius').hover(function () {
            $('.scroll_radius').toggleClass('scrollbar_hover');
            $('.scrollbar_current').toggleClass('scrollbar_hover');
        });
        //循环按钮点击切换
        $('.model_select').on('click', function () {
            let bg1 = $(this).is('.model_select_bg1');
            let bg2 = $(this).is('.model_select_bg2');
            let bg = $(this).is('.model_select_bg');
            if (bg) {
                $(this).addClass('model_select_bg1');
            }
            if (bg && bg1) {
                $(this).addClass('model_select_bg2');
            }
            if (bg && bg1 && bg2) {
                $(this).removeClass('model_select_bg1');
                $(this).removeClass('model_select_bg2');
            }
        });
        //喜欢按钮点击变红标
        $('.model_love').on('click', function () {
            $(this).toggleClass('model_love_bg');
        });
        //纯净按钮点击切换
        $('.model_clear').on('click', function () {
            $(this).toggleClass('model_clear_bg1');
            $(this).toggleClass('model_clear_bg');
        });
        //右下角声音图标点击声音关闭/打开，图标切换
        $('.volume_icon').on('click', function () {
            $(this).toggleClass('volume_off');
            if ($(this).is('.volume_off')) {
                $audio.get(0).volume = 0;
            } else {
                $audio.get(0).volume = 1;
            }
        });
        //右下角声音按钮可拖拽 + 声音大小控制
        $('.volume_radius').on('mousedown', function (e) {
            let disX = e.offsetX;
            $(document).on('mousemove', function (e) {
                let $volume_offsetLeft = $('.volume').offset().left;
                let $left = e.pageX - $volume_offsetLeft - disX;
                if ($left < 30) {
                    $left = 30
                }
                if ($left > 100) {
                    $left = 100
                }
                $('.volume_radius')[0].style.left = $left + 'px';
                $('.volume_bg')[0].style.width = $left - 30 + 'px';
                //声音大小跟着走
                let proportion = parseInt($('.volume_radius').css('left')) - 30;
                $audio.get(0).volume = (proportion / 70);
                if (proportion / 70 <= 0) {
                    $('.volume_icon').toggleClass('volume_off');
                } else if (proportion / 70 > 0) {
                    $('.volume_icon').removeClass('volume_off');
                }
            });
            $(document).on('mouseup', function (e) {
                $(document).off('mousemove');
            });
        });
        //右下角声音点击 + 点哪声音大小设置
        $('.volume_bg').on('mousedown', function (e) {
            let $bg_width = e.pageX - $('.volume_bg').offset().left + 30 - parseInt($('.volume_radius').width()) / 2;
            $('.volume_radius').css({left: $bg_width});
            $('.volume_bg').css({width: $bg_width - 30});
            //声音大小控制
            $audio.get(0).volume = $(this).width() / 80;
        });
        //删除图标点击效果
        $('body').delegate('.list_rem', 'click', function () {
            let idx = $(this).parents('.music_list_item').get(0).index;
            //删除的如果是正在播放的歌曲，让它消失不见，并播放下一曲
            if (idx === currentIndex) {
                //主动触发下一曲事件
                $(".down_music").trigger('click');
            }
            //如果删除的是在正在播放的歌曲的前面，确保下一曲功能正常
            if (idx < currentIndex) {
                currentIndex -= 1
            }
            //删除
            $(this).parents('.music_list_item').remove();//前台删除
            player.musicList.splice(idx, 1);//后台数据删除，不光只删除li元素
            //序列号自动补位 ： 数据删除后，遍历剩余的数据给它们重新设置序号，并且找到li中的序号元素，设置innerHTMl为index +1
            $('.music_list_item').each(function (index, element) {
                element.index = index;
                $(element).find('.list_index').html(index + 1);
            });
        });
        //音乐列表中的播放按钮
        var currentIndex = -1;
        let arr_Time = [];
        let arr_lyrics = [];
        let index = -1;
        $('body').delegate('.music_list_player', 'click', function () {
            //播放音乐
            playMusic($(this).parents('.music_list_item').get(0).index, $(this).parents('.music_list_item').get(0).music);

            function playMusic(index, music) {
                //判断是否是同一首音乐
                if (currentIndex === index) {
                    //是一首
                    //如果没播放-播放
                    if ($audio.get(0).paused) {
                        $audio.get(0).play();
                    } else {
                        $audio.get(0).pause();
                    }
                } else {
                    //不是同一首
                    //获取当前点击歌曲的src设置给audio标签的src并播放它
                    $audio.prop('src', music.link_url);
                    $audio.get(0).play();
                    currentIndex = index;
                    //要判断下是否是同一首歌曲，不能点击一次就重置一次
                    arr_Time = [];
                    arr_lyrics = [];
                    index = -1;
                }
            }

            if ($(this).is('.music_list_player_bg')) {
                console.log("同一首！");
                $(this).toggleClass('music_list_player_bg');
                $(this).parents('li').removeClass('high');
                $(this).parents('li').find('.list_index').removeClass('list_index_animate');
                $('.stop_music').removeClass('toggleStop');
                return true;
            } else {
                //点击的不是同一个按钮，让歌词ul回到最初位置
                $('.music_word').css({marginTop: '0'});
                //要判断下是否是同一首歌曲，不能点击一次就重置一次
                //歌词同步
                $.ajax({
                    type: 'GET',
                    url: $(this).parents('.music_list_item').get(0).lrc,
                    dataType: 'text',
                    success: function (data) {
                        arr_Time = [];
                        arr_lyrics = [];
                        index = -1;

                        let a = data.split("\n");
                        let Reg = /\[(\d+:\d+.\d+)]/;
                        $.each(a, function (index, element) {
                            //处理歌词：有的为空，把那些在开头就排除掉，不进入下面的计算
                            let lyrics = element.split(']')[1];
                            if (lyrics.length === 1) return true;
                            arr_lyrics.push(lyrics);

                            let reg = Reg.exec(element);
                            // console.log(reg);
                            if (reg === null) return true;
                            let t = reg[1];
                            let i = t.split(":");
                            let m = parseInt(i[0] * 60);
                            let e = parseFloat(i[1]);
                            let time = Number(Number(m + e).toFixed(2));//保留两位小数，保留后变成字符串，用Number再转下格式变回数组类型，也可以用parseFloat
                            arr_Time.push(time);
                        });
                        //创建歌词列表
                        let $lyrics = $('.music_word');
                        $lyrics.children().remove();
                        $.each(arr_lyrics, function (index, element) {
                            let perfect = `<li>${arr_lyrics[index]}</li>`;
                            $lyrics.append(perfect);
                        });
                    }
                });
            }

            //背景切换+footer音乐时长+歌手+专辑切换
            //获取对应元素对象
            let $NameRight = $('.music_name_a>span:eq(1)');
            let $SingerRight = $('.music_name_b>span:last');
            let $AlbumRight = $('.music_name_c>span:last');

            let $NameLeft = $('.music_name');
            let $SingerLeft = $('.music_music');
            let $TotalTime = $('.music_time_total');

            let $bgLeft = $('.picture');
            let $bgContainer = $('.mask');
            //给获取的对象赋值
            let music = $(this).parents('.music_list_item').get(0).music;
            $NameRight.html(music.name);
            $SingerRight.html(music.singer);
            $AlbumRight.html(music.album);
            $NameLeft.html(music.name + "-");
            $SingerLeft.html(music.singer);
            $TotalTime.html(music.time);
            $bgLeft.css({background: 'url("' + music.cover + '") no-repeat'});
            $bgContainer.css({
                background: 'url("' + music.cover + '") no-repeat 50% center',
                backgroundSize: '100% 100%'
            });
            //点击播放按钮变暂停按钮
            $(this).toggleClass('music_list_player_bg');
            //点击对应一行的文字高亮
            $(this).parents('li').addClass('high');
            //当前的序号变成声音动画
            $(this).parents('li').find('.list_index').toggleClass('list_index_animate');
            //当前点击的按钮有背景即为播放状态下 去除其他列表的播放按钮背景，高亮，动画
            if ($(this).is('.music_list_player_bg')) {
                $(this).parents('li').siblings().find('.music_list_player').removeClass('music_list_player_bg');
                $(this).parents('li').siblings().removeClass('high');
                $(this).parents('li').siblings().find('.list_index').removeClass('list_index_animate');
            }
            //音乐列表中有播放按钮存在，先下方播放按钮就添加背景实现同步
            if ($('.music_list_player').is('.music_list_player_bg')) {
                $('.stop_music').addClass('toggleStop');
            }
            //全部音乐列表中都没有开始图标后，去除当前高亮，下方播放按钮去除添加的背景，实现同步
            if (!$('.music_list_player').is('.music_list_player_bg')) {
                $(this).parents('li').removeClass('high');
                $('.stop_music').removeClass('toggleStop');
            }
        });
        //音乐进度条拖拽
        $('.scroll_radius').on('mousedown', function (e) {
            let disX = e.offsetX;
            $(document).on('mousemove', function (e) {
                let $scrollbar_offsetLeft = $('.scrollbar').offset().left;
                let left = e.pageX - $scrollbar_offsetLeft - disX;
                if (left < 0) {
                    left = 0;
                }
                if (left > $('.scrollbar').width() - $('.scroll_radius').width()) {
                    left = $('.scrollbar').width() - $('.scroll_radius').width()
                }
                $('.scroll_radius').css({left: left});
                $('.scrollbar_current').width(left);
                $('.scroll_radius').css({opacity: 1});
                $('.scrollbar_current').css({opacity: 1});
                //在移动时防止timeupdate事件触发使拖拽一闪一闪，将timeupdate事件取消，等鼠标抬起时在恢复
                off = true;//让进度条跟音乐进度走方法失效确保拖拽使没有其方法干扰
            });
            $(document).on('mouseup', function () {
                $(document).off('mousemove');
                $(document).off('mousedown');
                $(document).off('mouseup');
                $('.scroll_radius').css({opacity: 0.7});
                $('.scrollbar_current').css({opacity: 0.6});
                //正常拖拽，等鼠标抬起时获取当前进度条的比例进而设置播放音乐得到时间，保证在拖拽过程中音乐正常播放，如果添加在mousemove中会影响效果
                let percentage = $('.scrollbar_current').width() / $('.scrollbar').width();//获取当前进度条的比例
                $audio.get(0).currentTime = $audio.get(0).duration * percentage;//根据进度条比例设置点击时播放音乐的时间
                off = false;//在变回去，使进度条跟音乐进度自动走恢复
            });
        });
        //音乐进度条点哪到哪 + 音乐进度跟着到哪
        $('.scrollbar').on('mousedown', function (e) {
            if (currentIndex === -1) {
                alert("没有选中音乐，无法设置进度！")
            } else {
                let left = e.pageX - $('.scrollbar').offset().left - parseInt($('.scroll_radius').css('width')) / 2;
                $('.scroll_radius').css({left: left});
                $('.scrollbar_current').css({width: left});
                //音乐进度点哪到哪
                let percentage = $('.scrollbar_current').width() / $('.scrollbar').width();//获取当前进度条的比例
                $audio.get(0).currentTime = $audio.get(0).duration * percentage;//根据进度条比例设置点击时播放音乐的时间
            }
        });
        //全选框选中事件
        $('.list_select:first').on('click', function () {
            //$('.list_select').toggleClass("list_select_icon");
            if ($(this).is('.list_select_icon')){
                $('.list_select').removeClass('list_select_icon')
            }else if (!$(this).is('.list_select_icon')){
                $('.list_select').addClass('list_select_icon')
            }

            //console.log($("[class='list_select list_select_icon']").length)
            if ($("[class='list_select list_select_icon']").length === $('.list_select').length){
                console.log("ok")
            }
        });
        //下方播放按钮点击
        $('.stop_music').on('click', function () {
            //判断当前是否有toggleStop样式
            if ($(this).is('.toggleStop')) {
                //如果有——移除
                $(this).removeClass('toggleStop');
            } else {//如果没有——添加
                $(this).addClass('toggleStop');
            }
            //判断当前音乐列表中是否有正在播放的歌曲(两种方法)
            if ($audio.prop('src') !== "") {//如果有播放其他音乐
                //if (currentIndex !== -1){
                // 获取它的index找到对应元素主动触发它
                $('.music_list_player').eq(currentIndex).trigger('click');
            } else {//没有音乐--播放第一首 trigger:主动触发某事件
                $('.music_list_player:eq(0)').trigger('click')
            }

        });
        //上一曲，下一曲点击事件
        $(".up_music").on('click', function () {
            //限制currentIndex
            if (currentIndex < 0) {
                currentIndex = $('.music_list_player').length;
            }
            $('.music_list_player').eq(currentIndex - 1).trigger('click');
        });
        $('.down_music').on('click', function () {
            if (currentIndex === $('.music_list_player').length - 1) {
                currentIndex = -1
            }
            $('.music_list_player').eq(currentIndex + 1).trigger('click');
        });
        //歌曲播放时间 + 音乐播放时底部进度走动
        $audio.on('timeupdate', function () {
            let perfectTime = parseInt($(this).get(0).currentTime);
            if (perfectTime < 10 || perfectTime - (60 * parseInt(perfectTime / 60)) < 10) {
                $('.music_time_current').html("0" + parseInt(perfectTime / 60) + ":" + "0" + perfectTime % 60 + "/");
            } else {
                $('.music_time_current').html("0" + parseInt(perfectTime / 60) + ":" + perfectTime % 60 + "/");
            }
            //进度条同步
            let val = $(this).get(0).duration;//当前音乐总时长
            let percentage = perfectTime / val * 100;//获取当前时长占全部时长的
            //设置进度条的长度
            scrollbar_off(percentage);
            //歌词同步
            if (perfectTime >= arr_Time[0]) {
                index++;
                arr_Time.shift();
            }
            $('.music_word>li').eq(index).addClass('changeGreen');
            $('.music_word>li').eq(index).siblings().removeClass('changeGreen');
            if (index < 1) return true;
            $('.music_word').css({marginTop: (-(index + 2) * 30)});
//            console.log(percentage)
        });

        //进度条跟音乐比例走 单独提一个方法出来是为了拖拽时 进度条不跟着音乐走 防止产生拖拽闪烁问题
        function scrollbar_off(percentage) {
            if (off) return;
            $('.scrollbar_current').css({width: percentage + "%", opacity: 1});
            $('.scroll_radius').css({left: percentage + "%", opacity: 1});
        }

        //空格键触发播放按钮
        $(document).on('keydown', function (e) {
            if (e.keyCode === 32) {
                $('.stop_music').trigger('click');
            }
        });

    }
});
