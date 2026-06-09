(function () {
  var runtimePromise = null;

  function loadRuntime() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }

    if (runtimePromise) {
      return runtimePromise;
    }

    runtimePromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js';
      script.async = true;
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return runtimePromise;
  }

  function attachStream(video, url) {
    if (!video || !url) {
      return Promise.reject(new Error('missing media'));
    }

    if (video.dataset.ready === '1') {
      return Promise.resolve();
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.dataset.ready = '1';
      return Promise.resolve();
    }

    return loadRuntime().then(function (Hls) {
      if (Hls && Hls.isSupported()) {
        var hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        video.dataset.ready = '1';
        video._hls = hls;
        return;
      }

      video.src = url;
      video.dataset.ready = '1';
    });
  }

  function startVideo(frame) {
    var video = frame.querySelector('.media-player');
    var button = frame.querySelector('.play-overlay');
    var url = video ? video.getAttribute('data-stream') : '';

    attachStream(video, url).then(function () {
      if (button) {
        button.classList.add('is-hidden');
      }
      var playTask = video.play();
      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {});
      }
    }).catch(function () {
      if (button) {
        button.innerHTML = '<span>▶</span>';
      }
    });
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('.play-overlay');
    if (!button) {
      return;
    }

    var frame = button.closest('.player-frame');
    if (frame) {
      startVideo(frame);
    }
  });

  document.querySelectorAll('.media-player').forEach(function (video) {
    video.addEventListener('play', function () {
      var frame = video.closest('.player-frame');
      var button = frame ? frame.querySelector('.play-overlay') : null;
      var url = video.getAttribute('data-stream');
      attachStream(video, url).then(function () {
        if (button) {
          button.classList.add('is-hidden');
        }
      }).catch(function () {});
    }, { once: true });
  });
})();
