import { Box, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { closeModal, ContextModalProps } from '@mantine/modals';
import { useMemo, useState } from 'react';
import { api } from '/@/renderer/api';
import { queryKeys } from '/@/renderer/api/query-keys';
import { PlaylistListSort, SongListQuery, SongListSort, SortOrder } from '/@/renderer/api/types';
import { Button, MultiSelect, Switch, toast } from '/@/renderer/components';
import { useAddToPlaylist } from '/@/renderer/features/playlists/mutations/add-to-playlist-mutation';
import { usePlaylistList } from '/@/renderer/features/playlists/queries/playlist-list-query';
import { queryClient } from '/@/renderer/lib/react-query';
import { useCurrentServer } from '/@/renderer/store';

export const AddToPlaylistContextModal = ({
  id,
  innerProps,
}: ContextModalProps<{
  albumId?: string[];
  artistId?: string[];
  songId?: string[];
}>) => {
  const { albumId, artistId, songId } = innerProps;
  const server = useCurrentServer();
  const [isLoading, setIsLoading] = useState(false);

  const addToPlaylistMutation = useAddToPlaylist();

  const playlistList = usePlaylistList({
    ndParams: {
      smart: false,
    },
    sortBy: PlaylistListSort.NAME,
    sortOrder: SortOrder.ASC,
    startIndex: 0,
  });

  const playlistSelect = useMemo(() => {
    return (
      playlistList.data?.items?.map((playlist) => ({
        label: playlist.name,
        value: playlist.id,
      })) || []
    );
  }, [playlistList.data]);

  const form = useForm({
    initialValues: {
      playlistId: [],
      skipDuplicates: true,
    },
  });

  const getSongsByAlbum = async (albumId: string) => {
    const query: SongListQuery = {
      albumIds: [albumId],
      sortBy: SongListSort.ALBUM,
      sortOrder: SortOrder.ASC,
      startIndex: 0,
    };

    const queryKey = queryKeys.songs.list(server?.id || '', query);

    const songsRes = await queryClient.fetchQuery(queryKey, ({ signal }) =>
      api.controller.getSongList({ query, server, signal }),
    );

    return api.normalize.songList(songsRes, server);
  };

  const getSongsByArtist = async (artistId: string) => {
    const query: SongListQuery = {
      artistIds: [artistId],
      sortBy: SongListSort.ARTIST,
      sortOrder: SortOrder.ASC,
      startIndex: 0,
    };

    const queryKey = queryKeys.songs.list(server?.id || '', query);

    const songsRes = await queryClient.fetchQuery(queryKey, ({ signal }) =>
      api.controller.getSongList({ query, server, signal }),
    );

    return api.normalize.songList(songsRes, server);
  };

  const isSubmitDisabled = form.values.playlistId.length === 0 || addToPlaylistMutation.isLoading;

  const handleSubmit = form.onSubmit(async (values) => {
    setIsLoading(true);
    const allSongIds: string[] = [];
    const uniqueSongIds: string[] = [];

    if (albumId && albumId.length > 0) {
      for (const id of albumId) {
        const songs = await getSongsByAlbum(id);
        allSongIds.push(...(songs?.items?.map((song) => song.id) || []));
      }
    }

    if (artistId && artistId.length > 0) {
      for (const id of artistId) {
        const songs = await getSongsByArtist(id);
        allSongIds.push(...(songs?.items?.map((song) => song.id) || []));
      }
    }

    if (songId && songId.length > 0) {
      allSongIds.push(...songId);
    }

    for (const playlistId of values.playlistId) {
      if (values.skipDuplicates) {
        const query = {
          id: playlistId,
          startIndex: 0,
        };

        const queryKey = queryKeys.playlists.songList(server?.id || '', playlistId, query);

        const playlistSongsRes = await queryClient.fetchQuery(queryKey, ({ signal }) =>
          api.controller.getPlaylistSongList({
            query: { id: playlistId, startIndex: 0 },
            server,
            signal,
          }),
        );

        const playlistSongIds = api.normalize
          .songList(playlistSongsRes, server)
          .items?.map((song) => song.id);

        for (const songId of allSongIds) {
          if (!playlistSongIds?.includes(songId)) {
            uniqueSongIds.push(songId);
          }
        }
      }

      if (values.skipDuplicates ? uniqueSongIds.length > 0 : allSongIds.length > 0) {
        addToPlaylistMutation.mutate(
          {
            body: { songId: values.skipDuplicates ? uniqueSongIds : allSongIds },
            query: { id: playlistId },
          },
          {
            onError: (err) => {
              toast.error({
                message: `[${
                  playlistSelect.find((playlist) => playlist.value === playlistId)?.label
                }] ${err.message}`,
                title: 'Failed to add songs to playlist',
              });
            },
          },
        );
      }
    }

    setIsLoading(false);
    toast.success({
      message: `Added ${
        values.skipDuplicates ? uniqueSongIds.length : allSongIds.length
      } songs to ${values.playlistId.length} playlist(s)`,
    });
    closeModal(id);
    return null;
  });

  return (
    <Box p="1rem">
      <form onSubmit={handleSubmit}>
        <Stack>
          <MultiSelect
            clearable
            searchable
            data={playlistSelect}
            disabled={playlistList.isLoading}
            label="Playlists"
            size="md"
            {...form.getInputProps('playlistId')}
          />
          <Switch
            label="Skip duplicates"
            {...form.getInputProps('skipDuplicates', { type: 'checkbox' })}
          />
          <Group position="right">
            <Group>
              <Button
                disabled={addToPlaylistMutation.isLoading}
                size="md"
                variant="subtle"
                onClick={() => closeModal(id)}
              >
                Cancel
              </Button>
              <Button
                disabled={isSubmitDisabled}
                loading={isLoading}
                size="md"
                type="submit"
                variant="filled"
              >
                Add
              </Button>
            </Group>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};
