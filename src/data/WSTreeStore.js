Ext.define('ZML.data.WSTreeStore', {

  extend: 'Ext.data.TreeStore',
  alias: 'store.WSTreeStore',

  autoLoad: false,
  autoSync: false,
  rootVisible: false,
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
          if (window[st.providerId].status === 'connected')
          {
            window[st.providerId].Hub.invoke(st.Create, array);
            setTimeout(function () { st.load(); }, 0);
          };
        };
      };
    },

    update: function (st, record, oper)
    {
      if (st.Update)
      {
        //var array = [];
        //array.push(record.data);
        if (window[st.providerId].status === 'connected')
        {
          //window[st.providerId].Hub.invoke(st.Update, record.data);
        };        
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
          if (window[st.providerId].status === 'connected')
          {
            window[st.providerId].Hub.invoke(st.Destroy, array);
          };          
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

    if (me.TREE && me.TREE.filters)
    {
      var parsed = me.TREE.filters.buildQuery(me.TREE.filters.getFilterData());
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


  UpdateRecords: function ()
  {
    var me = this;
    if (me.Update && me.getUpdatedRecords().length)
    {
      var array = me.getUpdatedRecords().map(function (m) { return m.data; });
      window[me.providerId].Hub.invoke(me.Update, array);
      me.getUpdatedRecords().forEach(function (f) { f.commit(); });
    };
  },

});