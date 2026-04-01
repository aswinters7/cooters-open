// ============================================================
// FIREBASE-SERVICE.JS
// All Firestore reads, writes, and real-time listeners
// ============================================================
import { FIREBASE_CONFIG } from './firebase-config.js';
import { YEAR_DATA } from './data.js';

// ── Firebase SDK (loaded via CDN in index.html) ──────────────
let db = null;
let _onScoreUpdate = null;
let _activeListeners = [];

export function initFirebase() {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    db = firebase.firestore();
    // Enable offline persistence so the app still works on spotty course wifi
    db.enablePersistence({ synchronizeTabs: true }).catch(err => {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence unavailable (multiple tabs)');
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence not supported in this browser');
      }
    });
    console.log('Firebase initialized ✓');
    return true;
  } catch (e) {
    console.error('Firebase init failed:', e);
    return false;
  }
}

// ── SEED: push static YEAR_DATA to Firestore on first run ────
// Call once from Admin panel. After seeding, Firestore is the source of truth.
export async function seedYearToFirestore(year) {
  if (!db) return false;
  const yd = YEAR_DATA[year];
  if (!yd) return false;
  try {
    const batch = db.batch();
    const yearRef = db.collection('years').doc(year);

    // Top-level year document (metadata)
    batch.set(yearRef, {
      course: yd.course,
      teamNames: yd.teamNames,
      status: yd.status,
      hasDetailedData: yd.hasDetailedData,
      pars: yd.pars,
      finalScore: yd.finalScore || null,
      players: yd.players,
      matches: yd.matches || [],
      schedule: yd.schedule || [],
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // Groups as a subcollection for granular real-time updates
    (yd.groups || []).forEach((g, i) => {
      const ref = yearRef.collection('groups').doc(`g${i}`);
      batch.set(ref, { ...g, idx: i });
    });

    // Sessions as a subcollection
    (yd.sessions || []).forEach(s => {
      const ref = yearRef.collection('sessions').doc(s.id);
      batch.set(ref, s);
    });

    await batch.commit();
    console.log(`Seeded ${year} to Firestore ✓`);
    return true;
  } catch (e) {
    console.error('Seed failed:', e);
    return false;
  }
}

// ── FETCH: load a year's full data from Firestore ────────────
export async function fetchYear(year) {
  if (!db) return null;
  try {
    const yearRef = db.collection('years').doc(year);
    const [docSnap, groupsSnap, sessionsSnap] = await Promise.all([
      yearRef.get(),
      yearRef.collection('groups').orderBy('idx').get(),
      yearRef.collection('sessions').get(),
    ]);

    if (!docSnap.exists) return null;

    const data = docSnap.data();
    data.groups = groupsSnap.docs.map(d => d.data());
    data.sessions = sessionsSnap.docs.map(d => d.data());
    return data;
  } catch (e) {
    console.error('fetchYear failed:', e);
    return null;
  }
}

// ── REAL-TIME LISTENER: subscribe to live score updates ──────
// Calls onUpdate(yearData) whenever any score changes in Firestore
export function subscribeToYear(year, onUpdate) {
  if (!db) return;
  // Detach any previous listeners first
  unsubscribeAll();

  const yearRef = db.collection('years').doc(year);
  let yearDoc = null;
  let groups = [];
  let sessions = [];

  function emit() {
    if (!yearDoc) return;
    onUpdate({ ...yearDoc, groups: [...groups], sessions: [...sessions] });
  }

  // Listen to top-level year doc (teamNames, status, finalScore)
  const unsubYear = yearRef.onSnapshot(snap => {
    if (snap.exists) {
      yearDoc = snap.data();
      emit();
    }
  });

  // Listen to groups subcollection (hole-by-hole scores)
  const unsubGroups = yearRef.collection('groups').orderBy('idx').onSnapshot(snap => {
    groups = snap.docs.map(d => d.data());
    emit();
  });

  // Listen to sessions subcollection (session-format scores)
  const unsubSessions = yearRef.collection('sessions').onSnapshot(snap => {
    sessions = snap.docs.map(d => d.data());
    emit();
  });

  _activeListeners = [unsubYear, unsubGroups, unsubSessions];
}

export function unsubscribeAll() {
  _activeListeners.forEach(unsub => unsub && unsub());
  _activeListeners = [];
}

// ── WRITE: save hole scores for a group ─────────────────────
// BUG FIX #17: replaces the saveEntryScores() stub with a real write
export async function saveGroupScores(year, groupIdx, team, scores) {
  if (!db) return false;
  try {
    const groupRef = db.collection('years').doc(year)
                       .collection('groups').doc(`g${groupIdx}`);
    const field = team === 'A' ? 'scoreA' : 'scoreB';
    await groupRef.update({
      [field]: scores,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.error('saveGroupScores failed:', e);
    return false;
  }
}

// ── WRITE: update team names ─────────────────────────────────
export async function saveTeamNames(year, nameA, nameB) {
  if (!db) return false;
  try {
    await db.collection('years').doc(year).update({
      'teamNames.A': nameA,
      'teamNames.B': nameB,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.error('saveTeamNames failed:', e);
    return false;
  }
}

// ── WRITE: update match status (upcoming → live → done) ──────
export async function saveMatchStatus(year, matchIdx, status) {
  if (!db) return false;
  try {
    const ydRef = db.collection('years').doc(year);
    const snap = await ydRef.get();
    if (!snap.exists) return false;
    const matches = snap.data().matches || [];
    matches[matchIdx] = { ...matches[matchIdx], status };
    await ydRef.update({ matches, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    return true;
  } catch (e) {
    console.error('saveMatchStatus failed:', e);
    return false;
  }
}

// ── WRITE: save pairings for a match ─────────────────────────
export async function savePairings(year, matchIdx, pairings) {
  // pairings: { grp1: { pairA:[ids], pairB:[ids] }, grp2: { pairA:[ids], pairB:[ids] } }
  if (!db) return false;
  try {
    const batch = db.batch();
    const yearRef = db.collection('years').doc(year);
    const existingGroupsSnap = await yearRef.collection('groups').orderBy('idx').get();
    const existingGroups = existingGroupsSnap.docs.map(d => ({ docId: d.id, ...d.data() }));

    ['1','2'].forEach(grpNum => {
      const grpIdx = existingGroups.findIndex(g => g.matchIdx === matchIdx && g.grp === parseInt(grpNum));
      if (grpIdx === -1) return;
      const docId = existingGroups[grpIdx].docId;
      const ref = yearRef.collection('groups').doc(docId);
      batch.update(ref, {
        pairA: pairings['grp' + grpNum].pairA,
        pairB: pairings['grp' + grpNum].pairB,
        scoreA: null,
        scoreB: null,
      });
    });

    await batch.commit();
    return true;
  } catch (e) {
    console.error('savePairings failed:', e);
    return false;
  }
}

// ── AUTH: simple role verification via Firestore PIN doc ─────
// Firestore path: config/pins  →  { player: "1234", captain: "5678", admin: "0000" }
// Set this document manually in the Firebase Console (never expose in client code)
export async function verifyRolePin(role, pin) {
  if (role === 'viewer') return true;
  if (!db) return false;
  try {
    const snap = await db.collection('config').doc('pins').get();
    if (!snap.exists) return false;
    const pins = snap.data();
    return pins[role] === pin;
  } catch (e) {
    console.error('verifyRolePin failed:', e);
    return false;
  }
}

// ── SEED CHECK: has this year been seeded yet? ───────────────
export async function isYearSeeded(year) {
  if (!db) return false;
  try {
    const snap = await db.collection('years').doc(year).get();
    return snap.exists;
  } catch (e) {
    return false;
  }
}
