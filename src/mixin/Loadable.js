Ext.define('ZML.mixin.Loadable', {


  InitLoader: function ()
  {
    var me = this;
    if (me.__loader)
    {
      me.SetLoader(me.__loader);
      me.__loader = undefined;
    };
  },


  GetLoaderId: function ()
  {
    var me = this;
    if (me.getLoader())
    {
      return me.getLoader().itemId;
    };
  },


  SetLoader: function (loaderId)
  {
    var me = this;
    var loaderExists = !!GLOBAL[me.AppNAME].Loader[loaderId];
    if (loaderExists)
    {
      if (me.getLoader())
      {
        me.getLoader().UnlinkTarget();
      };

      me.loader = GLOBAL[me.AppNAME].Loader[loaderId];

      setTimeout(() => me.getLoader().load(), 0);
    };
  },

});