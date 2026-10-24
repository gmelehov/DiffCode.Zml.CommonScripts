Ext.define('ZML.input.CheckList', {

  extend: 'Ext.form.FieldContainer',
  alias: 'widget.CheckList',

  mixins: {
    field: 'Ext.form.field.Field',
    bindable: 'Ext.util.Bindable',
    afterEventCallback: 'ZML.mixin.AfterEventCallback',
    formFieldCommons: 'ZML.mixin.FormFieldCommons'
  },

  autoSync: false,

  layout: 'vbox',
  width: '100%',
  height: '100%',
  flex: 1,
  overflowY: 'auto',
  padding: 5,

  store: null,
  digits: [],
  maxValue: 0,

  config: {

    src: null,
    valueAs: 'int',
    idField: null,
    nameField: null,
    displayField: null,
    descrField: null,
    valueField: null,
    activeField: null,
  },
  

  listeners: {
    change: function ()
    {
      var me = this;
      me.OnChange();
    },
    disable: function (obj)
    {
      obj.disableAllItems();
    },
    enable: function (obj)
    {
      obj.enableAllItems();
    }
  },



  initComponent: function (config)
  {
    var me = this;
    config = config || {};
    me.initConfig(config);
    me.callParent(arguments);

    me.addEvents('created', 'storeAdded', 'selectionChanged');
    me.on({
      created: me.OnCreated,
      storeAdded: me.OnStoreAdded,
      selectionChanged: me.OnSelectionChanged,
      afterrender: me.OnAfterRender,
      scope: me
    });

    me.initField();
    me.fireEvent('created', me);
  },



  OnCreated: function (obj)
  {
    if (obj && obj.src)
    {
      Ext.getStore(obj.src).on('load', function (st)
      {
        obj.composeFromStore();
      });
      obj.bindStore(Ext.getStore(obj.src));
    };
  },


  OnAfterRender: function (obj)
  {
    if (obj && obj.src && !obj.store)
    {
      obj.fireEvent('storeAdded', obj);
    };
  },


  OnStoreAdded: function (obj)
  {
    obj.composeFromStore();
    if (obj.isDisabled())
    {
      obj.disableAllItems();
    };
  },


  OnSelectionChanged: function (obj)
  {

  },


  OnAfterStoreLoad: function (obj)
  {

  },


  OnChange: function ()
  {
    var me = this;
    if (me.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'CheckList', scopeId: me.itemId });
    setTimeout(function ()
    {
      me.OnAfterEvent(me.ApiOnChange, me);
    }, 0);
  },


  AddStore: function ()
  {
    var me = this;
    if (!me.store)
    {
      var modelname = me.itemId + '-DataModel';
      var fields = [
        { name: me.idField, type: 'auto' },
        { name: me.nameField, type: 'string' },
        { name: me.displayField, type: 'string' },
        { name: me.descrField, type: 'string' },
        { name: me.valueField, type: 'int' },
        { name: me.activeField, type: 'boolean' }
      ].filter(function (f) { return f.name; });

      Ext.define(modelname, {
        extend: 'Ext.data.Model',
        idProperty: me.idField,
        fields: fields
      });

      me.store = Ext.create('Ext.data.Store', {
        model: modelname,

      })
    };
  },


  findById: function (id)
  {
    return this.query('CheckItem[citemId=' + id + ']')[0];
  },


  changeItemActive: function (id, status)
  {
    var item = this.findById(id);
    if (item)
    {
      item.CHECK.setValue(!!status);
      item.setCitemActive(!!status);
    };
  },


  disableAllItems: function ()
  {
    var me = this;
    me.query('CheckItem').forEach(function (f) { if (f.CHECK) f.CHECK.setDisabled(true); });
  },


  enableAllItems: function ()
  {
    var me = this;
    me.query('CheckItem').forEach(function (f) { if (f.CHECK) f.CHECK.setDisabled(false); });
  },


  resetItems: function ()
  {
    var me = this;
    me.items.items.forEach(function (f) { f.CHECK.setValue(false); f.setCitemActive(false); });

    me.fireEvent('change');
  },


  computeValue: function (item)
  {
    var me = this;

    switch (me.valueAs)
    {
      case 'int':
        me.setValue(me.query('CheckItem').map(function (m) { return m.citemValue * (m.citemActive ? 1 : 0); }).reduce(function (s, c) { return s + c }, 0));
        break;

      case 'ints':
        me.setValue(me.query('CheckItem').filter(function (f) { return f.citemActive; }).map(function (m) { return m.citemId }).join(';'));
        break;

      case 'strings':
        me.setValue(me.query('CheckItem').filter(function (f) { return f.citemActive; }).map(function (m) { return (m.citemName || m.citemDisplay) }).join(';'));
        break;


      default:
        me.setValue(me.query('CheckItem').map(function (m) { return m.citemValue * (m.citemActive ? 1 : 0); }).reduce(function (s, c) { return s + c }, 0));
        break;
    };

    if (item && me.store)
    {
      var itemid = item.citemId;
      var active = item.citemActive;
      me.store.getById(itemid).set(me.activeField, active);
    };

    me.fireEvent('change');
  },


  computeMaxValue: function ()
  {
    var me = this;
    var countdigits = me.digits.length || me.store ? me.store.totalCount : 0;
    me.maxValue = parseInt(''.padEnd(countdigits, '1'), 2);
  },


  composeNewItems: function (value)
  {
    var me = this;
    value = value || '0';
    var binvalue = value.toString(2);
    var maxpow = binvalue.length - 1;
    me.digits = binvalue.split('').reverse();
    me.removeAll();
    var arr = me.digits.map(function (m, i)
    {
      var ret = Ext.create('ZML.input.CheckItem', {
        itemId: 'citem' + i,
        citemId: 'citem' + i,
        citemName: 'CheckItem' + i,
        citemDisplay: 'Check Item ' + i,
        citemDescr: 'Это - Check item ' + i + '.',
        citemValue: Math.pow(2, i),
        citemActive: m != '0'
      });
      return ret;
    });
    me.add(arr);

    me.fireEvent('change');
  },


  composeFromStore: function ()
  {
    var me = this;
    me.removeAll();
    var arr = me.store.data.items.map(function (m, i)
    {
      var ret = Ext.create('ZML.input.CheckItem', {
        itemId: 'citem' + i,
        citemId: m.get(me.idField),
        citemName: m.get(me.nameField),
        citemDisplay: m.get(me.displayField),
        citemDescr: m.get(me.descrField),
        citemValue: m.get(me.valueField),
        citemActive: m.get(me.activeField)
      });
      return ret;
    });
    me.add(arr);

    var val = me.query('CheckItem').map(function (m) { return m.citemValue * (m.citemActive ? 1 : 0); }).reduce(function (s, c) { return s + c }, 0);
    me.value = val;

    if (me.isDisabled())
    {
      me.disableAllItems();
    };

    me.fireEvent('change');
  },


  SetMyValueAsInt: function (value)
  {
    var me = this;
    me.computeMaxValue();

    if (me.maxValue >= value)
    {
      me.resetItems();
      var binvalue = value.toString(2);
      var maxpow = binvalue.length - 1;
      var digits = binvalue.split('').reverse();
      digits.forEach(function (f, i)
      {
        var it = me.items.items[i];
        it.CHECK.setValue(f != '0');
        it.setCitemActive(f != '0');
      });
    }
    else
    {
      me.composeNewItems(value);
    };
  },


  SetMyValueAsInts: function (value)
  {
    var me = this;
    me.resetItems();
    if (value !== undefined && value !== null)
    {
      var intsArray = value.split(';').map(function (m) { return +m; });
      intsArray.forEach(function (f)
      {
        me.changeItemActive(f, true);
      });
    };
  },


  setValue: function (value)
  {
    if (this.valueAs === 'int')
    {
      this.SetMyValueAsInt(value);
    }
    else if (this.valueAs === 'ints')
    {
      this.SetMyValueAsInts(value);
    };

    this.value = value;
    this.fireEvent('change');
  },


  getValue: function ()
  {
    var me = this;

    switch (me.valueAs)
    {
      case 'int':
        return this.query('CheckItem').map(function (m) { return m.citemValue * (m.citemActive ? 1 : 0); }).reduce(function (s, c) { return s + c }, 0);

      case 'ints':
        return this.query('CheckItem').filter(function (f) { return f.citemActive; }).map(function (m) { return m.citemId }).join(';');

      case 'strings':
        return this.query('CheckItem').filter(function (f) { return f.citemActive; }).map(function (m) { return (m.citemName || m.citemDisplay) }).join(';');


      default:
        return this.query('CheckItem').map(function (m) { return m.citemValue * (m.citemActive ? 1 : 0); }).reduce(function (s, c) { return s + c }, 0);
        break;

    };
  },


  getSubmitValue: function ()
  {
    return this.getValue();
  },


});