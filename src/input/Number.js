/**
 * ПОЛЕ ВВОДА ЧИСЕЛ
 * @alias NumberField
 * @manager ZML.InputMgr
 * @registration initComponent
 * 
 * @method getValue @property value
 * @method setValue @property value
 * @method GetStep @property step
 * @method SetStep @property step
 * @method GetMinValue @property minValue
 * @method setMinValue @property minValue
 * @method GetMaxValue @property maxValue
 * @method setMaxValue @property maxValue
 */
Ext.define('ZML.input.Number', {

  extend: 'Ext.form.field.Number',
  alias: 'widget.NumberField',

  mixins: {
    afterEventCallback: 'ZML.mixin.AfterEventCallback',
    formFieldCommons: 'ZML.mixin.FormFieldCommons'
  },

  validateOnChange: true,
  autoSync: false,

  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',


  initComponent: function ()
  {
    var me = this;
    this.callParent(arguments);
    me.addEvents('formatChanged');
    me.on({
      formatChanged: me.OnFormatChanged,
      validitychange: me.OnValiditychange,
      writeablechange: me.OnWriteablechange,
      scope: me
    });

    GLOBAL[this.AppNAME].Input.register(me);
  },


  listeners: {
    change: function (obj, newvalue, oldvalue)
    {
      var me = this;
      if (me.minValue !== undefined && me.minValue !== null && newvalue < me.minValue)
      {
        me.setValue(me.minValue);
      };
      if (me.maxValue !== undefined && me.maxValue !== null && newvalue > me.maxValue)
      {
        me.setValue(me.maxValue);
      };
      me.OnChange();
    }
  },


  clearField: function ()
  {
    this.setValue(null);
  },


  GetMinValue: function ()
  {
    return this.minValue;
  },


  GetMaxValue: function ()
  {
    return this.maxValue;
  },


  GetStep: function ()
  {
    return this.step;
  },


  SetStep: function (value)
  {
    this.step = value;
  },


  OnAfterPropertyChanged: function ()
  {
    var me = this;
    if (me.isValid())
    {
      if (me.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'Input', scopeId: me.itemId });
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






// Ext.define('{{APP_NS}}.input.Number', {

//   extend: 'Ext.form.field.Number',
//   alias: 'widget.NumberField',

//   mixins: {
//     afterEventCallback: '{{APP_NS}}.mixin.AfterEventCallback',
//     formFieldCommons: '{{APP_NS}}.mixin.FormFieldCommons'
//   },

//   validateOnChange: true,
//   autoSync: false,


//   initComponent: function ()
//   {
//     var me = this;
//     this.callParent(arguments);
//     me.addEvents('formatChanged');
//     me.on({
//       formatChanged: me.OnFormatChanged,
//       validitychange: me.OnValiditychange,
//       writeablechange: me.OnWriteablechange,
//       scope: me
//     });
//   },

//   listeners: {
//     change: function (obj, newvalue, oldvalue)
//     {
//       var me = this;
//       if (me.minValue !== undefined && me.minValue !== null && newvalue < me.minValue)
//       {
//         me.setValue(me.minValue);
//       };
//       if (me.maxValue !== undefined && me.maxValue !== null && newvalue > me.maxValue)
//       {
//         me.setValue(me.maxValue);
//       };
//       me.OnChange();
//     }
//   },


//   clearField: function ()
//   {
//     this.setValue(null);
//   },


//   SetStep: function (value)
//   {
//     this.step = value;
//   },


//   OnAfterPropertyChanged: function ()
//   {
//     var me = this;
//     if (me.isValid())
//     {
//       if (me.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: me.itemId });
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