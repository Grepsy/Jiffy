var ActorComponent = Component.$extend({
    states: [],
    state: null,
    actions: [],
    input: null,

    __init__: function() {
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
        this.container.addListener(action.name, action.fn);
      }
    },

    unsubscribeFromActions: function() {
      for (var i = 0, l = actions.length; i < l; i++) {
        this.container.removeListener(actions[i].name, actions[i].fn);
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
    // Virtual
    onEnter: function(actor) {},

    // Virtual
    onExit: function(actor) {},

    // Virtual
    onAction: function(actor, action) {}
})