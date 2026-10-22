export function createRecoverablePageLoader<T>(load: () => Promise<T>, retry: () => Promise<T>) {
  let failed = false
  return () => (failed ? retry() : load()).catch((error: unknown) => {
    failed = true
    throw error
  })
}
