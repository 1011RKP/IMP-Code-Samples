var siteownerApp = angular.module('siteownerApp', ['ngSanitize', 'ngAnimate', 'ui.bootstrap']);

var siteownerCtrl = function (dataService) {  
    var model = this;
    model.$onInit = function () {//debugger           
        dataService.getdepartmentTitile();
        dataService.getConfigData().then(function (data) {
            //debugger
            for (var i = 0; i < data.length; i++) {
                var title = data[i].Title; //debugger;
                switch (title) {
                    case "Dep Announcements":
                        dataService.getannouncements(data[i].Title).then(function (data) {
                            //debugger;
                            var announcements = [];
                            for (var i = 0; i < data.length; i++) {
                                var announObj = {
                                    id: data[i].ID,
                                    title: data[i].Title,
                                    displayForm: _spPageContextInfo.webAbsoluteUrl+'/Lists/Dep Announcements/DispForm.aspx?ID=' + data[i].ID,
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
                    case "Team Members":
                        dataService.getsiteOwner(data[i].Title).then(function (data) {
                            var obj = data[0].AttachmentFiles.results;
                            if (obj.length == 0) {
                                //debugger;
                                model.url = "notUploded",
                                model.id = 0;
                                model.title = data[0].Title;
                                model.name = data[0].Full_x0020_Name;
                                model.email = data[0].Email;
                                model.info = data[0].Info;
                                model.phoneNumber = data[0].Phone_x0020_Number;
                                model.location = data[0].Location;

                            }
                            else {
                                model.url = obj[0].ServerRelativeUrl,
                                model.id = 0;
                                model.title = data[0].Title;
                                model.name = data[0].Full_x0020_Name;
                                model.email = data[0].Email;
                                model.info = data[0].Info;
                                model.phoneNumber = data[0].Phone_x0020_Number;
                                model.location = data[0].Location;
                            }
                        });
                        break;
                    case "BannerImage":
                        dataService.setbannerImage(data[i].Title);
                        break;
                }
            }
        });
        $(function () {
            Profile.load();
        });
    }
    };
    siteownerApp.component('siteOwner', {
        templateUrl: '/Sites/Common/SiteAssets/siteOwner/HTML/WidgetTemplate/soTemplate.html',
        controllerAs: "model",
        controller: ["dataService", siteownerCtrl]
    });

    siteownerApp.service('dataService', ['$http', '$q', function ($http, $q) {

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
                        $('.banner').css('background-image', 'url(' + attachments.results[0].ServerRelativeUrl + ')');
                        $('.banner_sm_xs').css('background-image', 'url(' + attachments.results[0].ServerRelativeUrl + ')');
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

    Profile = {
        load:function(){
            this.links();
            this.social();
            this.accordion();
        },
        links:function(){
            $('a[href="#"]').click(function(e){
                e.preventDefault();
            });
        },
        social:function(){
            $('.accordion .about-me .photo .photo-overlay .plus').click(function(){
                $('.social-link').toggleClass('active');
                $('.about-me').toggleClass('blur');
            });
            $('.social-link').click(function(){
                $(this).toggleClass('active');
                $('.about-me').toggleClass('blur');
            });
        },
        accordion:function(){
            var subMenus = $('.accordion .sub-nav').hide();
            $('.accordion > a').each(function(){
                if($(this).hasClass('active')){
                    $(this).next().slideDown(100);
                }
            });
            $('.accordion > a').click(function(){
                $this = $(this);
                $target =  $this.next();
                $this.siblings('a').removeAttr('class');
                $this.addClass('active');
                if(!$target.hasClass('active')){
                    subMenus.removeClass('active').slideUp(100);
                    $target.addClass('active').slideDown(100);
                }
                return false;
            });
        }
    };
    angular.bootstrap(document.getElementById("siteOwner"), ['siteownerApp']);


