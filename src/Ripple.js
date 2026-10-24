Ext.define('ZML.Ripple', {

  extend: 'Ext.Component',
  alias: 'widget.Ripple',


  width: 250,
  height: 250,

  baseCls: 'x-ripple',


  autoCenter: false,

  active: false,

  pressed: false,

  noTap: false,

  color: null,

  density: 'light',

  rippleTs: 0,



  listeners: {
    render: function (ct, position)
    {
      this.superclass.onRender.call(this, ct, position);
      this.el.update(this.tpl.apply(this));
    },
    afterrender: function ()
    {
      var me = this;
      me.el.on('click', function (e)
      {
        e.preventDefault();
        console.dir(e);
        me.pressed = true;
        (me.pressed) ? me.ripple(e.browserEvent.x, e.browserEvent.y) : me.smooth();
        me.pressed = false;
      });
    }
  },


  initComponent: function ()
  {
    var me = this;
    me.callParent(arguments);

    me.tpl = new Ext.XTemplate(
      '<div class="ripple-ground" hidden="{autoCenter}" active="{active}"></div>',
      '<div class="ripple-waves"></div>'
    );

  },


  contentUpdate: function ()
  {
    this.el.dom.setAttribute('no-tap', this.noTap);
    this.el.dom.setAttribute('density', this.density);
    this.el.update(this.tpl.apply(this));

  },


  ripple: function (startX, startY)
  {
    var me = this;
    if (me.el.dom.querySelector('.ripple-waves') === null) return;

    var ripwaves = me.el.dom.querySelector('.ripple-waves');
    var ripground = me.el.dom.querySelector('.ripple-ground');
    var wave = ripwaves.appendChild(document.createElement('div'));
    var boundings = me.el.dom.getBoundingClientRect(); 
    var centerX = (startX === undefined || startX === null || Number.isNaN(startX)) || !ripground || ripground.hasAttribute('hidden');
    var centerY = (startY === undefined || startY === null || Number.isNaN(startY)) || !ripground || ripground.hasAttribute('hidden');
    var data = {
      radius: 0,
      left: 0,
      top: 0,
      dx: 0,
      dy: 0
    };

    me.rippleTs = Date.now();
    me.el.dom.classList.add('rippling');

    data.radius = Math.floor(Math.max(boundings.width, boundings.height)) * 1.5;
    data.left = (centerX ? (boundings.width / 2) : Math.max(startX, boundings.left) - Math.min(startX, boundings.left)) - (data.radius / 2);
    data.top = (centerY ? (boundings.height / 2) : Math.max(startY, boundings.top) - Math.min(startY, boundings.top)) - (data.radius / 2);
    data.dx = (boundings.width / 2) - data.left - (data.radius / 2);
    data.dy = (boundings.height / 2) - data.top - (data.radius / 2);

    wave.style.height = data.radius + 'px';
    wave.style.top = data.top + 'px';
    wave.style.left = data.left + 'px';
    wave.style.width = data.radius + 'px';

    if (ripground) ripground.classList.add('rippling');

    ripwaves.classList.add('rippling');
    wave.classList.add('rippling');

    requestAnimationFrame(() =>
    {
      wave.style.transform = 'translate(' + data.dx + 'px, ' + data.dy + 'px) scale(1)';
      if (!me.pressed) me.smooth();
    });
  },


  smooth: function (force)
  {
    var me = this;
    if (me.el.dom.querySelector('.ripple-waves') === null) return;

    var ripwaves = me.el.dom.querySelector('.ripple-waves');
    var ripground = me.el.dom.querySelector('.ripple-ground');
    var elapsed = Date.now() - me.rippleTs;
    var wave = ripwaves.querySelector('.rippling');
    var last = ripwaves.querySelectorAll('.rippling').length < 2;

    if (!wave) return;

    if (!force && elapsed < 200)
    {
      setTimeout(function () { me.smooth(true) }, 200 - elapsed);
      return;
    }

    this.pressed = false;

    if (ripground && last) ripground.classList.remove('rippling');

    wave.classList.remove('rippling');
    wave.classList.add('smoothing');

    setTimeout(function ()
    {
      ripwaves.removeChild(wave) && (ripwaves.children.length || ripwaves.classList.remove('rippling'));
    }, 400);

    me.el.dom.classList.remove('rippling');
  },

});