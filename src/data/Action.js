/** 
 * ИСПОЛНЯЕМОЕ ДЕЙСТВИЕ 
 * Регистрация компонента производится при вызове метода initComponent.
 * Менеджер компонента: ZML.ActionMgr
 */
Ext.define('ZML.data.Action', {

  extend: 'Ext.Component',

  /** Локальный идентификатор действия. */
  itemId: null,

  /** Внешний идентификатор (имя) действия. */
  name: null,

  /** 
   * Тип запуска кода - локально/удаленно.
   * @type {"local"|"database"|"server"|"rest"|"signalr"}
   */
  runAt: 'local',

  url: null,

  method: null,

  /** Текст запроса на подтверждение выполнения этого действия. */
  confirmText: null,

  /** Текст заголовка информационного окна с запросом на подтверждение выполнения этого действия. */
  confirmTitle: 'Подтверждение действия',

  /** Описание действия. */
  description: null,

  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',


  paramLinkers: [],



  initComponent: function ()
  {
    this.callParent(arguments);
    GLOBAL[this.AppNAME].Action.register(this);
  },



  /** Обработчик запроса на подтверждение выполнения этого действия. */
  Handler: function ()
  {
    var me = this;
    if (!!me.confirmText)
    {
      Ext.Msg.show({
        title: me.confirmTitle,
        msg: me.confirmText,
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.QUESTION,
        cls: 'msgbox',
        fn: function (response)
        {
          if (response === 'yes')
          {
            me.Execute();
          };
        }
      });
    }
    else
    {
      me.Execute();
    };
  },

  /** Перенаправление на исполняемый метод. */
  Execute: function ()
  {
    switch (this.runAt)
    {
      case 'local': this.__Execute(); break;

      case 'database':
        if (this._foundAtStoreMgr())
        {
          var me = this;
          Ext.StoreManager.ACTION(this.itemId)[0].on('load', function (st, recs)
          {
            me._ProcessError(st, recs);
          });
          Ext.StoreManager.ACTION(this.itemId)[0].load()
        }
        else
        {
          this._showNotFoundAction();
        };
        break;

      case 'server': break;

      case 'rest': this.DoRequest(); break;

      case 'signalr': break;



      default: break;
    };
  },



  _getParamForRoute: function ()
  {
    var ret = this.paramLinkers.find(function (f) { return f.aspFrom === 'route' });
    return ret ? '/' + ret.value || '' : '';
  },


  _getParamsForQuery: function ()
  {
    var prms = this.paramLinkers.filter(function (f) { return f.aspFrom === 'query' && (!!f.as || !!f.field) });
    return prms.length > 0 ? '?' + prms.map(function (m)
    {
      if (Array.isArray(m.value))
      {
        return m.value.map(function (r) { return m.as + '=' + r }).join('&');
      }
      else
      {
        return m.as + '=' + m.value;
      };
    }).join('&') : '';
  },


  _getParamsForHeaders: function ()
  {
    var prms = this.paramLinkers.filter(function (f) { return f.aspFrom === 'header' && (!!f.as || !!f.field) });
    var headersObj = {};
    prms.forEach(function (f)
    {
      if (!Array.isArray(f.value) && typeof (f.value) === 'object')
      {
        Ext.apply(headersObj, f.value);
      }
      else
      {
        var tempObj = {};
        var key = f.as || f.field;
        tempObj[key] = f.value;
        Ext.apply(headersObj, tempObj);
      };
    });
    return prms.length > 0 ? headersObj : undefined;
  },


  _getParamForBody: function ()
  {
    var ret = this.paramLinkers.find(function (f) { return f.aspFrom === 'body' });
    return !!ret && this.method != 'GET' ? ret.value : null;
  },


  _getOtherParams: function ()
  {
    var prms = this.paramLinkers.filter(function (f) { return !f.aspFrom && (!!f.as || !!f.field) });
    var paramsObj = {};
    prms.forEach(function (f)
    {
      if (!Array.isArray(f.value) && typeof (f.value) === 'object')
      {
        Ext.apply(paramsObj, f.value);
      }
      else
      {
        var tempObj = {};
        var key = f.as || f.field;
        tempObj[key] = f.value;
        Ext.apply(paramsObj, tempObj);
      };
    });
    return prms.length > 0 ? paramsObj : undefined;
  },



  DoRequest: function ()
  {
    var me = this;
    me.paramLinkers.forEach(function (f) { f.compute(); });


    //var paramsObj = {};

    ////var hasQryStringParams = me.paramLinkers.filter(function (p) { return !!p.as || !!p.field; }).length > 0;

    //me.paramLinkers.filter(function (p) { return !!p.as || !!p.field; }).forEach(function (f)
    //{
    //  var tempObj = {};
    //  var key = f.as || f.field;
    //  tempObj[key] = f.value;
    //  Ext.apply(paramsObj, tempObj);
    //});

    ////var qryString = hasQryStringParams ? '?' + me.paramLinkers.filter(function (p) { return !!p.as || !!p.field; }).map(function (m) { return m.as + '=' + m.value }).join('&') : '';

    //var bodyParam = me.paramLinkers.find(function (f) { return !f.as || !f.field; });
    //var bodyRawData = !!bodyParam ? bodyParam.value : null;



    Ext.Ajax.request({
      url: me.url + me._getParamForRoute() + me._getParamsForQuery(),
      method: me.method,
      params: me._getOtherParams(),
      rawData: me._getParamForBody(),
      success: function (resp)
      {
        me.OnAfterRequest(resp.responseText);
      }
    });

  },

  /** 
   * Заглушка метода, непосредственно выполняющего это действие.
   * Эту функцию необходимо переопределить при создании экземпляра этого класса.
   */
  __Execute: function ()
  {
    console.dir(this.itemId + ': Не определена логика выполнения этого действия.')
  },

  /** 
   * Заглушка метода, выполняемого по нажатии на кнопку подтверждения в инфо-окне,
   * выводимом после выполнения этого действия.
   */
  OnConfirmAfterResponse: function ()
  {

  },

  /**
   * Заглушка метода, выполняемого по нажатии на кнопку отмены в инфо-окне,
   * выводимом после выполнения этого действия.
   */
  OnCancelAfterResponse: null,


  OnAfterRequest: function (data)
  {

  },


  /**
   * Отображает инфо-окно с сообщением об ошибке выполнения этого действия (для типа запуска = database).
   * Обрабатывает результаты взаимодействия пользователя с этим инфо-окном, 
   * запускает, в завимости от результата, один из двух методов (OnConfirmAfterResponse или OnCancelAfterResponse).
   * @param {any} title Заголовок инфо-окна.
   * @param {any} warningText Сообщение об ошибке, выводимое в инфо-окне.
   * @param {any} callback Опционально: пользовательский коллбэк, выполняемый вместо показа инфо-окна.
   */
  _ShowErrorMsgBox: function (title, warningText, callback)
  {
    var me = this;
    if (callback && typeof callback === 'function')
    {
      Ext.Msg.show({
        title: title,
        msg: warningText,
        buttons: Ext.Msg.OK,
        fn: callback
      });
    }
    else
    {
      if (me.OnCancelAfterResponse && typeof me.OnCancelAfterResponse === 'function')
      {
        Ext.Msg.show({
          title: title,
          msg: warningText,
          buttons: Ext.Msg.OKCANCEL,
          fn: function (btn, text, eventOptions, record)
          {
            switch (btn)
            {
              case 'ok':
                me.OnConfirmAfterResponse(warningText);
                break;

              case 'cancel':
                me.OnCancelAfterResponse();
                break;

              default:
                me.OnConfirmAfterResponse(warningText);
                break;
            };
          }
        });
      }
      else
      {
        Ext.Msg.show({
          title: title,
          msg: warningText,
          buttons: Ext.Msg.OK,
          fn: function (btn, text, eventOptions, record)
          {
            switch (btn)
            {
              case 'ok':
                me.OnConfirmAfterResponse(warningText);
                break;

              default:
                me.OnConfirmAfterResponse(warningText);
                break;
            };
          }
        });
      };
    };
  },

  /**
   * Обработчик ошибок выполнения этого действия (для типа запуска = database)
   * @param {any} stor Экземпляр хранилища данных, созданного для выполнения этого действия.
   * @param {any} recs Результат выполнения действия в виде набора записей.
   */
  _ProcessError: function (stor, recs)
  {
    var me = this;
    var first = recs[0];
    if (first && first.raw)
    {
      var iserror = first.raw.Error || first.raw.error;
      var errorHeader = first.get('ErrorHeader') || first.get('errorHeader') || 'Ошибка выполнения';
      if (errorText === undefined || errorText === '')
      {
        errorText = first.data.Error || first.data.error || first.get('error') || first.get('Error') || first.get('ErrorText') || first.get('errorText') || iserror;
      };
      if (!errorText)
      {
        return;
      };
      if (errorText != 'ok')
      {
        me._ShowErrorMsgBox(errorHeader, errorText);
        return;
      };
    }
    else
    {
      if (stor.proxy.reader.jsonData.errorText != 'ok')
      {
        me._ShowErrorMsgBox('Ошибка', errorText || stor.proxy.reader.jsonData.errorText);
        return;
      };
    };
  },


  /**
   * Возвращает true, если StoreManager содержит определение для этого действия
   * @private
   * */
  _foundAtStoreMgr: function ()
  {
    return !!Ext.StoreManager.ACTION(this.itemId)[0];
  },

  /**
   * Выводит информационное окно с сообщением об ошибке в случае, если
   * StoreManager не содержит определение для этого действия.
   * @private
   */
  _showNotFoundAction: function ()
  {
    var me = this;
    Ext.Msg.show({
      title: 'Действие не найдено',
      msg: 'StoreManager не содержит определения для действия с идентификатором ' + me.itemId,
      buttons: Ext.Msg.OK,
      icon: Ext.Msg.ERROR,
      cls: 'msgbox',
      fn: function (response)
      {
        if (response === 'ok')
        {
          return;
        };
      }
    });
  },

});
