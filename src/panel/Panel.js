/**
 * ПАНЕЛЬ
 * @alias Panel
 * @manager ZML.PanelMgr
 * @registration initComponent
 */
Ext.define('ZML.panel.Panel', {

  extend: 'Ext.panel.Panel',
  alias: 'widget.Panel',

  mixins: {
    loadable: 'ZML.mixin.Loadable',
  },

  layout: 'fit',
  height: '100%',
  width: '100%',
  flex: 1,

  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',


  listeners: {
    afterrender: function (obj)
    {
      obj.InitLoader();
    }
  },


  initComponent: function (config)
  {
    var me = this;
    me.callParent(arguments);
    me.initConfig(config);
    GLOBAL[this.AppNAME].Panel.register(me);
  },


  GetCollapsed: function ()
  {
    var me = this;
    return !!me.collapsed;
  },

  SetCollapsed: function (value)
  {
    var me = this;
    if (!!value)
    {
      me.collapse();
    }
    else
    {
      me.expand();
    };
  },

  /**
   * Заменяет содержимое панели на указанную HTML-разметку.
   * @param {String} content HTML-строка.
   */
  AddHtmlContent: function (content)
  {
    //this.body.el.dom.innerHTML = content;
    this.update(content, true);
  },

  /**
   * Очищает HTML-содержимое панели.
   */
  RemoveHtmlContent: function ()
  {
    this.body.el.dom.innerHTML = '';
  },


});
