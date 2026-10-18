import os

import pytest
from playwright.sync_api import Page

MARKET_URL = os.environ.get("MARKET_URL")
PAGES = {"/": "home", "/research/": "research"}
WIDTHS = [375, 768, 1280]


@pytest.fixture(params=["site", "market"])
def base(request, base_url):
    """The real site, and the fixture site with every job market feature on."""
    if request.param == "market":
        if not MARKET_URL:
            pytest.skip("MARKET_URL is not set")
        return request.param, MARKET_URL
    return request.param, base_url


@pytest.mark.parametrize("width", WIDTHS)
@pytest.mark.parametrize("path", list(PAGES))
def test_fits_the_screen_without_errors(page: Page, base, path, width, browser_name):
    name, url = base
    errors = []
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    page.on("pageerror", lambda exc: errors.append(str(exc)))
    page.set_viewport_size({"width": width, "height": 900})
    page.goto(f"{url}{path}")
    page.wait_for_load_state("networkidle")
    page.evaluate("document.querySelectorAll('details').forEach((d) => { d.open = true; })")
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth"), "no horizontal scroll"
    assert errors == [], f"console errors: {errors}"
    page.screenshot(path=f"dist-test/screens/{browser_name}-{name}-{PAGES[path]}-{width}.png", full_page=True)


def test_skip_link_is_first_and_visibly_focused(page: Page, base_url, browser_name):
    page.set_viewport_size({"width": 1280, "height": 900})
    page.goto(f"{base_url}/")
    # Safari moves focus to links with Option+Tab; other browsers use Tab.
    page.keyboard.press("Alt+Tab" if browser_name == "webkit" else "Tab")
    focused = page.evaluate(
        """() => {
            const el = document.activeElement;
            const box = el.getBoundingClientRect();
            return { cls: el.className, top: box.top, bottom: box.bottom, outline: getComputedStyle(el).outlineStyle };
        }"""
    )
    assert focused["cls"] == "skip-link"
    assert 0 <= focused["top"] and focused["bottom"] <= 900, "skip link is on screen when focused"
    assert focused["outline"] != "none", "focus is visible"


def test_cv_is_served_as_a_pdf(page: Page):
    if not MARKET_URL:
        pytest.skip("MARKET_URL is not set")
    response = page.request.get(f"{MARKET_URL}/cv.pdf")
    assert response.status == 200
    assert response.headers["content-type"].startswith("application/pdf")
