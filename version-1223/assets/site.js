(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
      menuButton.textContent = mobilePanel.classList.contains("is-open") ? "×" : "☰";
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var filterScope = document.querySelector("[data-filter-scope]");

  if (filterScope) {
    var searchInput = filterScope.querySelector("[data-card-search]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card-list] .movie-card"));
    var year = "";
    var region = "";

    function markActive(selector, value) {
      filterScope.querySelectorAll(selector).forEach(function (button) {
        button.classList.toggle("is-active", button.getAttribute(selector.replace("[", "").replace("]", "")) === value);
      });
    }

    function applyFilters() {
      var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
      cards.forEach(function (card) {
        var text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre")
        ].join(" ").toLowerCase();
        var ok = true;
        if (keyword && text.indexOf(keyword) === -1) ok = false;
        if (year && card.getAttribute("data-year") !== year) ok = false;
        if (region && card.getAttribute("data-region") !== region) ok = false;
        card.classList.toggle("is-hidden-card", !ok);
      });
    }

    filterScope.querySelectorAll("[data-filter-year]").forEach(function (button) {
      button.addEventListener("click", function () {
        year = button.getAttribute("data-filter-year") || "";
        filterScope.querySelectorAll("[data-filter-year]").forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        applyFilters();
      });
    });

    filterScope.querySelectorAll("[data-filter-region]").forEach(function (button) {
      button.addEventListener("click", function () {
        region = button.getAttribute("data-filter-region") || "";
        filterScope.querySelectorAll("[data-filter-region]").forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }
  }
})();
