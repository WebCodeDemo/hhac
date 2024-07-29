// Game state
let state = {
    quarantined: 0,
    taxes: 0,
    taxRate: 0.1,
    clickPower: 1,
    autoClickers: 0,
    autoClickerCost: 10,
    lastSaved: Date.now()
};

// Upgrades
const upgrades = [
    { id: 'Handcuffs', name: 'Handcuffs', cost: 10, owned: 0, unlock: 0, effect: () => state.autoClickers++ },
    { id: 'BatonsAndTruncheons', name: 'Batons and Truncheons', cost: 50, owned: 0, unlock: 100, effect: () => state.clickPower++ },
    { id: 'Guard Dogs', name: 'Guard Dogs', cost: 200, owned: 0, unlock: 500, effect: () => state.taxRate += 0.05 },
    { id: 'Firearms', name: 'Firearms', cost: 1000, owned: 0, unlock: 2000, effect: () => state.autoClickers += 5 },
    { id: 'CreatePropaganda', name: 'Create Propaganda', cost: 5000, owned: 0, unlock: 10000, effect: () => { state.clickPower += 5; state.taxRate += 0.1; } },
    { id: 'MoreJewishIdentificationSystems', name: 'More Jewish Identification systems', cost: 20000, owned: 0, unlock: 50000, effect: () => state.autoClickers += 20 },
    { id: 'CreateForcedLaborPrograms', name: 'Create Forced Labor Programs', cost: 100000, owned: 0, unlock: 200000, effect: () => { state.clickPower *= 2; state.taxRate += 0.2; } },
    { id: 'CreateMedicalExperimentationPrograms', name: 'Create Medical Experimentation Programs', cost: 500000, owned: 0, unlock: 1000000, effect: () => { state.autoClickers += 100; state.taxRate += 0.5; } },
    { id: 'CreateGasChambersAndCrematoria', name: 'Create Gas Chambers and Crematoria', cost: 2000000, owned: 0, unlock: 5000000, effect: () => { state.clickPower *= 5; state.autoClickers *= 2; } },
    { id: 'CreateANetworkOfCamps', name: 'Create A Network Of Camps', cost: 10000000, owned: 0, unlock: 10000000, effect: () => { state.clickPower *= 10; state.autoClickers *= 5; state.taxRate *= 2; } }
];
// Achievements
const achievements = [
    { id: 'firstKilled', name: 'First Killed', condition: () => state.quarantined >= 1, achieved: false },
    { id: 'hundredKilled', name: '100 Killed', condition: () => state.quarantined >= 100, achieved: false },
	{ id: 'sixSixSixKilled', name: 'Anti-Christ, 666 Killed', condition: () => state.quarantined >= 666, achieved: false },
    { id: 'thousandKilled', name: '1,000 Killed', condition: () => state.quarantined >= 1000, achieved: false },
    { id: 'millionKilled', name: '1 Million Killed', condition: () => state.quarantined >= 1000000, achieved: false },
    { id: 'tenMillionKilled', name: 'Ten Million Killed', condition: () => state.quarantined >= 10000000, achieved: false }
];

// Game functions
function quarantinePerson() {
    state.quarantined += state.clickPower;
    updateDisplay();
    checkAchievements();
    checkEndGame();
}

function collectTaxes() {
    state.taxes += state.quarantined * state.taxRate;
    updateDisplay();
}

function buyUpgrade(upgrade) {
    if (state.taxes >= upgrade.cost) {
        state.taxes -= upgrade.cost;
        upgrade.owned++;
        upgrade.cost = Math.ceil(upgrade.cost * 1.15);
        upgrade.effect();
        updateDisplay();
        updateUpgrades();
    }
}

function updateDisplay() {
    document.getElementById('quarantined').textContent = Math.floor(state.quarantined);
    document.getElementById('taxes').textContent = state.taxes.toFixed(2);
    updateUpgrades();
}

function updateUpgrades() {
    const upgradesList = document.getElementById('upgradesList');
    upgradesList.innerHTML = '';
    upgrades.forEach(upgrade => {
        if (state.quarantined >= upgrade.unlock) {
            const button = document.createElement('button');
            button.textContent = `${upgrade.name} (${upgrade.owned}) - $${upgrade.cost.toFixed(2)}`;
            button.onclick = () => buyUpgrade(upgrade);
            button.disabled = state.taxes < upgrade.cost;
            upgradesList.appendChild(button);
        }
    });
}

function checkAchievements() {
    achievements.forEach(achievement => {
        if (!achievement.achieved && achievement.condition()) {
            achievement.achieved = true;
            const li = document.createElement('li');
            li.textContent = achievement.name;
            document.getElementById('achievementsList').appendChild(li);
        }
    });
}

function checkEndGame() {
    if (state.quarantined >= 13000000) {
        document.getElementById('endGame').style.display = 'block';
    }
}

// Auto clickers and tax collection
setInterval(() => {
    state.quarantined += state.autoClickers;
    collectTaxes();
    updateDisplay();
    checkAchievements();
    checkEndGame();
}, 1000);

// Save game state
setInterval(() => {
    localStorage.setItem('quarantineClickerState', JSON.stringify(state));
}, 60000);

// Load game state
function loadGame() {
    const savedState = localStorage.getItem('quarantineClickerState');
    if (savedState) {
        state = JSON.parse(savedState);
        const timeDiff = (Date.now() - state.lastSaved) / 1000;
        state.quarantined += state.autoClickers * timeDiff;
        state.taxes += state.quarantined * state.taxRate * timeDiff;
        updateDisplay();
        checkAchievements();
    }
    state.lastSaved = Date.now();
}

// Event listeners
document.getElementById('quarantineButton').addEventListener('click', quarantinePerson);

// Initialize game
loadGame();
updateDisplay();
updateUpgrades();