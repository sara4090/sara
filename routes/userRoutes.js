const express = require('express');
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const uploadImages = require('../middleware/uploadFile')

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { signupValidation, loginValidation, validationsForAddingProducts, categoryValidation, passwordValidation, rfqValidations } = require('../middleware/validation')


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
const { orderStatus } = require('../controllers/orderStatus');
const { addCategory } = require('../controllers/addCategory');
const { fetchCategories } = require('../controllers/fetchCategories');
const { addFeedback } = require('../controllers/addFeedback');
const { fetchFeedbacks } = require('../controllers/fetchFeedback');
const { addToCart, removeFromCart, fetchCartStatus } = require('../controllers/addAndRemoveFromCart');
// const { addPaymentMethod } = require('../controllers/addPaymentMethod');
// const { validatePaymentMethod } = require('../controllers/validatePayment');
const { addSubCategory } = require('../controllers/addSubCategory');
const { fetchSubCategories } = require('../controllers/fetcSubCategories');
const { deleteSubCategory } = require('../controllers/deleteSubCategory');
const { deleteCategory } = require('../controllers/deleteCategory');
//const { createCustomer, createIntent, attachPaymentMethod } = require('../controllers/addCustomrForPAyment');
//const { createPaymentIntent, handlePaymentStatus } = require('../controllers/addStripePay');
// const { importData } = require('../data/importData');
//const { addStripePaymentMethod } = require('../controllers/addStripePayment');
const { confirmPayment } = require('../controllers/addStripePayment');
const { submitRfq } = require('../controllers/RQFformSubmission');
// const { sendAttachMent } = require('../controllers/RFQAttachmentSubmission');
const { sendAttachment } = require('../controllers/RFQexcelMail');
const { RFQhistory } = require('../controllers/RFQhistory');
const { getSalesPerMonth } = require('../controllers/salesPerMonth');
const { addStripePaymentMethod, stripeWebhook } = require('../controllers/addStripePaymentWithCustomer');
const { addSubscription, getSingleSubscription, getAllSubscriptions, deleteSubscription } = require('../controllers/subscription');

//USER`S ROUTES
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/getUserDetails', fetchUser, getUserDetails)
router.get('/verify', verifyMail);
router.post('/forgetPassword', forgetPassword)
router.post('/resetPassword', passwordValidation,  resetPassword)
router.post('/updatePassword', fetchUser, updatePassword)
router.patch('/updateUserInfo/:_id', fetchUser, updateUserInfo)
router.get('/getUserData/:id', fetchUser, getUserData)
router.get('/userLogout', fetchUser, userLogout)
router.delete('/deleteAccount/:id', fetchUser, deleteAccount);

//PRODUCTS ROUTS;
router.post('/addProduct', validationsForAddingProducts, uploadImages, fetchUser, addProduct);
router.post('/addToFvrt/:id', fetchUser, addToFavourite)
router.delete('/removeFromFvrt/:id', fetchUser, deleteFromFavorite)
router.get('/fetchSingleProduct/:id', fetchUser, fetchSingleProduct)
router.get('/fetchAllProducts', fetchUser, fetchProducts)
router.patch('/updateProduct/:id', fetchUser, updateProduct)
router.delete('/deleteProduct/:id', fetchUser, deleteProduct)
router.get('/searchProduct', fetchUser, searchProduct)
router.get('/popularSearchedProducts', fetchUser, popularSearhedProducts)
router.get('/latestproducts', fetchUser, latestProducts)
router.get('/getRecomendedProducts', fetchUser, recomendedProducts)
router.post('/productRecomendation', fetchUser, productRecomendations)

//ORDERS ROUTES
router.post('/addOrder/:id', fetchUser, addOrder)
router.delete('/deleteOrder/:id', fetchUser, deleteOrder)
router.get('/fetchSingleOrder/:id', fetchUser, fetchSingleOrder)
router.patch('/orderStatus/:id', orderStatus)

//CATEGORY ROUTES
router.post('/addCategory', fetchUser, addCategory);
router.get('/fetchCategories', fetchCategories)
router.post('/addSubCategory/:id', fetchUser, categoryValidation, addSubCategory);
router.get('/fetchSubCategories/:id', fetchUser, fetchSubCategories)
router.delete('/deleteSubCategory/:id', fetchUser, deleteSubCategory)
router.delete('/deleteCategory/:id', fetchUser, deleteCategory)

//FEEDBACK
router.post('/addFeedback', fetchUser, addFeedback)
router.get('/fetchFeedback', fetchUser, fetchFeedbacks)

//CART ROUTES
router.post('/addToCart', fetchUser, addToCart)
router.delete('/removeFromCart/:id', fetchUser, removeFromCart)
router.get('/fetchCartStatus', fetchUser, fetchCartStatus)


//PAYMENT

//router.post('/addStripePayment',fetchUser,addStripePaymentMethod)
router.post('/stripeWithCustomer', fetchUser, addStripePaymentMethod)
// router.post('/confirmPayment', fetchUser, confirmPaymentIntent)
// router.post('/cancelPayment', fetchUser, cancelPayment)
router.post('/webhook', express.raw({type: 'application/json'}), stripeWebhook)
router.get('/salesLastFewMonth', getSalesPerMonth)

//Submit form
router.post('/submitForm', submitRfq)
router.post('/sendAttachment', upload.single('file'), sendAttachment)
router.get('/rqfHistory', RFQhistory)
module.exports = router;

//Subscriptions
router.post('/addSubscription', addSubscription)
router.get('/getSingleSubscription/:email', getSingleSubscription)
router.get('/getAllSubscription', getAllSubscriptions)
router.delete('/deleteSubscription/:email', deleteSubscription)
