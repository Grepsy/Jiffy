var Actor = PSprite.$extend({
    states: [],
    state: null,
    actions: [],
    input: null,
    
    __init__: function(x, y, width, height, world, states, actions) {
      this.$super(x, y, width, height, world, false);
      
      this.states = states;
      this.actions = actions;
    },
    
    changeState: function(state) {
      if (this.state) {
        this.state.onExit(this);
      }
      this.state = state;
      this.state.onEnter(this);
    },
    
    subscribeToActions: function() {
      for (var i = 0, l = actions.length; i < l; i++) {
        var action = actions[i];
        action.fn = bind(function() {
          this.state.onAction(this, action.name);
        }, this);
        this.input.addListener(action.keycode, action.fn);
      }
    },
    
    unsubscribeFromActions: function() {
      for (var i = 0, l = actions.length; i < l; i++) {
        this.input.removeListener(actions[i].keycode, actions[i].fn);
        delete actions[i].fn;
      }
    },
    
    onAdded: function() {
      this.subscribeToActions();
    },
    
    onRemoved: function() {
      this.unsubscribeFromActions();
    }
})

var State = Class.$extend({
    name: null,
    sprite: null,
    
    __init__: function(name, sprite) {
      this.name = name;
      this.sprite = sprite;
    },
    
    // Virtual
    onEnter: function(actor) {},
    
    // Virtual
    onExit: function(actor) {},
    
    // Virtual
    onAction: function(actor, action) {}
})