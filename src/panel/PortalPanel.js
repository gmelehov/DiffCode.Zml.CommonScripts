Ext.define('ZML.panel.PortalPanel', {

  extend: 'Ext.panel.Panel',
  alias: 'widget.portalpanel',

  requires: [
    //'Ext.layout.container.Column',
    //'Ext.app.PortalDropZone',
    //'Ext.app.PortalColumn'
  ],

  // добавлено!!!
  width: '100%',
  height: '100%',
  cls: 'x-portal',
  bodyCls: 'x-portal-body',
  defaultType: 'portalcolumn',
  autoScroll: false,

  manageHeight: false,


  initComponent: function ()
  {
    var me = this;

    // Implement a Container beforeLayout call from the layout to this Container
    this.layout = {
      type: 'column'
    };
    this.callParent();
    this.addEvents({
      validatedrop: true,
      beforedragover: true,
      dragover: true,
      beforedrop: true,
      drop: true
    });
  },


  // Set columnWidth, and set first and last column classes to allow exact CSS targeting.
  beforeLayout: function ()
  {
    var items = this.layout.getLayoutItems();
    var len = items.length;
    var firstAndLast = ['x-portal-column-first', 'x-portal-column-last'];
    var item;
    var last;

    for (var i = 0; i < len; i++)
    {
      item = items[i];
      //item.columnWidth = 1 / len;
      last = (i == len - 1);

      if (!i)
      { // if (first)
        if (last)
        {
          item.addCls(firstAndLast);
        }
        else
        {
          item.addCls('x-portal-column-first');
          item.removeCls('x-portal-column-last');
        }
      }
      else if (last)
      {
        item.addCls('x-portal-column-last');
        item.removeCls('x-portal-column-first');
      }
      else
      {
        item.removeCls(firstAndLast);
      };
    };

    return this.callParent(arguments);
  },


  // private
  initEvents: function ()
  {
    this.callParent();
    this.dd = Ext.create('ZML.dd.PortalDropZone', this, this.dropConfig);
  },


  // private
  beforeDestroy: function ()
  {
    if (this.dd)
    {
      this.dd.unreg();
    };
    this.callParent();
  },

});