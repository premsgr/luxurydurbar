<template>
  <div class="menu-board">
    <Reveal>
      <p class="eyebrow">{{ t('menu.eyebrow') }}</p>
      <h2 class="mt-2 text-3xl sm:text-4xl text-white">{{ t('menu.title') }}</h2>
      <p class="mt-4 max-w-2xl font-sans text-white/60 leading-relaxed">
        {{ t('menu.customize') }}
      </p>
    </Reveal>

    <Reveal :delay="120">
      <div class="menu-board__filters mt-8 flex flex-wrap gap-2 font-sans text-xs uppercase tracking-wider">
        <button
          v-for="filter in filters"
          :key="filter"
          type="button"
          class="rounded-sm border border-white/20 px-3 py-2 text-white/70 transition hover:border-gold/50"
          :class="{ 'is-active': activeFilter === filter }"
          @click="activeFilter = filter"
        >
          {{ t(`menu.filters.${filter}`) }}
        </button>
      </div>
    </Reveal>

    <div class="mt-12 space-y-12">
      <Reveal
        v-for="(course, courseIndex) in visibleCourses"
        :key="course.key"
        :delay="courseIndex * 80"
      >
        <div>
          <h3 class="text-xl tracking-wide text-gold-light uppercase">
            {{ t(`menu.courses.${course.key}`) }}
          </h3>
          <ul class="mt-5 divide-y divide-white/10 border-t border-white/10">
            <li
              v-for="dish in course.dishes"
              :key="dish.nameKey"
              class="flex flex-wrap items-baseline justify-between gap-3 py-4"
            >
              <div>
                <span class="text-lg text-white">{{ t(dish.nameKey) }}</span>
                <p class="mt-1 font-sans text-sm text-white/45">{{ t(dish.descKey) }}</p>
              </div>
              <span
                class="font-sans text-[10px] uppercase tracking-label shrink-0"
                :class="dish.diet === 'veg' ? 'text-emerald-400/90' : 'text-rose-300/80'"
              >
                {{ t(`menu.diet.${dish.diet}`) }}
              </span>
            </li>
          </ul>
        </div>
      </Reveal>
    </div>

    <Reveal :delay="200">
      <p class="mt-10 font-sans text-sm text-gold/80 italic">
        {{ t('menu.note') }}
      </p>
    </Reveal>
  </div>
</template>

<script lang="ts">
export default { name: 'MenuBoard' }
</script>

<script setup lang="ts">
type Diet = 'veg' | 'nonveg'
type Filter = 'all' | 'veg' | 'nonveg'

interface Dish {
  nameKey: string
  descKey: string
  diet: Diet
}

interface Course {
  key: string
  dishes: Dish[]
}

const { t } = useI18n()

const filters: Filter[] = ['all', 'veg', 'nonveg']
const activeFilter = ref<Filter>('all')

const courses: Course[] = [
  {
    key: 'starters',
    dishes: [
      { nameKey: 'menu.dishes.paneerTikka.name', descKey: 'menu.dishes.paneerTikka.desc', diet: 'veg' },
      { nameKey: 'menu.dishes.chickenTikka.name', descKey: 'menu.dishes.chickenTikka.desc', diet: 'nonveg' },
      { nameKey: 'menu.dishes.vegSpringRoll.name', descKey: 'menu.dishes.vegSpringRoll.desc', diet: 'veg' },
      { nameKey: 'menu.dishes.fishAmritsari.name', descKey: 'menu.dishes.fishAmritsari.desc', diet: 'nonveg' },
    ],
  },
  {
    key: 'mains',
    dishes: [
      { nameKey: 'menu.dishes.dalMakhani.name', descKey: 'menu.dishes.dalMakhani.desc', diet: 'veg' },
      { nameKey: 'menu.dishes.butterChicken.name', descKey: 'menu.dishes.butterChicken.desc', diet: 'nonveg' },
      { nameKey: 'menu.dishes.palakPaneer.name', descKey: 'menu.dishes.palakPaneer.desc', diet: 'veg' },
      { nameKey: 'menu.dishes.muttonCurry.name', descKey: 'menu.dishes.muttonCurry.desc', diet: 'nonveg' },
    ],
  },
  {
    key: 'nepali',
    dishes: [
      { nameKey: 'menu.dishes.dalBhat.name', descKey: 'menu.dishes.dalBhat.desc', diet: 'veg' },
      { nameKey: 'menu.dishes.chickenSekuwa.name', descKey: 'menu.dishes.chickenSekuwa.desc', diet: 'nonveg' },
      { nameKey: 'menu.dishes.vegMomos.name', descKey: 'menu.dishes.vegMomos.desc', diet: 'veg' },
      { nameKey: 'menu.dishes.buffChoila.name', descKey: 'menu.dishes.buffChoila.desc', diet: 'nonveg' },
    ],
  },
  {
    key: 'dessert',
    dishes: [
      { nameKey: 'menu.dishes.gulabJamun.name', descKey: 'menu.dishes.gulabJamun.desc', diet: 'veg' },
      { nameKey: 'menu.dishes.kheer.name', descKey: 'menu.dishes.kheer.desc', diet: 'veg' },
      { nameKey: 'menu.dishes.iceCream.name', descKey: 'menu.dishes.iceCream.desc', diet: 'veg' },
    ],
  },
]

const visibleCourses = computed(() => {
  return courses
    .map((course) => ({
      ...course,
      dishes:
        activeFilter.value === 'all'
          ? course.dishes
          : course.dishes.filter((d) => d.diet === activeFilter.value),
    }))
    .filter((course) => course.dishes.length > 0)
})
</script>
