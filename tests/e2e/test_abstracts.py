from playwright.sync_api import expect


def test_abstract_opens_below_its_links(page):
    page.goto("/research/")
    paper = page.locator("article", has_text="When Better AI Reveals Less")
    summary, link, abstract = paper.locator("summary"), paper.locator(".paper-links a").first, paper.locator(".paper-abstract")
    expect(abstract).to_be_hidden()
    summary.click()
    expect(abstract).to_be_visible()
    s, l, a = summary.bounding_box(), link.bounding_box(), abstract.bounding_box()
    assert abs(s["y"] - l["y"]) < 4, "Abstract toggle and links share a line"
    assert a["y"] >= s["y"] + s["height"], "abstract opens below them"
    summary.focus()
    page.keyboard.press("Enter")
    expect(abstract).to_be_hidden()
