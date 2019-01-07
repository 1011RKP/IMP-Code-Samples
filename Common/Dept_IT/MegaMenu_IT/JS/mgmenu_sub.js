/*
Item Name : Universal Mega Menu
Item URI : http://codecanyon.net/item/universal-responsive-mega-menu/4984236
Author URI : http://codecanyon.net/user/Pixelworkshop/
Version : 1.1
*/




(function ($) {


    $.universalMegaMenu = function (element, options) {


        var settings = {
            menu_effect: 'hover_fade',
            menu_speed_show: 300,
            menu_speed_hide: 200,
            menu_speed_delay: 200,
            menu_click_outside: true,
            menubar_trigger: true,
            menubar_hide: false,
            menu_responsive: true
        };

        var plugin = this;

        plugin.options = {}

        var $element = $(element);
        var element = element;

        var megaMenu = $element.children('.mgmenu'),
            menuItem = $(megaMenu).children('li'),
            menuItemSpan = $(menuItem).children('span'),
            menuDropDown = $(menuItem).find('.dropdown_container, .dropdown_fullwidth'),
            menuItemFlyOut = $(menuItem).find('.dropdown_parent'),
            menuItemFlyOutLink = $(menuItemFlyOut).children('a'),
            menuItemFlyOutDropDown = $(menuItemFlyOut).find('.dropdown_flyout_level'),
            menuButton = $element.find('.mgmenu_button'),
            menuItemElement = $(menuItem).add(menuItemFlyOut),
            menuItemLink = $(menuItemSpan).add(menuItemFlyOutLink),
            menuDropDownElement = $(menuDropDown).add(menuItemFlyOutDropDown);


        plugin.init = function () {

            settings = $.extend(1, settings, options);

            hoverIntentConfig = {
                sensitivity: 2, // number = sensitivity threshold (must be 1 or higher)
                interval: settings.menu_speed_delay, // number = milliseconds for onMouseOver polling interval
                over: megaMenuOver, // function = onMouseOver callback (REQUIRED)
                timeout: 200, // number = milliseconds delay before onMouseOut
                out: megaMenuOut // function = onMouseOut callback (REQUIRED)
            };

            megaMenuPosition();
            megaMenuEvents();
            megaMenuTabs();

            if (settings.menu_click_outside === true) {
                megaMenuClickOut();
            }
            if (settings.menubar_trigger === true) {
                megamenuBarHide = settings.menubar_hide;
                megaMenuTrigger($element);
            }

        }


        var megaMenuPosition = function () {

            if (("ontouchstart" in document.documentElement) && (settings.menu_responsive === true)) {

                if ($(window).width() < 768) {
                    $(menuDropDownElement).hide();
                } else {
                    megaMenuToggleElements();
                }

                $(menuItemElement).toggleClass('noactive');

                $(window).bind('orientationchange', function () {
                    megaMenuToggleElements();
                });

            } else {

                megaMenuToggleElements();

                $(window).resize(function () {
                    megaMenuToggleElements();
                    if (!$element.is(':visible') && $(window).width() < 768) {
                        $element.show(0);
                    }
                });

            }

            $(menuButton).click(function () {
                $(menuButton).toggleClass('mgmenu_button_active');
                $(menuItem).not(":eq(0)").toggle(0);
            });

        }


        var megaMenuToggleElements = function () {

            $(menuDropDownElement).css({ 'display': 'block' }).hide(0);

        }


        var megaMenuClickOut = function () {

            var ua = navigator.userAgent,
                event = (ua.match(/iPad/i)) ? "touchstart" : "click";

            $(document).on(event, function (e) {
                $(menuItemElement).removeClass('active');
                $(menuDropDownElement).hide(0);
            });
            $(element).on(event, function (e) {
                e.stopPropagation();
            });

        }


        var megaMenuTrigger = function ($bar) {

            $bar.after('<a class="mgmenu_trigger" href="#"></a>');

            var $this = $bar.next('a');

            if (megamenuBarHide === true && $(window).width() >= 768) {
                $bar.hide(0);
                $('.mgmenu_trigger').toggleClass("active");
            }

            $this.click(function () {
                $(this).prev($bar).slideToggle(300);
                $(this).toggleClass("active");
                return false;
            });

        }


        var megaMenuEvents = function () {

            if (("ontouchstart" in document.documentElement) && (settings.menu_responsive === true)) {

                $(menuItemElement).unbind('mouseenter mouseleave').click(function () {

                    var $this = $(this);
                    $this.siblings().removeClass('active').addClass('noactive')
                        .find(menuDropDownElement).hide(0);
                    $this.toggleClass('active noactive')
                        .find(menuDropDownElement).first().toggle(0)
                        .click(function (event) {
                            event.stopPropagation();
                        });
                });

                $(document).click(function () {
                    $(menuItemElement).addClass('noactive');
                    $(menuDropDownElement).hide(0);
                });
                $element.click(function (event) {
                    event.stopPropagation();
                });
                $(window).bind('orientationchange', function () {
                    $(menuItemElement).addClass('noactive');
                    $(menuDropDownElement).hide(0);
                });

                return;

            } else {

                switch (settings.menu_effect) {

                    case 'open_close_fade':
                        var menuEffectShow = 'fadeToggle',
                            menuEffectHide = 'fadeOut';
                        break;
                    case 'open_close_slide':
                        var menuEffectShow = 'slideToggle',
                            menuEffectHide = 'slideUp';
                        break;

                }

                switch (settings.menu_effect) {

                    case 'hover_fade':
                    case 'hover_slide':
                    case 'click_fade':
                    case 'click_slide':
                        $(menuItem).hoverIntent(hoverIntentConfig);
                        $(menuItemFlyOut).hoverIntent(hoverIntentConfig);
                        break;

                    case 'open_close_fade':
                    case 'open_close_slide':

                        $(menuItemElement).unbind('mouseenter mouseleave').click(function () {

                            var $this = $(this);
                            $this.siblings().removeClass('active')
                                .find(menuDropDownElement)[menuEffectHide](settings.menu_speed_hide);
                            $this.toggleClass('active')
                                .find(menuDropDownElement).first()
                                .delay(settings.menu_speed_delay)[menuEffectShow](settings.menu_speed_show)
                                .click(function (event) {
                                    event.stopPropagation();
                                });

                        });

                        break;

                }

            }

        }


        var megaMenuTabs = function () {

            $('.mgmenu_tabs').each(function (index, value) {

                var menuTabs = $(this);
                menuTabsNav = menuTabs.find(".mgmenusub_tabs_nav > li > a");

                menuTabsNav.click(function () {

                    var menuTabsLinkCurrent = menuTabs.find("a.current").attr("href").substring(1),
                        $menuTabsLink = $(this),
                        menuTabsLinkID = $menuTabsLink.attr("href").substring(1);

                    if ((menuTabsLinkID != menuTabsLinkCurrent) && (menuTabs.find(":animated").length == 0)) {

                        menuTabs.find(".mgmenusub_tabs_nav li a").removeClass("current");
                        $menuTabsLink.addClass("current");

                        menuTabs.find("#" + menuTabsLinkCurrent).fadeOut(300, function () {

                            menuTabs.find("#" + menuTabsLinkID).fadeIn(300);
                            var newHeight = menuTabs.find("#" + menuTabsLinkID).height();

                        });

                    }

                    return false;

                });

            });

        }


        function megaMenuOver() {

            var $this = $(this);

            switch (settings.menu_effect) {

                case 'hover_fade':
                    $this.children(menuDropDownElement).fadeIn(settings.menu_speed_show);
                    break;
                case 'hover_slide':
                    $this.children(menuDropDownElement).slideDown(settings.menu_speed_show);
                    break;
                case 'click_fade':
                    $this.click(function () {
                        $this.children(menuDropDownElement).fadeIn(settings.menu_speed_show);
                    });
                    break;
                case 'click_slide':
                    $this.click(function () {
                        $this.children(menuDropDownElement).slideDown(settings.menu_speed_show);
                    });
                    break;

            }

        }


        function megaMenuOut() {

            var $this = $(this);

            switch (settings.menu_effect) {
                case 'hover_fade':
                case 'click_fade':
                    $this.find(menuDropDownElement).fadeOut(settings.menu_speed_hide);
                    break;
                case 'hover_slide':
                case 'click_slide':
                    $this.find(menuDropDownElement).slideUp(settings.menu_speed_hide);
                    break;

            }

        }


        plugin.init();

    }


    $.fn.universalMegaMenu = function (options) {
        return this.each(function () {
            if (undefined == $(this).data('megaMenu')) {

                var plugin = new $.universalMegaMenu(this, options);
                $(this).data('megaMenu', plugin);
            }
        });
    }
})(jQuery);

