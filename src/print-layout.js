// Print layout scaffold
// Provides functions to compute page splits and generate print-ready canvases for A4.

const A4 = { widthMm: 210, heightMm: 297 };

function mmToPx(mm, dpi = 300) {
  return Math.round((mm / 25.4) * dpi);
}

function computePrintCanvas(mittenModel, options = {}) {
  const dpi = options.dpi || mittenModel.canvas.dpi || 300;
  const margins = options.marginsMm || { top: 10, right: 10, bottom: 10, left: 10 };
  const orientation = options.orientation || 'portrait';
  const paper = options.paper || 'A4';

  const paperW = mmToPx(A4.widthMm, dpi);
  const paperH = mmToPx(A4.heightMm, dpi);

  // Placeholder: calculate number of pages required and layout boxes
  const payload = {
    paper: 'A4',
    orientation,
    dpi,
    paperPx: { width: paperW, height: paperH },
    margins,
    pages: []
  };

  // TODO: implement actual page splitting and return rendering plan (pages with regions and transforms)

  return payload;
}

module.exports = { computePrintCanvas };
