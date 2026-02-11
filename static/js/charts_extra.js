// static/js/charts_extra.js — theme-aware extra charts (robust version)
// Reads DaisyUI CSS variables directly and rebuilds on theme change.

(() => {
  'use strict';

  // ---------- Utilities ----------
  const $ = (id) => document.getElementById(id);

  // Get an HSL CSS variable as a color string like "hsl(…)" or "hsl(… / alpha)"
  function hslVar(name, alpha = null, fallback = null) {
    const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (val) {
      return alpha == null ? `hsl(${val})` : `hsl(${val} / ${alpha})`;
    }
    // Fallback (do NOT wrap hex/rgb in hsl())
    if (fallback) return fallback;
    return alpha == null ? '#e5e7eb' : `rgba(229,231,235,${alpha})`;
  }

  function getColorsFromTheme() {
    return {
      fg:       hslVar('--bc', null, '#e5e7eb'),           // base-content
      grid:     hslVar('--bc', 0.30, 'rgba(107,114,128,.35)'),
      bg:       hslVar('--b1', null, '#111827'),           // base-100
      surface:  hslVar('--b2', null, '#1f2937'),           // base-200
      primary:  hslVar('--p',  null, '#3b82f6'),
      primaryFill: hslVar('--p', 0.25, 'rgba(59,130,246,.25)'),
      secondary: hslVar('--s',  null, '#6b7280'),
      accent:    hslVar('--a',  null, '#f59e0b'),
      success:   hslVar('--su', null, '#22c55e'),
      warning:   hslVar('--wa', null, '#f59e0b'),
      error:     hslVar('--er', null, '#ef4444'),
    };
  }

  function applyDefaults(colors) {
    // Safe defaults even if your main script isn't available
    Chart.defaults.color = colors.fg;
    Chart.defaults.borderColor = colors.grid;
    Chart.defaults.font = Chart.defaults.font || {};
    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  }

  function baseXY(c) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: c.fg }, grid: { color: c.grid, drawBorder: false } },
        y: { ticks: { color: c.fg }, grid: { color: c.grid }, beginAtZero: true }
      },
      plugins: {
        legend: { labels: { color: c.fg } },
        tooltip: {
          backgroundColor: c.bg, titleColor: c.fg, bodyColor: c.fg,
          borderColor: c.grid, borderWidth: 1
        }
      }
    };
  }

  // ---------- Chart builders ----------
  function buildPie(ctx, c) {
    return new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['A','B','C','D','E'],
        datasets: [{
          data: [30,22,18,16,14],
          backgroundColor: [c.primary,c.secondary,c.accent,c.success,c.warning],
          borderColor: c.surface,
          borderWidth: 2
        }]
      },
      options: { ...baseXY(c) }
    });
  }

  function buildStackedBar(ctx, c) {
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
        datasets: [
          { label:'Web',     data:[12,14,16,13,18,20,22], backgroundColor:c.primaryFill, borderColor:c.primary,  borderWidth:2, borderRadius:4 },
          { label:'Retail',  data:[8,9,11,10,12,14,15],  backgroundColor:'rgba(34,197,94,.25)', borderColor:c.success, borderWidth:2, borderRadius:4 },
          { label:'Partners',data:[4,5,6,6,7,7,8],       backgroundColor:'rgba(245,158,11,.25)', borderColor:c.warning, borderWidth:2, borderRadius:4 },
        ]
      },
      options: {
        ...baseXY(c),
        scales: {
          x: { stacked:true, ticks:{ color:c.fg }, grid:{ color:c.grid, drawBorder:false } },
          y: { stacked:true, ticks:{ color:c.fg }, grid:{ color:c.grid } }
        }
      }
    });
  }

  function buildGroupedBar(ctx, c) {
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Q1','Q2','Q3','Q4'],
        datasets: [
          { label:'EMEA', data:[120,150,170,190], backgroundColor:c.primaryFill, borderColor:c.primary, borderWidth:2, borderRadius:4 },
          { label:'AMER', data:[130,140,160,200], backgroundColor:'rgba(163,190,140,.25)', borderColor:'#84cc16', borderWidth:2, borderRadius:4 },
          { label:'APAC', data:[90,110,130,160],  backgroundColor:'rgba(251,146,60,.25)', borderColor:c.accent,  borderWidth:2, borderRadius:4 },
        ]
      },
      options: { ...baseXY(c) }
    });
  }

  function buildMultiAxisLine(ctx, c) {
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
        datasets: [
          { label:'Revenue ($k)',   data:[12,15,18,22,26,31,35], yAxisID:'y1',
            borderColor:c.primary, backgroundColor:c.primaryFill, tension:.35, fill:true, borderWidth:2 },
          { label:'Conversion (%)', data:[2.1,2.3,2.6,2.8,3.0,3.2,3.4], yAxisID:'y2',
            borderColor:c.accent, backgroundColor:'transparent', tension:.35, pointBackgroundColor:c.accent }
        ]
      },
      options: {
        ...baseXY(c),
        scales: {
          x:  { ticks:{ color:c.fg }, grid:{ color:c.grid } },
          y1: { type:'linear', position:'left',  ticks:{ color:c.fg }, grid:{ color:c.grid } },
          y2: { type:'linear', position:'right', ticks:{ color:c.fg }, grid:{ drawOnChartArea:false } }
        }
      }
    });
  }

  function buildScatter(ctx, c) {
    const pts = Array.from({length:40}, () => ({ x: Math.random()*90+10, y: Math.random()*4+1 }));
    return new Chart(ctx, {
      type: 'scatter',
      data: { datasets: [{ label:'Products', data: pts, backgroundColor: c.primary }] },
      options: {
        ...baseXY(c),
        scales: {
          x: { title:{ display:true, text:'Price (£)' },  ticks:{ color:c.fg }, grid:{ color:c.grid } },
          y: { title:{ display:true, text:'Rating'   },  ticks:{ color:c.fg }, grid:{ color:c.grid } }
        }
      }
    });
  }

  function buildBubble(ctx, c) {
    return new Chart(ctx, {
      type: 'bubble',
      data: { datasets: [{ label:'Segments',
        data:[ {x:10,y:20,r:6},{x:15,y:10,r:8},{x:25,y:30,r:12},{x:32,y:22,r:10},{x:40,y:18,r:14} ],
        backgroundColor: c.secondary }] },
      options: {
        ...baseXY(c),
        scales: {
          x: { ticks:{ color:c.fg }, grid:{ color:c.grid } },
          y: { ticks:{ color:c.fg }, grid:{ color:c.grid }, beginAtZero:true }
        }
      }
    });
  }

  function buildRadarCompare(ctx, c) {
    const labels = ['Quality','Speed','Reliability','Security','Support'];
    return new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          { label:'Team A', data:[80,75,85,70,90], borderColor:c.primary, backgroundColor:c.primaryFill, pointBackgroundColor:c.primary },
          { label:'Team B', data:[70,82,78,80,75], borderColor:c.accent,  backgroundColor:'rgba(251,146,60,.25)', pointBackgroundColor:c.accent }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { r: { ticks:{ color:c.fg }, grid:{ color:c.grid }, beginAtZero:true, max:100 } },
        plugins: { legend: { labels: { color: c.fg } } }
      }
    });
  }

  function buildPolarMini(ctx, c) {
    return new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: ['Email','Paid','Social','Organic','Referrals'],
        datasets: [{ data:[22,18,15,30,15],
          backgroundColor:[c.primary,c.secondary,c.accent,c.success,c.warning],
          borderColor:c.grid }]
      },
      options: {
        responsive:true, maintainAspectRatio:false,
        scales: { r: { ticks:{ color:c.fg }, grid:{ color:c.grid } } }
      }
    });
  }

  // ---------- Registry + rebuild ----------
  let extraCharts = [];

  function destroyAll() {
    extraCharts.forEach(ch => { try { ch.destroy(); } catch {} });
    extraCharts = [];
  }

  function initExtraCharts() {
    // Delay one frame so CSS vars from theme have settled
    requestAnimationFrame(() => {
      setTimeout(() => {
        const c = getColorsFromTheme();
        applyDefaults(c);
        destroyAll();

        if ($('pieChart'))            extraCharts.push(buildPie($('pieChart'), c));
        if ($('stackedBarChart'))     extraCharts.push(buildStackedBar($('stackedBarChart'), c));
        if ($('groupedBarChart'))     extraCharts.push(buildGroupedBar($('groupedBarChart'), c));
        if ($('multiAxisLineChart'))  extraCharts.push(buildMultiAxisLine($('multiAxisLineChart'), c));
        if ($('scatterChart'))        extraCharts.push(buildScatter($('scatterChart'), c));
        if ($('bubbleChart'))         extraCharts.push(buildBubble($('bubbleChart'), c));
        if ($('radarCompareChart'))   extraCharts.push(buildRadarCompare($('radarCompareChart'), c));
        if ($('polarMiniChart'))      extraCharts.push(buildPolarMini($('polarMiniChart'), c));
      }, 20);
    });
  }

  // ---------- Theme change detection ----------
  // Observe <html data-theme="..."> so this works even without custom events
  try {
    const mo = new MutationObserver(muts => {
      if (muts.some(m => m.type === 'attributes' && m.attributeName === 'data-theme')) {
        initExtraCharts();
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  } catch {}

  // If your other script emits a custom event:
  window.addEventListener('theme:applied', () => initExtraCharts());

  // localStorage change from other tabs/windows
  window.addEventListener('storage', (e) => { if (e.key === 'theme') initExtraCharts(); });

  // First render
  initExtraCharts();
})();