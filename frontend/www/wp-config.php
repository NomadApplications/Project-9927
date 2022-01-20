<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'project9927' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', 'root' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '.M2&(bd@PjWO,JQ?~(V^_]] Ylq,>N lx|[dp3<$y&cP]F|XOh(5elCjH.h6oe^7' );
define( 'SECURE_AUTH_KEY',  '>@k#ce!Rg^I[oGC| I+esJw~!,;s_Xw(>9Z0jk @=AruM*$(rlC)-S^$t8S6r<fJ' );
define( 'LOGGED_IN_KEY',    '?.s#xxSID9;N4Lt@#iSjdTy-REy,BCV?CvwwLG !O[F164p#`u!_p}4;~oqsMayc' );
define( 'NONCE_KEY',        'RuGVZkKCakrz7u2-Gqd-0.(.7oej{c<^@Tq[~SN*^jeac^p13EELv.~7|*%S|f^4' );
define( 'AUTH_SALT',        '5YFg?gbl^m_,s8,0mx5RKyI,~3s~eMjEBMZo[hW%Y^+8;xP;hlOow7h4O=%`u|>_' );
define( 'SECURE_AUTH_SALT', '!8rj}>JIT^1cmqykE^fl[.r~-*/G`zR/iNhZ+zBif|YMBN6zthb$e98=w}|7F%`Z' );
define( 'LOGGED_IN_SALT',   'M&ow6sy]K;+@S%E>8<QE)<^j;ZkrEa.+wN|?1;2U!pM44rODuzyI]7I]W_pfZk*1' );
define( 'NONCE_SALT',       'q,umbNME0[?^@tOU]|`mFH?/?2N3JrE@cg~p/TDBCs&;LS{%)!N,Q3&ZV;qf2~mX' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = '9927_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
