export const environment = {
  production: true,
  useEmulators: false,
  api: 'http://127.0.0.1:5001/bnm-01-abd4b/us-central1/api',
  firebaseConfig: {
    apiKey: "AIzaSyA0LMo7LR0QcHf_ZOy5ozuG_KT4hnGx51k",
    authDomain: "bnm-01-abd4b.firebaseapp.com",
    projectId: "bnm-01-abd4b",
    storageBucket: "bnm-01-abd4b.appspot.com",
    messagingSenderId: "1040575377552",
    appId: "1:1040575377552:web:98ae956ea87d7840766815",
    measurementId: "G-DQB4L8VBDE"
  },
  //ALGOLIA CONFIG
  algolia: {
    appID: 'CKJQ46D11T',
    searchKey: '020bc175a201a0515a5a52f951e1fb54',
    indexes: {
      customers: 'customers_dev'
    }
  }
};
