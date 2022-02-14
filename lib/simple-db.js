// const fs = require('fs/promises');
const path = require('path');
const shortid = require('shortid');
const { writeFile, readFile, readdir } = require('fs/promises');

class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }
  save(obj) {
    const id = shortid.generate();
    obj['id'] = id;
    const fileName = `${id}.json`;
    this.obj = path.join(this.dirPath, fileName); 
    const stringy = JSON.stringify(obj);
    return writeFile(this.obj, stringy);
  }
  async get(id) {
    const fileName = `${id}.json`;
    this.obj = path.join(this.dirPath, fileName);
    try {
      const obj = await readFile(this.obj);
      return JSON.parse(obj);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return 'Not Found';
      }
      throw error;
    }
  }
  async getAll() {
    const response = await readdir(this.dirPath);
    return await Promise.all(
      response.map(async (json) => {
        const file = await readFile(path.join(this.dirPath, json));
        return JSON.parse(file);
      })
    );
  }
}

module.exports = SimpleDb;
