/**
 * VanteTegner - Main Application
 * Coordinates all modules and handles UI interactions
 */

class VanteTegnerApp {
    constructor() {
        // Initialize modules
        this.canvas = new CanvasDrawing('mainCanvas');
        this.patternManager = new PatternManager();
        
        // UI State
        this.currentSize = 'medium';
        this.currentColor = 'natural';
        this.currentTool = 'pencil';
        this.isPanelVisible = window.innerWidth >= 768;
        
        // Auto-save timer
        this.autoSaveTimer = null;
        this.autoSaveInterval = 30000; // 30 seconds
        
        // Initialize
        this.loadSettings();
        this.setupEventListeners();
        this.loadCurrentPattern();
        this.updateUI();
        this.startAutoSave();
        
        console.log('VanteTegner initialized');
    }
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => {
            this.togglePanel();
        });
        
        // Size selector
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setSize(e.target.dataset.size);
            });
        });
        
        // Color palette
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setColor(e.currentTarget.dataset.color);
            });
        });
        
        // Bottom toolbar colors
        document.querySelectorAll('.toolbar-btn[data-color]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setColor(e.currentTarget.dataset.color);
            });
        });
        
        // Custom colors
        document.getElementById('customColor1').addEventListener('input', (e) => {
            this.updateCustomColor('accent1', e.target.value);
        });
        
        document.getElementById('customColor2').addEventListener('input', (e) => {
            this.updateCustomColor('accent2', e.target.value);
        });
        
        // Tools
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setTool(e.currentTarget.dataset.tool);
            });
        });
        
        // Bottom toolbar tools
        document.querySelectorAll('.toolbar-btn[data-tool]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setTool(e.currentTarget.dataset.tool);
            });
        });
        
        // View controls
        document.getElementById('showGrid').addEventListener('change', (e) => {
            this.canvas.setShowGrid(e.target.checked);
            this.saveSettings();
        });
        
        document.getElementById('showMirror').addEventListener('change', (e) => {
            this.toggleMirrorPreview(e.target.checked);
            this.saveSettings();
        });
        
        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => {
            this.zoomIn();
        });
        
        document.getElementById('zoomOut').addEventListener('click', () => {
            this.zoomOut();
        });
        
        // Action buttons
        document.getElementById('clearCanvas').addEventListener('click', () => {
            this.confirmClear();
        });
        
        document.getElementById('exportPng').addEventListener('click', () => {
            this.exportPNG();
        });
        
        document.getElementById('loadPattern').addEventListener('click', () => {
            this.showLoadDialog();
        });
        
        // Header buttons
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undo();
        });
        
        document.getElementById('redoBtn').addEventListener('click', () => {
            this.redo();
        });
        
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.showSaveDialog();
        });
        
        // Save dialog
        document.getElementById('saveForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePattern();
        });
        
        document.getElementById('cancelSave').addEventListener('click', () => {
            document.getElementById('saveDialog').close();
        });
        
        // Load dialog
        document.getElementById('cancelLoad').addEventListener('click', () => {
            document.getElementById('loadDialog').close();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Before unload - save current work
        window.addEventListener('beforeunload', () => {
            this.saveCurrentPattern();
        });
        
        // Panel overlay click
        this.createPanelOverlay();
    }
    
    /**
     * Create panel overlay for mobile
     */
    createPanelOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'panel-overlay';
        overlay.id = 'panelOverlay';
        overlay.addEventListener('click', () => {
            this.togglePanel(false);
        });
        document.getElementById('app').appendChild(overlay);
    }
    
    /**
     * Toggle side panel
     */
    togglePanel(show = null) {
        const panel = document.getElementById('sidePanel');
        const overlay = document.getElementById('panelOverlay');
        
        if (show === null) {
            show = !this.isPanelVisible;
        }
        
        this.isPanelVisible = show;
        
        if (window.innerWidth < 768) {
            panel.classList.toggle('visible', show);
            overlay.classList.toggle('visible', show);
        }
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        if (window.innerWidth >= 768) {
            document.getElementById('sidePanel').classList.remove('hidden');
            document.getElementById('panelOverlay').classList.remove('visible');
        }
    }
    
    /**
     * Set mitten size
     */
    setSize(size) {
        this.currentSize = size;
        this.canvas.setSize(size);
        
        // Update UI
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === size);
        });
        
        this.saveSettings();
        this.showToast(`Størrelse ændret til ${size.toUpperCase()}`);
    }
    
    /**
     * Set current color
     */
    setColor(colorKey) {
        this.currentColor = colorKey;
        
        const colorMap = {
            natural: '#F5F5DC',
            darkgray: '#2F4F4F',
            accent1: document.getElementById('customColor1').value,
            accent2: document.getElementById('customColor2').value
        };
        
        this.canvas.setColor(colorMap[colorKey]);
        
        // Also set secondary color for right-click
        if (colorKey === 'natural') {
            this.canvas.setSecondaryColor(colorMap.darkgray);
        } else {
            this.canvas.setSecondaryColor(colorMap.natural);
        }
        
        // Update UI
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.color === colorKey);
        });
        
        document.querySelectorAll('.toolbar-btn[data-color]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.color === colorKey);
        });
        
        // Switch back to pencil tool when selecting color
        if (this.currentTool === 'eraser') {
            this.setTool('pencil');
        }
        
        this.saveSettings();
    }
    
    /**
     * Update custom color
     */
    updateCustomColor(colorKey, hexValue) {
        this.canvas.updateCustomColor(colorKey, hexValue);
        
        // Update button color
        const btn = document.querySelector(`.color-btn[data-color="${colorKey}"]`);
        if (btn) {
            btn.style.backgroundColor = hexValue;
        }
        
        // Update bottom toolbar button
        const toolbarBtn = document.querySelector(`.toolbar-btn[data-color="${colorKey}"]`);
        if (toolbarBtn) {
            toolbarBtn.style.setProperty('--btn-color', hexValue);
        }
        
        // If this color is currently selected, update canvas
        if (this.currentColor === colorKey) {
            this.canvas.setColor(hexValue);
        }
        
        this.saveSettings();
    }
    
    /**
     * Set current tool
     */
    setTool(tool) {
        this.currentTool = tool;
        
        if (tool === 'mirror') {
            this.canvas.mirrorHorizontal();
            this.showToast('Mønster spejlet');
            return;
        }
        
        this.canvas.setTool(tool);
        
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });
        
        document.querySelectorAll('.toolbar-btn[data-tool]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });
        
        this.saveSettings();
    }
    
    /**
     * Zoom in
     */
    zoomIn() {
        const newZoom = this.canvas.zoomIn();
        this.updateZoomDisplay(newZoom);
        this.saveSettings();
    }
    
    /**
     * Zoom out
     */
    zoomOut() {
        const newZoom = this.canvas.zoomOut();
        this.updateZoomDisplay(newZoom);
        this.saveSettings();
    }
    
    /**
     * Update zoom display
     */
    updateZoomDisplay(zoom) {
        document.getElementById('zoomLevel').textContent = `${Math.round(zoom * 100)}%`;
    }
    
    /**
     * Toggle mirror preview
     */
    toggleMirrorPreview(show) {
        const previewCanvas = document.getElementById('previewCanvas');
        previewCanvas.classList.toggle('visible', show);
        
        if (show) {
            this.updateMirrorPreview();
        }
    }
    
    /**
     * Update mirror preview canvas
     */
    updateMirrorPreview() {
        // TODO: Implement mirrored preview
    }
    
    /**
     * Confirm and clear canvas
     */
    confirmClear() {
        if (confirm('Er du sikker på at du vil slette hele mønsteret?')) {
            this.canvas.clear();
            this.showToast('Mønster ryddet');
        }
    }
    
    /**
     * Export as PNG
     */
    exportPNG() {
        const dataUrl = this.canvas.exportAsPNG(2);
        this.patternManager.exportAsPNG(dataUrl, 'selbu-vante');
        this.showToast('PNG eksporteret');
    }
    
    /**
     * Undo
     */
    undo() {
        if (this.canvas.undo()) {
            this.showToast('Fortrudt');
        }
    }
    
    /**
     * Redo
     */
    redo() {
        if (this.canvas.redo()) {
            this.showToast('Gendannet');
        }
    }
    
    /**
     * Show save dialog
     */
    showSaveDialog() {
        const dialog = document.getElementById('saveDialog');
        document.getElementById('patternName').value = '';
        dialog.showModal();
    }
    
    /**
     * Save pattern
     */
    async savePattern() {
        const name = document.getElementById('patternName').value.trim();
        
        if (!name) {
            this.showToast('Indtast et navn', 'error');
            return;
        }
        
        try {
            const patternData = this.canvas.getPatternData();
            const thumbnail = this.canvas.exportAsThumbnail(100);
            
            await this.patternManager.savePattern(name, patternData, thumbnail);
            
            document.getElementById('saveDialog').close();
            this.showToast('Mønster gemt!', 'success');
            this.updatePatternLibrary();
        } catch (error) {
            console.error('Save error:', error);
            this.showToast('Kunne ikke gemme', 'error');
        }
    }
    
    /**
     * Show load dialog
     */
    async showLoadDialog() {
        const dialog = document.getElementById('loadDialog');
        const listContainer = document.getElementById('loadPatternList');
        
        try {
            const patterns = await this.patternManager.getAllPatterns();
            
            if (patterns.length === 0) {
                listContainer.innerHTML = '<p class="empty-state">Ingen gemte mønstre</p>';
            } else {
                listContainer.innerHTML = patterns.map(pattern => `
                    <div class="pattern-list-item" data-id="${pattern.id}">
                        <img src="${pattern.thumbnail}" alt="${pattern.name}">
                        <div class="info">
                            <h4>${pattern.name}</h4>
                            <span>${this.patternManager.formatDate(pattern.updatedAt)}</span>
                        </div>
                        <div class="actions">
                            <button class="btn-primary load-btn" data-id="${pattern.id}">Indlæs</button>
                            <button class="btn-secondary delete-btn" data-id="${pattern.id}">Slet</button>
                        </div>
                    </div>
                `).join('');
                
                // Add event listeners
                listContainer.querySelectorAll('.load-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.loadPattern(parseInt(btn.dataset.id));
                    });
                });
                
                listContainer.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.deletePattern(parseInt(btn.dataset.id));
                    });
                });
            }
            
            dialog.showModal();
        } catch (error) {
            console.error('Load dialog error:', error);
            this.showToast('Kunne ikke indlæse mønstre', 'error');
        }
    }
    
    /**
     * Load pattern
     */
    async loadPattern(id) {
        try {
            const pattern = await this.patternManager.getPattern(id);
            
            if (pattern) {
                this.canvas.loadPatternData(pattern.data);
                document.getElementById('loadDialog').close();
                this.showToast(`Indlæst: ${pattern.name}`, 'success');
            }
        } catch (error) {
            console.error('Load pattern error:', error);
            this.showToast('Kunne ikke indlæse mønster', 'error');
        }
    }
    
    /**
     * Delete pattern
     */
    async deletePattern(id) {
        if (!confirm('Vil du slette dette mønster?')) {
            return;
        }
        
        try {
            await this.patternManager.deletePattern(id);
            this.showToast('Mønster slettet');
            this.showLoadDialog(); // Refresh list
            this.updatePatternLibrary();
        } catch (error) {
            console.error('Delete pattern error:', error);
            this.showToast('Kunne ikke slette', 'error');
        }
    }
    
    /**
     * Update pattern library in sidebar
     */
    async updatePatternLibrary() {
        const container = document.getElementById('patternLibrary');
        
        try {
            const patterns = await this.patternManager.getAllPatterns();
            
            if (patterns.length === 0) {
                container.innerHTML = '<p class="empty-state">Ingen gemte mønstre</p>';
            } else {
                // Show only first 5 patterns
                const displayPatterns = patterns.slice(0, 5);
                
                container.innerHTML = displayPatterns.map(pattern => `
                    <div class="pattern-item" data-id="${pattern.id}">
                        <img class="pattern-thumb" src="${pattern.thumbnail}" alt="${pattern.name}">
                        <div class="pattern-info">
                            <h4>${pattern.name}</h4>
                            <span>${this.patternManager.formatDate(pattern.updatedAt)}</span>
                        </div>
                    </div>
                `).join('');
                
                // Add click listeners
                container.querySelectorAll('.pattern-item').forEach(item => {
                    item.addEventListener('click', () => {
                        this.loadPattern(parseInt(item.dataset.id));
                    });
                });
            }
        } catch (error) {
            console.error('Update library error:', error);
        }
    }
    
    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(e) {
        // Don't handle if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Ctrl/Cmd + key combinations
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
                    break;
                case 'y':
                    e.preventDefault();
                    this.redo();
                    break;
                case 's':
                    e.preventDefault();
                    this.showSaveDialog();
                    break;
            }
            return;
        }
        
        // Single key shortcuts
        switch (e.key.toLowerCase()) {
            case 'w':
                this.setColor('natural');
                break;
            case 'g':
                this.setColor('darkgray');
                break;
            case 'r':
                this.setColor('accent1');
                break;
            case 'b':
                this.setColor('accent2');
                break;
            case 'p':
                this.setTool('pencil');
                break;
            case 'e':
                this.setTool('eraser');
                break;
            case 'f':
                this.setTool('fill');
                break;
            case 'm':
                this.setTool('mirror');
                break;
            case '+':
            case '=':
                this.zoomIn();
                break;
            case '-':
                this.zoomOut();
                break;
        }
    }
    
    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    /**
     * Save current pattern to localStorage
     */
    saveCurrentPattern() {
        const patternData = this.canvas.getPatternData();
        this.patternManager.saveToLocalStorage(patternData);
    }
    
    /**
     * Load current pattern from localStorage
     */
    loadCurrentPattern() {
        const patternData = this.patternManager.loadFromLocalStorage();
        
        if (patternData) {
            this.canvas.loadPatternData(patternData);
        }
    }
    
    /**
     * Save app settings
     */
    saveSettings() {
        const settings = {
            size: this.currentSize,
            showGrid: document.getElementById('showGrid').checked,
            showMirror: document.getElementById('showMirror').checked,
            zoom: this.canvas.zoom,
            customColor1: document.getElementById('customColor1').value,
            customColor2: document.getElementById('customColor2').value,
            lastTool: this.currentTool,
            lastColor: this.currentColor
        };
        
        this.patternManager.saveSettings(settings);
    }
    
    /**
     * Load app settings
     */
    loadSettings() {
        const settings = this.patternManager.loadSettings();
        
        this.currentSize = settings.size;
        this.currentColor = settings.lastColor;
        this.currentTool = settings.lastTool;
        
        // Apply settings
        document.getElementById('showGrid').checked = settings.showGrid;
        document.getElementById('showMirror').checked = settings.showMirror;
        document.getElementById('customColor1').value = settings.customColor1;
        document.getElementById('customColor2').value = settings.customColor2;
        
        this.canvas.setShowGrid(settings.showGrid);
        this.canvas.setZoom(settings.zoom);
        this.updateZoomDisplay(settings.zoom);
        
        // Update custom colors
        this.updateCustomColor('accent1', settings.customColor1);
        this.updateCustomColor('accent2', settings.customColor2);
    }
    
    /**
     * Update UI to match current state
     */
    updateUI() {
        // Size buttons
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === this.currentSize);
        });
        
        // Color buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.color === this.currentColor);
        });
        
        document.querySelectorAll('.toolbar-btn[data-color]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.color === this.currentColor);
        });
        
        // Tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === this.currentTool);
        });
        
        // Set canvas size
        this.canvas.setSize(this.currentSize);
        
        // Update pattern library
        this.updatePatternLibrary();
    }
    
    /**
     * Start auto-save timer
     */
    startAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            this.saveCurrentPattern();
        }, this.autoSaveInterval);
    }
    
    /**
     * Stop auto-save timer
     */
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VanteTegnerApp();
});
