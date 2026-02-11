// static/js/dashboard.js — unified (original charts + new charts) using the SAME theme logic
// Works with getThemeColors/applyChartDefaults and rebuilds all charts together.

const htmlEl = document.documentElement;
const themeKey = 'theme';
const themeSelect = document.getElementById('themeSelect');
const quickToggle = document.getElementById('quickToggle');
const mediaDark = window.matchMedia('(prefers-color-scheme: dark)');
let charts = [];

// ---- DaisyUI Theme Color Palettes (RGB values) ----
const themePalettes = {
  light: {
    fg: 'rgb(31, 41, 55)', grid: 'rgb(209, 213, 219)', bg: 'rgb(255, 255, 255)', surface: 'rgb(249, 250, 251)',
    primary: 'rgb(59, 130, 246)', primaryFill: 'rgba(59, 130, 246, 0.25)',
    secondary: 'rgb(107, 114, 128)', accent: 'rgb(245, 158, 11)', info: 'rgb(34, 197, 94)', success: 'rgb(34, 197, 94)', warning: 'rgb(245, 158, 11)', error: 'rgb(239, 68, 68)'
  },
  dark: {
    fg: 'rgb(229, 231, 235)', grid: 'rgb(75, 85, 99)', bg: 'rgb(30, 41, 59)', surface: 'rgb(51, 65, 85)',
    primary: 'rgb(96, 165, 250)', primaryFill: 'rgba(96, 165, 250, 0.25)',
    secondary: 'rgb(156, 163, 175)', accent: 'rgb(253, 224, 71)', info: 'rgb(74, 222, 128)', success: 'rgb(74, 222, 128)', warning: 'rgb(253, 224, 71)', error: 'rgb(248, 113, 113)'
  },
  cupcake: {
    fg: 'rgb(63, 38, 55)', grid: 'rgb(230, 204, 221)', bg: 'rgb(255, 240, 245)', surface: 'rgb(252, 231, 243)',
    primary: 'rgb(214, 88, 250)', primaryFill: 'rgba(214, 88, 250, 0.25)',
    secondary: 'rgb(249, 115, 22)', accent: 'rgb(34, 211, 238)', info: 'rgb(34, 197, 94)', success: 'rgb(34, 197, 94)', warning: 'rgb(245, 158, 11)', error: 'rgb(239, 68, 68)'
  },
  corporate: {
    fg: 'rgb(30, 41, 59)', grid: 'rgb(203, 213, 225)', bg: 'rgb(255, 255, 255)', surface: 'rgb(248, 250, 252)',
    primary: 'rgb(15, 23, 42)', primaryFill: 'rgba(15, 23, 42, 0.25)',
    secondary: 'rgb(100, 116, 139)', accent: 'rgb(59, 130, 246)', info: 'rgb(34, 197, 94)', success: 'rgb(34, 197, 94)', warning: 'rgb(245, 158, 11)', error: 'rgb(239, 68, 68)'
  },
  forest: {
    fg: 'rgb(240, 253, 244)', grid: 'rgb(34, 197, 94)', bg: 'rgb(5, 46, 22)', surface: 'rgb(15, 78, 35)',
    primary: 'rgb(74, 222, 128)', primaryFill: 'rgba(74, 222, 128, 0.25)',
    secondary: 'rgb(165, 243, 252)', accent: 'rgb(250, 204, 21)', info: 'rgb(96, 165, 250)', success: 'rgb(74, 222, 128)', warning: 'rgb(250, 204, 21)', error: 'rgb(248, 113, 113)'
  },
  synthwave: {
    fg: 'rgb(241, 245, 249)', grid: 'rgb(139, 92, 246)', bg: 'rgb(13, 7, 37)', surface: 'rgb(38, 25, 76)',
    primary: 'rgb(236, 72, 153)', primaryFill: 'rgba(236, 72, 153, 0.25)',
    secondary: 'rgb(120, 219, 255)', accent: 'rgb(251, 146, 60)', info: 'rgb(34, 197, 94)', success: 'rgb(34, 197, 94)', warning: 'rgb(245, 158, 11)', error: 'rgb(239, 68, 68)'
  },
  nord: {
    fg: 'rgb(216, 222, 233)', grid: 'rgb(76, 86, 106)', bg: 'rgb(46, 52, 64)', surface: 'rgb(59, 66, 82)',
    primary: 'rgb(136, 192, 208)', primaryFill: 'rgba(136, 192, 208, 0.25)',
    secondary: 'rgb(191, 97, 106)', accent: 'rgb(235, 203, 139)', info: 'rgb(163, 190, 140)', success: 'rgb(163, 190, 140)', warning: 'rgb(235, 203, 139)', error: 'rgb(191, 97, 106)'
  }
};

