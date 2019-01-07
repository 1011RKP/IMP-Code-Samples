var teamMembersApp = angular.module('teamMembersApp', ['ngSanitize', 'ngAnimate', 'ui.bootstrap']);
var finalteamMembers = [];
var userdetailsCtrl = function (dataService) {
    var model = this;
    model.$onInit = function () {
        dataService.getitemsLimit().then(function (data) {
            var limt = data[0].Limit; model.Limitto = limt;
            model.classes = ((limt == 6) ? "col-md-2 col-lg-2" : ((limt == 4) ? "col-md-3 col-lg-3" : (limt == 2) ? "col-md-6 col-lg-6" : (limt == 3) ? "col-md-4 col-lg-4" : ''));
            dataService.getteamMembers().then(function (data) {
                var peopleallinfo = []; var peopleinfo = []; var twopersonsinfo = [];
                var chapter = []; var twopersonchapter = []; var personDetails = [];
                for (var j = 0; j < data.length; j++) {
                    if (j % model.Limitto == 0) {
                        var slideObj1 = {
                            id: j,
                            startSlide: j,
                        };
                        chapter.push(slideObj1);
                    }
                }
                model.peopleallinfo = chapter;
                for (var i = 0; i < data.length; i++) {
                    var obj = data[i].AttachmentFiles.results;
                    if (obj.length == 0) {
                        var personDeatilsObj = {
                            url: "noImage",
                            title: data[i].Title,
                            email: data[i].Email,
                            phoneNumber: data[i].Phone_x0020_Number,
                            fullname: data[i].Full_x0020_Name,
                            primarymember: data[i].Primary_x0020_Member,
                            spID: data[i].ID,
                            region: data[i].Region,
                            Order: data[i].Order0,
                            Bio: data[i].Bio
                        }
                        personDetails.push(personDeatilsObj);
                    }
                    else {
                        var personDeatilsObj = {
                            url: obj[0].ServerRelativeUrl,
                            title: data[i].Title,
                            email: data[i].Email,
                            phoneNumber: data[i].Phone_x0020_Number,
                            fullname: data[i].Full_x0020_Name,
                            primarymember: data[i].Primary_x0020_Member,
                            spID: data[i].ID,
                            region: data[i].Region,
                            Order: data[i].Order0,
                            Bio: data[i].Bio
                        };
                        personDetails.push(personDeatilsObj);
                    }
                }
                model.people = personDetails;
                peopleinfo = personDetails;
                for (var ca = 0; ca < peopleinfo.length; ca++) {
                    var imgHtml = [];
                    imgHtml[ca] = "<img class=\"img-responsive\" src='" + peopleinfo[ca].url + "'/>";
                    if (ca == 0) {
                        if (peopleinfo[ca].url == "noImage") {
                            $('#myCarousel_inner').append("<div class=\"item active photo_xs\"><div class=\"udInfoSection_xs\"><div class=\"udAvatarInfo_xs\"><h6 style=\"color:#0065A1\"><i class=\"fa fa-user\" aria-hidden=\"true\"> " + peopleinfo[ca].fullname + " </i></h6></div><div class=\"photo_xs\"><i class=\"fa fa-user fa-5x noimage_user\" aria-hidden=\"true\"></i></div><div><h6 style=\"color:#0065A1\"><i class=\"fa fa-phone\" aria-hidden=\"true\"></i> " + peopleinfo[ca].phoneNumber + "</h6><h6 style=\"color:#0065A1\"><i class=\"fa fa-envelope-o\" aria-hidden=\"true\"></i>" + peopleinfo[ca].email + "</h6></div></div></div>");
                        }
                        else {
                            $('#myCarousel_inner').append("<div class=\"item active photo_xs\"><div class=\"udInfoSection_xs\"><div class=\"udAvatarInfo_xs\"><h6 style=\"color:#0065A1\"><i class=\"fa fa-user\" aria-hidden=\"true\"> " + peopleinfo[ca].fullname + " </i></h6></div><div class=\"photo_xs\">" + imgHtml[ca] + "</div><div><h6 style=\"color:#0065A1\"><i class=\"fa fa-phone\" aria-hidden=\"true\"></i> " + peopleinfo[ca].phoneNumber + "</h6><h6 style=\"color:#0065A1\"><i class=\"fa fa-envelope-o\" aria-hidden=\"true\"></i>" + peopleinfo[ca].email + "</h6></div></div></div>");
                        }
                    }
                    else {
                        if (peopleinfo[ca].url == "noImage") {
                            $('#myCarousel_inner').append("<div class=\"item photo_xs\"><div class=\"udInfoSection_xs\"><div class=\"udAvatarInfo_xs\"><h6 style=\"color:#0065A1\"><i class=\"fa fa-user\" aria-hidden=\"true\"> " + peopleinfo[ca].fullname + " </i></h6></div><div class=\"photo_xs\"><i class=\"fa fa-user fa-5x noimage_user\" aria-hidden=\"true\"></i></div><div><h6 style=\"color:#0065A1\"><i class=\"fa fa-phone\" aria-hidden=\"true\"></i> " + peopleinfo[ca].phoneNumber + "</h6><h6 style=\"color:#0065A1\"><i class=\"fa fa-envelope-o\" aria-hidden=\"true\"></i>" + peopleinfo[ca].email + "</h6></div></div></div>");
                        }
                        else {
                            $('#myCarousel_inner').append("<div class=\"item photo_xs\"><div class=\"udInfoSection_xs\"><div class=\"udAvatarInfo_xs\"><h6 style=\"color:#0065A1\"><i class=\"fa fa-user\" aria-hidden=\"true\"> " + peopleinfo[ca].fullname + " </i></h6></div><div class=\"photo_xs\">" + imgHtml[ca] + "</div><div><h6 style=\"color:#0065A1\"><i class=\"fa fa-phone\" aria-hidden=\"true\"></i> " + peopleinfo[ca].phoneNumber + "</h6><h6 style=\"color:#0065A1\"><i class=\"fa fa-envelope-o\" aria-hidden=\"true\"></i>" + peopleinfo[ca].email + "</h6></div></div></div>");
                        }
                    }
                }
            });
        });
    };
    model.bioInfo = function (d) {
        model.bio = d;
    }
};
teamMembersApp.component('teamMembers', {
    templateUrl: '/sites/IT/SiteAssets/TeamMembers/HTML/WidgetTemplate/userdeatilsTemplate.html',
    controllerAs: "model",
    controller: ["dataService", userdetailsCtrl]
});

