'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var mapBlockElement = document.querySelector('.map');

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    // Ищет случайное число из массива
    getRandomNum: function (array) {
      var index = Math.floor(Math.random() * array.length);
      return array[index];
    },
    // Ищет случайное число из заданного диапазона
    getRandomAmount: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    ESC_KEYCODE: ESC_KEYCODE,
    mapBlockElement: mapBlockElement,

  };

})();
