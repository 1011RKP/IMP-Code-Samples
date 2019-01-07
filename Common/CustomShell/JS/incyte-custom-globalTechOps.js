
function myFunction() {
if(window.location.href.toLowerCase().indexOf("isdlg=1") < 0)
    {
    $("#colspanEle").stop().animate({ "marginTop": ($('#s4-workspace').scrollTop()) + "px", "marginLeft": ($('#s4-workspace').scrollLeft()) + "px" }, "slow");
    $("#myNav").stop().animate({ "marginTop": ($('#s4-workspace').scrollTop()) + "px", "marginLeft": ($('#s4-workspace').scrollLeft()) + "px" }, "slow");
 	/*$("#subNavColspanEle").stop().animate({ "marginTop": ($('#s4-workspace').scrollTop()) + "px", "marginLeft": ($('#s4-workspace').scrollLeft()) + "px" }, "slow");
    $("#mySubNav").stop().animate({ "marginTop": ($('#s4-workspace').scrollTop()) + "px", "marginLeft": ($('#s4-workspace').scrollLeft()) + "px" }, "slow");*/
    }
}

function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > 0) // If Internet Explorer, return version number
    {
	$('.squ-img').attr("style", "margin-top: -25px;");
	$('#AsynchronousViewDefault_CalendarView').attr('style','-ms-overflow-x:hidden;');		
    }    
 	if(window.location.href.toLowerCase().indexOf("isdlg=1") > 0 &&
 	   window.location.href.toLowerCase().indexOf("calendar") > 0)
    {
    	$('#mainbody').attr("style","margin-top: -45px;");
	}
    return false;
}
$(document).ready(function () {
 $("#GetSiteBreadCrumb").load("/Sites/Common/SiteAssets/PageTitle/GetPageTitle.html");debugger
	if($('#globaltechopsSlideNavigation')[0] != undefined)
   	{
   		$('#globaltechopsSlideNavigation').load("/Sites/Common/SiteAssets/overlay_sub/overLay_globalTechOps.html");
   	}
  	else
	{
	}
	
    $("#divfooter").load("/sites/common/SiteAssets/Footer/HTML/Widget/footer.html");
    msieversion();
    $('#mgmenu1').universalMegaMenu({
        menu_effect: 'hover_fade',
        menu_speed_show: 300,
        menu_speed_hide: 200,
        menu_speed_delay: 200,
        menu_click_outside: true,
        menubar_trigger: true,
        menubar_hide: false,
        menu_responsive: true
    });
    $('.mgmenu li div.dropdown_fullwidth').each(function () {
        var current = $(this);
        var value = $(current).attr("style");
        $(current).attr("style", "/*" + value + "*/");
    });
    $('.mgmenu li div.dropdown_container').each(function () {
        var current = $(this);
        var value = $(current).attr("style");
        $(current).attr("style", "/*" + value + "*/");
    });
     $('#mgslidemenu').universalMegaMenu({
        menu_effect: 'hover_fade',
        menu_speed_show: 300,
        menu_speed_hide: 200,
        menu_speed_delay: 200,
        menu_click_outside: true,
        menubar_trigger : true,
        menubar_hide : false,
        menu_responsive: true
    }); 


    if(window.location.href.toLowerCase().indexOf("isdlg=1") > 0)
    {
        $('#s4-ribbonrow').attr("style", "height:auto !important;")
        $('#subNavColspanEle').attr("style","display:none");
        //debugger;
        var webpart = $('#AsynchronousViewDefault_CalendarView').parent().parent();
        $(webpart).attr("style","position:relative;display:block");
    }
   
		if(window.location.href.toLowerCase().indexOf("calendar") > 0 && document.URL.indexOf("#")== -1 &&
		window.location.href.toLowerCase().indexOf("isdlg=1") == -1)
		{
			window.location.reload();
			url = document.URL+"#";
        	location = "#";
        	
        	location.reload(true);
		}
});
