(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function applyCardFilter(root) {
        var input = root.querySelector("[data-search-input]");
        var typeSelect = root.querySelector("[data-type-filter]");
        var yearSelect = root.querySelector("[data-year-filter]");
        var cards = Array.prototype.slice.call(root.querySelectorAll("[data-card]"));
        if (!cards.length) {
            return;
        }

        function update() {
            var keyword = input ? normalize(input.value) : "";
            var selectedType = typeSelect ? normalize(typeSelect.value) : "";
            var selectedYear = yearSelect ? normalize(yearSelect.value) : "";

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-search"));
                var type = normalize(card.getAttribute("data-type"));
                var year = normalize(card.getAttribute("data-year"));
                var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
                var matchedType = !selectedType || type === selectedType;
                var matchedYear = !selectedYear || year === selectedYear;
                card.classList.toggle("is-filtered-out", !(matchedKeyword && matchedType && matchedYear));
            });
        }

        if (input) {
            input.addEventListener("input", update);
        }
        if (typeSelect) {
            typeSelect.addEventListener("change", update);
        }
        if (yearSelect) {
            yearSelect.addEventListener("change", update);
        }

        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (query && input) {
            input.value = query;
        }
        update();
    }

    function setupHero() {
        var slider = document.querySelector("[data-hero]");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        function show(index) {
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

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
            });
        });

        setInterval(function () {
            show(current + 1);
        }, 5200);
        show(0);
    }

    function setupNav() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    ready(function () {
        setupNav();
        setupHero();
        document.querySelectorAll("[data-filter-root]").forEach(function (root) {
            applyCardFilter(root);
        });
    });
})();
