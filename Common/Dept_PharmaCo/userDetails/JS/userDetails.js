var userdetailsApp = angular.module('userdetailsApp', ['ngSanitize', 'ngAnimate', 'ui.bootstrap']);
var finalteamMembers = [];
var userdetailsCtrl = function (dataService) {
    var model = this;
    model.$onInit = function () {//debugger
		
        $(function () {
            Profile.load();
        });
        dataService.getConfigData().then(function (data) {
            for (var i = 0; i < data.length; i++) {
                var title = data[i].Title;
                switch (title) {
                    case "Team Members":
						////debugger
						var link = _spPageContextInfo.webAbsoluteUrl + "/Lists/Team%20Members/AllItems.aspx" ;
						$('#teamMemberLink').append('<a href="' + link + '">Team Members</a>');
                        dataService.getnewEmployees(data[i].value).then(function (data) {

                            var peopleallinfo = []; var peopleinfo = []; var twopersonsinfo = [];
                            var chapter = []; var twopersonchapter = []; var personDetails = [];
                            for (var j = 0; j < data.length; j++) {
                                if (j % 2 == 0) {
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
                                    };
                                    personDetails.push(personDeatilsObj);
                                }
                            }

                            personDetails = personDetails.sort(sortByFullnameProperty('fullname'))
                            //var primarymemberindex = personDetails.findIndex(a => a.primarymember == true)
                            var primarymemberindex;
                            for (var i = 0; i < personDetails.length;i++)
                            {
                                if(personDetails[i].primarymember == true)
                                {
                                    primarymemberindex = i;
                                    break;
                                }
                            }
                            if (primarymemberindex != undefined)
                            {
                                arraymove(personDetails, primarymemberindex, 0);
                            }
                            

                            model.people = personDetails;
                            peopleinfo = personDetails;
                            //console.log(model.people);
                            for (var ca = 0; ca <= peopleinfo.length; ca++) {
                                ////debugger;
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
                        break;
                }
            }
        });

    };
};
userdetailsApp.component('userDetails', {
    templateUrl: '/sites/common/SiteAssets/IT/userDetails/HTML/WidgetTemplate/userdeatilsTemplate.html',
    controllerAs: "model",
    controller: ["dataService", userdetailsCtrl]

});
//Services call
userdetailsApp.service('dataService', ['$http', '$q', function ($http, $q) {
    this.getConfigData = function () {       
        var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Config Settings')/items?";
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
    var today = new Date();    
    this.getnewEmployees = function (data) {
        var today = new Date();
        var configInfo = data;
        var select = "?$select=ID,Title,Email,Region,Phone_x0020_Number,Primary_x0020_Member,Full_x0020_Name,Picture,AttachmentFiles&$expand=AttachmentFiles&$filter=(Job_x0020_Type eq 'Team Members')"; //and (Primary_x0020_Member eq 0)
        //var select = "?$select=ID,Title,Email,Region,Phone_x0020_Number,Full_x0020_Name,Attachments,AttachmentFiles&$expand=AttachmentFiles";
        var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + configInfo + "')/items" + select;
        //var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Team Members')/items" + select;
        var dfd = $q.defer();
        $.ajax({
            url: restUrl,
            type: "GET",
            cache: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                finalteamMembers = data.d.results;
                //finalteamMembers.sort(sortByProperty('fullname'))
                //console.log(finalteamMembers);
                dfd.resolve(finalteamMembers);
            },
            error: function (error) {
                console.log(JSON.stringify(error));
            }
        });

        return dfd.promise;
    };
}]);
userdetailsApp.filter('cut', function () {

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


angular.bootstrap(document.getElementById('userDetails'), ['userdetailsApp']);