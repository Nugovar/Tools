const ADMIN_EMAIL = window.APP_CONFIG?.adminEmail || "your-email@gmail.com";

const ALL_ITEMS = window.CATEGORIES.flatMap(category =>
  category.items.map(item => ({
    ...item,
    categoryId: category.id,
    categoryLabel: category.label,
    type: category.type,
    priority: category.priority,
    status: "approved"
  }))
);

const state = {
  user: null,
  ratings: {},
  visits: {},
  hidden: {},
  favorites: {},
  submissions: [],
  category: "all",
  type: "all",
  query: "",
  sort: "priority",
  view: "catalog"
};

function currentUserId() {
  return state.user?.email || "guest";
}

function isAdmin() {
  return state.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("cabinet-state-v2") || "{}");
    state.user = saved.user || null;
    state.ratings = saved.ratings || {};
    state.visits = saved.visits || {};
    state.hidden = saved.hidden || {};
    state.favorites = saved.favorites || {};
    state.submissions = saved.submissions || [];
  } catch (error) {
    console.warn("State could not be loaded.", error);
  }
}

function saveState() {
  localStorage.setItem("cabinet-state-v2", JSON.stringify({
    user: state.user,
    ratings: state.ratings,
    visits: state.visits,
    hidden: state.hidden,
    favorites: state.favorites,
    submissions: state.submissions
  }));
}

function userMap(collection) {
  const id = currentUserId();
  collection[id] ||= {};
  return collection[id];
}

function buildCategoryChips() {
  const row = document.getElementById("categoryChips");
  const chips = [{ id: "all", label: "ყველა კატეგორია" }, ...window.CATEGORIES.map(({ id, label }) => ({ id, label }))];
  row.innerHTML = chips.map(chip =>
    `<button class="chip ${state.category === chip.id ? "active" : ""}" data-category="${chip.id}">${chip.label}</button>`
  ).join("");
}

function approvedSubmissions() {
  return state.submissions
    .filter(item => item.status === "approved")
    .map(item => ({
      ...item,
      categoryLabel: item.categoryLabel || item.categoryId,
      priority: item.type === "tool" ? 5 : 4
    }));
}

function allVisibleSourceItems() {
  return [...ALL_ITEMS, ...approvedSubmissions()];
}

