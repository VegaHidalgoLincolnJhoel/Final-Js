# Stage 1: Build the application
FROM maven:3.9.8-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml to download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build package
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the execution JRE image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy compiled jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Render mounts files and injects PORT env variable
EXPOSE 8080

# Execute Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
