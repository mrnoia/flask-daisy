# Adding New Components & Charts (Flask + Jinja + Chart.js + daisyUI)

This guide explains how to add **reusable UI components** (partials) and **new charts** to your Flask project using the same setup already working in your app.

Your project (Option A) looks like this:

```
flask_option_a/
  app.py
  templates/
    base.html
    pages/
      home.html
    partials/
      _navbar.html
      _stats.html
      _components_*.html
  static/
    css/
      dashboard.css
    js/
      dashboard.js   ← unified (original + extra charts)
```

---

## 1) Add new UI components (partials)

A **partial** is just an HTML snippet you can include in any page. Put them in `templates/partials/` and include via:

```jinja
{% include 'partials/_my_component.html' %}
```

### 1.1 Create a component file
Create `templates/partials/_hero_banner.html`:

```html
<section class="hero border border-base-300 rounded-xl">
  <div class="hero-content flex-col lg:flex-row gap-6">
    <img src="https://placehold.co/320x200" class="rounded-lg shadow-2xl" alt="" />
    <div>
      <h1 class="text-3xl font-bold">Welcome back</h1>
      <p class="py-2 opacity-80">Quick links and insights for your workspace.</p>
      <a href="#" class="btn btn-primary">Get started</a>
    </div>
  </div>
</section>
```

> Tip: keep component names prefixed with `_` and grouped: `_components_cards.html`, `_components_modals.html`, etc.

### 1.2 Use the component on a page
Open `templates/pages/home.html` and drop it where you want:

```jinja
{% include 'partials/_hero_banner.html' %}
```

That’s it. Because you’re using Tailwind + daisyUI in `base.html`, the component will adopt the active theme automatically.

---

## 2) Add new charts the **same way** as the originals

You now use **one** script: `static/js/dashboard.js`. It already:

- Defines a color palette per theme.
- Exposes `getThemeColors()` and `applyChartDefaults()`.
- Has a single `rebuildAllCharts()` that **destroys** and **rebuilds** all charts.
- Rebuilds after theme change (via `applyTheme(...)` → `rebuildAllCharts()`).

### 2.1 Declare your chart’s canvas in a partial (recommended)
Create, for example, `templates/partials/_charts_funnel.html`:

```html
<section class="card bg-base-100 shadow-lg">
  <div class="card-body">
    <h2 class="card-title text-lg">Acquisition Funnel</h2>
    <div class="chart-wrap"><canvas id="funnelChart"></canvas></div>
  </div>
</section>
```

Include it on a page:
```jinja
{% include 'partials/_charts_funnel.html' %}
```

> Keep using `.chart-wrap` or `.chart-wrap-sm` so canvases get a fixed height (defined in `static/css/dashboard.css`).

### 2.2 Add a builder function **in `static/js/dashboard.js`**
Open `static/js/dashboard.js` and add a function that follows the same shape as the existing ones:

```js
function buildFunnelChart(ctx, colors) {
  // Example placeholder using a stacked bar approximation of a funnel
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Visits', 'Signups', 'Activated', 'Subscribed'],
      datasets: [
        {
          label: 'Count',
          data: [2000, 800, 320, 160],
          backgroundColor: colors.primaryFill,
          borderColor: colors.primary,
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
    options: {
      ...baseOptions(colors),
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: colors.fg }, grid: { color: colors.grid }, beginAtZero: true },
        y: { ticks: { color: colors.fg }, grid: { display: false } },
      },
    },
  });
}
```

### 2.3 Register it inside `rebuildAllCharts()`
Find `rebuildAllCharts()` and append the creation call (guarded by an ID check):

```js
if (document.getElementById('funnelChart')) {
  charts.push(buildFunnelChart(document.getElementById('funnelChart'), colors));
}
```

Save, hard-refresh the browser (Ctrl/Cmd+Shift+R). The chart will render and will **adapt to theme switches** like all the others.

---

## 3) Conventions to keep everything consistent

- **One source of truth**: keep all chart builders and theme logic in **`static/js/dashboard.js`**. Avoid multiple JS files that manage charts.
- **IDs**: each chart `<canvas>` needs a **unique** `id` that matches the builder you call in `rebuildAllCharts()`.
- **Theme awareness**: always build colors via `getThemeColors()` and call `applyChartDefaults(colors)` before creating charts. That’s already done inside `rebuildAllCharts()`.
- **Destroy before rebuild**: call `.destroy()` on existing Chart instances to prevent memory leaks and ensure fresh colors.
- **CSS height**: charts won’t show unless their container has height. Keep `.chart-wrap { height: 280px; }` or set your own.

---

## 4) Turning a repeated block into a reusable partial

If you copy/paste the same HTML multiple times, extract it into a partial.

**Before (duplicated):**
```html
<div class="stat ...">...</div>
<div class="stat ...">...</div>
```

**After (partial):** `templates/partials/_stats.html`
```html
<section class="grid grid-cols-1 md:grid-cols-4 gap-4">
  <!-- stat 1 -->
  <!-- stat 2 -->
  <!-- stat 3 -->
  <!-- stat 4 -->
</section>
```
Include it:
```jinja
{% include 'partials/_stats.html' %}
```

---

## 5) Optional: pass dynamic data from Flask into charts

If you want real data instead of hard-coded arrays:

**In your route:**
```python
@app.get("/")
def home():
    extra = {
        "months": ["Jan","Feb","Mar","Apr","May","Jun","Jul"],
        "revenue": [12, 19, 14, 22, 28, 24, 31]
    }
    return render_template("pages/home.html", extra_chart_data=extra)
```

**In `home.html` (any page that needs data):**
```html
<script id="extra-chart-data" type="application/json">
  {{ extra_chart_data | tojson }}
</script>
```

**In `dashboard.js`:**
```js
function readExtraData() {
  const el = document.getElementById('extra-chart-data');
  return el ? JSON.parse(el.textContent) : null;
}
```
Then inside your builder you can prefer `extra.months` etc. when present.

---

## 6) Troubleshooting

- **Chart shows as a thin line / not visible** → container has no height. Use `.chart-wrap`.
- **Colors don’t change on theme switch** → ensure you only use the **unified `dashboard.js`** and that `rebuildAllCharts()` is called after theme change (already done in `applyTheme`). Clear cache and hard-refresh.
- **Nothing renders** → check DevTools Console for errors; ensure **Chart.js** loads *before* `dashboard.js` in `base.html`.
- **Multiple charts overlay** → you forgot to destroy old instances. The unified file does this for you.

---

## 7) Quick template snippets

**Include a component:**
```jinja
{% include 'partials/_components_cards.html' %}
```

**Add a new chart partial and register it:**
```jinja
{% include 'partials/_charts_pie.html' %}
```
*(the unified `dashboard.js` already knows how to build `pieChart` if present)*

---

## 8) Checklist when adding something new

- [ ] Create the partial under `templates/partials/` (if it’s a UI block) or `<canvas id="...">` for charts.
- [ ] If it’s a **chart**, add a `buildXxxChart(ctx, colors)` function in `static/js/dashboard.js`.
- [ ] Register it inside `rebuildAllCharts()` with an `if (document.getElementById('...'))` guard.
- [ ] Hard-refresh to bust the browser cache.

---

### That’s it!
Following this pattern keeps your pages clean, your components reusable, and your charts consistently theme‑aware.
