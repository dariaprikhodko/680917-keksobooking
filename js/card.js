'use strict';

(function () {
  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var ROOMS = [1, 2, 3, 4, 5];
  var CHECK_TIME = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var AVATAR = [1, 2, 3, 4, 5, 6, 7, 8];
  var CARDS_AMOUNT = 8;

  var typesOfOffers = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var filtersContainerElement = document.querySelector('.map__filters-container');
  var keysTypes = Object.keys(typesOfOffers);

  // заполняем шаблон #card
  var similarCardTemplate = document.querySelector('#card')
      .content
      .querySelector('.map__card');

  // Создаем массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления неподалёку.
  var generateAds = function () {
    var ads = [];
    for (var i = 0; i < CARDS_AMOUNT; i++) {
      var coordX = window.util.getRandomAmount(1, 1200);
      var coordY = window.util.getRandomAmount(130, 630);
      ads.push({
        author: {
          avatar: ('img/avatars/user' + '0' + window.util.getRandomNum(AVATAR) + '.png'),
        },
        offer: {
          title: window.util.getRandomNum(TITLES),
          address: coordX + ', ' + coordY,
          price: window.util.getRandomAmount(1000, 1000000),
          type: window.util.getRandomNum(keysTypes),
          rooms: window.util.getRandomNum(ROOMS),
          guests: window.util.getRandomAmount(1, 20),
          checkin: window.util.getRandomNum(CHECK_TIME),
          checkout: window.util.getRandomNum(CHECK_TIME),
          features: window.util.getRandomNum(FEATURES),
          description: '',
          photos: PHOTOS
        },
        location: {
          x: coordX,
          y: coordY
        }
      });
    }
    return ads;
  };

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
      cardElement.querySelector('.popup__type').textContent = typesOfOffers[ads.offer.type];
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
    generateAds: generateAds,
    renderCard: renderCard,
    similarCardTemplate: similarCardTemplate
  };


})();
