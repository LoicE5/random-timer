import { mount } from 'svelte';
import { inject } from '@vercel/analytics';
import App from './components/App.svelte';
import './styles/app.css';

// Initialize Vercel Web Analytics
inject({ mode: import.meta.env.DEV ? 'development' : 'production' });

const app = mount(App, { target: document.getElementById('app')! });

export default app;
