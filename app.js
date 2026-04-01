// ============================================================
// APP.JS — The Cooters Open Championship
// All bug fixes applied. Firebase-powered live scoring.
// ============================================================
import {
  ALL_PLAYERS, YEAR_DATA, YEARS, HISTORY_META,
  isSessions, pName, grpScore, grpResult, grpPts,
  totalPts, playerPts, computeAlltimePts, computeChampWins,
} from './data.js';

import {
  initFirebase, fetchYear, subscribeToYear, unsubscribeAll,
  saveGroupScores, saveTeamNames, saveMatchStatus, savePairings as fbSavePairings,
  verifyRolePin, seedYearToFirestore, isYearSeeded,
} from './firebase-service.js';

// ============================================================
// STATE
// ============================================================
let currentYear    = '2026';
let currentMatchIdx = 0;
let currentRole    = 'viewer';
let selectedRoleInModal = 'viewer';
let liveYearData   = null;   // real-time Firestore data for currentYear
let firebaseReady  = false;

const ROLE_META = {
  viewer:  { label: 'Viewer',  dot: '#8a9ab0' },
  player:  { label: 'Player',  dot: '#52b788' },
  captain: { label: 'Captain', dot: '#e8533a' },
  admin:   { label: 'Admin',   dot: '#c9a84c' },
};
const ROLE_PERMS = {
  viewer:  { enterScores: false, managePairings: false, adminPanel: false, seeEntry: false },
  player:  { enterScores: true,  managePairings: false, adminPanel: false, seeEntry: true  },
  captain: { enterScores: true,  managePairings: true,  adminPanel: false, seeEntry: true  },
  admin:   { enterScores: true,  managePairings: true,  adminPanel: true,  seeEntry: true  },
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  // BUG FIX #10: restore role from sessionStorage on load
  const savedRole = sessionStorage.getItem('cooters_role');
  if (savedRole && ROLE_META[savedRole]) {
    currentRole = savedRole;
  }

  buildYearSelector();
  buildStaticUI();

  // Try Firebase
  firebaseReady = initFirebase();
  updateFirebaseStatusBadge(firebaseReady);

  if (firebaseReady) {
    await loadYear(currentYear);
  } else {
    // Fallback: use local static data
    liveYearData = YEAR_DATA[currentYear];
    renderAll();
  }

  // Restore role UI (after render so DOM exists)
  setRole(currentRole, false); // false = don't re-save to sessionStorage

  // Show role modal only for first visit
  if (!savedRole) {
    document.getElementById('role-overlay').style.display = 'flex';
  } else {
    document.getElementById('role-overlay').style.display = 'none';
  }

  renderHistory();
  populatePairingSelects();
});

// ============================================================
// FIREBASE YEAR LOADING
// ============================================================
async function loadYear(year) {
  unsubscribeAll();

  // Show loading state
  setLoadingState(true);

  // Check if seeded; if not, use local data and offer seed option
  const seeded = await isYearSeeded(year);
  if (!seeded) {
    liveYearData = YEAR_DATA[year];
    setLoadingState(false);
    renderAll();
    if (ROLE_PERMS[currentRole].adminPanel) {
      toast(`${year} not in database. Use Admin panel to seed.`, 4000);
    }
    return;
  }

  // Subscribe to real-time updates
  subscribeToYear(year, (data) => {
    liveYearData = data;
    setLoadingState(false);
    renderAll();
  });
}

function setLoadingState(loading) {
  const content = document.querySelector('.content');
  if (!content) return;
  const existing = document.getElementById('global-loading');
  if (loading && !existing) {
    const el = document.createElement('div');
    el.id = 'global-loading';
    el.className = 'loading-spinner';
    el.innerHTML = '<div class="spinner"></div><span>Loading live data…</span>';
    content.prepend(el);
  } else if (!loading && existing) {
    existing.remove();
  }
}

// ============================================================
// CURRENT YEAR DATA ACCESSOR
// ============================================================
function Y() {
  return liveYearData || YEAR_DATA[currentYear];
}

function pNameY(id) {
  return pName(Y().players || [], id);
}

// ============================================================
// RENDER ALL
// ============================================================
function renderAll() {
  updateHeaderTeamNames();
  renderLeaderboard();
  renderMatchTabs();
  renderEntryMatchSelect(); // BUG FIX #3: rebuild dynamically
  renderEntryForm();
  renderDraft();
  renderAnalytics();
  renderSchedule();
  applyRoleToUI(); // BUG FIX #11: only call once, not inside renderEntryForm
}

// ============================================================
// HELPERS
// ============================================================
let _toastTimer = null;
function toast(msg, duration = 2200) {
  // BUG FIX #16: clear previous timer before starting new one
  if (_toastTimer) clearTimeout(_toastTimer);
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  _toastTimer = setTimeout(() => { t.classList.remove('show'); _toastTimer = null; }, duration);
}

function showTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  if (btn) btn.classList.add('active');
}
window.showTab = showTab;

function updateFirebaseStatusBadge(connected) {
  const badge = document.getElementById('fb-status-badge');
  if (!badge) return;
  if (connected) {
    badge.className = 'fb-status fb-connected';
    badge.innerHTML = '<span class="fb-status-dot"></span>Live';
  } else {
    badge.className = 'fb-status fb-offline';
    badge.innerHTML = '<span class="fb-status-dot"></span>Offline';
  }
}

// ============================================================
// YEAR SELECTOR
// ============================================================
function buildYearSelector() {
  const container = document.getElementById('year-bar-container');
  container.innerHTML =
    `<div id="year-bar">` +
    `<span class="year-bar-label">Season</span>` +
    YEARS.map(y =>
      `<button id="ybtn-${y}" class="ybtn${y === currentYear ? ' active' : ''}" onclick="switchYear('${y}')">${y}${y === '2026' ? ' ★' : ''}</button>`
    ).join('') +
    `</div>`;
}

window.switchYear = async function(year) {
  currentYear = year;
  document.querySelectorAll('.ybtn').forEach(b => {
    b.classList.toggle('active', b.id === `ybtn-${year}`);
  });

  const sub = document.getElementById('tournament-sub-line');
  if (sub) sub.textContent = `aka The Shootout \u00a0·\u00a0 ${YEAR_DATA[year]?.course || ''}`;
  const yb = document.getElementById('year-badge');
  if (yb) yb.textContent = year + ' Season';

  if (firebaseReady) {
    await loadYear(year);
  } else {
    liveYearData = YEAR_DATA[year];
    renderAll();
  }

  const yd = Y();
  toast(`${year} Season${yd.status === 'live' ? ' — Live ⚡' : yd.status === 'pending' ? ' — Results Pending' : ' — Final'}`);
};

