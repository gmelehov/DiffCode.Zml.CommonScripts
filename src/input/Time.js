/**
 * ПОЛЕ ВВОДА ВРЕМЕНИ
 * @alias TimeField
 * @manager ZML.InputMgr
 * @registration initComponent
 * @method getValue @property value
 * @method GetHours @property hours
 * @method GetMinutes @property minutes
 * @method GetSeconds @property seconds
 * @method setValue @property value
 * @method SetHours @property hours
 * @method SetMinutes @property minutes
 * @method SetSeconds @property seconds
 */
Ext.define('ZML.input.Time', {

  extend: 'Ext.form.field.Time',
  alias: 'widget.TimeField',

  mixins: {
    afterEventCallback: 'ZML.mixin.AfterEventCallback',
    formFieldCommons: 'ZML.mixin.FormFieldCommons'
  },

  format: 'H:i',
  submitFormat: 'H:i',
  autoSync: false,

  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',


  initComponent: function ()
  {
    var me = this;
    this.callParent(arguments);
    me.addEvents('formatChanged', 'hoursChanged', 'minutesChanged', 'secondsChanged');
    me.on({
      formatChanged: me.OnFormatChanged,
      hoursChanged: me.OnHoursChanged,
      minutesChanged: me.OnMinutesChanged,
      secondsChanged: me.OnSecondsChanged,
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


  GetHours: function ()
  {
    var me = this;
    return me.getValue().getHours();
  },


  GetMinutes: function ()
  {
    var me = this;
    return me.getValue().getMinutes();
  },


  GetSeconds: function ()
  {
    var me = this;
    return me.getValue().getSeconds();
  },


  SetHours: function (hours)
  {
    if (hours !== undefined && hours !== null && !isNaN(parseInt(hours)))
    {
      var hrs = parseInt(hours);
      if (hrs >= 0 && hrs <= 23)
      {
        var me = this;
        var old = me.GetHours();
        var dt = new Date();
        dt.setHours(hrs);
        dt.setMinutes(me.GetMinutes());
        dt.setSeconds(me.GetSeconds());
        var newvalue = Ext.util.Format.date(dt, me.format);
        me.setRawValue(newvalue);
        me.fireEvent('hoursChanged', me, old, hrs);
      };
    };
  },


  SetMinutes: function (minutes)
  {
    if (minutes !== undefined && minutes !== null && !isNaN(parseInt(minutes)))
    {
      var mins = parseInt(minutes);
      if (mins >= 0 && mins <= 59)
      {
        var me = this;
        var old = me.GetMinutes();
        var dt = new Date();
        dt.setHours(me.GetHours());
        dt.setMinutes(mins);
        dt.setSeconds(me.GetSeconds());
        var newvalue = Ext.util.Format.date(dt, me.format);
        me.setRawValue(newvalue);
        me.fireEvent('minutesChanged', me, old, mins);
      };
    };
  },


  SetSeconds: function (seconds)
  {
    if (seconds !== undefined && seconds !== null && !isNaN(parseInt(seconds)))
    {
      var secs = parseInt(seconds);
      if (secs >= 0 && secs <= 59)
      {
        var me = this;
        var old = me.GetSeconds();
        var dt = new Date();
        dt.setHours(me.GetHours());
        dt.setMinutes(me.GetMinutes());
        dt.setSeconds(secs);
        var newvalue = Ext.util.Format.date(dt, me.format);
        me.setRawValue(newvalue);
        me.fireEvent('secondsChanged', me, old, secs);
      };
    };
  },


  OnHoursChanged: function (obj, oldvalue, newvalue)
  {
    if (obj)
    {
      if (obj.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: obj.itemId });
      obj.OnAfterPropertyChanged();
    };
  },


  OnMinutesChanged: function (obj, oldvalue, newvalue)
  {
    if (obj)
    {
      if (obj.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: obj.itemId });
      obj.OnAfterPropertyChanged();
    };
  },


  OnSecondsChanged: function (obj, oldvalue, newvalue)
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





// Ext.define('{{APP_NS}}.input.Time', {

//   extend: 'Ext.form.field.Time',
//   alias: 'widget.TimeField',

//   mixins: {
//     afterEventCallback: '{{APP_NS}}.mixin.AfterEventCallback',
//     formFieldCommons: '{{APP_NS}}.mixin.FormFieldCommons'
//   },

//   format: 'H:i',
//   submitFormat: 'H:i',
//   autoSync: false,


//   initComponent: function ()
//   {
//     var me = this;
//     this.callParent(arguments);
//     me.addEvents('formatChanged', 'hoursChanged', 'minutesChanged', 'secondsChanged');
//     me.on({
//       formatChanged: me.OnFormatChanged,
//       hoursChanged: me.OnHoursChanged,
//       minutesChanged: me.OnMinutesChanged,
//       secondsChanged: me.OnSecondsChanged,
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


//   GetHours: function ()
//   {
//     var me = this;
//     return me.getValue().getHours();
//   },


//   GetMinutes: function ()
//   {
//     var me = this;
//     return me.getValue().getMinutes();
//   },


//   GetSeconds: function ()
//   {
//     var me = this;
//     return me.getValue().getSeconds();
//   },


//   SetHours: function (hours)
//   {
//     if (hours !== undefined && hours !== null && !isNaN(parseInt(hours)))
//     {
//       var hrs = parseInt(hours);
//       if (hrs >= 0 && hrs <= 23)
//       {
//         var me = this;
//         var old = me.GetHours();
//         var dt = new Date();
//         dt.setHours(hrs);
//         dt.setMinutes(me.GetMinutes());
//         dt.setSeconds(me.GetSeconds());
//         var newvalue = Ext.util.Format.date(dt, me.format);
//         me.setRawValue(newvalue);
//         me.fireEvent('hoursChanged', me, old, hrs);
//       };
//     };
//   },


//   SetMinutes: function (minutes)
//   {
//     if (minutes !== undefined && minutes !== null && !isNaN(parseInt(minutes)))
//     {
//       var mins = parseInt(minutes);
//       if (mins >= 0 && mins <= 59)
//       {
//         var me = this;
//         var old = me.GetMinutes();
//         var dt = new Date();
//         dt.setHours(me.GetHours());
//         dt.setMinutes(mins);
//         dt.setSeconds(me.GetSeconds());
//         var newvalue = Ext.util.Format.date(dt, me.format);
//         me.setRawValue(newvalue);
//         me.fireEvent('minutesChanged', me, old, mins);
//       };
//     };
//   },


//   SetSeconds: function (seconds)
//   {
//     if (seconds !== undefined && seconds !== null && !isNaN(parseInt(seconds)))
//     {
//       var secs = parseInt(seconds);
//       if (secs >= 0 && secs <= 59)
//       {
//         var me = this;
//         var old = me.GetSeconds();
//         var dt = new Date();
//         dt.setHours(me.GetHours());
//         dt.setMinutes(me.GetMinutes());
//         dt.setSeconds(secs);
//         var newvalue = Ext.util.Format.date(dt, me.format);
//         me.setRawValue(newvalue);
//         me.fireEvent('secondsChanged', me, old, secs);
//       };
//     };
//   },


//   OnHoursChanged: function (obj, oldvalue, newvalue)
//   {
//     if (obj)
//     {
//       if (obj.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: obj.itemId });
//       obj.OnAfterPropertyChanged();
//     };
//   },


//   OnMinutesChanged: function (obj, oldvalue, newvalue)
//   {
//     if (obj)
//     {
//       if (obj.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: obj.itemId });
//       obj.OnAfterPropertyChanged();
//     };
//   },


//   OnSecondsChanged: function (obj, oldvalue, newvalue)
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