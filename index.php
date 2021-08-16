<?php

/*
  Plugin Name: Custom Block Type Plugin
  Description: Custom Block Type
  Version: 1.0
  Author: Victoria
  Author URI: https://github.com/vacb
*/

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

class CustomBlock {
  function __construct() {
    // Load block when on new block screen
    add_action('enqueue_block_editor_assets', array($this, 'adminAssets'));
  }

  function adminAssets() {
    // Give name, location, dependencies
    wp_enqueue_script('customblocktype', plugin_dir_url(__FILE__) . 'test.js', array('wp-blocks'));
  }
}

$customBlock = new CustomBlock();