Requirements:
- npm

Build instructions:
- `npm install`
- `make`
This builds pages in subdirectory `build`.

To test locally:
- `python3 -m http.server --bind localhost -d build 8000`
- browse `http://localhost:8000`

