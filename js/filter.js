'use strict';

(function () {
  var PRICE_MIN = 10000;
  var PRICE_MAX = 50000;

  // находим необходимые элементы
  var fieldsetElement = document.querySelectorAll('fieldset');
  var mapFiltersElement = document.querySelector('.map__filters');
  var selectElement = mapFiltersElement.querySelectorAll('select');
  var featureFilters = mapFiltersElement.querySelectorAll('input[type = checkbox]:checked'); // Все checkbox:checked

  // Функция получения объявлений с выбранными характеристиками
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

    // Фильтрация по удобствам
    var filteredByFeatures = function (item) {
      return filteredOffer.filter(function (offerData) {
        return offerData.offer.features.indexOf(item.value) >= 0;
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

    if (featureFilters !== null) { // Проверка на наличие checkbox:checked
      featureFilters.forEach(function (item) {
        filteredOffer = filteredByFeatures(item);
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
