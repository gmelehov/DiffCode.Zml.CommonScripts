/**
 * РЕДАКТОР КОДА
 * @alias CodeMirrorPanel
 * @manager ZML.EditorMgr
 * @registration initComponent
 * @method getCodeValue @property value
 * @method setValue @property value
 * @method getMode @property mode
 * @method setMode @property mode
 * @method GetRenderedMarkdown @property htmlContent
 */
Ext.define('ZML.panel.CodeMirror', {

  extend: 'Ext.panel.Panel',
  alias: 'widget.CodeMirrorPanel',

  layout: 'fit',
  height: '100%',
  width: '100%',
  flex: 1,

  TEXTAREA: null,
  TOOLBAR: null,
  MD: null,

  config: {
    mode: null,
    tabSize: 2,
    lineNumbers: true,
    lineWrapping: true,
    //theme: 'Diff1',
    value: null,
  },

  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',


  setMode: function (value)
  {
    var oldvalue = this.getMode();
    this.mode = value;
    this.fireEvent('modeChanged', this, oldvalue, value);
    if (oldvalue != value)
    {
      
    };
  },

  setLineNumbers: function (value)
  {
    var oldvalue = this.getLineNumbers();
    this.lineNumbers = value;
    if (oldvalue != value)
    {
      this.fireEvent('lineNumbersChanged', this, oldvalue, value);
    };
  },

  setLineWrapping: function (value)
  {
    var oldvalue = this.getLineWrapping();
    this.lineWrapping = value;
    if (oldvalue != value)
    {
      this.fireEvent('lineWrappingChanged', this, oldvalue, value);
    };
  },

  setTheme: function (value)
  {
    var oldvalue = this.getTheme();
    this.theme = value;
    if (oldvalue != value)
    {
      this.fireEvent('themeChanged', this, oldvalue, value);
    };
  },

  setValue: function (value)
  {
    var oldvalue = this.getValue() ?? this.getCodeValue();
    this.value = value;
    if (oldvalue != value)
    {
      this.fireEvent('valueChanged', this, oldvalue, value);
    };
  },


  initComponent: function (config)
  {
    var me = this;
    config = config || {};
    config.tabSize = config.tabSize || 2;
    if (config.lineNumbers == undefined) config.lineNumbers = true;
    if (config.lineWrapping == undefined) config.lineWrapping = true;
    config.theme = config.theme;


    me.addEvents('valueChanged', 'modeChanged', 'lineNumbersChanged', 'lineWrappingChanged', 'themeChanged');
    me.on({
      valueChanged: me.OnValueChanged,
      modeChanged: me.OnModeChanged,
      lineNumbersChanged: me.OnLineNumbersChanged,
      lineWrappingChanged: me.OnLineWrappingChanged,
      themeChanged: me.OnThemeChanged,
      afterrender: me.OnAfterRender,
      scope: me
    });
    me.initConfig(config);
    me.callParent(arguments);

    GLOBAL[this.AppNAME].Editor.register(me);
  },



  OnAfterRender: function ()
  {
    var me = this;
    me.TEXTAREA = Ext.create('Ext.form.field.TextArea', {
      PANEL: me,
      layout: 'fit',
      height: '100%',
      width: '100%',
      flex: 1,
      listeners: {
        afterrender: function (panel)
        {
          this.CM = CodeMirror.fromTextArea(panel.inputEl.dom, {
            content: panel.getValue(),
            mode: panel.PANEL.getMode(),
            indentWithTabs: false,
            tabSize: panel.PANEL.tabSize,
            smartIndent: true,
            lineNumbers: panel.PANEL.lineNumbers,
            autofocus: true,
            lineWrapping: panel.PANEL.lineWrapping,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            matchTags: { bothTags: true },
            //specialChars: / /,
            highlightSelectionMatches:
            {
              showToken: /\w/,
              annotateScrollbar: true
            },
            theme: panel.PANEL.theme
          });
          this.CM.ParentPanel = panel;
          this.CM.on('cursorActivity', me.OnCursorActivity, me);
          this.CM.on('change', me.OnAfterChanged, me);
          panel.PANEL.setMode(panel.PANEL.mode);
          panel.PANEL.setLineNumbers(panel.PANEL.lineNumbers);
          panel.PANEL.setLineWrapping(panel.PANEL.lineWrapping);
          this.CM.setOption('tabSize', panel.PANEL.tabSize);
          this.CM.setOption('theme', panel.PANEL.theme);

          this.CM.setOption('autoCloseBrackets', true);
          this.CM.setOption('autoCloseTags', true);
          this.CM.setOption('matchBrackets', true);
        },
        change: function (widget, val)
        {
          this.CM.setValue(val);
        }
      }
    });
    me.add(me.TEXTAREA);
    me.TOOLBAR = me.ComposeToolbar();
    me.addDocked(me.TOOLBAR);


    if (me.getMode() == 'markdown' && window['markdownit'] && typeof (window['markdownit'] === 'function'))
    {
      me.MD = new window.markdownit('default', { html: true, typographer: true });
    };


    me.setMode(me.getMode());

  },


  OnValueChanged: function (obj, oldvalue, newvalue)
  {
    if (obj && obj.TEXTAREA && obj.TEXTAREA.CM)
    {
      obj.TEXTAREA.CM.setValue(newvalue);
      Ext.StoreManager.LoadLinkedStores({ scopeType: 'Editor', scopeId: obj.itemId });
    };
  },


  OnModeChanged: function (obj, oldvalue, newvalue)
  {
    if (obj && obj.TEXTAREA && obj.TEXTAREA.CM)
    {
      switch (newvalue.toLowerCase())
      {
        case 'sql': obj.TEXTAREA.CM.setOption('mode', 'text/x-sql'); obj.removeCls('JSEditor'); break;

        case 'js':
        case 'javascript': obj.TEXTAREA.CM.setOption('mode', 'text/javascript'); obj.addCls('JSEditor'); break;

        case 'json': obj.TEXTAREA.CM.setOption('mode', { name: 'text/javascript', json: true }); obj.addCls('JSEditor'); break;

        case 'cs':
        case 'csharp':
        case 'c#': obj.TEXTAREA.CM.setOption('mode', 'text/x-csharp'); obj.removeCls('JSEditor'); break;

        case 'css': obj.TEXTAREA.CM.setOption('mode', 'text/css'); obj.removeCls('JSEditor'); break;

        case 'scss': obj.TEXTAREA.CM.setOption('mode', 'text/x-scss'); obj.removeCls('JSEditor'); break;

        case 'md':
        case 'markdown': obj.TEXTAREA.CM.setOption('mode', 'markdown'); obj.removeCls('JSEditor'); break;

        case 'xml': obj.TEXTAREA.CM.setOption('mode', 'text/xml'); obj.removeCls('JSEditor'); break;


        default: break;
      };

      if (obj.TOOLBAR.ModeText)
        obj.TOOLBAR.ModeText.setText(newvalue);
    };
  },


  OnLineNumbersChanged: function (obj, oldvalue, newvalue)
  {
    if (obj && obj.TEXTAREA && obj.TEXTAREA.CM)
    {
      obj.TEXTAREA.CM.setOption('lineNumbers', newvalue);
    };
  },


  OnLineWrappingChanged: function (obj, oldvalue, newvalue)
  {
    if (obj && obj.TEXTAREA && obj.TEXTAREA.CM)
    {
      obj.TEXTAREA.CM.setOption('lineWrapping', newvalue);
    };
  },


  OnThemeChanged: function (obj, oldvalue, newvalue)
  {
    if (obj && obj.TEXTAREA && obj.TEXTAREA.CM)
    {
      obj.TEXTAREA.CM.setOption('theme', newvalue);
      obj.TOOLBAR.ThemeText.setText(newvalue);
    };
  },



  getCodeValue: function ()
  {
    if (this.TEXTAREA && this.TEXTAREA.CM)
    {
      return this.TEXTAREA.CM.getValue();
    }
    else
    {
      return null;
    };
  },


  /**
   * Очищает содержимое редактора кода.
   * @method Clear
   */
  Clear: function ()
  {
    this.setValue('');
  },


  /**
   * В случае, если режим редактирования компонента == 'markdown', 
   * и свойство MD компонента инициализировано, возвращает HTML-рендер для кода Markdown.
   * @method GetRenderedMarkdown @property htmlContent
   * @returns {String}
   */
  GetRenderedMarkdown: function ()
  {
    if (this.getMode() == 'markdown' && this.MD)
    {
      var res = this.MD.render(this.getCodeValue());
      return res;
    };
  },


  OnCursorActivity: function (c)
  {

  },


  /**
   * Обработчик события change, генерируемого дочерним элементом textarea.
   */
  OnAfterChanged: function ()
  {

  },


  ComposeToolbar: function ()
  {
    var me = this;
    var tlb = Ext.create('ZML.toolbar.CodeMirror', {
      itemId: me.itemId + '-Toolbar',
      EDITOR: me,
    });
    return tlb;
  },


  /** Свернуть все */
  FoldAll: function ()
  {
    if (globalThis.CodeMirror)
    {
      globalThis.CodeMirror.commands.foldAll(this.TEXTAREA.CM);
    };
  },

  /** Развернуть все */
  UnfoldAll: function ()
  {
    if (globalThis.CodeMirror)
    {
      globalThis.CodeMirror.commands.unfoldAll(this.TEXTAREA.CM);
    };
  },
});







