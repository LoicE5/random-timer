import { mount } from 'svelte';
import App from './components/App.svelte';
import './styles/app.css';

const app = mount(App, { target: document.getElementById('app')! });

export default app;
