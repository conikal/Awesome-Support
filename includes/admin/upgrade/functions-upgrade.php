<?php
/**
 * All upgrade related functions.
 *
 * @since 3.2.0
 */

/**
 * Upgrade function for version 3.2.0
 *
 * @since 3.2.0
 * @return void
 */
function wpas_upgrade_320() {

	$registrations = (bool) wpas_get_option( 'allow_registrations', true );

	if ( true === $registrations ) {
		wpas_update_option( 'allow_registrations', 'allow' );
	} else {
		wpas_update_option( 'allow_registrations', 'disallow' );
	}

}

/**
 * Upgrade routine for 3.2.1
 *
 * @since 3.2.1
 * @return void
 */
function wpas_upgrade_321() {

	$agents = wpas_list_users( 'edit_ticket' );

	foreach ( $agents as $agent_id => $agent_name ) {
		update_user_meta( $agent_id, 'wpas_can_be_assigned', 'yes' );
	}

}

/**
 * Upgrade routine for 3.2.8
 *
 * @since 3.2.8
 * @return void
 */
function wpas_upgrade_328() {

	// Clear agents metas in order to apply the fix for incorrect open tickets counts
	if ( function_exists( 'wpas_clear_agents_metas' ) ) {
		wpas_clear_agents_metas();
	}

}

/**
 * Upgrade routine for 3.3.0
 *
 * @since 3.3.0
 * @return void
 */
function wpas_upgrade_330() {

	// Add default values for e-mail template when client closes own ticket
	wpas_update_option( 'enable_closed_client', get_settings_defaults( 'enable_closed_client' ) );
	wpas_update_option( 'subject_closed_client', get_settings_defaults( 'subject_closed_client' ) );
	wpas_update_option( 'content_closed_client', get_settings_defaults( 'content_closed_client' ) );

}

/**
 * Upgrade function for version 3.3.3
 *
 * A new option was added in this version so we need to set its default value on upgrade.
 *
 * @since 3.3.3
 * @return void
 */
function wpas_upgrade_333() {
	wpas_update_option( 'use_email_template', true, true );
	wpas_update_option( 'email_template_logo', '', true );
	wpas_update_option( 'email_template_header', get_settings_defaults( 'email_template_header' ), true );
	wpas_update_option( 'email_template_footer', get_settings_defaults( 'email_template_footer' ), true );
}

/**
 * Upgrade function for version 3.3.6
 *
 * A new option was added in this version so we need to set its default value on upgrade.
 *
 * @since 3.3.6
 * @return void
 */
function wpas_upgrade_400() {

	/* Add new capabilities to these roles and all users assigned these roles:
	 *
	 *  WordPress Administrator
	 *  AS Support Manager
	 *
	 */
	$admin_caps = array(
		'view_unassigned_tickets',
		'manage_licenses_for_awesome_support',
		'administer_awesome_support',
		'view_all_tickets',
	);

	$manager = get_role( 'wpas_support_manager' );
	$admin   = get_role( 'administrator' );

	/**
	 * Add capacities to admin roles
	 */
	foreach ( $admin_caps as $cap ) {

		// Add all the capacities to admin in addition to full WP capacities
		if ( null != $admin )
			$admin->add_cap( $cap );

		// Add full plugin capacities to manager in addition to the editor capacities
		if ( null != $manager )
			$manager->add_cap( $cap );

	}

	// Now, remove the "view_all_tickets" capability from admin.
	// We need to do this because this capability will override the
	// settings for administrators in TICKETS->SETTINGS->ADVANCED.
	// We don't want to do that!
	$admin->remove_cap('view_all_tickets');


	// Don't assign the following to users
	if(($key = array_search('view_all_tickets', $admin_caps)) !== false) {
        unset($admin_caps[$key]);
	}

	/**
	 * Add capacities to admin users
	 */
	$admins = get_users( array( 'role__in' => array( 'administrator', 'wpas_support_manager' ) ) );
	foreach ( $admins as $admin ) {
		foreach ( $admin_caps as $cap ) {
			$admin->add_cap( $cap );
		}
	}

}

