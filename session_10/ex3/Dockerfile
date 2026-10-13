FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build
COPY pom.xml ./
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q package
RUN "$JAVA_HOME/bin/jlink" --add-modules java.base,java.logging,java.sql,java.naming,jdk.httpserver,jdk.crypto.ec --strip-debug --no-man-pages --no-header-files --compress=2 --output /opt/jre

FROM alpine:3.21 AS runtime
RUN apk add --no-cache ca-certificates busybox-extras
WORKDIR /app
COPY --from=builder /opt/jre /opt/java
COPY --from=builder /build/target/hw-backend.jar /app/app.jar
ENV PATH="/opt/java/bin:${PATH}" PORT=3000
EXPOSE 3000
USER 10001:10001
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
