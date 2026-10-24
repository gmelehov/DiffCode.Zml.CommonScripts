Ext.define('ZML.data.WSStore', {

  extend: 'Ext.data.Store',
  alias: 'store.WSStore',

  autoLoad: false,
  autoSync: true,
  currentPage: 1,
  pageSize: 30,

  Create: null,
  Read: null,
  Update: null,
  Destroy: null,

  paramLinkers: [],

  proxy:
  {
    type: 'memory',
    actionMethods:
    {
      create: null,
      read: null,
      update: null,
      destroy: null
    },

    extraParams: {},
    reader:
    {
      type: 'json',
      root: 'data',
      useSimpleAccessors: true,
      totalProperty: 'totalCount',
      successProperty: 'success',
      messageProperty: 'errorText',
      listeners:
      {
        exception: function (reader, response, error, eOpts)
        {
          console.error('Exception in JSON Reader:', reader, response, Ext.decode(response.responseText));
        }
      }
    },
  },



  init: function ()
  {
    var t = this;
    t.getProxy().actionMethods.create = t.Create;
    t.getProxy().actionMethods.read = t.Read;
    t.getProxy().actionMethods.update = t.Update;
    t.getProxy().actionMethods.destroy = t.Destroy;
    t.getProxy().extraParams = {};
  },


  initParamLinkers: function ()
  {
    var t = this;
    t.__paramLinkers = [].concat(t.paramLinkers);
  },


  processParamLinkers: function ()
  {
    var t = this;
    var proxy = t.getProxy();
    t.__paramLinkers.forEach(function (p)
    {
      p.compute();
      proxy.extraParams[p.as] = p.value;
    });
  },


  listeners: {

    beforeload: function ()
    {
      this.init();
      this.initParamLinkers();
      this.processParamLinkers();
    },

    load: function (st)
    {
      if (st.Read)
      {
        var requestObject = st.ComposeRequest();
        if (window[st.providerId].status === 'connected')
        {
          window[st.providerId].Hub.invoke(st.Read, requestObject);
        };

        st.__paramLinkers = [];
      };
    },

    add: function (st, records, index, eOpts)
    {
      if (st.Create)
      {
        var array = records.map(function (m) { return m.data });
        if (Array.isArray(array))
        {
          window[st.providerId].Hub.invoke(st.Create, array);
          setTimeout(function () { st.load(); }, 0);
        };
      };
    },

    update: function (st, record, oper)
    {
      if (st.Update)
      {
        var array = [];
        array.push(record.data);
        window[st.providerId].Hub.invoke(st.Update, array);
      };
    },

    remove: function (st, records)
    {
      var idProp = st.KEY;
      if (st.Destroy)
      {
        var array = st.removed.map(function (m) { return m.get(idProp); });
        if (Array.isArray(array))
        {
          window[st.providerId].Hub.invoke(st.Destroy, array);
        };
      };
    }
  },


  ComposeRequest: function ()
  {
    var me = this;

    var req = {
      Limit: me.pageSize,
      Page: me.currentPage,
      Params: JSON.stringify(me.getProxy().extraParams),
      StoreId: me.storeId,
    };

    if (me.GRID && me.GRID.filters)
    {
      var parsed = me.GRID.filters.buildQuery(me.GRID.filters.getFilterData());
      if (parsed != null)
        req.Filter = parsed["filter"];
    };

    return req;
  },


  SetTreeProperty: function ()
  {
    var me = this;

    if (me.AppVar && me.TREE && typeof me.TREE === 'string')
    {
      me.TREE = window[me.AppVar].LOC.Tree[me.TREE];
    };
  },

});