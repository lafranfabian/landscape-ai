from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PredictionRequest(BaseModel):
    province: str = Field(..., description="Provinsi land location")
    city: str = Field(..., description="Kabupaten/Kota")
    district: str = Field(..., description="Kecamatan/District specific category")
    land_area: float = Field(..., gt=0, description="Luas tanah in m2")
    zoning: str = Field("Zona Perumahan", description="Zoning type: Industri, Komersial, Pertanian, Perumahan")
    road_width: Optional[float] = Field(None, ge=0, description="Lebar jalan depan (meter)")
    certificate_type: Optional[str] = Field("SHM", description="Tipe sertifikat: SHM, HGB, dll")
    road_access: Optional[str] = Field("Mobil", description="Akses jalan: Mobil, Motor, dll")
    near_toll: bool = Field(False)
    near_hospital: bool = Field(False)
    near_school: bool = Field(False)
    near_market: bool = Field(False)
    near_public_transportation: bool = Field(False)
    latitude: Optional[float] = Field(None)
    longitude: Optional[float] = Field(None)
    year: Optional[int] = Field(2024, description="Tahun prediksi")

class FeatureContribution(BaseModel):
    feature: str
    contribution: float
    description: str

class PredictionResponse(BaseModel):
    id: Optional[int] = None
    predicted_price_per_m2: float = Field(..., description="Price in millions of IDR per m2")
    predicted_price_total: float = Field(..., description="Total price in millions of IDR")
    predicted_price_per_m2_formatted: str
    predicted_price_total_formatted: str
    confidence_score: float
    confidence_range_lower: float
    confidence_range_upper: float
    confidence_range_lower_formatted: str
    confidence_range_upper_formatted: str
    status: str
    ai_recommendation: str
    shap_base_value: float
    shap_contributions: List[FeatureContribution]
    natural_language_explanation: str
    feature_importance: List[Dict[str, Any]]

class HistoryItem(BaseModel):
    id: int
    created_at: str
    province: str
    city: str
    district: str
    land_area: float
    road_width: Optional[float]
    certificate_type: Optional[str]
    road_access: Optional[str]
    near_toll: bool
    near_hospital: bool
    near_school: bool
    near_market: bool
    near_public_transportation: bool
    latitude: Optional[float]
    longitude: Optional[float]
    predicted_price_per_m2: float
    predicted_price_total: float
    confidence_score: float
    is_favorite: bool

class DashboardData(BaseModel):
    total_predictions: int
    avg_price: float
    highest_price: float
    lowest_price: float
    avg_price_per_m2: float
    province_stats: List[Dict[str, Any]]
    certificate_stats: List[Dict[str, Any]]
    trend_stats: List[Dict[str, Any]]
    road_width_stats: List[Dict[str, Any]]
