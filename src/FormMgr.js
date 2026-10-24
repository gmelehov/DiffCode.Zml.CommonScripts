/** МЕНЕДЖЕР ФОРМ ВВОДА ДАННЫХ */
Ext.define('ZML.FormMgr', {

  extend: 'ZML.AbstractMixedCollection',



  EvaluateField: function (itemId, field)
  {
    //field = '#' + field;
    //var found = this[itemId] ? this[itemId].query(field)[0] : null;
    var found = this[itemId];
    return found ? found.getSubmitValue() : null;
  },

});
