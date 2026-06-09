(function () {
  function createMoviePlayer(config) {
    var video = document.getElementById(config.videoId);
    var button = document.getElementById(config.buttonId);
    var stream = config.source;
    var attached = false;
    var hls = null;

    if (!video || !stream) {
      return;
    }

    function attachStream() {
      if (attached) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }

      attached = true;
    }

    function hideButton() {
      if (button) {
        button.classList.add("is-hidden");
      }
    }

    function showButton() {
      if (button) {
        button.classList.remove("is-hidden");
      }
    }

    function start() {
      attachStream();
      hideButton();

      var result = video.play();

      if (result && typeof result.catch === "function") {
        result.catch(function () {
          showButton();
        });
      }
    }

    if (button) {
      button.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    });

    video.addEventListener("play", hideButton);
    video.addEventListener("ended", showButton);

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.createMoviePlayer = createMoviePlayer;
})();
