(function () {
  var shells = Array.prototype.slice.call(document.querySelectorAll('.player-shell'));

  shells.forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.player-start');
    var stream = shell.getAttribute('data-stream');
    var initialized = false;
    var hls = null;

    var initialize = function () {
      if (initialized || !video || !stream) {
        return;
      }

      initialized = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    };

    var play = function () {
      initialize();
      shell.classList.add('is-ready');
      if (button) {
        button.setAttribute('aria-hidden', 'true');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    };

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        play();
      });
    }

    shell.addEventListener('click', function (event) {
      if (event.target === video) {
        return;
      }
      if (!initialized) {
        play();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  });
})();
