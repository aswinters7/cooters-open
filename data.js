// ============================================================
// DATA.JS — All static reference data + computed helpers
// ============================================================

export const ALL_PLAYERS = [
  { id: 1,  name: 'Andrew Winters' },
  { id: 2,  name: 'Chris Winters' },
  { id: 3,  name: 'Thomas Birdsey' },
  { id: 4,  name: 'Cyrus Stewart' },
  { id: 5,  name: 'Beau Cutts' },
  { id: 6,  name: 'Mac Selverian' },
  { id: 7,  name: 'Will Maher' },
  { id: 8,  name: 'Kevin Dillon' },
  { id: 9,  name: 'Tyler Sweeney' },
  { id: 10, name: 'Will McDugald' },
];

// hasDetailedData flag drives all no-data guards (replaces magic year <= 2018 checks)
export const YEAR_DATA = {
  '2026': {
    course: 'Comanche Trace · Kerrville, TX',
    teamNames: { A: 'TBD', B: 'TBD' },
    status: 'live',
    hasDetailedData: true,
    players: [
      { id: 1,  name: 'Andrew Winters', team: 'A', hcp: '+3.3', role: 'captain' },
      { id: 2,  name: 'Chris Winters',  team: 'A', hcp: '0.3',  role: 'player'  },
      { id: 3,  name: 'Thomas Birdsey', team: 'A', hcp: '+4.3', role: 'player'  },
      { id: 4,  name: 'Cyrus Stewart',  team: 'A', hcp: '+5.1', role: 'player'  },
      { id: 5,  name: 'Beau Cutts',     team: 'A', hcp: '+3.0', role: 'player'  },
      { id: 6,  name: 'Mac Selverian',  team: 'B', hcp: '+0.5', role: 'captain' },
      { id: 7,  name: 'Will Maher',     team: 'B', hcp: '2.7',  role: 'player'  },
      { id: 8,  name: 'Kevin Dillon',   team: 'B', hcp: '12.0', role: 'player'  },
      { id: 9,  name: 'Tyler Sweeney',  team: 'B', hcp: '7.4',  role: 'player'  },
      { id: 10, name: 'Will McDugald',  team: 'B', hcp: '10.5', role: 'player'  },
    ],
    pars: [4, 3, 4, 5, 4, 3, 4, 5, 4],
    matches: [
      { title: '2-Man Scramble',    badge: 'Holes 1–9', status: 'done'     },
      { title: 'Texas Shamble',     badge: 'Holes 1–9', status: 'done'     },
      { title: 'Modified Chapman',  badge: 'Holes 1–9', status: 'live'     },
      { title: '2-Man Scramble',    badge: 'Holes 1–9', status: 'upcoming' },
      { title: 'Emergency Nine',    badge: 'Holes 1–9', status: 'upcoming' },
    ],
    groups: [
      { matchIdx: 0, grp: 1, pairA: [1,2], pairB: [6,7],  scoreA: [4,3,4,5,4,3,4,4,4], scoreB: [5,3,4,5,4,3,4,5,4] },
      { matchIdx: 0, grp: 2, pairA: [3,4], pairB: [8,9],  scoreA: [4,3,4,5,4,3,4,5,4], scoreB: [4,3,5,5,4,3,4,5,4] },
      { matchIdx: 1, grp: 1, pairA: [1,3], pairB: [6,8],  scoreA: [4,3,4,5,4,3,3,5,4], scoreB: [4,3,4,5,5,3,4,5,4] },
      { matchIdx: 1, grp: 2, pairA: [2,4], pairB: [7,9],  scoreA: [5,3,4,5,4,3,4,5,4], scoreB: [4,3,4,5,4,3,4,5,4] },
      { matchIdx: 2, grp: 1, pairA: [1,4], pairB: [6,9],  scoreA: null, scoreB: null },
      { matchIdx: 2, grp: 2, pairA: [2,3], pairB: [7,8],  scoreA: null, scoreB: null },
      { matchIdx: 3, grp: 1, pairA: [1,2], pairB: [8,9],  scoreA: null, scoreB: null },
      { matchIdx: 3, grp: 2, pairA: [3,4], pairB: [6,7],  scoreA: null, scoreB: null },
      { matchIdx: 4, grp: 1, pairA: [1,2], pairB: [6,7],  scoreA: null, scoreB: null },
      { matchIdx: 4, grp: 2, pairA: [3,4], pairB: [8,9],  scoreA: null, scoreB: null },
    ],
    sessions: [],
    schedule: [
      { day: 'Round 1',   num: 'Rd 1', format: '2-Man Scramble',   course: 'Holes 1–9', status: 'done'     },
      { day: 'Round 2',   num: 'Rd 2', format: 'Texas Shamble',    course: 'Holes 1–9', status: 'done'     },
      { day: 'Round 3',   num: 'Rd 3', format: 'Modified Chapman', course: 'Holes 1–9', status: 'live'     },
      { day: 'Round 4',   num: 'Rd 4', format: '2-Man Scramble',   course: 'Holes 1–9', status: 'upcoming' },
      { day: 'Emergency', num: 'E9',   format: 'Emergency Nine',   course: 'Holes 1–9', status: 'upcoming' },
    ],
  },

  '2025': {
    course: 'Cabot Citrus Farms · Bradenton, FL',
    teamNames: { A: 'Team USA', B: 'Team Europe' },
    status: 'complete',
    hasDetailedData: true,
    finalScore: { A: 14.5, B: 7.5 },
    players: [
      { id: 1,  name: 'Kevin Dillon',   team: 'A', hcp: '12.0', role: 'captain' },
      { id: 2,  name: 'Thomas Birdsey', team: 'A', hcp: '+3.9', role: 'player'  },
      { id: 3,  name: 'Andrew Winters', team: 'A', hcp: '+2.8', role: 'player'  },
      { id: 4,  name: 'Will Maher',     team: 'A', hcp: '3.2',  role: 'player'  },
      { id: 5,  name: 'Beau Cutts',     team: 'A', hcp: '+2.5', role: 'player'  },
      { id: 6,  name: 'Mac Selverian',  team: 'B', hcp: '+0.1', role: 'captain' },
      { id: 7,  name: 'Cyrus Stewart',  team: 'B', hcp: '+4.6', role: 'player'  },
      { id: 8,  name: 'Chris Winters',  team: 'B', hcp: '0.8',  role: 'player'  },
      { id: 9,  name: 'Tyler Sweeney',  team: 'B', hcp: '8.1',  role: 'player'  },
      { id: 10, name: 'Will McDugald',  team: 'B', hcp: '11.0', role: 'player'  },
    ],
    pars: [4, 3, 4, 5, 4, 3, 4, 5, 4],
    sessions: [
      { id:'fri-am-1', session:'Friday',   course:'Karoo · Front Nine',  format:'Texas Scramble',   type:'pairs',      pairA:[3,2],        pairB:[6,7],        ptsA:0,   ptsB:1,   note:"Andrew & Thomas lost to Mac & Cyrus" },
      { id:'fri-am-2', session:'Friday',   course:'Karoo · Front Nine',  format:'Texas Scramble',   type:'pairs',      pairA:[5,4],        pairB:[8,9],        ptsA:1,   ptsB:0,   note:"Beau & Maher beat Chris & Sweeney" },
      { id:'fri-am-3', session:'Friday',   course:'Karoo · Back Nine',   format:'Modified Chapman', type:'pairs',      pairA:[3,2],        pairB:[7,9],        ptsA:1,   ptsB:0,   note:"Andrew & Thomas beat Cyrus & Sweeney" },
      { id:'fri-am-4', session:'Friday',   course:'Karoo · Back Nine',   format:'Modified Chapman', type:'pairs',      pairA:[1,4],        pairB:[8,6],        ptsA:1,   ptsB:0,   note:"Dillon & Maher beat Chris & Mac" },
      { id:'fri-pm-1', session:'Friday',   course:'The Squeeze',         format:'Team Scramble',    type:'full-team',  pairA:[1,2,3,4,5],  pairB:[6,7,8,9,10], ptsA:0,   ptsB:0,   note:"0 points — no result recorded" },
      { id:'fri-nt-1', session:'Friday',   course:'The Wedge',           format:'Team Scramble',    type:'full-team',  pairA:[1,2,3,4,5],  pairB:[6,7,8,9,10], ptsA:0,   ptsB:2,   note:"Europe won + claimed rolled point (2 pts)" },
      { id:'sat-am-1', session:'Saturday', course:'The Wedge',           format:'Scramble',         type:'three-man',  pairA:[3,1,4],      pairB:[9,10],       ptsA:1,   ptsB:0,   note:"Andrew, Dillon & Maher beat Sweeney & McDugald" },
      { id:'sat-am-2', session:'Saturday', course:'The Wedge',           format:'Scramble',         type:'pairs',      pairA:[4,2],        pairB:[8,7],        ptsA:1,   ptsB:0,   note:"Maher & Birdsey beat Chris & Cyrus" },
      { id:'sat-pm-1', session:'Saturday', course:'Karoo · Back Nine',   format:'Texas Scramble',   type:'three-man',  pairA:[3,1,4],      pairB:[9,10],       ptsA:1,   ptsB:0,   note:"Andrew, Dillon & Maher beat Sweeney & McDugald" },
      { id:'sat-pm-2', session:'Saturday', course:'Karoo · Back Nine',   format:'Texas Scramble',   type:'three-man',  pairA:[2,5],        pairB:[8,6,7],      ptsA:0,   ptsB:1,   note:"Chris, Mac & Cyrus beat Birdsey & Beau" },
      { id:'sat-s1',   session:'Saturday', course:'Karoo · Front Nine',  format:'Singles',          type:'singles',    pairA:[3],          pairB:[6],          ptsA:1,   ptsB:0,   note:"Andrew beat Mac" },
      { id:'sat-s2',   session:'Saturday', course:'Karoo · Front Nine',  format:'Singles',          type:'singles',    pairA:[4],          pairB:[8],          ptsA:0,   ptsB:1,   note:"Chris beat Maher" },
      { id:'sat-s3',   session:'Saturday', course:'Karoo · Front Nine',  format:'Singles',          type:'singles',    pairA:[2],          pairB:[9],          ptsA:1,   ptsB:0,   note:"Birdsey beat Sweeney" },
      { id:'sat-s4',   session:'Saturday', course:'Karoo · Front Nine',  format:'Singles',          type:'singles',    pairA:[7],          pairB:[5],          ptsA:0,   ptsB:1,   note:"Cyrus beat Beau" },
      { id:'sat-s5',   session:'Saturday', course:'Karoo · Front Nine',  format:'Singles',          type:'singles',    pairA:[1],          pairB:[10],         ptsA:0.5, ptsB:0.5, note:"Kevin tied McDugald" },
      { id:'sat-pm-t1',session:'Saturday', course:'The Squeeze',         format:'Team Scramble',    type:'full-team',  pairA:[1,2,3,4,5],  pairB:[6,7,8,9,10], ptsA:1,   ptsB:0,   note:"USA beat Europe" },
      { id:'sun-am-1', session:'Sunday',   course:'Roost · Front Nine',  format:'Best Ball',        type:'pairs',      pairA:[4,5],        pairB:[7,9],        ptsA:1,   ptsB:0,   note:"Maher & Beau beat Cyrus & Sweeney" },
      { id:'sun-am-2', session:'Sunday',   course:'Roost · Front Nine',  format:'Best Ball',        type:'pairs',      pairA:[2,3],        pairB:[8,6],        ptsA:0,   ptsB:1,   note:"Chris & Mac beat Birdsey & Andrew" },
      { id:'sun-s1',   session:'Sunday',   course:'Roost · Back Nine',   format:'Singles',          type:'singles',    pairA:[4],          pairB:[9],          ptsA:1,   ptsB:0,   note:"Maher beat Sweeney" },
      { id:'sun-s2',   session:'Sunday',   course:'Roost · Back Nine',   format:'Singles',          type:'singles',    pairA:[5],          pairB:[7],          ptsA:1,   ptsB:0,   note:"Beau beat Cyrus" },
      { id:'sun-s3',   session:'Sunday',   course:'Roost · Back Nine',   format:'Singles',          type:'singles',    pairA:[3],          pairB:[8],          ptsA:1,   ptsB:0,   note:"Andrew beat Chris" },
      { id:'sun-s4',   session:'Sunday',   course:'Roost · Back Nine',   format:'Singles',          type:'singles',    pairA:[2],          pairB:[6],          ptsA:1,   ptsB:0,   note:"Birdsey beat Mac" },
    ],
    matches: [], groups: [],
    schedule: [
      { day:'Friday',   num:'Rd 1',  format:'2-Man Scramble',   course:'Karoo · Front Nine',  status:'done' },
      { day:'Friday',   num:'Rd 2',  format:'Modified Chapman', course:'Karoo · Back Nine',   status:'done' },
      { day:'Friday',   num:'Rd 3',  format:'Team Scramble',    course:'The Squeeze',         status:'done' },
      { day:'Friday',   num:'Rd 4',  format:'Team Scramble',    course:'The Wedge',           status:'done' },
      { day:'Saturday', num:'Rd 5',  format:'Team Scramble',    course:'The Wedge',           status:'done' },
      { day:'Saturday', num:'Rd 6',  format:'Texas Scramble',   course:'Karoo · Back Nine',   status:'done' },
      { day:'Saturday', num:'Rd 7',  format:'Singles',          course:'Karoo · Front Nine',  status:'done' },
      { day:'Saturday', num:'Rd 8',  format:'Team Scramble',    course:'The Squeeze',         status:'done' },
      { day:'Sunday',   num:'Rd 9',  format:'Best Ball',        course:'Roost · Front Nine',  status:'done' },
      { day:'Sunday',   num:'Rd 10', format:'Singles',          course:'Roost · Back Nine',   status:'done' },
    ],
  },

  '2024': {
    course: 'Comanche Trace · Kerrville, TX',
    teamNames: { A: 'Dallas Carter', B: 'Odessa Permian' },
    status: 'pending',
    hasDetailedData: false,
    players: [
      { id: 1,  name: 'Andrew Winters', team: 'A', hcp: '+3.0', role: 'captain' },
      { id: 2,  name: 'Cyrus Stewart',  team: 'A', hcp: '+4.8', role: 'player'  },
      { id: 3,  name: 'Beau Cutts',     team: 'A', hcp: '+2.8', role: 'player'  },
      { id: 4,  name: 'Tyler Sweeney',  team: 'A', hcp: '7.8',  role: 'player'  },
      { id: 5,  name: 'Thomas Birdsey', team: 'A', hcp: '+4.1', role: 'player'  },
      { id: 6,  name: 'Chris Winters',  team: 'B', hcp: '1.0',  role: 'captain' },
      { id: 7,  name: 'Mac Selverian',  team: 'B', hcp: '+0.3', role: 'player'  },
      { id: 8,  name: 'Will Maher',     team: 'B', hcp: '3.5',  role: 'player'  },
      { id: 9,  name: 'Kevin Dillon',   team: 'B', hcp: '12.8', role: 'player'  },
      { id: 10, name: 'Will McDugald',  team: 'B', hcp: '11.5', role: 'player'  },
    ],
    pars: [4,3,4,5,4,3,4,5,4],
    sessions: [], matches: [], groups: [], schedule: [],
  },

  '2023': {
    course: 'Comanche Trace · Kerrville, TX',
    teamNames: { A: 'S Capital', B: "Maher's Place" },
    status: 'complete',
    hasDetailedData: true,
    finalScore: { A: 8.5, B: 4.5 },
    players: [
      { id: 1,  name: 'Mac Selverian',  team: 'A', hcp: '+0.3', role: 'captain' },
      { id: 2,  name: 'Andrew Winters', team: 'A', hcp: '+2.2', role: 'player'  },
      { id: 3,  name: 'Cyrus Stewart',  team: 'A', hcp: '+3.8', role: 'player'  },
      { id: 4,  name: 'Beau Cutts',     team: 'A', hcp: '+1.8', role: 'player'  },
      { id: 5,  name: 'Tyler Sweeney',  team: 'A', hcp: '9.5',  role: 'player'  },
      { id: 6,  name: 'Will Maher',     team: 'B', hcp: '4.5',  role: 'captain' },
      { id: 7,  name: 'Chris Winters',  team: 'B', hcp: '1.5',  role: 'player'  },
      { id: 8,  name: 'Thomas Birdsey', team: 'B', hcp: '+3.2', role: 'player'  },
      { id: 9,  name: 'Kevin Dillon',   team: 'B', hcp: '13.5', role: 'player'  },
      { id: 10, name: 'Will McDugald',  team: 'B', hcp: '12.0', role: 'player'  },
    ],
    pars: [4,3,4,5,4,3,4,5,4],
    sessions: [
      { id:'d1f-1', session:'Day 1', course:'Front Nine',      format:'Texas Scramble', type:'three-man', pairA:[1,4,5], pairB:[6,9],       ptsA:1,   ptsB:0,   note:"Mac/Beau/Tyler beat Maher/Kevin" },
      { id:'d1f-2', session:'Day 1', course:'Front Nine',      format:'Texas Scramble', type:'three-man', pairA:[2,3],   pairB:[7,8,10],    ptsA:1,   ptsB:0,   note:"Andrew/Cyrus beat Chris/Thomas/McDugald" },
      { id:'d1s-1', session:'Day 1', course:'Back Nine',       format:'Texas Scramble', type:'pairs',     pairA:[2,3],   pairB:[7,6,9],     ptsA:0,   ptsB:1,   note:"Chris/Maher/Kevin beat Andrew/Cyrus" },
      { id:'d1s-2', session:'Day 1', course:'Back Nine',       format:'Texas Scramble', type:'three-man', pairA:[1,4,5], pairB:[10,8],      ptsA:1,   ptsB:0,   note:"Mac/Beau/Tyler beat McDugald/Thomas" },
      { id:'e9-1',  session:'Day 1', course:'Emergency Nine',  format:'Team Scramble',  type:'full-team', pairA:[1,2,3,4,5], pairB:[6,7,8,9,10], ptsA:0, ptsB:0, note:"Tied — went to playoff hole" },
      { id:'ph-1',  session:'Day 1', course:'Playoff Hole',    format:'Sudden Death',   type:'singles',   pairA:[1],     pairB:[6],          ptsA:0,   ptsB:1,   note:"Maher beat Mac (Playoff Hole)" },
      { id:'d2f-1', session:'Day 2', course:'Front Nine',      format:'2-Man Scramble', type:'singles',   pairA:[1],     pairB:[6],          ptsA:1,   ptsB:0,   note:"Mac beat Maher" },
      { id:'d2f-2', session:'Day 2', course:'Front Nine',      format:'2-Man Scramble', type:'pairs',     pairA:[3,5],   pairB:[8,10],       ptsA:0,   ptsB:1,   note:"Thomas/McDugald beat Cyrus/Tyler" },
      { id:'d2f-3', session:'Day 2', course:'Front Nine',      format:'2-Man Scramble', type:'pairs',     pairA:[2,4],   pairB:[7,9],        ptsA:1,   ptsB:0,   note:"Andrew/Beau beat Chris/Kevin" },
      { id:'d2s-1', session:'Day 2', course:'Back Nine',       format:'Singles',        type:'singles',   pairA:[1],     pairB:[6],          ptsA:1,   ptsB:0,   note:"Mac beat Maher" },
      { id:'d2s-2', session:'Day 2', course:'Back Nine',       format:'Singles',        type:'singles',   pairA:[3],     pairB:[8],          ptsA:1,   ptsB:0,   note:"Cyrus beat Thomas" },
      { id:'d2s-3', session:'Day 2', course:'Back Nine',       format:'Singles',        type:'singles',   pairA:[5],     pairB:[10],         ptsA:1,   ptsB:0,   note:"Tyler beat McDugald" },
      { id:'d2s-4', session:'Day 2', course:'Back Nine',       format:'Singles',        type:'singles',   pairA:[2],     pairB:[9],          ptsA:0.5, ptsB:0.5, note:"Andrew tied Kevin" },
      { id:'d2s-5', session:'Day 2', course:'Back Nine',       format:'Singles',        type:'singles',   pairA:[4],     pairB:[7],          ptsA:0,   ptsB:1,   note:"Chris beat Beau" },
    ],
    matches: [], groups: [],
    schedule: [
      { day:'Day 1', num:'Rd 1', format:'Texas Scramble', course:'Front Nine',     status:'done' },
      { day:'Day 1', num:'Rd 2', format:'Texas Scramble', course:'Back Nine',      status:'done' },
      { day:'Day 1', num:'Rd 3', format:'Team Scramble',  course:'Emergency Nine', status:'done' },
      { day:'Day 1', num:'Rd 4', format:'Sudden Death',   course:'Playoff Hole',   status:'done' },
      { day:'Day 2', num:'Rd 5', format:'2-Man Scramble', course:'Front Nine',     status:'done' },
      { day:'Day 2', num:'Rd 6', format:'Singles',        course:'Back Nine',      status:'done' },
    ],
  },

  '2022': {
    course: 'Comanche Trace · Kerrville, TX',
    teamNames: { A: 'Tour Bus Rus', B: 'Tom Julio' },
    status: 'complete',
    hasDetailedData: true,
    finalScore: { A: 7, B: 6.5 },
    players: [
      { id: 1,  name: 'Cyrus Stewart',  team: 'A', hcp: '+3.0', role: 'captain' },
      { id: 2,  name: 'Chris Winters',  team: 'A', hcp: '2.0',  role: 'player'  },
      { id: 3,  name: 'Tyler Sweeney',  team: 'A', hcp: '10.5', role: 'player'  },
      { id: 4,  name: 'Beau Cutts',     team: 'A', hcp: '+1.0', role: 'player'  },
      { id: 5,  name: 'Will Maher',     team: 'A', hcp: '5.5',  role: 'player'  },
      { id: 6,  name: 'Thomas Birdsey', team: 'B', hcp: '+2.5', role: 'captain' },
      { id: 7,  name: 'Andrew Winters', team: 'B', hcp: '+1.5', role: 'player'  },
      { id: 8,  name: 'Mac Selverian',  team: 'B', hcp: '1.5',  role: 'player'  },
      { id: 9,  name: 'Kevin Dillon',   team: 'B', hcp: '14.5', role: 'player'  },
      { id: 10, name: 'Will McDugald',  team: 'B', hcp: '13.5', role: 'player'  },
    ],
    pars: [4,3,4,5,4,3,4,5,4],
    sessions: [
      { id:'d1f-1', session:'Day 1', course:'Front Nine',      format:'Texas Scramble', type:'three-man', pairA:[2,5,3],  pairB:[6,9],        ptsA:1,   ptsB:0,   note:"Chris/Maher/Tyler beat Thomas/Kevin" },
      { id:'d1f-2', session:'Day 1', course:'Front Nine',      format:'Texas Scramble', type:'pairs',     pairA:[4,1],    pairB:[7,8,10],     ptsA:0,   ptsB:1,   note:"Andrew/Mac/McDugald beat Beau/Cyrus" },
      { id:'d1s-1', session:'Day 1', course:'Back Nine',       format:'Texas Scramble', type:'pairs',     pairA:[5,1],    pairB:[7,8,9],      ptsA:0.5, ptsB:0.5, note:"Maher/Cyrus tied Andrew/Mac/Kevin" },
      { id:'d1s-2', session:'Day 1', course:'Back Nine',       format:'Texas Scramble', type:'three-man', pairA:[4,2,3],  pairB:[6,10],       ptsA:1,   ptsB:0,   note:"Beau/Chris/Tyler beat Thomas/McDugald" },
      { id:'e9-1',  session:'Day 1', course:'Emergency Nine',  format:'Team Scramble',  type:'full-team', pairA:[1,2,3,4,5], pairB:[6,7,8,9,10], ptsA:0.5, ptsB:0.5, note:"Tied — went to playoff hole" },
      { id:'ph-1',  session:'Day 1', course:'Playoff Hole',    format:'Sudden Death',   type:'singles',   pairA:[1],      pairB:[6],          ptsA:0.5, ptsB:0,   note:"Cyrus won playoff hole vs Thomas" },
      { id:'sb-1',  session:'Day 2', course:'Spikeball',       format:'Spike Ball',     type:'full-team', pairA:[1,2,3,4,5], pairB:[6,7,8,9,10], ptsA:0, ptsB:1,  note:"Tom Julio won Spike Ball" },
      { id:'d2f-1', session:'Day 3', course:'Front Nine',      format:'Texas Scramble', type:'pairs',     pairA:[5,1],    pairB:[6,10,8],     ptsA:1,   ptsB:0,   note:"Maher/Cyrus beat Thomas/McDugald/Mac" },
      { id:'d2f-2', session:'Day 3', course:'Front Nine',      format:'Texas Scramble', type:'three-man', pairA:[2,3,4],  pairB:[7,9],        ptsA:0.5, ptsB:0.5, note:"Chris/Tyler/Beau tied Andrew/Kevin" },
      { id:'d2s-1', session:'Day 3', course:'Back Nine',       format:'Singles',        type:'singles',   pairA:[1],      pairB:[6],          ptsA:0,   ptsB:1,   note:"Thomas beat Cyrus" },
      { id:'d2s-2', session:'Day 3', course:'Back Nine',       format:'Singles',        type:'singles',   pairA:[3],      pairB:[10],         ptsA:1,   ptsB:0,   note:"Tyler beat McDugald" },
      { id:'d2s-3', session:'Day 3', course:'Back Nine',       format:'Singles',        type:'singles',   pairA:[5],      pairB:[8],          ptsA:0,   ptsB:1,   note:"Mac beat Maher" },
      { id:'d2s-4', session:'Day 3', course:'Back Nine',       format:'Singles',        type:'singles',   pairA:[2],      pairB:[9],          ptsA:1,   ptsB:0,   note:"Chris beat Kevin" },
      { id:'d2s-5', session:'Day 3', course:'Back Nine',       format:'Singles',        type:'singles',   pairA:[4],      pairB:[7],          ptsA:0,   ptsB:1,   note:"Andrew beat Beau" },
    ],
    matches: [], groups: [],
    schedule: [
      { day:'Day 1', num:'Rd 1', format:'Texas Scramble', course:'Front Nine',     status:'done' },
      { day:'Day 1', num:'Rd 2', format:'Texas Scramble', course:'Back Nine',      status:'done' },
      { day:'Day 1', num:'Rd 3', format:'Team Scramble',  course:'Emergency Nine', status:'done' },
      { day:'Day 1', num:'Rd 4', format:'Sudden Death',   course:'Playoff Hole',   status:'done' },
      { day:'Day 2', num:'Rd 5', format:'Spikeball',      course:'Las Estrellas',  status:'done' },
      { day:'Day 3', num:'Rd 6', format:'Texas Scramble', course:'Front Nine',     status:'done' },
      { day:'Day 3', num:'Rd 7', format:'Singles',        course:'Back Nine',      status:'done' },
    ],
  },

  '2021': {
    course: 'Comanche Trace · Kerrville, TX',
    teamNames: { A: 'Stroke Rich', B: 'Cocky Boys' },
    status: 'complete',
    hasDetailedData: true,
    finalScore: { A: 8.5, B: 9.0 },
    players: [
      { id: 1,  name: 'Will McDugald',  team: 'A', hcp: '13.0', role: 'captain' },
      { id: 2,  name: 'Thomas Birdsey', team: 'A', hcp: '+2.0', role: 'player'  },
      { id: 3,  name: 'Kevin Dillon',   team: 'A', hcp: '15.0', role: 'player'  },
      { id: 4,  name: 'Tyler Sweeney',  team: 'A', hcp: '11.5', role: 'player'  },
      { id: 5,  name: 'Mac Selverian',  team: 'A', hcp: '2.0',  role: 'player'  },
      { id: 6,  name: 'Beau Cutts',     team: 'B', hcp: '+0.5', role: 'captain' },
      { id: 7,  name: 'Cyrus Stewart',  team: 'B', hcp: '+2.5', role: 'player'  },
      { id: 8,  name: 'Will Maher',     team: 'B', hcp: '6.5',  role: 'player'  },
      { id: 9,  name: 'Chris Winters',  team: 'B', hcp: '2.5',  role: 'player'  },
      { id: 10, name: 'Andrew Winters', team: 'B', hcp: '+1.0', role: 'player'  },
    ],
    pars: [4,3,4,5,4,3,4,5,4],
    sessions: [
      { id:'d1f-1', session:'Day 1', course:'Front Nine',      format:'Texas Scramble',  type:'three-man', pairA:[4,2,3],     pairB:[9,10],       ptsA:1,   ptsB:0,   note:"Tyler/Thomas/Kevin beat Chris/Andrew" },
      { id:'d1f-2', session:'Day 1', course:'Front Nine',      format:'Texas Scramble',  type:'pairs',     pairA:[5,1],       pairB:[8,7,6],      ptsA:0,   ptsB:1,   note:"Maher/Beau/Cyrus beat Mac/McDugald" },
      { id:'d1b-1', session:'Day 1', course:'Back Nine',       format:'Alternate Shot',  type:'three-man', pairA:[4,2,3],     pairB:[9,10],       ptsA:0,   ptsB:1,   note:"Chris/Andrew beat Tyler/Thomas/Kevin" },
      { id:'d1b-2', session:'Day 1', course:'Back Nine',       format:'Alternate Shot',  type:'pairs',     pairA:[5,1],       pairB:[8,7,6],      ptsA:0,   ptsB:1,   note:"Maher/Beau/Cyrus beat Mac/McDugald" },
      { id:'e9-1',  session:'Day 1', course:'Emergency Nine',  format:'Team Scramble',   type:'full-team', pairA:[1,2,3,4,5], pairB:[6,7,8,9,10], ptsA:0.5, ptsB:0.5, note:"Tied" },
      { id:'d2-1',  session:'Day 2', course:'Horseshoes',      format:'Horseshoes',      type:'full-team', pairA:[1,2,3,4,5], pairB:[6,7,8,9,10], ptsA:3,   ptsB:0,   note:"Stroke Rich won Horseshoes (3 pts)" },
      { id:'d2-2',  session:'Day 2', course:'Shooting',        format:'Shooting',        type:'full-team', pairA:[1,2,3,4,5], pairB:[6,7,8,9,10], ptsA:1.5, ptsB:1,   note:"Stroke Rich won Shooting" },
      { id:'d3f-1', session:'Day 3', course:'Front Nine',      format:'Texas Scramble',  type:'three-man', pairA:[2,4,5],     pairB:[7,6],        ptsA:1,   ptsB:0,   note:"Thomas/Tyler/Mac beat Beau/Cyrus" },
      { id:'d3f-2', session:'Day 3', course:'Front Nine',      format:'Texas Scramble',  type:'pairs',     pairA:[1,3],       pairB:[8,9,10],     ptsA:0,   ptsB:1,   note:"Maher/Chris/Andrew beat McDugald/Kevin" },
      { id:'d3s-1', session:'Day 3', course:'Back Nine',       format:'Singles',         type:'singles',   pairA:[1],         pairB:[6],          ptsA:0,   ptsB:1,   note:"Beau beat McDugald" },
      { id:'d3s-2', session:'Day 3', course:'Back Nine',       format:'Singles',         type:'singles',   pairA:[2],         pairB:[8],          ptsA:1,   ptsB:0,   note:"Thomas beat Maher" },
      { id:'d3s-3', session:'Day 3', course:'Back Nine',       format:'Singles',         type:'singles',   pairA:[5],         pairB:[7],          ptsA:0,   ptsB:1,   note:"Cyrus beat Mac" },
      { id:'d3s-4', session:'Day 3', course:'Back Nine',       format:'Singles',         type:'singles',   pairA:[4],         pairB:[9],          ptsA:0.5, ptsB:0.5, note:"Tyler tied Chris" },
      { id:'d3s-5', session:'Day 3', course:'Back Nine',       format:'Singles',         type:'singles',   pairA:[3],         pairB:[10],         ptsA:0,   ptsB:1,   note:"Andrew beat Kevin" },
    ],
    matches: [], groups: [],
    schedule: [
      { day:'Day 1', num:'Rd 1', format:'Texas Scramble', course:'Front Nine',     status:'done' },
      { day:'Day 1', num:'Rd 2', format:'Alternate Shot', course:'Back Nine',      status:'done' },
      { day:'Day 1', num:'Rd 3', format:'Team Scramble',  course:'Emergency Nine', status:'done' },
      { day:'Day 2', num:'Rd 4', format:'Horseshoes',     course:'Las Estrellas',  status:'done' },
      { day:'Day 2', num:'Rd 5', format:'Shooting',       course:'Las Estrellas',  status:'done' },
      { day:'Day 3', num:'Rd 6', format:'Texas Scramble', course:'Front Nine',     status:'done' },
      { day:'Day 3', num:'Rd 7', format:'Singles',        course:'Back Nine',      status:'done' },
    ],
  },

  '2020': {
    course: 'Comanche Trace · Kerrville, TX',
    teamNames: { A: 'Texas Fuck Boys', B: 'Team Killy' },
    status: 'complete',
    hasDetailedData: false,
    finalScore: null,
    players: [
      { id: 1,  name: 'Tyler Sweeney',  team: 'A', hcp: '11.0', role: 'captain' },
      { id: 2,  name: 'Thomas Birdsey', team: 'A', hcp: '+1.5', role: 'player'  },
      { id: 3,  name: 'Andrew Winters', team: 'A', hcp: '+1.0', role: 'player'  },
      { id: 4,  name: 'Will Maher',     team: 'A', hcp: '6.0',  role: 'player'  },
      { id: 5,  name: 'Will McDugald',  team: 'A', hcp: '13.0', role: 'player'  },
      { id: 6,  name: 'Kevin Dillon',   team: 'B', hcp: '15.0', role: 'captain' },
      { id: 7,  name: 'Beau Cutts',     team: 'B', hcp: '+0.2', role: 'player'  },
      { id: 8,  name: 'Chris Winters',  team: 'B', hcp: '2.2',  role: 'player'  },
      { id: 9,  name: 'Mac Selverian',  team: 'B', hcp: '1.8',  role: 'player'  },
      { id: 10, name: 'Cyrus Stewart',  team: 'B', hcp: '+2.2', role: 'player'  },
    ],
    pars: [4,3,4,5,4,3,4,5,4],
    sessions: [], matches: [], groups: [], schedule: [],
  },

  '2019': {
    course: 'Comanche Trace · Kerrville, TX',
    teamNames: { A: 'Team Andrew', B: 'Team Chris' },
    status: 'complete',
    hasDetailedData: true,
    finalScore: { A: 13, B: 9 },
    players: [
      { id: 1,  name: 'Andrew Winters', team: 'A', hcp: '+0.5', role: 'captain' },
      { id: 2,  name: 'Thomas Birdsey', team: 'A', hcp: '+1.5', role: 'player'  },
      { id: 3,  name: 'Tyler Sweeney',  team: 'A', hcp: '10.5', role: 'player'  },
      { id: 4,  name: 'Kevin Dillon',   team: 'A', hcp: '15.5', role: 'player'  },
      { id: 5,  name: 'Will McDugald',  team: 'A', hcp: '14.0', role: 'player'  },
      { id: 6,  name: 'Chris Winters',  team: 'B', hcp: '2.8',  role: 'captain' },
      { id: 7,  name: 'Beau Cutts',     team: 'B', hcp: '+0.1', role: 'player'  },
      { id: 8,  name: 'Cyrus Stewart',  team: 'B', hcp: '+2.8', role: 'player'  },
      { id: 9,  name: 'Will Maher',     team: 'B', hcp: '6.8',  role: 'player'  },
      { id: 10, name: 'Mac Selverian',  team: 'B', hcp: '2.2',  role: 'player'  },
    ],
    pars: [4,3,4,5,4,3,4,5,4],
    // BUG FIX #9: d3s-5 corrected — McDugald is id:5, Maher is id:9
    sessions: [
      { id:'d1f-1', session:'Day 1', course:'Front Nine',    format:'Texas Scramble', type:'three-man', pairA:[1,5,3],     pairB:[9,8],        ptsA:1,   ptsB:0,   note:"Andrew/McDugald/Sweeney beat Maher/Cyrus" },
      { id:'d1f-2', session:'Day 1', course:'Front Nine',    format:'Texas Scramble', type:'pairs',     pairA:[2,4],       pairB:[7,6],        ptsA:1,   ptsB:0,   note:"Thomas/Kevin beat Beau/Chris" },
      { id:'d1b-1', session:'Day 1', course:'Back Nine',     format:'Texas Scramble', type:'three-man', pairA:[1,5,3],     pairB:[9,8],        ptsA:1,   ptsB:0,   note:"Andrew/McDugald/Sweeney beat Maher/Cyrus" },
      { id:'d1b-2', session:'Day 1', course:'Back Nine',     format:'Texas Scramble', type:'pairs',     pairA:[2,4],       pairB:[7,6],        ptsA:0,   ptsB:1,   note:"Beau/Chris beat Thomas/Kevin" },
      { id:'d2-1',  session:'Day 2', course:'Horseshoes',    format:'Horseshoes',     type:'full-team', pairA:[1,2,3,4,5], pairB:[6,7,8,9,10], ptsA:3,   ptsB:0,   note:"Team Andrew won Horseshoes (3 pts)" },
      { id:'d2-2',  session:'Day 2', course:'Shooting',      format:'Shooting',       type:'full-team', pairA:[1,2,3,4,5], pairB:[6,7,8,9,10], ptsA:3,   ptsB:0,   note:"Team Andrew won Shooting (3 pts)" },
      { id:'d2-3',  session:'Day 2', course:'Spikeball',     format:'Spikeball',      type:'full-team', pairA:[1,2,3,4,5], pairB:[6,7,8,9,10], ptsA:1,   ptsB:3,   note:"Team Chris won Spikeball (3 pts)" },
      { id:'d3f-1', session:'Day 3', course:'Front Nine',    format:'Texas Scramble', type:'pairs',     pairA:[4,2],       pairB:[6,7,8],      ptsA:0,   ptsB:1,   note:"Chris/Beau/Cyrus beat Kevin/Thomas" },
      { id:'d3f-2', session:'Day 3', course:'Front Nine',    format:'Texas Scramble', type:'three-man', pairA:[3,5,1],     pairB:[10,9],       ptsA:0,   ptsB:1,   note:"Mac/Maher beat Tyler/McDugald/Andrew" },
      { id:'d3s-1', session:'Day 3', course:'Back Nine',     format:'Singles',        type:'singles',   pairA:[2],         pairB:[8],          ptsA:2,   ptsB:0,   note:"Thomas beat Cyrus (2 pts)" },
      { id:'d3s-2', session:'Day 3', course:'Back Nine',     format:'Singles',        type:'singles',   pairA:[4],         pairB:[6],          ptsA:0,   ptsB:1,   note:"Chris beat Kevin" },
      { id:'d3s-3', session:'Day 3', course:'Back Nine',     format:'Singles',        type:'singles',   pairA:[1],         pairB:[10],         ptsA:0,   ptsB:1,   note:"Mac beat Andrew" },
      { id:'d3s-4', session:'Day 3', course:'Back Nine',     format:'Singles',        type:'singles',   pairA:[3],         pairB:[9],          ptsA:1,   ptsB:0,   note:"Tyler beat Maher" },
      // FIXED: was pairB:[9] (Maher) — McDugald is id:5 in this year, Maher is id:9
      { id:'d3s-5', session:'Day 3', course:'Back Nine',     format:'Singles',        type:'singles',   pairA:[5],         pairB:[9],          ptsA:0,   ptsB:1,   note:"Maher beat McDugald" },
    ],
    matches: [], groups: [],
    schedule: [
      { day:'Day 1', num:'Rd 1', format:'Texas Scramble', course:'Front Nine',  status:'done' },
      { day:'Day 1', num:'Rd 2', format:'Texas Scramble', course:'Back Nine',   status:'done' },
      { day:'Day 2', num:'Rd 3', format:'Horseshoes',     course:'Las Estrellas', status:'done' },
      { day:'Day 2', num:'Rd 4', format:'Shooting',       course:'Las Estrellas', status:'done' },
      { day:'Day 2', num:'Rd 5', format:'Spikeball',      course:'Las Estrellas', status:'done' },
      { day:'Day 3', num:'Rd 6', format:'Texas Scramble', course:'Front Nine',  status:'done' },
      { day:'Day 3', num:'Rd 7', format:'Singles',        course:'Back Nine',   status:'done' },
    ],
  },

  '2018': {
    course: 'Comanche Trace · Kerrville, TX',
    teamNames: { A: 'Team Chris', B: 'Team Andrew' },
    status: 'complete',
    hasDetailedData: false,
    players: [
      { id: 1, name: 'Chris Winters',  team: 'A', hcp: '3.0',  role: 'captain' },
      { id: 2, name: 'Kevin Dillon',   team: 'A', hcp: '16.0', role: 'player'  },
      { id: 3, name: 'Thomas Birdsey', team: 'A', hcp: '+1.0', role: 'player'  },
      { id: 4, name: 'Beau Cutts',     team: 'A', hcp: '+0.8', role: 'player'  },
      { id: 5, name: 'Tyler Sweeney',  team: 'A', hcp: '12.0', role: 'player'  },
      { id: 6, name: 'Andrew Winters', team: 'B', hcp: '+0.2', role: 'captain' },
      { id: 7, name: 'Cyrus Stewart',  team: 'B', hcp: '+2.0', role: 'player'  },
      { id: 8, name: 'Mac Selverian',  team: 'B', hcp: '2.5',  role: 'player'  },
      { id: 9, name: 'Will Maher',     team: 'B', hcp: '7.0',  role: 'player'  },
      { id: 10,name: 'Will McDugald',  team: 'B', hcp: '14.5', role: 'player'  },
    ],
    pars: [4,3,4,5,4,3,4,5,4],
    sessions: [], matches: [], groups: [], schedule: [],
  },

  '2017': {
    course: 'Comanche Trace · Kerrville, TX',
    teamNames: { A: 'Team Chris', B: 'Team Andrew' },
    status: 'complete',
    hasDetailedData: false,
    players: [
      { id: 1, name: 'Chris Winters',  team: 'A', hcp: '3.5',  role: 'captain' },
      { id: 2, name: 'Beau Cutts',     team: 'A', hcp: '+0.5', role: 'player'  },
      { id: 3, name: 'Mac Selverian',  team: 'A', hcp: '2.8',  role: 'player'  },
      { id: 4, name: 'Will Maher',     team: 'A', hcp: '7.5',  role: 'player'  },
      { id: 5, name: 'Will McDugald',  team: 'A', hcp: '15.0', role: 'player'  },
      { id: 6, name: 'Andrew Winters', team: 'B', hcp: '+0.5', role: 'captain' },
      { id: 7, name: 'Thomas Birdsey', team: 'B', hcp: '+1.0', role: 'player'  },
      { id: 8, name: 'Tyler Sweeney',  team: 'B', hcp: '12.5', role: 'player'  },
      { id: 9, name: 'Kevin Dillon',   team: 'B', hcp: '16.5', role: 'player'  },
    ],
    pars: [4,3,4,5,4,3,4,5,4],
    sessions: [], matches: [], groups: [], schedule: [],
  },

  '2016': {
    course: 'Comanche Trace · Kerrville, TX',
    teamNames: { A: 'Team Chris', B: 'Team Andrew' },
    status: 'complete',
    hasDetailedData: false,
    players: [
      { id: 1, name: 'Chris Winters',  team: 'A', hcp: '4.0',  role: 'captain' },
      { id: 2, name: 'Beau Cutts',     team: 'A', hcp: '+0.2', role: 'player'  },
      { id: 3, name: 'Will Maher',     team: 'A', hcp: '8.0',  role: 'player'  },
      { id: 4, name: 'Kevin Dillon',   team: 'A', hcp: '16.0', role: 'player'  },
      { id: 5, name: 'Andrew Winters', team: 'B', hcp: '+0.2', role: 'captain' },
      { id: 6, name: 'Mac Selverian',  team: 'B', hcp: '3.0',  role: 'player'  },
      { id: 7, name: 'Tyler Sweeney',  team: 'B', hcp: '13.0', role: 'player'  },
      { id: 8, name: 'Cyrus Stewart',  team: 'B', hcp: '+2.5', role: 'player'  },
    ],
    pars: [4,3,4,5,4,3,4,5,4],
    sessions: [], matches: [], groups: [], schedule: [],
  },

  '2015': {
    course: 'Comanche Trace · Kerrville, TX',
    teamNames: { A: 'Team Andrew', B: 'Team Chris' },
    status: 'complete',
    hasDetailedData: false,
    players: [
      { id: 1, name: 'Andrew Winters', team: 'A', hcp: '+0.2', role: 'captain' },
      { id: 2, name: 'Mac Selverian',  team: 'A', hcp: '3.5',  role: 'player'  },
      { id: 3, name: 'Will Maher',     team: 'A', hcp: '8.0',  role: 'player'  },
      { id: 4, name: 'Chris Winters',  team: 'B', hcp: '4.5',  role: 'captain' },
      { id: 5, name: 'Beau Cutts',     team: 'B', hcp: '+0.2', role: 'player'  },
      { id: 6, name: 'Tyler Sweeney',  team: 'B', hcp: '13.5', role: 'player'  },
    ],
    pars: [4,3,4,5,4,3,4,5,4],
    sessions: [], matches: [], groups: [], schedule: [],
  },
};

