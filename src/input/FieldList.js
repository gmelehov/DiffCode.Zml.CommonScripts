

//Ext.define('{{APP_NS}}.input.FieldList', {

//  extend: 'Ext.form.Panel',
//  alias: 'widget.FieldList',


//  layout: 'vbox',
//  width: '100%',
//  height: '100%',
//  flex: 1,
//  overflowY: 'auto',
//  margin: 10,
//  border: 0,
//  bodyBorder: 0,
//  bodyPadding: 10,


//  /** 
//   * Ссылка на объект, управляющий перетаскиванием и реорганизацией 
//   * визуального представления дочерних элементов в пределах 
//   * этого списка.
//   */
//  REORDERER: null,






//  initComponent: function ()
//  {
//    var me = this;
//    me.callParent(arguments);

//    //me.addEvents();
//    me.on({
//      //itemsRemoved: me.OnItemsRemoved,
//      //resultsMetaChanged: me.OnResultsMetaChanged,
//      afterrender: me.OnAfterRender,
//      scope: me
//    });
//  },


//  /** Обработчик события afterrender */
//  OnAfterRender: function ()
//  {
//    var me = this;

//    me.REORDERER = Ext.create('Ext.ux.BoxReorderer', {
//      animate: true,
//      itemSelector: '.field-list-item',
//      listeners: {
//        Drop: function (plug, obj, item, start, end)
//        {
//          obj.OnItemDropped(plug, obj, item, start, end);
//        },
//      }
//    });
//    me.addPlugin(me.REORDERER);
//    me.REORDERER.afterFirstLayout();
//  },


//  OnItemDropped(plug, obj, item, start, end)
//  {

//  },










//  AddNewItem: function ()
//  {
//    var item = Ext.create('{{APP_NS}}.input.FieldContainer', {});
//    this.add(item);
//  },




//});















Ext.define('{{APP_NS}}.input.FieldList', {

  extend: 'Ext.form.FieldContainer',
  alias: 'widget.FieldList',


  mixins: {
    field: 'Ext.form.field.Field'
  },


  layout: 'vbox',
  width: '100%',
  height: '100%',
  flex: 1,
  overflowY: 'auto',
  margin: 10,
  border: 0,
  bodyBorder: 0,
  bodyPadding: 10,

  delimiter: '; ',

  itemSelectors: 'PairedCombo, KeyValueInput',



  /** 
   * Ссылка на объект, управляющий перетаскиванием и реорганизацией 
   * визуального представления дочерних элементов в пределах 
   * этого списка.
   */
  REORDERER: null,



  setValue: function (value)
  {
    var me = this;
    var firstvalue;
    var secondvalue;

    if (!Array.isArray(value))
    {
      var temparray = value ? value.toString().split(me.delimiter) : [];

      me.removeAll();
      temparray.forEach(function (f)
      {
        var item = Ext.create('{{APP_NS}}.input.KeyValue', { cls: 'field-list-item', overCls: 'field-list-item-over' });
        item.setValue(f);
        me.add(item);
        me.relayEvents(item, ['change']);
      });

      me.value = value;
    }
    else
    {
      me.removeAll();
      value.forEach(function (f)
      {
        var item = Ext.create('{{APP_NS}}.input.KeyValue', { cls: 'field-list-item', overCls: 'field-list-item-over' });
        item.setValue(f);
        me.add(item);
        me.relayEvents(item, ['change']);
      });

      me.value = me.getValue();
    };
  },

  getValue: function ()
  {
    var me = this;
    var ret = me.query(me.itemSelectors).map(function (m) { return m.getSubmitValue(); }).join(me.delimiter);
    return ret;
  },

  getSubmitValue: function ()
  {
    return this.getValue();
  },









  initComponent: function ()
  {
    var me = this;
    me.callParent(arguments);

    me.on({
      afterrender: me.OnAfterRender,
      scope: me
    });

    me.initField();
  },


  /** Обработчик события afterrender */
  OnAfterRender: function ()
  {
    var me = this;

    me.REORDERER = Ext.create('Ext.ux.BoxReorderer', {
      animate: true,
      itemSelector: '.field-list-item',
      listeners: {
        Drop: function (plug, obj, item, start, end)
        {
          obj.OnItemDropped(plug, obj, item, start, end);
        },
      }
    });
    me.addPlugin(me.REORDERER);
    me.REORDERER.afterFirstLayout();
  },


  OnItemDropped(plug, obj, item, start, end)
  {
    obj.value = obj.getValue();
  },


  AddValue: function (value)
  {
    var item = Ext.create('{{APP_NS}}.input.KeyValue', { cls: 'field-list-item', overCls: 'field-list-item-over' });
    item.setValue(value);
    this.add(item);
    this.relayEvents(item, ['change']);
    this.value = this.getValue();
  },





  


});