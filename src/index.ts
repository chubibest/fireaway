import { firestore } from 'firebase-admin'
import { Collection, MigrationHandler, Offset, Item, InitialConfig } from './types'
import { assignDefaultCollection } from './collection'
import { fieldToField, fieldToFieldOrDefault, assignDefault, removeAll as removeField } from './document'

export const getMigrationDataFromCollection = (
  collection: firestore.QuerySnapshot
): { result: Item[]; offset?: Offset } => {
  const result: Item[] = []

  collection.forEach((item) => {
    result.push({
      id: item.id,
      ...item.data()
    })
  })

  return { result, offset: result[result.length - 1].id }
}


export default ({db, fieldValue}: InitialConfig) => {
  const migration = async (
    collection: string |Collection,
    migrationHandler: MigrationHandler
  ): Promise<void> => {
    console.log('Getting entries within collection...')
    const limit = 500
  
    let iterationCount = 0
    let entries
    let firestoreCollection: Collection

    if(typeof collection === 'string'){
      firestoreCollection = db.collection(collection)
    }else {
      firestoreCollection = collection
    }

    const migrate = async (offset?: Item) => {
      if (offset) {
        console.log('Fetching initial docs...')
        entries = await firestoreCollection.startAfter(offset).limit(limit).get()
      } else {
        console.log(`Fetching Docs... iteration - ${iterationCount}`)
  
        entries = await firestoreCollection.limit(limit).get()
      }
  
      console.log(`${entries.size} documents fetched...`)
      if (entries.size === 0) {
        console.log('Migration Ended...')
        return
      }
  
      const { result, offset: newoffset } = getMigrationDataFromCollection(entries)

      const batch = db.batch()
      migrationHandler(batch, result, firestoreCollection, fieldValue)
  
      await batch.commit()
  
      iterationCount++
      console.log(`Migration has gone through ${iterationCount} cycles`)
  
      if (entries.size < limit) {
        console.log('Migration Ended...')
        return
      }
  
      console.log(`Offset for new cycle ${newoffset}`)
      await migrate(entries.docs[entries.size - 1])
    }
  
    await migrate()
    console.log('Migration Complete...')
  }
  
  return migration
}

export {
   fieldToField, fieldToFieldOrDefault, assignDefault, removeField, assignDefaultCollection
}