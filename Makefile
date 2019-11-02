JSFILES=TrackballControls
TSFILES=make move slice util main piece parse polyhedra

all: build/main.js build/dummy

ts/polyhedra.ts: py/poly2js.py
	python3 py/poly2js.py > $@

$(patsubst %,js/%.js,$(TSFILES)): $(patsubst %,ts/%.ts,$(TSFILES)) $(patsubst %,ts/%.d.ts,$(JSFILES))
	tsc $^ --target es5 -outDir js --lib dom,es5 --moduleResolution node --strict --module es6

build/main.js: js/main.js $(patsubst %,js/%.js,$(JSFILES)) $(patsubst %,js/%.js,$(TSFILES)) | build 
	./node_modules/.bin/rollup -c rollup.config.js $< --file $@ --format iife

build/dummy:
	cp index.html puzzle.html main.css build

build:
	mkdir -p $@
