Ext.define('GLOBAL', {

  extend: 'Ext.Component',

  singleton: true,


  CreateApp: function (appname)
  {
    GLOBAL[appname] = {
      Action: new ZML.ActionMgr(),
      Button: new ZML.ButtonMgr(),
      Chart: new ZML.ChartMgr(),
      Combo: new ZML.ComboMgr(),
      Dialog: new ZML.DialogMgr(),
      Editor: new ZML.EditorMgr(),
      Form: new ZML.FormMgr(),
      Grid: new ZML.GridMgr(),
      Input: new ZML.InputMgr(),
      List: new ZML.ListMgr(),
      Loader: new ZML.LoaderMgr(),
      Panel: new ZML.PanelMgr(),
      Tabpanel: new ZML.TabpanelMgr(),
      Tree: new ZML.TreeMgr(),
      Source: {},
    };
  }
});
