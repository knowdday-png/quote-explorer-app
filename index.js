// const API_KEY = "oqs36QGq77pG0gWpe7kPEQ==xt2briaYzow8qNKu";
const QUOTES_API = "https://api.api-ninjas.com/v2/randomquotes";
const favoritesQuotes = "favorites";
const API_KEY = "oqs36QGq77pG0gWpe7kPEQ==xt2briaYzow8qNKu";

// const API_KEY = process-env.env.API_KEY;
//get elements needed
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const getQuoteBtn = document.getElementById("get-quote");
const saveQuoteBtn = document.getElementById("save-quote");
const favoritesList = document.getElementById("favorites-list");
const clearBtn = document.getElementById("clear-favorites");

//If we have any saved/favorite quotes, load them up
let favorites = JSON.parse(localStorage.getItem(favoritesQuotes)) || [];

//Function to get quotes

//await tells the function that a result will be returned/an execution would complete, but not right now
async function fetchQuote() {
	const result = await fetch(QUOTES_API, {
		headers: {
			"X-Api-Key": API_KEY,
		},
	});
	const data = await result.json();
	// // console.log(data);
	// quoteText.textContent = "something";
	quoteText.textContent = `${data[0].quote}`;
	quoteAuthor.textContent = ` -- ${data[0].author}`;
}

//show favorite quotes
function renderFavorites() {
	favoritesList.innerHTML = "";
	favorites.forEach((quote, index) => {
		const li = document.createElement("li");
		const quoteText = document.createElement("p");
		const quoteAuthor = document.createElement("p");
		li.className =
			"list-group-item d-flex justify-content-between align-items-center";
		// li.textContent = quote;
		quoteText.textContent = quote.text;
		quoteAuthor.textContent = quote.author;
		const delBtn = document.createElement("button");
		delBtn.textContent = "Delete";
		delBtn.className = "btn btn-sm btn-outline-danger";
		delBtn.addEventListener("click", () => {
			favorites.splice(index, 1);
			localStorage.setItem(favoritesQuotes, JSON.stringify(favorites));
			renderFavorites();
		});

		li.appendChild(quoteText);
		li.appendChild(quoteAuthor);
		li.appendChild(delBtn);
		favoritesList.appendChild(li);
	});
}

getQuoteBtn.addEventListener("click", async () => {
	await fetchQuote();
});

//saving quotes to favorites
saveQuoteBtn.addEventListener("click", () => {
	const currentQuoteText = quoteText.textContent;
	const currentQuoteAuthor = quoteAuthor.textContent;
	const currentQuote = {
		text: currentQuoteText,
		author: currentQuoteAuthor,
	};
	console.log(favorites);
	if (favorites.length == 0 || favorites == null) {
		favorites = [];
		favorites.push(currentQuote);
	} else if (
		currentQuoteAuthor &&
		currentQuoteText &&
		!checkDuplicate(favorites, currentQuote)
	) {
		favorites.push(currentQuote);
	}
	localStorage.setItem(favoritesQuotes, JSON.stringify(favorites));
	renderFavorites();
});

function checkDuplicate(favoriteList, currentQuote) {
	for (let i = 0; i < favoriteList.length; i++) {
		if (
			currentQuote.text == favoriteList[i].text &&
			currentQuote.author == favoriteList[i].author
		) {
			return true;
		}
	}
	return false;
}

//clear favorites
clearBtn.addEventListener("click", () => {
	favorites = [];
	localStorage.removeItem(favoritesQuotes);
	renderFavorites();
});

renderFavorites();