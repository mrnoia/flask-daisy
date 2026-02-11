const htmlEl = document.documentElement;
const themeKey = 'theme';
const themeSelect = document.getElementById('themeSelect');
const quickToggle = document.getElementById('quickToggle');
const mediaDark = window.matchMedia('(prefers-color-scheme: dark)');
let charts = [];

// ---- DaisyUI Theme Color Palettes (RGB values) ----
const themePalettes = {
  light: {
    fg: 'rgb(31, 41, 55)',
    grid: 'rgb(209, 213, 219)',
    bg: 'rgb(255, 255, 255)',
    surface: 'rgb(249, 250, 251)',
    primary: 'rgb(59, 130, 246)',
    primaryFill: 'rgba(59, 130, 246, 0.25)',
    secondary: 'rgb(107, 114, 128)',
    accent: 'rgb(245, 158, 11)',
    info: 'rgb(34, 197, 94)',
    success: 'rgb(34, 197, 94)',
    warning: 'rgb(245, 158, 11)',
    error: 'rgb(239, 68, 68)',
  },
  dark: {
    fg: 'rgb(229, 231, 235)',
    grid: 'rgb(75, 85, 99)',
    bg: 'rgb(30, 41, 59)',
    surface: 'rgb(51, 65, 85)',
    primary: 'rgb(96, 165, 250)',
    primaryFill: 'rgba(96, 165, 250, 0.25)',
    secondary: 'rgb(156, 163, 175)',
    accent: 'rgb(253, 224, 71)',
    info: 'rgb(74, 222, 128)',
    success: 'rgb(74, 222, 128)',
    warning: 'rgb(253, 224, 71)',
    error: 'rgb(248, 113, 113)',
  },
  cupcake: {
    fg: 'rgb(63, 38, 55)',
    grid: 'rgb(230, 204, 221)',
    bg: 'rgb(255, 240, 245)',
    surface: 'rgb(252, 231, 243)',
    primary: 'rgb(214, 88, 250)',
    primaryFill: 'rgba(214, 88, 250, 0.25)',
    secondary: 'rgb(249, 115, 22)',
    accent: 'rgb(34, 211, 238)',
    info: 'rgb(34, 197, 94)',
    success: 'rgb(34, 197, 94)',
    warning: 'rgb(245, 158, 11)',
    error: 'rgb(239, 68, 68)',
  },
  corporate: {
    fg: 'rgb(30, 41, 59)',
    grid: 'rgb(203, 213, 225)',
    bg: 'rgb(255, 255, 255)',
    surface: 'rgb(248, 250, 252)',
    primary: 'rgb(15, 23, 42)',
    primaryFill: 'rgba(15, 23, 42, 0.25)',
    secondary: 'rgb(100, 116, 139)',
    accent: 'rgb(59, 130, 246)',
    info: 'rgb(34, 197, 94)',
    success: 'rgb(34, 197, 94)',
    warning: 'rgb(245, 158, 11)',
    error: 'rgb(239, 68, 68)',
  },
  forest: {
    fg: 'rgb(240, 253, 244)',
    grid: 'rgb(34, 197, 94)',
    bg: 'rgb(5, 46, 22)',
    surface: 'rgb(15, 78, 35)',
    primary: 'rgb(74, 222, 128)',
    primaryFill: 'rgba(74, 222, 128, 0.25)',
    secondary: 'rgb(165, 243, 252)',
    accent: 'rgb(250, 204, 21)',
    info: 'rgb(96, 165, 250)',
    success: 'rgb(74, 222, 128)',
    warning: 'rgb(250, 204, 21)',
    error: 'rgb(248, 113, 113)',
  },
  synthwave: {
    fg: 'rgb(241, 245, 249)',
    grid: 'rgb(139, 92, 246)',
    bg: 'rgb(13, 7, 37)',
    surface: 'rgb(38, 25, 76)',
    primary: 'rgb(236, 72, 153)',
    primaryFill: 'rgba(236, 72, 153, 0.25)',
    secondary: 'rgb(120, 219, 255)',
    accent: 'rgb(251, 146, 60)',
    info: 'rgb(34, 197, 94)',
    success: 'rgb(34, 197, 94)',
    warning: 'rgb(245, 158, 11)',
    error: 'rgb(239, 68, 68)',
  },
  nord: {
    fg: 'rgb(216, 222, 233)',
    grid: 'rgb(76, 86, 106)',
    bg: 'rgb(46, 52, 64)',
    surface: 'rgb(59, 66, 82)',
    primary: 'rgb(136, 192, 208)',
    primaryFill: 'rgba(136, 192, 208, 0.25)',
    secondary: 'rgb(191, 97, 106)',
    accent: 'rgb(235, 203, 139)',
    info: 'rgb(163, 190, 140)',
    success: 'rgb(163, 190, 140)',
    warning: 'rgb(235, 203, 139)',
    error: 'rgb(191, 97, 106)',
  }
};

