import { H as Hls } from './hls-dru42stk.js';

var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

players.forEach(function (player) {
  var video = player.querySelector('video[data-src]');
  var overlay = player.querySelector('[data-play-overlay]');

  if (!video) {
    return;
  }

  var source = video.getAttribute('data-src');

  if (source) {
    if (Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    }
  }

  var playVideo = function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  };

  if (overlay) {
    overlay.addEventListener('click', playVideo);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (overlay && video.currentTime === 0) {
      overlay.classList.remove('is-hidden');
    }
  });
});
