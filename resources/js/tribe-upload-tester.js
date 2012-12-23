jQuery(document).ready(function($){

	// Define uploader settings
	var frame = wp.media({
		title : 'Tribe Image Upload Test',
		multiple : false,
		library : { type : 'image' },
		button : { text : 'Insert into Tribe Test Screen' }
	});

	// Handle results from media manager.
	frame.on('close',function( ) {
		var attachment = frame.state().get('selection').first().toJSON();
		tribe_render_image(attachment);
	});

	// Hook into upload button.
	$('.uploader .button').click(function(e) {
		frame.open();
		return false;
	});

	// Output selected image HTML.
	// This part could be totally rewritten for your own purposes to process the results!
	tribe_render_image = function(attachment) {

		console.log(attachment);

		// Generate IMG
		img_html = '<img src="' + attachment.url + '" ';
		img_html += 'width="' + attachment.width + '" ';
		img_html += 'height="' + attachment.height + '" ';
		if ( attachment.alt != '' ) {
			img_html += 'alt="' + attachment.alt + '" ';
		}
		img_html += '/>';

		$("#tribe_preview").html(img_html);

		// if you save this you will probably want to also verify the nonce for security (attachment.nonces.update).
		//console.log(attachment.nonces.update);

	}

});