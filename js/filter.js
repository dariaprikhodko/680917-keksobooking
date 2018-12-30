'use strict';

(function () {

  var fieldsetElement = document.querySelectorAll('fieldset');
  var mapFiltersElement = document.querySelector('.map__filters');
  var selectElement = mapFiltersElement.querySelectorAll('select');

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
    mapFiltersElement: mapFiltersElement
  };

})();
