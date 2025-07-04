import { Schema, model } from "mongoose";

const analyticsSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId, ref: "users", required: true,
    },
    totalSales: { type: Number, default: 0, },
    totalRevenue: { type: Number, default: 0, },
    dailyStats: [{
      date: { type: Date, required: true, },
      sales: { type: Number, default: 0, },
      revenue: { type: Number, default: 0, }
    }],
    popularProducts: [{
      productId: { type: Schema.Types.ObjectId, ref: "products", },
      salesCount: { type: Number, default: 0, },
      revenue: { type: Number, default: 0, }
    }],
    customerStats: {
      totalCustomers: { type: Number, default: 0, },
      returningCustomers: { type: Number, default: 0, },
      newCustomers: { type: Number, default: 0, }
    },
    brandStats: [{
      brandId: { type: Schema.Types.ObjectId, ref: "brands", },
      brandName: { type: String },
      brandLogo: { type: String },
      totalSales: { type: Number, default: 0, },
      totalRevenue: { type: Number, default: 0, }
    }]
  },
  { timestamps: true }
);

analyticsSchema.pre(/^find/, function (next) {
  this.populate("ownerId", "name email");
  next();
});

export default model("analytics", analyticsSchema); 

/*
  Analytics Data Structure
{
  ownerId: {
    _id: "ownerId123",
    name: "Owner Name",
    email: "owner@email.com"
  },
  totalSales: 150,        // Total number of orders
  totalRevenue: 15000,    // Total money earned
  dailyStats: [           // Array of daily statistics
    {
      date: "2024-03-01",
      sales: 5,           // Orders on this day
      revenue: 500        // Money earned this day
    },
    ... more days
  ],
  popularProducts: [      // Top 5 selling products
    {
      productId: {
        _id: "productId123",
        name: "Product Name",
        price: 100,
        coverImage: "image_url"
      },
      salesCount: 20,     // How many times sold
      revenue: 2000       // Money earned from this product
    },
    ... more products (max 5)
  ],
  customerStats: {
    totalCustomers: 100,      // Total unique customers
    returningCustomers: 30,   // Customers who bought before
    newCustomers: 70         // First-time customers
  },
  brandStats: [              // Statistics for each brand
    {
      brandId: {
        _id: "brandId123",
        name: "Brand Name",
        logo: "logo_url"
      },
      totalSales: 50,        // Products sold under this brand
      totalRevenue: 5000     // Money earned from this brand
    }
    ... more brands
  ],
  createdAt: "2024-03-01T...",
  updatedAt: "2024-03-01T..."
}
*/ 