Ext.define('ZML.mixin.AfterEventCallback', {


  OnAfterEvent: function (callback, scope)
  {
    if (typeof callback === 'function')
    {
      Ext.Function.defer(callback, 0, scope, arguments);
    };
  },


  OnAfterPropertyChanged: function ()
  {
    
  }
});