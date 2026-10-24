/**
 * ПОЛЕ ВВОДА ДАТЫ
 * @alias DateField
 * @manager ZML.InputMgr
 * @registration initComponent
 * @method getValue @property value
 * @method GetDay @property day
 * @method GetMonth @property month
 * @method GetYear @property year
 * @method setValue @property value
 * @method SetDay @property day
 * @method SetMonth @property month
 * @method SetYear @property year
 */
Ext.define('ZML.input.Date', {

  extend: 'Ext.form.field.Date',
  alias: 'widget.DateField',

  mixins: {
    afterEventCallback: 'ZML.mixin.AfterEventCallback',
    formFieldCommons: 'ZML.mixin.FormFieldCommons'
  },

  format: 'd.m.Y',
  submitFormat: 'Y-m-d',
  startDay: 1,
  autoSync: false,



  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',




  initComponent: function ()
  {
    var me = this;
    this.callParent(arguments);
    me.addEvents('formatChanged', 'dayChanged', 'monthChanged', 'yearChanged');
    me.on({
      formatChanged: me.OnFormatChanged,
      dayChanged: me.OnDayChanged,
      monthChanged: me.OnMonthChanged,
      yearChanged: me.OnYearChanged,
      validitychange: me.OnValiditychange,
      writeablechange: me.OnWriteablechange,
      scope: me
    });

    GLOBAL[this.AppNAME].Input.register(me);
  },


  listeners: {
    change: function ()
    {
      var me = this;
      me.OnChange();
    }
  },


  GetDay: function ()
  {
    var me = this;
    return me.getValue().getDate();
  },


  GetMonth: function ()
  {
    var me = this;
    return me.getValue().getMonth() + 1;
  },


  GetYear: function ()
  {
    var me = this;
    return me.getValue().getFullYear();
  },


  SetDay: function (day)
  {
    if (day !== undefined && day !== null && !isNaN(parseInt(day)))
    {
      var d = parseInt(day);
      if (d >= 1 && d <= 31)
      {
        var me = this;
        var old = me.GetDay();
        var dt = new Date();
        dt.setDate(d);
        dt.setMonth(me.GetMonth() - 1);
        dt.setFullYear(me.GetYear());
        var newvalue = Ext.util.Format.date(dt, me.format);
        me.setRawValue(newvalue);
        me.fireEvent('dayChanged', me, old, d);
      };
    };
  },


  SetMonth: function (month)
  {
    if (month !== undefined && month !== null && !isNaN(parseInt(month)))
    {
      var m = parseInt(month);
      if (m >= 1 && m <= 12)
      {
        var me = this;
        var old = me.GetMonth();
        var dt = new Date();
        dt.setDate(me.GetDay());
        dt.setMonth(m - 1);
        dt.setFullYear(me.GetYear());
        var newvalue = Ext.util.Format.date(dt, me.format);
        me.setRawValue(newvalue);
        me.fireEvent('monthChanged', me, old, m);
      };
    };
  },


  SetYear: function (year)
  {
    if (year !== undefined && year !== null && !isNaN(parseInt(year)))
    {
      var y = parseInt(year);
      if (y >= 1800 && y <= 9999)
      {
        var me = this;
        var old = me.GetYear();
        var dt = new Date();
        dt.setDate(me.GetDay());
        dt.setMonth(me.GetMonth() - 1);
        dt.setFullYear(y);
        var newvalue = Ext.util.Format.date(dt, me.format);
        me.setRawValue(newvalue);
        me.fireEvent('yearChanged', me, old, y);
      };
    };
  },


  OnDayChanged: function (obj, oldvalue, newvalue)
  {
    if (obj)
    {
      if (obj.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: obj.itemId });
      obj.OnAfterPropertyChanged();
    };
  },


  OnMonthChanged: function (obj, oldvalue, newvalue)
  {
    if (obj)
    {
      if (obj.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: obj.itemId });
      obj.OnAfterPropertyChanged();
    };
  },


  OnYearChanged: function (obj, oldvalue, newvalue)
  {
    if (obj)
    {
      if (obj.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: obj.itemId });
      obj.OnAfterPropertyChanged();
    };
  },


  OnLabelChanged: function (obj, oldvalue, newvalue)
  {
    if (obj)
    {
      if (obj.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: obj.itemId });
      obj.OnAfterPropertyChanged();
    };
  },


  OnChange: function ()
  {
    var me = this;
    if (me.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'Input', scopeId: me.itemId });
    me.OnAfterEvent(me.ApiOnChange, me);
    //setTimeout(function ()
    //{
    //  me.OnAfterEvent(me.ApiOnChange, me);
    //}, 0);
  }
});




