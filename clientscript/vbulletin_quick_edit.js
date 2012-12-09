/*======================================================================*\
|| #################################################################### ||
|| # vBulletin 4.2.0 Patch Level 3
|| # ---------------------------------------------------------------- # ||
|| # Copyright �2000-2012 vBulletin Solutions Inc. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/
function vB_AJAX_QuickEdit_Init(C){if(AJAX_Compatible){if(typeof C=="string"){C=fetch_object(C)}var B=fetch_tags(C,"a");for(var A=0;A<B.length;A++){if(B[A].name&&B[A].name.indexOf("vB::QuickEdit::")!=-1){B[A].onclick=vB_AJAX_QuickEditor_Events.prototype.editbutton_click}}}}function vB_AJAX_QuickEditor(){this.return_node=null;this.editimgsrc=null;this.postid=null;this.messageobj=null;this.container=null;this.originalhtml=null;this.editstate=false;this.editorcounter=0;this.ajax_req=null;this.show_advanced=true;vBulletin.attachinfo={posthash:"",poststarttime:""}}vB_AJAX_QuickEditor.prototype.ready=function(){if(this.editstate||YAHOO.util.Connect.isCallInProgress(this.ajax_req)){return false}else{return true}};vB_AJAX_QuickEditor.prototype.edit=function(A){if(typeof vb_disable_ajax!="undefined"&&vb_disable_ajax>0){return true}var C=A.substr(A.lastIndexOf("::")+2);if(YAHOO.util.Connect.isCallInProgress(this.ajax_req)){return false}else{if(!this.ready()){if(this.postid==C){this.full_edit();return false}this.abort()}}this.editorcounter++;this.editorid="vB_Editor_QE_"+this.editorcounter;this.postid=C;this.messageobj=fetch_object("post_message_"+this.postid);this.originalhtml=this.messageobj.innerHTML;this.unchanged=null;this.unchanged_reason=null;var B=YAHOO.util.Dom.get("return_node");if(B){this.return_node=parseInt(B.value,10)}this.fetch_editor();this.editstate=true;return false};vB_AJAX_QuickEditor.prototype.fetch_editor=function(){if(YAHOO.util.Dom.get("progress_"+this.postid)){this.editimgsrc=YAHOO.util.Dom.get("editimg_"+this.postid).getAttribute("src");YAHOO.util.Dom.get("editimg_"+this.postid).setAttribute("src",YAHOO.util.Dom.get("progress_"+this.postid).getAttribute("src"))}document.body.style.cursor="wait";YAHOO.util.Connect.asyncRequest("POST",fetch_ajax_url("ajax.php?do=quickedit&p="+this.postid),{success:this.display_editor,failure:this.error_opening_editor,timeout:vB_Default_Timeout,scope:this},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&do=quickedit&p="+this.postid+"&editorid="+PHP.urlencode(this.editorid)+(this.return_node?"&return_node="+this.return_node:""))};vB_AJAX_QuickEditor.prototype.error_opening_editor=function(A){vBulletin_AJAX_Error_Handler(A);window.location="editpost.php?"+SESSIONURL+"do=editpost&postid="+this.postid};vB_AJAX_QuickEditor.prototype.handle_save_error=function(A){vBulletin_AJAX_Error_Handler(A);this.show_advanced=false;this.full_edit()};vB_AJAX_QuickEditor.prototype.display_editor=function(ajax){if(ajax.responseXML){if(YAHOO.util.Dom.get("progress_"+vB_QuickEditor.postid)){YAHOO.util.Dom.get("editimg_"+this.postid).setAttribute("src",vB_QuickEditor.editimgsrc)}document.body.style.cursor="auto";if(fetch_tag_count(ajax.responseXML,"disabled")){window.location="editpost.php?"+SESSIONURL+"do=editpost&postid="+this.postid}else{if(fetch_tag_count(ajax.responseXML,"error")){alert(ajax.responseXML.getElementsByTagName("error")[0].firstChild.nodeValue);return }else{if(ajax.responseXML.getElementsByTagName("contenttypeid").length>0){vBulletin.attachinfo={contenttypeid:ajax.responseXML.getElementsByTagName("contenttypeid")[0].firstChild.nodeValue,userid:ajax.responseXML.getElementsByTagName("userid")[0].firstChild.nodeValue,attachlimit:ajax.responseXML.getElementsByTagName("attachlimit")[0].firstChild.nodeValue,max_file_size:ajax.responseXML.getElementsByTagName("max_file_size")[0].firstChild.nodeValue,auth_type:ajax.responseXML.getElementsByTagName("auth_type")[0].firstChild.nodeValue,asset_enable:ajax.responseXML.getElementsByTagName("asset_enable")[0].firstChild.nodeValue,posthash:ajax.responseXML.getElementsByTagName("posthash")[0].firstChild.nodeValue,poststarttime:ajax.responseXML.getElementsByTagName("poststarttime")[0].firstChild.nodeValue};var values=ajax.responseXML.getElementsByTagName("values");if(values.length>0&&values[0].childNodes.length){vBulletin.attachinfo.values="";for(var i=0;i<values[0].childNodes.length;i++){if(values[0].childNodes[i].nodeName!="#text"&&typeof (values[0].childNodes[i].childNodes[0])!="undefined"){if(vBulletin.attachinfo.values.length>0){vBulletin.attachinfo.values="&"}vBulletin.attachinfo.values+="values["+values[0].childNodes[i].nodeName+"]="+values[0].childNodes[i].childNodes[0].nodeValue}}}var phrases=ajax.responseXML.getElementsByTagName("phrases");if(phrases.length>0&&phrases[0].childNodes.length){for(var i=0;i<phrases[0].childNodes.length;i++){if(phrases[0].childNodes[i].nodeName!="#text"&&typeof (phrases[0].childNodes[i].childNodes[0])!="undefined"){vbphrase[phrases[0].childNodes[i].nodeName]=phrases[0].childNodes[i].childNodes[0].nodeValue}}}}var editor=fetch_tags(ajax.responseXML,"editor")[0];if(typeof editor=="undefined"){window.location="editpost.php?"+SESSIONURL+"do=editpost&postid="+this.postid;return false}var reason=editor.getAttribute("reason");this.messageobj.innerHTML=editor.firstChild.nodeValue;if(fetch_object(this.editorid+"_edit_reason")){this.unchanged_reason=PHP.unhtmlspecialchars(reason);fetch_object(this.editorid+"_edit_reason").value=this.unchanged_reason;fetch_object(this.editorid+"_edit_reason").onkeypress=vB_AJAX_QuickEditor_Events.prototype.reason_key_trap}if(typeof JSON=="object"&&typeof JSON.parse=="function"){var ckeconfig=JSON.parse(fetch_tags(ajax.responseXML,"ckeconfig")[0].firstChild.nodeValue)}else{var ckeconfig=eval("("+fetch_tags(ajax.responseXML,"ckeconfig")[0].firstChild.nodeValue+")")}if(vBulletin.attachinfo){CKEDITOR.config.content=vBulletin.attachinfo}vB_Editor[this.editorid]=new vB_Text_Editor(this.editorid,ckeconfig);if(vB_Editor[this.editorid].editorready){this.display_editor_final("editorready",null,this)}else{vB_Editor[this.editorid].vBevents.editorready.subscribe(this.display_editor_final,this)}}}handle_dep(this.editorid)}};vB_AJAX_QuickEditor.prototype.display_editor_final=function(C,A,D){if(YAHOO.util.Dom.get(D.editorid)&&YAHOO.util.Dom.get(D.editorid).scrollIntoView){}vB_Editor[D.editorid].check_focus();D.unchanged=vB_Editor[D.editorid].get_editor_contents();YAHOO.util.Event.on(D.editorid+"_save","click",D.save,D,true);YAHOO.util.Event.on(D.editorid+"_abort","click",D.abort,D,true);YAHOO.util.Event.on(D.editorid+"_adv","click",D.full_edit,D,true);YAHOO.util.Event.on("quick_edit_errors_hide","click",D.hide_errors,D,true);YAHOO.util.Event.on("quick_edit_errors_cancel","click",D.abort,D,true);var B=YAHOO.util.Dom.get(D.editorid+"_delete");if(B&&!this.return_node){YAHOO.util.Event.on(D.editorid+"_delete","click",D.show_delete,D,true)}init_popupmenus(YAHOO.util.Dom.get(D.editorid))};vB_AJAX_QuickEditor.prototype.restore=function(C,A){this.hide_errors(true);if(this.editorid&&vB_Editor[this.editorid]){vB_Editor[this.editorid].destroy()}if(A=="tableobj"){var B=YAHOO.util.Dom.get("post_"+this.postid);B.parentNode.replaceChild(string_to_node(C),B);if(typeof (pd)=="object"&&typeof (pd[this.postid])!="undefined"){pd[this.postid]=C}}else{this.messageobj.innerHTML=C}this.editstate=false};vB_AJAX_QuickEditor.prototype.abort=function(A){if(A){YAHOO.util.Event.stopEvent(A)}if(YAHOO.util.Dom.get("progress_"+vB_QuickEditor.postid)&&vB_QuickEditor.editimgsrc){YAHOO.util.Dom.get("editimg_"+vB_QuickEditor.postid).setAttribute("src",vB_QuickEditor.editimgsrc)}document.body.style.cursor="auto";vB_QuickEditor.restore(vB_QuickEditor.originalhtml,"messageobj");PostBit_Init(fetch_object("post_"+vB_QuickEditor.postid),vB_QuickEditor.postid)};vB_AJAX_QuickEditor.prototype.full_edit=function(B){if(vB_Editor[vB_QuickEditor.editorid]){var A=new vB_Hidden_Form((PATHS.forum?PATHS.forum+"/":"")+"editpost.php?do=updatepost&postid="+vB_QuickEditor.postid);A.add_variable("do","updatepost");A.add_variable("s",fetch_sessionhash());A.add_variable("securitytoken",SECURITYTOKEN);if(vB_QuickEditor.show_advanced){A.add_variable("advanced",1)}else{A.add_variable("quickeditnoajax",1)}A.add_variable("postid",vB_QuickEditor.postid);A.add_variable("message",vB_Editor[vB_QuickEditor.editorid].getRawData());A.add_variable("reason",fetch_object(vB_QuickEditor.editorid+"_edit_reason").value);A.add_variable("posthash",vBulletin.attachinfo.posthash);A.add_variable("poststarttime",vBulletin.attachinfo.poststarttime);A.add_variable("wysiwyg",vB_Editor[vB_QuickEditor.editorid].is_wysiwyg_mode());if(vB_QuickEditor.return_node){A.add_variable("return_node",vB_QuickEditor.return_node)}vB_Editor[vB_QuickEditor.editorid].uninitialize();A.submit_form()}};vB_AJAX_QuickEditor.prototype.save=function(B){var D=vB_Editor[vB_QuickEditor.editorid].get_editor_contents();var A=vB_Editor[vB_QuickEditor.editorid];if(D==vB_QuickEditor.unchanged&&A==vB_QuickEditor.unchanged_reason){vB_QuickEditor.abort(B)}else{vB_Editor[this.editorid].uninitialize();fetch_object(vB_QuickEditor.editorid+"_posting_msg").style.display="";document.body.style.cursor="wait";var C=YAHOO.util.Dom.get("postcount"+vB_QuickEditor.postid);this.ajax_req=YAHOO.util.Connect.asyncRequest("POST",fetch_ajax_url("editpost.php?do=updatepost&postid="+this.postid),{success:vB_QuickEditor.update,failure:vB_QuickEditor.handle_save_error,timeout:vB_Default_Timeout,scope:vB_QuickEditor},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&do=updatepost&ajax=1&postid="+vB_QuickEditor.postid+"&posthash="+vBulletin.attachinfo.posthash+"&poststarttime="+vBulletin.attachinfo.poststarttime+"&message="+PHP.urlencode(D)+"&reason="+PHP.urlencode(fetch_object(vB_QuickEditor.editorid+"_edit_reason").value)+"&relpath="+PHP.urlencode(RELPATH)+(C!=null?"&postcount="+PHP.urlencode(C.name):"")+(vB_QuickEditor.return_node!=null?"&return_node="+vB_QuickEditor.return_node:"")+((typeof (pd)=="object"&&typeof (pd[vB_QuickEditor.postid])!="undefined")?"&displaymode=1":""));vB_QuickEditor.pending=true}};vB_AJAX_QuickEditor.prototype.show_delete=function(){vB_QuickEditor.deletedialog=fetch_object("quickedit_delete");if(vB_QuickEditor.deletedialog&&vB_QuickEditor.deletedialog.style.display!=""){vB_QuickEditor.deletedialog.style.display="";vB_QuickEditor.deletebutton=fetch_object("quickedit_dodelete");vB_QuickEditor.deletebutton.onclick=vB_QuickEditor.delete_post;if(fetch_object("del_reason")){fetch_object("del_reason").onkeypress=vB_AJAX_QuickEditor_Events.prototype.delete_items_key_trap}}};vB_AJAX_QuickEditor.prototype.delete_post=function(){var A=fetch_object("rb_del_leave");if(A&&A.checked){vB_QuickEditor.abort();return }var B=new vB_Hidden_Form("editpost.php");B.add_variable("do","deletepost");B.add_variable("s",fetch_sessionhash());B.add_variable("securitytoken",SECURITYTOKEN);B.add_variable("postid",vB_QuickEditor.postid);B.add_variables_from_object(vB_QuickEditor.deletedialog);if(vB_QuickEditor.return_node){B.add_variable("return_node",vB_QuickEditor.return_node)}vB_Editor[vB_QuickEditor.editorid].uninitialize();B.submit_form()};vB_AJAX_QuickEditor.prototype.update=function(C){if(C.responseXML){vB_QuickEditor.pending=false;document.body.style.cursor="auto";fetch_object(vB_QuickEditor.editorid+"_posting_msg").style.display="none";if(fetch_tag_count(C.responseXML,"error")){var D=fetch_tags(C.responseXML,"error");var A="<ol>";for(var B=0;B<D.length;B++){A+="<li>"+D[B].firstChild.nodeValue+"</li>"}A+="</ol>";vB_QuickEditor.show_errors(A)}else{vB_QuickEditor.restore(C.responseXML.getElementsByTagName("postbit")[0].firstChild.nodeValue,"tableobj");PostBit_Init(fetch_object("post_"+vB_QuickEditor.postid),vB_QuickEditor.postid)}}return false};vB_AJAX_QuickEditor.prototype.show_errors=function(A){set_unselectable("quick_edit_errors_hide");YAHOO.util.Dom.get("ajax_post_errors_message").innerHTML=A;var B=YAHOO.util.Dom.get("ajax_post_errors");var C=(is_saf?"body":"documentElement");B.style.left=(is_ie?document.documentElement.clientWidth:self.innerWidth)/2-200+document[C].scrollLeft+"px";B.style.top=(is_ie?document.documentElement.clientHeight:self.innerHeight)/2-150+document[C].scrollTop+"px";YAHOO.util.Dom.removeClass(B,"hidden")};vB_AJAX_QuickEditor.prototype.hide_errors=function(A){this.errors=false;YAHOO.util.Dom.addClass("ajax_post_errors","hidden");if(A!=true){vB_Editor[this.editorid].check_focus()}};function vB_AJAX_QuickEditor_Events(){}vB_AJAX_QuickEditor_Events.prototype.editbutton_click=function(A){return vB_QuickEditor.edit(this.name)};vB_AJAX_QuickEditor_Events.prototype.delete_button_handler=function(A){if(this.id=="rb_del_leave"&&this.checked){vB_QuickEditor.deletebutton.disabled=true}else{vB_QuickEditor.deletebutton.disabled=false}};vB_AJAX_QuickEditor_Events.prototype.reason_key_trap=function(A){A=A?A:window.event;switch(A.keyCode){case 9:fetch_object(vB_QuickEditor.editorid+"_save").focus();return false;break;case 13:vB_QuickEditor.save();return false;break;default:return true}};vB_AJAX_QuickEditor_Events.prototype.delete_items_key_trap=function(A){A=A?A:window.event;if(A.keyCode==13){if(vB_QuickEditor.deletebutton.disabled==false){vB_QuickEditor.delete_post()}return false}return true};var vB_QuickEditor=new vB_AJAX_QuickEditor();