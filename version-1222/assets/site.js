(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMobileNav() {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupFilters() {
    var list = document.querySelector("[data-filter-list]");
    var input = document.querySelector("[data-filter-input]");
    var year = document.querySelector("[data-year-filter]");
    var empty = document.querySelector("[data-empty-state]");
    var autofill = document.querySelector("[data-autofill-query]");

    if (autofill) {
      var params = new URLSearchParams(window.location.search);
      var value = params.get("q");
      if (value) {
        autofill.value = value;
      }
    }

    if (!list || !input) {
      return;
    }

    var cards = Array.prototype.slice.call(list.querySelectorAll("[data-filter-card]"));

    function apply() {
      var query = input.value.trim().toLowerCase();
      var selectedYear = year ? year.value : "";
      var visibleCount = 0;

      cards.forEach(function (card) {
        var content = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" ").toLowerCase();
        var yearValue = card.getAttribute("data-year") || "";
        var matchesQuery = !query || content.indexOf(query) !== -1;
        var matchesYear = !selectedYear || yearValue === selectedYear;
        var visible = matchesQuery && matchesYear;
        card.hidden = !visible;
        if (visible) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.hidden = visibleCount !== 0;
      }
    }

    input.addEventListener("input", apply);
    if (year) {
      year.addEventListener("change", apply);
    }
    apply();
  }

  ready(function () {
    setupMobileNav();
    setupHero();
    setupFilters();
  });
})();

function initMoviePlayer(sourceUrl) {
  var video = document.getElementById("mainVideo");
  var overlay = document.getElementById("playOverlay");
  var errorBox = document.getElementById("playerError");
  var hlsInstance = null;

  if (!video || !sourceUrl) {
    return;
  }

  function showError() {
    if (errorBox) {
      errorBox.hidden = false;
    }
  }

  function bindSource() {
    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(sourceUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
        if (data && data.fatal) {
          showError();
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = sourceUrl;
    } else {
      showError();
    }
  }

  function playVideo() {
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
    video.setAttribute("controls", "controls");
    var request = video.play();
    if (request && typeof request.catch === "function") {
      request.catch(function () {
        if (overlay) {
          overlay.classList.remove("is-hidden");
        }
      });
    }
  }

  bindSource();

  if (overlay) {
    overlay.addEventListener("click", playVideo);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      playVideo();
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", function () {
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
  });

  video.addEventListener("pause", function () {
    if (overlay && video.currentTime === 0) {
      overlay.classList.remove("is-hidden");
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