function ShowDepartmentsSlideSubMenuItems(id) {
    var menuTabs = $("#" + id).parent();
    while (!menuTabs.is('div')) {
        menuTabs = menuTabs.parent();
    }
    var menuTabsLinkCurrent = menuTabs.find("a.current"),
    $menuTabsLink = $("#" + id),
    menuTabsLinkID = $menuTabsLink.attr("href").substring(1);
    if (menuTabsLinkCurrent.length > 0) {
        menuTabsLinkCurrent = menuTabs.find("a.current").attr("href").substring(1);
        menuTabsLinkCurrentId = menuTabs.find("a.current").attr("id");
        if ((menuTabsLinkID != menuTabsLinkCurrent) && (menuTabs.find(":animated").length == 0)) {
            menuTabs.find(".mgmenusub_tabs_nav li a").removeClass("current");
            $menuTabsLink.addClass("current");
            menuTabs.find("#" + menuTabsLinkCurrent).fadeOut(300, function () {
                menuTabs.find("#" + menuTabsLinkID).fadeIn(300);
                var newheight = menuTabs.find("#" + menuTabsLinkID).height();
            });
        }
    }
    return false;
}

function OpenMenuItemsonSubHamburgerClick() {
    var ul = $('.mgmenusubXS');
    if (ul.attr("style").indexOf('none') > 0) {
        ul.attr("style", "display: block;");
    }
    else if (ul.attr("style").indexOf('block') > 0) {
        ul.attr("style", "display: none;");
    }
}

