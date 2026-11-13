// EMERGENCY USE ONLY - Jigsaw Explorer solver (leaves the last piece unplaced)
// Paste into the browser Console (F12) while the puzzle is open and playing.
// Snap at least 2 pieces together first so there is a group to build from.
// Change DELAY to speed up or slow down (ms pause after each placed piece).
(async () => {
  const DELAY = 400;

  const P = jigexGlobals.modules.player.Puzzle.curr;
  const it = P.pieces.getIterator();
  const all = [];
  let x;
  while ((x = it.getNext())) all.push(x);

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const size = q => (q.group ? q.group.members.length : 1);
  const mainGroup = () => {
    let best = null;
    for (const q of all) if (q.group && (!best || size(q) > best.members.length)) best = q.group;
    return best;
  };
  const inMain = q => { const g = mainGroup(); return !!g && q.group === g; };
  const looseCount = () => all.filter(q => !inMain(q)).length;

  const g0 = mainGroup();
  if (!g0 || g0.members.length < 2) { console.log('No group found. Snap at least 2 pieces together first.'); return; }
  console.log('start group size:', g0.members.length, 'loose:', looseCount());

  const nb = q => Object.values(q.neighbors || {}).filter(n => n && n.id !== undefined);

  const placeOne = q => new Promise(res => {
    const a = nb(q).find(n => inMain(n));
    if (!a) return res(false);
    let done = false;
    const fit = () => {
      if (done) return; done = true;
      try { q.moveToFit(a); q.drop(); res(inMain(q)); }
      catch (e) { console.warn('piece', q.id, e.message); res(false); }
    };
    if (q.angle !== a.angle) { q.rotateTo(a.angle, false, fit); setTimeout(fit, 1500); }
    else fit();
  });

  let m, total = 0;
  do {
    m = 0;
    for (const q of all) {
      if (looseCount() <= 1) break;
      if (!inMain(q) && await placeOne(q)) { m++; await sleep(DELAY); }
    }
    total += m;
  } while (m > 0 && looseCount() > 1);

  const left = all.filter(q => !inMain(q));
  console.log('placed', total, 'group size:', mainGroup().members.length, 'of', all.length,
    '| left:', left.map(q => q.id).join(', '));
})();
