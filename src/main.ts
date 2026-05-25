import { mount } from 'svelte';
import { injectSpeedInsights } from '@vercel/speed-insights';
import App from './components/App.svelte';
import './styles/app.css';

// Initialize Vercel Speed Insights
injectSpeedInsights();

const app = mount(App, { target: document.getElementById('app')! });

export default app;
