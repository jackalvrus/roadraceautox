<?php
/*======================================================================*\
|| #################################################################### ||
|| # vBulletin 4.2.0 Patch Level 3 - Licence Number VBFBED0615
|| # ---------------------------------------------------------------- # ||
|| # Copyright �2000-2012 vBulletin Solutions Inc. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/
if (!VB_API) die;

loadCommonWhiteList();

$VB_API_WHITELIST = array(
	'response' => array(
		'customfields' => array(
			'*' => array(
				'optionalfield' => array(
					'optional', 'optionalname'
				),
				'profilefield' => array(
					'type', 'editable', 'optional', 'title', 'description', 'required', 'currentvalue'
				),
				'radiobits', 'selectbits'
			)
		)
	),
	'show' => array()
);

/*======================================================================*\
|| ####################################################################
|| # Downloaded: 16:29, Sun Dec 9th 2012
|| # CVS: $RCSfile$ - $Revision: 35584 $
|| ####################################################################
\*======================================================================*/