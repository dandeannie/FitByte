from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models import db, User, Workout, Meal, Goal, BMIRecord, DietPlan
import json
from datetime import datetime, date

def init_db(app):
    """Initialize the database with the Flask app"""
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        print("Database initialized successfully!")

def seed_sample_data(app):
    """Seed the database with sample data for testing"""
    with app.app_context():
        # Check if we already have users
        if User.query.first():
            print("Database already has data, skipping seed...")
            return
        
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
        
        db.session.commit()
        print("Sample data seeded successfully!")

def get_user_stats(user_id):
    """Get comprehensive user statistics"""
    user = User.query.get(user_id)
    if not user:
        return None
    
    # Workout stats
    total_workouts = Workout.query.filter_by(user_id=user_id).count()
    total_calories_burned = db.session.query(db.func.sum(Workout.calories_burned)).filter_by(user_id=user_id).scalar() or 0
    
    # Goal stats
    total_goals = Goal.query.filter_by(user_id=user_id).count()
    completed_goals = Goal.query.filter_by(user_id=user_id, is_completed=True).count()
    active_goals = total_goals - completed_goals
    
    # Progress calculation
    progress = (completed_goals / total_goals * 100) if total_goals > 0 else 0
    
    # Recent activity
    recent_workouts = Workout.query.filter_by(user_id=user_id).order_by(Workout.date.desc()).limit(5).all()
    recent_meals = Meal.query.filter_by(user_id=user_id).order_by(Meal.date.desc()).limit(5).all()
    
    # BMI history
    bmi_history = BMIRecord.query.filter_by(user_id=user_id).order_by(BMIRecord.date.desc()).limit(10).all()
    
    return {
        'user': {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'height': user.height,
            'weight': user.weight,
            'bmi': user.get_bmi(),
            'bmi_category': user.get_bmi_category(),
            'daily_calorie_goal': user.get_daily_calorie_goal()
        },
        'stats': {
            'total_workouts': total_workouts,
            'calories_burned': total_calories_burned,
            'active_goals': active_goals,
            'completed_goals': completed_goals,
            'progress': round(progress, 1)
        },
        'recent_activity': {
            'workouts': [w.to_dict() for w in recent_workouts],
            'meals': [m.to_dict() for m in recent_meals]
        },
        'bmi_history': [b.to_dict() for b in bmi_history]
    }

def get_daily_summary(user_id, target_date=None):
    """Get daily summary for a specific date"""
    if target_date is None:
        target_date = date.today()
    
    # Daily meals
    daily_meals = Meal.query.filter_by(user_id=user_id, date=target_date).all()
    total_calories_consumed = sum(meal.calories for meal in daily_meals)
    total_protein = sum(meal.protein for meal in daily_meals)
    total_carbs = sum(meal.carbs for meal in daily_meals)
    total_fats = sum(meal.fats for meal in daily_meals)
    
    # Daily workouts
    daily_workouts = Workout.query.filter_by(user_id=user_id, date=target_date).all()
    total_calories_burned = sum(workout.calories_burned for workout in daily_workouts)
    total_workout_duration = sum(workout.duration for workout in daily_workouts)
    
    # Get user's daily calorie goal
    user = User.query.get(user_id)
    daily_calorie_goal = user.get_daily_calorie_goal() if user else 2000
    
    return {
        'date': target_date.strftime('%Y-%m-%d'),
        'nutrition': {
            'calories_consumed': total_calories_consumed,
            'calories_burned': total_calories_burned,
            'calories_remaining': daily_calorie_goal - total_calories_consumed + total_calories_burned,
            'protein': total_protein,
            'carbs': total_carbs,
            'fats': total_fats
        },
        'activity': {
            'workouts': len(daily_workouts),
            'total_duration': total_workout_duration,
            'calories_burned': total_calories_burned
        },
        'meals': [meal.to_dict() for meal in daily_meals],
        'workouts': [workout.to_dict() for workout in daily_workouts]
    } 