function getCurrentThemeName() {
  const sel = localStorage.getItem(themeKey) || 'dark';
  if (sel === 'system') return mediaDark.matches ? 'dark' : 'light';
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

// ---------------- Base options (XY charts) ----------------
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

// ---------------- Original charts ----------------
function buildLineChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
      datasets: [{ label: 'Revenue ($k)', data: [12,19,14,22,28,24,31], borderColor: colors.primary,
        backgroundColor: colors.primaryFill, pointBackgroundColor: colors.primary, pointBorderColor: colors.surface,
        pointRadius: 5, tension: 0.35, fill: true, borderWidth: 2 }]
    },
    options: baseOptions(colors)
  });
}
function buildBarChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
      datasets: [{ label: 'Orders', data: [120,180,160,210,240,200,260], backgroundColor: colors.primaryFill,
        borderColor: colors.primary, borderWidth: 2, borderRadius: 6 }]
    },
    options: baseOptions(colors)
  });
}
function buildDoughnutChart(ctx, colors) {
  const palette = [colors.primary, colors.secondary, colors.accent, colors.info, colors.success, colors.warning, colors.error];
  return new Chart(ctx, {
    type: 'doughnut',
    data: { labels: ['A','B','C','D','E','F'], datasets: [{ data: [28,22,18,14,10,8], backgroundColor: palette.slice(0,6), borderColor: colors.surface, borderWidth: 2 }] },
    options: { ...baseOptions(colors), cutout: '60%' }
  });
}
function buildRadarChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'radar',
    data: { labels: ['Quality','Performance','Reliability','Security','Support'], datasets: [{ label:'Performance', data:[85,75,90,80,85], borderColor: colors.primary, backgroundColor: colors.primaryFill, pointBackgroundColor: colors.primary, pointBorderColor: colors.surface, pointRadius: 4 }] },
    options: { responsive:true, maintainAspectRatio:false, scales:{ r:{ ticks:{ color: colors.fg }, grid:{ color: colors.grid }, beginAtZero:true, max:100 } }, plugins:{ legend:{ labels:{ color: colors.fg } }, tooltip:{ backgroundColor: colors.bg, titleColor: colors.fg, bodyColor: colors.fg, borderColor: colors.grid, borderWidth:1 } } }
  });
}
function buildAreaChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'line',
    data: { labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'], datasets: [{ label:'Growth', data:[50,65,78,92,110,135,155], borderColor: colors.secondary, backgroundColor: 'rgba(156, 163, 175, 0.3)', pointBackgroundColor: colors.secondary, pointBorderColor: colors.surface, pointRadius: 4, tension: 0.4, fill: true, borderWidth: 2 }] },
    options: baseOptions(colors)
  });
}
function buildMixedChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'bar',
    data: { labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'], datasets: [
      { type:'bar', label:'Actual Sales', data:[100,140,120,180,200,170,210], backgroundColor: colors.primaryFill, borderColor: colors.primary, borderWidth:2, borderRadius:4 },
      { type:'line', label:'Target', data:[150,150,150,200,200,200,250], borderColor: colors.accent, backgroundColor:'transparent', borderWidth:2, pointBackgroundColor: colors.accent, tension:0.4 }
    ] },
    options: baseOptions(colors)
  });
}
function buildHorizontalBarChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'bar', indexAxis: 'y',
    data: { labels: ['Laptop','Phone','Tablet','Keyboard','Monitor'], datasets: [{ label:'Sales', data:[450,380,320,250,180], backgroundColor: [colors.primary, colors.secondary, colors.accent, colors.info, colors.success], borderColor: colors.grid, borderWidth:1, borderRadius:4 }] },
    options: baseOptions(colors)
  });
}
function buildPolarChart(ctx, colors) {
  const palette = [colors.primary, colors.secondary, colors.accent, colors.info, colors.success, colors.warning];
  return new Chart(ctx, {
    type: 'polarArea', data: { labels: ['Quality','Performance','Reliability','Security','Support'], datasets: [{ data:[85,75,90,80,85], backgroundColor: palette.slice(0,5), borderColor: colors.grid, borderWidth: 1 }] },
    options: { responsive:true, maintainAspectRatio:false, scales:{ r:{ ticks:{ color: colors.fg }, grid:{ color: colors.grid }, beginAtZero:true } }, plugins:{ legend:{ labels:{ color: colors.fg } }, tooltip:{ backgroundColor: colors.bg, titleColor: colors.fg, bodyColor: colors.fg, borderColor: colors.grid, borderWidth:1 } } }
  });
}

