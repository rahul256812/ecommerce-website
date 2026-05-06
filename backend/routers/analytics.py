from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract
from database import get_db
from models import (
    User, Product, Order, RFQ, OrderItem, 
    UserRole, OrderStatus, RFQStatus
)
from auth import get_current_user, require_role
from datetime import datetime, timedelta
from typing import List, Optional
import decimal

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

# Vendor Analytics Endpoints

@router.get("/sales-forecast")
async def get_sales_forecast(
    current_user: User = Depends(require_role(UserRole.VENDOR)),
    db: Session = Depends(get_db),
    product_id: Optional[int] = Query(None),
    period: str = Query("monthly")
):
    """Generate sales forecast for vendor products"""
    # Get vendor's products
    vendor_products = db.query(Product).filter(Product.vendor_id == current_user.id).all()
    
    if product_id:
        vendor_products = [p for p in vendor_products if p.id == product_id]
    
    forecasts = []
    for product in vendor_products:
        # Get historical sales data
        historical_sales = db.query(OrderItem, Order).join(Order).filter(
            and_(
                OrderItem.product_id == product.id,
                Order.vendor_id == current_user.id,
                Order.status.in_([OrderStatus.DELIVERED, OrderStatus.CONFIRMED]),
                Order.created_at >= datetime.utcnow() - timedelta(days=90)
            )
        ).all()
        
        # Simple forecast calculation (can be enhanced with ML)
        total_quantity = sum(item.quantity for item, order in historical_sales)
        avg_monthly_sales = total_quantity / 3 if historical_sales else 0
        
        forecast = {
            "product_id": product.id,
            "product_name": product.name,
            "period": period,
            "historical_sales": total_quantity,
            "forecasted_sales": round(avg_monthly_sales * 1.1, 2),  # 10% growth assumption
            "confidence": 0.75,
            "forecasted_revenue": round(avg_monthly_sales * 1.1 * product.price, 2)
        }
        forecasts.append(forecast)
    
    return forecasts

