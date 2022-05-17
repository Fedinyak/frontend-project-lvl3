import onChange from 'on-change';

const input = document.querySelector('.form-control');
const stateMessage = document.querySelector('.form-container__state-message');
const postContent = document.querySelector('#content__post');
const feedContent = document.querySelector('#content__feed');

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

const renderFeed = (state) => state.feed.map(({ title, description, id }) => {
  const li = document.createElement('li');
  const h3 = document.createElement('h3');
  const p = document.createElement('p');
  h3.className = 'h6 m-0';
  h3.textContent = title;
  p.textContent = description;
  p.className = 'm-0 small text-black-50';
  p.setAttribute('data-id', id);
  li.className = 'list-group-item border-0 border-end-0';
  li.append(h3, p);
  return li;
});

const renderPost = (state) => state.map(({
  title, description, link, id,
}) => {
  const li = document.createElement('li');
  li.className = 'd-flex justify-content-between align-items-start list-group-item border-0';
  const a = document.createElement('a');
  const button = document.createElement('button');
  a.setAttribute('data-id', id);
  a.textContent = title;
  a.setAttribute('href', link);

  button.className = 'btn btn-outline-primary btn-sm';
  button.setAttribute('data-id', id);
  button.textContent = 'Просмотр';
  li.append(a, button);
  return li;
  // setAttribute('data-id', id
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

    // const renderFeed = state.feed.map(({ title }) => {
    //   const li = document.createElement('li');
    //   li.textContent = title;
    //   return li;
    // });
    // const renderPost = state.posts[0].map(({ title, description, link }) => {
    //   const li = document.createElement('li');
    //   li.className = 'd-flex justify-content-between align-items-start list-group-item border-0';
    //   const a = document.createElement('a');
    //   const button = document.createElement('button');
    //   button.className = 'btn btn-outline-primary btn-sm';
    //   button.textContent = 'Просмотр';
    //   a.textContent = title;
    //   a.setAttribute('href', link);
    //   li.append(a, button);
    //   return li;
    // });
    const feedTitleWrap = document.createElement('div');
    feedTitleWrap.className = 'card border-0';
    const feedTitle = document.createElement('h4');
    feedTitle.textContent = 'Фиды';
    feedTitle.className = 'h4 card-body';
    feedTitleWrap.append(feedTitle);

    const feedList = document.createElement('ul');
    feedList.className = 'list';
    feedContent.innerHTML = '';
    feedList.append(...renderFeed(state));
    feedContent.append(feedTitle, feedList);

    const postTitleWrap = document.createElement('div');
    postTitleWrap.className = 'card border-0';
    const postTitle = document.createElement('h4');
    postTitle.textContent = 'Посты';
    postTitle.className = 'h4 card-body';
    postTitleWrap.append(postTitle);

    const postList = document.createElement('ul');
    postList.className = 'list';
    postContent.innerHTML = '';
    state.posts.map((item) => postList.append(...(renderPost(item))));
    postContent.append(postTitleWrap, postList);
    // list.append(...renderPost(state.posts[0]));
    // for (let i = 0; i < state.posts.length; i += 1) {
    //   list.append(...renderPost(state.posts[i]));
    // }
    // list.append(renderPost(state.posts[1]));
  }
};

export default (state, i18n) => onChange(state, (path, value) => {
  rssState(state, i18n);
  siteText(i18n);
});
