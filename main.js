const hero = document.querySelector(".hero");
const searchInput = document.querySelector("#searchInput");
const selectInput = document.querySelector("#selectInput");
let data = null;
let countries = "";

// function for fetching data from url
const fetchCountries = async (callback) => {
  const response = await fetch("https://restcountries.com/v3.1/all");
  if (response.status !== 200) {
    hero.innerHTML = "Something went wrong...";
    return;
  }
  data = await response.json();

  callback(data, showSingleCountryInfo, hideSingleCountryInfo);
};

// adding event listener to select element which updates onchange event, then filtering countries based on select value, in this case region and storing them in filterResult variable, then calling displayCountries and except for all data, we provide onliy filterResult array
selectInput.addEventListener("change", () => {
  let selectValue = selectInput.value.toLowerCase();

  if (data !== null) {
    let filterResult = data.filter((country) => {
      if (country.region.toLowerCase() === selectValue) {
        return country;
      }
    });
    countries = "";
    displayCountries(
      filterResult,
      showSingleCountryInfo,
      hideSingleCountryInfo
    );
  }
  if (selectValue === "") {
    displayCountries(data, showSingleCountryInfo, hideSingleCountryInfo);
  }
});

// basic search bar where we map through data to check if country name includes value from input field and then calling function to display them
const searchHandler = () => {
  let inputValue = searchInput.value;
  if (data !== null) {
    let searchResult = data.filter((country) => {
      return country.name.common
        .toLowerCase()
        .includes(inputValue.toLowerCase());
    });
    countries = "";
    displayCountries(
      searchResult,
      showSingleCountryInfo,
      hideSingleCountryInfo
    );
  }
};

// function for displaying each country which takes 3 parameter, first is data for us to map, second and third are functions for displaying or hiding more info holder
const displayCountries = (data, callback1, callback2) => {
  data.map((country) => {
    return (countries += `<div class='country__holder' onclick='showSingleCountryInfo()' >
        <img src=${country.flags.png} />
        <div class='country__info'>
          <h3>${country.name.common}</h3>
          <p><span>Population:</span> ${country.population}</p>
          <p><span>Region:</span> ${country.region}</p>
          ${
            country.capital
              ? `<p><span>Capital: </span> ${country.capital[0]}</p>`
              : "<p>No capital city</p>"
          }
        </div>
        
        <div class='more__info'> 
          <button class='hide__info'> Back </button>
          <div class='moreInfo__mainHolder'>
            <img src=${country.flags.svg} />
            <div class='moreInfo__infoHolder'> 
              <h1> ${country.name.common} </h1>
              <div class='flex__responsive'> 
               <div>
                  <p><span>Official Name: </span>${country.name.official} </p>
                  <p><span>Population: </span> ${country.population} </p>
                  <p><span>Region: </span> ${country.region} </p>
                  <p><span>Sub Region: </span> ${country.subregion}</p>
                  <p><span>Capital:</span> ${country.capital} </p>
               </div>
               <div>
                  <p><span>Top Level Domain: </span> ${country.tld} </p>
                  <p><span>Timezones: </span> ${country.timezones} </p>
                  <p><span>Languages: </span> ${
                    country.languages !== undefined
                      ? Object.values(country.languages)
                      : "This API do not have that info :("
                  }</p>
               </div>
              </div>
            <div class='flex__responsive' id='borders'> 
              <span>Border Countries: </span>
             <p>${country.borders} </p> 
            </div>
            </div>
          </div>
        </div>

      </div>`);
  });
  hero.innerHTML = countries;

  callback1();
  callback2();
};

// function which loops through all countries displayed and allows us to add event listener to each one of them, so we can show more info about each country
const showSingleCountryInfo = () => {
  const country = document.querySelectorAll(".country__holder");
  for (let i = 0; i < country.length; i++) {
    country[i].addEventListener("click", () => {
      if (country[i].classList.contains("hideMoreInfo")) {
        country[i].classList.remove("hideMoreInfo");
      }
      country[i].classList.add("showMoreInfo");
    });
  }
};

// function which loops through all hideInfo buttons and allows us to add event listener to each one of them, via event listener we collect parrent of the button which is in this case current country div and then we manipulate class of that element in order to hide or show something on the page
const hideSingleCountryInfo = () => {
  const hideInfoBtn = document.querySelectorAll(".hide__info");

  for (let i = 0; i < hideInfoBtn.length; i++) {
    hideInfoBtn[i].addEventListener("click", (e) => {
      const currentCountry = hideInfoBtn[i].parentNode.parentNode;
      currentCountry.addEventListener("click", () => {
        currentCountry.classList.remove("showMoreInfo");
        currentCountry.classList.add("hideMoreInfo");
      });
    });
  }
};

fetchCountries(displayCountries);
