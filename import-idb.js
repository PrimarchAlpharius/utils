var database = {};

function importFromJsonString(idbDatabase, jsonString, cb) {
  const objectStoreNamesSet = new Set(idbDatabase.objectStoreNames);
  const size = objectStoreNamesSet.size;
  if (size === 0) {
    cb(null);
  } else {
    const objectStoreNames = Array.from(objectStoreNamesSet);
    const transaction = idbDatabase.transaction(
        objectStoreNames,
        'readwrite'
    );
    transaction.onerror = (event) => cb(event);

    const importObject = JSON.parse(jsonString);
    try {
            objectStoreNames.forEach((storeName) => {
      let count = 0;
      const aux = Array.from(importObject[storeName]);
      if (importObject[storeName] && aux.length > 0) {
        aux.forEach((toAdd) => {
          const key = Object.keys(toAdd)[0];
          const value = Object.values(toAdd)[0];
          const request = transaction.objectStore(storeName).add(value, key);
          request.onsuccess = () => {
              console.log(count);
            count++;
            if (count === importObject[storeName].length) {
              // added all objects for this store
              delete importObject[storeName];
              if (Object.keys(importObject).length === 0) {
                  console.log(Object.keys(importObject))
                // added all object stores
                cb(null);
              }
            }
          };
          request.onerror = (event) => {
              console.log('ERROR')
            console.log(event);
          };
        });
      } else {
        delete importObject[storeName];
        if (Object.keys(importObject).length === 0) {
          // added all object stores
          cb(null);
        }
      }
    });
    } catch(e) {
        console.error(e)
    }

  }
}

(async function() {
    const conn = indexedDB.open('finances', 1);

    conn.onsuccess = (e) => {
        const db = e.target.result;
    
        importFromJsonString(db, JSON.stringify(database), (_, json) => {
            console.log(json);
        });

    }

})();
