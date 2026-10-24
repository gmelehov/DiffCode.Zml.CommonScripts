/**
 * ПОЛЕ ВВОДА ДИАПАЗОНА ЧИСЕЛ
 * @alias NumberSet
 * @manager ZML.InputMgr
 * @registration initComponent
 */
Ext.define('ZML.input.NumberSet', {

  extend: 'Ext.form.FieldSet',
  alias: 'widget.NumberSet',

  padding: 0,
  margin: '0 0 5 0',
  border: 0,
  msgTarget: 'side',
  layout: 'hbox',
  width: '100%',

  fieldLabel: '',
  labelWidth: 0,
  step: 1,
  minValue: null,
  maxValue: null,

  delimiter: ' .. ',

  value: null,

  valuesList: [],

  /** Поле для ввода начального значения интервала */
  FromNum: null,

  /** Поле для ввода конечного значения интервала */
  ToNum: null,

  MENU: null,

  /** Ограничивать значение ДО в соответствии с текущим значением ОТ */
  checkRange: true,

  /** Включать значения null в композитные значения этого элемента */
  allowNulls: true,

  /** При вычислении композитных значений элемента использовать getSubmitValue() вместо getValue() */
  useSubmitValues: true,

  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',



  initComponent: function ()
  {
    var me = this;
    me.callParent(arguments);

    me.on('afterrender', function (obj)
    {
      obj.ComposeOwnItems();
      obj.ComposeOwnMenu();
      setTimeout(function () { obj.ComputeFieldsWidths(); }, 10);
    });

    GLOBAL[this.AppNAME].Input.register(me);
  },


  getValue: function ()
  {
    return this.value;
  },


  getValues: function ()
  {
    return this.valuesList;
  },


  setFromValue: function (value)
  {
    this.FromNum.setValue(value);
  },


  setToValue: function (value)
  {
    this.ToNum.setValue(value);
  },


  isBetween: function (value)
  {
    return this.checkRange === true && this.valuesList[0] && this.valuesList[1] && this.valuesList[0] <= value && value <= this.valuesList[1];
  },


  ComposeOwnItems: function ()
  {
    var me = this;

    me.FromNum = Ext.create('ZML.input.Number', {
      ParentSet: me,
      fieldLabel: me.fieldLabel,
      itemId: me.itemId + '-From',
      labelWidth: me.labelWidth,
      submitValue: false,
      emptyText: 'от',
      tooltip: 'Начало интервала',
      step: me.step,
      minValue: me.minValue
    });
    me.ToNum = Ext.create('ZML.input.Number', {
      ParentSet: me,
      itemId: me.itemId + '-To',
      margin: '0 0 0 6',
      submitValue: false,
      emptyText: 'до',
      tooltip: 'Окончание интервала',
      step: me.step,
      maxValue: me.maxValue
    });

    me.FromNum.on('change', function (inp)
    {
      var parent = inp.ParentSet;

      if (parent.checkRange === true)
      {
        var val = inp.getValue();
        parent.ToNum.setMinValue(val);
      }
      else
      {
        parent.ToNum.setMinValue(null);
      };
      parent.SetCompositeValues();
    });
    me.ToNum.on('change', function (inp)
    {
      inp.ParentSet.SetCompositeValues();
    });

    var menubtn = Ext.create('ZML.button.Button', {
      itemId: me.itemId + '-InnerMenuBtn',
      call: 'action',
      iconSet: 'mat-icons',
      __icon: 'more_vert',
      __cls: 'opaque',
      color: 'grey',
      tooltip: '',
      needSelection: 'none',
      OnHandlerCall: function (item, evt)
      {
        me.ShowOwnMenu(item, evt);
      }
    });

    me.add(me.FromNum, me.ToNum, menubtn);
  },


  ComposeOwnMenu: function ()
  {
    var me = this;
    me.MENU = new Ext.menu.Menu({
      id: me.itemId + '-InnerMenu',
      animCollapse: true,
      allowOtherMenus: true,
      defaults: { clickHideDelay: 200 },
      HOST: me,
      items: [
        {
          xtype: 'menucheckitem',
          itemId: 'Item1',
          text: 'Ограничивать ДО >= ОТ',
          checked: me.checkRange,
          handler: function (it)
          {
            var host = it.parentMenu.HOST;
            host.checkRange = it.checked;
            if (it.checked === false)
            {
              host.__FromVal = host.FromNum.getValue();
              host.FromNum.setValue(null);
              host.FromNum.setValue(host.__FromVal);
              host.ToNum.validate();
            }
            else
            {
              host.ToNum.setMinValue(host.FromNum.getValue());
              host.ToNum.validate();
            };
            setTimeout(function () { host.SetCompositeValues(); }, 0);
          }
        },
        {
          xtype: 'menucheckitem',
          itemId: 'Item2',
          text: 'Использовать null в значениях',
          checked: me.allowNulls,
          handler: function (it)
          {
            it.parentMenu.HOST.allowNulls = it.checked;
            it.parentMenu.HOST.SetCompositeValues();
          }
        },
        {
          xtype: 'menucheckitem',
          itemId: 'Item3',
          text: 'Использовать submit-значения',
          checked: me.useSubmitValues,
          handler: function (it)
          {
            it.parentMenu.HOST.useSubmitValues = it.checked;
            it.parentMenu.HOST.SetCompositeValues();
          }
        },
      ],
    });
  },


  ShowOwnMenu: function (it, ev)
  {
    this.MENU.showAt(ev.getXY());
    //this.MENU.alignTo(it, 'bl?', [0, -90], false);
  },


  SetCompositeValues: function ()
  {
    var me = this;

    if (me.FromNum && me.ToNum)
    {
      var fromval = me.useSubmitValues === true ? me.FromNum.getSubmitValue() : me.FromNum.getValue();
      var toval = me.useSubmitValues === true ? me.ToNum.getSubmitValue() : me.ToNum.getValue();

      if ((me.allowNulls === true && (fromval == null || toval == null)) || (fromval != null && toval != null))
      {
        if ((me.checkRange === true && (toval >= fromval)) || me.checkRange === false)
        {
          me.value = [fromval, me.delimiter, toval].join('');
          me.valuesList = [];
          me.valuesList.push(fromval, toval);
        };
      };
    };
  },


  ComputeFieldsWidths: function ()
  {
    var me = this;
    var menubtn = me.query('button')[0];

    var meInnerWidth = me.getWidth() - 6 - 6;
    var fromWidth = me.FromNum.getWidth();
    var toWidth = me.ToNum.getWidth();
    var targetTotalWidth = fromWidth + toWidth + 22 - 6 - 6;
    var currentTotalFieldsWidth = fromWidth + toWidth;

    var extraWidth = targetTotalWidth - currentTotalFieldsWidth;

    me.FromNum.setWidth(fromWidth + 2 * extraWidth);
    me.ToNum.setWidth(toWidth + 2 * extraWidth);

  },

});





