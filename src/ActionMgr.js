/** МЕНЕДЖЕР ИСПОЛНЯЕМЫХ ДЕЙСТВИЙ */
Ext.define('ZML.ActionMgr', {

  extend: 'ZML.AbstractMixedCollection',

  listeners: {
    add: function (index, obj, key, eOpts)
    {
      this[key] = obj.Handler.bind(obj);
      this.OnItemAdded.bind(this);
    }
  },

});
