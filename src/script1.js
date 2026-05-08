import debounce from "../node_modules/lodash.debounce/index.js";

import { error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

const input = document.getElementById("search-box");
const results = document.getElementById("results");  // get elements from html & assign to varaibles

input.addEventListener("input", (e) => {
    console.log(e.target.value);
});


function fetchCountries(searchQuery) {
    return fetch(`https://restcountries.com/v2/name/${searchQuery}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("No country found");
        }
        return response.json();
    })
}

function clearResults() {
    results.innerHTML = "";
}

function renderList(countries) {
    results.innerHTML = countries
    .map(country => `<li>${country.name}</li>`)
    .join("");
}

function renderCard(country) {
    results.innerHTML = `
    <h2>${country.name}</h2>
    <p>Capital: ${country.capital}</p>
    <p>Population: ${country.population}</p>
    <p>Languages: ${country.languages.map(l => l.name).join(", ")}</p>
    <img src="${country.flag}" width="120" />
    `;
}

function showTooMany () {
  error({
    text: "Too many matches found. Please enter a more specific query!"
  });
}

input.addEventListener(
  "input",
  debounce(handleInput, 500)
);

function handleInput(e) {
  const value = e.target.value.trim();

  if (!value) {
    clearResults();
    return;
  }

  fetchCountries(value)
    .then(countries => {
      clearResults();

      if (countries.length > 10) {
        showTooMany();
        return;
      }

      if (countries.length >= 2) {
        renderList(countries);
        return;
      }

      renderCard(countries[0]);
    })
    .catch(err => {
      clearResults();
      console.log(err);
    });
}