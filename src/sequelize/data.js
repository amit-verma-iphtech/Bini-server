const users_backup = require('../../backup/users19Nov.json');

const tagsData = [
  { priority: 1, text: 'Tag 1' },
  { priority: 2, text: 'Tag 2' },
  { priority: 3, text: 'Tag 3' },
  { priority: 4, text: 'Tag 4' },
  { priority: 5, text: 'Tag 5' },
  { priority: 6, text: 'Tag 6' },
  { priority: 7, text: 'Tag 7' },
  { priority: 8, text: 'Tag 8' },
  { priority: 9, text: 'Tag 9' },
];
const locationsData = [
  {
    address: 'Location 1',
    long: 2,
    lat: 1,
  },
  {
    address: 'Location 2',
    long: 2,
    lat: 1,
  },
  {
    address: 'Location 3',
    long: 2,
    lat: 1,
  },
];
const storesList = require('../../backup/stores24Nov.json');

const storesData = () => {
  return storesList.map(({ name, locationId, id }) => ({ id, name, locationId }));
};
const camerasData = [
  {
    rtsp_uri: 'rtsp://admin:2autonomy@bini.does-it.net:554/Streaming/Channels/401',
    model_name: 'Hikvision-DS-2CD2386G2-I(U)',
    storeId: 1,
  },
  {
    rtsp_uri: 'rtsp://admin:2autonomy@bini.does-it.net:554/Streaming/Channels/401',
    model_name: 'Hikvision-DS-2CD2386G2-I(U)',
    storeId: 2,
  },
  {
    rtsp_uri: 'rtsp://admin:2autonomy@bini.does-it.net:554/Streaming/Channels/401',
    model_name: 'Hikvision-DS-2CD2386G2-I(U)',
    storeId: 3,
  },
];
const categories = require('../../backup/category24Nov.json');

const categoriesData = () => {
  const categoryList = [];
  categories.map(({ name, id, imageUrl }) => {
    const search = (element) => name === element.name;
    const index = categoryList.findIndex(search);
    if (index == -1 && name) {
      return categoryList.push({ name, id, imageUrl });
    }
  });
  return categoryList;
};
const items = require('../../backup/items18Nov.json');
const { randomNum } = require('../utils/helper');

