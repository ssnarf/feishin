import { ChangeEvent } from 'react';
import { Divider, Group, Stack } from '@mantine/core';
import { Accordion, Button, ContextModalVars, Switch } from '/@/renderer/components';
import { useLocalStorage } from '@mantine/hooks';
import { openContextModal } from '@mantine/modals';
import isElectron from 'is-electron';
import { RiAddFill, RiServerFill } from 'react-icons/ri';
import { AddServerForm } from '/@/renderer/features/servers/components/add-server-form';
import { ServerListItem } from '/@/renderer/features/servers/components/server-list-item';
import { useServerList } from '/@/renderer/store';
import { titleCase } from '/@/renderer/utils';

const localSettings = isElectron() ? window.electron.localSettings : null;

export const ServerList = () => {
  const serverListQuery = useServerList();

  const handleAddServerModal = () => {
    openContextModal({
      innerProps: {
        modalBody: (vars: ContextModalVars) => (
          <AddServerForm onCancel={() => vars.context.closeModal(vars.id)} />
        ),
      },
      modal: 'base',
      title: 'Add server',
    });
  };

  const [ignoreCORS, setIgnoreCORS] = useLocalStorage({
    defaultValue: 'false',
    key: 'ignore_cors',
  });

  const [ignoreSSL, setIgnoreSSL] = useLocalStorage({
    defaultValue: 'false',
    key: 'ignore_ssl',
  });

  const handleUpdateIgnoreCORS = (e: ChangeEvent<HTMLInputElement>) => {
    setIgnoreCORS(String(e.currentTarget.checked));

    if (isElectron()) {
      localSettings?.set('ignore_cors', e.currentTarget.checked);
    }
  };

  const handleUpdateIgnoreSSL = (e: ChangeEvent<HTMLInputElement>) => {
    setIgnoreSSL(String(e.currentTarget.checked));

    if (isElectron()) {
      localSettings?.set('ignore_ssl', e.currentTarget.checked);
    }
  };

  return (
    <>
      <Group
        mb={10}
        position="right"
        sx={{
          position: 'absolute',
          right: 55,
          transform: 'translateY(-3.5rem)',
        }}
      >
        <Button
          autoFocus
          compact
          leftIcon={<RiAddFill size={15} />}
          size="sm"
          variant="filled"
          onClick={handleAddServerModal}
        >
          Add server
        </Button>
      </Group>
      <Stack>
        <Accordion variant="separated">
          {serverListQuery?.map((s) => (
            <Accordion.Item
              key={s.id}
              value={s.name}
            >
              <Accordion.Control icon={<RiServerFill size={15} />}>
                <Group position="apart">
                  {titleCase(s.type)} - {s.name}
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <ServerListItem server={s} />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
        <Divider />
        <Group>
          <Switch
            checked={ignoreCORS === 'true'}
            label="Ignore CORS (requires restart)"
            onChange={handleUpdateIgnoreCORS}
          />
        </Group>
        <Group>
          <Switch
            checked={ignoreSSL === 'true'}
            label="Ignore SSL (requires restart)"
            onChange={handleUpdateIgnoreSSL}
          />
        </Group>
      </Stack>
    </>
  );
};
