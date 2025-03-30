# Makefile

# By default, SAM sets ARTIFACTS_DIR = .aws-sam/build/<LogicalId>
ARTIFACTS_DIR ?= .aws-sam/build/MyLambdaFunction

.PHONY: build-MyLambdaFunction clean-MyLambdaFunction

build-MyLambdaFunction:
	# Make sure the artifacts directory (and subdirs) exist
	mkdir -p $(ARTIFACTS_DIR)/src
	mkdir -p $(ARTIFACTS_DIR)/node_modules

	# Copy the src/ folder into the final artifact
	rsync -av src/ $(ARTIFACTS_DIR)/src

	# Temporaryly copy the package.json and package-lock.json (to install dependencies)
	cp package*.json $(ARTIFACTS_DIR)/

	# Install the dependencies
	npm ci --omit=dev --prefix $(ARTIFACTS_DIR)
	cd $(ARTIFACTS_DIR) && npm prune --omit=dev

	# Remove the package.json and package-lock.json
	rm $(ARTIFACTS_DIR)/package*.json

clean-MyLambdaFunction:
	rm -rf $(ARTIFACTS_DIR)
