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
    add_action('init', array($this, 'adminAssets'));
  }

  function adminAssets() {
    wp_register_style('customeditcss', plugin_dir_url(__FILE__) . 'build/index.css');
    // Give name, location, dependencies
    // Register script instead of loading - last arg array lists dependencies
    wp_register_script('customblocktype', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));
    register_block_type('vbplugin/custom-block-type', array(
      // Which JS file to load for this block
      'editor_script' => 'customblocktype',
      'editor_style' => 'customeditcss',
      'render_callback' => array($this, 'theHTML')
    ));
  }

  function theHTML($attributes) {
    // ob = output buffer
    // Anything between ob_start() and ob_clean() will get returned
    ob_start(); ?>
      <h3>Today the sky is completely <?php echo esc_html($attributes['skyColour']); ?> and the grass is <?php echo esc_html($attributes['grassColour']); ?>!!!</h3>';
    <?php return ob_get_clean();
  }
}

$customBlock = new CustomBlock();