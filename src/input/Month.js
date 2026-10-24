/**
 * ПОЛЕ ВВОДА МЕСЯЦА
 * @alias MonthField
 * @manager ZML.ComboMgr
 * @registration initComponent
 */
Ext.define('ZML.input.Month', {

  extend: 'ZML.input.ComboBox',
  alias: 'widget.MonthField',

  queryMode: 'local',

  valueField: 'Id',
  displayField: 'Name',
  descrField: 'ShortName',

  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',

  TEMPLATE: [],


  initComponent: function ()
  {
    var me = this;
    me.callParent(arguments);
    me.ComposeStore();

    me.on({
      afterrender: me.OnAfterRender,
      change: me.OnChange,
      scope: me
    });

    me.inputElem = 'input';

    GLOBAL[this.AppNAME].Combo.register(this);
  },


  OnAfterRender: function (obj)
  {
    if (obj)
    {
      if (Array.isArray(obj.TEMPLATE) && obj.TEMPLATE.length)
      {
        obj.tpl = new Ext.XTemplate(obj.TEMPLATE);
      };

      setTimeout(function ()
      {
        obj.CountFoundItems();
        obj.SelectRecordByValue();
      }, 500);
    };
  },


  OnChange: function (obj)
  {
    if (obj)
    {
      obj.updateClearIcon();
      obj.CountFoundItems();
      Ext.StoreManager.LoadLinkedStores({ scopeType: 'Input', scopeId: obj.itemId })
      obj.OnAfterEvent(obj.ApiOnChange, obj);
      //setTimeout(function ()
      //{
      //  obj.OnAfterEvent(obj.ApiOnChange, obj);
      //}, 0);
    };
  },


  ComposeStore: function ()
  {
    var me = this;
    var modelname = me.itemId + '-MonthsModel';

    Ext.define(modelname, {
      extend: 'Ext.data.Model',
      idProperty: me.valueField,
      fields: [
        { name: me.valueField, type: 'int' },
        { name: me.displayField, type: 'string' },
        { name: me.descrField, type: 'string' },
      ]
    });

    var stor = Ext.create('Ext.data.Store', {
      model: modelname,
      MonthCombo: me,
      data: [].concat(me.GetMonthsList(modelname))
    });

    me.bindStore(stor);
  },


  GetMonthsList: function (modelname)
  {
    var me = this;
    var array = [
      [1, 'январь', 'янв'],
      [2, 'февраль', 'фев'],
      [3, 'март', 'мар'],
      [4, 'апрель', 'апр'],
      [5, 'май', 'май'],
      [6, 'июнь', 'июн'],
      [7, 'июль', 'июл'],
      [8, 'август', 'авг'],
      [9, 'сентябрь', 'сен'],
      [10, 'октябрь', 'окт'],
      [11, 'ноябрь', 'ноя'],
      [12, 'декабрь', 'дек'],
    ];

    var ret = [];

    array.forEach(function (f)
    {
      var obj = {};
      obj[me.valueField] = f[0];
      obj[me.displayField] = f[1];
      obj[me.descrField] = f[2];
      var record = Ext.create(modelname, obj);
      ret.push(record);
    });

    return ret;
  },


  SelectRecordByValue: function ()
  {
    var me = this;
    if (me.store && me.store.isStore)
    {
      var record = me.store.findRecord(me.valueField, me.defaultValue);
      me.select(record);
    };
  },


  CountFoundItems: function ()
  {
    var emptytext = '' + this.store.getCount() + ' элем.';
    this.emptyText = emptytext;
    this.applyEmptyText();
  },

});





// Ext.define('{{APP_NS}}.input.Month', {

//   extend: '{{APP_NS}}.input.ComboBox',
//   alias: 'widget.MonthField',


//   queryMode: 'local',

//   valueField: 'Id',
//   displayField: 'Name',
//   descrField: 'ShortName',



//   initComponent: function ()
//   {
//     this.callParent(arguments);
//     this.ComposeStore();
//   },



//   OnAfterRender: function (obj)
//   {

//   },


//   OnChange: function (obj)
//   {
//     if (obj)
//     {
//       obj.updateClearIcon();
//       obj.CountFoundItems();
//       Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: obj.itemId })
//       setTimeout(function ()
//       {
//         obj.OnAfterEvent(obj.ApiOnChange, obj);
//       }, 0);
//     };
//   },


//   ComposeStore: function ()
//   {
//     var me = this;
//     var modelname = me.itemId + '-MonthsModel';

//     Ext.define(modelname, {
//       extend: 'Ext.data.Model',
//       idProperty: me.valueField,
//       fields: [
//         { name: me.valueField, type: 'int' },
//         { name: me.displayField, type: 'string' },
//         { name: me.descrField, type: 'string' },
//       ]
//     });

//     var stor = Ext.create('Ext.data.Store', {
//       model: modelname,
//       MonthCombo: me,
//       data: [].concat(me.GetMonthsList(modelname))
//     });

//     me.bindStore(stor);
//   },


//   GetMonthsList: function (modelname)
//   {
//     var me = this;
//     var array = [
//       [1, 'январь', 'янв'],
//       [2, 'февраль', 'фев'],
//       [3, 'март', 'мар'],
//       [4, 'апрель', 'апр'],
//       [5, 'май', 'май'],
//       [6, 'июнь', 'июн'],
//       [7, 'июль', 'июл'],
//       [8, 'август', 'авг'],
//       [9, 'сентябрь', 'сен'],
//       [10, 'октябрь', 'окт'],
//       [11, 'ноябрь', 'ноя'],
//       [12, 'декабрь', 'дек'],
//     ];

//     var ret = [];

//     array.forEach(function (f)
//     {
//       var obj = {};
//       obj[me.valueField] = f[0];
//       obj[me.displayField] = f[1];
//       obj[me.descrField] = f[2];
//       var record = Ext.create(modelname, obj);
//       ret.push(record);
//     });

//     return ret;
//   },

// });