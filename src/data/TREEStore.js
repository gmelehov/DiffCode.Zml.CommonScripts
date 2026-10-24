Ext.define('ZML.data.TREEStore', {

  extend: 'Ext.data.TreeStore',
  alias: 'store.TREEStore',

  currentPage: 1,
  rootVisible: false,
  //folderSort: true,
  root: {
    //Id: 1,
    //Name: 'ROOT',
    expanded: false,
    children: [],
  },

  TREE: null,

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
      if (me.TREE)
      {

        me.TREE.getRootNode();

        //me.TREE.dataLoaded = true;
        if (me.TREE.dataLoaded == true)
        {
          me.TREE.getRootNode().eachChild(function (ch)
          {
            ch.destroy();
          });
        };
        me.TREE.OnStoreLoaded();
      };
      if (typeof me.OnAfterLoad === 'function')
      {
        Ext.Function.defer(me.OnAfterLoad, 0, st, [me.__Caller]);
      };
    },
    refresh: function (st)
    {
      if (st && st.isStore && st.TREE)
      {
        st.TREE.OnStoreLoaded();
      };
    },
    write: function (st)
    {
      var me = this;
      if (me.__appendId != null && me.__appendId != undefined)
      {
        me.proxy.appendId = me.__appendId;
      };
      if(me.autoLoad == true) me.reload();
      if (typeof me.OnAfterWrite === 'function')
      {
        Ext.Function.defer(me.OnAfterWrite, 0, st, [me.__Caller]);
      };
    },
  },


  proxy:
  {
    type: 'RESTProxy',
    extraParams: {},
  },


  init: function ()
  {
    var t = this;
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