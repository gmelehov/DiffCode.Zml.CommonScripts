
Ext.define('ZML.data.Store', {

  extend: 'Ext.data.Store',
  alias: 'store.SignalRStore',
  autoLoad: false,
  currentPage: 1,

  CreateMethod: null,
  ReadMethod: null,
  UpdateMethod: null,
  DestroyMethod: null,

  ReadFrom: null,

  paramLinkers: [],


  listeners:
  {
    beforeload: function ()
    {
      this.init();
      this.initParamLinkers();
      this.processParamLinkers();
    },
    load: function (st)
    {
      var me = this;
      if (st.ReadMethod)
      {
        var requestObj = window[st.providerId].composeRequest({ Limit: st.pageSize, Page: st.currentPage }, { StoreId: st.storeId }, st.getProxy().extraParams);

        if (window[st.providerId].STATUS === 'connected')
          window[st.providerId].HUB.invoke(st.ReadMethod, requestObj);
      }
      else
      {
        console.error("ReadMethod is not defined");
      };
      this.__paramLinkers = [];
    },
    add: function (st, records, index, eOpts)
    {
      if (st.CreateMethod)
      {
        //Ext.StoreMgr.ACTION(st.CreateMethod)[0].load();


        //var array = records.map(m => m.data);
        //var prms = st.getProxy().extraParams;
        //if (!Ext.Object.getKeys(prms).length) prms = null;
        //if (Array.isArray(array))
        //{
        //  window[st.providerId].HUB.invoke(st.CreateMethod, array, prms);
        //  st.load();
        //};
      }
      else
      {
        console.error("CreateMethod is not defined");
      };
    },
    update: function (st, record, oper)
    {
      if (st.UpdateMethod)
      {
        //Ext.StoreMgr.ACTION(st.UpdateMethod)[0].load();

        //var array = [];
        //array.push(record.data);
        //var prms = st.getProxy().extraParams;
        //if (!Ext.Object.getKeys(prms).length) prms = null;
        //window[st.providerId].HUB.invoke(st.UpdateMethod, array, prms);
        //st.load();
      }
      else
      {
        console.error("UpdateMethod is not defined");
      }
    },
    remove: function (records)
    {
      var t = this;
      var idProp = t.getProxy().getReader().idProperty;
      var prms = t.getProxy().extraParams;
      if (!Ext.Object.getKeys(prms).length) prms = null;
      if (t.DestroyMethod)
      {
        var array = records.removed.map(m => m.data[idProp]);
        if (Array.isArray(array))
        {
          window[t.providerId].HUB.invoke(t.DestroyMethod, array, prms);
          t.load;
        }
      }
      else
      {
        console.error("DestroyMethod is not defined");
      };
    }
  },

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
    t.getProxy().actionMethods.create = t.CreateMethod;
    t.getProxy().actionMethods.read = t.ReadMethod;
    t.getProxy().actionMethods.update = t.UpdateMethod;
    t.getProxy().actionMethods.destroy = t.DestroyMethod;
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

  ProcessStore: function (storeId, readFrom)
  {
    var me = this;
    var res = window[me.providerId].RESPONSE[readFrom];
    var stor = Ext.StoreMgr.lookup(storeId);
    stor.totalCount = res.totalCount;
    stor.currentPage = res.page;
    stor.pageSize = res.limit;
    stor.loadData(res.data);
    if (stor.GRID)
      stor.GRID.query('paging')[0].onLoad();

    if (typeof me.__Callback === 'function')
    {

      Ext.Function.defer(me.__Callback, 0, stor, [me.__Caller]);
    }
    else
    {
      //console.dir('me.__Callback is not a function');
    }
  },


  GetRecord: function (recIndex)
  {
    var me = this;
    recIndex = recIndex || 0;
    var ret = me.getAt(recIndex);
    return ret;
  },

  GetRecordField: function (fieldName, recIndex)
  {
    var me = this;
    recIndex = recIndex || 0;
    if (fieldName)
    {
      var ret = me.getAt(recIndex).get(fieldName);
      return ret;
    }
    else
    {
      return me.GetRecord(recIndex);
    };
  },


  GetNewRecord: function ()
  {
    var me = this;
    var modelName = me.model.getName();
    var model = Ext.create(modelName);
    me.add(model);
  },


  __paramLinkers: [],

  __Callback: null,
  __Caller: null,

});