@router.get("/product-performance")
async def get_product_performance(
    current_user: User = Depends(require_role(UserRole.VENDOR)),
    db: Session = Depends(get_db),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    """Get product performance analytics for vendor"""
    query = db.query(Product).filter(Product.vendor_id == current_user.id)
    
    products = query.all()
    performance_data = []
    
    for product in products:
        # Get sales data
        sales_query = db.query(OrderItem, Order).join(Order).filter(
            and_(
                OrderItem.product_id == product.id,
                Order.vendor_id == current_user.id,
                Order.status.in_([OrderStatus.DELIVERED, OrderStatus.CONFIRMED])
            )
        )
        
        if start_date:
            sales_query = sales_query.filter(Order.created_at >= start_date)
        if end_date:
            sales_query = sales_query.filter(Order.created_at <= end_date)
            
        sales_data = sales_query.all()
        
        # Calculate metrics
        total_sales = sum(item.quantity for item, order in sales_data)
        total_revenue = sum(item.quantity * item.price for item, order in sales_data)
        
        performance = {
            "product_id": product.id,
            "product_name": product.name,
            "category": product.category,
            "total_sales": total_sales,
            "total_revenue": float(total_revenue),
            "average_price": float(product.price),
            "current_stock": product.quantity,
            "reorder_level": 10,  # Can be configurable
            "performance_score": min(100, (total_sales / 10) * 100) if total_sales > 0 else 0
        }
        performance_data.append(performance)
    
    return performance_data

@router.get("/conversion-rates")
async def get_conversion_rates(
    current_user: User = Depends(require_role(UserRole.VENDOR)),
    db: Session = Depends(get_db),
    days: int = Query(30)
):
    """Get conversion rates for vendor storefront"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Get RFQs as proxy for "visitors"
    total_visitors = db.query(RFQ).filter(
        and_(
            RFQ.vendor_id == current_user.id,
            RFQ.created_at >= start_date
        )
    ).count()
    
    # Get accepted RFQs as "conversions"
    conversions = db.query(RFQ).filter(
        and_(
            RFQ.vendor_id == current_user.id,
            RFQ.status == RFQStatus.ACCEPTED,
            RFQ.created_at >= start_date
        )
    ).count()
    
    conversion_rate = (conversions / total_visitors * 100) if total_visitors > 0 else 0
    
    return {
        "period_days": days,
        "total_visitors": total_visitors,
        "conversions": conversions,
        "conversion_rate": round(conversion_rate, 2),
        "trend": "increasing"  # Can be calculated based on historical data
    }

@router.get("/commission-history")
async def get_commission_history(
    current_user: User = Depends(require_role(UserRole.VENDOR)),
    db: Session = Depends(get_db),
    limit: int = Query(50)
):
    """Get commission history for vendor"""
    orders = db.query(Order).filter(
        and_(
            Order.vendor_id == current_user.id,
            Order.status.in_([OrderStatus.DELIVERED, OrderStatus.CONFIRMED])
        )
    ).order_by(Order.created_at.desc()).limit(limit).all()
    
    commission_data = []
    for order in orders:
        commission_info = {
            "order_id": order.id,
            "order_date": order.created_at.isoformat(),
            "total_amount": float(order.total_amount),
            "commission_amount": float(order.commission_amount),
            "commission_rate": 5.0,  # Can be fetched from settings
            "status": "paid" if order.created_at < datetime.utcnow() - timedelta(days=7) else "pending"
        }
        commission_data.append(commission_info)
    
    return commission_data

# Buyer Analytics Endpoints

@router.get("/purchase-report")
async def get_purchase_report(
    current_user: User = Depends(require_role(UserRole.BUYER)),
    db: Session = Depends(get_db),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    """Generate purchase report for buyer"""
    query = db.query(Order).filter(Order.buyer_id == current_user.id)
    
    if start_date:
        query = query.filter(Order.created_at >= start_date)
    if end_date:
        query = query.filter(Order.created_at <= end_date)
    
    orders = query.all()
    
    # Calculate metrics
    total_purchases = len(orders)
    total_spent = sum(order.total_amount for order in orders)
    average_order_value = total_spent / total_purchases if total_purchases > 0 else 0
    
    # Category-wise spending
    category_spending = {}
    for order in orders:
        items = db.query(OrderItem, Product).join(Product).filter(
            OrderItem.order_id == order.id
        ).all()
        
        for item, product in items:
            category = product.category
            if category not in category_spending:
                category_spending[category] = 0
            category_spending[category] += item.quantity * item.price
    
    return {
        "total_purchases": total_purchases,
        "total_spent": float(total_spent),
        "average_order_value": float(average_order_value),
        "category_spending": {k: float(v) for k, v in category_spending.items()},
        "period": {
            "start_date": start_date,
            "end_date": end_date
        }
    }

@router.get("/spending-analytics")
async def get_spending_analytics(
    current_user: User = Depends(require_role(UserRole.BUYER)),
    db: Session = Depends(get_db),
    months: int = Query(6)
):
    """Get spending analytics for buyer"""
    start_date = datetime.utcnow() - timedelta(days=30 * months)
    
    orders = db.query(Order).filter(
        and_(
            Order.buyer_id == current_user.id,
            Order.created_at >= start_date,
            Order.status.in_([OrderStatus.DELIVERED, OrderStatus.CONFIRMED])
        )
    ).all()
    
    # Monthly spending
    monthly_spending = {}
    for order in orders:
        month = order.created_at.strftime("%Y-%m")
        if month not in monthly_spending:
            monthly_spending[month] = 0
        monthly_spending[month] += float(order.total_amount)
    
    # Budget analysis using user's configured budget
    monthly_budget = current_user.monthly_budget or 10000
    budget_utilization = {}
    for month, spending in monthly_spending.items():
        budget_utilization[month] = (spending / monthly_budget) * 100
    
    return {
        "period_months": months,
        "monthly_spending": monthly_spending,
        "monthly_budget": monthly_budget,
        "budget_utilization": budget_utilization,
        "total_spent": sum(monthly_spending.values()),
        "average_monthly_spending": sum(monthly_spending.values()) / len(monthly_spending) if monthly_spending else 0
    }

@router.get("/budget-report")
async def get_budget_report(
    current_user: User = Depends(require_role(UserRole.BUYER)),
    db: Session = Depends(get_db)
):
    """Generate budget report for buyer"""
    # Get current month spending
    current_month = datetime.utcnow().replace(day=1)
    orders = db.query(Order).filter(
        and_(
            Order.buyer_id == current_user.id,
            Order.created_at >= current_month,
            Order.status.in_([OrderStatus.DELIVERED, OrderStatus.CONFIRMED])
        )
    ).all()
    
    current_spending = sum(order.total_amount for order in orders)
    monthly_budget = current_user.monthly_budget or 10000  # User-configurable via profile
    remaining_budget = monthly_budget - current_spending
    variance = remaining_budget
    
    return {
        "period": current_month.strftime("%Y-%m"),
        "monthly_budget": monthly_budget,
        "actual_spent": float(current_spending),
        "remaining_budget": float(remaining_budget),
        "variance": float(variance),
        "utilization_percentage": (current_spending / monthly_budget) * 100 if monthly_budget > 0 else 0,
        "status": "over_budget" if variance < 0 else "on_track"
    }

# Admin Analytics Endpoints

@router.get("/platform-analytics")
async def get_platform_analytics(
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN)),
    db: Session = Depends(get_db)
):
    """Get platform-wide analytics"""
    total_users = db.query(User).count()
    total_vendors = db.query(User).filter(User.role == UserRole.VENDOR).count()
    total_buyers = db.query(User).filter(User.role == UserRole.BUYER).count()
    total_products = db.query(Product).count()
    total_orders = db.query(Order).count()
    total_rfqs = db.query(RFQ).count()
    
    # Revenue calculations
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0
    total_commission = db.query(func.sum(Order.commission_amount)).scalar() or 0
    
    return {
        "user_metrics": {
            "total_users": total_users,
            "total_vendors": total_vendors,
            "total_buyers": total_buyers
        },
        "platform_metrics": {
            "total_products": total_products,
            "total_orders": total_orders,
            "total_rfqs": total_rfqs
        },
        "financial_metrics": {
            "total_revenue": float(total_revenue),
            "total_commission": float(total_commission),
            "commission_rate": 5.0
        }
    }

@router.post("/export")
async def export_analytics(
    export_type: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export analytics data"""
    # Implementation would depend on export_type and user role
    return {"message": f"Export request for {export_type} received", "status": "queued"}