// Ext.define('ZML.panel.CodeMirror', {

//   extend: 'Ext.panel.Panel',
//   alias: 'widget.CodeMirrorPanel',

//   layout: 'fit',
//   height: '100%',
//   width: '100%',
//   flex: 1,

//   TEXTAREA: null,

//   config: {
//     mode: null,
//     tabSize: 2,
//     lineNumbers: true,
//     lineWrapping: true,
//     theme: 'Diff1',
//     value: null,
//   },


//   setMode: function (value)
//   {
//     var oldvalue = this.getMode();
//     this.mode = value;
//     if (oldvalue != value)
//     {
//       this.fireEvent('modeChanged', this, oldvalue, value);
//     };
//   },

//   setLineNumbers: function (value)
//   {
//     var oldvalue = this.getLineNumbers();
//     this.lineNumbers = value;
//     if (oldvalue != value)
//     {
//       this.fireEvent('lineNumbersChanged', this, oldvalue, value);
//     };
//   },

//   setLineWrapping: function (value)
//   {
//     var oldvalue = this.getLineWrapping();
//     this.lineWrapping = value;
//     if (oldvalue != value)
//     {
//       this.fireEvent('lineWrappingChanged', this, oldvalue, value);
//     };
//   },

//   setTheme: function (value)
//   {
//     var oldvalue = this.getTheme();
//     this.theme = value;
//     if (oldvalue != value)
//     {
//       this.fireEvent('themeChanged', this, oldvalue, value);
//     };
//   },

