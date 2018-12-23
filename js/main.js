'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var ROOMS = [1, 2, 3, 4, 5];
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var AVATAR = [1, 2, 3, 4, 5, 6, 7, 8];
var CARDS_AMOUNT = 8;
var ESC_KEYCODE = 27;

var typesOfOffers = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

var keysTypes = Object.keys(typesOfOffers);
var mapPinMainElement = document.querySelector('.map__pin--main');
var inputAddressElement = document.querySelector('#address');
var adFormElement = document.querySelector('.ad-form');
var fieldsetElement = document.querySelectorAll('fieldset');
var mapFiltersElement = document.querySelector('.map__filters');
var selectElement = mapFiltersElement.querySelectorAll('select');

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
  // проверяем, есть ли на странице открытое объявление, при наличии - удаляем
  var existingCard = document.querySelector('.map__card');
  if (existingCard) {
    existingCard.remove();
  }
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
  if (evt.keyCode === ESC_KEYCODE) {
    cardElement.remove();
    document.removeEventListener('keydown', onPopupEscapePress);
  }
};

// module4-task1
// Форма заполнения информации об объявлении .ad-form содержит класс ad-form--disabled;
var disableAdFormElement = function () {
  adFormElement.classList.add('ad-form--disabled');
};

// Все <input> и <select> формы .ad-form заблокированы с помощью атрибута disabled,
// добавленного на них или на их родительские блоки fieldset.
var disableFieldsetElement = function () {
  for (var i = 0; i < fieldsetElement.length; i++) {
    fieldsetElement[i].disabled = true;
  }
};

// Форма с фильтрами .map__filters заблокирована так же, как и форма .ad-form.
var disablemapFiltersElement = function () {
  mapFiltersElement.classList.add('ad-form--disabled');
};

// Все <input> и <select> формы .ad-form заблокированы с помощью атрибута disabled,
// добавленного на них или на их родительские блоки fieldset.
var disableSelectElement = function () {
  for (var j = 0; j < selectElement.length; j++) {
    selectElement[j].disabled = true;
  }
};

