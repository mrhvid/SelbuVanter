# VanteTegner - Selbu Vante Designer 🧤

En Progressive Web App (PWA) til at designe traditionelle norske Selbu vante strikke mønstre.

## ✨ Funktioner

- **Canvas-baseret mønsterdesigner** - Tegn pixel-perfekte strikemønstre
- **Autentiske vanteskabeloner** - Børn, Dame og Herre størrelser med rødt omrids
- **Vanteomrids overlay** - Røde stregmarkeringer der altid er synlige ved print
- **Touch-optimeret** - Virker glimrende på iPad og mobil
- **4-farvepalette** - Naturhvid, mørkegrå + 2 valgfrie farver
- **Klassisk eksempelmønster** - Indlæs et traditionelt Selbu design
- **Mønsterspejling** - Spejl mønsteret horisontalt
- **Gem/Indlæs mønstre** - Gem dine designs lokalt
- **Eksporter til PNG** - Udskriv dine mønstre med vanteomrids
- **Virker offline** - PWA med fuld offline-support
- **Responsivt design** - Desktop, tablet og mobil

## 🎯 Vantestørrelser

Baseret på "Selbu Strikking" bogen:

| Størrelse | Type | Grid |
|-----------|------|------|
| Børn | Barnevante | 50×65 |
| Dame | Damevante | 60×80 |
| Herre | Herrevante | 65×90 |

## ⌨️ Genvejstaster

| Tast | Funktion |
|------|----------|
| W | Naturhvid farve |
| G | Mørkegrå farve |
| R | Farve 1 (rød) |
| B | Farve 2 (blå) |
| P | Blyantværktøj |
| E | Viskelæder |
| F | Fyldte værktøj |
| M | Spejl mønster |
| +/- | Zoom ind/ud |
| Ctrl+Z | Fortryd |
| Ctrl+Y | Annuller fortryd |
| Ctrl+S | Gem |

## 🚀 Kom i gang

### Brug PWA fra GitHub Pages

**Den nemmeste måde** - ingen installation nødvendig!

Besøg appen direkte i din browser:
**[https://mrhvid.github.io/SelbuVanter/](https://mrhvid.github.io/SelbuVanter/)**

#### Installer app på din enhed

**iOS (iPhone/iPad):**
1. Åbn linket i Safari
2. Tryk på del-knappen (kvadrat med pil)
3. Vælg "Føj til startskærm"
4. Giv appen et navn og tryk "Føj til"

**Android:**
1. Åbn linket i Chrome
2. Tryk på menu-ikonet (⋮)
3. Vælg "Installer app"
4. Bekræft installeringen

**Windows/Mac (Desktop):**
1. Åbn linket i Chrome eller Edge
2. Klik på installerings-ikonet i adresselinjen
3. Bekræft installeringen

Når appen er installeret, virker den **offline** - du behøver ingen internetforbindelse for at tegne!

## 📁 Filstruktur

```
SelbuVanter/
├── index.html          # Hovedside med UI
├── styles.css          # Responsiv CSS
├── app.js              # Hovedapplikation
├── canvas-drawing.js   # Canvas og tegning med vanteomrids
├── pattern-manager.js  # Gem og eksport
├── classic-pattern.js  # Klassisk Selbu eksempelmønster
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
├── icons/              # App-ikoner
│   ├── icon.svg        # Kildikon (SVG)
│   ├── icon-192.png    # Ikon 192x192
│   └── apple-touch-icon.png # iOS ikon
└── README.md
```

## 📱 Installer som app

Appen er en **installabel PWA** - det betyder:
- Ingen app store nødvendig
- Virker på alle enhedder
- Fuld offline-support
- Samme brugeroplevelse som en native app

Når du installerer appen, får den sit eget ikon på dit hjemmeskærm/desktop og kan køres som en selvstændig app.

## 🎨 Om Selbu vanter

Selbu vanter er traditionelle norske strikkevanter med karakteristiske sort-hvide mønstre. Mønstrene stammer fra Selbu kommune i Trøndelag og blev populære på 1800-tallet.

### Typiske elementer:
- **Ottebladsrose** - Det mest kendt motiv
- **Stjerner** - Geometriske stjerne mønstre
- **Borde** - Dekorative kantmønstre
- **To farver** - Traditionelt sort og hvidt

## 🛠️ Teknologi

- **Vanilla JavaScript** - Ingen afhængigheder
- **HTML5 Canvas** - Til tegning
- **IndexedDB** - Til mønster lagring
- **Service Worker** - Til offline-support
- **CSS Grid/Flexbox** - Til responsivt design
- **Progressive Web App (PWA)** - Installabel på alle enheder

## 📄 Licens

MIT License - Se [LICENSE](LICENSE) for detaljer.

## 🤝 Bidrag

Bidrag er velkomne! 

1. Fork projektet
2. Lav en feature branch (`git checkout -b feature/NyFunktion`)
3. Commit dine ændringer (`git commit -m 'Tilføj ny funktion'`)
4. Push til branch (`git push origin feature/NyFunktion`)
5. Åbn en Pull Request

---

Lavet med ❤️ for norsk strikekultur