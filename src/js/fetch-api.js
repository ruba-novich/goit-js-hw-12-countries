import '../css/styles.css';

import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';

import countriesList from '../templates/country-list.hbs';
import countryCard from '../templates/country-card.hbs';
import API from './api-service';
import getRefs from './get-refs';

const debounce = require('lodash.debounce');
const refs = getRefs(); 

refs.input.addEventListener('input', debounce(onSearch, 800));

function onSearch(e) {
  e.preventDefault();
  console.log(e.target.value);
  
  if (!e.target.value) {
    onCleanerlist()
    return;
  }
   if (e.target.value !== '') {
    API.fetchCountries(e.target.value)
    .then(renderСondition)
    .catch(onFetchError)
   } else {
    onSearchError
   }
  
  }

function renderСondition (countries) {
  
  if (countries.length > 10) {
    onSearchError();
    onCleanerlist() 
    return
  }
  
  if (countries.length >= 2 && countries.length <= 10) {
    renderCountriesList(countries)
    return
  } 
   
  if (countries.length ===1) {
    renderCountryCard(countries)
    return
  }
  
}

function onFetchError() {
  onCleanerlist()
  error({
    title: 'Fetch Error',
    text: 'The country for your request was not found. Please try again'
  });
}

function onSearchError() {
  error({
    title: 'Search Error',
    text: 'Too many matches found. Please enter a more specific query!'
  });
}

function renderCountriesList(countries) {
  const markupList = countriesList(countries);
  onCleanerlist()
  refs.output.insertAdjacentHTML('beforeend', markupList);
}

function renderCountryCard(countries) {
  const markupCard = countryCard(countries);
  onCleanerlist()
  refs.output.insertAdjacentHTML('beforeend', markupCard);
}

function onCleanerlist() {
  refs.output.innerHTML = '';
}
