const todoAPI = (() => {
    const baseurl = 'http://localhost:3000';
    const todoPath = 'todos';

    const getAllTodos = () =>
        fetch([baseurl, todoPath].join('/'))
            .then((response) => response.json());

    const deleteTodo = id =>
        fetch([baseurl, todoPath, id].join('/'), { method: 'DELETE' });

    const creatTodo = todoitem =>
        fetch([baseurl, todoPath].join('/'), {
            method: 'POST',
            body: JSON.stringify(todoitem),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json());
    return {
        getAllTodos,
        deleteTodo,
        creatTodo
    };
})();
const View = (() => {
    const domString = {
        todolist: 'todolist-content',
        deletebtn: 'delete-btn',
        todoinput: 'todolist__input'
    }
    const render = (element, htmltmp) => {
        element.innerHTML = htmltmp;
    }
    const creatHtmlTmp = dataArr => {
        let htmltmp = '';
        dataArr.forEach(ele => {
            htmltmp += `
                    <li>
                        <span>
                            ${ele.title}
                        </span>
                        <button class="delete-btn" id="${ele.id}">
                            X
                        </button>
                    </li>
                `;
        });
        return htmltmp;
    }
    return {
        domString,
        render,
        creatHtmlTmp
    }
})();
// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Model
const Model = ((api, view) => {
    class Todo {
        constructor(title) {
            this.userId = 23;
            this.title = title;
            this.completed = false;
        }
    }
    class State {
        #todolist = [];
        get todolist() {
            return this.#todolist;
        }
        set todolist(dataArr) {
            this.#todolist = dataArr;
            const todolistElement = document.querySelector('#' + view.domString.todolist);
            const htmltmp = view.creatHtmlTmp(this.#todolist);
            view.render(todolistElement, htmltmp);
        }
    }
    class Task{
        constructor(id, title, isTask,isOverdue,counter){
            this.id=id,
            this.title=title,
            this.isTask=isTask,
            this.counter=counter
        }
    }
    const tasks=[
        new Task(1,"camp task", true,true,1),
        
    ];
    return{
        tasks
    };
    



    
    const getAllTodos = api.getAllTodos;
    const deleteTodo = api.deleteTodo;
    const creatTodo = api.creatTodo;
    return {
        State,
        Todo,
        getAllTodos,
        deleteTodo,
        creatTodo
    }
})(todoAPI, View);







// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Controler
const Controler = ((view, model) => {
    const state = new model.State();
    const addLisenerOnInput = () => {
        const todoinput = document.querySelector('#' + view.domString.todoinput);
        todoinput.addEventListener('keyup', event => {
            if (event.key === 'Enter') {
                const todoitem = new model.Todo(event.target.value);
                model.creatTodo(todoitem).then(data => {
                    state.todolist = [data, ...state.todolist];
                    event.target.value = '';
                });
            }
        });
    }
    const addLisenerOnDelete = () => {
        const todolistElement = document.querySelector('#' + view.domString.todolist);
        todolistElement.addEventListener('click', (event) => {
            state.todolist = state.todolist.filter(ele => +ele.id !== +event.target.id);
            model.deleteTodo(event.target.id);
        });
    }
    const init = () => {
        model.getAllTodos().then(data => {
            state.todolist = data;
        });
        addLisenerOnDelete();
        addLisenerOnInput();
    }
    return {
        init
    }

})(View, Model);
// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Bootstrap
Controler.init();