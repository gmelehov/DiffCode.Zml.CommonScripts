Ext.define('ZML.plugin.ElementModel', {

  extend: 'Ext.AbstractPlugin',
  alias: 'plugin.ElementModel',

  DATA: null,
  Fields: [],
  KeyProp: null,
  ModelName: null,
  Proxy: null,
  UpdateEvents: [],


  init: function (comp)
  {
    var me = this;
    comp.ELEMENT_MODEL = me;

    me.InitFields();
    me.InitModel();
    me.InitUpdateEvents();

    me.callParent(arguments);
  },


  Load: function ()
  {
    var me = this;
    if (me.__modelInitDone && me.__fieldsInitDone && me.DATA.isModel)
    {
      me.DATA.self.load(me.DATA.getId(), {
        success: function (record, operation)
        {
          me.DATA.fields.keys.forEach(function (k)
          {
            me.DATA.set(k, record.get(k));
          });
          me.DATA.commit();
        },
        callback: function (record, operation, success)
        {
          me.WriteToHost();
        }
      });
    };
  },


  Save: function ()
  {
    this.DATA.save();
  },


  WriteToHost: function ()
  {
    var me = this;
    if (me.__modelInitDone && me.__fieldsInitDone && me.DATA.isModel)
    {
      me.DATA.fields.keys.forEach(function (k)
      {
        me.DATA.fields.get(k).SetSrcProp(me.DATA.get(k));
      });
    };
  },


  UpdateFromHost: function (thenSave)
  {
    var me = this;
    if (me.__modelInitDone && me.__fieldsInitDone && me.DATA.isModel)
    {
      me.DATA.fields.keys.forEach(function (k)
      {
        me.DATA.set(k, me.DATA.fields.get(k).FindSrcProp());
      });
      me.DATA.commit();

      if (!!thenSave)
      {
        me.Save();
      };
    };
  },


  InitFields: function ()
  {
    var me = this;
    if (!me.__fieldsInitDone && Array.isArray(me.Fields))
    {
      var efields = me.Fields.map(function (m)
      {
        m.type = 'EField';
        m.SCOPE = me;
        var ret = Ext.create('ZML.data.ExtendedField', m);
        ret.Get = Ext.bind(ret.Get, ret.SCOPE.cmp);
        //ret.Set = Ext.bind(ret.Set, ret.SCOPE.cmp);
        return ret;
      });
      me.Fields = [].concat(efields);
      me.__fieldsInitDone = true;
    };
  },


  InitModel: function ()
  {
    var me = this;
    if (!me.__modelInitDone && me.__fieldsInitDone && me.KeyProp)
    {
      var modelName = me.ModelName || me.cmp.itemId + '-ElementModel';

      if (me.Proxy)
      {
        Ext.define(modelName, {
          extend: 'Ext.data.Model',
          idProperty: me.KeyProp,
          fields: me.Fields,
          proxy: me.Proxy
        });
      }
      else
      {
        Ext.define(modelName, {
          extend: 'Ext.data.Model',
          idProperty: me.KeyProp,
          fields: me.Fields
        });
      };

      me.DATA = Ext.create(modelName);
      me.__modelInitDone = true;
    };
  },


  InitUpdateEvents: function ()
  {
    var me = this;
    if (!me.__updEventsDone && Array.isArray(me.UpdateEvents))
    {
      me.UpdateEvents.forEach(function (f)
      {
        me.cmp.on(f, me.UpdateFromHost, me);
      });
      me.__updEventsDone = true;
    };
  },



  __fieldsInitDone: false,
  __modelInitDone: false,
  __updEventsDone: false,

});




// Ext.define('LogX.plugin.ElementModel', {

//   extend: 'Ext.AbstractPlugin',
//   alias: 'plugin.ElementModel',


//   DATA: null,

//   Fields: [],

//   KeyProp: null,

//   ModelName: null,

//   Proxy: null,

//   UpdateEvents: [],




//   init: function (comp)
//   {
//     var me = this;
//     comp.ELEMENT_MODEL = me;

//     me.InitFields();
//     me.InitModel();
//     me.InitUpdateEvents();

//     me.callParent(arguments);
//   },






//   Load: function ()
//   {
//     var me = this;
//     if (me.__modelInitDone && me.__fieldsInitDone && me.DATA.isModel)
//     {
//       me.DATA.self.load(me.DATA.getId(), {
//         success: function (record, operation)
//         {
//           me.DATA.fields.keys.forEach(function (k)
//           {
//             me.DATA.set(k, record.get(k));
//           });
//           me.DATA.commit();
//         },
//         callback: function (record, operation, success)
//         {
//           me.WriteToHost();
//         }
//       });
//     };
//   },


//   Save: function ()
//   {
//     this.DATA.save();
//   },




//   WriteToHost: function ()
//   {
//     var me = this;
//     if (me.__modelInitDone && me.__fieldsInitDone && me.DATA.isModel)
//     {
//       me.DATA.fields.keys.forEach(function (k)
//       {
//         me.DATA.fields.get(k).SetSrcProp(me.DATA.get(k));
//       });
//     };
//   },


//   UpdateFromHost: function (thenSave)
//   {
//     var me = this;
//     if (me.__modelInitDone && me.__fieldsInitDone && me.DATA.isModel)
//     {
//       me.DATA.fields.keys.forEach(function (k)
//       {
//         me.DATA.set(k, me.DATA.fields.get(k).FindSrcProp());
//       });
//       me.DATA.commit();

//       if (!!thenSave)
//       {
//         me.Save();
//       };
//     };
//   },


//   InitFields: function ()
//   {
//     var me = this;
//     if (!me.__fieldsInitDone && Array.isArray(me.Fields))
//     {
//       var efields = me.Fields.map(function (m)
//       {
//         m.type = 'EField';
//         m.SCOPE = me;
//         var ret = Ext.create('LogX.data.ExtendedField', m);
//         ret.Get = Ext.bind(ret.Get, ret.SCOPE.cmp);
//         //ret.Set = Ext.bind(ret.Set, ret.SCOPE.cmp);
//         return ret;
//       });
//       me.Fields = [].concat(efields);
//       me.__fieldsInitDone = true;
//     };
//   },


//   InitModel: function ()
//   {
//     var me = this;
//     if (!me.__modelInitDone && me.__fieldsInitDone && me.KeyProp)
//     {
//       var modelName = me.ModelName || me.cmp.itemId + '-ElementModel';

//       if (me.Proxy)
//       {
//         Ext.define(modelName, {
//           extend: 'Ext.data.Model',
//           idProperty: me.KeyProp,
//           fields: me.Fields,
//           proxy: me.Proxy
//         });
//       }
//       else
//       {
//         Ext.define(modelName, {
//           extend: 'Ext.data.Model',
//           idProperty: me.KeyProp,
//           fields: me.Fields
//         });
//       };

//       me.DATA = Ext.create(modelName);
//       me.__modelInitDone = true;
//     };
//   },


//   InitUpdateEvents: function ()
//   {
//     var me = this;
//     if (!me.__updEventsDone && Array.isArray(me.UpdateEvents))
//     {
//       me.UpdateEvents.forEach(function (f)
//       {
//         me.cmp.on(f, me.UpdateFromHost, me);
//       });
//       me.__updEventsDone = true;
//     };
//   },



//   __fieldsInitDone: false,
//   __modelInitDone: false,
//   __updEventsDone: false,

// });