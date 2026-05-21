import streamlit as st
import pandas as pd
from components import story_viewer
from shared import setup_page

STORY_COLOURS = {
    "thuringia": {
        1: ["#E14A2C", "#9DAEFF", "#EFD33F", "#007E4E"],
    },
    "vrr": {
        1: ["#001C0C", "#004F22", "#43A86B"],
        2: [
            "#001C0C",
        ],
        3: [
            "#52AE32",
            "#63BEDD",
        ],
    },
    "dresden": {
        1: [""],
    },
}

CHART_COLUMNS_BY_TEMPLATE = {
    "thuringia": {
        0: {"townhall_name", "townhall_city", "stops_within_100m"},
        1: {"townhall_name", "townhall_city", "stops_within_200m"},
        2: {"townhall_name", "townhall_city", "stops_within_300m"},
    },
    "vrr": {
        1: {"category", "chart number", "2022", "2023", "2024"},
        2: {"category", "chart_number", "2022", "2023", "2024"},
        3: {"category", "percentage"},
    },
    "dresden": {
        0: {""},
    },
}

selected = st.session_state.get("selected_template", "")
selected_template_label = st.session_state.get("selected_template_label", "")

data = st.session_state.get("data")
if not data:
    st.warning(
        "In dieser Sitzung wurden keine hochgeladenen Daten gefunden. Bitte laden Sie Ihre Datei erneut hoch."
    )
    if st.button("Zum Upload", width="stretch"):
        st.switch_page("app.py")
    st.stop()

setup_page(
    show_top_bar=True,
    top_bar_links=[
        {"label": f"{selected_template_label}", "href": "/simulation_mode"},
    ],
    active_page="/simulation_mode",
    top_bar_right_button={"label": "Neustart", "href": "/"},
)


def get_story_colors(template):
    return STORY_COLOURS.get(template)


colours = get_story_colors(selected)

if "category_colors" not in st.session_state:
    st.session_state.category_colors = colours.copy()

print("columnLabelMap in session:", bool(st.session_state.get("columnLabelMap")))
print("keys sample:", list((st.session_state.get("columnLabelMap") or {}).items())[:5])

result = story_viewer(
    template=selected,
    data=st.session_state.data,
    columnLabelMap=st.session_state.get("columnLabelMap"),
    categoryColours=st.session_state.category_colors,
    mode="simulation",
    key="story",
)

if result and isinstance(result, dict) and result.get("action") == "open_data_editor":

    @st.dialog("CSV bearbeiten")
    def edit_csv_dialog(template, current_range=None, chart_number=None):
        df = pd.DataFrame(st.session_state.data)

        template_columns = CHART_COLUMNS_BY_TEMPLATE.get(template, {})
        chart_columns = template_columns.get(current_range or 0, set())

        column_config = {
            col: st.column_config.Column(label=f"◆ {col}")
            for col in df.columns
            if col in chart_columns
        }

        edited_df = st.data_editor(
            df,
            width="stretch",
            num_rows="dynamic",
            key="csv_editor",
            column_config=column_config,
        )

        st.markdown(
            '<p style="font-size:12px; color:#666; margin: 0px 0px 10px auto">◆ im Diagramm verwendete Spalten</p>',
            unsafe_allow_html=True,
        )

        st.markdown("<h3>Farben der Kategorien ändern:</h3>", unsafe_allow_html=True)

        st.markdown(
            """
                <style>
                div[data-testid="stLayoutWrapper"]>.stVerticalBlock {
                    gap: 0rem !important;
                }
                
                div[data-testid="stLayoutWrapper"]>.stHorizontalBlock {
                    gap: 1rem !important;
                    margin-bottom: 3rem !important;
                }
                
                div[data-testid="stLayoutWrapper"]>.stHorizontalBlock>* {
                    width: 100% !important;
                    flex: 0;
                }
                
                div[data-testid="stDialog"] div.stButton {
                    margin-right: 0rem !important;
                    margin-left: auto !important;
                }
                
                div[data-testid="stColumn"] > div[data-testid="stVerticalBlock"] {
                    flex-flow: row !important;
                    justify-content: flex-start;
                    gap: 25%;
                    background: #ffffff;
                    border-radius: 16px;
                    border: 1.5px solid #e8e8e8;
                    padding: 10px 16px;
                    width: fit-content !important;
                }
                
                div.stButton>button {
                    padding: 12px 32px;
                }

                /* Hide the label */
                div[data-testid="stColorPicker"] label {
                    display: none !important;
                }

                /* Remove default card styling from the picker wrapper */
                div[data-testid="stColorPicker"] > div {
                    background: transparent !important;
                    border-radius: 0 !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                }
                
                div[data-testid="stColorPicker"]>div>div {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                div[data-testid="stColorPicker"] {
                    flex-shrink: 0;
                }

                .hex-label {
                    font-size: 16px;
                    font-weight: 400;
                    color: #222222;
                    white-space: nowrap;
                    line-height: 1;
                    margin-right: 15px;
                }

                [data-testid="stMarkdownContainer"] {
                    display: flex;
                    align-items: center;
                }
                
                [data-testid="stMarkdownContainer"] > p {
                    margin: 0;
                }
                </style>
                """,
            unsafe_allow_html=True,
        )

        def color_chip(col, chart_number, id):
            with col:
                new = st.color_picker(
                    label="color",
                    value=st.session_state.category_colors[chart_number][id],
                    key=f"category_color_{chart_number}_{id}",
                    label_visibility="collapsed",
                )
                st.session_state.category_colors[chart_number][id] = new
                st.markdown(
                    f'<span class="hex-label">{new}</span>',
                    unsafe_allow_html=True,
                )

        colors_to_show = (
            st.session_state.category_colors.get(chart_number, [])
            if chart_number is not None
            else []
        )

        cols = st.columns(len(colors_to_show), gap="medium")
        for i, col in enumerate(cols):
            color_chip(col, chart_number, i)

        if st.button("Speichern", width="stretch", key="csv_save_btn"):
            st.session_state.data = edited_df.to_dict(orient="records")
            st.session_state["story"] = None
            st.rerun()


if result and isinstance(result, dict) and result.get("action") == "open_data_editor":
    edit_csv_dialog(selected, result.get("currentRange"), result.get("chartNumber"))
