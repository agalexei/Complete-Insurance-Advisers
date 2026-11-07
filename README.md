# CIANSW website

This standalone project is the CIANSW redesign with its full footer, search metadata and enquiry forms. The editable HTML, CSS and JavaScript are the production files. There is no compilation or dependency installation step.

## Run locally

1. Extract the ZIP.
2. Open the top-level `index.html` in a browser.
3. For an HTTP preview, run `python3 -m http.server 8000` in the extracted folder and open http://localhost:8000. This optional method requires Python 3.

## Project layout

- Top-level HTML files contain the seven pages. Start at `index.html`.
- `css/` contains the responsive styles and `js/` contains the site's interactions.
- `assets/img/` contains the logo, favicon and responsive images.
- `docs/` contains the original PDF documents.
- `robots.txt`, `sitemap.xml`, `CNAME` and `.nojekyll` are for production hosting and search.

## Online services

Local page navigation and assets use relative paths. Public canonical URLs, external links and the YouTube video use their online destinations. The contact and quote forms post to Web3Forms (access keys are public by design and tied to admin@ciansw.com.au). Submitting while previewing locally sends a real enquiry. The embedded video needs internet access.

## Google reCAPTCHA

FormSubmit provides verification after submission. To show the inline Google checkbox on the production domain, set the public reCAPTCHA v2 Checkbox site key in `js/redesign.js`. Register the production hostname with Google first. Keep the secret key out of this static project. The inline checkbox is a front-end check and FormSubmit still handles server-side verification, so visitors may see a second challenge.
