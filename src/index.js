import {
  error,
  defaultModules,
} from "/node_modules/@pnotify/core/dist/PNotify.js";
import * as PNotifyMobile from "/node_modules/@pnotify/mobile/dist/PNotifyMobile.js";
defaultModules.set(PNotifyMobile, {});

import _ from "lodash";
const input = document.querySelector("#search-input");
const certanlyItems = document.querySelector("#certanly-items");
const onlyItem = document.querySelector("#only-item");
const lotResult = document.querySelector("#lotresult");
const noResult = document.querySelector("#noresult");

input.addEventListener(
  "input",
  _.debounce(() => {
    const userCountry = input.value;
    fetch("https://restcountries.com/v3.1/all")
      .then((resolve) => resolve.json())
      .then((countries) => {
        const filteredCountries = countries.filter((country) =>
          country.name.common.toLowerCase().includes(userCountry.toLowerCase())
        );
        if (filteredCountries.length > 10) {
          setALotItems();
        } else if (
          filteredCountries.length <= 10 &&
          filteredCountries.length > 1
        ) {
          setCertanlyItems(filteredCountries);
        } else if (filteredCountries.length === 1) {
          setOnlyItem(filteredCountries);
        } else if (filteredCountries.length === 0) {
          setNoItem();
        }
        if (userCountry === "") {
          lotResult.classList.add("is-hidden");
          noResult.classList.add("is-hidden");
          onlyItem.classList.add("is-hidden");
          certanlyItems.classList.add("is-hidden");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, 500)
);

function setCertanlyItems(countries) {
  lotResult.classList.add("is-hidden");
  noResult.classList.add("is-hidden");
  onlyItem.classList.add("is-hidden");
  certanlyItems.classList.remove("is-hidden");
  certanlyItems.innerHTML = "";
  countries
    .map((country) => country.name.common)
    .forEach((name) => {
      certanlyItems.insertAdjacentHTML(
        "beforeend",
        `<li class="category__item">${name}</li>`
      );
    });
}

function setOnlyItem(contries) {
  const [contry] = contries;
  lotResult.classList.add("is-hidden");
  noResult.classList.add("is-hidden");
  onlyItem.classList.remove("is-hidden");
  certanlyItems.classList.add("is-hidden");
  onlyItem.querySelector("#img").src = contry.flags.png;
  onlyItem.querySelector("#img").alt = contry.name.common;
  onlyItem.querySelector("#name").textContent = contry.name.common;
  onlyItem.querySelector("#capital").textContent = contry.capital[0];
  onlyItem.querySelector("#population").textContent = contry.population;
  onlyItem.querySelector("#languages").innerHTML = "";
  Object.values(contry.languages).forEach((lang) => {
    onlyItem
      .querySelector("#languages")
      .insertAdjacentHTML(
        "beforeend",
        `<li class="category__subitem">${lang}</li>`
      );
  });
}

function setALotItems() {
  error({
    text: "There too many countries like this",
  });
  lotResult.classList.remove("is-hidden");
  noResult.classList.add("is-hidden");
  onlyItem.classList.add("is-hidden");
  certanlyItems.classList.add("is-hidden");
}

function setNoItem() {
  lotResult.classList.add("is-hidden");
  noResult.classList.remove("is-hidden");
  onlyItem.classList.add("is-hidden");
  certanlyItems.classList.add("is-hidden");
}
