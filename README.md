# Ozzymandias — landing corporativa

Landing multilingüe para un estudio de tecnología creativa. El sistema visual combina una estructura editorial Bauhaus contemporánea con una marca generativa, geometría interactiva, transiciones de scroll y un portfolio expandible.

## Inicio rápido

Requiere Node.js 20.19+ o 22.12+.

```bash
npm install
npm run dev
```

Comandos de entrega:

```bash
npm run lint
npm run build
npm run preview
```

Los recursos visuales ya están optimizados. Si se reemplazan los PNG originales:

```bash
npm run optimize:images
npm run optimize:og
```

## Edición sin tocar la arquitectura

- Marca, claim, email, ubicación y redes: `src/config/brand.ts`.
- Textos de interfaz en español, portugués e inglés: `src/data/content.ts`.
- Proyectos, estados, tecnologías e imágenes: `src/data/projects.ts`.
- Rutas localizadas: `src/config/routes.ts`.
- Variables visuales y responsive: `src/index.css`.
- Formulario/API: `src/components/sections/ContactForm.tsx`.
- Analítica: `src/lib/analytics.ts`.

El wordmark se reconstruye automáticamente al cambiar `brand.name`. Su alfabeto geométrico acepta A–Z, números, espacios y los caracteres `-`, `&` y `.`. La marca no debe llevar acentos.

## Rutas implementadas

| Español | Português | English |
| --- | --- | --- |
| `/` | `/pt` | `/en` |
| `/equipo` | `/pt/equipe` | `/en/team` |
| `/proyectos/:slug` | `/pt/projetos/:slug` | `/en/projects/:slug` |
| `/privacidad` | `/pt/privacidade` | `/en/privacy` |
| `/terminos` | `/pt/termos` | `/en/terms` |

Las tarjetas del portfolio abren un modal conectado a la URL. El botón **Expandir** transforma esa misma URL en una página completa; una visita directa carga la página completa.

## Formulario

Sin configuración externa, el envío funciona en modo demostración y muestra un estado de éxito. Para conectarlo a un backend:

```env
VITE_CONTACT_ENDPOINT=https://api.ejemplo.com/contact
```

La petición es `POST`, JSON y usa los campos visibles del formulario. Ningún contenido escrito por el visitante se envía a analítica.

## Analítica y privacidad

El adaptador está preparado para Plausible y registra visitas, visitas calificadas, secciones vistas, aperturas de proyectos, CTA, cambios de idioma/tema, intención y resultado del formulario y Core Web Vitals. País, región, ciudad y horario se resuelven desde Plausible, sin guardarlos manualmente en el frontend.

```env
VITE_PLAUSIBLE_DOMAIN=dominio-final.com
VITE_PLAUSIBLE_SCRIPT=https://plausible.io/js/script.js
```

La analítica puede desactivarse desde **Preferencias**. Tema, sonido y consentimiento se guardan localmente. El sonido comienza apagado para respetar las políticas de reproducción del navegador.

## Recursos

- Originales generados: `assets-source/portfolio/` y `assets-source/og-card.png`.
- Portfolio publicado, WebP: `public/images/`.
- Tarjeta social: `public/og.png`.
- Fuentes y licencias OFL: `public/fonts/`.
- Prompts y modo de generación: `docs/IMAGE_PROMPTS.md`.

## Pendientes antes de publicar

1. Confirmar dominio final y completar URL canónica absoluta en la plataforma de hosting.
2. Completar email, ubicación y redes en `brand.ts`.
3. Reemplazar lorem ipsum, perfiles de equipo y seis proyectos conceptuales.
4. Conectar `VITE_CONTACT_ENDPOINT`.
5. Configurar Plausible y revisar textos legales con un profesional.
6. Configurar el hosting con fallback de SPA hacia `index.html`.

La entrega incluye revisión manual de escritorio y móvil, temas claro/oscuro, tres idiomas, rutas directas, modal, formulario y compilación de producción. Por decisión de alcance, no incluye una suite automatizada ni publicación.
