Ext.define('ZML.hub.SignalR', {

  extend: 'Ext.Component',
  alias: 'widget.SignalRHub',

  Url: null,

  Hub: {},
  RESP: {},

  binders: [],

  config: {
    status: null,
  },


  setStatus: function (value)
  {
    var oldstatus = this.getStatus();
    this.status = value;
    if (oldstatus != value)
    {
      this.fireEvent('statusChanged', this, oldstatus, value);
    };
  },


  initComponent: function (config)
  {
    var me = this;
    config = config || {};
    me.initConfig(config);
    me.callParent(arguments);
    me.addEvents('created', 'statusChanged', 'clientEvent');
    me.on({
      created: me.OnCreated,
      statusChanged: me.OnStatusChanged,
      clientEvent: me.OnClientEvent,
      scope: me,
    });

    me.Hub = new signalR.HubConnectionBuilder().withUrl(me.Url).build();
    me.processBinders();
    me.fireEvent('created', me);
  },

  
  OnCreated: function (obj)
  {
    obj.start();
  },


  OnStatusChanged: function (obj, oldvalue, newvalue)
  {
    if (obj)
    {
      if (oldvalue == null && newvalue == 'connected')
      {
        Ext.StoreManager.AutoloadSources();
      };
    };
  },


  OnClientEvent: function (obj, clEventName, clEventData)
  {
    if (obj)
    {
      if (clEventData.storeId)
      {
        var stor = Ext.StoreManager.lookup(clEventData.storeId);

        if (!stor.TREE)
        {
          stor.totalCount = clEventData.totalCount;
          stor.currentPage = clEventData.page;
          stor.pageSize = clEventData.limit;
          stor.loadData(clEventData.data);
        };
        
        if (stor.GRID)
          stor.GRID.query('paging')[0].onLoad();


        if (stor.TREE)
        {
          if (typeof stor.TREE === 'string')
          {
            stor.SetTreeProperty();
          };

          //stor.suspendEvents();

          stor.setRootNode(clEventData.data[0]);

          //stor.resumeEvents();
          //var modelname = stor.model.getName();

          //var treestore = Ext.create('Ext.data.TreeStore', {
          //  model: modelname,
          //  proxy: { type: 'memory' },
          //  rootVisible: false,
          //  root: clEventData.data[0]
          //});
          
          //stor.TREE.store = treestore;
          //stor.TREE.bindStore(treestore);

        };

      };
    };
  },


  start: function ()
  {
    var me = this;
    if (me.Hub && typeof me.Hub.start === 'function')
    {
      me.Hub.start().then(function ()
      {
        me.setStatus('connected');
      }).catch(function (err)
      {
        return console.error(err.toString());
      });
    };
  },


  stop: function ()
  {
    var me = this;
    me.Hub.stop();
    me.setStatus('disconnected');
  },


  processBinders: function ()
  {
    var me = this;
    if (me.checkBinders() === true)
    {
      me.binders.forEach(function (b)
      {
        if (b.ready === false)
        {
          /** Определяем обработчик события, указанного в свойстве clientEvent биндера */
          me.Hub.on(b.clientEvent, function (data)
          {
            var json = JSON.stringify(data);
            me.RESP = JSON.parse(json);
            
            /** Если свойство command текущего биндера не является функцией, либо вообще не указано */
            if (typeof b.command !== 'function')
            {
              /** Если в текущем биндере определено свойство hubKey */
              if (b.hubKey)
              {
                if (data.data !== undefined)
                {
                  var resp = Ext.apply({}, data);
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
                me.fireEvent('clientEvent', me, b.clientEvent, resp);
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

          b.ready = true;
        };
      });
    };
  },


  checkBinders: function ()
  {
    return Array.isArray(this.binders) && this.binders.every(function (b) { return b.isHubBinder() === true; });
  },
})