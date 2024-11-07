import { createRoot } from 'react-dom/client';
import { App } from './components/App/App';

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('root');
  if (!container) return;
  const root = createRoot(container);
  root.render(<App />);
});
