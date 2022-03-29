// Вы можете указать, какие плагины Вам нужны
// import { Tooltip, Toast, Popover } from 'bootstrap';
import 'bootstrap';

function component() {
  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  // element.innerHTML = 'Hello';
  // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  console.log('sdfdsfdsfsdf');
  return element;
}

document.body.appendChild(component());
