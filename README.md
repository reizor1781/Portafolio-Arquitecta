# 🏛️ Estudio Arcos — Portfolio de Arquitectura

> Portafolio web premium para un estudio de arquitectura contemporánea. Diseño elegante, oscuro y cinematográfico con animaciones inmersivas.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## ✨ Características

| Característica | Descripción |
|---|---|
| 🎬 **Hero Cinematográfico** | Slideshow con animaciones Ken Burns (zoom-in, zoom-out, pan), barras letterbox, efecto grain de película e indicador de progreso |
| 🎯 **Cursor Personalizado** | Cursor custom con efecto follower suave y estados hover interactivos |
| 📐 **Diseño Responsivo** | Layout adaptable para desktop, tablet y móvil |
| ⚡ **Animaciones al Scroll** | Elementos que se revelan con IntersectionObserver y stagger |
| 🔢 **Contadores Animados** | Estadísticas con animación de conteo y easing cúbico |
| 🖼️ **Efecto Parallax** | Sección de filosofía con imagen parallax al hacer scroll |
| 📱 **Menú Móvil** | Menú hamburguesa con transición fullscreen |
| 📜 **Marquee Infinito** | Ticker continuo con categorías de servicios |
| 📬 **Formulario de Contacto** | Formulario funcional con validación y feedback visual |

---

## 🛠️ Tecnologías

- **HTML5** — Estructura semántica con etiquetas `section`, `article`, `nav`, `footer`
- **CSS3** — Variables CSS, Grid, Flexbox, animaciones `@keyframes`, gradientes, `backdrop-filter`
- **JavaScript Vanilla** — Sin dependencias externas. IntersectionObserver, requestAnimationFrame, event listeners
- **Google Fonts** — [Outfit](https://fonts.google.com/specimen/Outfit) (sans-serif) + [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (serif)

---

## 📁 Estructura del Proyecto

```
portfolio-arquitectura/
├── img/
│   ├── hero.png            # Imagen principal del hero
│   └── residential.png     # Imagen proyecto residencial
├── index.html              # Página principal
├── styles.css              # Estilos completos
├── script.js               # Lógica e interactividad
└── README.md               # Este archivo
```

---

## 🚀 Inicio Rápido

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/portfolio-arquitectura.git
   ```

2. **Abrir en el navegador:**
   ```bash
   cd portfolio-arquitectura
   ```
   Simplemente abre `index.html` en tu navegador, o usa un servidor local:
   ```bash
   # Con Python
   python -m http.server 8080

   # Con Node.js (npx)
   npx serve .

   # Con VS Code
   # Instala la extensión "Live Server" y haz clic en "Go Live"
   ```

3. **Listo** — No requiere instalación de dependencias ni build tools.

---

## 🎬 Hero Cinematográfico — Detalles

El hero principal simula una experiencia de video usando CSS puro + JavaScript:

### Efectos Visuales
- **Ken Burns Animation** — 4 tipos de movimiento de cámara:
  - `zoom-in` — acercamiento lento
  - `zoom-out` — alejamiento suave
  - `pan-left` — paneo horizontal izquierdo
  - `pan-right` — paneo horizontal derecho
- **Film Grain** — textura de grano de película con SVG animado
- **Letterbox Bars** — barras cinematográficas superior e inferior
- **Overlay Gradiente** — degradado multi-punto para legibilidad del texto

### Interactividad
- **Barra de progreso** — indicador vertical que muestra el tiempo restante del slide actual
- **Contador de slides** — `01 / 04` se actualiza en cada transición
- **Pause on hover** — el slideshow se pausa al pasar el cursor sobre el hero

### Configuración
En `script.js`, puedes ajustar:
```javascript
const SLIDE_DURATION = 6000; // Duración de cada slide en ms (default: 6s)
```

Para agregar más slides, añade nuevos `<div>` en el HTML:
```html
<div class="hero-slide" 
     style="background-image: url('ruta/imagen.jpg');" 
     data-direction="zoom-in">
</div>
```

---

## 🎨 Personalización

### Paleta de Colores

Edita las variables CSS en `:root` dentro de `styles.css`:

```css
:root {
    --bg: #0a0a0a;           /* Fondo principal */
    --bg-light: #141414;     /* Fondo secundario */
    --bg-card: #1a1a1a;      /* Fondo de tarjetas */
    --text: #f5f0eb;         /* Texto principal */
    --text-muted: #8a8580;   /* Texto secundario */
    --accent: #c8a87c;       /* Color de acento (dorado) */
    --accent-light: #e0c9a6; /* Acento claro */
}
```

### Tipografía

Las fuentes se cargan desde Google Fonts en el `<head>`:
- **Outfit** — títulos de navegación, textos de cuerpo, botones
- **Playfair Display** — títulos principales, citas, números destacados

---

## 📋 Secciones

1. **Hero** — Slideshow cinematográfico con CTA principal
2. **Nosotros** — Descripción del estudio con estadísticas animadas
3. **Marquee** — Ticker de servicios en movimiento continuo
4. **Proyectos** — Grid de obras seleccionadas con hover effects
5. **Filosofía** — Cita con parallax y pilares del estudio
6. **Proceso** — Tarjetas con la metodología de trabajo (4 pasos)
7. **Contacto** — Formulario + información de contacto
8. **Footer** — Navegación, redes sociales, copyright

---

## 🌐 SEO

- Meta description optimizada
- Título descriptivo con marca
- Estructura de headings jerárquica (`h1` → `h2` → `h3`)
- HTML semántico (`section`, `article`, `nav`, `footer`)
- Imágenes con atributos `alt` descriptivos
- Lazy loading en imágenes de proyectos

---

## 📱 Responsive Breakpoints

| Breakpoint | Cambios principales |
|---|---|
| `> 1024px` | Layout completo desktop |
| `≤ 1024px` | Showcase grid 2 columnas |
| `≤ 768px` | Menú hamburguesa, grids 1 columna, cursor nativo, hero progress oculto |

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Siéntete libre de usarlo como base para tu propio portafolio.

---

<p align="center">
  Hecho con ❤️ por <strong>Estudio Arcos</strong>
</p>
