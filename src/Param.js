/**
 * ПАРАМЕТР
 * Задает источник получения данных для своего хост-объекта.
 * Поиск источника производится по его типу и идентификатору,
 * данные извлекаются из указанного свойства/содержимого источника.
 * 
 */
Ext.define('ZML.Param', {

  extend: 'Ext.Component',

  config: {

    scopeId: null,
    scopeType: null,
    field: null,
    as: null,
    value: undefined,
    default: undefined,
    record: 0,

    /**
     * Способ передачи параметра в ASP.NET Core контроллер.
     * @type {'route'|'query'|'body'|'header'}
     */
    aspFrom: 'query',

    isParam: null,
    isCorrectScope: null,
  },


  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',


  initComponent: function (config)
  {
    this.callParent(arguments);
    config = config || {};
    var cfg = {
      scopeId: config.scopeId,
      scopeType: config.scopeType,
      field: config.field,
      as: config.as || config.field,
      record: config.record,
      value: config.value,
      default: config.value || config.default,
      aspFrom: config.aspFrom,
      isParam: true,
      isCorrectScope: this.IsCorrectScope(config.scopeType)
    };

    this.initConfig(cfg);
  },


  compute: function ()
  {
    var me = this;
    var ret;

    if (GLOBAL[me.AppNAME][me.scopeType] && typeof (GLOBAL[me.AppNAME][me.scopeType].EvaluateField) === 'function')
    {
      ret = GLOBAL[me.AppNAME][me.scopeType].EvaluateField(me.scopeId, me.field, me.record);
    };
    me.value = me.default == undefined ? ret : (typeof me.default === 'function' ? me.default.call(me) : me.default || me.getDefault());
  },


  IsCorrectScope: function (scope)
  {
    switch (scope)
    {
      //case 'Button':
      case 'Combo':
      //case 'Component':
      //case 'Dialog':
      case 'Editor':
      case 'Form':
      case 'Grid':
      case 'Input':
      case 'List':
      //case 'Panel':
      case 'Tabpanel':
      //case 'Template':
      case 'Tree':
        return true;

      default: return false;
    };
  },

});
