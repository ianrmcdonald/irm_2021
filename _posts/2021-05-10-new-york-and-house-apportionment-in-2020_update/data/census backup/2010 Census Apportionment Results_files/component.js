var ShareThis = (function($, _) {
	var shareThisComponents = [];

    var initShareThis = function(id) {    	
        var shareThisObj = _.find(shareThisComponents, {"id": "" + id + ""});

        if (!shareThisObj) {
            shareThisObj = {
                id: id
            }
            shareThisComponents.push(shareThisObj);
        }
        
        var $shareThis = $("#" + id);
        
        $shareThis.find('.data-uscb-share-this-link').on('click', function(event) {        	
        	shareThisClick($(this));
        });
        
        $shareThis.find('.data-uscb-share-this').on('click', function(event) {        	
        	shareThisClick($(this));
        	var element = $(this);
        	var link = $(this).attr('id');
        	
        	shareNonBasicItemHandler(element, event, link);
        });
        
        $shareThis.find('.data-uscb-dropdown-item-toggle').on('click', function(event) {        	
        	shareThisClick($(this));        	
        	var element = $(this);
        	var link = $(this).attr('id');
        	
        	var moreShareOptionsButton = $shareThis.find('.moreShareOptions__button');            
        	toggleHandler(moreShareOptionsButton);
        	shareNonBasicItemHandler(element, event, link);
        });
        
        $shareThis.find('.moreShareOptions__button').on('click', function(event) {        	        	
        	var moreShareOptionsButton = $shareThis.find('.moreShareOptions__button');            
        	toggleHandler(moreShareOptionsButton);
        });        
        
        $shareThis.find('.moreShareOptions__button').on('keydown', function(event) {        	
        	var moreShareOptionsButton = $shareThis.find('.moreShareOptions__button');
        	if (event.keyCode === 13 || event.keyCode === 32) {        		
                toggleHandler(moreShareOptionsButton);
        	} else if (event.keyCode === 27) {
                var ulElement = $(moreShareOptionsButton.siblings('ul')[0]);
                var dropDownOpen = !ulElement.hasClass('uscb-hide');

                if (dropDownOpen) {
                    ulElement.toggleClass('uscb-hide');
                    moreShareOptionsButton.attr('aria-expanded', 'false')
                }
        	}
        });
        
        function shareNonBasicItemHandler(element, event, link) {
        	var selectedElement;
            var target = $(element);

            selectedElement = target[0];

            var title = $(selectedElement).attr("title");
            if (title === "Instagram" || title === "Snapchat" || title === "YouTube") {
                copyToClipboard(link);
            }

            // Grab the current logo and append it to the Pinterest URL as the media parameter
            if (title === 'Pinterest') {
                var currentLink = $(selectedElement).attr('href');
                var logoLink = location.origin + $('.uscb-nav-image').attr('src');
                $(selectedElement).attr('href', currentLink + '&media=' + logoLink);
            }

            if (title === 'Download') {
                $(selectedElement).prop('download', "");
            } else {
                $(location).attr("href", $(selectedElement).attr("id"));
            }
        }
        
        function copyToClipboard(link) {
            // Create new element
            var el = document.createElement('textarea');
            // Set value (string to be copied)
            el.value = link;
            // Set non-editable to avoid focus and move outside of view
            el.setAttribute('readonly', '');
            el.style = {position: 'absolute', left: '-9999px'};
            document.body.appendChild(el);
            // Select text inside element
            el.select();
            // Copy text to clipboard
            document.execCommand('copy');
            // Remove temporary element
            document.body.removeChild(el);
        }
        
        function toggleHandler(btn) {
        	var ulElement = $(btn.siblings('ul')[0]);
            ulElement.toggleClass('uscb-hide');
            
            var newAriaExpandedState = btn.attr('aria-expanded') === 'true' ? 'false' : 'true';
            btn.attr('aria-expanded', newAriaExpandedState)
        }
    }

    return {        
    	initShareThis: initShareThis
    }

})(jQuery, window._);