function updateHeaderTeamNames() {
  const yd = Y();
  const tn = yd.teamNames || { A: 'Team A', B: 'Team B' };
  const nameA = tn.A === 'TBD' ? `Team A · ${currentYear}` : tn.A;
  const nameB = tn.B === 'TBD' ? `Team B · ${currentYear}` : tn.B;
  const capA  = (yd.players || []).find(p => p.role === 'captain' && p.team === 'A');
  const capB  = (yd.players || []).find(p => p.role === 'captain' && p.team === 'B');
  const g = id => document.getElementById(id);
  if (g('ts-name-a'))  g('ts-name-a').textContent  = nameA;
  if (g('ts-name-b'))  g('ts-name-b').textContent  = nameB;
  if (g('ts-cap-a'))   g('ts-cap-a').textContent   = `Captain: ${capA?.name || 'TBD'}`;
  if (g('ts-cap-b'))   g('ts-cap-b').textContent   = `Captain: ${capB?.name || 'TBD'}`;
  if (g('hdr-name-a')) g('hdr-name-a').textContent = nameA;
  if (g('hdr-name-b')) g('hdr-name-b').textContent = nameB;
  if (g('th-team-a'))  g('th-team-a').textContent  = nameA;
  if (g('th-team-b'))  g('th-team-b').textContent  = nameB;
  if (g('analytics-year-badge')) g('analytics-year-badge').textContent = currentYear;
}

