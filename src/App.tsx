import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import './App.css'
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { SyntheticEvent } from 'react';

type TodoStatus = 'todo' | 'done' | 'in_progress';

type Todo = {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus
}

type State = {
  todos: Todo[]
  add: (todo: Todo) => void;
  remove: (id: string) => void;
  title: string;
  setTitle: (arg: string) => void;
  description: string;
  setDescription: (arg: string) => void;
}

const useStore = create<State>((set) => ({
  todos: [],
  title: '',
  description: '',
  add: (todo: Todo) => set((state) => ({ ...state, todos: [...state.todos, {...todo, id: uuidv4()}] })),
  setTitle: (arg: string) => set((state) => ({ ...state,  title: arg})),
  setDescription: (arg: string) => set((state) => ({...state, description: arg})),
  remove: (id: string) => set((state) => ({...state, todos: state.todos.filter((item) => item.id !== id)})),
}))

function App() {
  const [todos, add, remove] = useStore((state) => [state.todos, state.add, state.remove]);
  const [title, setTitle] = useStore((state) => [state.title, state.setTitle])
  const [description, setDescription] = useStore((state) => [state.description, state.setDescription])

  const handleClick = () => {
    const todoData: Todo = {
      id: uuidv4(),
      title,
      description,
      status: 'todo'
    }

    add(todoData);
    setTitle('');
    setDescription('');
  }

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const target = e?.currentTarget;

    if (target.name === 'title') setTitle(target.value);
    else setDescription(target.value);
  }

  return (
    <div>
      <h1>Hello world!</h1>
      <Input value={title} name="title" onChange={handleChange} />
      <Input value={description} name="description" onChange={handleChange} />
      <Button disabled={!title.length} onClick={handleClick}>Add todo</Button>
      {todos.map((todo: Todo) => (
        <div>
          <h4>{todo.title}</h4>
          {todo.description && <p>{todo.description}</p>}
          <Button onClick={() => remove(todo.id)}>Remove {todo.id}</Button>
        </div>
      ))}
    </div>
  )
}

export default App
