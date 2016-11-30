(function () {
'use strict';

angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController)
	.service('MenuSearchService', MenuSearchService)
	.directive('foundItems', FoundItemsDirective);

  function FoundItemsDirective() {
		var ddo = {
			templateUrl: 'shoppingItemsFound.html',
			restrict: 'E',
			scope: {
				foundItems: '<',
				onRemove: '&'
			}
		};

		return ddo;
	}

	NarrowItDownController.$inject = ['MenuSearchService'];
	function NarrowItDownController(MenuSearchService) {
		var nCtrl = this;
    nCtrl.searchTerm = '';

		nCtrl.getMatchedMenuItems = function (searchTerm) {
			if(nCtrl.searchTerm !== '') {
				var promise = MenuSearchService.getMatchedMenuItems(nCtrl.searchTerm);
				promise.then(function (response) {
					nCtrl.found = response;
				});
			} else {
			     nCtrl.found = [];
			}
		};

		nCtrl.itemRev = function (index) {
		    nCtrl.found.splice(index, 1);
		};
	}

	MenuSearchService.$inject = ['$http'];
	function MenuSearchService($http) {
		var service = this;

		service.getMatchedMenuItems = function (searchTerm) {

			return $http({
				method: 'GET',
				url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
			}).then(function (result) {
			    // process result and only keep items that match
			    var foundItems = [];
			    var data = result.data.menu_items;

			    // return processed items
			    for (var i = 0; i < data.length; i++) {
			    	var item = data[i];
			    	if (item.description.includes(searchTerm)) {
			    		foundItems.push(item);
			    	}
			    }
			    return foundItems;
		    });

		};
		return service;
	}

})();