function getFilteredItems() {
  const query = state.query.trim().toLowerCase();
  const hidden = userMap(state.hidden);
  const favorites = userMap(state.favorites);
  let items = allVisibleSourceItems();

  if (state.view === "hidden") {
    items = items.filter(item => hidden[item.id]);
  } else {
    items = items.filter(item => !hidden[item.id]);
  }

  if (state.view === "favorites") {
    items = items.filter(item => favorites[item.id]);
  }

  if (state.type !== "all" && ["catalog", "favorites", "hidden"].includes(state.view)) {
    items = items.filter(item => item.type === state.type);
  }

  if (state.category !== "all" && ["catalog", "favorites", "hidden"].includes(state.view)) {
    items = items.filter(item => item.categoryId === state.category);
  }

  if (query && ["catalog", "favorites", "hidden"].includes(state.view)) {
    items = items.filter(item => {
      const haystack = [item.name, item.desc, item.alt, item.categoryLabel, item.type].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }

  return sortItems(items);
}

function sortItems(items) {
  const cloned = [...items];
  if (state.sort === "rating-desc") {
    return cloned.sort((a, b) => getAverageRating(b.id) - getAverageRating(a.id) || a.name.localeCompare(b.name));
  }
  if (state.sort === "visits-desc") {
    return cloned.sort((a, b) => (state.visits[b.id] || 0) - (state.visits[a.id] || 0) || a.name.localeCompare(b.name));
  }
  if (state.sort === "name-asc") {
    return cloned.sort((a, b) => a.name.localeCompare(b.name));
  }
  return cloned.sort((a, b) => b.priority - a.priority || (state.visits[b.id] || 0) - (state.visits[a.id] || 0) || a.name.localeCompare(b.name));
}

function getAverageRating(id) {
  const values = Object.values(state.ratings).map(userRatings => userRatings[id]).filter(Boolean);
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function starRow(id) {
  const rating = userMap(state.ratings)[id] || 0;
  return Array.from({ length: 5 }, (_, index) => {
    const value = index + 1;
    return `<span class="star ${value <= rating ? "filled" : ""}" data-rate="${id}" data-value="${value}" title="${value} ვარსკვლავი">★</span>`;
  }).join("");
}

function cardHtml(item) {
  const visits = state.visits[item.id] || 0;
  const badge = item.type === "tool" ? "ხელსაწყო" : "თამაში";
  const favoriteActive = userMap(state.favorites)[item.id] ? "active" : "";
  const hideLabel = state.view === "hidden" ? "↩" : "×";
  const hideTitle = state.view === "hidden" ? "დაბრუნება კატალოგში" : "ჩემთვის დამალვა";
  return `
    <article class="card ${item.type}">
      <div class="card-top">
        <div class="name">${item.name}</div>
        <div class="badge">${badge}</div>
      </div>
      <div class="desc">${item.desc}</div>
      ${item.alt ? `<div class="alt">${item.alt}</div>` : ""}
      <div class="meta">
        <div class="stars">${starRow(item.id)}</div>
        <div class="visits">${visits} ვიზიტი</div>
      </div>
      <div class="actions">
        <a class="open" href="${item.url}" target="_blank" rel="noopener" data-visit="${item.id}">გახსნა</a>
        <button class="favorite ${favoriteActive}" data-favorite="${item.id}" title="ფავორიტებში დამატება" aria-label="ფავორიტებში დამატება">★</button>
        <button class="delete" data-hide="${item.id}" title="${hideTitle}" aria-label="${hideTitle}">${hideLabel}</button>
      </div>
    </article>
  `;
}

function renderGrouped(items) {
  return window.CATEGORIES
    .filter(category => state.category === "all" || state.category === category.id)
    .map(category => {
      const categoryItems = items.filter(item => item.categoryId === category.id);
      if (!categoryItems.length) return "";
      return `
        <section class="section">
          <div class="section-head">
            <h2>${category.label}</h2>
            <span>${categoryItems.length}</span>
          </div>
          <div class="grid">${categoryItems.map(cardHtml).join("")}</div>
        </section>
      `;
    }).join("");
}

function renderFlat(items) {
  return `<div class="grid">${items.map(cardHtml).join("")}</div>`;
}

function renderAccount() {
  const box = document.getElementById("accountBox");
  if (!state.user) {
    box.innerHTML = `
      <div class="account-name">სტუმრის რეჟიმი</div>
      <div class="account-email">Firebase ჩართვის შემდეგ აქ Google Login იქნება.</div>
      <button class="primary-button" data-demo-login>Demo შესვლა</button>
    `;
    return;
  }

  box.innerHTML = `
    <div>
      <div class="account-name">${state.user.name}</div>
      <div class="account-email">${state.user.email}${isAdmin() ? " · admin" : ""}</div>
    </div>
    <div class="account-actions">
      <button class="ghost-button" data-demo-login>შეცვლა</button>
      <button class="ghost-button" data-logout>გასვლა</button>
    </div>
  `;
}

function renderShellState() {
  document.querySelectorAll("[data-view]").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.view === state.view);
  });
  document.querySelectorAll(".admin-only").forEach(item => {
    item.hidden = !isAdmin();
  });
  const browsing = ["catalog", "favorites", "hidden"].includes(state.view);
  document.querySelector(".toolbar").hidden = !browsing;
  document.getElementById("categoryChips").hidden = !browsing;
}

