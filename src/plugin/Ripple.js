Ext.define('ZML.plugin.Ripple', {

  extend: 'Ext.AbstractPlugin',
  alias: 'plugin.Ripple',


  autoCenter: false,

  active: false,

  pressed: false,

  noTap: false,

  color: null,

  density: 'light',

  rippleTs: 0,


  init: function (comp)
  {
    var me = this;
    comp.RIPPLE = me;

    var tpl = document.createElement('div');
    tpl.classList.add('x-ripple');
    tpl.setAttribute('no-tap', me.noTap);
    var ripground = document.createElement('div');
    ripground.classList.add('ripple-ground');
    ripground.setAttribute('hidden', me.autoCenter);
    ripground.setAttribute('active', me.active);
    var ripwaves = document.createElement('div');
    ripwaves.classList.add('ripple-waves');
    tpl.appendChild(ripground);
    tpl.appendChild(ripwaves);

    comp.on('render', function ()
    {
      comp.el.dom.appendChild(tpl);
      comp.on('click', function (obj, evt)
      {
        var arr = evt.getXY();
        comp.RIPPLE.pressed = true;
        (comp.RIPPLE.pressed) ? comp.RIPPLE.ripple(arr[0], arr[1]) : comp.RIPPLE.smooth();
        comp.RIPPLE.pressed = false;
      });
    })

  },


  ripple: function (startX, startY)
  {
    var me = this;
    var dom = me.cmp.el.dom;
    if (dom.querySelector('.ripple-waves') === null) return;

    var ripwaves = dom.querySelector('.ripple-waves');
    var ripground = dom.querySelector('.ripple-ground');
    var wave = ripwaves.appendChild(document.createElement('div'));
    var boundings = dom.querySelector('.x-ripple').getBoundingClientRect();
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
    dom.querySelector('.x-ripple').classList.add('rippling');

    data.radius = Math.floor(Math.max(boundings.width, boundings.height)) * 1.5;

    var boundLeft = boundings.left;
    var boundTop = boundings.top;
    var halfRadius = (data.radius / 2);
    var halfBoundWidth = boundings.width / 2;
    var halfBoundHeight = boundings.height / 2;

    data.left = centerX ? (halfBoundWidth) : Math.max(startX, boundLeft) - Math.min(startX, boundLeft);
    data.top = centerY ? (halfBoundHeight) : Math.max(startY, boundTop) - Math.min(startY, boundTop);

    data.left -= halfRadius;
    data.top -= halfRadius;

    data.dx = halfBoundWidth - data.left - halfRadius;
    data.dy = halfBoundHeight - data.top - halfRadius;

    wave.style.height = data.radius + 'px';
    wave.style.top = data.top + 'px';
    wave.style.left = data.left + 'px';
    wave.style.width = data.radius + 'px';

    if (ripground) ripground.classList.add('rippling');

    ripwaves.classList.add('rippling');
    wave.classList.add('rippling');

    requestAnimationFrame(function()
    {
      wave.style.transform = 'translate(' + data.dx + 'px, ' + data.dy + 'px) scale(1)';
      if (!me.pressed) me.smooth();
    });
  },


  smooth: function (force)
  {
    var me = this;
    var dom = me.cmp.el.dom;
    if (dom.querySelector('.ripple-waves') === null) return;

    var ripwaves = dom.querySelector('.ripple-waves');
    var ripground = dom.querySelector('.ripple-ground');
    var elapsed = Date.now() - me.rippleTs;
    var wave = ripwaves.querySelector('.rippling');
    var last = ripwaves.querySelectorAll('.rippling').length < 2;

    if (!wave) return;

    if (!force && elapsed < 400)
    {
      setTimeout(function () { me.smooth(true) }, 420 - elapsed);
      return;
    }

    me.pressed = false;

    if (ripground && last) ripground.classList.remove('rippling');

    wave.classList.remove('rippling');
    wave.classList.add('smoothing');

    setTimeout(function ()
    {
      ripwaves.removeChild(wave) && (ripwaves.children.length || ripwaves.classList.remove('rippling'));
    }, 750);

    dom.querySelector('.x-ripple').classList.remove('rippling');
  },


});