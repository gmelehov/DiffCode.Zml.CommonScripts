Ext.define('ZML.plugin.MonthFilteredColumn', {

  extend: 'Ext.AbstractPlugin',
  alias: 'plugin.MonthFilteredColumn',


  init: function (comp)
  {
    var me = this;
    comp.MONTH_FILTER = me;
    me.callParent(arguments);
    comp.on('afterrender', function ()
    {
      me.processOptions();
    });
  },


  processOptions: function ()
  {
    var me = this;
    me.cmp.filter = {
      type: 'month',
      dataIndex: me.cmp.dataIndex
    };
  },
});