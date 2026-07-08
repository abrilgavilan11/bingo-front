<div align="center">
  <img src="./src/assets/bingo-musical_logo.svg" alt="Logo de Bingo Musical" width="400" />
  
  ## Bingo Musical - Cliente UI (Frontend)
  La interfaz interactiva para generar, imprimir y jugar bingos musicales en tiempo real con Spotify.

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Socket.io_Client-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
  </p>
</div>

---

## 💡 Sobre el Frontend

Esta es la parte visual (cliente) del proyecto **Bingo Musical**. Está desarrollada con **React** y **Vite**, y diseñada con **Tailwind CSS** para ofrecer una experiencia hermosa, rápida y completamente adaptable a celulares, tablets y computadoras de escritorio. Su función principal es interactuar con el usuario y comunicarse en tiempo real con el servidor.

Ofrece una experiencia híbrida: podés generar cartones optimizados para imprimir en papel o permitir que tus invitados jueguen desde sus celulares de forma digital e interactiva.

---

## ✨ Características Principales de la Interfaz

* **⚡ Jugabilidad Reactiva (Socket.io-client):** 
  * **Panel del Animador (Host):** Interfaz para buscar la playlist de Spotify, configurar los cartones, sortear las canciones e historial en vivo.
  * **Alerta Express y Animaciones:** Uso extensivo de *Framer Motion* para mostrar notificaciones pop-up coloridas y decoraciones festivas (confeti) en los celulares de los ganadores.
* **🎵 Reproductor Integrado (Spotify Embed):** Un iframe integrado dinámicamente en el panel del animador que permite reproducir los fragmentos de las canciones directamente en la app.
* **📱 Cartones Digitales:** Vista específica (`MobilePlayer`) optimizada para lectura en móviles, donde los jugadores pueden hacer tap para tachar las canciones.
* **🖨️ Smart Layout A4:** Vista especial con reglas CSS de impresión (`@media print`) para imprimir los cartones generados, ocultando los elementos innecesarios de la interfaz.

---

## 🎨 Motor de Plantillas (Theming Engine)

Personalizá la estética de tus cartones en la pantalla de impresión con nuestro sistema de temas impulsado por variables en **Tailwind CSS**:

| Tema | Estilo Visual | Vibe / Ideal para... |
| :--- | :--- | :--- |
| **🕹️ Synthwave Neón** | Estilo "Miami Vice": negro puro, bordes fucsia intenso, detalles en cian y amarillo eléctrico. | Fiestas pop de los 80s/90s. |
| **🌴 Fiesta Tropical** | Tonos cálidos y vibrantes, bordes redondeados y estilo veraniego. | Cumpleaños al aire libre o pool parties. |
| **🌌 Galaxia Mágica** | Fondo índigo profundo, textos neón fucsia y cian brillante, aspecto estelar. | Fiestas de noche, temáticas espaciales. |
| **🎨 Pop Art Cómico** | Amarillo brillante, bordes negros gruesos y detalles en cian/magenta. Estilo cómic. | Previa con amigos, temáticas divertidas y coloridas. |
| **🖨️ Modo Eco-Ink** | Elimina todos los fondos oscuros e invierte los colores al imprimir. | Ahorro extremo de tinta en impresoras de casa. |

---

## 🛠️ Stack Tecnológico (Frontend)

* **Core:** React.js (Vite)
* **Estilos:** Tailwind CSS v3
* **Animaciones:** Framer Motion
* **Tiempo Real:** Socket.io-client
* **Enrutamiento:** React Router Dom
* **Iconografía:** Lucide React

---

## 🚀 Instalación y Puesta en Marcha (Frontend)

Para correr la interfaz de usuario en tu entorno local:

### 1. Requisitos Previos
Asegurate de tener el backend del bingo corriendo simultáneamente para que la app pueda consumir los datos y conectarse a los websockets.

### 2. Configurar e Iniciar
Abrí una terminal en esta carpeta (`bingo-front`) y ejecutá:
```bash
npm install
```
Creá un archivo `.env` en la raíz de esta carpeta y apuntá a tu servidor local:
```env
VITE_API_URL=http://localhost:3001
```
Iniciá el entorno de desarrollo:
```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`.

---
<div align="center">
  <b>Diseñado y desarrollado por <a href="https://github.com/abrilgavilan11">Abril Gavilan</a></b>
</div>
