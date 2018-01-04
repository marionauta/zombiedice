all: out/main.js out/index.html out/style.css

out/main.js: src/main.ts
	tsc --outDir out --removeComments --strictNullChecks --strictFunctionTypes $^

out/%: src/%
	@mkdir -p out
	cp $^ $@