import streamlit as st

TEMPLATE_COLUMN_REQUIREMENTS = {
    "thuringia": {
        "townhall_name": {
            "label": "Name des POI",
            "example": "Rathaus Ilmenau",
            "required": False,
        },
        "townhall_city": {"label": "Stadt", "example": "Ilmenau", "required": True},
        "townhall_street": {
            "label": "Straße",
            "example": "Am Markt",
            "required": False,
        },
        "townhall_latitude": {
            "label": "Breitengrad",
            "example": "50.687",
            "required": True,
        },
        "townhall_longitude": {
            "label": "Längengrad",
            "example": "10.913",
            "required": True,
        },
        "stops_within_100m": {
            "label": "Haltestellen (100m)",
            "example": "2",
            "required": True,
        },
        "stops_within_200m": {
            "label": "Haltestellen (200m)",
            "example": "4",
            "required": True,
        },
        "stops_within_300m": {
            "label": "Haltestellen (300m)",
            "example": "6",
            "required": True,
        },
    },
    "vrr": {
        "Category": {
            "label": "Kategorie-Tag",
            "example": "telefon / bke / sm / mehrwert / pie",
            "required": True,
        },
        "label": {"label": "Beschriftung", "example": "Januar", "required": True},
        "2022": {"label": "Wert 2022", "example": "13227", "required": False},
        "2023": {"label": "Wert 2023", "example": "21509", "required": False},
        "2024": {"label": "Wert 2024", "example": "25882", "required": False},
        "Percentage": {"label": "Prozentwert", "example": "70", "required": False},
    },
}


def top_bar(links=None, active=None, reupload_button=True):
    if links is None:
        links = [{"label": "Vorlagen", "href": "/template_selection"}]

    links_html = ""
    for link in links:
        href = "#" if link["href"] == active else link["href"]
        cls = "active" if link["href"] == active else ""
        links_html += f'<a href="{href}" class="top-bar-link {cls}">{link["label"]}</a>'

    right_html = ""
    if reupload_button:
        right_html = f'<a href="{reupload_button["href"]}" class="top-bar-action">{reupload_button["label"]}</a>'

    st.markdown(
        f"""
        <div class="top-bar">
            <div class="top-bar-left">{links_html}</div>
            <div class="top-bar-right">{right_html}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def setup_page(
    show_top_bar=True, top_bar_links=None, active_page=None, top_bar_right_button=None
):
    st.set_page_config(layout="wide")

    st.markdown(
        """
        <style>
        /* Hides the link icon that appears on hover for headers */
        [data-testid="stHeaderActionElements"] {
            display: none;
        }
        </style>
    """,
        unsafe_allow_html=True,
    )

    with open("style.css") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
    if show_top_bar:
        top_bar(top_bar_links, active_page, reupload_button=top_bar_right_button)


def score_templates(df):
    cols = [c.lower() for c in df.columns]
    print(f"\n=== score_templates ===")
    print(f"Columns found: {cols}")

    scores = {"thuringia": 0, "vrr": 0, "dresden": 0}

    # Thuringia signals
    coord_match = any(c in cols for c in ["latitude", "longitude", "lat", "lon", "lng"])
    radius_match = any(
        "within" in c or "100m" in c or "200m" in c or "300m" in c for c in cols
    )
    location_match = any(
        c in cols for c in ["city", "street", "name", "address", "stadt", "straße"]
    )
    no_category = "category" not in cols

    if coord_match:
        scores["thuringia"] += 3
    if radius_match:
        scores["thuringia"] += 3
    if location_match:
        scores["thuringia"] += 1
    if no_category:
        scores["thuringia"] += 1

    print(
        f"Thuringia: coord={coord_match}, radius={radius_match}, location={location_match}, no_category={no_category} → {scores['thuringia']}"
    )

    # VRR signals
    has_category = "category" in cols
    has_years = any(c in cols for c in ["2022", "2023", "2024", "2025"])
    has_label = "label" in cols
    has_percentage = "percentage" in cols

    if has_category:
        scores["vrr"] += 3
    if has_years:
        scores["vrr"] += 3
    if has_label:
        scores["vrr"] += 2
    if has_percentage:
        scores["vrr"] += 1

    print(
        f"VRR: category={has_category}, years={has_years}, label={has_label}, percentage={has_percentage} → {scores['vrr']}"
    )

    # Dresden signals
    has_survey = any(
        c in cols
        for c in ["satisfaction", "rating", "score", "zufriedenheit", "bewertung"]
    )
    if has_survey:
        scores["dresden"] += 4

    print(f"Dresden: survey_cols={has_survey} → {scores['dresden']}")

    total = sum(scores.values())
    best = max(scores, key=scores.get)
    confidence = scores[best] / total if total > 0 else 0

    print(f"Final scores: {scores}")
    print(f"Winner: {best} with confidence {confidence:.2f}, score {scores[best]}")
    print(f"Recommendation shown: {confidence >= 0.5 and scores[best] >= 3}")

    return {"recommended": best, "confidence": confidence, "scores": scores}
