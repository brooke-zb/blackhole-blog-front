const isDark = useDark({
  storageKey: 'bhblog.dark',
  writeDefaults: true,
})
const toggleDark = useToggle(isDark)

export {
  isDark,
  toggleDark,
}
