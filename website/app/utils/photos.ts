/** Local venue photos in /public/assets */
export const PHOTOS = {
  logo: '/assets/logo.jpg',
  hero: '/assets/front-view.jpg',
  heroAlt: '/assets/front-view2.jpg',
  hall: '/assets/hall.jpg',
  hallAlt: '/assets/hall2.jpg',
  dining: '/assets/dinning-hall.jpg',
  bar: '/assets/indoor-bar.jpg',
  topBar: '/assets/top-bar.jpg',
  washroom1: '/assets/washroom1.jpg',
  washroom2: '/assets/washroom2.jpg',
} as const

/** Temporary Unsplash placeholders until venue shoots replace them */
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export type GallerySectionKey =
  | 'events'
  | 'banquet'
  | 'kitchen'
  | 'danceHall'
  | 'bar'
  | 'washroom'
  | 'menu'

export interface GalleryItem {
  src: string
  altKey: string
}

export const GALLERY_SECTIONS: Record<GallerySectionKey, GalleryItem[]> = {
  events: [
    { src: u('photo-1519167758481-83f550bb49b3'), altKey: 'gallery.items.events1' },
    { src: u('photo-1464366400600-7168b8af9bc3'), altKey: 'gallery.items.events2' },
    { src: u('photo-1511795409834-ef04bbd61622'), altKey: 'gallery.items.events3' },
    { src: u('photo-1530103862676-de8c9debad1d'), altKey: 'gallery.items.events4' },
    { src: u('photo-1478146896981-b80fe463b330'), altKey: 'gallery.items.events5' },
    { src: u('photo-1492684223066-81342ee5ff30'), altKey: 'gallery.items.events6' },
  ],
  banquet: [
    { src: u('photo-1414235077428-338989a2e8c0'), altKey: 'gallery.items.banquet1' },
    { src: u('photo-1555244162-803834f70033'), altKey: 'gallery.items.banquet2' },
    { src: u('photo-1517248135467-4c7edcad34c4'), altKey: 'gallery.items.banquet3' },
    { src: u('photo-1559339352-11d035aa65de'), altKey: 'gallery.items.banquet4' },
    { src: u('photo-1504674900247-0877df9cc836'), altKey: 'gallery.items.banquet5' },
    { src: PHOTOS.dining, altKey: 'gallery.items.banquet6' },
  ],
  kitchen: [
    { src: u('photo-1556910103-1c02745aae4d'), altKey: 'gallery.items.kitchen1' },
    { src: u('photo-1577219491135-ce391730fb2c'), altKey: 'gallery.items.kitchen2' },
    { src: u('photo-1600565193348-f74bd3c7ccdf'), altKey: 'gallery.items.kitchen3' },
    { src: u('photo-1556911220-bff31c875d1c'), altKey: 'gallery.items.kitchen4' },
    { src: u('photo-1583394293214-28ded15ee548'), altKey: 'gallery.items.kitchen5' },
    { src: u('photo-1590846406792-0adc7f938f1d'), altKey: 'gallery.items.kitchen6' },
  ],
  danceHall: [
    { src: u('photo-1514525253161-7a46d19cd819'), altKey: 'gallery.items.dance1' },
    { src: u('photo-1470229722913-7c0e2dbbafd3'), altKey: 'gallery.items.dance2' },
    { src: u('photo-1429962714451-bb934ecdc4ec'), altKey: 'gallery.items.dance3' },
    { src: PHOTOS.hall, altKey: 'gallery.items.dance4' },
    { src: PHOTOS.hallAlt, altKey: 'gallery.items.dance5' },
    { src: u('photo-1571266028247-e673f0d35cc0'), altKey: 'gallery.items.dance6' },
  ],
  bar: [
    { src: PHOTOS.bar, altKey: 'gallery.items.bar1' },
    { src: PHOTOS.topBar, altKey: 'gallery.items.bar2' },
    { src: u('photo-1470337458703-46ad1756a187'), altKey: 'gallery.items.bar3' },
    { src: u('photo-1514362545857-3bc16c4c7d1b'), altKey: 'gallery.items.bar4' },
    { src: u('photo-1551024709-8f23befc6f87'), altKey: 'gallery.items.bar5' },
    { src: u('photo-1572116469696-31de0f17cc34'), altKey: 'gallery.items.bar6' },
  ],
  washroom: [
    { src: PHOTOS.washroom1, altKey: 'gallery.items.washroom1' },
    { src: PHOTOS.washroom2, altKey: 'gallery.items.washroom2' },
    { src: u('photo-1584622650111-993a426fbf0a'), altKey: 'gallery.items.washroom3' },
    { src: u('photo-1552321554-5fefe8c9ef14'), altKey: 'gallery.items.washroom4' },
    { src: u('photo-1507652313519-d4e9174996dd'), altKey: 'gallery.items.washroom5' },
    { src: u('photo-1620626011761-996317b8d101'), altKey: 'gallery.items.washroom6' },
  ],
  menu: [
    { src: u('photo-1546069901-ba9599a7e63c'), altKey: 'gallery.items.menu1' },
    { src: u('photo-1567620905732-2d1ec7ab7445'), altKey: 'gallery.items.menu2' },
    { src: u('photo-1565299624946-b28f40a0ae38'), altKey: 'gallery.items.menu3' },
    { src: u('photo-1476224203421-9ac97ecd3dda'), altKey: 'gallery.items.menu4' },
    { src: u('photo-1504674900247-0877df9cc836'), altKey: 'gallery.items.menu5' },
    { src: u('photo-1555939594-58ed7bd77c3e'), altKey: 'gallery.items.menu6' },
  ],
}

