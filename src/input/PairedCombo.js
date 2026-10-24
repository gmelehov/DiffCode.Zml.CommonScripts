/** СОСТАВНОЙ ЭЛЕМЕНТ ВВОДА ДАННЫХ ФОРМАТА "КЛЮЧ: ЗНАЧЕНИЕ" */
Ext.define('ZML.input.PairedCombo', {

  extend: 'Ext.form.FieldContainer',
  alias: 'widget.PairedCombo',

  mixins: {
    field: 'Ext.form.field.Field'
  },

  layout: 'hbox',
  height: 22,
  width: '100%',
  anchor: '100%',
  border: 0,
  bodyBorder: 0,

  /** Комбобокс для ввода ключа */
  ComboItem: null,

  /** Поле ввода значения */
  InputItem: null,

  /** Значимое поле в модели данных комбобокса */
  valueField: null,

  /** Отображаемое поле в модели данных комбобокса */
  displayField: null,

  /** Разрешать пустые значения в поле ввода значения */
  nullableInput: false,

  /** Идентификатор хранилища данных комбобокса */
  SourceId: null,

  /** Разделитель ключа и значения, используемый для построения составного текстового значения этого элемента ввода */
  delimiter: ': ',

  /**
   * Сеттер для свойства value этого элемента ввода.
   * @param {any} value Новое значение для свойства value.
   */
  setValue: function (value)
  {
    var me = this;
    var firstvalue;
    var secondvalue;

    if (!Array.isArray(value))
    {
      var temparray = value ? value.toString().split(me.delimiter) : [null, null];
      firstvalue = temparray[0];
      secondvalue = temparray[1];
    }
    else
    {
      firstvalue = value[0];
      secondvalue = value.length > 1 ? value[1] : null;
    };
    me.ComboItem.defaultValue = firstvalue;
    me.ComboItem.SelectRecordByValue();
    me.InputItem.setValue(secondvalue);
  },


  getValue: function ()
  {
    var cmbvalue = this.ComboItem.getValue();
    var inpvalue = this.InputItem.getSubmitValue();
    var value;

    if (cmbvalue !== null && inpvalue !== null)
    {
      value = cmbvalue + this.delimiter + inpvalue;
    }
    else
    {
      value = null;
    };   

    return value;
  },


  getSubmitValue: function ()
  {
    return this.getValue();
  },


  initComponent: function ()
  {
    var me = this;

    me.ComboItem = Ext.create('Ext.form.field.ComboBox', {
      flex: 1,
      minWidth: 200,
      multiSelect: false,
      editable: true,
      valueField: me.valueField,
      displayField: me.displayField,
      fieldCls: 'x-form-field basecombo',
      enableKeyEvents: true,
      store: me.SourceId,
    });

    me.InputItem = Ext.create('ZML.input.Text', {
      flex: 1,
      margin: '0 0 0 5',
      allowBlank: me.nullableInput,
    });

    me.items = [me.ComboItem, me.InputItem];
    me.callParent(arguments);
    me.initField();
  },



});
