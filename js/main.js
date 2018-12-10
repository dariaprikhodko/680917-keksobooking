'use strict';

var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var ROOMS = [1, 2, 3, 4, 5];
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
// var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var AVATAR = [1, 2, 3, 4, 5, 6, 7, 8];
var CARDS_AMOUNT = 8;

// ищем на странице блок .map--faded
var mapElement = document.querySelector('.map--faded');

// убираем класс .map--faded у блока map

var showMapElement = function () {
  showMapElement.classList.remove('.map--faded');
};

// находим и выносим в переменную блок .map

var similarCardElement = mapElement.querySelector('.map__card');

// находим и выносим в переменную блок .map__filters-container, чтобы вставит карточки перед ним
var filtersContainerElement = document.querySelector('.map__filters-container');

// заполняем шаблон #card

var similarCardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card popup');

// находим и выносим в переменную блок .map__pins

var similarPinElement = mapElement.querySelector('.map__pins');

// заполняем шаблон #pin

var similarPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

// Вспомогательные функции по поиску случайных чисел

// Ищет случайное число из массива

var getRandomNum = function (array) {
  var index = Math.floor(Math.random() * array.length);
  return array[index];
};

// Ищет случайное число из заданного диапазона

var getRandomAmount = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// создаем функции для генерации Х и У

var generateX = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var generateY = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Создаем массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления неподалёку.

var generateAds = function () {
  var ads = [];
  for (var i = 0; i < CARDS_AMOUNT; i++) {
    ads.push({
      author: {
        avatar: ('img/avatars/user' + '0' + getRandomNum(AVATAR) + '.png'),
      },
      offer: {
        title: getRandomNum(TITLE),
        address: generateX(1, 650) + ',' + generateY(130, 630),
        price: getRandomAmount(1000, 1000000),
        type: getRandomNum(TYPE),
        rooms: getRandomNum(ROOMS),
        guests: getRandomAmount(1, 20),
        checkin: getRandomNum(CHECK_TIME),
        checkout: getRandomNum(CHECK_TIME),
        features: getRandomNum(FEATURES),
        description: '',
        photos: getRandomNum(FEATURES)
      },
      location: {
        x: generateX(1, 650),
        y: generateY(130, 630)
      }
    });
  }
  return ads;
};

// создаем DOM-элементы, соответствующие меткам на карте, и заполняем их данными из массива.

var renderPin = function (ads, location) {
  var pinElement = similarPinTemplate.cloneNode(true);

  pinElement.querySelector('.map__pin').style = 'left:' + location.x + 'px;' + 'top:' + location.y + 'px;';
  pinElement.querySelector('img').src = ads.avatar;
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

// создаем DOM-элементы объявлений

var renderCard = function (ads) {
  var cardElement = similarCardTemplate.cloneNode(true);

  cardElement.querySelector('.popup__title').textContent = ads.title;
  cardElement.querySelector('.popup__text--address').textContent = ads.address;
  cardElement.querySelector('.popup__text--price').textContent = ads.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = ads.type;
  cardElement.querySelector('.popup__text--capacity').textContent = ads.rooms + 'комнаты для' + ads.guests + 'гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после' + ads.checkin + ',' + 'выезд до' + 'offer.checkout';
  cardElement.querySelector('.popup__features').textContent = ads.features;
  cardElement.querySelector('.popup__description').textContent = ads.description;
  cardElement.querySelector('.popup__type').textContent = ads.type;

  return cardElement;
};

// отрисовываем сгенерированные DOM-элементы в блок .map.

var renderCards = function (ads) {
  var card = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    card.appendChild(renderCard(ads[i]));
  }
  similarCardElement.insertBefore(filtersContainerElement);
};

// Замените src у аватарки пользователя — изображения, которое записано в .popup__avatar — на значения поля author.avatar отрисовываемого объекта.

// создаем обобщающую функцию

var init = function () {
  generateAds();
  renderPin();
  renderPins();
  renderCard();
  renderCards();
};

init();
