<div align="center">
  <img src="./src/assets/bingo-musical_logo.svg" alt="Logo de Bingo Musical" width="400" />
  
  ## La plataforma web definitiva para generar, imprimir y jugar bingos musicales interactivos en tiempo real con Spotify.

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
    <img src="https://img.shields.io/badge/Spotify_API-1ED760?style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify API" />
  </p>
</div>

---

## 💡 Sobre el Proyecto

**Prepará tu Bingo Musical** es una aplicación full-stack diseñada para transformar cualquier reunión, cumpleaños o evento en una fiesta épica. Olvidate de armar cartones a mano o de lidiar con canciones repetidas: simplemente pegá el enlace de cualquier playlist pública de **Spotify**, elegí la cantidad de jugadores, ¡y la plataforma se encarga del resto!

Ofrece una experiencia híbrida: podés generar cartones optimizados para imprimir en papel o permitir que tus invitados jueguen desde sus celulares en tiempo real escaneando un código QR.

---

## ✨ Características Principales

* **🔗 Integración Mágica con Spotify:** Conexión directa mediante *Client Credentials Flow* para extraer títulos, artistas, carátulas y previews de audio de cualquier playlist en segundos.
* **🎲 Motor Matemático Anti-Repetición:** Algoritmo *Fisher-Yates Shuffle* que garantiza cartones únicos y equilibrados para evitar ganadores simultáneos prematuros.
* **⚡ Jugabilidad en Tiempo Real (Socket.io):** * **Bolillero Live:** Panel para el animador con sorteador de canciones e historial en vivo.
  * **Alerta Express:** Los jugadores reciben un aviso visual en sus celulares si hicieron línea o bingo durante 5 segundos con decoraciones festivas.
  * **Podio en Vivo:** Sistema de validación automática para múltiples ganadores (hasta 2 premios por **Línea** y 1 ganador absoluto de **Cartón Lleno**).
* **🎵 Reproductor Integrado (In-App Player):** Reproduce los audios de muestra o el tema completo mediante el *Spotify Embed Iframe* directamente desde el panel del animador sin salir de la app.
* **📱 Cartones Digitales vía QR:** Los invitados pueden escanear un código para unirse a la sala interactiva y tachar casilleros desde su pantalla con feedback visual y celebraciones con confeti.
* **🖨️ Smart Layout A4 & Modo Eco-Ink:** Vista previa de impresión formateada para 2 o 4 cartones por hoja con líneas de corte. Incluye un modo "Ahorro de Tinta" que elimina fondos oscuros al imprimir.

---

## 🎨 Motor de Plantillas (Theming Engine)

Personalizá la estética de tus cartones con un solo clic gracias a nuestro sistema de temas impulsado por **Tailwind CSS**:

| Tema | Estilo Visual | Vibe / Ideal para... |
| :--- | :--- | :--- |
| **🕹️ Synthwave Neón** | Fondos oscuros, bordes brillantes rosa y cian, fuentes retro arcade. | Fiestas pop de los 80s/90s, previa con amigos. |
| **🌴 Fiesta Tropical** | Tonos cálidos y vibrantes, bordes redondeados y estilo veraniego. | Cumbia, reggaeton, cumpleaños al aire libre o pool parties. |
| **✨ Aesthetic Limpio** | Fondo blanco impecable, líneas finas y tipografía Serif elegante. | Eventos formales, casamientos o máximo ahorro de tinta. |
| **🎟️ Ticket de Festival** | Simula la entrada o credencial de backstage de un recital con código de barras. | Fanáticos del rock, indie o temáticas de conciertos. |

---

## 🛠️ Stack Tecnológico

* **Frontend:** React + Vite, Tailwind CSS v3, Lucide Icons, Canvas Confetti, QRCode.react.
* **Backend:** Node.js, Express, Socket.io, Axios, Dotenv.
* **APIs & Servicios:** Spotify Web API (REST) & WebSockets para sincronización bidireccional.

---

## 🚀 Instalación y Puesta en Marcha

Seguí estos pasos para correr el proyecto localmente en tu entorno de desarrollo.

### 1. Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/BingoMusical-ByAbru.git](https://github.com/tu-usuario/BingoMusical-ByAbru.git)
cd BingoMusical-ByAbru
