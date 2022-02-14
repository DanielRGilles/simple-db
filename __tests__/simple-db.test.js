const fs = require('fs/promises');
const path = require('path');
const shortid = require('shortid');

const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

describe('simple database', () => {

  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  it('should save a json file in the store dir and then retrieve', () => {
    const shortyId = shortid.generate();
    const storeHouse = new SimpleDb(rootDir);
    const jsonFile = { id: `${shortyId}`, name:'nombre' } ;

    return storeHouse
      .save(jsonFile)
      .then(() => storeHouse.get(jsonFile.id))
      .then((retrievedFile) => expect(retrievedFile).toEqual(jsonFile));
  });

});
