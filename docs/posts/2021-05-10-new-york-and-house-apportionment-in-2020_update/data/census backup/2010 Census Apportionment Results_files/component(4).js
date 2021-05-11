
$(window).on("load", function () {

	if($(".embeddable-image__displayedImage").length > 0) {
		$('.embeddable-image__displayedImage').each(function (index) {

			var parentContainer = $(this).parent();

			// set height and width
			var embeddableImage = parentContainer.find(".embeddable-image__embedImage")
			embeddableImage.attr("height", this.naturalHeight);
			embeddableImage.attr("width", this.naturalWidth);

			//set absolute url for embeddable image
			var relativeUrl = embeddableImage.attr("data-src");
			embeddableImage.attr("src", window.location.origin + relativeUrl);

			// add cid parameter
			var anchor = parentContainer.find(".embeddable-image__embedLink");
			var href = anchor.attr("href");
			var cid_keyword = anchor.attr("data-cid_keyword")
			if (cid_keyword) {
				anchor.attr("href", href + "?cid=" + cid_keyword.trim())
			}
			anchor.removeAttr("data-cid_keyword")

			// insert embed string into the text area
			var embedTemplateHTML = parentContainer.find(".embeddable-image__embedTemplate").html();
			parentContainer.find("#embedArea").text(embedTemplateHTML.trim());
		});
	}
});