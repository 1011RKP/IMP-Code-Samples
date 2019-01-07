var bannerApp = angular.module('bannerApp', ['ngSanitize', 'ngAnimate', 'ui.bootstrap']);
var deptCtrl = function (dataService) {//debugger
    var model = this;
    model.$onInit = function () {
        dataService.getdepartmentTitile();
        dataService.getConfigData().then(function (data) {    
         for (var i = 0; i < data.length; i++) {
                var title = data[i].Title; 
                switch (title) {                   
                    case "BannerImage":
                        dataService.setbannerImage(data[i].Title);
                        break;
                    case "Dep Announcements":
                        dataService.getannouncements(data[i].Title).then(function (data) {
                            //debugger;
                            var announcements = [];
                            for (var i = 0; i < data.length; i++) {
                                var announObj = {
                                    id: data[i].ID,
                                    title: data[i].Title,
                                    displayForm: _spPageContextInfo.webAbsoluteUrl + '/Lists/Dep Announcements/DispForm.aspx?ID=' + data[i].ID,
                                };
                                announcements.push(announObj);

                            }
                            model.depannouncements = announcements;
                            //console.log(model.announcements);
                            for (var ca = 0; ca <= announcements.length ; ca++) {
                                var href = announcements[ca].displayForm;
                                if (ca == 0) {
                                    $('#depAnnounc_inner').append("<div class=\"item active\"><div class=\"depAnn_Title\"><h6><a href='" + announcements[ca].displayForm + "'>" + announcements[ca].title + "</a></h6></div></div>");
                                    $('#depAnnounc_inner_sm').append("<div class=\"item active\"><div class=\"depAnn_Title\"><h6><a href='" + announcements[ca].displayForm + "'>" + announcements[ca].title + "</a></h6></div></div>");
                                }
                                else {
                                    $('#depAnnounc_inner').append("<div class=\"item\"><div class=\"depAnn_Title\"><h6><a href='" + announcements[ca].displayForm + "'>" + announcements[ca].title + "</a></h6></div></div>");
                                    $('#depAnnounc_inner_sm').append("<div class=\"item\"><div class=\"depAnn_Title\"><h6><a href='" + announcements[ca].displayForm + "'>" + announcements[ca].title + "</a></h6></div></div>");
                                }
                            }
                        });
                        break;
                }
            }
        });
        $(function () {
            Profile.load();
        });
    }
};
    bannerApp.component('deptBanner', {
        templateUrl: '/sites/common/SiteAssets/IT/banner/HTML/WidgetTemplate/baTemplate.html',
        controllerAs: "model",
        controller: ["dataService", deptCtrl]
    });

    bannerApp.service('dataService', ['$http', '$q', function ($http, $q) {

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
        this.getsiteOwner = function (data) {        
            var today = new Date();
            var siteOwner = data;
            var select = "?$select=ID,Title,Email,Region,Phone_x0020_Number,Full_x0020_Name,Picture,AttachmentFiles&$expand=AttachmentFiles&$filter=Job_x0020_Type eq 'Site Owner'";
            var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('"+ siteOwner +"')/items" + select;// + filter
            var dfd = $q.defer();
            $.ajax({
                url: restUrl,
                type: "GET",
                cache: false,
                headers: { "accept": "application/json;odata=verbose" },
                success: function (data) {
                    var personDetails = [];
                    dfd.resolve(data.d.results);
                },
                error: function (error) {
                    console.log(JSON.stringify(error));
                }
            });

            return dfd.promise;
        };
        this.getannouncements = function (data) {        
            var today = new Date();
            var deptAnnounce = data;
			var filter = "?$filter=(Expires ge datetime'" + today.toISOString() + "')"
			var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + deptAnnounce + "')/items" + filter;
            var dfd = $q.defer();
            $.ajax({
                url: restUrl,
                type: "GET",
                cache: false,
                headers: { "accept": "application/json;odata=verbose" },
                success: function (data) {
                    var announcment = [];
                    $.each(data.d.results, function (key, val) {  
                        var announcmentsObj = {
                            title: val.Title,
                            id: val.ID,
                        };
                        announcment.push(announcmentsObj);
                    });
                    dfd.resolve(data.d.results);
                },
                error: function (error) {
                    console.log(JSON.stringify(error));
                }
            });
            return dfd.promise;
        };
        this.getannouncements = function (data) {
            var today = new Date();
            var deptAnnounce = data;
            var filter = "?$filter=(Expires ge datetime'" + today.toISOString() + "')"
            var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + deptAnnounce + "')/items" + filter;
            var dfd = $q.defer();
            $.ajax({
                url: restUrl,
                type: "GET",
                cache: false,
                headers: { "accept": "application/json;odata=verbose" },
                success: function (data) {
                    var announcment = [];
                    $.each(data.d.results, function (key, val) {
                        var announcmentsObj = {
                            title: val.Title,
                            id: val.ID,
                        };
                        announcment.push(announcmentsObj);
                    });
                    dfd.resolve(data.d.results);
                },
                error: function (error) {
                    console.log(JSON.stringify(error));
                }
            });
            return dfd.promise;
        };
        this.getdepartmentTitile = function () {
            var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/title";
            var dfd = $q.defer();
            $.ajax({
                url: restUrl,
                type: "GET",
                cache: false,
                headers: { "accept": "application/json;odata=verbose" },
                success: function (data) {//debugger
                    var title = data.d.Title;
                    $('.dept_Dynamic_Title').append("Welcome to the " + title + " Site");
                },
                error: function (error) {
                    console.log(JSON.stringify(error));
                }
            });
            return dfd.promise;
        };
        this.setbannerImage = function (data) {
            var bannerimag = data;
            var today = new Date();
            var select = "?$select=Attachments,AttachmentFiles,Title&$expand=AttachmentFiles&$orderby=Created desc&$top=1";
            var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + bannerimag + "')/items?" + select;// + filter
            var dfd = $q.defer();
            $.ajax({
                url: restUrl,
                type: "GET",
                cache: false,
                headers: { "accept": "application/json;odata=verbose" },
                success: function (data) {
                    //debugger
                    var attachments = data.d.results[0].AttachmentFiles
                    if (attachments.results.length > 0) {
                        //console.log(attachments.results[0].ServerRelativeUrl);
                         $('.banner').css('background-image', 'url(' + escape(attachments.results[0].ServerRelativeUrl)  + ')');
                        $('.banner_sm_xs').css('background-image', 'url(' + escape(attachments.results[0].ServerRelativeUrl) + ')');
                        //console.log()
                    }
                   
                    //dfd.resolve(data.d.results);
                },
                error: function (error) {
                    console.log(JSON.stringify(error));
                }
            });

            return dfd.promise;
        };
    }]);

    angular.bootstrap(document.getElementById("bannerDiv"), ['bannerApp']);
