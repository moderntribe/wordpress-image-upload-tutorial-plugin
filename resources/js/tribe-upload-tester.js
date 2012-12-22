jQuery(document).ready(function($){

	_my_media = wp.media;

	// Handle results from media manager.
	_my_media.editor.send.attachment = function(props, attachment) {
		//wp.media.editor.send.attachment = function(props, attachment) {
		render_image(props, attachment);
	}

	// Hook into upload button.
	$('.uploader .button').click(function(e) {

		// todo:
		// multiple = false
		// type = image
		// tab = upload
		// from_url = false
		// gallery = hidden

		_my_media.editor.open($(this));
		return false;
	});





	// Output selected image HTML.
	render_image = function(props, attachment) {
		console.log(props);
		console.log(attachment);

		var img_url = attachment.sizes[props.size].url;
		var img_width = attachment.sizes[props.size].width;
		var img_height = attachment.sizes[props.size].height;

		// Generate IMG
		img_html = '<img src="' + img_url + '" ';
		img_html += 'width="' + img_width + '" ';
		img_html += 'height="' + img_height + '" ';
		if ( attachment.alt != '' ) {
			img_html += 'alt="' + attachment.alt + '" ';
		}
		if ( props.align != 'none' ) {
			img_html += 'class="align' + props.align + '" ';
		}
		img_html += '/>';

		// Generate link.
		var img_link_url = false;
		if ( props.link && props.link != 'none' ) {
			if ( props.link == 'custom' ) {
				img_link_url = props.img_link_url;
			} else if ( props.link == 'file' ) {
				img_link_url = attachment.url;
			} else if ( props.link == 'post' ) {
				img_link_url = attachment.link;
			}

			var img_link_html = '<a href="' + img_link_url + '" ';
			if ( attachment.title != '' ) {
				img_link_html += 'title="' + attachment.title + '"';
			}
			img_link_html += '>' + img_html + '</a>';
			img_html = img_link_html;
		}

		$("#tribe_preview").html(img_html);
	}

});