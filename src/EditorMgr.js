/** МЕНЕДЖЕР РЕДАКТОРОВ КОНТЕНТА */
Ext.define('ZML.EditorMgr', {

  extend: 'ZML.AbstractMixedCollection',



  EvaluateField: function (itemId)
  {
    var found = this[itemId];
    return found ? found.getCodeValue() : null;
  },

});