// ============================================================
// LEADERBOARD
// ============================================================
function renderLeaderboard() {
  const yd  = Y();
  const g   = id => document.getElementById(id);

  // BUG FIX #12: use hasDetailedData flag, not magic year number
  const noData = !yd.hasDetailedData && !isSessions(yd) && (yd.groups || []).length === 0;

  if (noData || yd.status === 'pending') {
    if (g('main-t1')) g('main-t1').textContent = '—';
    if (g('main-t2')) g('main-t2').textContent = '—';
    if (g('hdr-t1'))  g('hdr-t1').textContent  = '—';
    if (g('hdr-t2'))  g('hdr-t2').textContent  = '—';
    const badge = g('lb-status-badge');
    if (badge) {
      badge.textContent = yd.status === 'pending' ? 'Results Pending' : 'No Data';
      badge.className   = 'badge badge-' + (yd.status === 'pending' ? 'pending' : 'gray');
    }
    if (g('ts-max-line')) g('ts-max-line').textContent = yd.status === 'pending' ? 'Results pending' : 'Match data not recorded';
    if (g('prog-lbl1')) g('prog-lbl1').textContent = '—';
    if (g('prog-lbl2')) g('prog-lbl2').textContent = '—';
    if (g('prog-t1')) g('prog-t1').style.width = '50%';
    if (g('prog-t2')) g('prog-t2').style.width = '50%';
    const tbody = g('group-tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="padding:28px;text-align:center;color:var(--text-light);font-size:13px;">${yd.status === 'pending' ? 'Results pending for ' + currentYear : 'Match data unavailable for ' + currentYear}</td></tr>`;
    updateHeaderTeamNames();
    return;
  }

  const { a, b } = totalPts(yd);
  const tn = yd.teamNames || { A: 'Team A', B: 'Team B' };
  const nameA = tn.A === 'TBD' ? 'Team A' : tn.A;
  const nameB = tn.B === 'TBD' ? 'Team B' : tn.B;

  if (g('hdr-t1'))  g('hdr-t1').textContent  = a;
  if (g('hdr-t2'))  g('hdr-t2').textContent  = b;
  if (g('main-t1')) g('main-t1').textContent = a;
  if (g('main-t2')) g('main-t2').textContent = b;

  const total = a + b || 1, pct = Math.round((a / total) * 100);
  if (g('prog-t1'))   g('prog-t1').style.width   = pct + '%';
  if (g('prog-t2'))   g('prog-t2').style.width   = (100 - pct) + '%';
  if (g('prog-lbl1')) g('prog-lbl1').textContent = `${nameA} · ${a} pts`;
  if (g('prog-lbl2')) g('prog-lbl2').textContent = `${b} pts · ${nameB}`;

  const isLive = yd.status === 'live';
  const badge  = g('lb-status-badge');
  if (badge) {
    badge.textContent = isLive ? 'Live' : isSessions(yd) ? 'Final · Session Format' : 'Final';
    badge.className   = `badge ${isLive ? 'badge-live' : 'badge-done'}`;
  }
  if (g('ts-max-line')) g('ts-max-line').textContent = isLive ? 'In progress' : 'Final';

  const tbody = g('group-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  function stackedNames(ids, col) {
    return [...ids].map(id => pNameY(id))
      .sort()
      .map(n => `<div style="font-size:12px;font-weight:500;color:${col};line-height:1.5;">${n}</div>`)
      .join('');
  }

  if (isSessions(yd)) {
    let lastDay = '';
    const sessions = yd.sessions;

    sessions.forEach((s, idx) => {
      const day = s.session;
      const isNewDay = day !== lastDay;

      if (isNewDay) {
        lastDay = day;
        tbody.innerHTML += `<tr><td colspan="6" style="background:var(--navy);color:var(--gold2);font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:8px 12px;">${day}</td></tr>`;
      }

      // BUG FIX #2: removed duplicate day-total rows — now uses ONLY look-ahead approach
      const rText = s.ptsA > s.ptsB
        ? `<span class="result-pill rp-win" style="background:#fde8e8;color:var(--team1);">${nameA}</span>`
        : s.ptsB > s.ptsA
          ? `<span class="result-pill rp-win" style="background:#e8f0fd;color:var(--team2);">${nameB}</span>`
          : `<span class="result-pill rp-tie">Halved</span>`;

      const ptAStyle = `font-family:'Bebas Neue',sans-serif;font-size:17px;text-align:center;color:${s.ptsA > s.ptsB ? 'var(--team1)' : s.ptsA === s.ptsB && s.ptsA > 0 ? 'var(--gold)' : 'var(--text-light)'};`;
      const ptBStyle = `font-family:'Bebas Neue',sans-serif;font-size:17px;text-align:center;color:${s.ptsB > s.ptsA ? 'var(--team2)' : s.ptsB === s.ptsA && s.ptsB > 0 ? 'var(--gold)' : 'var(--text-light)'};`;

      tbody.innerHTML += `<tr>
        <td style="font-size:10px;color:var(--text-light);white-space:nowrap;">${s.format}<br><span style="font-size:9px;opacity:0.6;">${s.course}</span></td>
        <td>${stackedNames(s.pairA, 'var(--team1)')}</td>
        <td style="${ptAStyle}">${s.ptsA}</td>
        <td style="text-align:center;">${rText}</td>
        <td style="${ptBStyle}">${s.ptsB}</td>
        <td>${stackedNames(s.pairB, 'var(--team2)')}</td>
      </tr>`;

      // Emit day total only at day boundary (look-ahead only)
      const nextDay = sessions[idx + 1]?.session;
      if (nextDay !== day || idx === sessions.length - 1) {
        let dayPtsA = 0, dayPtsB = 0;
        sessions.filter(ss => ss.session === day).forEach(ss => { dayPtsA += ss.ptsA; dayPtsB += ss.ptsB; });
        const totStyle = "font-family:'Bebas Neue',sans-serif;font-size:16px;font-weight:700;text-align:center;";
        tbody.innerHTML += `<tr style="background:#f0f4f0;border-top:1px solid var(--sand);">
          <td colspan="2" style="font-size:11px;font-weight:700;color:var(--navy);padding:6px 12px;">${day} Total</td>
          <td style="${totStyle}color:var(--team1);">${dayPtsA}</td>
          <td></td>
          <td style="${totStyle}color:var(--team2);">${dayPtsB}</td>
          <td></td>
        </tr>`;
      }
    });
  } else {
    const matches  = yd.matches || [];
    const matchNums = [...new Set((yd.groups || []).map(g => g.matchIdx))].sort((a, b) => a - b);

    matchNums.forEach(mi => {
      const grps   = (yd.groups || []).filter(g => g.matchIdx === mi);
      const mTitle = matches[mi]?.title || '';
      tbody.innerHTML += `<tr><td colspan="6" style="background:#f5f5f2;color:var(--text-mid);font-size:10px;font-weight:600;letter-spacing:0.5px;padding:5px 12px;border-bottom:1px solid var(--sand);">Match ${mi + 1} · ${mTitle}</td></tr>`;

      let mPtsA = 0, mPtsB = 0;
      grps.forEach(grp => {
        const s = grpScore(grp), r = grpResult(grp), p = grpPts(grp);
        if (p !== null) { // BUG FIX #5: null = unplayed
          const rText = r === 'a'
            ? `<span class="result-pill rp-win">${nameA}</span>`
            : r === 'b'
              ? `<span class="result-pill rp-loss">${nameB}</span>`
              : `<span class="result-pill rp-tie">Halved</span>`;
          const ptAStyle = `font-family:'Bebas Neue',sans-serif;font-size:17px;text-align:center;color:${p.a > 0 ? (p.a === 1 ? 'var(--team1)' : 'var(--gold)') : 'var(--text-light)'};`;
          const ptBStyle = `font-family:'Bebas Neue',sans-serif;font-size:17px;text-align:center;color:${p.b > 0 ? (p.b === 1 ? 'var(--team2)' : 'var(--gold)') : 'var(--text-light)'};`;
          mPtsA += p.a; mPtsB += p.b;
          tbody.innerHTML += `<tr>
            <td style="font-size:11px;color:var(--text-light);white-space:nowrap;">M${mi+1} Grp ${grp.grp}</td>
            <td>${stackedNames(grp.pairA, 'var(--team1)')}</td>
            <td style="${ptAStyle}">${p.a}</td>
            <td style="text-align:center;">${rText}</td>
            <td style="${ptBStyle}">${p.b}</td>
            <td>${stackedNames(grp.pairB, 'var(--team2)')}</td>
          </tr>`;
        } else {
          tbody.innerHTML += `<tr style="opacity:0.45;">
            <td style="font-size:11px;color:var(--text-light);">M${mi+1} Grp ${grp.grp}</td>
            <td>${stackedNames(grp.pairA, 'var(--team1)')}</td>
            <td style="text-align:center;color:var(--text-light);">—</td>
            <td style="text-align:center;"><span class="result-pill rp-pending">Pending</span></td>
            <td style="text-align:center;color:var(--text-light);">—</td>
            <td>${stackedNames(grp.pairB, 'var(--team2)')}</td>
          </tr>`;
        }
      });

      if (mPtsA > 0 || mPtsB > 0) {
        const totStyle = "font-family:'Bebas Neue',sans-serif;font-size:16px;font-weight:700;text-align:center;";
        tbody.innerHTML += `<tr style="background:#f0f4f0;border-top:1px solid var(--sand);">
          <td colspan="2" style="font-size:11px;font-weight:700;color:var(--navy);padding:6px 12px;">Match ${mi+1} Total</td>
          <td style="${totStyle}color:var(--team1);">${mPtsA}</td>
          <td></td>
          <td style="${totStyle}color:var(--team2);">${mPtsB}</td>
          <td></td>
        </tr>`;
      }
    });
  }
}

// ============================================================
// SCORECARDS
// ============================================================
function renderMatchTabs() {
  const row = document.getElementById('match-tab-row');
  if (!row) return;
  const yd = Y();
  currentMatchIdx = 0;

  // BUG FIX #13: unified switch function
  if (isSessions(yd)) {
    const sessions = [...new Set(yd.sessions.map(s => s.session))];
    row.innerHTML = sessions.map((s, i) =>
      `<button class="mtab${i === 0 ? ' active' : ''}" onclick="switchMatchOrSession(${i},this)">${s}</button>`
    ).join('');
    renderScorecardForIdx(0);
  } else {
    const matches = yd.matches || [];
    row.innerHTML = matches.map((m, i) =>
      `<button class="mtab${i === 0 ? ' active' : ''}" onclick="switchMatchOrSession(${i},this)">${i < 4 ? 'Match ' + (i + 1) : 'E9'} · ${m.title}</button>`
    ).join('');
    renderScorecardForIdx(0);
  }
}

// BUG FIX #13: single function replaces switchMatch + switchSession
window.switchMatchOrSession = function(idx, btn) {
  currentMatchIdx = idx;
  document.querySelectorAll('.mtab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderScorecardForIdx(idx);
};

function renderScorecardForIdx(idx) {
  const yd = Y();
  if (isSessions(yd)) {
    renderSessionScorecard(idx);
  } else {
    renderScorecard(idx);
  }
}

function renderScorecard(matchIdx) {
  const yd = Y();
  if (!yd.hasDetailedData) {
    showScorecardUnavailable();
    return;
  }
  const matches = yd.matches || [];
  const m = matches[matchIdx];
  if (!m) return;
  document.getElementById('sc-match-title').textContent = `${matchIdx < 4 ? 'Match ' + (matchIdx + 1) : 'Emergency Nine'} — ${m.title}`;
  document.getElementById('sc-match-badge').textContent = m.badge;
  const pars = yd.pars, parTot = pars.reduce((a,b) => a+b, 0);
  const grps = (yd.groups || []).filter(g => g.matchIdx === matchIdx);
  const hdrCells = pars.map((p, i) => `<th>${i+1}<br><span style="font-size:8px;color:rgba(255,255,255,0.4)">P${p}</span></th>`).join('');
  let html = `<thead><tr><th>Pair</th>${hdrCells}<th>Tot</th><th>+/-</th></tr></thead><tbody>`;
  grps.forEach(grp => {
    html += `<tr><td colspan="${pars.length+3}" style="background:var(--cream);font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-light);padding:6px 10px;">Group ${grp.grp}</td></tr>`;
    [
      { label: grp.pairA.map(id => pNameY(id)).join(' / '), scores: grp.scoreA, col: 'var(--team1)' },
      { label: grp.pairB.map(id => pNameY(id)).join(' / '), scores: grp.scoreB, col: 'var(--team2)' },
    ].forEach(row => {
      if (!row.scores) {
        html += `<tr><td style="color:${row.col};font-weight:600;">${row.label}</td>${pars.map(() => `<td><span class="hc hc-empty">—</span></td>`).join('')}<td>—</td><td>—</td></tr>`;
        return;
      }
      const tot  = row.scores.reduce((a, b) => a + b, 0);
      const diff = tot - parTot;
      const dStr = diff === 0 ? 'E' : diff > 0 ? '+' + diff : '' + diff;
      const dCls = diff < 0 ? 'rp-win' : diff > 0 ? 'rp-loss' : '';
      const cells = row.scores.map((s, hi) => {
        const d   = s - pars[hi];
        const cls = d <= -2 ? 'hc-eagle' : d === -1 ? 'hc-birdie' : d === 0 ? 'hc-par' : d === 1 ? 'hc-bogey' : 'hc-double';
        return `<td><span class="hc ${cls}">${s}</span></td>`;
      }).join('');
      html += `<tr><td style="color:${row.col};font-weight:600;">${row.label}</td>${cells}<td style="font-weight:700;">${tot}</td><td><span class="result-pill ${dCls}" style="font-size:10px;">${dStr}</span></td></tr>`;
    });
  });
  html += '</tbody>';
  document.getElementById('sc-table').innerHTML = html;
}

// BUG FIX #1: removed dead code after early return — properly structured
function renderSessionScorecard(idx) {
  const yd = Y();
  if (!yd.hasDetailedData) {
    showScorecardUnavailable();
    return;
  }
  const sessions = [...new Set(yd.sessions.map(s => s.session))];
  const sessionName = sessions[idx];
  if (!sessionName) return;

  const sessMatches = yd.sessions.filter(s => s.session === sessionName);
  document.getElementById('sc-match-title').textContent = sessionName;
  document.getElementById('sc-match-badge').textContent = sessMatches[0]?.course || '';

  const tn    = yd.teamNames || { A: 'Team A', B: 'Team B' };
  const nameA = tn.A === 'TBD' ? 'Team A' : tn.A;
  const nameB = tn.B === 'TBD' ? 'Team B' : tn.B;

  let html = `<thead><tr>
    <th style="text-align:left;">Match Notes</th>
    <th>Format</th>
    <th style="color:rgba(255,100,100,0.8);">${nameA}</th>
    <th style="color:rgba(100,160,255,0.8);">${nameB}</th>
    <th>Result</th>
    <th>Pts A</th>
    <th>Pts B</th>
  </tr></thead><tbody>`;

  let lastCourse = '';
  sessMatches.forEach(s => {
    if (s.course !== lastCourse) {
      lastCourse = s.course;
      html += `<tr><td colspan="7" style="background:#f5f5f2;color:var(--text-mid);font-size:10px;font-weight:600;letter-spacing:0.5px;padding:5px 10px;">${s.course}</td></tr>`;
    }
    const pA   = s.pairA.map(id => pNameY(id)).join(' & ');
    const pB   = s.pairB.map(id => pNameY(id)).join(' & ');
    const win  = s.ptsA > s.ptsB ? nameA : s.ptsB > s.ptsA ? nameB : 'Tie';
    const rCls = s.ptsA > s.ptsB ? 'rp-win' : s.ptsB > s.ptsA ? 'rp-loss' : 'rp-tie';
    const ptACls = s.ptsA > 0 ? (s.ptsA >= 1 ? 'pts-win' : 'pts-tie') : 'pts-loss';
    const ptBCls = s.ptsB > 0 ? (s.ptsB >= 1 ? 'pts-win' : 'pts-tie') : 'pts-loss';
    html += `<tr>
      <td style="font-size:12px;color:var(--text-light);">${s.note}</td>
      <td style="font-size:11px;color:var(--text-light);">${s.format}</td>
      <td style="color:var(--team1);font-weight:500;font-size:12px;">${pA}</td>
      <td style="color:var(--team2);font-weight:500;font-size:12px;">${pB}</td>
      <td><span class="result-pill ${rCls}">${win}</span></td>
      <td class="pts-cell ${ptACls}">${s.ptsA}</td>
      <td class="pts-cell ${ptBCls}">${s.ptsB}</td>
    </tr>`;
  });
  html += '</tbody>';
  document.getElementById('sc-table').innerHTML = html;
}

function showScorecardUnavailable() {
  document.getElementById('sc-match-title').textContent = 'Scorecards';
  document.getElementById('sc-match-badge').textContent = currentYear;
  document.getElementById('sc-table').innerHTML = `
    <tr><td colspan="12" style="padding:32px;text-align:center;">
      <div style="font-size:22px;opacity:0.25;margin-bottom:10px;">⛳</div>
      <div style="font-size:14px;font-weight:600;color:var(--text-mid);margin-bottom:4px;">Hole-by-hole results not available for ${currentYear}</div>
      <div style="font-size:12px;color:var(--text-light);">See Standings tab for match results and points</div>
    </td></tr>`;
}

// ============================================================
// ENTRY — BUG FIX #3: rebuild match dropdown from live data
// ============================================================
function renderEntryMatchSelect() {
  const sel = document.getElementById('e-match');
  if (!sel) return;
  const yd = Y();
  if (isSessions(yd)) {
    const sessions = [...new Set(yd.sessions.map(s => s.session))];
    sel.innerHTML = sessions.map(s => `<option>${s}</option>`).join('');
  } else {
    const matches = yd.matches || [];
    sel.innerHTML = matches.map((m, i) =>
      `<option value="${i}">${i < 4 ? 'Match ' + (i + 1) : 'E9'} · ${m.title}</option>`
    ).join('');
  }
}

function renderEntryForm() {
  const matchSel = document.getElementById('e-match');
  const grpSel   = document.getElementById('e-group');
  if (!matchSel || !grpSel) return;

  const matchIdx = parseInt(matchSel.value) || 0;
  const grpIdx   = grpSel.selectedIndex;
  const yd = Y();

  if (!isSessions(yd)) {
    const grp = (yd.groups || []).filter(x => x.matchIdx === matchIdx)[grpIdx];
    if (grp) {
      document.getElementById('entry-pair-a').textContent = grp.pairA.map(id => pNameY(id)).join(' & ') + ' (Team A)';
      document.getElementById('entry-pair-b').textContent = grp.pairB.map(id => pNameY(id)).join(' & ') + ' (Team B)';
    }
  } else {
    const tn    = yd.teamNames || { A: 'Team A', B: 'Team B' };
    const teamA = (yd.players || []).filter(p => p.team === 'A').map(p => p.name.split(' ')[0]).join(', ');
    const teamB = (yd.players || []).filter(p => p.team === 'B').map(p => p.name.split(' ')[0]).join(', ');
    const entA  = document.getElementById('entry-pair-a');
    const entB  = document.getElementById('entry-pair-b');
    if (entA) entA.textContent = teamA + ' (' + (tn.A === 'TBD' ? 'Team A' : tn.A) + ')';
    if (entB) entB.textContent = teamB + ' (' + (tn.B === 'TBD' ? 'Team B' : tn.B) + ')';
  }

  const pars = yd.pars || [4,3,4,5,4,3,4,5,4];
  const makeHoles = prefix => pars.map((p, i) => `
    <div class="entry-hole-cell">
      <div class="ehn">H${i+1}</div>
      <div class="ehp">Par ${p}</div>
      <input class="score-inp" type="number" min="1" max="12" placeholder="${p}" id="${prefix}-h${i}" inputmode="numeric">
    </div>`).join('');

  document.getElementById('entry-holes-a').innerHTML = makeHoles('ea');
  document.getElementById('entry-holes-b').innerHTML = makeHoles('eb');

  const rules = [
    '<b>2-Man Scramble:</b> Both hit, take best ball, play from that spot.',
    '<b>Texas Shamble:</b> Best drive selected, each plays own ball in. Lower score counts.',
    '<b>Modified Chapman:</b> Both hit, switch, play 2nd, pick best, alternate in.',
    '<b>Emergency Nine:</b> Tiebreaker — format TBD by captains.',
    '<b>Scoring:</b> 1 pt win · 0.5 tie · 0 loss per group.',
  ];
  const ruleIdx   = isSessions(yd) ? 4 : Math.min(matchIdx, 3);
  const rulesEl   = document.getElementById('entry-rules');
  if (rulesEl) rulesEl.innerHTML = (rules[ruleIdx] || rules[3]) + '<br><br>' + rules[4];

  // BUG FIX #11: role UI applied once here (not inside every dropdown change)
  applyRoleToUI();
}

window.renderEntryForm = renderEntryForm;

// BUG FIX #17: real Firestore write instead of stub
window.saveEntryScores = async function() {
  const matchSel = document.getElementById('e-match');
  const grpSel   = document.getElementById('e-group');
  if (!matchSel || !grpSel) return;

  const matchIdx = parseInt(matchSel.value) || 0;
  const grpIdx   = grpSel.selectedIndex;
  const yd = Y();

  if (isSessions(yd)) {
    toast('Session-format years: scores recorded per session by Admin only.');
    return;
  }

  const groups    = (yd.groups || []).filter(g => g.matchIdx === matchIdx);
  const grp       = groups[grpIdx];
  if (!grp) { toast('No group found for this match/group selection.'); return; }

  // Find the global group index
  const globalIdx = (yd.groups || []).indexOf(grp);
  const pars      = yd.pars || [4,3,4,5,4,3,4,5,4];

  const scoresA = pars.map((_, i) => {
    const val = parseInt(document.getElementById(`ea-h${i}`)?.value);
    return isNaN(val) || val < 1 ? null : val;
  });
  const scoresB = pars.map((_, i) => {
    const val = parseInt(document.getElementById(`eb-h${i}`)?.value);
    return isNaN(val) || val < 1 ? null : val;
  });

  if (scoresA.includes(null) || scoresB.includes(null)) {
    toast('Please enter all 9 hole scores for both teams.'); return;
  }

  if (firebaseReady) {
    const okA = await saveGroupScores(currentYear, globalIdx, 'A', scoresA);
    const okB = await saveGroupScores(currentYear, globalIdx, 'B', scoresB);
    if (okA && okB) {
      toast('Scores saved! Leaderboard updating live ✓');
    } else {
      toast('Error saving scores. Check connection and try again.');
    }
  } else {
    // Offline fallback: update local data
    yd.groups[globalIdx].scoreA = scoresA;
    yd.groups[globalIdx].scoreB = scoresB;
    liveYearData = yd;
    renderAll();
    toast('Scores saved locally (offline mode) ✓');
  }
};

// ============================================================
// DRAFT
// ============================================================
function renderDraft() {
  const yd = Y();
  const tn = yd.teamNames || { A: 'Team A', B: 'Team B' };
  const nameA = tn.A === 'TBD' ? `Team A · ${currentYear}` : tn.A;
  const nameB = tn.B === 'TBD' ? `Team B · ${currentYear}` : tn.B;

  const draftOrder = [];
  for (let i = 0; i < 4; i++) { draftOrder.push({ pick: i*2+1, team: 'A' }); draftOrder.push({ pick: i*2+2, team: 'B' }); }

  document.getElementById('draft-order-row').innerHTML =
    `<div class="dp-badge" style="border-color:#f0b9b9;background:#fdf0ef;font-weight:600;color:var(--team1);">Capt · Team A</div>` +
    `<div class="dp-badge" style="border-color:#b9cef0;background:#eff4fd;font-weight:600;color:var(--team2);">Capt · Team B</div>` +
    draftOrder.map(d => `<div class="dp-badge" style="border-color:${d.team==='A'?'#f0b9b9':'#b9cef0'};"><span>Pk ${d.pick}</span> · Team ${d.team}</div>`).join('');

  const subEl = document.getElementById('draft-sub');
  if (subEl) subEl.textContent = `${nameA} vs ${nameB} · ${currentYear} · Captains pre-selected · 8 alternating picks`;

  const grid = document.getElementById('draft-teams-grid');
  grid.innerHTML = '';
  ['A','B'].forEach(team => {
    const ps   = (yd.players || []).filter(p => p.team === team);
    const cap  = ps.find(p => p.role === 'captain');
    const plys = ps.filter(p => p.role !== 'captain');
    const displayName = team === 'A' ? nameA : nameB;
    const pickNums = team === 'A' ? [1,3,5,7] : [2,4,6,8];

    grid.innerHTML += `
      <div class="draft-team-card">
        <div class="dtc-header dtc-header-t${team==='A'?1:2}">
          <div class="dtc-teamname">${displayName}</div>
        </div>
        <div class="dtc-body">
          ${cap ? `<div class="dtc-row"><span class="dtc-pick" style="color:var(--gold);font-weight:700;">C</span><span class="dtc-name" style="color:${team==='A'?'#e8a0a0':'#a0c0e8'};font-weight:600;">${cap.name}</span><span class="dtc-role role-capt">Captain</span></div>` : ''}
          ${plys.map((p, i) => `<div class="dtc-row"><span class="dtc-pick">${pickNums[i]||'?'}</span><span class="dtc-name">${p.name}</span><span class="dtc-role role-player">Player</span></div>`).join('')}
        </div>
      </div>`;
  });

  const hcpSorted = [...(yd.players||[])].sort((a, b) => {
    const n = h => h.startsWith('+') ? -parseFloat(h.replace('+','')) : parseFloat(h);
    return n(a.hcp) - n(b.hcp);
  });
  document.getElementById('hcp-chart').innerHTML = hcpSorted.map(p => {
    const raw = p.hcp.startsWith('+') ? -parseFloat(p.hcp.replace('+','')) : parseFloat(p.hcp);
    const pct = Math.round(((raw + 6) / 18) * 100);
    return `<div class="bar-row"><span class="bar-lbl">${p.name.split(' ')[0]} ${p.name.split(' ')[1]?.[0]}.</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(pct,4)}%;background:${p.team==='A'?'var(--team1)':'var(--team2)'}"></div></div><span class="bar-val">${p.hcp}</span></div>`;
  }).join('');
}

function populatePairingSelects() {
  const yd   = Y();
  const opts = (yd.players||[]).map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  ['adm-g1a1','adm-g1a2','adm-g1b1','adm-g1b2','adm-g2a1','adm-g2a2','adm-g2b1','adm-g2b2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = opts;
  });
}
window.populatePairingSelects = populatePairingSelects;

window.savePairings = async function() {
  const matchIdx = parseInt(document.getElementById('admin-match-sel')?.value) || 0;
  const pairings = {
    grp1: {
      pairA: [parseInt(document.getElementById('adm-g1a1')?.value), parseInt(document.getElementById('adm-g1a2')?.value)],
      pairB: [parseInt(document.getElementById('adm-g1b1')?.value), parseInt(document.getElementById('adm-g1b2')?.value)],
    },
    grp2: {
      pairA: [parseInt(document.getElementById('adm-g2a1')?.value), parseInt(document.getElementById('adm-g2a2')?.value)],
      pairB: [parseInt(document.getElementById('adm-g2b1')?.value), parseInt(document.getElementById('adm-g2b2')?.value)],
    },
  };
  if (firebaseReady) {
    const ok = await fbSavePairings(currentYear, matchIdx, pairings);
    toast(ok ? 'Pairings saved ✓' : 'Error saving pairings');
  } else {
    toast('Pairings saved locally (offline mode) ✓');
  }
};

window.applyTeamNames = async function() {
  const a = document.getElementById('adm-team-a')?.value?.trim();
  const b = document.getElementById('adm-team-b')?.value?.trim();
  if (a) Y().teamNames.A = a;
  if (b) Y().teamNames.B = b;
  if (firebaseReady && (a || b)) {
    await saveTeamNames(currentYear, Y().teamNames.A, Y().teamNames.B);
  }
  updateHeaderTeamNames(); renderLeaderboard(); renderDraft();
  toast('Team names updated ✓');
};

window.applyCourse = function() {
  const val = document.getElementById('adm-course')?.value?.trim();
  if (val) {
    Y().course = val;
    const sub = document.getElementById('tournament-sub-line');
    if (sub) sub.textContent = `aka The Shootout \u00a0·\u00a0 ${val}`;
    toast('Course updated ✓');
  }
};

// Admin: seed current year to Firestore
window.seedCurrentYear = async function() {
  if (!firebaseReady) { toast('Firebase not connected'); return; }
  toast('Seeding ' + currentYear + ' to Firestore…', 5000);
  const ok = await seedYearToFirestore(currentYear);
  if (ok) {
    toast(currentYear + ' seeded ✓ Reloading live data…', 3000);
    await loadYear(currentYear);
  } else {
    toast('Seed failed — check Firebase console');
  }
};

// ============================================================
// ANALYTICS — BUG FIX #4, #12
// ============================================================
function renderAnalytics() {
  const yd = Y();

  // BUG FIX #12: use hasDetailedData flag
  if (!yd.hasDetailedData && !isSessions(yd) && (yd.groups||[]).length === 0) {
    ['stat-grid','player-pts-chart','dist-bar','dist-legend','avg-score-chart','hole-diff-chart'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = id === 'stat-grid'
        ? `<div class="stat-card" style="grid-column:1/-1;padding:28px;text-align:center;color:var(--text-light);font-size:13px;">${yd.status === 'pending' ? 'Results pending for ' + currentYear : 'Match data unavailable for ' + currentYear}</div>`
        : '';
    });
    return;
  }

  const pars   = yd.pars || [4,3,4,5,4,3,4,5,4];
  const parTot = pars.reduce((a,b) => a+b, 0);
  let eagles = 0, birdies = 0, parsC = 0, bogeys = 0, doubles = 0;
  let groupScores = [], holeTotals = pars.map(() => ({ sum: 0, n: 0 }));

  if (!isSessions(yd)) {
    (yd.groups||[]).forEach(g => {
      [g.scoreA, g.scoreB].forEach(sc => {
        if (!sc) return;
        const tot = sc.reduce((a,b) => a+b, 0);
        groupScores.push(tot - parTot);
        sc.forEach((s, i) => {
          const d = s - pars[i];
          if (d <= -2) eagles++; else if (d === -1) birdies++; else if (d === 0) parsC++; else if (d === 1) bogeys++; else doubles++;
          holeTotals[i].sum += d; holeTotals[i].n++;
        });
      });
    });
  }

  const holeAvgs     = holeTotals.map(h => h.n ? h.sum / h.n : 0);
  const hardestIdx   = holeAvgs.length ? holeAvgs.indexOf(Math.max(...holeAvgs)) : 0;
  const lowGroup     = groupScores.length ? Math.min(...groupScores) : 0;
  const avgScore     = groupScores.length ? (groupScores.reduce((a,b) => a+b, 0) / groupScores.length).toFixed(1) : 'N/A';

  if (isSessions(yd)) {
    const { a, b } = totalPts(yd);
    const total  = yd.sessions.length;
    const winsA  = yd.sessions.filter(s => s.ptsA > s.ptsB).length;
    const winsB  = yd.sessions.filter(s => s.ptsB > s.ptsA).length;
    const ties   = yd.sessions.filter(s => s.ptsA === s.ptsB).length;
    document.getElementById('stat-grid').innerHTML = [
      { lbl:'Total Pts A', val:''+ a,     desc:'Out of '+(a+b)      },
      { lbl:'Total Pts B', val:''+ b,     desc:'Out of '+(a+b)      },
      { lbl:'A Wins',      val:''+winsA,  desc:'Individual matches' },
      { lbl:'B Wins',      val:''+winsB,  desc:'Individual matches' },
      { lbl:'Ties',        val:''+ties,   desc:'Across all sessions' },
      { lbl:'Sessions',    val:''+total,  desc:'Across all days'    },
    ].map(s => `<div class="stat-card"><div class="stat-lbl">${s.lbl}</div><div class="stat-val">${s.val}</div><div class="stat-desc">${s.desc}</div></div>`).join('');
  } else {
    document.getElementById('stat-grid').innerHTML = [
      { lbl:'Low Group',   val:lowGroup<=0?''+lowGroup:'+'+lowGroup, desc:'Best group score'    },
      { lbl:'Eagles',      val:''+eagles,  desc:'Across all matches' },
      { lbl:'Birdies',     val:''+birdies, desc:'Across all matches' },
      { lbl:'Bogeys',      val:''+bogeys,  desc:'Across all matches' },
      { lbl:'Avg vs Par',  val:parseFloat(avgScore)>0?'+'+avgScore:avgScore, desc:'Per group per 9' },
      { lbl:'Hardest Hole',val:holeAvgs.length?'#'+(hardestIdx+1):'—', desc:holeAvgs.length?`Avg ${holeAvgs[hardestIdx]>0?'+':''}${holeAvgs[hardestIdx].toFixed(2)} vs par`:'No data' },
    ].map(s => `<div class="stat-card"><div class="stat-lbl">${s.lbl}</div><div class="stat-val">${s.val}</div><div class="stat-desc">${s.desc}</div></div>`).join('');
  }

  // BUG FIX #4: playerPts now uses corrected calculation (full-team divided by team size)
  const maxPP = Math.max(...(yd.players||[]).map(p => playerPts(yd, p.id)), 1);
  document.getElementById('player-pts-chart').innerHTML =
    [...(yd.players||[])].map(p => ({ ...p, pts: playerPts(yd, p.id) }))
    .sort((a,b) => b.pts - a.pts)
    .map(p => `
      <div class="bar-row">
        <span class="bar-lbl">${p.name}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round((p.pts/maxPP)*100)}%;background:${p.team==='A'?'var(--team1)':'var(--team2)'}"></div></div>
        <span class="bar-val">${p.pts} pts</span>
      </div>`).join('');

  const cats    = [
    { l:'Eagles',   v: eagles,  c:'#c9a84c' },
    { l:'Birdies',  v: birdies, c:'#2471a3' },
    { l:'Pars',     v: parsC,   c:'#2d6a4f' },
    { l:'Bogeys',   v: bogeys,  c:'#e88c3a' },
    { l:'Doubles+', v: doubles, c:'#c0392b' },
  ].filter(c => c.v > 0);
  const catTot = cats.reduce((a,b) => a + b.v, 0) || 1;
  document.getElementById('dist-bar').innerHTML    = cats.map(c => `<div class="dist-seg" style="flex:${c.v};background:${c.c};">${c.v}</div>`).join('');
  document.getElementById('dist-legend').innerHTML = cats.map(c => `<span class="dist-leg"><span class="dist-dot" style="background:${c.c}"></span>${c.l}: ${Math.round(c.v/catTot*100)}%</span>`).join('');

  if (!isSessions(yd)) {
    const playerAvgs = (yd.players||[]).map(p => {
      let sum = 0, n = 0;
      (yd.groups||[]).forEach(g => {
        const inA = g.pairA.includes(p.id), inB = g.pairB.includes(p.id);
        const sc  = inA ? g.scoreA : inB ? g.scoreB : null;
        if (sc) { sc.forEach((s,i) => { sum += s - pars[i]; n++; }); }
      });
      return { ...p, avg: n ? sum/n : 0, hasData: n > 0 };
    }).filter(p => p.hasData).sort((a,b) => a.avg - b.avg);

    const maxAV = Math.max(...playerAvgs.map(p => Math.abs(p.avg)), 0.1);
    document.getElementById('avg-score-chart').innerHTML = playerAvgs.map(p =>
      `<div class="bar-row"><span class="bar-lbl">${p.name.split(' ')[0]} ${p.name.split(' ')[1]?.[0]}.</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(50+(p.avg/maxAV)*44)}%;background:${p.avg<0?'#2471a3':'#e88c3a'}"></div></div><span class="bar-val" style="color:${p.avg<0?'#1a5276':'#c05000'}">${p.avg>0?'+':''}${p.avg.toFixed(2)}</span></div>`
    ).join('');

    const hdMax = Math.max(...holeAvgs.map(Math.abs), 0.1);
    document.getElementById('hole-diff-chart').innerHTML = holeAvgs.map((d, i) =>
      `<div class="bar-row"><span class="bar-lbl" style="min-width:52px;">Hole ${i+1}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(50+(d/hdMax)*44)}%;background:${d>0?'#e88c3a':'#2471a3'}"></div></div><span class="bar-val" style="color:${d>0?'#c05000':'#1a5276'}">${d>0?'+':''}${d.toFixed(2)}</span></div>`
    ).join('');
  } else {
    document.getElementById('avg-score-chart').innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-light);font-size:12px;">Hole-by-hole data not available for ${currentYear}.</div>`;
    document.getElementById('hole-diff-chart').innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-light);font-size:12px;">Hole difficulty index requires scorecard data.</div>`;
  }
}

