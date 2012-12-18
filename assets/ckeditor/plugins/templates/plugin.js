/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {
	CKEDITOR.plugins.add( 'templates', {
		requires: 'dialog',
		lang: 'en,pt-br', // %REMOVE_LINE_CORE%
		icons: 'templates,salvarmodelo', // %REMOVE_LINE_CORE%
		init: function( editor ) {
			CKEDITOR.dialog.add( 'templates', CKEDITOR.getUrl( this.path + 'dialogs/templates.js' ) );

			editor.addCommand( 'templates', new CKEDITOR.dialogCommand( 'templates' ) );
			editor.addCommand( 'salvarmodelo', new CKEDITOR.command( editor, {
				exec: function(editor)
				{
					var ranges = editor.getSelection().getRanges();
					var div = $('<div></div>');
					$.each(ranges, function(r, range)
					{
						div.append(range.cloneContents().$);
					});
					var modelo = prompt('Nome do modelo a ser criado','');
					if (modelo === null) {
						// Usuário clicou em "Cancelar"
					} else {
						for (var i = 0, fim = false; fim == false; i++) {
							var namespace = 'templates.' + i;
							if ((namespace+'.title') in sessionStorage && (namespace+'.html') in sessionStorage) {
								// Modelo número "i" já existe
							} else {
								sessionStorage.setItem(namespace+'.title', modelo);
								sessionStorage.setItem(namespace+'.html', div.html().replace(/<\/[^>]+>/g, '\0\n'));
								fim = true;
							}
						}
					}
				}
			}));
      editor.addCommand( 'ver_pericia', new CKEDITOR.command( editor, {
        exec: function(editor)
        {
          $('#ver_pericia').modal().css('z-index', '10000');
        }
      }));

			editor.ui.addButton && editor.ui.addButton( 'Templates', {
				label: editor.lang.templates.button,
				command: 'templates',
				toolbar: 'insert,10'
			});
			editor.ui.addButton && editor.ui.addButton( 'SalvarModelo', {
				label: editor.lang.templates.button2,
				command: 'salvarmodelo',
				toolbar: 'insert,11'
			});
			editor.ui.addButton && editor.ui.addButton( 'VerPericia', {
				label: 'Ver perícia',
				command: 'ver_pericia',
				toolbar: 'insert,12'
			});
		}
	});

	var templates = {},
		loadedTemplatesFiles = {};

	CKEDITOR.addTemplates = function( name, definition ) {
		templates[ name ] = definition;
	};

	CKEDITOR.getTemplates = function( name ) {
		return templates[ name ];
	};

	CKEDITOR.loadTemplates = function( templateFiles, callback ) {
		var templates = [];
		for (n in sessionStorage) {
			console.info(n);
			var match = /^templates\.(\d+)\.(title|html)$/.exec(n);
			if (match) {
				var numero, campo;
				[, numero, campo] = match;
				if (! (numero in templates)) {
					templates[numero] = {};
				}
				templates[numero][campo] = sessionStorage[n];
			}
		}

		CKEDITOR.addTemplates('user', {templates: templates});
		setTimeout(callback, 0);
	};
})();



/**
 * The templates definition set to use. It accepts a list of names separated by
 * comma. It must match definitions loaded with the {@link #templates_files} setting.
 *
 *		config.templates = 'my_templates';
 *
 * @cfg {String} [templates='default']
 * @member CKEDITOR.config
 */
CKEDITOR.config.templates = 'user';
/**
 * The list of templates definition files to load.
 *
 *		config.templates_files = [
 *			'/editor_templates/site_default.js',
 *			'http://www.example.com/user_templates.js
 *		];
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.templates_files = [
	CKEDITOR.getUrl( 'plugins/templates/templates/default.js' )
	];

/**
 * Whether the "Replace actual contents" checkbox is checked by default in the
 * Templates dialog.
 *
 *		config.templates_replaceContent = false;
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.templates_replaceContent = false;
