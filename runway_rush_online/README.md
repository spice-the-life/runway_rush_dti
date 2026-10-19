# Runway Rush — 3D fashion battle

A playable web prototype with a Three.js 3D scene, customizable mannequin, clothes/hair/shoes/accessories, color studio, theme rotation, runway lock-in, and a Socket.IO room server.

## Run locally

1. Install Node.js 18 or newer.
2. Extract this folder.
3. Open a terminal in this folder.
4. Run `npm install`
5. Run `npm start`
6. Open `http://localhost:3000`

The Three.js module is loaded from jsDelivr, so the browser needs internet access. The page and multiplayer server are served locally.

## Test multiplayer

- Keep the server running.
- Open `http://localhost:3000` in two browser tabs, or on two devices on the same network using the host computer's LAN IP and port 3000.
- Click **Create room** in one tab and share the room code.
- Enter that code in the other tab and click **Join**.

For friends outside your local network, deploy the Node app to a host that supports persistent Node processes and WebSockets (for example, Render, Railway, or a VPS), then share the deployed URL. Configure HTTPS in production.

## What's real / what's still prototype

- Real 3D rendering and orbiting the model: yes (Three.js).
- Clothing choices and recoloring: yes; stylized primitive geometry rather than production-quality cloth or purchased 3D assets.
- Room codes and live player presence: yes when the included Node server is running.
- Persistent accounts, save data, anti-cheat, moderation/reporting, robust matchmaking, synchronized 3D player avatars, and a full timed voting phase: not yet implemented.
- Multiplayer votes/scores are an early prototype; the vote button currently uses a placeholder target and should be expanded into a player-select voting UI before public release.
- This is a starter game project, not a hosted public game. Online play requires deploying the server; opening the HTML file alone does not create internet multiplayer.

## Important

Do not expose a local development server directly to the public internet without adding validation, rate limits, moderation, and production security settings.
