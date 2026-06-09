(function () {
    var mobileButton = document.querySelector('.menu-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');

    if (mobileButton && mobilePanel) {
        mobileButton.addEventListener('click', function () {
            var open = mobilePanel.classList.toggle('is-open');
            mobileButton.setAttribute('aria-expanded', String(open));
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        var showSlide = function (index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        };

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot') || 0));
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    }

    document.querySelectorAll('[data-scroll-row]').forEach(function (row) {
        var section = row.closest('.content-section');
        if (!section) {
            return;
        }

        var previous = section.querySelector('[data-scroll-prev]');
        var next = section.querySelector('[data-scroll-next]');
        var amount = 380;

        if (previous) {
            previous.addEventListener('click', function () {
                row.scrollBy({ left: -amount, behavior: 'smooth' });
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                row.scrollBy({ left: amount, behavior: 'smooth' });
            });
        }
    });

    var normalize = function (value) {
        return String(value || '').toLowerCase().trim();
    };

    var applyFilters = function (panel) {
        var input = panel.querySelector('[data-filter-input]');
        var activeChip = panel.querySelector('[data-filter-chip].is-active');
        var sortSelect = panel.querySelector('[data-sort-select]');
        var grid = document.querySelector('[data-card-grid]');
        var query = normalize(input ? input.value : '');
        var chip = normalize(activeChip ? activeChip.getAttribute('data-filter-chip') : '');

        if (!grid) {
            return;
        }

        var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-tags')
            ].join(' '));
            var matchedQuery = !query || haystack.indexOf(query) !== -1;
            var matchedChip = !chip || haystack.indexOf(chip) !== -1;
            card.classList.toggle('is-hidden', !(matchedQuery && matchedChip));
        });

        if (sortSelect) {
            var sortValue = sortSelect.value;
            if (sortValue !== 'default') {
                cards.sort(function (a, b) {
                    if (sortValue === 'year-desc') {
                        return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
                    }
                    return normalize(a.getAttribute('data-title')).localeCompare(normalize(b.getAttribute('data-title')), 'zh-Hans-CN');
                });
                cards.forEach(function (card) {
                    grid.appendChild(card);
                });
            }
        }
    };

    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
        var input = panel.querySelector('[data-filter-input]');
        var sortSelect = panel.querySelector('[data-sort-select]');
        var chips = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-chip]'));
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');

        if (input && query) {
            input.value = query;
        }

        if (input) {
            input.addEventListener('input', function () {
                applyFilters(panel);
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                applyFilters(panel);
            });
        }

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                chips.forEach(function (item) {
                    item.classList.remove('is-active');
                });
                chip.classList.add('is-active');
                applyFilters(panel);
            });
        });

        applyFilters(panel);
    });

    document.querySelectorAll('.video-player').forEach(function (player) {
        var video = player.querySelector('video');
        var button = player.querySelector('[data-play]');
        var stream = player.getAttribute('data-stream');
        var started = false;
        var hlsInstance = null;

        var attachStream = function () {
            if (!video || !stream || started) {
                return;
            }

            started = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
                return;
            }

            video.src = stream;
        };

        var play = function () {
            attachStream();
            player.classList.add('is-playing');
            if (video) {
                var promise = video.play();
                if (promise && typeof promise.catch === 'function') {
                    promise.catch(function () {
                        player.classList.remove('is-playing');
                    });
                }
            }
        };

        if (button) {
            button.addEventListener('click', play);
        }

        if (video) {
            video.addEventListener('play', function () {
                player.classList.add('is-playing');
            });
            video.addEventListener('pause', function () {
                if (!video.ended) {
                    player.classList.remove('is-playing');
                }
            });
            video.addEventListener('ended', function () {
                player.classList.remove('is-playing');
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hlsInstance && typeof hlsInstance.destroy === 'function') {
                hlsInstance.destroy();
            }
        });
    });
})();
