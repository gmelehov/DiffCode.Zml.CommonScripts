Ext.define('ZML.dialog.CommonDialog', {

  extend: 'Ext.window.Window',
  alias: 'widget.CommonDialog',

  closeAction: 'hide',
  minWidth: 300,
  minHeight: 250,
  layout: 'fit',
  noRipple: true,
  standardButtons: true,
  ConfirmAction: null,
  ContextBinders: [],


  listeners: {
    beforerender: function ()
    {
      if (!!this.standardButtons)
      {
        this.ComposeStandardButtons();
      };
    },
    show: function ()
    {
      this.OnDialogOpened();
    }
  },


  initComponent: function ()
  {
    this.callParent(arguments);
  },


  OnDialogOpened: function ()
  {

  },


  OnDialogCancelled: function ()
  {

  },


  OnDialogConfirmed: function ()
  {

  },


  ComposeStandardButtons: function ()
  {
    var me = this;
    if (!!me.standardButtons && !me.HasStdButtons())
    {
      var ctxplugin = me.ComposeContextPlugin('btnConfirm');
      var btnConfirmPlugins = me.noRipple ? [ctxplugin] : [ctxplugin, me.ComposeRipplePlugin('btnConfirm')];
      var btnCancelPlugins = me.noRipple ? [] : [me.ComposeRipplePlugin('btnCancel')];
      var firstWithNeedSel = me.ContextBinders.find(function (f) { return f.for === 'btnConfirm' && !!f.needSelection });
      var needSel = firstWithNeedSel ? firstWithNeedSel.needSelection : 'none';

      var confirmBtn = Ext.create('ZML.button.Button', {
        itemId: me.itemId + '-btnConfirm',
        call: 'action',
        disabled: true,
        text: 'ПРИМЕНИТЬ',
        iconSet: 'mat-icons',
        __icon: 'check',
        color: 'darkgreen',
        needSelection: needSel,
        plugins: btnConfirmPlugins,
        OnHandlerCall: function ()
        {
          var dlg = this.up('window');
          if (dlg && dlg.ConfirmAction)
          {
            Ext.StoreManager.ACTION(dlg.ConfirmAction)[0].load();
            Ext.Function.defer(dlg.OnDialogConfirmed, 0, dlg);
            Ext.Function.defer(dlg.close, 350, dlg);
          };
        }
      });

      var cancelBtn = Ext.create('ZML.button.Button', {
        itemId: me.itemId + '-btnCancel',
        call: 'action',
        disabled: false,
        text: 'ОТМЕНИТЬ',
        iconSet: 'mat-icons',
        __icon: 'cancel',
        color: 'darkred',
        plugins: btnCancelPlugins,
        OnHandlerCall: function ()
        {
          var dlg = this.up('window');
          Ext.Function.defer(dlg.OnDialogCancelled, 0, dlg);
          Ext.Function.defer(dlg.close, 350, dlg);
        }
      });

      me.addDocked({ xtype: 'toolbar', dock: 'bottom', items: [{ xtype: 'tbfill' }, confirmBtn, cancelBtn] });
    };
  },


  ComposeContextPlugin: function (itemId)
  {
    var me = this;
    return {
      ptype: 'HostContext',
      pluginId: me.itemId + '-' + itemId + '-hostContextPlugin',
      CTX_BINDERS: me.ContextBinders.filter(function (f) { return f.for === itemId })
    };
  },


  ComposeRipplePlugin: function (itemId)
  {
    var me = this;
    return {
      ptype: 'Ripple',
      pluginId: me.itemId + '-' + itemId + '-ripplePlugin'
    };
  },


  HasStdButtons: function ()
  {
    var created = !!this.query('#' + this.itemId + '-btnConfirm')[0] && !!this.query('#' + this.itemId + '-btnCancel')[0];
    return !!this.standardButtons && created;
  },

});