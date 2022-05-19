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
import axios from 'axios';

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
  postsTitle: [],
  posts: [],
  feed: [],
  visitedLink: [],
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

  const parser = (data) => {
    const parse = new DOMParser();
    return parse.parseFromString(data, 'application/xml');
  };

  const parseFeed = (dom) => ({
    title: dom.querySelector('title').textContent,
    description: dom.querySelector('description').textContent,
    id: _.uniqueId('idFeed_'),
  });

  const parsePost = (dom) => {
    const items = dom.querySelectorAll('item');
    return Array.from(items).map((item) => ({
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
      id: _.uniqueId('idPost_'),
    }));
  };

  const parsePostTitle = (dom) => {
    const items = dom.querySelectorAll('item');
    return Array.from(items).map((item) => (
      item.querySelector('title').textContent));
  };

  const listenRss = (value) => {
    const promises = value.siteStorage.map((url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`).catch((e) => console.log(e)));
    const results = Promise.all(promises);
    results.then((responses) => {
      responses.forEach((response) => {
        if (response) {
          const dom = parser(response.data.contents);
          const post = parsePost(dom);
          post.map((item) => {
            console.log('listen post state', state.posts);
            if (!watchedState.postsTitle[0].includes(item.title)) {
              watchedState.posts.push([item]);
              watchedState.postsTitle[0].push(item.title);
              console.log('!arrrrrrr', state.postsTitle);
            }
          });
        }
      });
    }).then(() => setTimeout(() => listenRss(value), 5000));
  };

  const handle = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    userSchema
      .validate(data)
      .then((result) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(result.url)}`))
      .then((value) => {
        const dom = parser(value.data.contents);

        const feed = parseFeed(dom);
        const post = parsePost(dom);
        const postTitle = parsePostTitle(dom);

        console.log('feed', feed);
        console.log('post', post);
        console.log('postTitle', postTitle);
        // console.log('postArray.description', postArray[0].description);
        // console.log('postArray.link', postArray.link);

        // const { feed, posts } = value.data.contents;
        // console.log('feed', feed);
        // console.log('posts', posts);

        if (_.indexOf(watchedState.siteStorage, data.url) === -1) {
          watchedState.siteStorage.push(data.url);

          // const arr1 = watchedState.state.posts[0];
          // const arr2 = post;
          // const unArr = arr1.concat(arr2);

          watchedState.posts.push(post);
          watchedState.postsTitle.push(postTitle);
          watchedState.feed.push(feed);
          watchedState.rssForm.valid = true;
          // watchedState.rssForm.errors = [];
          console.log('storage view', state.siteStorage);
          console.log('feed state', state.feed);
          console.log('post state', state.posts);
          console.log('postsTitle state', state.postsTitle);
        } else {
          watchedState.rssForm.valid = false;
          watchedState.rssForm.errors.push(`duplicate ${data.url}`);
          console.log(state.rssForm.errors);
        }
        // console.log('value', value);
      })

      .catch((err) => {
        // console.log(err, 'error catch');
        watchedState.rssForm.valid = false;
        watchedState.rssForm.errors.push(`errrrrrrrrr ${err} ${data.url}`);
        console.log(state.rssForm.errors);
      });

    listenRss(watchedState);
    const formInput = document.querySelector('#url-input');
    // formInput.value = '';
    formInput.focus();
  };

  formElement.addEventListener('submit', handle);
  // app(i18nextInstance);
};

// export default formElement.addEventListener('submit', handle);
export default runApp;
