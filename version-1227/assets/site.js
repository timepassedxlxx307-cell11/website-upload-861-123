(function () {
  var menuButton = document.querySelector('.menu-button');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var opened = mobilePanel.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
      menuButton.textContent = opened ? '×' : '☰';
    });
  }

  var heroSlides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var heroDots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var heroIndex = 0;

  function activateHero(index) {
    if (!heroSlides.length) {
      return;
    }

    heroIndex = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach(function (slide, position) {
      slide.classList.toggle('active', position === heroIndex);
    });
    heroDots.forEach(function (dot, position) {
      dot.classList.toggle('active', position === heroIndex);
    });
  }

  heroDots.forEach(function (dot, position) {
    dot.addEventListener('click', function () {
      activateHero(position);
    });
  });

  if (heroSlides.length > 1) {
    window.setInterval(function () {
      activateHero(heroIndex + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('.filter-input');
  var filterYear = document.querySelector('.filter-year');
  var filterRegion = document.querySelector('.filter-region');
  var filterItems = Array.prototype.slice.call(document.querySelectorAll('.filter-list .movie-card'));
  var emptyState = document.querySelector('.empty-state');

  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  if (filterInput) {
    var initialQuery = getQueryParam('q');
    if (initialQuery) {
      filterInput.value = initialQuery;
    }
  }

  function filterMovies() {
    if (!filterItems.length) {
      return;
    }

    var text = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var year = filterYear ? filterYear.value : '';
    var region = filterRegion ? filterRegion.value : '';
    var visible = 0;

    filterItems.forEach(function (item) {
      var haystack = [
        item.dataset.title || '',
        item.dataset.genre || '',
        item.dataset.region || '',
        item.dataset.year || '',
        item.dataset.tags || ''
      ].join(' ').toLowerCase();
      var matchedText = !text || haystack.indexOf(text) !== -1;
      var matchedYear = !year || item.dataset.year === year;
      var matchedRegion = !region || item.dataset.region === region;
      var matched = matchedText && matchedYear && matchedRegion;
      item.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.style.display = visible ? 'none' : 'block';
    }
  }

  [filterInput, filterYear, filterRegion].forEach(function (control) {
    if (control) {
      control.addEventListener('input', filterMovies);
      control.addEventListener('change', filterMovies);
    }
  });

  filterMovies();
})();
