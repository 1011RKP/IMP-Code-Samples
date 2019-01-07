'use strict';

// Register `Finalization list` component, along with its associated controller and template

var intranetFooterApp = angular.module('intranetFooterApp', ['ngSanitize', 'ngAnimate', 'ui.bootstrap']);

var intranetFooterAppctrl = function (SPDataService) {

    var model = this;
    model.FooterListItem = [];
    model.$onInit = function () {
 		      
        	SPDataService.getFooterLinks().then(function (data) {
            var footerItems = [];
            for (var i = 0; i < data.length; i++) {
                var footeritem = {
                    Title: '<span class=\"footeranchorlinks\">' + data[i].Title + '</span>',
                    url: data[i].Url.Url,
                };
                footerItems.push(footeritem);                
                //console.log(model.FooterListItem);
            };
            var footerItem = {
                Title: '<span class=\"TopMenuTitle\"> <i class=\"fa fa-list fa-1x\" aria-hidden=\"true\"></i></span>',
                url: "/sites/Common/Lists/FooterList/AllItems.aspx",
            };
            footerItems.push(footerItem);
            model.FooterListItem = footerItems;
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
    templateUrl: '/sites/common/SiteAssets/Dept_IT/Footer_IT/HTML/WidgetTemplate/FooterTemplate.html',
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


