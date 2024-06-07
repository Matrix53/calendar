export class IndexDBWrapper {
  private readonly defaultRetries = 2

  private readonly dbName: string
  private readonly version: number
  private readonly storeName: string
  private readonly retries: number

  constructor(dbName: string, version: number, retries?: number) {
    this.dbName = dbName
    this.version = version
    this.storeName = 'default'
    this.retries = retries ?? this.defaultRetries
  }

  public async set(key: string, value: any) {
    const db = await this.openDatabase()
    const transaction = db.transaction([this.storeName], 'readwrite')
    const store = transaction.objectStore(this.storeName)
    store.put(value, key)
    await this.transactionComplete(transaction)
    db.close()
  }

  public async get(key: string): Promise<any> {
    const db = await this.openDatabase()
    if (
      db.objectStoreNames.length === 0 ||
      !db.objectStoreNames.contains(this.storeName)
    )
      return null
    const transaction = db.transaction([this.storeName], 'readwrite')
    const store = transaction.objectStore(this.storeName)
    const value = await store.get(key)
    await this.transactionComplete(transaction)
    db.close()
    return value.result
  }

  public async remove(key: string) {
    const db = await this.openDatabase()
    if (
      db.objectStoreNames.length === 0 ||
      !db.objectStoreNames.contains(this.storeName)
    )
      return
    const transaction = db.transaction([this.storeName], 'readwrite')
    const store = transaction.objectStore(this.storeName)
    store.delete(key)
    db.close()
    await this.transactionComplete(transaction)
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      let request = indexedDB.open(this.dbName, this.version)
      let retries = this.retries

      request.onerror = () => {
        if (retries-- > 0) {
          setTimeout(() => {
            request = indexedDB.open(this.dbName, this.version)
          }, 1000)
        } else {
          reject(request.error)
        }
      }

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onupgradeneeded = () => {
        request.result.createObjectStore(this.storeName)
      }
    })
  }

  private transactionComplete(transaction: IDBTransaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      transaction.onerror = () => {
        reject(transaction.error)
      }
      transaction.oncomplete = () => {
        resolve()
      }
    })
  }
}
