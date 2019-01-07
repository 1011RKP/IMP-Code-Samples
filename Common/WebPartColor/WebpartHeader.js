
var current_email="";
var listColorContent='WebpartColorContent';
var listCustomColors='WebpartColors';
var _colorContentJson=[];
var siteUrl = 'https://incyte.sharepoint.com/sites/common/';
$(document).ready(function() {
	//alert('called..');
	ExecuteOrDelayUntilScriptLoaded(GetUserName, 'sp.js'); 
	if((localStorage.getItem("pageurl")!=_spPageContextInfo.serverRequestPath) || (localStorage.getItem("pageurl")==null))
	{
		localStorage.setItem("pageurl", String(_spPageContextInfo.serverRequestPath));
		localStorage.setItem("id", "0");
		localStorage.setItem("colorContentJson","[]");
		localStorage.setItem("isPublish", "false");
		localStorage.setItem("user", "");
	}
	if((localStorage.getItem("id")=="0") || (localStorage.getItem("id")==null))
	{
		checkListItemExists();
	}
	checkPageStatus();
	var IsEditMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value; 
	var wikiInEditMode ="";
	if(document.forms[MSOWebPartPageFormName]._wikiPageMode!=undefined)
	{
		wikiInEditMode = document.forms[MSOWebPartPageFormName]._wikiPageMode.value;
	}
	
	if (IsEditMode == "1" || wikiInEditMode=="Edit") { //"Edit"
		BuildCustomWebpartProperties(); 
	}
	
	function GetUserName()
	{
		var context = new SP.ClientContext.get_current();
		var web = context.get_web();
		var user = web.get_currentUser();
		context.load(user);
		context.executeQueryAsync(function(){
			current_email=user.get_email();
		}, function(){console.log(":(");});
	}
	
	
	function onRequestFailed(sender, args) {
		console.log('Error: ' + args.get_message());
	}
	function checkListItemExists() {
		var title=String(_spPageContextInfo.serverRequestPath);
		var url = siteUrl + "/_api/web/lists/getbytitle('"+listColorContent+"')/items?$select=Title,ID,ColorContent,IsPublish,User&$top=1000&$filter=Title eq '"+title+"'";
		$.ajax({
			url: url,
			method: "GET",
			headers: { "Accept": "application/json; odata=verbose" },
			success: function (data) {
				if (data.d.results.length>0) {
					for (var i = 0; i < data.d.results.length; i++)   
					 {
						var item = data.d.results[i]; 	
						localStorage.setItem("id", String(item.ID));
						localStorage.setItem("colorContentJson",String(item.ColorContent));
						localStorage.setItem("isPublish", String(item.IsPublish));
						localStorage.setItem("user", String(item.User));
					 }
				}				 
			},
			error: function (data) {
				console.log(JSON.stringify(data));
			}
		});
	}

	function createListItem() {
		var clientContext = new SP.ClientContext(siteUrl);
		var oList = clientContext.get_web().get_lists().getByTitle(listColorContent);
			
		var itemCreateInfo = new SP.ListItemCreationInformation();
		this.oListItem = oList.addItem(itemCreateInfo);
			
		oListItem.set_item('Title', _spPageContextInfo.serverRequestPath);
		oListItem.set_item('ColorContent', localStorage.getItem("colorContentJson"));
		oListItem.set_item('User', current_email);
		
		oListItem.update();

		clientContext.load(oListItem);	
		clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryCreateSucceeded), Function.createDelegate(this, this.onQueryFailed));
	}

	function onQueryCreateSucceeded() {

		console.log('Item created: ' + oListItem.get_id());
	}
	function updateListItem(IsPublish) {
		if(localStorage.getItem("id")!="0")
		{
			var clientContext = new SP.ClientContext(siteUrl);
			var oList = clientContext.get_web().get_lists().getByTitle(listColorContent);

			this.oListItem = oList.getItemById(localStorage.getItem("id"));

			oListItem.set_item('ColorContent', localStorage.getItem("colorContentJson"));
			oListItem.set_item('IsPublish', IsPublish);
			oListItem.set_item('User', current_email);
			oListItem.update();

			clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryUpdateSucceeded), Function.createDelegate(this, this.onQueryFailed));
		}
	}

	function onQueryUpdateSucceeded() {
		console.log('Item updated!');
	}
	function onQueryFailed(sender, args) {
		console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
	}
	function checkPageStatus()
	{
		//if(document.forms[MSOWebPartPageFormName]._wikiPageMode==undefined)
		//{//window.location.href.toLowerCase().split('pages')[0] +
			$.ajax({url: siteUrl+ "_api/web/getFileByServerRelativeUrl('" + window.location.pathname  + "')/Level",
				headers: { "Accept": "application/json; odata=verbose" }, 
				success: function(data) {
					ExecuteOrDelayUntilScriptLoaded(function () { getWebpartProperties(data.d.Level) }, 'sp.js');
				},
				error: function (status) {
					console.log('Not published page - '+JSON.stringify(status));
					ExecuteOrDelayUntilScriptLoaded(function () { getWebpartProperties(0) }, 'sp.js');
				}
			}); 
		//}
		//else
		//{
		//	ExecuteOrDelayUntilScriptLoaded(function () { getWebpartProperties(0) }, 'sp.js');
		//}
	}
	
	function getWebpartProperties(_pageStatus)
	{ 
		var currentCtx = new SP.ClientContext.get_current();
		var pageFile = currentCtx.get_web().getFileByServerRelativeUrl(_spPageContextInfo.serverRequestPath);
		var webPartManager = pageFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
		var webPartDefs = webPartManager.get_webParts();
		currentCtx.load(webPartDefs, 'Include(WebPart.Properties,Id)');
		currentCtx.executeQueryAsync(
		function () {
			if (webPartDefs.get_count()) {
				 _colorContentJson= JSON.parse(localStorage.getItem("colorContentJson"));
			for (var i = 0; i < webPartDefs.get_count() ; i++) {
					var webPartDef = webPartDefs.getItemAtIndex(i);
					var webPart = webPartDef.get_webPart();
					var properties = webPart.get_properties();
					var webpartid=$("DIV[webpartid^='"+webPartDef.get_id()+"']").attr("id");
					var _colorIndex=-1;
					if(webpartid!=undefined)
					{
						for (var index = 0; index < _colorContentJson.length; ++index) {
							if(_colorContentJson[index].WebpartID == String(webPartDef.get_id())){ //update
								if(_pageStatus === 1){
									_colorContentJson[index].publishedcolor=_colorContentJson[index].draftcolor;
								}
								_colorIndex=index;
								break;
							}
						}
						if((_pageStatus === 1 || localStorage.getItem("user")==current_email) &&(_colorIndex!=-1)) {
							ApplyColorToWebpart(webpartid,_colorContentJson[_colorIndex].draftcolor);
						}
						else if ((localStorage.getItem("user")!=current_email) &&(_colorIndex!=-1)){
							console.log('The file is in draft or checked out');
							if(_pageStatus === 0 && _colorContentJson[_colorIndex].publishedcolor==""){
								ApplyColorToWebpart(webpartid,_colorContentJson[_colorIndex].draftcolor);
							}
							else{
								ApplyColorToWebpart(webpartid,_colorContentJson[_colorIndex].publishedcolor);
							}
						}
					}	 
				}
				localStorage.setItem("colorContentJson", JSON.stringify(_colorContentJson));
				if(_pageStatus === 1)//&& (document.forms[MSOWebPartPageFormName]._wikiPageMode==undefined))
				{
					ExecuteOrDelayUntilScriptLoaded(function () { updateListItem(true) }, 'sp.js');
				}
			}
			else {
				console.log("No web parts found.");
			}
		},
		function (sender, args) {
			console.log(args.get_message());
		});
	}
	
	function ApplyColorToWebpart(webpartid,color)
	{
		$("#"+webpartid+"_ChromeTitle").css("background", color);
		$("#"+webpartid).css("border-left", "1px solid "+color);
		$("#"+webpartid).css("border-right", "1px solid "+color);
		$("#"+webpartid).css("border-bottom", "1px solid "+color);
	}
	function getCurrentWebpartColor()
	{
		var currentCtxColor = SP.ClientContext.get_current();
		var pageFileColor = currentCtxColor.get_web().getFileByServerRelativeUrl(_spPageContextInfo.serverRequestPath);
		var webPartColorManager = pageFileColor.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
		var webPartDefsColor = webPartColorManager.get_webParts();
		currentCtxColor.load(webPartDefsColor, 'Include(WebPart.Properties,Id)');
		currentCtxColor.executeQueryAsync(
		function () {
			if (webPartDefsColor.get_count()) {
				_colorContentJson= JSON.parse(localStorage.getItem("colorContentJson"));
				for (var i = 0; i < webPartDefsColor.get_count() ; i++) {
					var webPartDef = webPartDefsColor.getItemAtIndex(i);
					var webPart = webPartDef.get_webPart();
					var properties = webPart.get_properties();
					
					var webpartid=$("DIV[webpartid^='"+webPartDef.get_id()+"']").attr("id");
					if(webpartid!=undefined)
					{ 
						var webpartedittitle=$('#MSOTlPn_TlPnCaptionSpan').text();
						webpartedittitle=webpartedittitle.replace("‭[","[").replace("]‬","]");
						var webparttitle=properties.get_item('Title');
						var isCurrentwebpart=false;
						if((webpartedittitle!="") && (webparttitle.indexOf(webpartedittitle) >= 0)) {
							isCurrentwebpart=true;
						}
						var _colorIndex=-1;
							
							for (var index = 0; index < _colorContentJson.length; ++index) {
								if(_colorContentJson[index].WebpartID == String(webPartDef.get_id())){ //update
									_colorIndex=index;
									break;
								}
							}
							
						if((isCurrentwebpart) && (_colorIndex!=-1))
						{
							$("#ddlWebpartColor").val(_colorContentJson[_colorIndex].draftcolor);							
						}
						
						if((localStorage.getItem("user")==current_email) &&(_colorIndex!=-1)) {
							ApplyColorToWebpart(webpartid,_colorContentJson[_colorIndex].draftcolor);
						}
						else if ((localStorage.getItem("user")!=current_email) &&(_colorIndex!=-1)){
							console.log('The file is in draft or checked out');
							ApplyColorToWebpart(webpartid,_colorContentJson[_colorIndex].publishedcolor);
						}
					}	
				}
				localStorage.setItem("colorContentJson", JSON.stringify(_colorContentJson));
			}
			else {
				console.log("No web parts found.");
			}
		},
		function (sender, args) {
			console.log(args.get_message());
		});
	}
	function setColorToWebpartProperties()
	{
		var currentCtx = SP.ClientContext.get_current();
		var pageFile = currentCtx.get_web().getFileByServerRelativeUrl(_spPageContextInfo.serverRequestPath);
		var webPartManager = pageFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
		var webPartDefs = webPartManager.get_webParts();
		currentCtx.load(webPartDefs, 'Include(WebPart.Properties,Id)');
		currentCtx.executeQueryAsync(
		function () {
			if (webPartDefs.get_count()) {
				for (var i = 0; i < webPartDefs.get_count() ; i++) {
					var webPartDef = webPartDefs.getItemAtIndex(i);
					var webPart = webPartDef.get_webPart();
					var properties = webPart.get_properties();
					
					var webpartid=$("DIV[webpartid^='"+webPartDef.get_id()+"']").attr("id");
					if(webpartid!=undefined)
					{ 
						var webpartedittitle=$('#MSOTlPn_TlPnCaptionSpan').text();
						webpartedittitle=webpartedittitle.replace("‭[","[").replace("]‬","]");
						var webparttitle=properties.get_item('Title');//$("#"+webpartid.replace("WebPart","WebPartTitle")).attr("title");

						var isCurrentwebpart=false;
						if((webpartedittitle!="") && (webparttitle.indexOf(webpartedittitle) >= 0)) {
						   isCurrentwebpart=true;
						}

						if(isCurrentwebpart)
						{
							var draftColor = $("#ddlWebpartColor option:selected").text();
							createOrUpdateJson(_spPageContextInfo.serverRequestPath,String(webPartDef.get_id()), draftColor,"");
							ApplyColorToWebpart(webpartid,draftColor);
							alert('Color applied successfully');
						}	
					}					
				}
				//update list item
				if(localStorage.getItem("id")!="0")
				{
					ExecuteOrDelayUntilScriptLoaded(function () { updateListItem(false) }, 'sp.js');
				}
				else {
					ExecuteOrDelayUntilScriptLoaded(createListItem, 'sp.js');
				}
			}
			else {
				console.log("No web parts found.");
			}
		},
		function (sender, args) {
			console.log(args.get_message());
		});
	}

	function BuildCustomWebpartProperties()
	{
		var restUrl = siteUrl+"/_api/web/Lists/getbytitle('"+listCustomColors+"')/items";
		 var _html="<div class='container'>"+
				  "<h2>WebPart Header Section</h2>"+
				  "<p>Select color</p>"+
				  "<div class='form-inline'>"+
				  "<select class='form-control' id='ddlWebpartColor'>"+
				  "<option value='Select'>Select</option>";
		 $.ajax({
				url: restUrl,
				type: "GET",
				cache: false,
				headers: { "accept": "application/json;odata=verbose" },
				success: function (data) {
					
					for(var i=0; i< data.d.results.length; i++)
					{
						_html+= "<option value='"+data.d.results[i].Title+"'>"+data.d.results[i].Title+"</option>";
					}
					_html= _html+ "</select>&nbsp;<button id='btnWebpartHeader' type='button' class='btn btn-default'>Set</button></div><br></div>";
					$(_html).insertAfter('.ms-ToolPaneBody');
					
					$('#btnWebpartHeader').click(function() {//button click
						if($('#ddlWebpartColor :selected').text()=="Select")
						{
							alert("Please select color");
						}else{
						  ExecuteOrDelayUntilScriptLoaded(setColorToWebpartProperties, 'sp.js');
						}
					});
					ExecuteOrDelayUntilScriptLoaded(getCurrentWebpartColor, 'sp.js');
				},
				error: function (error) {
				    console.log(JSON.stringify(error));
				   console.log('failure');
				}
			});
	}

	function createOrUpdateJson(pageUrl,wpid, _draftcolor,_publishedcolor)
	{
		var hasMatch =false;
		_colorContentJson= JSON.parse(localStorage.getItem("colorContentJson"));
		for (var index = 0; index < _colorContentJson.length; ++index) {
		 var animal = _colorContentJson[index];
		 if(_colorContentJson[index].WebpartID == wpid){ //update json
			 _colorContentJson[index].draftcolor=_draftcolor;
			 if(_publishedcolor!="")
			 _colorContentJson[index].publishedcolor=_publishedcolor;
		   hasMatch = true;
		   break;
		 }
		}
		if(!hasMatch) //create json item
		{
			var jsonitem={};
			jsonitem['WebpartID'] = wpid;
			jsonitem['draftcolor'] = _draftcolor;
			jsonitem['publishedcolor'] = _publishedcolor;
			_colorContentJson.push(jsonitem);
		}
		localStorage.setItem("colorContentJson", JSON.stringify(_colorContentJson));
		console.log(JSON.stringify(_colorContentJson));
	}
	
});

