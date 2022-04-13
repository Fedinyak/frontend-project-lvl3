// Вы можете указать, какие плагины Вам нужны
// import { Tooltip, Toast, Popover } from 'bootstrap';
import 'bootstrap';
import _ from 'lodash';
import {
  object, string, number, date, InferType,
} from 'yup';
import onChange from 'on-change';
// import * as bootstrap from 'bootstrap';

// function component() {
//   const element = document.createElement('div');

//   // Lodash, currently included via a script, is required for this line to work
//   // element.innerHTML = 'Hello';
//   // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
//   // console.log('sdfdsfdsfsdf');
//   return element;
// }

// document.body.appendChild(component());

const userSchema = object({
  website: string().url().nullable(),
});

const render = (element, data) => {
  // const div = document.createElement('div');
  const { site } = data;
  console.log(site);
  // div.innerHTML = `
  //   <p>Feedback has been sent</p>

  // `;
  // element.replaceWith(div);
};

const state = {
  rssForm: {
    valid: null,
    errors: [],
  },
  siteStorage: [],
};

const formElement = document.querySelector('.rss-form');
const input = document.querySelector('.form-control');

const handle = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  const user = userSchema.validate(data);
  console.log('test1', user);

  // type User = InferType<typeof userSchema>;
  // console.log('test2', User);

  // console.log(_.indexOf(state.siteStorage, data.url));
  if (_.indexOf(state.siteStorage, data.url) === -1) {
    state.siteStorage.push(data.url);
    state.rssForm.valid = true;
  } else {
    input.style.border = 'thick solid red';
    state.rssForm.valid = false;
    state.rssForm.errors.push('duplicate');
    console.log(state.rssForm.errors);
  }

  console.log(state.siteStorage);

  const formInput = document.querySelector('#url-input');
  formInput.value = '';
  formInput.focus();

  // render(formElement, Object.fromEntries(formData));
};

formElement.addEventListener('submit', handle);
