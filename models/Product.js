const mongoose = require("mongoose");
const { Schema } = mongoose;

const offersSchema = new Schema({
  label: { type: String },
  values: [{ type: String }],
});

const productSchema = new Schema({
  name: { type: String },
  category: { type: String },
  images: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],

  description: { type: String },
  basicInfo: { type: String },
  price: { type: String },
  inventory: { type: String },
  brand: { type: String },
  ram: { type: String },
  storage: { type: String },
  compatible: { type: String },
  material: { type: String },
  type: { type: String },
  factoryLead: { type: String },
  lifeCycle: { type: String },
  contactPlating: { type: String },
  housingMaterial: { type: String },
  processor: { type: String },
  capacity: { type: String },
  pinsNo: { type: String },
  ram_processor: { type: String },
  operating_system: { type: String },
  memory: { type: String },
  memory_technology: { type: String },
  size: { type: String },
  antenna: { type: String },
  frequency_band: { type: String },
  number_of_cells: { type: String },
  number_of_cores: { type: String },
  designed_for: { type: String },
  wired_wireless: { type: String },
  CPC: { type: String },
  connectivity: { type: String },
  refilling_type: { type: String },
  panel_type: { type: String },
  screen_form_factor: { type: String },
  chip_set: { type: String },
  display_technology: { type: String },
  color_type: { type: String },
  color: { type: String },
  hsn_code: { type: String },
  sku: { type: String },
  stock: { type: String },
  payment_method: {
    bank_account: { type: Boolean },
    credit_card: { type: Boolean },
    debit_card: { type: Boolean },
    phonepe_upi: { type: Boolean },
    cash_on_delivery: { type: Boolean },
  },
  price_before: { type: String },
  max_order_qty: { type: String },
  min_order_qty: { type: String },
  primary_products: { type: String },
  prime_partner: { type: String },
  length: { type: String },
  breadth: { type: String },
  image_title: { type: String },
  height: { type: String },
  weight: { type: String },
  offers: [offersSchema],
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