function OpensecondsubsmallDevices(event, id) {
    var li = $(id);
    var span = $(li).find('> span');
    var hidden = span.find("> #hiddenmenutype").val();
    var style;
    if (hidden == "menuList") {
        style = $(li).find("ul#menuList");
    }
    else if (hidden == "megaMenuDropdown") {
        style = $(li).find("ul#smShowDepartments");
    }
    else {
        var spanid = span.attr("id").substring(1);
        style = $(li).find("ul#" + spanid)
    }
    var showelement = $(style).attr("style")
    if (showelement.indexOf('none') > 0) {
        $(li).find(style).attr("style", "display: block;");
    }
    else if (showelement.indexOf('block') > 0) {
        $(li).find(style).attr("style", "display: none;");
    }
    if (!event) event = window.event
    event.stopPropagation();
}

function OpenSubListingItems(event, id) {
    var liparent = $(id);
    var anchortag = $(liparent).find('> a');
    var anchorid = anchortag.attr("href").substring(1);
    var style = $(liparent).find('> #' + anchorid).attr("style");
    if (style.indexOf('none') > 0) {
        $(liparent).find('> #' + anchorid).attr("style", "display: block;")
    }
    else if (style.indexOf('block') > 0) {
        $(liparent).find('> #' + anchorid).attr("style", "display: none;");
    }
    event.stopPropagation();
}
function OpenSubListingListItems(event, id) {
    var liparent = $(id);
    var anchortag = $(liparent).find('> a');
    var anchorid = anchortag.attr("id").substring(1);
    var style = $(liparent).find('> #' + anchorid).attr("style");
    if (style.indexOf('none') > 0) {
        $(liparent).find('> #' + anchorid).attr("style", "display: block;")
    }
    else if (style.indexOf('block') > 0) {
        $(liparent).find('> #' + anchorid).attr("style", "display: none;");
    }
    event.stopPropagation();
}

function ShowMenu(id) {
    var megaMenu = $(id).parent();
    var menuItem = $(megaMenu).children('li');
    $(menuItem).not(":eq(0)").toggle(0);
}

function ChangeanchortagTextColorSubMenu(id) {
    $(id).find('.TopMenuTitlesub').css('color', 'white')
    var value = $(id).find('> div.dropdown_fullwidth').attr("style");
    if (value != undefined) {
        if (value.indexOf("/*") < 0) {
            $(id).find('> div.dropdown_fullwidth').attr("style", "/*" + value + "*/");
        }
    }
    value = $(id).find('> div.dropdown_container').attr("style");
    if (value != undefined) {
        if (value.indexOf("/*") < 0) {
            $(id).find('> div.dropdown_container').attr("style", "/*" + value + "*/");
        }
    }
    $(id).find('> .TopMenuTitlesub').css('color', 'white');
}

function ChangeSlideSpantoBlue(id) {
    $(id).find('.TopMenuTitlesub').css('color', '#0065A1')
}