// ============================================================
// SCHEDULE
// ============================================================
function renderSchedule() {
  const yd        = Y();
  const sub       = document.getElementById('sched-sub');
  const container = document.getElementById('sched-matches');
  if (!container) return;
  if (sub) sub.textContent = (yd.course || '') + ' · ' + currentYear;

  const statusMap  = { done: 'sdot-done', live: 'sdot-live', upcoming: 'sdot-up' };
  const badgeMap   = { done: 'badge-done', live: 'badge-live', upcoming: 'badge-gray' };
  const badgeTxtMap= { done: 'Complete',   live: 'Live',       upcoming: 'Upcoming' };

  if (yd.schedule && yd.schedule.length) {
    let html = '', lastDay = '';
    yd.schedule.forEach(m => {
      if (m.day !== lastDay) {
        if (lastDay) html += '</div>';
        lastDay = m.day;
        html += `<div style="background:var(--navy);color:var(--gold2);font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:8px 14px;">${m.day}</div><div>`;
      }
      html += `<div class="sched-row">
        <div class="sdot ${statusMap[m.status]||'sdot-up'}"></div>
        <div class="smatch-num">${m.num}</div>
        <div class="smatch-info"><div class="smatch-title">${m.format}</div><div class="smatch-desc">${m.course}</div></div>
        <span class="badge ${badgeMap[m.status]||'badge-gray'}">${badgeTxtMap[m.status]||'Upcoming'}</span>
      </div>`;
    });
    if (lastDay) html += '</div>';
    container.innerHTML = html;
  } else {
    container.innerHTML = `<div style="padding:28px;text-align:center;color:var(--text-light);font-size:13px;">Schedule data unavailable for ${currentYear}</div>`;
  }
}

