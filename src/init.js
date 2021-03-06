import _ from 'lodash';
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import ru from './locales/ru';
import view from './view';
import parse from './parser';
// ---------------------- Language test
// import en from './locales/en';
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

// ---------------------- Language test

const getUrl = (url) => {
  const allorigins = new URL('https://allorigins.hexlet.app/get?disableCache=true&url=');
  allorigins.searchParams.set('url', url);
  return allorigins;
};

const addId = (posts) => {
  const result = posts.map((post) => {
    const id = _.uniqueId('idPost_');
    return { ...post, id };
  });
  return result;
};

const runApp = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const state = {
    rssForm: {
      process: 'ready',
      error: null,
    },
    postsTitle: [],
    posts: [],
    feeds: [],
    visitedPost: [],
  };

  const validateData = (data, feeds) => {
    const curretUrls = feeds.map((item) => item.url);
    const userSchema = yup.object().shape({
      url: yup
        .string()
        .url('invalid')
        .notOneOf(curretUrls, 'duplicate'),
    });

    return userSchema.validate(data);
  };

  const formElement = document.querySelector('.rss-form');

  const initView = (i18n) => {
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

  initView(i18nextInstance);

  const watchedState = view(state, i18nextInstance);

  const listenRss = (value) => {
    const curretUrls = value.feeds.map((item) => item.url);
    const promises = curretUrls.map((url) => axios.get(getUrl(url)).catch(() => null));
    const results = Promise.all(promises);
    results.then((responses) => {
      responses.forEach((response) => {
        if (response) {
          const content = parse(response.data.contents);
          const posts = addId(content.posts);
          const currentPost = watchedState.posts.map((items) => items.title);
          const newPost = posts.filter((item) => (!currentPost.includes(item.title)));
          watchedState.posts = [...watchedState.posts, ...newPost];
        }
      });
    }).then(() => setTimeout(() => listenRss(value), 5000));
  };

  const handle = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    watchedState.rssForm.process = 'addFeeds';
    validateData(data, watchedState.feeds)
      .then((result) => axios.get(getUrl(result.url)))
      .then((value) => {
        const content = parse(value.data.contents, data.url);
        const posts = addId(content.posts);
        watchedState.posts = [...posts, ...watchedState.posts];
        watchedState.feeds.push(content.feeds);
        watchedState.rssForm.process = 'successfully';
        watchedState.rssForm.error = null;
      })
      .catch((err) => {
        if (err.invalidRss) {
          watchedState.rssForm.error = 'invalidRss';
          watchedState.rssForm.process = 'failure';
        } else if (err.isAxiosError) {
          watchedState.rssForm.error = 'network';
          watchedState.rssForm.process = 'failure';
        } else {
          watchedState.rssForm.error = err.message;
          watchedState.rssForm.process = 'failure';
        }
        // https://github.com/Fedinyak/frontend-project-lvl3/blob/6b9d941c367bf09075ed22f3793ff89ccd27aef2/src/init.js#L145-L154 -
        // ???????????????????? ?????? ?????????? ???????????? ?????????????????? ?????????? ???? ?????????????????????????
        // ???????????? ???? ???? ????????????????, ?????????? ???????????????? ???????????????????????? ?????? ???????????? ?????????????????? ???? ????????????????.
        // ---------------------------------------------
        // ?????? ?????????????????? ?????????????????? ?????? ???????????? ?????? ?????????????? ???? ???????????? ????????????????,
        // ????????????????: ???????????? ???????????? ???????? ???????????????? URL?? 'RSS ?????? ????????????????????',
        // '???????????? ????????','???????????? ???? ???????????????? ???????????????? RSS'.
        // ?????? ???????????? ???????????? ???????????????????????? ???????????? ???????? ??????-???? ???????
      });
  };
  listenRss(watchedState);

  formElement.addEventListener('submit', handle);
  // app(i18nextInstance);
  const buttons = document.querySelector('.content__posts');
  buttons.addEventListener('click', (event) => {
    if (event.target.dataset.id) {
      watchedState.visitedPost.push(event.target.dataset.id);
    }
  });
};

// ------------------------ ???????????????? ????????????
// const buttonPlace = document.querySelector('.rss-form');
// const formInput = document.querySelector('#url-input');
// const button1 = document.createElement('button');
// const button2 = document.createElement('button');
// const button3 = document.createElement('button');
// button1.textContent = 'lorem-rss';
// button2.textContent = 'Hexlet';
// button3.textContent = 'birman';
// button1.className = 'btn btn-outline-primary';
// button2.className = 'btn btn-outline-primary';
// button3.className = 'btn btn-outline-primary';
// const div = document.createElement('div');
// div.className = 'row justify-content-end';
// const div8 = document.createElement('div');
// div8.className = 'col-6';
// div.append(div8);
// div8.append(button1);
// div8.append(button2);
// div8.append(button3);
// buttonPlace.append(div);
// button1.addEventListener('click', () => {
//   formInput.value = 'https://lorem-rss.herokuapp.com/feed?unit=second&interval=10';
// });
// button2.addEventListener('click', () => {
//   formInput.value = 'https://ru.hexlet.io/lessons.rss';
// });
// button3.addEventListener('click', () => {
//   formInput.value = 'http://ilyabirman.ru/meanwhile/rss/';
// });
// ------------------------ ???????????????? ????????????

export default runApp;
