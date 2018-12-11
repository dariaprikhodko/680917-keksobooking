'use strict';

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

var keysTypes = Object.keys(typesOfOffers);

// ищем на странице блок .map--faded
var mapElement = document.querySelector('.map--faded');

// убираем класс .map--faded у блока map
var showMapElement = function () {
  mapElement.classList.remove('.map--faded');
};

// находим и выносим в переменную блок .map__filters-container, чтобы вставит карточки перед ним
var filtersContainerElement = document.querySelector('.map__filters-container');

// находим и выносим в переменную блок .map
var mapBlockElement = document.querySelector('.map');


// заполняем шаблон #card
var similarCardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

// заполняем шаблон #pin
var similarPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

// находим и выносим в переменную блок .map__pins
var similarPinElement = document.querySelector('.map__pins');

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

// Создаем массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления неподалёку.
var generateAds = function () {
  var ads = [];
  for (var i = 0; i < CARDS_AMOUNT; i++) {
    var coordX = getRandomAmount(1, 1200);
    var coordY = getRandomAmount(130, 630);
    ads.push({
      author: {
        avatar: ('img/avatars/user' + '0' + getRandomNum(AVATAR) + '.png'),
      },
      offer: {
        title: getRandomNum(TITLES),
        address: coordX + ', ' + coordY,
        price: getRandomAmount(1000, 1000000),
        type: getRandomNum(keysTypes),
        rooms: getRandomNum(ROOMS),
        guests: getRandomAmount(1, 20),
        checkin: getRandomNum(CHECK_TIME),
        checkout: getRandomNum(CHECK_TIME),
        features: getRandomNum(FEATURES),
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

// создаем DOM-элементы объявлений
var renderCard = function (ads) {
  var cardElement = similarCardTemplate.cloneNode(true);

  cardElement.querySelector('.popup__title').textContent = ads.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = ads.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = ads.offer.price + ' ₽/ночь';
  cardElement.querySelector('.popup__type').textContent = ads.offer.type;
  cardElement.querySelector('.popup__text--capacity').textContent = ads.offer.rooms + ' комнаты для ' + ads.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ads.offer.checkin + ',' + ' выезд до ' + ads.offer.checkout;
  cardElement.querySelector('.popup__features').textContent = ads.offer.features;
  cardElement.querySelector('.popup__description').textContent = ads.offer.description;
  cardElement.querySelector('.popup__type').textContent = ads.offer.type;
  cardElement.querySelector('.popup__photos').textContent = '';
  for (var f = 0; f < ads.offer.photos.length; f++) {
    cardElement.querySelector('.popup__photos').insertAdjacentHTML('beforeend', '<img src="' + ads.offer.photos[f] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">');
  }
  cardElement.querySelector('.popup__avatar').src = ads.author.avatar;

  mapBlockElement.insertBefore(cardElement, filtersContainerElement);
};

// создаем обобщающую функцию
var init = function () {
  showMapElement();
  var cardList = generateAds();
  renderPins(cardList);
  renderCard(cardList[0]);
};

init();
