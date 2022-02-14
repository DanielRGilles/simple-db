const { mkdir, rm} = require('fs/promises');
const path = require('path');
const shortid = require('shortid');
const SimpleDb = require('../lib/simple-db');

const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

describe('simple database', () => {

  const clearStore = async () => {
    await rm(TEST_DIR, { force: true, recursive: true });
    return await mkdir(TEST_DIR, { recursive: true });
  };

  beforeEach(clearStore);
  afterEach(clearStore);

 async/await
  it('should save a json file in the store dir and then retrieve Testing both the get and save methods', async() => {

    const shortyId = shortid.generate();
    const storeHouse = new SimpleDb(TEST_DIR);
    const jsonFile = { id: `${shortyId}`, name:'nombre' } ;

    await storeHouse.save(jsonFile)
    const gotFile = await storeHouse.get(jsonFile.id);
    expect(jsonFile).toEqual(gotFile);
  });
  
  it('should return not found for this one since nothing is being stored ', async() => {
    const storeHouse = new SimpleDb(TEST_DIR);
    const gotFile = await storeHouse.get()
     expect(gotFile).toEqual('Not Found');

  });
  it('should return an array of objects that come from the files in the dir', async() => {
    const jsonFile1 = { name:'test1' } ;
    const jsonFile2 = { name:'test2' } ;
    const jsonFile3 = { name:'test3' } ;
    const jsonFile4 = { name:'test4' } ;
    const storeHouse = new SimpleDb(TEST_DIR);
    const expectation = [
      { id: expect.any(String), name:'test1' },
      { id: expect.any(String), name:'test2' },
      { id: expect.any(String), name:'test3' },
      { id: expect.any(String), name:'test4' }
    ];
    await storeHouse.save(jsonFile1);
    await storeHouse.save(jsonFile2);
    await storeHouse.save(jsonFile3);
    await storeHouse.save(jsonFile4);
      
    const allOfthem = await storeHouse.getAll();
     expect(allOfthem).toEqual(expect.arrayContaining( expectation ));
  });
});
