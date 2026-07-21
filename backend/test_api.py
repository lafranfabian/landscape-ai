import os
import sys

# Add app folder to path so we can import from it
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database.database import init_db

# Initialize db before testing
init_db()

client = TestClient(app)

def test_api_workflow():
    # 1. Test root endpoint
    res = client.get("/")
    print("Root Endpoint response:", res.status_code, res.json())
    assert res.status_code == 200
    
    # 2. Test predict endpoint
    payload = {
        "province": "DKI Jakarta",
        "city": "Jakarta Selatan",
        "district": "Kebayoran Senopati",
        "land_area": 150.0,
        "zoning": "Zona Perumahan",
        "road_width": 6.5,
        "certificate_type": "SHM",
        "road_access": "Mobil",
        "near_toll": True,
        "near_hospital": False,
        "near_school": True,
        "near_market": False,
        "near_public_transportation": True,
        "latitude": -6.2297,
        "longitude": 106.8006,
        "year": 2024
    }
    
    print("\nSending prediction request...")
    res = client.post("/api/predict", json=payload)
    print("Predict Endpoint response:", res.status_code)
    if res.status_code != 201:
        print("Error details:", res.json())
        sys.exit(1)
        
    data = res.json()
    print("Predicted Price per m2:", data['predicted_price_per_m2_formatted'])
    print("Total Price:", data['predicted_price_total_formatted'])
    print("AI Recommendation:", data['ai_recommendation'])
    print("Explanation Snippet:", data['natural_language_explanation'][:120] + "...")
    print("Top SHAP contributions:")
    for c in data['shap_contributions'][:3]:
        print(f"  {c['feature']}: {c['contribution']:.4f} ({c['description']})")
        
    # 3. Test history endpoint
    print("\nRetrieving prediction history...")
    res = client.get("/api/history")
    print("History response status:", res.status_code)
    history = res.json()
    print("Number of items in history:", len(history))
    assert len(history) >= 1
    item = history[0]
    print("First item district:", item['district'], "Price:", item['predicted_price_total'])
    assert item['is_favorite'] == False
    
    # 4. Test favorite toggle
    print(f"\nToggling favorite status for prediction ID: {item['id']}...")
    res = client.patch(f"/api/history/{item['id']}/favorite")
    print("Favorite response:", res.status_code, res.json())
    assert res.status_code == 200
    assert res.json()['is_favorite'] == True
    
    # Confirm in history
    res = client.get("/api/history?favorites_only=true")
    print("Favorites-only history count:", len(res.json()))
    assert len(res.json()) == 1
    
    # 5. Test dashboard stats
    print("\nRetrieving dashboard statistics...")
    res = client.get("/api/dashboard")
    print("Dashboard response status:", res.status_code)
    stats = res.json()
    print("Total predictions recorded:", stats['total_predictions'])
    print("Average Price:", stats['avg_price'])
    print("Province statistics:", stats['province_stats'])
    
    # 6. Test delete endpoint
    print(f"\nDeleting prediction ID: {item['id']}...")
    res = client.delete(f"/api/history/{item['id']}")
    print("Delete response:", res.status_code, res.json())
    assert res.status_code == 200
    
    # Confirm empty history
    res = client.get("/api/history")
    print("History size after delete:", len(res.json()))
    
    print("\n--- ALL BACKEND API TESTS COMPLETED SUCCESSFULLY! ---")

if __name__ == "__main__":
    test_api_workflow()
