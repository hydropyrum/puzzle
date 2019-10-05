JSFILES=TrackballControls
TSFILES=make move slice util main piece parse

all: build/main.js build/dummy

$(patsubst %,js/%.js,$(TSFILES)): $(patsubst %,ts/%.ts,$(TSFILES)) $(patsubst %,ts/%.d.ts,$(JSFILES))
	tsc $^ --target es2015 -outDir js --lib dom,es2015 --moduleResolution node --strict

build/main.js: js/main.js $(patsubst %,js/%.js,$(JSFILES)) $(patsubst %,js/%.js,$(TSFILES)) | build 
	./node_modules/.bin/rollup -c rollup.config.js $< --file $@ --format esm

build/dummy:
	cp index.html puzzle.html main.css build

build:
	mkdir -p $@
