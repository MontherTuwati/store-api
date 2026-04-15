(function () {
  const base = window.location.origin;

  const tabLocal = document.getElementById("tab-local");
  const tabAll = document.getElementById("tab-all");
  const panelLocal = document.getElementById("panel-local");
  const panelAll = document.getElementById("panel-all");
  const statusLocal = document.getElementById("status-local");
  const statusAll = document.getElementById("status-all");
  const tableLocal = document.getElementById("table-local");
  const tableAll = document.getElementById("table-all");

  // Build table markup from product arrays returned by the API.
  function renderTable(container, rows, extraCols) {
    if (!rows.length) {
      container.innerHTML = "<p class=\"status\">No products.</p>";
      return;
    }
    const head =
      "<thead><tr><th>Store</th><th>Product</th><th>ID</th>" +
      (extraCols ? "<th>Source</th>" : "") +
      "<th class=\"price\">Price</th></tr></thead>";
    const body =
      "<tbody>" +
      rows
        .map((p) => {
          const src = p.source != null ? `<td>${escapeHtml(p.source)}</td>` : "";
          return (
            "<tr><td>" +
            escapeHtml(p.storeName) +
            "</td><td>" +
            escapeHtml(p.productName) +
            "</td><td>" +
            escapeHtml(String(p.productId)) +
            "</td>" +
            (extraCols ? src : "") +
            '<td class="price">' +
            formatPrice(p.price) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody>";
    container.innerHTML = "<table>" + head + body + "</table>";
  }

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function formatPrice(n) {
    const x = Number(n);
    return Number.isFinite(x) ? "$" + x.toFixed(2) : "—";
  }

  function setStatus(el, msg, isError) {
    el.textContent = msg;
    el.classList.toggle("error", !!isError);
  }

  // Local store endpoint (assignment getAll).
  async function loadLocal() {
    setStatus(statusLocal, "Loading…", false);
    try {
      const res = await fetch(base + "/getAll");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Expected a JSON array");
      setStatus(statusLocal, data.length + " product(s) from database.", false);
      renderTable(tableLocal, data, false);
    } catch (e) {
      setStatus(statusLocal, "Could not load /getAll: " + e.message, true);
      tableLocal.innerHTML = "";
    }
  }

  async function loadAll() {
    setStatus(statusAll, "Loading…", false);
    try {
      const res = await fetch(base + "/products/all-stores");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const products = data.products;
      if (!Array.isArray(products)) throw new Error("Expected products array");
      let msg = data.count != null ? data.count + " product(s) total." : products.length + " product(s).";
      if (data.fetchErrors && data.fetchErrors.length) {
        msg += " Some remote stores failed to load.";
      }
      setStatus(statusAll, msg, false);
      renderTable(tableAll, products, true);
    } catch (e) {
      setStatus(statusAll, "Could not load /products/all-stores: " + e.message, true);
      tableAll.innerHTML = "";
    }
  }

  function selectTab(which) {
    const isLocal = which === "local";
    tabLocal.setAttribute("aria-selected", isLocal);
    tabAll.setAttribute("aria-selected", !isLocal);
    panelLocal.hidden = !isLocal;
    panelAll.hidden = isLocal;
    // Load combined data only when the tab is opened the first time.
    if (!isLocal && !panelAll.dataset.loaded) {
      panelAll.dataset.loaded = "1";
      loadAll();
    }
  }

  tabLocal.addEventListener("click", () => selectTab("local"));
  tabAll.addEventListener("click", () => selectTab("all"));

  loadLocal();
})();
