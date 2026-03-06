
export async function to<T>(
  promise: Promise<T>,
): Promise<[Error, null] | [null, T]> {
  try {
    const data = await promise
    return [null, data]
  } catch (err) {
    return [err instanceof Error ? err : new Error(String(err)), null]
  }
}
