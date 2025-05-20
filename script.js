const form = document.getElementById('formBusca');
const inputTrecho = document.getElementById('inputTrecho');
const erroDiv = document.getElementById('erro');
const resultadoDiv = document.getElementById('resultado');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  erroDiv.classList.add('hidden');
  resultadoDiv.classList.add('hidden');
  resultadoDiv.innerHTML = '';

  const trecho = inputTrecho.value.trim();

  if (trecho.length < 4) {
    erroDiv.textContent = 'Por favor, digite pelo menos 4 caracteres.';
    erroDiv.classList.remove('hidden');
    return;
  }

  try {
    const response = await fetch('https://letra-back.vercel.app/buscar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ trecho })
    });

    if (!response.ok) {
      const errorData = await response.json();
      erroDiv.textContent = errorData.error || 'Erro ao buscar músicas.';
      erroDiv.classList.remove('hidden');
      return;
    }

    const data = await response.json();

    if (!data.musicas || data.musicas.length === 0) {
      resultadoDiv.textContent = 'Nenhuma música encontrada com esse trecho.';
      resultadoDiv.classList.remove('hidden');
      return;
    }

    data.musicas.forEach(musica => {
      const musicaDiv = document.createElement('div');
      musicaDiv.classList.add('border-b', 'border-gray-300', 'pb-4', 'last:border-none');

      const titulo = document.createElement('div');
      titulo.classList.add('text-xl', 'font-bold', 'text-blue-700');
      titulo.textContent = musica.nome;

      const artista = document.createElement('div');
      artista.classList.add('italic', 'text-gray-600', 'mb-2');
      artista.textContent = `Artista: ${musica.artista}`;

      const trechoEl = document.createElement('div');
      trechoEl.classList.add('bg-gray-100', 'p-3', 'rounded', 'whitespace-pre-wrap', 'font-mono');
      trechoEl.textContent = musica.trecho;

      musicaDiv.appendChild(titulo);
      musicaDiv.appendChild(artista);
      musicaDiv.appendChild(trechoEl);

      resultadoDiv.appendChild(musicaDiv);
    });

    resultadoDiv.classList.remove('hidden');
  } catch (error) {
    erroDiv.textContent = 'Erro na conexão com o servidor.';
    erroDiv.classList.remove('hidden');
  }
});
