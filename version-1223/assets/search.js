(function () {
  var input = document.getElementById("searchInput");
  var box = document.getElementById("searchResults");
  var data = window.MOVIE_SEARCH_INDEX || [];
  var params = new URLSearchParams(window.location.search);
  var keyword = params.get("q") || "";

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render(items) {
    if (!box) return;

    if (!items.length) {
      box.innerHTML = '<div class="search-empty">请输入片名、地区、年份、类型或标签进行检索。</div>';
      return;
    }

    box.innerHTML = items.slice(0, 120).map(function (item) {
      return [
        '<article class="movie-card">',
        '<a class="card-cover" href="' + escapeHtml(item.url) + '">',
        '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
        '<span class="play-badge">▶</span>',
        '</a>',
        '<div class="card-body">',
        '<a class="card-title" href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a>',
        '<div class="card-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>',
        '<p>' + escapeHtml(item.line) + '</p>',
        '<div class="tag-row"><span>' + escapeHtml(item.genre) + '</span></div>',
        '</div>',
        '</article>'
      ].join("");
    }).join("");
  }

  function search(value) {
    var q = value.trim().toLowerCase();

    if (!q) {
      render(data.slice(0, 24));
      return;
    }

    render(data.filter(function (item) {
      return [item.title, item.year, item.region, item.type, item.genre, item.tags, item.line]
        .join(" ")
        .toLowerCase()
        .indexOf(q) !== -1;
    }));
  }

  if (input) {
    input.value = keyword;
    input.addEventListener("input", function () {
      search(input.value);
    });
  }

  search(keyword);
})();
