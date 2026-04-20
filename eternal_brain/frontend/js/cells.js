// cells.js - Handles cell rendering and interaction

class Cell {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.phase = data.phase;
        this.vitality = data.vitality;
        this.archetype = data.archetype;
        this.x = Math.random();
        this.y = Math.random();
        this.size = 18 + Math.random() * 18;
        this.color = Cell.phaseColor(this.phase);
    }
    static phaseColor(phase) {
        switch (phase) {
            case 'STEM': return '#00ff88';
            case 'BLOOM': return '#00ffff';
            case 'BURN': return '#ffaa00';
            case 'SENESCE': return '#ff00aa';
            case 'CRISIS': return '#ff0000';
            case 'RENEW': return '#aa00ff';
            default: return '#8888ff';
        }
    }
}

class CellUniverse {
    constructor(container) {
        this.container = container;
        this.cells = {};
        this.selected = null;
        this._setup();
    }
    _setup() {
        this.container.innerHTML = '';
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', '100vw');
        this.svg.setAttribute('height', '100vh');
        this.svg.style.position = 'absolute';
        this.svg.style.top = '0';
        this.svg.style.left = '0';
        this.svg.style.width = '100vw';
        this.svg.style.height = '100vh';
        this.svg.style.zIndex = '2';
        this.container.appendChild(this.svg);
        window.addEventListener('resize', () => this._resize());
        this._resize();
    }
    _resize() {
        this.svg.setAttribute('width', window.innerWidth);
        this.svg.setAttribute('height', window.innerHeight);
    }
    update(cellsData) {
        // Add/update cells
        for (const data of cellsData) {
            if (!this.cells[data.id]) {
                this.cells[data.id] = new Cell(data);
            } else {
                Object.assign(this.cells[data.id], data);
            }
        }
        // Remove dead cells
        for (const id in this.cells) {
            if (!cellsData.find(c => c.id === id)) {
                delete this.cells[id];
            }
        }
        this.render();
    }
    render() {
        this.svg.innerHTML = '';
        for (const id in this.cells) {
            const cell = this.cells[id];
            const cx = cell.x * window.innerWidth;
            const cy = cell.y * window.innerHeight;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', cx);
            circle.setAttribute('cy', cy);
            circle.setAttribute('r', cell.size);
            circle.setAttribute('fill', cell.color);
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', cell.id === this.selected ? 4 : 1);
            circle.style.cursor = 'pointer';
            circle.addEventListener('click', () => this.select(cell.id));
            this.svg.appendChild(circle);
        }
    }
    select(cellId) {
        this.selected = cellId;
        const cell = this.cells[cellId];
        if (cell) {
            window.showCellDetail(cell);
        }
        this.render();
    }
}

window.CellUniverse = CellUniverse;
