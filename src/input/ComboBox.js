/**
 * КОМБОБОКС
 * @alias ComboBox
 * @manager ZML.ComboMgr
 * @registration initComponent
 * @method GetSelectedValue @property value
 * @method GetTotalCount @property totalCount
 * @method setValue @property value
 * @method getDisplayValue @property displayValue
 * @method getDescriptionValue @property descrValue
 */
Ext.define('ZML.input.ComboBox', {

  extend: 'Ext.form.field.ComboBox',
  alias: 'widget.ComboBox',

  mixins: {
    handleClearIcon: 'ZML.mixin.HandleClearIcon',
    afterEventCallback: 'ZML.mixin.AfterEventCallback'
  },

  forceSelection: true,
  editable: false,
  enableKeyEvents: true,
  minChars: 2,
  queryMode: 'remote',
  flex: 1,
  columnWidth: 1,
  fieldCls: 'x-form-field basecombo',

  defaultValue: null,


  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',

  TEMPLATE: [],


  initComponent: function ()
  {
    var me = this;
    me.callParent(arguments);

    me.addEvents('availableChanged');

    me.on({
      afterrender: me.OnAfterRender,
      change: me.OnChange,
      disable: me.OnDisabled,
      enable: me.OnEnabled,
      availableChanged: me.OnAvailableChanged,
      scope: me
    });

    me.inputElem = 'input';

    GLOBAL[this.AppNAME].Combo.register(me);
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
      //Ext.StoreManager.LoadLinkedStores({ scopeType: 'Combo', scopeId: obj.itemId })

      if ((obj.editable == true && obj.getSubmitValue().length >= obj.minChars) || obj.getSubmitValue().length == 0 || obj.editable == false)
      {
        Ext.StoreManager.LoadLinkedStores({ scopeType: 'Combo', scopeId: obj.itemId });
        obj.OnAfterEvent(obj.ApiOnChange, obj);
      };
    };
  },


  /**
   * Обработчик события disable.
   * @param {any} obj экземпляр комбобокса, сгенерировавшего событие
   */
  OnDisabled: function (obj)
  {
    if (!!obj)
    {
      obj.fireEvent('availableChanged', obj);
    };
  },

  /**
   * Обработчик события enable.
   * @param {any} obj экземпляр комбобокса, сгенерировавшего событие
   */
  OnEnabled: function (obj)
  {
    if (!!obj)
    {
      obj.fireEvent('availableChanged', obj);
    };
  },

  /**
   * 
   * @param {any} obj
   */
  OnAvailableChanged: function (obj)
  {

  },


  GetSelectedValue: function ()
  {
    var ret = this.getValue();
    if (ret == '' || ret == null)
    {
      ret = -1;
    };
    return ret; this.desc
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


  GetSelectedCount: function ()
  {
    return this.lastSelection.length;
  },


  GetTotalCount: function ()
  {
    var me = this;
    if (me.store && me.store.isStore)
    {
      return me.store.getCount();
    };
  },


  getDescriptionValue: function ()
  {
    var me = this;
    if (!!me.descrField && Array.isArray(me.displayTplData))
    {
      return me.displayTplData.map(function (m) { return m[me.descrField] }).join(me.delimiter);
    };
  },

});






// Ext.define('{{APP_NS}}.input.ComboBox', {

//   extend: 'Ext.form.field.ComboBox',
//   alias: 'widget.ComboBox',

//   mixins: {
//     afterEventCallback: '{{APP_NS}}.mixin.AfterEventCallback',
//     formFieldCommons: '{{APP_NS}}.mixin.FormFieldCommons',
//     handleClearIcon: '{{APP_NS}}.mixin.HandleClearIcon'
//   },

//   forceSelection: true,
//   editable: false,
//   enableKeyEvents: true,
//   minChars: 2,
//   queryMode: 'remote',
//   flex: 1,
//   columnWidth: 1,
//   fieldCls: 'x-form-field basecombo',

//   defaultValue: null,




//   TEMPLATE: [],


//   initComponent: function ()
//   {
//     var me = this;
//     me.callParent(arguments);

//     me.on({
//       afterrender: me.OnAfterRender,
//       change: me.OnChange,
//       scope: me
//     });

//     me.inputElem = 'input';
//   },




//   OnAfterRender: function (obj)
//   {
//     if (obj)
//     {
//       if (Array.isArray(obj.TEMPLATE) && obj.TEMPLATE.length)
//       {
//         obj.tpl = new Ext.XTemplate(obj.TEMPLATE);
//       };
      
//       setTimeout(function ()
//       {
//         obj.SelectRecordByValue();
//       }, 300);
//     };
//   },

//   OnChange: function (obj)
//   {
//     if (obj)
//     {
//       obj.updateClearIcon();
//       obj.CountFoundItems();
//       Ext.StoreManager.LoadLinkedStores({ scopeType: 'combo', scopeId: obj.itemId })
//       setTimeout(function ()
//       {
//         obj.OnAfterEvent(obj.ApiOnChange, obj);
//       }, 0);
//     };
//   },



//   GetSelectedValue: function ()
//   {
//     var ret = this.getValue();
//     if (ret == '' || ret == null)
//     {
//       ret = -1;
//     };
//     return ret;
//   },

//   SelectRecordByValue: function ()
//   {
//     var me = this;
//     if (me.store && me.store.isStore)
//     {
//       var record = me.store.findRecord(me.valueField, me.defaultValue);
//       me.select(record);
//     };
//   },

//   CountFoundItems: function ()
//   {
//     var emptytext = '' + this.store.getCount() + ' элем.';
//     this.emptyText = emptytext;
//     this.applyEmptyText();
//   },

//   GetTotalCount: function ()
//   {
//     var me = this;
//     if (me.store && me.store.isStore)
//     {
//       return me.store.getCount();
//     };
//   },


// });