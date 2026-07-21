import os
import sqlite3
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "landprice.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            province TEXT NOT NULL,
            city TEXT NOT NULL,
            district TEXT NOT NULL,
            land_area REAL NOT NULL,
            road_width REAL,
            certificate_type TEXT,
            road_access TEXT,
            near_toll INTEGER DEFAULT 0,
            near_hospital INTEGER DEFAULT 0,
            near_school INTEGER DEFAULT 0,
            near_market INTEGER DEFAULT 0,
            near_public_transportation INTEGER DEFAULT 0,
            latitude REAL,
            longitude REAL,
            predicted_price_per_m2 REAL NOT NULL,
            predicted_price_total REAL NOT NULL,
            confidence_score REAL DEFAULT 0.0,
            is_favorite INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()

def insert_prediction(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Set default values if not provided
    created_at = datetime.now().isoformat()
    
    cursor.execute("""
        INSERT INTO predictions (
            created_at, province, city, district, land_area, road_width, 
            certificate_type, road_access, near_toll, near_hospital, 
            near_school, near_market, near_public_transportation, 
            latitude, longitude, predicted_price_per_m2, predicted_price_total, 
            confidence_score, is_favorite
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    """, (
        created_at,
        data['province'],
        data['city'],
        data['district'],
        data['land_area'],
        data.get('road_width'),
        data.get('certificate_type'),
        data.get('road_access'),
        1 if data.get('near_toll') else 0,
        1 if data.get('near_hospital') else 0,
        1 if data.get('near_school') else 0,
        1 if data.get('near_market') else 0,
        1 if data.get('near_public_transportation') else 0,
        data.get('latitude'),
        data.get('longitude'),
        data['predicted_price_per_m2'],
        data['predicted_price_total'],
        data.get('confidence_score', 95.0)
    ))
    
    prediction_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return prediction_id

def get_predictions(search: str = None, province: str = None, favorites_only: bool = False):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM predictions WHERE 1=1"
    params = []
    
    if search:
        query += " AND (city LIKE ? OR district LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])
        
    if province:
        query += " AND province = ?"
        params.append(province)
        
    if favorites_only:
        query += " AND is_favorite = 1"
        
    query += " ORDER BY created_at DESC"
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

def delete_prediction(prediction_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM predictions WHERE id = ?", (prediction_id,))
    conn.commit()
    conn.close()
    return cursor.rowcount > 0

def toggle_favorite(prediction_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    # First get current value
    cursor.execute("SELECT is_favorite FROM predictions WHERE id = ?", (prediction_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None
        
    new_fav = 1 - row['is_favorite']
    cursor.execute("UPDATE predictions SET is_favorite = ? WHERE id = ?", (new_fav, prediction_id))
    conn.commit()
    conn.close()
    return bool(new_fav)

def get_dashboard_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    stats = {}
    
    # Total Predictions
    cursor.execute("SELECT COUNT(*) FROM predictions")
    stats['total_predictions'] = cursor.fetchone()[0]
    
    if stats['total_predictions'] == 0:
        conn.close()
        return {
            'total_predictions': 0,
            'avg_price': 0,
            'highest_price': 0,
            'lowest_price': 0,
            'avg_price_per_m2': 0,
            'province_stats': [],
            'certificate_stats': [],
            'recent_predictions': []
        }
        
    # Average, highest, lowest price (total)
    cursor.execute("SELECT AVG(predicted_price_total), MAX(predicted_price_total), MIN(predicted_price_total), AVG(predicted_price_per_m2) FROM predictions")
    row = cursor.fetchone()
    stats['avg_price'] = row[0] or 0
    stats['highest_price'] = row[1] or 0
    stats['lowest_price'] = row[2] or 0
    stats['avg_price_per_m2'] = row[3] or 0
    
    # Province comparison
    cursor.execute("SELECT province, COUNT(*), AVG(predicted_price_total), AVG(predicted_price_per_m2) FROM predictions GROUP BY province")
    stats['province_stats'] = [
        {'province': r[0], 'count': r[1], 'avg_total_price': r[2], 'avg_price_per_m2': r[3]}
        for r in cursor.fetchall()
    ]
    
    # Certificate type comparison
    cursor.execute("SELECT certificate_type, COUNT(*) FROM predictions GROUP BY certificate_type")
    stats['certificate_stats'] = [
        {'certificate_type': r[0] if r[0] else 'N/A', 'count': r[1]}
        for r in cursor.fetchall()
    ]
    
    # Trend (by date, grouping by day or just raw predictions)
    # Let's take the last 15 predictions for a trend or aggregate by date
    cursor.execute("SELECT substr(created_at, 1, 10) as date, AVG(predicted_price_total) as avg_price, COUNT(*) as count FROM predictions GROUP BY date ORDER BY date ASC LIMIT 30")
    stats['trend_stats'] = [
        {'date': r[0], 'avg_price': r[1], 'count': r[2]}
        for r in cursor.fetchall()
    ]
    
    # Road Width Distribution
    cursor.execute("SELECT CASE WHEN road_width IS NULL THEN 'N/A' WHEN road_width < 4 THEN '< 4m' WHEN road_width <= 8 THEN '4m - 8m' ELSE '> 8m' END as width_group, COUNT(*) FROM predictions GROUP BY width_group")
    stats['road_width_stats'] = [
        {'width_group': r[0], 'count': r[1]}
        for r in cursor.fetchall()
    ]
    
    conn.close()
    return stats
