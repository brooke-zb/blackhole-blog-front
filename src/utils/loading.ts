const isPageLoading = ref(false)

function setPageLoading(value: boolean) {
  isPageLoading.value = value
}

export { isPageLoading, setPageLoading }
