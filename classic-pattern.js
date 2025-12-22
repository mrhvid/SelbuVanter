/**
 * VanteTegner - Classic Selbu Pattern
 * Based on traditional "Selbu Strikking" book patterns
 * This pattern is pre-loaded as an example
 */

const CLASSIC_SELBU_PATTERN = {
    name: "Klassisk Selbu",
    currentSize: "dame",
    gridWidth: 60,
    gridHeight: 80,
    colors: {
        natural: '#F5F5DC',
        darkgray: '#2F4F4F',
        accent1: '#8B0000',
        accent2: '#1E4D6B'
    },
    // Grid data: null = empty, '#2F4F4F' = dark pattern
    grid: createClassicSelbuGrid()
};

/**
 * Create the classic Selbu mitten pattern grid
 * Based on the book image with 8-petal roses and traditional borders
 */
function createClassicSelbuGrid() {
    const width = 60;
    const height = 80;
    const grid = [];
    
    // Initialize empty grid
    for (let y = 0; y < height; y++) {
        grid[y] = [];
        for (let x = 0; x < width; x++) {
            grid[y][x] = null;
        }
    }
    
    const dark = '#2F4F4F';
    
    // Helper function to set a cell
    function set(x, y) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
            grid[y][x] = dark;
        }
    }
    
    // Helper to draw symmetric pattern (mirror from center)
    function symmetric(cx, y, pattern) {
        pattern.forEach((x, i) => {
            set(cx - x - 1, y);
            set(cx + x, y);
        });
    }
    
    const centerX = 30; // Center of the mitten (between cells 29 and 30)
    
    // === FINGERTIP BORDER (rows 10-14) ===
    // Simple zigzag border at top
    for (let x = 17; x <= 43; x++) {
        if ((x + 10) % 2 === 0) set(x, 10);
    }
    for (let x = 16; x <= 44; x++) {
        if ((x + 11) % 2 === 0) set(x, 11);
    }
    
    // === MAIN ROSE PATTERN (rows 15-45) ===
    // Large 8-petal rose (Ottebladsrose)
    
    // Row 15-16: Top of rose pattern
    symmetric(centerX, 15, [0, 1, 5, 6, 10, 11]);
    symmetric(centerX, 16, [0, 2, 3, 4, 5, 9, 10, 11]);
    
    // Row 17-18: Expanding pattern
    symmetric(centerX, 17, [1, 2, 4, 5, 8, 9, 10, 12]);
    symmetric(centerX, 18, [0, 1, 3, 4, 6, 7, 8, 9, 11, 12]);
    
    // Row 19-22: Rose petals
    symmetric(centerX, 19, [2, 3, 5, 6, 7, 8, 10, 11, 13]);
    symmetric(centerX, 20, [1, 2, 4, 5, 8, 9, 10, 12, 13]);
    symmetric(centerX, 21, [0, 1, 3, 4, 6, 7, 9, 10, 11, 12]);
    symmetric(centerX, 22, [2, 3, 5, 6, 7, 8, 10, 11]);
    
    // Row 23-26: Center of rose with star pattern
    symmetric(centerX, 23, [0, 4, 5, 6, 7, 8, 9, 13]);
    symmetric(centerX, 24, [1, 2, 3, 5, 6, 7, 8, 10, 11, 12]);
    symmetric(centerX, 25, [0, 3, 4, 6, 7, 9, 10, 13]);
    symmetric(centerX, 26, [1, 2, 5, 6, 7, 8, 11, 12]);
    
    // Row 27-30: Lower rose petals
    symmetric(centerX, 27, [0, 3, 4, 5, 8, 9, 10, 13]);
    symmetric(centerX, 28, [1, 2, 4, 5, 6, 7, 8, 9, 11, 12]);
    symmetric(centerX, 29, [0, 2, 3, 5, 6, 7, 8, 10, 11, 13]);
    symmetric(centerX, 30, [1, 3, 4, 6, 7, 9, 10, 12]);
    
    // Row 31-34: Rose closing
    symmetric(centerX, 31, [0, 2, 4, 5, 8, 9, 11, 13]);
    symmetric(centerX, 32, [1, 3, 5, 6, 7, 8, 10, 12]);
    symmetric(centerX, 33, [0, 2, 4, 6, 7, 9, 11, 13]);
    symmetric(centerX, 34, [1, 3, 5, 8, 10, 12]);
    
    // === SMALL STAR PATTERN (rows 35-42) ===
    symmetric(centerX, 35, [0, 2, 4, 6, 7, 9, 11, 13]);
    symmetric(centerX, 36, [1, 3, 5, 8, 10, 12]);
    symmetric(centerX, 37, [0, 2, 4, 6, 7, 9, 11, 13]);
    symmetric(centerX, 38, [1, 3, 5, 8, 10, 12]);
    symmetric(centerX, 39, [2, 4, 6, 7, 9, 11]);
    symmetric(centerX, 40, [0, 3, 5, 8, 10, 13]);
    symmetric(centerX, 41, [1, 4, 6, 7, 9, 12]);
    symmetric(centerX, 42, [2, 5, 8, 11]);
    
    // === BORDER PATTERN (rows 43-47) ===
    // Zigzag/wave border
    for (let x = 16; x <= 44; x++) {
        if ((x % 4) === 0) {
            set(x, 43);
            set(x, 44);
        }
        if ((x % 4) === 2) {
            set(x, 45);
            set(x, 46);
        }
    }
    
    // === THUMB AREA PATTERN (left side, rows 50-65) ===
    // Small repeated pattern in thumb
    for (let y = 50; y < 65; y += 3) {
        for (let x = 6; x < 15; x += 3) {
            set(x, y);
            if (y + 1 < 65) set(x + 1, y + 1);
        }
    }
    
    // === MANCHET/CUFF PATTERN (rows 62-78) ===
    // Traditional cuff with stripes and small pattern
    
    // Upper cuff border
    for (let x = 15; x <= 45; x++) {
        set(x, 62);
        if (x % 2 === 0) set(x, 63);
    }
    
    // Cuff body pattern - small diamonds
    for (let y = 65; y <= 75; y += 2) {
        for (let x = 16; x <= 44; x += 4) {
            set(x, y);
            if (y + 1 <= 75) {
                set(x - 1, y + 1);
                set(x + 1, y + 1);
            }
        }
    }
    
    // Bottom cuff border
    for (let x = 15; x <= 45; x++) {
        set(x, 77);
    }
    
    return grid;
}

// Export for use in app
window.CLASSIC_SELBU_PATTERN = CLASSIC_SELBU_PATTERN;
