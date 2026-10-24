Ext.define('ZML.panel.Tabpanel', {

  extend: 'Ext.tab.Panel',
  alias: 'widget.Tabpanel',

  plain: false,
  height: '100%',
  width: '100%',
  flex: 1,

  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',


  initComponent: function (config)
  {
    var me = this;
    me.callParent(arguments);
    me.initConfig(config);
    GLOBAL[this.AppNAME].Tabpanel.register(me);
  },
});
