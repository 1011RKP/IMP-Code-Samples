var datasource = [];
var siteMapsource = [];

function orchartList() {
    var finalData = [];
    var obj = [];
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl +
            "/_api/web/lists/getbytitle('Org Chart')/items?$select=ID,Title,Name,Attachments,AttachmentFiles,Parent/Name,ParentId&$expand=Parent,AttachmentFiles&$orderby=ID",
        type: "GET",
        cache: false,
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function(data) {
            var obj = data.d.results;
            $.each(data.d.results, function(key, val) {
                var hrefObj = val.AttachmentFiles.results;
                var lookUp = val.Parent;
                if (hrefObj.length > 0) {
                    var href = hrefObj[0].ServerRelativeUrl;
                } else {
                    var href = '/';
                }
                if (lookUp.Name == undefined) {
                    var parentName = "none"
                } else {
                    var parentName = lookUp.Name
                }
                var dataobj = {
                    Name: val.Name,
                    Title: val.Title,
                    Imageurl: "<img src=" + '"' + href + '"' + " class=\"img-responsive customImage\">",
                    Parent: parentName,
                }
                datasource.push(dataobj);
            });
            obj = datasource;
            //finalData = recursive(obj, 'none');
            var appendHTML = createUnorderedList('none');
            setTimeout(function() {
                $('.gif').hide();
                $('#basic-interaction').html('<ul>' + appendHTML.join('') + '</ul>');
                $('#basic-interaction').append(appendHTML);
                $("#basic-interaction").orgChart({
                    container: $("#chart"),
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

function recursive(obj, Parent) {
    var out = [];
    for (var i in obj) {
        if (obj[i].Parent == Parent) {
            var children = recursive(obj, obj[i].Name)
            if (children.length) {
                obj[i].children = children
            }
            out.push(obj[i])
        }
    }
    return out;
}

function createUnorderedList(Parent) {
    return datasource.filter(function(node) {
        return (node.Parent === Parent);
    }).sort(function(a, b) {
        return a.index > b.index
    }).map(function(node) {
        var exists = datasource.some(function(childNode) {
            return childNode.Parent === node.Parent;
        });
        var subMenu = (exists) ? '<ul>' + createUnorderedList(node.Name).join('') + '</ul>' : "";
        return '<li><p class="orgInfoTitle">' + node.Title + '</p>' + node.Imageurl + '<p class="orgInfoName">' + node.Name + subMenu + '</p></li>';
    });
}

orchartList();