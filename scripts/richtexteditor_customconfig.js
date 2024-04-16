/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config
	
	config.toolbar = 'Full';
	config.toolbar_Full =
	[
		{ name: 'clipboard', items : [ 'Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
		{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
		{ name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock' ] },
		{ name: 'links', items : [ 'Image','Link','Unlink' ] },
		{ name: 'insert', items : [ 'Table','HorizontalRule','SpecialChar' ] },
		{ name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
		{ name: 'colors', items : [ 'TextColor','BGColor' ] },
		{ name: 'standaardantwoord', items:[ 'StandaardAntwoord' ]}
	];
	
	config.extraPlugins = 'autolink,textmatch,dialogadvtab';

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	config.removeButtons = 'Anchor,Source,Subscript,Superscript';

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
	
	config.font_names = 'Arial;Calibri;Tahoma;Times New Roman;Verdana';
	config.fontSize_sizes = '10pt;11pt;12pt;13pt;14pt;15pt;16pt;18pt;20pt;22pt;24pt;26pt;28pt;30pt';
	//config.font_defaultLabel = 'Calibri';
	//config.fontSize_defaultLabel = '14px';
	
	config.pasteFromWordRemoveFontStyles = false;
	config.enterMode = CKEDITOR.ENTER_BR;
	
    // enable browser spell check
    config.disableNativeSpellChecker = false;
    
	config.contentsCss = '../ckeditor/contents.css';
};

CKEDITOR.on('instanceReady', function( ev ) {
    //if (ev.editor.getData() == null || ev.editor.getData() == "")
    //     ev.editor.setData('<span style="font-family:Calibri; font-size:14px;">&shy;</span>');

	setTimeout(function(){ ev.editor.execCommand('maximize'); }, 100);
});