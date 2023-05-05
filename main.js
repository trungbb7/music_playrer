
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const page = document;
const MUSIC_PLAYER_STORAGE = 'Trung Dap Chai';
const musicTitle = $('.music-title');
const musicImgContaier = $('.music-img');
const musicImg = $('.music-img-item');
const musicListContainer = $('.music-list-container');
const audio = $('#audio');
const musicPlay = $('.music-play');
const playBtn = $('.music-play');
const nextBtn = $('.music-next');
const prevBtn = $('.music-prev');
const repeatBtn = $('.music-repeat');
const randomtBtn = $('.music-random');
const currentTimePlay = $('.time-start');
const duration = $('.time-end');
const progress = $('.progress');
// let musics = [];

// var musics = (async function(){
//     const m = await (await fetch('./musics.json')).json();
//     console.log(m);
//     return m;
    
    // .then(
    //     (response) => response.json()
    // )
    // .then (
    //     function (json) {
    //         musics =  json
    //     }
    // )
    
// })().then(function (response) { 
//         console.log(response)
//     })'

var songs = [];
const musics = fetch('./musics.json').then(response =>  response.json()).then((json) => json);
;(async function (){
    songs = await musics;
    app.songs = songs;

})()


const app = {

    currentIndex: 0,
    isRepeat: false,
    isRandom: false,
    config: JSON.parse(localStorage.getItem(MUSIC_PLAYER_STORAGE)) || {
        isRandom: false,
        isRepeat: false
    },
    songs: songs,

    setCofig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(MUSIC_PLAYER_STORAGE, JSON.stringify(this.config));
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    renderListMusic: function () {
        const listSong = this.songs.map(function (song) {
            return `<div class="music-list">
            <div class="music-item">
                <div class="music-item__img">
                    <img src="${song.image}" alt="img">
                </div>
                <div class="music-item__info">
                    <div class="music-item-heading">${song.title}</div>
                    <div class="music-item-author">${song.singer}</div>
                </div>

            </div>
            <div class="music-item__right-side">
                <div class="music-wave">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                 </div>
                <i class="fa-solid fa-ellipsis"></i>
            </div>
        </div>`
        })

        musicListContainer.innerHTML = listSong.join('');
        this.musicUpdate();

    },

    musicUpdate: function () {
        musicTitle.innerHTML = this.songs[this.currentIndex].title;
        musicImg.style['background-image'] = `url('${this.songs[this.currentIndex].image}')`;
        musicListContainer.childNodes[this.currentIndex].classList.add('active');
        repeatBtn.classList.toggle('active', this.isRepeat);
        randomtBtn.classList.toggle('active', this.isRandom);
        this.scrollToActiveSong();




    },

    scrollToActiveSong: function () {
        const top = $(".music-list.active");
        setTimeout(() => {
            $(".music-list.active").scrollIntoView({
                behavior: "smooth",
                block: "end",
                // inline: "nearest"
            });
        }, 300);
    },

    renderSong: function () {
        audio.src = this.songs[this.currentIndex].src;

    },

    nextSong: function () {
        musicListContainer.childNodes[this.currentIndex].classList.remove('active');
        console.log('nextSong');
        if (this.currentIndex >= this.songs.length - 1) {
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }
        this.renderSong();
        this.musicUpdate();
        audio.play();

    },

    prevSong: function () {
        musicListContainer.childNodes[this.currentIndex].classList.remove('active');
        if (this.currentIndex === 0) {
            this.currentIndex = this.songs.length - 1;
        } else {
            this.currentIndex--;
        }
        this.renderSong();
        this.musicUpdate();
        audio.play();
    },

    randomSong: function () {
        musicListContainer.childNodes[this.currentIndex].classList.remove('active');
        let newIndex = 0;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.musicUpdate();
        this.renderSong();
        audio.play();
    },

    handlerEvent: function () {
        const _this = this;
        const cdAnimate = musicImgContaier.animate(
            [
                {
                    transform: "rotate(360deg)"
                }
            ],
            {
                duration: 15000,
                iterations: Infinity
            }
        )


        page.onscroll = function () {
            const newSize = 200 - window.scrollY;
            musicImgContaier.style['width'] = newSize + 'px';
            musicImgContaier.style['opacity'] = newSize / 200;
        }

        cdAnimate.pause();
        playBtn.onclick = function (e) {
            if (musicPlay.classList.contains('playing')) {
                audio.pause();
            } else {
                audio.play();
            }
            musicPlay.classList.toggle('playing');
        }

        audio.onplay = function () {
            cdAnimate.play();
            playBtn.classList.add('playing');
            setInterval(function () {
                const duration = audio.duration;
                const currentTime = Math.round(audio.currentTime);
                const currentTimePercent = Math.round(currentTime / duration * 100);
                progress.value = `${currentTimePercent}`;
            }, 1000)

        }

        audio.onpause = function () {
            cdAnimate.pause();
        }

        audio.seeked = function () {
            console.log(Math.random()) + "fdf";
        }

        audio.oncanplay = function () {

            setInterval(function () {
                const currentTime = Math.round(audio.currentTime);;
                const currentSeconds = Math.round(currentTime % 60);
                const currentMinutes = Math.floor(currentTime / 60);
                currentTimePlay.innerHTML = `${currentMinutes >= 10 ? currentMinutes : '0' + currentMinutes}: ${currentSeconds >= 10 ? currentSeconds : '0' + currentSeconds}`;
            }, 1000);
            const totalSeconds = audio.duration;
            const seconds = Math.round(totalSeconds % 60);
            const minutes = Math.floor(totalSeconds / 60);
            duration.innerHTML = `${minutes >= 10 ? minutes : '0' + minutes}: ${seconds >= 10 ? seconds : '0' + seconds}`;

        }

        audio.onended = function () {
            if (repeatBtn.classList.contains('active')) {
                // this.load();
                this.play();
            } else if (randomtBtn.classList.contains('active')) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
        }

        progress.onchange = function () {
            const value = this.value;
            const duration = Math.round(audio.duration);
            audio.currentTime = value * duration / 100;
            progress.value = value;
        }

        nextBtn.onclick = function () {
            if (randomtBtn.classList.contains('active')) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
        };

        prevBtn.onclick = function () {
            _this.prevSong();
        };

        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle('active', _this.isRepeat);
            _this.setCofig("isRepeat", _this.isRepeat);
        }

        randomtBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            this.classList.toggle('active', _this.isRandom);
            _this.setCofig("isRandom", _this.isRandom);

        }


        musicListContainer.childNodes.forEach(function (musicItem, index) {
            musicItem.onclick = function (e) {
                musicListContainer.childNodes[_this.currentIndex].classList.remove('active');
                _this.currentIndex = index;
                _this.musicUpdate();
                _this.renderSong();
                audio.play();
            }
        }
        )

    },

    start: function () {
        this.loadConfig();
        this.renderListMusic();
        this.renderSong();
        this.handlerEvent();
    },

}


// app.start();
setTimeout(() => {
    app.start();
}, 300);

