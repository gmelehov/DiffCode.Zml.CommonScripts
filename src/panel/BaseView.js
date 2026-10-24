Ext.define('ZML.panel.BaseView', {

  extend: 'Ext.panel.Panel',
  alias: 'widget.BaseViewPanel',

  border: 0,
  bodyBorder: 0,
  layout: 'fit',
  width: '100%',
  height: '100%',
  ModuleName: null,


  initComponent: function ()
  {
    var me = this;
    me.callParent(arguments);
    me.addEvents('moduleLoaded');
    me.on({
      moduleLoaded: me.OnModuleLoaded,
      scope: me
    });
  },


  listeners: {
    activate: function (obj, eOpts)
    {
      var me = this;
      var ctrl = LogX.app.getController(me.ModuleName);
      if (ctrl)
      {
        LogX.currCtrl = ctrl;
        ctrl.__ActiveTab = obj;
        var viewFnName = '__Init' + me.ModuleName + 'Panel';
        if (!obj.IsFirstSow)
        {
          obj.IsFirstSow = true;
          ctrl[viewFnName].call(ctrl, obj);
        }
        else
        {
          ctrl.refresh();
        };
      };
    },
    
    afterrender: function (comp)
    {
      var ctrl = LogX.app.getController(comp.ModuleName);
      if (ctrl)
      {
        ctrl.initAllStores();
      };
    },
  },


  OnModuleLoaded: function (comp)
  {
    setTimeout(function ()
    {
      LogX.currCtrl.AddVarStore();
    }, 500);
    comp.ApiOnModuleLoaded(comp);
  },


  ApiOnModuleLoaded: function (comp) { }
});