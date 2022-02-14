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
  get(id) {
    const fileName = `${id}.json`;
    this.obj = path.join(this.dirPath, fileName);
    return readFile(this.obj)
      .then((obj) => JSON.parse(obj))
      .catch((error) => {
        if (error.code === 'ENOENT') {
          return 'Not Found';
        }
        throw error;
      });
  }
  getAll() {
    return readdir(this.dirPath)
      .then((response) => Promise.all(
        response.map(async json => {
          const file = await readFile(path.join(this.dirPath, json));
          return JSON.parse(file);
        })
      ))
  }
}

module.exports = SimpleDb;
