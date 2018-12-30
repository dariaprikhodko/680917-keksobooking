'use strict';

(function () {
  var inputAddressElement = document.querySelector('#address');
  var adFormElement = document.querySelector('.ad-form');
  var accommodationType = adFormElement.querySelector('#type');
  var priceField = adFormElement.querySelector('#price');
  var roomNumberField = adFormElement.querySelector('#room_number');
  var capacityField = adFormElement.querySelector('#capacity');
  var capacityOptions = Array.from(capacityField.options);
  var checkInTimeElement = adFormElement.querySelector('#timein');
  var checkOutTimeElement = adFormElement.querySelector('#timeout');

  var PriceType = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 100000
  };

  // Форма заполнения информации об объявлении .ad-form содержит класс ad-form--disabled;
  var disableAdFormElement = function () {
    adFormElement.classList.add('ad-form--disabled');
  };

  // пишем функцию, которая убирает класс ad-form--disabled у блока .ad-form
  var makeActiveAdFormElement = function () {
    adFormElement.classList.remove('ad-form--disabled');
  };

  // Определяем координаты главного пина в неактивном состоянии
  var calcCoordsToInputAdress = function () {
    inputAddressElement.value = parseInt(window.map.mapPinMainElement.style.left, 10) + ', ' + parseInt(window.map.mapPinMainElement.style.top, 10);
  };

  // добавляем полю адреса атрибут readonly для запрета ручного редактирования
  var setReadOnlyInput = function () {
    inputAddressElement.setAttribute('readonly', true);
  };

  // динамический селект типа жилья и цены
  var onHouseTypeChange = function () {
    priceField.min = PriceType[accommodationType.value];
    priceField.placeholder = PriceType[accommodationType.value];
  };

  accommodationType.addEventListener('change', onHouseTypeChange);

  // изначальные значения поля capacity
  var setDefaultGuest = function () {
    capacityOptions[0].disabled = true;
    capacityOptions[1].disabled = true;
    capacityOptions[2].disabled = false;
    capacityOptions[3].disabled = true;
  };

  // функция, связывающая кол-во жильцов и комнат
  var checkRoomGuests = function (evt) {
    if (evt.target.value === '1') {
      capacityOptions[0].disabled = true;
      capacityOptions[1].disabled = true;
      capacityOptions[2].disabled = false;
      capacityOptions[3].disabled = true;
    } else if (evt.target.value === '2') {
      capacityOptions[0].disabled = true;
      capacityOptions[1].disabled = false;
      capacityOptions[2].disabled = false;
      capacityOptions[3].disabled = true;
    } else if (evt.target.value === '3') {
      capacityOptions[0].disabled = false;
      capacityOptions[1].disabled = false;
      capacityOptions[2].disabled = false;
      capacityOptions[3].disabled = true;
    } else if (evt.target.value === '100') {
      capacityOptions[0].disabled = true;
      capacityOptions[1].disabled = true;
      capacityOptions[2].disabled = true;
      capacityOptions[3].disabled = false;
    }
  };

  roomNumberField.addEventListener('change', checkRoomGuests);

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

  window.form = {
    inputAddressElement: inputAddressElement,
    adFormElement: adFormElement,
    setDefaultGuest: setDefaultGuest,
    disableAdFormElement: disableAdFormElement,
    makeActiveAdFormElement: makeActiveAdFormElement,
    calcCoordsToInputAdress: calcCoordsToInputAdress,
    setReadOnlyInput: setReadOnlyInput,
    onHouseTypeChange: onHouseTypeChange,
    syncTimeOut: syncTimeOut,
    syncTimeIn: syncTimeIn
  };

})();
