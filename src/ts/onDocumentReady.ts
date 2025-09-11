import {JSpective} from './JSpective.js';
import { MenuItemRecords } from './MenuItemRecords.js';

// Init the application, when document is fully loaded in browser
// ---------------------------------------------------------------
// DEPRECATED by jQuery: $(document).ready(function(){
// Instead, now use:
$(function() {
	let jspective = new JSpective();
	
	// Create the initial main menu
	// ----------------------------

	// Example 1:
	// Use the following line to request the initial main menu data from a URL:
	//
	//jspective.init("menus/jspective_demo/main_menu.xml", null, false);


	// Example 2:
	// Use the following lines, to manually configure the initial main menu data
	// instead of requesting the menu data (as XML) from a URL:
	
	let mainMenuRecords = new MenuItemRecords();
	mainMenuRecords.addEntry(jspective._menuItemTypeMenu, "JSpective GUI Features", false, "menus/jspective_demo/jspective_gui_features.xml", 250, 127, "pages/img/jspective_demo/rainbow.png", "wheel");
	mainMenuRecords.addEntry(jspective._menuItemTypePage, "About JSpective", false, "pages/jspective_demo/about_jspective.html", 292, 204, "pages/img/jspective_demo/cyborg.png", null);
	mainMenuRecords.addEntry(jspective._menuItemTypeMenu, "Fuge", false, "menus/jspective_demo/fuge.xml", 200, 172, "pages/img/jspective_demo/guppy.png", null);
	mainMenuRecords.addEntry(jspective._menuItemTypeMenu, "Source Code and Documentation", false, "menus/jspective_demo/source_and_doc.xml", 224, 150, "pages/img/jspective_demo/software.jpg", "wheel");
	mainMenuRecords.addEntry(jspective._menuItemTypeLink, "Github", false, "https://github.com/dpw0001/jspective", 141, 141, "pages/img/jspective_demo/github-logo.png", null);
	jspective.init("", mainMenuRecords, false);
});
