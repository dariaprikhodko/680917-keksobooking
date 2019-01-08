'use strict';

(function () {

  var MAIN_PIN_SIZE = 62;
  var MAIN_PIN_ARROW = 22;
  var MIN = {
    X: 0,
    Y: 130 - (MAIN_PIN_SIZE + MAIN_PIN_ARROW)
  };
  var MAX = {
    X: 1135,
    Y: 630 - (MAIN_PIN_SIZE + MAIN_PIN_ARROW)
  };
  var mainElement = document.querySelector('main');
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
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < 8; i++) {
        fragment.appendChild(window.pin.renderPin(ads[i]));
      }
      window.pin.similarPinElement.appendChild(fragment);
    };

    // При отпускании кнопки мыши нужно переставать слушать события движения мыши.
    // При отпускании мыши страница переходит в активный режим
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      if (!isActive) {
        setActive();
        window.backend.load(successHandler, window.error.showError);
        clickPins();
        window.form.setDefaultGuest();
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

  // появление попапа об успешной публикации
  // находим шаблон и отрисовываем в него попап
  var renderPopupSuccess = function () {
    var successPopupTemplate = document.querySelector('#success')
        .content
        .querySelector('.success');
    var successElement = successPopupTemplate.cloneNode(true);
    mainElement.appendChild(successElement);
    successElement.addEventListener('click', function () {
      successElement.classList.add('hidden');
      document.removeEventListener('keydown', window.utils.isEscEvent);
    });
    document.addEventListener('keydown', function (evt) {
      var closePopup = function () {
        successElement.classList.add('hidden');
      };
      window.util.isEscEvent(evt, closePopup);
    });
  };

  // вызов попапа
  window.form.adFormElement.addEventListener('submit', function (evt) {
    renderPopupSuccess();
    evt.preventDefault();
    resetPage();
  });

  // ресет страницы
  var resetPage = function () {
    window.form.adFormElement.reset();
    window.filter.mapFiltersElement.reset();
    window.form.onHouseTypeChange();
    window.form.disableAdFormElement();
    window.filter.disablemapFiltersElement();
    window.filter.disableFieldsetElement();
    window.filter.disableSelectElement();
  };

  window.map = {
    mapPinMainElement: mapPinMainElement
  };

})();
