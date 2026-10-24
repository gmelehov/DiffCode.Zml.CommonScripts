/** УНИВЕРСАЛЬНЫЙ КОНТЕЙНЕР ДЛЯ ПОЛЕЙ ВВОДА ДАННЫХ */
Ext.define('ZML.input.FieldContainer', {

  extend: 'Ext.form.FieldContainer',
  alias: 'widget.FieldContainer',

  layout: 'hbox',
  cls: 'field-list-item',
  overCls: 'field-list-item-over',
  height: 22,
  width: '100%',
  anchor: '100%',
  border: 0,
  bodyBorder: 0,

  config: {
    /** Составное текстовое значение этого элемента ввода */
    value: null,
    /** Разделитель ключа и значения, используемый для построения составного текстового значения этого элемента ввода */
    delimiter: '; ',
    /** Состояние валидности этого элемента ввода */
    valid: null,
  },

  /**
   * Сеттер для свойства value этого элемента ввода.
   * При обновлении свойства генерирует событие changed.
   * @param {any} value Новое значение для свойства value.
   */
  setValue: function (value)
  {
    var oldvalue = this.getValue();
    this.value = value;
    if (oldvalue != value)
    {
      this.fireEvent('changed', this, oldvalue, value);
    };
  },

  /**
   * Сеттер для свойства delimiter этого элемента ввода.
   * При обновлении свойства генерирует событие delimChanged.
   * @param {any} value Новое значение для свойства delimiter.
   */
  setDelimiter: function (value)
  {
    var oldvalue = this.getDelimiter();
    this.delimiter = value;
    if (oldvalue != value)
    {
      this.fireEvent('delimChanged', this, oldvalue, value);
    };
  },

  /**
   * Сеттер для свойства valid этого элемента ввода.
   * При обновлении свойства генерирует событие validChanged.
   * @param {any} value Новое значение для свойства valid.
   */
  setValid: function (value)
  {
    if (this.query('field').every(function (ev) { return ev.isValid(); }) === value)
    {
      var oldvalue = this.getValid();
      this.valid = value;
      if (oldvalue != value)
      {
        this.fireEvent('validChanged', this, oldvalue, value);
      }
      else
      {
        this.ComputeOwnValue();
      };
    };
  },


  initComponent: function ()
  {
    var me = this;
    me.callParent(arguments);
    me.addEvents('changed', 'delimChanged', 'validChanged');
    me.on({
      add: me.OnAdd,
      validChanged: me.OnValidChanged,
      delimChanged: me.OnDelimChanged,
      changed: me.OnChanged,
      afterrender: me.OnAfterRender,
      scope: me
    });
  },

  /**
   * Обработчик события add,
   * генерируемого при добавлении нового поля ввода данных в этот контейнер.
   * @param {any} obj Контейнер.
   * @param {any} item Добавленное поле ввода данных.
   * @param {any} index Индекс добавленного поля ввода данных.
   */
  OnAdd: function (obj, item, index)
  {
    if (item && item.is('field'))
    {
      //if (index > 0)
      //{
      //  obj.suspendEvents();
      //  obj.insert(index, { xtype: 'splitter' });
      //  obj.resumeEvents();
      //};

      item.FieldCont = obj;
      item.flex = 1;

      item.on('change', function (it)
      {
        it.FieldCont.ComputeOwnValid();
      })
    };
  },

  /**
   * Обработчик события afterrender.
   * @param {any} obj
   */
  OnAfterRender: function (obj)
  {
    
  },

  /**
   * Обработчик события validChanged, 
   * генерируемого при изменении свойства valid этого элемента ввода.
   * @param {any} obj
   * @param {any} oldvalue
   * @param {any} newvalue
   */
  OnValidChanged: function (obj, oldvalue, newvalue)
  {
    obj.ComputeOwnValue();
  },

  /**
   * Обработчик события delimChanged, 
   * генерируемого при изменении свойства delimiter этого элемента ввода.
   * @param {any} obj
   * @param {any} oldvalue
   * @param {any} newvalue
   */
  OnDelimChanged: function (obj, oldvalue, newvalue)
  {
    obj.ComputeOwnValue();
  },

  /**
   * Обработчик события changed,
   * генерируемого при изменении составного текстового значения этого элемента ввода.
   * @param {any} obj
   * @param {any} oldvalue
   * @param {any} newvalue
   */
  OnChanged: function (obj, oldvalue, newvalue)
  {
    console.dir(newvalue);
  },


  ComputeOwnValid: function ()
  {
    var valids = this.query('field').every(function (ev) { return ev.isValid(); });
    this.setValid(valids);
  },


  ComputeOwnValue: function ()
  {
    var me = this;

    if (me.valid === true)
    {
      var joinedvalue = me.query('field').map(function (m) { return m.getValue() }).join(me.getDelimiter());
      me.setValue(joinedvalue);
    }
    else
    {
      me.setValue(null);
    };
  },


  /**
   * Устанавливает указанные значения в поля этого элемента ввода.
   * @param {[] | String} values Массив значений либо строка с разделителем, равным свойству delimiter этого элемента.
   */
  SetOwnItemsValues: function (values)
  {
    var me = this;
    var items = me.query('field');
    var temparray = [];

    if (!Array.isArray(values))
    {
      temparray = values ? values.toString().split(me.delimiter) : items.map(function (i) { return null; });
    }
    else
    {
      temparray = [].concat(values);
    };
    var templen = temparray.length;
    items.forEach(function (f, i)
    {
      f.setValue(i <= (templen - 1) ? temparray[i] : null);
    });
  },


});