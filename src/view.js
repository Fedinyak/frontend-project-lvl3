import onChange from 'on-change';

const input = document.querySelector('.form-control');
const stateMessage = document.querySelector('.form-container__state-message');
const contentPost = document.querySelector('#content__post');
const contentFeed = document.querySelector('#content__feed');

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

const createFeed = (state) => state.feed.map(({ title }) => {
  const li = document.createElement('li');
  li.textContent = title;
  return li;
});

const rssState = (state, i18n) => {
  if (state.rssForm.valid === false) {
    input.classList.add('form-container__invalid');
    stateMessage.classList.remove('form-container__state-message-valid');
    stateMessage.classList.add('form-container__state-message-invalid');
    // stateMessage.textContent = `пас - ${path}, валью - ${value}`;
    stateMessage.textContent = i18n.t('formRss.errors.invalid');
  } else if (state.rssForm.valid === true) {
    input.classList.remove('form-container__invalid');
    stateMessage.classList.remove('form-container__state-message-invalid');
    stateMessage.classList.add('form-container__state-message-valid');
    stateMessage.textContent = i18n.t('formRss.valid');
    input.value = '';
    // content.textContent = `<p>got</g>${state.posts}`;

    // const createFeed = state.feed.map(({ title }) => {
    //   const li = document.createElement('li');
    //   li.textContent = title;
    //   return li;
    // });

    const feedTitle = document.createElement('h4');
    feedTitle.textContent = 'Фиды';

    const feedList = document.createElement('ul');
    feedList.className = 'list';
    // feedList.append(...createFeed);
    // contentFeed.append(feedTitle, feedList);

    feedList.append(...createFeed(state));
    contentFeed.append(feedTitle, feedList);

    const createPost = state.posts[0].map(({ title, description, link }) => {
      const li = document.createElement('li');
      li.className = 'd-flex justify-content-between align-items-start list-group-item border-0';
      const a = document.createElement('a');
      const button = document.createElement('button');
      button.className = 'btn btn-outline-primary btn-sm';
      button.textContent = 'Просмотр';
      a.textContent = title;
      a.setAttribute('href', link);
      li.append(a, button);
      return li;
    });

    const h4 = document.createElement('h4');
    h4.textContent = 'Посты';
    const list = document.createElement('ul');
    list.className = 'list';
    list.append(...createPost);
    contentPost.append(h4, list);
  }
};

export default (state, i18n) => onChange(state, (path, value) => {
  rssState(state, i18n);
  siteText(i18n);
});
