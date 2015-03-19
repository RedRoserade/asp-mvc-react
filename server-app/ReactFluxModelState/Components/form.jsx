/*global React, _, $, fluxxor*/

(function () {
var constants = {
  ADD_TODO: "ADD_TODO",
  TOGGLE_TODO: "TOGGLE_TODO",
  CLEAR_TODOS: "CLEAR_TODOS"
};

var TodoStore = Fluxxor.createStore({
  initialize: function() {
    this.todos = [];
    this.validationState = {};

    this.bindActions(
      constants.ADD_TODO, this.onAddTodo,
      constants.TOGGLE_TODO, this.onToggleTodo,
      constants.CLEAR_TODOS, this.onClearTodos
    );
  },
  validate() {
      this.__debouncedValidate = this.__debouncedValidate || _.debounce(() => {
          $.ajax({
              url: '/api/validations/todo',
              type: 'post',
              data: JSON.stringify({
                  todos: this.todos
              }),
              contentType: 'application/json;charset=utf-8'
          })
          .done(() => {
              console.log('on done');
              console.log(this);
              this.validationState = {};
              this.emit("change");
          })
          .fail((err) => {
              this.validationState = JSON.parse(err.responseText).ModelState;
              this.emit('change');
          });
      }, 1000);

      this.__debouncedValidate();
  },
  onAddTodo: function(payload) {
    this.todos.push(payload);
    this.validate();
    this.emit('change');
  },

  onToggleTodo: function(payload) {
    payload.todo.complete = !payload.todo.complete;
    this.validate();
    this.emit("change");
  },

  onClearTodos: function() {
    this.todos = this.todos.filter(function(todo) {
      return !todo.complete;
    });
    this.validate();
    this.emit("change");
  },

  getState: function() {
    return {
      todos: this.todos,
      validationState: this.validationState
    };
  },

  getValidationState() {
      return this.validationState
  }

});

var actions = {
  addTodo: function(text) {
    this.dispatch(constants.ADD_TODO, {text: text});
  },

  toggleTodo: function(todo) {
    this.dispatch(constants.TOGGLE_TODO, {todo: todo});
  },

  clearTodos: function() {
    this.dispatch(constants.CLEAR_TODOS);
  }
};

var stores = {
  TodoStore: new TodoStore()
};

var flux = new Fluxxor.Flux(stores, actions);

flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ModelStateMixin = function (storeName) {
    var store = flux.store(storeName);

    this.validationMessageFor = (propName) => {
        var state = store.getValidationState();

        console.log(state);

        return state[`model.${propName}`];
    };
};

var Application = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("TodoStore"), ModelStateMixin("TodoStore")],

    getInitialState: function() {
        return { newTodoText: "" };
    },

    getStateFromFlux: function() {
        var flux = this.getFlux();
        // Our entire state is made up of the TodoStore data. In a larger
        // application, you will likely return data from multiple stores, e.g.:
        //
        //   return {
        //     todoData: flux.store("TodoStore").getState(),
        //     userData: flux.store("UserStore").getData(),
        //     fooBarData: flux.store("FooBarStore").someMoreData()
        //   };
        return flux.store("TodoStore").getState();
    },

    render: function() {
        return (
          <div>
            <ul>
              {this.state.todos.map(function(todo, i) {
                return (<li key={i}>
                    <TodoItem todo={todo} />
                    {this.validationMessageFor(`todos[${i}].text`)}
                </li>);
              })}
            </ul>
            <form onSubmit={this.onSubmitForm}>
              <input type="text" size="30" placeholder="New Todo"
                     value={this.state.newTodoText}
                     onChange={this.handleTodoTextChange} />

              <input type="submit" value="Add Todo" />
            </form>

            <button onClick={this.clearCompletedTodos}>Clear Completed</button>
          </div>
        );
    },

    handleTodoTextChange: function(e) {
        this.setState({newTodoText: e.target.value});
    },

    onSubmitForm: function(e) {
        e.preventDefault();
        // if (this.state.newTodoText.trim()) {
          this.getFlux().actions.addTodo(this.state.newTodoText);
          this.setState({newTodoText: ""});
        // }
    },

    clearCompletedTodos: function(e) {
        this.getFlux().actions.clearTodos();
    }
});

var TodoItem = React.createClass({
  mixins: [FluxMixin],

  propTypes: {
    todo: React.PropTypes.object.isRequired
  },

  render: function() {
    var style = {
      textDecoration: this.props.todo.complete ? "line-through" : ""
    };

    return <span style={style} onClick={this.onClick}>{this.props.todo.text}</span>;
  },

  onClick: function() {
    this.getFlux().actions.toggleTodo(this.props.todo);
  }
});

React.render(<Application flux={flux} />, document.getElementById("container"));
}());
