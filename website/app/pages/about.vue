<script lang="ts">
export default { name: 'AboutPage' }
</script>

<script setup lang="ts">
await navigateTo({ path: '/', hash: '#about' }, { redirectCode: 301 })
</script>
