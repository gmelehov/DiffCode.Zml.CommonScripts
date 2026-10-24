Ext.define('ZML.data.SignalRHub', {

  extend: 'Ext.Component',

  URL: null,
  HUB: {},
  RESPONSE: {},
  DICT: {},
  STATUS: 'disconnected',

  binders: [],


  initComponent: function ()
  {
    var me = this;
    me.callParent(arguments);
    me.HUB = new signalR.HubConnectionBuilder().withUrl(me.URL).build();
    me.processBinders();
    setTimeout(function () { me.start(); }, 0);
  },


	/**
	 * Обработчик биндеров.
	 */
  processBinders: function ()
  {
    var me = this;
    if (me.checkBinders() === true)
    {
      me.binders.forEach(function (b)
      {
        if (b.ready === false)
        {

          /** Если в биндере присутствует свойство hubKey, определяем такое свойство в объекте RESPONSE */
          if (b.hubKey)
          {
            Object.defineProperty(me.RESPONSE, b.hubKey, {
              configurable: true,
              enumerable: true,
              writable: true,
              value: null
            });
          };

          /** Определяем обработчик события, указанного в свойстве clientEvent биндера */
          me.HUB.on(b.clientEvent, function (data)
          {
            /** Если свойство command текущего биндера не является функцией, либо вообще не указано */
            if (typeof b.command !== 'function')
            {
              /** Если в текущем биндере определено свойство hubKey */
              if (b.hubKey)
              {
                if (data.data !== undefined)
                {
                  var resp = data;
                }
                else
                {
                  var resp = {
                    format: 'JSON',
                    data: Array.isArray(data) ? data : [data],
                    errorCode: 0,
                    errorText: 'ok',
                    pagesCount: 0,
                    totalCount: Array.isArray(data) ? data.length : 1,
                    success: data.success
                  };
                };
                me.RESPONSE[b.hubKey] = resp;
                if (data.storeId)
                {
                  var stor = Ext.StoreMgr.lookup(data.storeId);
                  stor.ProcessStore(data.storeId, stor.ReadFrom);
                };
              };

              setTimeout(function ()
              {
                if (typeof b.callback === 'function') b.callback();

              }, 0);
            }
            /** Иначе, если command - функция, запускаем ее */
            else
            {
              b.command(data);
            };

            
          });

          /** Определяем собственный метод объекта с именем, равным значению свойства serverMethod текущего биндера */
          Object.defineProperty(me, b.serverMethod, {
            value: function ()
            {
              if (me.STATUS === 'connected')
              {
                if (b.noRequest === true)
                  me.HUB.invoke(b.serverMethod, arguments)
                else
                  me.HUB.invoke(b.serverMethod, me.composeRequest(...arguments));
              };
            },
            writeable: true,
            configurable: true,
            enumerable: true
          });


          b.ready = true;
        };
      });
    };
  },

  addBinders: function (binders)
  {
    var me = this;
    me.stop();
    if (Array.isArray(binders))
    {
      binders.forEach(function (b)
      {
        if (!me.isExistingBinder(b))
        {
          me.binders.push(b);
        };
      });
    }
    else if (binders.isHubBinder())
    {
      if (!me.isExistingBinder(binders))
      {
        me.binders.push(binders);
      };
    };
    me.processBinders();
    setTimeout(function () { me.start(); }, 0);
  },

  start: function ()
  {
    var me = this;
    if (me.HUB && typeof me.HUB.start === 'function')
    {
      this.HUB.start().then(function ()
      {
        me.STATUS = 'connected';
      }).catch(function (err)
      {
        return console.error(err.toString());
      });
    };
  },

  stop: function ()
  {
    var me = this;
    me.HUB.stop();
    me.STATUS = 'disconnected';
  },


	/**
	 *  Создает объект запроса к серверу, содержащий сведения
	 *  о запрашиваемой странице и количестве возвращаемых данных.
	 *  По умолчанию (если метод вызван без аргументов), количество
	 *  возвращаемых данных равно 20, номер запрашиваемой страницы = 1.
	 *  Чтобы настроить количество записей и номер страницы, необходимо передать
	 *  в аргументе метода объект вида { Limit: ..., Page: ... }.
	 *  Все прочие параметры вызова серверного метода передаются как есть,
	 *  простым перечислением их в аргументах вызова этого метода.
	 */
  composeRequest: function ()
  {
    var req = {
      Limit: 20,
      Page: 1,
      StoreId: null,
      Params: null,
    };
    var arr;
    Array.from(arguments).forEach(function (f)
    {
      if (f && f.Limit !== undefined && f.Page !== undefined && !isNaN(parseInt(f.Page)) && !isNaN(parseInt(f.Limit)))
      {
        req.Limit = parseInt(f.Limit);
        req.Page = parseInt(f.Page);
      }
      else if (f && f.StoreId !== undefined)
      {
        req.StoreId = f.StoreId;
      }
      else
      {
        arr = f;
      };
    });
    req.Params = JSON.stringify(arr);
    return req;
  },


  checkBinders: function ()
  {
    var me = this;
    var res = Array.isArray(me.binders) && me.binders.every(function (b) { return b.isHubBinder() === true; });
    return res;
  },
  
  isExistingBinder: function (binder)
  {
    var me = this;
    if (me.checkBinders() === true && binder && binder.isHubBinder() === true)
    {
      var check = me.binders.some(function (b) { return b.serverMethod === binder.serverMethod || b.clientEvent === binder.clientEvent || b.hubKey === binder.hubKey || binder.ready === true });
      return check;
    };
  },

});
