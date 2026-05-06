const UPGRADES = [

    { id: 'pot1', icon: '🧪', name: 'Mercury Brew', desc: '+2 per click', type: 'click', base: 15, factor: 2.8, maxLevel: 10, perLevel: 2 },
    { id: 'pot2', icon: '⚗️', name: 'Dragon Blood', desc: '+15 per click', type: 'click', base: 200, factor: 3.2, maxLevel: 10, perLevel: 15 },
    

    { id: 'pass1', icon: '🦎', name: 'Salamander', desc: '+1 gold/sec', type: 'pass', base: 20, factor: 1.8, maxLevel: 20, perLevel: 1 },
    { id: 'pass2', icon: '🦉', name: 'Arcane Owl', desc: '+8 gold/sec', type: 'pass', base: 250, factor: 2.1, maxLevel: 15, perLevel: 8 },
    { id: 'pass3', icon: '🐉', name: 'Ancient Drake', desc: '+50 gold/sec', type: 'pass', base: 1800, factor: 2.5, maxLevel: 10, perLevel: 50 },
    

    { id: 'mult1', icon: '📜', name: 'Ancient Scroll', desc: 'x1.5 Total CPS', type: 'mult', base: 5000, factor: 10, maxLevel: 3, perLevel: 0.5 }
  ];
  
  const ACHIEVEMENTS = [
    { id: 'beg', label: 'Apprentice', check: s => s.totalEarned >= 100 },
    { id: 'mid', label: 'Alchemist', check: s => s.totalEarned >= 5000 },
    { id: 'god', label: 'Immortal', check: s => s.totalEarned >= 1000000 },
  ];
  
  let state = {
    points: 0,
    totalEarned: 0,
    totalClicks: 0,
    upgradeLevels: {},
    unlockedAch: {},
    lastSave: Date.now()
  };
  
 
  function getCPC() {
    let base = 1;
    UPGRADES.filter(u => u.type === 'click').forEach(u => {
      base += (state.upgradeLevels[u.id] || 0) * u.perLevel;
    });
    return base;
  }
  
  function getCPS() {
    let base = 0;
    UPGRADES.filter(u => u.type === 'pass').forEach(u => {
      base += (state.upgradeLevels[u.id] || 0) * u.perLevel;
    });
    

    let multiplier = 1;
    UPGRADES.filter(u => u.type === 'mult').forEach(u => {
      multiplier += (state.upgradeLevels[u.id] || 0) * u.perLevel;
    });
    
    return base * multiplier;
  }
  
  function getUpgradeCost(upg) {
    const lvl = state.upgradeLevels[upg.id] || 0;
    return Math.floor(upg.base * Math.pow(upg.factor, lvl));
  }
  

  function updateUI() {
    document.getElementById('gold-display').textContent = Math.floor(state.points).toLocaleString();
    document.getElementById('cpc-val').textContent = getCPC();
    document.getElementById('cps-val').textContent = getCPS().toFixed(1);
  }
  
  function renderUpgrades() {
    const container = document.getElementById('shop');
    container.innerHTML = '';
    UPGRADES.forEach(u => {
      const lvl = state.upgradeLevels[u.id] || 0;
      const cost = getUpgradeCost(u);
      const isMax = lvl >= u.maxLevel;
      
      const div = document.createElement('div');
      div.className = `shop-item ${isMax ? 'maxed' : (state.points < cost ? 'poor' : '')}`;
      div.innerHTML = `
        <span>${u.icon} ${u.name} (Lvl ${lvl})</span>
        <span>${isMax ? 'MAX' : cost + ' 🪙'}</span>
      `;
      if (!isMax) div.onclick = () => buyUpgrade(u.id);
      container.appendChild(div);
    });
  }
  
  function buyUpgrade(id) {
    const u = UPGRADES.find(x => x.id === id);
    const cost = getUpgradeCost(u);
    if (state.points >= cost) {
      state.points -= cost;
      state.upgradeLevels[id] = (state.upgradeLevels[id] || 0) + 1;
      renderUpgrades();
      updateUI();
    }
  }
  
  
  document.getElementById('cauldron').onclick = (e) => {
    const val = getCPC();
    state.points += val;
    state.totalEarned += val;
    updateUI();

    const img = e.target;
    img.style.transform = 'scale(0.9) rotate(-5deg)';
    setTimeout(() => img.style.transform = '', 100);
  };
  
 
  setInterval(() => {
    const income = getCPS() / 10;
    state.points += income;
    state.totalEarned += income;
    updateUI();
  }, 100);
  
  renderUpgrades();