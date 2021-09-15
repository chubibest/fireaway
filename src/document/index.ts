import { MigrationHandler, Item } from '../types'

type Entries = Item[]

const truthyOnFirestore = <T>(value: T): boolean => typeof value === 'boolean' || !!value

// Changes data if it exists creates it otherwise
export const fieldToFieldOrDefault = <T>(
  before: string,
  after: string,
  defaultValue: T
): MigrationHandler => {
  return (batch, entries, collection) => {
    ;(entries as Entries).forEach((entry) => {
      const ref = collection.doc(entry.id)
      const value = truthyOnFirestore(entry[before])

      console.log(`Current entry id, ${entry.id}`)
      console.log(`Current Doc has existing data, ${!!value}`)

      if (value) {
        batch.update(ref, { [after]: entry[before] })
      } else {
        batch.update(ref, { [after]: defaultValue })
      }
    })
  }
}

// Changes a field if it exists
export const fieldToField = (before: string, after: string): MigrationHandler => {
  return (batch, entries, collection) => {
    ;(entries as Entries).forEach((entry) => {
      const ref = collection.doc(entry.id)
      const exists = truthyOnFirestore(entry[before])

      console.log(`Current entry id, ${entry.id}`)
      console.log(`Current Doc has existing data, ${!!exists}`)

      if (exists) {
        batch.update(ref, { [after]: entry[before] })
      }
    })
  }
}

// Assigns a default accross
export const assignDefault = (field: string, defaultValue: string): MigrationHandler => {
  return (batch, entries, collection) => {
    ;(entries as Entries).forEach((entry) => {
      const ref = collection.doc(entry.id)

      batch.update(ref, { [field]: defaultValue })
    })
  }
}

// Assigns a default accross
export const removeAll = (field: string): MigrationHandler => {
  return (batch, entries, collection, fieldValue) => {
    ;(entries as Entries).forEach((entry) => {
      const ref = collection.doc(entry.id)

      batch.update(ref, { [field]: fieldValue?.delete() })
    })
  }
}
