import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import analyticsModel from "../models/analyticsModel.js";
import ordersModel from "../models/ordersModel.js";
import productsModel from "../models/productsModel.js";
import brandModel from "../models/brandModel.js";
import apiErrors from "../utils/apiErrors.js";

// Get dashboard analytics for an owner
const getDashboardStats = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id;

  // Get owner's brand
  const ownerBrand = await brandModel.findOne({ owner: ownerId });
  if (!ownerBrand) {
    throw new apiErrors('No brand found for this owner', StatusCodes.NOT_FOUND);
  }

  // Get or create analytics document for the owner
  let analytics = await analyticsModel.findOne({ ownerId })

  if (!analytics) {
    analytics = await analyticsModel.create({ ownerId });
  }

  // Get date range (default: last 30 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  // Update analytics with recent orders
  const recentOrders = await ordersModel.find({
    createdAt: { $gte: startDate, $lte: endDate },
    status: "shipped"
  })
    .populate({
      path: 'cartItems.product',
      select: 'brand'
    })
    .populate('user', 'name');

  // Filter orders to only include those with products from owner's brand
  const ownerOrders = recentOrders.filter(order => {
    const hasBrandProduct = order.cartItems.some(item => {
      return item.product.brand?._id?.toString() === ownerBrand._id.toString();
    });

    return hasBrandProduct;
  });


  // Calculate daily stats
  const dailyStats = {};
  ownerOrders.forEach(order => {
    const date = order.createdAt.toISOString().split('T')[0];
    if (!dailyStats[date]) {
      dailyStats[date] = { sales: 0, revenue: 0 };
    }
    dailyStats[date].sales += 1;
    dailyStats[date].revenue += order.totalPrice;
  });

  // Update popular products
  const productStats = {};
  ownerOrders.forEach(order => {
    order.cartItems.forEach(item => {
      if (item.product.brand?._id?.toString() === ownerBrand._id.toString()) {
        if (!productStats[item.product._id]) {
          productStats[item.product._id] = { salesCount: 0, revenue: 0 };
        }
        productStats[item.product._id].salesCount += item.quantity;
        productStats[item.product._id].revenue += item.price * item.quantity;
      }
    });
  });

  // Get customer statistics
  const uniqueCustomers = new Set(ownerOrders.map(order => order.user._id.toString()));

  // Get previous orders for this brand's products
  const previousOrders = await ordersModel.find({
    createdAt: { $lt: startDate },
    status: "delivered"
  })
    .populate({
      path: 'cartItems.product',
      select: 'brand'
    });

  const ownerPreviousOrders = previousOrders.filter(order =>
    order.cartItems.some(item => item.product.brand?._id?.toString() === ownerBrand._id.toString())
  );

  const previousCustomers = new Set(
    ownerPreviousOrders.map(order => order.user.toString())
  );

  const returningCustomers = new Set(
    [...uniqueCustomers].filter(x => previousCustomers.has(x))
  );

  // Calculate brand statistics
  const brandStats = {
    totalSales: 0,
    totalRevenue: 0
  };

  ownerOrders.forEach(order => {
    order.cartItems.forEach(item => {
      if (item.product.brand?._id?.toString() === ownerBrand._id.toString()) {
        brandStats.totalSales += item.quantity;
        brandStats.totalRevenue += item.price * item.quantity;
      }
    });
  });

  // Update analytics document
  analytics.totalSales = ownerOrders.length;
  analytics.totalRevenue = ownerOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  analytics.dailyStats = Object.entries(dailyStats).map(([date, stats]) => ({
    date: new Date(date),
    ...stats
  }));
  analytics.customerStats = {
    totalCustomers: uniqueCustomers.size,
    returningCustomers: returningCustomers.size,
    newCustomers: uniqueCustomers.size - returningCustomers.size
  };

  // Update popular products (top 5)
  const popularProducts = await productsModel
    .find({ _id: { $in: Object.keys(productStats) } })

  analytics.popularProducts = popularProducts
    .map(product => ({
      productId: product._id,
      salesCount: productStats[product._id.toString()].salesCount,
      revenue: productStats[product._id.toString()].revenue
    }))
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  // Update brand statistics
  analytics.brandStats = [{
    brandId: ownerBrand._id,
    brandName: ownerBrand.name,
    brandLogo: ownerBrand.logo,
    totalSales: brandStats.totalSales,
    totalRevenue: brandStats.totalRevenue
  }];

  await analytics.save();

  res.status(StatusCodes.OK).json({
    success: true,
    data: analytics
  });
});
// Get sales trends
const getSalesTrends = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id;
  const { period = '30' } = req.query; // days

  // Get owner's brand
  const ownerBrand = await brandModel.findOne({ owner: ownerId });
  if (!ownerBrand) {
    throw new apiErrors('No brand found for this owner', StatusCodes.NOT_FOUND);
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period));

  // Get orders with proper population
  const orders = await ordersModel.find({
    createdAt: { $gte: startDate, $lte: endDate },
    status: "shipped"
  })
    .populate({
      path: 'cartItems.product',
      select: 'brand'
    });

  // Filter orders to only include those with products from owner's brand
  const ownerOrders = orders.filter(order => {
    const hasBrandProduct = order.cartItems.some(item => {
      return item.product.brand?._id?.toString() === ownerBrand._id.toString();
    });

    return hasBrandProduct;
  });

  // Calculate trends
  const trends = {};
  ownerOrders.forEach(order => {
    const date = order.createdAt.toISOString().split('T')[0];
    if (!trends[date]) {
      trends[date] = { sales: 0, revenue: 0 };
    }
    trends[date].sales += 1;
    trends[date].revenue += order.totalPrice;
  });

  // Format and sort trend data
  const trendData = Object.entries(trends).map(([date, data]) => ({
    date,
    ...data
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  res.status(StatusCodes.OK).json({
    success: true,
    data: trendData
  });
});
// Get product performance
const getProductPerformance = asyncHandler(async (req, res) => {
  const ownerId = req.user?._id;
  const { period = '30' } = req.query; // days

  // Get owner's brand
  const ownerBrand = await brandModel.findOne({ owner: ownerId });
  if (!ownerBrand) {
    throw new apiErrors('No brand found for this owner', StatusCodes.NOT_FOUND);
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period));

  // Get orders with proper population
  const orders = await ordersModel.find({
    createdAt: { $gte: startDate, $lte: endDate },
    status: "shipped"
  })
    .populate({
      path: 'cartItems.product',
      select: 'brand name price coverImage'
    });

  // Filter orders to only include those with products from owner's brand
  const ownerOrders = orders.filter(order => {
    const hasBrandProduct = order.cartItems.some(item => {
      return item.product.brand?._id?.toString() === ownerBrand._id.toString();
    });

    return hasBrandProduct;
  });

  const productStats = {};
  ownerOrders.forEach(order => {
    order.cartItems.forEach(item => {
      if (item.product.brand?._id?.toString() === ownerBrand._id.toString()) {
        if (!productStats[item.product._id]) {
          productStats[item.product._id] = {
            product: item.product,
            salesCount: 0,
            revenue: 0
          };
        }
        productStats[item.product._id].salesCount += item.quantity;
        productStats[item.product._id].revenue += item.price * item.quantity;
      }
    });
  });

  const performance = Object.values(productStats)
    .sort((a, b) => b.salesCount - a.salesCount);

  res.status(StatusCodes.OK).json({
    success: true,
    data: performance
  });
});

export { getDashboardStats, getSalesTrends, getProductPerformance }; 