// активируем страницу
// убираем класс .map--faded у блока map
var showMapElement = function () {
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
var calcCoordsToInputAdress = function () {
  inputAddressElement.value = parseInt(mapPinMainElement.style.left, 10) + ', ' + parseInt(mapPinMainElement.style.top, 10);
};

// добавляем полю адреса атрибут readonly для запрета ручного редактирования
var setReadOnlyInput = function () {
  inputAddressElement.setAttribute('readonly', true);
};

// убираем установленные disabled у select и fieldset
var enableFieldsetElements = function () {
  for (var l = 0; l < fieldsetElement.length; l++) {
    fieldsetElement[l].disabled = false;
  }
};

var enableSelectElements = function () {
  for (var m = 0; m < selectElement.length; m++) {
    selectElement[m].disabled = false;
  }
};

// Нажатие на метку похожего объявления на карте, приводит к показу карточки с подробной информацией об этом объявлении.
// Получается, что для меток должны быть созданы обработчики событий, которые вызывают показ карточки с соответствующими данными.
// функции subscribeClick передаем элемент, на который вешаем обработчик и сам объект объявления
var subscribeClick = function (elem, ad) {
  elem.addEventListener('click', function () {
    renderCard(ad);
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
  showMapElement();
  makeActiveAdFormElement();
  makeActivemapFiltersElement();
  enableFieldsetElements();
  enableSelectElements();
  calcCoordsToInputAdress();
  setReadOnlyInput();
  onHouseTypeChange();
  syncTimeOut();
  syncTimeIn();
};

// активация страницы по клику на главный пин
var onMainPinClick = function () {
  setActive();
  var cardList = generateAds();
  renderPins(cardList);
  clickPins(cardList);

  mapPinMainElement.removeEventListener('click', onMainPinClick);
};

mapPinMainElement.addEventListener('click', onMainPinClick);

// создаем обобщающую функцию
var init = function () {
  disableAdFormElement();
  disablemapFiltersElement();
  disableFieldsetElement();
  disableSelectElement();
};

init();

// module4-task2
var accommodationType = adFormElement.querySelector('#type');
var priceField = adFormElement.querySelector('#price');
var roomNumberField = adFormElement.querySelector('#room_number');
var capacityField = adFormElement.querySelector('#capacity');
var capacityOptions = Array.from(capacityField.options);
var roomNumberOption = Array.from(roomNumberField.options);
var checkInTimeElement = adFormElement.querySelector('#timein');
var checkOutTimeElement = adFormElement.querySelector('#timeout');
var mainElement = document.querySelector('main');

var PriceType = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 100000
};

// динамический селект типа жилья и цены
var onHouseTypeChange = function () {
  priceField.min = PriceType[accommodationType.value];
  priceField.placeholder = PriceType[accommodationType.value];
};

accommodationType.addEventListener('change', onHouseTypeChange);

// попытка написания функции, связывающей кол-во жильцов и комнат
var checkRoomGuestsForOne = function () {
  if (roomNumberOption[0].selected !== true) {
    capacityOptions[0].disabled = true;
    capacityOptions[1].disabled = true;
    capacityOptions[3].disabled = true;
  }
};

var checkRoomGuestsForTwo = function () {
  if (roomNumberOption[1].selected !== true) {
    capacityOptions[0].disabled = true;
    capacityOptions[3].disabled = true;
  }
};

var checkRoomGuestsForThree = function () {
  if (roomNumberOption[2].selected !== true) {
    capacityOptions[3].disabled = true;
  }
};

var checkRoomGuestsForMore = function () {
  if (roomNumberOption[3].selected !== true) {
    capacityOptions[0].disabled = true;
    capacityOptions[1].disabled = true;
    capacityOptions[2].disabled = true;
  }
};

roomNumberField.addEventListener('change', checkRoomGuestsForOne);
roomNumberField.addEventListener('change', checkRoomGuestsForTwo);
roomNumberField.addEventListener('change', checkRoomGuestsForThree);
roomNumberField.addEventListener('change', checkRoomGuestsForMore);

// время заезда и выезда
var syncTimeOut = function () {
  checkInTimeElement.value = checkOutTimeElement.value;
};

var syncTimeIn = function () {
  checkOutTimeElement.value = checkInTimeElement.value;
};

checkInTimeElement.addEventListener('change', syncTimeIn);
checkOutTimeElement.addEventListener('change', syncTimeOut);

// подсветка невалидной формы
var isInvalid = function (input) {
  if (input.checkValidity() === false) {
    input.style.boxShadow = '0 0 2px 2px red';
  }
};

var isValid = function (input) {
  if (input.checkValidity() === true) {
    input.style.boxShadow = 'none';
  }
};

// то, что надо подсветить
adFormElement.querySelector('.ad-form__submit').addEventListener('click', function () {
  isInvalid(adFormElement.querySelector('#title'));
  isInvalid(adFormElement.querySelector('#price'));
  isValid(adFormElement.querySelector('#title'));
  isValid(adFormElement.querySelector('#price'));
});

// появление попапа об успешной публикации
// находим шаблон и отрисовываем в него попап
var renderPopupSuccess = function () {
  var successPopupTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');
  var successElement = successPopupTemplate.cloneNode(true);
  mainElement.appendChild(successElement);
};

// функция показа попапа
var successPopup = document.querySelector('.success');
var showSuccessMessage = function () {
  successPopup.classList.remove('hidden');
  successPopup.addEventListener('click', function () {
    successPopup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscapePress);
  });
};

// вызов попапа
adFormElement.addEventListener('submit', function (evt) {
  renderPopupSuccess();
  showSuccessMessage();
  evt.preventDefault();
  resetPage();
});

var closePopup = function () {
  successPopup.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscapePress);
};
successPopup.addEventListener('click', closePopup);

// появление попапа об ошибке
// находим шаблон и отрисовываем в него попап
var renderPopupError = function () {
  var errorPopupTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');
  var errorElement = errorPopupTemplate.cloneNode(true);
  mainElement.appendChild(errorElement);
};

// функция показа попапа
var errorPopup = document.querySelector('.error');
var showErrorMessage = function () {
  errorPopup.classList.remove('hidden');
  errorPopup.addEventListener('click', function () {
    errorPopup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscapePress);
  });
};

renderPopupError();
showErrorMessage();

// ресет страницы
var resetPage = function () {
  adFormElement.reset();
  mapFiltersElement.reset();
  onHouseTypeChange();
  disableAdFormElement();
  disablemapFiltersElement();
  disableFieldsetElement();
  disableSelectElement();
};
