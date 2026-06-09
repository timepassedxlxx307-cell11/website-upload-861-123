(function () {
  var mobileButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileButton && mobileNav) {
    mobileButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    var showSlide = function (index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    var startTimer = function () {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    startTimer();
  }

  var grid = document.querySelector('[data-card-grid]');
  var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]')) : [];
  var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));

  var normalize = function (value) {
    return String(value || '').toLowerCase().trim();
  };

  var applySearch = function (query) {
    var keyword = normalize(query);

    cards.forEach(function (card) {
      var content = normalize(card.getAttribute('data-search'));
      var matched = !keyword || content.indexOf(keyword) !== -1;
      card.classList.toggle('is-hidden', !matched);
    });
  };

  var setInputs = function (value) {
    forms.forEach(function (form) {
      var input = form.querySelector('input[name="q"]');
      if (input) {
        input.value = value;
      }
    });
  };

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';

  if (initialQuery && cards.length) {
    setInputs(initialQuery);
    applySearch(initialQuery);
  }

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      var query = input ? input.value.trim() : '';

      if (cards.length && document.body.getAttribute('data-page') === 'index') {
        event.preventDefault();
        setInputs(query);
        applySearch(query);

        var url = new URL(window.location.href);
        if (query) {
          url.searchParams.set('q', query);
        } else {
          url.searchParams.delete('q');
        }
        window.history.replaceState({}, '', url.toString());
        return;
      }

      var target = form.getAttribute('data-search-target') || 'index.html';
      if (query) {
        event.preventDefault();
        window.location.href = target + '?q=' + encodeURIComponent(query);
      }
    });
  });

  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.getAttribute('data-filter') || '';

      filterButtons.forEach(function (item) {
        item.classList.toggle('is-active', item === button);
      });

      if (value === '全部') {
        cards.forEach(function (card) {
          card.classList.remove('is-hidden');
        });
        return;
      }

      cards.forEach(function (card) {
        var content = card.getAttribute('data-search') || '';
        card.classList.toggle('is-hidden', content.indexOf(value) === -1);
      });
    });
  });
})();
