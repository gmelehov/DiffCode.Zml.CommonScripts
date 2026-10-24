/** КОНФИГУРАТОР ПРИВЯЗКИ УПРАВЛЯЕМОГО ЭЛЕМЕНТА РАЗМЕТКИ К СВОЕМУ ХОСТ-ОБЪЕКТУ */
Ext.define('ZML.ContextBinder', {

  extend: 'Ext.Component',


  mixins: {
    observable: 'Ext.util.Observable',
  },


  /** Хост-объект, обнаруженный текущей реализацией метода hostLocator */
  HOST: null,
  /** Плагин, подключенный к управляемому элементу разметки, в котором определена эта привязка */
  PLUGIN: null,
  /** Сводка о работе этой привязки */
  Summary: {
    callsCount: 0,
    lastResult: [],
  },



  config: {
    /** Тип хост-объекта */
    hostType: null,
    /** 
     * Идентификатор хост-объекта.
     * Может быть равным null, если управляемый элемент находится непосредственно
     * внутри своего хост-объекта. В этом случае поиск хост-объекта 
     * будет выполняться через this.up(hostType) и будет невозможен
     * для невизуальных хост-объектов типа source и т.п. 
     */
    hostId: null,
    /** Событие, генерируемое хост-объектом, определяющее поведение управляемого элемента разметки */
    hostEvent: null,
    /** Предыдущее значение свойства hostEvent (до его замены на текущее) */
    lastHostEvent: null,
    /** Признак наличия сконфигурированного хост-объекта (факт того, что хост-объект найден и сконфигурирован) */
    isHostConfigured: false,
    /** Признак отключенной привязки, отсоединенной от своих плагинов/элементов/объектов */
    isDetached: false,
    /** Признак того, что данный объект является экземпляром своего класса */
    isContextBinder: true,

    needSelection: null
  },



  /**
   * Сеттер для свойства hostType. 
   * Генерирует событие hostTypeChanged при изменении свойства.
   * @param {any} value
   */
  setHostType: function (value)
  {
    var oldvalue = this.getHostType();
    this.hostType = value;
    if (oldvalue !== value)
    {
      this.fireEvent('hostTypeChanged', this, oldvalue, value);
    };
  },

  /**
   * Сеттер для свойства hostId. 
   * Генерирует событие hostIdChanged при изменении свойства.
   * @param {any} value
   */
  setHostId: function (value)
  {
    var oldvalue = this.getHostId();
    this.hostId = value;
    if (oldvalue !== value)
    {
      this.fireEvent('hostIdChanged', this, oldvalue, value);
    };
  },

  /**
   * Сеттер для свойства hostEvent. 
   * Генерирует событие hostEventChanged при изменении свойства.
   * @param {any} value
   */
  setHostEvent: function (value)
  {
    var me = this;
    me.lastHostEvent = me.getHostEvent();
    me.hostEvent = value;
    if (me.getLastHostEvent() != value)
    {
      me.fireEvent('hostEventChanged', me, me.lastHostEvent, value);
    };
  },





  initComponent: function (config)
  {
    var me = this;
    me.callParent(arguments);
    me.initConfig(config);

    me.mixins.observable.constructor.call(me, config);
    me.addEvents('created', 'hostTypeChanged', 'hostIdChanged', 'hostEventChanged', 'hostLocated', 'hostConfigured', 'executed');

    me.on({
      created: me.OnCreated,
      hostTypeChanged: me.OnHostTypeChanged,
      hostIdChanged: me.OnHostIdChanged,
      hostEventChanged: me.OnHostEventChanged,
      hostLocated: me.OnHostLocated,
      hostConfigured: me.OnHostConfigured,
      executed: me.OnExecuted,
      beforedestroy: me.OnBeforeDestroy,
      destroy: me.OnDestroy,
      scope: me
    });

    me.fireEvent('created', me);
  },




  /** 
   * Заглушка для динамически конструируемого метода, 
   * выполняющего поиск хост-объекта по его текущим
   * параметрам, заданным в свойствах hostType, hostId.
   */
  hostLocator: null,

  /**
   * Выполняет первый поиск хост-объекта и первое создание
   * динамического метода hostLocator.
   * Выполняется только в случае, если свойство hostType
   * содержит значение, И метод hostLocator еще не инициализирован.
   * После выполнения этих действий запускает метод tryLocateHost.
   */
  initHostLocator: function ()
  {
    var me = this;
    if (me && !!me.hostType && me.hostLocator === null)
    {
      var elem = me.PLUGIN.COMP;

      switch (me.hostType)
      {

        /// Если искомый хост-объект - источник данных...
        case 'source':
        case 'Source':
          me.hostLocator = function ()
          {
            return Ext.getStore(me.hostId);
          };
          break;


        /// Если искомый хост-объект - список с данными...
        case 'List':
          me.hostLocator = function ()
          {
            /// Проверяем принципиальную возможность выполнения поиска типа this.up(...)
            var hasUpMethod = !!me.PLUGIN && !!me.PLUGIN.cmp && typeof me.PLUGIN.cmp.up === 'function';

            if (!!me.getHostId())
            {
              return GLOBAL[elem.AppNAME].List[me.getHostId()];
            }
            else if (hasUpMethod)
            {
              return me.PLUGIN.cmp.up('List');
            };
          };
          break;


        /// Если искомый хост-объект - дерево узлов...
        case 'Tree':
          me.hostLocator = function ()
          {
            /// Проверяем принципиальную возможность выполнения поиска типа this.up(...)
            var hasUpMethod = !!me.PLUGIN && !!me.PLUGIN.cmp && typeof me.PLUGIN.cmp.up === 'function';

            if (!!me.getHostId())
            {
              return GLOBAL[elem.AppNAME].Tree[me.getHostId()];
            }
            else if (hasUpMethod)
            {
              return me.PLUGIN.cmp.up('Tree');
            };
          };
          break;



        /// Если искомый хост-объект - поле ввода данных...
        case 'Input':
          me.hostLocator = function ()
          {
            return GLOBAL[elem.AppNAME].Input[me.getHostId()];
          };
          break;



        /// Если искомый хост-объект - комбобокс...
        case 'Combo':
          me.hostLocator = function ()
          {
            return GLOBAL[elem.AppNAME].Combo[me.getHostId()];
          };
          break;



        /// Если искомый хост-объект - форма ввода данных...
        case 'Form':
          me.hostLocator = function ()
          {
            return GLOBAL[elem.AppNAME].Form[me.getHostId()];
          };
          break;



        /// Если искомый хост-объект - редактор исходного кода...
        case 'Editor':
          me.hostLocator = function ()
          {
            return GLOBAL[elem.AppNAME].Editor[me.getHostId()];
          };
          break;





        /// Для всех прочих типов хост-объектов...
        default:
          me.hostLocator = function ()
          {
            /// Проверяем принципиальную возможность выполнения поиска типа this.up(...)
            var hasUpMethod = !!me.PLUGIN && !!me.PLUGIN.cmp && typeof me.PLUGIN.cmp.up === 'function';

            if (!!me.getHostId())
            {
              return GLOBAL[elem.AppNAME][me.hostType][me.getHostId()];
            }
            else if (hasUpMethod)
            {
              return me.PLUGIN.cmp.up(me.getHostType());
            };
          };
          break;
      };

      setTimeout(function () { me.tryLocateHost(); }, 0);
    };
  },

  /**
   * Запускает метод hostLocator и записывает 
   * результаты его выполнения в свойство HOST.
   * После выполнения этих действий генерирует событие hostLocated.
   * Выполняется только в случае, если метод hostLocator 
   * уже проинициализирован и представляет из себя функцию.
   */
  tryLocateHost: function ()
  {
    var me = this;
    if (me.hostLocator !== null && typeof me.hostLocator === 'function')
    {
      me.HOST = me.hostLocator();
      setTimeout(function ()
      {
        if (!!me.HOST)
        {
          me.fireEvent('hostLocated', me);
        };
      }, 0)
    };
  },

  /**
   * Выполняет (ре)конфигурирование найденного хост-объекта:
   * удаляет из него имеющийся обработчик предыдущего (неактуального более) события hostEvent
   * и устанавливает новый обработчик текущего (актуального) события hostEvent.
   * В качестве метода-обработчика события хост-объекта используется локальный метод notifyContextManager.
   * Метод tryConfigureHost выполняется только в случае, если новое (актуальное) 
   * событие hostEvent не является falsy и хост-объект найден.
   * После выполнения всех описанных операций генерирует событие hostConfigured.
   * @param {any} oldevent Предыдущее событие hostEvent для удаления неактуального обработчика
   * @param {any} newevent Текущее событие hostEvent для установки актуального обработчика
   */
  tryConfigureHost: function (oldevent, newevent)
  {
    var me = this;
    if (!!newevent && me.HOST && oldevent != newevent)
    {
      if (!!oldevent)
      {
        me.HOST.un(oldevent, me.notifyContextManager, me);
      };
      me.HOST.on(newevent, me.notifyContextManager, me);

      me.fireEvent('hostConfigured', me, oldevent, newevent);
    };
  },

  /** 
   * Метод, принимающий управление дальнейшими операциями при получении
   * управляющего события от хост-объекта.
   * Генерирует событие executed с аргументами, полученными от события хост-объекта.
   */
  notifyContextManager: function ()
  {
    var me = this;
    me.fireEvent('executed', me, arguments);
  },





  /**
   * Обработчик события created.
   * Запускает инициализацию метода hostLocator.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   */
  OnCreated: function (ctx)
  {
    if (ctx && ctx.isContextBinder)
    {
      ctx.initHostLocator();
    };
  },

  /**
   * Обработчик события beforeDestroy.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   */
  OnBeforeDestroy: function (ctx)
  {
    if (ctx && ctx.isContextBinder && ctx.HOST && !!ctx.hostEvent)
    {
      ctx.HOST.un(ctx.hostEvent, ctx.notifyContextManager, ctx);
      ctx.setIsDetached(true);
    };
    return true;
  },

  /**
   * Обработчик события destroy.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   */
  OnDestroy: function (ctx)
  {
    console.dir(ctx.isDetached ? 'Successfully detached!' : 'Detach failed!');
  },

  /**
   * Обработчик события hostTypeChanged.
   * Выполняет сброс и повторную инициализацию метода hostLocator в случае,
   * если новое значение свойства hostType не является falsy.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   * @param {any} oldvalue Предыдущее значение свойства hostType
   * @param {any} newvalue Текущее значение свойства hostType
   */
  OnHostTypeChanged: function (ctx, oldvalue, newvalue)
  {
    if (ctx && ctx.isContextBinder)
    {
      if (oldvalue != newvalue && !!newvalue)
      {
        ctx.hostLocator = null;
        ctx.initHostLocator();
      };
    };
  },

  /**
   * Обработчик события hostIdChanged.
   * Запускает повторный поиск хост-объекта вызовом метода tryLocateHost в случае,
   * если новое значение свойства hostId не является falsy.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   * @param {any} oldvalue Предыдущее значение свойства hostId
   * @param {any} newvalue Текущее значение свойства hostId
   */
  OnHostIdChanged: function (ctx, oldvalue, newvalue)
  {
    if (ctx && ctx.isContextBinder)
    {
      if (oldvalue != newvalue && !!newvalue)
      {
        ctx.tryLocateHost();
      };
    };
  },

  /**
   * Обработчик события hostEventChanged.
   * Запускает реконфигурацию хост-объекта вызовом метода tryConfigureHost.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   * @param {any} oldvalue Предыдущее значение свойства hostEvent
   * @param {any} newvalue Текущее значение свойства hostEvent
   */
  OnHostEventChanged: function (ctx, oldvalue, newvalue)
  {
    if (ctx && ctx.isContextBinder)
    {
      ctx.tryConfigureHost(oldvalue, newvalue);
    };
  },

  /**
   * Обработчик события hostLocated.
   * Запускает реконфигурацию хост-объекта вызовом метода tryConfigureHost,
   * используя текущие значения свойств lastHostEvent и hostEvent как параметры его вызова
   * в качестве предыдущего и текущего значения свойства hostEvent соответственно.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   */
  OnHostLocated: function (ctx)
  {
    if (ctx && ctx.isContextBinder)
    {
      ctx.tryConfigureHost(ctx.lastHostEvent, ctx.hostEvent);
    };
  },

  /**
   * Обработчик события hostConfigured.
   * Устанавливает признак isHostConfigured равным true.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   */
  OnHostConfigured: function (ctx)
  {
    if (ctx && ctx.isContextBinder)
    {
      ctx.setIsHostConfigured(true);
    };
  },

  /**
   * Обработчик события executed.
   * Увеличивает счетчик применения изменений к управляемому элементу на единицу,
   * записывает полученные от управляющего события хост-объекта аргументы в свойство Summary.lastResult.
   * Событие executed далее используется в плагине, подключенном к управляемому элементу.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   * @param {any} args Аргументы управляющего события хост-объекта
   */
  OnExecuted: function (ctx, args)
  {
    if (ctx && ctx.isContextBinder)
    {
      ctx.Summary.callsCount++;
      ctx.Summary.lastResult = [].concat(args);
    };
  },

});
