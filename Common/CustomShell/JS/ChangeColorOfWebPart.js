$(document).ready(function () {
/*var clientContext,oWebsite 
SP.SOD.executeFunc('sp.js', 'SP.ClientContext', CustomdeleteUserCustomAction); 
 var IsEditMode = 
document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value; 
if (IsEditMode == "1") { 
// page is in edit mode 
console.log("page is in edit mode");
//AddRibbonElements();
} 
else {
console.log("page is in display  mode");
}*/

});


function CustomdeleteUserCustomAction()  
{  
debugger;
clientContext = new SP.ClientContext(); 
oWebsite = clientContext.get_web();  
collUserCustomAction = oWebsite.get_userCustomActions();  
clientContext.load(oWebsite, 'UserCustomActions');  
clientContext.executeQueryAsync(Function.createDelegate(this, this.deleteCustomAction), Function.createDelegate(this, this.onQueryFailed));  
}  
function deleteCustomAction()  
{  
debugger;
	
	var customActionEnumerator = collUserCustomAction.getEnumerator();  
	while (customActionEnumerator.moveNext())  
 	{  
		var oUserCustomAction = customActionEnumerator.get_current();  
		if (oUserCustomAction.get_id() == "6e92e5c0-ac48-496a-bacc-a6cbc5a06c1d" ||
		oUserCustomAction.get_id() == "87e8bbfe-6684-40a8-a426-be1c7e7351fd" )   
		{  
			oUserCustomAction.deleteObject();  
			clientContext.load(oUserCustomAction);  
			clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceededdelete), Function.createDelegate(this, this.onQueryFailed));  
			break;
		} 
		 
	}  
}  
function onQuerySucceededdelete()  
{  
  console.log("Query Succededd");
}  
function onQueryFailed(sender, args)  
{  
	console.log("Query failed");

} 

function AddRibbonElements()
{
debugger;
var context = new SP.ClientContext.get_current();
this.site = context.get_web();
var customAction = this.site.get_userCustomActions().add();
customAction.set_location('CommandUI.Ribbon');

var uiExtension = '<CommandUIExtension xmlns="http://schemas.microsoft.com/sharepoint/">' +
                        '<CommandUIDefinitions>' +
                            '<CommandUIDefinition Location="Ribbon.WikiPageTab.EditAndCheckout.Controls._children">'+
                                '<Button Id="Ribbon.WikiPageTab.EditAndCheckout.CheckLinkedPageItemsButton" '+
                                        'Command="Check" '+
                                        'Sequence="0" '+
                                        'Image16by16="/_layouts/images/NoteBoard_16x16.png" '+
                                        'Image32by32="/_layouts/images/NoteBoard_32x32.png" '+
                                        'Description="Uses the notification area to display a message." '+
                                        'LabelText="Notify hello" '+
                                        'TemplateAlias="o1"/>' +
                            '</CommandUIDefinition>'+
                        '</CommandUIDefinitions>'+
                        '<CommandUIHandlers>'+
                            '<CommandUIHandler Command="Check" '+
                                'CommandAction="javascript:alert(\'button clicked!\');" />'+
                        '</CommandUIHandlers>'+
                       '</CommandUIExtension>';

customAction.set_commandUIExtension(uiExtension);
//customAction.set_registrationId("850");
//customAction.set_registrationType(SP.UserCustomActionRegistrationType.list);

customAction.update();

context.load(this.site,'UserCustomActions');

context.executeQueryAsync(
function () { alert("Success!") },
 function () { alert("Request failed") }
);
}
