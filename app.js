

// Kopplar/ Hämtar de HTML element jag behöver
// Knapp, Sök & Resultat.

const searchButton = document.getElementById('searchButton');
const pokemonSearch = document.getElementById('pokemonSearch');
const pokemonResults = document.getElementById('pokemonResults');

// Sparar alla Pokémon som sökts
let pokemonsList = [];

// Kolla om det finns sparade Pokémon i localStorage
const saved = localStorage.getItem('savedPokemons');
if (saved) {
    pokemonsList = JSON.parse(saved); // konvertera tillbaka till array
    pokemonsList.forEach(p => showPokemon(p)); // visa dem
}


// Klicka på sök knappen
searchButton.addEventListener('click', () => {
    const pokemonName = pokemonSearch.value.toLowerCase();// Tar bort stora bokstäver så att söken är lättare
    if (!pokemonName) {
        pokemonResults.innerHTML = 'Prova att skriva ett namn först';
        return;
    }

    // API
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Hittar inte pokemon');
            }
            return response.json();
        })
        .then(data => {
            showPokemon(data);  // Visar pokemon direkt
            pokemonsList.push(data); // lägger till Pokémon i listan
            // Spara hela listan i localStorage
            localStorage.setItem('savedPokemons', JSON.stringify(pokemonsList));

        })
        .catch(error => {
            // Kolla om det redan finns ett felmeddelande
            let errorDiv = document.getElementById('errorMsg');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.id = 'errorMsg';
                errorDiv.style.color = 'red';
                pokemonResults.prepend(errorDiv); // lägger ovanför korten
            }
            errorDiv.textContent = error.message;
        });


});


function showPokemon(pokemon) {
    const name = pokemon.name;
    const id = pokemon.id;
    const image = pokemon.sprites.front_default;
    const type = pokemon.types.map(t => t.type.name).join(", ");
    const mainType = pokemon.types[0].type.name; // första typen bestämmer färg
    const abilities = pokemon.abilities.map(a => a.ability.name).join(", ");
    const height = pokemon.height;
    const weight = pokemon.weight;
    const stats = pokemon.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join(", ");

    // Typfärger
    const typeColors = {
        fire: '#F08030',
        water: '#6890F0',
        grass: '#78C850',
        electric: '#F8D030',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dark: '#705848',
        dragon: '#7038F8',
        steel: '#B8B8D0',
        fairy: '#EE99AC',
        normal: '#A8A878'
    };

    // Skapar kortet
    const card = document.createElement('div');
    card.className = 'card';
    card.style.borderColor = typeColors[mainType] || '#000'; // fallback till svart
    card.innerHTML = `
        <h2>${name}</h2>
        <img src="${image}" alt="${name}">
        <p><strong>Typ:</strong> ${type}</p>
        <p><strong>Abilities:</strong> ${abilities}</p>
        <p><strong>Height:</strong> ${height} | <strong>Weight:</strong> ${weight}</p>
        <p><strong>Stats:</strong> ${stats}</p>
    `;

    // Lägg till kortet i resultat-sektionen
    pokemonResults.appendChild(card);
}




// Hämta alla typ-knappar
const typeButtons = document.querySelectorAll('.typeBtn');

typeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedType = button.getAttribute('data-type');

        // Rensa error-meddelande
        const errorDiv = document.getElementById('errorMsg');
        if (errorDiv) errorDiv.textContent = '';

        // Visa alla Pokémon om selectedType är tom
        if (!selectedType) {
            pokemonResults.innerHTML = '';
            pokemonsList.forEach(p => showPokemon(p));
        } else {
            const filtered = pokemonsList.filter(p =>
                p.types.some(t => t.type.name.toLowerCase() === selectedType.toLowerCase())
            );
            pokemonResults.innerHTML = '';
            filtered.forEach(p => showPokemon(p));
        }
    });
});
