## Fireaway
Utility for making changes accross an entire firestore collection.

```js
    import fireaway, { fieldToField } from 'fireaway'
    import admin from 'firebase-admin'

    // After initialising admin
    const db = admin.firestore()
    const fieldValue = admin.firestore.FieldValue

    const migration = fireaway({
        db,
        fieldValue
    })

    migration('collectionName', fieldToField('formerFieldName', 'newFieldName'))
 ```

 Pass in your Firestore db and [fieldValue](https://firebase.google.com/docs/reference/js/v8/firebase.firestore.FieldValue) to configure fireaway. This should return a function, that takes a collection name and a handler.

## Handler reference

### assignDefault
Creates a new field accross an entire collection.

  *Parameters*

  `field name {String}` Name of the field.

  `field value {String | Number}` default value to assign
  
### fieldToField
Renames a field.

   *Parameters*

 `former name {String}` Former name

 `new name {String}` New name


### fieldToFieldOrDefault
Renames an existing field or creates it if it is missing.

   *Parameters*

 `former name {String}` Former name

 `new name {String}` New name

 `default value {String | Number}` Default value
  
### removeAll
Removes a field from all documents in a collection.

  *Parameters*

  `field name {String}` Name of field to remove
  
### assignDefaultCollection
Creates a sub-collection accross an entire collection.

*Parameters*

`value {Object}`  Document fields

`sub collection name {String}` Name fo subcollection
  
## Custom Handler
Write your own handlers to carry out [batch](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes) operations.

```js
function customHandler('argument(s) you will need'){
  return (batch, entries, collection) => {
    entries.forEach((entry) => {
      const ref = collection.doc(entry.id)

        // stuff you want to do accross all docs with args

        batch.update(ref, { fieldYouWant: 'Value you derived' })
      
    })
  }
}

migration('collectionName', customHandler('parameter(s) you need'))
```