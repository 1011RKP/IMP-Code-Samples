var whatsHapApp = angular.module('whatsHapApp', ['ngSanitize', 'ngAnimate', 'ui.bootstrap']);
var whatshapHomeController = function (dataService) {
//debugger;
    var model = this; var slides = [];
    model.$onInit = function () {
        //debugger;
        dataService.getwhatshapHome().then(function (data) {
            for (var i = 0; i < data.length; i++) {
                var slide = {
                    id: i,
                    title: data[i].Title,
                    body: data[i].Body,
                    readMore: "/sites/compliance//Pages/WHDetails.aspx?string=" + data[i].ID
                }
                slides.push(slide);
            }
            model.whatshap = slides;
        });
    }
}
var whatshapdeatilsController = function (dataService) {
    var model = this; var dailyDoseOtherInfo = []; var imageDetails = [];
    model.$onInit = function () {
        dataService.getwhatshapDetails().then(function (result) {
            var slide = {
                id: 0,
                title: result[0].Title,
                body: result[0].Body,
            }
            model.whDetailedItem = slide;
        });
    }
}
whatsHapApp.component('whatshapHome', {
    templateUrl: '/sites/common/SiteAssets/Dept_Compliance/whatsHappening/HTML/WidgetTemplate/whatsHapHome.html',
    controllerAs: "model",
    controller: ["dataService", whatshapHomeController]
});
whatsHapApp.component('whatshapDeatils', {
    templateUrl: '/sites/common/SiteAssets/Dept_Compliance/whatsHappening/HTML/WidgetTemplate/whatsHapDetails.html',
    controllerAs: "model",
    controller: ["dataService", whatshapdeatilsController]
});
whatsHapApp.service('dataService', ['$http', '$q', function ($http, $q) {

    /* REST data access service */
    //Define the http headers
    $http.defaults.headers.common.Accept = "application/json;odata=nometadata";
    $http.defaults.headers.post['Content-Type'] = 'application/json;odata=verbose';
    $http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
    $http.defaults.headers.post['If-Match'] = "*";
    $http.defaults.headers.post['X-RequestDigest'] = $("#__REQUESTDIGEST").val();

    // get What's Happening Home
    var today = new Date();//debugger
    this.getwhatshapHome = function () {
        var select = "?$select=ID,Title,Body,Expires";
        var filter = "&$filter=(Expires ge datetime'" + today.toISOString() + "')";
        var orderBy = "&$top=5&$orderby=Expires desc";

        var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Whats Happening')/items" + select + filter + orderBy;
        var dfd = $q.defer();
        $.ajax({
            url: restUrl,
            type: "GET",
            cache: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                dfd.resolve(data.d.results);
            },
            error: function (error) {
                console.log(JSON.stringify(error));
            }
        });
        return dfd.promise;
    }

    // get What's Happening Deatiles
    this.getwhatshapDetails = function () {
        var select = "?$select=ID,Title,Body,Expires&$";
        var id = getQueryStringValue("string");
        var filter = "Filter=ID eq '" + id + "'";
        var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Whats%20Happening')/items" + select + filter;

        var dfd = $q.defer();
        $.ajax({
            url: restUrl,
            type: "GET",
            cache: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                dfd.resolve(data.d.results);
            },
            error: function (error) {
                console.log(JSON.stringify(error));
            }
        });
        return dfd.promise;

    }

}])
whatsHapApp.filter('cut', function () {

    /* filter that shortens a long paragraph on work markers */

    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = String(value).replace(/<[^>]+>/gm, "");
        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };

})
function getQueryStringValue(key) {
    return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}
angular.bootstrap(document.getElementById('whatshapDiv'), ['whatsHapApp']);
