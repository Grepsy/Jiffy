var GameObject = EventTarget.$extend({
  id: null,
  components: null,
  angle: 0,
  parent: null,
  children: null,

  __init__: function(id) {
    if (arguments.length < 2)
      throw "Need at least one ID and one component to initialize game object.";

    this.id = id;
    this.components = Array.prototype.slice.call(arguments);
    this.components.shift(1);
    for (var i = 0; i < this.components.length; i++) {
      this.components[i].container = this;
    }
    for (var i = 0; i < this.components.length; i++) {
      this.components[i].onReady();
    }
    this.children = [];

    log('Created GO ID: ' + id + ' with ' + this.components.length + ' components.');
  },

  getComponent: function(type) {
    for (var i = 0; i < this.components.length; i++) {
      if (this.components[i].type == type)
        return this.components[i];
    }
    return null;
  },

  add: function (obj) {
    this.children.push(obj);
    obj.parent = this;

    obj.onAdded();
  },

  remove: function (obj) {
    obj.onRemoving();

    this.children = this.children.filter(function (item) {
      return item === obj;
    });
    obj.parent = null;
  },

  destroy: function () {
    this.parent.remove(this);
  },

  // Virtual
  onAdded: function () { },

  // Virtual
  onRemoving: function () { }
});