export const YEARS = ['2026','2025','2024','2023','2022','2021','2020','2019','2018','2017','2016','2015'];

export const HISTORY_META = [
  { year:'2026', champTeamKey:null,  pts:'—',        course:'Comanche Trace' },
  { year:'2025', champTeamKey:'A',   pts:'14.5–7.5', course:'Cabot Citrus Farms, FL' },
  { year:'2024', champTeamKey:null,  pts:'—',        course:'Comanche Trace' },
  { year:'2023', champTeamKey:'A',   pts:'8.5–4.5',  course:'Comanche Trace' },
  { year:'2022', champTeamKey:'A',   pts:'7–6.5',    course:'Comanche Trace' },
  { year:'2021', champTeamKey:'B',   pts:'9–8.5',    course:'Comanche Trace' },
  { year:'2020', champTeamKey:'A',   pts:'1–0',      course:'Comanche Trace' },
  { year:'2019', champTeamKey:'A',   pts:'13–9',     course:'Comanche Trace' },
  { year:'2018', champTeamKey:'A',   pts:'1–0',      course:'Comanche Trace' },
  { year:'2017', champTeamKey:'B',   pts:'1–0',      course:'Comanche Trace' },
  { year:'2016', champTeamKey:'B',   pts:'1–0',      course:'Comanche Trace' },
  { year:'2015', champTeamKey:'A',   pts:'1–0',      course:'Comanche Trace' },
];

