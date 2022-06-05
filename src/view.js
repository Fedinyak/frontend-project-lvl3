import onChange from 'on-change';

const input = document.querySelector('.form-control');
const stateMessage = document.querySelector('.form-container__state-message');
const postContent = document.querySelector('#content__post');
const feedContent = document.querySelector('#content__feed');

// ---------------------- Language test
// const siteText = (i18n) => {
//   const title = document.querySelector('.form-container__title');
//   const description = document.querySelector('.form-container__description');
//   const label = document.querySelector('.form-container__label');
//   const example = document.querySelector('.form-container__example');
//   const button = document.querySelector('.form-container__btn');

//   title.textContent = i18n.t('header.title');
//   description.textContent = i18n.t('header.description');
//   label.textContent = i18n.t('header.label');
//   example.textContent = i18n.t('header.example');
//   button.textContent = i18n.t('formRss.button');
// };
// ---------------------- Language test

const renderFeed = (state) => {
  const feedTitleWrap = document.createElement('div');
  feedTitleWrap.className = 'card border-0';
  const feedTitle = document.createElement('h4');
  feedTitle.textContent = 'Фиды';
  feedTitle.className = 'h4 card-body';
  feedTitleWrap.append(feedTitle);

  const feedList = document.createElement('ul');
  feedList.className = 'list';

  const feedsList = (item) => item.feed.map(({ title, description, id }) => {
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
  feedContent.innerHTML = '';
  feedList.append(...feedsList(state));
  feedContent.append(feedTitle, feedList);
};

const renderPost = (state) => {
  const postTitleWrap = document.createElement('div');
  postTitleWrap.className = 'card border-0';
  const postTitle = document.createElement('h4');
  postTitle.textContent = 'Посты';
  postTitle.className = 'h4 card-body';
  postTitleWrap.append(postTitle);

  const postList = document.createElement('ul');
  postList.className = 'list';

  const postslist = (item, visited) => item.map(({
    title, link, id,
  }) => {
    const li = document.createElement('li');
    li.className = 'd-flex justify-content-between align-items-start list-group-item border-0';
    const a = document.createElement('a');
    const button = document.createElement('button');
    a.setAttribute('data-id', id);
    a.textContent = title;
    a.setAttribute('href', link);

    if (visited.includes(id)) {
      a.className = 'fw-normal link-secondary';
      // const modalTitle = document.querySelector('.modal-title');
      // const modalBody = document.querySelector('.modal-body');
      // const modalLink = document.querySelector('.modal-footer a');
      // modalTitle.textContent = title;
      // modalBody.textContent = description;
      // modalLink.setAttribute('href', link);
    } else {
      a.className = 'fw-bold';
    }

    button.className = 'btn btn-outline-primary btn-sm';
    button.setAttribute('data-id', id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#exampleModal');
    button.textContent = 'Просмотр';

    li.append(a, button);
    return li;
  });

  postContent.innerHTML = '';
  postList.append(...postslist(state.posts, state.visitedPost));
  // state.posts.map((item) => postList.append(...(postslist(item, state.visitedPost))));
  postContent.append(postTitleWrap, postList);
};

const renderModal = (item, visited) => item.forEach(({
  title, description, link, id,
}) => {
  const currentId = visited[visited.length - 1];
  if (id === currentId) {
    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    const modalLink = document.querySelector('.modal-footer a');
    modalTitle.textContent = title;
    modalBody.textContent = description;
    modalLink.setAttribute('href', link);
  }
});

const renderRss = (state, i18n) => {
  if (state.rssForm.valid === 'duplicate') {
    input.classList.add('form-container__invalid');
    stateMessage.classList.remove('form-container__state-message-valid');
    stateMessage.classList.add('form-container__state-message-invalid');
    // stateMessage.textContent = `пас - ${path}, валью - ${value}`;
    stateMessage.textContent = i18n.t('formRss.errors.duplicate');
  // } else if (state.rssForm.valid === true) {
  } else if (state.rssForm.valid === 'error') {
    input.classList.add('form-container__invalid');
    stateMessage.classList.remove('form-container__state-message-valid');
    stateMessage.classList.add('form-container__state-message-invalid');
    stateMessage.textContent = i18n.t('formRss.errors.invalid');
  } else if (state.rssForm.valid === 'invalidRss') {
    input.classList.add('form-container__invalid');
    stateMessage.classList.remove('form-container__state-message-valid');
    stateMessage.classList.add('form-container__state-message-invalid');
    stateMessage.textContent = i18n.t('formRss.errors.invalid');
  } else if (state.rssForm.valid === 'network') {
    input.classList.add('form-container__invalid');
    stateMessage.classList.remove('form-container__state-message-valid');
    stateMessage.classList.add('form-container__state-message-invalid');
    stateMessage.textContent = i18n.t('formRss.errors.invalid');
  } else if (state.rssForm.valid === 'valid') {
    input.classList.remove('form-container__invalid');
    stateMessage.classList.remove('form-container__state-message-invalid');
    stateMessage.classList.add('form-container__state-message-valid');
    stateMessage.textContent = i18n.t('formRss.valid');
    input.value = '';
  }
};

export default (state, i18n) => onChange(state, (path) => {
  if (path === 'rssForm.valid') {
    renderRss(state, i18n);
  }
  if (path === 'feed') {
    renderFeed(state);
  }
  if (path === 'posts') {
    renderPost(state);
    // console.log(state.posts);
  }
  if (path === 'visitedPost') {
    renderPost(state);
    renderModal(state.posts, state.visitedPost);
    // console.log(state.posts);
  }
  // console.log('path', path === 'rssForm.valid');
  // console.log('value', value);
  // renderRss(state, i18n);
  // siteText(i18n);
});
