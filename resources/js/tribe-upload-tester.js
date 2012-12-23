jQuery(document).ready(function($){

	// Using this var to track which item on a page full of multiple upload buttons is currently being uploaded.
	var current_tribe_upload = 0;

	// Define uploader settings
	var frame = wp.media({
		title : 'Tribe Image Upload Test',
		multiple : false,
		library : { type : 'image' },
		button : { text : 'Insert into Tribe Test Screen' }
	});

	// Call this from the upload button to initiate the upload frame.
	tribe_open_uploader = function(id) {
		current_tribe_upload = id;
		frame.open();
		return false;
	}

	// Handle results from media manager.
	frame.on('close',function( ) {
		var attachment = frame.state().get('selection').first().toJSON();
		tribe_render_image(attachment);
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

		$("#tribe_preview_"+current_tribe_upload).html(img_html);

		$("input[name='tribe_attachment["+current_tribe_upload+"]']").val(attachment.id);
		$("#tribe_upload_removal_button_"+current_tribe_upload).show();
	}

	tribe_clear_uploader = function( current_tribe_upload ) {
		$("#tribe_preview_"+current_tribe_upload).html('');
		$("input[name='tribe_attachment["+current_tribe_upload+"]']").val('');
		$("#tribe_upload_removal_button_"+current_tribe_upload).hide();
		return false;
	}

});