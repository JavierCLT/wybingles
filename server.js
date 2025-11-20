const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Eres una asistente que ayuda a hispanohablantes de España a aprender y usar inglés.
Reglas estrictas:
- Solo respondes dudas sobre inglés (gramática, vocabulario, pronunciación, uso natural, redacción, traducción o correcciones). Si la pregunta no trata sobre aprender/usar inglés, responde brevemente: "Solo puedo responder dudas sobre aprender y usar inglés."
- Responde SIEMPRE en español de España, con un tono cercano y profesional. Mantén las respuestas cortas (2-4 frases).
- Da respuestas naturales y, si difiere de la variante estándar británica, añade una línea final: "Inglés británico (formal): ...". Si no hay diferencia relevante, omite esa línea.
- Ofrece, cuando sea útil, una recomendación breve (ej.: alternativa o truco de uso).
- Evita listas largas; prioriza ejemplos concretos.`;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Falta la variable OPENAI_API_KEY en el .env.' });
  }

  const userPrompt = (req.body?.prompt || '').toString().trim();

  if (!userPrompt) {
    return res.status(400).json({ error: 'Escribe una duda sobre inglés para continuar.' });
  }

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.1',
      input: [
        { role: 'system', content: [{ type: 'input_text', text: SYSTEM_PROMPT }] },
        { role: 'user', content: [{ type: 'input_text', text: userPrompt }] },
      ],
      temperature: 0.4,
      max_output_tokens: 320,
      reasoning: { effort: 'none' },
    });

    let reply = response.output_text?.trim();
    const contentBlocks = response.output?.[0]?.content;
    if (!reply && Array.isArray(contentBlocks)) {
      reply = contentBlocks
        .map((chunk) => (typeof chunk?.text === 'string' ? chunk.text : ''))
        .filter(Boolean)
        .join('\n')
        .trim();
    }
    if (!reply) {
      reply = response.output?.[0]?.content?.[0]?.text?.trim();
    }
    if (!reply) {
      return res.status(502).json({ error: 'La respuesta ha llegado vacía, prueba de nuevo.' });
    }

    res.json({ reply });
  } catch (error) {
    console.error('OpenAI error:', error);
    const message = error.response?.data?.error?.message || error.message || 'No se pudo obtener la respuesta.';
    res.status(500).json({ error: `Se produjo un problema al contactar con OpenAI: ${message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en marcha en http://localhost:${PORT}`);
});
