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
  cardElement.querySelector('.popup__type').textContent = typesOfOffers[ads.offer.type];
  cardElement.querySelector('.popup__photos').textContent = '';
  for (var f = 0; f < ads.offer.photos.length; f++) {
    cardElement.querySelector('.popup__photos').insertAdjacentHTML('beforeend', '<img src="' + ads.offer.photos[f] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">');
  }
  cardElement.querySelector('.popup__avatar').src = ads.author.avatar;

  mapBlockElement.insertBefore(cardElement, filtersContainerElement);
};

// создаем обобщающую функцию
var init = function () {
  var cardList = generateAds();
  renderPins(cardList);
  renderCard(cardList[0]);
};

init();

// module4-task1
// Форма заполнения информации об объявлении .ad-form содержит класс ad-form--disabled;
var adFormElement = document.querySelector('.ad-form');
var disableAdFormElement = function () {
  adFormElement.classList.add('ad-form--disabled');
};

disableAdFormElement();

// Все <input> и <select> формы .ad-form заблокированы с помощью атрибута disabled,
// добавленного на них или на их родительские блоки fieldset.
var fieldsetElement = adFormElement.getElementsByTagName('fieldset');
for (var i = 0; i < fieldsetElement.length; i++) {
  fieldsetElement[i].disabled = true;
}

// Форма с фильтрами .map__filters заблокирована так же, как и форма .ad-form.
var mapFiltersElement = document.querySelector('.map__filters');
var disablemapFiltersElement = function () {
  mapFiltersElement.classList.add('ad-form--disabled');
};

disablemapFiltersElement();

// Все <input> и <select> формы .ad-form заблокированы с помощью атрибута disabled,
// добавленного на них или на их родительские блоки fieldset.
var selectElement = mapFiltersElement.getElementsByTagName('select');
for (var j = 0; j < selectElement.length; j++) {
  selectElement[j].disabled = true;
}

var fieldsetMapFiltersElement = mapFiltersElement.getElementsByTagName('fieldset');
for (var k = 0; k < fieldsetMapFiltersElement.length; k++) {
  fieldsetMapFiltersElement[k].disabled = true;
}

// активируем страницу
// нужно добавить обработчик события mouseup на элемент .map__pin--main.
var mapPinMainElement = document.querySelector('.map__pin--main');

// Обработчик события mouseup должен вызывать функцию, которая будет отменять изменения DOM-элементов,
// описанные в пункте «Неактивное состояние» технического задания.
// ищем на странице блок .map--faded
var mapElement = document.querySelector('.map--faded');

// убираем класс .map--faded у блока map
var showMapElement = function () {
  mapElement.classList.remove('map--faded');
};
var showMapBlockElement = function () {
  mapBlockElement.classList.remove('map--faded');
};

// пишем функцию, которая убирает класс ad-form--disabled у блока .ad-form
var makeActiveAdFormElement = function () {
  adFormElement.classList.remove('ad-form--disabled');
};

// пишем функцию, которая убирает класс ad-form--disabled у блока .map__filters
var makeActivemapFiltersElement = function () {
  mapFiltersElement.classList.remove('ad-form--disabled');
};

// Определяем координаты главного пина в неактивном состоянии
var inputAddress = document.querySelector('#address');
var calcCoordsToInputAdress = function () {
// eslint-disable-next-line
  inputAddress.value = parseInt(mapPinMainElement.style.left) + ', ' + parseInt(mapPinMainElement.style.top);
};

var setActive = function () {
  showMapElement();
  showMapBlockElement();
  makeActiveAdFormElement();
  makeActivemapFiltersElement();
  // убираем установленные disabled у select и fieldset
  var ableFieldsetElement = adFormElement.getElementsByTagName('fieldset');
  for (var l = 0; l < ableFieldsetElement.length; l++) {
    ableFieldsetElement[l].disabled = false;
  }

  var ableSelectElement = mapFiltersElement.getElementsByTagName('select');
  for (var m = 0; m < ableSelectElement.length; m++) {
    ableSelectElement[m].disabled = false;
  }

  var ableFieldsetMapFiltersElement = mapFiltersElement.getElementsByTagName('fieldset');
  for (var n = 0; n < ableFieldsetMapFiltersElement.length; n++) {
    ableFieldsetMapFiltersElement[n].disabled = false;
  }
  calcCoordsToInputAdress();
};

mapPinMainElement.addEventListener('mouseup', function () {
  setActive();
});

// Нажатие на метку похожего объявления на карте, приводит к показу карточки с подробной информацией об этом объявлении.
// Получается, что для меток должны быть созданы обработчики событий, которые вызывают показ карточки с соответствующими данными.
// добавляем обработчик событий на клик по пину
similarPinElement.addEventListener('click', function () {

});
