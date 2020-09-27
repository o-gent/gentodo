/* eslint-disable react/prop-types */
import React from "react"

import './Todo.css'

const APIURL = "http://localhost:8000/api/"

class Todo extends React.Component {
    constructor() {
        super()
        this.state = {
            data: [],
            submissionText: "",
            error: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.newTodoHandleChange = this.newTodoHandleChange.bind(this)
        this.newTodoHandleSubmit = this.newTodoHandleSubmit.bind(this)
    }

    getPosts() {
        (async () => {
            // get todos list
            try{
                const response = await fetch(`${APIURL}todo/listall`)
                const json = await response.json()
                this.setState({data: json})
            }
            catch{
                this.setState({"error": "could not connect to the server"})
            }
        })()
    }

    toggleTodo(_id, done) {
        (async () => {
            // toggle a todo to done
            const response = await fetch(`${APIURL}todo/toggle?_id=${_id}&done=${done}`)
            const json = await response.json()
            console.log(json)
            this.getPosts()
        })()
    }

    newPost(text) {
        (async () => {
            // submit a new post
            const response = await fetch(`${APIURL}todo/new?text=${text}`)
            const json = await response.json()
            console.log(json)
            this.getPosts()
        })()
    }
    
    removePost(_id) {
        (async () => {
            // remove a post
            const response = await fetch(`${APIURL}todo/remove?_id=${_id}`)
            const json = await response.json()
            console.log(json)
            this.getPosts()
        })()
    }

    componentDidMount() {
        this.getPosts()
    }

    handleChange(_id, done) {
        // toggle checkbox for id
        this.setState((prevState) => {
            const newData = prevState.data.map(item => {
                if(item._id === _id){
                    return {
                        ...item,
                        done: !item.done
                    }
                }
                return item
            })

            return {
                data: newData
            }
        })
        this.toggleTodo(_id, done)  
    }

    newTodoHandleChange(event) {
        // input text for new post submission
        this.setState({submissionText: event.target.value})
    }

    newTodoHandleSubmit(event) {
        // handle new post event
        this.newPost(this.state.submissionText)
        this.setState({submissionText: ""})
        event.preventDefault()
    }

    render() {
        const todolist = this.state.data.map(item => {
            return <TodoItem 
                text={item.text} 
                key={item._id} 
                done={item.done} 
                handleChange={() => this.handleChange(item._id, !item.done)}
                handleClick={() => this.removePost(item._id)}
            />
        })

        // const sortableTodoList = <SortableList 
        //     data={this.state.data} 
        //     handleChange={this.handleChange}
        //     removePost={this.removePost}
        //     onSortEnd={this.onSortEnd}
        // />

        return (
            <div className="todo-list">
                <h1 style={{color:"black"}} > Todo list </h1>
                <h3 style={{color:"black", background:"red"}}>{this.state.error}</h3>
                {todolist}
                <NewTodoItem 
                    value={this.state.submissionText} 
                    handleChange={this.newTodoHandleChange} 
                    handleSubmit={this.newTodoHandleSubmit}
                />
            </div>
        )
    }

}

function TodoItem(props) {
    return (
        <div className="todo-item">
            <p className="todo-item-text">{props.text}</p>
            <input type="checkbox" checked={props.done} onChange={props.handleChange} />
            <input type="button" onClick={props.handleClick} value="remove"/>
        </div>
    )
}

function NewTodoItem({value, handleChange, handleSubmit}) {
    return (
        <div className="new-todo-item">
            <h3>
                New todo item:
            </h3>
            <form onSubmit={handleSubmit}>
                <label>
                    What do you need to do?:
                    <input type="text" value={value} onChange={handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

// const SortableItem = SortableElement(({text, done, handleClick, handleChange}) => {
//     return (
//         <div className="todo-item">
//             <p className="todo-item-text">{text}</p>
//             <input type="checkbox" checked={done} onChange={handleChange} />
//             <input type="button" onClick={handleClick} value="remove"/>
//         </div>
//     )
// })

// const SortableList = SortableContainer(({data, handleChange, removePost}) => {
//         return (
//             data.map(item => {
//                 return <SortableItem 
//                     text={item.text} 
//                     key={item._id} 
//                     done={item.done} 
//                     handleChange={() => handleChange(item._id, !item.done)}
//                     handleClick={() => removePost(item._id)}
//                 />
//             })
//         )
// })


export default Todo
