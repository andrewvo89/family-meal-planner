import './index.css';

import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';
import dayjs from 'dayjs';
import en_au from 'dayjs/locale/en-au';
import { store } from 'store';

dayjs.locale({ ...en_au, weekStart: 1 });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <ChakraProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ChakraProvider>
    </DndProvider>
  </React.StrictMode>,
);
