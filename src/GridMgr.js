/** МЕНЕДЖЕР ТАБЛИЦ ДАННЫХ */
Ext.define('ZML.GridMgr', {

  extend: 'ZML.AbstractMixedCollection',


  EvaluateField: function (itemId, field, record)
  {
    var ret;
    var found = this[itemId] || null;
    record = +record;
    if (found)
    {
      var keytype = found.GetKeyType();
      var nullValue;
      switch (keytype)
      {
        case 'string': nullValue = null; break;


        default: nullValue = -1; break;
      };


      var selArray = found.getSelectionModel().getSelection();

      if (selArray.length > 1)
      {
        ret = found.GetSelectedRowField(field);
      }
      else
        if (record == null || record == undefined || record == 0)
        {

          var selected = found.getSelectionModel().getSelection()[0];
          ret = selected ? selected.get(field) : nullValue;
        }
        else
          if (!isNaN(parseInt(record)))
          {
            var foundRecord = found.getStore().getAt(record);
            ret = foundRecord ? foundRecord.get(field) : nullValue;
          };

      //if (!isNaN(parseInt(record)))
      //{
      //  switch (record)
      //  {
      //    case 0:
      //    case undefined:
      //    case null: ret = selArray[0] ? selArray[0].get(field) : found.getStore().getAt(0)?.get(field); break;

      //    default: ret = selArray[record] ? selArray[record].get(field) : found.getStore().getAt(record).get(field); break;
      //  };
      //}
      //else
      //{
      //  //ret = found.getStore().getAt(record).get(field);
      //};
    };
    return ret;
  },

});
