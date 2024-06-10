export class IndexDBWrapper {
  private readonly storeName: string
  private readonly db: IDBDatabase

  private constructor(db: IDBDatabase, storeName: string) {
    this.db = db
    this.storeName = storeName
  }

  public async set(key: string, value: any) {
    const transaction = this.db.transaction([this.storeName], 'readwrite')
    const store = transaction.objectStore(this.storeName)
    store.put(value, key)
    await this.transactionComplete(transaction)
  }

  public async get(key: string): Promise<any> {
    if (
      this.db.objectStoreNames.length === 0 ||
      !this.db.objectStoreNames.contains(this.storeName)
    )
      return null
    const transaction = this.db.transaction([this.storeName], 'readwrite')
    const store = transaction.objectStore(this.storeName)
    const value = store.get(key)
    await this.transactionComplete(transaction)
    return value.result
  }

  public async remove(key: string) {
    if (
      this.db.objectStoreNames.length === 0 ||
      !this.db.objectStoreNames.contains(this.storeName)
    )
      return
    const transaction = this.db.transaction([this.storeName], 'readwrite')
    const store = transaction.objectStore(this.storeName)
    store.delete(key)
    await this.transactionComplete(transaction)
  }

  static async openDatabase(
    dbName: string,
    version: number,
    storeName: string
  ): Promise<IndexDBWrapper> {
    return new Promise<IndexDBWrapper>((resolve, reject) => {
      let request = indexedDB.open(dbName, version)
      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(new IndexDBWrapper(request.result, storeName))
      }
      request.onupgradeneeded = () => {
        request.result.createObjectStore(storeName)
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