// ============================================================
// COMPUTED HELPERS — all pure functions, no side effects
// ============================================================

export function isSessions(yd) {
  return yd.sessions && yd.sessions.length > 0;
}

export function pName(players, id) {
  const p = players.find(p => p.id === id);
  return p ? p.name : 'P' + id;
}

export function grpScore(g) {
  if (!g.scoreA || !g.scoreB) return null;
  return {
    a: g.scoreA.reduce((x, y) => x + y, 0),
    b: g.scoreB.reduce((x, y) => x + y, 0),
  };
}

export function grpResult(g) {
  const s = grpScore(g);
  if (!s) return null; // null = unplayed, distinct from tie
  return s.a < s.b ? 'a' : s.b < s.a ? 'b' : 'tie';
}

export function grpPts(g) {
  const r = grpResult(g);
  if (r === null) return null; // BUG FIX #5: null = unplayed, not 0
  return r === 'a' ? { a: 1, b: 0 } : r === 'b' ? { a: 0, b: 1 } : { a: 0.5, b: 0.5 };
}

export function totalPts(yd) {
  if (isSessions(yd)) {
    if (yd.finalScore) return { a: yd.finalScore.A, b: yd.finalScore.B };
    let a = 0, b = 0;
    yd.sessions.forEach(s => { a += s.ptsA; b += s.ptsB; });
    return { a, b };
  }
  let a = 0, b = 0;
  (yd.groups || []).forEach(g => {
    const p = grpPts(g);
    if (p) { a += p.a; b += p.b; } // BUG FIX #5: skip null (unplayed)
  });
  return { a, b };
}

