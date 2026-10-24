/** МЕНЕДЖЕР ЗАГРУЗЧИКОВ */
Ext.define('ZML.LoaderMgr', {

  extend: 'ZML.AbstractMixedCollection',


  listeners: {
    add: function (index, obj, key, eOpts)
    {
      this[key] = obj;
      this.OnItemAdded.bind(this);
    }
  },


  EvaluateField: function (itemId, field)
  {
    var found = this[itemId];
    if (!!found)
    {
      switch (field)
      {
        case 'url': return found.GetUrl();
        case 'mode': return found.GetRenderMode();


        default: return null;
      };
    };
  },

});