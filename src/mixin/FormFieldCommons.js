Ext.define('ZML.mixin.FormFieldCommons', {


  OnFormatChanged: function (obj, oldvalue, newvalue)
  {
    if (obj)
    {
      obj.OnAfterPropertyChanged();
    };
  },


  OnValiditychange: function (obj, oldvalue, newvalue)
  {
    if (obj)
    {
      obj.OnAfterPropertyChanged();
      setTimeout(function ()
      {
        obj.OnAfterEvent(obj.ApiOnValiditychange, obj);
      }, 0);
    };
  },


  OnWriteablechange: function (obj, oldvalue, newvalue)
  {
    if (obj)
    {
      obj.OnAfterPropertyChanged();
    };
  },


  ApiOnValiditychange: null,

  ApiOnChange: null
});