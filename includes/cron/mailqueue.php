<?php
/*======================================================================*\
|| #################################################################### ||
|| # vBulletin Blog 4.2.0 Patch Level 3 - Licence Number VBFBED0615
|| # ---------------------------------------------------------------- # ||
|| # Copyright �2000-2012 vBulletin Solutions Inc. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/

// ######################## SET PHP ENVIRONMENT ###########################
error_reporting(E_ALL & ~E_NOTICE);
if (!is_object($vbulletin->db))
{
	exit;
}

if ($vbulletin->options['mailqueue'])
{
	exec_mail_queue();
}

log_cron_action('', $nextitem, 1);

/*======================================================================*\
|| ####################################################################
|| # Downloaded: 16:29, Sun Dec 9th 2012
|| # CVS: $Revision: 25612 $
|| ####################################################################
\*======================================================================*/