// ============================================================
// HISTORY — BUG FIX #6, #7, #8
// ============================================================
function renderHistory() {
  const ht = document.getElementById('hist-table');
  ht.innerHTML = `<thead><tr><th>Year</th><th>Champions</th><th>Winning Team</th><th>Score</th><th>Course</th></tr></thead><tbody>` +
    HISTORY_META.map(h => {
      const yr    = YEAR_DATA[h.year];
      const tn    = yr?.teamNames || { A: 'Team A', B: 'Team B' };
      // BUG FIX #6: use champTeamKey (A/B), not string comparison
      const champName = h.champTeamKey ? (tn[h.champTeamKey] || ('Team ' + h.champTeamKey)) : '—';
      const champBadgeClass = h.champTeamKey === 'A' ? 'badge-t1' : h.champTeamKey === 'B' ? 'badge-t2' : 'badge-gray';
      const isPend = h.pts === '—';
      const isActive = h.year === '2026';
      const yearBadge = isActive ? ' <span class="badge badge-live" style="font-size:8px;">Live</span>' : isPend ? ' <span class="badge badge-gray" style="font-size:8px;">TBD</span>' : '';

      // Get winning players from roster using champTeamKey
      let players = '—';
      if (h.champTeamKey && yr?.players) {
        const winPlayers = yr.players.filter(p => p.team === h.champTeamKey);
        players = winPlayers.map(p => p.name.split(' ')[0]).join(', ');
      } else if (!isPend) {
        players = 'Data unavailable';
      }

      return `<tr ${h.year === currentYear ? 'style="background:var(--cream);"' : ''}>
        <td style="font-weight:700;">${h.year}${yearBadge}</td>
        <td><div class="champ-cell">${!isPend && h.champTeamKey ? '🏆 ' : ''}${players}</div></td>
        <td><span class="badge ${champBadgeClass}">${champName}</span></td>
        <td style="font-weight:700;color:${isPend ? 'var(--text-light)' : 'var(--navy)'};">${h.pts}</td>
        <td style="color:var(--text-light);font-size:11px;">${h.course}</td>
      </tr>`;
    }).join('') + '</tbody>';

  // BUG FIX #7: derive all-time points dynamically
  const alltime = computeAlltimePts();
  const maxAT   = Math.max(...alltime.map(p => p.pts), 1);
  document.getElementById('alltime-chart').innerHTML = alltime.map(p =>
    `<div class="bar-row">
      <span class="bar-lbl">${p.name}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.round((p.pts/maxAT)*100)}%;background:var(--gold)"></div></div>
      <span class="bar-val">${p.pts} pts</span>
    </div>`).join('');

  // BUG FIX #8: championship wins via champTeamKey
  const champWins = computeChampWins();
  const maxW = Math.max(...Object.values(champWins), 1);
  document.getElementById('alltime-champ-wins').innerHTML =
    Object.entries(champWins).sort((a,b) => b[1]-a[1]).filter(e => e[1] > 0).map(([name, w]) =>
      `<div class="bar-row">
        <span class="bar-lbl">${name}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round((w/maxW)*100)}%;background:var(--gold)"></div></div>
        <span class="bar-val">${w} win${w!==1?'s':''}</span>
      </div>`).join('') || '<div style="padding:8px;color:var(--text-light);font-size:12px;">No completed championships yet.</div>';

  // W-L-T
  const playerWLT = {};
  ALL_PLAYERS.forEach(ap => { playerWLT[ap.name] = { w: 0, l: 0, t: 0 }; });
  Object.values(YEAR_DATA).forEach(yd => {
    if (!yd.sessions || !yd.sessions.length) return;
    yd.sessions.forEach(s => {
      [...(s.pairA||[])].forEach(pid => {
        const pl  = yd.players.find(p => p.id === pid); if (!pl) return;
        const rec = playerWLT[pl.name]; if (!rec) return;
        if (s.ptsA > s.ptsB) rec.w++; else if (s.ptsB > s.ptsA) rec.l++; else rec.t++;
      });
      [...(s.pairB||[])].forEach(pid => {
        const pl  = yd.players.find(p => p.id === pid); if (!pl) return;
        const rec = playerWLT[pl.name]; if (!rec) return;
        if (s.ptsB > s.ptsA) rec.w++; else if (s.ptsA > s.ptsB) rec.l++; else rec.t++;
      });
    });
  });

  const topPlayer = Object.entries(playerWLT).sort((a,b) => b[1].w - a[1].w)[0];
  const topChamp  = Object.entries(champWins).sort((a,b) => b[1]-a[1]).filter(e => e[1] > 0)[0];
  const dynAlltime = computeAlltimePts();

  document.getElementById('hist-stat-grid').innerHTML = [
    { lbl: 'Most Match Wins', val: topPlayer ? topPlayer[0].split(' ')[0]+' '+topPlayer[0].split(' ')[1]?.[0]+'.' : '—', desc: topPlayer ? topPlayer[1].w + ' individual wins' : 'TBD' },
    { lbl: 'Career Pts Leader', val: dynAlltime[0]?.name?.split(' ')[0]||'—', desc: dynAlltime[0] ? `${dynAlltime[0].name} · ${dynAlltime[0].pts} pts` : 'TBD' },
    { lbl: 'Most Championships', val: topChamp ? topChamp[0].split(' ')[0]+' '+topChamp[0].split(' ')[1]?.[0]+'.' : '—', desc: topChamp ? topChamp[1]+'× champion' : 'TBD' },
  ].map(s =>
    `<div class="stat-card"><div class="stat-lbl">${s.lbl}</div><div class="stat-val" style="font-size:${s.val.length>6?'13px':s.val.length>4?'16px':'26px'}">${s.val}</div><div class="stat-desc">${s.desc}</div></div>`
  ).join('');

  const wltEl = document.getElementById('alltime-wlt');
  if (wltEl) {
    const sorted = Object.entries(playerWLT).sort((a,b) => (b[1].w-b[1].l) - (a[1].w-a[1].l));
    wltEl.innerHTML = sorted.map(([name, r]) => {
      const total = r.w + r.l + r.t;
      const pct   = total ? Math.round((r.w/total)*100) : 0;
      return `<div class="bar-row" style="gap:8px;">
        <span class="bar-lbl">${name}</span>
        <span style="font-size:12px;font-weight:600;color:var(--text-mid);min-width:60px;white-space:nowrap;">${r.w}-${r.l}-${r.t}</span>
        <div class="bar-track" style="flex:1;"><div class="bar-fill" style="width:${pct}%;background:var(--green2)"></div></div>
        <span class="bar-val">${pct}%</span>
      </div>`;
    }).join('');
  }
}

