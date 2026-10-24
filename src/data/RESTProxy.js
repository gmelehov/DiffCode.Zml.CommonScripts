Ext.define('ZML.data.RESTProxy', {

  extend: 'Ext.data.proxy.Rest',
  alias: 'proxy.RESTProxy',

  url: '',
  path: '',
  timeout: 600000,
  appendId: true,


  actionMethods: {
    create: 'POST',
    read: 'GET',
    update: 'PUT',
    destroy: 'DELETE'
  },

  reader: {
    type: 'json',
    root: 'data',
    useSimpleAccessors: true,
    idProperty: 'Id',
    totalProperty: 'totalCount',
    successProperty: 'success',
    messageProperty: 'errorText',
    listeners: {
      exception: function (reader, response, error, eOpts)
      {
        console.error('Exception in JSON Reader:', reader, response, Ext.decode(response.responseText));
      }
    }
  },

  writer: {
    type: 'json',
    successProperty: 'success',
    messageProperty: 'errorText',
    writeAllFields: true,
    listeners: {
      exception: function (reader, response, error, eOpts) { }
    }
  },


  constructor: function ()
  {
    this.callParent(arguments);
    this.url = this.url + this.path;
    this.noCache = false;
  }
});