export const GALLERY_SECTION_KEYS: GallerySectionKey[] = [
  'events',
  'banquet',
  'kitchen',
  'danceHall',
  'bar',
  'washroom',
  'menu',
]

/** Flat list for home-page marquee and legacy consumers */
export const GALLERY_ITEMS: GalleryItem[] = [
  ...GALLERY_SECTIONS.events.slice(0, 2),
  ...GALLERY_SECTIONS.banquet.slice(0, 2),
  ...GALLERY_SECTIONS.danceHall.slice(0, 2),
  ...GALLERY_SECTIONS.bar.slice(0, 2),
  ...GALLERY_SECTIONS.kitchen.slice(0, 1),
  ...GALLERY_SECTIONS.menu.slice(0, 1),
]

export type StoryChapterKey = 'lifetime' | 'gossip' | 'toast' | 'business' | 'gold'

/** Scattered collage photos for the home Durbar story (internet placeholders) */
export const STORY_COLLAGE_PHOTOS: GalleryItem[] = [
  // lifetime / wedding & grand nights
  { src: u('photo-1519741497674-611481863552'), altKey: 'home.story.collage.wedding' },
  { src: u('photo-1464366400600-7168b8af9bc3'), altKey: 'home.story.collage.ceremony' },
  // gossip / tables & dining
  { src: u('photo-1414235077428-338989a2e8c0'), altKey: 'home.story.collage.dining' },
  { src: u('photo-1517248135467-4c7edcad34c4'), altKey: 'home.story.collage.tables' },
  // toast / celebration
  { src: u('photo-1511795409834-ef04bbd61622'), altKey: 'home.story.collage.toast' },
  { src: u('photo-1478146896981-b80fe463b330'), altKey: 'home.story.collage.cheers' },
  // business events
  { src: u('photo-1540575467063-178a50c2df87'), altKey: 'home.story.collage.business' },
  { src: u('photo-1511578314322-379afb476865'), altKey: 'home.story.collage.conference' },
  // gold / lounge nights
  { src: u('photo-1470337458703-46ad1756a187'), altKey: 'home.story.collage.lounge' },
  { src: u('photo-1566073771259-6a8506099945'), altKey: 'home.story.collage.luxury' },
]

/** Food shots shown above the home menu board */
export const HOME_MENU_PHOTOS: GalleryItem[] = GALLERY_SECTIONS.menu.slice(0, 3)

/** @deprecated Prefer GallerySectionKey — kept for any stray imports */
export type GalleryCategory = GallerySectionKey | 'all' | 'testimonials'

/** Fallback / marketing images keyed by hall slug when API still has Unsplash URLs */
export const HALL_PHOTOS: Record<string, string[]> = {
  'royal-durbar-hall': [PHOTOS.hall, PHOTOS.hallAlt, PHOTOS.dining],
  'peacock-garden-hall': [PHOTOS.dining, PHOTOS.heroAlt, PHOTOS.bar],
  'emerald-chamber': [PHOTOS.bar, PHOTOS.topBar, PHOTOS.washroom1],
}

export function hallPrimaryPhoto(slug: string, fallback?: string): string {
  return HALL_PHOTOS[slug]?.[0] || fallback || PHOTOS.hall
}

export function hallPhotos(slug: string, apiUrls: string[] = []): string[] {
  const local = HALL_PHOTOS[slug]
  if (local?.length) return local
  return apiUrls.length ? apiUrls : [PHOTOS.hall]
}

/** Map tab filters on home venue teaser to hall slugs (soft preference) */
export const VENUE_TAB_HALLS: Record<string, string[]> = {
  all: ['royal-durbar-hall', 'peacock-garden-hall', 'emerald-chamber'],
  weddings: ['royal-durbar-hall', 'peacock-garden-hall'],
  corporate: ['peacock-garden-hall', 'emerald-chamber', 'royal-durbar-hall'],
  social: ['emerald-chamber', 'peacock-garden-hall'],
}