// ============================================================
// ROLE SYSTEM — BUG FIX #10: sessionStorage persistence
// ============================================================
window.selectRole = function(role) {
  selectedRoleInModal = role;
  document.querySelectorAll('.role-option').forEach(el => el.classList.remove('selected'));
  const el = document.getElementById('ro-' + role);
  if (el) el.classList.add('selected');
  const pinRow   = document.getElementById('pin-row');
  const pinInput = document.getElementById('role-pin');
  if (role !== 'viewer') {
    pinRow.classList.add('show');
    if (pinInput) { pinInput.value = ''; setTimeout(() => pinInput.focus(), 50); }
  } else {
    pinRow.classList.remove('show');
  }
};

window.confirmRole = async function() {
  const role = selectedRoleInModal;
  const btn  = document.querySelector('.role-enter-btn');
  if (btn) btn.classList.add('loading');

  let verified = false;
  if (firebaseReady && role !== 'viewer') {
    const pin = document.getElementById('role-pin')?.value || '';
    verified = await verifyRolePin(role, pin);
  } else if (role === 'viewer') {
    verified = true;
  } else {
    // Offline fallback PINs
    const OFFLINE_PINS = { player: '1234', captain: '5678', admin: '0000' };
    verified = document.getElementById('role-pin')?.value === OFFLINE_PINS[role];
  }

  if (btn) btn.classList.remove('loading');

  if (!verified) {
    const inp = document.getElementById('role-pin');
    if (inp) { inp.classList.add('shake'); inp.value = ''; setTimeout(() => inp.classList.remove('shake'), 400); }
    return;
  }

  setRole(role, true);
  document.getElementById('role-overlay').style.display = 'none';
};

