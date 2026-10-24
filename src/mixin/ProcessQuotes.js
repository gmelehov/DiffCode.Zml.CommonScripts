Ext.define('ZML.mixin.ProcessQuotes', {

  convertQuotes: false,


  CountQuotes: function (quote)
  {
    var me = this;
    var val = me.getValue();
    quote = quote || '"';
    var count = val.split('').filter(function (f)
    {
      return f === quote;
    }).length;
    return count;
  },


  ReplaceQuotes: function ()
  {
    var me = this;
    var val = me.getValue();
    var openQuotes = me.CountQuotes('«');
    var closeQuotes = me.CountQuotes('»');

    switch ((openQuotes + closeQuotes) % 2)
    {
      case 0:
        me.setValue(val.split('').join('').replace('"', '«').split('').reverse().join('').replace('"', '»').split('').reverse().join(''));
        break;

      case 1:
        if (openQuotes > closeQuotes)
        {
          me.setValue(val.split('').reverse().join('').replace('"', '»').split('').reverse().join(''));
        }
        else
        {
          me.setValue(val.split('').join('').replace('"', '«'));
        };
        break;

      default:
        break;
    };
  }
});