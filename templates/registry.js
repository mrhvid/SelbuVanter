// Template registry scaffold
// Contains basic template entries for 48 and 52 stitch variants.

const templates = {
  "48": {
    id: "48",
    label: "S/M - 48 stitches",
    description: "Medium template: 48 stitches around",
    stitches: 48,
    rows: 100,
    recommendedDPI: 300
  },
  "52": {
    id: "52",
    label: "L/XL - 52 stitches",
    description: "Large template: 52 stitches around",
    stitches: 52,
    rows: 110,
    recommendedDPI: 300
  }
};

function listTemplates() {
  return Object.values(templates);
}

function getTemplate(id) {
  return templates[id] || null;
}

function registerTemplate(t) {
  templates[t.id] = t;
  // persist if adapter available
  try {
    if (window && window.LocalStorageAdapter) {
      const adapter = new LocalStorageAdapter('vantetegner_templates');
      adapter.save(t.id, t);
    }
  } catch (e) { /* ignore */ }
}

module.exports = { listTemplates, getTemplate, registerTemplate };
