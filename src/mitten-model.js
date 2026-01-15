// Mitten model scaffold
// Exports a simple MittenModel with region support and mirror API.
// This is a scaffold: implementer should expand methods and add tests.

class Region {
  constructor(id, name, x, y, width, height, mirroredFrom = null) {
    // Mitten model scaffold
    // Exports a simple MittenModel with region support and mirror API.
    // This file provides a small but usable model with event hooks.

    class Region {
      constructor(id, name, x, y, width, height, mirroredFrom = null) {
        this.id = id;
        this.name = name;
        this.origin = { x, y };
        this.width = width;
        this.height = height;
        this.mirroredFrom = mirroredFrom; // id of region this mirrors
        this.cells = Array.from({ length: height }, () => Array(width).fill(null));
      }

      setCell(x, y, value) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        this.cells[y][x] = value;
      }

      getCell(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
        return this.cells[y][x];
      }
    }

    class MittenModel {
      constructor(width = 48, height = 100, dpi = 300, gap = 2) {
        this.version = '1.0.0';
        this.metadata = {};
        this.canvas = { width, height, dpi, gap };
        this.regions = {};

        // Event listeners map: event -> Set of callbacks
        this._listeners = new Map();
      }

      // Events: on/off/emit
      on(event, cb) {
        if (!this._listeners.has(event)) this._listeners.set(event, new Set());
        this._listeners.get(event).add(cb);
      }
      off(event, cb) {
        if (!this._listeners.has(event)) return;
        this._listeners.get(event).delete(cb);
      }
      _emit(event, payload) {
        if (!this._listeners.has(event)) return;
        for (const cb of this._listeners.get(event)) {
          try { cb(payload); } catch (e) { console.error('MittenModel listener error', e); }
        }
      }

      addRegion(id, name, x, y, w, h, mirroredFrom = null) {
        this.regions[id] = new Region(id, name, x, y, w, h, mirroredFrom);
        this._emit('regionAdded', this.regions[id]);
        return this.regions[id];
      }

      getRegion(id) { return this.regions[id] || null; }

      setRegionCell(regionId, x, y, value) {
        const r = this.getRegion(regionId);
        if (!r) return false;
        r.setCell(x, y, value);
        this._emit('regionCellChanged', { regionId, x, y, value });
        return true;
      }
      getRegionCell(regionId, x, y) {
        const r = this.getRegion(regionId);
        if (!r) return null;
        return r.getCell(x, y);
      }

      mirrorRegion(targetId, sourceId) {
        const src = this.getRegion(sourceId);
        const tgt = this.getRegion(targetId);
        if (!src || !tgt) return;
        for (let y = 0; y < Math.min(src.height, tgt.height); y++) {
          for (let x = 0; x < Math.min(src.width, tgt.width); x++) {
            const val = src.getCell(src.width - 1 - x, y);
            tgt.setCell(x, y, val);
          }
        }
        tgt.mirroredFrom = sourceId;
        this._emit('regionMirrored', { targetId, sourceId });
      }

      serialize() {
        const regions = {};
        for (const k of Object.keys(this.regions)) {
          const r = this.regions[k];
          regions[k] = {
            id: r.id,
            name: r.name,
            origin: r.origin,
            width: r.width,
            height: r.height,
            mirroredFrom: r.mirroredFrom,
            cells: r.cells
          };
        }
        return {
          version: this.version,
          metadata: this.metadata,
          canvas: this.canvas,
          regions
        };
      }

      static deserialize(obj) {
        const m = new MittenModel(obj.canvas.width, obj.canvas.height, obj.canvas.dpi, obj.canvas.gap);
        m.version = obj.version || '1.0.0';
        m.metadata = obj.metadata || {};
        for (const k of Object.keys(obj.regions || {})) {
          const r = obj.regions[k];
          const reg = m.addRegion(r.id, r.name, r.origin.x, r.origin.y, r.width, r.height, r.mirroredFrom);
          reg.cells = r.cells || reg.cells;
        }
        return m;
      }
    }

    // Expose for browser and CommonJS
    try { module.exports = { MittenModel, Region }; } catch (e) {}
    if (typeof window !== 'undefined') {
      window.MittenModel = MittenModel;
      window.Region = Region;
    }
