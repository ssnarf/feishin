import { useEffect } from 'react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { initSimpleImg } from 'react-simple-img';
import { BaseContextModal } from './components';
import { useTheme } from './hooks';
import { AppRouter } from './router/app-router';
import { useSettingsStore } from './store/settings.store';
import './styles/global.scss';
import '@ag-grid-community/styles/ag-grid.css';
import { ContextMenuProvider } from '/@/renderer/features/context-menu';
import { useHandlePlayQueueAdd } from '/@/renderer/features/player/hooks/use-handle-playqueue-add';
import { PlayQueueHandlerContext } from '/@/renderer/features/player';
import { AddToPlaylistContextModal } from '/@/renderer/features/playlists';

ModuleRegistry.registerModules([ClientSideRowModelModule, InfiniteRowModelModule]);

initSimpleImg({ threshold: 0.05 }, true);

export const App = () => {
  const theme = useTheme();
  const contentFont = useSettingsStore((state) => state.general.fontContent);

  const handlePlayQueueAdd = useHandlePlayQueueAdd();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--content-font-family', contentFont);
  }, [contentFont]);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: theme as 'light' | 'dark',
        components: {
          Modal: {
            styles: {
              body: { background: 'var(--modal-bg)', padding: '1rem !important' },
              close: { marginRight: '0.5rem' },
              content: { borderRadius: '10px' },
              header: {
                background: 'var(--modal-bg)',
                borderBottom: '1px solid var(--generic-border-color)',
                paddingBottom: '1rem',
              },
              title: { fontSize: 'medium', fontWeight: 'bold' },
            },
          },
        },
        defaultRadius: 'xs',
        dir: 'ltr',
        focusRing: 'auto',
        focusRingStyles: {
          inputStyles: () => ({
            border: '1px solid var(--primary-color)',
          }),
          resetStyles: () => ({ outline: 'none' }),
          styles: () => ({
            outline: '1px solid var(--primary-color)',
            outlineOffset: '-1px',
          }),
        },
        fontFamily: 'var(--content-font-family)',
        fontSizes: {
          lg: '1.1rem',
          md: '1rem',
          sm: '0.9rem',
          xl: '1.5rem',
          xs: '0.8rem',
        },
        headings: {
          fontFamily: 'var(--content-font-family)',
          fontWeight: 700,
          sizes: {
            h1: '6rem',
            h2: '4rem',
            h3: '3rem',
            h4: '1.5rem',
            h5: '1.2rem',
            h6: '1rem',
          },
        },
        other: {},
        spacing: {
          lg: '2rem',
          md: '1rem',
          sm: '0.5rem',
          xl: '4rem',
          xs: '0rem',
        },
      }}
    >
      <ModalsProvider
        modalProps={{
          centered: true,
          transitionProps: {
            duration: 300,
            exitDuration: 300,
            transition: 'slide-down',
          },
        }}
        modals={{ addToPlaylist: AddToPlaylistContextModal, base: BaseContextModal }}
      >
        <PlayQueueHandlerContext.Provider value={{ handlePlayQueueAdd }}>
          <ContextMenuProvider>
            <AppRouter />
          </ContextMenuProvider>
        </PlayQueueHandlerContext.Provider>
      </ModalsProvider>
    </MantineProvider>
  );
};
