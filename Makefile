JSFILES=TrackballControls
TSFILES=make move util main piece parse polyhedra fraction polynomial exact math fields
BIN=./node_modules/.bin

all: build/main.js build/dummy

ts/polyhedra.ts: py/poly2js.py
	python3 py/poly2js.py > $@

ts/fields.ts: py/fields.py
	python3 py/fields.py > $@

$(patsubst %,js/%.js,$(TSFILES)): $(patsubst %,ts/%.ts,$(TSFILES)) $(patsubst %,ts/%.d.ts,$(JSFILES))
	$(BIN)/tsc $^ -outDir js --target es2020 --module es6 --moduleResolution node --strict

build/main.js: js/main.js $(patsubst %,js/%.js,$(JSFILES)) $(patsubst %,js/%.js,$(TSFILES)) | build 
	$(BIN)/rollup -c rollup.config.js --bundleConfigAsCjs $< --file $@ --format iife

build/dummy:
	cp index.html puzzle.html main.css build

build:
	mkdir -p $@

serve:
	python -m http.server --bind localhost -d build 8000
