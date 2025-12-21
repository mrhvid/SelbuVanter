/**
 * VanteTegner - Pattern Manager Module
 * Handles saving, loading, and exporting patterns using localStorage and IndexedDB
 */

class PatternManager {
    constructor() {
        this.dbName = 'VanteTegnerDB';
        this.dbVersion = 1;
        this.storeName = 'patterns';
        this.db = null;
        
        // Initialize IndexedDB
        this.initDB();
    }
    
    /**
     * Initialize IndexedDB
     */
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => {
                console.error('IndexedDB error:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                console.log('IndexedDB initialized');
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create patterns store
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    
                    // Create indexes
                    store.createIndex('name', 'name', { unique: false });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                    store.createIndex('updatedAt', 'updatedAt', { unique: false });
                }
            };
        });
    }
    
    /**
     * Ensure DB is ready
     */
    async ensureDB() {
        if (!this.db) {
            await this.initDB();
        }
        return this.db;
    }
    
    /**
     * Save pattern to IndexedDB
     */
    async savePattern(name, patternData, thumbnail) {
        await this.ensureDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            const pattern = {
                name: name,
                data: patternData,
                thumbnail: thumbnail,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            const request = store.add(pattern);
            
            request.onsuccess = () => {
                pattern.id = request.result;
                resolve(pattern);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    /**
     * Update existing pattern
     */
    async updatePattern(id, name, patternData, thumbnail) {
        await this.ensureDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            // First get the existing pattern
            const getRequest = store.get(id);
            
            getRequest.onsuccess = () => {
                const pattern = getRequest.result;
                
                if (!pattern) {
                    reject(new Error('Pattern not found'));
                    return;
                }
                
                pattern.name = name;
                pattern.data = patternData;
                pattern.thumbnail = thumbnail;
                pattern.updatedAt = new Date().toISOString();
                
                const updateRequest = store.put(pattern);
                
                updateRequest.onsuccess = () => {
                    resolve(pattern);
                };
                
                updateRequest.onerror = () => {
                    reject(updateRequest.error);
                };
            };
            
            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        });
    }
    
    /**
     * Get all patterns
     */
    async getAllPatterns() {
        await this.ensureDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('updatedAt');
            
            const patterns = [];
            const request = index.openCursor(null, 'prev'); // Sort by newest first
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                
                if (cursor) {
                    patterns.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(patterns);
                }
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    /**
     * Get single pattern by ID
     */
    async getPattern(id) {
        await this.ensureDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    /**
     * Delete pattern
     */
    async deletePattern(id) {
        await this.ensureDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => {
                resolve(true);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    /**
     * Save current pattern to localStorage (auto-save)
     */
    saveToLocalStorage(patternData) {
        try {
            localStorage.setItem('vantetegner_current', JSON.stringify(patternData));
            localStorage.setItem('vantetegner_lastSaved', new Date().toISOString());
            return true;
        } catch (e) {
            console.error('LocalStorage save error:', e);
            return false;
        }
    }
    
    /**
     * Load current pattern from localStorage
     */
    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem('vantetegner_current');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('LocalStorage load error:', e);
            return null;
        }
    }
    
    /**
     * Save app settings
     */
    saveSettings(settings) {
        try {
            localStorage.setItem('vantetegner_settings', JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('Settings save error:', e);
            return false;
        }
    }
    
    /**
     * Load app settings
     */
    loadSettings() {
        try {
            const data = localStorage.getItem('vantetegner_settings');
            return data ? JSON.parse(data) : this.getDefaultSettings();
        } catch (e) {
            console.error('Settings load error:', e);
            return this.getDefaultSettings();
        }
    }
    
    /**
     * Get default settings
     */
    getDefaultSettings() {
        return {
            size: 'medium',
            showGrid: true,
            showMirror: false,
            zoom: 1,
            customColor1: '#8B0000',
            customColor2: '#1E4D6B',
            lastTool: 'pencil',
            lastColor: 'natural'
        };
    }
    
    /**
     * Export pattern as PNG file
     */
    exportAsPNG(dataUrl, filename = 'selbu-monster') {
        const link = document.createElement('a');
        link.download = `${filename}-${this.getTimestamp()}.png`;
        link.href = dataUrl;
        link.click();
    }
    
    /**
     * Export pattern as JSON file
     */
    exportAsJSON(patternData, filename = 'selbu-monster') {
        const json = JSON.stringify(patternData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = `${filename}-${this.getTimestamp()}.json`;
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    /**
     * Import pattern from JSON file
     */
    async importFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate pattern data
                    if (!data.grid || !Array.isArray(data.grid)) {
                        throw new Error('Invalid pattern format');
                    }
                    
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }
    
    /**
     * Generate timestamp string for filenames
     */
    getTimestamp() {
        const now = new Date();
        return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    }
    
    /**
     * Format date for display
     */
    formatDate(isoString) {
        const date = new Date(isoString);
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('da-DK', options);
    }
    
    /**
     * Clear all data (for testing/reset)
     */
    async clearAllData() {
        await this.ensureDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();
            
            request.onsuccess = () => {
                localStorage.removeItem('vantetegner_current');
                localStorage.removeItem('vantetegner_settings');
                localStorage.removeItem('vantetegner_lastSaved');
                resolve(true);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
}

// Export for use in other modules
window.PatternManager = PatternManager;
