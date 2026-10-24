/** МЕНЕДЖЕР ПОЛЕЙ ВВОДА ДАННЫХ */
Ext.define('ZML.InputMgr', {

  extend: 'ZML.AbstractMixedCollection',



  EvaluateField: function (itemId)
  {
    var found = this[itemId];
    return found ? found.getSubmitValue() : null;
  },

});
