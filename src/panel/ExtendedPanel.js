Ext.define('ZML.panel.ExtendedPanel', {

  extend: 'Ext.panel.Panel',
  alias: 'widget.ExtendedPanel',

  layout: 'fit',
  height: '100%',
  width: '100%',
  flex: 1,

  config: {
    headerColor: 'darkblue',
    bodyColor: 'white',
  },


  initComponent: function (config)
  {
    var me = this;
    me.callParent(arguments);
    me.initConfig(config);

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


});