(function () {
  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  var menuButton = document.querySelector("[data-mobile-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero-carousel]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(current + 1);
        restart();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
        restart();
      });
    });

    showSlide(0);
    restart();
  }

  function applySearch(container, query) {
    var cards = Array.prototype.slice.call(container.querySelectorAll("[data-movie-card]"));
    var empty = container.querySelector("[data-no-results]");
    var text = normalize(query);
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute("data-search"));
      var matched = !text || haystack.indexOf(text) !== -1;
      card.style.display = matched ? "" : "none";
      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle("is-visible", visible === 0);
    }
  }

  document.querySelectorAll("[data-search-scope]").forEach(function (scope) {
    var input = scope.querySelector("[data-search-input]");
    if (!input) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";

    if (initial) {
      input.value = initial;
      applySearch(scope, initial);
    }

    input.addEventListener("input", function () {
      applySearch(scope, input.value);
    });
  });

  document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
    var buttons = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-value]"));
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
    var empty = scope.querySelector("[data-no-results]");

    function setFilter(value) {
      var visible = 0;

      buttons.forEach(function (button) {
        button.classList.toggle("is-active", button.getAttribute("data-filter-value") === value);
      });

      cards.forEach(function (card) {
        var matched = value === "all" || card.getAttribute("data-type") === value;
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        setFilter(button.getAttribute("data-filter-value"));
      });
    });
  });
})();
