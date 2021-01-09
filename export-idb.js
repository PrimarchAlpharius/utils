function exportToJsonString(idbDatabase, cb) {
  const exportObject = {};
  const objectStoreNamesSet = new Set(idbDatabase.objectStoreNames);
  const size = objectStoreNamesSet.size;
  if (size === 0) {
    cb(null, JSON.stringify(exportObject));
  } else {
    const objectStoreNames = Array.from(objectStoreNamesSet);
    const transaction = idbDatabase.transaction(
        objectStoreNames,
        'readonly'
    );
    transaction.onerror = (event) => cb(event, null);

    objectStoreNames.forEach((storeName) => {
      const allObjects = [];
      transaction.objectStore(storeName).openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        console.log(cursor);
        if (cursor) {
          allObjects.push({[cursor.key]: cursor.value});
          cursor.continue();
        } else {
          exportObject[storeName] = allObjects;
          if (
            objectStoreNames.length ===
            Object.keys(exportObject).length
          ) {
            cb(null, JSON.stringify(exportObject));
          }
        }
      };
    });
  }
}


(async function() {
    const conn = indexedDB.open('finances', 1);

    conn.onsuccess = (e) => {
        const db = e.target.result;
        console.log(db)
    
        exportToJsonString(db, (_, json) => {
            const data = JSON.parse(json);
//             data.budgetstore[1]['5da2da98be6996559cae9511'][0] = data.budgetstore[1]['5da2da98be6996559cae9511'][11];
            console.log(data);
        });

    }

})();




