angular
.module('todoApp', ['ngResource', 'ngSanitize', 'monospaced.elastic', 'ngMdIcons'])
.controller('TodoListController', function($resource, $scope) {

	// Local Model ========================================================

	var todoList = this;
	todoList.todos = []; // list of all todos
	todoList.categories = []; // list of all existing categories
	todoList.filterCategories = []; // list of all categories used for filtering, including FILTER_ANY and FILTER_NONE

	var FILTER_ANY = "any"; // display all todos
	var FILTER_NONE = "none"; // display todos with category <null>
	todoList.selectedCategory = null; // currently displayed category, or FILTER_ANY or FILTER_NONE

	todoList.errors = [];

	// DAOs for reading/writing server model ==============================

	var Category = $resource('categories/:id', {}, {
		get: {method:'GET', isArray:true},
		query: {method:'GET', isArray:true},
		add: {method:'PUT'},
		rename: {method:'POST'},
		remove: {method:'DELETE'}
	});
	var ToDo = $resource('notes/:id', {}, {
		query: {method:'GET', isArray:true},
		get: {method:'GET'},
		add: {method:'PUT'},
		update: {method:'POST'},
		remove: {method:'DELETE'}
	});

	// Load/Validate model ================================================

	function fixToDoData(todo) {
		todo.date = new Date(todo.date);
		todo.text = (todo.title+"\n"+todo.description);
		todo.done = todo.done ? true : false; //explicit cast required for angular
	}

	// Reload all Category and ToDo DAOs from the server and revalidate
	function reload() {
		Category.query(function(data){
			todoList.categories = [];
			for (var i = 0; i < data.length; i++) {
				todoList.categories.push(data[i]);
			}
			todoList.validateAll();
			if (todoList.filterCategories.indexOf(todoList.selectedCategory) === -1) {
				todoList.selectedCategory = FILTER_ANY;
			}
		}, todoList.logError);
		ToDo.query(function(data){
			todoList.todos = [];
			for (var i = 0; i < data.length; i++) {
				fixToDoData(data[i]);
				todoList.todos.push(data[i]);
			}
			todoList.validateAll();
		}, todoList.logError);	
	}

	// Validate the given todo and update its representation on the server
	// This could probably also be solved via $watch, but explicit invokation works for now, too
	todoList.validate = function(item) {
		if(!item.text && !item.lastText) {
			//if no text is set for the todo and it has no previous text (i.e. it was newly created), delete it
			todoList.remove(item);
		} else if(!item.text) {
			//if no new text was entered, revet
			item.text = item.lastText;
		} else {
			// else assume that title and description are united as text and seperate them
			var text = item.text.trim();
			item.lastText = text;
			var index = text.indexOf('\n');
			if (index !== -1) {
				item.title = text.substring(0, index);
				item.description = text.substring(index + 1);
			} else {
				item.title = text;
				item.description = "";
			}

			// and update the db
			ToDo.update({id:item.id}, item, function(data) {
				for(key in data) {
					item[key] = data[key];
				} 
				fixToDoData(item);
			}, function(error) {
				item.text = item.lastText;
				todoList.logError(error);
			});
		}
	};

	// Validate all ToDos and recalculate the categories used for filtering
	todoList.validateAll = function() {
		angular.forEach(todoList.todos, function(todo) {
			todoList.validate(todo);
		});
		todoList.filterCategories = [FILTER_ANY, FILTER_NONE];
		angular.forEach(todoList.categories, function(cat) {
			todoList.filterCategories.push(cat);
		});
	};

	// ToDos ==============================================================

	// Create an new todo with the current category
	todoList.newTodo = function() {
		var category = todoList.selectedCategory;
		if(!category || category == FILTER_ANY || category == FILTER_NONE) {
			category = undefined; //for filter "any" and "none" use the default category
		}

		ToDo.add({title: "", text: "", done: false, category: category, date: new Date()}, function(res) {
			res.editable = true;
			res.text = res.text.trim();
			todoList.todos.push(res);
		}, todoList.logError);
	};

	// Remove a todo from the local model and the db
	todoList.remove = function(item) { 
		ToDo.remove({id: item.id}, null, function() {
			var index = todoList.todos.indexOf(item);
			todoList.todos.splice(index, 1);
		}, todoList.logError);
	};

	// Archive all todos marked as done in the current view, see todoList.remove
	todoList.archive = function() {
		for(var i = todoList.todos.length-1; i >= 0; i--) {
			var todo = todoList.todos[i];
			if (todo.done && todoList.isVisible(todo)) todoList.remove(todo);
		}
	};

	// Number of undone todos in the current view
	todoList.remaining = function() {
		var count = 0;
		angular.forEach(todoList.todos, function(todo) {
			if(!todo.done && todoList.isVisible(todo)) count++;
		});
		return count;
	};

	// Number of todos in the current view
	todoList.count = function() {
		var count = 0;
		angular.forEach(todoList.todos, function(todo) {
			if(todoList.isVisible(todo)) count++;
		});
		return count;
	};

	// Categories =========================================================

	// Show a prompt for creating a new category
	todoList.addCategory = function() {
		var name = prompt("Please enter a name for the new category");
		if(name && todoList.filterCategories.indexOf(name) === -1) {
			//Add the new category on the server
			Category.add({id:name}, null, function() {
				// Add the new category to the listings
				todoList.categories.push(name);
				todoList.filterCategories.push(name);
				// And select it
				todoList.selectedCategory = name;
			}, todoList.logError);
		}
	}

	// Remove the given cateory from all internal lists
	function _removeCategory(cat) {
		var index = todoList.categories.indexOf(cat);
		todoList.categories.splice(index, 1);
		index = todoList.filterCategories.indexOf(cat);
		todoList.filterCategories.splice(index, 1);
	}

	// Remove the given category from the local model and delete it on the server, also deleting all todos assigned to that category
	todoList.removeCategory = function() {
		if(todoList.isSpecialCategory()) {
			return;
		}
		var name = todoList.selectedCategory;
		
		//Remove operations on the server
		Category.remove({id:name}, null, function() {
			//Remove the category from internal listings
			_removeCategory(name);
			//Remove every todo with the given category
			{
				var oldTodos = todoList.todos;
				todoList.todos = [];
				angular.forEach(oldTodos, function(todo) {
					if (todo.category != name) todoList.todos.push(todo);
				});
			}
			//Update the selected category
			todoList.selectedCategory = FILTER_ANY;
		}, todoList.logError);
	}

	// Rename a category in the local model an on the server
	todoList.renameCategory = function() {
		if(todoList.isSpecialCategory()) {
			return;
		}
		var name = prompt("Please enter a new name for the category '" + todoList.selectedCategory + "'");
		if(name) {
			var oldname = todoList.selectedCategory;

			//Rename on the server
			Category.rename({id:oldname}, {name:name}, function () {
				//Remove the old category from internal listings
				_removeCategory(oldname);
				// Add the new category to the listings
				todoList.categories.push(name);
				todoList.filterCategories.push(name);
				//Update the name in every category
				angular.forEach(todoList.todos, function(todo) {
					if(todo.category == oldname) {
						todo.category = name;
					}
				});
				//Update the selected category
				todoList.selectedCategory = name;
			}, todoList.logError);
		}
	}

	// Category Filter ====================================================

	// Return true if the given todo should be currently visible (due to category filtering)
	todoList.isVisible = function(item) {
		if(!todoList.selectedCategory || todoList.selectedCategory == FILTER_ANY) {
			return true;
		} else if (todoList.selectedCategory == FILTER_NONE) {
			return !item.category;
		} else {
			return item.category == todoList.selectedCategory;
		}
	};

	// Retun true if the currently displayed category is a virtual category
	todoList.isSpecialCategory = function() {
		return todoList.selectedCategory == FILTER_ANY || todoList.selectedCategory == FILTER_NONE || !todoList.selectedCategory;
	}

	// Errors =============================================================

	todoList.ignoreError = function(error) {
		var index = todoList.errors.indexOf(error);
		todoList.errors.splice(index, 1);
	}

	todoList.logError = function(error) {
		console.error(error);
		todoList.errors.push({message: extractMessage(error), error:error});
	}

	function extractMessage(object) {
		if (object.message) {
			return object.message;		
		} else if (object.status && object.statusText) {
			return object.status + " " + object.statusText + ": " + extractMessage(object.data);		
		} else {
			return JSON.stringify(object);
		}
	}

	reload();
})
.directive('focusOn', function($timeout) {
	return {
		link: function(scope, element, attrs) {
			scope.$watch(attrs.focusOn, function(value) {
				if(value === true) {
					$timeout(function() {
						element[0].focus();
					});
				}
			});
		}
	};
})
.filter("nl2br", function($filter) {
	return function(data) {
		if (!data) return data;
		return data.replace(/\n\r?/g, '<br />');
	};
});