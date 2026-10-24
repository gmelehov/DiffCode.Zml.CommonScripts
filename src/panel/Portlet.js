Ext.define('ZML.panel.Portlet', {

  extend: 'Ext.panel.Panel',
  alias: 'widget.portlet',


  layout: 'fit',
  anchor: '100%',
  frame: true,
  closable: false,
  collapsible: true,
  animCollapse: true,

  draggable: {
    moveOnDrag: false
  },

  resizeHandles: 's',
  resizable: {
    minHeight: 34,
    heightIncrement: 20,
    dynamic: false,
    listeners: {
      resizedrag: function (resizer, width, height, e)
      {
        resizer.target.ComputeParentItemsHeight();
      }
    }
  },

  cls: 'x-portlet',



  initComponent: function ()
  {
    var me = this;
    me.callParent(arguments);

    me.on({
      collapse: me.OnCollapse,
      expand: me.OnExpand,
      resize: me.OnResize,
      afterrender: me.OnAfterRender,
      scope: me
    });

  },



  OnExpand: function ()
  {
    this.ComputeParentItemsHeight();
  },

  OnCollapse: function ()
  {
    this.ComputeParentItemsHeight();
  },

  OnResize: function (obj, width, height, oldwidth, oldheight)
  {

  },

  OnAfterRender: function ()
  {
    
  },




  ComputeParentItemsHeight: function ()
  {
    this.up('portalcolumn').CountItemsHeight();
  },

  // Override Panel's default doClose to provide a custom fade out effect
  // when a portlet is removed from the portal
  doClose: function ()
  {
    if (!this.closing)
    {
      this.closing = true;
      this.el.animate({
        opacity: 0,
        callback: function ()
        {
          var closeAction = this.closeAction;
          this.closing = false;
          this.fireEvent('close', this);
          this[closeAction]();
          if (closeAction == 'hide')
          {
            this.el.setOpacity(1);
          }
        },
        scope: this
      });
    }
  },

});