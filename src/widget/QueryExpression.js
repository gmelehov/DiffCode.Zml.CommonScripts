Ext.define('ZML.widget.QueryExpression', {

  extend: 'Ext.container.Container',
  alias: 'widget.QueryExpression',
  xtype: 'QueryExpression',

  layout: 'hbox',
  height: 30,
  width: '100%',
  padding: '4 6',

  config: {
    isActiveQuery: null,
    operator: null,
    exprType: null,
    condition: null,
    rightVisualType: null,
    rightFormType: null,
    leftOper: null,
    rightOper: null,
    isQueryExpression: null,
  },


  setCondition: function (value)
  {
    var me = this;
    if (me.__conditions.some(function (s) { return s === value }) && me.getCondition() !== value)
    {
      var oldvalue = me.getCondition();
      me.condition = value;
      me.fireEvent('conditionChanged', me, oldvalue, value);
    };
  },

  setOperator: function (value)
  {
    var me = this;
    if (me.__operators.some(function (s) { return s === value }) && me.getOperator() !== value)
    {
      var oldvalue = me.getOperator();
      me.operator = value;
      me.fireEvent('operatorChanged', me, oldvalue, value);
    };
  },

  setRightVisualType: function (value)
  {
    var me = this;
    if (me.__vtypes.some(function (s) { return s === value }) && me.getRightVisualType() !== value)
    {
      var oldvalue = me.getRightVisualType();
      me.rightVisualType = value;
      me.fireEvent('visualTypeChanged', me, oldvalue, value);
    };
  },

  setRightFormType: function (value)
  {
    var me = this;
    if (me.__ftypes.some(function (s) { return s === value }) && me.getRightFormType() !== value)
    {
      var oldvalue = me.getRightFormType();
      me.rightFormType = value;
      me.fireEvent('formTypeChanged', me, oldvalue, value);
    };
  },


  GetRightType: function ()
  {
    var me = this;
    return me.getRightVisualType() + '|' + me.getRightFormType();
  },


  initComponent: function (config)
  {
    var me = this;
    config = config || {};
    config.isQueryExpression = true;
    config.isActiveQuery = config.isActiveQuery || true;
    config.operator = config.operator || '';
    config.condition = config.condition || (config.rightOper ? '=' : 'IS NOT NULL');

    switch (config.condition)
    {
      case '=':
      case '<>':
      case '>':
      case '<':
      case '>=':
      case '<=':
      case 'LIKE':
      case 'NOT LIKE':
      case 'IN':
      case 'NOT IN': config.exprType = 'binary'; break;

      case 'IS NULL':
      case 'IS NOT NULL': config.exprType = 'unary'; break;

      default: break;
    };

    me.initConfig(config);
    me.callParent(arguments);
    me.addEvents('conditionChanged', 'visualTypeChanged', 'formTypeChanged', 'operatorChanged');
    me.on({
      conditionChanged: me.OnConditionChanged,
      visualTypeChanged: me.OnVisualTypeChanged,
      formTypeChanged: me.OnFormTypeChanged,
      operatorChanged: me.OnOperatorChanged,
      beforerender: me.OnBeforeRender,
      scope: me
    });

  },


  OnBeforeRender: function ()
  {
    var me = this;
    var checkbox = {
      xtype: 'Checkbox',
      itemId: me.itemId + '-isActive',
      width: 30,
      flex: 1,
      QryExpr: me,
      checked: me.getIsActiveQuery(),
      ApiOnChange: function ()
      {
        var val = this.getValue();
        this.QryExpr.setIsActiveQuery(val);
      }
    };
    var operator = Ext.create('Ext.button.Split', {
      text: me.getOperator() || '...',
      itemId: me.itemId + '-operator',
      width: 50,
      flex: 1,
      menu: new LogX.menu.Menu({
        items: [
          { text: '...', handler: function () { me.setOperator(''); } },
          { text: 'AND', handler: function () { me.setOperator('AND'); } },
          { text: 'OR', handler: function () { me.setOperator('OR'); } },
        ],
      })
    });

    me.add(checkbox);
    me.add(operator);
  },


  OnOperatorChanged: function (obj, oldvalue, newvalue)
  {
    if (obj && obj.isQueryExpression)
    {
      obj.down('#' + obj.itemId + '-operator').setText(newvalue);
    };
  },


  OnConditionChanged: function (obj, oldvalue, newvalue)
  {
    if (obj && obj.isQueryExpression)
    {
      switch (newvalue)
      {
        case '=':
        case '<>':
        case '>':
        case '<':
        case '>=':
        case '<=':
        case 'LIKE':
        case 'NOT LIKE':
        case 'IN':
        case 'NOT IN': obj.exprType = 'binary'; break;

        case 'IS NULL':
        case 'IS NOT NULL': obj.exprType = 'unary'; break;

        default: break;
      };
    };
  },


  OnVisualTypeChanged: function (obj, oldvalue, newvalue)
  {
    if (obj && obj.isQueryExpression)
    {
      obj.ProcessRightTypeChanges(obj);
    };
  },


  OnFormTypeChanged: function (obj, oldvalue, newvalue)
  {
    if (obj && obj.isQueryExpression)
    {
      obj.ProcessRightTypeChanges(obj);
    };
  },


  ProcessRightTypeChanges: function (obj)
  {
    if (obj && obj.isQueryExpression)
    {
      var rightType = obj.GetRightType();
      switch (rightType)
      {
        case 'vtString|ftText': break;
        case 'vtDecimal|ftText': break;
        case 'vtTime|ftTimeForm': break;
        case 'vtReference|ftCombo': break;
        case 'vtString|ftCheckbox': break;
        case 'vtDate|ftCalendar': break;

        default: break;
      };
    };
  },


  items: [],

  __operators: ['', 'AND', 'OR'],
  __conditions: ['=', '<>', '>', '<', '>=', '<=', 'LIKE', 'NOT LIKE', 'IN', 'NOT IN', 'IS NULL', 'IS NOT NULL'],
  __vtypes: ['vtString', 'vtDecimal', 'vtTime', 'vtReference', 'vtDate'],
  __ftypes: ['ftText', 'ftTimeForm', 'ftCombo', 'ftCheckbox', 'ftCalendar'],

});