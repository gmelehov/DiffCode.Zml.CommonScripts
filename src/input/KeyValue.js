/**
 * СОСТАВНОЙ ЭЛЕМЕНТ ВВОДА ДАННЫХ ФОРМАТА "КЛЮЧ: ЗНАЧЕНИЕ"
 * @alias KeyValueInput
 * @manager ZML.InputMgr
 * @registration initComponent
 */
Ext.define('ZML.input.KeyValue', {

  extend: 'Ext.form.FieldContainer',
  alias: 'widget.KeyValueInput',

  mixins: {
    field: 'Ext.form.field.Field',
    afterEventCallback: 'ZML.mixin.AfterEventCallback',
    formFieldCommons: 'ZML.mixin.FormFieldCommons'
  },

  layout: 'hbox',
  width: '100%',
  anchor: '100%',
  border: 0,
  bodyBorder: 0,
  autoSync: false,

  /** Поле ввода ключа */
  KeyInput: null,

  /** Поле ввода значения */
  ValueInput: null,

  /** Разрешать пустые значения в поле ввода значения */
  allowBlank: true,

  /** Разделитель ключа и значения, используемый для построения составного текстового значения этого элемента ввода */
  delimiter: ': ',

  /**
   * Тип данных для поля ввода значения (text|number|date|time)
   * @type {'text'|'number'|'date'|'time'}
   */
  valueType: 'text',

  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',


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

    me.KeyInput.setValue(firstvalue);
    me.ValueInput.setValue(secondvalue);

  },


  getValue: function ()
  {
    var cmbvalue = this.KeyInput.getSubmitValue();
    var inpvalue = this.ValueInput.getSubmitValue();
    var value;

    if (cmbvalue && inpvalue)
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


  listeners: {
    change: function ()
    {
      var me = this;
      var cmbvalue = me.KeyInput.getSubmitValue();
      var inpvalue = me.ValueInput.getSubmitValue();

      if (cmbvalue && (inpvalue || !!me.allowBlank))
      {
        me.value = cmbvalue + me.delimiter + inpvalue;
      }
      else
      {
        me.value = null;
      };

      me.OnChange();
    }
  },


  initComponent: function ()
  {
    var me = this;

    var valInputClass;
    switch (me.valueType)
    {
      case 'text': valInputClass = 'ZML.input.Text'; break;
      case 'number': valInputClass = 'ZML.input.Number'; break;
      case 'date': valInputClass = 'ZML.input.Date'; break;
      case 'time': valInputClass = 'ZML.input.Time'; break;

      default: valInputClass = 'ZML.input.Text'; break;
    };


    me.KeyInput = Ext.create('ZML.input.Text', {
      flex: 1,
      allowBlank: false,
      emptyText: 'key',
      submitEmptyText: false
    });

    me.ValueInput = Ext.create(valInputClass, {
      flex: 1,
      margin: '0 0 0 5',
      allowBlank: me.allowBlank,
      emptyText: 'value (' + me.valueType + ')',
      submitEmptyText: false
    });

    me.KeyInput.on('afterrender', function (obj) { obj.applyEmptyText(); });
    me.ValueInput.on('afterrender', function (obj) { obj.applyEmptyText(); });

    me.items = [me.KeyInput, me.ValueInput];
    me.callParent(arguments);

    me.relayEvents(me.KeyInput, ['change']);
    me.relayEvents(me.ValueInput, ['change']);

    me.initField();

    GLOBAL[this.AppNAME].Input.register(me);
  },


  OnChange: function ()
  {
    var me = this;
    if (me.autoSync) Ext.StoreManager.LoadLinkedStores({ scopeType: 'Input', scopeId: me.itemId });
    me.OnAfterEvent(me.ApiOnChange, me);
  },


  /**
   * Возвращает значение "ключа".
   * @method
   */
  GetKeyPart: function ()
  {
    return this.KeyInput.getSubmitValue();
  },

  /**
   * Возвращает значение "значения".
   * @method
   */
  GetValuePart: function ()
  {
    return this.ValueInput.getValue();
  },

  /**
   * Возвращает составное значение в формате {ключ}{разделитель}{значение}
   * @method
   */
  GetFullValue: function ()
  {
    return this.getValue();
  },

  /**
   * Устанавливает значение "ключа".
   * @method
   * @param {any} val Новое значение "ключа".
   */
  SetKeyPart: function (val)
  {
    this.KeyInput.setValue(val);
  },

  /**
   * Устанавливает значение "значения".
   * @method
   * @param {any} val Новое значение "значения".
   */
  SetValuePart: function (val)
  {
    this.ValueInput.setValue(val);
  },

  /**
   * Устанавливает строку разделителя.
   * @method
   * @param {any} val Новая строка разделителя.
   */
  SetDelimiter: function (val)
  {
    this.delimiter = val;
  },

});




