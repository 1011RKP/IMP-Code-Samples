var policyStdApp = angular.module('policyStdApp', ['angularUtils.directives.dirPagination', 'ngSanitize', 'ngAnimate', 'ui.bootstrap']);

var psCtrl = function (dataService) {
    var model = this;
    model.$onInit = function () {
        debugger
        dataService.getCharters().then(function (data) {
            model.data = data;
            model.totalItems = model.data.length;
            model.itemsPerPage = 7;
            model.currentPage = 1;
            model.noOfPages = Math.ceil(model.totalItems / model.itemsPerPage);


            /* for (var i = 0; i < data.length; i++) {
                 var extention = data[i].File.Name;
                 extention = extention.split('.').pop();
                 var filename = data[i].FileRef.substring(data[i].FileRef.lastIndexOf('/') + 1);
                 filename = filename.replace(/\.[^/.]+$/, "")
                 if (extention == "pdf") {
                     $('.charterData').append('<div class="conatiner info"><h3><a href="' + data[i].FileRef + '"><i class="fa fa-file-pdf-o" aria-hidden="true"></i>  ' + filename + '</a></h3></div>');
                 }
                 else if (extention == "docx") {
                     $('.charterData').append('<div class="conatiner info"><h3><a href="' + data[i].FileRef + '"><i class="fa fa-file-word-o" aria-hidden="true"></i>  ' + filename + '</a></h3></div>');
                 }
                 else {
                     $('.charterData').append('<div class="conatiner info"><h3><a href="' + data[i].FileRef + '"><i class="fa fa-file" aria-hidden="true"></i>  ' + filename + '</a></h3></div>');
                 }
                 
             }     */
        });
    }
};
policyStdApp.component('policyStandard', {
    templateUrl: '/sites/common/SiteAssets/IT/ES/PS/HTML/wdt/psTemplate.html',
    controllerAs: "model",
    controller: ["dataService", psCtrl]
});

policyStdApp.service('dataService', ['$http', '$q', function ($http, $q) {
    var today = new Date();
    this.getCharters = function () {
        var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Charters')/items?$select=FileRef,Title,ID,File/Name&$expand=File";
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
}]);

policyStdApp.filter('extension', function () {
    return function (input) {
        return input.substr(0,(input.lastIndexOf('.')));
    };
})
angular.bootstrap(document.getElementById("policyStd"), ['policyStdApp']);


