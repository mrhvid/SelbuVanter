/* Persistence helpers for VanteTegner
 * - LocalStorageAdapter: simple save/load under a key
 * - FileAdapter: export/import JSON files
 */

class LocalStorageAdapter {
  constructor(key = 'vantetegner_models'){
    this.key = key;
  }

  save(id, obj){
    try{
      const all = this._readAll();
      all[id] = obj;
      localStorage.setItem(this.key, JSON.stringify(all));
      return true;
    }catch(e){
      console.error('LocalStorageAdapter save error', e);
      return false;
    }
  }

  load(id){
    try{
      const all = this._readAll();
      return all[id] || null;
    }catch(e){
      console.error('LocalStorageAdapter load error', e);
      return null;
    }
  }

  list(){
    try{
      const all = this._readAll();
      return Object.keys(all).map(k=>({ id: k, metadata: all[k].metadata }));
    }catch(e){
      return [];
    }
  }

  _readAll(){
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : {};
  }
}

class FileAdapter {
  static exportJSON(obj, filename = 'vantetegner-pattern'){
    const json = JSON.stringify(obj, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static importJSON(file){
    return new Promise((resolve,reject)=>{
      const reader = new FileReader();
      reader.onload = (e)=>{
        try{
          const obj = JSON.parse(e.target.result);
          resolve(obj);
        }catch(err){ reject(err); }
      };
      reader.onerror = ()=>reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}

// expose
if (typeof window !== 'undefined'){
  window.LocalStorageAdapter = LocalStorageAdapter;
  window.FileAdapter = FileAdapter;
}

try { module.exports = { LocalStorageAdapter, FileAdapter }; } catch(e) {}
