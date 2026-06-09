function initMoviePlayer(source) {
  var video = document.getElementById("movieVideo");
  var overlay = document.getElementById("playOverlay");
  var playerShell = document.getElementById("playerShell");
  var hlsInstance = null;

  if (!video || !source) {
    return;
  }

  function bindSource() {
    if (video.getAttribute("data-ready") === "1") {
      return;
    }

    video.setAttribute("data-ready", "1");

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function hideOverlay() {
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
  }

  function startPlayback() {
    bindSource();
    hideOverlay();
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener("click", startPlayback);
  }

  if (playerShell) {
    playerShell.addEventListener("click", function (event) {
      if (event.target === video && video.paused) {
        startPlayback();
      }
    });
  }

  video.addEventListener("play", hideOverlay);
  video.addEventListener("loadedmetadata", hideOverlay);

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
