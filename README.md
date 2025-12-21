# VanteTegner - Selbu Vante Designer 🧤

En Progressive Web App (PWA) for å designe tradisjonelle norske Selbu-vantermønstre.

## ✨ Funksjoner

- **Canvas-basert mønsterdesigner** - Tegn pixel-perfekte strikemønstre
- **Touch-optimalisert** - Fungerer utmerket på iPad og mobil
- **4-fargepalett** - Naturhvit, mørkegrå + 2 valgfrie farger
- **Mønsterspeilning** - Speil mønsteret horisontalt
- **Lagre/Last mønstre** - Lagre dine design lokalt
- **Eksporter til PNG** - Print ut dine mønstre
- **Fungerer offline** - PWA med full offline-støtte
- **Responsivt design** - Desktop, nettbrett og mobil

## 🎯 Vantestørrelser

Basert på Drops-oppskrifter:

| Størrelse | Omfang | M.1 | M.2 | M.3 | M.4 |
|-----------|--------|-----|-----|-----|-----|
| Small (S) | 44 masker | 11m | 5m | 17m | 11m |
| Medium (M) | 48 masker | 12m | 5m | 19m | 12m |
| Large (L) | 52 masker | 13m | 5m | 21m | 13m |

## ⌨️ Hurtigtaster

| Tast | Funksjon |
|------|----------|
| W | Naturhvit farge |
| G | Mørkegrå farge |
| R | Farge 1 (rød) |
| B | Farge 2 (blå) |
| P | Blyantverktøy |
| E | Viskelær |
| F | Fyllverktøy |
| M | Speil mønster |
| +/- | Zoom inn/ut |
| Ctrl+Z | Angre |
| Ctrl+Y | Gjør om |
| Ctrl+S | Lagre |

## 🚀 Kom i gang

### Lokal utvikling

1. Klon repositoriet:
```bash
git clone https://github.com/mrhvid/SelbuVanter.git
cd SelbuVanter
```

2. Start en lokal webserver:
```bash
# Med Python 3
python -m http.server 8000

# Eller med Node.js
npx serve .

# Eller med PHP
php -S localhost:8000
```

3. Åpne http://localhost:8000 i nettleseren

### Hosting

Prosjektet er statisk og kan hostes på:

- **GitHub Pages** - Gratis hosting direkte fra repo
- **Azure Static Web Apps** - Gratis tier tilgjengelig
- **Netlify** - Gratis for statiske sider
- **Vercel** - Gratis for statiske prosjekter

## 📁 Filstruktur

```
SelbuVanter/
├── index.html          # Hovedside med UI
├── styles.css          # Responsiv CSS
├── app.js              # Hovedapplikasjon
├── canvas-drawing.js   # Canvas og tegning
├── pattern-manager.js  # Lagring og eksport
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
├── icons/              # App-ikoner
│   └── icon.svg        # Kildikon (SVG)
└── README.md
```

## 🖼️ Generere ikoner

For å generere PNG-ikoner fra SVG:

```bash
# Med ImageMagick
for size in 72 96 128 144 152 192 384 512; do
  convert -background none icons/icon.svg -resize ${size}x${size} icons/icon-${size}.png
done

# Eller bruk online verktøy som realfavicongenerator.net
```

## 📱 Installere som app

### iOS (Safari)
1. Åpne VanteTegner i Safari
2. Trykk på Del-knappen
3. Velg "Legg til på Hjem-skjerm"

### Android (Chrome)
1. Åpne VanteTegner i Chrome
2. Trykk på menyikonet (⋮)
3. Velg "Installer app" eller "Legg til på startskjermen"

### Desktop (Chrome/Edge)
1. Åpne VanteTegner
2. Klikk på installikonet i adressefeltet
3. Bekreft installasjonen

## 🎨 Om Selbu-vanter

Selbu-vanter er tradisjonelle norske strikkevanter med karakteristiske svart-hvite mønstre. Mønstrene stammer fra Selbu kommune i Trøndelag og ble populære på 1800-tallet.

### Typiske elementer:
- **Åttebladsrose** - Det mest kjente motivet
- **Stjerner** - Geometriske stjernemønstre
- **Border** - Dekorative kantmønstre
- **To farger** - Tradisjonelt svart og hvitt

## 🛠️ Teknologi

- **Vanilla JavaScript** - Ingen avhengigheter
- **HTML5 Canvas** - For tegning
- **IndexedDB** - For mønsterlagring
- **Service Worker** - For offline-støtte
- **CSS Grid/Flexbox** - For responsivt design

## 📄 Lisens

MIT License - Se [LICENSE](LICENSE) for detaljer.

## 🤝 Bidra

Bidrag er velkomne! 

1. Fork prosjektet
2. Lag en feature branch (`git checkout -b feature/NyFunksjon`)
3. Commit endringer (`git commit -m 'Legg til ny funksjon'`)
4. Push til branch (`git push origin feature/NyFunksjon`)
5. Åpne en Pull Request

---

Laget med ❤️ for norsk strikketradisjon