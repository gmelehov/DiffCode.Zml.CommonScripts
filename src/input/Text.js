/**
 * ПОЛЕ ВВОДА ТЕКСТА
 * @alias TextField
 * @manager ZML.InputMgr
 * @registration initComponent
 * @method getValue @property value
 * @method setValue @property value
 */
Ext.define('ZML.input.Text', {

  extend: 'Ext.form.field.Text',
  alias: 'widget.TextField',

  mixins: {
    afterEventCallback: 'ZML.mixin.AfterEventCallback',
    processQuotes: 'ZML.mixin.ProcessQuotes',
    formFieldCommons: 'ZML.mixin.FormFieldCommons',
    handleClearIcon: 'ZML.mixin.HandleClearIcon'
  },

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
    me.inputElem = 'input';

    GLOBAL[this.AppNAME].Input.register(me);
  },

  listeners: {
    change: function ()
    {
      var me = this;
      if (me.convertQuotes === true && me.CountQuotes() > 0)
      {
        me.ReplaceQuotes();
      };
      me.OnChange();
    }
  },


  OnLabelChanged: function (obj, oldvalue, newvalue)
  {
    if (obj)
    {
      obj.scope.OnAfterPropertyChanged();
    };
  },


  OnChange: function ()
  {
    var me = this;
    me.updateClearIcon();
    if (me.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'Input', scopeId: me.itemId });
    me.OnAfterEvent(me.ApiOnChange, me);
    //setTimeout(function ()
    //{
    //  me.OnAfterEvent(me.ApiOnChange, me);
    //}, 0);
  }
});






// Ext.define('{{APP_NS}}.input.Text', {

//   extend: 'Ext.form.field.Text',
//   alias: 'widget.TextField',

//   mixins: {
//     afterEventCallback: '{{APP_NS}}.mixin.AfterEventCallback',
//     processQuotes: '{{APP_NS}}.mixin.ProcessQuotes',
//     formFieldCommons: '{{APP_NS}}.mixin.FormFieldCommons',
//     handleClearIcon: '{{APP_NS}}.mixin.HandleClearIcon'
//   },


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
//     me.inputElem = 'input';
//   },

//   listeners: {
//     change: function ()
//     {
//       var me = this;
//       if (me.convertQuotes === true && me.CountQuotes() > 0)
//       {
//         me.ReplaceQuotes();
//       };
//       me.OnChange();
//     }
//   },


//   OnLabelChanged: function (obj, oldvalue, newvalue)
//   {
//     if (obj)
//     {
//       obj.scope.OnAfterPropertyChanged();
//     };
//   },


//   OnChange: function ()
//   {
//     var me = this;
//     me.updateClearIcon();
//     if (me.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'input', scopeId: me.itemId });
//     setTimeout(function ()
//     {
//       me.OnAfterEvent(me.ApiOnChange, me);
//     }, 0);
//   }
// });