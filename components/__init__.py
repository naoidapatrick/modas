import streamlit.components.v1 as components
import os

_RELEASE = True

if not _RELEASE:
    _component = components.declare_component(
        "story_viewer",
        url="http://localhost:5173",
    )
else:
    _build_dir = os.path.join(os.path.dirname(__file__), "../dist")
    _component = components.declare_component("story_viewer", path=_build_dir)


def story_viewer(
    template, data=None, columnLabelMap=None, categoryColours=None, mode="view", height=900, key=None
):
    return _component(
        template=template,
        data=data,
        columnLabelMap=columnLabelMap,
        categoryColours=categoryColours,
        mode=mode,
        key=key,
        default=None,
        height=height,
    )
