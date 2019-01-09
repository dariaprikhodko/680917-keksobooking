'use strict';

(function () {
  var mainElement = document.querySelector('.main');
  var errorPopupTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');
  var errorElement = errorPopupTemplate.cloneNode(true);
  mainElement.appendChild(errorElement);
  var errorWindow = document.querySelector('.error');
  var errorText = errorWindow.querySelector('.error-message');
  var addHidden = function () {
    errorWindow.classList.add('hidden');
  };

  var showError = function (error) {
    errorWindow.classList.remove('hidden');
    errorText.innerHTML = error;

    setTimeout(addHidden, 3000);
  };

  window.error = {
    showError: showError
  };
})();
