import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Header from './components/Header';
import ErrorPage from './ErrorPage';
import Upload from './routes/Upload';
import { Results } from './routes/Results';
import { NewApplicationCycle } from './routes/NewApplicationCycle';
import Login from './components/Login';

import setupLocatorUI from '@locator/runtime';
import { Home } from './routes/Home';

// for locator-js chrome extension used for debugging
if (process.env.NODE_ENV === 'development') {
  setupLocatorUI();
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/upload',
    element: (
      <Upload onUpload={(file) => console.log('File uploaded:', file)} />
    ),
  },
  {
    path: '/new-cycle',
    element: <NewApplicationCycle />,
  },
  {
    path: '/results',
    element: <Results />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Header />
      <RouterProvider router={router} />
    </StrictMode>
  );
}