// Ext.define('{{APP_NS}}.input.NumberSet', {

//   extend: 'Ext.form.FieldSet',
//   alias: 'widget.NumberSet',

//   padding: 0,
//   margin: '0 0 5 0',
//   border: 0,
//   msgTarget: 'side',
//   layout: 'hbox',
//   width: '100%',

//   fieldLabel: '',
//   labelWidth: 0,
//   step: 1,
//   minValue: null,
//   maxValue: null,


//   delimiter: ' .. ',


//   value: null,

//   valuesList: [],

//   FromNum: null,

//   ToNum: null,

//   MENU: null,

//   /** Ограничивать значение ДО в соответствии с текущим значением ОТ */
//   checkRange: true,
//   /** Включать значения null в композитные значения этого элемента */
//   allowNulls: true,
//   /** При вычислении композитных значений элемента использовать getSubmitValue() вместо getValue() */
//   useSubmitValues: true,



//   initComponent: function ()
//   {
//     var me = this;
//     me.callParent(arguments);

//     me.on('afterrender', function (obj)
//     {
//       obj.ComposeOwnItems();
//       obj.ComposeOwnMenu();
//       setTimeout(function () { obj.ComputeFieldsWidths(); }, 10);
//     });
//   },




//   getValue: function ()
//   {
//     return this.value;
//   },


//   getValues: function ()
//   {
//     return this.valuesList;
//   },


//   setFromValue: function (value)
//   {
//     this.FromNum.setValue(value);
//   },


//   setToValue: function (value)
//   {
//     this.ToNum.setValue(value);
//   },


//   isBetween: function (value)
//   {
//     return this.checkRange === true && this.valuesList[0] && this.valuesList[1] && this.valuesList[0] <= value && value <= this.valuesList[1];
//   },


//   ComposeOwnItems: function ()
//   {
//     var me = this;

//     me.FromNum = Ext.create('{{APP_NS}}.input.Number', {
//       ParentSet: me,
//       fieldLabel: me.fieldLabel,
//       itemId: me.itemId + '-From',
//       labelWidth: me.labelWidth,
//       submitValue: false,
//       emptyText: 'от',
//       tooltip: 'Начало интервала',
//       step: me.step,
//       minValue: me.minValue
//     });
//     me.ToNum = Ext.create('{{APP_NS}}.input.Number', {
//       ParentSet: me,
//       itemId: me.itemId + '-To',
//       margin: '0 0 0 6',
//       submitValue: false,
//       emptyText: 'до',
//       tooltip: 'Окончание интервала',
//       step: me.step,
//       maxValue: me.maxValue
//     });

