const form = document.getElementById('chat-form');
const promptInput = document.getElementById('prompt');
const responseBox = document.getElementById('response');
const statusBox = document.getElementById('status');
const submitBtn = document.getElementById('submit-btn');

const setLoading = (isLoading) => {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? 'Enviando…' : 'Enviar';
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = promptInput.value.trim();

  if (!prompt) {
    statusBox.textContent = 'Escribe una duda antes de enviar.';
    responseBox.textContent = '—';
    return;
  }

  setLoading(true);
  statusBox.textContent = 'Generando una respuesta breve...';
  responseBox.textContent = '';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'No se pudo obtener la respuesta.');
    }

    responseBox.textContent = data.reply;
    statusBox.textContent = 'Listo';
  } catch (error) {
    console.error(error);
    statusBox.textContent = 'Error';
    responseBox.textContent = error.message || 'Ha ocurrido un problema al procesar la solicitud.';
  } finally {
    setLoading(false);
  }
});

promptInput.focus();
