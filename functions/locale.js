// The lang our app first shows
const localesData = {
  "ru": {
    "app-title": "Сканер QR кодов",
  },
  "en": {
    "app-title": "Scan QR Code",
  },
  "tr": {
    "app-title": "QR Kodunu Tarayın",
  }
};

window.localesData = localesData;

const defaultLocale = "en"
const supportedLocales = ["en", "ru", "tr"];

const fullyQualifiedLocaleDefaults = {
  en: "en-US",
  ru: "ru-RU",
  tr: "tr-TR"
};

// The active lang
let locale;

// Gets filled with active lang translations
let translations = {};

// When the page content is ready...
document.addEventListener("DOMContentLoaded", () => {

  let mayLanguage = (navigator.language || navigator.userLanguage).slice(0, 2);

  const initialLocale = supportedOrDefault(
    browserLocales(true),
  );

  if (!mayLanguage) mayLanguage = initialLocale;

  const curLocale = localStorage.getItem("locale");
  const finalLocale = curLocale ? curLocale : mayLanguage;

  setLocale(finalLocale);
  bindLocaleSwitcher(finalLocale);

});

// Load translations for the given lang and translate
// the page to this lang
async function setLocale(newLocale) {
  if (newLocale === locale) return;

  const newTranslations = localesData[newLocale];

  locale = newLocale;
  window.locale = locale;

  translations = newTranslations;
  document.documentElement.lang = newLocale;
  document.documentElement.dir = dir(newLocale);

  translatePage();
  console.log('saved', newLocale);
  localStorage.setItem("locale", newLocale);
}


function translatePage() {
  document
    .querySelectorAll("[data-i18n-key]")
    .forEach((el) => translateElement(el));
}

function translateElement(element) {
  const key = element.getAttribute("data-i18n-key");

  const options =
    JSON.parse(element.getAttribute("data-i18n-opt")) || {};

  element.innerText = translate(key, options);
  if (element.placeholder && !element.innerText) element.placeholder = translate(key, options);
}

function translate(key, interpolations = {}) {
  const message = translations[key];

  if (key.endsWith("-plural")) {
    return interpolate(
      pluralFormFor(message, interpolations.count),
      interpolations,
    );
  }

  return interpolate(message, interpolations);
}

// Convert a message like "Hello, {name}" to "Hello, Chad"
// where the given interpolations object is {name: "Chad"}
function interpolate(message, interpolations) {
  return Object.keys(interpolations).reduce(
    (interpolated, key) => {
      const value = formatDate(
        formatNumber(interpolations[key]),
      );

      return interpolated.replace(
        new RegExp(`{\s*${key}\s*}`, "g"),
        value,
      );
    },
    message,
  );
}

/*
  Given a value object like
  {
    "number" : 300000,
    "style": "currency",
    "currency": "EUR"
  } and that the current lang is en, returns "€300,000.00"
*/
function formatNumber(value) {
  if (typeof value === "object" && value.number) {
    const { number, ...options } = value;

    return new Intl.NumberFormat(
      fullyQualifiedLocaleDefaults[locale],
      options,
    ).format(number);
  } else {
    return value;
  }
}

/*
  Given a value object like
  {
    "date": "2021-12-05 15:29:00",
    "dateStyle": "long",
    "timeStyle": "short"
  } and that the current lang is en,
  returns "December 5, 2021 at 3:29 PM"
*/
function formatDate(value) {
  if (typeof value === "object" && value.date) {
    const { date, ...options } = value;

    const parsedDate =
      typeof date === "string" ? Date.parse(date) : date;

    return new Intl.DateTimeFormat(
      fullyQualifiedLocaleDefaults[locale],
      options,
    ).format(parsedDate);
  } else {
    return value;
  }
}

/*
  Given a forms object like
  {
    "zero": "No articles",
    "one": "One article",
    "other": "{count} articles"
  } and a count of 1, returns "One article"
*/
function pluralFormFor(forms, count) {
  const matchingForm = new Intl.PluralRules(locale).select(
    count,
  );

  return forms[matchingForm];
}

function isSupported(locale) {
  return supportedLocales.indexOf(locale) > -1;
}

// Retrieve the first lang we support from the given
// array, or return our default lang
function supportedOrDefault(locales) {
  return locales.find(isSupported) || defaultLocale;
}

function dir(locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

function bindLocaleSwitcher(initialValue) {
  const switcher = document.querySelector(
    "[data-i18n-switcher]",
  );

  switcher.value = initialValue;

  switcher.onchange = (e) => {
    setLocale(e.target.value);
  };
}

/**
 * Retrieve user-preferred locales from browser
 *
 * @param {boolean} languageCodeOnly - when true, returns
 * ["en", "fr"] instead of ["en-US", "fr-FR"]
 * @returns array | undefined
 */
function browserLocales(languageCodeOnly = false) {
  return navigator.languages.map((locale) =>
    languageCodeOnly ? locale.split("-")[0] : locale,
  );
}
