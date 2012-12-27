jQuery(document).ready(function($){

	// Call this from the upload button to initiate the upload frame.
	tribe_open_uploader = function( current_tribe_upload, type ) {

		// Define uploader settings
		var uploader_settings = {};
		switch ( type ) {
			case 'video' :
				uploader_settings = {
					title : 'Video Upload Test',
					multiple : false,
					library : { type : 'video' },
					button : { text : 'Insert Video Tribe Test Screen' }
				};
				break;
			case 'audio' :
				uploader_settings = {
					title : 'Audio Upload Test',
					multiple : false,
					library : { type : 'audio' },
					button : { text : 'Insert Audio Tribe Test Screen' }
				};
				break;
			case 'multiple-images' :
				uploader_settings = {
					title : 'Multiple Image Upload Test',
					multiple : true,
					library : { type : 'image' },
					button : { text : 'Insert Images Tribe Test Screen' }
				};
				break;
			default :
				uploader_settings = {
					title : 'Single Image Upload Test',
					multiple : false,
					library : { type : 'image' },
					button : { text : 'Insert Image Tribe Test Screen' }
				};
		}
		var frame = wp.media(uploader_settings);

		// Handle results from media manager.
		frame.on('close',function( ) {
			var attachments = frame.state().get('selection').toJSON();
			console.log( attachments );
			switch (type) {
				case 'video' :
					tribe_render_video( current_tribe_upload, attachments[0] );
					break;
				case 'audio' :
					tribe_render_audio( current_tribe_upload, attachments[0] );
					break;
				case 'multiple-images' :
					tribe_render_multiple_images( current_tribe_upload, attachments );
					break;
				default :
					tribe_render_singe_image( current_tribe_upload, attachments[0] );
			}
		});

		frame.open();
		return false;
	}

	// Output selected image HTML.
	// This part could be totally rewritten for your own purposes to process the results!
	tribe_render_singe_image = function( current_tribe_upload, attachment) {
		$("#tribe_preview_"+current_tribe_upload).html(tribe_image_html( attachment ));
		$("input[name='tribe_attachment["+current_tribe_upload+"]']").val(attachment.id);
		$("#tribe_upload_removal_button_"+current_tribe_upload).show();
	}

	tribe_render_multiple_images = function( current_tribe_upload, attachments ) {
		var html = '';
		var ids = new Array();
		for ( var i=0; i<attachments.length; i++ ) {
			html += tribe_image_html( attachments[i] );
			ids[i] = attachments[i].id;
		}
		$("#tribe_preview_"+current_tribe_upload).html(html);
		$("input[name='tribe_attachment["+current_tribe_upload+"]']").val(ids.toString());
		$("#tribe_upload_removal_button_"+current_tribe_upload).show();
	}

	// Render the audio preview.
	tribe_render_audio = function( current_tribe_upload, attachment ) {
		$("#tribe_preview_"+current_tribe_upload).html(attachment.url);
		$("input[name='tribe_attachment["+current_tribe_upload+"]']").val(attachment.id);
		$("#tribe_upload_removal_button_"+current_tribe_upload).show();
	}

	// Render the video preview.
	tribe_render_video = function( current_tribe_upload, attachment ) {
		$("#tribe_preview_"+current_tribe_upload).html(attachment.url);
		$("input[name='tribe_attachment["+current_tribe_upload+"]']").val(attachment.id);
		$("#tribe_upload_removal_button_"+current_tribe_upload).show();
	}

	// Clear upload preview and id.
	tribe_clear_uploader = function( current_tribe_upload ) {
		$("#tribe_preview_"+current_tribe_upload).html('');
		$("input[name='tribe_attachment["+current_tribe_upload+"]']").val('');
		$("#tribe_upload_removal_button_"+current_tribe_upload).hide();
		return false;
	}

	// Render html for the image.
	tribe_image_html = function( attachment ) {
		var img_html = '<img src="' + attachment.url + '" ';
		img_html += 'width="' + attachment.width + '" ';
		img_html += 'height="' + attachment.height + '" ';
		if ( attachment.alt != '' ) {
			img_html += 'alt="' + attachment.alt + '" ';
		}
		img_html += '/>';
		return img_html;
	}

});