function renderCatalogLikeView() {
  buildCategoryChips();
  const items = getFilteredItems();
  const grouped = state.sort === "priority" || state.sort === "category";
  const emptyText = state.view === "favorites"
    ? "ფავორიტები ჯერ ცარიელია. მონიშნე ვარსკვლავით სასურველი ბარათები."
    : state.view === "hidden"
      ? "დამალული აპები ჯერ არ გაქვს."
      : "ამ ფილტრით არაფერი მოიძებნა. სცადე სხვა კატეგორია ან საძიებო სიტყვა.";

  return items.length
    ? (grouped ? renderGrouped(items) : renderFlat(items))
    : `<div class="empty">${emptyText}</div>`;
}

function renderSubmitView() {
  return `
    <section class="panel">
      <h2>აპის ან თამაშის დამატება</h2>
      <p>შენი შეთავაზება ჯერ გადადის დასადასტურებლად. ადმინის დადასტურების შემდეგ გამოჩნდება საერთო კატალოგში.</p>
      <form class="form-grid" id="submissionForm">
        <label class="field"><span>სახელი</span><input name="name" required placeholder="მაგ: TinyWow"></label>
        <label class="field"><span>ბმული</span><input name="url" type="url" required placeholder="https://..."></label>
        <label class="field"><span>ტიპი</span><select name="type"><option value="tool">ხელსაწყო</option><option value="game">თამაში</option></select></label>
        <label class="field"><span>კატეგორია</span><select name="categoryId">${window.CATEGORIES.map(category => `<option value="${category.id}">${category.label}</option>`).join("")}</select></label>
        <label class="field"><span>მოკლე აღწერა</span><textarea name="desc" required placeholder="რისთვის არის კარგი?"></textarea></label>
        <button class="primary-button" type="submit">დამატება დასადასტურებლად</button>
      </form>
    </section>
  `;
}

function renderProfileView() {
  const favoritesCount = Object.keys(userMap(state.favorites)).length;
  const hiddenCount = Object.keys(userMap(state.hidden)).length;
  const ratingsCount = Object.keys(userMap(state.ratings)).length;
  const score = ratingsCount * 2 + favoritesCount * 3 + state.submissions.filter(item => item.createdBy === currentUserId() && item.status === "approved").length * 10;
  return `
    <section class="panel">
      <h2>პროფილი</h2>
      <p>${state.user ? `${state.user.name} · ${state.user.email}` : "ჯერ სტუმრის რეჟიმში ხარ."}</p>
      <div class="grid">
        <div class="stat"><strong>${score}</strong><span>ქულა</span></div>
        <div class="stat"><strong>${favoritesCount}</strong><span>ფავორიტი</span></div>
        <div class="stat"><strong>${hiddenCount}</strong><span>დამალული</span></div>
        <div class="stat"><strong>${ratingsCount}</strong><span>შეფასება</span></div>
      </div>
    </section>
  `;
}

function renderAdminView() {
  if (!isAdmin()) {
    return `<div class="empty">ადმინ პანელი მხოლოდ შენს მეილზე გამოჩნდება.</div>`;
  }
  const pending = state.submissions.filter(item => item.status === "pending");
  return `
    <section class="panel">
      <h2>ადმინ პანელი</h2>
      <p>აქ გამოჩნდება მომხმარებლების მიერ დამატებული აპები. დადასტურების შემდეგ ისინი კატალოგში გადავა.</p>
      <div class="table-list">
        ${pending.length ? pending.map(item => `
          <div class="list-row">
            <div>
              <strong>${item.name}</strong>
              <span>${item.desc}<br>${item.url}<br>ავტორი: ${item.createdBy}</span>
            </div>
            <div>
              <button class="small-button" data-approve="${item.id}">დადასტურება</button>
              <button class="small-button" data-reject="${item.id}">უარყოფა</button>
            </div>
          </div>
        `).join("") : `<div class="empty">დასადასტურებელი არაფერია.</div>`}
      </div>
    </section>
  `;
}

