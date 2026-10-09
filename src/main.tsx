import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No se encontró el contenedor raíz de la aplicación.');
}

createRoot(rootElement).render(<App />);
document.getElementById('runtime-help')?.remove();
