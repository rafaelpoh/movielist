// NOTA: É uma boa prática manter chaves de API em um ambiente seguro e não diretamente no código.
const apiKey = '4470f5b73e6ecdfd6ba10fd320853bd0';

// URLs base
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const apiBaseUrl = 'https://api.themoviedb.org/3';

// Elementos do DOM
const mainContent = document.querySelector('main');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Função para exibir os filmes na tela
function displayMovies(movies, container) {
    container.innerHTML = ''; // Limpa o container

    if (movies.length === 0) {
        container.innerHTML = '<p>Nenhum filme encontrado.</p>';
        return;
    }

    movies.forEach(movie => {
        if (movie.poster_path) {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            const movieImage = document.createElement('img');
            movieImage.src = `${imageBaseUrl}${movie.poster_path}`;
            movieImage.alt = movie.title;

            const movieInfo = document.createElement('div');
            movieInfo.classList.add('movie-card-info');

            const movieTitle = document.createElement('h2');
            movieTitle.classList.add('movie-title');
            movieTitle.textContent = movie.title;

            movieInfo.appendChild(movieTitle);
            movieCard.appendChild(movieImage);
            movieCard.appendChild(movieInfo);

            container.appendChild(movieCard);
        }
    });
}

// Função para buscar dados da API e chamar a exibição
async function fetchAndPopulateMovies(endpoint, container) {
    const apiUrl = `${apiBaseUrl}${endpoint}&api_key=${apiKey}&language=pt-BR&page=1`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
        const data = await response.json();
        displayMovies(data.results, container);
    } catch (error) {
        console.error(`Erro ao buscar filmes:`, error);
        container.innerHTML = '<p>Não foi possível carregar os filmes.</p>';
    }
}

// Função para mostrar a visualização padrão (Em cartaz e Próximos)
function showDefaultView() {
    mainContent.innerHTML = `
        <section class="movie-category">
            <h2>Em Cartaz</h2>
            <div id="now-playing-container" class="movie-grid"></div>
        </section>
        <section class="movie-category">
            <h2>Próximos Lançamentos</h2>
            <div id="upcoming-container" class="movie-grid"></div>
        </section>
    `;
    const nowPlayingContainer = document.getElementById('now-playing-container');
    const upcomingContainer = document.getElementById('upcoming-container');

    fetchAndPopulateMovies(`/movie/now_playing?`, nowPlayingContainer);
    fetchAndPopulateMovies(`/movie/upcoming?`, upcomingContainer);
}

// Função para buscar e mostrar os resultados da pesquisa
function showSearchResults(query) {
    mainContent.innerHTML = `
        <section class="movie-category">
            <h2>Resultados para "${query}"</h2>
            <div id="search-results-container" class="movie-grid"></div>
        </section>
    `;
    const searchResultsContainer = document.getElementById('search-results-container');
    fetchAndPopulateMovies(`/search/movie?query=${encodeURIComponent(query)}`, searchResultsContainer);
}

// Event listener para o formulário de busca
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
        showSearchResults(searchTerm);
    } else {
        showDefaultView(); // Se a busca for vazia, volta para a tela inicial
    }
    searchInput.value = ''; // Limpa o input
});

// Carregamento inicial
document.addEventListener('DOMContentLoaded', showDefaultView);