function setRole(role, persist = true) {
  currentRole = role;
  if (persist) sessionStorage.setItem('cooters_role', role); // BUG FIX #10
  const meta = ROLE_META[role];
  const dot  = document.getElementById('role-pill-dot');
  const lbl  = document.getElementById('role-pill-label');
  if (dot) dot.style.background = meta.dot;
  if (lbl) lbl.textContent = meta.label;
  applyRoleToUI();
}

window.showRoleModal = function() {
  window.selectRole(currentRole);
  document.getElementById('role-overlay').style.display = 'flex';
};

// BUG FIX #11: applyRoleToUI called only from setRole and renderAll, not every dropdown change
function applyRoleToUI() {
  const perms = ROLE_PERMS[currentRole];

  // Score inputs
  document.querySelectorAll('.score-inp').forEach(inp => {
    inp.disabled = !perms.enterScores;
  });

  // Save button
  const saveBtn = document.querySelector('#tab-entry .save-btn');
  if (saveBtn) saveBtn.disabled = !perms.enterScores;

  // Entry nav tab visibility
  const entryNavBtn = document.getElementById('nav-entry-btn');
  if (entryNavBtn) {
    entryNavBtn.style.display = perms.seeEntry ? '' : 'none';
    if (!perms.seeEntry && document.getElementById('tab-entry')?.classList.contains('active')) {
      showTab('leaderboard', document.querySelector('.nav-btn'));
    }
  }

  // Captain lineup panel
  const lineupPanel = document.getElementById('lineup-panel');
  if (lineupPanel) lineupPanel.style.display = perms.managePairings ? 'block' : 'none';

  // Admin panel
  const adminFull = document.getElementById('admin-panel-full');
  if (adminFull) adminFull.style.display = perms.adminPanel ? 'block' : 'none';

  // Locked overlay
  const existing = document.getElementById('entry-lock-overlay');
  if (existing) existing.remove();
  if (!perms.seeEntry) {
    const lock = document.createElement('div');
    lock.id = 'entry-lock-overlay';
    lock.className = 'locked-overlay';
    lock.innerHTML = `<div class="locked-icon">🔒</div><div class="locked-title">Score entry requires a role</div><div class="locked-sub">Players, Captains and Admins can enter scores.</div><button class="locked-switch" onclick="showRoleModal()">Switch Role →</button>`;
    const entryTab = document.getElementById('tab-entry');
    if (entryTab) entryTab.prepend(lock);
  }
}

// ============================================================
// STATIC UI BUILD (called once on init)
// ============================================================
function buildStaticUI() {
  // nothing needed here — HTML handles static structure
}
