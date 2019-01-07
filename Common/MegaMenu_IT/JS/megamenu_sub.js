'use strict';

// Register `Finalization list` component, along with its associated controller and template

var intranetMenusubApp = angular.module('megaMenuNavigationSub', ['ngSanitize', 'ngAnimate', 'ui.bootstrap']);


function sortByProperty(property) {
    return function (a, b) {
        var textA = a.Title.toUpperCase();
        var textB = b.Title.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    };
}



var intranetMenuSubAppCtrl= function (SPDataService, $filter, $timeout) {
    var model = this;
    model.test = "chaitanya";
    model.AllItems = []
    model.TopMenuItems = [];
    model.MenuItems = [];

    model.buildNavTree = function (parentID, menuType) {

        var firstLevel = $filter('navChild')(model.AllItems, parentID);
        firstLevel = firstLevel.sort(sortByProperty('Title'))
        if (menuType == 'menuList') {
            var items = [];
            var index = [];
            for (var i = 0; i < firstLevel.length; i++) {
                if (firstLevel[i].TopMenu != 1) {
                    items.push(firstLevel[i]);
                }
                else {
                    index.push(i);
                }
            }
            for (var i = 0; i < index.length; i++) {
                items.push(firstLevel[index[i]]);
            }
            firstLevel = items;
        }
        for (var i = 0; i < firstLevel.length ; i++) {
            var secondLevel = model.getHeaderItems(firstLevel[i].Id); //$filter('navChild')(model.AllItems, firstLevel[i].Id);
            firstLevel[i].child = [];

            for (var j = 0; j < secondLevel.length  ; j++) {
                var thirdLevel = $filter('navChild')(model.AllItems, secondLevel[j].Id, secondLevel[j].Regions);
                secondLevel[j].child = [];
                secondLevel[j].child = thirdLevel;
            }
            firstLevel[i].child = secondLevel;
        }

        return firstLevel;
    }


    model.getTopMenuItems = function () {
        model.TopMenuItems = $filter('navChild')(model.AllItems, "");

    }
    model.getCssSize = function (length) {
        return (12 / length);
    }
    model.getColumnItemCSS = function (length) {
        var size = model.getCssSize(length);

        return "col-lg-" + size + " col-md-" + size + " col-sm-" + size + " col-xs-12";
    }
    model.getLimitItemsonMenuList = function (length) {
        return "($index % " + Math.round(length / 2) + ")==0";
    }
    model.getHeaderItems = function (parentId) {
        var navChild = $filter('navChild')(model.AllItems, parentId);
        var header = [
          {
              Id: 0,
              Title: "U.S.",
              Regions: "U.S."
          },
          {
              Id: 0,
              Title: "Europe",
              Regions: "Europe"

          },
          {
              Id: 0,
              Title: "Global",
              Regions: "Global"
          }
        ];

        //var header = [];
        var US = true;
        var Global = true;
        var EU = true;

        for (var i = 0; i < navChild.length; i++) {

            switch (navChild[i].Regions) {
                case "U.S.":
                    if (US) {
                        header[0].Id = parentId;
                        US = false;
                    }
                    break;
                case "Europe":
                    if (EU) { // US EU  header exist?
                        header[1].Id = parentId;
                        EU = false;
                    }
                    break;

                case "Global":
                    if (Global) {
                        header[2].Id = parentId;
                        Global = false;
                    }
                    break;


                case "ALL":  // no special header needed add item
                default:
                    header.push(navChild[i]);
                    break;

            };
        }

        header = jQuery.grep(header, function (a) {
            return a.Id !== 0;
        });
        return header;

    }

    //filter child navigation items
    model.getMenuItems = function (parentId, Region) {

        return $filter('navChild')(model.AllItems, parentId, Region);
    }



    model.getChildItems = function (parentId) {
        return model.buildNavTree(parentId);
    }

    model.IsChildElements = function (parentID) {
        var firstLevel = $filter('navChild')(model.AllItems, parentID);
        if (firstLevel.length > 0) {
            return 1;
        }
        else {
            return 0;
        }
    }
    model.$onInit = function () {
        SPDataService.getAllMenuItems().then(function (data) {
            $timeout(function () {
                model.AllItems = data.results;
                SPDataService.getTopMenuItems().then(function (data) {
                    model.TItems = data;
                    for (var i = 0; i < model.TItems.length; i++) {
                        if (model.TItems[i].ParentId == null || model.TItems[i].ParentId == "") {
                            model.MenuItems.push(model.buildNavTree(model.TItems[i].Id, model.TItems[i].MenuType));
                        }
                    }
                });
            }, 500);
        });

        SPDataService.IsSiteAdmin().then(function (data) {
        //debugger;
            if (data.IsSiteAdmin == true) {
                $('#IsSiteAdminSecondNavigation').attr("style", "display:block;");
            }
            else {
                $('#IsSiteAdminSecondNavigation').attr("style", "display:none;");
            }

        });
    }
}