// BUG FIX #4: full-team events award 1 shared point, not N×1 per player
export function playerPts(yd, id) {
  if (isSessions(yd)) {
    let pts = 0;
    yd.sessions.forEach(s => {
      const inA = (s.pairA || []).includes(id);
      const inB = (s.pairB || []).includes(id);
      if (!inA && !inB) return;
      const earned = inA ? s.ptsA : s.ptsB;
      // For full-team events: divide points by team size so it's not inflated
      if (s.type === 'full-team') {
        const teamSize = inA ? s.pairA.length : s.pairB.length;
        pts += earned / teamSize;
      } else {
        pts += earned;
      }
    });
    return Math.round(pts * 100) / 100;
  }
  let pts = 0;
  (yd.groups || []).forEach(g => {
    const inA = g.pairA.includes(id), inB = g.pairB.includes(id);
    if (!inA && !inB) return;
    const p = grpPts(g);
    if (p) pts += inA ? p.a : p.b;
  });
  return pts;
}

// BUG FIX #7: derive all-time points dynamically from all session/group data
export function computeAlltimePts() {
  const totals = {};
  ALL_PLAYERS.forEach(ap => { totals[ap.name] = 0; });

  YEARS.forEach(year => {
    const yd = YEAR_DATA[year];
    if (!yd || !yd.hasDetailedData) return;
    yd.players.forEach(p => {
      const globalName = ALL_PLAYERS.find(ap => ap.id === p.id)?.name || p.name;
      if (totals[globalName] !== undefined) {
        totals[globalName] += playerPts(yd, p.id);
      }
    });
  });

  return Object.entries(totals)
    .map(([name, pts]) => ({ name, pts: Math.round(pts * 100) / 100 }))
    .sort((a, b) => b.pts - a.pts);
}

// BUG FIX #6 & #8: championship wins keyed by team key ('A'/'B'), not name string
export function computeChampWins() {
  const wins = {};
  ALL_PLAYERS.forEach(ap => { wins[ap.name] = 0; });

  HISTORY_META.forEach(h => {
    if (!h.champTeamKey) return;
    const yd = YEAR_DATA[h.year];
    if (!yd) return;
    yd.players
      .filter(p => p.team === h.champTeamKey)
      .forEach(p => {
        const globalName = ALL_PLAYERS.find(ap => ap.id === p.id)?.name || p.name;
        if (wins[globalName] !== undefined) wins[globalName]++;
      });
  });

  return wins;
}
