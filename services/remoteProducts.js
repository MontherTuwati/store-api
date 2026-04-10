/**
 * Fetches JSON product arrays from teammate deployed APIs.
 * Juan: GET /products
 * Maya: GET /products (JSON; /products-view is HTML for browsers)
 */

function remoteTimeoutMs() {
  const n = Number(process.env.REMOTE_FETCH_TIMEOUT_MS);
  return Number.isFinite(n) && n > 0 ? n : 60000;
}

async function fetchJson(url, label) {
  if (!url || !String(url).trim()) {
    return { ok: false, label, error: "URL not configured", products: [] };
  }
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(remoteTimeoutMs()),
    });
    if (!res.ok) {
      return {
        ok: false,
        label,
        error: `HTTP ${res.status}`,
        products: [],
      };
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      return {
        ok: false,
        label,
        error: "Response is not a JSON array",
        products: [],
      };
    }
    return { ok: true, label, error: null, products: data };
  } catch (err) {
    return {
      ok: false,
      label,
      error: err.message || String(err),
      products: [],
    };
  }
}

function normalizeDoc(doc, source) {
  return {
    storeId: doc.storeId,
    storeName: doc.storeName,
    productId: doc.productId,
    productName: doc.productName,
    price: doc.price,
    source,
  };
}

async function loadRemoteStores(env) {
  const juan = await fetchJson(env.JUAN_PRODUCTS_URL, "juan");
  const maya = await fetchJson(env.MAYA_PRODUCTS_URL, "maya");

  const juanItems = juan.products.map((p) => normalizeDoc(p, "juan"));
  const mayaItems = maya.products.map((p) => normalizeDoc(p, "maya"));

  const errors = [];
  if (!juan.ok) errors.push({ source: "juan", message: juan.error });
  if (!maya.ok) errors.push({ source: "maya", message: maya.error });

  return {
    juanItems,
    mayaItems,
    errors,
    partial: errors.length > 0,
  };
}

module.exports = { loadRemoteStores, normalizeDoc };
