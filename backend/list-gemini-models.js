(async () => {
  const fetch = (await import('node-fetch')).default;
  const apiKey = 'AIzaSyBCY0u1c4rMsVpHiAbcdt3Ma0AjRnPaIbU'; // <-- Replace with your actual Gemini API key

  fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      console.log('Available Gemini models:', data);
    })
    .catch(err => {
      console.error('Error fetching models:', err);
    });
})();