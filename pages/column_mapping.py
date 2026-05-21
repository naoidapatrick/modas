import streamlit as st
import pandas as pd
from shared import setup_page, TEMPLATE_COLUMN_REQUIREMENTS

setup_page(
    show_top_bar=True,
    top_bar_links=[
        {"label": "Vorlagen", "href": "/template_selection"},
    ],
    active_page="/template_selection",
)

template = st.session_state.get("selected_template")
df = pd.DataFrame(st.session_state.get("data", []))
user_cols = list(df.columns)
required = TEMPLATE_COLUMN_REQUIREMENTS.get(template, {})

st.markdown("<h3>Spaltenzuordnung</h3>", unsafe_allow_html=True)
st.markdown(
    "<p>Ordnen Sie Ihre Spalten den benötigten Feldern zu:</p>", unsafe_allow_html=True
)

mapping = {}
all_required_mapped = True

for target_col, meta in required.items():
    label = f"{'* ' if meta['required'] else ''}{meta['label']}"
    hint = f"z.B. '{meta['example']}'"

    # Try to auto-match by name similarity
    default_idx = 0
    options = ["-- nicht zuordnen --"] + user_cols
    for i, c in enumerate(user_cols):
        if (
            c.lower() == target_col.lower()
            or c.lower().replace(" ", "_") == target_col.lower()
        ):
            default_idx = i + 1
            break

    selected = st.selectbox(
        label=label,
        options=options,
        index=default_idx,
        help=hint,
        key=f"col_map_{target_col}",
    )

    if selected != "-- nicht zuordnen --":
        mapping[selected] = target_col
    elif meta["required"]:
        all_required_mapped = False

if st.button("Weiter zur Simulation", disabled=not all_required_mapped):
    # Rename columns according to mapping
    df_mapped = df.rename(columns=mapping)
    st.session_state.data = df_mapped.fillna("").to_dict(orient="records")

    # Store original→target mapping for display labels
    st.session_state.columnLabelMap = {target: src for src, target in mapping.items()}
    st.switch_page("pages/simulation_mode.py")
