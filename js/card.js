'use strict';

(function () {

  var TypesOfOffers = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var filtersContainerElement = document.querySelector('.map__filters-container');

  // заполняем шаблон #card
  var similarCardTemplate = document.querySelector('#card')
      .content
      .querySelector('.map__card');

  // создаем DOM-элементы объявлений
  var renderCard = function (ads) {
    // проверяем, есть ли на странице открытое объявление, при наличии - удаляем
    var existingCard = document.querySelector('.map__card');
    if (existingCard) {
      existingCard.remove();
    }
    var cardElement = similarCardTemplate.cloneNode(true);

    // проверка полей объявлений
    if (ads.offer.title) {
      cardElement.querySelector('.popup__title').textContent = ads.offer.title;
    } else {
      cardElement.querySelector('.popup__title').remove();
    }

    if (ads.offer.address) {
      cardElement.querySelector('.popup__text--address').textContent = ads.offer.address;
    } else {
      cardElement.querySelector('.popup__text--address').remove();
    }

    if (ads.offer.price) {
      cardElement.querySelector('.popup__text--price').textContent = ads.offer.price;
    } else {
      cardElement.querySelector('.popup__text--price').remove();
    }

    if (ads.offer.type) {
      cardElement.querySelector('.popup__type').textContent = ads.offer.type;
    } else {
      cardElement.querySelector('.popup__type').remove();
    }

    if (ads.offer.capacity) {
      cardElement.querySelector('.popup__text--capacity').textContent = ads.offer.capacity;
    } else {
      cardElement.querySelector('.popup__text--capacity').remove();
    }

    if (ads.offer.time) {
      cardElement.querySelector('.popup__text--time').textContent = ads.offer.time;
    } else {
      cardElement.querySelector('.popup__text--time').remove();
    }

    if (ads.offer.features) {
      cardElement.querySelector('.popup__features').textContent = ads.offer.features;
    } else {
      cardElement.querySelector('.popup__features').remove();
    }

    if (ads.offer.description) {
      cardElement.querySelector('.popup__description').textContent = ads.offer.description;
    } else {
      cardElement.querySelector('.popup__description').remove();
    }

    if (ads.author.avatar) {
      cardElement.querySelector('.popup__avatar').src = ads.author.avatar;
    } else {
      cardElement.querySelector('.popup__avatar').remove();
    }

    if (ads.offer.type) {
      cardElement.querySelector('.popup__type').textContent = TypesOfOffers[ads.offer.type];
    } else {
      cardElement.querySelector('.popup__type').remove();
    }

    if (ads.offer.features) {
      cardElement.querySelector('.popup__features').textContent = '';
      for (var j = 0; j < ads.offer.features.length; j++) {
        cardElement.querySelector('.popup__features').innerHTML += '<li class="popup__feature popup__feature--' + ads.offer.features[j] + '"></li>';
      }
    } else {
      cardElement.querySelector('.popup__features').remove();
    }

    cardElement.querySelector('.popup__photos').textContent = '';
    for (var f = 0; f < ads.offer.photos.length; f++) {
      cardElement.querySelector('.popup__photos').insertAdjacentHTML('beforeend', '<img src="' + ads.offer.photos[f] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">');
    }
    cardElement.querySelector('.popup__avatar').src = ads.author.avatar;

    window.util.mapBlockElement.insertBefore(cardElement, filtersContainerElement);

    // закрываем объявление по щелчку на крестик
    var closeButton = cardElement.querySelector('.popup__close');
    closeButton.addEventListener('click', function () {
      cardElement.remove();
      document.removeEventListener('keydown', onPopupEscapePress);
    });
    document.addEventListener('keydown', onPopupEscapePress);
  };

  // Закрываем объявление по нажатию на esc
  var onPopupEscapePress = function (evt) {
    var cardElement = document.querySelector('.map__card');
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      cardElement.remove();
      document.removeEventListener('keydown', onPopupEscapePress);
    }
  };

  window.card = {
    renderCard: renderCard,
    similarCardTemplate: similarCardTemplate
  };


})();