//   setValue: function (value)
//   {
//     var oldvalue = this.getValue();
//     this.value = value;
//     if (oldvalue != value)
//     {
//       this.fireEvent('valueChanged', this, oldvalue, value);
//     };
//   },


//   initComponent: function (config)
//   {
//     var me = this;
//     config = config || {};
//     config.tabSize = config.tabSize || 2;
//     if (config.lineNumbers == undefined) config.lineNumbers = true;
//     if (config.lineWrapping == undefined) config.lineWrapping = true;
//     config.theme = config.theme || 'Diff1';

//     me.initConfig(config);
//     me.callParent(arguments);

//     me.addEvents('valueChanged', 'modeChanged', 'lineNumbersChanged', 'lineWrappingChanged', 'themeChanged');
//     me.on({
//       valueChanged: me.OnValueChanged,
//       modeChanged: me.OnModeChanged,
//       lineNumbersChanged: me.OnLineNumbersChanged,
//       lineWrappingChanged: me.OnLineWrappingChanged,
//       themeChanged: me.OnThemeChanged,
//       afterrender: me.OnAfterRender,
//       scope: me
//     });
//   },

  
//   OnAfterRender: function ()
//   {
//     var me = this;
//     me.TEXTAREA = Ext.create('Ext.form.field.TextArea', {
//       PANEL: me,
//       layout: 'fit',
//       height: '100%',
//       width: '100%',
//       flex: 1,
//       listeners: {
//         afterrender: function (panel)
//         {
//           this.CM = CodeMirror.fromTextArea(panel.inputEl.dom, {
//             content: panel.getValue(),
//             mode: panel.PANEL.mode,
//             indentWithTabs: false,
//             tabSize: panel.PANEL.tabSize,
//             smartIndent: true,
//             lineNumbers: panel.PANEL.lineNumbers,
//             matchBrackets: true,
//             autofocus: true,
//             lineWrapping: panel.PANEL.lineWrapping,
//             foldGutter: true,
//             gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
//             matchTags: { bothTags: true },
//             autoCloseTags: true,
//             highlightSelectionMatches:
//             {
//               showToken: /\w/,
//               annotateScrollbar: true
//             },
//             theme: panel.PANEL.theme
//           });
//           this.CM.ParentPanel = panel;
//           this.CM.on('cursorActivity', me.OnCursorActivity, me);
//           panel.PANEL.setMode(panel.PANEL.mode);
//           panel.PANEL.setLineNumbers(panel.PANEL.lineNumbers);
//           panel.PANEL.setLineWrapping(panel.PANEL.lineWrapping);
//           this.CM.setOption('tabSize', panel.PANEL.tabSize);
//           this.CM.setOption('theme', panel.PANEL.theme);
//         },
//         change: function (widget, val)
//         {
//           this.CM.setValue(val);
//         }
//       }
//     });
//     me.add(me.TEXTAREA);
//     me.addDocked(me.ComposeToolbar());
//   },


