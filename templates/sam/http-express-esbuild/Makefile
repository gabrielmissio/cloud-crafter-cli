# Makefile

# By default, SAM sets ARTIFACTS_DIR = .aws-sam/build/<LogicalId>
ARTIFACTS_DIR ?= .aws-sam/build/MyLambdaFunction

.PHONY: build-MyLambdaFunction clean-MyLambdaFunction

build-MyLambdaFunction:
	# Clean and recreate artifact dir
	rm -rf $(ARTIFACTS_DIR)
	mkdir -p $(ARTIFACTS_DIR)

	# Run the build script via NPM
	npm run build

	# Copy built file to artifacts dir
	cp dist/index.js $(ARTIFACTS_DIR)/index.js

clean-MyLambdaFunction:
	rm -rf $(ARTIFACTS_DIR)
