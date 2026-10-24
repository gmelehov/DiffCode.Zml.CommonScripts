/**
 * ВСПОМОГАТЕЛЬНЫЙ КЛАСС
 * ТУЛБАР ДЛЯ РЕДАКТОРА КОДА
 */
Ext.define('ZML.toolbar.CodeMirror', {

  extend: 'Ext.toolbar.Toolbar',
  alias: 'widget.EditorToolbar',

  dock: 'bottom',
  height: 36,

  EDITOR: null,

  /** Текстовый элемент, отображающий текущий режим редактирования */
  ModeText: null,

  /** Текстовый элемент, отображающий текущую тему */
  ThemeText: null,

  /** Кнопка сворачивания контента */
  FoldAllBtn: null,

  /** Кнопка разворачивания контента */
  UnfoldAllBtn: null,



  listeners: {
    afterrender: function ()
    {
      var me = this;
      me.ComposeOwnItems();
    }
  },


  initComponent: function ()
  {
    this.callParent(arguments);
  },



  ComposeOwnItems: function ()
  {
    var me = this;

    me.FoldAllBtn = Ext.create('ZML.button.Button', {
      itemId: me.itemId + '-FoldAllBtn',
      call: 'action',
      disabled: false,
      iconSet: 'mat-icons',
      __icon: 'unfold_less',
      color: 'darkgreen',
      OnHandlerCall: me.EDITOR.FoldAll.bind(me.EDITOR)
    });
    me.UnfoldAllBtn = Ext.create('ZML.button.Button', {
      itemId: me.itemId + '-UnfoldAllBtn',
      call: 'action',
      disabled: false,
      iconSet: 'mat-icons',
      __icon: 'unfold_more',
      color: 'darkgreen',
      OnHandlerCall: me.EDITOR.UnfoldAll.bind(me.EDITOR)
    });

    var items = [
      'Mode: ',
      { xtype: 'tbtext', itemId: me.itemId + '-tbMode', text: me.EDITOR.mode },
      { xtype: 'tbseparator' },
      'Theme: ',
      { xtype: 'tbtext', itemId: me.itemId + '-tbTheme', text: me.EDITOR.theme },
      { xtype: 'tbseparator' },
      me.FoldAllBtn,
      me.UnfoldAllBtn
    ];

    me.add(items);

    setTimeout(() =>
    {

      me.ModeText = me.query('#' + me.itemId + '-tbMode')[0];
      me.ThemeText = me.query('#' + me.itemId + '-tbTheme')[0];

    }, 100);
  },

});
