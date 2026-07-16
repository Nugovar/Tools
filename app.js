const ALL_ITEMS = window.CATEGORIES.flatMap(category =>
      category.items.map(item => ({
        ...item,
        categoryId: category.id,
        categoryLabel: category.label,
        type: category.type,
        priority: category.priority
      }))
    );

    const state = {
      ratings: {},
      visits: {},
      deleted: {},
      category: "all",
      type: "all",
      query: "",
      sort: "priority"
    };

    function loadState() {
      try {
        const saved = JSON.parse(localStorage.getItem("cabinet-state") || "{}");
        state.ratings = saved.ratings || {};
        state.visits = saved.visits || {};
        state.deleted = saved.deleted || {};
      } catch (error) {
        console.warn("State could not be loaded.", error);
      }
    }

    function saveState() {
      localStorage.setItem("cabinet-state", JSON.stringify({
        ratings: state.ratings,
        visits: state.visits,
        deleted: state.deleted
      }));
    }

    function buildCategoryChips() {
      const row = document.getElementById("categoryChips");
      const chips = [{ id: "all", label: "ყველა კატეგორია" }, ...CATEGORIES.map(({ id, label }) => ({ id, label }))];
      row.innerHTML = chips.map(chip =>
        `<button class="chip ${state.category === chip.id ? "active" : ""}" data-category="${chip.id}">${chip.label}</button>`
      ).join("");
    }

    function getFilteredItems() {
      const query = state.query.trim().toLowerCase();
      let items = ALL_ITEMS.filter(item => !state.deleted[item.id]);

      if (state.type !== "all") items = items.filter(item => item.type === state.type);
      if (state.category !== "all") items = items.filter(item => item.categoryId === state.category);

      if (query) {
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
        return cloned.sort((a, b) => (state.ratings[b.id] || 0) - (state.ratings[a.id] || 0) || a.name.localeCompare(b.name));
      }
      if (state.sort === "visits-desc") {
        return cloned.sort((a, b) => (state.visits[b.id] || 0) - (state.visits[a.id] || 0) || a.name.localeCompare(b.name));
      }
      if (state.sort === "name-asc") {
        return cloned.sort((a, b) => a.name.localeCompare(b.name));
      }
      if (state.sort === "category") {
        return cloned.sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
      }
      return cloned.sort((a, b) => b.priority - a.priority || (state.visits[b.id] || 0) - (state.visits[a.id] || 0) || a.name.localeCompare(b.name));
    }

    function starRow(id) {
      const rating = state.ratings[id] || 0;
      return Array.from({ length: 5 }, (_, index) => {
        const value = index + 1;
        return `<span class="star ${value <= rating ? "filled" : ""}" data-rate="${id}" data-value="${value}" title="${value} ვარსკვლავი">★</span>`;
      }).join("");
    }

    function cardHtml(item) {
      const visits = state.visits[item.id] || 0;
      const badge = item.type === "tool" ? "ხელსაწყო" : "თამაში";
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
            <button class="delete" data-delete="${item.id}" title="ბარათის დამალვა" aria-label="ბარათის დამალვა">×</button>
          </div>
        </article>
      `;
    }

    function renderGrouped(items) {
      return CATEGORIES
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

    function render() {
      buildCategoryChips();
      const items = getFilteredItems();
      const main = document.getElementById("mainContent");
      const grouped = state.sort === "priority" || state.sort === "category";

      main.innerHTML = items.length
        ? (grouped ? renderGrouped(items) : renderFlat(items))
        : `<div class="empty">ამ ფილტრით არაფერი მოიძებნა. სცადე სხვა კატეგორია ან საძიებო სიტყვა.</div>`;

      document.getElementById("totalCount").textContent = ALL_ITEMS.filter(item => !state.deleted[item.id]).length;
      document.getElementById("visibleCount").textContent = items.length;
      document.getElementById("savedCount").textContent = Object.keys(state.ratings).length;
      attachHandlers();
    }

    function attachHandlers() {
      document.querySelectorAll("[data-category]").forEach(button => {
        button.addEventListener("click", () => {
          state.category = button.dataset.category;
          render();
        });
      });

      document.querySelectorAll("[data-rate]").forEach(star => {
        star.addEventListener("click", () => {
          state.ratings[star.dataset.rate] = Number(star.dataset.value);
          saveState();
          render();
        });
      });

      document.querySelectorAll("[data-delete]").forEach(button => {
        button.addEventListener("click", () => {
          if (confirm("დავმალო ეს ბარათი?")) {
            state.deleted[button.dataset.delete] = true;
            saveState();
            render();
          }
        });
      });

      document.querySelectorAll("[data-visit]").forEach(link => {
        link.addEventListener("click", () => {
          state.visits[link.dataset.visit] = (state.visits[link.dataset.visit] || 0) + 1;
          saveState();
          render();
        });
      });
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
