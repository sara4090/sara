const express = require('express');
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
// const {uploadMultiple} = require('../middleware/uploads')
const { signupValidation , loginValidation, validationsForAddingProducts, categoryValidation } = require('../middleware/validation')


const { signup } = require('../controllers/signup');
const { login } = require('../controllers/login');
const { verifyMail } = require('../mails/verifymail');
const { getUserDetails } = require('../controllers/fetchUserData');
const { forgetPassword } = require('../controllers/forgetPassword');
const { resetPassword } = require('../controllers/resetPassword');
const { updatePassword } = require('../controllers/updatePassword');
const { updateUserInfo } = require('../controllers/updateUserInfo');
const { getUserData } = require('../controllers/getUserData');
const { userLogout } = require('../controllers/logout');
const { deleteAccount } = require('../controllers/deleteAccount');
const { addProduct } = require('../controllers/addProduct');
const { addToFavourite, deleteFromFavorite } = require('../controllers/addandRemoveFromFvrt');
const { deleteProduct } = require('../controllers/deleteProduct');
const { fetchSingleProduct } = require('../controllers/fetchSingleProduct');
const { fetchProducts } = require('../controllers/fetchAllProducts');
const { searchProduct } = require('../controllers/searchProduct');
const { popularSearhedProducts } = require('../controllers/popularSearchedProducts');
const { latestProducts } = require('../controllers/latestProducts');
const { recomendedProducts } = require('../controllers/recomendedProducts');
const { productRecomendations } = require('../controllers/productRecomendation');
const { updateProduct } = require('../controllers/updateProduct');
const { addOrder } = require('../controllers/addOrder');
const { deleteOrder } = require('../controllers/deleteOrder');
const { fetchSingleOrder } = require('../controllers/fetchSingleOrder');
const { fetchAllOrders } = require('../controllers/fetchAllOrders');
const { orderStatus } = require('../controllers/orderStatus');
const { addCategory } = require('../controllers/addCategory');
const { fetchCategories } = require('../controllers/fetchCategories');
const { addFeedback } = require('../controllers/addFeedback');
const { fetchFeedbacks } = require('../controllers/fetchFeedback');

//USER`S ROUTES
router.post('/signup', signupValidation, signup);
router.post('/login',loginValidation, login);
router.get('/getUserDetails',fetchUser, getUserDetails )
router.get('/verify', verifyMail);
router.post('/forgetPassword', forgetPassword)
router.get('/resetPassword', resetPassword)
router.post('/updatePassword',fetchUser, updatePassword)
router.patch('/updateUserInfo/:_id', fetchUser, updateUserInfo)
router.get('/getUserData/:id',fetchUser, getUserData)
router.get('/userLogout',fetchUser, userLogout )
router.delete('/deleteAccount/:id',fetchUser, deleteAccount);

//PRODUCTS ROUTS
router.post('/addProduct'  , validationsForAddingProducts , fetchUser , addProduct);
router.post('/addToFvrt/:id' , fetchUser , addToFavourite)
router.delete('/removeFromFvrt/:id', fetchUser ,  deleteFromFavorite)
router.get('/fetchSingleProduct/:id', fetchUser , fetchSingleProduct)
router.get('/fetchAllProducts', fetchUser , fetchProducts)
router.patch('/updateProduct/:id', fetchUser , updateProduct)
router.delete('/deleteProduct/:id', fetchUser , deleteProduct)
router.get('/searchProduct', fetchUser,  searchProduct)
router.get('/popularSearchedProducts', fetchUser , popularSearhedProducts)
router.get('/latestproducts', fetchUser , latestProducts)
router.get('/getRecomendedProducts', fetchUser , recomendedProducts)
router.post('/productRecomendation', fetchUser , productRecomendations)

//ORDERS ROUTES
router.post('/addOrder', fetchUser , addOrder)
router.delete('/deleteOrder/:id', fetchUser , deleteOrder)
router.get('/fetchSingleOrder/:id', fetchUser , fetchSingleOrder)
router.get('/fetchAllOrders', fetchUser , fetchAllOrders)
router.patch('/orderStatus/:id', orderStatus)

//CATEGORY ROUTES
router.post('/addCategory', categoryValidation ,  addCategory);
router.get('/fetchCategories', fetchCategories)

//FEEDBACK
router.post('/addFeedback', fetchUser,  addFeedback)
router.get('/fetchFeedback', fetchUser , fetchFeedbacks)

module.exports = router;