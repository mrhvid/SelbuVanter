/**
 * VanteTegner - Canvas Drawing Module
 * Handles all canvas drawing operations, touch/mouse input, and grid management
 */

class CanvasDrawing {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Grid configuration
        this.cellSize = 16;
        this.gridWidth = 48;  // Default medium size
        this.gridHeight = 60;
        
        // Pattern sections (based on Drops diagrams)
        this.sections = {
            m1: { start: 0, width: 12 },      // Border pattern
            m2: { start: 12, width: 5 },      // Small separator
            m3: { start: 17, width: 19 },     // Main pattern (top)
            m4: { start: 36, width: 12 }      // Cuff pattern
        };
        
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
        
        // Initialize
        this.initializeGrid();
        this.setupEventListeners();
        this.render();
    }
    
    /**
     * Initialize empty grid based on current dimensions
     */
    initializeGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                this.grid[y][x] = null; // null = empty/transparent
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
        
        // Apply crisp pixel rendering
        this.ctx.imageSmoothingEnabled = false;
    }
    
    /**
     * Set mitten size template
     */
    setSize(size) {
        const sizes = {
            small: {
                gridWidth: 44,
                sections: {
                    m1: { start: 0, width: 11 },
                    m2: { start: 11, width: 5 },
                    m3: { start: 16, width: 17 },
                    m4: { start: 33, width: 11 }
                }
            },
            medium: {
                gridWidth: 48,
                sections: {
                    m1: { start: 0, width: 12 },
                    m2: { start: 12, width: 5 },
                    m3: { start: 17, width: 19 },
                    m4: { start: 36, width: 12 }
                }
            },
            large: {
                gridWidth: 52,
                sections: {
                    m1: { start: 0, width: 13 },
                    m2: { start: 13, width: 5 },
                    m3: { start: 18, width: 21 },
                    m4: { start: 39, width: 13 }
                }
            }
        };
        
        const config = sizes[size] || sizes.medium;
        
        // Save current pattern state
        this.saveState();
        
        // Update dimensions
        this.gridWidth = config.gridWidth;
        this.sections = config.sections;
        
        // Resize grid (try to preserve existing pattern)
        const oldGrid = this.grid;
        this.grid = [];
        
        for (let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                // Preserve existing cells where possible
                if (oldGrid[y] && oldGrid[y][x] !== undefined) {
                    this.grid[y][x] = oldGrid[y][x];
                } else {
                    this.grid[y][x] = null;
                }
            }
        }
        
        this.resizeCanvas();
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
        
        // Draw line from last position for smooth strokes
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
        
        // Don't fill if target color is same as fill color
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
            
            // Add neighbors
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
        
        // Limit undo stack size
        if (this.undoStack.length > this.maxUndoSteps) {
            this.undoStack.shift();
        }
        
        // Clear redo stack on new action
        this.redoStack = [];
    }
    
    /**
     * Undo last action
     */
    undo() {
        if (this.undoStack.length === 0) return false;
        
        // Save current state to redo stack
        this.redoStack.push(JSON.stringify(this.grid));
        
        // Restore previous state
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
        
        // Save current state to undo stack
        this.undoStack.push(JSON.stringify(this.grid));
        
        // Restore redo state
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
        
        // Clear canvas
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
        
        // Draw grid lines
        if (this.showGrid) {
            this.drawGrid();
        }
        
        // Draw section dividers
        this.drawSectionDividers();
    }
    
    /**
     * Draw grid lines
     */
    drawGrid() {
        const ctx = this.ctx;
        const cellSize = this.cellSize * this.zoom;
        
        ctx.strokeStyle = '#CCCCCC';
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
        
        // Draw major grid lines every 5 cells
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.gridWidth; x += 5) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize, 0);
            ctx.lineTo(x * cellSize, this.canvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y <= this.gridHeight; y += 5) {
            ctx.beginPath();
            ctx.moveTo(0, y * cellSize);
            ctx.lineTo(this.canvas.width, y * cellSize);
            ctx.stroke();
        }
    }
    
    /**
     * Draw section dividers based on mitten template
     */
    drawSectionDividers() {
        const ctx = this.ctx;
        const cellSize = this.cellSize * this.zoom;
        
        ctx.strokeStyle = '#2c5545';
        ctx.lineWidth = 2;
        
        // Draw vertical dividers between sections
        Object.values(this.sections).forEach(section => {
            const x = section.start * cellSize;
            
            if (section.start > 0) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, this.canvas.height);
                ctx.stroke();
            }
        });
    }
    
    /**
     * Export pattern as PNG data URL
     */
    exportAsPNG(scale = 2) {
        // Create temporary canvas at higher resolution
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
            sections: this.sections,
            colors: this.colors
        };
    }
    
    /**
     * Load pattern data
     */
    loadPatternData(data) {
        this.saveState();
        
        this.gridWidth = data.gridWidth || 48;
        this.gridHeight = data.gridHeight || 60;
        this.sections = data.sections || this.sections;
        this.grid = data.grid || [];
        
        if (data.colors) {
            this.colors = { ...this.colors, ...data.colors };
        }
        
        this.resizeCanvas();
        this.render();
    }
}

// Export for use in other modules
window.CanvasDrawing = CanvasDrawing;
