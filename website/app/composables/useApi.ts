export function useApi() {
  const config = useRuntimeConfig()
  const base = config.public.apiBase as string

  function api<T>(path: string, options: Parameters<typeof $fetch>[1] = {}) {
    return $fetch<T>(`${base}${path}`, options)
  }

  return { api, base }
}