//   OnValueChanged: function (obj, oldvalue, newvalue)
//   {
//     if (obj && obj.TEXTAREA && obj.TEXTAREA.CM)
//     {
//       obj.TEXTAREA.CM.setValue(newvalue);
//     };
//   },


//   OnModeChanged: function (obj, oldvalue, newvalue)
//   {
//     if (obj && obj.TEXTAREA && obj.TEXTAREA.CM)
//     {
//       switch (newvalue.toLowerCase())
//       {
//         case 'sql': obj.TEXTAREA.CM.setOption('mode', 'text/x-sql'); obj.removeCls('JSEditor'); break;

//         case 'js':
//         case 'javascript': obj.TEXTAREA.CM.setOption('mode', 'text/javascript'); obj.addCls('JSEditor'); break;

//         case 'cs':
//         case 'csharp':
//         case 'c#': obj.TEXTAREA.CM.setOption('mode', 'text/x-csharp'); obj.removeCls('JSEditor'); break;

//         case 'css': obj.TEXTAREA.CM.setOption('mode', 'text/css'); obj.removeCls('JSEditor'); break;

//         case 'scss': obj.TEXTAREA.CM.setOption('mode', 'text/x-scss'); obj.removeCls('JSEditor'); break;

//         case 'md':
//         case 'markdown': obj.TEXTAREA.CM.setOption('mode', 'markdown'); obj.removeCls('JSEditor'); break;

//         case 'xml': obj.TEXTAREA.CM.setOption('mode', 'text/xml'); obj.removeCls('JSEditor'); break;


//         default: break;
//       };

//       obj.GetTbMode().setText(newvalue);
//     };
//   },


//   OnLineNumbersChanged: function (obj, oldvalue, newvalue)
//   {
//     if (obj && obj.TEXTAREA && obj.TEXTAREA.CM)
//     {
//       obj.TEXTAREA.CM.setOption('lineNumbers', newvalue);
//     };
//   },


//   OnLineWrappingChanged: function (obj, oldvalue, newvalue)
//   {
//     if (obj && obj.TEXTAREA && obj.TEXTAREA.CM)
//     {
//       obj.TEXTAREA.CM.setOption('lineWrapping', newvalue);
//     };
//   },


//   OnThemeChanged: function (obj, oldvalue, newvalue)
//   {
//     if (obj && obj.TEXTAREA && obj.TEXTAREA.CM)
//     {
//       obj.TEXTAREA.CM.setOption('theme', newvalue);
//       obj.GetTbTheme().setText(newvalue);
//     };
//   },



//   getCodeValue: function ()
//   {
//     if (this.TEXTAREA && this.TEXTAREA.CM)
//     {
//       return this.TEXTAREA.CM.getValue();
//     }
//     else
//     {
//       return null;
//     };
//   },

  
//   OnCursorActivity: function (c)
//   {

//   },


//   ComposeToolbar: function ()
//   {
//     var me = this;
//     var tlb = Ext.create('Ext.toolbar.Toolbar', {
//       dock: 'bottom',
//       height: 28,
//       items: [
//         'Mode: ',
//         { xtype: 'tbtext', itemId: me.itemId + '-tbMode', text: me.mode },
//         { xtype: 'tbseparator' },
//         'Theme: ',
//         { xtype: 'tbtext', itemId: me.itemId + '-tbTheme', text: me.theme },
//         { xtype: 'tbseparator' },
//       ]
//     });
//     return tlb;
//   },

//   GetTbMode: function ()
//   {
//     return this.query('#' + this.itemId + '-tbMode')[0];
//   },

//   GetTbTheme: function ()
//   {
//     return this.query('#' + this.itemId + '-tbTheme')[0];
//   },




// });