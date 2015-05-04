
require.config({
	paths: {
		jquery: 'jquery-2.1.1.min'
		}
	});
	
	
	
	
	define("taskRender", ["jquery"], function($) {
		"use strict";
		
			var taskTemplate = '<li class="task"><input class="complete" type="checkbox" /> <input class="description" type="text" placeholder="Enter task description..." /> <button class="delete-button">Delete</button></li>';

			function renderTasks(tasks) {
				var elementArray = $.map(tasks, _renderTask);

				$("#task-list")
					.empty()
					.append(elementArray);
			}

			function renderNew() {
				var $taskList = $("#task-list");
				$taskList.prepend(_renderTask({}));
			}

			function _renderTask(task) {
				var $task = $(taskTemplate);
				if(task.complete) {
					$task.find(".complete").attr("checked", "checked");
				}
				$task.find(".description").val(task.description);
				return $task;
			}
			
			return {
				renderTasks:renderTasks,
				renderNew:renderNew				
			}
		});
		
		//data is the folder structure.. taskdata is the name of the file now.. not the defined name...
		//can't go up folders with ../
		
		
	define("tasks",["jquery","taskRender","data/taskData"],function($,taskRender,taskData) {
		"use strict";
		
		/* task management */

		function add() {
			taskRender.renderNew();
		}

		function remove(clickEvent) {
			var taskElement = clickEvent.target;
			$(taskElement).closest(".task").remove();
		}

		function clear() {
			taskData.clear();
			render();
		}

		function save() {
			var tasks = [];
			$("#task-list .task").each(function (index, task) {
				var $task = $(task);
				tasks.push({
					complete: $task.find(".complete").prop('checked'),
					description: $task.find(".description").val()
				});
			});

			taskData.save(tasks);
		}

		function cancel() {
			render();
		}

		function render() {
			taskRender.renderTasks(taskData.load());
		}
		
		return {
			add:add,
			remove:remove,
			clear:clear,
			save:save,
			cancel:cancel,
			render:render
		};
		
		
	});
	
	
	
require(["jquery","tasks"],
	function($,tasks) {

		/* register event handlers */

		function registerEventHandlers() {
			$("#new-task-button").on("click", tasks.add);
			$("#delete-all-button").on("click", tasks.clear);
			$("#save-button").on("click", tasks.save);
			$("#cancel-button").on("click", tasks.cancel);
			$("#task-list").on("click", ".delete-button", tasks.remove);
		}

		/* initialize application */

		$(function () {
			registerEventHandlers();
			tasks.render();
		});
});
