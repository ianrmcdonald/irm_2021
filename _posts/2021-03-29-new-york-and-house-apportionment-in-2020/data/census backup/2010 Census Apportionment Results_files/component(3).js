var CensusAccordion = (function($, _, digitalData) {

    var accordions = [];

    var initAccordion = function(id) {

        var accordionObj = _.find(accordions, {"id": "" + id + ""});
        if (!accordionObj) {
            accordionObj = {
                id: id,
                isOpenCount: 0
            }
            accordions.push(accordionObj);
        }

        var $accordion = $("#" + id);

        $accordion.find('.data-uscb-accordion-expand-all').on('click', function () {
            var accordion = findParentAccordion($(this));

            accordion.$accordion.find(".uscb-accordion").each(function (index, element) {
                $(element).children('.uscb-accordion_panel').removeClass("uscb-accordion-show-panel");
                chevronFlip($(element), "open");
            });

            accordion.accordionObj.isOpenCount = $("#" + id).find(".uscb-accordion").length;

            handleOpenCount(accordion);

            fireAnalytics(accordion.$accordion.find(".uscb-accordion-header").first(), $(this).text());
        });

        $accordion.find('.data-uscb-accordion-expand-all').keydown(function (event) {
            if (event.keyCode === 13 || event.keyCode === 32) {
                var accordion = findParentAccordion($(this));

                accordion.$accordion.find(".uscb-accordion").each(function (index, element) {

                    $(element).children('.uscb-accordion_panel').removeClass("uscb-accordion-show-panel");
                    chevronFlip($(element), "open");
                });

                accordion.accordionObj.isOpenCount = $("#" + id).find(".uscb-accordion").length;

                handleOpenCount(accordion);

                fireAnalytics(accordion.$accordion.find(".uscb-accordion-header").first(), $(this).text());
            }
        });

        $accordion.find('.data-uscb-accordion-collapse-all').on('click', function () {
            var accordion = findParentAccordion($(this));

            accordion.$accordion.find(".uscb-accordion").each(function (index, element) {

                $(element).children('.uscb-accordion_panel').addClass("uscb-accordion-show-panel");
                chevronFlip($(element), "close");
            });

            accordion.accordionObj.isOpenCount = 0;

            handleOpenCount(accordion);
        });

        $accordion.find('.data-uscb-accordion-collapse-all').keydown(function (event) {
            if (event.keyCode === 13 || event.keyCode === 32) {
                var accordion = findParentAccordion($(this));

                accordion.$accordion.find(".uscb-accordion").each(function (index, element) {

                    $(element).children('.uscb-accordion_panel').addClass("uscb-accordion-show-panel");
                    chevronFlip($(element), "close");
                });

                accordion.accordionObj.isOpenCount = 0;

                handleOpenCount(accordion);
            }
        });


        $accordion.find(".uscb-accordion-header").each(function (index, element) {
            $(element).on('click', function () {
                var accordion = findParentAccordion($(this));
                var $spanLast = $(this).find('.data-uscb-panel-header-span');
                var $panel = $(this).siblings('.uscb-accordion_panel').first();

                $panel.toggleClass("uscb-accordion-show-panel");

                if ($panel.hasClass("uscb-accordion-show-panel")) {
                    accordion.accordionObj.isOpenCount--;
                    if (accordion.accordionObj.isOpenCount <= 0) {
                        accordion.accordionObj.isOpenCount = 0;
                    }

                    chevronFlip($(this).parent(), "close");

                } else {
                    accordion.accordionObj.isOpenCount++;
                    chevronFlip($(this).parent(), "open");
                }

                handleOpenCount(accordion);

                fireAnalytics($(element), $spanLast.text());
            });

            $(element).keydown(function (event) {
                if (event.keyCode === 13 || event.keyCode === 32) {
					event.preventDefault();
                    var accordion = findParentAccordion($(this));
                    var $spanLast = $(this).find('.data-uscb-panel-header-span');
                    var $panel = $(this).siblings('.uscb-accordion_panel').first();

                    $panel.toggleClass("uscb-accordion-show-panel");

                    if ($panel.hasClass("uscb-accordion-show-panel")) {
                        accordion.accordionObj.isOpenCount--;
                        if (accordion.accordionObj.isOpenCount <= 0) {
                            accordion.accordionObj.isOpenCount = 0;
                        }

                        chevronFlip($(this).parent(), "close");

                    } else {
                        accordion.accordionObj.isOpenCount++;
                        chevronFlip($(this).parent(), "open");
                    }

                    handleOpenCount(accordion);

                    fireAnalytics($(element), $spanLast.text());
                }
            });

        });

        function handleOpenCount(accordion) {
            var expandAllButton = accordion.$accordion.find('.data-uscb-accordion-expand-all');
            var collapseAllButton = accordion.$accordion.find('.data-uscb-accordion-collapse-all');
            if (accordion.accordionObj.isOpenCount === 0) {
                expandAllButton.switchClass('uscb-accordion-expand-collapse-disabled', 'uscb-accordion-expand-collapse');
                collapseAllButton.switchClass('uscb-accordion-expand-collapse', 'uscb-accordion-expand-collapse-disabled');

                expandAllButton.attr('tabindex', 0);
                collapseAllButton.attr('tabindex', -1);

                expandAllButton.attr('aria-expanded', false);
                collapseAllButton.attr('aria-expanded', false);
            }
            else if (accordion.accordionObj.isOpenCount === accordion.$accordion.find(".uscb-accordion").length) {
                expandAllButton.switchClass('uscb-accordion-expand-collapse', 'uscb-accordion-expand-collapse-disabled');
                collapseAllButton.switchClass('uscb-accordion-expand-collapse-disabled', 'uscb-accordion-expand-collapse');

                expandAllButton.attr('tabindex', -1);
                collapseAllButton.attr('tabindex', 0);

                expandAllButton.attr('aria-expanded', true);
                collapseAllButton.attr('aria-expanded', true);
            } else {
                expandAllButton.switchClass('uscb-accordion-expand-collapse-disabled', 'uscb-accordion-expand-collapse');
                collapseAllButton.switchClass('uscb-accordion-expand-collapse-disabled', 'uscb-accordion-expand-collapse');

                expandAllButton.attr('tabindex', 0);
                collapseAllButton.attr('tabindex', 0);

                expandAllButton.attr('aria-expanded', true);
                collapseAllButton.attr('aria-expanded', true);
            }
        }

        function findParentAccordion($child) {
            var $accordion = $child.closest(".data-uscb-accordion-wrapper");
            var id = $accordion.attr("id");
            var accordionObj = _.find(accordions, {"id": "" + id + ""});

            return {
                $accordion: $accordion,
                accordionObj: accordionObj,
                id: id
            };
        }

        function chevronFlip($element, state) {

            var $panelHead = $element.children('.uscb-accordion_panel_head');

            var $icon = $element.children('.uscb-accordion_panel_head').children('.uscb-chevron-icon-img');

            var $ariaValue = $panelHead[0].getAttribute("aria-expanded");

            if (state === "open") {
                $icon.removeClass("o-angle-down-1");
                $icon.addClass("o-angle-up-1");
                $ariaValue = "true";
            } else if (state === "close"){
                $icon.removeClass("o-angle-up-1");
                $icon.addClass("o-angle-down-1");
                $ariaValue = "false";
            }
            $panelHead[0].setAttribute("aria-expanded", $ariaValue);
        }

        function fireAnalytics($element, additional) {
            var accordion = findParentAccordion($element);
            var headerText = accordion.$accordion.find(".data-uscb-accordion-header").text();
            var sectionData = (additional ? additional : '');
            var clickedPanelLeaf = digitalData.page.pageInfo.pageName + '^' + sectionData.trim();

            if (typeof(digitalData.page.pageInfo.pageName) == 'undefined' || digitalData.event.eventInfo.expandCollapseList.clickName !== clickedPanelLeaf) {
            	if (typeof(sectionData) !== 'undefined' && sectionData !== '') {
            		digitalData.event.eventInfo.expandCollapseList.clickName = clickedPanelLeaf;
            		digitalData.event.eventInfo.eventName = "Expand Collapse Component Tile Click";
            		digitalData.event.eventInfo.tileInfo = sectionData.trim();
            	}
                digitalData.event.eventName = 'Expand Collapse List';
            }
        }
    }

    return {
        initAccordion: initAccordion
    }

})(jQuery, window._, digitalData);