//Services call
teamMembersApp.service('dataService', ['$http', '$q', function ($http, $q) {
    this.getteamMembers = function () {
        var today = new Date();
        var select = "?$select=ID,Title,Email,Region,Order,Phone_x0020_Number,Full_x0020_Name,Picture,Bio,AttachmentFiles&$expand=AttachmentFiles&$filter=(Job_x0020_Type eq 'Team Members')";
        var sort = "&$orderby= Order asc,Full_x0020_Name";
        var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Team Members')/items" + select + sort;
        var dfd = $q.defer();
        $.ajax({
            url: restUrl,
            type: "GET",
            cache: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                finalteamMembers = data.d.results;
                dfd.resolve(finalteamMembers);
            },
            error: function (error) {
                console.log(JSON.stringify(error));
            }
        });
        return dfd.promise;
    };
    this.getitemsLimit = function () {
        var today = new Date();
        var select = "?$select=ID,Limit&$filter=(Job_x0020_Type eq 'Team Members')";
        var sort = "&$orderby= Limit desc&$top=1";
        var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Team Members')/items" + select + sort;
        var dfd = $q.defer();
        $.ajax({
            url: restUrl,
            type: "GET",
            cache: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                finalteamMembers = data.d.results;
                dfd.resolve(finalteamMembers);
            },
            error: function (error) {
                console.log(JSON.stringify(error));
            }
        });
        return dfd.promise;
    };
}]);

teamMembersApp.filter('cut', function () {
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

});

teamMembersApp.filter("sanitize", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);


function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

function sortByFullnameProperty(property) {
    return function (a, b) {
        var textA = a.fullname.toUpperCase();
        var textB = b.fullname.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    };
}


angular.bootstrap(document.getElementById('teamMembers'), ['teamMembersApp']);
