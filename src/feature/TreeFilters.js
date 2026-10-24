Ext.define('ZML.feature.TreeFilters', {

  extend: 'Ext.ux.grid.FiltersFeature',
  alias: 'feature.TreeFilters',


  init: function (tree)
  {
    var me = this;
    var view = me.view;
    var headerCt = view.headerCt;
    me.bindStore(tree.getStore(), true);

    // Listen for header menu being created
    headerCt.on('menucreate', me.onMenuCreate, me);
    view.on('refresh', me.onRefresh, me);
    tree.on({
      scope: me,
      beforestaterestore: me.applyState,
      beforestatesave: me.saveState,
      beforedestroy: me.destroy
    });

    // Add event and filters shortcut on grid panel
    tree.filters = me;
    tree.addEvents('filterupdate');
  },


  getGridPanel: function ()
  {
    return this.view.up('treepanel');
  },  
});