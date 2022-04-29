// Вы можете указать, какие плагины Вам нужны
// import { Tooltip, Toast, Popover } from 'bootstrap';

// ./node_modules/bootstrap/scss/bootstrap.scss';
// import 'bootstrap/scss/bootstrap.scss';

// import 'bootstrap';
// import * as bootstrap from 'bootstrap';
import _ from 'lodash';
import i18next from 'i18next';
// import {
//   object, string, number, date, InferType,
// } from 'yup';
import * as yup from 'yup';

import ru from './locales/ru';
// import en from './locales/en';
import render from './view';

// const runApp = () => {
//   const i18nextInstance = i18next.createInstance();
//   i18nextInstance.init({
//     // lng: state.lng,
//     fallbackLng: ['ru', 'en'],
//     // lng: 'ru',
//     debug: true,
//     resources: {
//       ru,
//       en,
//     },
//   });

// const ruBtn = document.querySelector('.ru-lang');
// const enBtn = document.querySelector('.en-lang');

// ruBtn.addEventListener('click', () => {
//   i18nextInstance.changeLanguage('ru');

//   const title = document.querySelector('.form-container__title');
//   title.textContent = i18nextInstance.t('header.title');
// });

// enBtn.addEventListener('click', () => {
//   i18nextInstance.changeLanguage('en');
//   const title = document.querySelector('.form-container__title');
//   title.textContent = i18nextInstance.t('header.title');
// });

const userSchema = yup.object().shape({
  url: yup.string().url(),
});

const state = {
  rssForm: {
    valid: null,
    errors: [],
  },
  siteStorage: [],
};

const formElement = document.querySelector('.rss-form');
// const input = document.querySelector('.form-control');

const runApp = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const siteText = (i18n) => {
    const title = document.querySelector('.form-container__title');
    const description = document.querySelector('.form-container__description');
    const label = document.querySelector('.form-container__label');
    const example = document.querySelector('.form-container__example');
    const button = document.querySelector('.form-container__btn');

    title.textContent = i18n.t('header.title');
    description.textContent = i18n.t('header.description');
    label.textContent = i18n.t('header.label');
    example.textContent = i18n.t('header.example');
    button.textContent = i18n.t('formRss.button');
  };

  siteText(i18nextInstance);

  const watchedState = render(state, i18nextInstance);

  const handle = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    userSchema
      .validate(data)
      .then((value) => {
        if (_.indexOf(watchedState.siteStorage, data.url) === -1) {
          watchedState.siteStorage.push(data.url);
          watchedState.rssForm.valid = true;
          // watchedState.rssForm.errors = [];
          console.log(state.siteStorage, 'storage view');
        } else {
          watchedState.rssForm.valid = false;
          watchedState.rssForm.errors.push(`duplicate ${data.url}`);
          console.log(state.rssForm.errors);
        }
        console.log(value, 'value');
      })

      .catch((err) => {
        // console.log(err, 'error catch');
        watchedState.rssForm.valid = false;
        watchedState.rssForm.errors.push(`${err} ${data.url}`);
        console.log(state.rssForm.errors);
      });

    const formInput = document.querySelector('#url-input');
    // formInput.value = '';
    formInput.focus();
  };

  formElement.addEventListener('submit', handle);
  // app(i18nextInstance);
};

// export default formElement.addEventListener('submit', handle);
export default runApp;
