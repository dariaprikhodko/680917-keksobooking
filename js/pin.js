'use strict';

(function () {

  // заполняем шаблон #pin
  var similarPinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');

  // находим и выносим в переменную блок .map__pins
  var similarPinElement = document.querySelector('.map__pins');

  // создаем DOM-элементы, соответствующие меткам на карте, и заполняем их данными из массива.
  var renderPin = function (ad) {
    var pinElement = similarPinTemplate.cloneNode(true);

    pinElement.style.left = ad.location.x + 'px';
    pinElement.style.top = ad.location.y + 'px';
    pinElement.querySelector('img').src = ad.author.avatar;
    pinElement.querySelector('img').alt = 'Заголовок объявления';

    return pinElement;
  };

  // отрисовываем сгенерированные DOM-элементы в блок .map__pins.
  var renderPins = function (ads) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ads.length; i++) {
      fragment.appendChild(renderPin(ads[i]));
    }
    similarPinElement.appendChild(fragment);
  };

  window.pin = {
    renderPins: renderPins
  };

})();
