'use strict';

// Register `Finalization list` component, along with its associated controller and template

var intranetFooterApp = angular.module('intranetFooterApp', ['ngSanitize', 'ngAnimate', 'ui.bootstrap']);

var intranetFooterAppctrl = function (SPDataService) {
    var model = this;
    model.FooterListItem = [];
    model.$onInit = function () {
        SPDataService.getFooterLinks().then(function (data) {
            for (var i = 0; i < data.length; i++) {
                var footeritem = {
                    Title: data[i].Title,
                    url: data[i].Url.Url,
                };
                model.FooterListItem.push(footeritem);
                //console.log(model.FooterListItem);
            };

        })

        SPDataService.IsSiteAdmin().then(function (data) {
            if (data.IsSiteAdmin == true) {
                $('#IsSiteAdminFooter').attr("style", "display:block !important;");
            }
            else {
                $('#IsSiteAdminFooter').attr("style", "display:none !important;");
            }

        });
    }
}

intranetFooterApp.component('footerBody', {
    templateUrl: '/sites/common/SiteAssets/Footer/HTML/widgetTemplate/FooterTemplate.html',
    controllerAs: "model",
    controller: ["SPDataService", intranetFooterAppctrl]
});



intranetFooterApp.factory('SPDataService', ['$q', function ($q) {
    var service = {};
    service.getFooterLinks = function () {
        var select = "?$select=Id,Title,Url";
        var restUrl = "https://incyte.sharepoint.com/sites/common/_api/web/lists/getbytitle('FooterList')/items?$select=Id,Title,Url";
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
    };

    service.IsSiteAdmin = function () {
        var restUrl = "https://incyte.sharepoint.com/sites/common/_api/web/currentUser/?$select=IsSiteAdmin";
        var dfd = $q.defer();
        $.ajax({
            url: restUrl,
            type: "GET",
            cache: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                dfd.resolve(data.d);
            },
            error: function (error) {
                console.log(JSON.stringify(error));
            }
        });

        return dfd.promise;
    };

    return service;
}]);

angular.bootstrap(document.getElementById('footerdiv'), ['intranetFooterApp']);


