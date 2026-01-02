# resqbites_backend_final.py

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error

# -------------------------------------------------
# 1. Synthetic Data Generation
# -------------------------------------------------

FOOD_CATEGORY_MAP = {
    "cooked": "Prepared Meals",
    "packaged": "Packaged Food",
    "produce": "Fresh Produce"
}

PRIORITY_MAP = {
    1: "Low",
    2: "Medium",
    3: "High"
}

def generate_donors(n_donors=20, random_state=42):
    np.random.seed(random_state)
    return pd.DataFrame({
        "donor_id": [f"D{i+1}" for i in range(n_donors)],
        "lat": np.random.uniform(0, 100, n_donors),
        "lon": np.random.uniform(0, 100, n_donors),
        "quantity_kg": np.random.uniform(5, 50, n_donors),
        "food_category": np.random.choice(list(FOOD_CATEGORY_MAP.keys()), n_donors),
        "hours_to_expiry": np.random.uniform(2, 48, n_donors),
        "nutrition_score": np.random.uniform(0.5, 1.0, n_donors)
    })


def generate_recipients(n_recipients=25, random_state=24):
    np.random.seed(random_state)
    return pd.DataFrame({
        "recipient_id": [f"R{i+1}" for i in range(n_recipients)],
        "lat": np.random.uniform(0, 100, n_recipients),
        "lon": np.random.uniform(0, 100, n_recipients),
        "demand_kg": np.random.uniform(5, 40, n_recipients),
        "preferred_category": np.random.choice(list(FOOD_CATEGORY_MAP.keys()), n_recipients),
        "priority": np.random.randint(1, 4, n_recipients),
        "nutrition_need": np.random.uniform(0.3, 1.0, n_recipients)
    })

# -------------------------------------------------
# 2. Feature Engineering
# -------------------------------------------------

def euclidean_distance(lat1, lon1, lat2, lon2):
    return np.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2)


def build_pairwise_features(donors, recipients):
    rows = []

    for _, d in donors.iterrows():
        for _, r in recipients.iterrows():
            distance = euclidean_distance(d.lat, d.lon, r.lat, r.lon)
            quantity_ratio = d.quantity_kg / (r.demand_kg + 1e-6)

            rows.append({
                "donor_id": d.donor_id,
                "recipient_id": r.recipient_id,
                "distance": distance,
                "category_match": int(d.food_category == r.preferred_category),
                "quantity_match": np.exp(-abs(1 - quantity_ratio)),
                "nutrition_match": np.exp(-3 * abs(d.nutrition_score - r.nutrition_need)),
                "donor_hours_to_expiry": d.hours_to_expiry,
                "recipient_priority": r.priority
            })

    return pd.DataFrame(rows)

# -------------------------------------------------
# 3. Expert Rule-Based Score
# -------------------------------------------------

def compute_true_score(df):
    distance_score = np.exp(-df.distance / 30)
    priority_score = df.recipient_priority / df.recipient_priority.max()
    expiry_score = np.exp(-df.donor_hours_to_expiry / 48)

    score = (
        0.30 * distance_score +
        0.25 * df.category_match +
        0.20 * df.quantity_match +
        0.15 * df.nutrition_match +
        0.10 * priority_score
    )

    df["true_match_score"] = score * (0.7 + 0.3 * expiry_score)
    return df

# -------------------------------------------------
# 4. Train ML Model
# -------------------------------------------------

def train_model(df):
    features = [
        "distance",
        "category_match",
        "quantity_match",
        "nutrition_match",
        "donor_hours_to_expiry",
        "recipient_priority"
    ]

    X = df[features]
    y = df.true_match_score

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=200,
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    print(f"R² Score: {r2_score(y_test, preds):.3f}")
    print(f"MSE: {mean_squared_error(y_test, preds):.5f}")

    return model, features

# -------------------------------------------------
# 5. Final Matching (Frontend-Ready)
# -------------------------------------------------

def generate_final_matches(donors, recipients, model, features, top_k=1):
    pairs = build_pairwise_features(donors, recipients)
    pairs["predicted_score"] = model.predict(pairs[features])

    matches = (
        pairs
        .sort_values("predicted_score", ascending=False)
        .groupby("donor_id")
        .head(top_k)
    )

    matches["match_percentage"] = (matches.predicted_score * 100).round(1)
    matches["distance_km"] = matches.distance.round(2)

    matches = matches.merge(donors, on="donor_id")
    matches = matches.merge(recipients, on="recipient_id")

    # Map to frontend-friendly values
    matches["food_category"] = matches["food_category"].map(FOOD_CATEGORY_MAP)
    matches["priority"] = matches["priority"].map(PRIORITY_MAP)

    return matches[[
        "donor_id", "recipient_id",
        "match_percentage", "distance_km",
        "food_category", "quantity_kg",
        "hours_to_expiry", "priority",
        "lat_x", "lon_x", "lat_y", "lon_y"
    ]].rename(columns={
        "lat_x": "donor_lat",
        "lon_x": "donor_lon",
        "lat_y": "recipient_lat",
        "lon_y": "recipient_lon"
    })

# -------------------------------------------------
# 6. Main Pipeline
# -------------------------------------------------

def main():
    donors = generate_donors()
    recipients = generate_recipients()

    df_pairs = build_pairwise_features(donors, recipients)
    df_pairs = compute_true_score(df_pairs)

    model, features = train_model(df_pairs)

    final_matches = generate_final_matches(
        donors, recipients, model, features, top_k=1
    )

    # Export for frontend
    final_matches.to_csv("frontend_matches.csv", index=False)
    final_matches.to_json("frontend_matches.json", orient="records")

    print("\nFrontend-ready data exported")
    print(final_matches.head())

if __name__ == "__main__":
    main()
