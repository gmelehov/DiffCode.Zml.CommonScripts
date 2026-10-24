/** МЕНЕДЖЕР КОМБОБОКСОВ */
Ext.define('ZML.ComboMgr', {

  extend: 'ZML.AbstractMixedCollection',


  EvaluateField: function (itemId, field, record)
  {
    var found = this[itemId];
    var ret;
    if (record == null || record == undefined || isNaN(parseInt(record)))
    {
      record = -1;
    };
    if (found)
    {
      switch (field)
      {
        case 'display':
        case 'displayField': ret = found.getDisplayValue(); break;

        case 'descr':
        case 'descrField': ret = found.getDescriptionValue(); break;

        case 'value':
        case 'valueField': ret = found.getValue(); break;


        default:
          var temp = found.lastSelection.map(function (m) { return m.data[field] });
          ret = record > -1 ? temp[record] : temp;
          break;
      };
    };
    return ret;
  },

});