// /** СОСТАВНОЙ ЭЛЕМЕНТ ВВОДА ДАННЫХ ФОРМАТА "КЛЮЧ: ЗНАЧЕНИЕ" */
// Ext.define('{{APP_NS}}.input.KeyValue', {

//   extend: 'Ext.form.FieldContainer',
//   alias: 'widget.KeyValueInput',


//   mixins: {
//     field: 'Ext.form.field.Field'
//   },


//   layout: 'hbox',
//   height: 22,
//   width: '100%',
//   anchor: '100%',
//   border: 0,
//   bodyBorder: 0,


//   /** Поле ввода ключа */
//   KeyInput: null,

//   /** Поле ввода значения */
//   ValueInput: null,

//   /** Разрешать пустые значения в поле ввода значения */
//   nullableInput: false,

//   /** Разделитель ключа и значения, используемый для построения составного текстового значения этого элемента ввода */
//   delimiter: ': ',



//   /**
//    * Сеттер для свойства value этого элемента ввода.
//    * @param {any} value Новое значение для свойства value.
//    */
//   setValue: function (value)
//   {
//     var me = this;
//     var firstvalue;
//     var secondvalue;

//     if (!Array.isArray(value))
//     {
//       var temparray = value ? value.toString().split(me.delimiter) : [null, null];
//       firstvalue = temparray[0];
//       secondvalue = temparray[1];
//     }
//     else
//     {
//       firstvalue = value[0];
//       secondvalue = value.length > 1 ? value[1] : null;
//     };

//     me.KeyInput.setValue(firstvalue);
//     me.ValueInput.setValue(secondvalue);
//   },


//   getValue: function ()
//   {
//     var cmbvalue = this.KeyInput.getSubmitValue();
//     var inpvalue = this.ValueInput.getSubmitValue();
//     var value;

//     if (cmbvalue && inpvalue)
//     {
//       value = cmbvalue + this.delimiter + inpvalue;
//     }
//     else
//     {
//       value = null;
//     };

//     return value;
//   },


//   getSubmitValue: function ()
//   {
//     return this.getValue();
//   },








//   initComponent: function ()
//   {
//     var me = this;


//     me.KeyInput = Ext.create('{{APP_NS}}.input.Text', {
//       flex: 1,
//       allowBlank: me.nullableInput,
//       emptyText: 'key',
//       submitEmptyText: false
//     });

//     me.ValueInput = Ext.create('{{APP_NS}}.input.Text', {
//       flex: 1,
//       margin: '0 0 0 5',
//       allowBlank: me.nullableInput,
//       emptyText: 'value',
//       submitEmptyText: false
//     });

//     me.KeyInput.on('afterrender', function (obj) { obj.applyEmptyText(); });
//     me.ValueInput.on('afterrender', function (obj) { obj.applyEmptyText(); });

//     me.items = [me.KeyInput, me.ValueInput];
//     me.callParent(arguments);

//     me.relayEvents(me.KeyInput, ['change']);
//     me.relayEvents(me.ValueInput, ['change']);

//     me.initField();
//   },


// });