// Ext.define('{{APP_NS}}.input.Date', {

//   extend: 'Ext.form.field.Date',
//   alias: 'widget.DateField',

//   mixins: {
//     afterEventCallback: '{{APP_NS}}.mixin.AfterEventCallback',
//     formFieldCommons: '{{APP_NS}}.mixin.FormFieldCommons'
//   },

//   format: 'd.m.Y',
//   submitFormat: 'Y-m-d',
//   startDay: 1,
//   autoSync: false,


//   initComponent: function ()
//   {
//     var me = this;
//     this.callParent(arguments);
//     me.addEvents('formatChanged', 'dayChanged', 'monthChanged', 'yearChanged');
//     me.on({
//       formatChanged: me.OnFormatChanged,
//       dayChanged: me.OnDayChanged,
//       monthChanged: me.OnMonthChanged,
//       yearChanged: me.OnYearChanged,
//       validitychange: me.OnValiditychange,
//       writeablechange: me.OnWriteablechange,
//       scope: me
//     });
//   },

//   listeners: {
//     change: function ()
//     {
//       var me = this;
//       me.OnChange();
//     }
//   },


//   GetDay: function ()
//   {
//     var me = this;
//     return me.getValue().getDate();
//   },


//   GetMonth: function ()
//   {
//     var me = this;
//     return me.getValue().getMonth() + 1;
//   },


//   GetYear: function ()
//   {
//     var me = this;
//     return me.getValue().getFullYear();
//   },


//   SetDay: function (day)
//   {
//     if (day !== undefined && day !== null && !isNaN(parseInt(day)))
//     {
//       var d = parseInt(day);
//       if (d >= 1 && d <= 31)
//       {
//         var me = this;
//         var old = me.GetDay();
//         var dt = new Date();
//         dt.setDate(d);
//         dt.setMonth(me.GetMonth() - 1);
//         dt.setFullYear(me.GetYear());
//         var newvalue = Ext.util.Format.date(dt, me.format);
//         me.setRawValue(newvalue);
//         me.fireEvent('dayChanged', me, old, d);
//       };
//     };
//   },


//   SetMonth: function (month)
//   {
//     if (month !== undefined && month !== null && !isNaN(parseInt(month)))
//     {
//       var m = parseInt(month);
//       if (m >= 1 && m <= 12)
//       {
//         var me = this;
//         var old = me.GetMonth();
//         var dt = new Date();
//         dt.setDate(me.GetDay());
//         dt.setMonth(m - 1);
//         dt.setFullYear(me.GetYear());
//         var newvalue = Ext.util.Format.date(dt, me.format);
//         me.setRawValue(newvalue);
//         me.fireEvent('monthChanged', me, old, m);
//       };
//     };
//   },


//   SetYear: function (year)
//   {
//     if (year !== undefined && year !== null && !isNaN(parseInt(year)))
//     {
//       var y = parseInt(year);
//       if (y >= 1800 && y <= 9999)
//       {
//         var me = this;
//         var old = me.GetYear();
//         var dt = new Date();
//         dt.setDate(me.GetDay());
//         dt.setMonth(me.GetMonth() - 1);
//         dt.setFullYear(y);
//         var newvalue = Ext.util.Format.date(dt, me.format);
//         me.setRawValue(newvalue);
//         me.fireEvent('yearChanged', me, old, y);
//       };
//     };
//   },


//   OnDayChanged: function (obj, oldvalue, newvalue)
//   {
//     if (obj)
//     {
//       if (obj.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: obj.itemId });
//       obj.OnAfterPropertyChanged();
//     };
//   },


//   OnMonthChanged: function (obj, oldvalue, newvalue)
//   {
//     if (obj)
//     {
//       if (obj.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: obj.itemId });
//       obj.OnAfterPropertyChanged();
//     };
//   },


//   OnYearChanged: function (obj, oldvalue, newvalue)
//   {
//     if (obj)
//     {
//       if (obj.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: obj.itemId });
//       obj.OnAfterPropertyChanged();
//     };
//   },


//   OnLabelChanged: function (obj, oldvalue, newvalue)
//   {
//     if (obj)
//     {
//       if (obj.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: obj.itemId });
//       obj.OnAfterPropertyChanged();
//     };
//   },


//   OnChange: function ()
//   {
//     var me = this;
//     if (me.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: me.itemId });
//     setTimeout(function ()
//     {
//       me.OnAfterEvent(me.ApiOnChange, me);
//     }, 0);
//   }
// });