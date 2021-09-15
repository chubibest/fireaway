import { firestore } from 'firebase-admin'

export type Item = FirebaseFirestore.DocumentData
export type Offset = string
export type Collection = FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
export type MigrationHandler = (
    batch: firestore.WriteBatch,
    result: Item[],
    collection: Collection,
    fieldValue?: typeof FirebaseFirestore.FieldValue
  ) => void

export interface InitialConfig {
   db: FirebaseFirestore.Firestore
   fieldValue?: typeof firestore.FieldValue
}