//
// bouncy-menu.js
// ==============

// Skrypt pozwalający nam automatycznie uzupełniać menu na podstawie
// listy lokalizacji obserwowanych przez użytkownika.

require(['jquery',
				 'underscore'],

function ($, _, utils) {

"use strict";

var url = '/api-userspace/locations/';
var tpl = _.template('<option value="<%= slug %>"><%= name %></option>');

// Mały helper, który składa url
//
// @param { String } Slug wybranej lokalizacji
// @param { String } Element dla url-a kierujący do typu zawartości.

function createUrl (slug, content) {
	return ("/{slug}/{content}/create/")
		.replace(/{slug}/g, slug)
		.replace(/{content}/g, content);
}

// Zmieniamy aktywną lokalizację

function switchOptions (e) {
	$('.bouncy-option').each(function () {
		$(this).attr('href', createUrl(
			$(e.currentTarget).val(),
			$(this).attr('data-content'))
		);
	});
}

// Tworzy automatycznie menu
//
// @param { jQuery.DomElement } Element select w jQuery

function createMenu ($select) {
	$.get(url, function (locations) {
		var slug = $select.attr('data-location'), $option;

		// Jeżeli jesteśmy w aktywnej lokacji, ustawiamy ją na wybraną,
		// w przeciwnym wypadku bierzemy pierwszą z pobranej listy.
		if (_.isUndefined(slug) && locations.length) {
			slug = locations[0].slug;
		}

		_.each(locations, function (location) {

			// Jesteśmy na podstronie lokalizacji i jakaś jest wybrana.
			// W tym przypadku opcja już istnieje i nie robimy drugiej.
			if (location.slug === $select.attr('data-location')) {
				return true;
			}

			// Tworzymy wszystkie pozostałe opcje z obserwowanych lokacji.
			$option = $(tpl(location));
			if (location.slug === slug) {
				$option.attr('selected', 'selected');
			}
			$select.append($option);
		});

		// Uzupełniamy url-e w odnośnikach
		$('.bouncy-option').each(function () {
			this.href = createUrl(slug, $(this).attr('data-content'));
		});
		$select.on('change', switchOptions);

		// Upewniamy się, że mamy co pokazać.
		if ($select.find('option').length) {
			$select.show();
		}
	});
}

// Widget uzupełniający bouncy-menu. Pozwala nam dynamicznie
// podmieniać linki opcji w zależności od wybranego miejsca.

$.fn.bouncyMenu = function () {
	return $(this).each(function () {
		createMenu($(this));
	});
};

});
