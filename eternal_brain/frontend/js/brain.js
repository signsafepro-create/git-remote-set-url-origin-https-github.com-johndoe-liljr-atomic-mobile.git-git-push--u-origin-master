// brain.js - Orchestrates frontend logic, WebSocket, commands

let ws = null;
let cellUniverse = null;
let hud = null;

function connectWebSocket() {
    ws = new WebSocket('ws://' + window.location.host + '/ws');
    ws.onopen = () => {
        logTerminal('Connected to Eternal Brain');
    };
    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'init') {
            updateAll(msg.data);
        } else if (msg.type === 'pulse') {
            updateAll(msg.data);
        } else if (msg.type === 'birth') {
            logTerminal('New cell born: ' + msg.data.name);
        } else if (msg.type === 'death') {
            logTerminal('Cells returned to river: ' + msg.data.count);
        } else if (msg.type === 'invocation_result') {
            logTerminal('Result: ' + JSON.stringify(msg.data));
        } else if (msg.type === 'seeded') {
            logTerminal('Seeded: ' + msg.data.name);
        }
    };
    ws.onclose = () => {
        logTerminal('Disconnected. Reconnecting...');
        setTimeout(connectWebSocket, 2000);
    };
}

function updateAll(data) {
    if (hud && data.stats) {
        hud.update(data.stats);
        hud.updatePulse(data.pulse, data.stats ? data.stats.bpm || 60 : 60);
    }
    if (cellUniverse && data.cells) {
        cellUniverse.update(data.cells);
    }
}

function logTerminal(msg) {
    const out = document.getElementById('terminal-output');
    out.textContent += msg + '\n';
    out.scrollTop = out.scrollHeight;
}

function sendCommand(cmd) {
    if (!ws || ws.readyState !== 1) return;
    const parts = cmd.trim().split(' ');
    if (parts[0] === 'invoke') {
        ws.send(JSON.stringify({action: 'invoke', cell: parts[1], args: parts.slice(2)}));
    } else if (parts[0] === 'seed') {
        ws.send(JSON.stringify({action: 'seed', name: parts[1], code: parts.slice(2).join(' ')}));
    } else if (parts[0] === 'bpm') {
        ws.send(JSON.stringify({action: 'set_bpm', bpm: parseFloat(parts[1])}));
    } else if (parts[0] === 'evolve') {
        ws.send(JSON.stringify({action: 'evolve', cell_id: parts[1], code: parts.slice(2).join(' ')}));
    } else {
        logTerminal('Unknown command: ' + cmd);
    }
}


function updatePlannerPanel() {
    fetch('/api/planner/active').then(r => r.json()).then(data => {
        const ul = document.getElementById('active-plans-list');
        ul.innerHTML = '';
        data.forEach(plan => {
            const li = document.createElement('li');
            li.textContent = `${plan.description} (Trigger: ${plan.trigger})`;
            ul.appendChild(li);
        });
    });
    fetch('/api/planner/history').then(r => r.json()).then(data => {
        const ul = document.getElementById('history-plans-list');
        ul.innerHTML = '';
        data.slice(-10).reverse().forEach(plan => {
            const li = document.createElement('li');
            li.textContent = `${plan.description} (Triggered: ${new Date(plan.created_at*1000).toLocaleTimeString()})`;
            ul.appendChild(li);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cellUniverse = new window.CellUniverse(document.getElementById('cell-universe'));
    hud = new window.BloodstreamHUD();
    connectWebSocket();
    document.getElementById('command-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendCommand(e.target.value);
            e.target.value = '';
        }
    });
    document.getElementById('close-detail').addEventListener('click', () => {
        document.getElementById('cell-detail').classList.add('hidden');
    });
    document.getElementById('force-evolve').addEventListener('click', () => {
        const cellId = document.getElementById('cell-detail').dataset.cellId;
        const code = prompt('Enter new code for evolution:');
        if (cellId && code) {
            sendCommand(`evolve ${cellId} ${code}`);
        }
    });
    // Update planner panel every 2 seconds
    setInterval(updatePlannerPanel, 2000);
    updatePlannerPanel();
});

window.showCellDetail = function(cell) {
    const detail = document.getElementById('cell-detail');
    detail.classList.remove('hidden');
    detail.dataset.cellId = cell.id;
    document.getElementById('detail-name').textContent = cell.name;
    document.getElementById('detail-stats').innerHTML = `
        <b>Phase:</b> ${cell.phase}<br>
        <b>Vitality:</b> ${Math.round(cell.vitality * 100)}%<br>
        <b>Archetype:</b> ${cell.archetype}
    `;
    document.getElementById('detail-wisdom').textContent = cell.wisdom || '';
};