intranetMenusubApp.component('megamenusubTempalte', {
    templateUrl: '/sites/common/SiteAssets/MegaMenu_IT/HTML/widgetTemplate/megaMenuTemplate_sub.html',
    controllerAs: "model",
    controller: ["SPDataService", "$filter", "$timeout", intranetMenuSubAppCtrl]
});



intranetMenusubApp.factory('SPDataService', ['$http', '$q', function ($http, $q) {
    var service = {};


    service.getTopMenuItems = function () {
        ;
        var select = "?$select=Id,Title,Url,ParentId,MenuType";
        var expand = "";
        var filter = "&$filter=Heading eq 1&$orderBy=Show_x0020_Order asc";
       var restUrl ="https://incyte.sharepoint.com/sites/common/_api/web/lists/getbytitle('SideNavigation')/items" + select + expand + filter;
       
       /* if(window.location.href.toLowerCase().indexOf("sites/medaffairs_eu") > 0 )
        {
        	restUrl = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('MA_EU%20Navigation')/items" + select + expand + filter
        }*/
        
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
                //console.log(JSON.stringify(error));
            }
        });

        return dfd.promise;


    };


    service.getAllMenuItems = function () {

        var select = "?$select=Id,Title,Url,ParentId,New_x0020_Badge,Heading,Show_x0020_Order,MenuType";
        var expand = "";
        var filter = "&$top=1000&$orderBy=Show_x0020_Order asc"; /*"&$filter=TopMenu eq 1";*/
        var restUrl = "https://incyte.sharepoint.com/sites/common/_api/web/lists/getbytitle('SideNavigation')/items" + select + expand + filter;
        /*if(window.location.href.toLowerCase().indexOf("sites/medaffairs_eu") > 0 )
        {
        	restUrl = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('MA_EU%20Navigation')/items" + select + expand + filter
        }*/
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
               // console.log(JSON.stringify(error));
            }
        });

        return dfd.promise;

    };

    service.getChildItems = function (ParentId) {

        var select = "?$select=Id,Title,Url,Parent/Id,Regions,New_x0020_Badge";
        var expand = "&$expand=Parent/Id";
        var filter = "&$top=1000&$filter=Parent/Id eq " + ParentId;

       var restUrl = "https://incyte.sharepoint.com/sites/common/_api/web/lists/getbytitle('SideNavigation')/items" + select + expand + filter;
       /* if(window.location.href.toLowerCase().indexOf("sites/medaffairs_eu") > 0 )
        {
        	restUrl = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('MA_EU%20Navigation')/items" + select + expand + filter
        }*/
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
               // console.log(JSON.stringify(error));
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
               // console.log(JSON.stringify(error));
            }
        });

        return dfd.promise;
    };


    return service;
}]);

intranetMenusubApp.filter('encodeURI', function () {
    return window.encodeURI;
});

intranetMenusubApp.filter('navChild', function () {
    return function (input, parentId, Region) {
        parentId = isNullOrEmpty(parentId) ? null : parentId;
        var out = [];
        angular.forEach(input, function (menuItem) {
            if (menuItem.ParentId === parentId) {
                if (Region) {
                    if (menuItem.Regions == Region) {
                        out.push(menuItem);
                    }
                } else {
                    out.push(menuItem)
                }
            }

        })

        return out;
    }
});



var isNullOrEmpty = function (value) {
    return !value
}


angular.bootstrap(document.getElementById('subMenu'), ['megaMenuNavigationSub']);