/**
 * VanteTegner - Canvas Drawing Module
 * Handles all canvas drawing operations, touch/mouse input, and grid management
 * Updated with authentic mitten templates from "Selbu Strikking" book
 */

class CanvasDrawing {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Grid configuration - will be set by size template
        this.cellSize = 12;
        this.gridWidth = 60;
        this.gridHeight = 80;
        
        // Current size template
        this.currentSize = 'dame';
        
        // Mitten outline data - will be populated based on size
        this.mittenOutline = null;
        this.showMittenOutline = true;
        
        // Drawing state
        this.isDrawing = false;
        this.currentTool = 'pencil';
        this.currentColor = '#F5F5DC'; // Natural white
        this.secondaryColor = '#2F4F4F'; // Dark gray
        
        // Color palette
        this.colors = {
            natural: '#F5F5DC',
            darkgray: '#2F4F4F',
            accent1: '#8B0000',
            accent2: '#1E4D6B',
            transparent: null
        };
        
        // Grid state (stores color for each cell)
        this.grid = [];
        
        // Undo/Redo stacks
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoSteps = 50;
        
        // View settings
        this.zoom = 1;
        this.showGrid = true;
        this.showMirror = false;
        
        // Touch handling
        this.lastTouchPos = null;
        
        // Initialize with dame size by default
        this.loadSizeTemplate('dame');
        this.setupEventListeners();
        this.render();
    }
    
    /**
     * Size templates based on the knitting book
     * Each template defines grid dimensions and mitten outline
     */
    getSizeTemplates() {
        return {
            // Børnevante - Children's mitten (smallest)
            barn: {
                name: 'Børn',
                gridWidth: 55,
                gridHeight: 70,
                cellSize: 11,
                outline: this.createChildMittenOutline()
            },
            
            // Damevante - Women's mitten (medium)
            dame: {
                name: 'Dame',
                gridWidth: 65,
                gridHeight: 85,
                cellSize: 10,
                outline: this.createWomenMittenOutline()
            },
            
            // Herrevante - Men's mitten (largest)
            herre: {
                name: 'Herre',
                gridWidth: 75,
                gridHeight: 95,
                cellSize: 9,
                outline: this.createMenMittenOutline()
            }
        };
    }
    
    /**
     * Create børnevante (child mitten) outline
     * Based on "Din egen barnevante" - precise pixel-perfect outline
     */
    createChildMittenOutline() {
        const lines = [];
        
        // === THUMB (left side) ===
        // Thumb dimensions: ~12 cells wide, ~22 cells tall
        const thumbLeft = 3;
        const thumbRight = 15;
        const thumbBottom = 50;
        const thumbTop = 28;
        
        // Left side of thumb
        lines.push({ x1: thumbLeft, y1: thumbBottom, x2: thumbLeft, y2: thumbTop + 6 });
        
        // Thumb top zigzag (characteristic W shape)
        lines.push({ x1: thumbLeft, y1: thumbTop + 6, x2: thumbLeft + 2, y2: thumbTop + 4 });
        lines.push({ x1: thumbLeft + 2, y1: thumbTop + 4, x2: thumbLeft + 4, y2: thumbTop + 2 });
        lines.push({ x1: thumbLeft + 4, y1: thumbTop + 2, x2: thumbLeft + 6, y2: thumbTop });
        lines.push({ x1: thumbLeft + 6, y1: thumbTop, x2: thumbLeft + 8, y2: thumbTop + 2 });
        lines.push({ x1: thumbLeft + 8, y1: thumbTop + 2, x2: thumbLeft + 10, y2: thumbTop + 4 });
        lines.push({ x1: thumbLeft + 10, y1: thumbTop + 4, x2: thumbRight, y2: thumbTop + 6 });
        
        // Right side of thumb
        lines.push({ x1: thumbRight, y1: thumbTop + 6, x2: thumbRight, y2: thumbBottom });
        
        // Thumb bottom
        lines.push({ x1: thumbRight, y1: thumbBottom, x2: thumbLeft, y2: thumbBottom });
        
        // === MAIN MITTEN ===
        const mainLeft = 18;
        const mainRight = 46;
        const mainBottom = 68;
        const mainTop = 5;
        const midX = (mainLeft + mainRight) / 2;
        
        // Left side
        lines.push({ x1: mainLeft, y1: mainBottom, x2: mainLeft, y2: mainTop + 8 });
        
        // Top zigzag (2 peaks with valley)
        // Left peak
        lines.push({ x1: mainLeft, y1: mainTop + 8, x2: mainLeft + 3, y2: mainTop + 5 });
        lines.push({ x1: mainLeft + 3, y1: mainTop + 5, x2: mainLeft + 6, y2: mainTop + 2 });
        lines.push({ x1: mainLeft + 6, y1: mainTop + 2, x2: mainLeft + 9, y2: mainTop });
        // Valley
        lines.push({ x1: mainLeft + 9, y1: mainTop, x2: midX - 2, y2: mainTop + 3 });
        lines.push({ x1: midX - 2, y1: mainTop + 3, x2: midX + 2, y2: mainTop + 3 });
        lines.push({ x1: midX + 2, y1: mainTop + 3, x2: mainRight - 9, y2: mainTop });
        // Right peak
        lines.push({ x1: mainRight - 9, y1: mainTop, x2: mainRight - 6, y2: mainTop + 2 });
        lines.push({ x1: mainRight - 6, y1: mainTop + 2, x2: mainRight - 3, y2: mainTop + 5 });
        lines.push({ x1: mainRight - 3, y1: mainTop + 5, x2: mainRight, y2: mainTop + 8 });
        
        // Right side
        lines.push({ x1: mainRight, y1: mainTop + 8, x2: mainRight, y2: mainBottom });
        
        // Bottom
        lines.push({ x1: mainRight, y1: mainBottom, x2: mainLeft, y2: mainBottom });
        
        // === THUMB ATTACHMENT DIAGONAL (inside main mitten) ===
        const attachTop = 38;
        const attachBottom = 52;
        lines.push({ x1: mainLeft + 8, y1: attachTop, x2: mainLeft, y2: attachBottom });
        lines.push({ x1: mainLeft, y1: attachBottom, x2: mainLeft + 8, y2: attachBottom });
        lines.push({ x1: mainLeft + 8, y1: attachBottom, x2: mainLeft + 8, y2: attachTop });
        
        // M marker
        const markers = [
            { x: mainLeft + 4, y: attachBottom + 3, label: 'M' }
        ];
        
        return { lines, markers };
    }
    
    /**
     * Create damevante (women's mitten) outline
     * Based on "Din egen damevante" - precise pixel-perfect outline
     */
    createWomenMittenOutline() {
        const lines = [];
        
        // === THUMB (left side) ===
        const thumbLeft = 3;
        const thumbRight = 17;
        const thumbBottom = 60;
        const thumbTop = 32;
        
        // Left side of thumb
        lines.push({ x1: thumbLeft, y1: thumbBottom, x2: thumbLeft, y2: thumbTop + 7 });
        
        // Thumb top zigzag (W shape)
        lines.push({ x1: thumbLeft, y1: thumbTop + 7, x2: thumbLeft + 3, y2: thumbTop + 4 });
        lines.push({ x1: thumbLeft + 3, y1: thumbTop + 4, x2: thumbLeft + 5, y2: thumbTop + 2 });
        lines.push({ x1: thumbLeft + 5, y1: thumbTop + 2, x2: thumbLeft + 7, y2: thumbTop });
        lines.push({ x1: thumbLeft + 7, y1: thumbTop, x2: thumbLeft + 9, y2: thumbTop + 2 });
        lines.push({ x1: thumbLeft + 9, y1: thumbTop + 2, x2: thumbLeft + 11, y2: thumbTop + 4 });
        lines.push({ x1: thumbLeft + 11, y1: thumbTop + 4, x2: thumbRight, y2: thumbTop + 7 });
        
        // Right side of thumb
        lines.push({ x1: thumbRight, y1: thumbTop + 7, x2: thumbRight, y2: thumbBottom });
        
        // Thumb bottom
        lines.push({ x1: thumbRight, y1: thumbBottom, x2: thumbLeft, y2: thumbBottom });
        
        // === MAIN MITTEN ===
        const mainLeft = 21;
        const mainRight = 53;
        const mainBottom = 83;
        const mainTop = 5;
        const midX = (mainLeft + mainRight) / 2;
        
        // Left side
        lines.push({ x1: mainLeft, y1: mainBottom, x2: mainLeft, y2: mainTop + 10 });
        
        // Top zigzag (2 peaks with valley)
        // Left peak
        lines.push({ x1: mainLeft, y1: mainTop + 10, x2: mainLeft + 4, y2: mainTop + 6 });
        lines.push({ x1: mainLeft + 4, y1: mainTop + 6, x2: mainLeft + 7, y2: mainTop + 3 });
        lines.push({ x1: mainLeft + 7, y1: mainTop + 3, x2: mainLeft + 10, y2: mainTop });
        // Valley
        lines.push({ x1: mainLeft + 10, y1: mainTop, x2: midX - 3, y2: mainTop + 4 });
        lines.push({ x1: midX - 3, y1: mainTop + 4, x2: midX + 3, y2: mainTop + 4 });
        lines.push({ x1: midX + 3, y1: mainTop + 4, x2: mainRight - 10, y2: mainTop });
        // Right peak
        lines.push({ x1: mainRight - 10, y1: mainTop, x2: mainRight - 7, y2: mainTop + 3 });
        lines.push({ x1: mainRight - 7, y1: mainTop + 3, x2: mainRight - 4, y2: mainTop + 6 });
        lines.push({ x1: mainRight - 4, y1: mainTop + 6, x2: mainRight, y2: mainTop + 10 });
        
        // Right side
        lines.push({ x1: mainRight, y1: mainTop + 10, x2: mainRight, y2: mainBottom });
        
        // Bottom
        lines.push({ x1: mainRight, y1: mainBottom, x2: mainLeft, y2: mainBottom });
        
        // === THUMB ATTACHMENT (inside main mitten) ===
        const attachTop = 45;
        const attachBottom = 62;
        lines.push({ x1: mainLeft + 10, y1: attachTop, x2: mainLeft, y2: attachBottom });
        lines.push({ x1: mainLeft, y1: attachBottom, x2: mainLeft + 10, y2: attachBottom });
        lines.push({ x1: mainLeft + 10, y1: attachBottom, x2: mainLeft + 10, y2: attachTop });
        
        // M markers
        const markers = [
            { x: mainLeft + 5, y: attachBottom + 4, label: 'M' },
            { x: thumbLeft + 7, y: thumbBottom + 3, label: 'M' }
        ];
        
        return { lines, markers };
    }
    
    /**
     * Create herrevante (men's mitten) outline
     * Based on "Din egen herrevante" - precise pixel-perfect outline
     */
    createMenMittenOutline() {
        const lines = [];
        
        // === THUMB (left side) ===
        const thumbLeft = 3;
        const thumbRight = 19;
        const thumbBottom = 68;
        const thumbTop = 36;
        
        // Left side of thumb
        lines.push({ x1: thumbLeft, y1: thumbBottom, x2: thumbLeft, y2: thumbTop + 8 });
        
        // Thumb top zigzag (W shape)
        lines.push({ x1: thumbLeft, y1: thumbTop + 8, x2: thumbLeft + 3, y2: thumbTop + 5 });
        lines.push({ x1: thumbLeft + 3, y1: thumbTop + 5, x2: thumbLeft + 6, y2: thumbTop + 2 });
        lines.push({ x1: thumbLeft + 6, y1: thumbTop + 2, x2: thumbLeft + 8, y2: thumbTop });
        lines.push({ x1: thumbLeft + 8, y1: thumbTop, x2: thumbLeft + 10, y2: thumbTop + 2 });
        lines.push({ x1: thumbLeft + 10, y1: thumbTop + 2, x2: thumbLeft + 13, y2: thumbTop + 5 });
        lines.push({ x1: thumbLeft + 13, y1: thumbTop + 5, x2: thumbRight, y2: thumbTop + 8 });
        
        // Right side of thumb
        lines.push({ x1: thumbRight, y1: thumbTop + 8, x2: thumbRight, y2: thumbBottom });
        
        // Thumb bottom
        lines.push({ x1: thumbRight, y1: thumbBottom, x2: thumbLeft, y2: thumbBottom });
        
        // === MAIN MITTEN ===
        const mainLeft = 24;
        const mainRight = 60;
        const mainBottom = 93;
        const mainTop = 5;
        const midX = (mainLeft + mainRight) / 2;
        
        // Left side
        lines.push({ x1: mainLeft, y1: mainBottom, x2: mainLeft, y2: mainTop + 12 });
        
        // Top zigzag (2 peaks with valley)
        // Left peak
        lines.push({ x1: mainLeft, y1: mainTop + 12, x2: mainLeft + 4, y2: mainTop + 8 });
        lines.push({ x1: mainLeft + 4, y1: mainTop + 8, x2: mainLeft + 8, y2: mainTop + 4 });
        lines.push({ x1: mainLeft + 8, y1: mainTop + 4, x2: mainLeft + 12, y2: mainTop });
        // Valley
        lines.push({ x1: mainLeft + 12, y1: mainTop, x2: midX - 3, y2: mainTop + 5 });
        lines.push({ x1: midX - 3, y1: mainTop + 5, x2: midX + 3, y2: mainTop + 5 });
        lines.push({ x1: midX + 3, y1: mainTop + 5, x2: mainRight - 12, y2: mainTop });
        // Right peak
        lines.push({ x1: mainRight - 12, y1: mainTop, x2: mainRight - 8, y2: mainTop + 4 });
        lines.push({ x1: mainRight - 8, y1: mainTop + 4, x2: mainRight - 4, y2: mainTop + 8 });
        lines.push({ x1: mainRight - 4, y1: mainTop + 8, x2: mainRight, y2: mainTop + 12 });
        
        // Right side
        lines.push({ x1: mainRight, y1: mainTop + 12, x2: mainRight, y2: mainBottom });
        
        // Bottom
        lines.push({ x1: mainRight, y1: mainBottom, x2: mainLeft, y2: mainBottom });
        
        // === THUMB ATTACHMENT (inside main mitten) ===
        const attachTop = 50;
        const attachBottom = 70;
        lines.push({ x1: mainLeft + 12, y1: attachTop, x2: mainLeft, y2: attachBottom });
        lines.push({ x1: mainLeft, y1: attachBottom, x2: mainLeft + 12, y2: attachBottom });
        lines.push({ x1: mainLeft + 12, y1: attachBottom, x2: mainLeft + 12, y2: attachTop });
        
        // M markers
        const markers = [
            { x: mainLeft + 6, y: attachBottom + 4, label: 'M' },
            { x: thumbLeft + 8, y: thumbBottom + 3, label: 'M' }
        ];
        
        return { lines, markers };
    }
    
    /**
     * Load size template and initialize grid
     */
    loadSizeTemplate(sizeName) {
        const templates = this.getSizeTemplates();
        const template = templates[sizeName] || templates.dame;
        
        this.currentSize = sizeName;
        this.gridWidth = template.gridWidth;
        this.gridHeight = template.gridHeight;
        this.cellSize = template.cellSize;
        this.mittenOutline = template.outline;
        
        this.initializeGrid();
    }
    
    /**
     * Initialize empty grid based on current dimensions
     */
    initializeGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                this.grid[y][x] = null;
            }
        }
        this.resizeCanvas();
    }
    
    /**
     * Resize canvas to fit grid
     */
    resizeCanvas() {
        const width = this.gridWidth * this.cellSize * this.zoom;
        const height = this.gridHeight * this.cellSize * this.zoom;
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        this.ctx.imageSmoothingEnabled = false;
    }
    
    /**
     * Set mitten size template
     */
    setSize(size) {
        // Map old size names to new
        const sizeMap = {
            'small': 'barn',
            'medium': 'dame',
            'large': 'herre',
            'barn': 'barn',
            'dame': 'dame',
            'herre': 'herre'
        };
        
        const mappedSize = sizeMap[size] || 'dame';
        
        // Save current state
        this.saveState();
        
        // Save current pattern
        const oldGrid = this.grid;
        const oldWidth = this.gridWidth;
        const oldHeight = this.gridHeight;
        
        // Load new template
        this.loadSizeTemplate(mappedSize);
        
        // Try to preserve pattern (center it if sizes differ)
        const offsetX = Math.floor((this.gridWidth - oldWidth) / 2);
        const offsetY = Math.floor((this.gridHeight - oldHeight) / 2);
        
        for (let y = 0; y < oldHeight; y++) {
            for (let x = 0; x < oldWidth; x++) {
                const newX = x + offsetX;
                const newY = y + offsetY;
                if (oldGrid[y] && oldGrid[y][x] && 
                    newX >= 0 && newX < this.gridWidth && 
                    newY >= 0 && newY < this.gridHeight) {
                    this.grid[newY][newX] = oldGrid[y][x];
                }
            }
        }
        
        this.render();
    }
    
    /**
     * Setup all event listeners for mouse and touch
     */
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', () => this.handleTouchEnd());
        this.canvas.addEventListener('touchcancel', () => this.handleTouchEnd());
    }
    
    /**
     * Get cell coordinates from event position
     */
    getCellFromEvent(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        let clientX, clientY;
        
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const x = Math.floor((clientX - rect.left) * scaleX / (this.cellSize * this.zoom));
        const y = Math.floor((clientY - rect.top) * scaleY / (this.cellSize * this.zoom));
        
        return { x, y };
    }
    
    /**
     * Check if cell coordinates are valid
     */
    isValidCell(x, y) {
        return x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight;
    }
    
    /**
     * Mouse down handler
     */
    handleMouseDown(e) {
        e.preventDefault();
        this.isDrawing = true;
        this.saveState();
        
        const cell = this.getCellFromEvent(e);
        const color = e.button === 2 ? this.secondaryColor : this.currentColor;
        
        this.drawAtCell(cell.x, cell.y, color);
    }
    
    /**
     * Mouse move handler
     */
    handleMouseMove(e) {
        if (!this.isDrawing) return;
        
        const cell = this.getCellFromEvent(e);
        const color = e.buttons === 2 ? this.secondaryColor : this.currentColor;
        
        this.drawAtCell(cell.x, cell.y, color);
    }
    
    /**
     * Mouse up handler
     */
    handleMouseUp() {
        this.isDrawing = false;
    }
    
    /**
     * Touch start handler
     */
    handleTouchStart(e) {
        e.preventDefault();
        this.isDrawing = true;
        this.saveState();
        
        const cell = this.getCellFromEvent(e);
        this.lastTouchPos = cell;
        
        this.drawAtCell(cell.x, cell.y, this.currentColor);
    }
    
    /**
     * Touch move handler
     */
    handleTouchMove(e) {
        e.preventDefault();
        if (!this.isDrawing) return;
        
        const cell = this.getCellFromEvent(e);
        
        if (this.lastTouchPos) {
            this.drawLine(this.lastTouchPos.x, this.lastTouchPos.y, cell.x, cell.y);
        }
        
        this.lastTouchPos = cell;
    }
    
    /**
     * Touch end handler
     */
    handleTouchEnd() {
        this.isDrawing = false;
        this.lastTouchPos = null;
    }
    
    /**
     * Draw at specific cell
     */
    drawAtCell(x, y, color) {
        if (!this.isValidCell(x, y)) return;
        
        switch (this.currentTool) {
            case 'pencil':
                this.setCell(x, y, color);
                break;
            case 'eraser':
                this.setCell(x, y, null);
                break;
            case 'fill':
                this.floodFill(x, y, color);
                break;
        }
        
        this.render();
    }
    
    /**
     * Draw line between two points (Bresenham's algorithm)
     */
    drawLine(x0, y0, x1, y1) {
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        
        while (true) {
            this.drawAtCell(x0, y0, this.currentColor);
            
            if (x0 === x1 && y0 === y1) break;
            
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    }
    
    /**
     * Set cell color
     */
    setCell(x, y, color) {
        if (!this.isValidCell(x, y)) return;
        this.grid[y][x] = color;
    }
    
    /**
     * Get cell color
     */
    getCell(x, y) {
        if (!this.isValidCell(x, y)) return undefined;
        return this.grid[y][x];
    }
    
    /**
     * Flood fill algorithm
     */
    floodFill(startX, startY, fillColor) {
        const targetColor = this.getCell(startX, startY);
        
        if (targetColor === fillColor) return;
        
        const stack = [{ x: startX, y: startY }];
        const visited = new Set();
        
        while (stack.length > 0) {
            const { x, y } = stack.pop();
            const key = `${x},${y}`;
            
            if (visited.has(key)) continue;
            if (!this.isValidCell(x, y)) continue;
            if (this.getCell(x, y) !== targetColor) continue;
            
            visited.add(key);
            this.setCell(x, y, fillColor);
            
            stack.push({ x: x + 1, y });
            stack.push({ x: x - 1, y });
            stack.push({ x, y: y + 1 });
            stack.push({ x, y: y - 1 });
        }
    }
    
    /**
     * Mirror pattern horizontally
     */
    mirrorHorizontal() {
        this.saveState();
        
        const halfWidth = Math.floor(this.gridWidth / 2);
        
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < halfWidth; x++) {
                const mirrorX = this.gridWidth - 1 - x;
                this.grid[y][mirrorX] = this.grid[y][x];
            }
        }
        
        this.render();
    }
    
    /**
     * Mirror pattern vertically
     */
    mirrorVertical() {
        this.saveState();
        
        const halfHeight = Math.floor(this.gridHeight / 2);
        
        for (let y = 0; y < halfHeight; y++) {
            const mirrorY = this.gridHeight - 1 - y;
            for (let x = 0; x < this.gridWidth; x++) {
                this.grid[mirrorY][x] = this.grid[y][x];
            }
        }
        
        this.render();
    }
    
    /**
     * Clear entire canvas
     */
    clear() {
        this.saveState();
        
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                this.grid[y][x] = null;
            }
        }
        
        this.render();
    }
    
    /**
     * Save current state for undo
     */
    saveState() {
        const state = JSON.stringify(this.grid);
        this.undoStack.push(state);
        
        if (this.undoStack.length > this.maxUndoSteps) {
            this.undoStack.shift();
        }
        
        this.redoStack = [];
    }
    
    /**
     * Undo last action
     */
    undo() {
        if (this.undoStack.length === 0) return false;
        
        this.redoStack.push(JSON.stringify(this.grid));
        
        const state = this.undoStack.pop();
        this.grid = JSON.parse(state);
        
        this.render();
        return true;
    }
    
    /**
     * Redo last undone action
     */
    redo() {
        if (this.redoStack.length === 0) return false;
        
        this.undoStack.push(JSON.stringify(this.grid));
        
        const state = this.redoStack.pop();
        this.grid = JSON.parse(state);
        
        this.render();
        return true;
    }
    
    /**
     * Set zoom level
     */
    setZoom(level) {
        this.zoom = Math.max(0.5, Math.min(3, level));
        this.resizeCanvas();
        this.render();
        return this.zoom;
    }
    
    /**
     * Zoom in
     */
    zoomIn() {
        return this.setZoom(this.zoom + 0.25);
    }
    
    /**
     * Zoom out
     */
    zoomOut() {
        return this.setZoom(this.zoom - 0.25);
    }
    
    /**
     * Toggle grid visibility
     */
    setShowGrid(show) {
        this.showGrid = show;
        this.render();
    }
    
    /**
     * Toggle mitten outline visibility
     */
    setShowMittenOutline(show) {
        this.showMittenOutline = show;
        this.render();
    }
    
    /**
     * Set current tool
     */
    setTool(tool) {
        this.currentTool = tool;
    }
    
    /**
     * Set primary color
     */
    setColor(color) {
        this.currentColor = color;
    }
    
    /**
     * Set secondary color (right-click)
     */
    setSecondaryColor(color) {
        this.secondaryColor = color;
    }
    
    /**
     * Update custom color
     */
    updateCustomColor(colorKey, hexValue) {
        this.colors[colorKey] = hexValue;
    }
    
    /**
     * Main render function
     */
    render() {
        const ctx = this.ctx;
        const cellSize = this.cellSize * this.zoom;
        
        // Clear canvas with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw cells
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const color = this.grid[y][x];
                
                if (color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(
                        x * cellSize,
                        y * cellSize,
                        cellSize,
                        cellSize
                    );
                }
            }
        }
        
        // Draw grid lines (underneath outline)
        if (this.showGrid) {
            this.drawGrid();
        }
        
        // Draw mitten outline (on top)
        if (this.showMittenOutline && this.mittenOutline) {
            this.drawMittenOutline();
        }
    }
    
    /**
     * Draw grid lines
     */
    drawGrid() {
        const ctx = this.ctx;
        const cellSize = this.cellSize * this.zoom;
        
        ctx.strokeStyle = '#DDDDDD';
        ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (let x = 0; x <= this.gridWidth; x++) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize, 0);
            ctx.lineTo(x * cellSize, this.canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.gridHeight; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * cellSize);
            ctx.lineTo(this.canvas.width, y * cellSize);
            ctx.stroke();
        }
        
        // Draw major grid lines every 10 cells
        ctx.strokeStyle = '#BBBBBB';
        ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.gridWidth; x += 10) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize, 0);
            ctx.lineTo(x * cellSize, this.canvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y <= this.gridHeight; y += 10) {
            ctx.beginPath();
            ctx.moveTo(0, y * cellSize);
            ctx.lineTo(this.canvas.width, y * cellSize);
            ctx.stroke();
        }
    }
    
    /**
     * Draw mitten outline overlay
     */
    drawMittenOutline() {
        const ctx = this.ctx;
        const cellSize = this.cellSize * this.zoom;
        
        // Set outline style - red/coral color like in the book
        ctx.strokeStyle = '#CD5C5C';  // Indian red, similar to book
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Draw all outline lines
        if (this.mittenOutline.lines) {
            ctx.beginPath();
            this.mittenOutline.lines.forEach(line => {
                ctx.moveTo(line.x1 * cellSize, line.y1 * cellSize);
                ctx.lineTo(line.x2 * cellSize, line.y2 * cellSize);
            });
            ctx.stroke();
        }
        
        // Draw section markers (M labels)
        if (this.mittenOutline.markers) {
            ctx.fillStyle = '#CD5C5C';
            ctx.font = `bold ${Math.max(10, cellSize * 0.8)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            this.mittenOutline.markers.forEach(marker => {
                ctx.fillText(marker.label, marker.x * cellSize, marker.y * cellSize);
            });
        }
    }
    
    /**
     * Export pattern as PNG data URL
     */
    exportAsPNG(scale = 2) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        const cellSize = this.cellSize * scale;
        tempCanvas.width = this.gridWidth * cellSize;
        tempCanvas.height = this.gridHeight * cellSize;
        
        // White background
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw cells
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const color = this.grid[y][x];
                
                if (color) {
                    tempCtx.fillStyle = color;
                    tempCtx.fillRect(
                        x * cellSize,
                        y * cellSize,
                        cellSize,
                        cellSize
                    );
                }
            }
        }
        
        // Draw grid
        tempCtx.strokeStyle = '#CCCCCC';
        tempCtx.lineWidth = 1;
        
        for (let x = 0; x <= this.gridWidth; x++) {
            tempCtx.beginPath();
            tempCtx.moveTo(x * cellSize, 0);
            tempCtx.lineTo(x * cellSize, tempCanvas.height);
            tempCtx.stroke();
        }
        
        for (let y = 0; y <= this.gridHeight; y++) {
            tempCtx.beginPath();
            tempCtx.moveTo(0, y * cellSize);
            tempCtx.lineTo(tempCanvas.width, y * cellSize);
            tempCtx.stroke();
        }
        
        // Draw mitten outline on export
        if (this.showMittenOutline && this.mittenOutline && this.mittenOutline.lines) {
            tempCtx.strokeStyle = '#CD5C5C';
            tempCtx.lineWidth = 2 * scale;
            tempCtx.lineCap = 'round';
            tempCtx.lineJoin = 'round';
            
            tempCtx.beginPath();
            this.mittenOutline.lines.forEach(line => {
                tempCtx.moveTo(line.x1 * cellSize, line.y1 * cellSize);
                tempCtx.lineTo(line.x2 * cellSize, line.y2 * cellSize);
            });
            tempCtx.stroke();
            
            // Draw markers
            if (this.mittenOutline.markers) {
                tempCtx.fillStyle = '#CD5C5C';
                tempCtx.font = `bold ${cellSize * 0.8}px sans-serif`;
                tempCtx.textAlign = 'center';
                tempCtx.textBaseline = 'middle';
                
                this.mittenOutline.markers.forEach(marker => {
                    tempCtx.fillText(marker.label, marker.x * cellSize, marker.y * cellSize);
                });
            }
        }
        
        return tempCanvas.toDataURL('image/png');
    }
    
    /**
     * Export pattern as thumbnail
     */
    exportAsThumbnail(maxSize = 100) {
        const aspectRatio = this.gridWidth / this.gridHeight;
        let width, height;
        
        if (aspectRatio > 1) {
            width = maxSize;
            height = maxSize / aspectRatio;
        } else {
            height = maxSize;
            width = maxSize * aspectRatio;
        }
        
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = width;
        tempCanvas.height = height;
        
        const cellWidth = width / this.gridWidth;
        const cellHeight = height / this.gridHeight;
        
        // White background
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, width, height);
        
        // Draw cells
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const color = this.grid[y][x];
                
                if (color) {
                    tempCtx.fillStyle = color;
                    tempCtx.fillRect(
                        x * cellWidth,
                        y * cellHeight,
                        Math.ceil(cellWidth),
                        Math.ceil(cellHeight)
                    );
                }
            }
        }
        
        return tempCanvas.toDataURL('image/png');
    }
    
    /**
     * Get pattern data for saving
     */
    getPatternData() {
        return {
            grid: this.grid,
            gridWidth: this.gridWidth,
            gridHeight: this.gridHeight,
            currentSize: this.currentSize,
            colors: this.colors
        };
    }
    
    /**
     * Load pattern data
     */
    loadPatternData(data) {
        this.saveState();
        
        // If pattern has a size, load that template first
        if (data.currentSize) {
            this.loadSizeTemplate(data.currentSize);
        } else {
            // Fallback to grid dimensions
            this.gridWidth = data.gridWidth || 60;
            this.gridHeight = data.gridHeight || 80;
            this.initializeGrid();
        }
        
        // Load the grid data
        if (data.grid) {
            for (let y = 0; y < Math.min(data.grid.length, this.gridHeight); y++) {
                for (let x = 0; x < Math.min(data.grid[y].length, this.gridWidth); x++) {
                    this.grid[y][x] = data.grid[y][x];
                }
            }
        }
        
        if (data.colors) {
            this.colors = { ...this.colors, ...data.colors };
        }
        
        this.resizeCanvas();
        this.render();
    }
}

// Export for use in other modules
window.CanvasDrawing = CanvasDrawing;
