# Inglés Express (Wrapper ChatGPT)

Asistente mínimo para ayudar a hispanohablantes (España) a mejorar su inglés. Incluye un backend que envía la consulta a OpenAI con guardrails (solo temas de aprendizaje de inglés) y una interfaz sencilla con un campo de texto y un área de respuesta.

## Requisitos
- Node.js 18+
- Clave de API de OpenAI (`OPENAI_API_KEY`)

## Configuración rápida
1. Copia el ejemplo de entorno y añade tu clave:
   ```bash
   cp .env.example .env
   # Edita .env y coloca tu clave en OPENAI_API_KEY
   ```
2. Instala dependencias (si aún no lo hiciste):
   ```bash
   npm install
   ```
3. Arranca el servidor:
   ```bash
   npm start
   ```
4. Abre `http://localhost:3000` (o el puerto que definas en `PORT`) y envía tus dudas sobre inglés.

## Uso del endpoint
- **POST** `/api/chat`
  - Body JSON: `{ "prompt": "tu pregunta en español" }`
  - Respuesta: `{ "reply": "respuesta en español (España)" }`

## Comportamiento esperado
- Solo responde a preguntas relacionadas con aprender/usar inglés. Si el usuario pregunta por otro tema, devuelve: “Solo puedo responder dudas sobre aprender y usar inglés.”
- Las respuestas son breves, en español de España, con opción de añadir línea de variante británica si difiere (“Inglés británico (formal): ...”).
- Añade una recomendación breve cuando aporte valor (alternativa o truco).

## Estructura básica
- `server.js`: servidor Express + llamada a OpenAI (Responses API).
- `public/`: interfaz web (HTML + CSS + JS).
- `.env.example`: variables de entorno necesarias.

## Notas
- El modelo usado por defecto es `gpt-5.1` mediante la Responses API. Puedes sobreescribirlo con `OPENAI_MODEL` en `.env`.
- No subas tu `.env` ni `node_modules` al repositorio (archivo `.gitignore` incluido).
