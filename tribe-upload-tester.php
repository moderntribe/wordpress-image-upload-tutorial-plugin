<?php
/*
Plugin Name: Tribe Upload Tester
Description: A simple test of WordPress 3.5+ uploader integration.
Author: Peter Chester of Modern Tribe, Inc.
Version: 1.0
Author URI: http://tri.be

Huge thanks to:
Kyle Unzicker for pointing me in the right direction:
http://codestag.com/how-to-use-wordpress-3-5-media-uploader-in-theme-options/
*/

// Block direct requests
if ( !defined('ABSPATH') )
	die('-1');

class Tribe_Upload_Tester {

	const PAGE_NAME = 'tribe-upload-tester';

	/**
	 * Set up all the hooks for the plugin.
	 */
	function __construct() {
		add_action( 'load-tribe-uploader', array( $this, 'tribe_admin_setup' ) );
		add_action( 'load-settings_page_'.self::PAGE_NAME, array( $this, 'tribe_admin_setup' ) );
		add_action( 'admin_menu', array( $this, 'tribe_add_options_page' ) );
	}

	/**
	 * Enqueue all the javascript.
	 */
	function tribe_admin_setup() {
		wp_enqueue_media();
		wp_enqueue_script( 'tribe-upload-tester', plugins_url('resources/js/tribe-upload-tester.js', __FILE__), array('jquery') );
	}

	/**
	 * Add settings page menu item.
	 */
	function tribe_add_options_page() {
		add_options_page( __('Tribe Upload Tester'), __('Tribe Upload Tester'), 'manage_options', self::PAGE_NAME,  array( $this, 'tribe_options_page_view' ) );
	}

	/**
	 * Render the admin settings page.
	 */
	function tribe_options_page_view() {
		?>
		<div class="wrap">
			<?php screen_icon('upload'); ?>
			<h2><?php _e('Tribe Upload Tester'); ?></h2>
			<p><?php _e('Click the button bellow to invoke the WordPress uploader. Once you have uploaded and selected an image, you should see it displayed below.'); ?></p>
			<?php $this->tribe_render_button(); ?>
		</div>
		<?php
	}

	/**
	 * Render the Upload button.
	 */
	function tribe_render_button() {
		?>
		<div class="uploader">
			<form>
			<input type="submit" class="button" name="tribe_uploader_button" id="tribe_uploader_button" value="<?php _e('Upload'); ?>" />
			<div id="tribe_preview"></div>
			</form>
		</div>
		<?php
	}

}
$tribe_upload_tester = new Tribe_Upload_Tester();
?>