Ext.define('ZML.plugin.ListFilteredColumn', {

  extend: 'Ext.AbstractPlugin',
  alias: 'plugin.ListFilteredColumn',


  init: function (comp)
  {
    var me = this;
    comp.LIST_FILTER = me;
    me.callParent(arguments);
    comp.on('afterrender', function ()
    {
      var grid = comp.up('grid') || comp.up('treepanel');
      var store = grid.getStore();
      store.on('load', me.computeOptions, me);
    });
  },


  computeOptions: function (stor)
  {
    var me = this;
    var uniqueArray = Ext.Array.unique(stor.data.items.map(function (m)
    {
      return m.get(me.cmp.dataIndex);
    }));

    me.processOptions(stor, uniqueArray);

    var grid = me.cmp.up('grid') || me.cmp.up('treepanel');
    grid.filters.createFilters();
  },


  processOptions: function (stor, values)
  {
    var me = this;
    if (me.cmp.filter != undefined && Array.isArray(me.cmp.filter.options))
    {
      me.cmp.filter.options = [].concat(values);
    }
    else
    {
      me.cmp.filter = {
        type: 'list',
        idField: me.cmp.dataIndex,
        dataIndex: me.cmp.dataIndex,
        labelField: me.cmp.dataIndex,
        phpMode: true,
        options: [].concat(values)
      };
    };
  },

});

