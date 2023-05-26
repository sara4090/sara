const { check } = require('express-validator');

exports.signupValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password must be atleast 8 charcters long including lower case upper case, special characters  and numbers').isStrongPassword({
        min: 8,
        allow_numbers: true,
        allow_lowercase: true,
        allow_uppercase: true,
    }),
    check('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    check('companyName', 'Company name is required').not().isEmpty(),
    check('phoneNumber', 'Phone number should be minimum 10 digits').isLength({ min: 10, max: 11 }),

    check('address', 'Address is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
    check('state', 'State is required').not().isEmpty(),

]
// FOR LOGIN
exports.loginValidation = [
    check('email', 'Email is required').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password is required').isStrongPassword({
        min: 8,
        allow_numbers: true,
        allow_lowercase: true,
        allow_uppercase: true,
    })

]

exports.validationsForAddingProducts = [
    check('name', 'Name is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description must be 10 charcarters long').isLength({ min: 10 }),
    check('price', 'Price is required').not().isEmpty(),
    check('quantity', 'Quantity is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    // check('images', 'Image is required').not().isEmpty(),
]
exports.categoryValidation = [
    check('name', 'Name already exists').exists(),

]
exports.adminSignupValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password must be atleast 8 charcters long including lower case upper case, special characters  and numbers').isStrongPassword({
        min: 8,
        allow_numbers: true,
        allow_lowercase: true,
        allow_uppercase: true,
    }),
    check('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
]

exports.fileValidation = [
    check('file').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('File is required');
        } else if (
            !['application/vnd.ms-excel', 'text/csv', 'application/pdf'].includes(
                req.file.mimetype
            )
        ) {
            throw new Error('File type not supported');
        } else {
            return true;
        }
    })

]

exports.blogValidation = [
    check('title', 'Title must be atleast 10 characters long.').isLength({ min: 10 }),
    check('description', 'Description must be atleast 50 characters long.').isLength({ min: 50 }),
]

exports.passwordValidation = [
    check('password', 'Password must be atleast 8 charcters long including lower case upper case, special characters  and numbers').isStrongPassword({
        min: 8,
        allow_numbers: true,
        allow_lowercase: true,
        allow_uppercase: true,
    })
]

exports.rfqValidations = [
    check('partNumberList', 'Part Number is required' ).not().isEmpty(),
    check('mfrList', 'Menufecturer is required').not().isEmpty(),
    check('qtyList', 'Quantity is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('phone', 'Phone is required').not().isEmpty(),
    check('country', 'Country name is required').not().isEmpty(),

]