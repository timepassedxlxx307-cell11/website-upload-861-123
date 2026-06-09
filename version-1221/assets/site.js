(function () {
    var MovieSite = {};

    function normalize(value) {
        return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    MovieSite.initMenu = function () {
        var button = document.querySelector('[data-menu-button]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    };

    MovieSite.initHero = function () {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var index = parseInt(dot.getAttribute('data-hero-dot'), 10);
                show(index);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    };

    MovieSite.initSearch = function () {
        var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-search-scope]'));
        scopes.forEach(function (scope) {
            var input = scope.querySelector('[data-search-input]');
            var chips = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-value]'));
            var empty = scope.querySelector('[data-empty-result]');
            var activeFilter = '';

            function items() {
                return Array.prototype.slice.call(scope.querySelectorAll('.search-item'));
            }

            function apply() {
                var query = normalize(input ? input.value : '');
                var filter = normalize(activeFilter);
                var visible = 0;
                if (query) {
                    scope.classList.add('has-search');
                } else {
                    scope.classList.remove('has-search');
                }
                items().forEach(function (item) {
                    var text = normalize(item.getAttribute('data-search-text') || item.textContent);
                    var matchedQuery = !query || text.indexOf(query) !== -1;
                    var matchedFilter = !filter || text.indexOf(filter) !== -1;
                    var matched = matchedQuery && matchedFilter;
                    item.style.display = matched ? '' : 'none';
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }

            if (input) {
                input.addEventListener('input', apply);
            }

            chips.forEach(function (chip) {
                chip.addEventListener('click', function () {
                    chips.forEach(function (other) {
                        other.classList.remove('is-active');
                    });
                    chip.classList.add('is-active');
                    activeFilter = chip.getAttribute('data-filter-value') || '';
                    apply();
                });
            });
        });
    };

    MovieSite.initPlayer = function (streamUrl) {
        var video = document.getElementById('video-player');
        var trigger = document.getElementById('play-trigger');
        var shell = document.getElementById('player-shell');
        var loaded = false;
        var hls = null;

        if (!video || !streamUrl) {
            return;
        }

        function hideTrigger() {
            if (trigger) {
                trigger.classList.add('is-hidden');
            }
        }

        function playVideo() {
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        function attach() {
            if (loaded) {
                hideTrigger();
                playVideo();
                return;
            }
            loaded = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                video.load();
                playVideo();
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    playVideo();
                });
            } else {
                video.src = streamUrl;
                video.load();
                playVideo();
            }
            hideTrigger();
        }

        if (trigger) {
            trigger.addEventListener('click', function (event) {
                event.preventDefault();
                attach();
            });
        }

        if (shell) {
            shell.addEventListener('click', function (event) {
                if (!loaded && event.target !== video) {
                    attach();
                }
            });
        }

        video.addEventListener('click', function () {
            if (!loaded) {
                attach();
            }
        });

        video.addEventListener('play', hideTrigger);
        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        MovieSite.initMenu();
        MovieSite.initHero();
        MovieSite.initSearch();
    });

    window.MovieSite = MovieSite;
})();
