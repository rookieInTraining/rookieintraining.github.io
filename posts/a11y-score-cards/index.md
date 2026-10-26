# Scoring your accessibility observations

> Learn ways of how one can quantify the results of your accessibility tests into a score

- URL: https://ishabbi.tech/posts/a11y-score-cards/
- Published: 2025-04-20
- Updated: 2026-10-26
- Tags: A11y, Accessbility, Non-Functional, Testing, Compliance

In today’s digital-first world, accessibility plays a pivotal role in promoting diversity and inclusivity across communication platforms and digital tools. For the internet, this movement began with the W3C’s first [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) (WCAG), aimed at making the web more accessible for everyone.

While WCAG 1.0, released in 1999, laid the foundation for web accessibility. Its successor, WCAG 2.0, introduced a more robust and technology-agnostic framework based on four core principles — Perceivable, Operable, Understandable, and Robust (POUR) — to better support the needs of users with disabilities and improve digital accessibility standards.

If you work with SaaS platforms, government portals, or internal tools, chances are you’ve encountered accessibility compliance testing. With evolving guidelines — such as the European Accessibility Act, ADA, and Section 508 — there’s a renewed emphasis on aligning digital products with these standards.

In line with the standard, organizations can conduct internal accessibility assessments or engage external vendors to perform the testing on their behalf. The findings from these evaluations should then be documented in a Voluntary Product Accessibility Template (VPAT), which helps customers assess how well the system conforms to accessibility requirements.

Additionally, there are automated tools such as **Lighthouse, WAVE, Web Accessibility Insights**, etc which runs static checks and generate a report highlighting the areas of improvement. Lighthouse – one of my personal favourites – not only performs static analysis but also uses [weighted averages](https://developer.chrome.com/docs/lighthouse/accessibility/scoring) to generate an accessibility score based on the severity and type of violations.

While VPATs are useful for customers, internal stakeholders and management often require deeper insights into how accessibility is implemented, monitored, and improved within the organization. VPATs typically lack a scoring mechanism or quantifiable metrics that provide a clear, overall picture of WCAG conformance.

* * *

## How Do We Measure Accessibility Observations Effectively?

This brings us to today’s discussion — how do we measure accessibility observations effectively? How can we establish a scoring system that offers stakeholders a holistic view of accessibility conformance without having to dig through VPATs or detailed automated reports?

To design an effective scorecard, we need metrics that can be mapped to dimensions — in other words, a label mapped to a measurable quantity. Fortunately, as mentioned earlier, WCAG 2.0 introduced four key principles for accessibility, popularly known as POUR: :

- **Perceivable** : Information must be perceivable to people using only one of their senses, so they understand all related content.
- **Operable** : End users must be able to interact with all webpage elements. For instance, your website should be easily navigable with just a keyboard or voice controls for non-mouse users.
- **Understandable** : The principle is just what it seems—end users must be able to understand web page content and functionality information.
- **Robust** : Your website must effectively communicate information to all users, including users of assistive technologies, and remain compatible with evolving technologies and user needs.

All sections and levels of conformance fall under these four principles, making them ideal candidates to serve as the primary dimensions for our accessibility scorecard.

The core approach involves assigning scores to each section under the POUR categories and normalizing them to calculate a comprehensive accessibility score.

Once these scores are computed, they can be aggregated to offer a unified metric that reflects the overall accessibility posture of a product or platform. This score can then be used to track progress over time, identify areas that require focused improvements, and communicate accessibility status to both internal stakeholders and external audiences in a simple, quantifiable manner.

To ensure accuracy and consistency, it is essential to define clear scoring criteria for each principle. For example, automated tools may contribute scores for perceivable and operable dimensions, while manual reviews may be needed to assess understandability and robustness more effectively. Combining these inputs creates a balanced, reliable scorecard for holistic accessibility measurement.

## Designing the Accessibility Scorecard

The core approach involves assigning scores to each section under the POUR categories and normalizing them to calculate a comprehensive accessibility score.

### Scoring

Each accessibility check — whether automated or manual — should be mapped to one of the POUR principles (Perceivable, Operable, Understandable, Robust). Every issue or observation can then be assigned a severity score based on its impact on user experience. For example:

- Critical violations (e.g. no keyboard navigation) → High score (indicating serious issue)
- Minor issues (e.g. missing alt text for decorative images) → Lower score

### Normalization

To ensure comparability across principles and pages, individual scores should be normalized. This process adjusts the raw scores into a common scale, typically between 0 and 1 or 0 and 100, making them easier to interpret and aggregate. In our case, we’ll normalize the score on a scale of 5.

### Aggregation

Once normalized, scores from all POUR categories can be combined to generate an overall accessibility score. You can choose to apply weights to each principle based on its importance or keep them equally weighted for simplicity. This aggregated score reflects the overall accessibility posture of the product or platform. Insights and Reporting

The final score, along with category-wise breakdowns, serves multiple purposes:

- Track progress over time by comparing scores across releases.
- Identify focus areas by spotting low-performing principles or sections.
- Communicate status clearly to stakeholders through dashboards and reports.

### Example

| **Principle**      | **Total Checks** | **Issues Found** | **Severity Weight** | **Raw Score** | **Normalized Score (out of 5)** |
|--------------------|------------------|------------------|---------------------|---------------|---------------------------------|
| **Perceivable**    | 40               | 5                | High                | 5/40 = 0.125  | 4.4 / 5                         |
| **Operable**       | 30               | 2                | Medium              | 2/30 = 0.066  | 4.7 / 5                         |
| **Understandable** | 20               | 3                | Low                 | 3/20 = 0.15   | 4.3 / 5                         |
| **Robust**         | 10               | 1                | High                | 1/10 = 0.10   | 4.5 / 5                         |
| **Overall Score**  | —                | —                | —                   | —             | **4.5 / 5 (Average)**           |

### How the scoring works (formula):

$$ Normalized\ Score\ (out\ of\ 5)=(1−Raw\ Score)×5 $$

For example:

```
* Perceivable → Raw Score = 0.125 → Normalized Score = (1 - 0.125) × 5 = 4.4
* Operable → Raw Score = 0.066 → Normalized Score = 4.7
* Understandable → Raw Score = 0.15 → Normalized Score = 4.3
* Robust → Raw Score = 0.10 → Normalized Score = 4.5
```

The overall accessibility score is the average of the 4 values = 4.5 / 5.

By structuring accessibility observations into quantifiable scores, organizations can visualize these metrics, enabling teams to move beyond qualitative statements and provide actionable, data-driven insights that drive continuous improvement.