function getCurrentThemeName() {
  const sel = localStorage.getItem(themeKey) || 'dark';
  if (sel === 'system') {
    return mediaDark.matches ? 'dark' : 'light';
  }
  return sel;
}

function getThemeColors() {
  const themeName = getCurrentThemeName();
  return themePalettes[themeName] || themePalettes.dark;
}

function applyChartDefaults(colors) {
  Chart.defaults.color = colors.fg;
  Chart.defaults.borderColor = colors.grid;
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
}

// Sample data
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const revenue = [12, 19, 14, 22, 28, 24, 31];
const orders = [120, 180, 160, 210, 240, 200, 260];
const categoryShare = [28, 22, 18, 14, 10, 8];
const products = ['Laptop', 'Phone', 'Tablet', 'Keyboard', 'Monitor'];
const productSales = [450, 380, 320, 250, 180];
const metrics = [85, 75, 90, 80, 85];
const metricLabels = ['Quality', 'Performance', 'Reliability', 'Security', 'Support'];

function baseOptions(colors) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: colors.fg }, grid: { color: colors.grid, drawBorder: false } },
      y: { ticks: { color: colors.fg }, grid: { color: colors.grid }, beginAtZero: true }
    },
    plugins: {
      legend: { labels: { color: colors.fg } },
      tooltip: {
        backgroundColor: colors.bg,
        titleColor: colors.fg,
        bodyColor: colors.fg,
        borderColor: colors.grid,
        borderWidth: 1
      }
    }
  };
}

function buildLineChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'line',
    data: { labels: months, datasets: [{ label: 'Revenue ($k)', data: revenue, borderColor: colors.primary, backgroundColor: colors.primaryFill, pointBackgroundColor: colors.primary, pointBorderColor: colors.surface, pointRadius: 5, tension: 0.35, fill: true, borderWidth: 2 }] },
    options: baseOptions(colors)
  });
}

function buildBarChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'bar',
    data: { labels: months, datasets: [{ label: 'Orders', data: orders, backgroundColor: colors.primaryFill, borderColor: colors.primary, borderWidth: 2, borderRadius: 6 }] },
    options: baseOptions(colors)
  });
}

function buildDoughnutChart(ctx, colors) {
  const palette = [colors.primary, colors.secondary, colors.accent, colors.info, colors.success, colors.warning, colors.error];
  return new Chart(ctx, {
    type: 'doughnut',
    data: { labels: ['A', 'B', 'C', 'D', 'E', 'F'], datasets: [{ data: categoryShare, backgroundColor: palette.slice(0, categoryShare.length), borderColor: colors.surface, borderWidth: 2 }] },
    options: { ...baseOptions(colors), cutout: '60%' }
  });
}

function buildRadarChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'radar',
    data: { labels: metricLabels, datasets: [{ label: 'Performance', data: metrics, borderColor: colors.primary, backgroundColor: colors.primaryFill, pointBackgroundColor: colors.primary, pointBorderColor: colors.surface, pointRadius: 4 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { r: { ticks: { color: colors.fg }, grid: { color: colors.grid }, beginAtZero: true, max: 100 } },
      plugins: { legend: { labels: { color: colors.fg } }, tooltip: { backgroundColor: colors.bg, titleColor: colors.fg, bodyColor: colors.fg, borderColor: colors.grid, borderWidth: 1 } }
    }
  });
}

function buildAreaChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'line',
    data: { labels: months, datasets: [{ label: 'Growth', data: [50, 65, 78, 92, 110, 135, 155], borderColor: colors.secondary, backgroundColor: `rgba(156, 163, 175, 0.3)`, pointBackgroundColor: colors.secondary, pointBorderColor: colors.surface, pointRadius: 4, tension: 0.4, fill: true, borderWidth: 2 }] },
    options: baseOptions(colors)
  });
}

function buildMixedChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'bar',
    data: { labels: months, datasets: [
      { type: 'bar', label: 'Actual Sales', data: [100, 140, 120, 180, 200, 170, 210], backgroundColor: colors.primaryFill, borderColor: colors.primary, borderWidth: 2, borderRadius: 4 },
      { type: 'line', label: 'Target', data: [150, 150, 150, 200, 200, 200, 250], borderColor: colors.accent, backgroundColor: 'transparent', borderWidth: 2, pointBackgroundColor: colors.accent, tension: 0.4 }
    ] },
    options: baseOptions(colors)
  });
}

function buildHorizontalBarChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'bar',
    indexAxis: 'y',
    data: { labels: products, datasets: [{ label: 'Sales', data: productSales, backgroundColor: [colors.primary, colors.secondary, colors.accent, colors.info, colors.success], borderColor: colors.grid, borderWidth: 1, borderRadius: 4 }] },
    options: baseOptions(colors)
  });
}

function buildPolarChart(ctx, colors) {
  const palette = [colors.primary, colors.secondary, colors.accent, colors.info, colors.success, colors.warning];
  return new Chart(ctx, {
    type: 'polarArea',
    data: { labels: metricLabels, datasets: [{ data: metrics, backgroundColor: palette.slice(0, metricLabels.length), borderColor: colors.grid, borderWidth: 1 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { r: { ticks: { color: colors.fg }, grid: { color: colors.grid }, beginAtZero: true } },
      plugins: { legend: { labels: { color: colors.fg } }, tooltip: { backgroundColor: colors.bg, titleColor: colors.fg, bodyColor: colors.fg, borderColor: colors.grid, borderWidth: 1 } }
    }
  });
}

function rebuildAllCharts() {
  charts.forEach(c => c.destroy());
  charts = [];
  const colors = getThemeColors();
  applyChartDefaults(colors);
  charts.push(buildLineChart(document.getElementById('lineChart'), colors));
  charts.push(buildBarChart(document.getElementById('barChart'), colors));
  charts.push(buildDoughnutChart(document.getElementById('doughnutChart'), colors));
  charts.push(buildRadarChart(document.getElementById('radarChart'), colors));
  charts.push(buildAreaChart(document.getElementById('areaChart'), colors));
  charts.push(buildMixedChart(document.getElementById('mixedChart'), colors));
  charts.push(buildHorizontalBarChart(document.getElementById('horizontalBarChart'), colors));
  charts.push(buildPolarChart(document.getElementById('polarChart'), colors));
}

function getActiveTheme() {
  const sel = localStorage.getItem(themeKey) || 'dark';
  return sel === 'system' ? (mediaDark.matches ? 'dark' : 'light') : sel;
}

function applyTheme(selection, persist = true) {
  if (selection === 'system') {
    htmlEl.setAttribute('data-theme', mediaDark.matches ? 'dark' : 'light');
  } else {
    htmlEl.setAttribute('data-theme', selection);
  }
  if (persist) localStorage.setItem(themeKey, selection);
  if (quickToggle) quickToggle.checked = getActiveTheme() === 'dark';
  setTimeout(() => { rebuildAllCharts(); }, 50);
}

function initTheme() {
  const stored = localStorage.getItem(themeKey) || 'dark';
  applyTheme(stored, false);
  if (themeSelect) themeSelect.value = stored;
  if (quickToggle) quickToggle.checked = getActiveTheme() === 'dark';
}

if (typeof themeSelect !== 'undefined' && themeSelect) {
  themeSelect.addEventListener('change', e => applyTheme(e.target.value));
}
if (typeof quickToggle !== 'undefined' && quickToggle) {
  quickToggle.addEventListener('change', e => {
    const next = e.target.checked ? 'dark' : 'light';
    if (themeSelect) themeSelect.value = next;
    applyTheme(next);
  });
}
mediaDark.addEventListener('change', () => {
  if (localStorage.getItem(themeKey) === 'system') applyTheme('system', false);
});

initTheme();
rebuildAllCharts();
