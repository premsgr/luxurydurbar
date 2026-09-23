<script lang="ts">
export default { name: 'BookRedirect' }
</script>

<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()

const query: Record<string, string> = {}
if (route.query.hall) query.hall = String(route.query.hall)
if (route.query.package) query.package = String(route.query.package)

await navigateTo({ path: localePath('/contact'), query }, { redirectCode: 301 })
</script>

<template>
  <div class="section font-sans text-white/50">Redirecting…</div>
</template>
