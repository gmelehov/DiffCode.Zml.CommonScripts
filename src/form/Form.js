/**
 * ФОРМА ВВОДА ДАННЫХ
 * @alias Form
 * @manager ZML.FormMgr
 * @registration initComponent
 */
Ext.define('ZML.form.Form', {

  extend: 'Ext.form.Panel',
  alias: 'widget.Form',

  AppNAME: 'APP',


  listeners: {
    afterrender(obj)
    {
      console.dir(obj);
    }
  },


  initComponent(config)
  {
    var me = this;
    me.callParent(arguments);
    me.initConfig(config);
    GLOBAL[this.AppNAME].Form.register(me);
  },
});
