import onChange from 'on-change';

const input = document.querySelector('.form-control');
const stateMessage = document.querySelector('.form-container__state-message');

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
  }
};

export default (state, i18n) => onChange(state, (path, value) => {
  rssState(state, i18n);
  siteText(i18n);
});
