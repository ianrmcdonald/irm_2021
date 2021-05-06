function languageSelectionClick(lang) {
	var languageClick = 'Lang:' + lang;
	digitalData.event.eventInfo.language.pageLanguage = digitalData.page.pageInfo.pageName + '^' + languageClick;
	digitalData.event.eventName = 'Page Language';
	digitalData.event.eventInfo.eventName = 'Language Dropdown';
	digitalData.event.eventInfo.language = lang;

	if ( typeof(Storage) !== "undefined" ) {
		localStorage.setItem("pageLanguage", digitalData.event.eventInfo.language.pageLanguage);
		localStorage.setItem("langEventName", "Page Language");
		localStorage.setItem("eventInfoEventName", "Language Dropdown");
		localStorage.setItem("eventInfoLanguage", lang);
	} else{
		setCookie("pageLanguage", digitalData.event.eventInfo.language.pageLanguage);
		setCookie("langEventName", "Page Language");
		setCookie("eventInfoEventName", "Language Dropdown");
		setCookie("eventInfoLanguage", lang);
	}
}

function handleToggleLangDropdown(e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
    	e.preventDefault();
		toggleLanguageDropDown(e.target);
    }
}

function toggleLanguageDropDown(elem) {
    var selectedElement;
    var ulElement = $('.uscb-lang-dropdown-selection');
    var languageDropdown = $('.uscb-input-container')
    var target = $(elem);

    if (target.is("li") ) {
        selectedElement = target[0];
        ulElement.toggleClass('uscb-hide-dropdown');
		languageDropdown.attr('aria-expanded', false);

        languageSelectionClick($(selectedElement).text());

        $(location).attr("href", $(selectedElement).attr("id"));
    } else {
        ulElement.toggleClass('uscb-hide-dropdown');

		var newAriaExpandedState = languageDropdown.attr('aria-expanded') === 'true' ? 'false' : 'true';

		languageDropdown.attr('aria-expanded', newAriaExpandedState);

        $('.uscb-lang-dropdown').prepend("<div class='uscb-dropdown-backdrop'></div>");
        $('.uscb-dropdown-backdrop').click(function(event) {
            ulElement.toggleClass('uscb-hide-dropdown');

            $(this).remove();
            event.stopPropagation();
        });
    }
}

function onKeyParent(event) {
    if (event.keyCode === 40) { //down arrow
   		var target = document.getElementById("languageSelector");
    	var element = target.querySelector(".lang-options");

    	if (element) {
      		element.focus();
        	event.stopPropagation();
    	}
    }
}

function onKeyChild(event, element) {
	if (event.keyCode === 13 || event.keyCode === 32) { //enter or space
		event.preventDefault();
	    var ulElement = $('.uscb-lang-dropdown-selection');
		var languageDropdown = $('.uscb-input-container')
	    var target = $(element);

	    var selectedElement = target[0];
		languageDropdown.attr('aria-expanded', false);
	    ulElement.toggleClass('uscb-hide-dropdown');

	    languageSelectionClick($(selectedElement).text());

	    $(location).attr("href", $(selectedElement).attr("id"));
	}
}

function moveLanguageSelector(){
	if (Modernizr.mq('only screen and (min-width : 10px) and (max-width : 992px)')) {//was 576px
		$('#mobileLanguageSelectorContainer').append($('#languageSelector'));
	} else {
		$('#desktopLanguageSelectorContainer').append($('#languageSelector'));
	}
}

$(document).ready(function(){
	moveLanguageSelector();
	$(window).resize(function(){
		moveLanguageSelector();
	});
});//end document.ready function
