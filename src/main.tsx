import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Root from './routes/Root';
import ErrorPage from './ErrorPage';
import Upload from './routes/Upload';
import { NewApplicationCycle } from './routes/NewApplicationCycle';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/upload',
    element: <Upload onUpload={(file) => console.log('File uploaded:', file)} />,
  },
  {
    path: '/new-cycle',
    element: <NewApplicationCycle />,
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
