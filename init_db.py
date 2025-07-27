#!/usr/bin/env python3
"""
Database initialization script for FitByte
Creates tables and seeds sample data
"""

from app import app, db, User, Workout, Meal, Goal, BMIRecord, DietPlan
from datetime import datetime, date
import json

def init_database():
    """Initialize the database with tables"""
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Database tables created successfully!")

def seed_sample_data():
    """Seed the database with sample data"""
    with app.app_context():
        # Check if we already have users
        if User.query.first():
            print("Database already has data, skipping seed...")
            return
        
        print("Seeding sample data...")
        
        # Create sample user
        sample_user = User(
            username='demo_user',
            email='demo@fitbyte.com',
            first_name='Demo',
            last_name='User',
            date_of_birth=date(1990, 1, 1),
            height=170.0,
            weight=70.0,
            gender='male',
            activity_level='moderately_active'
        )
        sample_user.set_password('password123')
        
        db.session.add(sample_user)
        db.session.commit()
        print(f"Created demo user: {sample_user.username}")
        
        # Create sample workouts
        sample_workouts = [
            Workout(
                user_id=sample_user.id,
                workout_type='Cardio',
                duration=30,
                calories_burned=300,
                notes='Morning run in the park',
                date=date.today()
            ),
            Workout(
                user_id=sample_user.id,
                workout_type='Strength Training',
                duration=45,
                calories_burned=250,
                notes='Upper body workout',
                date=date.today()
            ),
            Workout(
                user_id=sample_user.id,
                workout_type='Yoga',
                duration=60,
                calories_burned=150,
                notes='Evening yoga session',
                date=date.today()
            )
        ]
        
        for workout in sample_workouts:
            db.session.add(workout)
        print(f"Created {len(sample_workouts)} sample workouts")
        
        # Create sample meals
        sample_meals = [
            Meal(
                user_id=sample_user.id,
                meal_name='Oatmeal with Berries',
                meal_time=datetime.strptime('08:00', '%H:%M').time(),
                calories=300,
                protein=12.0,
                carbs=45.0,
                fats=8.0,
                date=date.today()
            ),
            Meal(
                user_id=sample_user.id,
                meal_name='Grilled Chicken Salad',
                meal_time=datetime.strptime('12:30', '%H:%M').time(),
                calories=450,
                protein=35.0,
                carbs=15.0,
                fats=25.0,
                date=date.today()
            ),
            Meal(
                user_id=sample_user.id,
                meal_name='Salmon with Vegetables',
                meal_time=datetime.strptime('19:00', '%H:%M').time(),
                calories=550,
                protein=40.0,
                carbs=30.0,
                fats=20.0,
                date=date.today()
            )
        ]
        
        for meal in sample_meals:
            db.session.add(meal)
        print(f"Created {len(sample_meals)} sample meals")
        
        # Create sample goals
        sample_goals = [
            Goal(
                user_id=sample_user.id,
                goal_name='Lose Weight',
                target_value=5.0,
                current_value=2.0,
                unit='kg'
            ),
            Goal(
                user_id=sample_user.id,
                goal_name='Run 5K',
                target_value=5.0,
                current_value=3.0,
                unit='km'
            ),
            Goal(
                user_id=sample_user.id,
                goal_name='Workout 5 times per week',
                target_value=5.0,
                current_value=3.0,
                unit='times'
            )
        ]
        
        for goal in sample_goals:
            db.session.add(goal)
        print(f"Created {len(sample_goals)} sample goals")
        
        # Create sample BMI record
        bmi_record = BMIRecord(
            user_id=sample_user.id,
            weight=70.0,
            height=170.0,
            bmi_value=24.2,
            bmi_category='Normal weight',
            date=date.today()
        )
        db.session.add(bmi_record)
        print("Created sample BMI record")
        
        # Create sample diet plan
        sample_diet_plan = {
            'breakfast': {
                'name': 'Protein Smoothie Bowl',
                'calories': 350,
                'protein': 25,
                'carbs': 30,
                'fats': 12
            },
            'lunch': {
                'name': 'Quinoa Buddha Bowl',
                'calories': 450,
                'protein': 20,
                'carbs': 45,
                'fats': 18
            },
            'dinner': {
                'name': 'Baked Salmon with Sweet Potato',
                'calories': 550,
                'protein': 35,
                'carbs': 40,
                'fats': 22
            },
            'snacks': [
                {
                    'name': 'Greek Yogurt with Nuts',
                    'calories': 200,
                    'protein': 15,
                    'carbs': 10,
                    'fats': 12
                }
            ]
        }
        
        diet_plan = DietPlan(
            user_id=sample_user.id,
            plan_name='Balanced Fitness Plan',
            diet_type='balanced',
            calorie_goal=2000,
            plan_data=json.dumps(sample_diet_plan)
        )
        db.session.add(diet_plan)
        print("Created sample diet plan")
        
        db.session.commit()
        print("Sample data seeded successfully!")
        print("\nDemo account created:")
        print("Username: demo_user")
        print("Password: password123")

def main():
    """Main function to initialize database"""
    print("=" * 50)
    print("FitByte Database Initialization")
    print("=" * 50)
    
    try:
        init_database()
        seed_sample_data()
        print("\n" + "=" * 50)
        print("Database initialization completed successfully!")
        print("=" * 50)
    except Exception as e:
        print(f"Error during database initialization: {e}")
        return 1
    
    return 0

if __name__ == '__main__':
    exit(main()) 