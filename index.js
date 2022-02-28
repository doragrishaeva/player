import music from './music.js';

const audioPlayer = document.querySelector('.audio-player');
const info = audioPlayer.querySelector('.info');

let playNum = 1;
let audio = new Audio(music[playNum].singSrc);

const getTimeCodeFromNum = (num) => {
  let minutes = Math.floor(Math.floor(num) / 60);
  let seconds = Math.floor(num) % 60;
  seconds < 10 && (seconds = "0" + seconds);

  return `${minutes}:${seconds}`;
};

const addEffectOnClick = (event) => {
  let siblings = audioPlayer.querySelector('.controls').children;
  Array.from(siblings).forEach((el) => el.classList.remove('button_clicked'));
  event.classList.add('button_clicked');
  window.setTimeout(() => event.classList.remove('button_clicked'), 200);
};

// onload
audio.addEventListener('loadeddata', () => {
  audioPlayer.querySelector('.timeline__time-duration').textContent = getTimeCodeFromNum(audio.duration);
  audio.volume = .75;
  audioPlayer.querySelector('.volume-range__progress').style.width = audio.volume * 100 + '%';
  info.querySelector('.info__title').textContent = music[playNum].title;
  info.querySelector('.info__singer').textContent = music[playNum].singer;
  info.querySelector('.info__cover-img').src = music[playNum].coverSrc;
});

// toggle play-pause
const playBtn = audioPlayer.querySelector('.controls__play');
playBtn.addEventListener('click', () => {
  addEffectOnClick(playBtn);
  if (audio.paused) {
    playBtn.classList.remove('controls__play_play');
    playBtn.classList.add('controls__play_pause');
    audio.play();
  } else {
    playBtn.classList.remove('controls__play_pause');
    playBtn.classList.add('controls__play_play');
    audio.pause();
  }
});

// turn to the next track
const nextBtn = audioPlayer.querySelector('.controls__next');
nextBtn.addEventListener('click', () => {
  addEffectOnClick(nextBtn);
  playNum = playNum < Object.keys(music).length ? ++playNum : 1;
  playBtn.classList.add('controls__play_pause');
  audio.src = music[playNum].singSrc;
  audio.play();
});

// turn to the previous track
const prevBtn = audioPlayer.querySelector('.controls__previous');
prevBtn.addEventListener('click', () => {
  addEffectOnClick(prevBtn);
  playNum = playNum !== 1 ? --playNum : Object.keys(music).length;
  playBtn.classList.add('controls__play_pause');
  audio.src = music[playNum].singSrc;
  audio.play();
});

// update progress bar
setInterval(() => {
  const progress = audioPlayer.querySelector('.timeline__progress');
  progress.style.width = audio.currentTime / audio.duration * 100 + "%";
  audioPlayer.querySelector('.timeline__time-current').textContent = getTimeCodeFromNum(audio.currentTime);

  if (audio.currentTime === audio.duration) {
    playNum = playNum < Object.keys(music).length ? ++playNum : 1;
    audio.src = music[playNum].singSrc;
    audio.play();
  }
}, 500);

// skip the progress
const timeline = audioPlayer.querySelector('.timeline');
timeline.addEventListener('click', (event) => {
  const timelineWidth = window.getComputedStyle(timeline).width;
  // proportion to find necessary time
  const necessaryTime = event.offsetX * audio.duration / parseInt(timelineWidth);
  audio.currentTime = necessaryTime;
});

// change the volume
const volume = audioPlayer.querySelector('.volume-range');
volume.addEventListener('click', (event) => {
  const sliderWidth = window.getComputedStyle(volume).width;
  let newVolume = event.offsetX / parseInt(sliderWidth);
  if (newVolume < 0 || newVolume > 1) {
    newVolume < 0 && (newVolume = 0);
    newVolume > 1 && (newVolume = 1);
  }
  audio.volume = newVolume;
  audioPlayer.querySelector('.volume-range__progress').style.width = newVolume * 100 + '%';
}, false)

console.log(`
Самостоятельная оценка: 70 баллов (60 в score)
  Вёрстка +10
  Кнопка Play/Pause +10
  Есть кнопки "Вперёд" и "Назад" при кликах по которым можно менять аудиотреки. Треки пролистываются по кругу - после последнего идёт первый +10
  При смене трека меняется изображение - обложка трека +10
  Есть прогресс-бар, отображающий прогресс проигрывания трека. При перемещении ползунка вручную меняется текущее время проигрывания трека +10
  Отображается общее и текущее время проигрывания трека +10
  Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения +10 (качественное оформление и также добавлен регулятор громкости)
`)