function render() {
  renderAccount();
  renderShellState();
  const main = document.getElementById("mainContent");

  if (["catalog", "favorites", "hidden"].includes(state.view)) {
    main.innerHTML = renderCatalogLikeView();
  } else if (state.view === "submit") {
    main.innerHTML = renderSubmitView();
  } else if (state.view === "profile") {
    main.innerHTML = renderProfileView();
  } else if (state.view === "admin") {
    main.innerHTML = renderAdminView();
  }

  document.getElementById("totalCount").textContent = allVisibleSourceItems().length;
  document.getElementById("visibleCount").textContent = ["catalog", "favorites", "hidden"].includes(state.view) ? getFilteredItems().length : "-";
  document.getElementById("savedCount").textContent = Object.keys(userMap(state.ratings)).length;
  attachHandlers();
}

function attachHandlers() {
  document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      render();
    });
  });

  document.querySelectorAll("[data-view]").forEach(button => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      render();
    });
  });

  document.querySelectorAll("[data-rate]").forEach(star => {
    star.addEventListener("click", () => {
      userMap(state.ratings)[star.dataset.rate] = Number(star.dataset.value);
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-favorite]").forEach(button => {
    button.addEventListener("click", () => {
      const favorites = userMap(state.favorites);
      favorites[button.dataset.favorite] ? delete favorites[button.dataset.favorite] : favorites[button.dataset.favorite] = true;
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-hide]").forEach(button => {
    button.addEventListener("click", () => {
      const hidden = userMap(state.hidden);
      hidden[button.dataset.hide] ? delete hidden[button.dataset.hide] : hidden[button.dataset.hide] = true;
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-visit]").forEach(link => {
    link.addEventListener("click", () => {
      state.visits[link.dataset.visit] = (state.visits[link.dataset.visit] || 0) + 1;
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-demo-login]").forEach(button => {
    button.addEventListener("click", () => {
      const email = prompt("ჩაწერე შენი Gmail. ადმინისთვის firebase-config.js-ში იგივე მეილი უნდა ეწეროს.", state.user?.email || ADMIN_EMAIL);
      if (!email) return;
      state.user = {
        email: email.trim(),
        name: email.split("@")[0]
      };
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-logout]").forEach(button => {
    button.addEventListener("click", () => {
      state.user = null;
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-approve]").forEach(button => {
    button.addEventListener("click", () => {
      const item = state.submissions.find(submission => submission.id === button.dataset.approve);
      if (item) item.status = "approved";
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-reject]").forEach(button => {
    button.addEventListener("click", () => {
      const item = state.submissions.find(submission => submission.id === button.dataset.reject);
      if (item) item.status = "rejected";
      saveState();
      render();
    });
  });

  const form = document.getElementById("submissionForm");
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(form);
      const categoryId = data.get("categoryId");
      const category = window.CATEGORIES.find(item => item.id === categoryId);
      state.submissions.push({
        id: `submission-${Date.now()}`,
        name: data.get("name").trim(),
        url: data.get("url").trim(),
        type: data.get("type"),
        categoryId,
        categoryLabel: category?.label || categoryId,
        desc: data.get("desc").trim(),
        status: "pending",
        createdBy: currentUserId()
      });
      saveState();
      form.reset();
      alert("დამატებულია დასადასტურებლად.");
      render();
    });
  }
}

document.getElementById("searchInput").addEventListener("input", event => {
  state.query = event.target.value;
  render();
});

document.getElementById("sortSelect").addEventListener("change", event => {
  state.sort = event.target.value;
  render();
});

document.querySelectorAll("[data-type]").forEach(button => {
  button.addEventListener("click", () => {
    state.type = button.dataset.type;
    document.querySelectorAll("[data-type]").forEach(item => item.classList.toggle("active", item === button));
    render();
  });
});

loadState();
render();