const itemsData = items.map((props, idx) => {
  return {
    id: props.id,
    name: props.name,
    description: props.description,
    imageUrl: props.imageUrl || '',
  };
});
const ref_item_storeData = ({ storeIdRange }) => {
  const refItemData = [];
  const cacl = {
    WS29: 0,
    Gebit: 0,
    Edeka: 0,
  };
  items.map(({ price, discountedPrice, id, ...props }, idx) => {
    const p = price.toString().replace(',', '.') * 1;
    const d = discountedPrice.toString().replace(',', '.') * 1;

    const storeId =
      props.storeId ||
      (props['In WS29 (store_id 1)'] && 1) ||
      (props['In Gebit (store_id 2)'] && 2) ||
      (props['In Edeka (store_id 3)'] && 3) ||
      randomNum(1, storeIdRange || 3);
    const WS29 = !!props['In WS29 (store_id 1)'];
    const Gebit = !!props['In Gebit (store_id 2)'];
    const Edeka = !!props['In Edeka (store_id 3)'];

    // if (props.articleId || props['SAP. NR']) {
    //   console.log(
    //     'storeId-->',
    //     storeId || 'no store id',
    //     props.storeId || 'noProps.storeId',
    //     !!props['In WS29 (store_id 1)'],
    //     !!props['In Gebit (store_id 2)'],
    //     !!props['In Edeka (store_id 3)']
    //   );
    //   console.log(
    //     'storeItemId',
    //     storeItemId || 'noStoreItemid',
    //     storeId || 'noStoreId',
    //     props.articleId || 'noArticleId',
    //     props['SAP. NR'] || 'noSAP.NR'
    //   );
    // }
    const data = {
      price: p,
      discountedPrice: d,
      itemId: id,
      storeId,
      stock: props.stock,

      active: !!props.active,
    };
    if (!p) data.price = 99.99;
    if (!d) data.discountedPrice = 0.1;
    if (!data.price || !data.discountPrice || !data.itemId || !data.storeId) {
      // console.log(
      //   'hello',
      //   data.price || 'noPrice',
      //   data.discountedPrice || 'noDiscount',
      //   data.itemId || 'noId',
      //   data.storeId || 'noStoreId',
      //   data.stock,
      //   data.active,
      //   idx
      // );
    }
    if (data.itemId) {
      const value = props;
      // console.log('nw', value.id);
      // console.log('nw', !!value['In WS29 (store_id 1)']);
      // console.log('nw', !!value['In Gebit (store_id 2)']);
      // console.log('nw', !!value['In Edeka (store_id 3)']);
      // console.log('props', props);
      // console.log('hello', data.price || 'noPrice', data.discountedPrice || 'noDis', data.itemId);
    }
    // const start = 250;
    // const end = 270;
    const categries = categoriesData().filter(({ name }) => name && name !== '');
    if (WS29) {
      const storeItemId = null; // null for storeId 1 (WS29)

      const categoryName = props['Oberwarengruppe Bez.'];
      const search = (element) => categoryName === element.name;
      const index = categries.findIndex(search);
      let categoryId = null;
      if (index > -1) {
        categoryId = categries[index].id;
      }
      refItemData.push({ ...data, storeId: 1, storeItemId, categoryId });
      cacl.WS29 += 1;
    }
    if (Gebit) {
      const categoryName = props['Oberwarengruppe Bez.'];
      const search = (element) => categoryName === element.name;
      const index = categries.findIndex(search);
      let categoryId = null;
      if (index > -1) {
        categoryId = categries[index].id;
      }
      const storeItemId = props.articleId;
      cacl.Gebit += 1;
      refItemData.push({ ...data, storeId: 2, storeItemId, categoryId });
    }
    if (Edeka) {
      const categoryName = props['Edeka Oberwarengruppe Bez.'];
      const search = (element) => categoryName === element.name;
      const index = categries.findIndex(search);
      let categoryId = null;
      if (index > -1) {
        categoryId = categries[index].id;
      }
      const storeItemId = props['SAP. NR'];

      cacl.Edeka += 1;
      refItemData.push({ ...data, storeId: 3, storeItemId, categoryId });
    }
    // if (idx > start - 1 && idx < end) {
    //   refItemData.push(data);
    //   // console.log(
    //   //   'hello',
    //   //   data.price || 'noPrice',
    //   //   data.discountedPrice || 'noDiscount',
    //   //   data.itemId || 'noId',
    //   //   data.storeId || 'noStoreId',
    //   //   data.stock,
    //   //   data.active,
    //   //   idx
    //   // );
    //   console.log(data);
    // }
  });
  console.log('refItemData.length', refItemData.length, items.length);
  console.log('cacl-->', cacl);
  return refItemData;
};
const usersData = users_backup.map(({ email, password, name, role, ...userData }) => {
  return { email, password, name, role, ...userData };
});
const stores = {
  s1: { camera: 1, store: 1 },
  s2: { camera: 2, store: 2 },
  s3: { camera: 3, store: 2 },
};
const availableObservationsData = [
  {
    start: '2021-10-08',
    end: '2021-12-08',
    videoUrl: 'https://storage.googleapis.com/bini-snippets/poc4.0.0-s500-c9-snippet4.mp4',
    cameraId: stores.s1.camera,
    storeId: stores.s1.store,
  },
  {
    start: '2021-10-08',
    end: '2021-12-08',
    videoUrl: 'https://storage.googleapis.com/bini-snippets/poc4.0.0-s500-c4-snippet3.mp4',
    cameraId: stores.s1.camera,
    storeId: stores.s1.store,
  },
  {
    start: '2021-10-08',
    end: '2021-12-08',
    videoUrl: 'https://storage.googleapis.com/bini-snippets/poc4.0.0-s500-c4-snippet1.mp4',
    cameraId: stores.s1.camera,
    storeId: stores.s1.store,
  },
  {
    start: '2021-10-08',
    end: '2021-12-08',
    videoUrl: 'https://storage.googleapis.com/bini-snippets/poc4.0.0-s500-c4-snippet2.mp4',
    cameraId: stores.s1.camera,
    storeId: stores.s1.store,
  },
  {
    start: '2021-10-08',
    end: '2021-12-08',
    videoUrl: 'https://storage.googleapis.com/bini-snippets/poc4.0.0-s500-c4-snippet0.mp4',
    cameraId: stores.s1.camera,
    storeId: stores.s1.store,
  },
  {
    start: '2021-10-08',
    end: '2021-12-08',
    videoUrl: 'https://storage.googleapis.com/bini-snippets/poc4.0.0-s500-c2-snippet3.mp4',
    cameraId: stores.s1.camera,
    storeId: stores.s1.store,
  },
  {
    start: '2021-10-08',
    end: '2021-12-08',
    videoUrl: 'https://storage.googleapis.com/bini-snippets/poc4.0.0-s500-c2-snippet0.mp4',
    cameraId: stores.s1.camera,
    storeId: stores.s1.store,
  },
];
module.exports = {
  tagsData,
  itemsData,
  categoriesData,
  locationsData,
  storesData,
  camerasData,
  usersData,
  ref_item_storeData,
  observationsData: async (numberOfObservations) => {
    const list = [];
    let currentIdx = 0;
    let loop = true;
    while (currentIdx < (numberOfObservations || 100) && !loop) {
      const observationIdx = randomNum(0, availableObservationsData.length);
      const storeIdx = randomNum(1, 3);
      const newObservation = {
        ...availableObservationsData[observationIdx],
        cameraId: stores[`s${storeIdx}`].camera,
        storeId: stores[`s${storeIdx}`].store,
      };
      if (availableObservationsData[observationIdx]) {
        list.push(newObservation);
      } else {
        loop = false;
      }
      currentIdx += 1;
    }
    return list;
  },
};
