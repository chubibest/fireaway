import { MigrationHandler, Item } from '../types'

type Entries = Item[]

export const assignDefaultCollection = (
  values: Record<string, unknown>,
  newCollection: string
): MigrationHandler => {
  return (batch, entries, collection) => {
    ;(entries as Entries).forEach((entry) => {
      const ref = collection.doc(entry.id).collection(newCollection).doc()

      console.log(`Current entry id, ${entry.id}`)

      batch.set(ref, values)
    })
  }
}
