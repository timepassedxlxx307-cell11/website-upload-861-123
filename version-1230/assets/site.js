(function () {
  var mobileButton = document.querySelector('[data-mobile-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (mobileButton && mobilePanel) {
    mobileButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  document.addEventListener('error', function (event) {
    var target = event.target;
    if (target && target.matches && target.matches('[data-cover-image]')) {
      target.style.display = 'none';
    }
  }, true);

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    var showSlide = function (nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    window.setInterval(function () {
      showSlide(index + 1);
    }, 5600);
  }

  var grids = Array.prototype.slice.call(document.querySelectorAll('[data-card-grid]'));
  grids.forEach(function (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card, .horizontal-card'));
    var panel = grid.parentElement;
    var input = panel ? panel.querySelector('[data-filter-input]') : null;
    var sort = panel ? panel.querySelector('[data-filter-sort]') : null;
    var empty = panel ? panel.querySelector('[data-empty-state]') : null;

    var applyFilter = function () {
      var query = input ? input.value.trim().toLowerCase() : '';
      var visibleCards = [];

      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase() + ' ' + [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();
        var visible = !query || text.indexOf(query) !== -1;
        card.hidden = !visible;
        if (visible) {
          visibleCards.push(card);
        }
      });

      if (sort) {
        var mode = sort.value;
        var ordered = visibleCards.slice();
        if (mode === 'year-desc') {
          ordered.sort(function (a, b) {
            return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
          });
        }
        if (mode === 'title-asc') {
          ordered.sort(function (a, b) {
            return String(a.getAttribute('data-title')).localeCompare(String(b.getAttribute('data-title')), 'zh-Hans-CN');
          });
        }
        ordered.forEach(function (card) {
          grid.appendChild(card);
        });
      }

      if (empty) {
        empty.hidden = visibleCards.length > 0;
      }
    };

    if (input) {
      input.addEventListener('input', applyFilter);
    }
    if (sort) {
      sort.addEventListener('change', applyFilter);
    }
  });

  var searchResults = document.querySelector('[data-search-results]');
  if (searchResults && window.MOVIE_SEARCH_DATA) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var input = document.querySelector('[data-search-page-input]');
    var title = document.querySelector('[data-search-title]');
    var subtitle = document.querySelector('[data-search-subtitle]');
    var empty = document.querySelector('[data-search-empty]');

    if (input) {
      input.value = query;
    }

    if (query.trim()) {
      var lowerQuery = query.trim().toLowerCase();
      var results = window.MOVIE_SEARCH_DATA.filter(function (movie) {
        return [
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.tags,
          movie.oneLine,
          movie.category
        ].join(' ').toLowerCase().indexOf(lowerQuery) !== -1;
      });

      if (title) {
        title.textContent = '搜索结果';
      }
      if (subtitle) {
        subtitle.textContent = '关键词：' + query;
      }

      searchResults.innerHTML = results.slice(0, 300).map(function (movie) {
        return [
          '<a class="movie-card" href="' + movie.url + '">',
          '  <div class="poster-shell">',
          '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" data-cover-image>',
          '    <div class="poster-shade"></div>',
          '    <span class="region-pill">' + escapeHtml(movie.region) + '</span>',
          '    <span class="play-hover">▶</span>',
          '  </div>',
          '  <div class="movie-card-body">',
          '    <div class="meta-row"><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.year) + '</span></div>',
          '    <h2>' + escapeHtml(movie.title) + '</h2>',
          '    <p>' + escapeHtml(movie.oneLine) + '</p>',
          '    <div class="tag-row"><span>' + escapeHtml(movie.category) + '</span></div>',
          '  </div>',
          '</a>'
        ].join('\n');
      }).join('\n');

      if (empty) {
        empty.hidden = results.length > 0;
      }
    }
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
