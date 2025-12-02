# ----- СТАДІЯ 1: ЗБИРАННЯ -----
# Використовуємо надійний образ Temurin для збирання
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
# Встановлення залежностей та кешування
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# ----- СТАДІЯ 2: ВИКОНАННЯ -----
# ВИПРАВЛЕННЯ: Використовуємо мінімальний та надійний JRE образ Temurin Alpine
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Копіюємо готовий JAR з першої стадії
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]