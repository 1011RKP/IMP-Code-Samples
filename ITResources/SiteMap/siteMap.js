var datasource = [];
var siteMapsource = [];

function sitMapList() {
    var finalData = [];
    var obj = [];
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl +
            "/_api/web/lists/getbytitle('Site Map')/items?$select=ID,Title,URL,Parent/Title,ParentId&$expand=Parent&$orderby=ID",
        type: "GET",
        cache: false,
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function(data) {
            var obj = data.d.results;
            $.each(data.d.results, function(key, val) {
                var lookUp = val.Parent;
                if (lookUp.Title == undefined) {
                    var parentName = "none"
                } else {
                    var parentName = lookUp.Title
                }
                var dataobj = {
                    Name: val.Title,//"<a href=" + '"' + val.URL + '"' + ">" + val.Title + "</a>",
                    URL: "<a target=\"_blank\" href=" + '"' + val.URL + '"' + ">" + val.Title + "</a>",
                    Parent: parentName,
                }
                siteMapsource.push(dataobj);
            });
            obj = [];
            obj = siteMapsource;
            var appendHTMLSiteMap = unorderedSiteMap('none');
           // $('#test').html('<ul>' + appendHTMLSiteMap.join('') + '</ul>');
            setTimeout(function() {
                $('.gifSiteMap').hide();
                $('#basic-interaction-siteMap').html('<ul>' + appendHTMLSiteMap.join('') + '</ul>');
                $('#basic-interaction-siteMap').append(appendHTMLSiteMap);
                $("#basic-interaction-siteMap").orgChart({
                    container: $("#siteMap"),
                    interactive: true,
                    showLevels: 2
                });
            }, 5000);
        },
        error: function() {
            console.log("Error: " + args.get_message());
        }
    });
}

function unorderedSiteMap(Parent) {
    return siteMapsource.filter(function(node) {
        return (node.Parent === Parent);
    }).sort(function(a, b) {
        return a.index > b.index
    }).map(function(node) {
        var exists = siteMapsource.some(function(childNode) {
            return childNode.Parent === node.Parent;
        });
        var subMenu = (exists) ? '<ul>' + unorderedSiteMap(node.Name).join('') + '</ul>' : "";
        //return '<li><p class="siteMapTitle">' + node.Name + '</p>' + subMenu + '</li>';
        return '<li><p class="mainTitle">' + node.Name + '</p><p class="linkTitle">' + node.URL + subMenu + '</p></li>';
    });
}

sitMapList();