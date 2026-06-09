import { H as Hls } from "./hls-dru42stk.js";

export function initMoviePlayer(streamUrl) {
  var player = document.querySelector("[data-player]");

  if (!player) {
    return;
  }

  var video = player.querySelector("video");
  var layer = player.querySelector("[data-play-layer]");
  var button = player.querySelector("[data-play-button]");
  var ready = false;
  var hls = null;

  function loadStream() {
    if (ready || !video || !streamUrl) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else {
      video.src = streamUrl;
    }

    ready = true;
  }

  function startVideo() {
    loadStream();
    player.classList.add("is-playing");

    if (layer) {
      layer.setAttribute("hidden", "hidden");
    }

    video.controls = true;

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        if (layer) {
          layer.removeAttribute("hidden");
        }

        player.classList.remove("is-playing");
      });
    }
  }

  if (button) {
    button.addEventListener("click", startVideo);
  }

  if (layer) {
    layer.addEventListener("click", startVideo);
  }

  if (video) {
    video.addEventListener("click", function () {
      if (video.paused) {
        startVideo();
      }
    });
  }

  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
