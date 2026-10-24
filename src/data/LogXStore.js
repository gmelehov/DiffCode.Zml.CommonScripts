Ext.define('ZML.data.LogXStore', {

  extend: 'LogX.data.Store',
  alias: 'store.LogXStore',

  currentPage: 1,
  autoSync: true,

  ObjectType: null,

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
      this.__paramLinkers = [];
      if (me.GRID)
      {
        me.GRID.OnStoreLoaded();
      };
      if (typeof me.OnAfterLoad === 'function')
      {
        Ext.Function.defer(me.OnAfterLoad, 0, st, [me.__Caller]);
      };
    },
    refresh: function (st)
    {
      if (st && st.isStore && st.GRID)
      {
        st.GRID.OnStoreLoaded();
      };
    },
    write: function (st)
    {
      var me = this;
      if (me.__appendId != null && me.__appendId != undefined)
      {
        me.proxy.appendId = me.__appendId;
      };
      me.reload();
      if (typeof me.OnAfterWrite === 'function')
      {
        Ext.Function.defer(me.OnAfterWrite, 0, st, [me.__Caller]);
      };
    },
  },


  proxy:
  {
    type: 'dddProxy',
    extraParams: {},
  },

  init: function ()
  {
    var t = this;
    t.getProxy().extraParams = {};
    if (t.sourceId)
    {
      t.getProxy().setExtraParam('sourceId', t.sourceId);
    };
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
      if (typeof me.getAt === 'function' && me.getAt(recIndex))
      {
        return me.getAt(recIndex).get(fieldName);
      };
    }
    else
    {
      return me.GetRecord(recIndex);
    };
  },


  SetRecordField: function (fieldName, val, recIndex)
  {
    var me = this;
    recIndex = recIndex || 0;
    if (fieldName)
    {
      me.GetRecord(recIndex).set(fieldName, val);
    };
  },


  GetTotalPages: function ()
  {
    var me = this;
    return me.pageSize > 0 ? Math.ceil(me.totalCount / me.pageSize) : 0;
  },


  GetNewRecord: function ()
  {
    var me = this;
    var modelName = me.model.getName();
    var model = Ext.create(modelName);
    me.add(model);
  },


  LinkersHaveValues: function ()
  {
    var me = this;
    var countLinkers = me.paramLinkers.length;
    return countLinkers == 0 || me.paramLinkers.every(function (ev) { return ev.value !== undefined && ev.value !== null && ev.value !== -1 });
  },


  AddAndSaveRecord: function (rec)
  {
    var me = this;
    me.__appendId = me.proxy.appendId;
    me.proxy.extraParams = {};
    me.proxy.appendId = false;
    rec.phantom = rec.phantom || true;
    me.add(rec);
    me.last().phantom = true;
    me.save();
  },


  __paramLinkers: [],


  OnAfterLoad: null,

  OnAfterWrite: null,

  __Caller: null,

  __appendId: null,

});
