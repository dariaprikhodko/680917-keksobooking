'use strict';

(function () {

  var MAIN_PIN_SIZE = 62;
  var MAIN_PIN_ARROW = 22;
  var MAIN_PIN_TOP = 375;
  var MAIN_PIN_LEFT = 570;
  var MIN = {
    X: 0,
    Y: 130 - (MAIN_PIN_SIZE + MAIN_PIN_ARROW)
  };
  var MAX = {
    X: 1135,
    Y: 630 - (MAIN_PIN_SIZE + MAIN_PIN_ARROW)
  };
  var PINS_AMOUNT = 5;
  var mapPinMainElement = document.querySelector('.map__pin--main');
  var isActive = false;

  // активируем страницу. убираем класс .map--faded у блока map
  var showMapElement = function () {
    window.util.mapBlockElement.classList.remove('map--faded');
  };

  // Нажатие на метку похожего объявления на карте, приводит к показу карточки с подробной информацией об этом объявлении.
  // Получается, что для меток должны быть созданы обработчики событий, которые вызывают показ карточки с соответствующими данными.
  // функции subscribeClick передаем элемент, на который вешаем обработчик и сам объект объявления
  var subscribeClick = function (elem, ad) {
    elem.addEventListener('click', function () {
      window.card.renderCard(ad);
    });
  };

  // функция clickPins выбирает DOM-элементы пинов, в цикле им передается обработчик событий вместе с объектом объявления
  var clickPins = function (ads) {
    var mapPinElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var p = 0; p < mapPinElements.length; p++) {
      subscribeClick(mapPinElements[p], ads[p]);
    }
  };

  // обобщающая функция, содержащая в себе алгоритмы поведения элементов в активном состоянии
  var setActive = function () {
    isActive = true;
    showMapElement();
    window.form.makeActiveAdFormElement();
    window.filter.makeActivemapFiltersElement();
    window.filter.enableFieldsetElements();
    window.filter.enableSelectElements();
    window.form.calcCoordsToInputAdress();
    window.form.setReadOnlyInput();
    window.form.onHouseTypeChange();
    window.form.syncTimeOut();
    window.form.syncTimeIn();
  };

  // пишем драг-н-дроп для метки
  // функция, устанавающая границы
  var setBorders = function (min, max, current) {
    if (current < min) {
      var value = min + 'px';
      return value;
    }
    if (current > max) {
      value = max + 'px';
      return value;
    }
    return value;
  };

  var renderPins = function (ads) {
    var fragment = document.createDocumentFragment();
    var length = ads.length > PINS_AMOUNT ? PINS_AMOUNT : ads.length;

    for (var i = 0; i < length; i++) {
      fragment.appendChild(window.pin.renderPin(ads[i]));
    }

    window.pin.similarPinElement.appendChild(fragment);
  };

  // mapPinMainElement тот элемент, за который тащим и обработаем событие начала перетаскивания метки mousedown
  mapPinMainElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    // запомним координаты точки начала движения
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;
    // При каждом движении мыши нам нужно обновлять смещение относительно
    // первоначальной точки, чтобы диалог смещался на необходимую величину.
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mapPinMainElement.style.top = (mapPinMainElement.offsetTop - shift.y) + 'px';
      mapPinMainElement.style.left = (mapPinMainElement.offsetLeft - shift.x) + 'px';

      // устанавливаем границы для перетаскивания метки по карте
      mapPinMainElement.style.left = setBorders(MIN.X, MAX.X, parseInt(mapPinMainElement.style.left, 10));
      mapPinMainElement.style.top = setBorders(MIN.Y, MAX.Y, parseInt(mapPinMainElement.style.top, 10));

      var left = mapPinMainElement.offsetLeft - shift.x;
      if (left > MAX.X) {
        left = MAX.X;
      } else if (left <= MIN.X) {
        left = MIN.X;
      }

      var top = mapPinMainElement.offsetTop - shift.y;
      if (top > MAX.Y) {
        top = MAX.Y;
      } else if (top <= MIN.Y) {
        top = MIN.Y;
      }
      var newCoordsX = left + MAIN_PIN_SIZE / 2;
      var newCoordsY = top + (MAIN_PIN_SIZE + MAIN_PIN_ARROW);

      // считаем координаты пина с учетом острой стрелочки
      var calcCoordsByArrow = function () {
        window.form.inputAddressElement.value = Math.floor(newCoordsX) + ', ' + Math.floor(newCoordsY);
      };
      calcCoordsByArrow(startCoords.x, startCoords.y);
    };

    var successHandler = function (ads) {
      window.adverts = ads;
      renderPins(ads);
      clickPins(ads);
    };

    // При отпускании кнопки мыши нужно переставать слушать события движения мыши.
    // При отпускании мыши страница переходит в активный режим
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      if (!window.map.isActive) {
        setActive();
        window.backend.load(successHandler, window.showError);
        window.form.setDefaultGuest();
        window.form.setDefaultCapacity();
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (dragEvt) {
          dragEvt.preventDefault();
          mapPinMainElement.removeEventListener('click', onClickPreventDefault);
        };
        mapPinMainElement.addEventListener('click', onClickPreventDefault);
      }
    };

    // Добавим обработчики события передвижения мыши и отпускания кнопки мыши.
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // создаем обобщающую функцию
  var init = function () {
    window.form.disableAdFormElement();
    window.filter.disablemapFiltersElement();
    window.filter.disableFieldsetElement();
    window.filter.disableSelectElement();
  };

  init();

  // Закрытие карточки предложения
  var closeCard = function () {
    var mapCard = document.querySelector('.map__card');
    var mapPinActive = document.querySelector('.map__pin--active');
    if (mapCard) {
      mapCard.remove();
    }
    if (mapPinActive) {
      mapPinActive.classList.remove('map__pin--active');
    }
    document.removeEventListener('keydown', window.util.isEscEvent);
  };

  // Деактивация карты
  var getMapReset = function () {
    window.util.mapBlockElement.classList.add('map--faded');
    window.pin.removePins();
    closeCard();
    mapPinMainElement.style.top = MAIN_PIN_TOP + 'px';
    mapPinMainElement.style.left = MAIN_PIN_LEFT + 'px';
  };

  // Фильтрация объявлений
  var onFilterChange = function () {
    window.filter.filterAllAds(window.adverts.slice(0, PINS_AMOUNT));
  };

  window.filter.mapFiltersElement.addEventListener('change', window.util.debounce(onFilterChange));

  window.map = {
    renderPins: renderPins,
    mapPinMainElement: mapPinMainElement,
    clickPins: clickPins,
    getMapReset: getMapReset,
    isActive: isActive
  };

})();
