var itaboutApp = angular.module('itaboutApp', ['ngSanitize', 'ngAnimate', 'ui.bootstrap']);
var itaboutAppCtrl = function (dataService) {
    var model = this; //debugger
    model.$onInit = function () {
        //dataService.getEvents().then(function (data) {
        //    model.data = data;
        //    console.log(model.data);
        //});
        dataService.getExecutives().then(function (data) {
            var objWithCEO = []; var objWithoutCEO = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].CEO == "Yes") {
                    if (data[i].AttachmentFiles.results.length != 0) {
                        var attachmentURL = data[i].AttachmentFiles.results[0].ServerRelativeUrl;
                    }
                    else {
                        var attachmentURL = '/sites/it/SiteAssets/ITAbout/bio_image.jpg';
                    }
                    var objYes = {
                        firstName: data[i].First_x0020_Name,
                        lastName: data[i].Last_x0020_Name,
                        title: data[i].Title,
                        listid: data[i].ID,
                        imageURL: attachmentURL,
                        about:data[i].About,
                        ID: i,
                    }
                }
                else {
                    if (data[i].AttachmentFiles.results.length != 0) {
                        var attachmentURL = data[i].AttachmentFiles.results[0].ServerRelativeUrl;
                    }
                    else {
                        var attachmentURL = '/sites/it/SiteAssets/ITAbout/bio_image.jpg';
                    }
                    var objNo = {
                        firstName: data[i].First_x0020_Name,
                        lastName: data[i].Last_x0020_Name,
                        title: data[i].Title,
                        listid: data[i].ID,
                        imageURL: attachmentURL,
                        about:data[i].About,
                        ID: i,
                    }
                    objWithoutCEO.push(objNo);
                }
            }
            model.withCEO = objYes;
            model.withoutCEO = objWithoutCEO;
        });
    }
    model.about = function (aboutID) {
        dataService.getSpecificUser(aboutID).then(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].AttachmentFiles.results.length != 0) {
                    var attachmentURL = data[i].AttachmentFiles.results[0].ServerRelativeUrl;
                }
                else {
                    var attachmentURL = '/sites/it/SiteAssets/ITAbout/bio_image.jpg';
                }
                var objYes = {
                    firstName: data[i].First_x0020_Name,
                    lastName: data[i].Last_x0020_Name,
                    title: data[i].Title,
                    listid: data[i].ID,
                    imageURL: attachmentURL,
                    about:data[i].About,                    
                    ID: i,
                }
            }
            model.withCEO = objYes;
            dataService.getRemaingUser(aboutID).then(function (data) {
                var objWithoutCEO = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].AttachmentFiles.results.length != 0) {
                        var attachmentURL = data[i].AttachmentFiles.results[0].ServerRelativeUrl;
                    }
                    else {
                        var attachmentURL = '/sites/it/SiteAssets/ITAbout/bio_image.jpg';
                    }
                    var objNo = {
                        firstName: data[i].First_x0020_Name,
                        lastName: data[i].Last_x0020_Name,
                        title: data[i].Title,
                        listid: data[i].ID,
                        imageURL: attachmentURL,
                        about:data[i].About,                        
                        ID: i+1,
                    }
                    objWithoutCEO.push(objNo);
                }
                model.withoutCEO = objWithoutCEO;
            });
        });
    }
}
itaboutApp.component('itAbout', {
    templateUrl: '/sites/it/SiteAssets/ITAbout/HTML/WidgetTemplate/itaboutTemplate.html',
    controllerAs: "model",
    controller: ["dataService", itaboutAppCtrl]
});
itaboutApp.service('dataService', ['$http', '$q', function ($http, $q) {
    this.getEvents = function () {
        var today = new Date();
        var select = "?$select=Title,Signup_x0020_Sheet,EventDate,EndDate,ID,Enable_x0020_Event_x0020_on_x002,Description,Location0/Title&$expand=Location0&$orderby=EventDate&$top=1000";
        var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('RSVP Calendar')/items" + select;// + filter
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
    this.getExecutives = function () {
        var today = new Date();
        //var select = "?$select=ID,Title,Email,Region,Phone_x0020_Number,Primary_x0020_Member,Full_x0020_Name,Picture,AttachmentFiles&$expand=AttachmentFiles&$filter=(Job_x0020_Type eq 'Team Members')"; //and (Primary_x0020_Member eq 0)
        var select = "?$select=Title,ID,CEO,About,First_x0020_Name,Last_x0020_Name,AttachmentFiles&$expand=AttachmentFiles";
        var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('About')/items" + select;// + filter
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
    this.getSpecificUser = function (aboutID) {
        var today = new Date();
        //var select = "?$select=ID,Title,Email,Region,Phone_x0020_Number,Primary_x0020_Member,Full_x0020_Name,Picture,AttachmentFiles&$expand=AttachmentFiles&$filter=(Job_x0020_Type eq 'Team Members')"; //and (Primary_x0020_Member eq 0)
        var select = "?$select=Title,ID,CEO,About,First_x0020_Name,Last_x0020_Name,AttachmentFiles&$expand=AttachmentFiles&$filter=ID eq " + aboutID;
        var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('About')/items" + select;// + filter
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
    this.getRemaingUser = function (aboutID) {
        var today = new Date();
        //var select = "?$select=ID,Title,Email,Region,Phone_x0020_Number,Primary_x0020_Member,Full_x0020_Name,Picture,AttachmentFiles&$expand=AttachmentFiles&$filter=(Job_x0020_Type eq 'Team Members')"; //and (Primary_x0020_Member eq 0)
        var select = "?$select=Title,ID,CEO,First_x0020_Name,About,Last_x0020_Name,AttachmentFiles&$expand=AttachmentFiles&$filter=ID ne " + aboutID;
        var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('About')/items" + select;// + filter
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
}])
angular.bootstrap(document.getElementById("itaboutDiv"), ['itaboutApp']);