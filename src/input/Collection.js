/**
 * ЭЛЕМЕНТ ДЛЯ РЕДАКТИРОВАНИЯ СПИСКА ЗНАЧЕНИЙ
 * @alias Collection
 * @manager ZML.InputMgr
 * @registration initComponent
 * 
 */
Ext.define('ZML.input.Collection', {

  extend: 'Ext.form.FieldSet',
  alias: 'widget.Collection',

  mixins: {
    afterEventCallback: 'ZML.mixin.AfterEventCallback',
    formFieldCommons: 'ZML.mixin.FormFieldCommons'
  },

  layout: 'vbox',
  width: '100%',
  height: '100%',
  flex: 1,
  overflowY: 'auto',
  border: 0,
  padding: 5,

  /**
   * Тип элементов списка.
   * @type {'text'|'number'|'date'|'keyvalue'}
   */
  itemsType: 'text',

  /** Разделитель элементов списка (для текстового представления списка) */
  itemsDelimiter: '; ',

  /** Разделитель для элементов списка типа "ключ: значение" */
  kvDelimiter: ': ',

  /** Отображать индексы элементов списка */
  showIndices: false,

  uniqueItems: true,
  allowEmpty: false,
  autoSync: false,
  useSubmitValues: true,

  /**
   * Представление данных, содержащихся в коллекции.
   * @type {'string'|'array'|'object'}
   */
  submitAs: 'array',

  value: null,

  AppNAME: 'APP',



  listeners: {
    afterrender: function ()
    {
      var me = this;
      me.REORDERER = Ext.create('Ext.ux.BoxReorderer', {
        animate: false,
        itemSelector: '.logx-expr-group',
        listeners: {
          Drop: function (plug, obj, item, start, end)
          {
            obj.OnItemDropped(plug, obj, item, start, end);
          },
        }
      });
      me.addPlugin(me.REORDERER);
      me.REORDERER.afterFirstLayout();

      me.AddNewElement();
    },
    change: function ()
    {
      this.SetSelfValue();
      this.OnChange();
    }
  },


  initComponent: function ()
  {
    var me = this;
    me.callParent(arguments);

    GLOBAL[this.AppNAME].Input.register(me);
  },


  getValue: function ()
  {
    return this.value;
  },

  getSubmitValue: function ()
  {
    return this.getValue();
  },


  GetElementClass: function ()
  {
    switch (this.itemsType)
    {
      case 'text': return 'ZML.input.Text';
      case 'number': return 'ZML.input.Number';
      case 'date': return 'ZML.input.Date';
      case 'keyvalue': return 'ZML.input.KeyValue';

      default: return 'ZML.input.Text';
    };
  },


  CreateNewElement: function ()
  {
    var me = this;
    var elemClass = me.GetElementClass();
    var ret = Ext.create(elemClass, {
      Parent: me,
      fieldLabel: me.fieldLabel,
      itemId: me.itemId + '-Editor',
      labelWidth: me.labelWidth,
      columnWidth: 1,
      margin: '0 6 0 0',
      submitValue: false,
      delimiter: me.kvDelimiter,
    });
    return ret;
  },


  CreateContainer: function ()
  {
    var me = this;
    var elem = me.CreateNewElement();
    var cont = Ext.create('ZML.input.Wrapper', {
      HOST: me,
      INPUT: elem,
    });

    return cont;
  },


  AddNewElement: function (afterIndex)
  {
    var me = this;

    if (+afterIndex < 0)
    {
      afterIndex = 0;
    };
    if (+afterIndex > me.GetElementsCount())
    {
      afterIndex = me.GetElementsCount();
    };

    var item = me.CreateContainer();
    me.insert(afterIndex + 1, item);
    me.updateLayout();

    me.relayEvents(item.INPUT, ['change']);

    me.RefreshElementDelButtons();

    me.CalculateIndices();
  },


  DeleteElement: function (element)
  {
    this.remove(element);
    this.RefreshElementDelButtons();
    this.CalculateIndices();
  },


  DeleteElementByIndex: function (index)
  {
    var element = this.GetElementByIndex(index);
    if (!!element)
    {
      this.DeleteElement(element);
    };
  },


  CalculateIndices: function ()
  {
    var me = this;
    me.query('InputWrapper').forEach(function (f, i)
    {
      f.setIndex(i);
    });
  },


  RefreshElementDelButtons: function ()
  {
    var amount = this.GetElementsCount();
    if (amount < 2)
    {
      if (!!this.GetElementByIndex(0).DelBtn) this.GetElementByIndex(0).DelBtn.setDisabled(true);
    }
    else
    {
      this.query('InputWrapper').filter(function (f) { return f.DelBtn.disabled === true }).forEach(function (el) { el.DelBtn.setDisabled(false) });
    };
  },


  GetElementValues: function ()
  {
    var me = this;
    var temp = this.query('InputWrapper').map(function (m) { return m.INPUT });
    switch (me.submitAs)
    {
      case 'string':
        return temp.map(function (mm) { return me.useSubmitValues ? mm.getSubmitValue() : mm.getValue() }).filter(function (f) { return !!f }).join(me.itemsDelimiter);


      case 'array':
        if (me.itemsType === 'keyvalue')
        {
          return temp.filter(function (f) { return !!f.GetKeyPart() }).map(function (mm) { var obj = {}; obj[mm.GetKeyPart()] = mm.GetValuePart(); return obj; });
        }
        else
        {
          return temp.map(function (mm) { return me.useSubmitValues ? mm.getSubmitValue() : mm.getValue() }).filter(function (f) { return !!f });
        };


      case 'object':
        if (me.itemsType === 'keyvalue')
        {
          var obj = {};
          temp.forEach(function (f)
          {
            var tempObj = {};
            var key = f.GetKeyPart();
            if (!!key)
            {
              tempObj[key] = f.GetValuePart();
            };
            Ext.apply(obj, tempObj);
          });
          return obj;
        }
        else
        {
          return temp.map(function (mm) { return me.useSubmitValues ? mm.getSubmitValue() : mm.getValue() });
        };



      default: return temp.map(function (mm) { return me.useSubmitValues ? mm.getSubmitValue() : mm.getValue() });
    };
  },


  GetElementsCount: function ()
  {
    return this.query('InputWrapper').length;
  },


  GetElementByIndex: function (index)
  {
    if (index > -1 && index < this.GetElementsCount())
    {
      return this.query('InputWrapper')[index];
    }
    else
    {
      return null;
    }
  },


  SetSelfValue: function ()
  {
    this.value = this.GetElementValues();
  },


  OnChange: function ()
  {
    var me = this;
    if (me.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'Input', scopeId: me.itemId });
    me.OnAfterEvent(me.ApiOnChange, me);
  },


  OnItemDropped: function (plug, obj, item, start, end)
  {
    setTimeout(() => obj.CalculateIndices(), 100);
  },

});
