import onChange from 'on-change';

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

const renderFeeds = (state, i18n) => {
  const feedsContent = document.querySelector('#content__feeds');
  const feedsTitleWrap = document.createElement('div');
  feedsTitleWrap.className = 'card border-0';
  const feedsTitle = document.createElement('h4');
  feedsTitle.textContent = i18n.t('content.feeds');
  feedsTitle.className = 'h4 card-body';
  feedsTitleWrap.append(feedsTitle);

  const feedsList = document.createElement('ul');
  feedsList.className = 'list';

  const feedsItems = (item) => item.feeds.map(({ title, description, id }) => {
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
  feedsContent.innerHTML = '';
  feedsList.append(...feedsItems(state));
  feedsContent.append(feedsTitle, feedsList);
};

const renderPost = (state, i18n) => {
  const postContent = document.querySelector('#content__post');
  const postTitleWrap = document.createElement('div');
  postTitleWrap.className = 'card border-0';
  const postTitle = document.createElement('h4');
  postTitle.textContent = i18n.t('content.post');
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
    } else {
      a.className = 'fw-bold';
    }

    button.className = 'btn btn-outline-primary btn-sm';
    button.setAttribute('data-id', id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#exampleModal');
    button.textContent = i18n.t('content.postButton');

    li.append(a, button);
    return li;
  });

  postContent.innerHTML = '';
  postList.append(...postslist(state.posts, state.visitedPost));
  postContent.append(postTitleWrap, postList);
};

const renderModal = (items, visited, i18n) => {
  const currentId = visited[visited.length - 1];
  const visitedPost = items.filter((item) => item.id === currentId)[0];
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const modalLink = document.querySelector('.modal-footer a');
  const modalBtnRead = document.querySelector('.btn-modal-read');
  const modalBtnClose = document.querySelector('.btn-modal-close');
  modalTitle.textContent = visitedPost.title;
  modalBody.textContent = visitedPost.description;
  modalLink.setAttribute('href', visitedPost.link);
  modalBtnRead.textContent = i18n.t('modal.read');
  modalBtnClose.textContent = i18n.t('modal.close');
};

const renderRss = (state, i18n) => {
  const button = document.querySelector('.form-container__btn');
  const stateMessage = document.querySelector('.form-container__state-message');
  const input = document.querySelector('.form-control');

  if (state.rssForm.process === 'failure') {
    input.classList.add('form-container__invalid');
    stateMessage.classList.remove('form-container__state-message-valid');
    stateMessage.classList.add('form-container__state-message-invalid');
    stateMessage.textContent = i18n.t(`formRss.errors.${state.rssForm.error}`);
    button.disabled = false;
  } else if (state.rssForm.process === 'successfully') {
    input.classList.remove('form-container__invalid');
    stateMessage.classList.remove('form-container__state-message-invalid');
    stateMessage.classList.add('form-container__state-message-valid');
    stateMessage.textContent = i18n.t('formRss.valid');
    input.value = '';
    button.disabled = false;
  } else if (state.rssForm.process === 'addFeeds') {
    input.classList.remove('form-container__invalid');
    stateMessage.classList.remove('form-container__state-message-invalid');
    button.disabled = true;
  }

  const formInput = document.querySelector('#url-input');
  formInput.focus();
};

export default (state, i18n) => onChange(state, (path) => {
  if (path === 'rssForm.process') {
    renderRss(state, i18n);
  }
  if (path === 'feeds') {
    renderFeeds(state, i18n);
  }
  if (path === 'posts') {
    renderPost(state, i18n);
  }
  if (path === 'visitedPost') {
    renderPost(state, i18n);
    renderModal(state.posts, state.visitedPost, i18n);
  }
});
