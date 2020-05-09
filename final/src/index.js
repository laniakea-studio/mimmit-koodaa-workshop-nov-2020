// Briefly what is this file doing

const API_URL = "https://api.pokemontcg.io/v1/cards?name=";

const favouritesSection = document.getElementById("favourites");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("submit-search");
const loader = document.getElementById("loader");
const resultsSection = document.getElementById("results");
const cardList = document.getElementById("card-list");

const searchCards = event => {
  // this prevents the default behavior of submitting a form
  event.preventDefault();

  cardList.innerHTML = "";
  loader.classList.remove("hidden");
  results.classList.add("hidden");

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

            ///
            const addToFavouritesButton = document.createElement("button");
            addToFavouritesButton.innerText = "Add to favourites";
            addToFavouritesButton.classList.add("add-to-favourites");
            addToFavouritesButton.dataset.cardImageUrl = card.imageUrl;
            addToFavouritesButton.dataset.cardName = card.name;
            addToFavouritesButton.dataset.cardSet = card.set;
            addToFavouritesButton.addEventListener(
              "click",
              addToFavourites,
              false
            );
            listItem.append(addToFavouritesButton);

            return listItem;
          });
          listItems.forEach(item => cardList.append(item));
        } else {
          const noCardsMessage = document.createElement("p");
          noCardsMessage.innerHTML = `Cannot find pokémon cards for '<i>${searchInput.value}</i>'`;
          cardList.append(noCardsMessage);
        }
        loader.classList.add("hidden");
        results.classList.remove("hidden");
      });
  } else {
    const minimumCharactersMessage = document.createElement("p");
    minimumCharactersMessage.innerHTML = `Please enter at least three letters (you searched for '<i>${searchInput.value}</i>').`;
    cardList.append(minimumCharactersMessage);

    loader.classList.add("hidden");
    results.classList.remove("hidden");
  }
};

const getCurrentFavourites = () => {
  return JSON.parse(localStorage.getItem("favouriteCardsList"));
};

const addToFavourites = event => {
  const favouriteCardsList = getCurrentFavourites() || [];
  const selectedCardButton = event.target;
  const newCard = {
    name: selectedCardButton.dataset.cardName,
    set: selectedCardButton.dataset.cardSet,
    imageUrl: selectedCardButton.dataset.cardImageUrl
  };

  favouriteCardsList.push(newCard);

  // update the information saved locally
  localStorage.setItem(
    "favouriteCardsList",
    JSON.stringify(favouriteCardsList)
  );
};

const showFavourites = () => {
  loader.classList.remove("hidden");
  cardList.innerHTML = "";
  favouritesSection.classList.add("hidden");
  const favouriteCardsList = getCurrentFavourites() || [];

  console.log(favouriteCardsList);
  if (favouriteCardsList.length > 0) {
    const listItems = favouriteCardsList.map(function(card) {
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
    loader.classList.add("hidden");
    favouritesSection.classList.remove("hidden");
  } else {
    const noFavouritesCards = document.createElement("p");
    noFavouritesCards.innerHTML = `You have no favourite cards yet.`;
    cardList.append(noFavouritesCards);

    loader.classList.add("hidden");
    favouritesSection.classList.remove("hidden");
  }
};

if (searchButton) searchButton.addEventListener("click", searchCards);

if (favouritesSection)
  document.addEventListener("DOMContentLoaded", showFavourites);
