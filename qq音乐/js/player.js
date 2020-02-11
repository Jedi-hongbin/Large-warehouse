//这个面对对象写的像是开玩笑，待日后改进吧
(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,//把原型指向Player
        musicList: [],
        init:function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        // currentIndex:-1,
        // playMusic : function (index,music) {
        //     //判断是否是同一首音乐
        //     if (this.currentIndex === index){
        //         //是一首
        //         //如果没播放-播放
        //         if (this.audio.paused){
        //             this.audio.play();
        //         }else{
        //             this.audio.pause();
        //         }
        //     }else {
        //         //不是同一首
        //         //获取当前点击歌曲的src，播放它
        //         this.$audio.attr('src',music.link_url);
        //         this.audio.play();
        //         this.currentIndex = index
        //     }
        // }
    };
    window.Player = Player;
})(window);