import { Album, AlbumArtist, Artist, LibraryItem, QueueSong } from '/@/renderer/api/types';
import { AppRoute } from '/@/renderer/router/routes';

export type TablePagination = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

export type RouteSlug = {
  idProperty: string;
  slugProperty: string;
};

export type CardRoute = {
  route: AppRoute | string;
  slugs?: RouteSlug[];
};

export type TableType = 'nowPlaying' | 'sideQueue' | 'sideDrawerQueue' | 'songs';

export type CardRow<T> = {
  arrayProperty?: string;
  property: keyof T;
  route?: CardRoute;
};

export enum ListDisplayType {
  CARD = 'card',
  POSTER = 'poster',
  TABLE = 'table',
  TABLE_PAGINATED = 'paginatedTable',
}

export enum Platform {
  LINUX = 'linux',
  MACOS = 'macos',
  WEB = 'web',
  WINDOWS = 'windows',
}

export enum ServerType {
  JELLYFIN = 'jellyfin',
  NAVIDROME = 'navidrome',
  SUBSONIC = 'subsonic',
}

export type ServerListItem = {
  credential: string;
  id: string;
  name: string;
  ndCredential?: string;
  type: ServerType;
  url: string;
  userId: string | null;
  username: string;
};

export enum PlayerStatus {
  PAUSED = 'paused',
  PLAYING = 'playing',
}

export enum PlayerRepeat {
  ALL = 'all',
  NONE = 'none',
  ONE = 'one',
}

export enum PlayerShuffle {
  ALBUM = 'album',
  NONE = 'none',
  TRACK = 'track',
}

export enum Play {
  LAST = 'last',
  NEXT = 'next',
  NOW = 'now',
}

export enum CrossfadeStyle {
  CONSTANT_POWER = 'constantPower',
  CONSTANT_POWER_SLOW_CUT = 'constantPowerSlowCut',
  CONSTANT_POWER_SLOW_FADE = 'constantPowerSlowFade',
  DIPPED = 'dipped',
  EQUALPOWER = 'equalPower',
  LINEAR = 'linear',
}

export enum PlaybackStyle {
  CROSSFADE = 'crossfade',
  GAPLESS = 'gapless',
}

export enum PlaybackType {
  LOCAL = 'local',
  WEB = 'web',
}

export interface UniqueId {
  uniqueId: string;
}

export type QueryBuilderRule = {
  field?: string | null;
  operator?: string | null;
  uniqueId: string;
  value?: string | number | Date | undefined | null | any;
};

export type QueryBuilderGroup = {
  group: QueryBuilderGroup[];
  rules: QueryBuilderRule[];
  type: 'any' | 'all';
  uniqueId: string;
};

export enum TableColumn {
  ALBUM = 'album',
  ALBUM_ARTIST = 'albumArtist',
  ALBUM_COUNT = 'albumCount',
  ARTIST = 'artist',
  BIOGRAPHY = 'biography',
  BIT_RATE = 'bitRate',
  BPM = 'bpm',
  CHANNELS = 'channels',
  COMMENT = 'comment',
  DATE_ADDED = 'dateAdded',
  DISC_NUMBER = 'discNumber',
  DURATION = 'duration',
  GENRE = 'genre',
  LAST_PLAYED = 'lastPlayedAt',
  OWNER = 'username',
  PATH = 'path',
  PLAY_COUNT = 'playCount',
  RELEASE_DATE = 'releaseDate',
  ROW_INDEX = 'rowIndex',
  SIZE = 'size',
  SKIP = 'skip',
  SONG_COUNT = 'songCount',
  TITLE = 'title',
  TITLE_COMBINED = 'titleCombined',
  TRACK_NUMBER = 'trackNumber',
  USER_FAVORITE = 'userFavorite',
  USER_RATING = 'userRating',
  YEAR = 'releaseYear',
}

export type PlayQueueAddOptions = {
  byData?: QueueSong[];
  byItemType?: {
    id: string[] | any;
    type: LibraryItem;
  };
  play: Play;
};

export type GridCardData = {
  cardControls: any;
  cardRows: CardRow<Album | AlbumArtist | Artist>[];
  columnCount: number;
  display: ListDisplayType;
  handleFavorite: (options: { id: string[]; isFavorite: boolean; itemType: LibraryItem }) => void;
  handlePlayQueueAdd: (options: PlayQueueAddOptions) => void;
  itemCount: number;
  itemData: any[];
  itemGap: number;
  itemHeight: number;
  itemType: LibraryItem;
  itemWidth: number;
  playButtonBehavior: Play;
  route: CardRoute;
};
