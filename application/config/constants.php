<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| Display Debug backtrace
|--------------------------------------------------------------------------
|
| If set to TRUE, a backtrace will be displayed along with php errors. If
| error_reporting is disabled, the backtrace will not display, regardless
| of this setting
|
*/
defined('SHOW_DEBUG_BACKTRACE') OR define('SHOW_DEBUG_BACKTRACE', TRUE);

/*
|--------------------------------------------------------------------------
| File and Directory Modes
|--------------------------------------------------------------------------
|
| These prefs are used when checking and setting modes when working
| with the file system.  The defaults are fine on servers with proper
| security, but you may wish (or even need) to change the values in
| certain environments (Apache running a separate process for each
| user, PHP under CGI with Apache suEXEC, etc.).  Octal values should
| always be used to set the mode correctly.
|
*/
defined('FILE_READ_MODE')  OR define('FILE_READ_MODE', 0644);
defined('FILE_WRITE_MODE') OR define('FILE_WRITE_MODE', 0666);
defined('DIR_READ_MODE')   OR define('DIR_READ_MODE', 0755);
defined('DIR_WRITE_MODE')  OR define('DIR_WRITE_MODE', 0755);

/*
|--------------------------------------------------------------------------
| File Stream Modes
|--------------------------------------------------------------------------
|
| These modes are used when working with fopen()/popen()
|
*/
defined('FOPEN_READ')                           OR define('FOPEN_READ', 'rb');
defined('FOPEN_READ_WRITE')                     OR define('FOPEN_READ_WRITE', 'r+b');
defined('FOPEN_WRITE_CREATE_DESTRUCTIVE')       OR define('FOPEN_WRITE_CREATE_DESTRUCTIVE', 'wb'); // truncates existing file data, use with care
defined('FOPEN_READ_WRITE_CREATE_DESTRUCTIVE')  OR define('FOPEN_READ_WRITE_CREATE_DESTRUCTIVE', 'w+b'); // truncates existing file data, use with care
defined('FOPEN_WRITE_CREATE')                   OR define('FOPEN_WRITE_CREATE', 'ab');
defined('FOPEN_READ_WRITE_CREATE')              OR define('FOPEN_READ_WRITE_CREATE', 'a+b');
defined('FOPEN_WRITE_CREATE_STRICT')            OR define('FOPEN_WRITE_CREATE_STRICT', 'xb');
defined('FOPEN_READ_WRITE_CREATE_STRICT')       OR define('FOPEN_READ_WRITE_CREATE_STRICT', 'x+b');

/*
|--------------------------------------------------------------------------
| Exit Status Codes
|--------------------------------------------------------------------------
|
| Used to indicate the conditions under which the script is exit()ing.
| While there is no universal standard for error codes, there are some
| broad conventions.  Three such conventions are mentioned below, for
| those who wish to make use of them.  The CodeIgniter defaults were
| chosen for the least overlap with these conventions, while still
| leaving room for others to be defined in future versions and user
| applications.
|
| The three main conventions used for determining exit status codes
| are as follows:
|
|    Standard C/C++ Library (stdlibc):
|       http://www.gnu.org/software/libc/manual/html_node/Exit-Status.html
|       (This link also contains other GNU-specific conventions)
|    BSD sysexits.h:
|       http://www.gsp.com/cgi-bin/man.cgi?section=3&topic=sysexits
|    Bash scripting:
|       http://tldp.org/LDP/abs/html/exitcodes.html
|
*/
defined('EXIT_SUCCESS')        OR define('EXIT_SUCCESS', 0); // no errors
defined('EXIT_ERROR')          OR define('EXIT_ERROR', 1); // generic error
defined('EXIT_CONFIG')         OR define('EXIT_CONFIG', 3); // configuration error
defined('EXIT_UNKNOWN_FILE')   OR define('EXIT_UNKNOWN_FILE', 4); // file not found
defined('EXIT_UNKNOWN_CLASS')  OR define('EXIT_UNKNOWN_CLASS', 5); // unknown class
defined('EXIT_UNKNOWN_METHOD') OR define('EXIT_UNKNOWN_METHOD', 6); // unknown class member
defined('EXIT_USER_INPUT')     OR define('EXIT_USER_INPUT', 7); // invalid user input
defined('EXIT_DATABASE')       OR define('EXIT_DATABASE', 8); // database error
defined('EXIT__AUTO_MIN')      OR define('EXIT__AUTO_MIN', 9); // lowest automatically-assigned error code
defined('EXIT__AUTO_MAX')      OR define('EXIT__AUTO_MAX', 125); // highest automatically-assigned error code


