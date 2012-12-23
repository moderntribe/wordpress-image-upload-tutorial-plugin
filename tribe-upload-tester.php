<?php
/*
Plugin Name: Tribe Upload Tester
Description: A simple test of WordPress 3.5+ uploader integration.
Author: Peter Chester of Modern Tribe, Inc.
Version: 1.2
Author URI: http://tri.be

Huge thanks
* Kyle Unzicker for pointing me in the right direction:
* http://codestag.com/how-to-use-wordpress-3-5-media-uploader-in-theme-options/
* And Dan Cameron for helping me get to the finishline by pointing me in another great direction:
* http://codecanyon.net/forums/thread/wordpress-35-media-uploader-api/83117
*/

// Block direct requests
if ( !defined('ABSPATH') )
	die('-1');

class Tribe_Upload_Tester {

	const PAGE_NAME = 'tribe-upload-tester';
	const OPTION_PREFIX = 'tribe-upload-tester';

	/**
	 * Set up all the hooks for the plugin.
	 */
	function __construct() {
		add_action( 'load-tribe-uploader', array( $this, 'admin_setup' ) );
		add_action( 'load-settings_page_'.self::PAGE_NAME, array( $this, 'admin_setup' ) );
		add_action( 'admin_menu', array( $this, 'add_options_page' ) );
	}

	/**
	 * Enqueue all the javascript.
	 */
	function admin_setup() {
		wp_enqueue_media();
		wp_enqueue_script( 'tribe-upload-tester', plugins_url('resources/js/tribe-upload-tester.js', __FILE__), array('jquery') );
		$this->maybe_process_form_submission();
	}

	/**
	 * Add settings page menu item.
	 */
	function add_options_page() {
		add_options_page( __('Tribe Upload Tester', 'tribe-upload-tester'), __('Tribe Upload Tester', 'tribe-upload-tester'), 'manage_options', self::PAGE_NAME,  array( $this, 'options_page_view' ) );
	}

	/**
	 * Render the admin settings page.
	 */
	function options_page_view() {
		?>
		<div class="wrap">
			<?php screen_icon('upload'); ?>
			<h2><?php _e('Tribe Upload Tester', 'tribe-upload-tester'); ?></h2>
			<form action="<?php echo admin_url('options-general.php?page='.self::PAGE_NAME); ?>" method="POST">
				<p><?php _e('Click the button bellow to invoke the WordPress uploader. Once you have uploaded and selected an image, you should see it displayed below.', 'tribe-upload-tester'); ?></p>
				<?php $this->render_button( 'some-unique-id-for-this-upload' ); ?>
				<?php wp_nonce_field('tribe-upload-tester') ?>
				<input type="submit" class="button button-primary" value="<?php _e('Save', 'tribe-upload-tester'); ?>" />
			</form>
		</div>
		<?php
	}

	/**
	 * Render the Upload button.
	 */
	function render_button( $uploader_id ) {
		$uploader_id = esc_js( $uploader_id ); // Not sure if this is the right escape.
		// get attachment id based on uploader_id
		$attachment_id = $this->get_attachment_id( $uploader_id );
		$hide_button_style = ( !empty( $attachment_id ) ) ? '' : 'display:none;';
		?>
		<div class="uploader">
			<input type="submit" class="button" name="tribe_uploader_button[<?php echo $uploader_id; ?>]" id="tribe_uploader_button_<?php echo $uploader_id; ?>" value="<?php _e('Upload', 'tribe-upload-tester'); ?>" onclick="return tribe_open_uploader('<?php echo $uploader_id; ?>');" />
			<input type="submit" class="button" style="<?php echo $hide_button_style; ?>" name="tribe_upload_removal_button[<?php echo $uploader_id; ?>]" id="tribe_upload_removal_button_<?php echo $uploader_id; ?>" value="<?php _e('Remove Upload', 'tribe-upload-tester'); ?>" onclick="return tribe_clear_uploader('<?php echo $uploader_id; ?>');" />

			<div class="tribe_preview" id="tribe_preview_<?php echo $uploader_id; ?>">
				<?php if ( !empty( $attachment_id ) ) { echo wp_get_attachment_image( $attachment_id, 'full' ); } ?>
			</div>
			<input type="hidden" name="tribe_attachment[<?php echo $uploader_id; ?>]" value="<?php echo $attachment_id; ?>" />
		</div>
		<?php
	}

	/**
	 * Save form data if any is submitted.
	 */
	private function maybe_process_form_submission() {
		if ( isset( $_REQUEST['tribe_attachment'] ) && check_admin_referer( 'tribe-upload-tester' ) ) { // need to confirm nonce here.
			foreach ( $_REQUEST['tribe_attachment'] as $uploader_id => $attachment_id ) {
				if ( $attachment_id > 0 ) {
					$this->set_attachment_id( $uploader_id, $attachment_id );
				} else {
					$this->delete_attachment_id( $uploader_id );
				}
			}
			// Use a redirect so that you don't get asked if you want to resubmit if you click refresh.
			wp_redirect( $_REQUEST['_wp_http_referer'] );
		}
	}

	private function set_attachment_id( $uploader_id, $attachment_id ) {
		$option_key = $this->get_option_key( $uploader_id );
		update_option( $option_key, abs( $attachment_id ) );
	}

	private function get_attachment_id( $uploader_id ) {
		$option_key = $this->get_option_key( $uploader_id );
		return get_option( $option_key );
	}

	private function delete_attachment_id( $uploader_id ) {
		$option_key = $this->get_option_key( $uploader_id );
		delete_option( $option_key );
	}

	private function get_option_key( $uploader_id ) {
		return self::OPTION_PREFIX.'-'.esc_attr( $uploader_id );
	}

}
$tribe_upload_tester = new Tribe_Upload_Tester();
?>