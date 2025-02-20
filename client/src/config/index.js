export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const clothingSizes = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "2xl", label: "2XL" },
  { id: "3xl", label: "3XL" },
];

export const footwearSizes = Array.from({ length: 14 }, (_, i) => ({
  id: `uk-${i + 1}`,
  label: `UK ${i + 1}`,
}));

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "clothing", label: "Clothing" },
      { id: "footwear", label: "Footwear" },
      { id: "accessories", label: "Accessories" },
    ],
  },
  {
    label: "Sub Category",
    name: "subCategory",
    componentType: "select",
    dependsOn: "category",
    options: {
      clothing: [
        { id: "men's clothing", label: "Men's Clothing" },
        { id: "women's clothing", label: "Women's Clothing" },
        { id: "kids' clothing", label: "Kids' Clothing" },
      ],
      footwear: [
        { id: "men's footwear", label: "Men's Footwear" },
        { id: "women's footwear", label: "Women's Footwear" },
        { id: "kids' footwear", label: "Kids' Footwear" },
      ],
      accessories: [
        { id: "men's accessories", label: "Men's Accessories" },
        { id: "women's accessories", label: "Women's Accessories" },
        { id: "kids' accessories", label: "Kids' Accessories" },
      ],
    },
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "All Products",
    path: "/shop/listing",
  },
  {
    id: "clothing",
    label: "Clothing",
    path: "/shop/listing",
  },
  {
    id: "footwear",
    label: "Footwear",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M",
};

export const colors = [
  { id: "black", label: "Black" },
  { id: "white", label: "White" },
  { id: "red", label: "Red" },
  { id: "blue", label: "Blue" },
  { id: "green", label: "Green" },
  { id: "yellow", label: "Yellow" },
  { id: "pink", label: "Pink" },
  { id: "purple", label: "Purple" },
  { id: "orange", label: "Orange" },
  { id: "grey", label: "Grey" },
  { id: "brown", label: "Brown" },
  { id: "navy", label: "Navy" },
];

export const filterOptions = {
  category: [
    { id: "clothing", label: "Clothing" },
    { id: "footwear", label: "Footwear" },
    { id: "accessories", label: "Accessories" },
  ],
  subCategory: {
    clothing: [
      { id: "men's clothing", label: "Men's Clothing" },
      { id: "women's clothing", label: "Women's Clothing" },
      { id: "kids' clothing", label: "Kids' Clothing" },
    ],
    footwear: [
      { id: "men's footwear", label: "Men's Footwear" },
      { id: "women's footwear", label: "Women's Footwear" },
      { id: "kids' footwear", label: "Kids' Footwear" },
    ],
    accessories: [
      { id: "men's accessories", label: "Men's Accessories" },
      { id: "women's accessories", label: "Women's Accessories" },
      { id: "kids' accessories", label: "Kids' Accessories" },
    ],
  },
  size: {
    clothing: clothingSizes,
    footwear: footwearSizes,
  },
  color: colors,
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
