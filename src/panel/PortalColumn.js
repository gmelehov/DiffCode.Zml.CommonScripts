Ext.define('ZML.panel.PortalColumn', {

  extend: 'Ext.container.Container',
  alias: 'widget.portalcolumn',

  requires: [
    //'Ext.layout.container.Anchor',
    //'Ext.app.Portlet'
  ],

  layout: 'anchor',
  defaultType: 'portlet',
  cls: 'x-portal-column',
  width: '100%',
  //height: '100%',

  ItemsCount: 0,

  ItemsHeight: 0,



  initComponent: function ()
  {
    var me = this;
    me.callParent(arguments);
    me.addEvents('itemsHeightExceed');
    me.on({
      add: me.OnItemAdd,
      remove: me.OnItemRemove,
      afterrender: me.OnAfterRender,
      itemsHeightExceed: me.OnItemsHeightExceed,
      scope: me
    });
  },



  OnItemAdd: function (obj, comp, index)
  {
    setTimeout(function ()
    {
      obj.CountItems();
      if (typeof comp.getHeight === 'function')
      {
        obj.CountItemsHeight();
      };
    }, 50);
  },


  OnItemRemove: function (obj, comp)
  {
    obj.CountItems();
    obj.CountItemsHeight();
  },


  OnAfterRender: function (obj)
  {
    obj.CountItems();
    obj.CountItemsHeight();
  },


  OnItemsHeightExceed: function (obj)
  {
    console.dir('HEIGHT EXCEED!');
    var last = obj.query('portlet')[obj.ItemsCount - 1];
    var exceed = obj.ItemsHeight - last.getHeight();
    var margins = (obj.ItemsCount * 15) + 5;
    last.setHeight(exceed - margins);
    setTimeout(function ()
    {
      obj.CountItemsHeight();
    }, 50);
  },


  CountItems: function ()
  {
    this.ItemsCount = this.query('portlet').length;
  },


  CountItemsHeight: function ()
  {
    var me = this;
    this.ItemsHeight = this.query('portlet').reduce(function (a, b) { return a + b.getHeight(); }, 0);
    this.maxHeight = me.up('portalpanel').getHeight() - 20;
    this.setHeight(this.maxHeight);

    setTimeout(function ()
    {
      if (me.ItemsHeight > me.maxHeight)
      {
        var last = me.query('portlet')[me.ItemsCount - 1];
        var lastHeight = last.getHeight();
        var exceed = me.ItemsHeight - me.getHeight();
        var margins = (me.ItemsCount * 15) + 5;
        var newheight = lastHeight - exceed - margins;
        if(newheight >= 40) last.setHeight(newheight);
        //me.fireEvent('itemsHeightExceed', me);
      };
    }, 220);
  },

});