// --------------------------------  APP  -------------------------------- //
// de UtilsWrapper 20190416
define('SUPERADMIN', '1');

define('IDSUPTIPOCENTRAL', '1');
define('IDSUPTIPOSUPERVISOR', '3');
define('IDSUPTIPOESCOLAR', '2');


define('MESSAGEREQUEST', 'message_request_yolixtli');
define('SUCCESMESSAGE', '1');
define('ERRORMESSAGE', '2');
define('DATOSUSUARIO', "datos_usuario_yolixtli");

define('ELEMENTOS_MENU', "elementos_menu_yolixtli");

define('LONG_MIN_CONTRASENA', "10");
define('LONG_MAX_CONTRASENA', "20");
define('LONG_FOLIO_PACE', '7');
define('LONG_MAX_NOMBRE', 50); //nombre del usuario tabla usuario.nombre
define('LONG_MAX_APELL1', 50);
define('LONG_MAX_APELL2', 50);
define('LONG_MAX_FUNCION', 50); //funcion del usuario tabla usuario.funcion
define('LONG_MAX_DEPTO', 90); //departamento del usuario tabla usuario.departamento
define('LONG_MAX_USERNAME', 25); //username del usuario tabla seguridad.username

define('PERSONAL_DOCENTE', 3); // DIRECTIVO table funcionxpersonal.idfuncion
define('PERSONAL_FNC_DOCENTE', 4); // DOCENTE table funcionxpersonal.idfuncion
define('PERSONAL_FNC_DOCENTE_TECN', 6); // DOCENTE TÉCNICO table funcionxpersonal.idfuncion

define('PERSONAL_FNC_DOCENTE_INGLES', 8); // DOCENTE INGLES table funcionxpersonal.idfuncion
define('PERSONAL_FNC_DOCENTE_ADMINISTRATIVO', 9); // ADMINISTRATIVO table funcionxpersonal.idfuncion
define('PERSONAL_FNC_DOCENTE_ENCARGADO', 10); // DOCENTE ENCARGADO table funcionxpersonal.idfuncion

define('NIVEL_PREE', 1);
define('NIVEL_PRIM', 2);
define('NIVEL_SEC', 3);

define('APP_ESCOLAR', 1);
define('APP_SUPERVISION', 2);
define('APP_CENTRAL', 3);

define('NUMERO_INTENTOS', 5);
define('TIEMPO_BLOQUEO', 5);

define('TIPO_ASIG_ADICIONALES', 'ADI');
define('TIPO_ASIG_ESTATAL', 'EST');
define('TIPO_ASIG_LENGUA', 'LEN');
define('VERSIONSISTEMA', "2.0");
define("ZONAHORARIA", "America/Mexico_City");

define("IDADMINCENTRAL", 1);
define("IDCENTRAL", 2);
define("IDREGIONALCENTRAL", 3);
// define('ADMINESCOLAR', '4');
// define('ESCOLARLIMITADO', '5');
// define('IDSUPERVISOR', '6');
define('ADMINESCOLAR', 4);
define('ESCOLARLIMITADO', 5);
define('IDSUPERVISOR', 6);

define("IDTIPOESCUELA", 1);
define("IDTIPOSUPERVISION", 2);

define('VERSIONYOLIXTLI', '19FEB.2300');

define("PAGINA_ACTUAL_GRID", "gridpaginador_yolixtli");

// Tipos para Asignaturas adicionales
define("TASIG_EXTRA_ESTAT", "EES");
define("TASIG_EXTRA_ESTFE", "EPR");
define("TASIG_EXTRA_ESCPA", "EPT");
define("TASIG_EXTRA_LENGU", "ELG");

define("CVE_ENTIDAD", 21);

// NUEVAS
define('CLASE_GRID_THEAD', 'gridp_thead');
define('IDPAIS_MEX', 151);
