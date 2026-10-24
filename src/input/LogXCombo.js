Ext.define('ZML.input.LogXCombo', {

  extend: 'Ext.form.field.ComboBox',
  alias: 'widget.SimpleCombo',

  mixins: {
    afterEventCallback: 'ZML.mixin.AfterEventCallback',
    formFieldCommons: 'ZML.mixin.FormFieldCommons',
    handleClearIcon: 'ZML.mixin.HandleClearIcon'
  },

  multiSelect: false,
  required: null,
  allowBlank: null,
  listConfig: { shadow: 'sides', shadowOffset: 5 },
  labelAlign: 'left',
  forceSelection: true,
  editable: false,
  enableKeyEvents: true,
  minChars: 2,
  queryMode: 'remote',
  labelWidth: 200,
  flex: 1,
  columnWidth: 1,
  fieldCls: 'x-form-field basecombo',

  ComboStore: null,
  src: null,
  sourceId: 'GetExtendedCombo',
  limit: 1500,
  interval: 300,

  descrField: null,
  filterField: null,
  filterValue: null,
  defaultValue: null,
  paramLinkers: [],


  initComponent: function (config)
  {
    var me = this;
    me.initConfig(config);
    me.callParent(arguments);

    me.on({
      validitychange: me.OnValiditychange,
      render: me.OnRender,
      change: me.OnChange,
      scope: me
    });

    me.inputElem = 'input';
  },


  CreateComboStore: function ()
  {
    var me = this;
    if (!me.ComboStore)
    {
      var flds = me.descrField ? [me.valueField, me.displayField, me.descrField] : [me.valueField, me.displayField];
      me.store = Ext.create('Ext.data.Store', {
        fields: flds,
        combo: me,
        storeId: 'ComboStore-' + me.itemId,
        autoLoad: false,
        paramLinkers: [].concat(me.paramLinkers),
        proxy: {
          type: 'dddproxy',
          extraParams: {
            sourceId: me.sourceId,
            limit: me.limit,
            combotext: '',
            RefTableName: me.src,
            RefColumnShowName: me.displayField,
            RefColumnDescrName: me.descrField,
            RefColumnMemoName: me.valueField,
            RefColumnFilter: me.filterField,
            RefColumnFilterValue: me.filterValue,
            RefColumnFilterTable: me.src,
            defaultvalue: me.defaultValue
          }
        }
      });
      me.bindStore(me.store);
      me.ComboStore = me.store;
      me.store.on('beforeload', me.ComboStoreOnBeforeLoad);
      me.store.on('load', me.ComboStoreOnLoad);
      me.SetComboRunner();
      if (!me.updateClock)
      {
        me.updateClock = function ()
        {
          if (this.taskRunCount > 1)
          {
            var combo = this.combobox;
            combo.runner.stopAll();
            var newValue = combo.newValue;
            if (newValue != null && combo.ComboStore)
            {
              var combotextproxy = newValue.replace(/\"/g, '\"');
              combo.ComboStore.getProxy().setExtraParam('combotext', combotextproxy);
              if (!combo.ComboStore.isload)
              {
                combo.ComboStore.reload();
                combo.expand();
              };
              combo.runner.stopAll();
            };
          };
        };
      };
      me.SetComboTask();
      me.SetComboEvents();
      if (me.defaultValue)
      {
        me.ComboStore.load();
      };
    }
  },


  ComboStoreOnBeforeLoad: function (store, records, successful, eOpts)
  {
    var proxy = store.getProxy();
    store.isload = true;
    store.paramLinkers = store.paramLinkers || [];
    store.paramLinkers.forEach(function (p)
    {
      p.compute();
      proxy.setExtraParam(p.as, p.value);
    });
  },


  ComboStoreOnLoad: function (store, records, successful, eOpts)
  {
    var cmb = store.combo;
    store.isload = false;
    cmb.isdataloaded = 1;
    if (cmb.defaultValue)
    {
      if (Array.isArray(cmb.defaultValue))
      {
        var recs = cmb.defaultValue.map(function (m) { return cmb.ComboStore.findRecord(cmb.valueField, +m); });
        cmb.runner.stopAll();
        if (recs.length) cmb.select(recs);
        cmb.blur();
        cmb.newValue = cmb.defaultValue;
      }
      else
      {
        var record = store.findRecord(cmb.valueField, cmb.defaultValue);
        if (record)
        {
          cmb.runner.stopAll();
          cmb.select(record);
          cmb.blur();
          cmb.newValue = cmb.getRawValue();
        };
      };
    };
    if (cmb.newValue != cmb.getRawValue())
    {
      cmb.setRawValue(cmb.newValue);
      cmb.setValue(cmb.newValue);
      cmb.setCursorPosition(cmb.currentpos);
    };
    cmb.CountFoundItems();
  },


  SetComboRunner: function ()
  {
    var t = this;
    if (t && !t.runner)
    {
      t.runner = new Ext.util.TaskRunner();
      t.runner.mycombo = t;
    };
  },


  SetComboTask: function ()
  {
    var t = this;
    if (t && t.updateClock && !t.task)
    {
      t.task = {
        combobox: t,
        run: t.updateClock,
        interval: t.interval
      };
    };
  },


  SetComboEvents: function ()
  {
    var t = this;
    t.on('keyup', function (combo, epapam, eOpts)
    {
      var btn = epapam.button;
      if (btn == 15 || btn == 16 || btn == 17)
      {
        return;
      };
      if (!(btn == 16 || btn == 39 || btn == 37 || btn == 12 || btn == 36 || btn == 38))
      {
        var valueisnew = true;
        var newValue = combo.getRawValue();
        combo.IsKeyPressed = true;
        combo.currentpos = combo.getCursorPosition();
        if (combo.newValue && combo.newValue == newValue)
        {
          valueisnew = false;
        };
        combo.newValue = newValue;
        if (combo.ComboStore)
        {
          var combotextproxy = combo.newValue.replace(/\"/g, '\"');
          combo.ComboStore.getProxy().setExtraParam('combotext', combotextproxy);
        };
        if (valueisnew)
        {
          combo.runner.start(combo.task);
        };
      };
    }, t);
    t.on('keydown', function (combo, epapam, eOpts)
    {
      combo.runner.stopAll();
    }, t);
    
  }

});