import pandas as pd
import numpy as np

# Exact features required by the LightGBM model
MODEL_FEATURES = [
    'Tahun', 'Luas_Tanah_m2', 'Provinsi_Banten', 'Provinsi_DIY', 'Provinsi_DKI_Jakarta', 
    'Provinsi_Jawa_Barat', 'Provinsi_Jawa_Tengah', 'Provinsi_Jawa_Timur', 
    'Kabupaten_Kota_Bekasi_Kota_Summarecon_Harapan_Indah', 
    'Kabupaten_Kota_Bogor_Sentul_City_Bogor_Kota', 
    'Kabupaten_Kota_Depok_Margonda_Cimanggis', 
    'Kabupaten_Kota_Jakarta_Barat_Puri_Indah_Kebon_Jeruk', 
    'Kabupaten_Kota_Jakarta_Selatan_Kebayoran_Senopati', 
    'Kabupaten_Kota_Medan_Amplas', 'Kabupaten_Kota_Medan_Baru', 
    'Kabupaten_Kota_Medan_Johor', 'Kabupaten_Kota_Medan_Petisah', 
    'Kabupaten_Kota_Medan_Polonia', 'Kabupaten_Kota_Medan_Selayang', 
    'Kabupaten_Kota_Semarang_-_Banyumanik', 
    'Kabupaten_Kota_Semarang_-_Gajahmungkur_Elit/Candi', 
    'Kabupaten_Kota_Semarang_-_Ngaliyan', 'Kabupaten_Kota_Semarang_-_Pedurungan', 
    'Kabupaten_Kota_Semarang_-_Tembalang_Kawasan_UNDIP', 
    'Kabupaten_Kota_Semarang_Tengah_Simpang_Lima', 
    'Kabupaten_Kota_Solo_-_Banjarsari', 'Kabupaten_Kota_Solo_-_Colomadu_Penyangga', 
    'Kabupaten_Kota_Solo_-_Grogol_Solo_Baru', 'Kabupaten_Kota_Solo_-_Jebres', 
    'Kabupaten_Kota_Solo_-_Laweyan_Slamet_Riyadi', 'Kabupaten_Kota_Solo_-_Serengan', 
    'Kabupaten_Kota_Tangerang_BSD_City_Gading_Serpong', 
    'Kabupaten_Kota_Yogya_-_Depok_Sleman/Kawasan_UGM', 
    'Kabupaten_Kota_Yogya_-_Gedongtengen_Malioboro', 
    'Kabupaten_Kota_Yogya_-_Kasihan_Bantul/UMY', 
    'Kabupaten_Kota_Yogya_-_Kotagede', 'Kabupaten_Kota_Yogya_-_Ngaglik_Sleman', 
    'Kabupaten_Kota_Yogya_-_Umbulharjo', 'Kota_Group_Jabodetabek', 
    'Kota_Group_Medan', 'Kota_Group_Semarang', 'Kota_Group_Solo', 
    'Kota_Group_Yogyakarta', 'Zona_Industri', 'Zona_Komersial', 
    'Zona_Pertanian', 'Zona_Perumahan'
]

def preprocess_input(form_data: dict) -> pd.DataFrame:
    """
    Converts form fields from UI/API into a single-row pandas DataFrame
    matching the 47 input columns expected by the LightGBM regressor model.
    """
    # Create dictionary representing the input features initialized to 0
    encoded = {feature: 0 for feature in MODEL_FEATURES}
    
    # 1. Year and Area (direct mappings)
    encoded['Tahun'] = int(form_data.get('year', 2024))
    encoded['Luas_Tanah_m2'] = float(form_data.get('land_area', 100.0))
    
    # 2. Province mapping
    province = form_data.get('province', '').strip()
    # Normalize province strings
    prov_mapping = {
        'Banten': 'Provinsi_Banten',
        'DIY': 'Provinsi_DIY',
        'Yogyakarta': 'Provinsi_DIY',
        'DI Yogyakarta': 'Provinsi_DIY',
        'DKI Jakarta': 'Provinsi_DKI_Jakarta',
        'Jakarta': 'Provinsi_DKI_Jakarta',
        'Jawa Barat': 'Provinsi_Jawa_Barat',
        'Jawa Tengah': 'Provinsi_Jawa_Tengah',
        'Jawa Timur': 'Provinsi_Jawa_Timur'
    }
    
    prov_col = prov_mapping.get(province)
    if prov_col in encoded:
        encoded[prov_col] = 1
        
    # 3. City/District specific category mapping
    # The UI will send the exact normalized keys or we map them here
    district = form_data.get('district', '').strip()
    city = form_data.get('city', '').strip()
    
    # Combine or lookup the exact feature name
    # We will match based on substring or exact mapping
    found_district_col = None
    for feature in MODEL_FEATURES:
        if feature.startswith('Kabupaten_Kota_'):
            # clean comparisons
            cleaned_feature = feature.replace('Kabupaten_Kota_', '').replace('_', ' ').lower()
            cleaned_district = district.replace('_', ' ').lower()
            
            # Match if district string is part of the feature name
            if cleaned_district in cleaned_feature or cleaned_feature in cleaned_district:
                found_district_col = feature
                break
                
    if found_district_col:
        encoded[found_district_col] = 1
        
    # 4. City Group mapping based on Province or District
    # Determine the city group
    if province in ['DKI Jakarta', 'Banten', 'Jawa Barat'] or city in ['Jakarta', 'Tangerang', 'Bekasi', 'Bogor', 'Depok'] or 'BSD' in district or 'Summarecon' in district or 'Sentul' in district or 'Margonda' in district or 'Kebayoran' in district or 'Puri' in district:
        encoded['Kota_Group_Jabodetabek'] = 1
    elif province == 'Sumatera Utara' or city == 'Medan' or 'Medan' in district:
        encoded['Kota_Group_Medan'] = 1
    elif city == 'Semarang' or 'Semarang' in district:
        encoded['Kota_Group_Semarang'] = 1
    elif city in ['Solo', 'Surakarta'] or 'Solo' in district:
        encoded['Kota_Group_Solo'] = 1
    elif province in ['DIY', 'DI Yogyakarta', 'Yogyakarta'] or city in ['Yogyakarta', 'Sleman', 'Bantul'] or 'Yogya' in district:
        encoded['Kota_Group_Yogyakarta'] = 1
        
    # 5. Zoning mapping
    zoning = form_data.get('zoning', '').strip()
    # Normalize zoning name
    zoning_mapping = {
        'Industri': 'Zona_Industri',
        'Zona Industri': 'Zona_Industri',
        'Komersial': 'Zona_Komersial',
        'Zona Komersial': 'Zona_Komersial',
        'Pertanian': 'Zona_Pertanian',
        'Zona Pertanian': 'Zona_Pertanian',
        'Perumahan': 'Zona_Perumahan',
        'Zona Perumahan': 'Zona_Perumahan'
    }
    
    zoning_col = zoning_mapping.get(zoning, 'Zona_Perumahan')
    if zoning_col in encoded:
        encoded[zoning_col] = 1
        
    # Build dataframe with single row
    return pd.DataFrame([encoded])