// ---------------- NEW extra charts (same pattern) ----------------
function buildPieChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'pie',
    data: { labels:['A','B','C','D','E'], datasets:[{ data:[30,22,18,16,14], backgroundColor:[colors.primary, colors.secondary, colors.accent, colors.success, colors.warning], borderColor: colors.surface, borderWidth:2 }] },
    options: { ...baseOptions(colors) }
  });
}
function buildStackedBarChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'bar',
    data: { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul'], datasets:[
      { label:'Web', data:[12,14,16,13,18,20,22], backgroundColor: colors.primaryFill, borderColor: colors.primary, borderWidth:2, borderRadius:4 },
      { label:'Retail', data:[8,9,11,10,12,14,15], backgroundColor:'rgba(34,197,94,.25)', borderColor: colors.success, borderWidth:2, borderRadius:4 },
      { label:'Partners', data:[4,5,6,6,7,7,8], backgroundColor:'rgba(245,158,11,.25)', borderColor: colors.warning, borderWidth:2, borderRadius:4 }
    ] },
    options: { ...baseOptions(colors), scales:{ x:{ stacked:true, ticks:{ color: colors.fg }, grid:{ color: colors.grid, drawBorder:false } }, y:{ stacked:true, ticks:{ color: colors.fg }, grid:{ color: colors.grid } } } }
  });
}
function buildGroupedBarChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'bar',
    data: { labels:['Q1','Q2','Q3','Q4'], datasets:[
      { label:'EMEA', data:[120,150,170,190], backgroundColor: colors.primaryFill, borderColor: colors.primary, borderWidth:2, borderRadius:4 },
      { label:'AMER', data:[130,140,160,200], backgroundColor:'rgba(163,190,140,.25)', borderColor:'#84cc16', borderWidth:2, borderRadius:4 },
      { label:'APAC', data:[90,110,130,160], backgroundColor:'rgba(251,146,60,.25)', borderColor: colors.accent, borderWidth:2, borderRadius:4 }
    ] },
    options: baseOptions(colors)
  });
}
function buildMultiAxisLineChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'line',
    data: { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul'], datasets:[
      { label:'Revenue ($k)', data:[12,15,18,22,26,31,35], yAxisID:'y1', borderColor: colors.primary, backgroundColor: colors.primaryFill, tension:.35, fill:true, borderWidth:2 },
      { label:'Conversion (%)', data:[2.1,2.3,2.6,2.8,3.0,3.2,3.4], yAxisID:'y2', borderColor: colors.accent, backgroundColor:'transparent', tension:.35, pointBackgroundColor: colors.accent }
    ] },
    options: { ...baseOptions(colors), scales:{ x:{ ticks:{ color: colors.fg }, grid:{ color: colors.grid, drawBorder:false } }, y1:{ type:'linear', position:'left', ticks:{ color: colors.fg }, grid:{ color: colors.grid } }, y2:{ type:'linear', position:'right', ticks:{ color: colors.fg }, grid:{ drawOnChartArea:false } } } }
  });
}
function buildScatterChart(ctx, colors) {
  const points = Array.from({length:40}, () => ({ x: Math.random()*90+10, y: Math.random()*4+1 }));
  return new Chart(ctx, {
    type: 'scatter',
    data: { datasets:[{ label:'Products', data: points, backgroundColor: colors.primary }] },
    options: { ...baseOptions(colors), scales:{ x:{ title:{ display:true, text:'Price (£)' }, ticks:{ color: colors.fg }, grid:{ color: colors.grid } }, y:{ title:{ display:true, text:'Rating' }, ticks:{ color: colors.fg }, grid:{ color: colors.grid } } } }
  });
}
function buildBubbleChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'bubble',
    data: { datasets:[{ label:'Segments', data:[ {x:10,y:20,r:6},{x:15,y:10,r:8},{x:25,y:30,r:12},{x:32,y:22,r:10},{x:40,y:18,r:14} ], backgroundColor: colors.secondary }] },
    options: { ...baseOptions(colors), scales:{ x:{ ticks:{ color: colors.fg }, grid:{ color: colors.grid } }, y:{ ticks:{ color: colors.fg }, grid:{ color: colors.grid }, beginAtZero:true } } }
  });
}
function buildRadarCompareChart(ctx, colors) {
  const labels = ['Quality','Speed','Reliability','Security','Support'];
  return new Chart(ctx, {
    type: 'radar',
    data: { labels, datasets:[
      { label:'Team A', data:[80,75,85,70,90], borderColor: colors.primary, backgroundColor: colors.primaryFill, pointBackgroundColor: colors.primary },
      { label:'Team B', data:[70,82,78,80,75], borderColor: colors.accent, backgroundColor:'rgba(251,146,60,.25)', pointBackgroundColor: colors.accent }
    ] },
    options: { responsive:true, maintainAspectRatio:false, scales:{ r:{ ticks:{ color: colors.fg }, grid:{ color: colors.grid }, beginAtZero:true, max:100 } }, plugins:{ legend:{ labels:{ color: colors.fg } } } }
  });
}
function buildPolarMiniChart(ctx, colors) {
  return new Chart(ctx, {
    type: 'polarArea',
    data: { labels: ['Email','Paid','Social','Organic','Referrals'], datasets: [{ data:[22,18,15,30,15], backgroundColor:[colors.primary, colors.secondary, colors.accent, colors.success, colors.warning], borderColor: colors.grid }] },
    options: { responsive:true, maintainAspectRatio:false, scales:{ r:{ ticks:{ color: colors.fg }, grid:{ color: colors.grid } } } }
  });
}

