'use strict';

(function () {
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
