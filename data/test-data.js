module.exports = {
  login: {
    valid: {
      email: 'demo@techmart.com',
      password: 'demo123'
    },
    invalid: {
      email: 'invalid-email@techmart.com',
      password: 'wrong-password'
    },
    errorMessages: {
      invalidCredentials: 'Invalid credentials',
      requiredEmailMessage: 'Please fill out this field.',
      requiredPasswordMessage: 'Please fill out this field.'
    }
  },
  register: {
    fullName: 'Elhamri Ahmed',
    email: 'elhamri949@gmail.com',
    password: 'Test@12345',
    confirmPassword: 'Test@12345',
    shortPassword: 'abc',
    differentPassword: 'Test@1234',
    errorMessages: {
      passwordMismatch: 'Passwords do not match',
      emailAlreadyRegistered: 'Email already registered',
      shortPassword: 'Please lengthen this text to 8 characters or more'
    }
  },
  categories: {
    allCategories: 'All Categories',

    electronics: {
      name: 'Electronics',
      count: 4
    },
    accessories: {
      name: 'Accessories',
      count: 2
    }
  },
  products: {
    searchTerm: 'Keyboard',
    invalidSearchTerm: 'invalid-product',
    maxPrice: 50,
  },
  shippingInfo: {
    firstName: 'Elhamri',
    lastName: 'Ahmed',
    streetAddress: '123 Test Street',
    streetAddress2: 'Apt 4B',
    city: 'New York',
    state: 'New York',
    zipCode: '10001',
    invalidZipCode: '123',
    phoneNumber: '1234567890',
  },
  paymentInfo: {
    cardholderName: 'Elham Tester',
    cardNumber: '4111111111111111',
    expiryDate: '1230',
    cvv: '123',
  }
};
