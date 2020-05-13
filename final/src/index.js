// Briefly what is this file doing

const API_URL = "https://api.pokemontcg.io/v1/cards?name=";

const loaderSection = document.getElementById("loader");
const resultsSection = document.getElementById("results");
const favouritesSection = document.getElementById("favourites");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("submit-search");

const cardList = document.getElementById("card-list");

const searchCards = event => {
  // this prevents the default behavior of submitting a form
  event.preventDefault();

  cardList.innerHTML = "";
  loaderSection.classList.remove("hidden");
  resultsSection.classList.add("hidden");

  // let's check before that we have written anything in the input before trying to send a request
  if (searchInput.value.length >= 3) {
    // we could also do more checkings on what has been written
    fetch(`${API_URL}${searchInput.value}`)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        // let's read from our response the array of cards
        let cards = json.cards;

        if (cards.length > 0) {
          const listItems = cards.map(function(card) {
            const listItem = document.createElement("li");
            const cardImage = document.createElement("img");
            const cardTitle = document.createElement("h3");
            cardImage.src = card.imageUrl;
            cardImage.alt = `${card.name} from ${card.set}`;
            cardTitle.innerText = `${card.name} from ${card.set}`;

            listItem.append(cardImage);
            listItem.append(cardTitle);

            return listItem;
          });
          listItems.forEach(item => cardList.append(item));
        } else {
          const noCardsMessage = document.createElement("p");
          noCardsMessage.innerHTML = `Cannot find pokémon cards for '<i>${searchInput.value}</i>'`;
          cardList.append(noCardsMessage);
        }
        loaderSection.classList.add("hidden");
        resultsSection.classList.remove("hidden");
      });
  } else {
    const minimumCharactersMessage = document.createElement("p");
    minimumCharactersMessage.innerHTML = `Please enter at least three letters (you searched for '<i>${searchInput.value}</i>').`;
    cardList.append(minimumCharactersMessage);

    loaderSection.classList.add("hidden");
    resultsSection.classList.remove("hidden");
  }
};

if (searchButton) searchButton.addEventListener("click", searchCards);
