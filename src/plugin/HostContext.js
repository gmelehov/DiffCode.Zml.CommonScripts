/** ПЛАГИН, ПОДКЛЮЧАЕМЫЙ К ЭЛЕМЕНТУ РАЗМЕТКИ, ПОВЕДЕНИЕ КОТОРОГО ОПРЕДЕЛЯЕТСЯ СОБЫТИЯМИ ЕГО ХОСТ-ОБЪЕКТА */
Ext.define('ZML.plugin.HostContext', {

  extend: 'Ext.AbstractPlugin',
  alias: 'plugin.HostContext',


  mixins: {
    observable: 'Ext.util.Observable',
  },


  /** Ссылка на элемент разметки, к которому подключен этот плагин */
  COMP: null,
  /** Хранилище логов выполнения операций */
  LOG: [],
  /** Список конфигураторов привязки элемента к событию хост-объекта */
  CTX_BINDERS: [],


  /**
   * Инициализация плагина.
   * @param {any} comp Управляемый элемент разметки, к которому подключается этот плагин
   */
  init: function (comp)
  {
    var me = this;
    me.COMP = comp;

    me.callParent(arguments);

    me.mixins.observable.constructor.call(me, me);
    me.addEvents('executed');
    me.on('executed', me.OnExecuted, me);
  },


  OnExecuted: function (ctx, args)
  {
    this.addLogEntry(ctx, args);
    var specHandler = this.GetSpecificHandler(ctx, args);
    specHandler(this.COMP);
  },



  setCmp: function (comp)
  {
    var me = this;
    me.callParent(arguments);

    me.COMP = comp;
    var ctxbinders = [].concat(me.CTX_BINDERS);
    me.CTX_BINDERS = [];

    me.addCtxBinders(ctxbinders);

    me.COMP.CTX_BINDERS = me.CTX_BINDERS;
    me.COMP.HOST_CTX_PLUGIN = me;
  },


  addCtxBinders: function (binderConfigs)
  {
    var me = this;
    if (!Array.isArray(binderConfigs))
    {
      binderConfigs = Array.of(binderConfigs);
    };
    binderConfigs.forEach(function (bb)
    {
      bb['PLUGIN'] = me;
      var binder = Ext.create('ZML.ContextBinder', bb);
      if (binder.isContextBinder)
      {
        me.relayEvents(binder, ['executed']);
        me.CTX_BINDERS.push(binder);
      };      
    });
  },


  addLogEntry: function (ctx, args)
  {
    var me = this;
    var entry = {
      ctx: ctx,
      args: args
    };
    me.LOG.push(entry);
  },


  /**
   * Возвращает метод-обработчик для указанного биндера.
   * @param {any} ctx
   * @param {any} args
   * @returns {() => {}}
   */
  GetSpecificHandler: function (ctx, args)
  {
    var me = this;
    var argums = Array.from(args);


    if (!!ctx && ctx.isContextBinder && Array.isArray(argums))
    {
      /// Если ХОСТ-объект, указанный в биндере, является формой ввода данных...
      if (ctx.HOST.is('form'))
      {
        return function (comp)
        {
          comp.setDisabled(!argums[1]);
        }
      };
      /// Если ХОСТ-объект, указанный в биндере, является комбобоксом...
      if (ctx.HOST.is('ComboBox'))
      {
        return function (comp)
        {
          if (ctx.hostEvent == 'availableChanged')
          {
            var state = ctx.HOST.isDisabled();
            comp.setDisabled(state);
          }
          else if (!!ctx.needSelection || !!me.COMP.needSelection)
          {
            var selcount = ctx.HOST.GetSelectedCount();
            var needsel = ctx.needSelection || comp.needSelection;
            switch (needsel)
            {
              case 'none': comp.setDisabled(false); break;
              case 'single': comp.setDisabled(selcount != 1); break;
              case 'multi': comp.setDisabled(selcount < 2); break;
              case 'any': comp.setDisabled(selcount == 0); break;

              default: comp.setDisabled(false); break;
            };
          };
        };
      };
      /// Если ХОСТ-объект, указанный в биндере, является таблицей данных...
      if (ctx.HOST.is('grid') && (!!ctx.needSelection || !!me.COMP.needSelection))
      {
        return function (comp)
        {
          var selcount = argums[1].length;
          var needsel = ctx.needSelection || comp.needSelection;
          switch (needsel)
          {
            case 'none': comp.setDisabled(false); break;
            case 'single': comp.setDisabled(selcount != 1); break;
            case 'multi': comp.setDisabled(selcount < 2); break;
            case 'any': comp.setDisabled(selcount == 0); break;

            default: comp.setDisabled(false); break;
          };
        };
      };
      /// Если ХОСТ-объект, указанный в биндере, является списком данных...
      if (ctx.HOST.is('List') && (!!ctx.needSelection || !!me.COMP.needSelection))
      {
        return function (comp)
        {
          var selcount = argums[2].length;
          var needsel = ctx.needSelection || comp.needSelection;
          switch (needsel)
          {
            case 'none': comp.setDisabled(false); break;
            case 'single': comp.setDisabled(selcount != 1); break;
            case 'multi': comp.setDisabled(selcount < 2); break;
            case 'any': comp.setDisabled(selcount == 0); break;

            default: comp.setDisabled(false); break;
          };
        };
      };
      /// Если ХОСТ-объект, указанный в биндере, является таблицей с древовидным отображением данных...
      if (ctx.HOST.is('Tree') && (!!ctx.needSelection || !!me.COMP.needSelection))
      {
        return function (comp)
        {
          var selcount = argums[1].length;
          var needsel = ctx.needSelection || comp.needSelection;
          switch (needsel)
          {
            case 'none': comp.setDisabled(false); break;
            case 'single': comp.setDisabled(selcount != 1); break;
            case 'multi': comp.setDisabled(selcount < 2); break;
            case 'any': comp.setDisabled(selcount == 0); break;

            default: comp.setDisabled(false); break;
          };
        };
      };
      /// Если ХОСТ-объект, указанный в биндере, является полем ввода данных, либо элементом KeyValueInput/PairedCombo...
      if (ctx.HOST.is('field') || ctx.HOST.is('KeyValueInput') || ctx.HOST.is('PairedCombo'))
      {
        return function (comp)
        {
          comp.setDisabled(!argums[1]);
        }
      };

    };
  },

});