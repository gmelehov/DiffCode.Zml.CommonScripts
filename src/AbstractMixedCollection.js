Ext.define('ZML.AbstractMixedCollection', {

  extend: 'Ext.util.MixedCollection',


  listeners: {
    add: function (index, obj, key, eOpts)
    {
      this[key] = obj;
      this.OnItemAdded.bind(this);
    }
  },


  register: function ()
  {
    for (var i = 0, s; (s = arguments[i]); i++)
    {
      this.add(s);
    };
  },


  getKey: function (obj)
  {
    return obj.itemId;
  },


  regObject: function (name, config)
  {
    if (Ext.isObject(name))
    {
      config = name;
    }
    else
    {
      config.itemId = name;
    };
    return this.register(config);
  },


  OnItemAdded: function (index, obj, key, eOpts)
  {

  },


  EvaluateField: function ()
  {

  },

});