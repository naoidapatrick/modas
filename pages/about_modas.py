import streamlit as st
from shared import setup_page

setup_page(
    show_top_bar=True,
    top_bar_links=[
        {"label": "Vorlagen", "href": "/template_selection"},
        # {"label": "About MoDaS", "href": "/about_modas"},
    ],
    active_page="/about_modas",
)
