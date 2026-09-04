JAR := target/guildboard-0.0.1-SNAPSHOT.jar
SOURCES := $(shell find src -type f) pom.xml

.PHONY: build test run clean package

build: package

package:
	./mvnw clean package

test:
	./mvnw test

$(JAR): $(SOURCES)
	./mvnw package -q

run: $(JAR)
	java -jar $(JAR)

clean:
	./mvnw clean
