'use strict';

(function () {
  var showError = function (errorMessage) {
    var text = document.createElement('div');
    text.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red; border: 2px solid white';
    text.style.position = 'fixed';
    text.style.left = 0;
    text.style.right = 0;
    text.style.fontSize = '30px';
    text.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', text);

    var addHidden = function () {
      text.classList.add('hidden');
    };

    setTimeout(addHidden, 3000);
  };

  window.showError = showError;
})();
