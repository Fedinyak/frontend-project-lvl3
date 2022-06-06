import _ from 'lodash';
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import ru from './locales/ru';
import view from './view';
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
  visitedPost: [],
};

const formElement = document.querySelector('.rss-form');

const parser = (data) => {
  const parse = new DOMParser();
  const dom = parse.parseFromString(data, 'application/xml');

  if (dom.querySelector('parsererror')) {
    const error = new Error(
      `invalidRss: ${dom.querySelector('parsererror').textContent}`,
    );
    error.invalidRss = true;
    throw error;
  }

  return dom;
};

const parseFeed = (dom) => ({
  title: dom.querySelector('title').textContent,
  description: dom.querySelector('description').textContent,
});

const parsePost = (dom) => {
  const result = [];
  const items = dom.querySelectorAll('item');
  items.forEach((item) => {
    const post = {
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    };
    result.push(post);
  });
  return result;
};

const addId = (posts) => {
  const result = [];
  posts.forEach((post) => {
    const id = _.uniqueId('idPost_');
    result.push({ ...post, id });
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

  const watchedState = view(state, i18nextInstance);

  const listenRss = (value) => {
    const promises = value.siteStorage.map((url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`).catch(() => null));
    const results = Promise.all(promises);
    results.then((responses) => {
      responses.forEach((response) => {
        if (response) {
          const dom = parser(response.data.contents);
          const parsedPost = parsePost(dom);
          const post = addId(parsedPost);
          const currentPost = watchedState.posts.map((items) => items.title);
          post.forEach((item) => {
            if (!currentPost.includes(item.title)) {
              watchedState.posts = [...watchedState.posts, item];
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
        const parsedPost = parsePost(dom);
        const post = addId(parsedPost);

        if (_.indexOf(watchedState.siteStorage, data.url) === -1) {
          watchedState.siteStorage.push(data.url);
          watchedState.posts = [...post, ...watchedState.posts];
          watchedState.feed.push(feed);
          watchedState.rssForm.valid = 'valid';
        } else if (watchedState.siteStorage.includes(data.url)) {
          watchedState.rssForm.valid = 'duplicate';
          watchedState.rssForm.errors.push(`duplicate ${data.url}`);
        }
      })

      .catch((err) => {
        if (err.invalidRss) {
          watchedState.rssForm.valid = 'invalidRss';
          watchedState.rssForm.errors.push(`invalid RSS ${err} ${data.url}`);
        } else if (err.isAxiosError) {
          watchedState.rssForm.valid = 'network';
          watchedState.rssForm.errors.push(`error network ${err} ${data.url}`);
        } else {
          watchedState.rssForm.valid = 'error';
          watchedState.rssForm.errors.push(`error ${err} ${data.url}`);
        }
      });

    const formInput = document.querySelector('#url-input');

    formInput.focus();
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

// ------------------------ тестовые кнопки
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
// ------------------------ тестовые кнопки

export default runApp;
