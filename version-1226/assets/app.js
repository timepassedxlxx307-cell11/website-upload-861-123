document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mainNav = document.querySelector("[data-main-nav]");

  if (menuButton && mainNav) {
    menuButton.addEventListener("click", function () {
      mainNav.classList.toggle("open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var previous = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    function move(step) {
      showSlide(current + step);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        move(1);
      }, 5200);
    }

    if (previous) {
      previous.addEventListener("click", function () {
        move(-1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        move(1);
        restart();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
        restart();
      });
    });

    showSlide(0);
    restart();
  }

  var filterInput = document.querySelector("[data-local-filter]");

  if (filterInput) {
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));

    filterInput.addEventListener("input", function () {
      var words = filterInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);

      cards.forEach(function (card) {
        var haystack = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        var matched = words.every(function (word) {
          return haystack.indexOf(word) !== -1;
        });

        card.style.display = matched ? "" : "none";
      });
    });
  }

  var resultTarget = document.querySelector("[data-search-results]");

  if (resultTarget && typeof searchMovies !== "undefined") {
    var searchInput = document.querySelector("[data-search-input]");
    var resultNote = document.querySelector("[data-search-note]");
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";

    if (searchInput) {
      searchInput.value = initialQuery;
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function renderSearch(query) {
      var words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      var results = searchMovies.filter(function (movie) {
        if (!words.length) {
          return movie.hot;
        }

        var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.category]
          .join(" ")
          .toLowerCase();

        return words.every(function (word) {
          return haystack.indexOf(word) !== -1;
        });
      }).slice(0, 96);

      if (resultNote) {
        resultNote.textContent = words.length ? "搜索结果" : "热门推荐";
      }

      if (!results.length) {
        resultTarget.innerHTML = '<div class="no-results">没有找到匹配的影片</div>';
        return;
      }

      resultTarget.innerHTML = results.map(function (movie) {
        return '<article class="movie-card">'
          + '<a class="poster-link" href="' + escapeHtml(movie.url) + '" aria-label="' + escapeHtml(movie.title) + '">'
          + '<img src="' + escapeHtml(movie.image) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">'
          + '<span class="poster-badge">' + escapeHtml(movie.year) + '</span>'
          + '<span class="poster-play">▶</span>'
          + '</a>'
          + '<div class="movie-card-body">'
          + '<div class="movie-meta-line"><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.region) + '</span></div>'
          + '<h2><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h2>'
          + '<p>' + escapeHtml(movie.oneLine) + '</p>'
          + '<div class="chip-row"><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.genre) + '</span></div>'
          + '</div>'
          + '</article>';
      }).join("");
    }

    renderSearch(initialQuery);

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        renderSearch(searchInput.value);
      });
    }
  }
});
