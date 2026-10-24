/**
 * ПОЛЕ ВВОДА ДИАПАЗОНА ДАТ
 * @alias DateSet
 * @manager ZML.InputMgr
 * @registration initComponent
 */
Ext.define('ZML.input.DateSet', {

  extend: 'Ext.form.FieldSet',
  alias: 'widget.DateSet',

  padding: 0,
  margin: '0 0 5 0',
  border: 0,
  msgTarget: 'side',
  layout: 'hbox',
  width: '100%',

  fieldLabel: '',
  labelWidth: 0,


  delimiter: ' .. ',


  value: null,

  valuesList: [],

  FromDate: null,

  ToDate: null,

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
    this.FromDate.setValue(value);
  },


  setToValue: function (value)
  {
    this.ToDate.setValue(value);
  },


  isBetween: function (value)
  {
    return this.checkRange === true && this.valuesList[0] && this.valuesList[1] && this.valuesList[0] <= value && value <= this.valuesList[1];
  },


  ComposeOwnItems: function ()
  {
    var me = this;

    me.FromDate = Ext.create('ZML.input.Date', {
      ParentSet: me,
      fieldLabel: me.fieldLabel,
      itemId: me.itemId + '-From',
      labelWidth: me.labelWidth,
      submitValue: false,
      emptyText: 'от',
      tooltip: 'Начало интервала'
    });
    me.ToDate = Ext.create('ZML.input.Date', {
      ParentSet: me,
      itemId: me.itemId + '-To',
      margin: '0 0 0 6',
      submitValue: false,
      emptyText: 'до',
      tooltip: 'Окончание интервала'
    });

    me.FromDate.on('change', function (inp)
    {
      if (inp.ParentSet.checkRange === true)
      {
        var val = inp.getValue();
        inp.ParentSet.ToDate.setMinValue(val);
      }
      else
      {
        inp.ParentSet.ToDate.setMinValue(null);
      };
      inp.ParentSet.SetCompositeValues();
      //var otherVal = inp.ParentSet.ToDate.getValue();
      //inp.ParentSet.valuesList = [];
      //inp.ParentSet.valuesList.push(val, otherVal);
      //inp.ParentSet.value = [inp.getSubmitValue(), inp.ParentSet.delimiter, inp.ParentSet.ToDate.getSubmitValue()].join('');
    });
    me.ToDate.on('change', function (inp)
    {
      //var val = inp.getValue();
      //var otherVal = inp.ParentSet.FromDate.getValue();
      inp.ParentSet.SetCompositeValues();
      //inp.ParentSet.valuesList = [];
      //inp.ParentSet.valuesList.push(otherVal, val);
      //inp.ParentSet.value = [inp.ParentSet.FromDate.getSubmitValue(), inp.ParentSet.delimiter, inp.getSubmitValue()].join('');
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

    me.add(me.FromDate, me.ToDate, menubtn);
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
            it.parentMenu.HOST.checkRange = it.checked;
            if (it.checked === false)
            {
              it.parentMenu.HOST.__FromVal = it.parentMenu.HOST.FromDate.getValue();
              it.parentMenu.HOST.FromDate.setValue(null);
              it.parentMenu.HOST.FromDate.setValue(it.parentMenu.HOST.__FromVal);
              it.parentMenu.HOST.ToDate.validate();
            }
            else
            {
              it.parentMenu.HOST.ToDate.setMinValue(it.parentMenu.HOST.FromDate.getValue());
              it.parentMenu.HOST.ToDate.validate();
            };
            setTimeout(function () { it.parentMenu.HOST.SetCompositeValues(); }, 0);
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

    if (me.FromDate && me.ToDate)
    {
      var fromval = me.useSubmitValues === true ? me.FromDate.getSubmitValue() : me.FromDate.getValue();
      var toval = me.useSubmitValues === true ? me.ToDate.getSubmitValue() : me.ToDate.getValue();

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
    var fromdateWidth = me.FromDate.getWidth();
    var todateWidth = me.ToDate.getWidth();
    var targetTotalWidth = fromdateWidth + todateWidth + 22 - 6 - 6;
    var currentTotalFieldsWidth = fromdateWidth + todateWidth;

    var extraWidth = targetTotalWidth - currentTotalFieldsWidth;

    me.FromDate.setWidth(fromdateWidth + 2 * extraWidth);
    me.ToDate.setWidth(todateWidth + 2 * extraWidth);

  },

});







// Ext.define('{{APP_NS}}.input.DateSet', {

//   extend: 'Ext.form.FieldSet',
//   alias: 'widget.DateSet',

//   padding: 0,
//   margin: '0 0 5 0',
//   border: 0,
//   msgTarget: 'side',
//   layout: 'hbox',
//   width: '100%',

//   fieldLabel: '',
//   labelWidth: 0,


//   delimiter: ' .. ',


//   value: null,

//   valuesList: [],

//   FromDate: null,

//   ToDate: null,

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
//     this.FromDate.setValue(value);
//   },


//   setToValue: function (value)
//   {
//     this.ToDate.setValue(value);
//   },


//   isBetween: function (value)
//   {
//     return this.checkRange === true && this.valuesList[0] && this.valuesList[1] && this.valuesList[0] <= value && value <= this.valuesList[1];
//   },


//   ComposeOwnItems: function ()
//   {
//     var me = this;

//     me.FromDate = Ext.create('{{APP_NS}}.input.Date', {
//       ParentSet: me,
//       fieldLabel: me.fieldLabel,
//       itemId: me.itemId + '-From',
//       labelWidth: me.labelWidth,
//       submitValue: false,
//       emptyText: 'от',
//       tooltip: 'Начало интервала'
//     });
//     me.ToDate = Ext.create('{{APP_NS}}.input.Date', {
//       ParentSet: me,
//       itemId: me.itemId + '-To',
//       margin: '0 0 0 6',
//       submitValue: false,
//       emptyText: 'до',
//       tooltip: 'Окончание интервала'
//     });

//     me.FromDate.on('change', function (inp)
//     {
//       if (inp.ParentSet.checkRange === true)
//       {
//         var val = inp.getValue();
//         inp.ParentSet.ToDate.setMinValue(val);
//       }
//       else
//       {
//         inp.ParentSet.ToDate.setMinValue(null);
//       };
//       inp.ParentSet.SetCompositeValues();
//       //var otherVal = inp.ParentSet.ToDate.getValue();
//       //inp.ParentSet.valuesList = [];
//       //inp.ParentSet.valuesList.push(val, otherVal);
//       //inp.ParentSet.value = [inp.getSubmitValue(), inp.ParentSet.delimiter, inp.ParentSet.ToDate.getSubmitValue()].join('');
//     });
//     me.ToDate.on('change', function (inp)
//     {
//       //var val = inp.getValue();
//       //var otherVal = inp.ParentSet.FromDate.getValue();
//       inp.ParentSet.SetCompositeValues();
//       //inp.ParentSet.valuesList = [];
//       //inp.ParentSet.valuesList.push(otherVal, val);
//       //inp.ParentSet.value = [inp.ParentSet.FromDate.getSubmitValue(), inp.ParentSet.delimiter, inp.getSubmitValue()].join('');
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

//     me.add(me.FromDate, me.ToDate, menubtn);
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
//               it.parentMenu.HOST.__FromVal = it.parentMenu.HOST.FromDate.getValue();
//               it.parentMenu.HOST.FromDate.setValue(null);
//               it.parentMenu.HOST.FromDate.setValue(it.parentMenu.HOST.__FromVal);
//               it.parentMenu.HOST.ToDate.validate();
//             }
//             else
//             {
//               it.parentMenu.HOST.ToDate.setMinValue(it.parentMenu.HOST.FromDate.getValue());
//               it.parentMenu.HOST.ToDate.validate();
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

//     if (me.FromDate && me.ToDate)
//     {
//       var fromval = me.useSubmitValues === true ? me.FromDate.getSubmitValue() : me.FromDate.getValue();
//       var toval = me.useSubmitValues === true ? me.ToDate.getSubmitValue() : me.ToDate.getValue();

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
//     var fromdateWidth = me.FromDate.getWidth();
//     var todateWidth = me.ToDate.getWidth();
//     var targetTotalWidth = fromdateWidth + todateWidth + 22 - 6 - 6;
//     var currentTotalFieldsWidth = fromdateWidth + todateWidth;

//     var extraWidth = targetTotalWidth - currentTotalFieldsWidth;

//     me.FromDate.setWidth(fromdateWidth + 2 * extraWidth);
//     me.ToDate.setWidth(todateWidth + 2 * extraWidth);

//   },


// });