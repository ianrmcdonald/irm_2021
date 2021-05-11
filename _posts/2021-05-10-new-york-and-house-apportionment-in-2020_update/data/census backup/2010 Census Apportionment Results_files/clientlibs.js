(function() {
    'use strict';

    var $expandCollapses = $( '.uscb-accordion__expand-collapse' );
    $expandCollapses.each( function( idx, eC ) {
        var $accordions = $( eC ).find( '.cmp-accordion__item' );
        if ( $accordions.length > 1 ) {
            addControls( eC );
            addObservers( eC );
        }
    });

      // Build and apply control section
    function addControls( parent ) {
        var $controls = $( '<div class="uscb-layout-row"></div>' );

          // Build Expand All button
        var $expandButton = buildButton( 'Expand All', false, 'uscb-padding-L-0' );
        $expandButton.click( { parent: parent, type: 'expand' }, clickAll );
        $expandButton.keydown( function(event) { event.keyCode === 13 ? clickAll( parent, 'expand' ) : '' } );
        $controls.append( $expandButton );

        $controls.append( $( '<hr class="uscb-vertical-hr uscb-accordion-hr">') );
        
          // Build Collapse All button
        var $collapseButton = buildButton( 'Collapse All', true );
        $collapseButton.click( { parent: parent, type: 'collapse' }, clickAll );
        $expandButton.keydown( function(event) { event.keyCode === 13 ? clickAll( parent, 'collapse' ) : '' } );
        $controls.append( $collapseButton );

        $( parent ).prepend( $controls );
    }

    function buildButton( type, hidden, classes ) {
        var $button = $( '<div role="button"></div>' );
        $button.addClass( hidden ? 'uscb-accordion-expand-collapse-disabled' : 'uscb-accordion-expand-collapse' );
        $button.addClass( 'uscb-padding-LR-10' );
        $button.addClass( classes );
        $button.text( type );

        return $button;
    }

      // Expand/collapse all child accordions using emulated click events
    function clickAll( event ) {
        var parent = event.data.parent;
        var type = event.data.type;

        var $accordionButtons = $( parent ).find( '.cmp-accordion__button' );
        $accordionButtons.each( function( idx, button ) {
            var expanded = $( button ).hasClass( 'cmp-accordion__button--expanded' );
            if ( type === 'expand' ) {
                if ( !expanded ) {
                    $( button ).click();
                }
            } else if ( type === 'collapse' ) {
                if ( expanded ) {
                    $( button ).click();
                }
            }
        });
    }

      // Add mutation observers to all children of given parent
    function addObservers( parent ) {
          // Define and set observers
        var observer = new MutationObserver( watchChildren );
        var $accordionItems = $( parent ).find( '.cmp-accordion__item' );
        $accordionItems.each( function( idx, item ) {
            observer.observe( item, {
                attributes: true
            });
        });

          // Mock mutations to be able to call function once to set initial settings
        watchChildren( [ { target: $accordionItems.get(0) } ] );
    }

      // Check child status and modify controls based on results
    function watchChildren( mutations ) {
          // Check status of all siblings of mutated element
        var accordion = mutations[0].target.parentElement;
        var status = checkChildStatus( accordion );

        var controls = accordion.previousElementSibling;
        var $expandButton = $( controls.childNodes[0] );
        var $collapseButton = $( controls.childNodes[2] );

          // Reset classes before determining current status
        $expandButton.removeClass( 'uscb-accordion-expand-collapse uscb-accordion-expand-collapse-disabled' );
        $collapseButton.removeClass( 'uscb-accordion-expand-collapse uscb-accordion-expand-collapse-disabled' );

        if ( status < 0 ) {
            $expandButton.addClass( 'uscb-accordion-expand-collapse' );
            $collapseButton.addClass( 'uscb-accordion-expand-collapse-disabled' );
        } else if ( status === 0 ) {
            $expandButton.addClass( 'uscb-accordion-expand-collapse' );
            $collapseButton.addClass( 'uscb-accordion-expand-collapse' );
        } else if ( status > 0 ) {
            $expandButton.addClass( 'uscb-accordion-expand-collapse-disabled' );
            $collapseButton.addClass( 'uscb-accordion-expand-collapse' );
        }

          // Set tab indexes for accessibility
        $expandButton.attr( 'tabindex', status < 1 ? 0 : -1 );
        $collapseButton.attr( 'tabindex', status > -1 ? 0 : -1 );
    }

      // Returns negative value if all children are closed, 0 is they're mixed, positive if all open
    function checkChildStatus( accordion ) {
        var $accordionItems = $( accordion ).find( '.cmp-accordion__item' );
        var status = 0;
        $accordionItems.each( function( idx, item ) {
            item.hasAttribute( 'data-cmp-expanded' ) ? status += 1 : status -= 1;
        });
        
        return Math.abs( status ) === $accordionItems.length ? status : 0;
    }
})();
