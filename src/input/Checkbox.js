/**
 * ЧЕКБОКС
 * @alias Checkbox
 * @manager ZML.InputMgr
 * @registration initComponent
 * @method getValue @property value
 * @method setValue @property value
 */
Ext.define('ZML.input.Checkbox', {

  extend: 'Ext.form.field.Checkbox',
  alias: 'widget.Checkbox',

  mixins: {
    afterEventCallback: 'ZML.mixin.AfterEventCallback',
    formFieldCommons: 'ZML.mixin.FormFieldCommons'
  },

  autoSync: false,

  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',


  initComponent: function ()
  {
    var me = this;
    this.callParent(arguments);
    me.on({
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



// Ext.define('{{APP_NS}}.input.Checkbox', {

//   extend: 'Ext.form.field.Checkbox',
//   alias: 'widget.Checkbox',

//   mixins: {
//     afterEventCallback: '{{APP_NS}}.mixin.AfterEventCallback',
//     formFieldCommons: '{{APP_NS}}.mixin.FormFieldCommons'
//   },

//   autoSync: false,


//   initComponent: function ()
//   {
//     var me = this;
//     this.callParent(arguments);
//     me.on({
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