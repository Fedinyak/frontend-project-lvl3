import _ from 'lodash';
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import ru from './locales/ru';
import render from './view';
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
  return parse.parseFromString(data, 'application/xml');
};

const parseFeed = (dom) => ({
  title: dom.querySelector('title').textContent,
  description: dom.querySelector('description').textContent,
  // id: _.uniqueId('idFeed_'),
});

// const parsePost = (dom) => {
//   const items = dom.querySelectorAll('item');
//   return Array.from(items).map((item) => ({
//     title: item.querySelector('title').textContent,
//     description: item.querySelector('description').textContent,
//     link: item.querySelector('link').textContent,
//     // id: _.uniqueId('idPost_'),
//   }));
// };

const parsePost = (dom) => {
  const result = [];
  const items = dom.querySelectorAll('item');
  items.forEach((item) => {
    const post = {
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
      // id: _.uniqueId('idPost_'),
    };
    // state.posts = [post, state.posts];
    // state.posts.push(post);
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

  const watchedState = render(state, i18nextInstance);

  // const parsePostTitle = (dom) => {
  //   const items = dom.querySelectorAll('item');
  //   return Array.from(items).map((item) => (
  //     item.querySelector('title').textContent));
  // };

  // const listenRss = (value) => {
  //   // const state = value;

  //   const promises = value.siteStorage.map((url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`).catch((e) => console.log(e)));
  //   const results = Promise.all(promises);
  //   results.then((responses) => {
  //     responses.forEach((response) => {
  //       if (response) {
  //         const dom = parser(response.data.contents);
  //         const post = parsePost(dom);
  //         const currentPost = watchedState.posts.map((items) => items.map((item) => item.title));
  //         // const currentPost = watchedState.posts.map((items) => items.map((item) => item.title));
  //         console.log(currentPost);
  //         post.forEach((item) => {
  //           if (!currentPost[0].includes(item.title)) {
  //             // watchedState.posts.push(item);
  //             watchedState.posts[0].push([item]);
  //             // console.log(item);
  //           }
  //         });
  //       }
  //     });
  //   // }).then(() => setTimeout(listenRss, 5000));
  //   }).then(() => setTimeout(() => listenRss(value), 5000));
  // };

  const listenRss = (value) => {
    // const state = value;
    const promises = value.siteStorage.map((url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`).catch((e) => console.log(e)));
    const results = Promise.all(promises);
    results.then((responses) => {
      responses.forEach((response) => {
        if (response) {
          const dom = parser(response.data.contents);
          // const post = parsePost(dom);
          const parsedPost = parsePost(dom);
          // console.log('postP', postP);
          const post = addId(parsedPost);
          const currentPost = watchedState.posts.map((items) => items.title);
          // const currentPost = watchedState.posts.map((items) => items.map((item) => item.title));
          // console.log(currentPost);
          post.forEach((item) => {
            if (!currentPost.includes(item.title)) {
              // watchedState.posts.push(item);
              // console.log(item);
              watchedState.posts = [...watchedState.posts, item];
            }
          });
          // const buttons = document.querySelectorAll('.btn-sm');
          // buttons.forEach((button) => {
          //   button.addEventListener('click', (event) => {
          //     watchedState.visitedPost.push(event.target.dataset.id);
          //     console.log(watchedState.visitedPost);
          //   });
          // });
        }
      });
    // }).then(() => setTimeout(listenRss, 5000));
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
        // console.log('postP', postP);
        const post = addId(parsedPost);

        // const post = parsePost(dom);
        // const postTitle = parsePostTitle(dom);

        if (_.indexOf(watchedState.siteStorage, data.url) === -1) {
          watchedState.siteStorage.push(data.url);
          // watchedState.posts.push(post);
          watchedState.posts = [...post, ...watchedState.posts];
          // watchedState.postsTitle.push(postTitle);
          // console.log('watchedState.posts', watchedState.posts);
          watchedState.feed.push(feed);
          watchedState.rssForm.valid = 'valid';

          // const buttons = document.querySelectorAll('.btn-sm');
          // buttons.forEach((button) => {
          //   button.addEventListener('click', (event) => {
          //     watchedState.visitedPost.push(event.target.dataset.id);
          //     console.log(watchedState.visitedPost);
          //   });
          // });
        } else if (watchedState.siteStorage.includes(data.url)) {
          watchedState.rssForm.valid = 'duplicate';
          watchedState.rssForm.errors.push(`duplicate ${data.url}`);
          console.log(state.rssForm.errors);
        }
      })

      .catch((err) => {
        watchedState.rssForm.valid = 'error';
        watchedState.rssForm.errors.push(`errrrrrrrrr ${err} ${data.url}`);
        console.log(state.rssForm.errors);
      });

    const formInput = document.querySelector('#url-input');

    // formInput.value = '';
    formInput.focus();
  };
  listenRss(watchedState);

  // const buttons = document.querySelectorAll('.btn-sm');
  // buttons.forEach((button) => {
  //   button.addEventListener('click', (event) => {
  //     watchedState.visitedPost.push(event.target.dataset.id);
  //     console.log(watchedState.visitedPost);
  //   });
  // });

  formElement.addEventListener('submit', handle);
  // app(i18nextInstance);
  // const buttons = document.querySelector('li');
  const buttons = document.querySelector('.content__posts');
  buttons.addEventListener('click', (event) => {
    if (event.target.dataset.id) {
      watchedState.visitedPost.push(event.target.dataset.id);
      console.log(watchedState.visitedPost);
    }
  });
};

// ------------------------ тестовые кнопки
const buttonPlace = document.querySelector('.rss-form');
const formInput = document.querySelector('#url-input');
const button1 = document.createElement('button');
const button2 = document.createElement('button');
const button3 = document.createElement('button');
button1.textContent = 'lorem-rss';
button2.textContent = 'Hexlet';
button3.textContent = 'birman';
button1.className = 'btn btn-outline-primary';
button2.className = 'btn btn-outline-primary';
button3.className = 'btn btn-outline-primary';
const div = document.createElement('div');
div.className = 'row justify-content-end';
const div8 = document.createElement('div');
div8.className = 'col-6';
div.append(div8);
div8.append(button1);
div8.append(button2);
div8.append(button3);
buttonPlace.append(div);
button1.addEventListener('click', () => {
  formInput.value = 'https://lorem-rss.herokuapp.com/feed?unit=second&interval=10';
});
button2.addEventListener('click', () => {
  formInput.value = 'https://ru.hexlet.io/lessons.rss';
});
button3.addEventListener('click', () => {
  formInput.value = 'http://ilyabirman.ru/meanwhile/rss/';
});
// ------------------------ тестовые кнопки

// export default formElement.addEventListener('submit', handle);
export default runApp;
