// bloodstream.js - Handles river/cell stats and HUD

class BloodstreamHUD {
    constructor() {
        this.living = document.getElementById('living-count');
        this.dead = document.getElementById('dead-count');
        this.gen = document.getElementById('gen-count');
        this.vitality = document.getElementById('vitality-avg');
        this.bpm = document.getElementById('bpm-display');
        this.pulse = document.getElementById('pulse-count');
    }
    update(stats) {
        this.living.textContent = stats.living;
        this.dead.textContent = stats.remembered;
        this.gen.textContent = stats.generation;
        this.vitality.textContent = Math.round(stats.average_vitality * 100) + '%';
    }
    updatePulse(pulse, bpm) {
        this.pulse.textContent = 'Pulse: ' + pulse;
        this.bpm.textContent = bpm + ' BPM';
    }
}

window.BloodstreamHUD = BloodstreamHUD;
