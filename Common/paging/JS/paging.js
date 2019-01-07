var paginationApp = angular.module("paginationApp", ['angularUtils.directives.dirPagination','ngAnimate', 'ngSanitize', 'ui.bootstrap']);
//							.directive(['angularUtils.directives.dirPagination']);

var paginationappCtrl = function (dataService) {
    var model = this;
  model.$onInit = function () {
    dataService.deptLinks().then(function (data)
    {
        model.data = data;
        model.totalItems = model.data.length;
        model.itemsPerPage = 7;
        model.currentPage = 1;
        model.noOfPages = Math.ceil(model.totalItems / model.itemsPerPage);
		console.log(model.noOfPages);
    });
}
};
paginationApp.component('paginationApp', {
    templateUrl: '/sites/common/SiteAssets/paging/HTML/WidgetTemplate/pagingTemplate.html',
    controllerAs: "model",
    controller: ["dataService", paginationappCtrl]
});

paginationApp.service('dataService', ['$http', '$q', function ($http, $q) {
    $http.defaults.headers.common.Accept = "application/json;odata=nometadata";
    $http.defaults.headers.post['Content-Type'] = 'application/json;odata=verbose';
    $http.defaults.headers.post['Content-Length'] = '365';
    $http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
    $http.defaults.headers.post['If-Match'] = "*";

    this.deptLinks = function () {
        var dfd = $q.defer();
        var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Department Links')/items";
        $.ajax({
            url: restUrl,
            type: "GET",
            cache: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                dfd.resolve(data.d.results);//console.log(data.d.results);
            },
            error: function (error) {
                console.log(JSON.stringify(error));
            }
        });
        return dfd.promise;
    }
}]);
/*
paginationApp.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});*/

angular.bootstrap(document.getElementById('pagination'), ['paginationApp']);


