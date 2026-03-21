"""
Seed script to populate database with sample items
Run with: python seed.py
"""

from app import app, db
from models import Item

def seed_database():
    """Add sample items to the database"""
    with app.app_context():
        # Clear existing items
        Item.query.delete()
        
        # Sample items
        sample_items = [
            Item(
                name='Wireless Earbuds',
                description='High-quality wireless earbuds with noise cancellation',
                category='Electronics',
                price=79.99
            ),
            Item(
                name='Cotton T-Shirt',
                description='Comfortable 100% cotton t-shirt available in multiple colors',
                category='Clothing',
                price=29.99
            ),
            Item(
                name='Organic Coffee Beans',
                description='Premium organic coffee beans sourced from Ethiopia',
                category='Food',
                price=14.99
            ),
            Item(
                name='Python Programming Book',
                description='Complete guide to Python programming for beginners and advanced users',
                category='Books',
                price=49.99
            ),
            Item(
                name='USB-C Hub',
                description='7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
                category='Electronics',
                price=39.99
            ),
            Item(
                name='Yoga Mat',
                description='Non-slip yoga mat with carrying strap',
                category='General',
                price=24.99
            ),
            Item(
                name='Stainless Steel Water Bottle',
                description='Insulated water bottle keeps drinks hot for 12 hours or cold for 24 hours',
                category='General',
                price=34.99
            ),
            Item(
                name='Leather Wallet',
                description='Premium leather wallet with RFID protection',
                category='Clothing',
                price=59.99
            ),
            Item(
                name='Smartphone Stand',
                description='Adjustable phone stand for desk, works with all devices',
                category='Electronics',
                price=12.99
            ),
            Item(
                name='Green Tea',
                description='Authentic Japanese green tea with antioxidants',
                category='Food',
                price=9.99
            )
        ]
        
        # Add items to session
        for item in sample_items:
            db.session.add(item)
        
        # Commit to database
        db.session.commit()
        
        print(f"✅ Successfully seeded database with {len(sample_items)} items!")

if __name__ == '__main__':
    seed_database()
