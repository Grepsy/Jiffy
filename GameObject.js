var GameObject = EventTarget.$extend({
  components: null,
  angle: 0,
  parent: null,
  children: null,

  __init__: function() {
    if (arguments.length < 1)
      throw "Need at least one component to initialize game object.";

    this.components = arguments;
    for (var i = 0; i < this.components.length; i++) {
      this.components[i].container = this;
    }
    for (var i = 0; i < this.components.length; i++) {
      this.components[i].onReady();
    }
    this.children = [];
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