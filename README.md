This is a simulator of twisty puzzles that uses exact arithmetic to compute all moves without roundoff error. 

You can visit [https://hydropyrum.github.io/puzzle/](https://hydropyrum.github.io/puzzle/) to try the simulator, or follow the instruction below to build and run it locally.

Requirements:
- npm

Build instructions:
- `npm install`
- `make`
This builds pages in subdirectory `build`.

To test locally:
- `python3 -m http.server --bind localhost -d build 8000`
- browse `http://localhost:8000`

