$(document).ready( function() {
	$('.teasercore.uscb-teaser__sponsorlogo').each(function(){
		$(this).find('.cmp-teaser__description').css({
			'padding-top' : $(this).find('.cmp-teaser__image img').outerHeight() + 'px'
		});
	});
});
