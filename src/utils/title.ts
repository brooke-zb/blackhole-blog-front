const title = ref('')

useTitle(computed(() => title.value ? `${title.value} - ${import.meta.env.BHBLOG_APP_TITLE}` : import.meta.env.BHBLOG_APP_TITLE))

function setTitle(newTitle: string) {
  title.value = newTitle
}

export {
  setTitle,
  title,
}
