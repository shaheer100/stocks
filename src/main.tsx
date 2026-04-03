import { render } from 'preact'
import { App } from './app.tsx'
import './styles/index.css'

render(<App />, document.querySelector("div#app") as Element);