// ---------------- Rebuild ALL charts together ----------------
function rebuildAllCharts() {
  charts.forEach(c => c.destroy());
  charts = [];
  const colors = getThemeColors();
  applyChartDefaults(colors);

  // Original canvases
  if (document.getElementById('lineChart')) charts.push(buildLineChart(document.getElementById('lineChart'), colors));
  if (document.getElementById('barChart')) charts.push(buildBarChart(document.getElementById('barChart'), colors));
  if (document.getElementById('doughnutChart')) charts.push(buildDoughnutChart(document.getElementById('doughnutChart'), colors));
  if (document.getElementById('radarChart')) charts.push(buildRadarChart(document.getElementById('radarChart'), colors));
  if (document.getElementById('areaChart')) charts.push(buildAreaChart(document.getElementById('areaChart'), colors));
  if (document.getElementById('mixedChart')) charts.push(buildMixedChart(document.getElementById('mixedChart'), colors));
  if (document.getElementById('horizontalBarChart')) charts.push(buildHorizontalBarChart(document.getElementById('horizontalBarChart'), colors));
  if (document.getElementById('polarChart')) charts.push(buildPolarChart(document.getElementById('polarChart'), colors));

  // NEW canvases (only if present on the page)
  if (document.getElementById('pieChart')) charts.push(buildPieChart(document.getElementById('pieChart'), colors));
  if (document.getElementById('stackedBarChart')) charts.push(buildStackedBarChart(document.getElementById('stackedBarChart'), colors));
  if (document.getElementById('groupedBarChart')) charts.push(buildGroupedBarChart(document.getElementById('groupedBarChart'), colors));
  if (document.getElementById('multiAxisLineChart')) charts.push(buildMultiAxisLineChart(document.getElementById('multiAxisLineChart'), colors));
  if (document.getElementById('scatterChart')) charts.push(buildScatterChart(document.getElementById('scatterChart'), colors));
  if (document.getElementById('bubbleChart')) charts.push(buildBubbleChart(document.getElementById('bubbleChart'), colors));
  if (document.getElementById('radarCompareChart')) charts.push(buildRadarCompareChart(document.getElementById('radarCompareChart'), colors));
  if (document.getElementById('polarMiniChart')) charts.push(buildPolarMiniChart(document.getElementById('polarMiniChart'), colors));
}

// ---------------- Theme switching (exact same pattern) ----------------
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
  // optional: custom event for any other scripts
  try { window.dispatchEvent(new CustomEvent('theme:applied')); } catch {}
}
function initTheme() {
  const stored = localStorage.getItem(themeKey) || 'dark';
  applyTheme(stored, false);
  if (themeSelect) themeSelect.value = stored;
  if (quickToggle) quickToggle.checked = getActiveTheme() === 'dark';
}

if (themeSelect) themeSelect.addEventListener('change', e => applyTheme(e.target.value));
if (quickToggle) quickToggle.addEventListener('change', e => { const next = e.target.checked ? 'dark' : 'light'; if (themeSelect) themeSelect.value = next; applyTheme(next); });
mediaDark.addEventListener('change', () => { if (localStorage.getItem(themeKey) === 'system') applyTheme('system', false); });

// First paint
initTheme();
rebuildAllCharts();
