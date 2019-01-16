'use strict';

(function () {
  var PRICE_MIN = 10000;
  var PRICE_MAX = 50000;

  // находим необходимые элементы
  var fieldsetElement = document.querySelectorAll('fieldset');
  var mapFiltersElement = document.querySelector('.map__filters');
  var selectElement = mapFiltersElement.querySelectorAll('select');
  var featureFilters = mapFiltersElement.querySelectorAll('input[type = checkbox]:checked'); // Все checkbox:checked
  var wifiFeatureElement = mapFiltersElement.querySelector('#filter-wifi');
  var dishwasherFeatureElement = mapFiltersElement.querySelector('#filter-dishwasher');
  var parkingFeatureElement = mapFiltersElement.querySelector('#filter-parking');
  var washerFeatureElement = mapFiltersElement.querySelector('#filter-washer');
  var elevatorFeatureElement = mapFiltersElement.querySelector('#filter-elevator');
  var conditionerFeatureElement = mapFiltersElement.querySelector('#filter-conditioner');

  // Функция получения объявлений с выбранными характеристиками

  var filterWiFi = function (element) {
    return wifiFeatureElement.checked ? element.offer.features.includes(wifiFeatureElement.value) : true;
  };

  var filterDishwasher = function (element) {
    return dishwasherFeatureElement.checked ? element.offer.features.includes(dishwasherFeatureElement.value) : true;
  };

  var filterParking = function (element) {
    return parkingFeatureElement.checked ? element.offer.features.includes(parkingFeatureElement.value) : true;
  };

  var filterWasher = function (element) {
    return washerFeatureElement.checked ? element.offer.features.includes(washerFeatureElement.value) : true;
  };

  var filterElevator = function (element) {
    return elevatorFeatureElement.checked ? element.offer.features.includes(elevatorFeatureElement.value) : true;
  };

  var filterConditioner = function (element) {
    return conditionerFeatureElement.checked ? element.offer.features.includes(conditionerFeatureElement.value) : true;
  };

  var filterAllAds = function (adverts) {
    var filteredOffer = adverts.slice(); // копируем входящие данные

    // Ключ для сравнения
    var FilterRules = {
      'housing-type': 'type',
      'housing-rooms': 'rooms',
      'housing-guests': 'guests'
    };

    // Функция фильтрации по ключу
    var filterByValue = function (element, property) {
      return filteredOffer.filter(function (offerData) {
        return offerData.offer[property].toString() === element.value;
      });
    };

    // Фильтрация по цене
    var filteredByPrice = function (element) {
      return filteredOffer.filter(function (offerData) {
        switch (element.value) {
          case 'middle':
            return offerData.offer.price >= PRICE_MIN && offerData.offer.price <= PRICE_MAX;
          case 'low':
            return offerData.offer.price <= PRICE_MIN;
          case 'high':
            return offerData.offer.price >= PRICE_MAX;
          default:
            return offerData;
        }
      });
    };

    // Перебираем все select
    if (selectElement.length !== null) { // проверка на наличие select
      selectElement.forEach(function (item) {
        if (item.value !== 'any') {
          if (item.id !== 'housing-price') {
            filteredOffer = filterByValue(item, FilterRules[item.id]);
          } else {
            filteredOffer = filteredByPrice(item);
          }
        }
      });
    }
    if (featureFilters !== null && featureFilters.length > 0) { // Проверка на наличие checkbox:checked
      filteredOffer = filteredOffer.filter(function (item) {
        return filterWiFi(item) && filterDishwasher(item) && filterParking(item) && filterWasher(item) && filterElevator(item) && filterConditioner(item);
      });
    }

    // Отрисовка отфильтрованных объявлений
    window.pin.removePins();

    if (filteredOffer.length) {
      window.map.renderPins(filteredOffer);
      window.map.clickPins(filteredOffer);
    }
  };

  // Форма с фильтрами .map__filters заблокирована так же, как и форма .ad-form.
  var disablemapFiltersElement = function () {
    mapFiltersElement.classList.add('ad-form--disabled');
  };

  // пишем функцию, которая убирает класс ad-form--disabled у блока .map__filters
  var makeActivemapFiltersElement = function () {
    mapFiltersElement.classList.remove('ad-form--disabled');
  };

  // Все <input> и <select> формы .ad-form заблокированы с помощью атрибута disabled,
  // добавленного на них или на их родительские блоки fieldset.
  var disableFieldsetElement = function () {
    for (var i = 0; i < fieldsetElement.length; i++) {
      fieldsetElement[i].disabled = true;
    }
  };

  // Все <input> и <select> формы .ad-form заблокированы с помощью атрибута disabled,
  // добавленного на них или на их родительские блоки fieldset.
  var disableSelectElement = function () {
    for (var j = 0; j < selectElement.length; j++) {
      selectElement[j].disabled = true;
    }
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

  window.filter = {
    disablemapFiltersElement: disablemapFiltersElement,
    makeActivemapFiltersElement: makeActivemapFiltersElement,
    disableFieldsetElement: disableFieldsetElement,
    disableSelectElement: disableSelectElement,
    enableFieldsetElements: enableFieldsetElements,
    enableSelectElements: enableSelectElements,
    mapFiltersElement: mapFiltersElement,
    filterAllAds: filterAllAds
  };

})();
