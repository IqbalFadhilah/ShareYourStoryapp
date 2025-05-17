import { openDB } from 'idb';

const DB_NAME = 'story-app-db';
const STORE_NAME = 'bookmarks';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
  },
});

const BookmarkDB = {
  async saveStory(story) {
    return (await dbPromise).put(STORE_NAME, story);
  },
  async getAllStories() {
    return (await dbPromise).getAll(STORE_NAME);
  },
  async deleteStory(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  },
  async getStory(id) {
    return (await dbPromise).get(STORE_NAME, id);
  },
};

export default BookmarkDB;