//     me.FromNum.on('change', function (inp)
//     {
//       if (inp.ParentSet.checkRange === true)
//       {
//         var val = inp.getValue();
//         inp.ParentSet.ToNum.setMinValue(val);
//       }
//       else
//       {
//         inp.ParentSet.ToNum.setMinValue(null);
//       };
//       inp.ParentSet.SetCompositeValues();
//     });
//     me.ToNum.on('change', function (inp)
//     {
//       inp.ParentSet.SetCompositeValues();
//     });

//     var menubtn = Ext.create('{{APP_NS}}.button.Button', {
//       itemId: me.itemId + '-InnerMenuBtn',
//       call: 'action',
//       iconSet: 'mat-icons',
//       __icon: 'more_vert',
//       __cls: 'opaque',
//       color: 'grey',
//       tooltip: '',
//       needSelection: 'none',
//       OnHandlerCall: function (item, evt)
//       {
//         me.ShowOwnMenu(item, evt);
//       }
//     });

//     me.add(me.FromNum, me.ToNum, menubtn);
//   },


//   ComposeOwnMenu: function ()
//   {
//     var me = this;
//     me.MENU = new Ext.menu.Menu({
//       id: me.itemId + '-InnerMenu',
//       animCollapse: true,
//       allowOtherMenus: true,
//       defaults: { clickHideDelay: 200 },
//       HOST: me,
//       items: [
//         {
//           xtype: 'menucheckitem',
//           itemId: 'Item1',
//           text: 'Ограничивать ДО >= ОТ',
//           checked: me.checkRange,
//           handler: function (it)
//           {
//             it.parentMenu.HOST.checkRange = it.checked;
//             if (it.checked === false)
//             {
//               it.parentMenu.HOST.__FromVal = it.parentMenu.HOST.FromNum.getValue();
//               it.parentMenu.HOST.FromNum.setValue(null);
//               it.parentMenu.HOST.FromNum.setValue(it.parentMenu.HOST.__FromVal);
//               it.parentMenu.HOST.ToNum.validate();
//             }
//             else
//             {
//               it.parentMenu.HOST.ToNum.setMinValue(it.parentMenu.HOST.FromNum.getValue());
//               it.parentMenu.HOST.ToNum.validate();
//             };
//             setTimeout(function () { it.parentMenu.HOST.SetCompositeValues(); }, 0);
//           }
//         },
//         {
//           xtype: 'menucheckitem',
//           itemId: 'Item2',
//           text: 'Использовать null в значениях',
//           checked: me.allowNulls,
//           handler: function (it)
//           {
//             it.parentMenu.HOST.allowNulls = it.checked;
//             it.parentMenu.HOST.SetCompositeValues();
//           }
//         },
//         {
//           xtype: 'menucheckitem',
//           itemId: 'Item3',
//           text: 'Использовать submit-значения',
//           checked: me.useSubmitValues,
//           handler: function (it)
//           {
//             it.parentMenu.HOST.useSubmitValues = it.checked;
//             it.parentMenu.HOST.SetCompositeValues();
//           }
//         },
//       ],
//     });
//   },


//   ShowOwnMenu: function (it, ev)
//   {
//     this.MENU.showAt(ev.getXY());
//     //this.MENU.alignTo(it, 'bl?', [0, -90], false);
//   },


//   SetCompositeValues: function ()
//   {
//     var me = this;

//     if (me.FromNum && me.ToNum)
//     {
//       var fromval = me.useSubmitValues === true ? me.FromNum.getSubmitValue() : me.FromNum.getValue();
//       var toval = me.useSubmitValues === true ? me.ToNum.getSubmitValue() : me.ToNum.getValue();

//       if ((me.allowNulls === true && (fromval == null || toval == null)) || (fromval != null && toval != null))
//       {
//         if ((me.checkRange === true && (toval >= fromval)) || me.checkRange === false)
//         {
//           me.value = [fromval, me.delimiter, toval].join('');
//           me.valuesList = [];
//           me.valuesList.push(fromval, toval);
//         };
//       };
//     };
//   },


//   ComputeFieldsWidths: function ()
//   {
//     var me = this;
//     var menubtn = me.query('button')[0];

//     var meInnerWidth = me.getWidth() - 6 - 6;
//     var fromWidth = me.FromNum.getWidth();
//     var toWidth = me.ToNum.getWidth();
//     var targetTotalWidth = fromWidth + toWidth + 22 - 6 - 6;
//     var currentTotalFieldsWidth = fromWidth + toWidth;

//     var extraWidth = targetTotalWidth - currentTotalFieldsWidth;

//     me.FromNum.setWidth(fromWidth + 2 * extraWidth);
//     me.ToNum.setWidth(toWidth + 2 * extraWidth);

//   },


// });