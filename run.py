#!/usr/bin/env python3
"""
FitByte - Fitness Tracking Application
Run script for the Flask application
"""

import os
from app import app, db
from init_db import init_database, seed_sample_data

def main():
    """Main function to run the application"""
    # Set environment variables
    os.environ['FLASK_ENV'] = 'development'
    os.environ['FLASK_DEBUG'] = '1'
    
    print("=" * 50)
    print("FitByte Fitness Tracking Application")
    print("=" * 50)
    
    # Initialize database
    try:
        init_database()
        seed_sample_data()
        print("Database setup completed!")
    except Exception as e:
        print(f"Database setup error: {e}")
        print("Continuing anyway...")
    
    print("Starting Flask development server...")
    print("=" * 50)
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )

if __name__ == '__main__':
    main() 