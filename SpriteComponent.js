var Sprite = Class.$extend({
  _display: null,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  angle: 0,
  parent: null,
  children: null,
  ctx: null,

  get display() { return this._display; },
  set display(val) {
    for (var i = 0, l = this.children.length; i < l; i++) {
      this.children[i].display = val;
    }
    this._display = val;
  },

  __init__: function (width, height) {
    var canvas = document.createElement('canvas');
    this.width = canvas.width = width;
    this.height = canvas.height = height;
    this.ctx = canvas.getContext('2d');
    this.children = [];
  },

  add: function (obj) {
    this.children.push(obj);
    obj.parent = this;
    obj.display = this.display;

    obj.onAdded();
  },

  remove: function (obj) {
    obj.onRemoving();

    this.children = this.children.filter(function (item) {
      return item === obj;
    });
    obj.parent = null;
    obj.display = null;
  },

  destroy: function () {
    this.parent.remove(this);
  },

  // Virtual
  onAdded: function () { },

  // Virtual
  onRemoving: function () { }
});