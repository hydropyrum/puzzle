JSFILES=TrackballControls
TSFILES=make move slice util twist piece

all: build/twist.js build/index.html

$(patsubst %,js/%.js,$(TSFILES)): $(patsubst %,ts/%.ts,$(TSFILES)) $(patsubst %,ts/%.d.ts,$(JSFILES))
	tsc $^ --target es2015 -outDir js --lib dom,es2015 --moduleResolution node --strict

build/twist.js: js/twist.js $(patsubst %,js/%.js,$(JSFILES)) $(patsubst %,js/%.js,$(TSFILES)) | build 
	./node_modules/.bin/rollup -c rollup.config.js $< --file $@ --format esm

build/%.html: %.html
	cp $^ $@

build:
	mkdir -p $@
