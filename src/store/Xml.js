/** ХРАНИЛИЩЕ ДАННЫХ ДЛЯ ВЗАИМОДЕЙСТВИЯ С XML-ИСТОЧНИКОМ */
Ext.define('ZML.store.Xml', {

  extend: 'Ext.data.Store',
  alias: 'store.Xml',

  /** Адрес источника */
  url: null,
  record: null,
  idPath: null,
  root: null,


  constructor: function (config)
  {
    config = Ext.apply({
      proxy: {
        type: 'ajax',
        url: config.url,
        reader: {
          type: 'xml',
          record: config.record,
          root: config.root
        },
        writer: 'xml'
      }
    }, config);

    this.callParent([config]);
  },

});
